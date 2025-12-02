// Kullanıcı veri örneği
let user = {
    id: 1,
    username: "Player1",
    BCR: 0,
    CD1: 0,
    MVS: 0,
    USDT: 0,
    items: {House:0, Market:0, Garage:0, Hotel:0, Pharmacy:0}
};

// API endpoint
const API = "http://localhost:5000";

// Menüler
function showProfile(){
    let html = `<h2>👤 Profile</h2>
        <p>BCR: ${user.BCR}</p>
        <p>CD1: ${user.CD1}</p>
        <p>MVS: ${user.MVS}</p>
        <p>USDT: ${user.USDT}</p>
        <h3>Items</h3>
        <ul>`;
    for(let item in user.items){
        html+= `<li>${item}: ${user.items[item]}</li>`;
    }
    html+="</ul>";
    document.getElementById("game-area").innerHTML = html;
}

function showTown(){
    let html = `<h2>🏘️ Town</h2><ul>`;
    for(let item in user.items){
        html+= `<li>${item} - owned: ${user.items[item]}</li>`;
    }
    html+="</ul>";
    document.getElementById("game-area").innerHTML = html;
}

function showConverts(){
    let html = `<h2>💱 BCR Converts</h2>`;
    html+=`<button onclick="convertBCR()">Convert 100M BCR → 1 CD1</button>`;
    html+=`<button onclick="convertCD1()">Convert 10 CD1 → 1 MVS</button>`;
    document.getElementById("game-area").innerHTML = html;
}

function convertBCR(){
    if(user.BCR>=100_000_000){
        user.BCR-=100_000_000;
        user.CD1+=1;
        alert("Converted 100M BCR → 1 CD1");
    } else alert("Not enough BCR");
    showProfile();
}

function convertCD1(){
    if(user.CD1>=10){
        user.CD1-=10;
        user.MVS+=1;
        alert("Converted 10 CD1 → 1 MVS");
    } else alert("Not enough CD1");
    showProfile();
}

function showBurn(){
    let html = `<h2>🔥 Burn</h2>`;
    html+=`<button onclick="burnCD1()">Burn 1 CD1 → 1 USDT</button>`;
    html+=`<button onclick="burnMVS()">Burn 1 MVS → 10 USDT</button>`;
    document.getElementById("game-area").innerHTML = html;
}

function burnCD1(){
    if(user.CD1>=1){ user.CD1-=1; user.USDT+=1; alert("Burned 1 CD1 → 1 USDT");}
    else alert("Not enough CD1");
    showProfile();
}

function burnMVS(){
    if(user.MVS>=1){ user.MVS-=1; user.USDT+=10; alert("Burned 1 MVS → 10 USDT");}
    else alert("Not enough MVS");
    showProfile();
}

function showLeaderboard(){
    fetch(`${API}/leaderboard`)
        .then(res=>res.json())
        .then(data=>{
            let html=`<h2>🏆 Leaderboard</h2><ol>`;
            data.forEach(u=>html+=`<li>${u[0]} - Total Tokens: ${u[1]}</li>`);
            html+="</ol>";
            document.getElementById("game-area").innerHTML = html;
        });
}
