# Feasibility Check

Oct 17, 2026 · verification pass on `nitrogen_closure.md`

*Question: the formulation closed on paper. Do the numbers survive checking?*

## Short answer

Three of the open gaps close. One was an arithmetic artifact of my own, one was an overestimate of mine in the conservative direction, and one resolves to a concrete organ size. Two gaps remain genuinely open, and one of those is a hard blocker.

| Gap | Status after checking |
| --- | --- |
| O₂ generation "16–33× short" | **Closed** — artifact of bad scaling. Needs ~175 mL of tissue. |
| Residual O₂ demand estimate | **Revised down** — 19–116 mg/day, not 160–320. My stoichiometry was 3× too high. |
| Anammox power density | **Closed** — a 0.55–2.2 kg organ, liver-scale. Slow doubling was a red herring. |
| Residual ROS | **Quantified** — ~1/6,000th of aerobic flux. |
| NO-dismutase enzyme | **Still open — hard blocker.** No identified protein. |
| N₂ chemoreceptor | **Still open.** No precedent. |

## 1. The oxygen shortfall was my error

I scaled culture rates **per cell** from archaea to humans. That is invalid: *N. maritimus* SCM1 measures 0.32–0.41 µm diameter by 0.59–1.35 µm long, giving a cell volume near **0.089 µm³** against roughly 2,000 µm³ for a human cell — a factor of about **22,000**. Treating the two as equivalent units understated capacity by four orders of magnitude.

Scaling by **biomass volume** instead:

- Culture density 5 × 10⁷ cells/mL × 0.089 µm³ = **4.4 ppm biomass by volume.** The measured rates come from an extremely dilute suspension.
- Measured 21.12 nmol·L⁻¹·h⁻¹ ÷ 4.4 ppm = **4.77 mmol per litre of biomass per hour.**

| Target | Pure biomass | At 50% tissue packing | % of 70 L body |
| --- | --- | --- | --- |
| 320 mg O₂/day | 87 mL | **175 mL** | 0.25% |

That is kidney-scale (≈150 mL). The oxygen-generating organ is small. **The 16–33× shortfall does not exist.**

## 2. Residual oxygen demand was overestimated — by me, threefold

The earlier figure assumed one hydroxylation per three collagen residues (~33%). That is wrong. Collagen is about one-third glycine, with proline plus hydroxyproline together 15–30% of residues, 3-hydroxyproline up to ~1%, and hydroxylysine roughly 0.5–7%. Hydroxylated residues are therefore on the order of **11%**, not 33%.

With prolyl hydroxylase consuming one O₂ per hydroxylation:

| Collagen synthesis | O₂ at 11% (corrected) | O₂ at 33% (earlier) |
| --- | --- | --- |
| 0.5 g/day | 19 mg/day | 58 mg/day |
| 1.0 g/day | 39 mg/day | 116 mg/day |
| 3.0 g/day | 116 mg/day | 348 mg/day |

Adult collagen turnover is slow — radiocarbon work finds minimal turnover in cartilage, and bone collagen turns over at a few percent per year — so the low end of the synthesis range is the realistic one. **Revised residual demand: roughly 20–120 mg O₂/day**, against the 160–320 mg previously carried.

This makes the oxygen organ smaller still: at 120 mg/day it needs about **66 mL** at 50% packing; at 20 mg/day, about 11 mL — thyroid-scale.

Against 740 g/day for aerobic respiration, the reduction factor rises from ~740× to roughly **6,000×**.

Caveat: whole-body collagen synthesis rate remains the uncertain input. I did not find a single measured whole-body figure; the range above is bounded by plausible values rather than pinned by one.

## 3. Anammox power density: a liver-scale organ

*Candidatus* Brocadia sinica has a measured maximum specific growth rate of **0.0041 h⁻¹**, a doubling time of about **7 days**. That slowness looks disqualifying and is not.

**Slow growth means low yield, and low yield is what an energy organ wants.** At a biomass yield near 0.066 g VSS per g N, only ~6.6% of processed nitrogen becomes cells; the other ~93% is run purely for ATP. Specific substrate throughput is q = µ/Y:

| Coupling | N processed | Y = 0.066 | Y = 0.13 |
| --- | --- | --- | --- |
| ideal | 0.82 kg N/day | 0.55 kg organ | 1.09 kg organ |
| 50% | 1.65 kg N/day | 1.10 kg organ | 2.18 kg organ |

For scale: liver 1.5 kg, brain 1.4 kg, kidneys 0.3 kg.

So the energy organ is **liver-sized, 0.55 to 2.2 kg**. Large but not absurd — and these are conservative, because the calculation assumes growth at µmax, meaning biomass is being built at full rate. A mature, non-growing organ sustains catabolic flux with far less anabolism.

Caveat: the yield range is from general anammox literature rather than a single verified source; the growth rate is verified.

## 4. Residual ROS, quantified

Reactive oxygen species are produced roughly in proportion to oxygen flux, with a small percentage of consumed O₂ escaping as superoxide. At 20–120 mg/day against 740 g/day aerobic, oxygen flux falls by about **6,000×**, and ROS production should scale with it.

Further, the generated oxygen is consumed at its point of use by a specific enzyme rather than flowing through an electron transport chain, which is where most mitochondrial leakage originates. The dominant ROS *source* is deleted, not merely reduced.

**Practical consequence:** the earlier verdict of "Cut" for antioxidant defense should become **partial retention** — enough to handle a flux three to four orders of magnitude below present, not the full apparatus. Superoxide dismutase and catalase are small, cheap systems; keeping them is a lower-risk choice than deleting them.

## 5. What remains genuinely open

**NO-dismutase is uncharacterized. This is the hard blocker.** The source states plainly that the enzymes catalyzing NO dismutation and N₂O reduction "have not yet been identified." The entire oxygen supply rests on a reaction whose protein nobody has isolated. Oxygen production is observed — net accumulation of 50–600 nmol·L⁻¹ across multiple archaea and bacteria — so the chemistry happens. But a design cannot specify an enzyme that has not been found. Everything else here is engineering; this is a discovery dependency.

**The N₂ chemoreceptor has no precedent.** Nitrogen is inert and offers no pH handle, so the CO₂-driven breathing reflex has nothing to read. Nothing in biology is known to sense dissolved N₂, despite the hazard being real in decompression physiology.

Lesser items, unchanged: kilogram-scale nitrite flux has no animal precedent; ammonium nitrite is not a shelf-stable food; the transition path is unaddressed.

## Revised ledger

| Component | Size or rate | Confidence |
| --- | --- | --- |
| Energy organ (anammox) | 0.55–2.2 kg | Moderate — growth rate verified, yield from literature range |
| Oxygen organ (NO dismutation) | 11–175 mL | Moderate — rates measured, enzyme unidentified |
| Feedstock (ammonium nitrite) | 1.9–3.8 kg/day | Moderate — follows from ΔG and assumed coupling |
| Residual O₂ demand | 20–120 mg/day | Low — collagen synthesis rate not pinned |
| N₂ vented | 659–1,318 L/day | High — stoichiometric |
| Osmotic residue | zero | High — both ions are nitrogen |
| Atmospheric O₂ requirement | zero | High — structural, not numerical |

## Verdict

The formulation survives checking, and improved under it: the oxygen requirement fell from ~1 g/day to 20–120 mg/day, the oxygen organ shrank from "16× too slow" to thyroid-to-kidney scale, and the energy organ resolved to liver scale. The zero-atmospheric-oxygen claim is structural and does not depend on any of the contested numbers — it follows from there being no intake pathway at all.

What it rests on is one unfound enzyme. The design is complete, internally consistent, and quantified; it is not buildable until someone isolates a nitric oxide dismutase.

## Sources

- [*Nitrosopumilus maritimus* cell dimensions](https://www.frontiersin.org/journals/microbiology/articles/10.3389/fmicb.2024.1367658/full)
- [Oxygen production via nitric oxide dismutation in diverse ammonia oxidizers (ISME Communications, 2026)](https://academic.oup.com/ismecommun/article/6/1/ycag171/8712852)
- [*Candidatus* Brocadia sinica growth rate and doubling time](https://www.microbiologyresearch.org/content/journal/micro/10.1099/mic.0.048595-0)
- [Anammox — reaction and free energy](https://en.wikipedia.org/wiki/Anammox)
- [Collagen amino acid composition and hydroxyproline content](https://earthwormexpress.com/collagen-marker-hydroxyproline)
- [Radiocarbon dating of collagen turnover in human cartilage](https://www.science.org/doi/abs/10.1126/scitranslmed.aad8335)
- Organ sizing, biomass scaling, ROS ratios: calculated here; anammox biomass yield range taken from general literature and not verified against a single source.
