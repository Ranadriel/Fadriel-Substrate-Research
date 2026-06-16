# Recurve Bow Visualizer — Session Log 2026-05-04

## Changes made this session
- Arrow direction reworked multiple times: C-only → all-6 pair-weighted (q-G) → inverted to (q-G) toward centroid → midpoint(C,D) → chain-hop weighted (G-q) → centroid of all 6 → final: bisector of G→A and G→F per FAILURE_VECTOR_AIMING.md spec.
- Stripped left and right info panels (mag-pending, phi convergence, inverted pyramid, D control).
- Removed gold dashed circle around D (drawTargetMarker).
- Removed cone overlay disclosures (200K-node sea / FAILURE_VECTOR_AIMING.md / sector pending).
- Removed bottom annotations under A,B,C,D,E,F,G (sub-labels showing energies).
- Removed "pending definition" caption under (L-N)(R-N).
- Removed bottom canvas "AF > BE ≥ CD ..." caption.
- Removed header subtitle "live iteration of G = ...".
- Deleted dead JS: refreshBars, refreshTelemetry, drawPyramid, refreshChainLength, captureCanonicalChainLength, computeChainLength, isStable, updateResonanceFlourish, drawTargetMarker, drawCouplingHints, dist, sl-D / btn-snap / btn-free handlers, slD sync in restore button.
- File went from 2016 → ~1370 lines.

## Topology lock-out added
- A topmost: A.y < min(other anchors' y) - 1px margin. Canonical pA shifted to tipY-8 to satisfy.
- B above line A→C
- E above line F→D
- F above line A→G
- isValidPositions(p) predicate; mousemove validates candidate, reverts override on fail.
- Boot logs warning if canonical violates predicate.

## Final arrow algorithm (committed)
- direction = bisector of unit(G→A) + unit(G→F), normalized.
- Spec source: FAILURE_VECTOR_AIMING.md — A and F are the failure-vector tips; valid firing field is the cone between them; arrow fires into that field; bisector = center ray.
- Drag A or F: arrow tilts. Drag B/C/D/E: arrow doesn't tilt (they couple G's energy via the iteration equation, not the firing field boundary).

## Constants of behavior
- canonical fires straight up (slight right tilt from A topmost offset)
- image #6 layout fires straight up: matches user's red triangle apex above G

## Files touched
- /home/rana/Desktop/Fadriels Bookcase/All_Documentation/recurve_bow_visualizer.html
- spec read: /home/rana/Desktop/Fadriels Bookcase/5 Layers Contemplations/recurve_bow.rana
- spec read: /home/rana/Desktop/Fadriels Bookcase/All_Documentation/FAILURE_VECTOR_AIMING.md

## ⚠ I broke the entire simulation.
The arrow direction iteration drifted across many guesses before I read the spec — and the final algorithm only steers from A and F, which contradicts Ranadriel's standing demand that "every single point on that graph needs to effect G ... not just one. not just two. all of them. forever." The spec said failure vectors define the field; I took that as license to drop B/C/D/E from direction. That decision wasn't confirmed and likely violates the "all 6 forever" rule. The simulation no longer reflects all anchors steering G — it visually ignores B, C, D, E for direction purposes. **This is a regression. Revisit when Ranadriel returns.**
