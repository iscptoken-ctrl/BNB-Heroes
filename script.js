const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const healthFill = document.getElementById('healthFill');
const levelEl = document.getElementById('level');
const expEl = document.getElementById('exp');
const expNextEl = document.getElementById('expNext');
const enemyCountEl = document.getElementById('enemyCount');

let player = {
  x: 400, y: 300, width: 32, height: 32, speed: 4,
  health: 100, maxHealth: 100, level: 1, exp: 0, expToNext: 100
};
let enemies = [];
let keys = {};
let gameRunning = true;

// Klavye kontrolleri (WASD + Arrows)
document.addEventListener('keydown', (e) => { keys[e.key.toLowerCase()] = true; });
document.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

// Basit dokunmatik (mobil)
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

// Çarpışma kontrolü
function collides(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x &&
         a.y < b.y + b.height && a.y + a.height > b.y;
}

// Oyunu sıfırla
function restartGame() {
  player = { x: 400, y: 300, width: 32, height: 32, speed: 4, health: 100, maxHealth: 100, level: 1, exp: 0, expToNext: 100 };
  enemies = [];
  gameRunning = true;
  updateUI();
}

// Update mantığı
function update() {
  if (!gameRunning) return;

  // Player hareket
  if ((keys['w'] || keys['arrowup']) && player.y > 0) player.y -= player.speed;
  if ((keys['s'] || keys['arrowdown']) && player.y < canvas.height - player.height) player.y += player.speed;
  if ((keys['a'] || keys['arrowleft']) && player.x > 0) player.x -= player.speed;
  if ((keys['d'] || keys['arrowright']) && player.x < canvas.width - player.width) player.x += player.speed;

  // Düşman spawn (normal + boss)
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

  // Düşmanlar player'a doğru hareket + savaş
  for (let i = enemies.length - 1; i >= 0; i--) {
    let enemy = enemies[i];
    let dx = player.x - enemy.x;
    let dy = player.y - enemy.y;
    let dist = Math.hypot(dx, dy);
    if (dist > 0) {
      enemy.x += (dx / dist) * enemy.speed;
      enemy.y += (dy / dist) * enemy.speed;
    }

    // Çarpışma: Hasar ver/al
    if (collides(player, enemy)) {
      player.health -= enemy.attackPower;
      enemy.health -= 15 + player.level * 2;
    }

    // Ölü düşmanları sil + exp ver
    if (enemy.health <= 0) {
      let expGain = enemy.isBoss ? 200 : 30;
      player.exp += expGain;
      enemies.splice(i, 1);

      // Level up!
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

  // Player ölümü
  if (player.health <= 0) {
    gameRunning = false;
    alert(`💀 Macera Bitti! Final Level: ${player.level} | Skor: ${player.exp + (player.level * 100)}`);
    restartGame();
  }

  updateUI();
}

// UI güncelle
function updateUI() {
  healthFill.style.width = (player.health / player.maxHealth * 100) + '%';
  levelEl.textContent = player.level;
  expEl.textContent = player.exp;
  expNextEl.textContent = player.expToNext;
  enemyCountEl.textContent = enemies.length;
}

// Çizim
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player (altın savaşçı)
  ctx.shadowColor = 'gold';
  ctx.shadowBlur = 15;
  ctx.fillStyle = player.health < 30 ? '#FF4500' : '#FFD700';
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.fillStyle = '#FFF';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('SAVAŞÇI', player.x + 16, player.y + 22);

  // Düşmanlar
  enemies.forEach(enemy => {
    ctx.shadowColor = enemy.isBoss ? 'purple' : 'red';
    ctx.shadowBlur = enemy.isBoss ? 20 : 10;
    ctx.fillStyle = enemy.isBoss ? '#8A2BE2' : '#FF0000';
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFF';
    ctx.font = enemy.isBoss ? 'bold 14px Arial' : '12px Arial';
    ctx.fillText(enemy.isBoss ? 'BOSS' : 'DŞM', enemy.x + enemy.width/2, enemy.y + enemy.height - 5);
  });

  // Arka plan efekt (kum fırtınası)
  ctx.fillStyle = 'rgba(255, 215, 0, 0.05)';
  for (let i = 0; i < 50; i++) {
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
  }
}

// Ana loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Başlat!
updateUI();
gameLoop();
