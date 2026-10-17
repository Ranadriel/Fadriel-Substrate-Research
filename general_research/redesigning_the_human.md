# Redesigning the Human

Oct 17, 2026 · Ranadriel Fairsky

*A clean-sheet build with oxygen removed from the plan.*

## Mandate

> **Consider the implications of the human body that does not require oxygen.**

Formulate the human biological animal without the need for oxygen, with the purpose of reducing oxygen requirements in the system to zero, or as near zero as the chemistry permits.

**Resolution of the mandate.** Oxygen stops being an input and becomes an internal intermediate. Atmospheric oxygen requirement: **zero** — nothing is inhaled, there is no intake to interrupt, and asphyxiation stops being a failure mode. Internal oxygen requirement: **roughly 1 g/day against 740 g/day for aerobic respiration**, a ~740-fold reduction, generated enzymatically in the dark by chlorite dismutase rather than breathed. "Zero, if not zero" resolves as zero *dependence*, trace *presence*. See `oxygen_as_internal_intermediate.md`.

**Current state of the design.**

| Element | Status |
| --- | --- |
| Energy / electron donor | **Solved** — sulfide (8 e⁻, −748 kJ/mol) or iron-sulfur mineral; precedent in *Thiobacillus denitrificans* |
| Burst tier | **Needs nothing** — glycolysis and creatine phosphate are already oxygen-free |
| Oxygen for structural chemistry | **Solved** — generated internally from perchlorate via chlorite dismutase |
| Lungs | **Retained, inverted** — N2 exhaust at 144 mL/min, plus the vagal and voluntary-control bridge |
| Carbon | **Stays dietary** — CO2 fixation fails on ventilation by 150× |
| Electron acceptor | **Open** — must be regenerating inventory, not daily intake |
| N2 chemoreceptor | **Open** — the CO2/pH breathing drive no longer tracks the gas that matters |

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
| Antioxidant defense | Mopping up reactive oxygen species | Cut — no ROS to mop |
| Cytochromes (electron shuttling) | Electron transport | Rebuild — iron-sulfur clusters carry electrons without heme |
| Neurotransmitters (dopamine, norepinephrine, serotonin) | O2 hydroxylases build them; MAO breaks them down | Rebuild — molybdenum enzymes source oxygen atoms from water |
| Steroids, vitamin D, bile acids, liver detox (P450s) | O2-driven | Rebuild — same water-sourced route |
| Cholesterol | O2 at several steps | Rebuild — anaerobes make hopanoids, sterol-like, zero oxygen |
| Unsaturated fats | Desaturases need O2 | Rebuild — E. coli makes the same kinks anaerobically |
| Collagen | Hydroxylases stamp O2 on for cross-linking | **Keep as-is** — fed by internally generated O2 (~320 mg/day); no new chemistry needed |
| Immune killing | White cells weaponize O2 into radicals | **Keep as-is** — fed by internally generated O2 |
| Thyroid hormone synthesis | Uses O2/peroxide | Rebuild — and perchlorate competes with iodide at NIS, so this and the O2 source are coupled |

The general toolkit for rebuilds: radical SAM enzymes for oxygen-free chemistry on hard bonds, and molybdenum enzymes that pull oxygen atoms from water rather than air. Water as oxygen donor is the master key for most of the list.

The two items first marked "invent" — collagen cross-linking and immune killing — are no longer invention problems. Generating a gram of oxygen a day internally is cheaper than designing oxygen-free substitutes for both, so they are kept unchanged and supplied from the internal source.

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

1. **Acceptor regeneration** — the sole structural blocker. The acceptor must be carried inventory, re-oxidized by an energy input, not eaten by the kilo. Light cannot drive it: even theoretical-maximum photosynthesis over half a body gives ~20 W on a 24-hour average against a ~100 W baseline. So the recharge energy must come from the fuel itself, which means the loop needs a thermodynamic accounting that has not been done.
2. **Perchlorate dose** — oxygen generation needs ~3.1 g/day, about 6.3 × 10⁴ times the EPA reference dose. Either exposure drops or iodide transport is redesigned alongside it.
3. **N2 chemoreceptor** — nitrogen is inert and gives no pH signal, so the CO2-driven breathing reflex has nothing to read. Needs a new sensor; no biological precedent for sensing dissolved N2.
4. **Rust and sulfate clearance** — spent carrier is barely soluble at neutral pH. Closed-loop operation reduces this to topping up leakage (1 to 2 mg/day range, which existing shedding handles), but only if the loop actually closes.
5. **Residual ROS** — trace internal oxygen may reintroduce the aging mechanism the premise set out to remove. At 1/740th the flux it should scale down, but antioxidant systems were marked "Cut" and may need partial retention.
6. **Nitrate supply and nitrite handling** — nitrate respiration produces nitrite as an intermediate. Nitrite's classic toxicity (methemoglobinemia) is designed out with hemoglobin, but daily acceptor demand and intermediate handling remain unquantified.
7. **Reservoir sizing and energetic yield** — how large the iron tank must be, the recharge rate baseline metabolism can sustain, and whether nitrate-driven iron oxidation yields usable ATP at all in a living cell (see `burst_energetics_and_iron_budget.md`: 0.6 to 1.7 ATP per Fe, unmeasured in vivo).
8. **Carbon fixation rate** — if any autotrophy is retained, RubisCO is slow and the ventilation route is closed; a faster carboxylase or a dietary carbon source is required.
9. **Transition path** — whether this is built into an organism or retrofitted into a living one, and whether a partial state is survivable or only the finished design works.

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
- `docs/body_systems/RESPIRATORY_SYSTEM.md` (this repository)

## Working notes

- `burst_energetics_and_iron_budget.md` — iron and nitrate thermodynamics, daily budgets
- `sulfide_autotrophy.md` — sulfide as donor, CO2 fixation, the autotrophy retraction
- `lungs_and_gas_budget.md` — why the lungs stay, N2 exhaust, ventilation limits
- `oxygen_as_internal_intermediate.md` — perchlorate route, the oxygen ledger, toxicology pattern
