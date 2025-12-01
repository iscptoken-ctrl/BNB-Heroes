const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const healthFill = document.getElementById('healthFill');
const levelEl = document.getElementById('level');
const expEl = document.getElementById('exp');
const expNextEl = document.getElementById('expNext');
const enemyCountEl = document.getElementById('enemyCount');

// Base64 Sprite'lar (dosyasız, direkt kodda!)
const playerBase64 = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABQklEQVRYhWNgGAUjHTCSq/HWUoX/yHy16AdkmUWWJnTLKXEEyRpwWU6uI0hSTMhychxBtEKY5apR9xkYGBgYbi9TRJFHFyfWEUzEOoBWgIVUDeg+JyROCAx4CBDtAFicblzwGa+6jQs+0yYRdrsKw3OAfwIvXgfAQOnutwTNJ6gA2WJCDlCLfsCITT0+h+BMhNgMQraIlKIYZhY2h2A4AJ/FMPD/OsN/BoYHGGKMmvhDFJtDqJoLIA4jDQydbDhsHUBSUVwy6S3RanryhKnnAGIsJtcheB1QuvstIzkpG92MAwcO/D/dGoxVHmsaKN39lhGWVwnlbXwAptfBwYHxq3Uug2n1WsIOwFZakeMIXHrQzSfJYGKjA5flDQ0N/x0cHBgcHBzg8iTlApjBuBxCSXTRDRw4cOD/gQMHKErYo4CqAABSyIHYXpwtTgAAAABJRU5ErkJggg==';
const enemyBase64 = 'iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAA9klEQVRIie2UQRKCMAxFU8YT0QVeSQ+kV5JFudJ3oZ0JIW1SpjiO419Rkv5HQlOiX1do3fAYR/D1eVmaPJqSJWwP1J1YgrVCXUkAQEQ0x6jGp5ReZiGYfmYCAFD2ATbQKSXicQs6WMDeMoFzjESAWp0nLmW21DosUtbhcR0aL9RzUr9zLDg0jwD/X10HH0TryiAKFVMQDM+TG+RU3lcCqy9dsFxpZc41aLFCU/YtVvqItfa2sgIIYk10Y5BLR9idPV/frIEvZNIROvTy5oXkLg5asEeVpbFYVSih1hCXQLV9ZkuzQc2kliPbugFqfdeMPR/y10f0BG1uWAACK0I/AAAAAElFTkSuQmCC';
const bossBase64 = 'iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACQklEQVRoge2Yv27CMBDGzxFTkSqmjpU781KoT8DUNWZl6hNU8FDsiJEpQqKrO6QOjuM/d7aTQJvfhIji3Ofv7nwJwB0hpZSx97KcgaSgi2CMkeMq8oaDRw/cdCLGmVGE+ESE/ncxeGqRA0SmWZIjO16RgopJGSmlFCCC90U5ogtYHReoNUIiNmwTXEOAcD6L7AjVBQCcE6Usg+v4nEEL2fFKxoigkCJmhnlAqgBX2pRS/F4XKcsDQMCRHC64drCUoq5QdhPE+Tp6TaeQPtOoEaFwiCmlaP4P0RGSsxYwbdMG5+takOGYb+2WkL6LWbFhAkB/krTXyZ5X9Q+HGJ0CYJiOZNKIcYhQ7Hl1E+RhNrQAHUq32r9VAPDpvF5gT+Z7oKkdCwVAPWY8miCTVrHnFuObjVLhfN1qTp32+2juKDHOEWV1XLCYRrBdnjr3fB++qMuQ2PFKemct5UxIkC34IVkdFww1/fpSDSPiaflOiYuEio1cC6Y75/kFfW8oxbBDI0B3c0kvVtvlSVICN8nljC1DUO8jAO0UUmJers/kIJSYmAbgS3FUavVZzLogX2qFjgS0I33RSrdr9/p5foGPw2tww4M1MmZrVSmMiWF0R2zENJSWkNg3upzEdsXRPmLbSGntTRHZ3FDT69gjSJZifxQYgN8NxViuYNwAIDiCXTAnlGcyjBsmfbsTs2lRNdKnO7Frdw5E7Hu2/sBUh3JsTJaTPUZUblezjyhjNAUAo0b6/HzTN3/mQLyLQXFiYmLi//EDW8oiJCb19XYAAAAASUVORK5CYII=';
const bgTileBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAACS0lEQVRoge2a0W6DIBRAr4WS0CbG1GUP/dp90z5hH+PDsi7GtDUxGPeAMxYBBbRI43lZgmzew+XOS2309fkBMvbSUYA97FY1Xz47IDYB32wCvtkEfIMB+Q7BjeAzsAn4JngB7DuAB0p6Kh9H4jLX/8paBEp6ko4XNAGthn8BVeh9uEYq08CATMtgzvklSab/oQtN0qpwjGZOjKLnXEgsjHgTsIieIzgE/2/UjwCzXX5OPwlbBsxxXH5Ol4TgMxDyeQAB2D2JCRKfnVX96x6PHQYCR/SmutQpNU83mSSgCV0gQid4rsZ4EU+PviMa7LE+uB7pkKeQ1m1TNCJgET1H7zAjOgHr6DkaB8ckdMsPGgHH6DlPyIP8PJDAbDdmKMEgNvEAQKEoQeyNp5DCtR+zzycxlYnpSeEqjCy7/BymXmkjh2H0sIYzMXfQb6cYrqpXTP4FOCqNWLbqfUSB2fcPh0EsLWUBCoXqJZ+K4Nvp4AUG54F6sVstc/AIPgMvJ5CjRVp5jIwfuhN5uQwEh0Rg9l203P6BF8iA/DyQozypZvj8DAAwuRouk9ma4jM+D0czlt1IfnR2aEixdJLl3WhrNdaq3u93zdWGLLj1O5za6cPhoL/Of1Ts2+UuenDGsuGodF9ZQ/D76JzGVlKegYxlwxPQsCTGMmBA9C/JFBP4OGU/wrjBFrqRHAD2sCNVe27qaqAiheZbiFMyMJESix/22NRAZVid0hoQhCNbybW8H2iaVlL/vdEymiMDHqGNWAPBtxKbgG82Ad8EL/AH16x90P3wuvEAAAAASUVORK5CYII=';

// Image preload
let playerImg = new Image(); playerImg.src = 'data:image/png;base64,' + playerBase64;
let enemyImg = new Image(); enemyImg.src = 'data:image/png;base64,' + enemyBase64;
let bossImg = new Image(); bossImg.src = 'data:image/png;base64,' + bossBase64;
let bgTileImg = new Image(); bgTileImg.src = 'data:image/png;base64,' + bgTileBase64;
let bgPattern;

bgTileImg.onload = () => {
  bgPattern = ctx.createPattern(bgTileImg, 'repeat');
};

let player = {
  x: 400, y: 300, width: 32, height: 32, speed: 4,
  health: 100, maxHealth: 100, level: 1, exp: 0, expToNext: 100,
  bob: 0  // Animasyon için
};
let enemies = [];
let keys = {};
let gameRunning = true;

// Klavye + Dokunmatik (aynı kaldı)
document.addEventListener('keydown', (e) => { keys[e.key.toLowerCase()] = true; });
document.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

let touchStart = { x: 0, y: 0 };
canvas.addEventListener('touchstart', (e) => {
  touchStart.x = e.touches[0].clientX;
  touchStart.y = e.touches[0].clientY;
});
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  let dx = e.touches[0].clientX - touchStart.x;
  let dy = e.touches[0].clientY - touchStart.y;
  if (Math.abs(dx) > Math.abs(dy)) {
    keys['a'] = dx < 0;
    keys['d'] = dx > 0;
  } else {
    keys['w'] = dy < 0;
    keys['s'] = dy > 0;
  }
});

function collides(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x &&
         a.y < b.y + b.height && a.y + a.height > b.y;
}

function restartGame() {
  player = { x: 400, y: 300, width: 32, height: 32, speed: 4, health: 100, maxHealth: 100, level: 1, exp: 0, expToNext: 100, bob: 0 };
  enemies = [];
  gameRunning = true;
  updateUI();
}

function update() {
  if (!gameRunning) return;

  // Player hareket + bob animasyon
  player.bob += 0.2;
  if ((keys['w'] || keys['arrowup']) && player.y > 0) player.y -= player.speed;
  if ((keys['s'] || keys['arrowdown']) && player.y < canvas.height - player.height) player.y += player.speed;
  if ((keys['a'] || keys['arrowleft']) && player.x > 0) player.x -= player.speed;
  if ((keys['d'] || keys['arrowright']) && player.x < canvas.width - player.width) player.x += player.speed;

  // Düşman spawn (aynı)
  if (Math.random() < 0.015 + player.level * 0.002) {
    let isBoss = player.level % 5 === 0 && Math.random() < 0.3;
    enemies.push({
      x: Math.random() * (canvas.width - 30),
      y: Math.random() * (canvas.height - 30),
      width: isBoss ? 50 : 28,
      height: isBoss ? 50 : 28,
      health: (isBoss ? 300 : 50) + player.level * 20,
      maxHealth: (isBoss ? 300 : 50) + player.level * 20,
      speed: (isBoss ? 1.2 : 1.8) + player.level * 0.3,
      isBoss: isBoss,
      attackPower: isBoss ? 3 : 1
    });
  }

  // Düşman AI + Savaş (aynı)
  for (let i = enemies.length - 1; i >= 0; i--) {
    let enemy = enemies[i];
    let dx = player.x - enemy.x;
    let dy = player.y - enemy.y;
    let dist = Math.hypot(dx, dy);
    if (dist > 0) {
      enemy.x += (dx / dist) * enemy.speed;
      enemy.y += (dy / dist) * enemy.speed;
    }

    if (collides(player, enemy)) {
      player.health -= enemy.attackPower;
      enemy.health -= 15 + player.level * 2;
    }

    if (enemy.health <= 0) {
      let expGain = enemy.isBoss ? 200 : 30;
      player.exp += expGain;
      enemies.splice(i, 1);

      if (player.exp >= player.expToNext) {
        player.level++;
        player.exp = 0;
        player.expToNext = Math.floor(player.expToNext * 1.4);
        player.maxHealth += 30;
        player.health = player.maxHealth;
        player.speed += 0.3;
      }
    }
  }

  if (player.health <= 0) {
    gameRunning = false;
    alert(`💀 Macera Bitti! Final Level: ${player.level} | Skor: ${player.exp + (player.level * 100)}`);
    restartGame();
  }

  updateUI();
}

function updateUI() {
  healthFill.style.width = (player.health / player.maxHealth * 100) + '%';
  levelEl.textContent = player.level;
  expEl.textContent = player.exp;
  expNextEl.textContent = player.expToNext;
  enemyCountEl.textContent = enemies.length;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Çöl arka plan (tile repeating)
  if (bgPattern) {
    ctx.fillStyle = bgPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#D2B48C';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Düşmanlar (image + health bar)
  enemies.forEach(enemy => {
    // Shadow
    ctx.shadowColor = enemy.isBoss ? 'purple' : 'red';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 3;

    // Image çiz
    if (enemy.isBoss) {
      ctx.drawImage(bossImg, enemy.x, enemy.y, enemy.width, enemy.height);
    } else {
      ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
    }

    ctx.shadowBlur = 0;

    // Health bar (küçük)
    let barWidth = enemy.width;
    let barHeight = 4;
    ctx.fillStyle = '#333';
    ctx.fillRect(enemy.x, enemy.y - 8, barWidth, barHeight);
    ctx.fillStyle = enemy.health / enemy.maxHealth > 0.5 ? '#00FF00' : '#FF0000';
    ctx.fillRect(enemy.x, enemy.y - 8, (enemy.health / enemy.maxHealth) * barWidth, barHeight);

    // Label
    ctx.fillStyle = '#FFF';
    ctx.font = enemy.isBoss ? 'bold 12px Arial' : '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(enemy.isBoss ? 'BOSS' : 'DŞM', enemy.x + enemy.width/2, enemy.y + enemy.height + 12);
    ctx.textAlign = 'left';
  });

  // Player (image + glow + bob animasyon)
  let bobY = Math.sin(player.bob) * 2;
  ctx.shadowColor = player.health < 30 ? 'orange' : 'gold';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 5;

  let img = playerImg;
  if (player.health < 30) {
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.filter = 'hue-rotate(30deg) saturate(1.5)';
  }
  ctx.drawImage(img, player.x, player.y + bobY, player.width, player.height);
  if (player.health < 30) {
    ctx.restore();
  }

  ctx.shadowBlur = 0;

  // Player label
  ctx.fillStyle = '#FFF';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('SAVAŞÇI', player.x + 16, player.y + player.height + 18);

  ctx.textAlign = 'left';
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Başlat!
updateUI();
gameLoop();
