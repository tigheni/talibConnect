-- Safely increment one exam's download counter.

create or replace function public.increment_download(p_exam_uuid uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_download_count integer;
begin
  update public.exams
  set downloads = coalesce(downloads, 0) + 1
  where uuid = p_exam_uuid
  returning downloads into new_download_count;

  return new_download_count;
end;
$$;

grant execute on function public.increment_download(uuid) to anon, authenticated;
