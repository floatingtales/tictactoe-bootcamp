// Please implement exercise logic here

/**
 * =============================
 * GLOBAL VARIABLES
 * =============================
*/

const P1EMOJI = '❌';
const P2EMOJI = '⭕';
const TIMERMS = 500;

const gameBoardSize = 3;
const gameBoard = [];

let canPlayerClick = true;

let currentPlayer = P1EMOJI;

const gameContainer = document.createElement('div');
gameContainer.id = 'container';

const boardDiv = document.createElement('div');
boardDiv.id = 'board';

const infoDiv = document.createElement('div');
infoDiv.id = 'game-info';
infoDiv.innerText = 'Press to play!';

const gameButton = document.createElement('button');
gameButton.id = 'game-button';
gameButton.innerText = 'Start!';

gameContainer.append(gameButton, infoDiv);
document.body.append(gameContainer);

/**
 * =============================
 * HELPER FUNCTIONS
 * =============================
 */

const buildBoard = () => {
  gameBoard.length = 0;
  for (let i = 0; i < gameBoardSize; i += 1) {
    const rowArray = [];
    for (let j = 0; j < gameBoardSize; j += 1) {
      rowArray.push('');
    }
    gameBoard.push(rowArray);
  }
};

/**
 * Reassigns current player
 */
const changePlayer = () => { currentPlayer = (currentPlayer === P1EMOJI) ? P2EMOJI : P1EMOJI; };

/**
 * A function to check whether a player has won or not
 * @returns true if currentPlayer wins, false otherwise
 */
const winCheck = () => {
  // check row win
  for (let i = 0; i < gameBoardSize; i += 1) {
    let playerInRow = 0;
    for (let j = 0; j < gameBoardSize; j += 1) {
      if (currentPlayer === gameBoard[i][j]) { playerInRow += 1; }
    }
    if (playerInRow === gameBoardSize) { return true; }
  }

  // check column win
  for (let i = 0; i < gameBoardSize; i += 1) {
    let playerInColumn = 0;
    for (let j = 0; j < gameBoardSize; j += 1) {
      if (currentPlayer === gameBoard[j][i]) { playerInColumn += 1; }
    }
    if (playerInColumn === gameBoardSize) { return true; }
  }

  // check diagonal (top left to bottom right) win
  let playerInDiagonalOne = 0;
  for (let i = 0; i < gameBoardSize; i += 1) {
    if (currentPlayer === gameBoard[i][i]) { playerInDiagonalOne += 1; }
  }
  if (playerInDiagonalOne === gameBoardSize) { return true; }

  // check diagonal (bottom left to top right) win
  let playerInDiagonalTwo = 0;
  for (let i = 0; i < gameBoardSize; i += 1) {
    if (currentPlayer === gameBoard[i][gameBoardSize - 1 - i]) { playerInDiagonalTwo += 1; }
  }
  if (playerInDiagonalTwo === gameBoardSize) { return true; }

  return false;
};

/**
 * =============================
 * HANDLER/CALLBACK FUNCTIONS
 * =============================
 */

/**
 * handler for clicks inside the game squares
 * @param {number} row the row of square clicked
 * @param {number} column the column of square clicked
 * @returns null
 */
const handleClick = (row, column) => {
  if (!canPlayerClick) {
    updateGameInfo('Player can\'t click now!');
    if (!winCheck()) {
      setTimeout(() => updateGameInfo(`It's ${currentPlayer}'s turn now!`), TIMERMS);
      return;
    }
    setTimeout(() => updateGameInfo(`${currentPlayer} Won! Reset to play again`), TIMERMS);
    return;
  }

  if (gameBoard[row][column]) {
    updateGameInfo('Square is used!');
    setTimeout(() => updateGameInfo(`It's ${currentPlayer}'s turn now!`), TIMERMS);
    return;
  }

  gameBoard[row][column] = currentPlayer;
  buildBoardGUI();

  if (winCheck()) {
    canPlayerClick = false;
    updateGameInfo(`${currentPlayer} Won! Reset to play again`);
    gameButton.disabled = false;
    gameButton.innerText = 'Reset!';
    return;
  }

  changePlayer();
  updateGameInfo(`It's ${currentPlayer}'s turn now!`);
};

/**
 * =============================
 * GAME / DOM FUNCTIONS
 * =============================
 */

/**
 * build the Graphical User Interface for the gameBoard
 */
const buildBoardGUI = () => {
  boardDiv.innerHTML = '';

  for (let i = 0; i < gameBoard.length; i += 1) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row';
    for (let j = 0; j < gameBoard[i].length; j += 1) {
      const squareDiv = document.createElement('div');
      squareDiv.className = 'square';
      squareDiv.innerText = gameBoard[i][j];
      rowDiv.append(squareDiv);
      squareDiv.addEventListener('click', () => { handleClick(i, j); });
    }
    boardDiv.append(rowDiv);
  }
  gameContainer.append(boardDiv);
};

const updateGameInfo = (message) => { infoDiv.innerText = message; };

/**
 * Initializes game
 */
const initGame = () => {
  buildBoard();
  buildBoardGUI();
  gameButton.disabled = true;
  canPlayerClick = true;
  updateGameInfo(`${currentPlayer} to start!`);
};

gameButton.addEventListener('click', initGame);
