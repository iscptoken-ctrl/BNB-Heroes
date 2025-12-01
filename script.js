const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const energyFill = document.getElementById('energyFill');
const energyEl = document.getElementById('energy');
const goldEl = document.getElementById('gold');
const levelEl = document.getElementById('level');
const expEl = document.getElementById('exp');
const expNextEl = document.getElementById('expNext');
const enemyCountEl = document.getElementById('enemyCount');
const damageVal = document.getElementById('damageVal');
const rangeVal = document.getElementById('rangeVal');
const damageCostEl = document.getElementById('damageCost');
const rangeCostEl = document.getElementById('rangeCost');
const fightBtn = document.getElementById('fightBtn');
const upgradeBtn = document.getElementById('upgradeBtn');
const upgradePanel = document.getElementById('upgradePanel');

// Game State
let energy = 100;
let gold = 0;
let player = {
  x: canvas.width / 2 - 16,
  y: canvas.height / 2 - 16,
  width: 32,
  height: 32,
  damage: 20,
  range: 120,
  bob: 0
};
let enemies = [];
let isFighting = false;
let showUpgrades = false;
let level = 1;
let exp = 0;
let expToNext = 100;

// Sprite'lar (eski player ve enemy)
const playerBase64 = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABQklEQVRYhWNgGAUjHTCSq/HWUoX/yHy16AdkmUWWJnTLKXEEyRpwWU6uI0hSTMhychxBtEKY5apR9xkYGBgYbi9TRJFHFyfWEUzEOoBWgIVUDeg+JyROCAx4CBDtAFicblzwGa+6jQs+0yYRdrsKw3OAfwIvXgfAQOnutwTNJ6gA2WJCDlCLfsCITT0+h+BMhNgMQraIlKIYZhY2h2A4AJ/FMPD/OsN/BoYHGGKMmvhDFJtDqJoLIA4jDQydbDhsHUBSUVwy6S3RanryhKnnAGIsJtcheB1QuvstIzkpG92MAwcO/D/dGoxVHmsaKN39lhGWVwnlbXwAptfBwYHxq3Uug2n1WsIOwFZakeMIXHrQzSfJYGKjA5flDQ0N/x0cHBgcHBzg8iTlApjBuBxCSXTRDRw4cOD/gQMHKErYo4CqAABSyIHYXpwtTgAAAABJRU5ErkJggg==';
const enemyBase64 = 'iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAA9klEQVRIie2UQRKCMAxFU8YT0QVeSQ+kV5JFudJ3oZ0JIW1SpjiO419Rkv5HQlOiX1do3fAYR/D1eVmaPJqSJWwP1J1YgrVCXUkAQEQ0x6jGp5ReZiGYfmYCAFD2ATbQKSXicQs6WMDeMoFzjESAWp0nLmW21DosUtbhcR0aL9RzUr9zLDg0jwD/X10HH0TryiAKFVMQDM+TG+RU3lcCqy9dsFxpZc41aLFCU/YtVvqItfa2sgIIYk10Y5BLR9idPV/frIEvZNIROvTy5oXkLg5asEeVpbFYVSih1hCXQLV9ZkuzQc2kliPbugFqfdeMPR/y10f0BG1uWAACK0I/AAAAAElFTkSuQmCC';
let playerImg = new Image(); playerImg.src = 'data:image/png;base64,' + playerBase64;
let enemyImg = new Image(); enemyImg.src = 'data:image/png;base64,' + enemyBase64;

// Çarpışma
function collides(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x &&
         a.y < b.y + b.height && a.y + a.height > b.y;
}
function distanceToPlayer(ex) {
  return Math.hypot(player.x + 16 - ex.x - ex.width/2, player.y + 16 - ex.y - ex.height/2);
}

// Enerji Regen (dakikada 1)
setInterval(() => {
  if (energy < 100) {
    energy++;
    updateUI();
  }
}, 60000);

// UI Update
function updateUI() {
  energyFill.style.width = (energy / 100 * 100) + '%';
  energyEl.textContent = energy;
  goldEl.textContent = gold;
  levelEl.textContent = level;
  expEl.textContent = exp;
  expNextEl.textContent = expToNext;
  enemyCountEl.textContent = enemies.length;
  damageVal.textContent = player.damage;
  rangeVal.textContent = player.range;
  damageCostEl.textContent = Math.floor(player.damage * 2.5);
  rangeCostEl.textContent = Math.floor(player.range * 1.5);
  fightBtn.textContent = isFighting ? 'STOP' : 'FIGHT Başlat (10⚡)';
  fightBtn.disabled = energy < 10 && !isFighting;
}

// Fight Toggle
function toggleFight() {
  if (!isFighting && energy >= 10) {
    energy -= 10;
    isFighting = true;
    upgradeBtn.style.display = 'inline-block';
  } else {
    isFighting = false;
  }
  updateUI();
}

// Upgrade Toggle
function toggleUpgrades() {
  showUpgrades = !showUpgrades;
  upgradePanel.style.display = showUpgrades ? 'block' : 'none';
  upgradeBtn.textContent = showUpgrades ? 'Oyuna Dön' : 'Upgrade Menüsü';
}

// Upgrades
function upgradeDamage() {
  let cost = Math.floor(player.damage * 2.5);
  if (gold >= cost) {
    gold -= cost;
    player.damage += 5;
    updateUI();
  }
}
function upgradeRange() {
  let cost = Math.floor(player.range * 1.5);
  if (gold >= cost) {
    gold -= cost;
    player.range += 20;
    updateUI();
  }
}

// Update Logic
function update() {
  if (!isFighting) return;

  player.bob += 0.15;

  // Düşman Spawn (level'e göre hızlanır)
  if (Math.random() < 0.02 + level * 0.005) {
    let isBoss = Math.random() < 0.1;
    enemies.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      width: isBoss ? 45 : 28,
      height: isBoss ? 45 : 28,
      health: (isBoss ? 150 : 40) + level * 10,
      maxHealth: (isBoss ? 150 : 40) + level * 10,
      speed: (isBoss ? 0.8 : 1.5) + level * 0.1,
      isBoss: isBoss
    });
  }

  // Düşmanlar player'a koş
  for (let i = enemies.length - 1; i >= 0; i--) {
    let enemy = enemies[i];
    let dx = (player.x + 16) - (enemy.x + enemy.width / 2);
    let dy = (player.y + 16) - (enemy.y + enemy.height / 2);
    let dist = Math.hypot(dx, dy);
    if (dist > 0) {
      enemy.x += (dx / dist) * enemy.speed;
      enemy.y += (dy / dist) * enemy.speed;
    }

    // Auto AoE Attack (range içindeyse)
    if (dist < player.range) {
      enemy.health -= player.damage;
    }

    // Öldü mü?
    if (enemy.health <= 0) {
      gold += enemy.isBoss ? 50 + level * 10 : 5 + level * 2;
      exp += enemy.isBoss ? 50 : 10;
      enemies.splice(i, 1);
      checkLevelUp();
    }
  }

  // Level Up
  function checkLevelUp() {
    if (exp >= expToNext) {
      level++;
      exp = 0;
      expToNext = Math.floor(expToNext * 1.3);
      player.damage += 3;
      player.range += 10;
    }
  }
}

// Draw
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Arka plan (çöl efekti)
  ctx.fillStyle = '#D2B48C';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `rgba(255, 215, 0, ${Math.random() * 0.3})`;
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 3, 3);
  }

  // Range Circle (glow)
  if (isFighting) {
    ctx.save();
    ctx.shadowColor = '#00FF00';
    ctx.shadowBlur = 20;
    ctx.strokeStyle = '#00FF88';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(player.x + 16, player.y + 16, player.range, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Enemies
  enemies.forEach(enemy => {
    ctx.shadowColor = enemy.isBoss ? 'purple' : 'red';
    ctx.shadowBlur = 15;
    ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
    ctx.shadowBlur = 0;

    // Health bar
    let barW = enemy.width;
    ctx.fillStyle = '#333';
    ctx.fillRect(enemy.x, enemy.y - 8, barW, 5);
    ctx.fillStyle = enemy.health / enemy.maxHealth > 0.5 ? '#00FF00' : '#FF0000';
    ctx.fillRect(enemy.x, enemy.y - 8, (enemy.health / enemy.maxHealth) * barW, 5);
  });

  // Player (sabit ortada, bob animasyon)
  let bobY = Math.sin(player.bob) * 3;
  ctx.shadowColor = 'gold';
  ctx.shadowBlur = 25;
  ctx.shadowOffsetY = 8;
  ctx.drawImage(playerImg, player.x, player.y + bobY, player.width, player.height);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#FFF';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('HERO', player.x + 16, player.y + 50);
  ctx.textAlign = 'left';
}

// Game Loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Başlat
updateUI();
gameLoop();
