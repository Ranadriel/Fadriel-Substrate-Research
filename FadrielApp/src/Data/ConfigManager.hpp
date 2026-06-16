#pragma once
#include <string>

struct AppOptions {
    int windowWidth = 1280;
    int windowHeight = 720;
    bool fullscreen = false;
    float masterVolume = 1.0f;
    bool showFPS = false;
};

class ConfigManager {
public:
    static ConfigManager& Get();
    
    void Load(const std::string& path);
    void Save();
    
    AppOptions& GetOptions() { return options; }
    void ApplyOptions(); // Synchs system state (Raylib) with JSON values

private:
    ConfigManager() = default;
    AppOptions options;
    std::string configPath;
};
