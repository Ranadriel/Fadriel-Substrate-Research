# Burst Energetics and the Iron Budget

Oct 17, 2026 · working note supporting `redesigning_the_human.md`

*Question: can iron, burned with nitrate, carry the burst tier of a human metabolism, and what would the daily iron and nitrate budget be?*

## Short answer

Iron can serve as a sprint reservoir, not a daily fuel. The thermodynamics allow roughly 0.6 to 1.7 ATP per iron atom, depending on how much of the free energy the cell captures. A full day's energy would need about 7 to 19 kg of iron and 1.5 to 4 kg of nitrate. The energetic benefit of nitrate-dependent iron oxidation is itself weakly established in the literature, so every figure here is a ceiling built on a thin base.

## What the literature establishes

- **Nitrate-dependent Fe(II) oxidation is real.** Several bacteria, including *Acidovorax* strain BoFeN1 and *Thiobacillus denitrificans*, oxidize Fe(II) with nitrate as electron acceptor under anoxic conditions. Sources: [Rusting Away in the Dark (PMC3282478)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3282478); [Frontiers in Microbiology 2013](https://www.frontiersin.org/articles/10.3389/fmicb.2013.00249/full).
- **Whether it pays energetically is open.** The review says "the growth benefit from anaerobic iron oxidation varies widely" and that "a few studies do suggest an energetic benefit." For *T. denitrificans*, the same literature notes that energy conservation and growth were not demonstrated in an earlier study. The benefit depends on culture conditions.
- **Iron is partly a nuisance for the cell.** Cells risk encrustation by the Fe(III) mineral they produce, and the review frames some Fe(II) oxidation as electron sparing rather than profit.

Correction to the earlier chat claim that bacteria "grow with iron as their only electron donor, gaining energy": that is documented for only a few strains, and the energy gain is not settled.

## Calculated: free energy per iron atom

Method: standard reduction potentials adjusted to pH 7 by hand. This is my calculation, not a value from the cited papers, which give no ΔG.

- Nitrate couple, 2NO3⁻ + 12H⁺ + 10e⁻ → N2 + 6H2O: E°′ ≈ 0.75 V at pH 7.
- Iron couple, solid Fe(OH)3 / Fe²⁺: E ≈ −0.07 to −0.18 V at pH 7 (the review cites −0.074 V for the Fe(III)/Fe(II) pair).
- Stoichiometry: 10 Fe²⁺ + 2 NO3⁻ per 10 electrons, so 1 electron and 0.2 mol nitrate per mol Fe.
- ΔE ≈ 0.82 to 0.93 V, giving **ΔG ≈ −79 to −90 kJ per mol Fe**.

Real in-cell values shift with concentrations, pH and mineral phase, so treat these as order-of-magnitude.

## Calculated: ATP per iron atom

Assumes ~50 kJ/mol per ATP, a typical in-cell phosphorylation value.

| Coupling efficiency | ATP per Fe |
| --- | --- |
| 100% (ideal) | ~1.5 to 1.7 |
| 40% (realistic guess) | ~0.6 to 0.7 |

The 40% figure is an assumption, not a measurement. The true number is unknown.

## Calculated: daily budget on iron alone

Assumes ~10.5 MJ per day (about 2,500 kcal).

| Coupling | Iron per day | Nitrate per day |
| --- | --- | --- |
| 100% | 6.9 to 7.6 kg | 1.5 to 1.7 kg |
| 40% | 17 to 19 kg | 3.8 to 4.2 kg |

The earlier draft's "10 to 15 kg of iron" sits inside this range. The corrected range is 7 to 19 kg, with nitrate at 1.5 to 4 kg.

## Calculated: glucose through nitrate versus oxygen

Full oxidation of glucose (24 electrons) at pH 7:

- Oxygen as acceptor: ΔG ≈ −2,895 kJ.
- Nitrate reduced all the way to N2: ΔG ≈ −2,730 kJ.
- Ratio: about 0.94.

So the thermodynamic free energy available from glucose with nitrate is about 94% of the aerobic value. The **ATP yield** is not set by free energy alone. It depends on how many protons the terminal reductases pump across the membrane, and I have not verified those figures. The doc's "large share of the aerobic yield" is therefore plausible on energy but unconfirmed on ATP. If the nitrate endpoint is nitrite instead of N2, the yield drops sharply, and the nitrite intermediate is itself a toxicity problem.

## Implications for the design doc

1. The burst tier survives the numbers, but its energetic advantage is unproven, so it needs a feasibility test before it anchors the design.
2. Rust clearance is confirmed as a real gap. Humans have no regulated iron excretion route. Daily direct loss is only 1 to 2 mg, from skin shedding and minor bleeding. Recycling of about 20 to 25 mg per day runs through macrophages. Iron balance is controlled by absorption and release, not excretion, via hepcidin acting on ferroportin, the only vertebrate iron exporter. The kidney reclaims iron rather than discarding it. Iron overload is the consequence when intake outruns those controls.
3. Scale matters: a human body holds roughly 3 to 4 g of iron in total, and the daily recycling-plus-loss flux is about 22 to 27 mg. A 7 to 19 kg daily iron throughput is thousands of times the whole-body store, and hundreds of thousands of times the daily flux. Any design that runs bursts on iron must solve exhaust at that scale, not at the trickle the body handles now.

## Sources

- [Rusting Away in the Dark: Anaerobic Nitrate-Dependent Iron Oxidation](https://pmc.ncbi.nlm.nih.gov/articles/PMC3282478)
- [Anaerobic nitrate-dependent Fe(II) oxidation in *Thiobacillus denitrificans*](https://www.frontiersin.org/articles/10.3389/fmicb.2013.00249/full)
- [Iron metabolism review (hepcidin, ferroportin, daily iron flux)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8164969)
- Thermodynamic values: calculated here from standard potentials; not taken from a cited source.
