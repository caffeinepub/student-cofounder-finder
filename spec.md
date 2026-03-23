# Student CoFounder Finder

## Current State
New project. No existing pages or components.

## Requested Changes (Diff)

### Add
- Home page with title, subtitle, and two navigation buttons (Create Profile, View Students)
- Create Profile page with a simple form: Name, Age, Role (dropdown), Skills, Project Idea, Contact Info
- On form submit, save data to localStorage and navigate to View Students page
- View Students page showing all saved profiles as cards
- Each card shows: Name, Role, Skills, Project Idea, Contact Info, and a Contact button that reveals contact info
- Simple navbar to switch between pages
- All data persisted in localStorage (no backend)

### Modify
N/A

### Remove
N/A

## Implementation Plan
- Single-page React app with page state (home, create, view) managed via useState
- localStorage read/write helpers for student profiles
- HomePage component with title, subtitle, two buttons
- CreateProfilePage component with controlled form fields, validates on submit, saves to localStorage, navigates to view page
- ViewStudentsPage component reads from localStorage, renders a grid of StudentCard components
- StudentCard component showing profile fields; Contact button toggles visibility of contact info
- Simple navbar at top with links to navigate between pages
- No backend, no authorization, no complex state management
- Keep components small with clear comments
