var choose = document.getElementById("choose");
var displayWinner = document.getElementById("display-winner");
var x = document.getElementById("x");
var o = document.getElementById("o");
var box = document.getElementsByClassName("box");
var boxes = ["box1", "box2", "box3", "box4", "box5", "box6", "box7", "box8", "box9"];
var angles = ["box1", "box3", "box7", "box9"];
var player, computer, playerMove, computerMove;
var storeComputerMove = [];
var storePlayerMove = [];
var game = true;
var playerCount = 0;
var computerCount = 0;


window.onload = function() {
  choose.style.opacity = 1;
};

var chooseSide = function() {
  game = true;
  x.addEventListener("click", function() {
    player = "X";
    computer = "O";
    choose.style.opacity = 0;
    setTimeout(function() {
      choose.classList.add("hidden");
    }, 2000);
  });

  o.addEventListener("click", function() {
    player = "O";
    computer = "X";
    choose.style.opacity = 0;
    setTimeout(function() {
      choose.classList.add("hidden");
    }, 2000);
  });
}

var playerMove = function() {
  for (var i = 0; i < box.length; i++) {
    box[i].addEventListener('click', function(e) {
      if (this.innerHTML.length === 0) {
        playerCount++;
        this.innerHTML = player;
        playerMove = this.id;
        storePlayerMove.push(playerMove);
        boxes.splice(boxes.indexOf(playerMove), 1)
        console.log(storePlayerMove);
        getWinner(storePlayerMove, player);
        getComputerMove();
      }
    });
  }
}

var getComputerMove = function() {
  if (game === true) {
    if (computerCount === 0 && storePlayerMove.indexOf("box5") < 0) {
      computerMove = document.getElementById("box5");

    } else {
      var randomNum = Math.floor(Math.random() * boxes.length);
      var randomBoxId = boxes[randomNum];
      computerMove = document.getElementById(randomBoxId);
    }

    var printComputerMove = setTimeout(function() {
      computerMove.innerHTML = computer;
    }, 1000);
    storeComputerMove.push(computerMove.id);
    boxes.splice(boxes.indexOf(computerMove.id), 1);
    computerCount++;
    console.log(storeComputerMove);
    getWinner(storeComputerMove, computer);
  }
}


var getWinner = function(arr, winner) {
  if (arr.indexOf('box1') !== -1 && arr.indexOf('box2') !== -1 && arr.indexOf('box3') !== -1 ||
    arr.indexOf('box4') !== -1 && arr.indexOf('box5') !== -1 && arr.indexOf('box6') !== -1 ||
    arr.indexOf('box7') !== -1 && arr.indexOf('box8') !== -1 && arr.indexOf('box9') !== -1 ||
    arr.indexOf('box1') !== -1 && arr.indexOf('box4') !== -1 && arr.indexOf('box7') !== -1 ||
    arr.indexOf('box2') !== -1 && arr.indexOf('box5') !== -1 && arr.indexOf('box8') !== -1 ||
    arr.indexOf('box3') !== -1 && arr.indexOf('box6') !== -1 && arr.indexOf('box9') !== -1 ||
    arr.indexOf('box3') !== -1 && arr.indexOf('box5') !== -1 && arr.indexOf('box7') !== -1 ||
    arr.indexOf('box1') !== -1 && arr.indexOf('box5') !== -1 && arr.indexOf('box9') !== -1) {
    game = false;
    displayWinner.innerHTML = winner + " wins!";
    displayWinner.classList.remove("hidden");
    var printDisplayWinner = setTimeout(function() {
      displayWinner.style.opacity = 1;
    }, 1000)
    reset();
  } else if (boxes.length == 0) {
    game = false;
    displayWinner.innerHTML = "It's a draw...";
    displayWinner.classList.remove("hidden");
    var printDisplayWinner = setTimeout(function() {
      displayWinner.style.opacity = 1;
    }, 1000)
    reset();
  }
}

var reset = function() {
  boxes = ["box1", "box2", "box3", "box4", "box5", "box6", "box7", "box8", "box9"];
  storeComputerMove = [];
  storePlayerMove = [];
  playerCount = 0;
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


chooseSide();
playerMove();
