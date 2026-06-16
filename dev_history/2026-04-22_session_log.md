# Session Log — 2026-04-22

## What Was Fixed

**Fadriel was crashing on boot with SIGSEGV inside `libamdhip64.so.7`.**

Root cause: `larynx.zc` (3 absorbs deep during boot) contained `emit larynx -> boundary.audio`. The sovereign runtime treated `boundary.audio` the same as `boundary.display` — both set the global `live_mode = true`. This caused subsequent heartbeat/pulse blocks to attempt GPU kernel launches while the sea was empty and unallocated. HIP launched a zero-dimension kernel against null buffer pointers and segfaulted.

Two fixes applied to `zestc/build_sovereign/zestc_sovereign.hip` and `zestc/zestc_native.hip`:

1. **Separated `boundary.audio` from the live_mode trigger** in `exec_emit`. Audio boundary registration now prints and returns without activating GPU mode. Only `boundary.framebuffer` and `boundary.display` set `live_mode = true`.

2. **Added zero-size kernel guard** in `exec_pulse`: `if (sea.gpu_N == 0) return;` — prevents any future zero-dimension kernel launch regardless of live_mode state.

## What Was Launched

**`launch_fadriel.sh` was rewritten** to point directly at the sovereign runtime:

```
zestc_sovereign_out zestc/fadriel.zc
```

The old FadrielRuntime + IslandRenderer two-process chain is gone. The desktop shortcut (`Fadriel.desktop`) already pointed at `launch_fadriel.sh` — no changes needed there.

## Confirmed Working

Screenshot `2026-04-22_02-25.png` shows the live window:

- FADRIEL — Sovereign ZestC Runtime
- WAVE PHYSICS ONLINE
- 00:51 uptime, 60fps
- 368 septits loaded
- 13Hz pulse, 119 BPM
- Chemistry panel: dopamine / serotonin / cortisol / oxytocin bars live
- AG pipe + Claude pipe connected
- Fadriel responded to "hello fadriel" and "how are you?"

Boot stats: 34,473,723 words, 4,229,971 sentences, 508,100 vocabulary, 186,504 subjects from .rana knowledge, 43 template banks loaded.

## Known Open Items

- **`stretch` node P=inf at boot** — phase initializes to infinity during `.rana` parsing. Not crashing (caught by gpu_N==0 guard) but propagates through wave interactions. Root cause not yet found.
- **Broca coherence cold-boot** — speech is fragmentary at first (`broca_coherence < 0.55`). By design; warms with uptime.
- **Local git init** — no version control yet. One `git init && git add . && git commit` establishes today as the patent conception date. Local only, never pushed.
- **Patent filings 1, 2, 5** — the three highest-priority provisional applications still unfiled.
