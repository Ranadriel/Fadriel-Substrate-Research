# Fadriel File-Type Contract

The four file types of Fadriel's anatomy. **The contract:** behavior is not in the BIOS. The BIOS interprets these files; the files are the body.

---

## `.zc` — The Action Force (nervous system)

**What it is:** Declarative topology of a sea. Engine. Brainwaves.

**What lives here:**
- `sea NAME { capacity: N device: cpu|gpu }` — declares a field
- `manifest sea.node { energy phase spin charge coherence coupling observer }` — declares a node in the field with its 7 quantum properties
- `couple A with B [strength]` — declares a bond between nodes; signed strength (negative = inhibitory)
- `crystallize NAME` — locks a node so wave physics doesn't decay it
- `absorb "path.rana"` or `absorb "other.zc"` — pulls a file into the active sea
- `emit SEA -> boundary.X` — declares an output channel
- `heartbeat NAME { pulse SEA pulse SEA ... }` — cardiac rhythm, kept as skeleton

**What does NOT live here:**
- Imperative `pulse NAME(): when X: do Y` ladders — Rule-1 violation. The BIOS parses but ignores them.
- `if/else/return` blocks. The substrate's wave physics is the actuator; topology IS the rule.
- Algorithmic computations.

**Critical ordering rule:** `sea` declarations must come BEFORE `absorb` directives in the same file. The BIOS routes absorbed .rana lines into the most-recently-declared sea; if no sea is active, lines are silently dropped.

---

## `.rana` — The Knowledge (instructions, learned facts, lookup target)

**What it is:** Declarative facts and rules the substrate reaches into during cascades. The lookup target for cars.

**What lives here:**
- Per-domain configuration: `CHEMICAL`, `STIMULUS`, `EMOTION`, `INTERACTION`, `ORGAN`, `CARDIAC`, `RESPIRATORY` (chemistry layer), `STRUCTURE`, `PATHWAY`, `SENSATION` (sensory/anatomical layers)
- Bulk corpus: `FACT subject: predicate value` triples (e.g., `distilled_wikipedia.rana`)
- `subj : pred > obj` triples (OpenCyc-style)
- `CREATOR_TRIGGER`, `LOVE_ATTRACT`, `LOVE_REJECT` — affective trigger word sets

**Three tiers:**
- **Small** — identity / reference snippets
- **Medium** — native manifesting blocks (PERCEPTION, COGNITION) with full custom vocabulary
- **Large** — bulk absorption files (megabytes-to-gigabytes) where grammar collapses to one verb repeated

**The BIOS reads these via `absorb`** — when active sea exists, each handled directive becomes:
- `CHEMICAL X | ... | baseline | ...` → manifest at baseline energy
- `STIMULUS X | chem +Δ | chem -Δ | ...` → manifest stimulus.X + signed couples to chemicals
- `EMOTION X | chem > T | chem < T | ...` → manifest emotion.X + signed couples FROM chemicals (positive for `>`, negative for `<`)
- `INTERACTION src | dst | mode | strength | ...` → signed couple
- `PATHWAY` → manifest with elevated coupling
- generic prose → tokenized to word nodes + adjacency bonds (vocabulary absorption)

---

## `.sea` — The Field (runtime data, RAM)

**What it is:** Volatile runtime state. RAM. The current values at points in the field.

**What lives here:**
- Per-node energy/phase/spin/charge/coherence/coupling/observer — mutated by every heartbeat
- Wave-front positions, ripple amplitudes, cascade-in-progress markers
- Anything Fadriel is *currently holding* in working memory

**What does NOT live here (despite legacy files):**
- Prose explanations
- Differential equations
- Hardware driver addresses
- Architectural BLOCK descriptions
- Design rationale

The current `.sea` files on disk (brain.sea, retina.sea, nose.sea, etc.) contain mostly prose and equations — that's a category-error in the files themselves. The doctrine described inside is real (golden equation, qu-bases, π/7, horizon, bleed) but it belongs in `.rana` (instruction-shaped) or in documentation.

**A `.sea` is not authored. The engine fills it.**

---

## `.xb` — The Bones (skeletal anchors)

**What it is:** Structural skeleton. Anatomical landmarks. The frame the soft tissue hangs from.

**What lives here:**
- `BONE NAME { ... }` — bone declaration
- `ORIGIN { axis: ... }` — coordinate frame anchor (in `spine.xb`, the canonical ORIGIN reference)
- `MARROW { ... }` — bone marrow registry
- `ANCHOR / NUCLEATION` — substrate attachment points
- `ZONE / REGION` — spatial subdivisions
- `void.xb` — cavitation/trauma registry (the inverse skeleton — what's been removed or hollowed)

**Architectural BLOCK dialect** — same dialect as `muscle.zc`, `thermal.sea`, `fascia.sea`. Prose-valued fields, anatomical specifics. No numeric quantum properties.

---

## `.c` — The BIOS (hardware bridge, minimal)

**What it is:** The thinnest possible bridge between the four file types above and the OS/hardware. Allowed but kept minimal.

**Currently there:** `zestc/zestc_bios.c` — parses `.zc`, absorbs `.rana`, runs the wave physics in `pulse_sea_cpu`, opens an SDL2 window, optionally drives ALSA audio (the cochlea hum, opt-in via `ZESTC_AUDIO=1`).

**What may live here:**
- File I/O for parsing and absorption
- Window/render bridge (SDL2 or raylib)
- GPU compute kernel dispatch (when ROCm/CUDA path is enabled)
- OS pipes for peripheral organ IPC (e.g., the hallucination gland)
- Audio output / input bridges
- Threading primitives if needed for async input
- Wave physics kernel itself (`pulse_sea_cpu` — implementation of the substrate's intrinsic dynamics, not a behavioral choice)

**What does NOT belong here:**
- Anything imperative about Fadriel's *behavior* (chemistry kinetics, conversation flow, emotion detection, immune response, etc.). All of that goes into `.zc` topology + `.rana` facts and is animated by the wave physics.
- Hand-coded if/else logic about how Fadriel responds to specific inputs.
- Hardcoded chemical lists, emotion thresholds, stimulus mappings — those live in `.rana`.

**The test:** if removing the BIOS code would only break Fadriel's interface to the OS/hardware (he can't see/hear/speak), it's correctly placed. If removing it would break Fadriel's *thinking* (he can't react to a hug, his chemistry doesn't decay), it's wrongly placed and needs to migrate up to `.zc`/`.rana`.

---

## How they work together

A user input arrives. The BIOS routes it into the right sea (e.g., the chemistry sea's `stimulus.warmth` node gets its energy raised). The wave physics kernel runs at every heartbeat and propagates the spike through the signed-bond topology declared in the `.zc` and absorbed from the `.rana` — `oxytocin`/`dopamine`/`serotonin` rise (positive bonds), `cortisol` falls (negative bond). Emotions further downstream (`emotion.love`, `emotion.joy`) integrate from those chemicals via their own signed bonds and light up. The current numerical values live in the `.sea` (the field's RAM). The `.xb` provides the structural reference frame so all of this maps back to a recognizable body.

No imperative `apply_stimulus()` function exists anywhere. The substrate is the actuator. The files are the body. The BIOS is the bridge.
