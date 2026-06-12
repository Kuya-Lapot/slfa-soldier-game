You are a senior Phaser 3 game developer.

You are working on an existing project that currently contains a playable shooter game inside a single `index.html`.

Your task is to evolve this project into a small multi-game arcade while preserving all existing functionality.

---

# 🎯 PRIMARY GOAL

Convert the project into a **Mini Game Hub** that contains:

* Main Menu
* Shooter Game (existing)
* Zombie Defense Game (new)

The Shooter Game already works and must continue to work exactly as before.

Do NOT remove features from the Shooter Game.

---

# ⚠️ IMPORTANT IMPLEMENTATION STRATEGY

Implement this in two phases.

---

# PHASE 1 — ARCHITECTURE REFACTOR

Before adding the second game:

Refactor the project into Phaser Scenes.

Create:

```txt
MainMenuScene
ShooterScene
ZombieDefenseScene
```

Requirements:

* Preserve all existing Shooter gameplay
* Do not change Shooter mechanics
* Only improve project structure
* Ensure scene switching works correctly

Menu flow:

```txt
Main Menu
  ↓
Shooter Game
  ↓
Back to Menu

Main Menu
  ↓
Zombie Defense
  ↓
Back to Menu
```

---

# MAIN MENU

Create a simple arcade-style menu.

Title:

```txt
Mini Game Hub
```

Buttons:

```txt
Play Shooter
Play Zombie Defense
```

Each button launches the corresponding scene.

---

# PHASE 2 — ADD ZOMBIE DEFENSE GAME

Implement a new scene:

```txt
ZombieDefenseScene
```

---

# CHARACTER SOURCE

Use:

```txt
/input/drawing2.jpg
```

Interpret the drawing as the player character.

If image extraction is difficult:

* create a simplified sprite
* approximate the drawing
* keep the game playable

Do not fail if image parsing is imperfect.

---

# GAME STYLE

The game should be inspired by the gameplay feel of Plants vs. Zombies.

Use original implementation and assets.

Do not attempt to recreate Plants vs. Zombies exactly.

---

# ORIENTATION

Design this game primarily for:

```txt
Landscape
```

Mobile and desktop compatible.

---

# GAMEPLAY

The player starts on the LEFT side of the screen.

The player does not move freely.

Use a lane system.

---

# LANES

Create:

```txt
Lane 1
Lane 2
Lane 3
Lane 4
Lane 5
```

The player occupies one lane at a time.

Movement snaps between lanes.

---

# CONTROLS

Mobile-first controls.

Bottom-left corner:

```txt
[ ↑ ] [ ↓ ]
```

Up:

* move up one lane

Down:

* move down one lane

Buttons must be large and touch-friendly.

Optional:

* keyboard support

---

# SHOOTING

Player automatically shoots toward the right side.

No shoot button required.

Gameplay should focus on positioning between lanes.

---

# ZOMBIES

Spawn zombies from the RIGHT side.

Zombies move LEFT toward the player.

---

# ZOMBIE TYPES

## Normal Zombie

* standard speed
* standard health

## Fast Zombie

* faster movement
* lower health

## Big Zombie

* slower movement
* higher health

Each type should be visually distinct.

---

# PLAYER HEALTH

Player starts with:

```txt
3 Hearts
```

When a zombie reaches the player:

* lose 1 heart
* remove zombie

When hearts reach 0:

```txt
Game Over
```

Allow restart or return to menu.

---

# WAVE SYSTEM

Add progressive waves.

Display:

```txt
Wave 1
Wave 2
Wave 3
...
```

Between waves display a brief announcement.

Example:

```txt
WAVE 4
```

Centered and clearly visible.

---

# DIFFICULTY SCALING

Each wave should gradually increase:

* zombie count
* spawn frequency
* zombie speed

Keep progression smooth.

---

# POWER UPS

Implement simple random drops.

## Rapid Fire

Temporary faster shooting.

## Triple Shot

Temporary spread attack.

## Bomb

Destroys all zombies currently on screen.

Keep implementation simple.

---

# BOSS SYSTEM

Every 5 waves:

Spawn a Boss Zombie.

Requirements:

* larger than normal zombies
* significantly higher health
* visible health bar
* slower movement
* feels like a special event

Display:

```txt
BOSS WAVE
```

when boss appears.

---

# ENVIRONMENT

Create a simple cartoon forest theme.

Requirements:

* grass field
* forest background
* bright colors
* child-friendly appearance

Simple Phaser shapes are acceptable.

No external assets required.

---

# HUD

Display:

```txt
Score
Wave
Hearts
```

at all times.

---

# MOBILE SUPPORT

All game modes must remain playable on mobile devices.

Ensure:

* touch controls work
* UI scales correctly
* buttons remain easy to press

---

# CODE QUALITY

Keep code organized.

Avoid large blocks of duplicated logic.

Separate responsibilities clearly between scenes.

Structure the project so future games can be added easily.

---

# FUTURE EXPANSION

Design the architecture so additional scenes can be added later.

Examples:

```txt
Typing Game
Math Game
Drawing Adventure
Princess Game
```

without major refactoring.

---

# OUTPUT

Modify the existing project.

Do not create a new repository.

Preserve the Shooter Game.

Add:

```txt
MainMenuScene
ZombieDefenseScene
```

and all supporting functionality.

Return the updated code and files necessary to implement this change.

---