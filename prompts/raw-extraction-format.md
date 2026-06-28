# Raw-Extraction Format — backend → generalist contract

> **Status: PROPOSED v1 (Day 1, J).** Backend + generalist: react today so we lock it. Until locked,
> both build against the mock sample at the bottom so you parallelise instead of waiting.
> This is the **intermediate** hand-off. The **final** shape the API serves is the locked
> requirement schema in [../AGENTS.md](../AGENTS.md) — do not change that one here.

## What this is

The **raw extraction list** is what the backend's per-chunk LLM extraction emits, *before* the
generalist reconciles it. It is a list of **candidate requirements**: the same real-world
requirement may appear 2–3 times (extracted from overlapping chunks), confidence is the model's
raw self-report, and ids are provisional. The generalist's job is to dedupe/merge these into the
clean, final requirement objects.

**One requirement object is the unit.** A raw item is *almost* a final requirement object, minus
the fields that only exist after reconciliation + human review. Keeping it close to the final
schema means the generalist mostly *drops/merges* rows rather than reshaping them.

## The raw requirement object

```jsonc
{
  // --- identity (provisional) ---
  "raw_id": "raw-c014-0003",   // unique per raw item: raw-<chunkId>-<seqInChunk>. NOT the final id.
  "chunk_id": "c014",          // which chunk produced it — lets generalist reason about overlap/proximity

  // --- the requirement (same meaning as final schema) ---
  "text": "The supplier must hold ISO 9001 certification.",  // normalised, self-contained sentence
  "source_page": 14,           // 1-based PDF page the excerpt sits on. MUST be accurate.
  "source_clause": "Section 4.2.1",  // section/clause label if detectable, else null
  "source_excerpt": "verbatim snippet the requirement was extracted from",  // EXACT substring of source text
  "type": "mandatory",         // "mandatory" | "optional"  — classifier's call
  "is_gating": true,           // would missing this disqualify the bid? classifier's call
  "category": "certification", // free-ish label: certification | insurance | financial | technical | legal | experience | other
  "confidence": 0.92,          // 0–1, model's RAW self-reported confidence. Do NOT pre-threshold here.

  // --- extraction provenance (helps reconcile, dropped before final) ---
  "char_start": 1840,          // offset of source_excerpt within the chunk text (nullable) — aids dedupe + highlight
  "char_end": 1902,            // end offset (nullable)
  "extractor_notes": null      // optional short string: e.g. "found in a table row", "ambiguous shall/should". nullable.
}
```

### Fields that are NOT in the raw object (they only appear after the generalist runs)

These belong to the **final** schema and the generalist/frontend own them — backend must **not** emit them:

| Final-schema field | Who sets it | When |
|---|---|---|
| `id` (`req-0001`) | generalist | at reconcile (stable id after merge) |
| `status` | frontend/API | defaults `"pending"`; set by human decision |
| `needs_review` | generalist | confidence routing, after calibration |
| `decision` | frontend/API | when human acts |
| `criteria_ref` | backend (graph step) | Day 3 — may be null in raw v1 |
| `depends_on` | backend (graph step) | Day 3 — may be `[]` in raw v1 |
| `draft_answer` | generalist | answer-draft step, Day 3 |

> Day 1–2: `criteria_ref`/`depends_on` can be absent or null/`[]` in raw output. They get populated
> in the backend graph step (Day 3). The generalist should tolerate them missing.

## The envelope

The backend hands the generalist one of these per tender:

```jsonc
{
  "tender_id": "tnd-0001",
  "title": "Provision of Managed IT Services — Borough of Exampleton",
  "source_filename": "exampleton-itt.pdf",
  "page_count": 137,
  "chunk_count": 41,
  "raw_requirements": [ /* raw requirement objects, in document order */ ],
  "extraction_meta": {
    "model": "TBD",            // provider/model used — fill once LLM chosen
    "extracted_at": "2026-06-29T10:00:00Z",
    "warnings": []             // e.g. ["chunk c031 OCR-degraded", "tables on p.88 low-confidence"]
  }
}
```

## Rules that make reconcile safe

1. **Recall first.** A missed mandatory requirement disqualifies a bid — that is the worst outcome.
   When unsure whether a span is a requirement, **emit it with low confidence**, don't drop it.
2. **Don't pre-dedupe in the backend.** Emit every candidate per chunk. Merging is the generalist's
   job and they merge *conservatively* (two genuinely-different requirements wrongly merged = a silent miss).
3. **`source_excerpt` is an exact substring** of the chunk's source text — verbatim, no paraphrase.
   This is what makes the final product auditable. `source_page` must be the page that excerpt sits on.
4. **`text` is normalised + self-contained** ("The supplier must…") even when the excerpt is a
   fragment or table cell — so it reads correctly out of context in the matrix.
5. **`confidence` is raw.** Never apply the `needs_review` threshold here; the generalist calibrates it.

## Mock sample (build against this until locked)

A tiny mock raw list lives alongside this spec — see `prompts/mock-raw-extraction.json` (added next).
Backend: produce this shape. Generalist: consume this shape. Frontend is unaffected (you consume the
*final* schema via the API).

---

### Changelog
- **2026-06-28 (Day 1)** — v1 proposed by J. Pending backend + generalist sign-off in today's standup.
