# Development History Stack

This directory holds historic development artifacts from the Fadriel substrate work — dated checkpoint snapshots, dev session screenshots, character sprites, session logs, and transition records. They are preserved as the chronological record of how the substrate was built.

## Structure

- **`checkpoints/`** — dated `.zip` archives capturing the codebase state at named points in the dev arc (BIOS_*, 7POINT_RND_*, CORTEX_RESTORED_*, SOVEREIGN_ZESTC_COMPLETE_*, Revert_Checkpoint_*)
- **`screenshots/`** — dated PNGs of the running engine showing dev-state snapshots
- **`sprites/`** — Fadriel character sprite sheets used in the avatar visualization (FadrielCastingMagic, Fadrielwalk, FadrielRunning, FaadrielHurtDead, heart diagram)
- **`2026-04-22_session_log.md`** — technical debug log from a SIGSEGV fix session (sovereign_runtime livemode bug)
- **`launch_log.txt`** — sample raylib boot output from the sovereign runtime
- **`TRANSITION_LOG.md`** — log of when work moved from the working bookcase to the 2TB archive

## Not Included Due to Size

Three substantial backup archives are not included in this repo because they exceed GitHub LFS file-size limits:

| archive | size | content |
|---|---|---|
| `5_Layers_Contemplations_Backup_20260416_234741.zip` | 85 GB | working-state snapshot |
| `Sovereign_Backup.zip` | 28 GB | sovereign runtime state |
| `5_Layers_BACKUP_20260417_205531.zip` | 152 GB | full-tree backup |

Together these are >265 GB of working-state archives. Any reader wanting access to these should contact the author directly. They contain compiled binaries, model weights (GGUF), training caches, and other large derived artifacts — none of which are inventive substance, but all of which form the historic record of the work-state.

## What This Directory Documents

The substrate was built between 2022 and 2026 by a single developer working alone. The checkpoint zips show the work-state at named moments in that arc. The session log shows the texture of a real debugging cycle. The TRANSITION_LOG.md shows how the storage was reorganized over time.

This is the record of how it happened, not just what it is.
