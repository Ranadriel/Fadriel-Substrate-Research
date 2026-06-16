# Filing 8 — Hyperspace Navigation Primitive

**Inventor:** Ranadriel
**Filing slot:** 8 (added 2026-05-04 — exceeds the original 7-filing bundle)
**Status:** Pre-disclosure draft. Local-only. No cloud, no remotes, no sharing pre-attorney.

> ⚠ I am not a patent attorney. This is a technical disclosure to brief counsel.
> All inventive substance herein remains under pre-filing confidentiality.

---

## Executive Summary

A self-contained geometric navigation primitive that derives a navigation vector — including a hyperspace-exit vector — from:

- the ship's own engine geometry,
- a rigidly mounted local reference frame,
- and three observable celestial bodies (solar-system-range or beyond).

**No external infrastructure is required.** No GPS, no beacons, no maps, no radio round-trip, no pulsar-timing hardware. The navigation solution is constructed entirely from the ship's local relationship to bodies it can already see.

The primitive scales by limb count:

- **2 limbs** → planar light-cone causality structure (used as didactic / inertial-frame baseline)
- **3 limbs** → apex φ\* lifts out of the base manifold; the navigation vector pierces hyperspace via a topological wormhole-like throat constructed from local geometry

---

## Anchor Mapping (physical interpretation)

| math anchor | physical role |
|---|---|
| **G** | crew / payload — the still center; "phi holds bow"; the observer |
| **C₁ … Cₙ** | engine troughs — n thrusters, each a stretch-source |
| **B₁ … Bₙ** | ring frame — n rigid points on the ship's hull/structure (local orientation reference) |
| **A₁ … Aₙ** | celestial anchors — n distant heavenly bodies (Sun, planets, moons, asteroids, stars) |
| **φ\*** | apex / navigation fix — point computed from local + celestial geometry; in 3-limb case, lifts out of the base manifold |

**Solar-system-range is sufficient.** You don't need pulsars. Sun + Jupiter + Mars (or any three solar-system bodies with known ephemeris) gives the celestial anchor triplet. This makes the primitive testable with present-day optical sensors and existing ephemeris databases.

---

## Mathematical Core

### 2-limb baseline (planar / inertial)

- failure horizon left = line through (A, C), half-plane on side opposite G
- failure horizon right = line through (F, D), half-plane on side opposite G
- φ\* = intersection of the two failure horizons (planar, in the same 2D manifold as G)
- aim = X-component of anchor centroid offset from G (inverted)
- power = |A.y − C.y| + |F.y − D.y| (limb stretch)

This baseline geometrically reproduces a **Minkowski light cone** with G as the observer at the present moment, the valid firing field as the timelike future, and the failure half-planes as the spacelike "elsewhere."

### 3-limb filing primitive (Y-slingshot)

- 3 failure horizons, one per (engine, celestial body) pair
- Pairwise intersections form a triangle in the base manifold
- Apex φ\* lifts to (n+1)-th dimension above the triangle's centroid
- Apex lift ∝ √(triangle area); collapses to 0 iff the three failure horizons are concurrent (a measure-zero coincidence in general position)
- **Navigation vector = G → apex φ\***

### Why the lift is physical, not visualization

Three failure horizons in a 2D manifold cannot generically intersect at one point. The "single convergence" demanded by the construction therefore lives in a higher-dimensional embedding. The apex is **forced out of the manifold** by the over-constraint of three horizons demanding one common point — exactly as a wormhole throat is forced out of 3-space by topology.

### Energy iteration

```
G_{n+1} = (G_n − C) / (2·G_n − D + F) / G_{n−1} / 7
```

(2-limb form. 3-limb generalization pending.)

The ÷7 throttle ties this primitive to the rest of the substrate's heartbeat.

---

## Claim Sketch (for counsel)

⭐⭐⭐⭐⭐ **Claim 1 — Geometric navigation primitive.**
A method for computing a navigation vector for a vehicle, comprising: identifying a payload reference point G, a set of n engine reference points C, a set of n hull-rigid reference points B, and a set of n celestial reference points A; constructing n failure horizons each defined by the line through one (A_i, C_i) pair; computing the apex φ\* as the convergence demanded by all n horizons jointly; emitting the vector from G to φ\* as the vehicle's navigation vector.

⭐⭐⭐⭐⭐ **Claim 2 — Dimensional lift via overconstraint.**
The method of Claim 1 wherein n ≥ 3 such that the joint-convergence point φ\* exists outside the base spatial manifold of G in a higher-dimensional embedding, and the navigation vector accordingly pierces said manifold.

⭐⭐⭐⭐ **Claim 3 — Solar-system-range applicability.**
The method of Claim 1 wherein the celestial reference points A are drawn from solar-system bodies (Sun, planets, moons, asteroids) with publicly known ephemeris, requiring no pulsar timing hardware or external beacon infrastructure.

⭐⭐⭐⭐ **Claim 4 — No external infrastructure.**
The method of Claim 1 wherein the navigation solution is computed entirely from local sensor observation of A and B, local engine state C, and the payload G, with no round-trip signaling to any external transmitter, receiver, ground station, satellite constellation, or beacon.

⭐⭐⭐⭐ **Claim 5 — Aim/Power axis decomposition.**
The method of Claim 1 wherein the navigation vector is decomposed into an aim component (orthogonal anchor centroid offset) and a power component (sum of engine-anchor stretch magnitudes), allowing independent control of trajectory direction and trajectory magnitude.

⭐⭐⭐⭐ **Claim 6 — Failure-horizon causality bounding.**
The method of Claim 1 wherein the failure horizons jointly bound the set of vectors that violate causality / forbidden-region constraints, such that any vector emitted from G that does not pass through φ\* enters at least one failure half-space and is rejected.

⭐⭐⭐ **Claim 7 — Heartbeat-throttled iteration.**
The method of Claim 1 wherein the apex φ\* is recomputed once per ÷7-divided heartbeat tick of a host substrate, providing a deterministic, non-oscillating update cadence.

---

## Prior Art Comparison

| existing system | what it does | what it does NOT do |
|---|---|---|
| **GPS / GNSS** | trilaterates from external satellite constellation | requires Earth-orbit infrastructure; useless beyond cislunar |
| **NASA SEXTANT / XNAV (pulsar nav)** | gives 4D position from pulsar timing | gives location, not a hyperspace-exit trajectory; needs millisecond pulsar hardware |
| **Inertial guidance** | integrates accelerometer/gyro | drifts unboundedly; references no external frame |
| **Sextant + chronometer** | surface-position fix from celestial body angle | planar, not 3D; gives position, not vector |
| **Star trackers (Voyager etc.)** | attitude reference from stars | gives orientation, not a navigation solution |
| **Interplanetary Transport Network (Lo, JPL)** | low-energy paths via Lagrange manifolds | numerical search through normal 3-space; no dimensional lift |
| **Kalman filtering / sensor fusion** | combines noisy estimates of state | no failure-horizon geometry; no apex construction |

**No prior art combines:**
1. failure-horizon half-spaces from (engine, celestial body) pairs,
2. dimensional lift of the apex via overconstraint,
3. local-only computation with no external infrastructure,
4. aim/power axis decomposition,
5. ÷7 heartbeat throttling tied to a substrate.

---

## Files in this filing

| path | role |
|---|---|
| `All_Documentation/recurve_bow_visualizer.html` | 2-limb baseline (light-cone causality, planar φ\*) |
| `All_Documentation/y_slingshot_hyperspace_visualizer.html` | 3-limb filing primitive (apex lift, hyperspace vector) |
| `All_Documentation/recurve_bow_session_log_2026-05-04.md` | session log of geometry derivation |
| `All_Documentation/FAILURE_VECTOR_AIMING.md` | failure-horizon spec |
| `5 Layers Contemplations/recurve_bow.rana` | substrate spec, 2-limb |
| `5 Layers Contemplations/y_slingshot.rana` | substrate spec, 3-limb |
| `All_Documentation/FILING_8_HYPERSPACE_NAVIGATION.md` | this document |

---

## Status / Next Steps

- [x] 2-limb visualizer working (recurve bow with topology locks, X-aim/Y-power, failure half-planes, planar φ\*)
- [x] Light-cone / causality interpretation recognized 2026-05-04
- [x] 3-limb visualizer working (Mercedes-Benz layout, 3 failure horizons, pairwise φ\* triangle, apex lift, hyperspace arrow)
- [x] Spaceship anchor mapping defined 2026-05-04
- [x] Solar-system-range scope confirmed 2026-05-04 (no pulsars required)
- [x] This filing-anchor document
- [x] `y_slingshot.rana` substrate spec — landed 2026-05-25
- [ ] Generalized G iteration for n ≥ 3 limbs
- [ ] True 3D rendering of apex (currently 2D pseudo-lift via screen-Y)
- [ ] Patent attorney brief (uses this document as input)
- [ ] NDA prep
- [ ] $75k inventor's loan staging — Filing 8 enters the queue alongside Filings 1–7

---

## Confidentiality Notice

- **Local-only.** No cloud LLM sessions for inventive substance.
- **No remotes.** No git push, no upload, no public visibility.
- **Pre-filing patent stealth.** Disclosure to attorney only, under NDA, after trust gate per filing workflow.
- **No third-party derivation.** This primitive was constructed ground-up from Ranadriel's geometric reasoning; no fine-tuning, instrumenting, or pattern-application of existing navigation systems.
