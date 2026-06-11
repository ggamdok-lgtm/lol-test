/* LOL Random Champion Picker - app.js */
/* Generated final version based on provided parts */

/* ================================= */
/* DOM */
/* ================================= */

const setupPage = document.getElementById("setupPage");
const revealPage = document.getElementById("revealPage");
const finalPage = document.getElementById("finalPage");
const teamBuildPage = document.getElementById("teamBuildPage");

const playerInputs = document.getElementById("playerInputs");
const allowDuplicate = document.getElementById("allowDuplicate");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const teamBuildBtn = document.getElementById("teamBuildBtn");

const countdown = document.getElementById("countdown");
const currentPlayerName = document.getElementById("currentPlayerName");
const allPlayersReveal = document.getElementById("allPlayersReveal");

const finalResultContainer = document.getElementById("finalResultContainer");

const team1Area = document.getElementById("team1Area");
const team2Area = document.getElementById("team2Area");
const availablePlayers = document.getElementById("availablePlayers");

let champions = [];
let players = [];
let results = [];
let selectedPlayerCard = null;

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

function shuffle(array){
    const arr = [...array];
    for(let i = arr.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function createPlayerInputs(){
    playerInputs.innerHTML = "";
    for(let i=1;i<=10;i++){
        const row = document.createElement("div");
        row.className = "player-row";
        row.innerHTML = `
            <input class="player-name" placeholder="플레이어 ${i}">
            <select class="champion-count">
                <option value="1">1개</option>
                <option value="2">2개</option>
                <option value="3">3개</option>
                <option value="4">4개</option>
                <option value="5">5개</option>
            </select>
        `;
        playerInputs.appendChild(row);
    }
}
createPlayerInputs();

async function loadChampions(){
    const response = await fetch("https://ddragon.leagueoflegends.com/cdn/14.24.1/data/ko_KR/champion.json");
    const data = await response.json();
    champions = Object.values(data.data);
}
loadChampions();

function collectPlayers(){
    players = [];
    document.querySelectorAll(".player-row").forEach(row=>{
        const name = row.querySelector(".player-name").value.trim();
        const count = Number(row.querySelector(".champion-count").value);
        if(!name) return;
        players.push({name,count});
    });
    return players.length > 0;
}

function assignChampions(){
    results = [];
    const duplicateAllowed = allowDuplicate.checked;
    let pool = shuffle(champions);

    players.forEach(player=>{
        let selected = [];
        if(duplicateAllowed){
            selected = shuffle(champions).slice(0, player.count);
        }else{
            selected = pool.splice(0, player.count);
        }
        results.push({
            player: player.name,
            champions: selected
        });
    });
}

function createHiddenCard(){
    const card = document.createElement("div");
    card.className = "champion-card";
    card.innerHTML = `
    <div class="flip-card">
        <div class="card-face card-back">?</div>
        <div class="card-face card-front">
            <img>
            <p></p>
        </div>
    </div>`;
    return card;
}

function buildRevealBoard(){
    allPlayersReveal.innerHTML = "";
    results.forEach(result=>{
        const row = document.createElement("div");
        row.className = "reveal-player-row";
        row.dataset.player = result.player;
        row.innerHTML = `
            <div class="reveal-player-name">${result.player}</div>
            <div class="reveal-champion-list"></div>`;

        const list = row.querySelector(".reveal-champion-list");
        result.champions.forEach(()=>list.appendChild(createHiddenCard()));
        allPlayersReveal.appendChild(row);
    });
}

async function runCountdown(){
    countdown.textContent="3"; await sleep(333);
    countdown.textContent="2"; await sleep(333);
    countdown.textContent="1"; await sleep(334);
    countdown.textContent="";
}

async function revealPlayer(result){
    const rows = document.querySelectorAll(".reveal-player-row");
    rows.forEach(r=>r.classList.remove("active"));

    const activeRow = [...rows].find(r=>r.dataset.player===result.player);
    if(!activeRow) return;

    activeRow.classList.add("active");
    currentPlayerName.textContent = result.player;

    await runCountdown();

    const cards = activeRow.querySelectorAll(".champion-card");

    result.champions.forEach((champion,index)=>{
        const card = cards[index];
        card.querySelector(".card-front img").src =
        `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/${champion.id}.png`;
        card.querySelector(".card-front p").textContent = champion.name;
    });

    await sleep(300);

    for(let i=0;i<cards.length;i++){
        cards[i].querySelector(".flip-card").classList.add("flipped");
        await sleep(100);
    }

    await sleep(1000);
}

async function startReveal(){
    for(const result of results){
        await revealPlayer(result);
    }
    showFinalPage();
}

function showFinalPage(){
    revealPage.classList.add("hidden");
    finalPage.classList.remove("hidden");
    renderFinalResults();
}

function renderFinalResults(){
    finalResultContainer.innerHTML = "";

    results.forEach(result=>{
        const card = document.createElement("div");
        card.className = "result-player";

        card.innerHTML = `
            <h3>${result.player}</h3>
            <div class="result-champion-list">
                ${result.champions.map(champion=>`
                    <div class="result-champion">
                        <img src="https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/${champion.id}.png">
                        <p>${champion.name}</p>
                    </div>
                `).join("")}
            </div>`;

        finalResultContainer.appendChild(card);
    });
}

function createDraftCard(player){
    const card = document.createElement("div");
    card.className = "draft-player-card";

    card.innerHTML = `
        <div class="draft-player-header">
            <div class="draft-player-name">${player.player}</div>
            <div class="draft-player-champions">
                ${player.champions.map(champion=>`
                    <img class="mini-champion"
                    src="https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/${champion.id}.png"
                    title="${champion.name}">
                `).join("")}
            </div>
        </div>`;

    card.addEventListener("click", ()=>{
        document.querySelectorAll(".draft-player-card")
            .forEach(c=>c.classList.remove("selected"));
        card.classList.add("selected");
        selectedPlayerCard = card;
    });

    return card;
}

function buildDraftBoard(){
    availablePlayers.innerHTML = "";
    results.forEach(result=>{
        availablePlayers.appendChild(createDraftCard(result));
    });
}

function openTeamBuilder(){
    finalPage.classList.add("hidden");
    teamBuildPage.classList.remove("hidden");
    buildDraftBoard();
}

function movePlayerToTeam(teamArea){
    if(!selectedPlayerCard) return;

    teamArea.appendChild(selectedPlayerCard);
    selectedPlayerCard.classList.remove("selected");
    selectedPlayerCard = null;
}

teamBuildBtn?.addEventListener("click", openTeamBuilder);
team1Area?.addEventListener("click", ()=>movePlayerToTeam(team1Area));
team2Area?.addEventListener("click", ()=>movePlayerToTeam(team2Area));

startBtn?.addEventListener("click", async ()=>{
    if(champions.length===0){
        alert("챔피언 데이터를 불러오는 중입니다.");
        return;
    }

    if(!collectPlayers()){
        alert("플레이어 이름을 입력해주세요.");
        return;
    }

    assignChampions();
    buildRevealBoard();

    setupPage.classList.add("hidden");
    revealPage.classList.remove("hidden");

    await startReveal();
});

restartBtn?.addEventListener("click", ()=>{
    location.reload();
});
