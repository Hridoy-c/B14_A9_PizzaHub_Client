<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Typography — which font to use where

All fonts are loaded with `next/font/local` in `src/app/layout.tsx` and exposed as CSS
variables on `<html>`. Tailwind maps them to utility classes in `src/app/globals.css`
inside `@theme inline`. Never add a `@font-face` block in CSS and never hardcode
`style={{ fontFamily: ... }}` — use the utility classes below.

### Loaded fonts

| Utility class | CSS variable | Font file | Real typeface | Weight |
| --- | --- | --- | --- | --- |
| `font-body` (default) | `--font-roboto-flex` | `src/app/fonts/roboto-flex-regular.ttf` | **Roboto Flex** (Google) | 400 |
| `font-sans` | `--font-general-sans` | `src/app/fonts/general-sans-medium.otf` | **General Sans** (ITF) | 500 |
| `font-display` | `--font-domaine` | `src/app/fonts/domaine-display-condensed-medium.ttf` | **Domaine Display Condensed** (Klim) | 500 |

`font-body` is the default on `<body>`: paragraphs, descriptions, prices and all
long-form text render in Roboto Flex. `font-sans` (General Sans) is for interactive
UI — navigation, links, buttons, labels and form fields. `font-display` is reserved
for the wordmark and large headings.

### Rules

- **`font-display` (Domaine)** — logo/wordmark, hero headings, section titles, large
  editorial numbers. Always pair it with `tracking-tight` and a `leading-none` or
  `leading-[1.05]`. Never use it for body copy, nav links, buttons or text under ~14px.
- **`font-sans` (General Sans)** — interactive UI only: navigation, links, buttons,
  pills, labels, badges, form fields. Put the class on the container (e.g. `<nav
  className="font-sans">`) instead of repeating it on every child.
- **`font-body` (Roboto Flex)** — the default. Paragraphs, descriptions, item details,
  prices and any long-form text. You normally do not need to write this class at all;
  only use it to switch back from a display/sans container.
- Domaine and General Sans each ship a **single weight (500)**, Roboto Flex is
  **400**. Do not use `font-bold` / `font-light` on the first two — the browser would
  fake it. Express hierarchy with **size, color and spacing** instead.
- Only these three files are loaded. The unused `public/fonts/FONT 10.ttf`
  (Macan Bold) must not be referenced until it is added to `layout.tsx` with its own
  variable.

### Font sizes (the site intentionally uses a small, refined scale)

Base is 16px. Stick to this scale when adding UI:

| Role | Class | px |
| --- | --- | --- |
| Logo | `text-[clamp(1.4rem,1.15rem+1.1vw,1.75rem)]` + `font-display` | 22 → 28 |
| Section heading (display) | `text-[clamp(1.75rem,1.4rem+2vw,2.75rem)]` + `font-display` | 28 → 44 |
| Body / paragraph | `text-[0.9375rem]` | 15 |
| Nav link | `text-[0.9375rem]` | 15 |
| Button / pill | `text-[0.875rem]` → `text-[1rem]` | 14 → 16 |
| Caption / meta | `text-[0.75rem]` | 12 |

Keep newer text at or below these values; if a heading needs to feel bigger, increase
weight contrast via color and letter-spacing rather than jumping past the range.

### Adding a new font later

1. Drop the file in `src/app/fonts/` with a descriptive kebab-case name
   (`family-weight.ext`), never `FONT 4.otf` style names.
2. Add a `localFont({ src: "./fonts/...", variable: "--font-<name>", weight, display: "swap" })`
   in `src/app/layout.tsx` and append its `.variable` to the `<html>` className.
3. Map it in `globals.css` under `@theme inline`, e.g. `--font-accent: var(--font-macan);`.
4. Document it in the table above.

## Color palette

| Token | Hex | Use |
| --- | --- | --- |
| Cream (page bg) | `#F5EDE3` | page and navbar background |
| Border | `#EADBC8` | dividers, subtle outlines |
| Cocoa (ink) | `#2A1A10` | body text, primary button hover |
| Brown (headings) | `#3B2417` | logo, headings, outline buttons |
| Muted brown | `#7A6455` | nav links, secondary text |
| Crust orange | `#B9733A` | accent, "Hub" in logo, primary button |

## Logo & app icons

The brand mark is one shape everywhere: a **pizza slice** — brown body, orange crust
band along the base, three cream dots.

**Component**: `src/components/shared/navbar/Logo.tsx`

```tsx
<Logo />                              // dark, for the cream navbar
<Logo tone="light" onClick={close} />  // cream mark, for the brown mobile panel
```

- `PizzaMark` is the bare SVG (accepts `tone` and `className`), `Logo` is the mark +
  the `Pizza`/`Hub` wordmark inside a `next/link`.
- Mark size is `size-6 md:size-7` (24 / 28px), wordmark is Domaine at
  `clamp(1.4rem,1.15rem+1.1vw,1.75rem)`. Keep the mark roughly the same height as the
  cap-height of the wordmark.
- `tone="dark"` → `#3B2417` body, `#F5EDE3` dots (cream backgrounds).
- `tone="light"` → `#F5EDE3` body, `#3B2417` dots (dark backgrounds). The crust stays
  `#B9733A` in both. Never render the dark mark on a dark surface — it disappears.
- Geometry is tuned to stay readable at 16px: apex `(16, 3.5)`, base corners
  `(4.2, 26.6)` / `(27.8, 26.6)`, curved base, crust band ~3.6px. Do not add details
  (no thin lines, no text, no gradients) — they vanish in the browser tab.

**Browser tab / app icons** (Next.js file conventions, no `<link>` tags in code):

| File | Role | Notes |
| --- | --- | --- |
| `src/app/icon.svg` | source of truth for the mark | served as `type="image/svg+xml" sizes="any"` |
| `src/app/favicon.ico` | legacy + taskbar | generated, 16/32/48 PNG-in-ICO |
| `src/app/apple-icon.png` | iOS home screen | generated, 180×180 on cream |

`favicon.ico` and `apple-icon.png` are **build artefacts** — never edit them by hand.
Change the SVG, then run:

```bash
npm run icons        # scripts/generate-icons.mjs, uses sharp
```

If you change the mark's colours or geometry, update **both** the SVG and
`MARK_COLORS` in `Logo.tsx` so the tab icon and the navbar stay identical.

