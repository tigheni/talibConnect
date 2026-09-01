# TalibConnect

TalibConnect is a React web application for Algerian university students to discover, upload, and download past exam papers.

## What the app provides

- Account registration, login, logout, and password reset through Supabase Auth.
- Profile completion with role, study system, year, and academic location.
- Browsing approved exams with search, filters, and pagination.
- PDF uploads for authenticated users.
- An admin page for approving or rejecting pending uploads.
- Signed PDF downloads and download-count tracking.
- A contact form connected to a Cloudflare Worker email endpoint.
- Responsive layouts for desktop and mobile screens.

## Technology

- React 19
- Vite
- React Router
- Tailwind CSS
- Supabase Auth, Postgres, and Storage
- Cloudflare Pages for the frontend
- Cloudflare Workers and Cloudflare Email Workers for contact messages

## Requirements

- Node.js and npm
- A Supabase project
- A Supabase Storage bucket named `exams`
- A deployed contact-email Worker if the contact form is enabled

## Local setup

Install the dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Set the values in `.env.local`:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_CONTACT_ENDPOINT=https://your-contact-worker.example.workers.dev
```

Only the Supabase URL and anon key are used by the frontend client. Never put a Supabase service-role key in a `VITE_` variable or expose it in frontend code.

Start the development server:

```bash
npm run dev
```

## Available commands

```bash
npm run dev       # Start Vite and open the development site
npm run build     # Create the production build in dist/
npm run preview   # Serve the production build locally
npm run lint      # Run ESLint for the repository
```

The package also contains these Worker commands:

```bash
npm run worker:dev
npm run worker:deploy
```

The commands currently refer to `wrangler.jsonc`. The checked-in Worker configuration is named `.wrangler.jsonc`, so rename or update the script/config path before using these commands.

## Application routes

| Route | Purpose | Access |
| --- | --- | --- |
| `/` | Home page | Public |
| `/exams` | Browse approved exams | Public |
| `/exam/:id` | View an exam PDF | Public page; downloading requires login |
| `/contact` | Contact form | Public |
| `/login` | Login | Public |
| `/register` | Registration | Public |
| `/forgot-password` | Request a password reset | Public |
| `/reset-password` | Set a new password | Auth flow |
| `/complete-profile` | Complete academic profile | Auth flow |
| `/upload` | Upload an exam | Authenticated users |
| `/admin` | Review pending exams | Admin users |
| `/privacy` | Privacy page | Public |
| `/terms` | Terms page | Public |

## Supabase objects used by the app

The repository does not contain Supabase migrations, so the exact database types and RLS policies must be maintained in the Supabase project. The frontend expects these objects and fields.

### `exams` table

The app reads or writes these fields:

`uuid`, `title`, `subject`, `year`, `systems`, `wilaya`, `institution`, `faculty`, `department`, `file_path`, `file_type`, `downloads`, `uploader_id`, `uploader_name`, `teacher_name`, `teacher_consent`, `status`, and `created_at`.

New uploads use `file_path` to store the path of the PDF in the `exams` Storage bucket. The upload code does not use a `file_url` column.

The application expects approved exams to have `status = 'approved'`. New uploads are expected to start as `status = 'pending'`, usually through the database default. Admins change pending records to `approved` or remove rejected records.

### `profiles` table

The app uses these profile fields:

`id`, `username`, `email`, `role`, `study_system`, `year_of_study`, `wilaya`, `institution`, `faculty`, `department`, `profile_completed`, `created_at`, and `updated_at`.

The admin check reads the user's `role` and treats `admin` as the administrator role. Profile completion allows `student` and `teacher` roles.

### Location tables

The profile form reads these tables:

- `wilayas`: `id`, `name_en`
- `institutions`: `id`, `name_en`, `wilaya_id`
- `faculties`: `id`, `name_en`, `institution_id`
- `departments`: `id`, `name_en`, `faculty_id`

### Storage and RPC functions

- Storage bucket: `exams`
- RPC function: `increment_download(p_exam_uuid)`
- RPC function: `get_user_count()`

Configure authentication, Storage permissions, table permissions, and RLS policies in Supabase according to the access rules required by your project. Do not copy policies from this README without reviewing them for your database.

## Upload and download flow

1. An authenticated user selects a PDF and completes the upload form.
2. The PDF is uploaded to the `exams` bucket under a user-specific path.
3. An `exams` row is created with a pending status.
4. An admin reviews the pending row.
5. Approved exams appear in the public exam list.
6. A signed URL is created only after the user is authenticated.
7. The file is downloaded and `increment_download` is called.

## Contact Worker

The frontend sends a JSON `POST` request to `VITE_CONTACT_ENDPOINT` with:

```json
{
  "name": "Example User",
  "email": "user@example.com",
  "message": "Hello"
}
```

The Worker is implemented in `worker/contact-email.js`. Its configuration expects `CONTACT_EMAIL`, `TO_EMAIL`, `CONTACT_FROM`, and `CORS_ORIGIN`. Keep email credentials and Worker configuration out of frontend environment variables.

## Frontend deployment

Build the site:

```bash
npm run build
```

Deploy the generated `dist/` directory through Cloudflare Pages. If using Wrangler directly:

```bash
npx wrangler pages deploy dist --project-name=talibconnect
```

The `public/_headers` file contains Cloudflare Pages response headers and must be included in version control so it is available during deployment.

## Verification before committing

```bash
npm run build
npx eslint src
```

The full `npm run lint` command also checks repository scripts. Some data-import scripts are intentionally outside the frontend production flow.

## Project structure

```text
src/
  components/       Reusable layout, form, exam, and UI components
  context/          Authentication and login-modal state
  hooks/            Data fetching and upload/download hooks
  layouts/          Shared authentication layout
  pages/            Routed application pages
  services/         Authentication and profile helpers
  validators/       Form validation helpers
  lib/supabase.js   Supabase client configuration
worker/             Contact email Worker
public/             Static deployment files and Cloudflare headers
```

## Security notes

- Frontend environment variables are public after Vite builds the application.
- Use only the Supabase anon key in the frontend.
- Keep service-role keys and email secrets on trusted servers or Workers.
- Enforce authorization with Supabase Auth and RLS; hiding a route in React is not sufficient protection.
- Review Storage policies before allowing uploads, signed URLs, or file deletion.
