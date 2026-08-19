const board = document.getElementById("board");

const rollBtn = document.getElementById("rollBtn");

const resetBtn = document.getElementById("resetBtn");

const dice = document.getElementById("dice");

const turn = document.getElementById("turn");

const message = document.getElementById("message");

const pos1 = document.getElementById("pos1");

const pos2 = document.getElementById("pos2");

const player1Card =
    document.getElementById("player1Card");

const player2Card =
    document.getElementById("player2Card");


// ============================================
// GAME VARIABLES
// ============================================

let playerPositions = {
    1: 1,
    2: 1
};

let currentPlayer = 1;

let gameOver = false;


// ============================================
// SNAKES
// ============================================

const snakes = {

    99: 80,
    95: 75,
    92: 88,
    89: 68,
    74: 53,
    64: 60,
    62: 19,
    48: 26,
    17: 7

};


// ============================================
// LADDERS
// ============================================

const ladders = {

    4: 25,
    9: 31,
    21: 42,
    28: 84,
    36: 57,
    51: 67,
    71: 91,
    80: 99

};


// ============================================
// DICE FACES
// ============================================

const diceFaces = {

    1: "⚀",
    2: "⚁",
    3: "⚂",
    4: "⚃",
    5: "⚄",
    6: "⚅"

};


// ============================================
// CREATE BOARD
// ============================================

function createBoard() {

    board.innerHTML = "";

    /*
       The board uses zig-zag numbering.

       Top:

       100 99 98 ... 91

       Bottom:

       1 2 3 4 ... 10
    */

    for (let row = 9; row >= 0; row--) {

        let numbers = [];

        const start = row * 10 + 1;

        for (let i = 0; i < 10; i++) {

            numbers.push(start + i);

        }

        // Reverse every alternate row

        if (row % 2 === 1) {

            numbers.reverse();

        }

        numbers.forEach(number => {

            const cell =
                document.createElement("div");

            cell.classList.add("cell");

            cell.dataset.number = number;


            // Number

            const numberElement =
                document.createElement("span");

            numberElement.className = "number";

            numberElement.textContent = number;

            cell.appendChild(numberElement);


            // Snake

            if (snakes[number]) {

                cell.classList.add("snake");

            }


            // Ladder

            if (ladders[number]) {

                cell.classList.add("ladder");

            }


            // Player container

            const pieces =
                document.createElement("div");

            pieces.className = "pieces";

            cell.appendChild(pieces);


            board.appendChild(cell);

        });

    }

    updatePlayers();

}


// ============================================
// UPDATE PLAYER PIECES
// ============================================

function updatePlayers() {

    document
        .querySelectorAll(".pieces")
        .forEach(element => {

            element.innerHTML = "";

        });


    addPlayerPiece(
        1,
        playerPositions[1]
    );

    addPlayerPiece(
        2,
        playerPositions[2]
    );


    pos1.textContent =
        playerPositions[1];

    pos2.textContent =
        playerPositions[2];

}


// ============================================
// ADD PLAYER PIECE
// ============================================

function addPlayerPiece(player, position) {

    const cell =
        document.querySelector(
            `[data-number="${position}"]`
        );

    if (!cell) return;


    const pieces =
        cell.querySelector(".pieces");


    const piece =
        document.createElement("span");

    piece.classList.add(
        "piece"
    );

    piece.classList.add(
        player === 1 ? "red" : "blue"
    );


    pieces.appendChild(piece);

}


// ============================================
// ROLL DICE
// ============================================

rollBtn.addEventListener(
    "click",
    rollDice
);


function rollDice() {

    if (gameOver) return;


    rollBtn.disabled = true;


    dice.classList.add("rolling");


    const number =
        Math.floor(Math.random() * 6) + 1;


    setTimeout(() => {

        dice.classList.remove("rolling");


        dice.textContent =
            diceFaces[number];


        movePlayer(number);

    }, 500);

}


// ============================================
// MOVE PLAYER
// ============================================

function movePlayer(number) {

    const oldPosition =
        playerPositions[currentPlayer];


    let newPosition =
        oldPosition + number;


    // Player cannot go over 100

    if (newPosition > 100) {

        message.textContent =
            `You rolled ${number}. You need an exact number to reach 100.`;

        changeTurn();

        return;

    }


    playerPositions[currentPlayer] =
        newPosition;


    updatePlayers();


    message.textContent =
        `Player ${currentPlayer} rolled ${number}.`;


    // Check snake

    if (snakes[newPosition]) {

        const destination =
            snakes[newPosition];


        setTimeout(() => {

            playerPositions[currentPlayer] =
                destination;


            updatePlayers();


            message.textContent =
                `🐍 Player ${currentPlayer} went down the snake to ${destination}!`;


            checkWinner();

        }, 700);

        return;

    }


    // Check ladder

    if (ladders[newPosition]) {

        const destination =
            ladders[newPosition];


        setTimeout(() => {

            playerPositions[currentPlayer] =
                destination;


            updatePlayers();


            message.textContent =
                `🪜 Player ${currentPlayer} climbed the ladder to ${destination}!`;


            checkWinner();

        }, 700);

        return;

    }


    checkWinner();

}


// ============================================
// CHECK WINNER
// ============================================

function checkWinner() {

    if (
        playerPositions[currentPlayer] === 100
    ) {

        gameOver = true;


        turn.textContent =
            `🏆 Player ${currentPlayer} Wins!`;


        message.textContent =
            `🎉 Congratulations Player ${currentPlayer}!`;


        rollBtn.disabled = true;


        return;

    }


    changeTurn();

}


// ============================================
// CHANGE TURN
// ============================================

function changeTurn() {

    currentPlayer =
        currentPlayer === 1 ? 2 : 1;


    turn.textContent =
        `Player ${currentPlayer}'s Turn`;


    player1Card.classList.remove("active");

    player2Card.classList.remove("active");


    if (currentPlayer === 1) {

        player1Card.classList.add("active");

    } else {

        player2Card.classList.add("active");

    }


    rollBtn.disabled = false;

}


// ============================================
// RESET GAME
// ============================================

resetBtn.addEventListener(
    "click",
    resetGame
);


function resetGame() {

    playerPositions = {
        1: 1,
        2: 1
    };


    currentPlayer = 1;

    gameOver = false;


    dice.textContent = "🎲";


    turn.textContent =
        "Player 1's Turn";


    message.textContent =
        "Roll the dice to begin!";


    player1Card.classList.add("active");

    player2Card.classList.remove("active");


    rollBtn.disabled = false;


    createBoard();

}


// ============================================
// START GAME
// ============================================

createBoard();
