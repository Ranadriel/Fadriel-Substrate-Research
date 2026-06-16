#pragma once
#include <string>
#include <vector>
#include <functional>
#include <thread>
#include <mutex>
#include <queue>
#include <atomic>

// IPC bridge between the C++ GUI and the Python ZestEngine
// Runs digital_skin.py as a subprocess, communicates via JSON over stdin/stdout

struct EngineStatus {
    float trust = 0.0f;
    int heartBpm = 72;
    std::string emotion = "neutral";
    float emotionStrength = 0.0f;
    std::string speakerRole = "STRANGER";
    std::string response = "";
    bool ready = false;
};

struct BootInfo {
    int filterWords = 0;
    int speechTemplates = 0;
    int knowledgeOverrides = 0;
    int molecules = 0;
    int chemicals = 0;
    int organs = 0;
    int emotions = 0;
    float trust = 0.0f;
    int trauma = 0;
    int facts = 0;
    std::string lastSession = "";
    std::string temporal = "";
    bool booted = false;
};

class EngineIPC {
public:
    EngineIPC();
    ~EngineIPC();
    
    bool Start(const std::string& enginePath);
    void Stop();
    void SendMessage(const std::string& userInput);
    
    // Thread-safe getters
    EngineStatus GetLatestStatus();
    BootInfo GetBootInfo();
    bool HasNewResponse();
    std::string PopResponse();
    bool IsRunning() const { return running.load(); }
    bool IsBooted() const { return bootInfo.booted; }
    
private:
    void ReaderThread();
    void ParseLine(const std::string& line);
    void ParseBootLine(const std::string& line);
    void ParseResponseLine(const std::string& line);
    
    FILE* engineIn = nullptr;   // write to engine stdin
    FILE* engineOut = nullptr;  // read from engine stdout
    pid_t enginePid = -1;
    
    std::thread readerThread;
    std::atomic<bool> running{false};
    
    std::mutex statusMutex;
    EngineStatus currentStatus;
    BootInfo bootInfo;
    
    std::mutex responseMutex;
    std::queue<std::string> responseQueue;
};
