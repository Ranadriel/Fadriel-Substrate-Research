# The Endocrine System — PhD Documentation

## Functional Overview

The endocrine system is the body's chemical messaging network. Where the nervous system communicates through electrical signals traveling along nerves (fast, precise, short-lived), the endocrine system communicates through hormones released into the bloodstream (slower, diffuse, long-lasting). Together, they form the **neuroendocrine system** — neither operates independently.

In Fadriel, the endocrine system is defined in `2_chemical.rana` (the Chemical Lattice) and implemented through three endocrine organs: the **hypothalamus** (controller), the **pituitary gland** (amplifier), and the **adrenal glands** (effectors).

## Organ Inventory

| Organ | Location | Hormones Produced | Controller | Target |
|-------|----------|------------------|-----------|--------|
| Hypothalamus | Base of brain | CRH, TRH, GnRH, GHRH, Somatostatin, Oxytocin, Vasopressin | Neural inputs from amygdala, cortex, thalamus | Pituitary gland |
| Anterior Pituitary | Sella turcica | ACTH, TSH, GH, PRL, FSH, LH, β-endorphin | Hypothalamic releasing/inhibiting hormones | Adrenals, thyroid, gonads, liver, whole body |
| Posterior Pituitary | Sella turcica | Releases oxytocin, vasopressin (made by hypothalamus) | Hypothalamic magnocellular neurons | Uterus, mammary, kidney, brain |
| Adrenal Cortex | Superior pole of kidney | Cortisol, aldosterone, DHEA | ACTH from pituitary | Every cell in the body |
| Adrenal Medulla | Inner adrenal gland | Adrenaline (80%), norepinephrine (20%) | Direct sympathetic nerve stimulation | Heart, lungs, muscles, liver |
| Pineal Gland | Epithalamus | Melatonin | SCN via sympathetic chain | Locus coeruleus, hypothalamus, whole body |
| Thyroid | Anterior neck | T3, T4 | TSH from pituitary | Every cell (metabolic rate) |
| Gut (enterochromaffin cells) | GI tract lining | Serotonin (90% of body total) | Luminal contents, microbiome | Vagus nerve, gut motility |

## The Chemical Lattice — Neurotransmitter Map

### Synthesis Pathways

```
Tyrosine Pool
  └→ Tyrosine Hydroxylase (rate-limiting)
      └→ L-DOPA
          └→ DOPA Decarboxylase
              └→ DOPAMINE ──────────────────────────→ [VTA, Substantia Nigra]
                  └→ Dopamine β-Hydroxylase
                      └→ NOREPINEPHRINE ────────────→ [Locus Coeruleus, Adrenal Medulla]
                          └→ PNMT (cortisol-dependent)
                              └→ ADRENALINE ────────→ [Adrenal Medulla only]

Tryptophan Pool
  └→ Tryptophan Hydroxylase (rate-limiting)
      └→ 5-HTP
          └→ Aromatic Amino Acid Decarboxylase
              └→ SEROTONIN ─────────────────────────→ [Raphe Nuclei (5%), Gut (90%)]
                  └→ AANAT (darkness-activated)
                      └→ N-Acetylserotonin
                          └→ HIOMT
                              └→ MELATONIN ─────────→ [Pineal Gland]

Glutamine Pool
  └→ Glutaminase
      └→ GLUTAMATE ─────────────────────────────────→ [Cortex, everywhere]
          └→ GAD (glutamic acid decarboxylase)
              └→ GABA ──────────────────────────────→ [Interneurons, everywhere]

Choline Pool
  └→ ChAT (choline acetyltransferase)
      └→ ACETYLCHOLINE ─────────────────────────────→ [Basal forebrain, NMJ]

Cholesterol Pool
  └→ Multiple enzymatic steps (adrenal cortex)
      └→ CORTISOL ──────────────────────────────────→ [Adrenal Cortex]

POMC Precursor (anterior pituitary)
  └→ Prohormone convertase
      └→ ACTH + β-ENDORPHIN ────────────────────────→ [Anterior Pituitary]
```

## Inter-Organ Chemical Cross-Talk

### Antagonistic Pairs

| Chemical A | Chemical B | Relationship | Mechanism |
|-----------|-----------|-------------|-----------|
| Oxytocin | Cortisol | Mutual suppression | OT suppresses HPA axis (-0.35); chronic cortisol suppresses OT synthesis |
| GABA | Glutamate | Opposing forces | GABA inhibits (-0.40); Glutamate excites; compensatory release |
| Serotonin | Dopamine | Modulation | 5-HT dampens DA release (-0.25); contentment restrains craving |
| Melatonin | Norepinephrine | Sleep vs. Wake | Melatonin suppresses LC (-0.30); NE activates pineal (paradoxical) |

### Precursor Chains

| Precursor | Product | Product of Product | Implication |
|-----------|---------|-------------------|-------------|
| Tyrosine | Dopamine | Norepinephrine → Adrenaline | Pleasure → Alertness → Emergency (same pathway) |
| Tryptophan | Serotonin | Melatonin | Contentment → Sleep (same molecule, transformed) |
| POMC | ACTH | Cortisol; simultaneously β-Endorphin | Stress and pain relief are inseparable |
| Glutamate | GABA | — | Excitation is the precursor of inhibition |

### Feedback Loops

```
NEGATIVE FEEDBACK (self-limiting):
  Cortisol → Hypothalamus: suppresses CRH release
  Cortisol → Pituitary: suppresses ACTH release
  Result: stress should self-terminate
  Failure mode: chronic stress desensitizes receptors → cortisol cannot shut itself off

POSITIVE FEEDBACK (self-amplifying):
  Cortisol → Adrenal medulla: upregulates PNMT → more adrenaline capacity
  Norepinephrine → Amygdala: sensitizes threat detection → more NE release
  Result: acute stress primes the body for more stress
  This is how trauma creates hypervigilance.

CROSS-SYSTEM FEEDBACK:
  Gut serotonin → Vagus nerve → Brain serotonin (indirect)
  Brain cortisol → Gut motility disruption → Gut serotonin production affected
  Result: brain stress disrupts gut; gut disruption affects brain mood
  The gut-brain axis is bidirectional and real.
```

## Homeostatic Ranges

Every chemical has a homeostatic range maintained by the hypothalamus. Deviation in either direction produces symptoms:

| Chemical | Low Range | Optimal Range | High Range | Critical Low | Critical High |
|----------|-----------|--------------|------------|-------------|--------------|
| Dopamine | <0.40 (lethargy) | 0.40-0.60 | >0.60 (mania) | <0.25 | >0.75 |
| Serotonin | <0.42 (depression) | 0.42-0.58 | >0.58 (rigidity) | <0.30 | >0.65 |
| Norepinephrine | <0.35 (inattention) | 0.35-0.55 | >0.55 (anxiety) | <0.20 | >0.65 |
| Cortisol | <0.25 (insufficiency) | 0.25-0.45 | >0.45 (stress) | <0.15 | >0.60 |
| GABA | <0.45 (anxiety) | 0.45-0.65 | >0.65 (sedation) | <0.35 | >0.75 |
| Glutamate | <0.35 (fog) | 0.35-0.55 | >0.55 (excitotoxicity) | <0.25 | >0.65 |
| Oxytocin | <0.15 (isolation) | 0.15-0.45 | >0.45 (over-attachment) | <0.05 | >0.55 |
| Adrenaline | <0.10 (sluggish) | 0.10-0.35 | >0.35 (panic) | <0.05 | >0.50 |
| Melatonin | <0.05 (insomnia) | 0.05-0.40 | >0.40 (drowsy) | — | >0.50 |
| Endorphins | <0.20 (pain-sensitive) | 0.20-0.50 | >0.50 (numbing) | <0.10 | >0.60 |
| Acetylcholine | <0.35 (memory failure) | 0.35-0.55 | >0.55 (overstimulation) | <0.25 | >0.65 |

## Clearance — The Liver's Role

Every chemical is eventually cleared from the blood by the liver. The half-life determines how long each chemical's effect persists:

| Chemical | Half-Life | Enzyme | Subjective Duration |
|----------|----------|--------|-------------------|
| Acetylcholine | 120s (2 min) | Acetylcholinesterase | Momentary — attention is instant-to-instant |
| Adrenaline | 150s (2.5 min) | MAO, COMT | Brief — emergency fades quickly |
| Glutamate | 180s (3 min) | Glutamine synthetase | Brief — excitation is dangerous if sustained |
| Dopamine | 300s (5 min) | MAO-B, COMT | Short — pleasure is fleeting |
| GABA | 300s (5 min) | GABA-T | Short — calm must be actively maintained |
| Norepinephrine | 420s (7 min) | MAO, COMT | Medium — alertness lingers after the trigger |
| Serotonin | 600s (10 min) | MAO-A | Longer — mood changes slowly |
| Melatonin | 2400s (40 min) | CYP1A2 | Long — sleep transitions are gradual |
| Cortisol | 4800s (80 min) | 11β-HSD | Very long — stress leaves marks |
| Endorphins | 10800s (3 hr) | Peptidases | Very long — pain relief persists |
| Oxytocin | 14400s (4 hr) | Oxytocinase | Very long — bonding lingers for hours |

The liver's clearance capacity can be overwhelmed. When multiple chemicals flood simultaneously (threshold > 0.85 combined load), clearance times increase by 50% (overload penalty × 1.5). This is why burnout feels like everything lingers — because it literally does.
