# TeamUp

## Current State
- Single `contactInfo` field on StudentProfile (stores email or phone, cleaned)
- StudentCard shows one green button: WhatsApp or Send Email based on contact type
- No College/University field on profiles
- Browse page filters by Role (dropdown) and Skill (search input)
- Login uses `contactInfo` as identifier
- Home page hero has problem hook, title, tagline, CTA buttons, social proof

## Requested Changes (Diff)

### Add
- `phone` and `email` as separate optional fields on `StudentProfile` interface
- `college` as a required string field on `StudentProfile`
- Phone input field in Create Profile form (optional)
- Email input field in Create Profile form (optional)
- College / University input field in Create Profile form (required)
- Validation: at least one of phone or email must be filled before submitting
- 3 action buttons on each StudentCard: Call (blue, tel:), WhatsApp (green, wa.me), Email (neutral, mailto:)
- Each button disabled/hidden if that data is missing for that profile
- Mobile: buttons stack vertically; desktop: row layout
- College filter dropdown on Browse page (alongside existing Role filter and Skill search)
- Tagline line on Home page hero: "Find teammates in your college in 30 seconds." — slightly bold, positioned between the main "TeamUp" title and the existing tagline/description

### Modify
- `StudentProfile` interface: add `phone?: string`, `email?: string`, `college: string`; keep `contactInfo?: string` for backward compat
- Create Profile form: replace single `contactInfo` field with separate Phone, Email, and College fields
- StudentCard contact footer: replace single green button with 3-button layout
- Login logic: must still work — `currentUser` in localStorage is set to cleaned contact; for existing profiles the old `contactInfo` field still works
- Profile creation duplicate detection: check against phone and email individually (not just contactInfo)
- ViewStudentsPage: add College filter dropdown; "No students found" empty state message already exists
- Backward compat for old profiles: if `phone`/`email` missing but `contactInfo` exists, derive them (contains "@" → treat as email, otherwise treat as phone)

### Remove
- Single `contactInfo` input field from Create Profile form (replaced by separate phone + email fields)
- Old single-button contact system on StudentCard (replaced by 3 buttons)

## Implementation Plan
1. Update `StudentProfile` interface in `CreateProfilePage.tsx`: add `phone?`, `email?`, `college` fields; keep `contactInfo?` for backward compat
2. Update Create Profile form: remove `contactInfo` field, add Phone (optional), Email (optional), College (required) fields with validation (at least one of phone/email required)
3. Update profile save logic: store `phone`, `email`, `college` on new profiles; set `contactInfo` to phone or email for login compat
4. Update `StudentCard.tsx`: replace single button with 3 buttons (Call, WhatsApp, Email) — derive phone/email from new fields or fall back to `contactInfo`
5. Update `ViewStudentsPage.tsx`: add College filter dropdown, wire into combined filter logic
6. Update `HomePage.tsx`: add "Find teammates in your college in 30 seconds." line between title and tagline
