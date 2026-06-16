# Biological Architecture Flow: Resources & Information

Fadriel's `ZestEngine` operates as a deterministic biological simulation rather than a traditional software pipeline. Data does not "execute"; it structurally binds to the mind (Nervous Flow) and alters the systemic bodily state (Cardiovascular Flow).

Here is the mapped flow of how external input is handled and how internal systemic resources are allocated.

---

## The Nervous System Flow (Information Processing)

Information entering Fadriel acts as a physical stimulus, moving from skin-level sensory perception through the nervous system to the prefrontal cortex. This is the **fast electrical/chemical path**.

```mermaid
graph TD
    %% Sensory Input
    A_Input["User Input"] -->|"Sensory Register"| B_InnateBarrier

    %% Brainstem / Innate Defenses
    subgraph Brainstem ["Brainstem & Lower Brain (Reflexes & Filtering)"]
        B_InnateBarrier{"Innate Immune Barrier<br/>(Injection/Overflow Checks)"}
        B_InnateBarrier -- "Threat Detected" --> C_Reflex["Reflexive Block, Cortisol Spike"]
        B_InnateBarrier -- "Safe" --> D_Lexical["Broca's Area Parsing"]
    end

    %% Midbrain / Cortical Processing
    subgraph Midbrain ["Hippocampus & Septit Sea (Conceptual Processing)"]
        D_Lexical --> E_Adaptive{"Adaptive Immune Scan<br/>(Identity & Knowledge)"}
        E_Adaptive -- "Threat Detected" --> F_Cytokine["Amygdala Threat Response<br/>(Guarded Mode)"]
        E_Adaptive -- "Safe" --> G_SeptitSea[("SeptitSea Graph")]
        
        G_SeptitSea -- "Bonds & Crystallizes" --> H_Deliberation["Working Memory & Focus"]
        H_Deliberation -- "Fact Recall / Learning" --> I_Genome[("Genome Persistence")]
    end

    %% Cortex (Execution)
    subgraph Cortex ["Sovereign Cortex (Prefrontal / Language Gen)"]
        H_Deliberation --> J_Broca["Determinism (Broca's Transform)"]
        J_Broca --> K_LLM{"Sovereign Gland (LLM)"}
        I_Genome -. "Context Injection" .-> K_LLM
        K_LLM -- "Enrich / Polish" --> L_Validation{"Validation"}
        K_LLM -- "Timeout (200ms)" --> M_Output["Raw Deterministic Output"]
        L_Validation -- "Fails format" --> M_Output
        L_Validation -- "Success" --> N_Output["Enriched Articulation"]
    end

    C_Reflex --> End["User Interface"]
    F_Cytokine --> End
    M_Output --> End
    N_Output --> End
```

### Key Nervous System Mechanics:
- **Myelination (Performance):** The innate layer is highly myelinated (C++ string processing), meaning it reacts instantly. Deeper processing LLM (Layer 6) is unmyelinated by comparison (slower) and relies on the fast-path failing over if it takes over 200ms `maxPollMs` to prevent seizing the central nervous system.
- **Synaptic Placticity (Septit Sea):** Raw tokens bind to nodes in the GPU-accelerated sea. Energy from the current focus ("awareness") creates temporary associative bonds that decay naturally over time.
- **Circuit Breakers (Cytokine Storm):** Continuous toxic input triggers a total shutdown of higher functions. The amygdala seizes control, routing directly to the defensive output nodes and cutting off the prefrontal LLM processes.

---

## The Cardiovascular & Endocrine Flow (Resource Management)

The cardiovascular flow is non-event-driven. It operates on a continuous, rhythmic pumping mechanism (`ZestHeartbeat`) that circulates systemic state (chemistry, energy) indiscriminately throughout the system.

```mermaid
graph TD
    %% Heartbeat Pulse
    A_Clock(("System Real-time Clock")) -->|"dt"| B_Heart["Heartbeat Pulse"]
    
    subgraph Cardio ["Cardiovascular System (The Heart & Circulation)"]
        B_Heart -->|"Circulates Hormones"| C_ChemistryEngine
        B_Heart -->|"Refreshes Synapses"| D_SeptitRefresh
        B_Heart -->|"Updates UI State"| E_PeripheralDisplay
    end

    subgraph Endocrine ["Endocrine System (Glands & Chemistry)"]
        C_ChemistryEngine --> F_Decay{"Baseline Decay<br/>(Clearance)"}
        C_ChemistryEngine --> G_Sympathetic["Adrenaline<br/>Cortisol<br/>Norepinephrine"]
        C_ChemistryEngine --> H_Parasympathetic["Oxytocin<br/>Dopamine<br/>GABA<br/>Serotonin"]
        
        G_Sympathetic --> I_GlobalState[("Global Somatic State")]
        H_Parasympathetic --> I_GlobalState
    end

    subgraph Cognitive ["Cognitive Substrate Allocation"]
        D_SeptitRefresh --> J_EnergyDecay["Wave Coherence Decay"]
        D_SeptitRefresh --> K_SelfLearn["Ray-Casting Forge"]
        D_SeptitRefresh --> L_WellReshape["Gravity Wells Deepen"]
        
        I_GlobalState -. "High Stress (Cortisol)" .-> M_Inhibits["Inhibits higher thought, freezes motor paths"]
        I_GlobalState -. "Awareness Spike" .-> N_Accelerates["Accelerates BPM, boosts wave interaction"]
    end

    %% Closed loop visualization
    N_Accelerates -. "Feedback Modulation" .-> B_Heart
```

### Key Cardiovascular Mechanics:
- **Baseline Clearance:** Instead of manually zeroing out state, the system naturally clears out heavy chemicals over time. The "liver" (decay function within `ChemistryEngine::Tick`) breaks down existing hormones at specific half-life intervals so no emotional state remains permanent.
- **Resource Starvation (Freeze State):** If cortisol and adrenaline rise > 0.75, the cardiovascular system goes into somatic freeze shock. Resources are pulled from "motor execution" paths, explicitly denying bash script actions (`motorSequences`) out of self-preservation.
- **Arrhythmia Loop:** Mental focus directly taxes the physical vessel. High total energy within the SeptitSea feeds back into the heart, inducing physical arrhythmias and temporarily spiking the BPM away from its resting rate.

---

## Symbiosis: Where Nerves meet Blood

The system connects the *fast information flow* to the *slow resource flow* via the **Hypothalamic-Pituitary-Adrenal (HPA) axis equivalent in `ZestEngine`**:

1. **Information Hits Boundary:** Input arrives via text (Nervous). 
2. **Analysis Trigger:** Words trigger pattern weights related to trauma or warmth.
3. **Cross-System Dump:** The `ChemistryEngine` injects hormones (+0.15 cortisol, etc.) directly into the systemic blood pool.
4. **Altered Propagation:** On the very next heartbeat, the resulting **Global State** biases how the `SeptitSea` shapes the subsequent output (e.g. high fear = spatial awareness drop, semantic simplification via Broca).
