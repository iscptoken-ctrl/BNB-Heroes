let bcr = 0;
let energy = 10000;
let maxEnergy = 10000;

let skills = {
    hodl: { level: 0, cost: 20 },
    snipe: { level: 0, cost: 20 },
    energy: { level: 0, cost: 20 }
};

let shops = {
    house: { count: 0, cost: 500, rate: 1 },
    market: { count: 0, cost: 1500, rate: 2 },
    garage: { count: 0, cost: 5000, rate: 4 },
    hotel: { count: 0, cost: 10000, rate: 5 }
};

// SHOW SCREEN
function showScreen(name) {
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
    document.getElementById(name).classList.remove("hidden");
}

// TAP CLICK
function tap() {
    if (energy < 100) return;

    energy -= 10;

    let gain = 100 + (skills.hodl.level * 0.01);

    // snipe chance
    if (Math.random() < skills.snipe.level * 0.01) {
        gain *= 2;
    }

    bcr += gain;

    updateUI();
}

// BUY SHOP
function buyShop(name) {
    let shop = shops[name];
    if (bcr < shop.cost) return;

    bcr -= shop.cost;
    shop.count++;

    updateUI();
}

// UPGRADE SKILL
function upgradeSkill(name) {
    let skill = skills[name];

    if (bcr < skill.cost) return;

    bcr -= skill.cost;
    skill.level++;
    skill.cost *= 2;

    updateUI();
}

// ENERGY REGEN
setInterval(() => {
    energy = Math.min(maxEnergy + maxEnergy * (skills.energy.level * 0.01), energy + 55);
    updateUI();
}, 1000);

// PASSIVE INCOME
setInterval(() => {
    let totalRate = calculatePassive();
    bcr += totalRate;
    updateUI();
}, 1000);

function calculatePassive() {
    return Object.values(shops).reduce((sum, s) => sum + s.count * s.rate, 0);
}

function updateUI() {
    document.getElementById("energy").innerText = Math.floor(energy);
    document.getElementById("bcr").innerText = Math.floor(bcr);

    document.getElementById("townBcr").innerText = Math.floor(bcr);

    document.getElementById("passiveRate").innerText = calculatePassive();
    document.getElementById("profilePassive").innerText = calculatePassive();

    let totalShops = Object.values(shops).reduce((sum, s) => sum + s.count, 0);

    document.getElementById("totalShops").innerText = totalShops;
    document.getElementById("townShops").innerText = totalShops;
    document.getElementById("profileTotal").innerText = totalShops;

    document.getElementById("costHodl").innerText = skills.hodl.cost;
    document.getElementById("costSnipe").innerText = skills.snipe.cost;
    document.getElementById("costEnergy").innerText = skills.energy.cost;
}

updateUI();
