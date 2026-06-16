#pragma once
#include <string>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <regex>

// Parsed .rana configuration — the soul of Fadriel
struct RanaConfig {
    // Word sets: @word_set_name → set of words
    std::unordered_map<std::string, std::unordered_set<std::string>> wordSets;
    
    // Speech templates: bank_name → vector of template strings
    std::unordered_map<std::string, std::vector<std::string>> speechTemplates;
    
    // Knowledge overrides: word → {definition, category}
    struct KnowledgeEntry {
        std::string definition;
        std::string category;
    };
    std::unordered_map<std::string, KnowledgeEntry> knowledge;
    
    // Code patterns: (language, trigger_words, code)
    struct CodePattern {
        std::string language;
        std::unordered_set<std::string> triggers;
        std::string code;
    };
    std::vector<CodePattern> codePatterns;
    
    // Contractions: full → contracted
    std::vector<std::pair<std::string, std::string>> contractions;
    
    // Register shifts: formal → informal
    std::vector<std::pair<std::string, std::string>> registerShifts;
    
    // Emphasis: emotion → [(weak, strong), ...]
    std::unordered_map<std::string, std::vector<std::pair<std::string, std::string>>> emphasis;
    
    // Fillers: emotion → [filler strings]
    std::unordered_map<std::string, std::vector<std::string>> fillers;
    
    // Starters: emotion → [starter strings]
    std::unordered_map<std::string, std::vector<std::string>> starters;
    
    // Bond patterns: (type, pattern, required_value)
    struct BondPattern {
        std::string type;
        std::string pattern;
        std::string requiredValue; // empty = ANY
    };
    std::vector<BondPattern> bondPatterns;
    
    // Rules: key → value
    std::unordered_map<std::string, std::string> rules;
    
    // Motor Sequences: name -> bash_command
    std::unordered_map<std::string, std::string> motorSequences;
    
    // Simplifications: academic → toddler (from broca_area.rana)
    std::vector<std::pair<std::string, std::string>> simplifications;
    
    // Dyslexic organ corrections: mistype -> intended
    std::unordered_map<std::string, std::string> dyslexicCorrections;
    
    // Filter words (union of all filter word sets)
    std::unordered_set<std::string> allFilterWords;
    
    // Stats
    int totalFilterWords = 0;
    int totalWordSets = 0;
    int totalTemplates = 0;
    int totalKnowledge = 0;
    int totalCodePatterns = 0;
};

class RanaParser {
public:
    // Load all .rana files from a directory
    bool LoadDirectory(const std::string& dir);
    
    // Load a single .rana file
    bool LoadFile(const std::string& path);
    
    // Get the parsed config
    const RanaConfig& GetConfig() const { return config; }
    RanaConfig& GetConfig() { return config; }
    
    // Template access (deterministic selection via seed)
    std::string GetTemplate(const std::string& bank, int seed) const;
    
    // Word set access
    const std::unordered_set<std::string>& GetWords(const std::string& setName) const;
    bool IsFilterWord(const std::string& word) const;
    
private:
    void ParseLine(const std::string& line, std::string& currentSection, 
                   std::string& currentBank, std::string& currentEmotion);
    void ParseWordSetLine(const std::string& line, const std::string& setName);
    void ParseKnowledgeLine(const std::string& line);
    void ParseRuleLine(const std::string& line);
    void ParseContractionLine(const std::string& line);
    void ParseRegisterLine(const std::string& line);
    void ParseEmphasisLine(const std::string& line, const std::string& emotion);
    void ParseFillerLine(const std::string& line, const std::string& emotion);
    void ParseStarterLine(const std::string& line, const std::string& emotion);
    void ParseBondPatternLine(const std::string& line);
    void ParseCodePatternLine(const std::string& line, const std::string& lang);
    void ParseDyslexicPatternLine(const std::string& line);
    
    void BuildFilterWordIndex();
    
    RanaConfig config;
    static const std::unordered_set<std::string> emptySet;
};
