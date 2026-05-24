# Stitch Design Audit — Huainanzi Parallel Reading Interface

Source: Stitch project `8718869401301488713`, design system "Scholarly Minimalist". Six visible screens analyzed: 1-single-parallel, 2-modals, 3-default-rhyme, 4-annotation, 5-multi-popover, 6-baseline (in `stitch-design/screens/`, screenshots in `stitch-design/screenshots/`).

**Rule:** anywhere this audit disagrees with the build spec, the audit wins (Stitch is single source of truth). Anywhere the audit is silent, fall back to spec.

---

## 1. Top bar

- **Height:** `56px` fixed. `position: fixed; top: 0; z-index: 50`.
- **Background:** `#F9F9FB` (Stitch `surface-bright`). Bottom border `1px solid #C7C6CA` (`outline-variant`).
- **Horizontal padding:** `px-4` mobile, `px-10` (`margin-desktop`) desktop.

### Element order, left → right

| Slot | Element                       | Style                                                         |
| ---- | ----------------------------- | ------------------------------------------------------------- |
| L1   | Menu icon (sidebar toggle)    | Material `menu` glyph, `#46464A`                              |
| L2   | "Intertextuality" wordmark    | Noto Serif SC, 24px / 600, `#1A1C1D`                          |
| M    | Search input                  | flex-1, max-w-md, mx-8, see §1.1                              |
| R1   | Swap-panels icon button       | `swap_horiz`, 36×36, rounded-full, hover `surface-container-high`, hidden when panel closed |
| R2   | Language icon button          | `language` (globe), 36×36, rounded-full, click cycles zh↔en   |
| R3   | Rhyme / Prose pill toggle     | see §1.2                                                       |
| R4   | Chapter selector icon button  | `tune`, 36×36, rounded-full — opens chapter dropdown          |
| R5   | Settings icon button          | `settings` (gear), 36×36, rounded-full — opens mode dropdown  |
| R6   | Report icon button            | `contact_support`, 36×36, rounded-full                        |
| R7   | Login outlined button         | h-36, px-4, rounded-lg, `bg-surface-container`, border `outline-variant`, Inter 14/500 |
| R8   | Annotate primary button       | h-36, px-4, rounded-lg, `bg-#0071E3`, white text, Inter 14/500 |

Group spacing: `gap-2` between icon buttons, `ml-2` before Login and before Annotate.

### 1.1 Search input

- height 36px, full-width within max-w-md, mx-8.
- left-padding 36px to accommodate inline `search` icon at `left-3`, color `#46464A`, size 18px.
- background `#F3F3F5` (surface-container-low).
- border `1px solid #C7C6CA`, radius 8px.
- text Inter 13/400 (`ui-small`), placeholder `#46464A`.
- focus: border `#2D83F6` + ring 1px same.

### 1.2 Rhyme / Prose pill toggle

- Outer: `bg-#E8E8EA` (surface-container-high), `p-1`, `rounded-full`.
- Buttons inside: `px-4 py-1.5`, `rounded-full`, Inter 14/500.
- Active button: `bg-#2D83F6`, white text, subtle shadow.
- Inactive button: `text-#46464A` (on-surface-variant), hover `text-#1A1C1D`.

Same pill pattern reusable for any future binary toggle.

---

## 2. Sidebar

- **Width:** 280px, fixed left at `top: 56px`, `height: calc(100vh - 56px)`.
- **Background:** `#F3F3F5` (surface-container-low). Right border `1px solid #C7C6CA`.
- **Padding-top:** 16px.

### Header block (px-4, mb-6)

- Heading "Parallel Texts" — Noto Serif SC 24/600, `#1A1C1D`.
- Caption "Compare textual variants" — Inter 12/400 letter-spacing 0.01em, `#46464A`, mt-1.

### List items

Each `<a>` is `flex items-center gap-3 py-3 px-4`. **All texts always have a coloured dot** (saturated 8px circle). State is conveyed by background + text color + left border bar.

| State                                          | Background        | Text color    | Left bar             | Font weight |
| ---------------------------------------------- | ----------------- | ------------- | -------------------- | ----------- |
| Has parallels in chapter, **not currently viewed** | none              | `#46464A`     | none                 | normal      |
| Has parallels in chapter, **currently viewed**     | `#EEEEF0` (surface-container) | `#1A1C1D` | 4px solid `#2D83F6` | bold        |
| **No parallels in chapter** (greyed)               | none              | `#86868B`     | none, dot at opacity 0.35 | normal italic |
| Hover (any state, not currently viewed)        | `#E8E8EA` (surface-container-high) | inherits | inherits | inherits |

Title text uses Inter 14/500 (`label-ui`), `truncate`.

### Dot palette (saturated, used in sidebar + popovers)

| Text          | Dot       |
| ------------- | --------- |
| Laozi         | `#FF7F50` |
| Zhuangzi      | `#4CAF50` |
| Lushi Chunqiu | `#2196F3` |
| Wenzi         | `#9C27B0` |
| Guanzi        | `#FF9800` |
| Hanfeizi      | `#009688` |
| Shanhaijing   | `#E91E63` |
| Shiji         | `#FFC107` (adjusted from #FFEB3B for legibility) |

---

## 3. Main text area

- Centered column, `max-width: 720px` (`reading-column-max`), `mx-auto`.
- Padding: `px-12 py-24` desktop; `px-6 py-16` mobile.
- Background: `#FFFFFF` (`surface-container-lowest`) — pure white.
- `scroll-margin-top: 56px` on each segment.

### Chapter header (centered, mb-16)

- Eyebrow "HUAINANZI" — Inter 14/500 uppercase, `tracking: 0.2em`, `#46464A`, mb-4.
- Title 原道訓 — Noto Serif SC 40/700, `#1A1C1D`, mb-6, line-height 1.2, letter-spacing -0.02em.
- Subtitle "Yuandao Xun - Originating in the Way" — Noto Serif SC 24/600 italic, `#46464A`.
- Divider line below: `w-12 h-[1px] bg-#C7C6CA mx-auto mt-8`.
- The 原道訓 title is the **chapter selector trigger** — click to open dropdown (see §6).

### Body paragraphs

- Container `<article>` with `space-y-8`.
- Text: Noto Serif SC 18/400, line-height 2.0 (`body-reading`), color `#1A1C1D`.
- Each `<p>` has `class="relative"` to host margin indicators.

### Segment highlights

Highlights are inline `<span>`s wrapping the relevant phrase, **not** wrapping the whole paragraph.

- **Single parallel:** `<span class="rounded px-1" style="background: #<highlight-hex>;">…</span>`. Radius `4px`.
- **Multi parallel:** `<span class="rounded px-1" style="background: linear-gradient(to right, #c1 50%, #c2 50%);">…</span>`. Sharp 50/50 split. For 3+ parallels: extend gradient with equal stops (e.g. `c1 33%, c2 33% 66%, c3 66%`).
- **Hover:** `hover:bg-opacity-80` → equivalently filter `brightness(0.95)` on inline-bg variant; `cursor: pointer`.
- **Selected (currently viewed in panel):** add an `outline: 2px solid #2D83F6` + `outline-offset: 1px`. Stitch HTML doesn't enumerate this; this is the spec's "stronger ring" treatment.
- **Pulse (after sidebar/search jump):** brief opacity 0.5 → 1 ramp over 600ms.

### Highlight (background) palette — tinted

| Text          | Highlight bg |
| ------------- | ------------ |
| Laozi         | `#FDDCD5`    |
| Zhuangzi      | `#D2F0EE`    |
| Lushi Chunqiu | `#E5D5FD`    |
| Wenzi         | `#FDF0D5`    |
| Guanzi        | `#D5FDD8`    |
| Hanfeizi      | `#CCE5E3`    |
| Shanhaijing   | `#FBD9E5`    |
| Shiji         | `#FFF4CC`    |

(Laozi/Zhuangzi/Lushi/Wenzi/Guanzi from Stitch HTML observed directly; Hanfeizi/Shanhaijing/Shiji derived from their saturated dot at low saturation to match family.)

### Left-margin parallel bar (optional, observed)

When a paragraph has any parallel, Stitch optionally adds a 2px wide vertical bar at `-left-6`, `top-2 bottom-2`, `rounded-full`, colored with the parallel's highlight. Helpful for skim-reading. Implement as an inline pseudo-marker per segment.

---

## 4. Parallel panel

- Slides in from right. Width: ~50% of viewport (main shrinks to remaining ~50%). 300ms ease transition.
- Header layout: chapter eyebrow → title (e.g. 老子 / Dao De Jing) → italic subtitle; close × on top-right corner. Same typography as main-text chapter header but slightly smaller (use `headingMd` 24px for title).
- Body: full chapter rendered same way as main; the matched segment gets `outline: 2px solid #2D83F6`.
- Visual separation from main: left edge has a 1px solid border `#C7C6CA`. No heavy shadow.
- **When panels swapped:** parallel column moves to left, main to right. Border switches sides.

---

## 5. Popovers

### Generic popover anatomy

- `bg: #FFFFFF`, `border: 1px solid #C7C6CA`, `border-radius: 8px`.
- Shadow: `0 2px 8px rgba(0,0,0,0.08)` (Level 2).
- **No caret** — Stitch popovers are floating cards without arrows in the screens reviewed.
- Padding: `py-2 px-0` outer; rows have own `py-2.5 px-3` padding.
- Fade-in 150ms.

### Multi-parallel popover (screen 5)

- Anchored adjacent to the clicked segment (right side, vertically centered to segment).
- Header strip: `px-3 pt-3 pb-2`, Inter 12/500 uppercase tracking 0.05em color `#86868B`. Text "FOUND IN N OTHER TEXTS".
- Rows: `flex items-center gap-3 py-2.5 px-3`. Left: 8px dot. Center: Romanized name (Inter 14/500 `#1A1C1D`) + small zh title (Inter 13/400 `#46464A`).
- Hover row: `bg-#F3F3F5`.

---

## 6. Modals

### Generic modal

- Backdrop: `rgba(0,0,0,0.32)` over full viewport, fade-in 200ms.
- Card: centered, `bg-#FFFFFF`, `border-radius: 12px`, shadow `0 4px 24px rgba(0,0,0,0.12)` (Level 3).
- Close × in top-right, `material-symbols-outlined "close"`, 20px, `#46464A`.
- Card scale-up 200ms from 0.96 → 1 on open.

### Login modal (~360px wide)

- Top: 56px round avatar circle with `person` icon, centered.
- Title "Welcome Back" — Noto Serif SC 24/600 centered.
- Subtitle "Sign in to sync your annotations." — Inter 14/400 `#46464A` centered.
- Field stack `space-y-3`:
  - "Email" label Inter 12/500 `#46464A`, then input.
  - "Password" label, then input.
  - Input style: full-width, height 40px, border `1px solid #C7C6CA`, radius 8px, padding x-3, Inter 14/400.
- "Log In" primary button: full-width, height 40px, `bg-#0071E3`, white, radius 8px, Inter 14/500.
- Footer link "Don't have an account? Sign Up" — Inter 13/400 `#46464A`, "Sign Up" colored `#0071E3`. Centered, mt-3.
- Card padding `p-8`.

### Report Issue modal (~480px wide)

- Title "Report Issue" — Noto Serif SC 24/600 left-aligned. Close × top-right.
- Subtitle "Notice an error in the text? Let us know." Inter 14/400 `#46464A`, mb-5.
- Row: Name and Email side-by-side `grid-cols-2 gap-3`, each with label above.
- Message textarea below, 4 rows, same input style.
- Footer: Cancel (text-button Inter 14/500 `#46464A`) + Submit (`bg-#0071E3` button) — right-aligned `gap-2`.

### Annotation popover (modal-styled but anchored / centered to segment, ~360px wide; screen 4)

- Card same as modal style. Title "New Annotation" Noto Serif SC 24/600. Close × top-right.
- Textarea: 3-4 rows, "Enter comment here..." placeholder.
- Footer: Cancel + Save (blue), right-aligned.

---

## 7. Settings dropdown (screen 2)

Triggered by `settings` gear icon, anchored top-right under it.

- Card: white, 8px radius, Level-2 shadow, border `#C7C6CA`. Width ~240px.
- Header: "VIEW OPTIONS" Inter 12/500 uppercase `#86868B` tracking 0.05em. px-4 pt-3 pb-1.
- Two rows, each `flex items-start gap-3 px-4 py-3 hover:bg-#F3F3F5 cursor-pointer`:
  - Left: filled radio circle (8px outer ring + 6px inner filled circle in accent if active; outer ring only if inactive).
  - Right column:
    - Title Inter 14/500 `#1A1C1D` ("Normal Mode" / "Research Mode").
    - Description Inter 13/400 `#46464A` ("Spacious editorial default" / "Dense view with marginalia").

---

## 8. Chapter selector dropdown (anchored to `tune` icon, screen 2)

- Card: white, 8px radius, Level-2 shadow, border `#C7C6CA`. Width ~200px.
- Rows: `px-4 py-2.5 flex flex-col gap-0` `hover:bg-#F3F3F5`. Chinese title Inter 14/500 `#1A1C1D`. Optional English subtitle Inter 12/400 `#46464A` below.
- Active row: `bg-#F3F3F5` + accent-colored bullet to left, or `border-l-2 border-#2D83F6` and `font-bold`.

---

## 9. Annotation mode

- Active state of AnnotateButton: stays blue `#0071E3` but adds an inner ring or slightly darkened bg `#005ec0` to indicate "mode on". (The top-bar Annotate button is always-blue in baseline screen — it functions as both action and toggle.)
- Margin dot indicators: 8px circle at `right: -1.5rem` of segment paragraph, colored `#0071E3`, vertically centered. Count badge if >1 annotation: small `bg-white border border-#C7C6CA rounded-full text-12/500` chip.
- When `annotationMode === true`, clicking a segment opens the Annotation popover.

---

## 10. Toast

Not present in Stitch screens but follows system style:

- Bottom-center, `bg-#1A1C1D` (inverse-surface tone) text white, Inter 14/500, radius 8px, padding `py-3 px-4`, shadow Level-2.
- Auto-dismiss 3s. Slide-up + fade 200ms in, fade-out 200ms.

---

## 11. Color tokens (final, to encode in `tokens.ts`)

```
primary text         #1A1C1D   (on-surface)
secondary text       #46464A   (on-surface-variant)
muted text           #86868B
background (canvas)  #FFFFFF
surface (chrome bg)  #F9F9FB / #F3F3F5
container layers     #EEEEF0 / #E8E8EA
border               #C7C6CA   (outline-variant)
border-strong        #77767B   (outline)
accent / primary     #0071E3   (primary action)
accent-bright        #2D83F6   (toggle on / focus / left bar)
success              #34C759
error                #BA1A1A
```

The two blues: `#0071E3` is the brand primary (used on buttons), `#2D83F6` is the brighter active-state shade (used on toggles, left-borders, focus rings, segment outline). Tokens will expose both as `accent` and `accentBright`.

## 12. Typography tokens (final)

| Token        | Family            | Size | Weight | Line-height | Notes                |
| ------------ | ----------------- | ---- | ------ | ----------- | -------------------- |
| `displayLg`  | Noto Serif SC     | 40   | 700    | 1.2         | letter-spacing -.02em |
| `headingMd`  | Noto Serif SC     | 24   | 600    | 1.4         |                      |
| `zhBody`     | Noto Serif SC     | 18   | 400    | 2.0         | classical text       |
| `enBody`     | Noto Serif SC     | 16   | 400    | 1.8         | English (italic for translations) |
| `uiLabel`    | Inter             | 14   | 500    | 20px        | buttons, list items  |
| `uiSmall`    | Inter             | 13   | 400    | 18px        | inputs, secondary    |
| `caption`    | Inter             | 12   | 400    | 16px        | letter-spacing .01em |
| `eyebrow`    | Inter             | 14   | 500    | 20px        | uppercase tracking .2em |

## 13. Spacing / radii / shadow (final)

```
topBarHeight      56px
sidebarWidth      280px
mainTextMaxWidth  720px
gutter            24px
marginDesktop     40px
marginMobile      16px

radius.sm         4px
radius.button     8px
radius.popover    8px
radius.modal      12px
radius.toggle     9999px

shadow.popover    0 2px 8px rgba(0,0,0,0.08)
shadow.modal      0 4px 24px rgba(0,0,0,0.12)
```

## 14. Mode differences (Normal vs Research)

- **Normal** (default): tokens as above.
- **Research:** `zhBody` size 16 / line-height 1.6; `enBody` size 14 / line-height 1.5; `mainTextMaxWidth` 840px to leave a left-margin column for line numbers (Inter 12/400 `#86868B`) and segment IDs (same).

---

## 15. Things NOT in Stitch that I'll add (and why)

- **"No parallels in chapter" sidebar state** — Stitch doesn't differentiate, but the spec requires it (sparse Ch2). Implementation: dot at opacity 0.35 + text-muted italic.
- **Segment selection ring** — Stitch shows hover state only; spec calls for visible selected state. Add 2px `#2D83F6` outline.
- **Pulse animation** — Stitch doesn't model this; spec calls for it on sidebar/search jump.
- **Toast** — not in Stitch screens; spec needs it for "Rhymed not available" and "Report submitted". Use inverse-surface dark pill bottom-center.
- **Login-not-required hint** on Annotation popover — spec wording "Log in to save across devices"; not in Stitch but small Inter 12 `#46464A` line above buttons.

These additions follow the Stitch system's tonal/typographic language so they feel native.
