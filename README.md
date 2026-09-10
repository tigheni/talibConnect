# TalibConnect

TalibConnect is a public archive of Algerian university exam papers. Visitors can browse, search, filter, preview, download approved PDFs, and submit a PDF for moderation without creating an account. Supabase authentication is retained exclusively for administrators.

## Public and admin access

| Route | Access |
| --- | --- |
| `/`, `/exams`, `/exam/:id`, `/contact`, `/upload` | Public |
| `/admin` | Authenticated administrator only |
| `/admin/login`, `/admin/forgot-password`, `/admin/reset-password` | Administrator authentication only |

Every public submission is uploaded as a private `submissions/<uuid>.pdf` object and then passed to `submit_anonymous_exam`. That RPC validates the metadata and object, inserts a record with server-selected `status = 'pending'`, and records no uploader ID or name. The client never sends a status, file path, or uploader identity.

An administrator changes `pending` to `approved` or `rejected`. Only approved rows are readable publicly, and only an approved row's matching private object can receive a signed download URL. The `exams` bucket must remain private.

## Required Supabase migration

Before deploying this frontend, apply [20260910_anonymous_moderated_submissions.sql](supabase/migrations/20260910_anonymous_moderated_submissions.sql). It replaces existing policies on `public.exams`, adds the restricted `exams`-bucket Storage policies, creates/replaces `is_admin`, `submit_anonymous_exam`, and the constrained `increment_download`, and retains tables/data.

The migration is deliberately not executed by the frontend. Review it against your production schema, especially legacy policies and ownership, then apply through the Supabase migration workflow. In particular, remove or narrow any existing broad `storage.objects` policy before applying it: Storage policies span all buckets and cannot be safely deleted by a bucket-specific migration. It retains `profiles` because it is still the source of administrator roles, and retains location tables because the public form reads them. Ensure their policies are read-only for `anon`/`authenticated`; do not grant public writes.

Disable public sign-up in Supabase Auth and provision administrator accounts through a controlled administrative process. `handle_new_user`, `prevent_role_change`, and `set_exam_uploader_info` are not removed automatically because they may be production triggers; review whether they are still needed and confirm that none assigns a client-controlled uploader identity or role to anonymous submissions. `get_user_count()` is no longer called by the frontend.

## File validation

The browser requires a `.pdf`, the PDF MIME type, a `%PDF-` signature, and a maximum size of 10 MB. Storage policies independently restrict anonymous objects to a UUID path, PDF MIME type, and the same size limit; the RPC verifies the object again before creating an exam record. Content-signature checks are helpful but not malware scanning—administrators should inspect each submission before approval.

## Local setup

```bash
npm install
cp .env.example .env.local
```

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_CONTACT_ENDPOINT=https://your-contact-worker.example.workers.dev
```

Never expose a Supabase service-role key in the frontend.

```bash
npm run dev
npm run build
npm run lint
```

## Operational notes

Anonymous upload permissions are intentionally narrow, but they do not stop spam or storage consumption. Add a Cloudflare WAF/rate-limit rule for the Supabase upload/RPC endpoints (or move submissions behind a rate-limited Worker) before high-traffic deployment. Moderators remain responsible for malware, copyright, inappropriate content, and retention decisions.

The contact Worker requires `CORS_ORIGIN` to contain the exact production site origin. Configure a Cloudflare KV namespace binding named `RATE_LIMITER` to enforce five contact requests per IP per 15 minutes; also add a WAF rule for the Supabase anonymous upload and RPC endpoints. The frontend requires explicit privacy consent for contact messages and submissions, and the database RPC enforces submission consent server-side.

Apply a scheduled administrator job for `select public.purge_old_submissions();` at least daily. Rejected files are deleted immediately through `reject_exam`; pending and rejected records older than 90 days are removed by the purge job.

Before production launch, replace the generic operator description in the privacy policy with the legal name and contact address of the data controller, confirm the applicable Algerian declaration/authorization requirements with the competent data-protection authority or counsel, and document provider contracts, international transfers, and the actual retention schedule. These are operational/legal steps that cannot be completed by frontend code.

Supabase, Cloudflare, and hosting/error logs may still process technical metadata such as IP addresses and request logs. This architecture minimizes app-collected visitor data; it does not make the service free of personal-data processing.
