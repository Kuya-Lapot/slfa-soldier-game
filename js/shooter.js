// ═══════════════════════════════════════════════════════════════════════════
// SHOOTER GAME  (original game — mechanics preserved)
// Contains: BootScene, shooter texture generator, ShooterScene
// ═══════════════════════════════════════════════════════════════════════════

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const W = 360, H = 640;

// ─── BOOT SCENE ──────────────────────────────────────────────────────────────
class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }
  preload() {
    this.load.on('loaderror', (file) => console.warn('Asset load error:', file.key));
    this.load.image('player',       'assets/player.png');
    this.load.image('enemy_1',      'assets/enemies/enemy_1.png');
    this.load.image('enemy_2',      'assets/enemies/enemy_2.png');
    this.load.image('background',   'assets/background.png');
    this.load.image('bullet',       'assets/bullet.png');
    this.load.image('enemy_bullet', 'assets/enemy_bullet.png');
    const bar = this.add.graphics();
    this.load.on('progress', v => {
      bar.clear();
      bar.fillStyle(0x333333); bar.fillRect(40, H/2-12, W-80, 24);
      bar.fillStyle(0xff8800); bar.fillRect(42, H/2-10, (W-84)*v, 20);
    });
    this.load.on('complete', () => bar.destroy());
    this.add.text(W/2, H/2-50, 'Loading...', { fontSize:'20px', fill:'#fff', fontFamily:'Courier New' }).setOrigin(0.5);
  }
  create() {
    ensureTextures(this);
    ensureZombieTextures(this);
    this.scene.start('MainMenu');
  }
}

// ─── TEXTURE GENERATOR ───────────────────────────────────────────────────────
function ensureTextures(scene) {
  const tex = scene.textures;
  const missing = k => !tex.exists(k) || tex.get(k).key === '__MISSING';

  if (missing('player')) {
    const c = tex.createCanvas('player', 40, 56); const ctx = c.getContext();
    ctx.fillStyle='#222244'; ctx.fillRect(8,2,24,12); ctx.fillRect(6,10,28,4);
    ctx.fillStyle='#F4C27F'; ctx.beginPath(); ctx.arc(20,22,8,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#111'; ctx.fillRect(14,20,3,3); ctx.fillRect(23,20,3,3);
    ctx.fillStyle='#2E6EAA'; ctx.fillRect(10,30,20,16); ctx.fillRect(0,31,16,7);
    ctx.fillStyle='#888'; ctx.fillRect(0,32,14,3);
    ctx.fillStyle='#1A4A7A'; ctx.fillRect(11,46,8,10); ctx.fillRect(21,46,8,10);
    ctx.fillStyle='#111'; ctx.fillRect(10,53,10,3); ctx.fillRect(20,53,10,3);
    c.refresh();
  }

  if (missing('enemy_1')) {
    const c = tex.createCanvas('enemy_1', 32, 32); const ctx = c.getContext();
    ctx.fillStyle='#CC2222'; ctx.fillRect(6,4,20,18); ctx.fillRect(4,6,24,14);
    ctx.fillStyle='#FFDD44';
    ctx.beginPath(); ctx.arc(11,11,3,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(21,11,3,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#111';
    ctx.beginPath(); ctx.arc(11,11,1.5,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(21,11,1.5,0,Math.PI*2); ctx.fill();
    ctx.fillRect(10,16,12,3);
    ctx.fillStyle='#881111'; ctx.fillRect(8,22,4,10); ctx.fillRect(20,22,4,10);
    ctx.fillStyle='#111'; ctx.fillRect(6,29,8,3); ctx.fillRect(18,29,8,3);
    c.refresh();
  }

  if (missing('enemy_2')) {
    const c = tex.createCanvas('enemy_2', 48, 52); const ctx = c.getContext();
    ctx.fillStyle='#881111'; ctx.fillRect(16,0,3,10); ctx.fillRect(29,0,3,8);
    ctx.fillStyle='#FFDD44'; ctx.beginPath(); ctx.arc(17,0,3,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#FF8844'; ctx.beginPath(); ctx.arc(30,0,3,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#BB1111'; ctx.fillRect(5,12,38,24); ctx.fillRect(8,10,32,4);
    ctx.fillStyle='#FFDD44';
    ctx.beginPath(); ctx.arc(15,20,5,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(33,20,5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#111';
    ctx.beginPath(); ctx.arc(15,20,3,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(33,20,3,0,Math.PI*2); ctx.fill();
    ctx.fillRect(10,27,28,7);
    ctx.fillStyle='#FFDD44'; [13,18,27,32].forEach(x=>ctx.fillRect(x,29,4,5));
    ctx.fillStyle='#770A0A'; [8,16,28,36].forEach(x=>ctx.fillRect(x,36,4,15));
    ctx.fillStyle='#111'; [5,13,25,33].forEach(x=>ctx.fillRect(x,48,10,4));
    c.refresh();
  }

  if (missing('background')) {
    const c = tex.createCanvas('background', W, H); const ctx = c.getContext();
    const g = ctx.createLinearGradient(0,0,0,H*0.85);
    g.addColorStop(0,'#0a0e2a'); g.addColorStop(0.5,'#0f1f44'); g.addColorStop(1,'#1a2f5a');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H*0.85);
    ctx.fillStyle='rgba(255,255,255,0.8)';
    for(let i=0;i<80;i++){
      ctx.beginPath(); ctx.arc(Math.random()*W, Math.random()*H*0.75, Math.random()<0.2?1.5:0.8, 0, Math.PI*2); ctx.fill();
    }
    ctx.fillStyle='#1a3a10'; ctx.fillRect(0,H*0.85,W,H*0.15);
    ctx.fillStyle='#0e2208'; ctx.fillRect(0,H*0.85,W,H*0.03);
    c.refresh();
  }

  if (missing('bullet')) {
    const c = tex.createCanvas('bullet', 6, 14); const ctx = c.getContext();
    ctx.fillStyle='#FFEE22'; ctx.fillRect(1,2,4,12);
    ctx.fillStyle='#FFFFFF'; ctx.fillRect(2,2,2,3);
    c.refresh();
  }

  if (missing('enemy_bullet')) {
    const c = tex.createCanvas('enemy_bullet', 8, 10); const ctx = c.getContext();
    ctx.fillStyle='#FF8800'; ctx.beginPath(); ctx.ellipse(4,5,3,5,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#FFCC44'; ctx.beginPath(); ctx.ellipse(4,4,2,2.5,0,0,Math.PI*2); ctx.fill();
    c.refresh();
  }

  if (missing('enemy_fast')) {
    const c = tex.createCanvas('enemy_fast', 26, 26); const ctx = c.getContext();
    ctx.fillStyle='#CC00CC';
    ctx.beginPath(); ctx.moveTo(13,2); ctx.lineTo(24,13); ctx.lineTo(13,24); ctx.lineTo(2,13); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#FF44FF';
    ctx.beginPath(); ctx.moveTo(13,5); ctx.lineTo(21,13); ctx.lineTo(13,21); ctx.lineTo(5,13); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#FFFF00'; ctx.fillRect(8,10,4,4); ctx.fillRect(14,10,4,4);
    ctx.fillStyle='#111'; ctx.fillRect(9,11,2,2); ctx.fillRect(15,11,2,2);
    c.refresh();
  }

  if (missing('enemy_tank')) {
    const c = tex.createCanvas('enemy_tank', 46, 46); const ctx = c.getContext();
    ctx.fillStyle='#1A5C1A'; ctx.fillRect(5,8,36,28);
    ctx.fillStyle='#0D3D0D'; ctx.fillRect(5,8,10,14); ctx.fillRect(31,8,10,14);
    ctx.fillStyle='#266626'; ctx.fillRect(15,10,16,24);
    ctx.fillStyle='#1A5C1A'; ctx.fillRect(12,2,22,10);
    ctx.fillStyle='#FF3333'; ctx.beginPath(); ctx.arc(18,7,4,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(28,7,4,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#FF8888'; ctx.beginPath(); ctx.arc(18,7,2,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(28,7,2,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#111'; ctx.fillRect(0,18,8,8); ctx.fillRect(38,18,8,8);
    ctx.fillStyle='#0A2A0A'; ctx.fillRect(4,36,14,8); ctx.fillRect(28,36,14,8);
    ctx.fillStyle='#333'; for(let i=0;i<3;i++){ctx.fillRect(5+i*5,37,3,6); ctx.fillRect(29+i*5,37,3,6);}
    c.refresh();
  }

  if (missing('boss_sprite')) {
    const c = tex.createCanvas('boss_sprite', 80, 72); const ctx = c.getContext();
    ctx.fillStyle='#FF6600'; ctx.fillRect(22,0,6,10); ctx.fillRect(34,0,6,12); ctx.fillRect(46,0,6,10); ctx.fillRect(10,2,6,7); ctx.fillRect(58,2,6,7);
    ctx.fillStyle='#880000'; ctx.fillRect(16,8,48,24);
    ctx.fillStyle='#FF4400'; ctx.fillRect(22,14,14,10); ctx.fillRect(44,14,14,10);
    ctx.fillStyle='#FFAA00'; ctx.fillRect(24,15,10,7); ctx.fillRect(46,15,10,7);
    ctx.fillStyle='#FFFF44'; ctx.fillRect(27,16,5,4); ctx.fillRect(49,16,5,4);
    ctx.fillStyle='#550000'; ctx.fillRect(24,26,32,5);
    ctx.fillStyle='#FFAAAA'; [25,30,35,40,45,50].forEach(x=>ctx.fillRect(x,27,3,4));
    ctx.fillStyle='#660000'; ctx.fillRect(8,32,64,28);
    ctx.fillStyle='#440000'; ctx.fillRect(8,32,18,14); ctx.fillRect(54,32,18,14);
    ctx.fillStyle='#333'; ctx.fillRect(0,36,10,10); ctx.fillRect(70,36,10,10);
    ctx.fillStyle='#550000'; ctx.fillRect(16,60,16,12); ctx.fillRect(48,60,16,12);
    ctx.fillStyle='#111'; ctx.fillRect(14,68,20,4); ctx.fillRect(46,68,20,4);
    c.refresh();
  }

  if (missing('laser_bullet')) {
    const c = tex.createCanvas('laser_bullet', 4, 22); const ctx = c.getContext();
    ctx.fillStyle='#00FFFF'; ctx.fillRect(0,0,4,22);
    ctx.fillStyle='#FFFFFF'; ctx.fillRect(1,0,2,8);
    c.refresh();
  }

  // ── Air Gallet–style power-up gems ──
  // P = power up weapon level | W = switch weapon | B = bomb | O = option orb | shield | slow
  const gems = [
    // key, outer colour, inner colour, symbol rects [x,y,w,h]
    ['pu_p',      '#FFAA00','#FFE066', [[8,3,6,16],[5,8,12,5]]],          // up arrow
    ['pu_w',      '#22BB44','#88FFAA', [[4,4,4,14],[9,4,4,14],[14,4,4,14]]], // 3 bars
    ['pu_b',      '#CC2200','#FF6644', [[7,5,8,8],[6,10,10,6],[9,4,4,4]]],   // bomb circle
    ['pu_option', '#0088CC','#44DDFF', [[8,2,6,18],[2,8,18,6]]],          // cross/orb
    ['pu_shield', '#2244CC','#4488FF', [[6,4,10,12],[5,10,12,6]]],         // shield shape
    ['pu_slow',   '#008888','#00DDDD', [[4,4,14,14],[7,7,8,8]]],           // diamond
  ];
  gems.forEach(([key, bg, hi, sym]) => {
    if (missing(key)) {
      const c = tex.createCanvas(key, 22, 22); const ctx = c.getContext();
      ctx.fillStyle = bg;
      ctx.beginPath(); ctx.moveTo(11,1); ctx.lineTo(21,8); ctx.lineTo(21,14); ctx.lineTo(11,21); ctx.lineTo(1,14); ctx.lineTo(1,8); ctx.closePath(); ctx.fill();
      ctx.fillStyle = hi;
      ctx.beginPath(); ctx.moveTo(11,4); ctx.lineTo(18,9); ctx.lineTo(18,13); ctx.lineTo(11,18); ctx.lineTo(4,13); ctx.lineTo(4,9); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#fff';
      sym.forEach(([x,y,w,h]) => ctx.fillRect(x,y,w,h));
      c.refresh();
    }
  });

  // Option orb (the in-game satellite sprite)
  if (missing('option_orb')) {
    const c = tex.createCanvas('option_orb', 16, 16); const ctx = c.getContext();
    ctx.fillStyle='#0088CC'; ctx.beginPath(); ctx.arc(8,8,7,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#44DDFF'; ctx.beginPath(); ctx.arc(8,8,4,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#FFFFFF'; ctx.beginPath(); ctx.arc(8,8,2,0,Math.PI*2); ctx.fill();
    c.refresh();
  }
}

// ─── SHOOTER MOBILE CONTROLS (DOM buttons, bound once for all restarts) ─────
const ShooterMobile = { left:false, right:false, enabled:false, bound:false };

function refreshShooterButtons() {
  const show = ShooterMobile.enabled && window.innerWidth < 900;
  ['btn-left','btn-right'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = show ? 'flex' : 'none';
  });
}

function bindShooterButtons() {
  if (ShooterMobile.bound) return;
  ShooterMobile.bound = true;
  const track = (id, setter) => {
    const el = document.getElementById(id); if (!el) return;
    el.addEventListener('touchstart', e => { e.preventDefault(); setter(true);  }, { passive:false });
    el.addEventListener('touchend',   e => { e.preventDefault(); setter(false); }, { passive:false });
    el.addEventListener('touchcancel',e => { e.preventDefault(); setter(false); }, { passive:false });
    el.addEventListener('mousedown',  () => setter(true));
    el.addEventListener('mouseup',    () => setter(false));
    el.addEventListener('mouseleave', () => setter(false));
  };
  track('btn-left',  v => ShooterMobile.left  = v);
  track('btn-right', v => ShooterMobile.right = v);
  window.addEventListener('resize', refreshShooterButtons);
}

// ─── SHOOTER SCENE ───────────────────────────────────────────────────────────
class ShooterScene extends Phaser.Scene {
  constructor() { super('Shooter'); }

  create() {
    this.score      = 0;
    this.wave       = 1;
    this.gameOver   = false;
    this.spawnDelay = 1500;

    // ── Air Gallet weapon system ──
    // types: 'shot', 'wide', 'laser'   levels: 1/2/3
    this.weaponType  = 'shot';
    this.weaponLevel = 1;

    // Bombs (Air Gallet–style super attack)
    this.bombs = 2;

    // Option orb (satellite follower, Air Gallet Options)
    this.option         = null;
    this.optFireTimer   = null;

    // Shield
    this.shieldHits = 0;

    // Slow-mo
    this.slowMoActive = false;
    this.effectTimers = {};

    // Boss
    this.bossActive        = false;
    this.boss              = null;
    this.bossCount         = 0;
    this.bossNextThreshold = 100;
    this.bossShootTimer    = null;

    this.trailTick = 0;

    // Background
    this.add.image(W/2, H/2, 'background').setDisplaySize(W, H);

    // Groups
    this.enemies      = this.physics.add.group();
    this.bullets      = this.physics.add.group();
    this.enemyBullets = this.physics.add.group();
    this.particles    = this.add.group();
    this.powerups     = this.physics.add.group();
    this.bossGroup    = this.physics.add.group();

    // Player
    this.player = this.physics.add.sprite(W/2, H-80, 'player')
      .setCollideWorldBounds(true).setDepth(5);
    this.player.hp = 3;

    // Shield visual
    this.shieldCircle = this.add.circle(W/2, H-80, 34, 0x4488ff, 0.25).setDepth(6).setVisible(false);
    this.shieldRing   = this.add.circle(W/2, H-80, 34, 0x4488ff, 0).setStrokeStyle(2, 0x88bbff).setDepth(7).setVisible(false);

    // ── HUD ──
    this.livesText = this.add.text(8, 8, '❤️❤️❤️', { fontSize:'18px' }).setDepth(10);
    // Weapon HUD under lives
    this.weaponHud = this.add.text(8, 30, 'SHOT Lv1', {
      fontSize:'11px', fill:'#aaffaa', stroke:'#000', strokeThickness:2, fontFamily:'Courier New'
    }).setDepth(10);

    this.scoreText = this.add.text(W/2, 8, 'SCORE: 0', {
      fontSize:'16px', fill:'#fff', stroke:'#000', strokeThickness:3, fontFamily:'Courier New'
    }).setOrigin(0.5,0).setDepth(10);

    this.waveText = this.add.text(W-8, 8, 'WAVE 1', {
      fontSize:'14px', fill:'#ffee44', stroke:'#000', strokeThickness:2, fontFamily:'Courier New'
    }).setOrigin(1,0).setDepth(10);

    // Status (shield, slow, option) under wave
    this.statusHud = this.add.text(W-8, 26, '', {
      fontSize:'10px', fill:'#aaffaa', stroke:'#000', strokeThickness:2,
      fontFamily:'Courier New', align:'right'
    }).setOrigin(1,0).setDepth(10);

    // Bomb HUD — bottom-centre, interactive (tap = use bomb)
    this.bombHud = this.add.text(W/2, H-52, 'BOMB: ●●○', {
      fontSize:'12px', fill:'#ff8844', stroke:'#000', strokeThickness:2, fontFamily:'Courier New',
      backgroundColor:'#220000', padding:{ x:6, y:4 }
    }).setOrigin(0.5, 0).setDepth(12).setInteractive({ useHandCursor:true });
    this.bombHud.on('pointerdown', () => this.useBomb());
    this.updateBombHud();

    // Boss HP bar (bottom-centre, above bomb hud)
    this.bossBarBg   = this.add.rectangle(W/2, H-72, W-20, 13, 0x222222).setDepth(12).setVisible(false);
    this.bossBarFill = this.add.rectangle(10, H-72, W-20, 11, 0x22cc22).setOrigin(0,0.5).setDepth(13).setVisible(false);
    this.bossLabel   = this.add.text(W/2, H-90, 'BOSS', {
      fontSize:'11px', fill:'#ff8888', stroke:'#000', strokeThickness:2, fontFamily:'Courier New'
    }).setOrigin(0.5).setDepth(12).setVisible(false);

    // ☰ MENU button — bottom-right corner
    const menuBtn = this.add.text(W - 8, H - 10, '☰ MENU', {
      fontSize:'13px', fill:'#fff', backgroundColor:'#1c3a0a',
      padding:{ x:10, y:5 }, fontFamily:'Courier New'
    }).setOrigin(1, 1).setDepth(20).setInteractive({ useHandCursor:true });
    menuBtn.on('pointerover',  () => menuBtn.setStyle({ fill:'#ffe14d' }));
    menuBtn.on('pointerout',   () => menuBtn.setStyle({ fill:'#fff' }));
    menuBtn.on('pointerdown',  () => Hub.go(this, 'MainMenu'));

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd    = this.input.keyboard.addKeys({ left:'A', right:'D' });
    this.bombKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

    // ESC returns to the hub menu
    this.input.keyboard.on('keydown-ESC', () => Hub.go(this, 'MainMenu'));

    // Fire timer
    this.fireTimer = this.time.addEvent({
      delay: this.getFireDelay(), callback: this.fireBullet, callbackScope: this, loop: true
    });

    // Spawn timer
    this.spawnTimer = this.time.addEvent({
      delay: this.spawnDelay, callback: this.spawnEnemy, callbackScope: this, loop: true
    });

    // ── Overlaps ──
    // Fix: only register hit when enemy has entered the screen (y > 0)
    this.physics.add.overlap(this.bullets, this.enemies,
      this.hitEnemy, (b, e) => e.y > 0, this);
    this.physics.add.overlap(this.bullets, this.bossGroup,  this.hitBoss,           null, this);
    this.physics.add.overlap(this.enemyBullets, this.player, this.playerHitByBullet, null, this);
    this.physics.add.overlap(this.enemies,      this.player, this.playerHitByEnemy,  null, this);
    this.physics.add.overlap(this.player,       this.powerups, this.collectPowerup,  null, this);

    // Mobile
    this.setupMobileControls();

    // ── NO time-based wave progression — waves advance only on boss kill ──
  }

  setupMobileControls() {
    bindShooterButtons();
    ShooterMobile.enabled = true;
    ShooterMobile.left = false;
    ShooterMobile.right = false;
    refreshShooterButtons();
    this.events.once('shutdown', () => {
      ShooterMobile.enabled = false;
      refreshShooterButtons();
    });
  }

  update() {
    if (this.gameOver) return;

    // Player movement
    const left  = this.cursors.left.isDown  || this.wasd.left.isDown  || ShooterMobile.left;
    const right = this.cursors.right.isDown || this.wasd.right.isDown || ShooterMobile.right;
    this.player.setVelocityX(left ? -220 : right ? 220 : 0);

    // Bomb key (Z)
    if (Phaser.Input.Keyboard.JustDown(this.bombKey)) this.useBomb();

    // Option orb follows player
    if (this.option && this.option.active) {
      this.option.setPosition(this.player.x - 26, this.player.y - 8);
    }

    // Shield visual
    if (this.shieldHits > 0) {
      this.shieldCircle.setPosition(this.player.x, this.player.y).setVisible(true);
      this.shieldRing.setPosition(this.player.x, this.player.y).setVisible(true);
    } else {
      this.shieldCircle.setVisible(false);
      this.shieldRing.setVisible(false);
    }

    // Bullet trails
    this.trailTick++;
    if (this.trailTick % 4 === 0) {
      const trailColor = this.weaponType === 'laser' ? 0x00ffff
                       : this.weaponType === 'wide'  ? 0xff8844 : 0xffee44;
      this.bullets.getChildren().forEach(b => this.addTrail(b.x, b.y, trailColor));
    }

    // Clean off-screen objects
    this.bullets.getChildren().forEach(b => { if (b.y < -20) b.destroy(); });
    this.enemyBullets.getChildren().forEach(b => {
      if (b.y > H+20 || b.x < -20 || b.x > W+20) b.destroy();
    });
    this.powerups.getChildren().forEach(p => { if (p.y > H+40) p.destroy(); });

    this.enemies.getChildren().forEach(e => {
      if (e.y > H+60) { e.destroy(); this.loseLife(); }
    });

    // Enemy movement patterns
    this.enemies.getChildren().forEach(e => {
      if (e.eType === 'shooter') {
        e.zigPhase = (e.zigPhase||0) + 0.04;
        e.setVelocityX(Math.sin(e.zigPhase) * 80);
      }
      if (e.eType === 'fast') {
        e.zigPhase = (e.zigPhase||0) + 0.08;
        e.setVelocityX(Math.sin(e.zigPhase) * 140);
      }
    });

    // Boss
    if (!this.bossActive && this.score >= this.bossNextThreshold) this.spawnBoss();
    if (this.bossActive && this.boss && this.boss.active) this.updateBoss();

    // Particles
    this.particles.getChildren().forEach(p => {
      p.lifespan -= 16;
      p.setAlpha(p.lifespan / p.maxLife);
      if (p.lifespan <= 0) p.destroy();
    });

    this.updateStatusHud();
  }

  // ── Trails ──
  addTrail(x, y, color) {
    const t = this.add.circle(x, y, 2, color, 0.6).setDepth(3);
    this.tweens.add({ targets:t, alpha:0, scaleX:0.1, scaleY:0.1, duration:120, onComplete:()=>t.destroy() });
  }

  // ── Weapon system (Air Gallet style) ──
  getFireDelay() {
    const base = { shot:240, wide:270, laser:80 };
    return base[this.weaponType] - (this.weaponLevel - 1) * 20;
  }

  updateFireRate() {
    if (this.fireTimer) this.fireTimer.remove();
    this.fireTimer = this.time.addEvent({
      delay: this.getFireDelay(), callback: this.fireBullet, callbackScope: this, loop: true
    });
  }

  fireBullet() {
    if (this.gameOver || !this.player.active) return;
    const x = this.player.x, y = this.player.y - 28;
    const lv = this.weaponLevel;

    if (this.weaponType === 'shot') {
      // Lv1: single  |  Lv2: double  |  Lv3: triple fan
      if (lv === 1) {
        this._spawnBullet(x, y, 0, -510);
      } else if (lv === 2) {
        this._spawnBullet(x-5, y, 0, -510);
        this._spawnBullet(x+5, y, 0, -510);
      } else {
        this._spawnBullet(x,   y, 0,   -510);
        this._spawnBullet(x-6, y, -130, -490);
        this._spawnBullet(x+6, y,  130, -490);
      }
    } else if (this.weaponType === 'wide') {
      // Lv1: 2-way  |  Lv2: 3-way  |  Lv3: 5-way
      const patterns = [
        [[-220,-460],[220,-460]],
        [[-220,-460],[0,-510],[220,-460]],
        [[-320,-420],[-180,-470],[0,-510],[180,-470],[320,-420]],
      ];
      patterns[lv-1].forEach(([vx,vy]) => this._spawnBullet(x, y, vx, vy));
    } else {
      // laser — Lv1: 1  |  Lv2: 2  |  Lv3: 3 beams
      const offsets = lv === 1 ? [0] : lv === 2 ? [-6, 6] : [-10, 0, 10];
      offsets.forEach(ox => {
        const b = this.bullets.create(x+ox, y, 'laser_bullet');
        b.setVelocityY(-720).setDepth(4);
        b.isLaser = true;
        b.damage  = lv >= 3 ? 2 : (lv === 2 ? 2 : 1);
      });
    }
  }

  _spawnBullet(x, y, vx, vy) {
    const b = this.bullets.create(x, y, 'bullet');
    b.setVelocity(vx, vy).setDepth(4);
    b.isLaser = false;
  }

  // ── Bomb super attack (Air Gallet style) ──
  useBomb() {
    if (this.bombs <= 0 || this.gameOver) return;
    this.bombs--;
    this.updateBombHud();

    // Screen flash
    const flash = this.add.rectangle(W/2, H/2, W, H, 0xffffff, 0.85).setDepth(25);
    this.tweens.add({ targets:flash, alpha:0, duration:500, onComplete:()=>flash.destroy() });
    this.cameras.main.shake(500, 0.022);

    // Kill all on-screen enemies
    this.enemies.getChildren().slice().forEach(e => {
      if (e.y > 0) {
        this.spawnExplosion(e.x, e.y, 0.8);
        this.score += this.getPoints(e.eType);
      }
      e.destroy();
    });
    this.scoreText.setText('SCORE: ' + this.score);
    this.enemyBullets.clear(true, true);

    // Hurt boss
    if (this.boss && this.boss.active) {
      this.boss.hp = Math.max(1, this.boss.hp - 10);
    }

    const txt = this.add.text(W/2, H/2, 'BOMB!', {
      fontSize:'52px', fill:'#ff8800', stroke:'#fff', strokeThickness:4, fontFamily:'Courier New'
    }).setOrigin(0.5).setDepth(22);
    this.tweens.add({ targets:txt, alpha:0, scaleX:2, scaleY:2, duration:900, onComplete:()=>txt.destroy() });
  }

  updateBombHud() {
    const filled = '●'.repeat(this.bombs);
    const empty  = '○'.repeat(Math.max(0, 3 - this.bombs));
    this.bombHud.setText('BOMB: ' + filled + empty);
  }

  // ── Enemy spawning ──
  spawnEnemy() {
    if (this.gameOver || this.bossActive) return;
    const rand = Math.random();
    let key, eType, hp, speedMult, canShoot;

    if (this.score >= 80 && rand < 0.18) {
      key='enemy_tank'; eType='tank'; hp=5; speedMult=0.5; canShoot=true;
    } else if (this.wave >= 2 && rand < 0.30) {
      key='enemy_fast'; eType='fast'; hp=1; speedMult=2.0; canShoot=false;
    } else if (this.wave >= 2 && rand < 0.60) {
      key='enemy_2'; eType='shooter'; hp=3; speedMult=1.0; canShoot=true;
    } else {
      key='enemy_1'; eType='normal'; hp=1; speedMult=1.0; canShoot=false;
    }

    const x = Phaser.Math.Between(eType==='tank'?30:20, W-(eType==='tank'?30:20));
    const e = this.enemies.create(x, -40, key).setDepth(3);
    e.eType = eType; e.hp = hp; e.zigPhase = Math.random()*Math.PI*2;

    const scoreMult = 1 + Math.floor(this.score/60)*0.06;
    e.baseSpeed = (40 + this.wave*5 + Math.random()*15) * scoreMult * speedMult;
    e.setVelocityY(e.baseSpeed * (this.slowMoActive ? 0.4 : 1));
    if (eType === 'tank') e.setScale(1.1);

    if (canShoot && this.wave >= 2) {
      this.time.addEvent({
        delay: 1400 + Math.random()*800,
        callback: () => { if (e.active && !this.gameOver) this.fireEnemyBullet(e); },
        loop: true
      });
    }
  }

  fireEnemyBullet(enemy) {
    if (!enemy.active || this.gameOver) return;
    const b = this.enemyBullets.create(enemy.x, enemy.y+20, 'enemy_bullet');
    b.setVelocityY(180 * (this.slowMoActive ? 0.4 : 1)).setDepth(4);
  }

  // ── Hit handlers ──
  hitEnemy(bullet, enemy) {
    const dmg = bullet.damage || 1;
    bullet.destroy();
    this.cameras.main.shake(50, 0.005);
    this.spawnExplosion(enemy.x, enemy.y, 0.5);
    enemy.setTint(0xffffff);
    this.time.delayedCall(60, () => { if (enemy.active) enemy.clearTint(); });

    enemy.hp -= dmg;
    if (enemy.hp <= 0) {
      this.spawnExplosion(enemy.x, enemy.y, 1.0);
      const pts = this.getPoints(enemy.eType);
      this.score += pts;
      this.scoreText.setText('SCORE: ' + this.score);

      const popup = this.add.text(enemy.x, enemy.y, '+'+pts, {
        fontSize:'16px', fill:'#ffee44', stroke:'#000', strokeThickness:2, fontFamily:'Courier New'
      }).setOrigin(0.5).setDepth(9);
      this.tweens.add({ targets:popup, y:enemy.y-40, alpha:0, duration:700, onComplete:()=>popup.destroy() });

      // 25% drop chance — Air Gallet–style gem
      if (Math.random() < 0.25) this.spawnPowerup(enemy.x, enemy.y);
      enemy.destroy();
    } else {
      this.tweens.add({ targets:enemy, alpha:0.3, duration:60, yoyo:true });
    }
  }

  getPoints(eType) {
    switch(eType) {
      case 'tank':    return 40;
      case 'fast':    return 15;
      case 'shooter': return 30;
      default:        return 10;
    }
  }

  playerHitByBullet(player, bullet) { bullet.destroy(); this.playerHit(); }

  playerHitByEnemy(player, enemy) {
    enemy.destroy();
    this.spawnExplosion(enemy.x, enemy.y, 0.8);
    this.playerHit();
  }

  playerHit() {
    if (this.player.invincible) return;

    // Option orb absorbs one hit
    if (this.option && this.option.active) {
      this.spawnExplosion(this.option.x, this.option.y, 0.5);
      this.option.destroy(); this.option = null;
      if (this.optFireTimer) { this.optFireTimer.remove(); this.optFireTimer = null; }
      this.cameras.main.shake(100, 0.007);
      const msg = this.add.text(this.player.x, this.player.y-40, 'OPTION LOST!', {
        fontSize:'13px', fill:'#44ddff', stroke:'#000', strokeThickness:2, fontFamily:'Courier New'
      }).setOrigin(0.5).setDepth(9);
      this.tweens.add({ targets:msg, alpha:0, y:this.player.y-80, duration:700, onComplete:()=>msg.destroy() });
      return;
    }

    // Shield absorbs hit
    if (this.shieldHits > 0) {
      this.shieldHits--;
      this.cameras.main.shake(100, 0.008);
      this.tweens.add({ targets:[this.shieldCircle, this.shieldRing], alpha:0.9, duration:80, yoyo:true });
      const msg = this.add.text(this.player.x, this.player.y-40, 'SHIELD!', {
        fontSize:'14px', fill:'#88bbff', stroke:'#000', strokeThickness:2, fontFamily:'Courier New'
      }).setOrigin(0.5).setDepth(9);
      this.tweens.add({ targets:msg, alpha:0, y:this.player.y-80, duration:600, onComplete:()=>msg.destroy() });
      return;
    }

    this.player.invincible = true;
    this.cameras.main.shake(220, 0.014);
    this.spawnExplosion(this.player.x, this.player.y, 0.7);
    this.player.hp--;
    this.updateLivesDisplay();
    if (this.player.hp <= 0) { this.triggerGameOver(); return; }
    this.tweens.add({
      targets:this.player, alpha:0.3, duration:100, yoyo:true, repeat:8,
      onComplete:()=>{ this.player.setAlpha(1); this.player.invincible = false; }
    });
  }

  loseLife() {
    this.player.hp--;
    this.updateLivesDisplay();
    this.cameras.main.shake(150, 0.008);
    if (this.player.hp <= 0) this.triggerGameOver();
  }

  updateLivesDisplay() {
    const hp = Math.max(0, this.player.hp);
    this.livesText.setText('❤️'.repeat(hp) + '🖤'.repeat(3-hp));
  }

  // ── Boss system ──
  spawnBoss() {
    this.bossActive = true;
    this.bossCount++;
    this.spawnTimer.paused = true;
    this.enemies.clear(true, true);

    const warn = this.add.text(W/2, H/3, '⚠ BOSS INCOMING ⚠', {
      fontSize:'22px', fill:'#ff4444', stroke:'#000', strokeThickness:4, fontFamily:'Courier New'
    }).setOrigin(0.5).setDepth(20);
    this.cameras.main.shake(600, 0.014);
    this.tweens.add({ targets:warn, alpha:0, scaleX:1.5, scaleY:1.5, duration:1800, onComplete:()=>warn.destroy() });

    this.time.delayedCall(1500, () => {
      if (this.gameOver) return;
      const maxHp = 30 + this.bossCount * 15;
      this.boss = this.bossGroup.create(W/2, -55, 'boss_sprite').setDepth(4);
      this.boss.maxHp = maxHp; this.boss.hp = maxHp;
      this.boss.phase = 1; this.boss.dirX = 1;
      this.boss.setVelocityY(55);

      this.bossBarBg.setVisible(true);
      this.bossBarFill.setVisible(true).setSize(W-20, 11);
      this.bossLabel.setText('PHASE 1').setFill('#88ff88').setVisible(true);

      if (this.bossShootTimer) this.bossShootTimer.remove();
      this.bossShootTimer = this.time.addEvent({
        delay:1200, callback:this.bossFire, callbackScope:this, loop:true
      });
    });
  }

  updateBoss() {
    const b = this.boss;
    const ratio = b.hp / b.maxHp;
    const newPhase = ratio > 0.66 ? 1 : ratio > 0.33 ? 2 : 3;
    if (newPhase !== b.phase) { b.phase = newPhase; this.bossPhaseChange(newPhase); }

    if (b.y < 110) {
      b.setVelocityY(55);
    } else {
      b.y = Math.min(b.y, 115); b.setVelocityY(0);
      const spd = b.phase===3?160 : b.phase===2?95 : 60;
      b.setVelocityX(b.dirX * spd);
      if (b.x <= 50)   b.dirX =  1;
      if (b.x >= W-50) b.dirX = -1;
    }

    const bw = Math.max(1, (W-24) * ratio);
    this.bossBarFill.setSize(bw, 11);
    this.bossBarFill.setFillStyle(ratio>0.66 ? 0x22cc22 : ratio>0.33 ? 0xff8800 : 0xff2222);
  }

  bossPhaseChange(phase) {
    const labels = {1:'PHASE 1', 2:'PHASE 2 - ARMED', 3:'!! RAGE !!'};
    const colors = {1:'#88ff88', 2:'#ffaa44', 3:'#ff3333'};
    this.bossLabel.setText(labels[phase]).setFill(colors[phase]);
    const txt = this.add.text(W/2, H/2-20, phase===2?'PHASE 2!':'RAGE MODE!', {
      fontSize:'32px', fill:phase===3?'#ff3333':'#ff8800', stroke:'#000', strokeThickness:4, fontFamily:'Courier New'
    }).setOrigin(0.5).setDepth(20);
    this.tweens.add({ targets:txt, alpha:0, scaleX:1.8, scaleY:1.8, duration:1000, onComplete:()=>txt.destroy() });
    this.cameras.main.shake(300, 0.016);
    if (phase === 3) {
      this.boss.setTint(0xff5555);
      if (this.bossShootTimer) this.bossShootTimer.reset({ delay:450, callback:this.bossFire, callbackScope:this, loop:true });
    } else if (phase === 2) {
      if (this.bossShootTimer) this.bossShootTimer.reset({ delay:900, callback:this.bossFire, callbackScope:this, loop:true });
    }
  }

  bossFire() {
    if (!this.boss || !this.boss.active || this.boss.phase < 2 || this.gameOver) return;
    if (this.boss.phase === 3) {
      for (let i=-1; i<=1; i++) {
        const b = this.enemyBullets.create(this.boss.x+i*22, this.boss.y+32, 'enemy_bullet');
        b.setVelocity(i*90, 230).setDepth(4);
      }
    } else {
      const dx = this.player.x-this.boss.x, dy = this.player.y-this.boss.y;
      const d = Math.sqrt(dx*dx+dy*dy)||1;
      const b = this.enemyBullets.create(this.boss.x, this.boss.y+32, 'enemy_bullet');
      b.setVelocity((dx/d)*200, (dy/d)*200).setDepth(4);
    }
  }

  hitBoss(bullet, boss) {
    if (!boss.active) return;
    bullet.destroy();
    this.cameras.main.shake(80, 0.009);
    boss.hp -= (bullet.damage||1);
    this.tweens.add({ targets:boss, alpha:0.4, duration:80, yoyo:true });
    this.spawnExplosion(boss.x+Phaser.Math.Between(-24,24), boss.y+Phaser.Math.Between(-20,20), 0.7);

    if (boss.hp <= 0) {
      this.spawnExplosion(boss.x, boss.y, 2.5);
      this.cameras.main.shake(700, 0.028);
      if (this.bossShootTimer) { this.bossShootTimer.remove(); this.bossShootTimer = null; }

      const reward = 100 + this.bossCount * 50;
      this.score += reward;
      this.scoreText.setText('SCORE: ' + this.score);
      // Next boss is always 200pts of normal play away from THIS moment
      this.bossNextThreshold = this.score + 200;

      const defeated = this.add.text(W/2, H/2-20, 'BOSS DEFEATED!\n+'+reward, {
        fontSize:'26px', fill:'#ffee44', stroke:'#000', strokeThickness:4, fontFamily:'Courier New', align:'center'
      }).setOrigin(0.5).setDepth(20);
      this.tweens.add({ targets:defeated, alpha:0, y:H/2-90, duration:2200, onComplete:()=>defeated.destroy() });

      boss.destroy(); this.boss = null; this.bossActive = false;
      this.bossBarBg.setVisible(false);
      this.bossBarFill.setVisible(false);
      this.bossLabel.setVisible(false);

      // Drop gems on boss kill (Air Gallet style — guaranteed rewards)
      const bossDrop = ['p','p','w','pu_option','pu_shield'];
      for (let i=0; i<3; i++) {
        this.time.delayedCall(i*280, () => {
          if (!this.gameOver)
            this.spawnPowerup(W/2+Phaser.Math.Between(-70,70), H/2+Phaser.Math.Between(-30,30), bossDrop[i]);
        });
      }

      // Resume enemies then advance wave
      this.time.delayedCall(2000, () => {
        if (!this.gameOver) {
          this.spawnTimer.paused = false;
          this.nextWave();           // ← wave only advances here, on boss kill
        }
      });
    }
  }

  // ── Power-ups (Air Gallet style) ──
  spawnPowerup(x, y, forceType) {
    // Weighted pool: P is most common so players feel progress
    const pool = ['p','p','p','w','b','pu_shield','pu_slow','pu_option'];
    const type = forceType || Phaser.Utils.Array.GetRandom(pool);
    const texKey = type.startsWith('pu_') ? type : 'pu_' + type;
    const p = this.powerups.create(x, y, texKey).setDepth(6);
    p.puType = type;
    p.setVelocityY(85);
    this.tweens.add({ targets:p, angle:360, duration:1800, repeat:-1, ease:'Linear' });
  }

  collectPowerup(player, pu) {
    const type = pu.puType;
    this.tweens.killTweensOf(pu);
    pu.destroy();
    this.activatePowerup(type);

    const labels = {
      p:         'POWER UP! Lv' + Math.min(3, this.weaponLevel+1),
      w:         'WEAPON SWITCH!',
      b:         'BOMB +1!',
      pu_option: 'OPTION GET!',
      pu_shield: 'SHIELD x3',
      pu_slow:   'SLOW MOTION!',
      // legacy aliases (from old drops)
      shield:    'SHIELD x3',
      slow:      'SLOW MOTION!',
    };
    const colors = {
      p:'#FFCC00', w:'#44FF88', b:'#FF4422', pu_option:'#44DDFF',
      pu_shield:'#4488FF', pu_slow:'#00CCCC', shield:'#4488FF', slow:'#00CCCC'
    };
    const msg = this.add.text(W/2, H/2-55, labels[type]||'POWERUP!', {
      fontSize:'18px', fill:colors[type]||'#fff', stroke:'#000', strokeThickness:3, fontFamily:'Courier New'
    }).setOrigin(0.5).setDepth(20);
    this.tweens.add({ targets:msg, alpha:0, y:H/2-110, duration:1400, onComplete:()=>msg.destroy() });
    this.cameras.main.shake(80, 0.005);
  }

  activatePowerup(type) {
    switch(type) {
      // P gem: weapon level up
      case 'p':
        this.weaponLevel = Math.min(3, this.weaponLevel + 1);
        this.updateFireRate();
        this.updateWeaponHud();
        break;

      // W gem: cycle weapon type, reset level to 1
      case 'w': {
        const cycle = { shot:'wide', wide:'laser', laser:'shot' };
        this.weaponType  = cycle[this.weaponType];
        this.weaponLevel = 1;
        this.updateFireRate();
        this.updateWeaponHud();
        break;
      }

      // B gem: gain bomb
      case 'b':
        this.bombs = Math.min(3, this.bombs + 1);
        this.updateBombHud();
        break;

      // Option orb: satellite that shoots and absorbs one hit
      case 'pu_option':
      case 'option':
        if (this.option && this.option.active) this.option.destroy();
        if (this.optFireTimer) this.optFireTimer.remove();
        this.option = this.add.sprite(this.player.x-26, this.player.y-8, 'option_orb').setDepth(5);
        this.tweens.add({ targets:this.option, scaleX:1.2, scaleY:1.2, duration:400, yoyo:true, repeat:-1 });
        this.optFireTimer = this.time.addEvent({
          delay:320, callback:this.optionFire, callbackScope:this, loop:true
        });
        break;

      case 'shield':
      case 'pu_shield':
        this.shieldHits = 3;
        break;

      case 'slow':
      case 'pu_slow':
        if (!this.slowMoActive) {
          this.slowMoActive = true;
          const f = 0.4;
          this.enemies.getChildren().forEach(e => { e.body.velocity.y*=f; e.body.velocity.x*=f; });
          this.enemyBullets.getChildren().forEach(b => { b.body.velocity.y*=f; b.body.velocity.x*=f; });
          if (this.boss&&this.boss.active) this.boss.body.velocity.x*=f;
        }
        if (this.effectTimers.slow) this.effectTimers.slow.remove();
        this.effectTimers.slow = this.time.delayedCall(2000, () => {
          if (!this.slowMoActive) return;
          this.slowMoActive = false;
          const inv = 1/0.4;
          this.enemies.getChildren().forEach(e => {
            e.body.velocity.y = Math.min(e.body.velocity.y*inv, e.baseSpeed||100);
            e.body.velocity.x *= inv;
          });
          this.enemyBullets.getChildren().forEach(b => { b.body.velocity.y*=inv; b.body.velocity.x*=inv; });
        });
        break;
    }
  }

  optionFire() {
    if (!this.option || !this.option.active || this.gameOver) return;
    const b = this.bullets.create(this.option.x, this.option.y-10, 'bullet');
    b.setVelocityY(-480).setDepth(4);
    b.isLaser = false;
  }

  updateWeaponHud() {
    const names = { shot:'SHOT', wide:'WIDE', laser:'LASER' };
    const lvColors = ['#aaffaa','#ffee44','#00ffff'];
    this.weaponHud.setText(names[this.weaponType]+' Lv'+this.weaponLevel)
      .setFill(lvColors[this.weaponLevel-1]);
  }

  updateStatusHud() {
    const lines = [];
    if (this.shieldHits > 0) lines.push('SHLD x'+this.shieldHits);
    if (this.slowMoActive)   lines.push('SLOW');
    if (this.option&&this.option.active) lines.push('OPT ON');
    this.statusHud.setText(lines.join('\n'));
  }

  // ── Explosion ──
  spawnExplosion(x, y, scale) {
    const colors = [0xff6600, 0xffaa00, 0xffee44, 0xffffff];
    for (let i=0; i<8; i++) {
      const px = this.add.circle(x, y, (3+Math.random()*4)*scale, Phaser.Utils.Array.GetRandom(colors)).setDepth(8);
      px.maxLife = px.lifespan = 300 + Math.random()*300;
      const angle = Math.random()*Math.PI*2;
      const spd   = (50+Math.random()*120)*scale;
      this.tweens.add({
        targets:px, x:px.x+Math.cos(angle)*spd, y:px.y+Math.sin(angle)*spd,
        alpha:0, scaleX:0.1, scaleY:0.1, duration:px.maxLife, ease:'Power2',
        onComplete:()=>px.destroy()
      });
      this.particles.add(px);
    }
    const boom = this.add.text(x, y-10, 'BOOM!', {
      fontSize:Math.floor(14*scale)+'px', fill:'#ffee44', stroke:'#cc4400', strokeThickness:2, fontFamily:'Courier New'
    }).setOrigin(0.5).setDepth(9);
    this.tweens.add({ targets:boom, y:y-50, alpha:0, scaleX:1.5, scaleY:1.5, duration:500, onComplete:()=>boom.destroy() });
  }

  // ── Wave progression — ONLY called when boss dies ──
  nextWave() {
    if (this.gameOver) return;
    this.wave++;
    this.waveText.setText('WAVE ' + this.wave);
    this.spawnDelay = Math.max(700, 1500 - (this.wave-1)*100);
    this.spawnTimer.reset({ delay:this.spawnDelay, callback:this.spawnEnemy, callbackScope:this, loop:true });

    const msg = this.add.text(W/2, H/2, 'WAVE ' + this.wave + ' BEGIN!', {
      fontSize:'34px', fill:'#ffee44', stroke:'#000', strokeThickness:4, fontFamily:'Courier New'
    }).setOrigin(0.5).setDepth(20);
    this.tweens.add({ targets:msg, alpha:0, scaleX:1.8, scaleY:1.8, duration:1400, onComplete:()=>msg.destroy() });
  }

  // ── Game Over ──
  triggerGameOver() {
    this.gameOver = true;
    this.spawnTimer.remove();
    if (this.bossShootTimer) { this.bossShootTimer.remove(); this.bossShootTimer = null; }
    if (this.optFireTimer)   { this.optFireTimer.remove();   this.optFireTimer   = null; }
    Object.values(this.effectTimers).forEach(t => { if(t) t.remove(); });

    this.player.setVelocity(0).setActive(false).setVisible(false);
    this.enemies.clear(true,true); this.bullets.clear(true,true);
    this.enemyBullets.clear(true,true); this.bossGroup.clear(true,true);
    this.powerups.clear(true,true);
    if (this.option) { this.option.destroy(); this.option = null; }

    this.bossBarBg.setVisible(false); this.bossBarFill.setVisible(false); this.bossLabel.setVisible(false);
    this.shieldCircle.setVisible(false); this.shieldRing.setVisible(false);
    this.bombHud.setVisible(false);

    this.spawnExplosion(this.player.x, this.player.y, 1.5);

    const overlay = this.add.rectangle(W/2, H/2, W, H, 0x000000, 0.65).setDepth(15);
    this.tweens.add({ targets:overlay, alpha:0.65, duration:500 });

    this.add.text(W/2, H/2-110, 'GAME OVER', {
      fontSize:'40px', fill:'#ff4444', stroke:'#000', strokeThickness:5, fontFamily:'Courier New'
    }).setOrigin(0.5).setDepth(20);
    this.add.text(W/2, H/2-40, 'SCORE: '+this.score, {
      fontSize:'28px', fill:'#ffee44', stroke:'#000', strokeThickness:3, fontFamily:'Courier New'
    }).setOrigin(0.5).setDepth(20);
    this.add.text(W/2, H/2+10, 'WAVE: '+this.wave, {
      fontSize:'20px', fill:'#aaddff', stroke:'#000', strokeThickness:2, fontFamily:'Courier New'
    }).setOrigin(0.5).setDepth(20);

    const btn = this.add.text(W/2, H/2+80, '[ PLAY AGAIN ]', {
      fontSize:'22px', fill:'#fff', stroke:'#ff8800', strokeThickness:3,
      backgroundColor:'#333300', padding:{x:16,y:10}, fontFamily:'Courier New'
    }).setOrigin(0.5).setDepth(20).setInteractive({ useHandCursor:true });
    btn.on('pointerover', ()=>btn.setStyle({fill:'#ffee44'}));
    btn.on('pointerout',  ()=>btn.setStyle({fill:'#fff'}));
    btn.on('pointerdown', ()=>this.scene.restart());

    const menuBtn = this.add.text(W/2, H/2+140, '[ MENU ]', {
      fontSize:'18px', fill:'#fff', stroke:'#4488cc', strokeThickness:3,
      backgroundColor:'#112233', padding:{x:16,y:8}, fontFamily:'Courier New'
    }).setOrigin(0.5).setDepth(20).setInteractive({ useHandCursor:true });
    menuBtn.on('pointerover', ()=>menuBtn.setStyle({fill:'#88ccff'}));
    menuBtn.on('pointerout',  ()=>menuBtn.setStyle({fill:'#fff'}));
    menuBtn.on('pointerdown', ()=>Hub.go(this, 'MainMenu'));

    this.input.keyboard.once('keydown-ENTER', ()=>this.scene.restart());
    this.input.keyboard.once('keydown-R',     ()=>this.scene.restart());
    this.add.text(W/2, H/2+190, 'ENTER/R restart · ESC menu', {
      fontSize:'13px', fill:'#aaaaaa', fontFamily:'Courier New'
    }).setOrigin(0.5).setDepth(20);
  }
}
