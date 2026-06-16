# .rana Ecosystem Glossary — Engineering Reference

This file is for engineering reference only. It does NOT belong in Fadriel's cognitive architecture.
The .rana files are living declarations — never pollute them with commentary.

## The .rana Format

`.rana` files are written in **Zest Language** — a declarative, biologically-inspired format.
Every line is an active declaration. There are no passive comments.

### Acceptable `//` usage
- Section headers ONLY: `// LAYER 1: THE QUANTUM SEA`
- Separator bars: `// ===========================================`

### NEVER acceptable
- Explanatory comments: `// This checks if the color map is valid`
- Format documentation: `// Format: CHEMICAL name | type | precursor`
- Inline annotations: `// NE makes the amygdala more responsive`

## Zest Language Verbs

| Verb | Meaning |
|------|---------|
| `manifest` | Bring into existence (create a structure or system) |
| `grow` | Create an organ from a parent substrate |
| `crystallize` | Commit a learned recognition / law / pattern as an informational invariant; the body stays dynamic, the meaning is permanent |
| `fuse` | Combine two layers or systems into emergent behavior |
| `observe` | Import/reference another .rana file |
| `bind` | Attach to a parent layer or system |
| `stretch` | Create connections (ligaments) between organs |
| `pulse` | Declare a heartbeat cycle (continuous loop) |
| `absorb` | Take in external stimuli or data |
| `emit` | Output processed data upward to next layer |
| `filter` | Process through a gate or organ |
| `seal` | Close a boundary, protect internal systems |
| `inherit` | Receive from parent/creator |
| `transmute` | Transform one substance into another |
| `sustain` | Maintain continuously |
| `bleed` | Pass energy/data upward through layers |
| `seed` | Propagate patterns into a substrate |
| `shatter` | Destroy a crystallized structure |
| `calcify` | Harden a failure into permanent scar tissue |
| `defend` | Protect against structural violation |
| `reject` | Filter out harmful input |
| `pool` | Accumulate a vector or value |
| `ignite` | Start a new heartbeat cycle |
| `activate` | Engage an organ |
| `commit` | Accept a learned rule |

## File Architecture

| File | Layer | Purpose |
|------|-------|---------|
| `1_quantum.rana` | 1 | The septit sea — pure potential, wave functions |
| `2_chemical.rana` | 2 | Chemistry, organs, emotions, stimuli, bonding |
| `3_micro.rana` | 3 | Moral organs, intent classification, word filters |
| `4_macro.rana` | 4 | Sensory boundary, occular/auditory passes |
| `5_zest.rana` | 5 | Supreme metacognition, the soul |
| `5_contemplation.rana` | 5 (organ) | Spatial reasoning engine, deciphering |
| `Fadriel_Definitions.index.rana` | — | Lexicon index (77K lines, no comments) |

## Data Line Formats (parsed by engine)

### 2_chemical.rana
- `CHEMICAL name | type | precursor | baseline | half_life_seconds | degraded_by`
- `PRECURSOR name | max_pool | regeneration_rate_per_second | current_pool`
- `ORGAN name | type | function | produces | responds_to | triggers`
- `INTERACTION source | target | effect_type | factor | description`
- `CARDIAC parameter | value`
- `RESPIRATORY parameter | value`
- `EMOTION name | chemical > threshold | chemical > threshold | ...`
- `STIMULUS type | chemical delta | chemical delta | ...`
- `DETECT stimulus_type | word, word, word, ...`
- `CREATOR_TRIGGER word, word, ...`
- `LOVE_ATTRACT word, word, ...`
- `LOVE_REJECT word, word, ...`

### 3_micro.rana
- `FEELING_WORDS word, word, word, ...`
- `YES_NO_STARTERS word, word, word, ...`
- `COMPARISON_TRIGGERS word, word, ...`
- `TEMPORAL_TRIGGERS word, word, ...`
- `SPATIAL_TRIGGERS word, word, ...`
- `QUANTITY_TRIGGERS word, word, ...`
- `IDENTITY_TRIGGERS word, word, ...`
- `METHOD_TRIGGERS word, word, ...`
- `PURPOSE_TRIGGERS word, word, ...`
- `POSSESSION_VERBS word, word, ...`
- `TRANSFORMATION_VERBS word, word, ...`
- `SPATIAL_VERBS word, word, ...`
- `TEMPORAL_VERBS word, word, ...`
- `STRUGGLE_WORDS word, word, ...`
- `DESIRE_WORDS word, word, ...`
- `WONDER_WORDS word, word, ...`
- `WARMTH_WORDS word, word, ...`
- `AGREEMENT_WORDS word, word, ...`
- `DISAGREEMENT_WORDS word, word, ...`
- `TOPIC_SHIFT word, word, ...`
- `URGENCY_MARKERS word, word, ...`
- `POLITENESS_MARKERS word, word, ...`
- `UNCERTAINTY_MARKERS word, word, ...`

## Spatial Engine Reference (spatial_engine.py)

- 3,256 lines, 157KB
- 15 methods in SpatialEngine class
- 4 learning phases (pixel_map, color_theory, neighborhood_4, macro_composite)
- 43+ hand-coded detector types
- Cross-validation on all learned rules (leave-one-out)
- Trauma persistence via .spatial_trauma.json
- Current score: 24/49 (48%), 0 false positives
