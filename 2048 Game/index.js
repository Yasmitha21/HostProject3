const board = document.getElementById('game-board');
const restartButton = document.getElementById('restart');
const startButton = document.getElementById('start-button');
const scoreDisplay = document.getElementById('score');
const instructions = document.getElementById('instructions');
const gameContainer = document.getElementById('game-container');

const SIZE = 4;
let boardState = [];
let score = 0;
let gameOver = false;


const getRandomEmptyCell = () => {
    let emptyCells = [];
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            if (boardState[row][col] === 0) {
                emptyCells.push([row, col]);
            }
        }
    }
    return emptyCells.length > 0 ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : null;
};


const startNewGame = () => {
    removeGameOverMessage();
    gameContainer.style.opacity = '1'; 

    boardState = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
    score = 0;  
    gameOver = false;

    addRandomTile();
    addRandomTile();
    renderBoard();
    hideInstructions();  
};


const addRandomTile = () => {
    const cell = getRandomEmptyCell();
    if (cell) {
        const [row, col] = cell;
        boardState[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
};


const renderBoard = () => {
    board.innerHTML = ''; 
    boardState.forEach(row => {
        row.forEach(cell => {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            if (cell !== 0) {
                tile.textContent = cell;
                tile.style.backgroundColor = getTileColor(cell);
            }
            board.appendChild(tile);
        });
    });

    scoreDisplay.textContent = `Score: ${score}`;

    if (isGameOver()) {
        showGameOverMessage();
    }
};


const getTileColor = (value) => {
    const colors = {
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e',
    };
    return colors[value] || '#cdc1b4';
};


const slideLeft = () => {
    for (let row = 0; row < SIZE; row++) {
        let newRow = boardState[row].filter(cell => cell !== 0);
        while (newRow.length < SIZE) newRow.push(0);
        for (let col = 0; col < SIZE - 1; col++) {
            if (newRow[col] === newRow[col + 1] && newRow[col] !== 0) {
                newRow[col] *= 2;
                score += newRow[col];  
                newRow[col + 1] = 0;
            }
        }
        newRow = newRow.filter(cell => cell !== 0);
        while (newRow.length < SIZE) newRow.push(0);
        boardState[row] = newRow;
    }
};


const slideRight = () => {
    boardState.forEach(row => row.reverse());
    slideLeft();
    boardState.forEach(row => row.reverse());
};

const slideUp = () => {
    boardState = transpose(boardState);
    slideLeft();
    boardState = transpose(boardState);
};

const slideDown = () => {
    boardState = transpose(boardState);
    slideRight();
    boardState = transpose(boardState);
};


const transpose = (matrix) => matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));


const handleKeyPress = (event) => {
    if (gameOver) return;

    const previousState = JSON.stringify(boardState);

    if (event.key === 'ArrowLeft') slideLeft();
    else if (event.key === 'ArrowRight') slideRight();
    else if (event.key === 'ArrowUp') slideUp();
    else if (event.key === 'ArrowDown') slideDown();

    if (JSON.stringify(boardState) !== previousState) {
        addRandomTile();
        renderBoard();
    }
};


const isGameOver = () => {
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            if (boardState[row][col] === 0) return false;
            if (row < SIZE - 1 && boardState[row][col] === boardState[row + 1][col]) return false;
            if (col < SIZE - 1 && boardState[row][col] === boardState[row][col + 1]) return false;
        }
    }
    return true;
};


const showGameOverMessage = () => {
    if (!document.querySelector('.game-over')) {
        const gameOverMessage = document.createElement('div');
        gameOverMessage.classList.add('game-over');
        gameOverMessage.innerHTML = `Game Over! Your Score: <strong>${score}</strong><br>Press Restart to Play Again.`;
        document.body.appendChild(gameOverMessage); 
    }

    gameOver = true;
    gameContainer.style.opacity = '0.3'; 
};


const removeGameOverMessage = () => {
    const gameOverMessage = document.querySelector('.game-over');
    if (gameOverMessage) {
        gameOverMessage.remove();
    }
};

const hideInstructions = () => {
    instructions.style.display = 'none';
    gameContainer.style.display = 'block';
};


startButton.addEventListener('click', startNewGame);
window.addEventListener('keydown', handleKeyPress);
restartButton.addEventListener('click', startNewGame);
