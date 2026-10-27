# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run from `my-react-app/` (the repo root, contains `.git`):

- `npm run dev` — Vite dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — serve built `dist/`
- `npm run lint` — ESLint (flat config, `eslint.config.js`)

No test framework configured.

## Architecture

Single-page portfolio: React 19 + Vite 8 + Tailwind CSS v4 (via `@tailwindcss/vite`, no `tailwind.config`). Plain JSX, no TypeScript. `@` alias maps to `src/` (set in both `vite.config.js` and `jsconfig.json`).

- `src/App.jsx` stacks sections in order: Hero, About, Projects, Skills, Contact inside `<main className="scroll-sections">`. Navbar/Footer/ScrollToTop in `components/layout/`.
- `src/sections/*` — one file per page section. Section labels are numbered by hand (e.g. `04 / Contact`); renumber if sections reorder.
- `src/data/projects.js` — project list content; edit here, not in `sections/projects.jsx`.
- `src/components/ui/scroll-reveal.jsx` — shared framer-motion wrapper (`direction`, `delay`; respects reduced motion). Wrap section content in it.
- `src/components/ui/button.jsx` + `components.json` — shadcn/ui (style `radix-nova`, JSX not TSX, lucide icons). Add components via the shadcn CLI; `cn()` helper in `src/lib/utils.js`.
- Theming: CSS variables (`--background`, `--primary`, `--accent`, …) in `src/index.css`; dark mode via `.dark` class (`next-themes`). Shared classes like `portfolio-section`, `section-label`, `section-title` are defined in CSS, reuse them. Fonts: Geist (sans), Playfair Display (serif), DM Mono (mono).

## Contact form (`src/sections/contact.jsx`)

Sends via EmailJS from the browser, with layered spam defenses: honeypot field (`website`), minimum fill time (3s), 60s cooldown in `localStorage`, reCAPTCHA v2 checkbox, EmailJS `blockHeadless` + `limitRate`. Keep these intact when editing. Requires env vars (see `.env.example`): `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`, `VITE_RECAPTCHA_SITE_KEY` (must be a v2 key, not v3). Form shows a "not configured" state when missing.
