# Codex project handoff

## Project

TalibConnect is a React 19/Vite application for Algerian university students to browse, upload, and review past exams. It uses Supabase for authentication, database, and storage.

## Work completed

- `src/hooks/useLocations.jsx`
  - Added protection against stale async location responses.
  - Centralized department availability through `hasNoDepartments`.
- `src/pages/CompleteProfile.jsx`
  - Removed duplicate department query.
  - Renamed `handlSubmit` to `handleSubmit`.
- `src/pages/ExamPage.jsx`
  - Consolidated URL filter updates through `handleFilterChange`.
  - Centralized filter keys and system labels.
  - Simplified active filter creation.
- `src/services/adminExams.js`
  - Added service functions for loading, approving, rejecting, and previewing exams.
- `src/pages/Admin.jsx`
  - Moved Supabase operations into `adminExams.js`.
- `src/services/examUpload.js`
  - Added upload persistence service for storage upload, database insert, and cleanup.
- `src/hooks/useUploadExam.jsx`
  - Now handles validation, authentication, loading, and user-facing results.
- `src/pages/UploadPage.jsx`
  - Removed duplicate form validation.

## Design principles being applied

- Components handle UI and user interaction.
- Hooks handle reusable React state and effects.
- Services handle Supabase/API operations.
- Validators handle business rules.
- Keep one source of truth and remove duplicated logic.
- Protect asynchronous effects from stale responses.

## Verification status

- `npm run build` succeeds.
- `npm run lint` has no errors.
- There is one existing warning in `scripts/import-kuliya.js` for an unused `path` import.

## Recommended next work

1. Add tests for validators and services.
2. Generate Supabase TypeScript types.
3. Split remaining large page components.
4. Improve consistent loading and error states.
5. Remove the unused `path` import warning.

## Learning resources already shared

- https://react.dev/learn
- https://refactoring.guru/refactoring/smells
- https://refactoring.guru/design-patterns
- https://refactoring.com/
- https://github.com/ryanmcdermott/clean-code-javascript
