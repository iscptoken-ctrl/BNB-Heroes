const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// UI
const screens = {
  nickname: document.getElementById('nicknameScreen'),
  game: document.getElementById('gameScreen')
};

// Data (localStorage)
let player = {
  nick: '',
  level: 1,
  exp: 0,
  expNext: 100,
  gold: 0,

  // Main Stats (ölünce sıfırlanmaz)
  mHealth: 100, mAttack: 1, mDefence: 1, mRegen: 1,

  // In-Game Stats (ölünce reset)
  hp: 100, maxHp: 100,
  damage: 5,
  radius: 80,
  regen: 5, // saniyede değil, 5 saniyede +regen
  posY: canvas.height - 100, // harita konumu (kuzeye gittikçe azalır)
  lastMove: Date.now()
};

let enemies = [];
let paused = false;
let gameOver = false;

// Load or new player
if (localStorage.getItem('bnbHero')) {
  Object.assign(player, JSON.parse(localStorage.getItem('bnbHero')));
  resetInGameStats();
  showGame();
} 

function saveNickname() {
  let nick = document.getElementById('nicknameInput').value.trim();
  if (nick.length < 3) return alert('Min 3 harf!');
  player.nick = nick;
  localStorage.setItem('bnbHero', JSON.stringify(player));
  resetInGameStats();
  showGame();
}

function showGame() {
  screens.nickname.classList.add('hidden');
  screens.game.classList.remove('hidden');
  document.getElementById('nick').textContent = player.nick;
  updateUI();
  gameLoop();
}

function resetInGameStats() {
  player.hp = 100 + (player.level-1)*5 + player.mHealth;
  player.maxHp = player.hp;
  player.damage = 1 + (player.level-1) + player.mAttack;
  player.radius = 80;
  player.regen = 5 + player.mRegen;
  player.posY = canvas.height - 100;
  enemies = [];
  gameOver = false;
}

function save() { localStorage.setItem('bnbHero', JSON.stringify(player)); }
function updateUI() {
  document.getElementById('level').textContent = player.level;
  document.getElementById('exp').textContent = player.exp;
  document.getElementById('expNext').textContent = player.expNext;
  document.getElementById('gold').textContent = player.gold;
  document.getElementById('hpText').textContent = `${player.hp}/${player.maxHp}`;
  document.getElementById('hpFill').style.width = (player.hp/player.maxHp*100)+'%';

  // Main Stats
  document.getElementById('mHealth').textContent = player.mHealth;
  document.getElementById('mAttack').textContent = player.mAttack;
  document.getElementById('mDefence').textContent = player.mDefence;
  document.getElementById('mRegen').textContent = player.mRegen;

  // Skill costs
  document.getElementById('cHealth').textContent = 1000 * Math.pow(2, player.mHealth - 100);
  document.getElementById('cAttack').textContent = 1000 * Math.pow(2, player.mAttack - 1);
  document.getElementById('cDefence').textContent = 1000 * Math.pow(2, player.mDefence - 1);
  document.getElementById('cRegen').textContent = 10000 * Math.pow(2, player.mRegen - 1);

  // In-Game Skills
  document.getElementById('sRadius').textContent = player.radius;
  document.getElementById('sDamage').textContent = player.damage;
  document.getElementById('sHp').textContent = player.maxHp;
  document.getElementById('sRegen').textContent = player.regen;

  document.getElementById('cRadius').textContent = 100 * Math.pow(2, Math.floor(player.radius/10) - 8);
  document.getElementById('cDamage').textContent = 100 * Math.pow(2, player.damage - 5);
  document.getElementById('cHp').textContent = 100 * Math.pow(2, Math.floor((player.maxHp-100)/5));
  document.getElementById('cRegenSkill').textContent = 1000 * Math.pow(2, player.regen - 5);
}

function upgrade(type) {
  let cost = 0;
  if (type==='health') cost = 1000 * Math.pow(2, player.mHealth - 100);
  if (type==='attack') cost = 1000 * Math.pow(2, player.mAttack - 1);
  if (type==='defence') cost = 1000 * Math.pow(2, player.mDefence - 1);
  if (type==='regen') cost = 10000 * Math.pow(2, player.mRegen - 1);
  if (player.gold >= cost) {
    player.gold -= cost;
    player[`m${type.charAt(0).toUpperCase() + type.slice(1)}`]++;
    player.hp = player.maxHp = 100 + (player.level-1)*5 + player.mHealth + (player.maxHp - 100 - player.mHealth - (player.level-1)*5);
    save(); updateUI();
  }
}

function upgradeSkill(type) {
  let cost = 100 * Math.pow(2, type==='radius' ? Math.floor(player.radius/10)-8 : type==='damage' ? player.damage-5 : type==='hp' ? Math.floor((player.maxHp-100)/5) : player.regen-5);
  if (type==='regen') cost = 1000 * Math.pow(2, player.regen-5);
  if (player.gold >= cost) {
    player.gold -= cost;
    if (type==='radius') player.radius += 10;
    if (type==='damage') player.damage += 1;
    if (type==='hp') player.maxHp += 5, player.hp += 5;
    if (type==='regen') player.regen += 1;
    save(); updateUI();
  }
}

function togglePause() {
  paused = !paused;
  document.getElementById('pauseBtn').textContent = paused ? 'RESUME' : 'PAUSE';
}

function openMenu(menu) { document.getElementById(menu).classList.remove('hidden'); }
function closeMenu() { document.querySelectorAll('.menu').forEach(m=>m.classList.add('hidden')); }

// Oyun döngüsü
let lastRegen = Date.now();
function gameLoop() {
  if (paused || gameOver) { requestAnimationFrame(gameLoop); return; }

  // 2 dk hareketsizlik → pause
  if (Date.now() - player.lastMove > 120000) paused = true;

  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Harita (kuzeye gittikçe zor)
  const zone = Math.floor((canvas.height - player.posY) / 50);
  player.posY -= 0.8; // otomatik yukarı yürüyor

  // Regen
  if (Date.now() - lastRegen > 5000) {
    player.hp = Math.min(player.hp + player.regen, player.maxHp);
    lastRegen = Date.now();
  }

  // Spawn düşman
  if (Math.random() < 0.03 + zone*0.005) {
    const types = [70, 25, 5]; // normal, champion, giant
    let rand = Math.random()*100;
    let type = rand < 70 ? 'normal' : rand < 95 ? 'champion' : 'giant';
    const lvl = zone + 1;
    enemies.push({
      x: Math.random()*(canvas.width-50)+25,
      y: canvas.height,
      type, lvl,
      hp: type==='normal' ? lvl*10 : type==='champion' ? lvl*30 : lvl*100,
      maxHp: type==='normal' ? lvl*10 : type==='champion' ? lvl*30 : lvl*100,
      speed: 0.7 + Math.random()*0.6
    });
  }

  // Düşman hareket + saldırı
  for (let i=enemies.length-1; i>=0; i--) {
    let e = enemies[i];
    e.y -= e.speed + player.posY*0.001;

    // AoE damage
    if (Math.hypot(e.x - canvas.width/2, e.y - player.posY) < player.radius) {
      e.hp -= player.damage / 10;
    }

    // Düşman hero’ya çarptı
    if (Math.hypot(e.x - canvas.width/2, e.y - player.posY) < 30) {
      player.hp -= e.lvl * 5 * (1 - player.mDefence*0.05);
    }

    if (e.hp <= 0) {
      player.gold += type==='giant' ? 10+Math.floor(Math.random()*40) : type==='champion' ? 5+Math.floor(Math.random()*15) : 1+Math.floor(Math.random()*5);
      player.exp += type==='giant' ? e.lvl*20 : type==='champion' ? e.lvl*10 : e.lvl*5;
      enemies.splice(i,1);

      // Level up
      if (player.exp >= player.expNext) {
        player.level++;
        player.exp = 0;
        player.expNext = Math.floor(player.expNext * 2);
        player.maxHp += 5;
        player.hp += 5;
      }
    }
  }

  // Hero ölürse
  if (player.hp <= 0) {
    alert(`Öldün! Level ${player.level}'de bitti. Tekrar başlıyorsun...`);
    resetInGameStats();
  }

  // Çizim
  // Hero (ortada sabit)
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(canvas.width/2-20, player.posY-30, 40, 60);
  ctx.fillStyle = '#000';
  ctx.fillText('BNB', canvas.width/2-15, player.posY-10);

  // Radius
  ctx.strokeStyle = 'rgba(0,255,0,0.3)';
  ctx.beginPath();
  ctx.arc(canvas.width/2, player.posY, player.radius, 0, Math.PI*2);
  ctx.stroke();

  // Düşmanlar
  enemies.forEach(e => {
    ctx.fillStyle = e.type==='giant' ? 'purple' : e.type==='champion' ? 'orange' : 'red';
    ctx.fillRect(e.x-15, e.y-15, 30, 30);
  });

  updateUI();
  save();
  requestAnimationFrame(gameLoop);
}
