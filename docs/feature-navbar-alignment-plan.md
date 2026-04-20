# Feature Implementation Plan

**Overall Progress:** `20%`  
*(Formula: completed main steps ÷ 5 × 100 — currently 1/5.)*

## TLDR

Align the **fixed header** (logo + primary nav links) horizontally with **page content**—especially the landing hero—by making the **same padding + max-width rules** apply in one predictable chain. Today the navbar still looks misaligned; this plan maps the layout, finds the mismatch, and applies a minimal fix.

## Critical Decisions

- **Grouped left cluster** — Logo and “My Recipes” / “My Pantry” live in one flex row with shared gaps; right-side actions use `shrink-0` so the bar doesn’t split into three visually disconnected zones.

- **`px-4` wrapper + `max-w-6xl` nav** — Mirrors the landing pattern (`section` → `px-4` → inner `max-w-6xl mx-auto`). Rationale: centering `max-w-6xl` in the **full viewport** vs inside **`viewport − 2×gutter`** produces different left edges; the wrapper is meant to match the hero.

- **No new layout framework** — Prefer a small shared primitive or consistent classes over introducing a second layout system, unless audit shows unavoidable duplication.

## Layout / CSS structure (reference)

| Layer | Role |
|--------|------|
| `body` | Font + global; no horizontal padding in `layout.js`. |
| `Header` | `fixed top-0 w-full`; inner `div.px-4` → `nav.max-w-6xl.mx-auto`. |
| `main` | `min-h-screen` only; **no** horizontal padding—each page adds its own. |
| Landing hero | `section.pt-32...px-4` → `div.max-w-6xl.mx-auto`. |

**Why misalignment can persist:** Inner pages use mixed patterns (`px-4` + `container` + `max-w-*`, or different `max-w` values). If the eye compares the header to a column that isn’t actually `px-4` + `max-w-6xl`, or if `container` applies extra breakpoints, edges won’t match. DevTools should compare **computed** `padding-left` and **offsetLeft** of the first text line vs the logo.

## Tasks:

- [x] 🟩 **Step 1: Map the DOM + CSS chain**
  - [x] 🟩 Document `RootLayout` → `Header` → inner wrappers vs `app/page.js` hero section.
  - [x] 🟩 Note mixed usage of `container`, `max-w-6xl`, `max-w-7xl`, `max-w-5xl` on inner routes.

- [ ] 🟥 **Step 2: Measure the real mismatch**
  - [ ] 🟥 On `/`, compare computed left inset: first hero heading vs header logo (same viewport width, no zoom).
  - [ ] 🟥 Note whether `container` / Tailwind defaults add horizontal padding beyond `px-4` on any compared page.

- [ ] 🟥 **Step 3: Choose one canonical “content shell”**
  - [ ] 🟥 Either align all primary pages to **`px-4` + `max-w-6xl`** (or document intentional exceptions), **or** extract a tiny reusable wrapper (e.g. `ContentShell` / shared className) used by **both** `Header` inner wrapper and page sections—same props, no duplicate magic numbers.

- [ ] 🟥 **Step 4: Implement the minimal code change**
  - [ ] 🟥 Adjust `Header` and/or the compared page only as required by Step 3 (no drive-by refactors).
  - [ ] 🟥 Re-check footer (`layout.js`) if its logo column should match the same shell.

- [ ] 🟥 **Step 5: Verify**
  - [ ] 🟥 `/` landing: hero title vs logo alignment.
  - [ ] 🟥 One inner route (e.g. dashboard or recipes): header vs that page’s main column.
