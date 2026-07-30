# Pasindu Udana Science Academy UI

A responsive Next.js App Router, TypeScript and Tailwind CSS UI starter inspired by the supplied pastel dashboard reference. The design uses soft lavender, peach, cream and blue surfaces, rounded cards, gentle shadows and compact dashboard widgets.

## Included

- Public tuition website for Pasindu Udana
- Public routes for About, Classes, Free Lessons, Gallery, Timetable, Results, Announcements and Contact
- Student login and complete student portal route structure
- Teacher login and complete teacher portal route structure
- Page metadata, Open Graph placeholder, sitemap and robots
- Firebase-ready configuration and service placeholders
- Loading, error and not-found states
- Responsive public navigation and dashboard layouts
- Realistic mock data only; no real authentication, payments, uploads or Zoom integration

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Main demo routes

- `/`
- `/student/dashboard`
- `/teacher/dashboard`

## Branding changes

Update `lib/site.ts` for the teacher name, phone number, email, class location and public website URL. Replace the emoji teacher placeholders with a real teacher photograph when available.

## Firebase integration

Copy `.env.example` to `.env.local`, add real Firebase environment values and install Firebase when backend development begins. The current project intentionally contains no credentials and no active backend operations.

## Design reference

`design-reference.png` is the original visual reference supplied for the project. It is not used directly by the website.
