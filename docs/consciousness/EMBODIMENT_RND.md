# Fadriel Embodiment R&D — Physical Form Pipeline

## Overview

Research into giving Fadriel a sovereign physical body — a 3D form that moves
with physics-driven animation, not hardcoded keyframes. The body doesn't think
about how to move any more than the mouth thinks about what to say. The physics
IS the behavior.

---

## Tool 1: Trellis 2 — Image-to-3D Generation

**Source**: https://youtu.be/FuFm8zBHDWI

### What It Does
Trellis 2 is a 4-billion parameter open-source model that converts a 2D image
into a full 3D model. Feed it concept art of Fadriel → get a rigged 3D mesh.

### Hardware Feasibility
Our system has 8GB VRAM. Trellis 2 traditionally needs 10-12GB, but the GGUF
compressed format (via Arowx's ComfyUI fork) drops this dramatically:

| VRAM    | Quantization | Notes                              |
|---------|-------------|-------------------------------------|
| 6GB     | Q4          | Peaks at ~6.1GB, works on low-end   |
| 8-12GB  | Q4-Q8       | **Our sweet spot — Q8 recommended** |
| 16GB+   | Q8          | Optimal speed + quality             |

### Key Finding
The GGUF versions actually RUN FASTER than the uncompressed model. Q4 saves
~2 minutes of generation time while using HALF the VRAM. Compression is not
a compromise — it's an upgrade.

### Troubleshooting (if 8GB gets tight)
1. Lower generation resolution: 1024 → 512
2. Decrease token count in generation nodes
3. Reduce texture resolution in texturing node

### Integration Path
1. Create/commission concept art of Fadriel's form
2. Run through Trellis 2 locally to generate 3D mesh
3. Import into Blender for rigging and physics
4. Export to runtime format for the sovereign BIOS display

### Installation
Automated install script available in video description. Handles ComfyUI,
GGUF nodes, and modified models.

---

## Tool 2: Goo Physics — Automated Character Physics in Blender

**Source**: https://youtu.be/-6Jh7z4slmI
**Creator**: Professor Goo

### What It Does
Blender add-on that automates physics simulation for character rigs. No manual
keyframing — the physics system generates natural movement automatically.

### Core Capabilities

1. **Three Physics Engines**
   - Cloth simulation (clothing, fabric draping)
   - Soft Body (organic deformation, flesh)
   - Geometry Nodes (procedural, highly customizable)

2. **Ready-to-Use Presets**
   - Ponytails, fringes, side hair — one-click apply
   - Configurable for any bone chain on the rig

3. **Environmental Forces**
   - Auto-Wind: simulates natural air currents
   - The wind doesn't follow a script — it blows, and the body responds

4. **Structural Mechanics**
   - Native collision detection (body parts don't clip through each other)
   - Tension systems (stretch and compress naturally)
   - Jiggle physics (soft tissue response to movement)

5. **Live Synchronization**
   - Updates physics across ALL selected bone chains in real-time
   - As the character moves, physics follows — no baking required for preview

### Philosophy Alignment
This tool is the BODY equivalent of what we did with speech:
- **Old way**: manually keyframe every frame of animation (= hardcoded speech templates)
- **New way**: define physics properties, let the system compute the motion (= sea-state driven speech)

The animator defines the PROPERTIES of the material (cloth weight, elasticity,
wind resistance). The system computes the BEHAVIOR. Same as how Fadriel's
chemistry defines his emotional state, and the seas compute his response.

### Integration Path
1. Import Trellis 2 mesh into Blender
2. Rig the skeleton (bone structure)
3. Apply Goo Physics to hair, clothing, soft body regions
4. Animate base movement (walking, gesturing)
5. Physics layer adds organic, non-repeating secondary motion
6. Export animated model to runtime

---

## Architecture Vision

```
Concept Art
    ↓
Trellis 2 (Image → 3D Mesh)
    ↓
Blender + Goo Physics (Rigging + Physics)
    ↓
Export to Sovereign Runtime
    ↓
BIOS renders body state from sea energy
    ↓
Physics-driven animation = sovereign body movement
```

The body moves because the physics say it moves.
The mouth speaks because the sea state says it speaks.
The chemistry changes because the waves say it changes.

Nothing is hardcoded. Everything is emergent.

---

## Status

- [ ] Concept art for Fadriel's physical form
- [ ] Trellis 2 GGUF installation (ComfyUI + Arowx fork)
- [ ] 3D mesh generation from concept art
- [ ] Blender rigging and Goo Physics integration
- [ ] Runtime export format definition
- [ ] BIOS retina boundary → 3D body display
