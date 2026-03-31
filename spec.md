# TeamUp – Firebase Firestore Migration

## Current State
All student profiles are stored in `localStorage` under the key `"students"`. Login checks localStorage for matching contacts. `currentUser` (phone/email session token) is stored in localStorage. The app is single-device: profiles created on one device are not visible on others.

## Requested Changes (Diff)

### Add
- `firebase` npm package to `src/frontend/package.json`
- `src/frontend/src/firebase.ts` — initializes Firebase app and exports Firestore `db` instance
- Loading state in `ViewStudentsPage` while fetching profiles from Firestore
- Async loading/saving states in `CreateProfilePage` while checking duplicates and writing to Firestore

### Modify
- `CreateProfilePage.tsx` — replace `localStorage.getItem/setItem('students')` with async Firestore reads/writes (`addDoc` to `users` collection); show loading indicator on submit
- `LoginPage.tsx` — replace `localStorage.getItem('students')` with async Firestore query (`getDocs` on `users` collection) to find matching contact
- `ViewStudentsPage.tsx` — replace `localStorage.getItem('students')` with `getDocs` from Firestore `users` collection; add loading spinner and error state
- `src/frontend/package.json` — add `firebase` dependency

### Remove
- All `localStorage.getItem('students')` and `localStorage.setItem('students', ...)` calls
- No migration of existing localStorage data (fresh start with Firestore)

## Implementation Plan
1. Add `firebase` to `package.json` dependencies
2. Create `firebase.ts` with the provided config; export `db` (Firestore instance)
3. Update `ViewStudentsPage`: on mount, fetch all docs from `users` collection; show spinner during load, render cards after
4. Update `LoginPage`: on login click, query Firestore `users` collection for matching phone/email/contactInfo; async with loading state
5. Update `CreateProfilePage`: on submit, async query Firestore for duplicate phone/email, then `addDoc` to `users` collection; show loading during async ops
6. Keep `localStorage.getItem/setItem/removeItem('currentUser')` untouched in `App.tsx`, `LoginPage`, `CreateProfilePage` — session only
7. Run install, typecheck, lint, build
