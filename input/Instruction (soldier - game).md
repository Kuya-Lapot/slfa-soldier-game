You are a senior full-stack engineer and game engine pipeline architect.

Your task is to transform a child’s drawing into a fully playable 2D shooting game using a complete 3-stage pipeline inside this repository.

The final output must be a working Phaser 3 game that runs in a single `index.html` file and can be deployed to GitHub Pages.

---

# 🧠 INPUT

There is an image in the repository:

```txt
/input/drawing.jpg
```

This image is a child’s drawing that may contain:

* a main character (soldier / hero / stick figure / robot)
* enemy monsters or shapes
* background elements

---

# 🎯 GOAL

Automatically generate a playable browser game using this pipeline:

> Image → Interpretation → Asset Pack → Phaser Game

No runtime AI is required. All processing happens at build time.

---

# ⚙️ PIPELINE (MANDATORY)

You MUST implement the system in 3 stages:

---

# 🟢 STAGE 1 — IMAGE INTERPRETATION

Analyze `/input/drawing.jpg` and convert it into structured data.

If real image recognition is not possible, use heuristic rules:

* Largest central figure = player
* Smaller repeated shapes = enemies
* Top positioned objects = enemies
* Bottom/background shapes = background

Output a structured interpretation:

```json id="stage1"
{
  "playerCandidate": "largest humanoid figure",
  "enemyCandidates": ["small shapes", "repeated forms"],
  "sceneType": "2D shooter",
  "complexity": "simple"
}
```

---

# 🎨 STAGE 2 — ASSET GENERATION

From the interpretation, generate a **game asset pack**.

Create the following structure:

```txt
/assets/
  player.png
  enemies/
    enemy_1.png
    enemy_2.png
  background.png
```

Also generate:

```txt
/asset-pack/game-assets.json
```

Example format:

```json id="assetpack"
{
  "player": {
    "sprite": "/assets/player.png",
    "movement": "left_right",
    "canShoot": true
  },
  "enemies": [
    {
      "sprite": "/assets/enemies/enemy_1.png",
      "movement": "fall_down",
      "speed": 3
    }
  ],
  "background": "/assets/background.png"
}
```

If real cropping or image extraction is not possible:

* generate placeholder assets
* or simplify to colored shapes
* BUT keep structure valid

---

# 🎮 STAGE 3 — GAME GENERATION (PHASER 3)

Generate a complete playable game in a SINGLE FILE:

```txt
/index.html
```

Use Phaser 3 via CDN:

```html
https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js
```

---

## GAME REQUIREMENTS

### Player

* Uses player sprite from asset pack
* Moves left/right
* Keyboard + mobile touch support

### Shooting

* Shoots bullets upward
* Bullets destroy enemies

### Enemies

* Spawn from top
* Move downward
* Use enemy sprites from asset pack

### Gameplay

* Score system (+1 per kill)
* Game over if enemy hits player or reaches bottom

### UI

* Score display
* Game over screen
* Restart button

---

# 📱 MOBILE SUPPORT (MANDATORY)

Include:

* Left button
* Right button
* Shoot button
* Touch-friendly controls

---

# 🧠 ARCHITECTURE RULES

* Use Phaser 3 best practices:

  * preload()
  * create()
  * update()
* Use physics engine for collisions
* Use groups for enemies and bullets
* Keep code clean and modular inside one file

---

# 📦 FINAL OUTPUT STRUCTURE

The repository must end with:

```txt
/input/drawing.jpg
/assets/
  player.png
  enemies/
  background.png
/asset-pack/game-assets.json
/index.html
```

---

# 🚀 EXECUTION RULES

* Must always produce a playable game
* Must never fail if image is unclear
* Must fallback to simple shapes if needed
* Must prioritize functionality over visual quality
* Must run immediately by opening `index.html`
* Must be deployable to GitHub Pages without build steps

---

# 🎯 FINAL GOAL

A fully automated system where:

> A single child drawing becomes a playable Phaser 3 shooting game in the browser.

---

# 🧠 IMPORTANT DESIGN PRINCIPLE

This is NOT runtime AI.

This is a **game compiler pipeline**:

* AI is only used during generation
* The final game is deterministic and static

---