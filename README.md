# TalibConnect

TalibConnect is a public, searchable archive of Algerian university exam papers. Students can browse approved papers, filter results by academic context, preview PDFs, download resources, and submit new papers for moderation—without creating an account.

The project is a React/Vite frontend backed by Supabase, with a small Cloudflare Worker for contact-form email delivery.

## What it does

- Browse a paginated archive of approved exam papers.
- Search and filter by title, subject, institution, wilaya, faculty, department, academic year, and education system.
- Preview PDFs in the browser and download approved files with signed URLs.
- Submit a PDF anonymously for administrator review.
- Provide administrator authentication and a moderation dashboard.
- Send privacy-consented contact messages through a CORS-protected email Worker.
- Serve responsive pages with SEO metadata, privacy terms, and accessible loading/error states.

## Application routes

| Route | Purpose | Access |
| --- | --- | --- |
| `/` | Landing page and featured exams | Public |
| `/exams` | Searchable exam archive | Public |
| `/exam/:id` | PDF preview and download | Public for approved exams |
| `/upload` | Anonymous exam submission | Public |
| `/contact` | Contact form | Public |
| `/privacy` | Privacy notice | Public |
| `/terms` | Terms of use | Public |
| `/admin/login` | Administrator sign-in | Admin authentication |
| `/admin/forgot-password` | Password reset request | Admin authentication |
| `/admin/reset-password` | Set a new administrator password | Admin authentication |
| `/admin` | Review pending submissions | Authenticated administrators |

## Architecture

```text
React + Vite + Tailwind CSS
        |
        +--> Supabase Auth       administrator sessions
        +--> Supabase Database   exams, profiles, locations, moderation RPCs
        +--> Supabase Storage    private PDF objects and signed URLs
        +--> Cloudflare Worker   contact-form validation and email delivery
```

The frontend uses the Supabase anon key only. Public submissions are uploaded to `submissions/<uuid>.pdf`, then persisted through the `submit_anonymous_exam` RPC as `pending`. Administrators approve or reject submissions. Only approved database rows and their matching private Storage objects are exposed to visitors.

## Tech stack

- React 19 and React Router 7
- Vite 8
- Tailwind CSS 4
- Supabase Auth, Postgres, RPCs, and private Storage
- Cloudflare Workers and Email Routing
- `react-pdf` for in-browser PDF previews
- ESLint 10

## Getting started

### Prerequisites

- Node.js 20 or newer
- npm
- A Supabase project configured with the schema and RPCs described below
- Wrangler only if you want to run or deploy the contact Worker

### Install and configure

```bash
git clone <repository-url>
cd talibConnect
npm install
cp .env.example .env.local
```

Set the frontend variables in `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_CONTACT_ENDPOINT=https://your-contact-worker.example.workers.dev
```

Never put a Supabase service-role key in `.env.local` or any `VITE_*` variable. Vite exposes `VITE_*` values to the browser.

### Run the frontend

```bash
npm run dev
```

The development server opens at `http://localhost:5173`.

Useful commands:

```bash
npm run build             # production build
npm run preview           # preview the production build locally
npm run lint              # ESLint
BUNDLE_ANALYZE=true npm run build  # generate dist/stats.html
```

## Supabase setup

The frontend expects the following application pieces to exist in Supabase:

- `exams`, `profiles`, and location/reference tables used by the public form.
- An `exams` Storage bucket that remains private.
- An `is_admin()` RPC that determines administrator access from the authenticated session.
- A `submit_anonymous_exam(...)` RPC that validates metadata and consent, creates a `pending` row, and never trusts a client-supplied status or uploader identity.
- `delete_unclaimed_upload(...)` for cleanup when persistence fails.
- `reject_exam(p_exam_uuid)` for moderator rejection and object cleanup.
- `increment_download(p_exam_uuid)` for approved-download counters.
- Row-level security and Storage policies that limit public reads to approved exams and prevent access to pending/rejected files.

Apply and review database changes through your normal Supabase migration workflow. This repository does not execute schema changes from the frontend. Check existing policies before deployment: Storage policies apply across buckets, so broad legacy policies can accidentally expose submissions. Disable public Auth sign-up and provision administrator accounts through a controlled process.

### Submission safeguards

The browser validates a PDF extension, MIME type, `%PDF-` signature, and a maximum size of 10 MB. Storage policies and the submission RPC must enforce those constraints again server-side. Signature checks are not malware scanning; moderators should inspect every submission before approval.

Anonymous uploads can still be abused for spam or storage consumption. Before a public launch, add rate limiting/WAF protection for the Supabase upload and submission RPC endpoints, and define a retention process for rejected and abandoned files.

## Contact Worker

The Worker in `worker/contact-email.js` validates contact payloads, enforces an exact-origin CORS allowlist, supports `OPTIONS` preflight requests, and sends email through Cloudflare Email Workers. Configure its Wrangler variables and bindings before deployment:

- `TO_EMAIL` — destination inbox.
- `CONTACT_FROM` — verified sender address.
- `CORS_ORIGIN` — comma-separated production and local origins.
- `CONTACT_EMAIL` — the `send_email` binding defined in Wrangler.
- `RATE_LIMITER` — optional KV binding; when present, it limits requests to five per IP per 15 minutes.

Run it locally or deploy it with:

```bash
npm run worker:dev
npm run worker:deploy
```

Update `VITE_CONTACT_ENDPOINT` with the deployed Worker URL. Keep the Worker’s production CORS origin exact; do not use `*` for a form that accepts personal information.

## Production checklist

- Apply and review Supabase schema, RLS, RPC, and private Storage policies.
- Disable public Supabase sign-up and verify administrator roles server-side.
- Configure the Worker’s email binding, verified sender, destination, CORS origins, and KV rate limiter.
- Add WAF/rate limits for anonymous upload and submission traffic.
- Configure SPA fallback/rewrite rules for client-side routes.
- Confirm the legal data-controller identity, privacy contact, retention schedule, provider contracts, and international-transfer requirements.
- Schedule regular cleanup of abandoned, rejected, and expired submissions.
- Inspect submitted files for malware, copyright issues, and inappropriate content before approval.

## Project layout

```text
src/
├── components/       shared layout, navigation, forms, and exam UI
├── context/           administrator authentication state
├── hooks/             data fetching, filters, uploads, and downloads
├── pages/             routed application screens
├── services/          Supabase and application-service operations
├── validators/        form and password validation
└── lib/supabase.js    browser Supabase client
worker/
└── contact-email.js   Cloudflare contact-form Worker
public/
└── _headers           hosting security headers
```

## Privacy and security

Visitors do not need accounts to use the archive or submit a paper. Submission files stay private until moderation, and the client never chooses the submission status, Storage path, or uploader identity. Contact messages require explicit privacy consent and are sent through the Worker rather than directly from the browser.

This design reduces application-collected personal data but does not eliminate processing by Supabase, Cloudflare, the hosting provider, or operational logs. Keep the published privacy and terms pages aligned with the actual deployment and applicable Algerian requirements.

## License

No open-source license is currently declared. Treat the repository as all-rights-reserved unless the project owner adds a license.
