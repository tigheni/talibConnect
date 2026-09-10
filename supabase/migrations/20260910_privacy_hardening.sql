-- TalibConnect privacy hardening.
-- Run this AFTER 20260910_anonymous_moderated_submissions.sql.

begin;

alter table public.exams
  add column if not exists submission_consent_at timestamptz;

-- Remove the previous RPC signature so anonymous callers cannot bypass the
-- required submission-consent check.
drop function if exists public.submit_anonymous_exam(
  uuid, text, integer, text, text, text, text, text, text, boolean, jsonb
);

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
    or (coalesce(trim(p_teacher_name), '') <> ''
        and coalesce(p_teacher_consent, false) is not true)
  then
    raise exception 'Invalid submission';
  end if;

  if not exists (
    select 1 from storage.objects
    where bucket_id = 'exams' and name = expected_path
  ) then
    raise exception 'Uploaded PDF was not found or did not meet requirements';
  end if;

  insert into public.exams (
    title, year, wilaya, institution, faculty, department, subject,
    file_path, file_type, uploader_id, uploader_name, teacher_name,
    submission_consent_at, teacher_consent, systems, status
  ) values (
    upper(trim(p_title)), p_year, trim(p_wilaya), trim(p_institution),
    trim(p_faculty), nullif(trim(p_department), ''), upper(trim(p_subject)),
    expected_path, 'PDF', null, null,
    coalesce(nullif(trim(p_teacher_name), ''), 'Anonymous'),
    now(), coalesce(p_teacher_consent, false), p_systems, 'pending'
  ) returning uuid into new_exam_id;

  return new_exam_id;
end;
$$;

revoke all on function public.submit_anonymous_exam(
  uuid, text, integer, text, text, text, text, text, text, boolean, boolean, jsonb
) from public;
grant execute on function public.submit_anonymous_exam(
  uuid, text, integer, text, text, text, text, text, text, boolean, boolean, jsonb
) to anon, authenticated;

-- Allows the frontend to remove an object when its database insert fails.
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
  if exists (
    select 1 from public.exams
    where file_path = 'submissions/' || p_upload_id::text || '.pdf'
  ) then
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

-- Rejecting a submission also removes its private PDF immediately.
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
  delete from storage.objects
  where bucket_id = 'exams' and name = target_path;
  return true;
end;
$$;

revoke all on function public.reject_exam(uuid) from public;
grant execute on function public.reject_exam(uuid) to authenticated;

-- Schedule this function daily with Supabase pg_cron or an external admin job.
create or replace function public.purge_old_submissions()
returns integer
language plpgsql
security definer
set search_path = public, storage, pg_temp
as $$
declare
  removed integer := 0;
  old_submission record;
begin
  if not public.is_admin() then raise exception 'Not authorized'; end if;

  for old_submission in
    select uuid, file_path from public.exams
    where status in ('pending', 'rejected')
      and created_at < now() - interval '90 days'
  loop
    delete from storage.objects
    where bucket_id = 'exams' and name = old_submission.file_path;
    delete from public.exams where uuid = old_submission.uuid;
    removed := removed + 1;
  end loop;

  return removed;
end;
$$;

revoke all on function public.purge_old_submissions() from public;
grant execute on function public.purge_old_submissions() to authenticated;

commit;
