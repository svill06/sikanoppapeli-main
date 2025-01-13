let players = [];
let scores = [];
let turnScore = 0;
let currentPlayerIndex = 0;
let diceCount = 1;
const targetScore = 100;
let doubleCount = 0;

function generatePlayerInputs() {
    const playerCount = parseInt(document.getElementById("player-count").value);
    const playerNamesDiv = document.getElementById("player-names");
    playerNamesDiv.innerHTML = '';

    for (let i = 1; i <= playerCount; i++) {
        playerNamesDiv.innerHTML += `<input type="text" id="player${i}" placeholder="Pelaaja ${i}" required>`;
    }
}

function startGame() {
    const playerCount = parseInt(document.getElementById("player-count").value);
    players = [];
    scores = Array(playerCount).fill(0);
    diceCount = parseInt(document.getElementById("dice-count").value);
    doubleCount = 0;

    for (let i = 0; i < playerCount; i++) {
        const playerName = document.getElementById(`player${i + 1}`).value || `Pelaaja ${i + 1}`;
        players.push(playerName);
    }

    document.getElementById("setup").style.display = "none";
    document.getElementById("game-info").style.display = "block";
    document.getElementById("scoreboard").style.display = "block";
    updateCurrentPlayer();
    updateScoreboard();
}

function rollDice() {
    let rollSum = 0;
    let rolls = [];

    for (let i = 0; i < diceCount; i++) {
        const roll = Math.floor(Math.random() * 6) + 1;
        rolls.push(roll);
    }

    const [die1, die2] = rolls;
    document.getElementById("last-roll").innerText = `Heitit: ${rolls.join(", ")}`;
    if (diceCount === 2) {
        console.log(die1, die2);
        
        if (die1 === 1 && die2 === 1) {
            turnScore += 25;
            document.getElementById("message").innerText = "Tuplat ykköset! 25 pistettä!";
        } else if (die1 === 1 || die2 === 1) {
            turnScore = 0;
            document.getElementById("message").innerText = "Heitit ykkösen! Vuoro päättyy.";
            setTimeout(endTurn, 1500);
            return;
        } else if (die1 === die2) {
            doubleCount++;
            turnScore += (die1 + die2) * 2;
            document.getElementById("message").innerText = `Tuplat! Saat ${(die1+die2) * 2 } pistettä!`;

            if (doubleCount === 3) {
                turnScore = 0;
                document.getElementById("message").innerText = "Kolmannet tuplat peräkkäin! Vuoro päättyy.";
                setTimeout(endTurn, 1500);
                return;
            }
        } else {
            turnScore += die1 + die2;
            doubleCount = 0;
        }
    } else {
        if (die1 === 1) {
            turnScore = 0;
            document.getElementById("message").innerText = "Hups! Heitit 1, vuoro päättyy!";
            endTurn();
            return;
        }
        turnScore += die1;
    }

    document.getElementById("turn-score").innerText = turnScore;
    
}

function holdTurn() {
    scores[currentPlayerIndex] += turnScore;
    if (scores[currentPlayerIndex] >= targetScore) {
        announceWinner(players[currentPlayerIndex]);
        return;
    }
    endTurn();
}

function endTurn() {
    turnScore = 0;
    doubleCount = 0;
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    updateCurrentPlayer();
    updateScoreboard();
}

function updateCurrentPlayer() {
    document.getElementById("current-player").innerText = players[currentPlayerIndex];
    document.getElementById("turn-score").innerText = turnScore;
}

function updateScoreboard() {
    const scoreList = document.getElementById("score-list");
    scoreList.innerHTML = '';
    players.forEach((player, index) => {
        scoreList.innerHTML += `<li>${player}: ${scores[index]} pistettä</li>`;
    });
}

function announceWinner(winner) {
    document.getElementById("game-info").style.display = "none";
    document.getElementById("scoreboard").style.display = "none";
    document.getElementById("winner-announcement").style.display = "block";
    document.getElementById("winner-message").innerText = `${winner} voitti ${scores[currentPlayerIndex]} pisteellä!`;
}

function resetGame() {
    document.getElementById("setup").style.display = "block";
    document.getElementById("game-info").style.display = "none";
    document.getElementById("scoreboard").style.display = "none";
    document.getElementById("winner-announcement").style.display = "none";
    turnScore = 0;
    currentPlayerIndex = 0;
    doubleCount = 0;
    document.getElementById("turn-score").innerText = turnScore;
}
