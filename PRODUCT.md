# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and hiring managers scanning quickly for a full-stack hire; freelance clients deciding whether to commission work; fellow developers and peers. All arrive cold, often on a phone, and want proof of real work within seconds. The site owner (Hans Diaz) is a second user: they edit all content through the private `/admin` panel.

## Product Purpose

Personal portfolio of Hans Diaz, a full-stack developer (Laravel, Vue.js, React, PHP, MySQL/PostgreSQL). It presents hero, about, projects (each with its own page and image/video media), GitHub activity, skills with technology icons, and a contact form. Success: a visitor understands what Hans builds, sees real projects, and gets in touch.

## Positioning

Fully self-managed: every block of content (profile, projects, skills, terminal commands, media) is editable from the owner's own `/admin`, backed by Neon DB and Vercel Blob, with live GitHub activity shown on the page. Not a static template.

## Capabilities and Constraints

- Stack is fixed: React 19, Vite, Tailwind CSS v4, plain JSX (no TypeScript), Vercel serverless API, Neon Postgres, Vercel Blob. No router in use; paths are matched in `src/main.jsx`.
- Content lives in DB with bundled defaults in `src/data/*` as fallback.
- Project pages live at `/projects/<slug>`, slug derived from title.
- Contact form spam defenses must stay intact: honeypot, 3s minimum fill time, 60s cooldown, reCAPTCHA v2, EmailJS limits.
- Light and dark themes both supported.

## Brand Commitments

Name "Hans Diaz". Logo is the gold "HD" monogram (navbar, favicon, loading screen); `<hansDev />` is the older text wordmark. Keep the existing gold accent, paper-and-ink palette, and Playfair Display (serif), Geist (sans), DM Mono (mono) typography.

## Evidence on Hand

Four projects in `src/data/projects.js` (portfolio site, Wizard Game, Laptopia inventory/POS, thesis e-commerce app), portraits in `src/assets/images/`, live GitHub data. No testimonials, client names, or metrics exist; none may be invented.

## Product Principles

1. Proof over claims: show real projects and media, never fabricated clients, testimonials, or numbers.
2. The owner can change anything without touching code.
3. Fast to scan for a cold visitor, on mobile first.
4. Stay within the established stack and visual identity unless the owner changes it.
