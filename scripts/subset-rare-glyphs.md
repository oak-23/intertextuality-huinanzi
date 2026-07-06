# Rare-glyph fallback webfont (subsetting)

The app's text data contains 104 CJK characters (94 BMP rare ideographs + 10
CJK Extension B) that are NOT covered by the self-hosted `Noto Serif TC`
(`@fontsource/noto-serif-tc`). Without a fallback they render as tofu, e.g.
𦉾 (U+2627E) in 𦉾罟張而在下.

## Font

- **Jigmo** (字雲), a Mincho/Song-style font covering the full CJK repertoire.
- **License: CC0 1.0 Universal** (public domain dedication) — permits
  redistribution and subsetting. Shipped as `public/fonts/LICENSE-Jigmo.txt`.
- **Source:** https://kamichikoichi.github.io/jigmo/
  (downloaded `Jigmo-20250912.zip`). BMP glyphs live in `Jigmo.ttf`,
  CJK Ext B–D in `Jigmo2.ttf`.

The full unsubset source fonts are intentionally kept OUT of the repo; only the
subsets + license file ship.

## Codepoint list

The 104 codepoints = (all CJK chars in the app's text data) minus (the
codepoints covered by `@fontsource/noto-serif-tc`'s `unicode-range`
declarations). The list is stored as the `unicodes` field of `rare_glyphs.json`
(94 codepoints <= U+FFFF, 10 codepoints > U+FFFF).

## Subset commands

```sh
pip install fonttools brotli

# 94 BMP chars -> Jigmo-subset.woff2
pyftsubset Jigmo.ttf  --unicodes-file=bmp_unicodes.txt  --flavor=woff2 \
  --output-file=Jigmo-subset.woff2  --name-IDs='*' --no-notdef-outline

# 10 CJK Ext B chars -> Jigmo2-subset.woff2
pyftsubset Jigmo2.ttf --unicodes-file=supp_unicodes.txt --flavor=woff2 \
  --output-file=Jigmo2-subset.woff2 --name-IDs='*' --no-notdef-outline
```

`bmp_unicodes.txt` / `supp_unicodes.txt` are comma-separated `U+XXXX` lists
split from `rare_glyphs.json` by codepoint value (<= U+FFFF vs > U+FFFF).

Output: `Jigmo-subset.woff2` (~31 KB), `Jigmo2-subset.woff2` (~4 KB). Verified
with fonttools that both output cmaps cover all 104 codepoints and every glyph
is non-blank (has contours / is composite).

## Wiring

Two `@font-face` rules (same family name `Jigmo`, split by BMP vs supplementary
`unicode-range`) are added near the top of `src/index.css`, so the browser only
fetches a subset when one of those chars actually appears. `Jigmo` is appended
to every Chinese-serif stack (after Windows' native `PMingLiU-ExtB`):
`src/design/tokens.ts`, `tailwind.config.js`, and the `--font-*-body` vars in
`src/index.css`.
