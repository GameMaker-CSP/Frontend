---
toc: false
layout: post
title: UESL Accessibility Game Engine
description: An interactive, fully accessible canvas game built for students with Intellectual and Developmental Disabilities (IDDs). Customizable controls, visuals, audio, and difficulty — powered by the UESL Game Engine.
permalink: /capstone/uesl-game/
sticky_rank: 7
---

## UESL Accessibility Arena

This game was designed with the UESL Game Engine to support students with Intellectual and Developmental Disabilities (IDDs). Every aspect of the game can be tuned by an instructor or caregiver to meet each student's individual needs.

---

### Accessibility Features

#### 1. Simplified Controls
- **Arrow Keys / WASD** — standard four-directional movement.
- **Single-Button Mode** — press `SPACE` to cycle through directions (Right → Down → Left → Up), then hold `ENTER` to move. Reduces required inputs to just two keys for students with motor difficulties.
- **Slow Mode** — halves the game speed, giving students more time to react and plan movements.

#### 2. Visual & Sensory Adjustments
- **High-Contrast Mode** — switches to a pure black background with bright yellow (player/stars) and white (barriers) for students with visual processing difficulties.
- **Large Sprites** — enlarges the player, NPCs, and stars so they are easier to distinguish on screen.
- **Reduce Motion** — removes particle effects and screen-flash animations that may overwhelm students with sensory sensitivities.

#### 3. Simplified Game Objectives
- **Barriers** have built-in **colored borders and directional arrow labels** (→ ↓ ↑) to clearly guide the player through the level.
- **NPC patrol paths** are short, linear, and fully predictable — no erratic or random movement.
- **Guided Mode** — draws a dashed arrow from the player directly toward the nearest uncollected star. NPCs switch to friendly 😊 faces and no longer cause a respawn on collision.

#### 4. Audio & Feedback Customization
- **Sound Effects** toggle — instructors can disable all audio for students who are sound-sensitive.
- **Collect sounds** — ascending musical tones reward each star pickup.
- **Celebration animations** — colourful particle bursts appear on collection and on winning (can be disabled via Reduce Motion or Celebrations toggle).
- **Visual score pop-ups** — "+1 ⭐" floats up from each collected star, giving immediate visual reinforcement.
- **Win screen** — large "🎉 YOU WIN! 🎉" overlay with star count summary.

#### 5. Adjustable Difficulty Settings
| Setting | Easy | Medium | Hard |
|---------|------|--------|------|
| NPC count | 1 | 2 | 3 |
| NPC speed | Slow (0.9) | Medium (1.0–1.3) | Fast (1.7–2.2) |
| Barrier density | Low | Moderate | High |
| Stars to collect | 6 | 7 | 8 |

All difficulty parameters (NPC speed, barrier density, star count) are independently adjustable in the source code for further customization.

---

{% include uesl-accessibility-game.html %}
