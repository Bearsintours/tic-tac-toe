var choose = document.getElementById("choose");
var displayWinner = document.getElementById("display-winner");
var x = document.getElementById("x");
var o = document.getElementById("o");
var box = document.getElementsByClassName("box");
var board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var angles = [0, 2, 6, 8];
var sides = [1, 3, 5, 7];
var wins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
var keys = {
  "box0": 0,
  "box1": 1,
  "box2": 2,
  "box3": 3,
  "box4": 4,
  "box5": 5,
  "box6": 6,
  "box7": 7,
  "box8": 8
};
var human, computer, humanMove, computerMove, movesLeft, boxToPlay;
var storeComputerMove = [];
var storeHumanMove = [];
var game = true;
var humanCount = 0;
var computerCount = 0;

// Helper functions

// Filter board to get all the possible moves left
function filtered(board) {
  return board.filter(function(el) {
    return el !== "X" && el !== "O";
  })
}

// Check for win : if 3 in a row --> it's a win & print winner / else check for a draw
function getWinner(arr, winner) {
  if (arr.indexOf(0) !== -1 && arr.indexOf(1) !== -1 && arr.indexOf(2) !== -1 ||
    arr.indexOf(3) !== -1 && arr.indexOf(4) !== -1 && arr.indexOf(5) !== -1 ||
    arr.indexOf(6) !== -1 && arr.indexOf(7) !== -1 && arr.indexOf(8) !== -1 ||
    arr.indexOf(0) !== -1 && arr.indexOf(3) !== -1 && arr.indexOf(6) !== -1 ||
    arr.indexOf(1) !== -1 && arr.indexOf(4) !== -1 && arr.indexOf(7) !== -1 ||
    arr.indexOf(2) !== -1 && arr.indexOf(5) !== -1 && arr.indexOf(8) !== -1 ||
    arr.indexOf(2) !== -1 && arr.indexOf(4) !== -1 && arr.indexOf(6) !== -1 ||
    arr.indexOf(0) !== -1 && arr.indexOf(4) !== -1 && arr.indexOf(8) !== -1) {
    game = false;
    displayWinner.innerHTML = winner + " wins!";
    displayWinner.classList.remove("hidden");
    var printDisplayWinner = setTimeout(function() {
      displayWinner.style.opacity = 1;
    }, 1000)
    reset();
  } else if (movesLeft.length === 0) {
    game = false;
    displayWinner.innerHTML = "It's a draw...";
    displayWinner.classList.remove("hidden");
    var printDisplayWinner = setTimeout(function() {
      displayWinner.style.opacity = 1;
    }, 1000)
    reset();
  }
}

// Check if 2 in a row : if human has 2 in a row -> block, if computer has 2 in a row -> 3rd move wins (need to be implemented)
function winRow(board) {
  for (var i = 0; i < wins.length; i++) {
    if (board[wins[i][0]] === "O" && board[wins[i][0]] === board[wins[i][1]]) {
      if (board[wins[i][2]] !== "0" && board[wins[i][2]] !== "X") {
        boxToPlay = document.getElementById("box" + wins[i][2]);
        console.log("boxToPlay = " + wins[i][2]);
        makeMove();
      }
    } else if (board[wins[i][0]] === "O" && board[wins[i][0]] === board[wins[i][2]]) {
      if (board[wins[i][1]] !== "0" && board[wins[i][1]] !== "X") {
        boxToPlay = document.getElementById("box" + wins[i][1]);
        console.log("boxToPlay = " + wins[i][1]);
        makeMove();
      }
    } else if (board[wins[i][1]] === "O" && board[wins[i][1]] === board[wins[i][2]]) {
      if (board[wins[i][0]] !== "0" && board[wins[i][0]] !== "X") {
        boxToPlay = document.getElementById("box" + wins[i][0]);
        console.log("boxToPlay = " + wins[i][0]);
        makeMove();
      }
    }
  }
}

// Function to check for a win (used for minimax) / if winner --> return true
function winning(board, player) {
  if ((board[0] == player && board[1] == player && board[2] == player) ||
    (board[3] == player && board[4] == player && board[5] == player) ||
    (board[6] == player && board[7] == player && board[8] == player) ||
    (board[0] == player && board[3] == player && board[6] == player) ||
    (board[1] == player && board[4] == player && board[7] == player) ||
    (board[2] == player && board[5] == player && board[8] == player) ||
    (board[0] == player && board[4] == player && board[8] == player) ||
    (board[2] == player && board[4] == player && board[6] == player)) {
    return true;
  } else {
    return false;
  }
}

// Reset game and refresh for new game
function reset() {
  board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  storeComputerMove = [];
  storeHumanMove = [];
  humanCount = 0;
  computerCount = 0;
  var newGame = setTimeout(function() {
    for (var i = 0; i < box.length; i++) {
      box[i].innerHTML = "";
    }
    displayWinner.style.opacity = 0;
    displayWinner.classList.add("hidden");
    choose.classList.remove("hidden");
    choose.style.opacity = 1;
    chooseSide();
  }, 5000)
}

// Function to get random number (used for first computer move if human played box4)
function randomNumber() {
  var randomNum = Math.floor(Math.random() * movesLeft.length);
  boxToPlay = document.getElementById("box" + movesLeft[randomNum]);
  return makeMove();
}

// Function using Minimax algorithm (inspired by https://medium.freecodecamp.org/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37)
function minimax(newBoard, player) {
  var boxesLeft = filtered(newBoard);
  if (winning(newBoard, human)) {
    return {
      score: -10
    };
  } else if (winning(newBoard, computer)) {
    return {
      score: 10
    };
  } else if (boxesLeft.length === 0) {
    return {
      score: 0
    };
  }

  var moves = [];
  for (var i = 0; i < boxesLeft.length; i++) {
    var move = {};
    move.index = newBoard[boxesLeft[i]];
    newBoard[boxesLeft[i]] = player;
    if (player === computer) {
      var result = minimax(newBoard, human);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, computer);
      move.score = result.score;
    }
    newBoard[boxesLeft[i]] = move.index;
    moves.push(move);
  }
  var bestMove;
  if (player === computer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

// End helper function


// Start game

// Choose X or O message fade in on page load
window.onload = function() {
  choose.style.opacity = 1;
};

// Choose X or O and on click message fades out
var chooseSide = function() {
  game = true;
  x.addEventListener("click", function() {
    human = "X";
    computer = "O";
    choose.style.opacity = 0;
    setTimeout(function() {
      choose.classList.add("hidden");
    }, 2000);
  });

  o.addEventListener("click", function() {
    human = "O";
    computer = "X";
    choose.style.opacity = 0;
    setTimeout(function() {
      choose.classList.add("hidden");
    }, 2000);
  });
}

// On box click: prints and stores player move, updates board, checks for winner and triggers computer move
var playerMove = function() {
  for (var i = 0; i < box.length; i++) {
    box[i].addEventListener('click', function(e) {
      if (this.innerHTML.length === 0) {
        humanCount++;
        this.innerHTML = human;
        humanMove = keys[this.id];
        storeHumanMove.push(humanMove);
        board[humanMove] = human;
        movesLeft = filtered(board);
        console.log(board);
        getWinner(storeHumanMove, human);
        getComputerMove();
      }
    });
  }
}

// Computer move
var getComputerMove = function() {
  var id;
  //function to print and store computer move, update board and check for winner
  function makeMove() {
    var printComputerMove = setTimeout(function() {
      boxToPlay.innerHTML = computer;
    }, 1000);
    computerCount++;
    id = boxToPlay.id;
    computerMove = keys[id];
    storeComputerMove.push(computerMove);
    board[computerMove] = computer;
    movesleft = filtered(board);
    console.log(board);
    getWinner(storeComputerMove, computer);
  }

  if (game === true) {
    if (computerCount === 0) {
      // on first move : choose box4 or random box if human already chose box4
      if (storeHumanMove.indexOf(4) < 0) {
        boxToPlay = document.getElementById("box4");
        console.log("boxToPlay = " + boxToPlay.id);
        makeMove();
      } else {
        var randomNum = Math.floor(Math.random() * movesLeft.length);
        boxToPlay = document.getElementById("box" + movesLeft[randomNum]);
        makeMove();
      }
      //  After first move : use function minimax to get best move possible
    } else {
      var minimaxMove = minimax(board, computer);
      boxToPlay = document.getElementById("box" + minimaxMove.index);
      console.log(boxToPlay);
      makeMove();
    }
  }
}


chooseSide();
playerMove();
