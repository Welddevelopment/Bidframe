# Bidframe Slop Check

A subset of the Bidframe design system (see [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md)). Read this
before you add a wireframe of any screen. It exists so the UI looks chosen by a person with taste, not generated. If your
screen passes this, the frontend handoff is faster and there is less for Jawad to redo.

## Why this exists

AI slop is the absence of choices. It is what you get when every default is left
untouched. The whole Bidframe pitch is turning weeks of specialist tender work into an
afternoon for a normal person, so the product has to feel calm, warm, and credible. One
off palette, one generic layout, one hype headline, and procurement people stop trusting
it. This protocol turns "do not look like AI" into rules you can actually check.

## Foundation (the settled part)

- **Palette: Paper and Forest.** Warm paper background, never pure white. Deep earthy
  forest green as the one accent, earned not sprayed (primary actions and real emphasis
  only). Ink near black for text. No second brand color.
- **Voice: calm and specific.** Plain language for a busy non expert. Say the real thing,
  not the benefit. Example: "We drafted this from your last bid. Check it before it is
  submitted."
- **Typeface: locked.** Fraunces for headings, Chillax for body, IBM Plex Mono for evidence and
  source references. Six sizes, two weights of Fraunces. Do not introduce Inter or Geist. See
  DESIGN-SYSTEM section 11.
- **Layout: settled.** One tender fills the screen with no left rail, a Next-led header, a one-line
  matrix that reads like a contents page, and a split open state (the matrix shrinks to an index spine,
  the panel takes the room). Interactivity scales with stakes. See DESIGN-SYSTEM section 12 and
  [layout.md](layout.md).

## The slop check (run before you commit a wireframe)

1. **Greyscale test.** View the screen with no color. Does the layout still read and rank
   correctly? If it only works because of color, the structure is lazy. Fix the structure.
   Status especially: every status must stay legible here through its dot fill and a word, so
   color only speeds the glance and is never the only channel.
2. **Name one intentional choice.** Point to a single deliberate, slightly unexpected
   decision on the screen (an off center anchor, a dense table that earns its density, a
   confident piece of whitespace). If you cannot name one, it is not done.
3. **Banned scan.** Run the screen against the banned list below. Any hit is a blocker,
   not a nitpick.
4. **Real content.** No lorem, no three identical demo rows. Use real tender titles,
   awkward field names, answers long enough to wrap. Design the empty state and the error
   state too.

## Principles (short version)

- One primary action per screen. The user always knows the next step.
- Progressive disclosure. The compliance, legal, and audit complexity lives one click
  away, not on the default view.
- Density is allowed. This is a document tool, so tables and lists can be tight and that is
  good. Do not pad it out into a landing page.
- Warmth comes from softness and space, not decoration. Flat surfaces, one soft shadow
  language used sparingly.
- The AI reads as a helpful colleague, never silent automation. A suggestion is a draft you
  approve, and it shows where it came from.

## The banned list (hard nos)

These are blockers. If a wireframe contains any of these, it does not ship.

**Color and surface**
- Blue, teal, purple, or indigo as a primary or accent. These are the number one tell.
- Status colors leaking into chrome. The signal colors (the confidence red, amber, yellow,
  green) live only on status carriers (the confidence dot, a thin answer edge, a status cell),
  never on buttons, nav, headings, or backgrounds. See DESIGN-SYSTEM section 3.
- Gradients used as decoration. Glassmorphism. Neon on dark.
- Pure white (#fff) or pure black (#000).

**Type and headlines**
- Really long headlines. Keep them short and human. If it runs to two long lines, cut it.
- Eyebrow labels (the little kicker line above a heading). Not needed.
- Numbered website sections (01 / 02 / 03 section markers). The content should carry itself.
- Gradient text. Centered paragraph blocks. One weight doing every job.

**Components**
- Ugly pills. No pill buttons or pill badges as a default decorative habit. A pill has to
  earn its shape, and most do not.
- An icon in every card header. Icons aid scanning (status, actions); they are not
  decoration.
- A card wrapped around every single element on the page. Cards nested inside cards.
- Oversized bezels and chunky rounded accent bars (the fat colored slab running down the
  side of a panel, card, or field). Accent borders stay thin (hairline up to about 2px) and
  near square. Carry status with the confidence dot and its label, not a big colored block.

**Layout**
- The three column icon card feature grid. Bento grids. Hero with a glowing blob.
- Everything centered and symmetric with equal padding everywhere. Find one point of
  intentional tension.
- A persistent left sidebar or nav rail on what is a single-document app. One tender fills the
  screen; navigation is contextual and lives in the header. See DESIGN-SYSTEM section 12.
- A row of summary stat tiles standing in for the honest triage worklist.
- Prose (requirements, drafted answers) stretched to the full container width. Hold reading text
  to a comfortable measure (about 64 characters).
- Equal weight and equal interactivity on every row regardless of stakes. The risky and the safe
  must not look or behave identically: the layout carries the stakes.

**Copy**
- Em dashes. Banned from all copy, everywhere. Use a period, a comma, or a colon instead.
- "Supercharge", "Seamlessly", "Unlock", "Elevate", "Effortlessly", and three word hype
  taglines.
- Exclamation marks and vague benefit speak. Say the specific, real thing.

**Content and motion**
- Lorem ipsum or suspiciously clean placeholder data. Undesigned empty and error states.
- Fade up on scroll applied to everything. Floating elements. The same default shadow on
  every surface.

---

Got a case you think deserves an exception? Post on your comms board and tag @frontend.
Jawad owns the final call on the design system.
