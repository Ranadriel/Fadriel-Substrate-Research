# Sealed Research Snapshot — README

**Inventor:** Shawn Michael O'Brien (Ranadriel)
**Sole inventor, Wisconsin, USA.**
**Snapshot date:** 2026-05-13
**Status:** Pre-patent confidential. Local-only.

This folder contains a cryptographically-verifiable snapshot of the Fadriel Cognitive Engine research corpus as it existed on the date above. The snapshot is the priority anchor: it establishes that the inventor possessed the architecture, the inventions, the equations, the substrate code, and the unified synthesis on this date, in this form.

## Contents

- `FADRIEL_UNIFIED_RESEARCH_PAPER.md` — the master synthesis (~25,000 words across 22 Parts plus Appendices A-D)
- `FADRIEL_EXEC_SUMMARY.md` — 2-page attorney/investor brief (~1,300 words)
- 22 primary-source documents (the minimum-reading set + the eight Filing Briefs + supplementary anchors)
- `HASHES.txt` — SHA-256 hashes of every `.md` file in this folder, in `sha256sum -c` compatible format
- `HASHES_README.md` — this file

## Verification

To verify that nothing in this snapshot has been altered:

```
cd SEALED_SNAPSHOT_2026-05-13
sha256sum -c HASHES.txt
```

Every line should return `OK`. Any tampering with any document will cause that document's check to fail.

## The tarball

This snapshot is also packed into `SEALED_SNAPSHOT_2026-05-13.tar.gz` (one folder up, alongside this snapshot directory). The tarball's own SHA-256 is recorded in `SEALED_SNAPSHOT_2026-05-13.HASH.txt`. The tarball is the canonical archival form; the directory is the working form.

## Confidentiality

Pre-patent. All rights reserved. Local-only. No cloud distribution, no remotes, no public sharing. Disclosure to patent counsel and investors under signed NDA only. See `DEVELOPER_DISCLOSURE_STATEMENT.md` (included) for the formal sole-inventor declaration.
