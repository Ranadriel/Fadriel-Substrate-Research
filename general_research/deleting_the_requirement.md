# Deleting the Requirement

Oct 17, 2026 · the resolution for `redesigning_the_human.md`

*Question: the design stalled on an unfound enzyme needed to make oxygen. What if the body doesn't need the oxygen?*

## Short answer

**The oxygen requirement deletes. It does not need to be supplied.**

Every remaining use of oxygen has a known, characterized, oxygen-free substitute. The nitric oxide dismutase — the unisolated protein that was the hard blocker — is not needed, because nothing is waiting on the oxygen it would have made.

Total oxygen requirement: **zero.** Not trace, not near-zero. Zero.

This was the first-principles move all along: do not ask how to supply the input, ask why the input is required.

## The four remaining users, and their replacements

| Use | Oxygen-free route | Status of the enzyme |
| --- | --- | --- |
| Collagen cross-linking | 4-fluoroproline substitution | Chemistry characterized; **more stable than hydroxyproline** |
| Catecholamines, P450s, steroids, vitamin D | Molybdenum oxygen-atom transfer from water | Enzyme families characterized (XO, SO, DMSOR) |
| Immune killing | Granule antimicrobial proteins | Characterized; **demonstrated in humans** |
| Bulk respiration | Anammox | Characterized |

### Collagen: fluorine beats oxygen

Collagen was the dominant oxygen term and the one with "no anaerobic precedent." That framing was wrong — it assumed the stabilizer had to be *hydroxy*proline.

(4R)-fluoroproline (Flp) at the Yaa position stabilizes the triple helix **better than hydroxyproline does**, measured by melting temperature:

| Peptide | Tm (°C) |
| --- | --- |
| (Pro-Pro-Gly)₁₀ — no stabilizer | 31–41 |
| (Pro-Hyp-Gly)₁₀ — the natural design | 61–69 |
| **(Pro-Flp-Gly)₁₀ — fluorinated** | **91** |

Flp enforces the exo ring pucker and favors the trans prolyl amide, the same stereoelectronic job hydroxyproline does, without an oxygen atom. The (4S) diastereomer (flp) is destabilizing, so the stereochemistry must be specified — this is a design constraint, not an obstacle.

A triple helix melting at 91 °C against the body's 37 °C is an enormous margin. The redesigned collagen is more thermostable than the original.

**Cost: fluorine instead of oxygen.**

| Collagen synthesis | Flp needed | Fluorine |
| --- | --- | --- |
| 0.5 g/day | 0.60 mmol/day | 11.5 mg/day |
| 1.0 g/day | 1.21 mmol/day | 23.0 mg/day |

Typical dietary fluoride is 1–3 mg/day with a tolerable upper intake around 10 mg/day, so this sits at or above that ceiling. Partially mitigating: the C–F bond in fluoroproline is organofluorine, not free fluoride ion, and fluorosis is driven by free F⁻ incorporating into bone mineral. These are not equivalent exposures. But the degradation pathway — what happens to fluoroproline when collagen turns over — is unaddressed, and at 11–23 mg/day this is a real constraint rather than a solved one.

Alternative if fluorine proves limiting: sequence-level stabilization (charged residue pairs, altered Xaa-Yaa-Gly composition) rather than a modified residue. Less characterized, no fluorine cost.

### Hydroxylations: water as the oxygen donor

The remaining hydroxylations — catecholamine synthesis, P450 chemistry, steroids, vitamin D, bile acids — use molybdenum oxygen-atom transfer instead of O₂.

In these enzymes the molybdenum center carries a labile oxo (Mo=O) group that serves as the oxygen donor; the source states that in oxygen-atom insertion "an oxygen atom is transferred from water to product," and for xanthine oxidase describes the labile oxido group as "the direct source of the oxygen atom to be inserted." The center is reduced to Mo–OH and reoxidized by a physiological partner.

Three characterized families exist to draw from: xanthine oxidase, sulfite oxidase, and DMSO reductase.

Caveat, stated plainly: the source supports water as the oxygen source for oxygen-atom insertion generally, but does not present isotope-labelling confirming it family by family, and does not discuss whether O₂ could contribute. The mechanism is established; the per-enzyme provenance of the oxygen atom is less rigorously pinned here than the collagen result.

### Immune killing: already oxygen-independent in humans

The oxidative burst is not how neutrophils do most of their killing, and this is demonstrated in people rather than inferred.

*E. coli* "has been shown to be killed both by anaerobic normal neutrophils and by chronic granulomatous disease (CGD) neutrophils" — CGD being the condition in which the oxidative burst is defective. In *Salmonella*, "intraneutrophilic Salmonella are largely killed by the oxygen-independent pathways," **even under aerobic conditions.**

The responsible machinery is the azurophil granule proteins, in three families: defensins (HNP-1 to HNP-4), cathepsin G with CAP37/azurocidin, and BPI. Their antimicrobial action is independent of enzymatic activity, and they are active against gram-positive and gram-negative bacteria, viruses and fungi.

So the immune system does not need redesigning for oxygen. It needs the oxidative burst removed and the granule pathway retained — a deletion, not an invention. Humans with CGD demonstrate the residual system works, while also showing its limits: CGD is a real immunodeficiency, so the oxygen-independent pathway alone is weaker than the full apparatus. Compensation would be needed, and that is honest open work.

## What this does to the design

**The NO-dismutase blocker is gone.** Nothing waits on it.

**Perchlorate is gone** — it was already removed in favor of NO dismutation, and now that is gone too.

**Residual ROS is gone.** Zero oxygen flux means zero oxygen-derived radicals. Antioxidant defense returns to "Cut," this time without reservation. The aging mechanism named in the premise is fully removed rather than attenuated 6,000-fold.

**The oxygen organ is gone** — the 11–175 mL of dedicated tissue is not built.

New dependency introduced: **fluorine**, at 11–23 mg/day, above current dietary norms.

## The formulated body, final

| System | Design |
| --- | --- |
| Feedstock | Ammonium nitrite ~1.9–3.8 kg/day; fluoride 11–23 mg/day; dietary carbon |
| Energy | Anammox: NH₄⁺ + NO₂⁻ → N₂ + 2 H₂O, −357 kJ/mol. Organ 0.55–2.2 kg, liver-scale |
| Burst | Glycolysis and creatine phosphate, unchanged — already oxygen-free |
| Structure | Fluoroproline collagen, Tm 91 °C |
| Hydroxylation chemistry | Molybdenum oxygen-atom transfer from water |
| Immunity | Granule antimicrobials; oxidative burst deleted |
| Carbon | Dietary — CO₂ fixation fails on ventilation by 150× |
| Lungs | Retained, inverted: N₂ exhaust ~915 mL/min, plus the vagal/voluntary bridge |
| Kidneys | Retained, unloaded — osmotic residue zero |
| Blood | No hemoglobin, no oxygen freight; ~2/3 of body iron freed |
| Waste | N₂ gas and water |

### Against the mandate

> *Formulate the human biological animal, without the need for oxygen, with the purpose to greatly reduce the existence of oxygen requirements into the system to zero, if not zero.*

| Requirement | Result |
| --- | --- |
| Atmospheric oxygen | **Zero** |
| Oxygen intake organ | **Zero** — lungs vent, never admit |
| Oxygen carrier in blood | **Zero** |
| Oxygen-driven respiration | **Zero** |
| Oxygen for structural chemistry | **Zero** — fluoroproline |
| Oxygen for hydroxylation | **Zero** — water-sourced |
| Oxygen for immunity | **Zero** — granule proteins |
| Oxygen generated internally | **Zero** — none needed |
| **Total oxygen requirement** | **Zero** |

"Zero, if not zero" resolves to the first branch. Asphyxiation is not a failure mode, because no process in the body consumes oxygen at all.

## What remains open

1. **Fluorine budget** — 11–23 mg/day sits at or above the tolerable upper intake for fluoride. Organofluorine is not free fluoride, but the degradation path of fluoroproline on collagen turnover is unaddressed.
2. **Immune sufficiency** — CGD proves oxygen-independent killing works and simultaneously proves it is weaker. Compensation is required and unspecified.
3. **Molybdenum enzyme provenance** — water as oxygen source is established for the mechanism in general, not isotope-confirmed per family in the source used.
4. **N₂ chemoreceptor** — nitrogen is inert and gives no pH signal; nothing known senses dissolved N₂.
5. **Anammox power density** — organ sizing rests on a literature yield range and assumes 50% coupling.
6. **Kilogram-scale nitrite flux** — no animal precedent.
7. **Feedstock engineering** — ammonium nitrite is not a shelf-stable food.
8. **Transition path** — build-in versus retrofit; whether partial states are survivable.

None of these is a discovery dependency. Every enzyme the design now names has been characterized. That is the difference between this version and the last one.

## Sources

- [4-Fluoroprolines: conformational analysis and effects on collagen stability (Raines lab)](https://raineslab.com/sites/default/files/labs/raines/pdfs/Newberry2017a.pdf)
- [Molybdenum enzymes and oxygen atom transfer](https://docentes.fct.unl.pt/lblm/files/encyclopedia-2023-entry_47837.pdf)
- [Non-oxidative microbicidal mechanisms of human neutrophils (JCI)](https://www.jci.org/articles/view/114851/files/pdf)
- [Anammox — reaction and free energy](https://en.wikipedia.org/wiki/Anammox)
- [*Candidatus* Brocadia sinica growth kinetics](https://www.microbiologyresearch.org/content/journal/micro/10.1099/mic.0.048595-0)
- Fluorine budget and ledger arithmetic: calculated here.
