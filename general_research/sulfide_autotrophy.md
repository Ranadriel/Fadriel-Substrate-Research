# Sulfide Autotrophy: The Fuel Side Solved

Oct 17, 2026 · working note supporting `redesigning_the_human.md`

*Question: Thrive's chemosynthesis makes glucose from hydrogen sulfide and CO2. Does the real chemistry work, and does it fix the oxygen-free design?*

## Short answer

Yes on the fuel side, and the real organism is one we already cited. *Thiobacillus denitrificans* oxidizes sulfide with nitrate as terminal acceptor, anaerobically, and fixes CO2 into hexose phosphates — Thrive's H2S + CO2 → glucose, in a real bacterium, with no oxygen anywhere. Sulfide is also a far denser fuel than iron: 8 electrons per atom against iron's 1, at −93 kJ per electron versus −79.

It does not fix the acceptor bottleneck. Nitrate demand goes up, not down, because sulfide delivers more electrons that all need somewhere to land. The acceptor remains the thing that is broken.

## What the game models

Thrive's chemosynthesis is "the process of harnessing Hydrogen Sulfide (H2S) and Carbon Dioxide (CO2) to produce Glucose," performed by the Chemosynthesizing Protein (prokaryotic) or the Chemoplast (eukaryotic, more efficient). The wiki's "Function in Reality" section is marked TODO, so the game offers no science — but the real science is solid, and it converges on the same organism as the iron work.

Sources: [Chemosynthesis](https://wiki.revolutionarygamesstudio.com/wiki/Chemosynthesis), [Hydrogen Sulfide](https://wiki.revolutionarygamesstudio.com/wiki/Hydrogen_Sulfide).

## What the real organism does

*Thiobacillus denitrificans*, per [MicrobeWiki](https://microbewiki.kenyon.edu/index.php/Thiobacillus_denitrificans):

- Couples oxidation of inorganic sulfur compounds to reduction of oxidized nitrogen compounds, nitrate and nitrite, down to dinitrogen.
- Under anaerobic conditions, oxidizes sulfide through a sulfide/sulfite oxidoreductase with nitrate as terminal electron acceptor.
- Is **obligately chemolithoautotrophic**: it builds biomass from CO2, synthesizing hexose phosphates by a cyclic mechanism like green plants, expressing form II RubisCO under denitrifying conditions.
- Accepts thiosulfate, tetrathionate, thiocyanate, elemental sulfur — and **poorly soluble iron-sulfur minerals including FeS2 and FeS**.

That last point matters: the same organism handles both the sulfur and the iron donors in this design, including as a combined mineral. The iron burst tier and the sulfide baseline are not two separate inventions; they are two modes of one metabolism that already exists.

## Calculated: sulfide energetics

Method: standard reduction potentials adjusted to pH 7. My calculation, not from the cited sources.

- Nitrate to N2: E°′ ≈ 0.75 V at pH 7.
- Sulfide to sulfate (HS⁻ → SO4²⁻), 8 electrons: E ≈ −0.22 V at pH 7.
- ΔE ≈ 0.97 V → **ΔG ≈ −748 kJ per mol sulfide**, about −93 kJ per electron.

Against iron's −79 kJ for its single electron, sulfide is both better per electron and carries eight times as many. Roughly 9.5× the energy per atom.

## Calculated: daily budget

Baseline ~10.5 MJ/day:

| Coupling | Sulfide per day | Nitrate per day |
| --- | --- | --- |
| 100% | 477 g | 1.39 kg |
| 40% | 1,193 g | 3.48 kg |

Carbon fixation is an additional charge on the same fuel: 692 g of glucose per day costs 92 mol of electrons, about 11.6 mol of sulfide (≈393 g) for the carbon alone, before any ATP.

**The acceptor problem worsens.** Nitrate demand rises from 1.14 kg/day (glucose fuel) to 1.4–3.5 kg/day (sulfide fuel), because more electrons per fuel atom means more electrons needing a destination. Sulfide solves density on the donor side and makes the acceptor side harder.

## The toxicity inversion

H2S kills humans by inhibiting cytochrome c oxidase, complex IV of the electron transport chain, binding its ferric (Fe³⁺) moiety and halting aerobic metabolism — a mechanism the clinical literature calls nearly identical to cyanide's. Source: [Hydrogen sulfide toxicity, WikEM](https://wikem.org/wiki/Hydrogen_sulfide_toxicity).

Complex IV is the oxygen-handling terminal enzyme. This design deletes it. **The primary toxicity mechanism of the proposed fuel has no target in the proposed body.** H2S is lethal to us specifically because we are aerobes.

Not a complete exemption: the same source notes potassium-channel hyperpolarization in neurons and direct mucosal irritation, which are independent of complex IV and would persist. But the cellular-asphyxia mechanism, the one that actually kills, is designed out.

## Revised architecture

| Role | Component | Status |
| --- | --- | --- |
| Fuel (electron donor) | Sulfide, or iron-sulfur mineral | **Solved** — dense, real, precedented |
| Carbon | CO2 via RubisCO | **Solved** — makes the body autotrophic |
| Acceptor | Nitrate | **Bottleneck** — 1.4 to 3.5 kg/day as consumable |
| Burst | Existing glycolysis + creatine phosphate | **Already oxygen-free**, needs nothing |

The acceptor is the sole remaining structural problem, and it must be inventory rather than intake: a carrier that is reduced, then re-oxidized by an energy input, carried in grams instead of eaten in kilos. At minute-scale turnover the carried inventory falls under a gram. Sulfide is a candidate driver for that recharge, which closes the loop the design needs.

## Consequence for diet

Autotrophy changes the cultural answer in `redesigning_the_human.md`. A body that fixes its own carbon from CO2 does not need food for carbon or energy. Eating becomes fully optional rather than reduced — the table survives only as choice, not as need. This is a larger break than the earlier draft concluded, and worth stating plainly rather than softening.

## Open questions

1. Does sulfide-driven carbon fixation plus ATP production close at a rate a human-scale body needs, or only at bacterial scale?
2. What drives acceptor regeneration, and where does that energy enter?
3. Sulfide supply: 0.5 to 1.2 kg/day is not a dietary quantity either. Does sulfide become inventory too, cycling between sulfide and sulfate?
4. RubisCO is famously slow. Can carbon fixation reach 692 g glucose/day in a body, or does the design need a faster carboxylase?

## Sources

- [Thrive Developer Wiki — Chemosynthesis](https://wiki.revolutionarygamesstudio.com/wiki/Chemosynthesis)
- [Thrive Developer Wiki — Hydrogen Sulfide](https://wiki.revolutionarygamesstudio.com/wiki/Hydrogen_Sulfide)
- [MicrobeWiki — *Thiobacillus denitrificans*](https://microbewiki.kenyon.edu/index.php/Thiobacillus_denitrificans)
- [Hydrogen sulfide toxicity — WikEM](https://wikem.org/wiki/Hydrogen_sulfide_toxicity)
- Thermodynamic values: calculated here from standard potentials, not taken from a cited source.
