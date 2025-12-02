let bcr = 0;
let energy = 10000;
let maxEnergy = 10000;

let cd1 = 0;
let mvs = 0;
let usdt = 0;

let shops = {
    house: { count: 0, cost: 500, rate: 1 },
    market: { count: 0, cost: 1500, rate: 2 },
    garage: { count: 0, cost: 5000, rate: 4 },
    hotel: { count: 0, cost: 10000, rate: 5 },
    pharmacy: { count: 0, cost: 10000, rate: 0 } // Pharmacy affects passive critical chance
};

// SHOW SCREEN
function showScreen(name) {
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
    document.getElementById(name).classList.remove("hidden");
}

// TAP CLICK
function tap() {
    if (energy < 100) return;
    energy -= 100;
    bcr += 100;
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

// PASSIVE INCOME
setInterval(() => {
    let totalRate = calculatePassive();
    let critChance = shops.pharmacy.count * 0.01; // Pharmacy x2 chance on passive
    if (Math.random() < critChance) totalRate *= 2;
    bcr += totalRate;
    energy = Math.min(maxEnergy, energy + 5);
    updateUI();
}, 1000);

function calculatePassive() {
    return Object.values(shops).reduce((sum, s) => sum + s.count * s.rate, 0);
}

// CONVERT FUNCTIONS
function convertBcr() {
    if (bcr >= 100000000) {
        bcr -= 100000000;
        cd1 += 1;
        updateUI();
    }
}

function convertCd1() {
    if (cd1 >= 10) {
        cd1 -= 10;
        mvs += 1;
        updateUI();
    }
}

// BURN FUNCTIONS
function burnCd1() {
    if (cd1 >= 1) {
        cd1 -= 1;
        usdt += 1;
        updateUI();
    }
}

function burnMvs() {
    if (mvs >= 1) {
        mvs -= 1;
        usdt += 10;
        updateUI();
    }
}

// UPDATE UI
function updateUI() {
    document.getElementById("energy").innerText = Math.floor(energy);
    document.getElementById("bcr").innerText = Math.floor(bcr);
    document.getElementById("townBcr").innerText = Math.floor(bcr);
    document.getElementById("profileBcr").innerText = Math.floor(bcr);
    document.getElementById("profileCd1").innerText = cd1;
    document.getElementById("profileMvs").innerText = mvs;
    document.getElementById("profileUsdt").innerText = usdt;

    // Profile items
    document.getElementById("profileHouse").innerText = shops.house.count;
    document.getElementById("profileMarket").innerText = shops.market.count;
    document.getElementById("profileGarage").innerText = shops.garage.count;
    document.getElementById("profileHotel").innerText = shops.hotel.count;
    document.getElementById("profilePharmacy").innerText = shops.pharmacy.count;

    // Town counts
    document.getElementById("houseCount").innerText = shops.house.count;
    document.getElementById("marketCount").innerText = shops.market.count;
    document.getElementById("garageCount").innerText = shops.garage.count;
    document.getElementById("hotelCount").innerText = shops.hotel.count;
    document.getElementById("pharmacyCount").innerText = shops.pharmacy.count;

    // Convert
    document.getElementById("convertBcr").innerText = Math.floor(bcr);
    document.getElementById("convertCd1").innerText = cd1;
    document.getElementById("convertMvs").innerText = mvs;

    // Burn
    document.getElementById("burnCd1").innerText = cd1;
    document.getElementById("burnMvs").innerText = mvs;
    document.getElementById("burnUsdt").innerText = usdt;

    // Total shops
    let totalShops = Object.values(shops).reduce((sum, s) => sum + s.count, 0);
    document.getElementById("totalShops").innerText = totalShops;
    document.getElementById("townShops").innerText = totalShops;

    // Passive income
    document.getElementById("passiveRate").innerText = calculatePassive();
}

updateUI();
