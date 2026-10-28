---
name: Hans Diaz Portfolio
description: Warm paper-and-ink editorial portfolio with a single gold accent and serif display type.
colors:
  gold-accent: "#d4a853"
  paper: "#f8f7f4"
  ink: "#18181a"
  paper-shade: "#eeecea"
  stone-text: "#7a7870"
  night: "#111110"
  night-shade: "#242320"
  bone: "#f0ede8"
  night-stone-text: "#8a877e"
typography:
  display:
    fontFamily: "Playfair Display, serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Playfair Display, serif"
    fontSize: "1.875rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 300
    lineHeight: 1.75
  label:
    fontFamily: "DM Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    letterSpacing: "0.1em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  pill: "9999px"
components:
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "0px"
    padding: "6px 12px"
  nav-pill:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.stone-text}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
---

# Design System: Hans Diaz Portfolio

## Overview

**Creative North Star: "The Printed Folio"**

A portfolio laid out like a well-set printed folio: warm paper, near-black ink, one thread of gold. Playfair Display carries the voice, DM Mono labels everything that is data or measurement, and a light sans keeps body copy quiet. Structure comes from hairlines, whitespace and type scale, not from boxes or shadows.

Both themes are first class: light is paper and ink, dark is lampblack and bone. The gold accent is identical in both and is the only chromatic colour.

**Key Characteristics:**
- Single gold accent on a neutral paper/ink ground.
- Serif display with italic gold emphasis, mono micro-labels.
- Hairline borders at 10% opacity instead of cards and shadows.
- Editorial spreads: large media beside a title, alternating sides.
- Motion is slow and eased: reveal on scroll, gentle hover shifts.

## Colors

Restrained palette: neutrals plus one accent.

### Primary
- **Folio Gold** (#d4a853): hover states, italic emphasis words, index numbers, proficiency lines, section-label rule. Rare on any screen.

### Neutral
- **Warm Paper** (#f8f7f4) / **Lampblack** (#111110): page ground, light / dark.
- **Ink** (#18181a) / **Bone** (#f0ede8): primary text.
- **Paper Shade** (#eeecea) / **Night Shade** (#242320): secondary surfaces, media placeholders.
- **Stone** (#7a7870) / **Night Stone** (#8a877e): muted text and labels.
- **Hairline** (ink or bone at 10% alpha): all borders and dividers.

### Named Rules
**The One Thread Rule.** Gold is the only hue. It marks emphasis and interaction, never fills large areas.

## Typography

**Display Font:** Playfair Display (serif)
**Body Font:** Geist Variable (sans-serif)
**Label/Mono Font:** DM Mono

**Character:** Literary serif against technical mono; the pairing says "writes software, cares about craft".

### Hierarchy
- **Display** (400, clamp 2.25rem to 3.75rem, 1.05, -0.03em): section titles, project titles; one word in italic gold.
- **Headline** (400, 1.875rem to 2.25rem, 1.2, -0.02em): category and project card titles, often italic.
- **Body** (300, 0.875rem, 1.75): descriptions, max about 60ch.
- **Label** (400, 0.7 to 0.75rem, 0.1em to 0.3em tracking, uppercase): years, counts, tech chips, section labels.

### Named Rules
**The Mono Is Data Rule.** DM Mono is for numbers, labels and measurements only, never paragraphs.

## Layout

Single column, max width 64rem (`max-w-5xl`), 1rem to 1.5rem side padding. Each section is at least a viewport tall with a full-bleed hairline at its base. Section header: mono label with a 2.5rem gold rule above a display title. Content uses 12-column spreads from md up (7/5 split for projects) and collapses to one column on mobile. Floating pill navbar, top-centre.

## Elevation & Depth

Flat by default. Depth comes from hairlines and tonal paper shades. The only shadow is the floating navbar (`0 8px 30px -12px rgba(0,0,0,0.5)` with backdrop blur).

## Shapes

Mostly square: media, chips, tiles and buttons have 0 radius with 1px hairline borders. Pills only for the navbar and theme switch. Base radius token 10px (`--radius`) exists for shadcn components.

## Components

### Buttons
- **Admin / ghost:** transparent, 1px hairline, uppercase mono 0.75rem, hover border and text turn gold.

### Chips
- Tech chips: hairline border, mono uppercase 0.7rem, 13px monochrome brand icon, muted text.

### Cards / Containers
No cards. Containers are hairline-bordered regions; the skills grid draws its lines with 1px gaps over a border-coloured ground.

### Navigation
Fixed pill, translucent paper with blur. Active link has a 10% foreground fill; links are mono. Theme switch is a pill toggle with sun/moon.

### Project spread
Cover (16:10, 1px hairline, image zooms 5% on hover) beside title, description, tech chips and a "View project" link; the whole article is one stretched link.

## Do's and Don'ts

### Do:
- **Do** use Folio Gold only for emphasis and interaction.
- **Do** set titles in Playfair Display with one italic gold word.
- **Do** build structure with 1px hairlines at 10% alpha.
- **Do** keep icons monochrome (`currentColor`), turning gold on hover.
- **Do** respect reduced motion on every transition.

### Don't:
- **Don't** add drop-shadowed cards or gradients.
- **Don't** introduce a second accent hue.
- **Don't** use DM Mono for body copy.
- **Don't** use brand-coloured tech icons.
