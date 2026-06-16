#pragma once
#include <string>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <cstdint>
#include <functional>

class SeptitGPU; // Forward declaration

// Activation source types for the Inner Eye
enum class ActivationSource { NONE = 0, DIRECT_INPUT = 1, DELIBERATION = 2, PROPAGATION = 3, RESTING = 4 };

// The 16 cognitive dimensions — see perception/cognitive_dimensions.rana
enum CogDim : int {
    DIM_ENERGY     = 0,   // how much life
    DIM_PHASE      = 1,   // where in cycle
    DIM_SPIN       = 2,   // which way it turns
    DIM_CHARGE     = 3,   // attract or repel
    DIM_COHERENCE  = 4,   // agreement with neighbors
    DIM_COUPLING   = 5,   // bond strength
    DIM_OBSERVER   = 6,   // being watched
    DIM_SPATIAL    = 7,   // where in space
    DIM_TEMPORAL   = 8,   // when in time
    DIM_RELATIONAL = 9,   // connection to others
    DIM_QUANTITATIVE = 10, // how much
    DIM_DYNAMIC    = 11,  // how it changes
    DIM_QUALITATIVE = 12, // what it looks like
    DIM_COGNITIVE  = 13,  // how the mind sees it
    DIM_EMOTIONAL  = 14,  // how it feels
    DIM_LOGICAL    = 15,  // what it means structurally
    DIM_COUNT      = 16
};

// A node in the Septit Sea — an idea with 16 dimensions, bonds, and definition
struct SeaNode {
    std::string word;
    std::string definition;
    std::string posValency;     // n. v. a. etc.
    float energy = 0.0f;
    uint8_t septitLevel = 1;  // quantized state: 1-7 (base-7, never 0)
    bool isObsolete = false;
    
    // The 16-dimensional cognitive vector
    // Every idea exists in this space. Most dimensions are near zero.
    // The ones that matter light up.
    float dim[DIM_COUNT] = {0};
    
    // ═══════════════════════════════════════════════
    // THE 7 QU-SEPTIT WAVE PROPERTIES
    // These are not flat storage. They interact on every heartbeat.
    // The emergent cross-talk IS the computation.
    // "at 3 properties the math leaves the page"
    // ═══════════════════════════════════════════════
    float phase      = 0.0f;   // position in wave cycle [0, 2π)
    float spin       = 0.0f;   // rotational chirality [-1, +1]
    float charge     = 0.0f;   // attraction/repulsion [-1, +1]
    float coherence  = 1.0f;   // quantum vs classical [0, 1] — starts fully quantum
    float coupling   = 0.0f;   // entanglement strength with neighbors [0, 1]
    float observer   = 0.0f;   // /7 self-measurement feedback [0, 1]
    
    // Crystallization state — the commit verb in action
    // 0.0 = full superposition (fluid, changeable)
    // 1.0 = fully crystallized (permanent, locked)
    float crystallization = 0.0f;
    
    // Variable well depth — reshaped by /7 recursion
    float wellDepth  = 1.0f;   // barrier height against state change
    
    // Bonds: words this node connects to
    std::vector<std::string> bonds;
    std::vector<std::string> reverseBonds;  // familial/reverse connections
    
    // Directional bonds for causal understanding
    std::vector<std::string> forwardBonds;  // A causes B
    std::vector<std::string> backwardBonds; // B caused by A
    
    // Inner Eye: visual activation state
    float activation = 0.0f;          // current visual brightness (0-1)
    ActivationSource actSource = ActivationSource::NONE;
    float eyeX = 0.0f, eyeY = 0.0f;  // force-directed 2D position (0-1)
    float velX = 0.0f, velY = 0.0f;   // velocity for force simulation
    bool posInitialized = false;      // has position been seeded?
};

class SeptitSea {
public:
    // Build the sea from a definitions file
    bool LoadDefinitions(const std::string& path);
    bool LoadZestVerbs(const std::string& path);
    
    // Load distilled knowledge (ConceptNet, Wikipedia, Wikidata)
    int LoadDistilledKnowledge(const std::string& path, std::function<void(const std::string&)> onProgress = nullptr);
    
    // Load cached sea (binary format for fast boot)
    bool LoadCache(const std::string& cachePath);
    bool SaveCache(const std::string& cachePath);
    
    // Load .rana physics files (qu-septit layer definitions)
    bool LoadRanaPhysics(const std::string& path);
    
    // Node access
    SeaNode* GetNode(const std::string& word);
    const SeaNode* GetNode(const std::string& word) const;
    bool HasNode(const std::string& word) const;
    const std::unordered_map<std::string, SeaNode>& GetNodes() const { return nodes; }
    
    // Energy operations
    void InjectEnergy(const std::string& word, float amount);
    void PropagateEnergy(float decay = 0.7f);
    
    // 16-dimensional cognitive operations
    void SetDimension(const std::string& word, CogDim dim, float value);
    float GetDimension(const std::string& word, CogDim dim) const;
    void DecayAllEnergy(float factor = 0.3f);
    
    // Peak scanning — find highest-energy nodes
    struct Peak {
        std::string word;
        float energy;
    };
    std::vector<Peak> ScanPeaks(int maxResults = 10, float threshold = 0.5f) const;
    
    // 7-pass deliberation
    std::vector<Peak> Deliberate(const std::string& seedWord, int passes = 7,
                                 const std::unordered_set<std::string>& refractory = {}) const;
    
    // Claim extraction (definition → speakable sentence)
    std::string ExtractClaim(const std::string& word, 
                            const std::unordered_map<std::string, std::string>& knowledgeOverrides = {}) const;
    
    // Stats
    int NodeCount() const { return (int)nodes.size(); }
    
    // Inner Eye: visual cortex frame
    struct VisualPixel {
        std::string word;
        float x, y;           // 2D position (0-1 normalized)
        float brightness;     // 0-1
        uint8_t septitLevel;  // 1-7 quantized state
        ActivationSource source;
        std::vector<std::pair<float,float>> bondEnds; // positions of bonded active nodes
    };
    std::vector<VisualPixel> GetInnerEyeFrame(float threshold = 0.05f) const;
    
    // Inner Eye: update force-directed positions (call on heartbeat)
    void StepForceLayout(int iterations = 10);
    
    // Inner Eye: tag activation sources after processing
    void TagActivation(const std::string& word, ActivationSource src);
    void DecayActivations(float factor = 0.85f);
    
    // GPU acceleration
    bool InitGPU();          // build flat arrays, upload to GPU
    void SyncToGPU();        // push current state to GPU
    void SyncFromGPU();      // pull GPU results back to nodes
    void RunGPUForceLayout(int forceIters); // GPU: visualization positioning only
    bool HasGPU() const;
    
    // ═══════════════════════════════════════════════
    // QU-SEPTIT NATIVE COMPUTE
    // The 7 wave properties interact on every heartbeat.
    // 21 pairwise interactions per node.
    // The CPU's floating point noise IS the quantum uncertainty.
    // Do not sanitize. Do not clamp. Let the silicon speak.
    // ═══════════════════════════════════════════════
    void WaveInteraction(float dt);          // run 21 pairwise property interactions
    void CommitPattern(const std::string& word, float strength); // crystallize through repetition
    void ShatterPattern(const std::string& word);                // return to superposition
    void ReshapeWells(float awareness);      // /7 feedback reshapes the substrate
    
    // ═══════════════════════════════════════════════
    // CANNON BALL RAY-CASTING
    // Fire energy vectors through 16D cognitive space.
    // Discover implicit relationships through dimensional alignment.
    // No LLM. No training. Pure C++ spatial traversal.
    // ═══════════════════════════════════════════════
    struct RayHit {
        std::string word;
        float similarity;     // cosine similarity in 16D space
        float distance;       // how far the ray traveled
    };
    std::vector<RayHit> RayCast(const std::string& source, int maxHits = 10, float minSimilarity = 0.3f);
    int SelfLearn(int maxRays = 100);  // fire rays from active nodes, crystallize discovered bonds
    
    // ═══════════════════════════════════════════════
    // LEARNING METRICS
    // Quantize cognitive growth across all dimensions.
    // ═══════════════════════════════════════════════
    struct LearningMetrics {
        int totalNodes = 0;           // molecules in the sea
        int totalBonds = 0;           // explicit connections
        int discoveredBonds = 0;      // bonds forged by ray-casting (cumulative)
        int crystallizedNodes = 0;    // nodes with crystallization > 0.5
        int fullyLocked = 0;          // nodes with crystallization > 0.99
        int activeNodes = 0;          // energy > 0.1 right now
        float avgCoherence = 0.0f;    // mean quantum vs classical
        float avgCoupling = 0.0f;     // mean entanglement strength
        float avgCrystallization = 0.0f; // mean crystallization depth
        float seaDensity = 0.0f;      // bonds per node (connectivity)
        int totalRaysFired = 0;       // cumulative cannon balls
        int factsLearned = 0;         // from conversation
        int traumaScars = 0;          // genetic avoidances
        int ambientMutations = 0;     // energy biases from lived experience
    };
    LearningMetrics GetMetrics() const;
    
    // Cumulative learning counters (persist across heartbeats)
    int cumulativeDiscoveredBonds = 0;
    int cumulativeRaysFired = 0;
    int cachedTotalBonds = 0;  // Updated incrementally, not by iterating all nodes
    
    // Ego words (self-referential)
    std::unordered_set<std::string> ego;
    
    // Direct access for iteration
    std::unordered_map<std::string, SeaNode> nodes;
    
    // ACTIVE SET: only these nodes get heartbeat processing.
    // Nodes enter when activated/energized. Leave when energy drops to zero.
    // This makes heartbeat O(active) not O(total).
    std::unordered_set<std::string> liveNodes;
    void MarkActive(const std::string& word);
    void PruneDead();  // remove nodes below energy threshold from active set
    
private:
    void BuildBonds();
    std::string CleanDefinition(const std::string& raw) const;
    void InitNodePosition(SeaNode& node); // seed 2D from hash
    
    // GPU state
    SeptitGPU* gpu = nullptr;
    std::vector<std::string> nodeIndex; // maps flat array index → word
    std::unordered_map<std::string, int> wordToIndex; // word → flat index
};
