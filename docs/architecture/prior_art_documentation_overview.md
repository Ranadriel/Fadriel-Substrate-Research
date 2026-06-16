# Prior Art Demon: Documentation Overview

This document explains the underlying mechanics of the `prior_art_demon.py` search tool. It details the methodology used to query, score, and categorize potential prior art against the Fadriel Cognitive Engine IP portfolio. 

## 1. Search Methodology & Sources

The script autonomously queries three primary academic and scientific databases for each of the 27 inventions in the IP portfolio:
1.  **arXiv:** An open-access archive for scholarly articles in computer science, physics, mathematics, and quantitative biology.
2.  **Semantic Scholar:** An AI-backed search engine for academic publications that indexes millions of papers and provides rich abstract data.
3.  **OpenAlex:** An open catalog of the global research system, serving as a replacement for the currently unstable USPTO PatentsView API.

*Note: Due to API limitations with USPTO and Google Patents, direct patent searches are currently generated as URL links for manual review inside the reports.*

## 2. Threat Scoring System

To separate meaningful prior art from background noise, the script relies on a point-based relevance scoring system. It evaluates the combined text of each paper's **title** and **abstract**.

### Point Allocation
*   **Kill Terms (+3 points each):** These are highly specific terms uniquely associated with the core claims of an invention (e.g., "wave interference spatial reasoning"). Finding these strongly indicates a potential threat.
*   **Safe Terms (-1 point each):** These are known, standard industry terms (e.g., "word2vec", "transformer", "predictive coding"). If an abstract relies heavily on standard neural architectures rather than the novel wave-physics approach, the threat score is reduced to prevent false positives.
*   **Query Overlap (Up to +3 points):** The system rewards abstracts that contain multiple words from the search queries, adding up to 3 points based on the amount of overlap.

## 3. Threat Categorization Labels

Based on the total score accumulated, each result is assigned one of four threat labels. These labels dictate how the result should be handled during patent prosecution:

### 🔴 HIGH Threat (Score 9+)
*   **Meaning:** The paper contains multiple kill terms and significantly overlaps with the core mechanics of the invention.
*   **Action Required:** Must be sent to patent counsel immediately. These are the closest known prior art, and counsel must explicitly draft the patent claims to distinguish the invention from these documents.

### 🟡 MODERATE Threat (Score 5-8)
*   **Meaning:** The paper uses some similar terminology or aims for a similar goal, but likely uses a different underlying mechanism (e.g., standard neural networks instead of ZestC wave topologies).
*   **Action Required:** Read the abstract. Document exactly *how* the Fadriel architecture is different, and provide these notes to your patent counsel as part of your internal prior art analysis.

### 🟢 LOW Threat (Score 2-4)
*   **Meaning:** The paper touches on related concepts but is fundamentally distinguishable. 
*   **Action Required:** File for reference. Submitting these to the USPTO as part of an Information Disclosure Statement (IDS) shows that a thorough search was conducted and builds prosecution history goodwill, while posing little risk to the claims.

### ⚪ NOISE (Score 0-1)
*   **Meaning:** Irrelevant or standard papers caught in the crossfire of the search algorithm.
*   **Action Required:** Automatically filtered out of the detailed sections of the report. No action needed.

## 4. Continuous Monitoring

Patent databases are continuously updated. Because a paper published today could affect a patent application filed tomorrow, this script is designed to be re-run regularly:
1.  **Before filing any Provisional Patent Application.**
2.  **Before converting to a Non-Provisional Patent Application.**

The script uses a `prior_art_cache/` directory to remember papers it has already processed, ensuring that repeated runs are fast and only highlight newly published research.
