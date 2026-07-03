# Demo Improvement Plan

Planning doc for the next `/demo` page polish pass. This turns the current rough staging notes into an implementation checklist that can be picked up by the frontend/J demo thread without changing the locked requirement schema or the product surfaces outside the demo.

## Goal

Make `/demo` feel alive at demo-day speed while preserving the existing static renderer, SSR narrative markup, reduced-motion behavior, and key-independent SPSO fixture.

The finished pass should:

- Keep desktop scrollytelling scrubbed, reversible, and stable.
- Keep tablet rail behavior visible at 1024-1279px.
- Keep mobile stacked layout, but add per-beat entrances and a compact progress indicator.
- Make the worked SPSO example animate once as it enters view.
- Preserve `/review`, `/answers`, `/graph`, and live product behavior.

## Stage 0 - Session Resilience

Before long implementation/rehearsal work, install and configure `claude-auto-retry` on the macOS machine used for Claude Code sessions.

Acceptance criteria:

- When Claude Code hits a usage/rate limit, the tool waits until reset.
- It resumes the same session automatically.
- It sends `continue` without manual intervention.
- It is documented locally enough that another teammate can restart it if the machine reboots.

Notes:

- Treat this as local machine setup, not repo code.
- Do not commit secrets, shell history, local config paths containing credentials, or generated logs.
- If any generated install note is useful to the team, add a separate short doc with no machine secrets.

## Stage 7 - Mobile Scrolly Entrances

### 7.1 MountOnView helper

Create `frontend/src/components/demo/MountOnView.tsx`.

Behavior:

- Uses IntersectionObserver with a threshold around `0.35`.
- Fires once.
- Before mounting children, renders a fixed `minHeight` placeholder so scroll length stays stable.
- Under reduced motion, renders children immediately to avoid pop-in.
- When mounted, existing mount-keyed one-shot animations replay naturally.

Suggested API:

```tsx
type MountOnViewProps = {
  children: React.ReactNode;
  minHeight?: string | number;
  className?: string;
};
```

### 7.2 DemoScrolly mobile mode

In `DemoScrolly` mobile mode, keep the stacked layout. Do not introduce pinning under 1024px.

Change each beat visual so it wraps in `MountOnView`.

Update `BeatVisual`:

- Add `animate?: boolean`.
- Default `animate` to `false`.
- With `animate={false}`, output should remain byte-identical/static to today's renderer.
- Only mobile mode should pass `animate`.

Animated beat behavior:

- `wall`: render the wall with `phase="resolving"` so the scan plays and the rest state is lit.
- `rows`: render `RegisterSheet` rows with `data-beat-enter`; use CSS stagger with the existing `hero-enter` keyframe and `calc(var(--i) * 70ms)`.
- `dealbreaker`: wrap `GatingHero` in `Reveal`.
- `approval`: mount the stamp so the settle animation plays once.
- `graph`: arm the cartoon graph with `DrawOn`.

### 7.3 MobileBeatDots

Add `MobileBeatDots` inline in `DemoScrolly` for mobile only.

Behavior:

- Sticky at `top-3`.
- `z-20 mx-auto w-fit`.
- Paper pill treatment.
- Shows 7 dots and a mono `0X / 07` counter.
- Active index comes from one IntersectionObserver over the beat `<li>` elements.
- Use root margin around `-40% 0px -40% 0px`.
- Reduced motion keeps today's static renderer untouched apart from the indicator state.

## Stage 8 - Worked Example Alive On Arrival

Scope: `frontend/src/components/DemoView.tsx` and the relevant CSS.

### 8.1 Matrix cascade

Wrap the frozen SPSO worklist sheet contents in `MountOnView`.

Implementation notes:

- Placeholder height should approximate the current sheet height, around `36rem`.
- Pass `revealKey="demo-spso"` to `ComplianceMatrix`.
- Reuse the existing staged reveal:
  - groups top-down
  - first approximately 12 rows staggered
  - `seenRevealKeys` guards remounts
- Reduced motion should remain no-deferral/no-pop because `ComplianceMatrix` already uses `useReducedMotionHydrationSafe` and `MountOnView` renders immediately.

### 8.2 GatingHero flare

Wrap `GatingHero` in `Reveal`.

Add a one-shot class:

```css
@media (prefers-reduced-motion: no-preference) {
  [data-reveal="shown"].gating-flare-once section {
    animation: gating-flare 900ms ease both;
  }
}
```

Design:

- One oxblood box-shadow pulse.
- Do not change `GatingHero` internals.
- Finite animation only.

### 8.3 Lantern button

Add `lantern-pulse` to the "See a deal-breaker in the document" button.

Design:

- `lantern-glow` keyframe.
- Warm halo palette derived from `.closing-forest__halo`.
- 3 iterations, then settle.
- Motion-safe only.

## Verification

Run:

```bash
cd frontend
npm run build
npm run lint
```

Then regenerate the repo map if the implementation adds, renames, deletes, or rewires files:

```bash
python scripts/gen_codemap.py
```

If this macOS machine does not expose `python`, use `python3` or the bundled Codex Python runtime.

Expected map-impacting files from the broader `/demo` plan:

- `frontend/src/components/demo/useScrollTimeline.ts`
- `frontend/src/components/demo/DemoTitleCard.tsx`
- `frontend/src/components/demo/TrailageChrome.tsx`
- `frontend/src/components/demo/MountOnView.tsx`
- `frontend/src/components/demo/ScrollyRail.tsx` deleted

Commit `CODEMAP.md` and `frontend/public/codemap.html` in the same change when the structure changes.

Manual checks with the dev server and browser screenshots:

- `>=1280px`: title card scrubs forward and backward; rest pose at each integer beat equals the composed state.
- `>=1280px`: lift proxy carries the gating row.
- `>=1280px`: final stamp lands with one jolt.
- `>=1280px`: ghost cursor presses at beats around `2`, `4.2`, and `4.9`.
- `1024-1279px`: rail remains visible while scrolling.
- `<1024px`: stacked mode has per-beat entrances on scroll-into-view plus the dots indicator, with no pinning.
- Reduced motion at both widths: today's static output remains, with static title band, static clearing close, and no pop-in.
- View source: SSR HTML contains the full stacked narrative plus composed visual stage markup marked `aria-hidden` where appropriate.
- Browser console: no xyflow errors.
- Performance: smooth scroll at 4x CPU throttle; scrub bindings use MotionValue rather than per-frame React renders; discrete step changes stay around 9 per traversal.
- Source verification overlay still shows the real SPSO page.
- `/review` and the product surfaces are unchanged.

## Key Risks

Sticky and transforms:

- Transforms or overflow on sticky ancestors can kill pinning.
- Keep new motion on the stage frame.
- Keep the title card in its own wrapper outside the grid.

xyflow in the stage:

- Keep graph animation conservative: opacity and no more than about 24px y movement.
- Preserve the gating-only filter.
- Rely on existing client-mount deferral to avoid hydration and measurement issues.

Anchor drift:

- Measure anchors and recompute with ResizeObserver.

Hydration:

- Mode should render consistently.
- Scrub markup mounts after effect.
- `MountOnView` placeholders should be identical on server and first paint.

Color interpolation:

- Use literal color values in keyframes where needed.
- Avoid relying on CSS variables in interpolated keyframe values if browser behavior is inconsistent.

## Out Of Scope

- Requirement schema changes.
- Live backend behavior.
- `/review` matrix behavior outside the demo wrapper.
- New tender data.
- Broad copy rewrites.
- Landing or pitch deck changes.
