# TakeUForward SWE Intern Assignment — Calendar Component

A feature-rich interactive calendar built with React + Vite + Tailwind CSS v4. The main deliverable is the `TUFCalendar` component — a wall-calendar-style UI with date range selection, per-range notes, badge categorisation, Indian public holidays, month animations, dark mode, and a skeleton loader.

---

## What I built

The calendar is split into four focused components:

**`TUFCalendar`** — the root. Owns all state (current month, selected range, notes, hidden categories) and persists everything to `localStorage` so nothing resets on refresh. Also handles month navigation animations and touch swipe.

**`HeroSection`** — the top banner. Each month gets its own photo, gradient fallback, and tag chips. Slides in/out in sync with the calendar grid when you navigate months.

**`CalendarGrid`** — the actual grid. Handles date rendering, range selection highlight, hover preview, badge dots, holiday colouring, keyboard navigation (arrow keys), and a month/year picker dropdown. The seasonal emoji layer in the background was a fun touch — subtle enough to not be distracting.

**`NotesPanel`** — the right sidebar. Shows a textarea + badge toggles for the selected range, and a scrollable list of all events in the current month. Clicking an event in the list selects it on the grid too, so both panels stay in sync.

---

## Tech choices

- **React 19 + Vite 7** — fast dev experience, nothing exotic
- **Tailwind CSS v4** — used the new `@theme` block for design tokens instead of `tailwind.config.js`. All colours, fonts, and radii live in `index.css` as CSS variables, which also makes dark mode a single `.dark` override block
- **Redux Toolkit** — auth + role slices are wired up for the route guards (`Protected`, `Secured`). The calendar itself doesn't touch Redux at all — local state + localStorage is enough for a self-contained component
- **No date library** — everything (days in month, first day offset, range checks) is plain JS `Date`. Didn't need moment/dayjs for this scope
- **`localStorage` persistence** — current month view, selected range, all notes, and hidden categories all survive a page refresh. The default notes are only used as a fallback when nothing is saved yet

---

## Running locally

```bash
cd TakeUForward_SWE_Assignment_Task/client
npm install
```

Copy the env file (optional — only needed if you wire up a backend):
```bash
cp .env.example .env
```

Start the dev server:
```bash
npm run dev
```

That's it. Opens on `http://localhost:5173` by default.

---

## Other scripts

```bash
npm run build     # production build → dist/
npm run preview   # preview the production build locally
npm run lint      # eslint
```

---

## Project structure

```
client/
├── public/
│   └── tuf_hero_images/       # hero photos, one per month
├── src/
│   ├── app/                   # redux store, auth + role slices
│   ├── api/                   # axios instance
│   ├── components/
│   │   ├── Calendar/
│   │   │   ├── TUFCalendar.jsx      # root, all state lives here
│   │   │   ├── CalendarGrid.jsx     # grid, picker, range UX
│   │   │   ├── HeroSection.jsx      # monthly hero banner
│   │   │   ├── NotesPanel.jsx       # notes + monthly events list
│   │   │   ├── constants.js         # month data, badges, holidays ref
│   │   │   └── indianHolidays.json  # public holiday data
│   │   ├── CalendarSkeleton.jsx     # pixel-matched loading skeleton
│   │   └── AuthLayout.jsx           # Protected / Secured route guards
│   ├── pages/
│   │   └── Home.jsx           # page wrapper, dark mode toggle, loader demo
│   ├── services/Auth.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css              # tailwind v4 @theme tokens + custom utilities
```

---

## Notes

- The "Use Loader" button on the page is just a demo trigger — it swaps the calendar out for the skeleton for 2.5s to show what the loading state looks like
- Indian public holidays are pre-loaded from `indianHolidays.json` and rendered as read-only events. They can be hidden via the legend but not deleted
- The calendar covers `currentYear ± 5` for holiday rendering, so navigating a few years forward/back still works correctly
