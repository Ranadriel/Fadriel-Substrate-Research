#pragma once
#include <cstdint>
#include <vector>
#include <string>

// GPU-side flat data for the Septit Sea
// Mirrors SeaNode data in parallel arrays for GPU computation
struct SeptitGPUData {
    int nodeCount = 0;
    
    // Per-node arrays (indexed by node ID)
    float* d_energy = nullptr;
    float* d_activation = nullptr;
    float* d_posX = nullptr;
    float* d_posY = nullptr;
    float* d_velX = nullptr;
    float* d_velY = nullptr;
    uint8_t* d_septitLevel = nullptr;  // 1-7 quantized state
    int* d_actSource = nullptr;        // ActivationSource enum
    
    // Bond adjacency (CSR format for sparse graph)
    int* d_bondOffsets = nullptr;   // nodeCount+1: start index per node
    int* d_bondTargets = nullptr;   // total bonds: target node indices
    int totalBonds = 0;
};

class SeptitGPU {
public:
    SeptitGPU() = default;
    ~SeptitGPU();
    
    // Initialize GPU memory and upload sea data (7-property wave interface)
    bool Init(int nodeCount, const float* energy, const float* activation,
              const float* posX, const float* posY,
              const float* velX, const float* velY,
              const uint8_t* septitLevels, const int* actSources,
              const float* phase, const float* spin, const float* charge,
              const float* coherence, const float* coupling, const float* observer,
              const float* crystal, const float* wellDepth,
              const int* bondOffsets, const int* bondTargets, int totalBonds);

    // Run all heartbeat kernels in sequence
    void RunForceLayoutOnly(int forceIterations); // GPU only does spatial layout
    void RunPulse(float dt);                       // Wave interaction tick

    // Upload/download specific arrays
    void UploadEnergy(const float* energy, int count);
    void UploadActivation(const float* activation, const int* sources, int count);
    void UploadWave(const float* phase, const float* spin, const float* charge,
                   const float* coherence, const float* coupling, const float* observer,
                   const float* crystal, const float* wellDepth, int count);
    void DownloadPositions(float* posX, float* posY, int count);
    void DownloadEnergy(float* energy, int count);
    void DownloadActivation(float* activation, int count);
    void DownloadSeptitLevels(uint8_t* levels, int count);
    void DownloadWave(float* phase, float* spin, float* charge,
                     float* coherence, float* coupling, float* observer,
                     float* crystal, float* wellDepth, int count);
    
    bool IsReady() const { return initialized; }
    
private:
    SeptitGPUData data;
    bool initialized = false;
    void Cleanup();
};
