let bcr = 0;
let energy = 10000;

let bcrPerClick = 1;
let energyPerClick = 100;

// Levels
let hodlLvl = 0;
let snipeLvl = 0;
let energyLvl = 0;

// Cost per skill
let hodlCost = 20;
let snipeCost = 20;
let energyCost = 20;

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

    document.getElementById("hodlCost").innerText = hodlCost;
    document.getElementById("snipeCost").innerText = snipeCost;
    document.getElementById("energyCost").innerText = energyCost;

    document.getElementById("houseCount").innerText = houses;
    document.getElementById("marketCount").innerText = markets;
}

// CLICK
document.getElementById("clickBtn").addEventListener("click", () => {
    if (energy < energyPerClick) return;

    energy -= energyPerClick;

    let gain = bcrPerClick;

    // Snipe chance x2
    if (Math.random() * 100 < snipeLvl) {
        gain *= 2;
    }

    bcr += gain;
    updateUI();
});

// SKILLS
function upgradeSkill(type) {
    if (type === "hodl" && bcr >= hodlCost) {
        bcr -= hodlCost;
        hodlLvl++;
        hodlCost *= 2;
        bcrPerClick *= 1.01;
    }
    else if (type === "snipe" && bcr >= snipeCost) {
        bcr -= snipeCost;
        snipeLvl++;
        snipeCost *= 2;
    }
    else if (type === "energy" && bcr >= energyCost) {
        bcr -= energyCost;
        energyLvl++;
        energyCost *= 2;
        energy *= 1.01;
    }

    updateUI();
}

// TOWN
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

// Passive BCR
setInterval(() => {
    bcr += houses * 1;
    bcr += markets * 2;
    updateUI();
}, 1000);

// Energy regen +5
setInterval(() => {
    energy += 5;
    updateUI();
}, 1000);

// Tabs
function openTab(id) {
    document.querySelectorAll('.tab').forEach(tab => tab.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

updateUI();
