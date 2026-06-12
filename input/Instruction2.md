You are a senior JavaScript game developer working on an existing Phaser 3 game inside `index.html`.

DO NOT rewrite the game.

Only extend and improve it.

---

# 🎮 GOAL

Turn the current simple shooter into a polished arcade experience by adding:

---

# 🔫 1. WEAPON FEEL IMPROVEMENTS

Enhance existing weapons with:

* screen shake on hit
* enemy flash on damage
* explosion effects
* bullet trails
* distinct firing rhythm per weapon:

  * Basic: steady
  * Spread: burst
  * Laser: continuous feel

---

# 👾 2. ENEMY VARIETY

Add 3 enemy types:

* Normal (default)
* Fast (low HP, fast movement)
* Tank (high HP, slow)

---

# 👑 3. BOSS SYSTEM

Add boss that appears at score milestone (e.g. 25–30):

* multi-phase boss:

  * Phase 1: slow
  * Phase 2: shoots bullets
  * Phase 3: rage mode (faster movement)
* boss HP bar UI

---

# ⚡ 4. POWER-UPS (TEMPORARY)

Add random drops:

* Rapid Fire (5 seconds)
* Shield (block 3 hits)
* Slow Motion (2 seconds)
* Double Score (5 seconds)

---

# 📈 5. DIFFICULTY SCALING

As score increases:

* faster enemy spawn rate
* slightly faster enemies
* increased boss difficulty per cycle

---

# 📱 6. MOBILE SUPPORT

Ensure all features work on:

* touch controls
* small screens
* UI overlays (upgrade, boss, powerups)

---

# 🧠 RULES

* DO NOT rewrite the game from scratch
* DO NOT remove existing logic
* ONLY extend current Phaser code
* Keep everything inside single `index.html`
* Use Phaser 3 best practices (groups, physics, update loop)

---

# 🎯 FINAL GOAL

A fun arcade shooter where:

> player shoots → feels impact → gets powerups → fights boss → repeats with increasing intensity

---

# 🚀 OUTPUT

Return only updated `index.html`

---

# 💡 DESIGN PRINCIPLE

Prioritize:

* feel over complexity
* feedback over mechanics
* fun over realism

---

# 🧠 ONE IMPORTANT NOTE

This is the “maximum feature set” version — do not add anything beyond this scope.

---