# Bidframe - Brand Assets

The Bidframe mark is a **clause frame**: four crisp brackets around tender text.
It says the product frames the bid and surfaces the requirement that would
otherwise be missed.

Direction: minimal clause frame for the lockup, brand mark, and favicon-scale use.

---

## Files

### Primary vector assets
| File | Use |
|------|-----|
| `bidframe-logo-horizontal.svg` | Default lockup - mark + wordmark. Headers, nav, docs. |
| `bidframe-logo-stacked.svg` | Vertical lockup - square-ish spaces, splash, print. |
| `bidframe-logo-horizontal-reversed.svg` | Lockup for dark backgrounds. |
| `bidframe-mark.svg` | Clause-frame mark alone - avatars, social, large app icon. |
| `bidframe-favicon.svg` | Minimal clause frame - browser tab and tiny UI uses. |
| `bidframe-favicon-ink.svg` | Minimal reversed favicon for dark surfaces. |

In the app, the lockup is rendered inline by `src/components/BrandLogo.tsx`
so it inherits the page's Fraunces and needs no request. The browser tab icon is
wired through Next's file convention at `src/app/icon.svg`.

### Raster
Not included here yet. Export from the SVGs if a raster is needed. Suggested set:
`bidframe-mark-512/192.png`, `bidframe-apple-touch-180.png`,
`bidframe-favicon-32/16.png`.

---

## Colour

| Token | Hex | Role |
|-------|-----|------|
| Ink | `#211d17` | Brackets, clause lines, wordmark |
| Paper | `#f6f2e9` | Disc and knockouts |

Wordmark: **Fraunces**, weight 600, tracking 0.

---

## Usage Rules

- **Clear space:** keep padding at least the width of one corner bracket on all sides.
- **Minimum size:** favicon 16px; mark 24px digital / 10mm print.
- **Don't:** add status colours to the mark, restyle the wordmark font, add effects, or stretch.
