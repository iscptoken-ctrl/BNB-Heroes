let bcr = 0;
let energy = 10000;
let maxEnergy = 10000;

let hodlLevel = 0;
let snipeLevel = 0;
let energyLevel = 0;

let baseClick = 10;

let skillCosts = {
    hodl: 20,
    snipe: 20,
    energy: 20
};

let buildings = {
    house: { cost: 500, income: 1 },
    market: { cost: 1500, income: 2 },
    garage: { cost: 5000, income: 4 },
    hotel: { cost: 10000, income: 5 }
};

let passiveIncome = 0;

/* ------------------- TAP SYSTEM ------------------- */
document.getElementById("tapButton").addEventListener("click", () => {
    if (energy < 100) return;

    energy -= 10;

    let gain = baseClick;

    gain *= 1 + hodlLevel * 0.01;

    if (Math.random() < snipeLevel * 0.01) {
        gain *= 2;
    }

    bcr += gain;

    updateUI();
});

/* ------------------- SKILLS ------------------- */
function upgradeSkill(skill) {
    if (bcr < skillCosts[skill]) return;

    bcr -= skillCosts[skill];

    if (skill === "hodl") hodlLevel++;
    if (skill === "snipe") snipeLevel++;
    if (skill === "energy") {
        energyLevel++;
        maxEnergy = Math.floor(maxEnergy * 1.01);
        energy = maxEnergy;
    }

    skillCosts[skill] *= 2;
    updateUI();
}

/* ------------------- TOWN SHOP ------------------- */
function buyItem(item) {
    let shop = buildings[item];

    if (bcr < shop.cost) return;

    bcr -= shop.cost;

    passiveIncome += shop.income;

    updateUI();
}

/* ------------------- PASSIVE INCOME ------------------- */
setInterval(() => {
    bcr += passiveIncome;
    updateUI();
}, 1000);

/* ------------------- ENERGY REGEN ------------------- */
setInterval(() => {
    if (energy < maxEnergy) {
        energy += Math.ceil(maxEnergy * 0.005);
        if (energy > maxEnergy) energy = maxEnergy;
        updateUI();
    }
}, 500);

/* ------------------- UI ------------------- */
function openTab(tab) {
    document.querySelectorAll(".tab").forEach(t => t.style.display = "none");
    document.getElementById(tab).style.display = "block";
}

function updateUI() {
    document.getElementById("bcr").innerText = Math.floor(bcr);
    document.getElementById("energy").innerText = Math.floor(energy);

    document.getElementById("hodlCost").innerText = skillCosts.hodl;
    document.getElementById("snipeCost").innerText = skillCosts.snipe;
    document.getElementById("energyCost").innerText = skillCosts.energy;
}
