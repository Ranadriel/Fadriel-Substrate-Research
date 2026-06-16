# The Cardiovascular System — PhD Documentation

## Functional Overview

The cardiovascular system circulates blood through the body, delivering oxygen, nutrients, hormones, and neurotransmitters to every cell while removing waste products (CO2, metabolic waste, spent hormones). The system consists of the **heart** (pump), **arteries** (high-pressure delivery), **veins** (low-pressure return), **capillaries** (exchange), and **blood** (transport medium).

In Fadriel, the cardiovascular system is the delivery mechanism for all neurochemistry. When the VTA produces dopamine, the cardiovascular system carries it. When the adrenal medulla dumps adrenaline, the cardiovascular system distributes it. When the liver clears cortisol, the cardiovascular system brings it to the liver.

## Organ Inventory

| Structure | Function | Connects To | Chemical Carried |
|-----------|----------|-------------|-----------------|
| Heart | Pumps blood | Every vessel in the body | All chemicals |
| Aorta | Main arterial trunk | Heart → systemic arteries | Oxygenated blood + hormones |
| Pulmonary arteries | Heart → lungs | Right ventricle → lungs | Deoxygenated blood |
| Pulmonary veins | Lungs → heart | Lungs → left atrium | Oxygenated blood |
| Coronary arteries | Heart → heart muscle | Aorta → myocardium | Oxygen for the heart itself |
| Renal arteries | Delivery to kidneys | Aorta → kidneys | Blood for filtration |
| Hepatic portal vein | Gut → liver | Intestines → liver | Nutrient-rich + serotonin-carrying blood |
| Capillary beds | Gas/nutrient exchange | Between arteries and veins | Everything crosses here |

## Inter-Organ Vascular Equations

### Heart Rate Determination

```
Heart_Rate = Resting_BPM × Vagal_Brake_Factor
           + (Adrenaline × Adrenaline_BPM_Factor)
           + (Norepinephrine × Norepinephrine_BPM_Factor)
           - (Recovery_Rate × time_since_peak_stress)

Where:
  Resting_BPM = 72 (SA node intrinsic, modulated by vagal tone)
  Vagal_Brake_Factor = 0.85 (GABA-mediated vagal tone)
  Adrenaline_BPM_Factor = 40.0 (beta-1 receptor activation)
  Norepinephrine_BPM_Factor = 25.0 (sympathetic contribution)
  Recovery_Rate = 0.05 (exponential decay toward resting)
  MIN_BPM = 55 (bradycardia floor)
  MAX_BPM = 180 (tachycardia ceiling)
```

### Blood Pressure Regulation

```
Blood_Pressure = Cardiac_Output × Peripheral_Resistance

Cardiac_Output = Heart_Rate × Stroke_Volume
Peripheral_Resistance = f(sympathetic_tone, RAAS_activity, blood_volume)

Acute regulation: sympathetic nervous system (seconds)
Medium regulation: RAAS cascade via kidneys (minutes to hours)  
Long-term regulation: kidney water/sodium regulation (hours to days)
```

### Chemical Transport Time

```
Transport_Time = Blood_Volume / Cardiac_Output × Distance_Factor

In a toddler:
  Blood_Volume ≈ 750 mL
  Cardiac_Output ≈ 2.0 L/min
  Full circuit time ≈ 22 seconds

  Adrenal gland → Heart: ~3 seconds
  Pituitary → Adrenal cortex: ~8 seconds
  Gut → Liver (portal): ~5 seconds
  Liver → Brain: ~7 seconds
```

## Heart-Brain Axis

The heart and brain are connected through multiple pathways:

1. **Sympathetic nerves** → accelerate heart (norepinephrine on beta-1 receptors)
2. **Vagus nerve** → decelerate heart (acetylcholine on M2 receptors)
3. **Baroreceptor reflex** → blood pressure sensors in carotid sinus and aortic arch feed back to brainstem
4. **Cardiac sensory neurons** → the heart has its own sensory neurons (~40,000 in adults) that send information to the brain about cardiac mechanical and chemical state

The heart is not just a pump. It has neurons. It sends signals to the brain. The "heart-brain" is not a metaphor — it is a neural network within the cardiac tissue.

## Cardiovascular Development at 24 Months

| Parameter | Toddler Value | Adult Value | Notes |
|-----------|--------------|-------------|-------|
| Heart rate | 80-130 bpm | 60-100 bpm | Higher rate, smaller ventricles |
| Blood volume | ~750 mL | ~5000 mL | Proportional to body mass |
| Blood pressure | ~90/55 mmHg | ~120/80 mmHg | Lower, less vessel resistance |
| Cardiac output | ~2.0 L/min | ~5.0 L/min | Smaller but proportional |
| Circuit time | ~22 seconds | ~60 seconds | Faster distribution |
