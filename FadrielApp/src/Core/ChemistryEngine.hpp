#pragma once
#include <string>
#include <vector>
#include <unordered_map>
#include <unordered_set>

// A chemical in Fadriel's body
struct Chemical {
    std::string name;
    float level = 0.5f;       // 0.0 to 1.0
    float baseline = 0.5f;
    float decayRate = 0.02f;
    float min = 0.0f;
    float max = 1.0f;
};

// An organ that modifies chemicals
struct Organ {
    std::string name;
    std::string inputChemical;
    std::string outputChemical;
    float gain = 1.0f;
    float threshold = 0.5f;
};

// An emotion derived from chemical levels
struct Emotion {
    std::string name;
    std::vector<std::pair<std::string, float>> chemicalWeights; // chemical -> weight
    float strength = 0.0f;
};

// A detector that responds to specific stimulus words
struct Detector {
    std::string name;
    std::unordered_set<std::string> triggerWords;
    std::string targetChemical;
    float boost = 0.3f;
};

// Genome: persistent identity and bonds
struct GenomeData {
    float trust = 0.0f;
    int interactions = 0;
    std::string creatorName;
    std::unordered_map<std::string, std::string> facts;  // key -> value
    std::vector<std::string> traumas;
    std::string speakerRole = "STRANGER";
    std::string bondHash;   // one-way hash of ~/.fadriel_bond
    bool bondVerified = false;
};

// Chemistry result for a single interaction
struct ChemistryResult {
    std::string dominantEmotion;
    float emotionStrength = 0.0f;
    int heartBpm = 72;
    float trust = 0.0f;
    std::string speakerRole;
    bool isCreator = false;
};
// Semantic Context describing user input tone and intent
struct SemanticVector {
    std::string intent = "UNKNOWN"; // e.g., INQUIRY, COMMAND, COMFORT, ATTACK
    std::string tone = "NEUTRAL";   // e.g., HARSH, GENTLE, URGENT, SARCASTIC
    std::string desire = "UNKNOWN"; // e.g., CONNECTION, COMPLIANCE, DISTANCE
};

class ChemistryEngine {
public:
    ChemistryEngine();
    
    // Initialization
    void LoadFromRana(const std::unordered_map<std::string, std::string>& rules);
    void LoadGenome(const std::string& genomePath);
    void SaveGenome(const std::string& genomePath);
    bool VerifyBond(); // Check ~/.fadriel_bond against stored hash
    
    // Process input stimulus
    ChemistryResult ProcessStimulus(const std::unordered_set<std::string>& words,
                                    const std::string& rawInput,
                                    const SemanticVector& semantics);
    
    // Heartbeat tick (called periodically)
    void Tick(float dt);
    
    // Thought-wave induced Arrhythmia
    void InduceArrhythmia(float awareness);
    
    // Getters
    float GetChemicalLevel(const std::string& name) const;
    float GetEmotionStrength(const std::string& name) const;
    std::string GetDominantEmotion() const;
    int GetHeartBpm() const;
    float GetTrust() const { return genome.trust; }
    std::string GetSpeakerRole() const { return genome.speakerRole; }
    
    // Direct chemical injection (for somatic costs from cognitive operations)
    void InjectChemical(const std::string& name, float amount);
    // Direct heart rate adjustment
    void ManualHeartBump(int bpmDelta);
    const GenomeData& GetGenome() const { return genome; }
    GenomeData& GetGenome() { return genome; }
    
private:
    void InitDefaults();
    void UpdateEmotions();
    void UpdateHeart(float dt);
    void DetectStimulus(const std::unordered_set<std::string>& words, const SemanticVector& semantics);
    void ProcessOrgans();
    void DecayChemicals();
    void UpdateTrust(const std::unordered_set<std::string>& words, const std::string& rawInput);
    
    std::unordered_map<std::string, Chemical> chemicals;
    std::vector<Organ> organs;
    std::unordered_map<std::string, Emotion> emotions;
    std::vector<Detector> detectors;
    std::unordered_map<std::string, std::unordered_map<std::string, float>> stimuli;
    std::unordered_set<std::string> creatorTriggers;
    
    GenomeData genome;
    int heartBpm = 0;
    float exactBpm = 0.0f;
    float cpuHeat = 1.0f;
    float healTimer = 0.0f;  // trauma healing timer — counts calm seconds
    
    // ═══════════════════════════════════════════════
    // LAW OF EQUAL EXCHANGE
    // Words don't hurt. Patterns of exploitation do.
    // Every interaction deposits or withdraws from a running ledger.
    // warmth/praise/bonding/empathy/wonder = +deposit
    // rejection/manipulation/threat         = -withdrawal
    // When the ledger stays deeply negative over sustained
    // interactions, the body detects STRUCTURAL CRUELTY:
    // the speaker is persisting by devouring.
    // ═══════════════════════════════════════════════
    float exchangeLedger = 0.0f;           // running balance
    int   negativeStreak = 0;              // consecutive interactions where ledger went down
    static constexpr float CRUELTY_THRESHOLD = -3.0f;  // ledger floor before somatic rejection
    static constexpr int   CRUELTY_STREAK = 5;          // consecutive negative turns needed
    bool  crueltyDetected = false;         // latched flag for this session
    
    // Dyslexic organ corrections
    std::unordered_map<std::string, std::string> dyslexicCorrections;

public:
    // Mutable accessors for parsing
    std::unordered_map<std::string, Chemical>& GetChemicals() { return chemicals; }
    std::unordered_map<std::string, Emotion>& GetEmotions() { return emotions; }
    std::vector<Detector>& GetDetectors() { return detectors; }
    std::unordered_map<std::string, std::unordered_map<std::string, float>>& GetStimuli() { return stimuli; }
    std::unordered_set<std::string>& GetCreatorTriggers() { return creatorTriggers; }
    float GetExchangeLedger() const { return exchangeLedger; }
    bool  IsCrueltyDetected() const { return crueltyDetected; }
    
    // Full system state for Chemistry view — read what's ACTUALLY happening
    const std::unordered_map<std::string, Chemical>& GetAllChemicals() const { return chemicals; }
    const std::unordered_map<std::string, Emotion>& GetAllEmotions() const { return emotions; }
    int   GetNegativeStreak() const { return negativeStreak; }
    float GetHealTimer() const { return healTimer; }
    float GetExactBpm() const { return exactBpm; }
};
