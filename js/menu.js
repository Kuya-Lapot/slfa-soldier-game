// ═══════════════════════════════════════════════════════════════════════════
// HUB UTILITY  — shared scene-switching helper
// ═══════════════════════════════════════════════════════════════════════════

const Hub = {
  go(currentScene, targetKey) {
    // Stop all active scenes cleanly, then start the target
    currentScene.scene.stop();
    currentScene.scene.start(targetKey);
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN MENU SCENE
// ═══════════════════════════════════════════════════════════════════════════
class MainMenuScene extends Phaser.Scene {
  constructor() { super('MainMenu'); }

  create() {
    const W = this.scale.width, H = this.scale.height;

    // ── Animated gradient background ──
    const bg = this.add.graphics();
    this._drawBg(bg, W, H, 0);

    // Star field
    const stars = [];
    for (let i = 0; i < 60; i++) {
      stars.push(this.add.circle(
        Math.random() * W, Math.random() * H * 0.55,
        Math.random() < 0.2 ? 2 : 1,
        0xffffff, 0.5 + Math.random() * 0.5
      ).setDepth(0));
    }
    this.time.addEvent({
      delay: 1200, loop: true,
      callback: () => stars.forEach(s => this.tweens.add({
        targets: s, alpha: { from: s.alpha, to: Math.random() * 0.8 + 0.1 },
        duration: 600, ease: 'Sine.easeInOut'
      }))
    });

    // ── Title ──
    const titleY = H * 0.20;
    this.add.text(W / 2, titleY, 'MINI GAME HUB', {
      fontSize: '44px', fill: '#ffe14d',
      stroke: '#8b4513', strokeThickness: 6,
      fontFamily: 'Courier New', shadow: { x: 3, y: 3, color: '#000', blur: 6, fill: true }
    }).setOrigin(0.5).setDepth(5);

    this.add.text(W / 2, titleY + 54, '— arcade collection —', {
      fontSize: '16px', fill: '#aaddff', fontFamily: 'Courier New'
    }).setOrigin(0.5).setDepth(5);

    // ── Animated arcade cabinet silhouette (simple) ──
    const art = this.add.graphics().setDepth(3);
    const ax = W / 2, ay = titleY + 90;
    art.fillStyle(0x1c3a0a, 0.6);
    art.fillRoundedRect(ax - 38, ay, 76, 52, 8);
    art.fillStyle(0x2e6b5e, 0.7);
    art.fillRoundedRect(ax - 30, ay + 6, 60, 32, 4);
    // screen glow
    art.fillStyle(0xaaddff, 0.15);
    art.fillRoundedRect(ax - 26, ay + 8, 52, 26, 3);
    // buttons
    [0x2eaf5b, 0xd04040, 0xf5a623].forEach((col, i) => {
      art.fillStyle(col);
      art.fillCircle(ax - 12 + i * 12, ay + 46, 5);
    });

    // ── Game buttons ──
    const btnY1 = H * 0.56;
    const btnY2 = H * 0.72;
    this.makeGameBtn(W / 2, btnY1, '🚀  PLAY SHOOTER', '#ffee44', '#cc4400', () => {
      this.launchShooter();
    });
    this.makeGameBtn(W / 2, btnY2, '🧟  ZOMBIE DEFENSE', '#aaffaa', '#1c6e1c', () => {
      this.launchZombie();
    });

    // ── Controls hint ──
    this.add.text(W / 2, H - 24, 'Tap a game to start  •  ESC to return anytime', {
      fontSize: '12px', fill: '#888888', fontFamily: 'Courier New'
    }).setOrigin(0.5).setDepth(5);

    // pulse the title
    this.tweens.add({
      targets: this.add.text(W / 2, titleY, 'MINI GAME HUB', {
        fontSize: '44px', fill: '#ffffff',
        stroke: '#ffe14d', strokeThickness: 2,
        fontFamily: 'Courier New', alpha: 0
      }).setOrigin(0.5).setDepth(6).setAlpha(0),
      alpha: { from: 0, to: 0.18 }, duration: 900, yoyo: true, repeat: -1
    });
  }

  _drawBg(g, W, H) {
    g.clear();
    // dark night sky
    g.fillGradientStyle(0x050d1e, 0x050d1e, 0x0d2b1e, 0x0d2b1e, 1);
    g.fillRect(0, 0, W, H * 0.7);
    // ground
    g.fillGradientStyle(0x1a4a10, 0x1a4a10, 0x0d2808, 0x0d2808, 1);
    g.fillRect(0, H * 0.7, W, H * 0.3);
    // tree silhouettes
    g.fillStyle(0x0d2808);
    for (let x = 0; x < W + 30; x += 50) {
      const h = 40 + ((x * 7919) % 32);
      g.fillTriangle(x, H * 0.7, x - 18, H * 0.7 - h / 2, x + 18, H * 0.7 - h / 2);
      g.fillTriangle(x, H * 0.7 - h * 0.35, x - 14, H * 0.7 - h * 0.78, x + 14, H * 0.7 - h * 0.78);
      g.fillRect(x - 4, H * 0.7 - h * 0.3, 8, h * 0.3);
    }
    g.setDepth(1);
  }

  makeGameBtn(x, y, label, textColor, strokeColor, cb) {
    const W = 290, H = 60;
    const bg = this.add.rectangle(x, y, W, H, 0x000000, 0.45)
      .setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(strokeColor).color, 1)
      .setDepth(8).setInteractive({ useHandCursor: true });

    const txt = this.add.text(x, y, label, {
      fontSize: '22px', fill: textColor,
      stroke: '#000', strokeThickness: 3,
      fontFamily: 'Courier New'
    }).setOrigin(0.5).setDepth(9);

    const onOver = () => {
      bg.setFillStyle(0x223300, 0.75);
      txt.setScale(1.07);
    };
    const onOut = () => {
      bg.setFillStyle(0x000000, 0.45);
      txt.setScale(1);
    };

    bg.on('pointerover', onOver);
    bg.on('pointerout', onOut);
    bg.on('pointerdown', () => {
      this.cameras.main.flash(180, 255, 255, 100);
      this.time.delayedCall(160, cb);
    });

    // idle pulse on the glow border
    this.tweens.add({
      targets: bg, alpha: { from: 0.85, to: 1 }, duration: 800, yoyo: true, repeat: -1
    });

    return bg;
  }

  launchShooter() {
    this.scene.stop('MainMenu');
    this.scene.start('Shooter');
  }

  launchZombie() {
    this.scene.stop('MainMenu');
    this.scene.start('ZombieDefense');
  }
}
