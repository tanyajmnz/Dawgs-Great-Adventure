//board
let boardWidth = 1000;
let boardHeight = 600;
const board = document.getElementById('board')
const context = board.getContext('2d');

//dawg
let dawgWidth = 200;
let dawgHeight = 200;
let dawgX = 50;
let dawgY = boardHeight - dawgHeight
let dawgImg = new Image();
dawgImg.src = 'dog.png'

let dawg = {
    x : dawgX,
    y : dawgY,
    width : dawgWidth,
    height : dawgHeight,
    isDucking: false
}

//physics
let velocityX = -8; //obs moving left speed
let velocityY = 0;
let gravity = .5;

let gameOver = false;
let score = 0;
let trials = 0;
let restartCount = 0;

//obs
let obsList = []
let snake = new Image()
snake.src = 'sneyk.png'
let bird = new Image()
bird.src = 'flappy.png'

//util
const bottomYDawg = boardHeight - dawgHeight
const topMostBirdY = bird.height + 200
const bottomMostBirdY = bird.height + 500
const bottomYSnake = boardHeight - snake.height - 100

function dawgMovementUpdate() {
    velocityY += gravity;
    dawg.y = Math.min(dawg.y + velocityY, dawgY);
}

function moveDawg() {
    if(upPressed && dawg.y == bottomYDawg){
      velocityY = -15
    }
    if(downPressed && dawg.y <bottomYDawg){
      gravity = 10
    }
    if(downPressed == false){
      dawg.isDucking = false
      dawgHeight = 200
      gravity = .5
    }
    if(downPressed && dawg.y == bottomYDawg){
      dawgHeight = 100
      dawg.isDucking = true
      spawnObs()
    }
    dawg.height = dawgHeight
    console.log('grav: ',gravity,'dawgHeight: ', dawg.height,'dawgY: ', dawg.y,'velocityY: ', velocityY,'upPressed: ', upPressed)
    dawgMovementUpdate()
}
function drawDawg() {
  if(dawg.isDucking){
    context.drawImage(dawgImg, dawg.x, (dawg.y * 1.25), dawg.width, dawg.height)
  } else {
    context.drawImage(dawgImg, dawg.x, dawg.y, dawg.width, dawg.height)
  }
}

function dawgDeadCheck() {
  let obsTemp = {
    x : null,
    y : null,
    width : null,
    height : null,
  }
  let obsListTemp = []

  for(var i = 1; i <= (obsList.length / 3); i += 3) {
    context.drawImage(obsList[i - 1], obsList[i], obsList[i + 1], obsList[i - 1].width, obsList[i - 1].height)
    obsTemp.x = obsList[i]
    obsTemp.y = obsList[i + 1]
    obsList.width = obsList[i - 1].width
    obsList.height = obsList[i - 1].height
    obsListTemp.push(obsTemp)
  }
  obsListTemp.forEach(element => {
    if(detectCollision(dawg, element)) {
      //ded
      for(var i = 1; i <= (obsList.length / 3); i += 3) {
        obsList.splice(i + 1, 1)
        obsList.splice(i , 1)
        obsList.splice(i - 1, 1)
      }
      gameOver = true
      document.getElementById('restart').style.display = 'block'
    }
  });
}

function spawnObs() {
  if(obsList.length > 0) { return }

  let obsX = boardWidth + 100

  if(Math.ceil((Math.random() * (4 - 0) + 0)) > 2){
    obsList.push(snake, obsX, bottomYSnake)
  } else {
    let y = Math.ceil((Math.random() * (topMostBirdY - bottomMostBirdY) + bottomMostBirdY))
    obsList.push(bird, obsX, y)
  }
}

function moveObs() {
  for(var i = 1; i <= (obsList.length / 3); i += 3) {
    obsList[i] += velocityX
    if(obsList[i] < -(obsList[i - 1].width)){
      obsList.splice(i + 1, 1)
      obsList.splice(i , 1)
      obsList.splice(i - 1, 1)
      score++
    }
  }
}

function drawObs() {
  for(var i = 1; i <= (obsList.length / 3); i += 3) {
    context.drawImage(obsList[i - 1], obsList[i], obsList[i + 1], obsList[i - 1].width, obsList[i - 1].height)
  }
}

function updateRestart() {
  let docRestart = document.getElementById('trials')
  docRestart.innerHTML = 'Number of tries: ' + restartCount
}

function restartGame() {
  score = 0
  restartCount++
  dawg.y = bottomYDawg
  velocityY = 0
  obsList = []
  gameOver = false
  document.getElementById('restart').style.display = 'none'
  gameTick = setInterval(() => {tick()}, 1000/60)
  if (score>=100) {
    alert("You Won! Dawg's Adventure has finally ended.")
  }
  else if (score< 100) {
    alert("You Lost. The adventure continues.")
  }
}

function drawScore() {
  context.fillStyle="black";
  context.font="20px Alata";
  context.fillText(score, 5, 20);
}

function tick(){
  if(gameOver) {
    clearInterval(gameTick)
  }
    context.clearRect(0, 0, board.width, board.height);
    spawnObs()
    moveObs()
    moveDawg()
    drawObs()
    drawDawg()
    drawScore()
    dawgDeadCheck()
    updateRestart()
}
var gameTick = setInterval(() => {tick()}, 1000/60);

function detectCollision(a, b) {
    return a.x <b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y <b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

let upPressed = false;
let downPressed = false;

function keyDownHandler(event) {
  if (event.key === 'ArrowUp') {
    upPressed = true;
  } else if (event.key === 'ArrowDown') {
    downPressed = true;
  }
}

function keyUpHandler(event) {
  if (event.key === 'ArrowUp') {
    upPressed = false;
  } else if (event.key === 'ArrowDown') {
    downPressed = false;
  }
}