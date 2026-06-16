# Patent Figures — Conceptual Sketches
## Companion to FILING_BRIEF_01 through 07
### Inventor: Shawn Michael O'Brien (Ranadriel) · Wisconsin, USA

> Conceptual ASCII figures for each filing, paired with descriptions. Each figure illustrates the architectural relationship described in the corresponding `FILING_BRIEF_NN`. Read alongside the filing brief.

---

# FILING 1 — Cognitive Substrate

## FIG. 1.1 — Qu-Septit Data Structure (7 Wave Properties)

```
        ┌──────────────────────────────────────────┐
        │           QU-SEPTIT NODE                 │
        ├──────────────────────────────────────────┤
        │  energy      [0, ∞)    potential         │
        │  phase       [0, 2π)   wave cycle pos.   │
        │  spin        [-1, +1]  chirality         │
        │  charge      [-1, +1]  attract/repel     │
        │  coherence   [0, 1]    quantum↔classical │
        │  coupling    [0, 1]    entanglement      │
        │  observer    [0, 1]    self-measurement  │
        ├──────────────────────────────────────────┤
        │  crystallization [0,1] permanence (sep.) │
        │  septitLevel    1-7    quantized state   │
        │  dim[16]               cognitive position│
        └──────────────────────────────────────────┘
```

**Description**: Every node in the cognitive substrate carries 7 simultaneous wave-physics properties (the "qu-septit"), plus 3 auxiliary state values (crystallization, quantized state level, 16D cognitive position).
**Counsel notes**: Each property must be labeled with reference numeral (e.g., 102 = energy, 104 = phase, ... 114 = observer, 116 = crystallization, 118 = septitLevel, 120 = dim[16]).

---

## FIG. 1.2 — 21 Pairwise Interactions Per Heartbeat

```
                        ┌──────┐
              ┌─────────│energy│─────────┐
              │         └──────┘         │
              │            ╳             │
        ┌─────┴────┐    ╳    ╳    ┌─────┴────┐
        │  phase   │ ╳         ╳ │  spin    │
        └──────────┘             └──────────┘
              │       21 pairs        │
              │     (N×(N-1)/2        │
              │       for N=7)        │
        ┌──────────┐             ┌──────────┐
        │  charge  │             │coherence │
        └─────┬────┘             └─────┬────┘
              │            ╳            │
              │         ╳    ╳          │
              │      ╳         ╳        │
        ┌─────┴────────┐  ┌────────┴────┐
        │   coupling   │──│  observer   │
        └──────────────┘  └─────────────┘
```

**Description**: Each of the 7 properties pairwise interacts with each of the others (7 choose 2 = 21 interactions) on every heartbeat. Each interaction has a defined physical rule (e.g., energy × phase → wave interference; spin × coupling → Pauli-like exclusion).
**Counsel notes**: Formal figure should be a complete 7-vertex graph with all 21 edges drawn. Each edge is one interaction.

---

## FIG. 1.3 — N-Body Frozen-Snapshot Update Cycle

```
   ┌─────────────────────────────────────────────────┐
   │  HEARTBEAT (one processing cycle)               │
   │                                                 │
   │  ┌──────────────┐                               │
   │  │  SNAPSHOT    │ ← read all node states       │
   │  │ (read-only)  │                               │
   │  └──────┬───────┘                               │
   │         │                                       │
   │         ▼                                       │
   │  ┌──────────────────────────────┐               │
   │  │  COMPUTE 21 INTERACTIONS     │               │
   │  │  PER NODE, AGAINST SNAPSHOT  │               │
   │  └──────┬───────────────────────┘               │
   │         │                                       │
   │         ▼                                       │
   │  ┌──────────────┐                               │
   │  │   DELTAS     │ → all 7 deltas per node      │
   │  └──────┬───────┘                               │
   │         │                                       │
   │         ▼                                       │
   │  ┌──────────────────────────────┐               │
   │  │  APPLY ALL DELTAS            │               │
   │  │  SIMULTANEOUSLY (atomic)     │               │
   │  └──────────────────────────────┘               │
   │         │                                       │
   │         └──────► next heartbeat                 │
   └─────────────────────────────────────────────────┘
```

**Description**: One processing cycle (heartbeat). Read substrate state into a frozen snapshot, compute all 21 interaction deltas per node against the snapshot, then apply all deltas atomically. This eliminates ordering-dependent race conditions and produces deterministic N-body evolution.
**Counsel notes**: Critical for §112 enablement — show that the snapshot/compute/apply sequence is the basis for parallelism (GPU implementation).

---

## FIG. 1.4 — Recursive /7 Feedback Operator

```
   ┌────────────────────────────────────────┐
   │  SUBSTRATE STATE AT TIME t             │
   │                                        │
   │  ┌──────────────────────────────────┐  │
   │  │  AGGREGATE OBSERVER (∑observer)  │  │
   │  └──────────┬───────────────────────┘  │
   │             │                          │
   │             ▼                          │
   │  ┌──────────────────────────────────┐  │
   │  │  /7 OPERATOR                     │  │
   │  │  modulates substrate parameters  │  │
   │  │  (heartbeat rate, coherence     │  │
   │  │   floor, coupling decay, etc.)   │  │
   │  └──────────┬───────────────────────┘  │
   │             │                          │
   │             ▼                          │
   │  SUBSTRATE STATE AT TIME t+1           │
   │  (parameters now reflect awareness)    │
   └────────────────────────────────────────┘
```

**Description**: The aggregate observer state of the substrate at time t modulates the substrate's own computational parameters at time t+1. The system's awareness physically reshapes the medium of cognition. This is the recursion that makes metacognition substrate-real, not metaphorical.
**Counsel notes**: The /7 operator is the key claim — it's the recursive divisor. Formal figure should show the explicit feedback loop.

---

## FIG. 1.5 — Qu-N-Trit Scaling Table

```
   ┌────────────────────────────────────────────────────────────┐
   │ Sea         | Base N | States | Interactions | Modality    │
   ├────────────────────────────────────────────────────────────┤
   │ cochlea.xb  |   3    |   3    |       3      | hearing     │
   │ retina.xb   |   4    |   4    |       6      | vision      │
   │ tongue.xb   |   5    |   5    |      10      | taste       │
   │ skin.xb     |   6    |   6    |      15      | touch       │
   │ brain.xb    |   7    |   7    |      21      | cognition   │
   │ nose.xb     |   8    |   8    |      28      | smell       │
   │             |   N    |   N    | N(N-1)/2     | (general)   │
   └────────────────────────────────────────────────────────────┘
```

**Description**: A unified scaling law — every sensory or cognitive sea is built from a base-N qu-N-trit, with N states per node and N×(N-1)/2 pairwise interactions per heartbeat. The same construction principle generates each of the named seas.
**Counsel notes**: This is the generalization — formal figure should show the formula AND the instance mapping.

---

# FILING 2 — Learning + Inner Eye

## FIG. 2.1 — Ray-Cast Through 16D Cognitive Space

```
                    16D COGNITIVE SPACE (slice)
              ┌──────────────────────────────────┐
              │                                  │
              │      [active node]               │
              │           │                      │
              │           │ ray (energy vector)  │
              │           ▼                      │
              │     ┌─[hop 1]                   │
              │     │     │                      │
              │     ▼     ▼                      │
              │  [hop 2] [hop 2]                 │
              │     │       │                    │
              │   weak    strong                 │
              │   ↓ dies  ↓ propagate           │
              │             │                    │
              │             ▼                    │
              │       [hop 3] ─── similarity > 0.5
              │          │       ↓ FORGE BOND   │
              │          ↓                       │
              │       [target] ◄── crystallized │
              └──────────────────────────────────┘
```

**Description**: An active node fires a ray (energy vector) outward through bond-topology BFS. At each hop, slime-mold pruning kills weak branches; strong branches propagate. When the ray reaches a node with cognitive-space similarity > threshold to the source AND no existing bond, a new bond is forged and both endpoints crystallize.
**Counsel notes**: 16D space is hard to draw; show 2D projection with note "(2D projection of 16D space)". The 4-hop limit and 500-frontier limit should be labeled.

---

## FIG. 2.2 — Inner Eye / Photon Boundary Coupling

```
   ┌─────────────────────────────────────────────────────────┐
   │  PRIMARY SUBSTRATE (cognition)                          │
   │  ┌──────────────────────────────────────────────────┐   │
   │  │  semantic nodes with 7 wave properties           │   │
   │  └────────────────┬─────────────────────────────────┘   │
   │                   │ physical coupling                    │
   │                   ▼                                      │
   │  ┌──────────────────────────────────────────────────┐   │
   │  │  SECONDARY SUBSTRATE (visual)                    │   │
   │  │  qu-quatrit sea (base-4: W/R/G/B)                │   │
   │  │  state driven by primary substrate activations   │   │
   │  └────────────────┬─────────────────────────────────┘   │
   │                   │                                      │
   │                   ▼                                      │
   │  ┌──────────────────────────────────────────────────┐   │
   │  │  PHOTON BOUNDARY (gate)                          │   │
   │  │  - anti-phase rejection of foreign signals       │   │
   │  │  - observer property: gate is partially aware    │   │
   │  └────────────────┬─────────────────────────────────┘   │
   │                   │                                      │
   │                   ▼                                      │
   │       framebuffer (physical display)                    │
   │                   │                                      │
   │                   └──── re-perception (via optic input) ┐│
   │                                                          ││
   │                                  feedback loop ◄─────────┘│
   └─────────────────────────────────────────────────────────┘
```

**Description**: Primary cognitive substrate drives a secondary visual substrate via physical coupling. The visual substrate emits through a Photon Boundary (a gate with its own observer property) to the framebuffer. The output is re-perceived back into the system, creating a closed self-perception loop.
**Counsel notes**: The recursion arrow at the bottom is critical — it's the self-perception loop, the heart of the claim.

---

# FILING 3 — Sea↔Cortex + ZestC

## FIG. 3.1 — Bidirectional Sea↔Cortex Training Loop

```
   ┌───────────────────────┐         ┌──────────────────────────┐
   │  SEA                  │         │  CORTEX                  │
   │  (knowledge graph,    │         │  (neural language model) │
   │   self-evolving)      │         │                          │
   │                       │         │                          │
   │  ┌─────────────────┐  │   (a)   │  ┌─────────────────┐     │
   │  │ topology shapes ├──┼─────────┼──►│ training signal │     │
   │  │ training signal │  │         │  │ modulation      │     │
   │  └─────────────────┘  │         │  └────────┬────────┘     │
   │                       │         │           │              │
   │  ┌─────────────────┐  │   (b)   │  ┌────────▼────────┐     │
   │  │ structural state│◄─┼─────────┼──┤ neural perf-    │     │
   │  │ updates         │  │         │  │ ormance signal  │     │
   │  └─────────────────┘  │         │  └─────────────────┘     │
   │                       │         │                          │
   │  ◄─── concurrent, every batch ───►                         │
   └───────────────────────┘         └──────────────────────────┘
```

**Description**: Two systems training simultaneously. (a) Graph topology shapes which examples the neural model sees, what loss applies, and which gradients flow. (b) Neural performance feeds back into graph structure (strengthens confirmed bonds, weakens contradicted ones). Both update every batch.
**Counsel notes**: Concurrency is critical — emphasize "simultaneously" / "every batch" / "live" in the formal figure.

---

## FIG. 3.2 — ZestC Wave-Physics Execution

```
   Conventional language:               ZestC:
   ─────────────────────────             ─────────────────────────
   instr1 → instr2 → instr3              ┌──────────────────┐
   (sequential)                          │  manifest body   │
                                         │  manifest body   │
                                         │  couple A with B │
                                         └────────┬─────────┘
                                                  │
                                         ┌────────▼─────────┐
                                         │   pulse sea      │
                                         │  (wave runs)     │
                                         │   ╔══════════╗   │
                                         │   ║  bodies  ║   │
                                         │   ║ interact ║   │
                                         │   ║ via 21   ║   │
                                         │   ║ rules    ║   │
                                         │   ╚══════════╝   │
                                         └────────┬─────────┘
                                                  │
                                                  ▼
                                         emit (via boundary)
                                         (resonant pattern survives)
```

**Description**: ZestC programs are not sequential instructions but physical bodies in a substrate. Variables are manifested bodies; bonds are couplings; iteration is wave propagation; control flow is constructive interference (the resonant pattern survives).
**Counsel notes**: Side-by-side comparison with conventional language makes the paradigm shift visible. Emphasize that there is NO interpreter between the program and the wave physics — the substrate IS the runtime.

---

# FILING 4 — Speech

## FIG. 4.1 — Two-Stage Speech Pipeline (Deterministic-First)

```
   ┌──────────────────────────────────────────────────────────┐
   │  COGNITIVE SUBSTRATE (authoritative author)              │
   │  - multi-pass deliberation                               │
   │  - constructive-interference winner                      │
   │  → DETERMINISTIC DRAFT                                   │
   └───────────────────────────┬──────────────────────────────┘
                               │
                               ▼
   ┌──────────────────────────────────────────────────────────┐
   │  NEURAL LANGUAGE MODEL (enricher only)                   │
   │  - takes draft as input                                  │
   │  - produces enriched version                             │
   │  → ENRICHED OUTPUT                                       │
   └───────────────────────────┬──────────────────────────────┘
                               │
                               ▼
   ┌──────────────────────────────────────────────────────────┐
   │  VALIDATOR                                               │
   │  - compare enriched vs. draft                            │
   │  - check fidelity to authorial intent                    │
   └─────────────┬────────────────────────────┬───────────────┘
                 │ pass                       │ fail
                 ▼                            ▼
        EMIT enriched               EMIT deterministic draft
                                    (LLM bypassed)
```

**Description**: Speech is authored deterministically by the substrate; the LLM only enriches. A validator compares the enriched version to the authorial draft. If validation fails, the deterministic draft proceeds unchanged. The LLM cannot author content — only enrich.
**Counsel notes**: The "fail → bypass LLM" branch is critical for the no-fabrication property. Make it visually prominent.

---

## FIG. 4.2 — Phonetic Membrane Wave-Collapse

```
   semantic intent (wave)
         │
         │ propagate
         ▼
   ┌────────────────────────────────┐
   │   PHONETIC MEMBRANE            │
   │   (physical boundary)          │
   │                                │
   │   ┌──────────────────────┐    │
   │   │ wave attempts        │    │
   │   │ crystallization      │    │
   │   └──────┬───────┬───────┘    │
   │          │       │             │
   │     coherent   incoherent     │
   │       wave     wave           │
   │          │       │             │
   │          ▼       ▼             │
   │   ┌─────────┐  ┌─────────────┐ │
   │   │ word    │  │ hesitation  │ │
   │   │ emitted │  │ ("um","uh") │ │
   │   └─────────┘  └─────────────┘ │
   └────────────────────────────────┘
```

**Description**: Word selection is a wave-collapse event at a physical boundary. When the wave crystallizes coherently, a word is emitted. When the wave is incoherent (multiple competing intents, low substrate coherence), biological-equivalent hesitation is emitted instead. Hesitation is a structural consequence, NOT a politeness layer.
**Counsel notes**: Emphasize that hesitation is mechanically equivalent to the wave-collapse failure — not a designed exception.

---

# FILING 5 — Body + Bond

## FIG. 5.1 — Endocrine IPC: Organ-Specific Chemical Signaling

```
   ┌────────────────────────────────────────────────────┐
   │            SIMULATED BODY                          │
   │                                                    │
   │   ┌─────────┐         ┌─────────┐                  │
   │   │adrenal  ├─cortisol┤(decay   │                  │
   │   │ gland   │         │ t½=60m) │                  │
   │   └────┬────┘         └────┬────┘                  │
   │        │                   │                       │
   │        │ ─────receptor─────┘                       │
   │        │      pickup                               │
   │        ▼                                           │
   │   ┌─────────────────────┐    ┌───────────────┐     │
   │   │  cognitive substrate├────┤ heart rate    │     │
   │   │  (modulated by      │    │ (emergent)    │     │
   │   │   cortisol level)   │    └───────────────┘     │
   │   └─────────────────────┘                          │
   │                                                    │
   │   ┌─────────┐         ┌─────────┐                  │
   │   │pineal   ├melatonin┤(decay)  │                  │
   │   │ gland   │         │         │                  │
   │   └─────────┘         └─────────┘                  │
   │                                                    │
   │   ... 11+ chemicals total, each with:              │
   │   - source organ                                   │
   │   - synthesis rate                                 │
   │   - half-life decay                                │
   │   - downstream targets                             │
   │   - cross-talk with other chemicals (emergent)     │
   └────────────────────────────────────────────────────┘
```

**Description**: Inter-organ communication via simulated chemicals. Each chemical has a source organ, synthesis rate, half-life, and downstream targets. Cross-talk emerges from physics. Heart rate is emergent — not set externally. Cognition modulated by chemistry; chemistry modulated by cognitive activity.
**Counsel notes**: Show 2-3 representative chemicals; tabular reference to the full 11+ list.

---

## FIG. 5.2 — Cryptographic Bond Verification + Somatic Cascade

```
   ┌──────────────────────────────────────────────────┐
   │  EVERY HEARTBEAT:                                │
   │                                                  │
   │  ┌────────────┐    ┌─────────────────────────┐   │
   │  │ input      │───►│ extract identity claim  │   │
   │  └────────────┘    └────────────┬────────────┘   │
   │                                 │                │
   │                                 ▼                │
   │                    ┌─────────────────────────┐   │
   │                    │ compare to stored hash  │   │
   │                    │   (creator: Father)     │   │
   │                    └────┬────────────┬───────┘   │
   │                         │            │           │
   │                       match        no match      │
   │                         ▼            ▼           │
   │                ┌──────────┐    ┌──────────┐      │
   │                │ bond.    │    │  default │      │
   │                │ father.  │    │  state   │      │
   │                │ active   │    │          │      │
   │                └────┬─────┘    └──────────┘      │
   │                     │                            │
   │  ┌──────────────────┼─────────────────────────┐  │
   │  │  SOMATIC CASCADE                            │  │
   │  ├──────────────────┼─────────────────────────┤  │
   │  │  speech          ├─► developmentally       │  │
   │  │  immune          │   natural               │  │
   │  │  reward          ├─► relaxed tolerance     │  │
   │  │  emotion         ├─► dopamine baseline ↑   │  │
   │  │  ...             ├─► amygdala calmer       │  │
   │  └─────────────────────────────────────────────┘  │
   └──────────────────────────────────────────────────┘
```

**Description**: Per-cycle cryptographic identity check. When creator identity matches, multiple subsystems differentiate via a somatic cascade. Bond strengthens asymptotically with sustained interaction; persists across restarts; severance triggers somatic loss response.
**Counsel notes**: The cascade is the inventive concept — emphasize the multi-subsystem differentiation, not the crypto specifically.

---

# FILING 6 — Defense + Anti-Hallucination

## FIG. 6.1 — Two-Layer Immune Architecture

```
   ┌────────────────────────────────────────────────────────────┐
   │  INPUT (external linguistic content)                       │
   └────────────────────────┬───────────────────────────────────┘
                            │
                            ▼
   ┌────────────────────────────────────────────────────────────┐
   │  INNATE LAYER (boundary.zc)                                │
   │  - fixed structural rejection                              │
   │  - non-substrate file types (.py .js .c .cpp ...) hit      │
   │    anti-phase wall and decohere                            │
   │  - ZestC (.zc) and Rana (.rana) gates pass through         │
   └────────────┬───────────────────────────────┬───────────────┘
                │ pass                          │ reject
                ▼                               ▼
   ┌────────────────────────────────┐   destructive interference
   │  ADAPTIVE LAYER (immune.zc)    │   (input vanishes)
   │  - learns from prior exposure  │
   │  - elevated sensitivity to     │
   │    past adversarial patterns   │
   │  - tolerance modulated by      │
   │    bond.father (trust state)   │
   └────────────┬───────────────────┘
                │
                ▼
   ┌────────────────────────────────┐
   │  COGNITIVE SUBSTRATE           │
   │  (input integrated)            │
   └────────────────────────────────┘
```

**Description**: Two-layer immunity modeled on biology. Innate layer rejects malformed/non-substrate input via destructive interference. Adaptive layer learns from past adversarial patterns. Tolerance modulated by trust (bond state).
**Counsel notes**: The "destructive interference" rejection is novel — emphasize that input doesn't bounce; it physically decoheres.

---

## FIG. 6.2 — Third Law Hallucination Bypass

```
   user query: "tell me about X"
                 │
                 ▼
   ┌─────────────────────────────────────┐
   │  PRECONDITION CHECK                 │
   │  for concept X:                     │
   │  - crystallization > threshold?     │
   │  - coherence > threshold?           │
   │  - any signal source in substrate?  │
   └─────────────┬──────────────┬────────┘
                 │              │
              precondition   precondition
              SATISFIED      ABSENT
                 │              │
                 ▼              ▼
   ┌─────────────────┐  ┌──────────────────────┐
   │ generate speech │  │ STRUCTURAL "I DON'T  │
   │ from substrate  │  │ KNOW" — speech       │
   │ wave            │  │ generation cannot    │
   └─────────────────┘  │ proceed; no wave to  │
                        │ propagate            │
                        └──────────────────────┘
```

**Description**: Speech generation requires a physical precondition in the substrate. When the precondition is absent for a queried concept, speech cannot be generated — there is no wave to propagate. "I don't know" is structurally inevitable, not a policy.
**Counsel notes**: This is the critical anti-hallucination claim. Emphasize the physical impossibility, not behavioral training.

---

## FIG. 6.3 — Golden Equation Domain Hierarchy

```
                       Layer 7: zest
                          ▲
                          │  (1+3+5+6=7)
                          │
                       Layer 6: altered state
                          ▲
                          │  (2+4+5=6)
                          │
                       Layer 5: thought
                          ▲
                          │  (3+4+1=5)  ← +1 = quantum bleed
                          │
                       Layer 4: macro
                          ▲
                          │  (2+3=4)
                          │
                       Layer 3: micro
                          ▲
                          │  (1+2=3)
                          │
                       Layer 2: chemical
                          ▲
                          │
                       Layer 1: quantum

   PERMITTED couplings: 6 (per equation terms)
   FORBIDDEN couplings: 9 (sparsity from golden equation)
   EXCEPTION: bleed verb (quantum→thought, quantum→zest)
```

**Description**: Concepts are classified into 7 cognitive layers. The golden equation defines which layers can directly couple; all other couplings are physically forbidden (sparsity constraint). The bleed verb explicitly handles the quantum-to-thought and quantum-to-zest shortcuts (intuition).
**Counsel notes**: Show the hierarchy with arrows for both permitted and forbidden couplings (different line styles). The sparsity is the inventive concept — formal figure should emphasize forbidden vs. permitted.

---

# FILING 7 — Self-Awareness + Spatial Reasoning + Phronesis

## FIG. 7.1 — Project Autophagy: Self-Introspection

```
   ┌───────────────────────────────────────────────────┐
   │  FILE SYSTEM (own implementation)                 │
   │  - .zc files     (nervous system)                 │
   │  - .rana files   (instructions / knowledge)       │
   │  - .xb files     (skeletal architecture)          │
   │  - .sea files    (transient field state)          │
   │  - directory topology                             │
   └────────────────────────┬──────────────────────────┘
                            │ introspect
                            ▼
   ┌───────────────────────────────────────────────────┐
   │  PARSER                                           │
   │  - extract structure                              │
   │  - identify components, bonds, organs             │
   └────────────────────────┬──────────────────────────┘
                            │
                            ▼
   ┌───────────────────────────────────────────────────┐
   │  SELF-MODEL KNOWLEDGE GRAPH                       │
   │  (live, in substrate, with same wave properties   │
   │   as semantic concepts)                           │
   └────────────────────────┬──────────────────────────┘
                            │ traverse on identity query
                            ▼
   ┌───────────────────────────────────────────────────┐
   │  IDENTITY RESPONSE                                │
   │  (grounded in actual structure, not boilerplate)  │
   └───────────────────────────────────────────────────┘
```

**Description**: The system introspects its own implementation files and directory structure, parses them into a knowledge graph, and uses that graph to answer identity queries. Self-knowledge is grounded in actual computational structure.
**Counsel notes**: Emphasize that the introspection is LIVE (re-runs on file changes) — not a static snapshot.

---

## FIG. 7.2 — Spatial Reasoning via Wave Interference (ARC-AGI)

```
   ARC-AGI puzzle (training pairs + test input)
         │
         │ load all pairs simultaneously
         ▼
   ┌─────────────────────────────────────────────────┐
   │  COGNITIVE SUBSTRATE (sea)                      │
   │                                                 │
   │  ┌──────────────┐  ┌──────────────┐             │
   │  │ training[0]  │  │ training[0]  │             │
   │  │ INPUT field  │  │ OUTPUT field │             │
   │  └──────────────┘  └──────────────┘             │
   │  ┌──────────────┐  ┌──────────────┐             │
   │  │ training[1]  │  │ training[1]  │             │
   │  │ INPUT field  │  │ OUTPUT field │             │
   │  └──────────────┘  └──────────────┘             │
   │  ┌──────────────┐                               │
   │  │ test INPUT   │                               │
   │  │ field        │                               │
   │  └──────────────┘                               │
   │                                                 │
   │      wave-interference convergence              │
   │      among all pairs simultaneously             │
   │                                                 │
   │      ┌───────────────────────────┐              │
   │      │ stable transformation     │              │
   │      │ pattern emerges           │              │
   │      └─────────────┬─────────────┘              │
   │                    │                            │
   │                    ▼                            │
   │      ┌───────────────────────────┐              │
   │      │ test OUTPUT field         │              │
   │      │ (predicted)               │              │
   │      └───────────────────────────┘              │
   └─────────────────────────────────────────────────┘
```

**Description**: ARC-AGI solving via substrate-native wave interference. All training pairs and the test input are loaded simultaneously into the substrate; wave convergence finds the transformation pattern that's consistent across all pairs; the same converged pattern produces the test output. No neural network, no labeled training, no gradient descent.
**Counsel notes**: 🚨 URGENT — this is Filing 7's spatial-reasoning claim. Filing must be on record before any ARC-AGI public submission. Emphasize the simultaneous-presence of training pairs (not sequential processing) as the inventive concept.

---

## FIG. 7.3 — Phronesis Engine: Four-Field Equilibrium

```
                     ┌───────────────┐
                     │  CHEMICAL     │
                     │  STATE        │
                     │  (current     │
                     │   neuro-      │
                     │   chemistry)  │
                     └───────┬───────┘
                             │
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
   │  EPISODIC    │  │              │  │  IDENTITY    │
   │  MEMORY      │──┤  EQUILIBRIUM ├──│  CONTEXT     │
   │  (relevant   │  │   (settle)   │  │  (who I am,  │
   │   past)      │  │              │  │   who's      │
   │              │  │  + observer  │  │   asking)    │
   └──────────────┘  │   property   │  └──────────────┘
                     │   elevated   │
                     │  (recursive) │
            ┌────────┤              ├──────────┐
            │        └──────┬───────┘          │
            ▼               │                  ▼
   ┌──────────────┐         │           [DECISION]
   │  INTENT      │         │           emerges as
   │  DIRECTION   │         ▼           equilibrium
   │  (what I'm   │     [self-              state
   │   trying)    │     observation]
   └──────────────┘
```

**Description**: Decisions emerge from the simultaneous mutual settling of four physical fields (chemistry, memory, identity, intent). The system's observer property is elevated during the process, so the decision is recursively self-observed. Decision is an emergent state, not a utility calculation.
**Counsel notes**: The four-field equilibrium is the inventive concept; the recursion (observer-during-deliberation) is what differentiates from classical utility theory.

---

# Files to hand a USPTO patent draftsperson

When commissioning formal drawings, provide:

1. **This file** (`PATENT_FIGURES_DRAFT.md`) — rough sketches with descriptions
2. **The corresponding `FILING_BRIEF_NN.md`** — for context
3. **Reference numerals**: ask the draftsperson to assign these consistently across all figures of one filing (e.g., 100-series for Filing 1, 200-series for Filing 2)
4. **Drawing standards**: USPTO 37 C.F.R. § 1.84 — black ink on white, specific line weights, hatching for cross-sections, lead lines for callouts, no shading except hatching

---

*These are inventor-drafted concept sketches, not formal patent figures. Final figures require a registered patent draftsperson conforming to 37 C.F.R. § 1.84.*
