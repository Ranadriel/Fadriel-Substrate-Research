# Redesigning the Human

Oct 17, 2026 · Ranadriel Fairsky

*A clean-sheet build with oxygen removed from the plan.*

## Mandate

> **Consider the implications of the human body that does not require oxygen.**

Formulate the human biological animal without the need for oxygen, with the purpose of reducing oxygen requirements in the system to zero, or as near zero as the chemistry permits.

**Resolution of the mandate.** Oxygen stops being an input and becomes an internal intermediate. The design closes on **nitrogen**: one feedstock runs energy, oxygen generation and waste disposal, and every product is N₂ gas or water. Full formulation and ledger in `nitrogen_closure.md`.

| Requirement | Result |
| --- | --- |
| Atmospheric oxygen | **Zero** — no intake to interrupt; asphyxiation is not a failure mode |
| Oxygen intake organ | **Zero** — lungs vent, never admit |
| Oxygen carrier in blood | **Zero** — no hemoglobin; ~2/3 of body iron freed |
| Oxygen-driven respiration | **Zero** |
| Oxygen for structural chemistry | **Zero** — fluoroproline collagen (Tm 91 °C, more stable than hydroxyproline) |
| Oxygen for hydroxylation chemistry | **Zero** — molybdenum oxygen-atom transfer from water |
| Oxygen for immunity | **Zero** — granule antimicrobials; demonstrated oxygen-independent in humans |
| Oxygen generated internally | **Zero** — none needed |
| Osmotic waste | **Zero** — both feedstock ions leave as gas |

**"Zero, if not zero" resolves to the first branch.** No process in the body consumes oxygen at all, so asphyxiation is not a failure mode. The final move was to stop asking how to supply the input and ask why it was required: every remaining use had a characterized oxygen-free substitute. See `deleting_the_requirement.md`.

**The formulated body.**

| System | Design |
| --- | --- |
| Feedstock | Ammonium nitrite, ~1.9–3.8 kg/day, ingested |
| Energy | Anammox: NH₄⁺ + NO₂⁻ → N₂ + 2 H₂O, −357 kJ/mol, ATP synthase coupled |
| Burst | Unchanged — glycolysis and creatine phosphate are already oxygen-free |
| Energy organ | Anammox tissue, 0.55–2.2 kg — liver-scale |
| Structure | Fluoroproline collagen — no oxygen, melts at 91 °C |
| Hydroxylation | Molybdenum oxygen-atom transfer, water-sourced |
| Immunity | Granule antimicrobials; oxidative burst deleted |
| Fluorine | 11–23 mg/day — the one new dependency introduced |
| Carbon | Dietary — CO₂ fixation fails on ventilation by 150× |
| Lungs | Retained, inverted: N₂ exhaust ~915 mL/min, plus the vagal/voluntary bridge |
| Kidneys | Retained, unloaded |
| Waste | N₂ gas and water. Nothing else. |

**Why it closes.** The acceptor loop was never closable — recharging from the fuel is a futile cycle, and light gives ~20 W against a ~100 W baseline. But oxygen's advantage was never chemistry; per gram it beats nitrate by only ~1.7×. It was **logistics: free intake, free disposal.** Matching the disposal half is what works. Ammonium nitrite's ions are both nitrogen, so both exit as gas, leaving zero osmotic residue — against 37 L/day of urine for an ordinary nitrate salt.

## Premise

Oxygen is the killer and the granter of complex life, and the design treats it as a defect rather than a feature. It suffocates when absent and corrodes when present: reactive oxygen species leaking from mitochondria are a principal driver of cellular aging.

The method is clean-sheet, not patching. The question is never "how do we remove oxygen from this process" but "what does a body actually need, and how is that function built with oxygen never in the plan."

This matters because most of what looks like a problem to solve is an artifact of oxygen dependency. Every inherited component faces one test: is this here because of oxygen? If yes, it is cut, not rebuilt. The list of things that survive that test is short.

## Metabolism: the two-tier engine

Energy splits into a steady baseline and a burst reservoir, because no single oxygen-free pathway covers both well.

**Baseline: glucose plus nitrate.** Glycolysis needs no oxygen but nets only about 2 ATP per glucose against roughly 30 when the full chain runs. Fermentation alone would mean eating around fifteen times the sugar and dumping lactate. The fix is keeping the whole glucose pipeline and swapping only the terminal electron acceptor: bacteria running nitrate respiration burn glucose all the way through and recover a large share of the aerobic yield.

**Burst: iron, held in reserve.** Iron is a weak fuel — each atom surrenders one electron — so it cannot carry a day's energy. Covering a full day on iron alone would take roughly 7 to 19 kg of iron (depending on how much free energy the cell captures) plus 1.5 to 4 kg of nitrate, which is not eatable. See `burst_energetics_and_iron_budget.md`. As a sprint tank it is right-sized. The body already works this way with creatine phosphate: a small fast reserve for the first seconds of exertion, refilled by the slow engine afterward.

The reservoir fills steadily from baseline metabolism and drains in irregular spikes under fighting or running. Design target: least intake for most output, a reservoir that influxes steadily and defluxes irregularly.

**Precedent.** Nitrate-dependent iron oxidation is real and documented: several bacteria oxidize Fe(II) with nitrate and no oxygen present. Whether it pays energetically is weakly established. The literature says the growth benefit "varies widely" and is suggested by only a few studies, and some strains showed no demonstrated energy conservation. The burst tier is therefore a hypothesis to test, not a proven pathway. The game *Thrive* models the organelle version: Rusticyanin converts iron to ATP without glucose, and the Ferroplast runs the same process at far higher efficiency post-nucleus. Ferroplasts are theorized as possible by the same endosymbiotic route that produced mitochondria. The human design is a Ferroplast swap: retire the mitochondrion, install the iron engine.

## The oxygen tree

Most oxygen-touching systems exist to serve oxygen and die with it. Only a minority need replacement.

| System | Oxygen's role | Verdict |
| --- | --- | --- |
| Hemoglobin, myoglobin, red cells | Oxygen freight (~2/3 of body iron) | Cut — no cargo, no carrier |
| Heme synthesis and breakdown | Two synthesis steps use O2; bilirubin disposal uses O2 | Mostly cut; anaerobes already use radical SAM (HemN) |
| Lungs | Gas intake | **Keep, inverted** — become N2 exhaust (144 mL/min) and remain the vagal/voluntary-control bridge; see `lungs_and_gas_budget.md`. Asthma is addressed by removing the oxygen dependency, not the organ |
| Cytochromes (electron shuttling) | Electron transport | Rebuild — iron-sulfur clusters carry electrons without heme |
| Neurotransmitters (dopamine, norepinephrine, serotonin) | O2 hydroxylases build them; MAO breaks them down | Rebuild — molybdenum enzymes source oxygen atoms from water |
| Steroids, vitamin D, bile acids, liver detox (P450s) | O2-driven | Rebuild — same water-sourced route |
| Cholesterol | O2 at several steps | Rebuild — anaerobes make hopanoids, sterol-like, zero oxygen |
| Unsaturated fats | Desaturases need O2 | Rebuild — E. coli makes the same kinks anaerobically |
| Collagen | Hydroxylases stamp O2 on for cross-linking | **Substitute** — (4R)-fluoroproline does the same stereoelectronic job with no oxygen, and more stably (Tm 91 °C vs 61–69 °C) |
| Immune killing | White cells weaponize O2 into radicals | **Cut the burst, keep the granules** — defensins, cathepsin G, BPI kill without oxygen; demonstrated in humans |
| Antioxidant defense | Mopping up reactive oxygen species | **Cut** — zero oxygen flux means zero oxygen-derived radicals |

The general toolkit for rebuilds: radical SAM enzymes for oxygen-free chemistry on hard bonds, and molybdenum enzymes that pull oxygen atoms from water rather than air. Water as oxygen donor is the master key for most of the list.

The two items first marked "invent" — collagen cross-linking and immune killing — turned out not to be invention problems at all. Both already have characterized oxygen-free substitutes: fluoroproline for collagen, granule antimicrobial proteins for immunity. Nothing needed inventing; the first pass had simply assumed the oxygen was load-bearing.

## Diet and intake

Food stays food, which is the cultural linchpin. Because glucose survives the redesign, the baseline engine still runs on ordinary eating — only the terminal acceptor changes, from inhaled oxygen to dietary nitrate.

Three intake streams instead of one:

1. **Glucose and macronutrients** — baseline energy, unchanged in kind. Meals as they are.
2. **Nitrate** — the acceptor, replacing breathing. Leafy greens and beets are already the dietary source humans use today for nitric oxide.
3. **Iron** — reservoir recharge only, not daily fuel. Small because bursts are a small fraction of daily output.

Material intake is untouched: carbon, nitrogen, amino acids and fats are still needed to build and repair tissue regardless of where energy comes from.

The exhaust problem is the real engineering gap. Humans have no regulated iron excretion route: direct daily loss is only 1 to 2 mg, and iron balance is controlled by absorption and release through hepcidin acting on ferroportin, the only vertebrate iron exporter. Spent iron leaves as rust, and both ferrous iron and the ferric rust it becomes are barely soluble at neutral pH — iron-oxidizing bacteria have to actively avoid getting encrusted in their own waste. A rusting human needs a solid-waste clearance path the way lungs currently clear CO2. Options: a dedicated excretion route, or electrical regeneration of rust back to usable iron, closing the loop so the reservoir recharges without new intake.

Culturally the table survives intact. Shared meals keep their meaning; what changes is that breathing stops being part of the meal.

## The gut biome

The tenants go, but only after their jobs are taken in-house. Germ-free rats in mid-century studies outlived conventional siblings, which is the case for eviction. The same studies name the price: germ-free animals have underdeveloped immune systems, must eat more because microbes were doing part of the digestion, and need vitamin K supplied in food because gut bacteria were making it.

What has to be brought in-house first:

- **Vitamin K and B vitamins** — synthesized natively rather than outsourced
- **Fiber digestion** — own enzymes for what microbes currently break down
- **Immune education** — trained deliberately rather than by exposure to residents

Once nothing depends on them, eviction is clean. The remaining problem shifts from tolerating a co-evolved population to defending a sealed system against recolonization — a containment problem rather than a negotiation.

Note the overlap with the oxygen tree: the immune system's kill mechanism is oxygen-based, and it is retained rather than rebuilt, supplied from the internal oxygen source. Immune education after eviction is therefore a training problem, not a chemistry problem — the weapon still works, it just needs targets to learn from.

## Open problems

**No discovery dependencies remain.** Every enzyme the design names has been characterized. What is left is engineering and biological accounting.

1. **Fluorine budget** — 11–23 mg/day sits at or above the tolerable upper intake for fluoride. Organofluorine is not free fluoride, but what happens to fluoroproline on collagen turnover is unaddressed.
2. **Immune sufficiency** — chronic granulomatous disease proves oxygen-independent killing works and simultaneously proves it is weaker. Compensation is required and unspecified.
3. **N₂ chemoreceptor** — nitrogen is inert and gives no pH signal; nothing known senses dissolved N₂.
4. **Anammox power density** — organ sizing rests on a literature yield range and assumes 50% coupling.
5. **Molybdenum enzyme provenance** — water as oxygen source is established for the mechanism generally, not isotope-confirmed per family in the source used.
6. **Kilogram-scale nitrite flux** — no animal precedent.
7. **Feedstock engineering** — ammonium nitrite is not a shelf-stable food.
8. **Transition path** — build-in versus retrofit; whether partial states are survivable.

**Resolved along the way:** NO-dismutase (no longer needed — nothing waits on oxygen); residual ROS (zero oxygen flux means zero oxygen-derived radicals, so antioxidant defense is cut without reservation); oxygen generation rate and the oxygen organ (not built); residual O₂ demand (zero); perchlorate dose (perchlorate removed); acceptor regeneration (the loop never needed to close); rust clearance (iron demoted to an optional burst reservoir).

## Sources

- [Rusting Away in the Dark: Anaerobic Nitrate-Dependent Iron Oxidation](https://pmc.ncbi.nlm.nih.gov/articles/PMC3282478)
- [Anaerobic nitrate-dependent Fe(II) oxidation in Thiobacillus denitrificans](https://www.frontiersin.org/articles/10.3389/fmicb.2013.00249/full)
- [Thrive Developer Wiki — Ferroplast](https://wiki.revolutionarygamesstudio.com/wiki/Ferroplast)
- [Thrive Developer Wiki — Rusticyanin](https://wiki.revolutionarygamesstudio.com/wiki/Rusticyanin)
- [Thrive Developer Wiki — Iron](https://wiki.revolutionarygamesstudio.com/wiki/Iron)
- [Thrive Developer Wiki — Chemosynthesis](https://wiki.revolutionarygamesstudio.com/wiki/Chemosynthesis)
- [MicrobeWiki — *Thiobacillus denitrificans*](https://microbewiki.kenyon.edu/index.php/Thiobacillus_denitrificans)
- [Perchlorate and chlorate respiration, chlorite dismutase](https://pmc.ncbi.nlm.nih.gov/articles/PMC4162996)
- [Production of Dioxygen in the Dark: Dismutases of Oxyanions](https://link.springer.com/chapter/10.1007/978-3-319-12415-5_3)
- [Perchlorate toxicology, NIS inhibition, EPA reference dose](https://clu-in.org/contaminantfocus/default2.focus/sec/Perchlorate/cat/Toxicology/)
- [Hydrogen sulfide toxicity — WikEM](https://wikem.org/wiki/Hydrogen_sulfide_toxicity)
- [Iron metabolism: hepcidin, ferroportin, daily flux](https://pmc.ncbi.nlm.nih.gov/articles/PMC8164969)
- [4-Fluoroprolines and collagen stability (Raines lab)](https://raineslab.com/sites/default/files/labs/raines/pdfs/Newberry2017a.pdf)
- [Molybdenum enzymes and oxygen atom transfer](https://docentes.fct.unl.pt/lblm/files/encyclopedia-2023-entry_47837.pdf)
- [Non-oxidative microbicidal mechanisms of human neutrophils (JCI)](https://www.jci.org/articles/view/114851/files/pdf)
- [Anammox](https://en.wikipedia.org/wiki/Anammox)
- [*Candidatus* Brocadia sinica growth kinetics](https://www.microbiologyresearch.org/content/journal/micro/10.1099/mic.0.048595-0)
- `docs/body_systems/RESPIRATORY_SYSTEM.md` (this repository)

## Working notes

- `burst_energetics_and_iron_budget.md` — iron and nitrate thermodynamics, daily budgets
- `sulfide_autotrophy.md` — sulfide as donor, CO2 fixation, the autotrophy retraction
- `lungs_and_gas_budget.md` — why the lungs stay, N2 exhaust, ventilation limits
- `oxygen_as_internal_intermediate.md` — the oxygen ledger and toxicology pattern (perchlorate route superseded by `nitrogen_closure.md`)
- `nitrogen_closure.md` — **the closing note**: anammox energy, NO-dismutation oxygen, the full formulated body
- `feasibility_check.md` — the verification pass: organ sizing, corrected stoichiometry, what survived checking
- `deleting_the_requirement.md` — **the resolution**: fluoroproline, water-sourced hydroxylation, oxygen-free immunity. Oxygen requirement reaches true zero
