#pragma once
#include <string>
#include <vector>
#include <unordered_map>
#include <nlohmann/json.hpp>

// Core Pathfinder Definitions Loaded Iteratively
enum class Proficiency {
    Untrained = 0,
    Trained = 2,
    Expert = 4,
    Master = 6,
    Legendary = 8
};

struct CharacterClass {
    std::string id;
    std::string name;
    int hitDie;
    std::string keyAbility;
    std::unordered_map<std::string, Proficiency> initialProficiencies;
    std::string description;
    std::string spritePath;
    std::string portraitPath;
};

class Database {
public:
    static Database& Get();

    bool Initialize(const std::string& configDirectory);
    
    // Immutable Readers
    const CharacterClass* GetClass(const std::string& id) const;
    const std::vector<CharacterClass>& GetAllClasses() const;

private:
    Database() = default;
    
    bool LoadClasses(const std::string& path);

    std::unordered_map<std::string, CharacterClass> classesMap;
    std::vector<CharacterClass> classesList;
};
