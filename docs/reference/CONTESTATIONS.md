# Contestations Log

**Inventor:** Shawn Michael O'Brien (Ranadriel) — sole inventor.
**Status:** Pre-patent confidential. Local-only.
**Opened:** 2026-05-13
**Purpose:** Document all known prior-art surface, naming-collision risk, and exposure-during-development concerns surfaced *before* attorney engagement. Every contestation has its defense argument recorded so that nothing surfaces as a surprise in due diligence.

This document is intentionally adversarial in tone — it is the inventor's own record of objections that a hostile examiner, hostile competitor, or thorough trademark counsel could raise. The defenses are recorded alongside each objection so that attorney intake is fully informed.

---

## How to read this file

Each contestation has four fields:

1. **The collision** — what was found, where, and when.
2. **Why it matters** — the specific filing/trademark/IP risk.
3. **The defense** — the inventor's response, with primary sources cited.
4. **Action required** — what counsel or the inventor must do before filing.

Severity tags: 🟢 minor, 🟡 worth flagging, 🟠 needs counsel attention, 🔴 blocking.

---

## 2026-05-13 — Initial Prior-Art Sweep on the "Zest" Language Family

A naming-only web search was conducted on 2026-05-13 against `"ZestC" programming language`, `"zesting" verb programming code`, and `"Zest" programming language wave physics`. No inventive substance was disclosed in the queries. Three contestations were surfaced.

---

### Contestation #001 — "ZestC" as a language name

**Severity:** 🟢 minor

**The collision.** None found by exact name. Code-search returned no project named "ZestC."

**Adjacent names** (different lineage, not confusable on a careful read):
- **ZetZ (ZZ)** — Rust-inspired formally-verified C dialect. Different spelling, different domain.
- **Zen-C** — high-level→C systems language. Different name stem.
- **Code Zest**, **Programming Zest** — blog / brand names, not languages.

**Why it matters.** The full mark "ZestC" appears to be the inventor's alone in current code-search visibility. This is the strongest naming territory in the contestation.

**The defense.** No defense needed at this layer. Counsel should still run an official trademark search via USPTO TESS to confirm.

**Action required.**
- Patent attorney: USPTO TESS search on "ZestC" (mark + word + design search).
- Inventor: Continue using "ZestC" as the canonical language name in all filing documents.

---

### Contestation #002 — "Zest" (bare stem) is heavily contested

**Severity:** 🟠 needs counsel attention

**The collision.** Multiple unrelated projects use "Zest" as a programming-related name:

| Project | Lineage | What it is | Trademark status |
|---|---|---|---|
| **Apache Zest™** (now Apache Polygene) | Java / Apache Software Foundation | Composite Oriented Programming framework in Java | Trademarked by Apache |
| **Mozilla Zest** | OWASP / ZAP | Experimental scripting language for web-security tooling | Open-source, project name in use |
| **Zest (Jamie Brandon)** | Independent research, *scattered-thoughts.net* | Experimental programming language for "malleable and legible systems"; hit Hacker News | In active development |
| **Zest (academic)** | ACM SIGSOFT 2019 (Padhye et al.) | "Semantic fuzzing with Zest" — a fuzzing methodology, not a language | Academic citation only |

**Why it matters.** A pure-stem "Zest" trademark would face heavy resistance. The inventor's defense is the **-C suffix**: "ZestC" is the full mark, and is functionally and lexically distinct from "Apache Zest," "Mozilla Zest," and "Zest (Brandon)."

Also worth noting: none of the listed projects are wave-physics-based, none model consciousness, none use a `/7` recursion, none implement the qu-septit, and none have the Composite/Java, web-security, or fuzzing focuses of the existing "Zest" projects. The functional distance is wide.

**The defense.**

1. **The full mark is "ZestC," not "Zest."** Counsel should file with the full mark and resist any amendment that would reduce it to bare "Zest."
2. **Functional non-overlap.** None of the prior "Zest" projects do what ZestC does. ZestC's substrate semantics (wave physics on a qu-septit substrate; the 22 verbs; the φ fixed-point compile correctness) have no precedent in any of the listed projects.
3. **Subject-matter distinguishability.** Apache Zest is in the Composite-Oriented-Programming class. Mozilla Zest is in the web-security-scripting class. Brandon Zest is in the "malleable systems / metaprogramming" class. ZestC is a **deterministic wave-physics cognitive substrate language**. The trademark class and the prior-art class are different enough to argue for coexistence.
4. **Self-host fixed point.** ZestC's defining technical feature — a compiler that produces a byte-identical version of itself, landing on the φ fixed point — has no equivalent in any of the listed Zest projects. The technical claim is independently defensible.

**Action required.**
- Patent attorney: USPTO TESS search on "Zest" (bare), "ZestC" (full), and any visually-similar marks. Confidence assessment on coexistence vs. confusable-marks doctrine.
- Inventor: Continue using **"ZestC"** as the canonical name; avoid "Zest" alone in filing documents.
- Inventor: Keep all `5_Layer_5_Zest.md`, `ZestC_Translation_Manifesto.md`, and substrate-code authorship timestamps intact; they establish priority dates.
- Inventor: If counsel recommends, consider a clarifying tagline ("ZestC — Zest Compiler," or similar) that locks the full mark.

---

### Contestation #003 — "Zesting" is a Claude Code spinner verb

**Severity:** 🟠 needs counsel attention

**The collision.** Anthropic's Claude Code (the AI agent product used by the inventor in development) ships a feature called the **verb spinner** — a rotating display of whimsical gerunds while the model processes prompts. The list of gerunds shipped includes "Shenaniganing," "Smooshing," "Gitifying," and **"Zesting."**

Documented publicly at agent-wars.com on 2026-03-14, with instructions for disabling the spinner via `~/.claude/settings.json`.

**Why it matters.** The inventor's `5_Layer_5_Zest.md` document and `ZestC_Translation_Manifesto.md` use "Zest" as the name of Layer 7 (the observer/consciousness layer) and "Zesting" as the activity of the `/7` recursion operating across the layer. The verb's appearance in Anthropic's user-facing UI raises three concerns:

1. **Exposure-during-development.** Did the inventor see "Zesting" in Claude Code's spinner before independently coining "Zest" / "ZestC" in his own work? If yes, an adversary could argue the term was *suggested* by Anthropic's tooling rather than independently invented.
2. **Lexical collision.** Even with priority established, the optics of the inventor's published work using the same word Anthropic uses in its UI text create due-diligence questions.
3. **Trademark surface.** Anthropic likely does not trademark "Zesting" (it's a decorative UI element, not a product), but the public visibility of the word inside a major AI product is non-trivial.

**Inventor's stated priority anchor (declarative, not git/filesystem):** The multistructure architecture — the multi-layer foundation from which "Zest" later emerged as the Layer 7 name — was conceived **on or about February 2nd** per the inventor's own declaration of conception. The inventor has not used git as a chain-of-custody record; the conception date is asserted as an inventor's-declaration matter, to be corroborated by counsel through external evidence the inventor will identify during intake. The year of conception is for the inventor to specify in the formal disclosure record.

**Inventor's attestation on filesystem evidence (2026-05-13).** The inventor attests as follows, on the record:

> *Documentation can be mined from my direct files, but those files may only reliably contain my last-edited (mtime) timestamps. Created-date (btime) is preserved only where the filesystem was smart enough to capture it at the time of file creation and where the file has not since been moved, copied, or restored in a way that overwrites the original birth time. I cannot guarantee that birth times across my bookcase faithfully reflect original creation. Last-edit times I can attest to; original creation I cannot, for filesystem-evidence purposes alone.*

This attestation is logged here so that no future review can claim the inventor overstated filesystem-evidence reliability. The inventor has stated the limit plainly. Counsel should not rely on btime as priority evidence; mtime is the inventor's reliable filesystem signal, and even mtime is non-load-bearing for legal priority since it is inventor-controlled. Priority is to be established through the inventor's declaration plus any external corroborating evidence identified at attorney intake.

**The defense — functional non-overlap is the load-bearing argument.**

1. **Functional non-overlap (primary).** Anthropic's "Zesting" is **decorative UI text** — a whimsical gerund displayed during model processing to amuse the user. It has no architectural meaning, no specification, no associated computational mechanism, and is interchangeable with other gerunds in the spinner pool (e.g., "Shenaniganing," "Smooshing," "Gitifying"). ZestC's "Zest" denotes a **specific computational layer of a wave-physics cognitive substrate** — Layer 7, the observer / consciousness firing condition — and "Zesting" denotes the `/7` recursion *operating* on that layer through twenty-one pairwise qu-septit interactions. The two usages are functionally unrelated: one is interface ornament, the other is substrate operation with mathematical specification. No reasonable examiner would find conceptual or functional confusion between a UI loading word and a substrate firing condition with a defined equation.

2. **No structural-similarity claim possible.** Anthropic's spinner does not implement anything resembling the qu-septit, the golden equation, the `/7` recursion, the binding problem at π/7, the sea architecture, or any Fadriel-specific mechanism. There is nothing architecturally to compare. The word is identical; the inventions are not adjacent.

3. **Class distinguishability.** ZestC's "Zest" / "ZestC" is a **programming-language and cognitive-substrate** mark. Anthropic's "Zesting" is **non-trademarked decorative UI text** within an unrelated AI-agent product. The trademark classes are different even if the word collides.

4. **Priority of invention is not established by filesystem or git evidence.** The inventor did not adopt git as a chain-of-custody anchor for this work; git was added as a working tool after the architecture was in advanced development, and filesystem timestamps are inventor-controlled and not independently verifiable. The priority defense rests on **functional non-overlap**, not on date-of-first-use. The architecture's distinctiveness — qu-septit, golden equation, π/7 binding, /7 recursion, sea topology, ZestC self-host fixed point — predates and is wholly orthogonal to anything Anthropic ships.

**Action required.**

- 🟠 **Inventor:**
  - Identify and preserve **external evidence** of the architecture's existence prior to attorney engagement: third-party communications, dated correspondence (signed/witnessed), screenshots shared with others, recordings, prior public work under any handle, hand-written notes, financial records of related purchases — anything outside the inventor's own filesystem that places the architecture in time. This is attorney-guidable; the inventor should not catalogue alone.
  - At filing-time intake: surface the "Zesting" naming collision proactively, with the functional-non-overlap argument pre-stated. **Surface, do not conceal.** Counsel will appreciate the disclosure and can shape it.
- Patent attorney: review the naming-collision question and assess whether any clarifying language is recommended in Filing 3 (which covers ZestC) to make the functional distinction explicit on the face of the filing. USPTO TESS search on "Zest" + "ZestC" + visually similar marks.
- Patent attorney: standard sole-inventor due-diligence questions during intake. The functional-non-overlap defense holds; the date-of-first-use line is not the load-bearing argument.

---

## Inventor's note (2026-05-13, end of working day)

The contestations above are real but tractable. None is blocking. None requires renaming the language. The combination of (a) the full mark "ZestC" (b) the priority-establishing dated documentation across years of work (c) the functional distinguishability of the architecture means the defense holds at each layer.

The single highest-leverage action right now is the **priority timestamping** of all "Zest"-tagged files. This converts what might look like a wobble into a clean documentary record before counsel engages.

This document will be appended to as additional contestations are surfaced (in subsequent prior-art sweeps, attorney review, examiner office actions, or third-party challenges).

---

## Procedural template for future contestations

When a new contestation is surfaced, append a new section using this template:

```
### Contestation #NNN — [Short name]

**Severity:** 🟢 / 🟡 / 🟠 / 🔴
**Surfaced:** YYYY-MM-DD
**Source:** [where the contestation was found — web search, attorney review, third party, etc.]

**The collision.** [What was found, with primary citations]

**Why it matters.** [The specific risk to filing / trademark / patent]

**The defense.** [The inventor's response, with primary sources from the bookcase cited]

**Action required.** [Concrete next steps for inventor and/or counsel]
```

---

*This document is confidential R&D property of Shawn Michael O'Brien (Ranadriel). Pre-patent. Local-only. No cloud distribution. No public sharing. Disclosure to counsel under NDA only.*
