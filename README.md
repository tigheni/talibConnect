# TalibConnect

TalibConnect is a platform for Algerian university students to share, browse, and download past exam papers. Built with React and Supabase.

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Backend & Database**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Cloudflare Pages
- **Email Endpoint**: Cloudflare Workers

## Features

- 🔐 User authentication (Sign up / Login)
- 📄 Upload exam papers (PDF)
- 🔍 Browse and search exams
- 🏛️ Filter by institution, subject, education system, and year of study
- 📥 Download exams (with download counter)
- 👨‍🏫 Teacher attribution and consent
- 👤 User profile completion
- 🎓 Multi-system support (LMD, Engineering, Medical)
- 📱 Mobile responsive

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Fill in the required values in `.env.local`.

Run the development server:

```bash
npm run dev
```

## Available Scripts

```bash
npm run dev         # Start development server
npm run lint        # Run ESLint
npm run build       # Build for production
npm run preview     # Preview production build
```

For the contact email worker:

```bash
npm run worker:dev      # Run worker locally
npm run worker:deploy   # Deploy worker to Cloudflare
```

## Environment Variables

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_CONTACT_ENDPOINT=
```

## Supabase Schema

### Table: `exams`

| Column            | Type      | Description                          |
| ----------------- | --------- | ------------------------------------ |
| `uuid`            | UUID (PK) | Unique exam identifier               |
| `title`           | TEXT      | Exam title                           |
| `subject`         | TEXT      | Subject name                         |
| `year`            | INTEGER   | Calendar year (e.g., 2024)           |
| `systems`         | JSONB     | Array of `{ system, years: [] }`     |
| `wilaya`          | TEXT      | Wilaya/State                         |
| `institution`     | TEXT      | University name                      |
| `faculty`         | TEXT      | Faculty name                         |
| `department`      | TEXT      | Department name                      |
| `file_url`        | TEXT      | Supabase storage URL                 |
| `file_type`       | TEXT      | e.g., "PDF"                          |
| `downloads`       | INTEGER   | Download counter                     |
| `uploader_id`     | UUID      | User ID who uploaded                 |
| `uploader_name`   | TEXT      | Display name of uploader             |
| `uploader_role`   | TEXT      | 'student' or 'admin'                 |
| `teacher_name`    | TEXT      | Name of teacher who created the exam |
| `teacher_consent` | BOOLEAN   | Permission granted by teacher        |
| `status`          | TEXT      | 'pending' or 'approved'              |
| `created_at`      | TIMESTAMP | Upload date                          |

### Table: `profiles`

| Column        | Type                        | Description            |
| ------------- | --------------------------- | ---------------------- |
| `id`          | UUID (PK, FK to auth.users) | User ID                |
| `username`    | TEXT                        | Display name           |
| `email`       | TEXT                        | User email             |
| `role`        | TEXT                        | 'student' or 'teacher' |
| `wilaya`      | TEXT                        | Wilaya/State           |
| `institution` | TEXT                        | University name        |
| `faculty`     | TEXT                        | Faculty name           |
| `department`  | TEXT                        | Department name        |
| `created_at`  | TIMESTAMP                   | Profile creation date  |
| `updated_at`  | TIMESTAMP                   | Last update date       |

### Table: `wilayas`

| Column    | Type          |
| --------- | ------------- |
| `id`      | SMALLINT (PK) |
| `code`    | VARCHAR       |
| `name_ar` | TEXT          |
| `name_fr` | TEXT          |
| `name_en` | TEXT          |

### Table: `institutions`

| Column      | Type          |
| ----------- | ------------- |
| `id`        | BIGINT (PK)   |
| `slug`      | TEXT          |
| `name_ar`   | TEXT          |
| `name_fr`   | TEXT          |
| `name_en`   | TEXT          |
| `type`      | TEXT          |
| `wilaya_id` | SMALLINT (FK) |

### Table: `faculties`

| Column           | Type        |
| ---------------- | ----------- |
| `id`             | BIGINT (PK) |
| `slug`           | TEXT        |
| `name_ar`        | TEXT        |
| `name_fr`        | TEXT        |
| `name_en`        | TEXT        |
| `type`           | TEXT        |
| `institution_id` | BIGINT (FK) |

### Table: `departments`

| Column       | Type        |
| ------------ | ----------- |
| `id`         | BIGINT (PK) |
| `slug`       | TEXT        |
| `name_ar`    | TEXT        |
| `name_fr`    | TEXT        |
| `name_en`    | TEXT        |
| `type`       | TEXT        |
| `faculty_id` | BIGINT (FK) |

### Auth Trigger

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    username,
    email
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
```

## Supabase Requirements

- Supabase Auth enabled
- `exams` table (see schema above)
- `profiles` table (see schema above)
- `exams` storage bucket for PDF files
- RLS policies for exam uploads and storage access

## RLS Policies Example

```sql
-- Allow authenticated users to insert exams
CREATE POLICY "Enable insert for authenticated users"
ON exams
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow public read access to approved exams
CREATE POLICY "Allow public read access"
ON exams
FOR SELECT
TO anon
USING (status = 'approved');
```

## Quality Checks

Before committing changes:

```bash
npm run lint
npm run build
```

## Deployment

The app is deployed on **Cloudflare Pages**.

```bash
# Build
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name=talibconnect
```

---

Made with ❤️ for Algerian students.
