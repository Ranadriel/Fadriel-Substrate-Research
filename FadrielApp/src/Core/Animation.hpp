#pragma once
#include <raylib.h>
#include <vector>

struct AnimationFrame {
    Rectangle source;
    float duration;
};

class Animation {
public:
    Animation() : texture{0}, currentFrame(0), timer(0.0f), looping(true) {}
    
    Animation(Texture2D tex, int framesWide, int framesHigh, int row, int numFrames, float frameDuration, bool loop = true) 
        : texture(tex), currentFrame(0), timer(0.0f), looping(loop) {
        
        float frameWidth = (float)tex.width / framesWide;
        float frameHeight = (float)tex.height / framesHigh;
        
        for (int x = 0; x < numFrames; ++x) {
            frames.push_back({{x * frameWidth, row * frameHeight, frameWidth, frameHeight}, frameDuration});
        }
    }

    void Update(float dt) {
        if (frames.empty()) return;
        
        timer += dt;
        if (timer >= frames[currentFrame].duration) {
            timer = 0.0f;
            currentFrame++;
            
            if (currentFrame >= frames.size()) {
                if (looping) {
                    currentFrame = 0;
                } else {
                    currentFrame = frames.size() - 1;
                }
            }
        }
    }

    void Draw(Vector2 position, float scale = 1.0f, bool flipX = false, Color tint = WHITE) {
        if (frames.empty() || texture.id == 0) return;
        
        Rectangle source = frames[currentFrame].source;
        if (flipX) source.width = -source.width;

        Rectangle dest = { position.x, position.y, frames[currentFrame].source.width * scale, frames[currentFrame].source.height * scale };
        DrawTexturePro(texture, source, dest, {dest.width/2, dest.height/2}, 0.0f, tint);
    }

    void Reset() {
        currentFrame = 0;
        timer = 0.0f;
    }

private:
    Texture2D texture;
    std::vector<AnimationFrame> frames;
    int currentFrame;
    float timer;
    bool looping;
};
