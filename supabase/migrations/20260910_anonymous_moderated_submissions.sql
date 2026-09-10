-- TalibConnect: public reads + anonymous moderated submissions.
-- Review and apply through Supabase migrations. This does not delete users,
-- profiles, location data, or existing exam records.
--
-- This migration intentionally replaces policies on public.exams. Storage
-- policies are shared across every bucket, so it does not blindly delete them.
-- Remove or narrow any pre-existing policy that grants broad storage.objects
-- access before applying the three exams-bucket policies below.

begin;

alter table public.exams enable row level security;
alter table public.exams alter column uploader_id drop not null;

-- Anonymous submissions do not retain an uploader identity. Existing values
-- are preserved; new anonymous records use NULL.
alter table public.exams alter column uploader_name drop not null;
alter table public.exams add column if not exists submission_consent_at timestamptz;

-- Existing deployments may have a trigger that assumes every exam has a
-- profile. Anonymous submissions intentionally have no uploader_id.
create or replace function public.set_exam_uploader_info()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.uploader_id is null then
    new.uploader_name := 'Anonymous';
    new.uploader_role := null;
    return new;
  end if;

  select p.username, p.role
  into new.uploader_name, new.uploader_role
  from public.profiles p
  where p.id = new.uploader_id;

  if not found then
    raise exception 'Uploader profile not found';
  end if;

  return new;
end;
$$;

-- Remove unknown legacy policies before creating the limited policy set below.
do $$
declare policy_name text;
begin
  for policy_name in
    select policyname from pg_policies where schemaname = 'public' and tablename = 'exams'
  loop
    execute format('drop policy if exists %I on public.exams', policy_name);
  end loop;
end $$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Public rows never include pending/rejected resources. Admins can inspect all.
create policy "public reads approved exams"
on public.exams for select to anon, authenticated
using (status = 'approved');

create policy "admins manage exams"
on public.exams for all to authenticated
using (public.is_admin())
with check (public.is_admin());

-- The browser cannot insert/update/delete exam rows. The only anonymous write
-- is the RPC below, which fixes all privileged values server-side.
revoke insert, update, delete on public.exams from anon;
grant select on public.exams to anon;
-- Authenticated admin sessions need DML privileges for the admin-only RLS
-- policy. Non-admin authenticated users still fail that policy.
grant select, update, delete on public.exams to authenticated;

-- Remove the previous signature so callers cannot bypass the consent check
-- after this migration has been applied over an earlier deployment.
drop function if exists public.submit_anonymous_exam(uuid, text, integer, text, text, text, text, text, text, boolean, jsonb);

create or replace function public.submit_anonymous_exam(
  p_upload_id uuid,
  p_title text,
  p_year integer,
  p_wilaya text,
  p_institution text,
  p_faculty text,
  p_department text,
  p_subject text,
  p_teacher_name text,
  p_teacher_consent boolean,
  p_submission_consent boolean,
  p_systems jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public, storage, pg_temp
as $$
declare
  new_exam_id uuid;
  expected_path text := 'submissions/' || p_upload_id::text || '.pdf';
begin
  if p_upload_id is null
    or p_submission_consent is not true
    or length(trim(coalesce(p_title, ''))) < 3
    or length(trim(coalesce(p_subject, ''))) = 0
    or length(trim(coalesce(p_wilaya, ''))) = 0
    or length(trim(coalesce(p_institution, ''))) = 0
    or length(trim(coalesce(p_faculty, ''))) = 0
    or p_year not between 2000 and extract(year from current_date)::integer + 1
    or jsonb_typeof(coalesce(p_systems, 'null'::jsonb)) <> 'array'
    or jsonb_array_length(p_systems) = 0
    or (coalesce(trim(p_teacher_name), '') <> '' and coalesce(p_teacher_consent, false) is not true)
  then
    raise exception 'Invalid submission';
  end if;

  -- The object must be exactly the one an anonymous policy permits. The
  -- bucket itself enforces PDF type and the 10 MB limit.
  if not exists (
    select 1 from storage.objects
    where bucket_id = 'exams'
      and name = expected_path
  ) then
    raise exception 'Uploaded PDF was not found or did not meet requirements';
  end if;

  insert into public.exams (
    title, year, wilaya, institution, faculty, department, subject,
    file_path, file_type, uploader_id, uploader_name, teacher_name,
    submission_consent_at,
    teacher_consent, systems, status
  ) values (
    upper(trim(p_title)), p_year, trim(p_wilaya), trim(p_institution),
    trim(p_faculty), nullif(trim(p_department), ''), upper(trim(p_subject)),
    expected_path, 'PDF', null, null, coalesce(nullif(trim(p_teacher_name), ''), 'Anonymous'),
    now(),
    coalesce(p_teacher_consent, false), p_systems, 'pending'
  ) returning uuid into new_exam_id;

  return new_exam_id;
end;
$$;

revoke all on function public.submit_anonymous_exam(uuid, text, integer, text, text, text, text, text, text, boolean, boolean, jsonb) from public;
grant execute on function public.submit_anonymous_exam(uuid, text, integer, text, text, text, text, text, text, boolean, boolean, jsonb) to anon, authenticated;

-- The browser upload and database insert are separate operations. This narrow
-- cleanup RPC removes only a recent, unreferenced submission object, allowing
-- the client to clean up when the insert fails without granting bucket-wide
-- delete access to anonymous users.
create or replace function public.delete_unclaimed_upload(p_upload_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public, storage, pg_temp
as $$
declare
  deleted_count integer := 0;
begin
  if p_upload_id is null then return false; end if;
  if exists (select 1 from public.exams where file_path = 'submissions/' || p_upload_id::text || '.pdf') then
    return false;
  end if;
  delete from storage.objects
  where bucket_id = 'exams'
    and name = 'submissions/' || p_upload_id::text || '.pdf'
    and created_at > now() - interval '1 hour';
  get diagnostics deleted_count = row_count;
  return deleted_count > 0;
end;
$$;

revoke all on function public.delete_unclaimed_upload(uuid) from public;
grant execute on function public.delete_unclaimed_upload(uuid) to anon, authenticated;

-- Rejected files contain no public value and should not remain in private
-- storage indefinitely. Only an administrator can invoke this operation.
create or replace function public.reject_exam(p_exam_uuid uuid)
returns boolean
language plpgsql
security definer
set search_path = public, storage, pg_temp
as $$
declare
  target_path text;
begin
  if not public.is_admin() then raise exception 'Not authorized'; end if;
  select file_path into target_path from public.exams where uuid = p_exam_uuid;
  if target_path is null then return false; end if;
  update public.exams set status = 'rejected' where uuid = p_exam_uuid;
  delete from storage.objects where bucket_id = 'exams' and name = target_path;
  return true;
end;
$$;

revoke all on function public.reject_exam(uuid) from public;
grant execute on function public.reject_exam(uuid) to authenticated;

-- Schedule this function with Supabase pg_cron or an external admin job.
create or replace function public.purge_old_submissions()
returns integer
language plpgsql
security definer
set search_path = public, storage, pg_temp
as $$
declare
  removed integer := 0;
  record_to_remove record;
begin
  if not public.is_admin() then raise exception 'Not authorized'; end if;
  for record_to_remove in
    select uuid, file_path from public.exams
    where status in ('pending', 'rejected')
      and created_at < now() - interval '90 days'
  loop
    delete from storage.objects where bucket_id = 'exams' and name = record_to_remove.file_path;
    delete from public.exams where uuid = record_to_remove.uuid;
    removed := removed + 1;
  end loop;
  return removed;
end;
$$;

revoke all on function public.purge_old_submissions() from public;
grant execute on function public.purge_old_submissions() to authenticated;

-- Download counters are not a generic write primitive: only approved rows can
-- be incremented and the caller cannot select a column or arbitrary value.
create or replace function public.increment_download(p_exam_uuid uuid)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  new_download_count integer;
begin
  update public.exams
  set downloads = coalesce(downloads, 0) + 1
  where uuid = p_exam_uuid and status = 'approved'
  returning downloads into new_download_count;

  if not found then
    return null;
  end if;

  return new_download_count;
end;
$$;

revoke all on function public.increment_download(uuid) from public;
grant execute on function public.increment_download(uuid) to anon, authenticated;

-- The bucket must stay private. Signed URLs require SELECT on the individual
-- object, which is granted only when an approved exam references that object.
update storage.buckets
set public = false,
    file_size_limit = 10485760,
    allowed_mime_types = array['application/pdf']::text[]
where id = 'exams';

create policy "public downloads approved exam files"
on storage.objects for select to anon, authenticated
using (
  bucket_id = 'exams'
  and exists (
    select 1 from public.exams
    where file_path = storage.objects.name and status = 'approved'
  )
);

create policy "anonymous creates constrained submission PDFs"
on storage.objects for insert to anon, authenticated
with check (
  bucket_id = 'exams'
  and name ~ '^submissions/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[.]pdf$'
);

create policy "admins manage exam files"
on storage.objects for all to authenticated
using (bucket_id = 'exams' and public.is_admin())
with check (bucket_id = 'exams' and public.is_admin());

-- Location tables are intentionally retained. Public forms need only SELECT;
-- verify existing policies permit read-only access and no anon writes:
-- select tablename, policyname, cmd from pg_policies
-- where schemaname = 'public' and tablename in
-- ('profiles','wilayas','institutions','faculties','departments');
-- Public registration/profile flows are removed from the frontend, but admin
-- profiles remain the authorization source. Do not drop profiles or auth users.

commit;
