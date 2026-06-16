#pragma once
#include <string>
#include <vector>

#include <thread>
#include <mutex>
#include <queue>
#include <atomic>

// IPC bridge for the LLM Gland (Gemma-4 GGUF)
// Runs gemma_gland.py as a subprocess, communicates via JSON over stdin/stdout

struct GlandResponse {
    std::string action;
    std::string result;
    std::string error;
};

class GlandIPC {
public:
    GlandIPC();
    ~GlandIPC();
    
    // Boots the python process
    bool Start(const std::string& scriptPath);
    void Stop();
    
    // Core gland triggers
    void RequestSensoryFilter(const std::string& rawText);
    void RequestArticulation(const std::string& stateJson);
    void RequestHallucination(const std::string& conceptStr);
    void RequestRanaLearning(const std::string& conceptStr); // Subconscious .rana generator
    void RequestEnrich(const std::string& draft, const std::string& emotion, int bpm,
                        const std::vector<std::string>& seaFocus = {},
                        const std::vector<std::string>& workingMemory = {},
                        int traumaCount = 0, float coherence = 0.5f,
                        const std::vector<std::pair<std::string, float>>& sparkWeights = {}); // Spark weight injection
    
    // Thread-safe access to answers
    bool HasNewResponse();
    GlandResponse PopResponse();
    bool IsRunning() const { return running.load(); }
    bool IsReady() const { return ready.load(); }
    
    // Synchronous execution helpers (mostly for Optical Gland)
    bool SendRequest(const std::string& jsonMsg);
    std::string ReceiveResponse(int timeoutMs = 5000);
    
private:
    void SendJSON(const std::string& jsonMsg);
    void ReaderThread();
    void ParseLine(const std::string& line);
    
    FILE* glandIn = nullptr;   // write to gland stdin
    FILE* glandOut = nullptr;  // read from gland stdout
    pid_t glandPid = -1;
    
    std::thread readerThread;
    std::atomic<bool> running{false};
    std::atomic<bool> ready{false};
    
    std::mutex responseMutex;
    std::queue<GlandResponse> responseQueue;
};
