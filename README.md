# Intertextuality — Huainanzi 淮南子

A modular React + TypeScript reader for the Huainanzi alongside its intertextual parallels in other classical chinese texts.

Built from a Stitch design system, with three strict layers — data, logic, and design — that can each be swapped independently. See [ARCHITECTURE.md](./ARCHITECTURE.md) and [DESIGN_AUDIT.md](./DESIGN_AUDIT.md).

## Run

```bash
npm install
npm run dev   
npm run build
```

## What's where

- `src/design/` — token system (single source of visual truth)
- `src/repositories/`, `src/adapters/`, `src/data/` — data layer (swap an adapter to point at a real API)
- `src/context/`, `src/hooks/` — UI state + business logic
- `src/components/` — pure renderers, organised by feature
- `stitch-design/` — downloaded Stitch screens + HTML for visual reference
