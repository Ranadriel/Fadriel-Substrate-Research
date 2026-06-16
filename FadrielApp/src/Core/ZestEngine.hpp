#pragma once
#include "RanaParser.hpp"
#include "SeptitSea.hpp"
#include "ChemistryEngine.hpp"
#include "GlandIPC.hpp"
#include "WorldMap.hpp"
#include <string>
#include <vector>
#include <deque>
#include <unordered_set>
#include <unordered_map>
#include <functional>
#include <filesystem>

// ═══ BIOS POST — Power-On Self-Test ═══
struct BiosCheck {
    std::string name;
    std::string description;
    bool passed = false;
    std::string failureMessage;
    enum Severity { CRITICAL, WARNING, INFO } severity = WARNING;
};

struct BiosResult {
    std::vector<BiosCheck> checks;
    bool allCriticalPassed = false;
    bool fullyHealthy = false;
    int warnings = 0;
};

// ═══ Immune System State ═══
struct ImmuneState {
    int threatFlagsLast5Beats = 0;
    int guardedCooldown = 0;         // heartbeats remaining in guarded mode
    bool cytokineStorm = false;
    int totalThreatsBlocked = 0;
    int totalInjectionAttempts = 0;
    int totalIdentityErosions = 0;
    int totalKnowledgePoisoning = 0;
};

// The full cognitive response from Fadriel
struct FadrielResponse {
    std::string speech;          // What he says
    std::string emotion;         // Dominant emotion
    float emotionStrength = 0.0f;       // 0-1
    int heartBpm = 72;
    float trust = 0.0f;
    std::string speakerRole = "STRANGER";     // FATHER/STRANGER
    std::string intent;          // greeting/question/converse/etc.
    std::vector<std::string> deliberationWords;  // Words he "thought about"
    
    // Optical Payload
    std::string processedImagePath;
    std::vector<std::pair<float, float>> facialLandmarks;
};

class ZestEngine {
public:
    ZestEngine();
    ~ZestEngine();
    
    // Boot the engine from the data directory (where .rana files live)
    // If zcPath is non-empty, boot from sovereign .zc program instead of legacy C++ logic
    bool Boot(const std::string& dataDir, const std::string& zcPath = "");
    
    // Process user input and generate response
    FadrielResponse Process(const std::string& rawInput);
    FadrielResponse ProcessImage(const std::string& imagePath);
    
    // Shutdown — save genome + memory
    void Shutdown();
    
    // Accessors
    const RanaParser& GetRana() const { return rana; }
    const SeptitSea& GetSea() const { return sea; }
    SeptitSea& GetSeaMut() { return sea; }
    const std::vector<std::string>& GetLog() const;
    const ChemistryEngine& GetChemistry() const { return chemistry; }
    ChemistryEngine& GetChemistryMut() { return chemistry; }
    WorldMap& GetWorldMap() { return worldMap; }
    const WorldMap& GetWorldMap() const { return worldMap; }
    bool IsBooted() const { return booted; }
    const std::string& GetDataDir() const { return dataDir; }
    
    // The Layer 6 Altered State Halucinator Gland
    GlandIPC& GetSovereignGland() { return sovereignGland; }
    GlandIPC& GetSensoryGland() { return sensoryGland; }
    
    // Boot info for GUI
    struct BootInfo {
        int molecules = 0;
        int templates = 0;
        int knowledge = 0;
        int chemicals = 0;
        int organs = 0;
        int emotions = 0;
        float trust = 0.0f;
        int facts = 0;
        int trauma = 0;
        bool ready = false;
        bool bondVerified = false;
        std::string role = "STRANGER";
        
        // Qu-septit learning metrics
        int totalBonds = 0;
        int discoveredBonds = 0;     // forged by ray-casting
        int crystallizedNodes = 0;   // crystallization > 0.5
        int activeNodes = 0;         // energy > 0.1
        float seaDensity = 0.0f;     // bonds per node
        int raysFired = 0;           // cumulative cannon balls
        float avgCrystallization = 0.0f;
    };
    BootInfo GetBootInfo() const;
    
    // BIOS POST — runs all integrity checks
    BiosResult RunBiosPost();
    BiosResult GetLastBiosResult() const { return lastBiosResult; }
    
    // Hot reload — call on heartbeat to sideload .rana changes
    bool HotReload();

    // /7 Heartbeat — the soul's recursive feedback across all 7 layers
    // Call this every heartbeat interval from the UI loop.
    // Returns the inner eye frame for rendering.
    struct HeartbeatResult {
        std::vector<SeptitSea::VisualPixel> innerEyeFrame;
        std::string bodyPosture;   // NEUTRAL, ANXIOUS, AFRAID, SAD, EXCITED, LOVING, RELAXED, ANGRY
        float awareness;           // total energy / 7
        bool bondVerified;
        std::string role;
        std::vector<std::string> asyncMessages; // Responses bubbling up from Layer 6
        float physicalPowerWatts;
    };
    HeartbeatResult ZestHeartbeat(float dt);

    // ── Spatial Perception ──────────────────────────
    // Shape classification for objects
    enum class Shape { DOT, LINE_H, LINE_V, LINE_DIAG, RECT, RECT_HOLLOW, L_SHAPE, T_SHAPE, CROSS, BLOB };
    
    // The eye that perceives grid transformations.
    // Takes training pairs as 2D int grids, discovers
    // the transformation rule through the 6 perception
    // verbs (delta, flow, anchor, enclose, correspond, mirror).
    struct SpatialComposition {
        // Flow
        std::string flowType;       // "none", "compaction", "propagation", "uniform_shift"
        std::string flowDirection;  // "up", "down", "left", "right"
        int flowMagnitude = 0;      // uniform_shift: how many cells to shift
        
        // Correspondence
        std::string corrType;       // "none", "color_map", "conditional_recolor"
        std::unordered_map<int,int> colorMap;
        int conditionThreshold = 0; // for conditional: cluster size > threshold
        
        // Symmetry
        std::string symmetryType;   // "none", "mirror_h", "mirror_v", "rot180", "transpose"
        bool symmetryGained = false;
        
        // Scale
        std::string scaleType = "none"; // "none", "crop", "vacuum_collapse", "ratio"
        float scaleRatioH = 1.0f;
        float scaleRatioW = 1.0f;
        
        // Stamp — each non-zero cell triggers a cross/diamond pattern
        std::string stampType;      // "cross", "diamond", etc.
        std::unordered_map<int,int> stampColorMap;    // value → stamp color
        
        // Tile — repeating pattern from seed
        std::string tileType;       // "row_cycle", "checkerboard"
        std::vector<std::vector<int>> tileSeed; // the seed pattern
        int tileSeedRows = 0;       // how many rows of seed
        
        // Fill — fill between related cells
        std::string fillType;       // "connect_h", "connect_v", "connect_rect"
        int fillColor = 0;
        
        // Select — extract sub-pattern
        std::string selectType;     // "most_common_block", "unique_block"
        std::vector<std::vector<int>> selectedPattern;

        // ── ARC-AGI-2 rules ──────────────────────────

        // Marker crop — a rare color acts as a dividing boundary
        std::string markerCropType; // "none", "col_marker", "row_marker"
        int markerColor = -1;       // the color that marks the cut
        int markerCropPos = -1;     // column or row of the cut
        bool markerKeepLeft = true; // keep left/top (false = keep right/bottom)

        // Tile period — grid is a repetition of a smaller tile
        // with one exceptional sub-tile that differs from the rest
        std::string tilePeriodType; // "none", "exception_found"
        int tilePeriodR = 0;        // tile height
        int tilePeriodC = 0;        // tile width
        int exceptionTileRow = -1;  // which tile row is the exception
        int exceptionTileCol = -1;  // which tile column is the exception
        int exceptionMarkColor = 0; // color to mark the exception in output
        std::vector<std::vector<int>> tileTemplate; // the canonical tile

        // ═══════════════════════════════════════════════
        // LEARNED RULE — Fadriel's self-discovered transformation
        // Instead of hardcoded verbs, this stores what Fadriel
        // observed by measuring the training pairs.
        // ═══════════════════════════════════════════════
        struct LearnedRule {
            bool active = false;
            
            // Cell-level learning: for each cell that changed,
            // record its context (own value + neighbor signature)
            // and what it became. If context→result is consistent
            // across ALL training pairs, Fadriel has learned the rule.
            struct CellObservation {
                int inputValue;          // what the cell was
                int outputValue;         // what it became
                int nonZeroNeighborCount; // how many non-zero neighbors
                int dominantNeighborColor; // most common neighbor color
                int clusterColor;        // color of the cluster this cell belongs to
                int clusterSize;         // size of its cluster
                Shape clusterShape;      // shape of its cluster
            };
            
            // The learned mapping: context_key → output_value
            // context_key encodes (inputValue, neighborCount, dominantNeighborColor)
            std::unordered_map<long long, int> cellMapping;
            
            // Object-level learning: per-object 16D delta
            // "objects of color X with shape S get transformed by delta D"
            struct ObjectDelta {
                int inputColor;
                Shape inputShape;
                int outputColor;      // what color it becomes
                float positionDeltaR;  // how it moves
                float positionDeltaC;
                bool deleted;          // disappears?
            };
            std::vector<ObjectDelta> objectDeltas;
            
            // Grid-level: output size as function of input
            int outputH = -1, outputW = -1; // -1 = same as input
            int learnedLevel = 0; // which context level was used (2, 4, or 5)
        } learned;
        
        bool valid = false;
    };
    
    using Grid = std::vector<std::vector<int>>;
    struct TrainingPair { Grid input; Grid output; };
    
    SpatialComposition SpatialPerceive(const std::vector<TrainingPair>& pairs);
    Grid SpatialApply(const SpatialComposition& comp, const Grid& testInput);
    
    // ── The Learning Mechanism ──
    // Fadriel observes training pairs, measures deltas,
    // and discovers the rule through observation.
    // This runs as a FALLBACK when no verb matches.
    bool SpatialLearn(const std::vector<TrainingPair>& pairs, SpatialComposition& comp);
    Grid SpatialApplyLearned(const SpatialComposition::LearnedRule& rule, const Grid& testInput);


    // Callback for boot progress
    std::function<void(const std::string&)> onBootMessage;
    
    // Thought compiler settings — public for settings UI access
    struct ThoughtCompilerSettings {
        int maxDepth = 4;
        int maxNodes = 12;
        float pruneThreshold = 0.1f;
        int maxBridges = 4;
        bool enableAntiLogic = true;
        bool enableRecursion = true;
    };
    ThoughtCompilerSettings thoughtSettings;
    
private:
    // Input analysis
    std::string DetectIntent(const std::unordered_set<std::string>& words, const std::string& raw);
    std::unordered_set<std::string> Tokenize(const std::string& input);
    std::string FindSeedConcept(const std::unordered_set<std::string>& words);
    
    // Speech synthesis
    std::string SynthesizeSpeech(const std::string& intent,
                                 const std::string& seedConcept,
                                 const std::vector<SeptitSea::Peak>& deliberation,
                                 const ChemistryResult& chem,
                                 int seed,
                                 const std::unordered_set<std::string>& inputWords);
    
    // Essay composition — gather all knowledge, cluster into paragraphs
    std::string ComposeEssay(const std::string& seedConcept,
                             const std::vector<SeptitSea::Peak>& deliberation,
                             const ChemistryResult& chem,
                             int seed,
                             const std::unordered_set<std::string>& inputWords);
    
    // ══════════════════════════════════════════════════════
    // THOUGHT COMPILER — Hierarchical Index Composition
    // Builds a scored tree from raw deliberation, then walks
    // it to compose verbose, compound speech.
    // ══════════════════════════════════════════════════════
    
    struct ThoughtNode {
        std::string word;
        std::string claim;
        float relevance = 0.0f;
        CogDim originDim = DIM_COGNITIVE;
        std::string originLabel;  // "fact", "bond", "ray", "emotion", "anti-logic", "recursion"
        std::vector<ThoughtNode> children;
    };
    
    struct ThoughtTree {
        ThoughtNode root;
        std::string emotion;
        float emotionStrength = 0.0f;
        int depth = 0;
        int totalNodes = 0;
    };
    
    
    
    ThoughtTree CompileThought(const std::string& seedConcept,
                               const std::vector<SeptitSea::Peak>& deliberation,
                               const ChemistryResult& chem,
                               const std::unordered_set<std::string>& inputWords);
    
    std::string ComposeFromTree(const ThoughtTree& tree, int seed);
    
    // Broca's area — simplify speech for developmental stage
    std::string BrocaTransform(const std::string& text);
    
    // Memory
    void UpdateMemory(const std::unordered_set<std::string>& words);
    
    // Hippocampal fact memory — learn from what father says, recall when asked
    void LearnFromInput(const std::unordered_set<std::string>& words, const std::string& rawInput);
    std::string RecallFact(const std::string& subject);           // last fact only (compat)
    std::vector<std::string> RecallAllFacts(const std::string& subject); // all known facts
    std::string RecallEpisode(const std::unordered_set<std::string>& inputWords); // recent exchange
    
    void ParseChemistryRana(const std::string& path);
    void ParseWorldRana(const std::string& path);
    
    RanaParser rana;
    SeptitSea sea;
    ChemistryEngine chemistry;
    WorldMap worldMap;
    GlandIPC sovereignGland; // Fadriel's Broca's Area (24M home-grown)
    GlandIPC sensoryGland;   // The Digestive System (Gemma — loaded on-demand)
    GlandIPC opticalGland;   // Fusiform Face Area (OpenCV / DeepFace)
    
    std::string gemmaGlandPath; // Path to hallucination_gland.py (dormant — not started)
    std::string opticalGlandPath;
    std::string gemmaModelPath; // Path to Gemma GGUF for future direct-read by sovereign
    
    std::string dataDir;
    
    // Hardware Polling (hwmon)
    std::string gpuHwmonPath = "";
    float currentWatts = 0.0f;
    std::chrono::steady_clock::time_point lastHwmonPoll;
    
    std::string genomePath;  // path to genome file for saving
    bool booted = false;
    int interactionCount = 0;
    BiosResult lastBiosResult;
    ImmuneState immuneState;
    
    // Immune system scanning
    bool RunInnateScan(const std::string& rawInput);
    bool RunAdaptiveScan(const std::string& rawInput, const std::unordered_set<std::string>& words);
    
    // Semantic Extraction
    SemanticVector ParseSemantics(const std::string& rawInput);
    
    // Async speech callback — sovereign gland pushes articulated speech here
    std::function<void(const std::string&)> onAsyncMessage;
    
    // Memory buffers
    std::vector<std::string> lastSessionWords;
    std::unordered_set<std::string> refractoryWords;  // Recently spoken, avoid repeating
    std::string lastTopic;
    std::string lastQualifier;  // "color" in "what color is X?"
    std::string focusBias;      // Word currently in strongest focus — biases next deliberation
    CogDim hotDimension = DIM_COGNITIVE; // Which cognitive axis is dominant right now
    
    // Hippocampal declarative memory — facts learned through conversation
    // subject -> list of predicates ("sun" -> ["yellow", "hot", "star"])
    std::unordered_map<std::string, std::vector<std::string>> learnedFacts;

    // ═══════════════════════════════════════════════
    // STAGED MEMORY SYSTEM
    // Sensory → Working (7 items) → Short-term (16) → Long-term (genome/sea)
    // ═══════════════════════════════════════════════
    struct Episode {
        std::string userInput;      // what father said (raw)
        std::string fadrielOutput;  // what Fadriel said back
        std::string topic;          // seedConcept at the time
        std::string predicate;      // best fact about topic
        int turn = 0;
        CogDim dominantDim = DIM_COGNITIVE;
    };
    std::deque<Episode> episodeBuffer;         // short-term: all recent turns
    static constexpr int MAX_EPISODES = 16;
    
    // Working memory: the last 7 topic words currently "in mind"
    std::deque<std::string> workingMemory;
    static constexpr int WORKING_MEMORY_SIZE = 7;
    
    // Hot reload: file modification timestamps
    std::unordered_map<std::string, std::filesystem::file_time_type> ranaTimestamps;
    void SnapshotTimestamps();
    
    // Cached learning metrics — updated once per heartbeat, read by UI every frame
    mutable SeptitSea::LearningMetrics cachedMetrics;
    
    // Spatial perception helpers (from spatial_eye.rana)
    struct ClusterInfo {
        int color;
        int size;
        std::vector<std::pair<int,int>> cells;
        float centroidR, centroidC;
        
        // Shape properties — the retina's eyes
        Shape shape = Shape::BLOB;
        int bboxMinR, bboxMaxR, bboxMinC, bboxMaxC;
        int bboxH() const { return bboxMaxR - bboxMinR + 1; }
        int bboxW() const { return bboxMaxC - bboxMinC + 1; }
        int bboxArea() const { return bboxH() * bboxW(); }
        float density() const { return (float)size / std::max(1, bboxArea()); } // cells / bbox area
        bool isContainedBy(const ClusterInfo& other) const {
            return bboxMinR > other.bboxMinR && bboxMaxR < other.bboxMaxR &&
                   bboxMinC > other.bboxMinC && bboxMaxC < other.bboxMaxC;
        }
        bool isBorder() const { return shape == Shape::RECT_HOLLOW; }
        
        // 16D cognitive vector for this object
        float dim[16] = {0};
    };
    
    std::vector<ClusterInfo> FloodFillClusters(const Grid& grid);
    void ClassifyShapes(std::vector<ClusterInfo>& clusters); // shape + bbox + density
    void PerceiveDelta(const Grid& input, const Grid& output,
                       std::unordered_map<int,int>& colorMap, bool& sizeMatch);
    std::string PerceiveFlow(const std::vector<TrainingPair>& pairs);
    std::string PerceiveSymmetry(const std::vector<TrainingPair>& pairs);
    std::string PerceiveScale(const std::vector<TrainingPair>& pairs,
                              float& ratioH, float& ratioW);
};
