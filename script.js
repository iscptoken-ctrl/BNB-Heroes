const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const healthFill = document.getElementById('healthFill');
const levelEl = document.getElementById('level');
const expEl = document.getElementById('exp');
const expNextEl = document.getElementById('expNext');
const enemyCountEl = document.getElementById('enemyCount');
const currentSkillEl = document.getElementById('currentSkill');
const cooldownBar = document.getElementById('cooldownBar');
const cooldownFill = document.getElementById('cooldownFill');

// Sprite'lar (eski)
const playerBase64 = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABQklEQVRYhWNgGAUjHTCSq/HWUoX/yHy16AdkmUWWJnTLKXEEyRpwWU6uI0hSTMhychxBtEKY5apR9xkYGBgYbi9TRJFHFyfWEUzEOoBWgIVUDeg+JyROCAx4CBDtAFicblzwGa+6jQs+0yYRdrsKw3OAfwIvXgfAQOnutwTNJ6gA2WJCDlCLfsCITT0+h+BMhNgMQraIlKIYZhY2h2A4AJ/FMPD/OsN/BoYHGGKMmvhDFJtDqJoLIA4jDQydbDhsHUBSUVwy6S3RanryhKnnAGIsJtcheB1QuvstIzkpG92MAwcO/D/dGoxVHmsaKN39lhGWVwnlbXwAptfBwYHxq3Uug2n1WsIOwFZakeMIXHrQzSfJYGKjA5flDQ0N/x0cHBgcHBzg8iTlApjBuBxCSXTRDRw4cOD/gQMHKErYo4CqAABSyIHYXpwtTgAAAABJRU5ErkJggg==';
const enemyBase64 = 'iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAA9klEQVRIie2UQRKCMAxFU8YT0QVeSQ+kV5JFudJ3oZ0JIW1SpjiO419Rkv5HQlOiX1do3fAYR/D1eVmaPJqSJWwP1J1YgrVCXUkAQEQ0x6jGp5ReZiGYfmYCAFD2ATbQKSXicQs6WMDeMoFzjESAWp0nLmW21DosUtbhcR0aL9RzUr9zLDg0jwD/X10HH0TryiAKFVMQDM+TG+RU3lcCqy9dsFxpZc41aLFCU/YtVvqItfa2sgIIYk10Y5BLR9idPV/frIEvZNIROvTy5oXkLg5asEeVpbFYVSih1hCXQLV9ZkuzQc2kliPbugFqfdeMPR/y10f0BG1uWAACK0I/AAAAAElFTkSuQmCC';
const bossBase64 = 'iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACQklEQVRoge2Yv27CMBDGzxFTkSqmjpU781KoT8DUNWZl6hNU8FDsiJEpQqKrO6QOjuM/d7aTQJvfhIji3Ofv7nwJwB0hpZSx97KcgaSgi2CMkeMq8oaDRw/cdCLGmVGE+ESE/ncxeGqRA0SmWZIjO16RgopJGSmlFCCC90U5ogtYHReoNUIiNmwTXEOAcD6L7AjVBQCcE6Usg+v4nEEL2fFKxoigkCJmhnlAqgBX2pRS/F4XKcsDQMCRHC64drCUoq5QdhPE+Tp6TaeQPtOoEaFwiCmlaP4P0RGSsxYwbdMG5+takOGYb+2WkL6LWbFhAkB/krTXyZ5X9Q+HGJ0CYJiOZNKIcYhQ7Hl1E+RhNrQAHUq32r9VAPDpvF5gT+Z7oKkdCwVAPWY8miCTVrHnFuObjVLhfN1qTp32+2juKDHOEWV1XLCYRrBdnjr3fB++qMuQ2PFKemct5UxIkC34IVkdFww1/fpSDSPiaflOiYuEio1cC6Y75/kFfW8oxbBDI0B3c0kvVtvlSVICN8nljC1DUO8jAO0UUmJers/kIJSYmAbgS3FUavVZzLogX2qFjgS0I33RSrdr9/p5foGPw2tww4M1MmZrVSmMiWF0R2zENJSWkNg3upzEdsXRPmLbSGntTRHZ3FDT69gjSJZifxQYgN8NxViuYNwAIDiCXTAnlGcyjBsmfbsTs2lRNdKnO7Frdw5E7Hu2/sBUh3JsTJaTPUZUblezjyhjNAUAo0b6/HzTN3/mQLyLQXFiYmLi//EDW8oiJCb19XYAAAAASUVORK5CYII=';
const bgTileBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAACS0lEQVRoge2a0W6DIBRAr4WS0CbG1GUP/dp90z5hH+PDsi7GtDUxGPeAMxYBBbRI43lZgmzew+XOS2309fkBMvbSUYA97FY1Xz47IDYB32wCvtkEfIMB+Q7BjeAzsAn4JngB7DuAB0p6Kh9H4jLX/8paBEp6ko4XNAGthn8BVeh9uEYq08CATMtgzvklSab/oQtN0qpwjGZOjKLnXEgsjHgTsIieIzgE/2/UjwCzXX5OPwlbBsxxXH5Ol4TgMxDyeQAB2D2JCRKfnVX96x6PHQYCR/SmutQpNU83mSSgCV0gQid4rsZ4EU+PviMa7LE+uB7pkKeQ1m1TNCJgET1H7zAjOgHr6DkaB8ckdMsPGgHH6DlPyIP8PJDAbDdmKMEgNvEAQKEoQeyNp5DCtR+zzycxlYnpSeEqjCy7/BymXmkjh2H0sIYzMXfQb6cYrqpXTP4FOCqNWLbqfUSB2fcPh0EsLWUBCoXqJZ+K4Nvp4AUG54F6sVstc/AIPgMvJ5CjRVp5jIwfuhN5uQwEh0Rg9l203P6BF8iA/DyQozypZvj8DAAwuRouk9ma4jM+D0czlt1IfnR2aEixdJLl3WhrNdaq3u93zdWGLLj1O5za6cPhoL/Of1Ts2+UuenDGsuGodF9ZQ/D76JzGVlKegYxlwxPQsCTGMmBA9C/JFBP4OGU/wrjBFrqRHAD2sCNVe27qaqAiheZbiFMyMJESix/22NRAZVid0hoQhCNbybW8H2iaVlL/vdEymiMDHqGNWAPBtxKbgG82Ad8EL/AH16x90P3wuvEAAAAASUVORK5CYII=';

let playerImg = new Image(); playerImg.src = 'data:image/png;base64,' + playerBase64;
let enemyImg = new Image(); enemyImg.src = 'data:image/png;base64,' + enemyBase64;
let bossImg = new Image(); bossImg.src = 'data:image/png;base64,' + bossBase64;
let bgTileImg = new Image(); bgTileImg.src = 'data:image/png;base64,' + bgTileBase64;
let bgPattern;

bgTileImg.onload = () => { bgPattern = ctx.createPattern(bgTileImg, 'repeat'); };

let player = {
  x: 400, y: 300, width: 32, height: 32, speed: 4,
  health: 100, maxHealth: 100, level: 1, exp: 0, expToNext: 100, bob: 0
};
let enemies = [];
let projectiles = [];
let keys = {};
let gameRunning = true;
let skillCooldown = 0;

// SKILL SİSTEMİ
const skills = [
  {id: 0, name: 'Ateş Topu', unlocked: false, level: 0, baseDamage: 30, cd: 800, type: 'fire', color: '#FF4500', splash: 40},
  {id: 1, name: 'Ok', unlocked: false, level: 0, baseDamage: 20, cd: 400, type: 'arrow', color: '#FFD700', speed: 12},
  {id: 2, name: 'Yıldırım', unlocked: false, level: 0, baseDamage: 45, cd: 1200, type: 'lightning', color: '#00BFFF', chain: 2}
];
let currentSkillId = -1; // -1 = yok

// Klavye
document.addEventListener('keydown', (e) => {
  let key = e.key.toLowerCase();
  keys[key] = true;
  if (key === ' ' && skillCooldown <= 0 && currentSkillId >= 0) shoot();
  if (key === '1' && skills[0].unlocked) currentSkillId = 0;
  if (key === '2' && skills[1].unlocked) currentSkillId = 1;
  if (key === '3' && skills[2].unlocked) currentSkillId = 2;
});
document.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

// Dokunmatik: Hareket + Saldırı
let touchStart = { x: 0, y: 0 };
canvas.addEventListener('touchstart', (e) => {
  touchStart.x = e.touches[0].clientX - canvas.offsetLeft;
  touchStart.y = e.touches[0].clientY - canvas.offsetTop;
  if (skillCooldown <= 0 && currentSkillId >= 0) shoot();
});
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  let dx = (e.touches[0].clientX - canvas.offsetLeft) - touchStart.x;
  let dy = (e.touches[0].clientY - canvas.offsetTop) - touchStart.y;
  if (Math.abs(dx) > Math.abs(dy)) {
    keys['a'] = dx < 0; keys['d'] = dx > 0;
  } else {
    keys['w'] = dy < 0; keys['s'] = dy > 0;
  }
});

function collides(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x &&
         a.y < b.y + b.height && a.y + a.height > b.y;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function restartGame() {
  player = { x: 400, y: 300, width: 32, height: 32, speed: 4, health: 100, maxHealth: 100, level: 1, exp: 0, expToNext: 100, bob: 0 };
  enemies = []; projectiles = [];
  skills.forEach(s => { s.unlocked = false; s.level = 0; });
  skills[0].unlocked = true; // Başlangıç skill
  currentSkillId = 0;
  skillCooldown = 0; gameRunning = true;
  updateUI();
}

function shoot() {
  let skill = skills[currentSkillId];
  if (!skill || skillCooldown > 0) return;

  let proj = {
    x: player.x + player.width / 2,
    y: player.y + player.height / 2,
    vx: 0, vy: 0,
    damage: skill.baseDamage + skill.level * 10,
    type: skill.type,
    color: skill.color,
    splash: skill.splash || 0,
    speed: skill.speed || 8,
    chainCount: skill.chain || 0
  };

  // Mouse yerine player forward (sağa basit)
  let angle = 0; // Sağ
  proj.vx = Math.cos(angle) * proj.speed;
  proj.vy = Math.sin(angle) * proj.speed;

  projectiles.push(proj);
  skillCooldown = skill.cd;
  updateUI();
}

function update() {
  if (!gameRunning) return;

  // Cooldown tick
  skillCooldown = Math.max(0, skillCooldown - 16);

  // Player hareket + bob
  player.bob += 0.2;
  if ((keys['w'] || keys['arrowup']) && player.y > 0) player.y -= player.speed;
  if ((keys['s'] || keys['arrowdown']) && player.y < canvas.height - player.height) player.y += player.speed;
  if ((keys['a'] || keys['arrowleft']) && player.x > 0) player.x -= player.speed;
  if ((keys['d'] || keys['arrowright']) && player.x < canvas.width - player.width) player.x += player.speed;

  // Düşman spawn
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

  // Düşman AI + Yakın dövüş
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
      player.exp += enemy.isBoss ? 200 : 30;
      enemies.splice(i, 1);
      checkLevelUp();
      return; // Bir seferde bir exp
    }
  }

  // Projectiles update
  for (let i = projectiles.length - 1; i >= 0; i--) {
    let proj = projectiles[i];
    proj.x += proj.vx;
    proj.y += proj.vy;

    // Duvar çarp
    if (proj.x < 0 || proj.x > canvas.width || proj.y < 0 || proj.y > canvas.height) {
      projectiles.splice(i, 1);
      continue;
    }

    // Düşman vuruş
    for (let j = enemies.length - 1; j >= 0; j--) {
      let enemy = enemies[j];
      if (collides({x: proj.x-5, y: proj.y-5, width:10, height:10}, enemy)) {
        enemy.health -= proj.damage;

        // Splash
        if (proj.splash) {
          enemies.forEach(e => {
            if (distance(proj, e) < proj.splash) e.health -= proj.damage * 0.5;
          });
        }

        // Chain
        if (proj.chainCount > 0) {
          chainLightning(enemy, proj.damage * 0.7, proj.chainCount);
        }

        projectiles.splice(i, 1);
        break;
      }
    }
  }

  if (player.health <= 0) {
    gameRunning = false;
    alert(`💀 Bitti! Level: ${player.level} | Skor: ${player.exp + player.level * 100}`);
    restartGame();
  }

  updateUI();
}

function chainLightning(hitEnemy, dmg, chainsLeft) {
  if (chainsLeft <= 0) return;
  let closest = null;
  let minDist = 80;
  enemies.forEach(e => {
    if (e !== hitEnemy && distance(hitEnemy, e) < minDist) {
      closest = e;
      minDist = distance(hitEnemy, e);
    }
  });
  if (closest) {
    closest.health -= dmg;
    // Basit çizim için projectile ekle (line simüle)
    projectiles.push({
      x: hitEnemy.x + hitEnemy.width/2, y: hitEnemy.y + hitEnemy.height/2,
      tx: closest.x + closest.width/2, ty: closest.y + closest.height/2,
      damage: 0, type: 'chainlink', color: '#00BFFF'
    });
    setTimeout(() => chainLightning(closest, dmg * 0.8, chainsLeft - 1), 100);
  }
}

function checkLevelUp() {
  if (player.exp >= player.expToNext) {
    player.level++;
    player.exp = 0;
    player.expToNext = Math.floor(player.expToNext * 1.4);
    player.maxHealth += 30;
    player.health = player.maxHealth;
    player.speed += 0.3;

    // Skill gelişimi
    skills.forEach(s => {
      if (s.unlocked) s.level++;
    });

    // Yeni skill unlock (her level bir tane)
    let nextSkill = player.level - 1;
    if (nextSkill < skills.length && !skills[nextSkill].unlocked) {
      skills[nextSkill].unlocked = true;
      if (currentSkillId === -1) currentSkillId = nextSkill;
      alert(`🎉 LEVEL ${player.level}! Yeni Skill: ${skills[nextSkill].name} UNLOCK! (Tuş: ${nextSkill+1})`);
    } else {
      alert(`🎉 LEVEL ${player.level}! Tüm skill'ler GÜÇLENDİ! 💪`);
    }
  }
}

function updateUI() {
  healthFill.style.width = (player.health / player.maxHealth * 100) + '%';
  levelEl.textContent = player.level;
  expEl.textContent = player.exp;
  expNextEl.textContent = player.expToNext;
  enemyCountEl.textContent = enemies.length;

  if (currentSkillId >= 0) {
    let skill = skills[currentSkillId];
    currentSkillEl.textContent = skill.name + ` (Lv${skill.level})`;
    let cdPercent = (skill.cd - skillCooldown) / skill.cd * 100;
    cooldownFill.style.width = cdPercent + '%';
    cooldownBar.style.display = skillCooldown > 0 ? 'block' : 'none';
  } else {
    currentSkillEl.textContent = 'Yok';
    cooldownBar.style.display = 'none';
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (bgPattern) {
    ctx.fillStyle = bgPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#D2B48C';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Projectiles
  projectiles.forEach(proj => {
    ctx.save();
    ctx.shadowColor = proj.color;
    ctx.shadowBlur = 15;
    ctx.fillStyle = proj.color;
    if (proj.type === 'chainlink') {
      // Lightning line
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(proj.x, proj.y);
      ctx.lineTo(proj.tx, proj.ty);
      ctx.strokeStyle = proj.color;
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, 6, 0, Math.PI * 2);
      ctx.fill();
      // Glow ring
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, 12, 0, Math.PI * 2);
      ctx.strokeStyle = proj.color;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();
  });

  // Enemies (health bar + img)
  enemies.forEach(enemy => {
    ctx.shadowColor = enemy.isBoss ? 'purple' : 'red';
    ctx.shadowBlur = enemy.isBoss ? 20 : 10;
    ctx.drawImage(enemy.isBoss ? bossImg : enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
    ctx.shadowBlur = 0;

    // Health bar
    let barWidth = enemy.width;
    ctx.fillStyle = '#333';
    ctx.fillRect(enemy.x, enemy.y - 8, barWidth, 4);
    ctx.fillStyle = enemy.health / enemy.maxHealth > 0.5 ? '#00FF00' : '#FF0000';
    ctx.fillRect(enemy.x, enemy.y - 8, (enemy.health / enemy.maxHealth) * barWidth, 4);

    ctx.fillStyle = '#FFF';
    ctx.font = enemy.isBoss ? 'bold 14px Arial' : '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(enemy.isBoss ? 'BOSS' : 'DŞM', enemy.x + enemy.width/2, enemy.y + enemy.height + 12);
  });
  ctx.textAlign = 'left';

  // Player
  let bobY = Math.sin(player.bob) * 2;
  ctx.shadowColor = player.health < 30 ? 'orange' : 'gold';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 5;
  ctx.drawImage(playerImg, player.x, player.y + bobY, player.width, player.height);
  ctx.shadowBlur = 0;

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

updateUI();
gameLoop();
#gameCanvas {
  cursor: crosshair !important;
}
@media (pointer: coarse) {
  #gameCanvas {
    cursor: none;
  }
}
