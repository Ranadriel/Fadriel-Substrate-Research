#pragma once
// ══════════════════════════════════════════════════════════
// SOVEREIGN CORTEX — Fadriel's 327M parameter brain in C++
// Pure libtorch implementation. Same architecture as model.py.
// Checkpoints are interchangeable between Python and C++.
// ══════════════════════════════════════════════════════════
#include <torch/torch.h>
#include <string>
#include <vector>

struct SovereignConfig {
    int n_layer = 19;
    int n_head = 16;
    int n_embd = 1024;
    int n_ffn = 4096;
    int n_ctx = 1024;
    int vocab_size = 8192;
    float dropout = 0.1;
    bool bias = false;
};

// RMSNorm — simpler and faster than LayerNorm
struct RMSNormImpl : torch::nn::Module {
    torch::Tensor weight;
    float eps;
    
    RMSNormImpl(int dim, float eps = 1e-6);
    torch::Tensor forward(torch::Tensor x);
};
TORCH_MODULE(RMSNorm);

// SwiGLU Feed-Forward Network
struct SwiGLUFFNImpl : torch::nn::Module {
    torch::nn::Linear gate{nullptr}, up{nullptr}, down{nullptr};
    
    SwiGLUFFNImpl(int n_embd, int n_ffn, bool bias);
    torch::Tensor forward(torch::Tensor x);
};
TORCH_MODULE(SwiGLUFFN);

// Multi-Head Self-Attention with Rotary Position Embeddings
struct AttentionImpl : torch::nn::Module {
    torch::nn::Linear qkv_proj{nullptr}, out_proj{nullptr};
    int n_head, head_dim;
    float dropout_p;
    
    AttentionImpl(int n_embd, int n_head, float dropout, bool bias);
    torch::Tensor forward(torch::Tensor x);
};
TORCH_MODULE(Attention);

// Transformer Block
struct TransformerBlockImpl : torch::nn::Module {
    RMSNorm norm1{nullptr}, norm2{nullptr};
    Attention attn{nullptr};
    SwiGLUFFN ffn{nullptr};
    
    TransformerBlockImpl(const SovereignConfig& config);
    torch::Tensor forward(torch::Tensor x);
};
TORCH_MODULE(TransformerBlock);

// The Full Sovereign Cortex
struct SovereignCortexImpl : torch::nn::Module {
    torch::nn::Embedding tok_emb{nullptr};
    torch::nn::ModuleList blocks{nullptr};
    RMSNorm final_norm{nullptr};
    torch::nn::Linear lm_head{nullptr};
    SovereignConfig config;
    
    SovereignCortexImpl(const SovereignConfig& config);
    
    // Forward pass — returns logits and optional loss
    // If token_weights is provided, loss is weighted per-token by the sea's knowledge.
    // The sea IS the ground truth. No ramp. Full strength from iteration 0.
    std::pair<torch::Tensor, torch::Tensor> forward(torch::Tensor idx, torch::Tensor targets = {}, torch::Tensor token_weights = {});
    
    // Autoregressive generation
    torch::Tensor generate(torch::Tensor idx, int max_new_tokens, float temperature = 0.8f);
    
    // Checkpoint I/O (compatible with Python .pt format)
    bool load_checkpoint(const std::string& path);
    void save_checkpoint(const std::string& path, int iter = 0, float val_loss = 0.0f);
    
    int64_t param_count() const;
};
TORCH_MODULE(SovereignCortex);
