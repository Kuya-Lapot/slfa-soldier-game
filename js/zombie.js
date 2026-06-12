// ═══════════════════════════════════════════════════════════════════════════
// ZOMBIE DEFENSE  (lane-based, Plants-vs-Zombies-inspired feel)
// Portrait 360×640 canvas · player on left, zombies from right
// Character based on input/drawing2.jpg
// (girl: orange hair, pink top, teal skirt, holding a gun)
// ═══════════════════════════════════════════════════════════════════════════

const ZW = 360, ZH = 640;
const Z_LANES   = 5;
const Z_LANE_TOP = 100;            // y where lanes begin (below HUD)
const Z_LANE_H   = Math.floor((ZH - Z_LANE_TOP - 60) / Z_LANES); // ≈96px
const Z_PLAYER_X = 44;

function zLaneY(i) { return Z_LANE_TOP + Z_LANE_H * i + Z_LANE_H / 2; }

// ─── ZOMBIE TEXTURE GENERATOR ────────────────────────────────────────────────
function ensureZombieTextures(scene) {
  const tex = scene.textures;
  const miss = k => !tex.exists(k) || tex.get(k).key === '__MISSING';

  // ── Cartoon forest background (portrait) ──
  if (miss('zd_bg')) {
    const c = tex.createCanvas('zd_bg', ZW, ZH); const ctx = c.getContext();

    // sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, Z_LANE_TOP + 20);
    sky.addColorStop(0, '#5bb8e8'); sky.addColorStop(1, '#c8eeff');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, ZW, Z_LANE_TOP + 20);

    // sun
    ctx.fillStyle = '#ffe14d'; ctx.beginPath(); ctx.arc(300, 34, 22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff8a0'; ctx.beginPath(); ctx.arc(300, 34, 14, 0, Math.PI * 2); ctx.fill();

    // clouds
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    [[70, 30], [200, 50]].forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.ellipse(cx, cy, 32, 14, 0, 0, Math.PI * 2);
      ctx.ellipse(cx + 22, cy - 7, 22, 12, 0, 0, Math.PI * 2);
      ctx.ellipse(cx - 24, cy - 4, 18, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // tree line just above lanes
    const treeY = Z_LANE_TOP;
    for (let x = -10; x < ZW + 20; x += 38) {
      const h = 32 + ((x * 7919) % 22);
      ctx.fillStyle = '#2f6b2f';
      ctx.beginPath(); ctx.arc(x, treeY - h / 2, h / 2 + 11, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#3e8a3e';
      ctx.beginPath(); ctx.arc(x + 9, treeY - h / 2 - 5, h / 2 + 4, 0, Math.PI * 2); ctx.fill();
    }
    // tree trunks
    ctx.fillStyle = '#5a3b1e';
    for (let x = 14; x < ZW; x += 76) ctx.fillRect(x, treeY - 14, 8, 14);

    // grass lane stripes
    for (let i = 0; i < Z_LANES; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#7ec850' : '#8fd45e';
      ctx.fillRect(0, Z_LANE_TOP + i * Z_LANE_H, ZW, Z_LANE_H);
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(0, Z_LANE_TOP + i * Z_LANE_H, ZW, 2);
    }

    // ground strip below lanes
    ctx.fillStyle = '#5a3b1e';
    ctx.fillRect(0, Z_LANE_TOP + Z_LANES * Z_LANE_H, ZW, ZH - (Z_LANE_TOP + Z_LANES * Z_LANE_H));

    // grass details: tufts + flowers
    for (let i = 0; i < 70; i++) {
      const gx = (i * 9973) % ZW;
      const gy = Z_LANE_TOP + 8 + ((i * 7717) % (Z_LANES * Z_LANE_H - 16));
      if (i % 8 === 0) {
        ctx.fillStyle = ['#ffec6e', '#ff9ecb', '#ffffff'][i % 3];
        ctx.beginPath(); ctx.arc(gx, gy, 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffb13d'; ctx.beginPath(); ctx.arc(gx, gy, 1.3, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.strokeStyle = '#5da838'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(gx, gy + 5); ctx.lineTo(gx - 2, gy - 4);
        ctx.moveTo(gx, gy + 5); ctx.lineTo(gx + 3, gy - 3); ctx.stroke();
      }
    }
    c.refresh();
  }

  // ── Player sprite: girl from drawing2.jpg ──
  if (miss('zd_player')) {
    const c = tex.createCanvas('zd_player', 52, 62); const ctx = c.getContext();
    // back hair
    ctx.fillStyle = '#e0782a';
    ctx.beginPath(); ctx.arc(20, 14, 13, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(10, 26, 5, 10, 0.3, 0, Math.PI * 2); ctx.fill();
    // face
    ctx.fillStyle = '#f6c897'; ctx.beginPath(); ctx.arc(22, 17, 9.5, 0, Math.PI * 2); ctx.fill();
    // fringe
    ctx.fillStyle = '#e0782a';
    ctx.beginPath(); ctx.arc(20, 10, 8, Math.PI * 0.85, Math.PI * 2.1); ctx.fill();
    // eyes
    ctx.fillStyle = '#3a2418';
    ctx.beginPath(); ctx.arc(24, 16, 1.6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(29, 16, 1.6, 0, Math.PI * 2); ctx.fill();
    // smile
    ctx.strokeStyle = '#b05a3a'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(26, 20, 3, 0.2, Math.PI - 0.3); ctx.stroke();
    // body / top (pink)
    ctx.fillStyle = '#e87bbf';
    ctx.fillRect(14, 27, 16, 15);
    // arms extending to gun
    ctx.fillRect(26, 31, 14, 5);
    ctx.fillStyle = '#f6c897'; ctx.fillRect(37, 32, 5, 4);
    // gun (black)
    ctx.fillStyle = '#222';
    ctx.fillRect(39, 28, 13, 6);
    ctx.fillRect(42, 33, 4, 7);
    ctx.fillStyle = '#444'; ctx.fillRect(50, 29, 2, 4);
    // skirt (teal)
    ctx.fillStyle = '#1d7d6e';
    ctx.beginPath(); ctx.moveTo(12, 42); ctx.lineTo(32, 42); ctx.lineTo(36, 53); ctx.lineTo(8, 53); ctx.closePath(); ctx.fill();
    // legs + shoes
    ctx.fillStyle = '#f6c897'; ctx.fillRect(16, 53, 4, 7); ctx.fillRect(25, 53, 4, 7);
    ctx.fillStyle = '#333'; ctx.fillRect(14, 58, 7, 4); ctx.fillRect(23, 58, 7, 4);
    c.refresh();
  }

  // ── Normal zombie — green guy from drawing ──
  if (miss('zd_zombie_n')) {
    const c = tex.createCanvas('zd_zombie_n', 40, 52); const ctx = c.getContext();
    // messy hair
    ctx.fillStyle = '#396318';
    ctx.beginPath(); ctx.arc(18, 10, 11, 0, Math.PI * 2); ctx.fill();
    // head
    ctx.fillStyle = '#70a830';
    ctx.beginPath(); ctx.arc(17, 14, 10, 0, Math.PI * 2); ctx.fill();
    // eyes (red pupils on white)
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(11, 13, 2.8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(19, 13, 2.8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#b02020';
    ctx.beginPath(); ctx.arc(10, 13, 1.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(18, 13, 1.4, 0, Math.PI * 2); ctx.fill();
    // crooked mouth
    ctx.strokeStyle = '#1c3a0a'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(9, 21); ctx.lineTo(13, 19); ctx.lineTo(17, 22); ctx.lineTo(21, 20); ctx.stroke();
    // body
    ctx.fillStyle = '#4e7020';
    ctx.fillRect(9, 25, 18, 16);
    // arms reaching left (toward player)
    ctx.fillRect(0, 27, 11, 5);
    ctx.fillStyle = '#70a830'; ctx.fillRect(0, 28, 3, 3);
    // legs
    ctx.fillStyle = '#355015';
    ctx.fillRect(11, 41, 5, 8); ctx.fillRect(20, 41, 5, 8);
    ctx.fillStyle = '#111'; ctx.fillRect(9, 47, 8, 3); ctx.fillRect(18, 47, 8, 3);
    c.refresh();
  }

  // ── Fast zombie — lean, lighter green ──
  if (miss('zd_zombie_f')) {
    const c = tex.createCanvas('zd_zombie_f', 32, 46); const ctx = c.getContext();
    ctx.fillStyle = '#5e9622';
    ctx.beginPath(); ctx.arc(14, 9, 8.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#85cc44';
    ctx.beginPath(); ctx.arc(13, 12, 7.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(8, 11, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(15, 11, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#b02020';
    ctx.beginPath(); ctx.arc(7, 11, 1.1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(14, 11, 1.1, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1c3a0a'; ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.moveTo(7, 17); ctx.lineTo(14, 16); ctx.stroke();
    ctx.fillStyle = '#6aaa30';
    ctx.fillRect(8, 20, 11, 13);
    ctx.fillRect(0, 22, 9, 4);
    ctx.fillStyle = '#4a7820';
    ctx.fillRect(10, 33, 4, 8); ctx.fillRect(17, 33, 4, 8);
    ctx.fillStyle = '#111'; ctx.fillRect(8, 39, 7, 3); ctx.fillRect(15, 39, 7, 3);
    c.refresh();
  }

  // ── Big zombie — chunky, dark green ──
  if (miss('zd_zombie_b')) {
    const c = tex.createCanvas('zd_zombie_b', 54, 64); const ctx = c.getContext();
    // hair
    ctx.fillStyle = '#1e4a0a';
    ctx.beginPath(); ctx.arc(24, 12, 14, 0, Math.PI * 2); ctx.fill();
    // head
    ctx.fillStyle = '#305e14';
    ctx.beginPath(); ctx.arc(22, 17, 13, 0, Math.PI * 2); ctx.fill();
    // angry brow
    ctx.fillStyle = '#0e2606';
    ctx.fillRect(9, 9, 11, 4); ctx.fillRect(22, 9, 10, 4);
    // glowing yellow eyes
    ctx.fillStyle = '#ffd24d';
    ctx.beginPath(); ctx.arc(14, 17, 4.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(27, 17, 4.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#9a1010';
    ctx.beginPath(); ctx.arc(13, 17, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(26, 17, 2.2, 0, Math.PI * 2); ctx.fill();
    // huge mouth with teeth
    ctx.fillStyle = '#0e2606'; ctx.fillRect(10, 26, 22, 7);
    ctx.fillStyle = '#e8e8c8'; [11, 16, 21, 27].forEach(x => ctx.fillRect(x, 26, 4, 4));
    [14, 20, 25].forEach(x => ctx.fillRect(x, 29, 3, 4));
    // wide body
    ctx.fillStyle = '#244e0e';
    ctx.fillRect(8, 34, 32, 20);
    ctx.fillStyle = '#1a3a0a'; ctx.fillRect(8, 34, 32, 5);
    // thick arm reaching left
    ctx.fillRect(0, 38, 12, 8);
    ctx.fillStyle = '#305e14'; ctx.fillRect(0, 39, 4, 6);
    // legs
    ctx.fillStyle = '#162d08';
    ctx.fillRect(12, 54, 8, 9); ctx.fillRect(26, 54, 8, 9);
    ctx.fillStyle = '#0a0a0a'; ctx.fillRect(10, 61, 12, 3); ctx.fillRect(24, 61, 12, 3);
    c.refresh();
  }

  // ── Boss zombie — crowned monster ──
  if (miss('zd_boss')) {
    const c = tex.createCanvas('zd_boss', 80, 96); const ctx = c.getContext();
    // crown
    ctx.fillStyle = '#b8860b';
    ctx.beginPath();
    ctx.moveTo(12, 16); ctx.lineTo(18, 2); ctx.lineTo(26, 14); ctx.lineTo(33, 0);
    ctx.lineTo(40, 14); ctx.lineTo(47, 2); ctx.lineTo(54, 16); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffd24d'; [[18,3],[33,1],[47,3]].forEach(([x,y])=>{ ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill(); });
    // hair
    ctx.fillStyle = '#14380a';
    ctx.beginPath(); ctx.arc(34, 25, 20, 0, Math.PI * 2); ctx.fill();
    // head
    ctx.fillStyle = '#286012';
    ctx.beginPath(); ctx.arc(32, 30, 18, 0, Math.PI * 2); ctx.fill();
    // brow
    ctx.fillStyle = '#0a2005'; ctx.fillRect(13, 19, 14, 5); ctx.fillRect(32, 19, 14, 5);
    // eyes — burning red
    ctx.fillStyle = '#ff2222';
    ctx.beginPath(); ctx.arc(20, 29, 6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(38, 29, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff8800';
    ctx.beginPath(); ctx.arc(19, 29, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(37, 29, 2.5, 0, Math.PI * 2); ctx.fill();
    // mouth
    ctx.fillStyle = '#0a2005'; ctx.fillRect(16, 40, 30, 8);
    ctx.fillStyle = '#e8e8c8'; [17,23,30,37,43].forEach(x=>ctx.fillRect(x,40,4,4));
    [20,27,34,41].forEach(x=>ctx.fillRect(x,44,3,4));
    // body
    ctx.fillStyle = '#1e500a';
    ctx.fillRect(10, 50, 50, 30);
    ctx.fillStyle = '#142f06'; ctx.fillRect(10, 50, 50, 6);
    // arm
    ctx.fillRect(0, 56, 14, 10);
    ctx.fillStyle = '#286012'; ctx.fillRect(0, 58, 5, 6);
    // legs
    ctx.fillStyle = '#0e2806';
    ctx.fillRect(16, 80, 10, 13); ctx.fillRect(42, 80, 10, 13);
    ctx.fillStyle = '#050e02'; ctx.fillRect(13, 91, 15, 5); ctx.fillRect(39, 91, 15, 5);
    c.refresh();
  }

  // ── Bullet ──
  if (miss('zd_bullet')) {
    const c = tex.createCanvas('zd_bullet', 16, 8); const ctx = c.getContext();
    ctx.fillStyle = '#ff8a2a'; ctx.beginPath(); ctx.ellipse(8, 4, 7, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffd9a0'; ctx.beginPath(); ctx.ellipse(10, 3, 4, 2, 0, 0, Math.PI * 2); ctx.fill();
    c.refresh();
  }

  // ── Power-up badges ──
  const badge = (key, color, draw) => {
    if (miss(key)) {
      const c = tex.createCanvas(key, 28, 28); const ctx = c.getContext();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(14, 14, 13, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = color;  ctx.beginPath(); ctx.arc(14, 14, 11, 0, Math.PI * 2); ctx.fill();
      draw(ctx);
      c.refresh();
    }
  };
  badge('zd_pu_rapid', '#f5a623', ctx => {
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.moveTo(16, 5); ctx.lineTo(9, 14); ctx.lineTo(13, 14);
    ctx.lineTo(11, 23); ctx.lineTo(19, 12); ctx.lineTo(15, 12); ctx.closePath(); ctx.fill();
  });
  badge('zd_pu_triple', '#2eaf5b', ctx => {
    ctx.fillStyle = '#fff';
    [[5,8],[5,13],[5,18]].forEach(([x, y]) => {
      ctx.beginPath(); ctx.ellipse(x + 8, y + 1, 6, 2, 0, 0, Math.PI * 2); ctx.fill();
    });
  });
  badge('zd_pu_bomb', '#d0413a', ctx => {
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(14, 17, 7, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#111'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(17, 11); ctx.quadraticCurveTo(21, 7, 23, 8); ctx.stroke();
    ctx.fillStyle = '#ffd24d'; ctx.beginPath(); ctx.arc(23, 8, 2.4, 0, Math.PI * 2); ctx.fill();
  });
}

// ─── ZOMBIE DEFENSE SCENE ────────────────────────────────────────────────────
class ZombieDefenseScene extends Phaser.Scene {
  constructor() { super('ZombieDefense'); }

  create() {
    ensureZombieTextures(this);

    this.score    = 0;
    this.wave     = 0;
    this.hearts   = 3;
    this.gameOver = false;

    this.lane       = 2;
    this.nextFireAt  = 0;
    this.rapidUntil  = 0;
    this.tripleUntil = 0;

    this.zombiesToSpawn = 0;
    this.waveClearing   = false;
    this.boss           = null;

    // ── Background ──
    this.add.image(ZW / 2, ZH / 2, 'zd_bg').setDisplaySize(ZW, ZH);

    // lane highlight
    this.laneHi = this.add.rectangle(ZW / 2, zLaneY(this.lane), ZW, Z_LANE_H - 4, 0xffffff, 0.07).setDepth(1);

    // ── Groups ──
    this.zombies   = this.physics.add.group();
    this.bullets   = this.physics.add.group();
    this.powerups  = this.physics.add.group();
    this.bossGroup = this.physics.add.group();

    // ── Player ──
    this.player = this.physics.add.sprite(Z_PLAYER_X, zLaneY(this.lane), 'zd_player').setDepth(5);
    this.player.body.setAllowGravity(false);
    this.startBob();

    // ── Overlaps ──
    this.physics.add.overlap(this.bullets, this.zombies,   this.hitZombie,      null, this);
    this.physics.add.overlap(this.bullets, this.bossGroup, this.hitBoss,        null, this);
    this.physics.add.overlap(this.player,  this.powerups,  this.collectPowerup, null, this);

    // ── Boss health bar ──
    this.bossBarBg   = this.add.rectangle(ZW / 2, ZH - 28, ZW - 32, 13, 0x222222).setDepth(18).setVisible(false);
    this.bossBarFill = this.add.rectangle(18, ZH - 28, ZW - 36, 9, 0x22cc22).setOrigin(0, 0.5).setDepth(19).setVisible(false);
    this.bossLabel   = this.add.text(ZW / 2, ZH - 50, 'BOSS', {
      fontSize: '11px', fill: '#ff8888', stroke: '#000', strokeThickness: 2, fontFamily: 'Courier New'
    }).setOrigin(0.5).setDepth(19).setVisible(false);

    this.createHud();
    this.createControls();

    this.time.delayedCall(700, () => this.startWave(1));
  }

  // ── HUD ──
  createHud() {
    this.heartsText = this.add.text(8, 10, '❤️❤️❤️', { fontSize: '20px' }).setDepth(20);
    this.effectText = this.add.text(8, 38, '', {
      fontSize: '11px', fill: '#ffe14d', stroke: '#1c3a0a', strokeThickness: 3, fontFamily: 'Courier New'
    }).setDepth(20);

    this.scoreText = this.add.text(ZW / 2, 10, 'SCORE: 0', {
      fontSize: '15px', fill: '#fff', stroke: '#1c3a0a', strokeThickness: 4, fontFamily: 'Courier New'
    }).setOrigin(0.5, 0).setDepth(20);

    this.waveText = this.add.text(ZW - 8, 10, 'WAVE 1', {
      fontSize: '14px', fill: '#ffe14d', stroke: '#1c3a0a', strokeThickness: 4, fontFamily: 'Courier New'
    }).setOrigin(1, 0).setDepth(20);

    const menuBtn = this.add.text(ZW / 2, 30, '☰ MENU', {
      fontSize: '13px', fill: '#fff', backgroundColor: '#1c3a0a', padding: { x: 10, y: 5 }, fontFamily: 'Courier New'
    }).setOrigin(0.5, 0).setDepth(20).setInteractive({ useHandCursor: true });
    menuBtn.on('pointerover', () => menuBtn.setStyle({ fill: '#ffe14d' }));
    menuBtn.on('pointerout',  () => menuBtn.setStyle({ fill: '#fff' }));
    menuBtn.on('pointerdown', () => Hub.go(this, 'MainMenu'));
  }

  // ── Controls: lane buttons at far left and far right, bottom ──
  createControls() {
    this.makeLaneBtn(44,      ZH - 62, '▲', () => this.moveLane(-1));
    this.makeLaneBtn(ZW - 44, ZH - 62, '▼', () => this.moveLane(1));
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys    = this.input.keyboard.addKeys({ up: 'W', down: 'S' });
    this.input.keyboard.on('keydown-ESC', () => Hub.go(this, 'MainMenu'));
  }

  makeLaneBtn(x, y, label, cb) {
    const bg = this.add.circle(x, y, 36, 0xffffff, 0)
      .setStrokeStyle(2, 0xffffff, 0.35).setDepth(21)
      .setInteractive({ useHandCursor: true });
    const txt = this.add.text(x, y, label, {
      fontSize: '28px', fill: '#fff', fontFamily: 'Courier New'
    }).setOrigin(0.5).setDepth(22).setAlpha(0.55);

    bg.on('pointerdown', () => { bg.setFillStyle(0xffffff, 0.18); txt.setAlpha(1); txt.setScale(0.84); cb(); });
    const up = () => { bg.setFillStyle(0xffffff, 0); txt.setAlpha(0.55); txt.setScale(1); };
    bg.on('pointerup', up); bg.on('pointerout', up);
  }

  startBob() {
    this.bobTween = this.tweens.add({
      targets: this.player, y: this.player.y - 4, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });
  }

  moveLane(dir) {
    if (this.gameOver) return;
    const next = Phaser.Math.Clamp(this.lane + dir, 0, Z_LANES - 1);
    if (next === this.lane) return;
    this.lane = next;
    // the idle bob tween also drives y — stop it so it can't fight the lane move
    this.tweens.killTweensOf(this.player);
    this.tweens.add({
      targets: this.player, y: zLaneY(next), duration: 110, ease: 'Quad.easeOut',
      onComplete: () => this.startBob()
    });
    this.laneHi.setY(zLaneY(next));
  }

  update(time) {
    if (this.gameOver) return;

    // keyboard
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)   || Phaser.Input.Keyboard.JustDown(this.keys.up))   this.moveLane(-1);
    if (Phaser.Input.Keyboard.JustDown(this.cursors.down) || Phaser.Input.Keyboard.JustDown(this.keys.down)) this.moveLane(1);

    // auto-fire
    const fireDelay = time < this.rapidUntil ? 190 : 480;
    if (time > this.nextFireAt) {
      this.fire(time);
      this.nextFireAt = time + fireDelay;
    }

    // offscreen bullets
    this.bullets.getChildren().forEach(b => { if (b.x > ZW + 30) b.destroy(); });
    this.powerups.getChildren().forEach(p => { if (p.x < -30) p.destroy(); });

    // zombie advance + player-reach check
    this.zombies.getChildren().slice().forEach(z => {
      if (z.x < Z_PLAYER_X + 28) {
        this.spawnBurst(z.x, z.y, 0.7);
        this.tweens.killTweensOf(z);
        z.destroy();
        this.loseHeart();
      }
    });

    // boss reach + HP bar
    if (this.boss && this.boss.active) {
      if (this.boss.x < Z_PLAYER_X + 44) {
        this.spawnBurst(this.boss.x, this.boss.y, 1.3);
        this.removeBoss();
        this.loseHeart();
      } else {
        const r = this.boss.hp / this.boss.maxHp;
        const bw = Math.max(2, (ZW - 36) * r);
        this.bossBarFill.setSize(bw, 9);
        this.bossBarFill.setFillStyle(r > 0.5 ? 0x22cc22 : r > 0.25 ? 0xff8800 : 0xff2222);
      }
    }

    // effect label
    const fx = [];
    if (time < this.rapidUntil)  fx.push('⚡RAPID');
    if (time < this.tripleUntil) fx.push('×3 SHOT');
    this.effectText.setText(fx.join('  '));

    this.checkWaveEnd();
  }

  // ── Shooting ──
  fire(time) {
    const x = this.player.x + 34, y = this.player.y - 1;
    if (time < this.tripleUntil) {
      [[-100, 0], [0, 0], [100, 0]].forEach(([vy, _]) => {
        const b = this.bullets.create(x, y, 'zd_bullet').setDepth(4);
        b.setVelocity(440, vy);
        b.body.setAllowGravity(false);
      });
    } else {
      const b = this.bullets.create(x, y, 'zd_bullet').setDepth(4);
      b.setVelocityX(440);
      b.body.setAllowGravity(false);
    }
  }

  // ── Waves ──
  startWave(n) {
    this.wave = n;
    this.waveText.setText('WAVE ' + n);
    const isBossWave = n % 5 === 0;
    this.announce(isBossWave ? 'BOSS WAVE' : 'WAVE ' + n, isBossWave ? '#ff5555' : '#ffe14d');

    this.speedMult      = 1 + (n - 1) * 0.07;
    const count         = isBossWave ? 4 + Math.floor(n / 2) : 5 + n * 2;
    const interval      = Math.max(360, 1300 - n * 60);
    this.zombiesToSpawn = count;

    this.time.delayedCall(1600, () => {
      if (this.gameOver) return;
      if (isBossWave) this.spawnBoss();
      this.time.addEvent({
        delay: interval, repeat: count - 1,
        callback: this.spawnZombie, callbackScope: this
      });
    });
  }

  announce(msg, color) {
    const txt = this.add.text(ZW / 2, ZH / 2 - 20, msg, {
      fontSize: '46px', fill: color, stroke: '#1c3a0a', strokeThickness: 7, fontFamily: 'Courier New'
    }).setOrigin(0.5).setDepth(25).setScale(0.25);
    this.tweens.add({ targets: txt, scaleX: 1, scaleY: 1, duration: 280, ease: 'Back.easeOut' });
    this.tweens.add({ targets: txt, alpha: 0, delay: 1200, duration: 380, onComplete: () => txt.destroy() });
  }

  spawnZombie() {
    if (this.gameOver) return;
    this.zombiesToSpawn--;
    const rand = Math.random();
    let key, type, hp, speed;
    if (this.wave >= 3 && rand < 0.20) {
      key = 'zd_zombie_b'; type = 'big';    hp = 6; speed = 22;
    } else if (this.wave >= 2 && rand < 0.45) {
      key = 'zd_zombie_f'; type = 'fast';   hp = 1; speed = 80;
    } else {
      key = 'zd_zombie_n'; type = 'normal'; hp = 2; speed = 38;
    }
    const lane = Phaser.Math.Between(0, Z_LANES - 1);
    const z = this.zombies.create(ZW + 36, zLaneY(lane), key).setDepth(4);
    z.zType  = type;
    z.hp     = hp;
    z.zSpeed = speed * this.speedMult * Phaser.Math.FloatBetween(0.88, 1.12);
    z.setVelocityX(-z.zSpeed);
    z.body.setAllowGravity(false);
    this.tweens.add({ targets: z, angle: { from: -5, to: 5 }, duration: 280 + Math.random() * 140, yoyo: true, repeat: -1 });
  }

  spawnBoss() {
    const z = this.bossGroup.create(ZW + 60, zLaneY(2), 'zd_boss').setDepth(6);
    z.maxHp = 50 + this.wave * 10;
    z.hp    = z.maxHp;
    z.zSpeed = 12 * this.speedMult;
    z.setVelocityX(-z.zSpeed);
    z.body.setAllowGravity(false);
    this.boss = z;
    this.bossBarBg.setVisible(true);
    this.bossBarFill.setVisible(true).setSize(ZW - 36, 9);
    this.bossLabel.setVisible(true);
    this.cameras.main.shake(500, 0.009);
    this.tweens.add({ targets: z, angle: { from: -2, to: 2 }, duration: 420, yoyo: true, repeat: -1 });
  }

  removeBoss() {
    if (this.boss) { this.tweens.killTweensOf(this.boss); this.boss.destroy(); }
    this.boss = null;
    this.bossBarBg.setVisible(false);
    this.bossBarFill.setVisible(false);
    this.bossLabel.setVisible(false);
  }

  checkWaveEnd() {
    if (this.waveClearing || this.wave === 0) return;
    if (this.zombiesToSpawn > 0) return;
    if (this.zombies.countActive(true) > 0) return;
    if (this.boss && this.boss.active) return;
    this.waveClearing = true;
    this.time.delayedCall(1400, () => {
      if (!this.gameOver) { this.waveClearing = false; this.startWave(this.wave + 1); }
    });
  }

  // ── Hits ──
  hitZombie(bullet, zombie) {
    bullet.destroy();
    zombie.hp--;
    zombie.setTintFill(0xffffff);
    this.time.delayedCall(55, () => { if (zombie.active) zombie.clearTint(); });
    if (zombie.hp <= 0) this.killZombie(zombie);
  }

  killZombie(zombie) {
    const pts = { normal: 10, fast: 15, big: 30 }[zombie.zType] || 10;
    this.addScore(pts, zombie.x, zombie.y);
    this.spawnBurst(zombie.x, zombie.y, 0.9);
    if (Math.random() < 0.15) this.spawnPowerup(zombie.x, zombie.y);
    this.tweens.killTweensOf(zombie);
    zombie.destroy();
  }

  hitBoss(bullet, boss) {
    bullet.destroy();
    boss.hp--;
    boss.setTintFill(0xffffff);
    this.time.delayedCall(55, () => { if (boss.active) boss.clearTint(); });
    this.spawnBurst(bullet.x, bullet.y, 0.35);
    if (boss.hp <= 0) {
      const reward = 150 + this.wave * 10;
      this.addScore(reward, boss.x, boss.y);
      this.spawnBurst(boss.x, boss.y, 2.0);
      this.cameras.main.shake(600, 0.014);
      this.announce('BOSS DOWN!', '#ffe14d');
      this.spawnPowerup(boss.x - 50, boss.y);
      this.removeBoss();
    }
  }

  addScore(pts, x, y) {
    this.score += pts;
    this.scoreText.setText('SCORE: ' + this.score);
    const popup = this.add.text(x, y - 22, '+' + pts, {
      fontSize: '16px', fill: '#ffe14d', stroke: '#1c3a0a', strokeThickness: 3, fontFamily: 'Courier New'
    }).setOrigin(0.5).setDepth(15);
    this.tweens.add({ targets: popup, y: y - 60, alpha: 0, duration: 650, onComplete: () => popup.destroy() });
  }

  // ── Power-ups ──
  spawnPowerup(x, y) {
    const pool = ['rapid', 'rapid', 'triple', 'triple', 'bomb'];
    const type = Phaser.Utils.Array.GetRandom(pool);
    const p = this.powerups.create(x, y, 'zd_pu_' + type).setDepth(7);
    p.puType = type;
    p.setVelocityX(-55);
    p.body.setAllowGravity(false);
    this.tweens.add({ targets: p, scaleX: 1.18, scaleY: 1.18, duration: 350, yoyo: true, repeat: -1 });
  }

  collectPowerup(player, pu) {
    const type = pu.puType;
    this.tweens.killTweensOf(pu);
    pu.destroy();
    const labels = { rapid: 'RAPID FIRE!', triple: 'TRIPLE SHOT!', bomb: 'KABOOM!' };
    const colors = { rapid: '#f5a623', triple: '#2eaf5b', bomb: '#ff5555' };
    const msg = this.add.text(this.player.x + 55, this.player.y - 42, labels[type], {
      fontSize: '19px', fill: colors[type], stroke: '#1c3a0a', strokeThickness: 4, fontFamily: 'Courier New'
    }).setOrigin(0.5).setDepth(25);
    this.tweens.add({ targets: msg, y: '-=38', alpha: 0, duration: 950, onComplete: () => msg.destroy() });
    const now = this.time.now;
    if (type === 'rapid')  this.rapidUntil  = now + 6000;
    if (type === 'triple') this.tripleUntil = now + 8000;
    if (type === 'bomb')   this.bombBlast();
  }

  bombBlast() {
    const flash = this.add.rectangle(ZW / 2, ZH / 2, ZW, ZH, 0xffffff, 0.8).setDepth(26);
    this.tweens.add({ targets: flash, alpha: 0, duration: 420, onComplete: () => flash.destroy() });
    this.cameras.main.shake(420, 0.017);
    this.zombies.getChildren().slice().forEach(z => this.killZombie(z));
    if (this.boss && this.boss.active) {
      this.boss.hp = Math.max(1, this.boss.hp - 15);
      this.spawnBurst(this.boss.x, this.boss.y, 1.4);
    }
  }

  // ── Hearts / Game Over ──
  loseHeart() {
    if (this.gameOver) return;
    this.hearts = Math.max(0, this.hearts - 1);
    this.heartsText.setText('❤️'.repeat(this.hearts) + '🖤'.repeat(3 - this.hearts));
    this.cameras.main.shake(240, 0.011);
    this.cameras.main.flash(180, 200, 30, 30);
    if (this.hearts <= 0) this.triggerGameOver();
  }

  triggerGameOver() {
    this.gameOver = true;
    this.time.removeAllEvents();
    this.zombies.getChildren().forEach(z => z.setVelocityX(0));
    if (this.boss && this.boss.active) this.boss.setVelocityX(0);
    this.spawnBurst(this.player.x, this.player.y, 1.5);
    this.player.setVisible(false);

    this.add.rectangle(ZW / 2, ZH / 2, ZW, ZH, 0x000000, 0.66).setDepth(30);
    this.add.text(ZW / 2, ZH / 2 - 120, 'GAME OVER', {
      fontSize: '44px', fill: '#ff4444', stroke: '#000', strokeThickness: 6, fontFamily: 'Courier New'
    }).setOrigin(0.5).setDepth(31);
    this.add.text(ZW / 2, ZH / 2 - 55, 'SCORE: ' + this.score, {
      fontSize: '24px', fill: '#ffe14d', stroke: '#000', strokeThickness: 3, fontFamily: 'Courier New'
    }).setOrigin(0.5).setDepth(31);
    this.add.text(ZW / 2, ZH / 2 - 20, 'WAVE: ' + this.wave, {
      fontSize: '18px', fill: '#aaddff', stroke: '#000', strokeThickness: 2, fontFamily: 'Courier New'
    }).setOrigin(0.5).setDepth(31);

    const mkBtn = (y, label, strokeColor, cb) => {
      const b = this.add.text(ZW / 2, y, label, {
        fontSize: '20px', fill: '#fff', stroke: strokeColor, strokeThickness: 3,
        backgroundColor: '#1c3a0a', padding: { x: 16, y: 10 }, fontFamily: 'Courier New'
      }).setOrigin(0.5).setDepth(31).setInteractive({ useHandCursor: true });
      b.on('pointerover', () => b.setStyle({ fill: '#ffe14d' }));
      b.on('pointerout',  () => b.setStyle({ fill: '#fff' }));
      b.on('pointerdown', cb);
    };
    mkBtn(ZH / 2 + 45,  '[ RESTART ]', '#2eaf5b', () => this.scene.restart());
    mkBtn(ZH / 2 + 105, '[ MENU ]',    '#4488cc', () => Hub.go(this, 'MainMenu'));
    this.add.text(ZW / 2, ZH / 2 + 155, 'ENTER/R to restart · ESC menu', {
      fontSize: '12px', fill: '#888', fontFamily: 'Courier New'
    }).setOrigin(0.5).setDepth(31);
    this.input.keyboard.once('keydown-ENTER', () => this.scene.restart());
    this.input.keyboard.once('keydown-R',     () => this.scene.restart());
  }

  // ── Explosion burst ──
  spawnBurst(x, y, scale) {
    const colors = [0x8fd45e, 0xffe14d, 0xffffff, 0xff8a2a, 0x70a830];
    for (let i = 0; i < 8; i++) {
      const px = this.add.circle(x, y, (2.5 + Math.random() * 3.5) * scale,
        Phaser.Utils.Array.GetRandom(colors)).setDepth(14);
      const angle = Math.random() * Math.PI * 2;
      const spd = (35 + Math.random() * 100) * scale;
      this.tweens.add({
        targets: px, x: x + Math.cos(angle) * spd, y: y + Math.sin(angle) * spd,
        alpha: 0, scaleX: 0.1, scaleY: 0.1, duration: 320 + Math.random() * 220,
        ease: 'Power2', onComplete: () => px.destroy()
      });
    }
    const boom = this.add.text(x, y - 12, 'Boom!', {
      fontSize: Math.floor(13 * scale) + 'px', fill: '#fff', stroke: '#1c3a0a', strokeThickness: 3, fontFamily: 'Courier New'
    }).setOrigin(0.5).setDepth(15);
    this.tweens.add({ targets: boom, y: y - 46, alpha: 0, scaleX: 1.3, scaleY: 1.3, duration: 460, onComplete: () => boom.destroy() });
  }
}
