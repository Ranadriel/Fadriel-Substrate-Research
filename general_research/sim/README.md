# Simulation: the anoxic body

Oct 17, 2026 · integration test for `../redesigning_the_human.md`

Run: `python3 anoxic_body.py`

## Why this exists

Every subsystem of the oxygen-free body was specified separately on paper. Nothing checked them against each other. The epistemic-status note in the main document listed "no integration has been tested" as an unresolved gap, and said it could not be closed by reading.

It can be closed by *running*. Thrive expresses biology as explicit processes with inputs and outputs, and conservation falls out of the model rather than being asserted. This is the same approach applied to the formulation.

The conservation checks are written to fail loudly. A process that does not balance on every element and on charge is reported as broken, not quietly corrected.

## What it found

**The first run failed four of seven processes.** Those were real errors in the formulation, not modelling artifacts:

| Process | Error | Cause |
| --- | --- | --- |
| anammox | H +3, charge +3 | Phosphorylation consumes a proton per ATP: ADP³⁻ + HPO₄²⁻ + H⁺ → ATP⁴⁻ + H₂O. Three ATP, three protons, unaccounted. |
| glycolysis | H +2, charge +2 | I had it releasing 2 H⁺. It does not. |
| fluorination | H +1, O +1, charge +1 | No oxidant. See below. |
| collagen synthesis | H +1, O +1, charge −1 | Double-counted the water lost to the peptide bond. |

Two of these are worth more than a correction.

### Glycolysis is proton-neutral

Glucose → 2 lactate⁻ coupled to ATP synthesis releases no free protons. The acidosis of hard exercise comes from ATP *hydrolysis* downstream, not from glycolysis itself. This is established physiology that the balance check surfaced independently, which is a point in the model's favor — it reproduced a known non-obvious result without being told.

### Fluorination needs an oxidant, and that is a new constraint

This is the finding. Replacing a C–H bond with C–F is formally a **two-electron oxidation**: R–H + F⁻ − 2e⁻ → R–F + H⁺. The electrons have to go somewhere.

In an ordinary body they would go to oxygen. **This body has no oxygen.** The only oxidant available in quantity is nitrite, which is already present as the energy feedstock. Balanced:

**Pro + F⁻ + 2 NO₂⁻ + 4 H⁺ → Flp + 2 NO + 2 H₂O + H⁺**

Consequences the paper design missed:

1. Fluorination **costs nitrite** — 2 mol per fluoroproline, on top of the energy budget.
2. It **produces nitric oxide**, 2 mol per Flp. NO is a potent signaling molecule and vasodilator in humans at far lower concentrations. Roughly 2.4 mmol/day of NO generated as a structural-synthesis byproduct is not obviously tolerable and is entirely unaddressed.
3. The collagen route is **not** oxygen-free in the deeper sense. It avoids molecular oxygen, but it still needs an oxidant, and the design has to pay for one.

The paper version of this claim — "fluoroproline needs no oxygen" — was true but incomplete in a way only the mass balance exposed.

## What it shows when it passes

With the four errors corrected, all seven processes balance on every element and on charge. The model then reports:

| Quantity | Value |
| --- | --- |
| Baseline | 100 W → 8.64 MJ/day, 172.8 mol ATP/day |
| Anammox events | 57.6 mol/day at 3 ATP each |
| Feedstock NH₄NO₂ | 3.69 kg/day |
| N₂ produced | 1,290 L/day = 896 mL/min |
| N₂ as fraction of resting ventilation | 14.9% |
| Metabolic water | 2.08 kg/day |
| Osmotic residue | zero |
| Processes touching O₂ | **zero** |

The ATP assumption is checked against thermodynamics rather than assumed: −357 kJ/mol at ~50 kJ/mol per ATP gives a ceiling of 7.1 ATP per anammox event. The model takes 3, about 42% coupling, and the check passes. Had it taken 8, the run would report a free-energy violation.

**Burst behaviour matches a present-day human**, which is the expected result since the burst tier was never oxygen-dependent. A 1,200 W sprint drains ATP and phosphocreatine in ~28 s, after which glycolysis covers only ~7% of the deficit and sustained power falls to ~175 W. That is ordinary human sprint physiology, reproduced without modification — evidence the redesign genuinely does not disturb that tier.

## What it does not show

Balanced stoichiometry is a necessary condition, not a sufficient one. The model shows the design is self-consistent on mass, charge and free energy. **It does not show the organism would live.** Specifically absent:

- **Fluorination has no characterized enzyme.** The process above is bookkeeping, not biology. Known fluorinases (e.g. 5′-fluoro-5′-deoxyadenosine synthase) work by SN2 displacement on SAM, not C–H activation.
- **Hydrazine (N₂H₄)**, the anammox intermediate, is acutely toxic and is not tracked at all.
- **Nitric oxide** from fluorination is produced but not consumed or regulated anywhere in the model.
- **Lactate clearance** after a burst is unmodelled; it is normally oxidative.
- No regulation, development, compartmentalization, transport, or immune system.
- Anammox is a well-mixed ATP source, not tissue with diffusion limits, pH constraints, or containment.
- N₂ vents freely; no dissolved-N₂ sensing, no decompression behaviour.

## Status

The formulation survived its first integration test, after the test broke it four times. The zero-oxygen property held throughout and is structural: no process in the model references O₂, so there is no pathway to interrupt.

The honest summary is that this moved the design from "self-consistent on paper, never cross-checked" to "self-consistent under mass, charge and energy conservation, with one new unresolved byproduct." It is a step toward feasibility, not a demonstration of it.
