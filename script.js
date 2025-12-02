let bcr = 0;
let energy = 10000;

let bcrPerClick = 1;
let energyPerClick = 100;

let hodlLvl = 0;
let snipeLvl = 0;
let energyLvl = 0;

let skillCost = 20;

// Passive income
let houses = 0;
let markets = 0;

// Update UI
function updateUI() {
    document.getElementById("bcr").innerText = bcr;
    document.getElementById("energy").innerText = Math.floor(energy);
    document.getElementById("hodlLvl").innerText = hodlLvl;
    document.getElementById("snipeLvl").innerText = snipeLvl;
    document.getElementById("energyLvl").innerText = energyLvl;
    document.getElementById("skillCost").innerText = skillCost;
    document.getElementById("houseCount").innerText = houses;
    document.getElementById("marketCount").innerText = markets;
}

document.getElementById("clickBtn").addEventListener("click", () => {
    if (energy < energyPerClick) return;

    energy -= energyPerClick;

    // Base gain
    let gain = bcrPerClick;

    // Snipe chance for x2
    let chance = Math.random() * 100;
    if (chance < snipeLvl) {
        gain *= 2;
    }

    bcr += gain;
    updateUI();
});

// Skill upgrades
function upgradeSkill(type) {
    if (bcr < skillCost) return;

    bcr -= skillCost;
    skillCost *= 2;

    if (type === "hodl") {
        hodlLvl++;
        bcrPerClick *= 1.01;
    }
    if (type === "snipe") {
        snipeLvl++;
    }
    if (type === "energy") {
        energyLvl++;
        energy = energy * 1.01;
    }

    updateUI();
}

// Town purchases
function buyBuilding(type) {
    if (type === "house" && bcr >= 500) {
        bcr -= 500;
        houses++;
    }
    if (type === "market" && bcr >= 1500) {
        bcr -= 1500;
        markets++;
    }

    updateUI();
}

// Passive income loop
setInterval(() => {
    bcr += houses * 1;
    bcr += markets * 2;
    updateUI();
}, 1000);

// Tabs
function openTab(id) {
    document.querySelectorAll('.tab').forEach(tab => tab.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

updateUI();
