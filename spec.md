# TeamUp

## Current State
- React + TypeScript + Firebase Firestore frontend app
- Pages: SplashScreen, LoginPage, HomePage, CreateProfilePage, ViewStudentsPage
- Navbar shows Home, Browse Students, Logout when logged in
- CreateProfilePage blocks logged-in users from creating another profile
- StudentProfile interface: id, name, age, role, branch?, skills, projectIdea, contactInfo?, phone?, email?, college?
- StudentCard shows Call, WhatsApp, Email buttons
- ViewStudentsPage fetches from Firestore, filters by role/college/skill
- College input is a plain text input with no autocomplete
- App.tsx manages Page type: "home" | "create" | "browse" | "login"

## Requested Changes (Diff)

### Add
- "Edit Profile" button in Navbar (visible when logged in)
- Edit mode for CreateProfilePage: pre-fill form with existing data, phone/email read-only, update Firestore doc (not create new)
- `projectDescription` optional field in CreateProfilePage form (textarea, below projectIdea)
- `projectDescription` displayed on StudentCard below projectIdea (only if non-empty)
- College autocomplete: dropdown suggestions from predefined Indian college list while typing; clickable to autofill; still allows manual entry
- `projectDescription?: string` added to StudentProfile interface

### Modify
- App.tsx: add "edit" to Page type, pass edit props to CreateProfilePage, handle navigation from Navbar edit button
- Navbar: add "Edit Profile" button alongside Logout (when logged in); clicking navigates to "edit" page
- CreateProfilePage: accept optional `editMode?: boolean` prop; when true, fetch current user's profile from Firestore, pre-fill all fields, make phone/email read-only, on submit call `updateDoc` to update existing doc; when false, behavior unchanged
- College input in CreateProfilePage: replace plain Input with custom autocomplete component (inline, no library) that shows matching suggestions from predefined list
- StudentProfile interface: add `projectDescription?: string`
- StudentCard: render `projectDescription` below projectIdea if present

### Remove
- Nothing removed

## Implementation Plan
1. Update `StudentProfile` interface in CreateProfilePage.tsx to add `projectDescription?: string`
2. Add predefined Indian college list (AP colleges + major national universities) as a constant
3. Build inline CollegeAutocomplete component (no external library): input + dropdown suggestion list, keyboard-accessible, closes on outside click
4. Add `projectDescription` textarea field to CreateProfilePage form (optional, stored in Firestore)
5. Add `editMode?: boolean` and `currentUser?: string | null` props to CreateProfilePage
6. In edit mode: on mount, query Firestore for document where phone/email matches currentUser, pre-fill form state; phone/email inputs rendered as read-only
7. On submit in edit mode: use `updateDoc` on the found document ID instead of `addDoc`; skip duplicate contact checks; redirect to browse
8. Update App.tsx: add "edit" to Page type; pass `currentUser` and `onNavigate` to Navbar; add edit page render block
9. Update Navbar: add "Edit Profile" button (purple/secondary style) between Browse Students and Logout; calls `onNavigate("edit")`; needs `onNavigate` prop
10. Update StudentCard: show `projectDescription` section below projectIdea if it exists
11. Normalize college value (lowercase + trim) before saving in both create and edit modes
12. College filter in ViewStudentsPage already uses lowercase includes -- no changes needed there
