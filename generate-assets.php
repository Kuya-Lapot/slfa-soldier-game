<?php
// Stage 2: Asset Generation via PHP GD
// Draws pixel-art sprites inspired by the child's drawing

function saveImg($img, $path) {
    imagepng($img, $path);
    imagedestroy($img);
    echo "Created: $path\n";
}

function hex2rgb($hex) {
    return [hexdec(substr($hex,0,2)), hexdec(substr($hex,2,2)), hexdec(substr($hex,4,2))];
}

function c($img, $hex, $alpha = 0) {
    [$r,$g,$b] = hex2rgb($hex);
    return $alpha > 0 ? imagecolorallocatealpha($img, $r, $g, $b, $alpha) : imagecolorallocate($img, $r, $g, $b);
}

// ─── PLAYER (40x56) — blue soldier with beret ──────────────────────────────
$p = imagecreatetruecolor(40, 56);
imagesavealpha($p, true);
$trans = imagecolorallocatealpha($p, 0, 0, 0, 127);
imagefill($p, 0, 0, $trans);

$beret    = c($p, '222244');
$skin     = c($p, 'F4C27F');
$blue     = c($p, '2E6EAA');
$darkblue = c($p, '1A4A7A');
$black    = c($p, '111111');
$metal    = c($p, '888888');
$white    = c($p, 'FFFFFF');

// beret (rows 0-6, centered cols 10-30)
imagefilledellipse($p, 20, 5, 22, 12, $beret);
imagefilledrectangle($p, 10, 6, 30, 12, $beret);
// beret brim
imagefilledrectangle($p, 8, 11, 32, 14, $black);

// head (rows 14-26)
imagefilledellipse($p, 20, 20, 16, 16, $skin);
// eyes
imagefilledrectangle($p, 14, 18, 16, 21, $black);
imagefilledrectangle($p, 22, 18, 24, 21, $black);
// mouth
imagefilledrectangle($p, 15, 24, 25, 25, $black);

// body/torso (rows 28-40)
imagefilledrectangle($p, 12, 27, 28, 42, $blue);
// belt
imagefilledrectangle($p, 12, 38, 28, 40, $darkblue);
// backpack
imagefilledrectangle($p, 26, 28, 32, 42, $darkblue);

// left arm + gun (rows 28-36, extending left)
imagefilledrectangle($p, 2, 29, 16, 36, $blue);
// gun barrel
imagefilledrectangle($p, 0, 31, 12, 33, $metal);
imagefilledrectangle($p, 0, 30, 6, 35, $black);

// right arm
imagefilledrectangle($p, 28, 29, 36, 36, $blue);

// legs (rows 42-56)
imagefilledrectangle($p, 13, 42, 20, 56, $darkblue);
imagefilledrectangle($p, 22, 42, 29, 56, $darkblue);
// boots
imagefilledrectangle($p, 12, 53, 21, 56, $black);
imagefilledrectangle($p, 21, 53, 30, 56, $black);

saveImg($p, 'assets/player.png');

// ─── ENEMY 1 (32x32) — small red spider-alien ──────────────────────────────
$e1 = imagecreatetruecolor(32, 32);
imagesavealpha($e1, true);
imagefill($e1, 0, 0, imagecolorallocatealpha($e1, 0, 0, 0, 127));

$red  = c($e1, 'CC2222');
$dred = c($e1, '881111');
$blk  = c($e1, '111111');
$yel  = c($e1, 'FFDD44');

// body square
imagefilledrectangle($e1, 6, 4, 26, 22, $red);
imagefilledrectangle($e1, 4, 6, 28, 20, $red);
// dark shading
imagefilledrectangle($e1, 6, 4, 7, 22, $dred);
imagefilledrectangle($e1, 25, 4, 26, 22, $dred);
imagefilledrectangle($e1, 6, 21, 26, 22, $dred);

// eyes (glowing yellow)
imagefilledellipse($e1, 11, 11, 6, 7, $yel);
imagefilledellipse($e1, 21, 11, 6, 7, $yel);
imagefilledellipse($e1, 11, 11, 3, 4, $blk);
imagefilledellipse($e1, 21, 11, 3, 4, $blk);

// mouth
imagefilledrectangle($e1, 10, 17, 22, 19, $blk);
imagefilledrectangle($e1, 13, 15, 15, 17, $blk);
imagefilledrectangle($e1, 17, 15, 19, 17, $blk);

// legs (2 legs hanging)
imagefilledrectangle($e1, 8, 22, 11, 31, $dred);
imagefilledrectangle($e1, 21, 22, 24, 31, $dred);
// leg feet
imagefilledrectangle($e1, 6, 29, 13, 32, $blk);
imagefilledrectangle($e1, 19, 29, 26, 32, $blk);

saveImg($e1, 'assets/enemies/enemy_1.png');

// ─── ENEMY 2 (48x52) — large red monster with antennas ─────────────────────
$e2 = imagecreatetruecolor(48, 52);
imagesavealpha($e2, true);
imagefill($e2, 0, 0, imagecolorallocatealpha($e2, 0, 0, 0, 127));

$R  = c($e2, 'BB1111');
$DR = c($e2, '770A0A');
$B  = c($e2, '111111');
$Y  = c($e2, 'FFDD44');
$O  = c($e2, 'EE6622');

// antennas
imagefilledrectangle($e2, 17, 0, 19, 10, $DR);
imagefilledellipse($e2, 18, 0, 5, 5, $Y);
imagefilledrectangle($e2, 29, 0, 31, 8, $DR);
imagefilledellipse($e2, 30, 0, 5, 5, $O);

// head/body (rows 8-35)
imagefilledellipse($e2, 24, 22, 38, 30, $R);
imagefilledrectangle($e2, 8, 12, 40, 36, $R);
imagefilledrectangle($e2, 5, 16, 43, 34, $R);
// shading
imagefilledrectangle($e2, 5, 16, 7, 34, $DR);
imagefilledrectangle($e2, 41, 16, 43, 34, $DR);
imagefilledrectangle($e2, 8, 34, 40, 36, $DR);

// eyes (big angry)
imagefilledellipse($e2, 15, 19, 9, 10, $Y);
imagefilledellipse($e2, 33, 19, 9, 10, $Y);
imagefilledellipse($e2, 15, 20, 5, 6, $B);
imagefilledellipse($e2, 33, 20, 5, 6, $B);
// angry brow
imagefilledrectangle($e2, 11, 13, 19, 15, $B);
imagefilledrectangle($e2, 29, 13, 37, 15, $B);
// slant
imageline($e2, 10, 13, 18, 16, $B);
imageline($e2, 11, 13, 19, 16, $B);
imageline($e2, 30, 16, 38, 13, $B);
imageline($e2, 29, 16, 37, 13, $B);

// wide evil mouth
imagefilledrectangle($e2, 11, 27, 37, 34, $B);
imagefilledrectangle($e2, 13, 29, 16, 34, $Y);
imagefilledrectangle($e2, 18, 29, 21, 34, $Y);
imagefilledrectangle($e2, 27, 29, 30, 34, $Y);
imagefilledrectangle($e2, 32, 29, 35, 34, $Y);

// legs (4 legs)
imagefilledrectangle($e2, 8, 36, 12, 51, $DR);
imagefilledrectangle($e2, 16, 36, 20, 51, $DR);
imagefilledrectangle($e2, 28, 36, 32, 51, $DR);
imagefilledrectangle($e2, 36, 36, 40, 51, $DR);
// feet
imagefilledrectangle($e2, 5, 48, 15, 52, $B);
imagefilledrectangle($e2, 13, 48, 23, 52, $B);
imagefilledrectangle($e2, 25, 48, 35, 52, $B);
imagefilledrectangle($e2, 33, 48, 43, 52, $B);

saveImg($e2, 'assets/enemies/enemy_2.png');

// ─── BACKGROUND (480x640) — dark night sky with ground ──────────────────────
$bg = imagecreatetruecolor(480, 640);

// Dark gradient sky (navy → midnight blue)
for ($y = 0; $y < 544; $y++) {
    $ratio = $y / 544;
    $r = (int)(10  + $ratio * 16);
    $g = (int)(14  + $ratio * 33);
    $b = (int)(42  + $ratio * 48);
    $col = imagecolorallocate($bg, $r, $g, $b);
    imagefilledrectangle($bg, 0, $y, 479, $y, $col);
}

// Stars
mt_srand(42);
for ($i = 0; $i < 120; $i++) {
    $sx = mt_rand(0, 479);
    $sy = mt_rand(0, 440);
    $br = mt_rand(140, 255);
    $star = imagecolorallocate($bg, $br, $br, $br);
    if ($i % 5 === 0) {
        imagefilledellipse($bg, $sx, $sy, 3, 3, $star);
    } else {
        imagesetpixel($bg, $sx, $sy, $star);
    }
}

// Subtle dark clouds
$cloud = imagecolorallocatealpha($bg, 255, 255, 255, 120);
imagefilledellipse($bg, 80,  80,  140, 55, $cloud);
imagefilledellipse($bg, 120, 75,  100, 45, $cloud);
imagefilledellipse($bg, 50,  85,  80,  40, $cloud);
imagefilledellipse($bg, 350, 140, 160, 60, $cloud);
imagefilledellipse($bg, 400, 135, 110, 50, $cloud);

// Dark ground
$gnd  = imagecolorallocate($bg, 26,  58, 16);
$gnd2 = imagecolorallocate($bg, 14,  34,  8);
imagefilledrectangle($bg, 0, 544, 479, 640, $gnd);
imagefilledrectangle($bg, 0, 544, 479, 558, $gnd2);
for ($x = 0; $x < 480; $x += 30) {
    imageline($bg, $x, 558, $x+15, 640, $gnd2);
}

saveImg($bg, 'assets/background.png');

// ─── BULLET (6x12) ──────────────────────────────────────────────────────────
$bul = imagecreatetruecolor(6, 12);
imagesavealpha($bul, true);
imagefill($bul, 0, 0, imagecolorallocatealpha($bul, 0, 0, 0, 127));
$yc = c($bul, 'FFEE22');
$wc = c($bul, 'FFFFFF');
imagefilledrectangle($bul, 1, 0, 4, 11, $yc);
imagefilledrectangle($bul, 2, 0, 3, 3, $wc);
saveImg($bul, 'assets/bullet.png');

// ─── ENEMY BULLET (6x10) ────────────────────────────────────────────────────
$eb = imagecreatetruecolor(6, 10);
imagesavealpha($eb, true);
imagefill($eb, 0, 0, imagecolorallocatealpha($eb, 0, 0, 0, 127));
$oc = c($eb, 'FF8800');
$rc = c($eb, 'FFCC44');
imagefilledellipse($eb, 3, 5, 5, 9, $oc);
imagefilledellipse($eb, 3, 4, 3, 5, $rc);
saveImg($eb, 'assets/enemy_bullet.png');

echo "All assets generated successfully!\n";
