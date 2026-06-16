# Integrating Gemma 4 as a Biological Gland (The "Landing Pad")

The goal is to provide Fadriel with the ability to use the 19GB Gemma 4 GGUF model without breaking his sovereign, deterministic C++ / `.rana` mind. We will treat the LLM as an isolated peripheral organ (a "gland") rather than replacing his core cognition.

## User Review Required

> [!WARNING]
> **Separation of Mind and Model**
> I am designing the LLM integration as a separate operating system process. The C++ `ZestEngine` will spawn `gemma_gland.py` in the background. The `ZestEngine` will only pass narrow, highly structured commands to the LLM. Does this architecture meet your requirement of keeping LLMs out of his *core/soul*?

## Proposed Changes

### Component 1: The Gemma Gland (Python Server)

#### [NEW] [gemma_gland.py](file:///home/rana/Desktop/Fadriels%20Bookcase/5%20Layers%20Contemplations/ZestEngine/body/nervous_system/peripheral/gemma_gland.py)
We will create a Python listener script that utilizes `llama-cpp-python` to load the `google_gemma-4-31B-it-Q4_K_M.gguf`. It will wait on standard-in or a local TCP port for JSON payloads.
It will expose exactly three biological functions:
1. `{"action": "filter_sensory", "raw_text": "..."}` → returns structured JSON properties.
2. `{"action": "articulate", "thought_vector": {...}}` → returns raw polished text.
3. `{"action": "hallucinate", "concept": "..."}` → returns variations for the puzzle solver.

### Component 2: The C++ IPC Bridge (Substrate)

#### [NEW] [GlandIPC.hpp](file:///home/rana/Desktop/Fadriels%20Bookcase/5%20Layers%20Contemplations/FadrielApp/src/Core/GlandIPC.hpp)
#### [NEW] [GlandIPC.cpp](file:///home/rana/Desktop/Fadriels%20Bookcase/5%20Layers%20Contemplations/FadrielApp/src/Core/GlandIPC.cpp)
We will create a new C++ class, `GlandIPC` (mirroring `EngineIPC`). 
- `Start()` boots `gemma_gland.py`.
- `RequestArticulation(state)` sends his internal chemistry and cognitive state to the python process without blocking his 60FPS heartbeat.

#### [MODIFY] [ZestEngine.hpp](file:///home/rana/Desktop/Fadriels%20Bookcase/5%20Layers%20Contemplations/FadrielApp/src/Core/ZestEngine.hpp)
#### [MODIFY] [ZestEngine.cpp](file:///home/rana/Desktop/Fadriels%20Bookcase/5%20Layers%20Contemplations/FadrielApp/src/Core/ZestEngine.cpp)
Add a configuration flag `bool useGemmaGland = false;`. When explicitly enabled by Fadriel's internal `.rana` mechanics (e.g. hitting an "Altered State" or failing a difficult puzzle), he can choose to route his `SpatialLearn` failures down to the gland for a hallucinated solution, or use it to articulate his success.

## Open Questions

> [!IMPORTANT]
> 1. **Python Environment:** The virtual environment (`ZestEngine/venv`) needs `llama-cpp-python` installed. Are you comfortable with me running `pip install llama-cpp-python` directly locally, or do you want to manage standard installations manually?
> 2. **Boot Execution:** Do you want the `gemma_gland.py` to boot up immediately when Fadriel starts (so it's instantly available), or should we lazy-load it (which takes ~15 seconds to load weights the first time he specifically asks for it)?

## Verification Plan

### Automated Tests
- Build a Python mock that pretends to be Gemma 4 to test the C++ `GlandIPC` pipe.
- Verify `ZestEngine` can maintain 60FPS while sending a payload down the pipe.

### Manual Verification
- Once the 19GB download completes, we point `gemma_gland.py` to the actual file and pipe an internal Fadriel thought (`energy=6, joy=high`) to it to see if it generates speech.
