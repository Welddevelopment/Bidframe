# Bidframe Pitch Deck Overhaul Plan

> Status: planning handoff for the next `/pitch` pass. Jawad is actively working on this; Joel should verify the current route against this plan before the team spends more build time.

## Why the current deck still feels flat

The landing page earns its forest: layered woodland, scroll-drawn trail, dusk wash, fern and pine details, treeline seams, and a closing clearing. The coded pitch deck has the right structure and live product proof, but the journey language is still too shallow. It mostly uses one static forest image behind slide-style panels.

The goal of the overhaul is to make `/pitch` feel like walking through one tender: lost in the dense document, finding the trail, hitting the deal-breaker, unfolding the matrix, proving the source, then ending in a clearing with the ask.

## North Star

The deck should feel like one continuous path through a public-sector tender, not twelve separate slides.

The main seven slides stay locked:

| Slide | Bucket | Story Beat | Speaker |
|---|---|---|---|
| 1 | Problem | Lost in the tender | Jawad |
| 2 | Use Case | The first-read trail appears | Bobby |
| 3 | Solution | The deal-breaker stop sign | Pranav |
| 4 | Product | The matrix becomes the map | Joel |
| 5 | Demo Flow | PDF to proof to answer | Joel lead, Bobby support |
| 6 | Tech | The trust layer under the trail | Pranav |
| 7 | Ask | The clearing | Jawad |

Appendix slides become off-trail field notes for Q&A.

## Big Changes

### 1. Replace the progress bar with a trail map

Build a persistent bottom trail across the stage:

- faint dashed full route
- walked portion drawing forward on slide advance
- one diamond blaze per stop: Problem, Use Case, Solution, Product, Demo, Tech, Ask
- clickable blazes for navigation
- small walker dot during autoplay so timing is visible
- mile-marker counter such as `03 / 07`

Appendix slides should sit on a visible side path labelled `Field notes`, not on the main trail.

### 2. Map each slide to a forest scene

Use the existing landing art kit instead of a single static PNG:

| Slides | Scene | Existing Asset / Technique |
|---|---|---|
| 1 Problem | Dense night wood, path barely visible | `hero-woodland-v2.webp`, dark wash |
| 2 Use Case | Dawn breaks, trail appears | same woodland scene, lighter wash, trail draws on |
| 3 Solution | Deep pine, marked danger point | `proof-pine-depth-v2.webp`, oxblood blaze |
| 4 Product | Paper/moss map surface | moss band plus civic-record grid |
| 5 Demo Flow | Paper trail with pine edges | `card-gallery-backdrop-v2.webp` |
| 6 Tech | Underwood structure | pine band, graph grid, engraved botanicals |
| 7 Ask | Clearing | `closing-clearing-v2.webp`, light bloom |

The lighting arc is the emotional thread: start dark and dense, end bright and clear.

### 3. Use camera-walk transitions

Replace generic slide-left movement with a step-forward transition:

- background layers scale and translate at different rates
- content cross-fades and rises
- trail line advances as the slide changes
- reduced-motion users get a static cross-fade

This should feel like walking through the same forest, not flipping a deck.

### 4. Thread one story object through the deck

Use one visual object that transforms across the story:

1. PDF page
2. highlighted clause
3. deal-breaker row
4. matrix row
5. source receipt
6. graph node
7. clause-frame seal

This object should be built from real product components where possible. The audience should feel that the same tender page becomes the product.

### 5. Make Slide 3 the dramatic stop-sign moment

Slide 3 should be the darkest and sharpest beat.

Core line:

> This is the clause that would kill the bid.

Then the real gating requirement appears, pulses once in oxblood, and settles into the Bidframe deal-breaker panel. This is the one poster-scale moment in the deck.

### 6. Cut visible copy aggressively

Slides should use trail-sign copy, not doc copy.

Examples:

- `Find the clause that can void the bid.`
- `Turn the tender into a checkable map.`
- `Every answer has a receipt.`
- `A trust layer, not a PDF chatbot.`

Everything else belongs in presenter notes.

### 7. Use the brand mark as the guide

The clause-frame mark should appear at the trailhead and again in the clearing, closing the loop.

Do not reintroduce the owl/mascot into the main deck unless the team explicitly reverses the current no-mascot decision.

## Tie-Together Pass

- Use `TreelineDivider` as a seam when the surface changes from dark forest to paper to clearing.
- Let `PineBranch`, `FernFrond`, and `DrawOn` enter from slide edges sparingly.
- Turn the slide bucket labels into blaze-shaped markers.
- Use `AnimatedNumber` for market/proof numbers.
- Style appendix slides as paper field notes laid on the forest floor.
- Stamp the final ask with the clause-frame seal.
- Keep cached SPSO data, keyboard controls, notes toggle, fullscreen, and print/export behavior intact.
- Preload scene images so transitions never flash.

## Implementation Plan

1. **Scene system**
   Generalize the landing forest layer approach into a reusable pitch scene wrapper such as `<ForestScene zone="night|dawn|pine|moss|paper|clearing">`. Define zone tokens and preload images.

2. **Trail map**
   Add the persistent trail navigation, blazes, walker dot, mile marker, and appendix side path. Remove the old red progress bar.

3. **Forest arc and camera walk**
   Wire each main slide to its scene zone and implement step-forward transitions using `motion/react`.

4. **Copy diet and type scale**
   Rewrite main-slide visible text as short trail signs. Move detail into presenter notes. Make room for larger, calmer type.

5. **Deal-breaker stop sign**
   Rebuild slide 3 as the core dramatic beat: one dangerous clause, one oxblood marker, then the real `GatingHero` proof.

6. **Story object morph**
   Thread the PDF/clause/matrix/proof/graph/seal object across slides. Use shared layout motion where it stays robust.

7. **Art and appendix polish**
   Add treeline seams, botanical accents, animated metrics, appendix field-note styling, and the final seal-stamp ask.

8. **Hardening**
   Run reduced-motion, print/export, fullscreen, projector-ratio, keyboard, autoplay, lint, and production-build checks.

## 80/20 Order

If time is tight, do this first:

1. Trail map.
2. Scene zones.
3. Copy diet.
4. Slide 3 stop-sign moment.

Those four changes should make the deck feel like a journey even before the full story-object morph lands.

## Joel Verification Ask

Joel: please verify where `/pitch` is against this plan before the team commits more time. In particular:

- which of the 80/20 items are already done by Jawad's current work
- whether the deck still fits the pitch timing
- whether Slide 3 makes deal-breaker detection feel like the main wedge
- whether the no-mascot direction still holds
- whether any product or market claim needs to be softened before Demo Day

