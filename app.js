/* ================================= */
/* DOM */
/* ================================= */

const setupPage =
document.getElementById(
    "setupPage"
);

const revealPage =
document.getElementById(
    "revealPage"
);

const finalPage =
document.getElementById(
    "finalPage"
);

const teamBuildPage =
document.getElementById(
    "teamBuildPage"
);

const playerInputs =
document.getElementById(
    "playerInputs"
);

const allowDuplicate =
document.getElementById(
    "allowDuplicate"
);

const startBtn =
document.getElementById(
    "startBtn"
);

const restartBtn =
document.getElementById(
    "restartBtn"
);

const teamBuildBtn =
document.getElementById(
    "teamBuildBtn"
);

const countdown =
document.getElementById(
    "countdown"
);

const currentPlayerName =
document.getElementById(
    "currentPlayerName"
);

const allPlayersReveal =
document.getElementById(
    "allPlayersReveal"
);

const finalResultContainer =
document.getElementById(
    "finalResultContainer"
);

const team1Area =
document.getElementById(
    "team1Area"
);

const team2Area =
document.getElementById(
    "team2Area"
);

const availablePlayers =
document.getElementById(
    "availablePlayers"
);

/* ================================= */
/* STATE */
/* ================================= */

let champions = [];

let players = [];

let results = [];

let selectedPlayerCard =
null;

/* ================================= */
/* UTIL */
/* ================================= */

function sleep(ms){

    return new Promise(
        resolve =>
        setTimeout(
            resolve,
            ms
        )
    );
}

function shuffle(array){

    const arr =
    [...array];

    for(
        let i =
        arr.length - 1;
        i > 0;
        i--
    ){

        const j =
        Math.floor(
            Math.random()
            *
            (
                i + 1
            )
        );

        [
            arr[i],
            arr[j]
        ]
        =
        [
            arr[j],
            arr[i]
        ];
    }

    return arr;
}

/* ================================= */
/* PLAYER INPUT CREATE */
/* ================================= */

function createPlayerInputs(){

    playerInputs.innerHTML =
    "";

    for(
        let i = 1;
        i <= 10;
        i++
    ){

        const row =
        document.createElement(
            "div"
        );

        row.className =
        "player-row";

        row.innerHTML = `

            <input
                class="player-name"
                placeholder="플레이어 ${i}"
            >

            <select
                class="champion-count"
            >

                <option value="1">
                    1개
                </option>

                <option value="2">
                    2개
                </option>

                <option value="3">
                    3개
                </option>

                <option value="4">
                    4개
                </option>

                <option value="5">
                    5개
                </option>

            </select>

        `;

        playerInputs.appendChild(
            row
        );
    }
}

createPlayerInputs();

/* ================================= */
/* LOAD CHAMPIONS */
/* ================================= */

async function loadChampions(){

    try{

        const response =
        await fetch(
            "https://ddragon.leagueoflegends.com/cdn/14.24.1/data/ko_KR/champion.json"
        );

        const data =
        await response.json();

        champions =
        Object.values(
            data.data
        );

        console.log(
            "챔피언 로드 완료",
            champions.length
        );

    }
    catch(error){

        console.error(
            error
        );

        alert(
            "챔피언 정보를 불러오지 못했습니다."
        );
    }
}

loadChampions();

/* ================================= */
/* PLAYER COLLECT */
/* ================================= */

function collectPlayers(){

    players = [];

    const rows =
    document.querySelectorAll(
        ".player-row"
    );

    rows.forEach(
        row => {

            const name =
            row
            .querySelector(
                ".player-name"
            )
            .value
            .trim();

            const count =
            Number(
                row
                .querySelector(
                    ".champion-count"
                )
                .value
            );

            if(!name)
                return;

            players.push({

                name,

                count

            });

        }
    );

    return (
        players.length > 0
    );
}

/* ================================= */
/* ASSIGN CHAMPIONS */
/* ================================= */

function assignChampions(){

    results = [];

    const duplicateAllowed =
    allowDuplicate.checked;

    let pool =
    shuffle(
        champions
    );

    players.forEach(
        player => {

            let selected =
            [];

            if(
                duplicateAllowed
            ){

                selected =
                shuffle(
                    champions
                )
                .slice(
                    0,
                    player.count
                );
            }
            else{

                if(
                    pool.length
                    <
                    player.count
                ){

                    alert(
                        "챔피언이 부족합니다."
                    );

                    return;
                }

                selected =
                pool.splice(
                    0,
                    player.count
                );
            }

            results.push({

                player:
                player.name,

                champions:
                selected

            });

        }
    );
}
/* ================================= */
/* CREATE HIDDEN CARD */
/* ================================= */

function createHiddenCard(){

    const card =
    document.createElement(
        "div"
    );

    card.className =
    "champion-card";

    card.innerHTML = `

        <div class="flip-card">

            <div
                class="card-face card-back"
            >
                ?
            </div>

            <div
                class="card-face card-front"
            >

                <img>

                <p></p>

            </div>

        </div>

    `;

    return card;
}

/* ================================= */
/* BUILD REVEAL BOARD */
/* ================================= */

function buildRevealBoard(){

    allPlayersReveal.innerHTML =
    "";

    results.forEach(
        result => {

            const row =
            document.createElement(
                "div"
            );

            row.className =
            "reveal-player-row";

            row.dataset.player =
            result.player;

            row.innerHTML = `

                <div
                    class="reveal-player-name"
                >
                    ${result.player}
                </div>

                <div
                    class="reveal-champion-list"
                >
                </div>

            `;

            const list =
            row.querySelector(
                ".reveal-champion-list"
            );

            result.champions.forEach(
                () => {

                    list.appendChild(
                        createHiddenCard()
                    );

                }
            );

            allPlayersReveal.appendChild(
                row
            );

        }
    );
}

/* ================================= */
/* COUNTDOWN */
/* ================================= */

async function runCountdown(){

    countdown.textContent =
    "3";

    await sleep(333);

    countdown.textContent =
    "2";

    await sleep(333);

    countdown.textContent =
    "1";

    await sleep(334);

    countdown.textContent =
    "";
}

/* ================================= */
/* REVEAL PLAYER */
/* ================================= */

async function revealPlayer(
    result
){

    const rows =
    document.querySelectorAll(
        ".reveal-player-row"
    );

    rows.forEach(
        row =>
        row.classList.remove(
            "active"
        )
    );

    const activeRow =
    [...rows].find(
        row =>
        row.dataset.player
        ===
        result.player
    );

    if(!activeRow)
        return;

    activeRow.classList.add(
        "active"
    );

    currentPlayerName.textContent =
    result.player;

    await runCountdown();

    const cards =
    activeRow.querySelectorAll(
        ".champion-card"
    );

    result.champions.forEach(
        (
            champion,
            index
        ) => {

            const card =
            cards[index];

            card.querySelector(
                ".card-front img"
            ).src =
            `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/${champion.id}.png`;

            card.querySelector(
                ".card-front p"
            ).textContent =
            champion.name;

        }
    );

    await sleep(300);

    /* 한 플레이어의 챔피언 전부 공개 */

    for(
        let i = 0;
        i < cards.length;
        i++
    ){

        cards[i]
        .querySelector(
            ".flip-card"
        )
        .classList.add(
            "flipped"
        );

        await sleep(100);
    }

    /* 다음 플레이어까지 1초 */

    await sleep(1000);
}

/* ================================= */
/* START REVEAL */
/* ================================= */

async function startReveal(){

    for(
        let i = 0;
        i < results.length;
        i++
    ){

        await revealPlayer(
            results[i]
        );

    }

    showFinalPage();
}

/* ================================= */
/* FINAL PAGE */
/* ================================= */

function showFinalPage(){

    revealPage.classList.add(
        "hidden"
    );

    finalPage.classList.remove(
        "hidden"
    );

    renderFinalResults();
}

/* ================================= */
/* FINAL RESULT */
/* ================================= */

function renderFinalResults(){

    finalResultContainer.innerHTML =
    "";

    results.forEach(
        result => {

            const card =
            document.createElement(
                "div"
            );

            card.className =
            "result-player";

            card.innerHTML = `

                <h3>
                    ${result.player}
                </h3>

                <div
                    class="result-champion-list"
                >

                    ${result.champions.map(
                        champion => `

                        <div
                            class="result-champion"
                        >

                            <img
                            src="https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/${champion.id}.png">

                            <p>
                                ${champion.name}
                            </p>

                        </div>

                        `
                    ).join("")}

                </div>

            `;

            finalResultContainer.appendChild(
                card
            );

        }
    );
}
/* ================================= */
/* TEAM BUILD */
/* ================================= */

function createDraftCard(
    player
){

    const card =
    document.createElement(
        "div"
    );

    card.className =
    "draft-player-card";

    card.innerHTML = `

        <div
            class="draft-player-header"
        >

            <div
                class="draft-player-name"
            >
                ${player.player}
            </div>

            <div
                class="draft-player-champions"
            >

                ${player.champions.map(
                    champion => `

                    <img
                    class="mini-champion"
                    src="https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/${champion.id}.png"
                    title="${champion.name}">

                    `
                ).join("")}

            </div>

        </div>

    `;

    card.addEventListener(
        "click",
        () => {

            document
            .querySelectorAll(
                ".draft-player-card"
            )
            .forEach(
                c =>
                c.classList.remove(
                    "selected"
                )
            );

            card.classList.add(
                "selected"
            );

            selectedPlayerCard =
            card;
        }
    );

    return card;
}

/* ================================= */
/* BUILD DRAFT BOARD */
/* ================================= */

function buildDraftBoard(){

    availablePlayers.innerHTML =
    "";

    results.forEach(
        result => {

            availablePlayers.appendChild(
                createDraftCard(
                    result
                )
            );

        }
    );
}

/* ================================= */
/* OPEN TEAM BUILD */
/* ================================= */

function openTeamBuilder(){

    finalPage.classList.add(
        "hidden"
    );

    teamBuildPage.classList.remove(
        "hidden"
    );

    buildDraftBoard();
}

teamBuildBtn.addEventListener(
    "click",
    openTeamBuilder
);

/* ================================= */
/* TEAM ASSIGN */
/* ================================= */

team1Area.addEventListener(
    "click",
    () => {

        if(
            !selectedPlayerCard
        )
        return;

        team1Area.appendChild(
            selectedPlayerCard
        );

        selectedPlayerCard
        .classList.remove(
            "selected"
        );

        selectedPlayerCard =
        null;
    }
);

team2Area.addEventListener(
    "click",
    () => {

        if(
            !selectedPlayerCard
        )
        return;

        team2Area.appendChild(
            selectedPlayerCard
        );

        selectedPlayerCard
        .classList.remove(
            "selected"
        );

        selectedPlayerCard =
        null;
    }
);

/* ================================= */
/* START BUTTON */
/* ================================= */

startBtn.addEventListener(
    "click",
    async () => {

        if(
            champions.length === 0
        ){

            alert(
                "챔피언 데이터를 불러오는 중입니다."
            );

            return;
        }

        const valid =
        collectPlayers();

        if(
            !valid
        ){

            alert(
                "플레이어 이름을 입력해주세요."
            );

            return;
        }

        assignChampions();

        buildRevealBoard();

        setupPage.classList.add(
            "hidden"
        );

        revealPage.classList.remove(
            "hidden"
        );

        await startReveal();
    }
);

/* ================================= */
/* RESTART */
/* ================================= */

restartBtn.addEventListener(
    "click",
    () => {

        location.reload();

    }
);