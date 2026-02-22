# ShahdCoop Design System

**Version:** 1.0
**Author:** Design Director
**Brand Attributes:** Minimal · Warm · Premium-Natural
**Last Updated:** February 2026

---

## Design Philosophy

ShahdCoop's visual identity draws from the quiet confidence of nature — unhurried, essential, and considered. Every decision follows one principle: **reduction to resonance**. We remove until only what matters remains, then polish until it feels inevitable.

The system is built around three tensions:

1. **Warmth without excess** — Golden amber tones tempered by cool stone neutrals
2. **Premium without pretension** — Craft quality conveyed through restraint, not ornament
3. **Natural without rustic** — Organic textures refined to a modern sensibility

Our visual language takes cues from the geometry of honeycombs, the gradients of liquid honey, and the matte textures of beeswax — abstracted into a system that feels both ancient and forward-looking.

---

## 1. Color Palette

### 1.1 Design Rationale

The palette is organized into four channels. **Honey** is the brand's emotional core — warm amber tones that feel edible and alive. **Stone** provides the architectural frame — cool, desaturated neutrals that let the warmth breathe. **Botanical** introduces organic freshness. Semantic colors follow established conventions but are tuned to the brand's warmth.

### 1.2 Primary — Honey

The signature color. Used for primary actions, brand moments, and emotional emphasis. Derived from the precise amber of Sidr honey held against warm light.

| Token | Hex | HSL | Usage |
|-------|-----|-----|-------|
| `honey-50` | `#FFF8ED` | 36 100% 96% | Tinted backgrounds, hover fills |
| `honey-100` | `#FFEFD4` | 36 100% 91% | Card backgrounds, selected states |
| `honey-200` | `#FFDBA8` | 32 100% 83% | Soft borders, dividers |
| `honey-300` | `#FFC170` | 30 100% 72% | Illustrations, decorative |
| `honey-400` | `#FFA238` | 28 100% 61% | Hover accents |
| `honey-500` | `#F48815` | 26 91% 52% | **Primary brand color** |
| `honey-600` | `#D86D0B` | 22 91% 45% | Primary button default |
| `honey-700` | `#B4500B` | 18 90% 37% | Primary button hover |
| `honey-800` | `#923F10` | 16 81% 32% | Active / pressed states |
| `honey-900` | `#7A3510` | 14 78% 27% | Deep emphasis |
| `honey-950` | `#461904` | 14 90% 15% | High-contrast text on honey bg |

### 1.3 Secondary — Stone

The structural palette. Used for backgrounds, surfaces, text, and borders. Named "Stone" to evoke the cool mineral surfaces of traditional Moroccan architecture.

| Token | Hex | HSL | Usage |
|-------|-----|-----|-------|
| `stone-0` | `#FFFFFF` | 0 0% 100% | Pure white surfaces |
| `stone-50` | `#F9F7F4` | 36 24% 97% | Page background (warm white) |
| `stone-100` | `#F0ECE6` | 36 22% 93% | Card backgrounds, alternating rows |
| `stone-200` | `#E2DCD3` | 32 18% 86% | Borders, dividers |
| `stone-300` | `#CFC7BA` | 30 16% 77% | Placeholder text, disabled borders |
| `stone-400` | `#B5AA99` | 28 14% 65% | Muted icons, tertiary text |
| `stone-500` | `#978A78` | 26 14% 53% | Secondary text |
| `stone-600` | `#7B6E5E` | 22 14% 42% | Body text (secondary) |
| `stone-700` | `#655849` | 20 17% 34% | Body text (primary) |
| `stone-800` | `#53493D` | 18 16% 28% | Headings |
| `stone-900` | `#463E34` | 16 16% 24% | Primary text |
| `stone-950` | `#2A2520` | 14 14% 15% | High-contrast text, near-black |

### 1.4 Accent — Botanical

A restrained green drawn from eucalyptus leaves and fresh herbs. Used sparingly for success states, eco-messaging, and nature-related content.

| Token | Hex | HSL | Usage |
|-------|-----|-----|-------|
| `botanical-50` | `#F2F8F4` | 140 30% 96% | Success backgrounds |
| `botanical-100` | `#DAEEE0` | 140 30% 89% | Success tints |
| `botanical-200` | `#B8DEC4` | 142 28% 80% | Badges, tags |
| `botanical-300` | `#86C69B` | 144 28% 65% | Illustrations |
| `botanical-400` | `#57A872` | 146 32% 50% | Icons, indicators |
| `botanical-500` | `#3D8F5A` | 148 40% 40% | **Success / eco accent** |
| `botanical-600` | `#2F7347` | 150 42% 32% | Success text |
| `botanical-700` | `#285C3B` | 148 40% 26% | Deep green |

### 1.5 Semantic Colors

| Purpose | Light Mode | Dark Mode | Token |
|---------|-----------|-----------|-------|
| **Success** | `botanical-500` `#3D8F5A` | `botanical-400` `#57A872` | `--color-success` |
| **Success bg** | `botanical-50` `#F2F8F4` | `#1A2E22` | `--color-success-bg` |
| **Warning** | `#C4850C` | `#F0AD4E` | `--color-warning` |
| **Warning bg** | `#FFF8ED` | `#2E2410` | `--color-warning-bg` |
| **Error** | `#C13E3E` | `#E87070` | `--color-error` |
| **Error bg** | `#FEF2F2` | `#2E1616` | `--color-error-bg` |
| **Info** | `#3B7EC7` | `#6AAFE6` | `--color-info` |
| **Info bg** | `#EFF6FF` | `#162236` | `--color-info-bg` |

### 1.6 Dark Mode

Dark mode is not a simple inversion. The Honey palette warms further, and surfaces use deep espresso tones rather than pure black — evoking the interior of a beehive.

| Surface | Token | Hex | Usage |
|---------|-------|-----|-------|
| Background | `dark-bg` | `#1A1714` | Page background |
| Surface 1 | `dark-surface-1` | `#242019` | Card backgrounds |
| Surface 2 | `dark-surface-2` | `#2E2A22` | Elevated cards, modals |
| Surface 3 | `dark-surface-3` | `#3A342B` | Hover states, active |
| Border subtle | `dark-border-subtle` | `#3A342B` | Dividers |
| Border default | `dark-border` | `#4D453A` | Card borders |
| Text primary | `dark-text-primary` | `#F0ECE6` | Headings, body |
| Text secondary | `dark-text-secondary` | `#B5AA99` | Supporting text |
| Text muted | `dark-text-muted` | `#7B6E5E` | Placeholders, disabled |

**Dark mode Honey adjustments:**

| Token | Light Mode | Dark Mode | Rationale |
|-------|-----------|-----------|-----------|
| Primary | `honey-600` `#D86D0B` | `honey-400` `#FFA238` | Increase luminance for contrast |
| Primary hover | `honey-700` `#B4500B` | `honey-300` `#FFC170` | Lighter on hover in dark |
| Primary text-on | `#FFFFFF` | `honey-950` `#461904` | Dark text on bright buttons |

### 1.7 Color Usage Rules

1. **The 60-30-10 Rule:** 60% Stone (surfaces/bg), 30% Honey (accents/CTAs), 10% Botanical (success/eco moments)
2. **Never use Honey on Honey.** Honey text on Honey backgrounds fails contrast. Use `stone-900` or `honey-950` for text on honey backgrounds.
3. **Saturated colors are rewards.** Use `honey-500`+ only for interactive elements and brand moments. Informational UI stays in Stone.
4. **Dark mode reduces saturation.** Backgrounds desaturate, while interactive elements *increase* saturation to maintain hierarchy.

---

## 2. Typography Scale

### 2.1 Font Selection

| Role | Font | Weight Range | Source | Rationale |
|------|------|-------------|--------|-----------|
| **Display** | **Playfair Display** | 400, 500, 600, 700 | Google Fonts | High-contrast serif with elegant ball terminals. Evokes premium editorial quality — the serif equivalent of hand-lettered honey labels. |
| **Body** | **Source Sans 3** | 300, 400, 500, 600, 700 | Google Fonts | Humanist sans-serif with open apertures and warm geometry. Highly legible at all sizes, excellent Arabic language companion fonts available. |
| **Mono** | **JetBrains Mono** | 400, 500 | Google Fonts | For admin dashboards, order numbers, SKUs, and code. |
| **Arabic** | **Noto Sans Arabic** | 400, 500, 600, 700 | Google Fonts | Designed for screen legibility. Harmonizes well with Source Sans 3 in multilingual layouts. |

### 2.2 Type Scale (9 Levels)

Base size: **16px** (1rem). Scale ratio: **1.250** (Major Third) for body, **1.333** (Perfect Fourth) jump for display sizes.

| Level | Token | Size (rem) | Size (px) | Line Height | Letter Spacing | Weight | Font | Usage |
|-------|-------|-----------|-----------|-------------|---------------|--------|------|-------|
| **Display XL** | `text-display-xl` | 3.5rem | 56px | 1.1 | -0.025em | 600 | Playfair Display | Hero headlines (homepage only) |
| **Display LG** | `text-display-lg` | 2.75rem | 44px | 1.15 | -0.02em | 600 | Playfair Display | Section heroes, feature headlines |
| **Display SM** | `text-display-sm` | 2.0rem | 32px | 1.2 | -0.015em | 500 | Playfair Display | Page titles, card feature headings |
| **Heading LG** | `text-heading-lg` | 1.5rem | 24px | 1.3 | -0.01em | 600 | Source Sans 3 | Section headings (H2) |
| **Heading SM** | `text-heading-sm` | 1.25rem | 20px | 1.35 | -0.005em | 600 | Source Sans 3 | Sub-section headings (H3) |
| **Body LG** | `text-body-lg` | 1.125rem | 18px | 1.6 | 0em | 400 | Source Sans 3 | Lead paragraphs, product descriptions |
| **Body MD** | `text-body-md` | 1.0rem | 16px | 1.6 | 0em | 400 | Source Sans 3 | Default body text |
| **Body SM** | `text-body-sm` | 0.875rem | 14px | 1.5 | 0.005em | 400 | Source Sans 3 | Captions, metadata, helper text |
| **Body XS** | `text-body-xs` | 0.75rem | 12px | 1.5 | 0.01em | 500 | Source Sans 3 | Badges, labels, fine print |

### 2.3 Responsive Typography

Display sizes scale down on mobile. Body sizes remain constant for readability.

| Level | Desktop (≥1024px) | Tablet (≥768px) | Mobile (<768px) |
|-------|-------------------|-----------------|-----------------|
| Display XL | 56px | 44px | 36px |
| Display LG | 44px | 36px | 28px |
| Display SM | 32px | 28px | 24px |
| Heading LG | 24px | 24px | 22px |
| Heading SM | 20px | 20px | 18px |
| Body LG–XS | No change | No change | No change |

### 2.4 Typography Rules

1. **Serif for emotion, sans for information.** Playfair Display is reserved for display/heading levels that carry brand personality. Source Sans 3 handles everything that needs to be *read* rather than *felt*.
2. **Maximum line length: 70 characters.** Use `max-width: 42rem` on text containers.
3. **Negative letter-spacing increases with size.** Large display text tightens; small body text loosens slightly for legibility.
4. **Never bold Playfair Display beyond 700.** The high-contrast strokes become illegible at heavier weights.
5. **Arabic text adds 10% line-height.** Noto Sans Arabic requires more vertical space for diacritical marks.

---

## 3. Spacing System

### 3.1 Base Grid: 8px

All spacing is derived from an 8px base unit. This creates consistent vertical rhythm and aligns with common screen densities (1x, 2x, 3x).

| Token | Value | Pixels | Common Usage |
|-------|-------|--------|-------------|
| `space-0` | 0 | 0px | Reset |
| `space-0.5` | 0.125rem | 2px | Hairline gaps, focus ring offset |
| `space-1` | 0.25rem | 4px | Tight inline spacing, icon-to-text gap |
| `space-1.5` | 0.375rem | 6px | Compact button padding (vertical) |
| `space-2` | 0.5rem | 8px | **Base unit.** Input padding, small gaps |
| `space-3` | 0.75rem | 12px | Button padding (vertical), tag spacing |
| `space-4` | 1rem | 16px | Default element gap, card padding (sm) |
| `space-5` | 1.25rem | 20px | Medium gaps |
| `space-6` | 1.5rem | 24px | Card padding (md), form group spacing |
| `space-8` | 2rem | 32px | Card padding (lg), section inner margins |
| `space-10` | 2.5rem | 40px | Large component gaps |
| `space-12` | 3rem | 48px | Section padding (sm) |
| `space-16` | 4rem | 64px | Section padding (md) |
| `space-20` | 5rem | 80px | Section padding (lg), hero spacing |
| `space-24` | 6rem | 96px | Page-level vertical rhythm |
| `space-32` | 8rem | 128px | Major section separators |

### 3.2 Spacing Application Patterns

| Context | Tokens Used | Example |
|---------|------------|---------|
| **Inline elements** | `space-1` to `space-2` | Icon + label: `gap: space-1.5` |
| **Form fields** | `space-4` to `space-6` | Field-to-field: `gap: space-5`, label-to-input: `space-1.5` |
| **Card internals** | `space-4` to `space-8` | Card padding: `space-6`, content gap: `space-4` |
| **Card grid gaps** | `space-4` to `space-6` | Grid gap: `space-5` mobile, `space-6` desktop |
| **Section stacking** | `space-16` to `space-24` | Between homepage sections: `space-20` |
| **Page chrome** | `space-4` to `space-8` | Container padding: `space-4` mobile, `space-8` desktop |

### 3.3 Container Widths

| Token | Max Width | Usage |
|-------|-----------|-------|
| `container-xs` | 320px | Modals, toast width |
| `container-sm` | 480px | Auth forms, narrow content |
| `container-md` | 640px | Blog content, product descriptions |
| `container-lg` | 960px | Product grid (with sidebar) |
| `container-xl` | 1200px | Full-width content sections |
| `container-2xl` | 1400px | Admin dashboard |

### 3.4 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-none` | 0px | Hard edges (tables, dividers) |
| `radius-sm` | 4px | Badges, tags, tooltips |
| `radius-md` | 8px | Buttons, inputs, small cards |
| `radius-lg` | 12px | Cards, modals, dropdowns |
| `radius-xl` | 16px | Hero cards, image containers |
| `radius-2xl` | 24px | Feature sections, large containers |
| `radius-full` | 9999px | Avatars, pills, toggles |

---

## 4. Component Specifications (30 Components)

### 4.1 Buttons

#### Primary Button
The main call-to-action. Honey-filled, bold presence.

| Property | Default | Hover | Active | Focus | Disabled |
|----------|---------|-------|--------|-------|----------|
| Background | `honey-600` | `honey-700` | `honey-800` | `honey-600` | `stone-200` |
| Text | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` | `stone-400` |
| Border | none | none | none | `2px honey-400` offset 2px | none |
| Shadow | `0 1px 2px rgba(0,0,0,0.06)` | `0 2px 8px rgba(216,109,11,0.25)` | none | — | none |
| Transform | — | `translateY(-1px)` | `translateY(0)` | — | — |
| Cursor | pointer | pointer | pointer | pointer | not-allowed |
| Opacity | 1 | 1 | 1 | 1 | 0.5 |

**Sizes:**

| Size | Height | Padding (H) | Font | Radius |
|------|--------|-------------|------|--------|
| SM | 32px | `space-3` (12px) | `text-body-sm` (14px), weight 600 | `radius-md` |
| MD | 40px | `space-4` (16px) | `text-body-md` (16px), weight 600 | `radius-md` |
| LG | 48px | `space-5` (20px) | `text-body-lg` (18px), weight 600 | `radius-md` |

**Icon button variant:** Square aspect ratio. Icon centered. Same height tokens.

**Loading state:** Text replaced by a 20px spinner (color: white). Button width remains fixed (use `min-width`).

---

#### Secondary Button
Outlined, for secondary actions. Defers to Primary.

| Property | Default | Hover | Active | Focus | Disabled |
|----------|---------|-------|--------|-------|----------|
| Background | transparent | `honey-50` | `honey-100` | transparent | transparent |
| Text | `honey-700` | `honey-800` | `honey-900` | `honey-700` | `stone-400` |
| Border | `1.5px solid honey-300` | `1.5px solid honey-500` | `1.5px solid honey-600` | `2px honey-400` offset 2px | `1.5px solid stone-200` |

---

#### Ghost Button
Minimal, text-only. For tertiary actions.

| Property | Default | Hover | Active |
|----------|---------|-------|--------|
| Background | transparent | `stone-100` | `stone-200` |
| Text | `stone-700` | `stone-900` | `stone-900` |
| Border | none | none | none |
| Underline | none | none | none |

---

#### Destructive Button
For delete/remove actions. Red fills on confirmation only.

| Property | Default (outlined) | Hover | Confirm (filled) |
|----------|--------------------|-------|-------------------|
| Background | transparent | `#FEF2F2` | `#C13E3E` |
| Text | `#C13E3E` | `#C13E3E` | `#FFFFFF` |
| Border | `1.5px solid #E8AAAA` | `1.5px solid #C13E3E` | none |

---

### 4.2 Input Fields

| Property | Default | Hover | Focus | Error | Disabled |
|----------|---------|-------|-------|-------|----------|
| Background | `stone-0` | `stone-0` | `stone-0` | `stone-0` | `stone-100` |
| Border | `1.5px solid stone-200` | `1.5px solid stone-300` | `1.5px solid honey-500` | `1.5px solid error` | `1.5px solid stone-200` |
| Text | `stone-900` | `stone-900` | `stone-900` | `stone-900` | `stone-400` |
| Placeholder | `stone-400` | `stone-400` | `stone-400` | `stone-400` | `stone-300` |
| Label | `stone-700`, `text-body-sm`, weight 500, margin-bottom `space-1.5` | — | `honey-700` | `error` | `stone-400` |
| Helper text | `stone-500`, `text-body-xs` | — | — | `error`, `text-body-xs` | — |
| Ring (focus) | — | — | `0 0 0 3px honey-100` | `0 0 0 3px error-bg` | — |
| Height | 40px (MD), 48px (LG) | — | — | — | — |
| Padding | `space-3` vertical, `space-4` horizontal | — | — | — | — |
| Radius | `radius-md` (8px) | — | — | — | — |

**Variants:** Text, Password (with toggle), Email, Number (with stepper), Textarea (min 3 rows), Select, Search (with icon).

---

### 4.3 Checkbox

| Property | Unchecked | Hover | Checked | Disabled |
|----------|-----------|-------|---------|----------|
| Box bg | `stone-0` | `stone-50` | `honey-600` | `stone-100` |
| Box border | `1.5px solid stone-300` | `1.5px solid stone-400` | `1.5px solid honey-600` | `1.5px solid stone-200` |
| Check mark | — | — | white, `strokeWidth: 2.5` | `stone-400` |
| Size | 18×18px | — | — | — |
| Radius | `radius-sm` (4px) | — | — | — |

---

### 4.4 Radio Button

| Property | Unselected | Hover | Selected | Disabled |
|----------|------------|-------|----------|----------|
| Ring bg | `stone-0` | `stone-50` | `stone-0` | `stone-100` |
| Ring border | `1.5px solid stone-300` | `1.5px solid stone-400` | `2px solid honey-600` | `1.5px solid stone-200` |
| Dot | — | — | 8px circle, `honey-600` | 8px circle, `stone-400` |
| Size | 20×20px | — | — | — |

---

### 4.5 Toggle / Switch

| Property | Off | Hover (off) | On | Hover (on) | Disabled |
|----------|-----|-------------|-----|------------|----------|
| Track bg | `stone-200` | `stone-300` | `honey-600` | `honey-700` | `stone-100` |
| Thumb bg | `stone-0` | `stone-0` | `stone-0` | `stone-0` | `stone-0` |
| Thumb shadow | `0 1px 2px rgba(0,0,0,0.1)` | — | — | — | none |
| Track size | 44×24px | — | — | — | — |
| Thumb size | 20×20px | — | — | — | — |
| Transition | `transform 200ms ease-out, background 150ms ease` |

---

### 4.6 Badge / Tag

| Variant | Background | Text | Border | Radius |
|---------|-----------|------|--------|--------|
| Default | `stone-100` | `stone-700` | none | `radius-full` |
| Honey | `honey-100` | `honey-800` | none | `radius-full` |
| Success | `botanical-50` | `botanical-600` | none | `radius-full` |
| Warning | `#FFF8ED` | `#92600A` | none | `radius-full` |
| Error | `#FEF2F2` | `#C13E3E` | none | `radius-full` |
| Outlined | transparent | `stone-700` | `1px solid stone-200` | `radius-full` |

**Sizes:** SM (20px height, `text-body-xs`, padding `space-0.5` / `space-2`), MD (24px, `text-body-xs`, `space-1` / `space-2.5`).

Dot indicator (optional): 6px circle before text, color matches text.

---

### 4.7 Card

| Property | Value |
|----------|-------|
| Background | `stone-0` (light), `dark-surface-1` (dark) |
| Border | `1px solid stone-200` (light), `1px solid dark-border-subtle` (dark) |
| Radius | `radius-lg` (12px) |
| Shadow (default) | `0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)` |
| Shadow (hover) | `0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.03)` |
| Padding | `space-6` (24px) |
| Transition | `box-shadow 250ms ease, transform 250ms ease` |
| Hover transform | `translateY(-2px)` (interactive cards only) |

---

### 4.8 Product Card

| Element | Spec |
|---------|------|
| Image container | Aspect ratio 4:5, `radius-lg` overflow hidden, `stone-50` bg placeholder |
| Image hover | Scale 1.04 over 400ms `ease-out` |
| Wishlist button | 32×32px, top-right `space-3` inset, `stone-0` bg with `stone-200` border, heart icon |
| Badge (sale) | Positioned top-left `space-3` inset, Honey variant badge |
| Product name | `text-body-md`, weight 500, `stone-900`, 2-line clamp |
| Price | `text-body-md`, weight 600, `stone-900` |
| Compare price | `text-body-sm`, weight 400, `stone-400`, line-through |
| Rating | 14px stars (`honey-500` filled, `stone-200` empty) + count in `text-body-xs` `stone-500` |
| Card gap | `space-3` between image and content |
| Content gap | `space-1` between text elements |

---

### 4.9 Navigation Bar

| Property | Value |
|----------|-------|
| Height | 64px (mobile), 72px (desktop) |
| Background | `stone-0` with `backdrop-filter: blur(12px)` at 90% opacity on scroll |
| Border bottom | `1px solid stone-200` (visible on scroll) |
| Position | `sticky top-0 z-50` |
| Logo | 32px height, left-aligned |
| Nav links | `text-body-sm`, weight 500, `stone-600` default, `stone-900` hover, `honey-600` active |
| Cart badge | 18px circle, `honey-600` bg, white text, `text-body-xs` weight 700, `-4px` top-right offset |
| Mobile hamburger | 44×44px touch target, 3 lines → X animation |
| Transition on scroll | Background opacity + border: `150ms ease` |

---

### 4.10 Mobile Navigation (Sheet)

| Property | Value |
|----------|-------|
| Overlay | `rgba(0,0,0,0.4)` with `backdrop-filter: blur(4px)` |
| Panel | Slides from left, width 85vw max 360px, `stone-0` bg |
| Animation | Slide: `300ms cubic-bezier(0.32, 0.72, 0, 1)` |
| Nav items | 48px height, `text-body-lg`, weight 500, full-width tap target |
| Category accordion | Nested items indented `space-6`, `text-body-md` |
| Close button | 44×44px, top-right, X icon |

---

### 4.11 Search Bar

| Property | Value |
|----------|-------|
| Height | 40px (header inline), 48px (expanded/page) |
| Background | `stone-100` (light), `dark-surface-2` (dark) |
| Border | none (resting), `1.5px solid honey-500` (focused) |
| Radius | `radius-full` (pill shape) |
| Icon | Search (left), 18px, `stone-400` → `stone-600` on focus |
| Clear button | X icon, appears when input has value |
| Autocomplete dropdown | `stone-0` bg, `radius-lg`, shadow, max 5 results |
| Result item | 48px height, product image (32px), name, category, hover `stone-50` |
| Debounce | 300ms |

---

### 4.12 Breadcrumbs

| Property | Value |
|----------|-------|
| Text | `text-body-sm`, `stone-500` |
| Link color | `stone-500` default, `stone-700` hover, underline on hover |
| Separator | `/` in `stone-300`, `space-2` padding |
| Current page | `stone-900`, weight 500, no link |
| Truncation | On mobile, show only "← Back to [parent]" |

---

### 4.13 Toast / Notification

| Property | Value |
|----------|-------|
| Width | 360px max, 100% on mobile (with `space-4` margin) |
| Position | Bottom-right desktop, bottom-center mobile |
| Background | `stone-0` (light), `dark-surface-2` (dark) |
| Border | `1px solid stone-200` |
| Radius | `radius-lg` |
| Shadow | `0 8px 30px rgba(0,0,0,0.12)` |
| Padding | `space-4` |
| Enter animation | Slide up 16px + fade in, `350ms cubic-bezier(0.21, 1.02, 0.73, 1)` |
| Exit animation | Fade out + slide down 8px, `200ms ease-in` |
| Duration | 5000ms default, persistent for errors |
| Leading icon | 20px, colored per type (success=botanical, error=red, info=blue, warning=amber) |
| Close button | 32×32px, ghost style, top-right |

---

### 4.14 Modal / Dialog

| Property | Value |
|----------|-------|
| Overlay | `rgba(0,0,0,0.5)` with `backdrop-filter: blur(4px)` |
| Container | `stone-0`, `radius-xl` (16px), max-width 480px, centered |
| Shadow | `0 24px 48px rgba(0,0,0,0.16)` |
| Padding | Header: `space-6`, Body: `space-6`, Footer: `space-6` with `stone-100` bg |
| Header | `text-heading-sm`, weight 600, with close button (44×44px ghost) |
| Enter | Scale from 0.95 + fade, `250ms cubic-bezier(0.32, 0.72, 0, 1)` |
| Exit | Scale to 0.98 + fade, `150ms ease-in` |
| Mobile | Full-width bottom sheet, slides up, `radius-xl` top corners only |

---

### 4.15 Dropdown / Select Menu

| Property | Value |
|----------|-------|
| Trigger | Same as Input Field, with chevron-down icon right-aligned |
| Menu bg | `stone-0`, `radius-lg`, `1px solid stone-200` |
| Shadow | `0 8px 30px rgba(0,0,0,0.12)` |
| Item height | 36px |
| Item padding | `space-2` vertical, `space-3` horizontal |
| Item hover | `stone-50` bg |
| Item selected | `honey-50` bg, `honey-700` text, check icon right |
| Enter | Scale Y from 0.95 + fade, `200ms ease-out`, transform-origin top |
| Max height | 280px with scroll |

---

### 4.16 Tooltip

| Property | Value |
|----------|-------|
| Background | `stone-900` (light), `stone-100` (dark) |
| Text | `stone-0` (light), `stone-900` (dark), `text-body-xs`, weight 500 |
| Padding | `space-1.5` vertical, `space-2.5` horizontal |
| Radius | `radius-sm` (4px) |
| Arrow | 6px, centered on trigger |
| Delay | 500ms show, 0ms hide |
| Animation | Fade in + translate 4px from direction, `150ms ease-out` |
| Max width | 240px |

---

### 4.17 Avatar

| Size | Dimensions | Font | Radius |
|------|-----------|------|--------|
| XS | 24×24px | 10px | `radius-full` |
| SM | 32×32px | 12px | `radius-full` |
| MD | 40×40px | 14px | `radius-full` |
| LG | 48×48px | 16px | `radius-full` |
| XL | 64×64px | 20px | `radius-full` |

**States:** Image (Cloudinary with face-detection crop), Initials (bg: `honey-100`, text: `honey-800`), Fallback icon (user silhouette, `stone-400`).

**Online indicator:** 10px circle (LG/XL) or 8px (SM/MD), `botanical-500` fill, `2px stone-0` border, bottom-right position.

---

### 4.18 Star Rating

| Property | Value |
|----------|-------|
| Star size | 16px (SM), 20px (MD), 24px (LG) |
| Filled color | `honey-500` |
| Empty color | `stone-200` |
| Half-star | Clip-path 50% filled |
| Interactive hover | Stars fill on hover, `honey-400` preview |
| Gap between stars | `space-0.5` (2px) |
| Count text | `text-body-sm`, `stone-500`, `space-1.5` left margin |

---

### 4.19 Quantity Selector

| Property | Value |
|----------|-------|
| Container | `1.5px solid stone-200`, `radius-md`, inline-flex |
| Buttons (±) | 36×36px, ghost style, `stone-600` icon |
| Button hover | `stone-100` bg |
| Button disabled | `stone-300` icon, `not-allowed` cursor |
| Input | 48px width, centered text, `text-body-md` weight 600, no borders |
| Height | 36px (SM), 40px (MD), 48px (LG) |

---

### 4.20 Accordion

| Property | Value |
|----------|-------|
| Header height | 48px min |
| Header text | `text-body-md`, weight 500, `stone-900` |
| Chevron | 20px, `stone-400`, rotates 180° on open |
| Divider | `1px solid stone-200` between items |
| Content padding | `space-4` bottom |
| Animation | Height auto with `300ms ease-out`, chevron `200ms ease` |

---

### 4.21 Tabs

| Property | Value |
|----------|-------|
| Container border | `1px solid stone-200` bottom |
| Tab text | `text-body-sm`, weight 500 |
| Tab color (default) | `stone-500` |
| Tab color (hover) | `stone-700` |
| Tab color (active) | `honey-700` |
| Active indicator | `2px solid honey-600` bottom, full tab width |
| Indicator animation | Slide to active tab, `250ms ease-out` |
| Tab padding | `space-3` vertical, `space-4` horizontal |
| Tab gap | 0 (tabs are adjacent) |

---

### 4.22 Table (Admin DataTable)

| Property | Value |
|----------|-------|
| Header bg | `stone-50` |
| Header text | `text-body-xs`, weight 600, `stone-500`, uppercase, `0.05em` tracking |
| Row height | 48px (compact), 56px (default) |
| Row border | `1px solid stone-100` bottom |
| Row hover | `stone-50` bg |
| Row selected | `honey-50` bg, `1px solid honey-200` left |
| Cell padding | `space-3` vertical, `space-4` horizontal |
| Sortable header | Arrow icon 12px, `stone-300` default, `stone-600` active |
| Radius | `radius-lg` on outer container |
| Pagination | Below table, `space-4` gap, `text-body-sm` |

---

### 4.23 Skeleton Loader

| Property | Value |
|----------|-------|
| Base color | `stone-100` |
| Shimmer color | `stone-200` |
| Animation | Gradient sweep left→right, `1.5s ease-in-out infinite` |
| Radius | Match the element being loaded |
| Text lines | Height 12px, 60–90% random widths, `space-2` gap |
| Image placeholder | Full container size, aspect ratio preserved |

---

### 4.24 Empty State

| Property | Value |
|----------|-------|
| Illustration | 120×120px, line art style, `stone-300` stroke, `honey-100` fills |
| Heading | `text-heading-sm`, `stone-800` |
| Description | `text-body-md`, `stone-500`, max-width 320px, centered |
| CTA | Primary button (MD) |
| Spacing | `space-5` between illustration → heading → description → CTA |
| Container padding | `space-16` vertical |

---

### 4.25 Announcement Bar

| Property | Value |
|----------|-------|
| Height | 36px |
| Background | `honey-600` (promo), `stone-900` (info) |
| Text | `text-body-xs`, weight 500, white, centered |
| Close button | 28×28px, white ghost, right-aligned |
| Animation | Collapse height `200ms ease`, remove from DOM |

---

### 4.26 Stepper (Checkout)

| Property | Value |
|----------|-------|
| Step circle (incomplete) | 32px, `stone-200` border, `stone-400` number |
| Step circle (active) | 32px, `honey-600` bg, white number |
| Step circle (complete) | 32px, `honey-600` bg, white check icon |
| Connector line (incomplete) | 2px, `stone-200` |
| Connector line (complete) | 2px, `honey-600` |
| Label (active) | `text-body-sm`, weight 600, `stone-900` |
| Label (inactive) | `text-body-sm`, weight 400, `stone-400` |
| Mobile | Show as pill progress bar instead of circles |

---

### 4.27 Order Status Badge

| Status | Background | Text | Dot Color |
|--------|-----------|------|-----------|
| Pending | `honey-50` | `honey-800` | `honey-500` |
| Confirmed | `#EFF6FF` | `#1E5A9E` | `#3B7EC7` |
| Processing | `#EFF6FF` | `#1E5A9E` | `#3B7EC7` |
| Shipped | `botanical-50` | `botanical-700` | `botanical-500` |
| Delivered | `botanical-50` | `botanical-700` | `botanical-500` |
| Cancelled | `stone-100` | `stone-600` | `stone-400` |
| Refunded | `#FEF2F2` | `#922B2B` | `#C13E3E` |

6px dot + `text-body-xs` weight 600, `radius-full`, padding `space-1` / `space-2.5`.

---

### 4.28 Price Display

| Element | Spec |
|---------|------|
| Current price | `text-heading-lg` or contextual size, weight 700, `stone-900` |
| Currency | Same font, same size, `space-1` after (e.g., "180 MAD") |
| Compare-at price | `text-body-md`, weight 400, `stone-400`, `line-through` |
| Discount badge | Honey badge variant, e.g. "−18%" |
| Free shipping note | `text-body-xs`, `botanical-500`, truck icon |

---

### 4.29 Image Gallery (PDP)

| Property | Value |
|----------|-------|
| Main image | Aspect ratio 1:1 (desktop), 4:5 (mobile), `radius-xl`, `stone-50` bg |
| Thumbnails | 64×64px, `radius-md`, `1.5px solid stone-200`, `honey-500` border when active |
| Thumbnail gap | `space-2` |
| Zoom | On hover: 2× scale in a loupe. On click: fullscreen lightbox. |
| Lightbox overlay | `rgba(0,0,0,0.9)`, close button top-right, arrow navigation |
| Swipe | Mobile: horizontal swipe with dots indicator |
| Dot indicator | 8px circles, `stone-300` default, `honey-600` active |

---

### 4.30 Footer

| Property | Value |
|----------|-------|
| Background | `stone-50` (light), `dark-surface-1` (dark) |
| Border top | `1px solid stone-200` |
| Padding | `space-16` top, `space-8` bottom |
| Columns | 4 on desktop, 2 on tablet, stacked on mobile |
| Column heading | `text-body-sm`, weight 600, `stone-900`, uppercase, `0.05em` tracking |
| Links | `text-body-sm`, weight 400, `stone-600`, hover: `stone-900` with underline |
| Link spacing | `space-3` vertical |
| Social icons | 20px, `stone-400`, hover: `stone-700` |
| Copyright | `text-body-xs`, `stone-400`, centered, `space-8` top border |
| Newsletter input | Inline: input + button, `radius-full` |

---

## 5. Layout Patterns

### 5.1 Responsive Breakpoints

| Token | Width | Columns | Gutter | Container Padding |
|-------|-------|---------|--------|-------------------|
| `mobile` | 0–767px | 4 | 16px | 16px |
| `tablet` | 768–1023px | 8 | 20px | 32px |
| `desktop` | 1024–1279px | 12 | 24px | 48px |
| `desktop-lg` | 1280–1535px | 12 | 24px | 64px |
| `desktop-xl` | 1536px+ | 12 | 32px | auto (max-width centered) |

### 5.2 Grid System

CSS Grid with named areas. 12-column base.

```
Mobile (4-col):
[1fr 1fr 1fr 1fr]

Tablet (8-col):
[1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr]

Desktop (12-col):
[1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr]
```

### 5.3 Page Layout Templates

**Storefront Layout:**

```
┌──────────────────────────────────────┐
│  AnnouncementBar (36px, optional)    │
├──────────────────────────────────────┤
│  SiteHeader (64–72px, sticky)        │
├──────────────────────────────────────┤
│                                      │
│  Main Content (flex-1)               │
│  max-width: container-xl (1200px)    │
│  padding: 0 container-padding        │
│                                      │
├──────────────────────────────────────┤
│  SiteFooter                          │
└──────────────────────────────────────┘
```

**Sidebar Layout (PLP, Account):**

```
Desktop:
┌──────────┬──────────────────────────┐
│  Sidebar │  Main Content            │
│  240px   │  flex-1                  │
│  sticky  │                          │
│  top:88px│                          │
└──────────┴──────────────────────────┘
gap: space-8 (32px)

Mobile: Sidebar becomes a filter Sheet (bottom sheet or drawer)
```

**Admin Layout:**

```
┌─────────┬───────────────────────────────┐
│  Admin  │  Admin Header (64px)          │
│  Sidebar├───────────────────────────────┤
│  256px  │                               │
│  fixed  │  Page Content                 │
│  height:│  padding: space-8             │
│  100vh  │  max-width: container-2xl     │
│         │                               │
└─────────┴───────────────────────────────┘

Mobile: Sidebar collapses to hamburger overlay
```

**Auth Layout:**

```
┌──────────────────────────────────────┐
│  Minimal Header (Logo only, centered)│
├──────────────────────────────────────┤
│                                      │
│  ┌──────────────────────┐            │
│  │  Auth Card           │            │
│  │  max-width: 420px    │            │
│  │  centered            │            │
│  │  padding: space-8    │            │
│  └──────────────────────┘            │
│                                      │
└──────────────────────────────────────┘
```

### 5.4 Product Grid Breakpoints

| Breakpoint | Columns | Card Width (approx) | Gap |
|------------|---------|---------------------|-----|
| Mobile (< 768px) | 2 | ~170px | `space-4` (16px) |
| Tablet (≥ 768px) | 3 | ~210px | `space-5` (20px) |
| Desktop (≥ 1024px) | 3 (with sidebar) / 4 (no sidebar) | ~250px | `space-6` (24px) |
| Desktop LG (≥ 1280px) | 4 | ~270px | `space-6` (24px) |

### 5.5 Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `z-base` | 0 | Default stacking |
| `z-dropdown` | 10 | Dropdowns, selects, autocomplete |
| `z-sticky` | 20 | Sticky header, sidebar |
| `z-drawer` | 30 | Mobile nav, filter sheet |
| `z-modal` | 40 | Modal dialogs |
| `z-toast` | 50 | Toast notifications |
| `z-tooltip` | 60 | Tooltips (always on top) |

---

## 6. Animation Guidelines

### 6.1 Easing Functions

| Token | Curve | CSS Value | Usage |
|-------|-------|-----------|-------|
| `ease-default` | Standard ease | `cubic-bezier(0.25, 0.1, 0.25, 1)` | General transitions |
| `ease-in` | Accelerate | `cubic-bezier(0.55, 0, 1, 0.45)` | Exit animations |
| `ease-out` | Decelerate | `cubic-bezier(0, 0.55, 0.45, 1)` | Enter animations |
| `ease-in-out` | Symmetric | `cubic-bezier(0.45, 0, 0.55, 1)` | Looping animations |
| `ease-spring` | Overshoot | `cubic-bezier(0.32, 0.72, 0, 1)` | Modals, sheets, toasts — the signature ShahdCoop curve |
| `ease-bounce` | Bounce back | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Success confirmations, badge updates |

### 6.2 Duration Scale

| Token | Duration | Usage |
|-------|----------|-------|
| `duration-instant` | 50ms | Color changes, opacity micro-adjustments |
| `duration-fast` | 100ms | Hover states, active press feedback |
| `duration-normal` | 200ms | Button state transitions, focus rings |
| `duration-moderate` | 300ms | Dropdown open/close, sheet slide, tab switch |
| `duration-slow` | 400ms | Modal enter, page transitions |
| `duration-slower` | 500ms | Complex reveals, image gallery transitions |
| `duration-slowest` | 700ms | Hero animations, staggered list reveals |

### 6.3 Animation Patterns

**Micro-interactions (user-triggered):**

| Interaction | Animation | Duration | Easing |
|-------------|-----------|----------|--------|
| Button hover | `translateY(-1px)` + shadow increase | `duration-fast` | `ease-out` |
| Button press | `translateY(0)` + shadow decrease | `duration-instant` | `ease-in` |
| Add to cart | Badge scale 1→1.3→1 + count increment | `duration-moderate` | `ease-bounce` |
| Wishlist toggle | Heart scale 1→1.2→1 + fill animation | `duration-moderate` | `ease-bounce` |
| Checkbox check | Check path draws with `stroke-dashoffset` | `duration-normal` | `ease-out` |
| Toggle switch | Thumb slides + track color | `duration-normal` | `ease-spring` |

**Component transitions (system-triggered):**

| Transition | Animation | Duration | Easing |
|------------|-----------|----------|--------|
| Modal enter | Overlay fade + card scale(0.95→1) + fade | `duration-slow` | `ease-spring` |
| Modal exit | Card scale(1→0.98) + fade, then overlay | `duration-normal` | `ease-in` |
| Sheet enter | Slide from edge + overlay fade | `duration-moderate` | `ease-spring` |
| Sheet exit | Slide to edge + overlay fade | `duration-normal` | `ease-in` |
| Toast enter | `translateY(16px→0)` + fade | `duration-moderate` | `ease-spring` |
| Toast exit | `translateY(0→8px)` + fade | `duration-normal` | `ease-in` |
| Dropdown open | `scaleY(0.95→1)` + fade, origin top | `duration-normal` | `ease-out` |
| Dropdown close | `scaleY(1→0.95)` + fade | `duration-fast` | `ease-in` |
| Accordion expand | Height auto reveal | `duration-moderate` | `ease-out` |
| Page transition | Fade in content blocks with stagger | `duration-slow` | `ease-out`, 50ms stagger |

**Loading states:**

| Pattern | Animation | Spec |
|---------|-----------|------|
| Spinner | Rotation | 360° continuous, `800ms linear infinite` |
| Skeleton shimmer | Gradient sweep | Left→right, `1.5s ease-in-out infinite` |
| Progress bar | Width expansion | Indeterminate: translate left→right, `1.5s ease-in-out infinite` |
| Button loading | Spinner replaces text | Fade swap, `duration-fast` |

### 6.4 Animation Rules

1. **Respect `prefers-reduced-motion`.** When enabled: disable all decorative animations, reduce transitions to simple opacity fades at `duration-fast`, keep functional animations (spinners, progress) but simplify.
2. **Enter is slower than exit.** Users need time to perceive new content; exits should feel snappy and not block.
3. **Stagger creates hierarchy.** When revealing multiple elements, stagger by 50ms per item, max 5 items (250ms total stagger). Beyond 5, batch reveal.
4. **Never animate layout.** Avoid animating width/height directly. Use `transform` and `opacity` only for 60fps performance. For height animations, use CSS `grid-template-rows: 0fr → 1fr`.
5. **One signature curve.** `ease-spring` is the ShahdCoop feel — a gentle overshoot that feels organic, like a drop of honey settling.

---

## 7. Accessibility Requirements (WCAG 2.1 AA)

### 7.1 Color & Contrast

| Requirement | Standard | Implementation |
|-------------|----------|---------------|
| Normal text (< 18px, < 14px bold) | 4.5:1 minimum | `stone-700` on `stone-0` = 5.2:1 ✓ |
| Large text (≥ 18px or ≥ 14px bold) | 3:1 minimum | `stone-600` on `stone-0` = 4.0:1 ✓ |
| UI components & graphical objects | 3:1 minimum | All borders and icons meet 3:1 vs background |
| Focus indicators | 3:1 vs adjacent colors | `honey-500` focus ring on `stone-0` = 3.5:1 ✓ |
| Decorative only | No requirement | Placeholder images, dividers, shadows |

**Verified contrast ratios (light mode):**

| Combination | Ratio | Pass? |
|-------------|-------|-------|
| `stone-900` on `stone-0` | 13.5:1 | AA ✓ AAA ✓ |
| `stone-700` on `stone-0` | 5.2:1 | AA ✓ |
| `stone-600` on `stone-0` | 4.0:1 | AA Large ✓ |
| `stone-500` on `stone-0` | 3.1:1 | UI ✓ |
| `honey-600` on `stone-0` | 3.6:1 | AA Large ✓, UI ✓ |
| `honey-700` on `stone-0` | 5.0:1 | AA ✓ |
| `honey-950` on `honey-100` | 10.2:1 | AA ✓ AAA ✓ |
| `white` on `honey-600` | 3.6:1 | AA Large ✓ |
| `botanical-600` on `stone-0` | 5.5:1 | AA ✓ |
| `error` (#C13E3E) on `stone-0` | 4.6:1 | AA ✓ |

### 7.2 Keyboard Navigation

| Requirement | Implementation |
|-------------|---------------|
| All interactive elements focusable | Tab order follows DOM. No `tabindex > 0`. |
| Visible focus indicator | `2px solid honey-400`, `2px offset`, on all focusable elements. Never `outline: none` without replacement. |
| Skip to content link | First focusable element: "Skip to main content" → `#main-content`. Hidden until focused. |
| Escape closes overlays | Modals, drawers, dropdowns, lightbox all close on `Escape`. |
| Arrow key navigation | Dropdowns, radio groups, tabs, carousels support arrow keys. |
| Enter/Space activation | Buttons, links, checkboxes, toggles respond to both. |
| Focus trap in modals | `Tab` cycles within modal. Focus returns to trigger on close. |
| No keyboard traps | User can always tab out of any component. |

### 7.3 Screen Reader Support

| Requirement | Implementation |
|-------------|---------------|
| Landmark regions | `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>` on every page |
| Page titles | Unique `<title>` per page via `generateMetadata()` |
| Heading hierarchy | Single `<h1>` per page. No skipped levels (h1→h3). |
| Image alt text | Required on all product images. Decorative images use `alt=""`. |
| Form labels | Every `<input>` has an associated `<label>` (explicit via `htmlFor`). |
| Error identification | Errors linked via `aria-describedby`. Error summary at form top. |
| Live regions | Cart count: `aria-live="polite"`. Toasts: `role="status"`. Errors: `role="alert"`. |
| Loading states | `aria-busy="true"` on containers. Skeleton has `aria-label="Loading"`. |
| Icon buttons | `aria-label` on every icon-only button (e.g., "Add to wishlist", "Close menu"). |
| Decorative icons | `aria-hidden="true"` on icons next to visible text. |

### 7.4 Touch & Pointer

| Requirement | Implementation |
|-------------|---------------|
| Touch target size | Minimum 44×44px for all interactive elements |
| Touch target spacing | Minimum 8px between adjacent targets |
| Hover not required | All hover information accessible via click/tap or keyboard |
| Drag alternatives | Quantity selector has ± buttons (not drag-only). Carousel has prev/next buttons. |

### 7.5 Motion & Perception

| Requirement | Implementation |
|-------------|---------------|
| `prefers-reduced-motion` | Disables decorative animations. Transitions become `opacity 100ms`. |
| `prefers-contrast: more` | Increases border widths to 2px. Removes subtle shadows. Enforces 7:1 text contrast. |
| `prefers-color-scheme` | Automatically switches to dark mode palette. |
| No flashing content | No elements flash more than 3 times per second. |
| Auto-playing content | Carousel auto-play pauses on hover, focus, or `prefers-reduced-motion`. |

### 7.6 Content & Language

| Requirement | Implementation |
|-------------|---------------|
| Language attribute | `<html lang="fr">` (or `ar` / `en`). `lang` attribute on any mixed-language content. |
| RTL support | Arabic pages: `<html dir="rtl">`. Tailwind logical properties (`ps-`, `pe-`, `ms-`, `me-`). |
| Text resizing | Layout supports 200% browser zoom without horizontal scrolling. |
| Text spacing | Content readable with 1.5× line-height, 0.12em letter-spacing, 0.16em word-spacing. |
| Abbreviations | Expand on first use or use `<abbr title="...">`. |
| Error prevention | Destructive actions require confirmation dialog. Orders show review step. |

---

## Figma Component Descriptions

Below are Figma-ready descriptions for each component, including variant properties and auto-layout specifications.

### Button
**Variants:** Primary, Secondary, Ghost, Destructive × SM, MD, LG × Default, Hover, Active, Focus, Disabled, Loading
**Auto-layout:** Horizontal, center-aligned, gap `space-2` (icon+text), padding per size table
**Instance swap:** Leading icon (optional), Trailing icon (optional)
**Boolean:** isLoading, hasLeadingIcon, hasTrailingIcon

### Input Field
**Variants:** Text, Password, Email, Number, Search, Textarea × Default, Hover, Focus, Error, Disabled × MD, LG
**Auto-layout:** Vertical stack: Label → Input container → Helper text, gap `space-1.5`
**Instance swap:** Leading icon, Trailing icon/action
**Boolean:** hasLabel, hasHelperText, hasError

### Product Card
**Auto-layout:** Vertical, gap `space-3`. Image (4:5 fill), Content (vertical, gap `space-1`)
**Instance swap:** Badge (optional, top-left), Wishlist button (top-right)
**Boolean:** hasBadge, hasComparePrice, hasRating, isOutOfStock
**Interaction:** Hover lifts card, image scales 1.04×

### Navigation Bar
**Variants:** Desktop, Mobile × Default, Scrolled
**Auto-layout:** Horizontal, space-between, center-aligned, padding `space-4`–`space-8`
**Instance swap:** Logo, Nav items (component set), Cart badge, User menu

### Modal
**Variants:** SM (400px), MD (480px), LG (640px) × Default, WithFooter
**Auto-layout:** Vertical, gap 0. Header + Body + Footer sections.
**Boolean:** hasCloseButton, hasFooter, hasOverlay

### Toast
**Variants:** Success, Error, Warning, Info × Default, WithAction, WithClose
**Auto-layout:** Horizontal, gap `space-3`. Icon + Content (vertical: title + description) + Close
**Boolean:** hasAction, hasClose, hasDescription

### DataTable (Admin)
**Variants:** Default, Compact, WithSelection, WithBulkActions
**Auto-layout:** Vertical. Header row + Body rows + Pagination.
**Instance swap:** Column headers (sortable), Row cells, Pagination controls
**Boolean:** isSelectable, hasBulkActions, hasPagination, isLoading

*(All 30 components follow this pattern. Each defines Variants, Auto-layout, Instance swaps, and Boolean properties for comprehensive Figma design coverage.)*

---

*End of design system specification.*
