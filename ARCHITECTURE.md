# Architecture

This app reads the Huainanzi 淮南子 alongside its intertextual parallels in eight other classical Chinese texts. It is built so that **data**, **logic**, and **design** can each be swapped without touching the others.

## Three-layer diagram

```
┌───────────────────────────────────────────────────────────────┐
│  DESIGN  (src/design/, tailwind.config.js)                    │
│   • tokens.ts — every colour, size, radius, shadow, font      │
│   • themes.ts — Normal vs Research overrides                  │
│   • Tailwind classes resolve to CSS vars set by ThemeContext  │
└───────────────────────────────────────────────────────────────┘
              ▲
              │  useTheme()  /  Tailwind classes  /  CSS vars
              │
┌─────────────┴─────────────────────────────────────────────────┐
│  LOGIC  (src/hooks/, src/context/)                            │
│   • AppContext — UI state (language, mode, selection, panel…) │
│   • ThemeContext — derives active token tree from viewMode    │
│   • hooks/* — business logic; depend ONLY on AppContext       │
│       + useRepositories()                                     │
└───────────────────────────────────────────────────────────────┘
              ▲
              │  useRepositories()  →  Repositories<I*>
              │
┌─────────────┴─────────────────────────────────────────────────┐
│  DATA  (src/repositories/, src/adapters/, src/data/)          │
│   • repositories/types.ts — interfaces (the contract)         │
│   • repositories/*Repository.ts — factories (pick adapter)    │
│   • adapters/local*Adapter.ts — concrete implementations      │
│   • data/sampleData.ts — raw fixture data                     │
└───────────────────────────────────────────────────────────────┘
```

**Dependency direction is strictly downward:**
- Components depend on hooks/contexts, never adapters or sample data.
- Hooks depend on `useRepositories()` and `useApp()`, never components.
- Adapters depend on raw data, never context.
- Tokens are leaf — they depend on nothing.

## "Where do I edit?"

| Goal                                          | File(s) to edit                                                |
| --------------------------------------------- | -------------------------------------------------------------- |
| Change the data source (use a real API)       | `src/adapters/*.ts` — replace the body of one or more adapters |
| Switch which adapter the app uses             | `src/repositories/*Repository.ts` — change the `new …()` line  |
| Add a new field to a domain type              | `src/types/index.ts` (then update affected adapters)           |
| Add a new parallel text                       | `src/data/sampleData.ts` — append to `sampleParallelTexts`     |
| Change business logic (search, navigation…)   | `src/hooks/*` — that hook only                                  |
| Change a colour, size, shadow, font           | `src/design/tokens.ts` — single file                            |
| Add a new view mode                           | `src/design/themes.ts` + extend `ViewMode` in `types/`         |
| Change a component's markup or behaviour      | the component file alone                                        |
| Add a new top-bar control                     | new file in `src/components/TopBar/`, register in `TopBar.tsx`  |

## Domain types (`src/types/index.ts`)

```ts
Text     { id, title: { zh, en }, colorKey?, chapters: Chapter[] }
Chapter  { id, title: { zh, en }, segments: Segment[] }
Segment  { id, content: { zh, en, zhRhymed?, enRhymed? }, parallels: Parallel[] }
Parallel { textId, chapterId, segmentId, colorKey }
Annotation { id, chapterId, segmentId, comment, createdAt }
SearchResult { textId, chapterId, segmentId, matchedText }
AuthResult, AuthSession, ReportPayload
ColorKey = 'laozi'|'zhuangzi'|'lushi-chunqiu'|'wenzi'|'guanzi'|'hanfeizi'|'shanhaijing'|'shiji'
```

## Repository interfaces (`src/repositories/types.ts`)

```ts
ITextRepository {
  getMainText(): Text
  getChapter(chapterId): Chapter | null
  getParallelText(textId): Text | null
  getParallelChapter(textId, chapterId): Chapter | null
  getSegment(textId, chapterId, segmentId): Segment | null
  searchSegments(query, scope, lang): SearchResult[]
  getAllParallelTexts(): Text[]
}

IAnnotationRepository {
  getAnnotations(chapterId): Annotation[]
  saveAnnotation(a: Annotation): void
  deleteAnnotation(id): void
  updateAnnotation(id, comment): void
  subscribe(listener): () => void   // for re-render after writes
}

IAuthRepository {
  login(email, password): Promise<AuthResult>
  register(email, password): Promise<AuthResult>
  logout(): void
  getSession(): AuthSession | null
}

IReportRepository {
  submitReport(payload: ReportPayload): Promise<void>
}
```

To replace an adapter with a real API, implement the same interface and update the matching factory in `src/repositories/`. The rest of the codebase keeps working.

## App state (`src/context/AppContext.tsx`)

```ts
AppState {
  language: 'zh' | 'en'
  displayMode: 'prose' | 'rhymed'
  viewMode: 'normal' | 'research'
  sidebarOpen: boolean               // default true
  activeChapterId: string            // default 'yuan-dao'
  selectedSegmentId: string | null
  parallelPanel: { textId, chapterId, segmentId } | null
  panelsSwapped: boolean
  annotationMode: boolean
  auth: { loggedIn, email }
  searchState: { query, scope, matches, currentIndex }
}
```

Annotations are **not** in `AppState`; they live in the `IAnnotationRepository` and re-render via `repo.subscribe(...)` (see `useAnnotations`).

## Component contracts

Every component exports an explicit `Props` interface; props are the only way data flows in.

### Shared

```ts
ToggleProps        { checked, onChange, ariaLabel, size?, disabled? }
ModalProps         { open, onClose, title?, size?, showClose?, children, ariaLabel? }
PopoverProps       { open, onClose, anchor, placement?, offset?, width?, children, ariaLabel? }
ToastProvider      → useToast() → { toasts, show(msg,duration?), dismiss(id) }
```

### TopBar

```ts
TopBarProps              { className? }
SidebarToggleProps       { className? }
SearchBarProps           { className? }
ChapterSelectorProps     { className? }
LanguageToggleProps      { className? }
RhymedProseToggleProps   { className? }
SwapPanelsToggleProps    { className? }   // renders null when no parallel panel
ModeSwitchProps          { className? }
AnnotateButtonProps      { className? }
LoginButtonProps         { className? }
ReportButtonProps        { className? }
IconButtonProps          { active?, size?, children, …button-props }
```

### Sidebar

```ts
SidebarProps             { className? }
ParallelListProps        { className? }
ParallelListItemProps    {
  textId, colorKey, titleZh, titleEn, language,
  hasParallels, isCurrentlyViewed, onClick(textId, hasParallels)
}
SidebarSearchProps       { value, onChange, placeholder? }
```

### MainText

```ts
MainTextProps            { className? }
TextSegmentProps         {
  segment, language, displayMode, viewMode,
  isSelected, isPulsing, lineNumber, annotationCount,
  onClick(segmentId, anchor),
  onAnnotationClick(segmentId),
}
MultiParallelPopoverProps {
  open, anchor, parallels, language, onSelect(parallel), onClose
}
```

### ParallelPanel

```ts
ParallelPanelProps       { className? }
```

### Annotations

```ts
AnnotationMarkerProps    { count, onClick }
AnnotationPopoverProps   { open, onClose, chapterId, segmentId }
```

### Auth / Report / Settings

```ts
LoginModalProps          { open, onClose }
ReportModalProps         { open, onClose }
SettingsDropdown         (re-export of ModeSwitch)
```

## Hooks

```ts
useApp()                  → state, dispatch, action creators
useTheme()                → active Tokens tree (matches viewMode)
useRepositories()         → { texts, annotations, auth, reports }
useAnnotations(chapId)    → annotations, save, remove, update, countForSegment, forSegment
useAuth()                 → loggedIn, email, login, register, logout
useSearch()               → query, scope, results, matches, next, prev, setQuery, setScope, clear
useClickOutside(ref, cb)  → effect helper
useParallelNavigation()   → textHasParallelsInActiveChapter, openParallelForFirstMatch, open, close
useChapterNavigation()    → chapters, activeChapter, switchChapter
useHighlightPulse()       → pulsingId, pulse(segmentId)
```

Hooks never import components. They never instantiate adapters directly.

## Design tokens (`src/design/tokens.ts`)

Single object literal. The entire look can be reskinned by editing this one file plus `themes.ts`.

```ts
tokens.color      { primary, secondary, accent, accentBright, background,
                    surface, surfaceContainerLow/Container/High,
                    border, borderStrong, success, error,
                    text: { primary, secondary, muted, inverse },
                    dot: { <colorKey>: hex … },
                    highlight: { <colorKey>: hex … } }
tokens.typography { displayLg, headingMd, zhBody, enBody,
                    uiLabel, uiSmall, caption, eyebrow }
tokens.spacing    { topBarHeight, sidebarWidth, mainTextMaxWidth,
                    gutter, marginDesktop, marginMobile, panelGap }
tokens.radius     { sm, button, popover, modal, lg, toggle }
tokens.shadow     { popover, modal, panel }
tokens.transition { panel, popover, modal, pulse }
```

The `ThemeContext` watches `viewMode` and writes each token to a CSS custom property on `document.documentElement`, so Tailwind utilities like `bg-surface`, `text-primary`, `bg-highlight-laozi`, and `shadow-popover` always reflect the active theme.

## Adapters (`src/adapters/`)

```
localTextAdapter         ITextRepository over sampleData
localAnnotationAdapter   IAnnotationRepository over localStorage ('huinanzi:annotations:v1')
localAuthAdapter         IAuthRepository — accepts any creds; stores session in localStorage
localReportAdapter       IReportRepository — console.info's the payload
```

Adapters are the **only** files allowed to import from `src/data/` or talk to `localStorage`.

## File layout

```
src/
  components/
    TopBar/           TopBar.tsx + 10 subcomponents + IconButton.tsx
    Sidebar/          Sidebar.tsx, ParallelList.tsx, ParallelListItem.tsx, SidebarSearch.tsx
    MainText/         MainText.tsx, TextSegment.tsx, MultiParallelPopover.tsx
    ParallelPanel/    ParallelPanel.tsx
    Annotations/      AnnotationPopover.tsx, AnnotationMarker.tsx
    Auth/             LoginModal.tsx
    Settings/         SettingsDropdown.tsx (re-exports TopBar/ModeSwitch)
    Report/           ReportModal.tsx
    shared/           Toggle.tsx, Modal.tsx, Popover.tsx, Toast.tsx
  context/            AppContext.tsx, RepositoryContext.tsx, ThemeContext.tsx
  data/               sampleData.ts
  repositories/       types.ts + 4 factory files
  adapters/           4 local* files
  design/             tokens.ts, themes.ts
  types/              index.ts
  hooks/              useAnnotations, useAuth, useChapterNavigation, useClickOutside,
                      useHighlightPulse, useParallelNavigation, useSearch
  utils/              scrollToSegment.ts
  App.tsx             layout shell + global Escape handler
  main.tsx            providers + render
index.html            fonts + meta
tailwind.config.js    maps tokens → CSS vars → Tailwind classes
src/index.css         Tailwind directives + :root token defaults + keyframes
DESIGN_AUDIT.md       Stitch design audit (single source of visual truth)
ARCHITECTURE.md       this file
stitch-design/        downloaded Stitch screens + HTML for visual reference
```

## Dependency-flow rules (enforce when reviewing PRs)

1. **No component imports from `src/data/` or `src/adapters/`.** Use a hook.
2. **No hook imports from `src/components/`.** Hooks are headless.
3. **No adapter imports `src/context/`.** Adapters are pure data.
4. **No component contains a hardcoded hex, `px` size, or shadow string.** All come from `useTheme()` or `var(--…)`/Tailwind tokens.
5. **Every component file exports a named props interface.** Components are replaceable behind that interface.
6. **Annotations live in their repository**, not in `AppContext`. Use `useAnnotations`.

A grep that catches most violations:

```bash
# Components/hooks must not touch the data or adapter folders
rg --type ts --type tsx "from ['\"](\.\./)+(data|adapters)/" src/components src/hooks
# Adapters must not touch context
rg --type ts --type tsx "from ['\"](\.\./)+context/" src/adapters
# Components must not contain hardcoded hex colors
rg --type tsx "#[0-9A-Fa-f]{3,8}" src/components
```

## Verification

- `npm run build` — clean (production bundle ~277 kB / 87 kB gzipped).
- `npm run dev` — Vite serves on http://localhost:5173.
- See `DESIGN_AUDIT.md` for the visual reference and `stitch-design/screenshots/` for cross-checking.
