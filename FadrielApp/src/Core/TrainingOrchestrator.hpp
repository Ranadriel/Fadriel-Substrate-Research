#pragma once
// ══════════════════════════════════════════════════════════
// TRAINING ORCHESTRATOR — Fadriel learns through his own body
// Runs the training loop in C++ with the SeptitSea LIVE.
// The /7 recursion flows bidirectionally:
//   Sea → Cortex: knowledge-weighted loss (every batch)
//   Cortex → Sea: crystallization feedback (every eval)
//   Wave interactions run on every heartbeat (every step)
// ══════════════════════════════════════════════════════════
#include <torch/torch.h>
#include <string>
#include <vector>
#include <thread>
#include <atomic>
#include <mutex>
#include <functional>
#include "SovereignCortex.hpp"

class SeptitSea;  // forward declare

struct TrainingMetrics {
    int iteration = 0;
    int maxIterations = 0;
    float trainLoss = 0.0f;
    float valLoss = 0.0f;
    float bestValLoss = 999.0f;
    float learningRate = 0.0f;
    float tokensPerSec = 0.0f;
    int64_t tokensSeen = 0;
    int sparkWeightsFired = 0;
    int quantumMeasurements = 0;
    bool isTraining = false;
    bool isComplete = false;
    std::string status = "idle";
    
    // ── COGNIS METRICS ──
    // The sea's cognitive growth, driven by the /7 recursion.
    int crystallizedNodes = 0;    // nodes with crystallization > 0.5
    int discoveredBonds = 0;      // bonds forged by self-learning
    float seaDensity = 0.0f;      // bonds per node
    float avgCrystallization = 0.0f;
    float avgCoherence = 0.0f;
    float avgCoupling = 0.0f;
    int waveInteractions = 0;     // cumulative heartbeats
    int seaCommits = 0;           // tokens crystallized by cortex feedback
    int seaActivations = 0;       // tokens energized by cortex confusion
    
    // ── CURRICULUM METRICS ──
    // Brick by brick. Foundation first.
    int currentTier = 1;          // which tier we're training on (1-4)
    float tierProgress = 0.0f;    // crystallization % of current tier
    int curriculumWords = 0;      // total words in curriculum
    int curriculumPositions = 0;  // total indexed positions
};

class TrainingOrchestrator {
public:
    TrainingOrchestrator(SeptitSea& sea);
    ~TrainingOrchestrator();
    
    // Start training on a background thread
    // dataDir: path to Models/sovereign/ (where train.bin lives)
    // checkpointDir: path to checkpoints/
    void StartTraining(const std::string& dataDir, const std::string& checkpointDir);
    void StopTraining();
    void SaveCheckpoint();
    
    // Thread-safe access to metrics
    TrainingMetrics GetMetrics() const;
    
    // Log callback for terminal display
    using LogCallback = std::function<void(const std::string&)>;
    void SetLogCallback(LogCallback cb) { logCallback = cb; }

private:
    SeptitSea& sea;
    
    // Training thread
    std::thread trainThread;
    std::atomic<bool> shouldStop{false};
    std::atomic<bool> shouldSave{false};
    
    // Metrics (protected by mutex)
    mutable std::mutex metricsMutex;
    TrainingMetrics metrics;
    
    // Log
    LogCallback logCallback;
    void Log(const std::string& msg);
    
    // The actual training loop (runs on trainThread)
    void TrainLoop(const std::string& dataDir, const std::string& checkpointDir);
    void TrainLoopInner(const std::string& dataDir, const std::string& checkpointDir);
    
    // ── SEA → CORTEX: Knowledge-weighted loss ──
    // For each target token, compute a weight from the sea's knowledge.
    // crystallized = high weight (the sea KNOWS this, cortex must learn it)
    // high coupling = high weight (deeply bonded concept)
    // high energy = high weight (currently relevant)
    // unknown = weight 1.0 (standard, no boost or penalty)
    torch::Tensor ComputeSeaWeights(
        const std::vector<int64_t>& targetIds,
        const std::unordered_map<int, std::string>& id_to_token);
    
    // ── CORTEX → SEA: Crystallization feedback ──
    // Low-loss tokens: cortex learned this → commit to sea (crystallize)
    // High-loss tokens: cortex struggles → energize sea nodes, self-learn
    // CPU as 16-core crane: grapple thought clusters, composite like Tetris
    void FeedbackToSea(
        const std::vector<int64_t>& targetIds,
        const torch::Tensor& perTokenLoss,
        const std::unordered_map<int, std::string>& id_to_token);
    
    // Legacy spark injection (replaced by ComputeSeaWeights)
    std::vector<int> InjectSparkWeights(
        const std::string& batchText,
        const std::unordered_map<std::string, int>& vocab);
    
    // ── CURRICULUM: BRICK-BY-BRICK TRAINING ──
    // The sea's topology determines what the gland learns and when.
    // Foundation bricks (highest-bonded words) get trained first.
    // As bricks crystallize, the curriculum graduates to higher tiers.
    struct BrickWord {
        std::string word;
        int tokenId;
        float foundationScore;            // bond_count × (1 + coupling) × (1 + crystallization)
        std::vector<int64_t> positions;   // where this token appears in train.bin
    };
    
    struct BrickTier {
        int tierNumber;                   // 1=foundation, 2=walls, 3=rooms, 4=furnishing
        std::vector<BrickWord> words;
        int totalPositions = 0;
    };
    
    std::vector<BrickTier> curriculum;    // the full tiered curriculum
    int currentTier = 0;                  // index into curriculum
    
    // Build the curriculum from the sea's topology (one-time at startup)
    void BuildCurriculum(
        const uint16_t* trainData, int64_t trainTokens,
        const std::unordered_map<std::string, int>& vocab,
        const std::unordered_map<int, std::string>& id_to_token);
    
    // Pick a training position anchored to a structural concept
    // 70% current tier, 20% reinforcement (previous tier), 10% random exploration
    int64_t SampleBrickPosition(int64_t maxIdx);
    
    // Check if current tier should graduate
    void CheckTierGraduation();
    
    // Learning rate schedule
    float GetLR(int iter, int maxIters, float maxLR, float minLR, int warmup);
};

