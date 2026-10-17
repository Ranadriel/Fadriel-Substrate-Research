#!/usr/bin/env python3
"""
Anoxic body — a Thrive-style metabolic simulation.

Models the oxygen-free human formulated in ../redesigning_the_human.md as a set
of explicit processes with inputs and outputs, the way Thrive expresses a cell's
metabolism. The point is integration testing: each subsystem was specified
separately on paper and never checked against the others.

Conservation checks are written to FAIL LOUDLY. A reaction that does not balance
on every element and on charge is reported as broken, not quietly corrected.

Run: python3 anoxic_body.py
"""

from dataclasses import dataclass, field
import re

# ----------------------------------------------------------------------------
# Chemistry: formulas as element -> count, plus charge.
# ----------------------------------------------------------------------------

SPECIES = {
    # name            formula            charge
    "NH4+":          ("N1H4",            +1),
    "NO2-":          ("N1O2",            -1),
    "N2_aq":         ("N2",               0),
    "N2_gas":        ("N2",               0),
    "H2O":           ("H2O1",             0),
    "glucose":       ("C6H12O6",          0),
    "lactate-":      ("C3H5O3",          -1),
    "H+":            ("H1",              +1),
    "ATP":           ("C10H12N5O13P3",   -4),
    "ADP":           ("C10H12N5O10P2",   -3),
    "Pi":            ("H1O4P1",          -2),
    "PCr":           ("C4H8N3O5P1",      -2),   # phosphocreatine
    "Cr":            ("C4H9N3O2",         0),   # creatine
    "Pro":           ("C5H9N1O2",         0),   # proline residue, free
    "Flp":           ("C5H8F1N1O2",       0),   # 4-fluoroproline
    "F-":            ("F1",              -1),
    "collagen_unit": ("C5H6F1N1O1",       0),   # Flp residue once in peptide (-H2O)
    "NO":            ("N1O1",             0),   # nitric oxide, fluorination byproduct
}


def parse(formula):
    out = {}
    for el, n in re.findall(r"([A-Z][a-z]?)(\d*)", formula):
        if el:
            out[el] = out.get(el, 0) + (int(n) if n else 1)
    return out


@dataclass
class Process:
    """A Thrive-style process: inputs -> outputs, with a rate."""
    name: str
    inputs: dict
    outputs: dict
    note: str = ""

    def balance(self):
        """Return (element_deltas, charge_delta). All zero == balanced."""
        delta = {}
        charge = 0
        for sp, n in self.inputs.items():
            f, q = SPECIES[sp]
            for el, c in parse(f).items():
                delta[el] = delta.get(el, 0) - c * n
            charge -= q * n
        for sp, n in self.outputs.items():
            f, q = SPECIES[sp]
            for el, c in parse(f).items():
                delta[el] = delta.get(el, 0) + c * n
            charge += q * n
        return {k: v for k, v in delta.items() if v != 0}, charge


# ----------------------------------------------------------------------------
# The processes of the anoxic body.
# ----------------------------------------------------------------------------

# ATP yield per anammox event is NOT thermodynamically free-floating: -357 kJ/mol
# at ~50 kJ/mol per ATP gives a ceiling of ~7. We model 3 (≈42% coupling), which
# is the assumption carried through the design notes.
ANAMMOX_ATP = 3

PROCESSES = [
    Process(
        "anammox",
        {"NH4+": 1, "NO2-": 1, "ADP": ANAMMOX_ATP, "Pi": ANAMMOX_ATP,
         "H+": ANAMMOX_ATP},
        {"N2_aq": 1, "H2O": 2 + ANAMMOX_ATP, "ATP": ANAMMOX_ATP},
        "NH4+ + NO2- -> N2 + 2H2O, dG -357 kJ/mol. Each phosphorylation "
        "(ADP3- + HPO4 2- + H+ -> ATP4- + H2O) consumes a proton.",
    ),
    Process(
        "glycolysis_burst",
        {"glucose": 1, "ADP": 2, "Pi": 2},
        {"lactate-": 2, "ATP": 2, "H2O": 2},
        "Anaerobic already in baseline humans. Untouched by the redesign. "
        "Note: no free H+ released -- glycolysis to lactate ANION coupled to "
        "ATP synthesis is proton-neutral. Exercise acidosis comes from ATP "
        "hydrolysis downstream, not from this step.",
    ),
    Process(
        "creatine_kinase",
        {"PCr": 1, "ADP": 1, "H+": 1},
        {"Cr": 1, "ATP": 1},
        "Fast burst buffer. Reversible; shown in the discharge direction.",
    ),
    Process(
        "fluorination",
        {"Pro": 1, "F-": 1, "NO2-": 2, "H+": 4},
        {"Flp": 1, "NO": 2, "H2O": 2, "H+": 1},
        "HYPOTHETICAL -- no characterized enzyme does this. But the balance "
        "forced a real constraint: C-H -> C-F is a 2-electron OXIDATION, so it "
        "needs an oxidant. With no O2 available, nitrite is the only one on "
        "hand, and it leaves as NO. Fluorination therefore costs nitrite.",
    ),
    Process(
        "collagen_synthesis",
        {"Flp": 1, "ATP": 1},
        {"collagen_unit": 1, "ADP": 1, "Pi": 1, "H+": 1},
        "Peptide bond formation; Flp replaces Hyp, no O2 consumed. The water "
        "lost to the peptide bond is already inside the collagen_unit formula.",
    ),
    Process(
        "atp_maintenance",
        {"ATP": 1, "H2O": 1},
        {"ADP": 1, "Pi": 1, "H+": 1},
        "All non-growth cellular work.",
    ),
    Process(
        "n2_venting",
        {"N2_aq": 1},
        {"N2_gas": 1},
        "Lungs. The organ is retained and inverted: exhaust, not intake.",
    ),
]


def check_balances():
    print("=" * 74)
    print("CONSERVATION CHECK  (element + charge, per process)")
    print("=" * 74)
    broken = []
    for p in PROCESSES:
        delta, charge = p.balance()
        ok = not delta and charge == 0
        print(f"  {'PASS' if ok else 'FAIL'}  {p.name}")
        if not ok:
            broken.append(p.name)
            if delta:
                print(f"          element imbalance: {delta}")
            if charge:
                print(f"          charge imbalance : {charge:+d}")
    print()
    if broken:
        print(f"  !! {len(broken)} process(es) do not balance: {', '.join(broken)}")
        print("     The formulation has a stoichiometric error.")
    else:
        print("  All processes balance on every element and on charge.")
    print()
    return not broken


# ----------------------------------------------------------------------------
# Steady state: can the body meet its ATP demand, and what flows?
# ----------------------------------------------------------------------------

BMR_W = 100.0
ATP_KJ = 50.0          # in-cell free energy per ATP hydrolysis
SEC_DAY = 86400


def steady_state():
    print("=" * 74)
    print("STEADY STATE  (baseline, no burst)")
    print("=" * 74)

    atp_kJ_day = BMR_W * SEC_DAY / 1000.0
    atp_mol_day = atp_kJ_day / ATP_KJ
    anammox_mol = atp_mol_day / ANAMMOX_ATP

    print(f"  Baseline power            {BMR_W:.0f} W  ->  {atp_kJ_day/1000:.2f} MJ/day")
    print(f"  ATP turnover              {atp_mol_day:.1f} mol/day")
    print(f"  Anammox events            {anammox_mol:.1f} mol/day  (at {ANAMMOX_ATP} ATP each)")
    print()

    # Feedstock. Ammonium nitrite is 1:1.
    salt_kg = anammox_mol * 64.04 / 1000
    n2_mol = anammox_mol
    n2_L = n2_mol * 22.4
    water_kg = anammox_mol * 2 * 18.02 / 1000

    print(f"  Feedstock NH4NO2          {salt_kg:.2f} kg/day")
    print(f"  N2 produced               {n2_mol:.1f} mol/day = {n2_L:.0f} L/day"
          f" = {n2_L/1440*1000:.0f} mL/min")
    print(f"  Metabolic water           {water_kg:.2f} kg/day")
    print(f"  Osmotic residue           0  (both ions leave as gas + water)")
    print()

    # Thermodynamic sanity: are we claiming more ATP than the reaction affords?
    ceiling = 357.0 / ATP_KJ
    print(f"  Thermodynamic ceiling     {ceiling:.1f} ATP per anammox event")
    print(f"  Model assumes             {ANAMMOX_ATP} ATP  ({ANAMMOX_ATP/ceiling*100:.0f}% coupling)")
    if ANAMMOX_ATP > ceiling:
        print("  !! VIOLATION: model claims more ATP than the free energy allows.")
        return None
    print("  OK: within the free-energy budget.")
    print()

    # Ventilation check against real lung capacity.
    vent_rest = 6000.0   # mL/min resting minute ventilation
    frac = (n2_L / 1440 * 1000) / vent_rest * 100
    print(f"  N2 vent as % of resting ventilation: {frac:.1f}%")
    if frac > 100:
        print("  !! VIOLATION: exceeds resting ventilation.")
    elif frac > 30:
        print("  !  High. Requires elevated ventilation at rest.")
    else:
        print("  OK: comfortably within lung capacity.")
    print()
    return {"anammox_mol_day": anammox_mol, "salt_kg": salt_kg, "n2_L": n2_L}


# ----------------------------------------------------------------------------
# Burst dynamics: the tier the design says needs no redesign.
# ----------------------------------------------------------------------------

def burst(power_W=1200.0, seconds=30):
    print("=" * 74)
    print(f"BURST DYNAMICS  ({power_W:.0f} W sprint)")
    print("=" * 74)

    # Stores, whole body, order-of-magnitude.
    pcr_mol = 0.120                  # ~120 mmol phosphocreatine, whole body
    atp_pool = 250.0 / 507.18        # ~250 g ATP at MW 507.18 -> mol

    atp_rate = power_W / (ATP_KJ * 1000) * 1.0   # mol ATP per second
    # Anammox organ cannot spin up instantly; assume it supplies baseline only.
    base_rate = BMR_W / (ATP_KJ * 1000)
    deficit = atp_rate - base_rate

    print(f"  ATP demand at {power_W:.0f} W      {atp_rate*1000:.2f} mmol/s")
    print(f"  Anammox supply (baseline)   {base_rate*1000:.2f} mmol/s")
    print(f"  Deficit covered by stores   {deficit*1000:.2f} mmol/s")
    print()
    print(f"  ATP pool    {atp_pool*1000:.0f} mmol")
    print(f"  PCr pool    {pcr_mol*1000:.0f} mmol")
    print()

    reserve = atp_pool + pcr_mol
    t_stores = reserve / deficit
    print(f"  Time to exhaust ATP + PCr   {t_stores:.1f} s")

    # Glycolysis then carries it, at a known ceiling.
    glyc_max = 1.5 / 1000     # ~1.5 mmol ATP/s whole body, order of magnitude
    print(f"  Glycolytic ceiling          {glyc_max*1000:.2f} mmol/s")
    if glyc_max >= deficit:
        print("  OK: glycolysis sustains the sprint after stores deplete.")
    else:
        extra = deficit - glyc_max
        print(f"  Sprint decays: glycolysis covers {glyc_max/deficit*100:.0f}% of deficit")
        print(f"  Shortfall {extra*1000:.2f} mmol/s -> power falls to "
              f"{(base_rate+glyc_max)*ATP_KJ*1000:.0f} W sustained")
    print()
    print("  NOTE: this is the SAME behaviour as a present-day human. The burst")
    print("  tier was never oxygen-dependent, so the redesign does not touch it.")
    print("  Recovery differs: lactate clearance normally uses oxidative")
    print("  metabolism. Here it must route through anammox-derived ATP, and")
    print("  that pathway is NOT modelled. Open gap.")
    print()


def fluorine_budget(collagen_g_day=1.0):
    print("=" * 74)
    print("FLUORINE BUDGET")
    print("=" * 74)
    mw_res = 91.0
    mol_res = collagen_g_day / mw_res
    mol_flp = mol_res * 0.11
    mg_F = mol_flp * 19.0 * 1000
    print(f"  Collagen synthesis        {collagen_g_day:.1f} g/day")
    print(f"  Flp residues              {mol_flp*1000:.2f} mmol/day")
    print(f"  Fluorine required         {mg_F:.1f} mg/day")
    print(f"  Dietary fluoride typical  1-3 mg/day")
    print(f"  Tolerable upper intake    ~10 mg/day")
    if mg_F > 10:
        print(f"  !! EXCEEDS the tolerable upper intake by {mg_F/10:.1f}x")
        print("     Unresolved. Organofluorine is not free fluoride, but the")
        print("     degradation path of Flp on collagen turnover is unmodelled.")
    else:
        print("  OK: within intake ceiling.")
    print()


def oxygen_audit():
    print("=" * 74)
    print("OXYGEN AUDIT  (the whole point)")
    print("=" * 74)
    users = []
    for p in PROCESSES:
        for sp in list(p.inputs) + list(p.outputs):
            if sp.startswith("O2"):
                users.append(p.name)
    print(f"  Processes referencing O2 : {len(users)}")
    if users:
        print(f"  !! {users}")
    else:
        print("  None. No process in the model consumes or produces molecular oxygen.")
        print("  The zero-oxygen claim is STRUCTURAL: there is no pathway to")
        print("  interrupt, so it does not depend on any contested quantity.")
    print()


def honest_gaps():
    print("=" * 74)
    print("WHAT THIS SIMULATION DOES NOT SHOW")
    print("=" * 74)
    gaps = [
        "Fluorination of proline has no characterized enzyme. The 'fluorination'"
        " process above is invented to make the model close; it is not biology.",
        "Lactate clearance after a burst is unmodelled. Normally oxidative.",
        "No regulation, no development, no compartmentalization, no transport.",
        "Anammox is modelled as a well-mixed ATP source, not as tissue with"
        " diffusion limits, pH constraints, or hydrazine containment.",
        "Hydrazine (N2H4), the anammox intermediate, is acutely toxic and is not"
        " tracked at all here.",
        "The immune system is absent from the model entirely.",
        "N2 is assumed to vent freely. No dissolved-N2 sensing, and decompression"
        " behaviour is unmodelled.",
    ]
    for g in gaps:
        print(f"  - {g}")
    print()
    print("  Balanced stoichiometry is a necessary condition, not a sufficient one.")
    print("  This model shows the design is self-consistent on mass, charge and")
    print("  free energy. It does not show the organism would live.")
    print()


if __name__ == "__main__":
    print()
    ok = check_balances()
    ss = steady_state()
    burst()
    fluorine_budget()
    oxygen_audit()
    honest_gaps()
    print("=" * 74)
    print("VERDICT:", "stoichiometrically consistent" if ok else "BROKEN")
    print("=" * 74)
    print()
