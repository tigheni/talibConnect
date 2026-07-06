# TalibConnect

TalibConnect is a React and Supabase app for sharing, browsing, uploading, and viewing Algerian university exam papers.

## Tech Stack

- React
- Vite
- Tailwind CSS
- Supabase Auth, Database, and Storage
- Cloudflare Workers for the contact email endpoint

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
npm run dev
npm run lint
npm run build
npm run preview
```

For the contact email worker:

```bash
npm run worker:dev
npm run worker:deploy
```

## Environment Variables

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_CONTACT_ENDPOINT=
```

## Supabase Requirements

The app expects:

- Supabase Auth enabled
- An `exams` table
- An `exams` storage bucket for uploaded PDF files
- Row Level Security policies configured for exam uploads and storage access

Recommended `exams` fields:

```txt
id
title
subject
university
year
file_url
file_type
downloads
uploader_name
uploader_id
created_at
```

## Quality Checks

Before committing changes, run:

```bash
npm run lint
npm run build
```
