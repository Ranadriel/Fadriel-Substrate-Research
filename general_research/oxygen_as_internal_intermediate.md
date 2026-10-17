# Oxygen as Internal Intermediate

Oct 17, 2026 · working note supporting `redesigning_the_human.md`

*Question: the mandate says reduce oxygen requirements to zero, if not zero. What does "if not zero" actually resolve to?*

## Short answer

Oxygen stops being an **input** and becomes an **internal intermediate**, generated on demand in the dark.

Two numbers define the answer:

- **Atmospheric oxygen requirement: zero.** Nothing is inhaled.
- **Internal oxygen requirement: roughly 1 g/day**, against 740 g/day for aerobic respiration — about a **740-fold reduction**, generated enzymatically rather than breathed.

The mechanism already exists in bacteria. Chlorite dismutase makes molecular oxygen from chlorite with no light and no oxygen input, a reaction the literature titles "Production of Dioxygen in the Dark."

## Why "zero" alone fails

The first draft cut oxygen entirely and put collagen cross-linking and immune killing on an "invent from scratch" list. Those two resisted because they genuinely need an oxygen atom, not because of legacy design:

- Collagen hydroxylases stamp oxygen onto proline and lysine so the triple helix can cross-link. No anaerobic precedent exists anywhere in biology.
- The immune oxidative burst weaponizes O2 into radicals.
- Neurotransmitter synthesis, P450s, steroids and vitamin D all want an oxygen atom, though water-sourced molybdenum routes can substitute there.

Inventing oxygen-free collagen chemistry is a harder problem than generating trace oxygen internally. The cheaper solve is to keep the oxygen chemistry and change where the oxygen comes from.

## The mechanism: perchlorate respiration

Perchlorate-reducing bacteria are facultative anaerobes that use perchlorate and chlorate as terminal electron acceptors when oxygen is absent. The pathway runs:

**ClO₄⁻ → ClO₃⁻ → ClO₂⁻ → Cl⁻ + O₂**

Standard potentials, per the cited source: E°(ClO₄⁻/ClO₃⁻) = 0.79 V, E°′(ClO₃⁻/ClO₂⁻) = 0.71 V, E°′(ClO₂⁻/ClO⁻) = 1.175 V. Chlorite is a strong oxidant that damages cells, so it is detoxified immediately by chlorite dismutase (Cld), a heme b enzyme that converts chlorite to chloride and O₂ — forming a covalent oxygen-oxygen bond, which the source notes is rare in biochemistry, via a hypochlorite intermediate.

**Honest caveat:** whether the cell *uses* the oxygen it makes is not established. The source says it "might be possible that these organisms use molecular oxygen formed by Cld," and notes the physiological substrate of Clds is unknown since many Cld-containing organisms do not produce chlorite. The enzyme's oxygen production is solid; its purpose is a hypothesis. For this design that is enough — the reaction is real and the oxygen is real.

## Calculated: the oxygen ledger

Residual oxygen demand once bulk respiration is deleted. These are my rough estimates, not measured values.

| Demand | Estimate |
| --- | --- |
| Collagen hydroxylation (~3 g/day turnover) | ~320 mg O2/day |
| Neurotransmitters, P450s, steroids, immune burst | same order, a few hundred mg/day |
| **Total residual** | **order 1 g/day** |
| Aerobic respiration, for comparison | 740 g/day |
| **Reduction factor** | **~740×** |

Perchlorate needed to generate 1 g/day of O2 via the dismutase route: about **3.1 g/day**.

## The dose problem

This is the real obstacle, and it is severe.

Perchlorate inhibits iodide uptake by thyroid follicular cells, competing with iodine at the sodium-iodide symporter (NIS), lowering T3 and T4 synthesis and producing effects like iodine deficiency. The EPA reference dose is **0.0007 mg/kg/day** — about 0.049 mg/day for a 70 kg adult.

| Use case | Perchlorate/day | × EPA RfD |
| --- | --- | --- |
| Full baseline energy on perchlorate | 1.40 kg | ~2.9 × 10⁷ |
| Oxygen generation only (1 g O2/day) | 3.1 g | ~6.3 × 10⁴ |

Running the whole metabolism on perchlorate is not viable. Using it **only** as an on-demand oxygen source cuts the exposure by four orders of magnitude, which is the difference between absurd and merely very hard. The division of labor matters: sulfide or iron carries the energy, perchlorate carries only the oxygen-atom supply.

## The toxicology pattern — three for three

Every candidate chemical in this design is toxic to humans *through a component the design removes*:

| Agent | Mechanism of toxicity | Target in redesign |
| --- | --- | --- |
| Hydrogen sulfide | Inhibits cytochrome c oxidase (complex IV), binding its ferric moiety — "nearly identical to cyanide" | **Deleted** (terminal oxidase removed) |
| Nitrite | Oxidizes hemoglobin iron from Fe²⁺ to Fe³⁺; "Fe+3 cannot bind oxygen" → methemoglobinemia | **Deleted** (hemoglobin removed as oxygen freight) |
| Perchlorate | Competes with iodide at NIS, suppressing thyroid hormone synthesis | **On the rebuild list** (thyroid hormone synthesis is itself oxygen/peroxide-dependent) |

This is not coincidence. These compounds are poisons to us because we are aerobes; their lethality is aimed at oxygen-handling machinery. **The toxicology of this body is not the toxicology of a human.** The first two vulnerabilities vanish outright. The third is partial: NIS competition is a transport-level effect that survives independently of the oxygen chemistry downstream, so perchlorate exposure remains a genuine constraint rather than a designed-out one.

## Resolution of the mandate

> *Reduce the existence of oxygen requirements into the system to zero, if not zero.*

| Requirement | Result |
| --- | --- |
| Atmospheric / inhaled oxygen | **Zero** |
| Lungs for oxygen intake | **Zero** (lungs retained as N2 exhaust and vagal bridge) |
| Hemoglobin, red cells, oxygen freight | **Zero** |
| Oxygen-driven bulk respiration | **Zero** |
| Oxygen atoms for structural and signaling chemistry | **~1 g/day, generated internally** |

"Zero, if not zero" resolves cleanly: zero *dependence*, trace *presence*. The body never needs the atmosphere to contain oxygen, and never suffocates, because the only oxygen it uses it makes itself, a gram at a time, where and when a reaction calls for it. Asphyxiation stops being a failure mode because there is no intake to interrupt.

## Open questions

1. Can chlorite dismutase turnover reach ~1 g O2/day in human tissue, and can the oxygen be delivered at the point of use without a carrier?
2. Chlorite is a strong cellular oxidant. Can the perchlorate→chlorite→O2 chain be kept contained enough to be safe?
3. Can perchlorate exposure be cut below the NIS threshold, or must iodide transport be redesigned alongside it?
4. Is a non-chlorine oxygen-generating route available? Other oxyanion dismutases exist and were not surveyed here.
5. Does trace internal oxygen reintroduce reactive oxygen species, and therefore the aging mechanism the premise set out to remove? At 1/740th the flux the damage should scale down, but the antioxidant systems were marked "Cut" and may need partial retention.

## Sources

- [Perchlorate and chlorate respiration, chlorite dismutase (PMC4162996)](https://pmc.ncbi.nlm.nih.gov/articles/PMC4162996)
- [Production of Dioxygen in the Dark: Dismutases of Oxyanions](https://link.springer.com/chapter/10.1007/978-3-319-12415-5_3)
- [Crystal Structure of Chlorite Dismutase, a Detoxifying Enzyme Producing Molecular Oxygen](https://www.sciencedirect.com/science/article/abs/pii/S0022283609000874)
- [Perchlorate toxicology, NIS inhibition and EPA reference dose](https://clu-in.org/contaminantfocus/default2.focus/sec/Perchlorate/cat/Toxicology/)
- [Hydrogen sulfide toxicity — WikEM](https://wikem.org/wiki/Hydrogen_sulfide_toxicity)
- [Methemoglobinemia mechanism](https://emdaily1.cooperhealth.org/content/critical-cases-methemoglobinemia)
- Oxygen ledger, dose ratios and residual-demand estimates: calculated here; not taken from a cited source.
