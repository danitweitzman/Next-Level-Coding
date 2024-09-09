let grid = [];
let rows = 50;
let cols = 36;
let bubbleSize = 70;
let shooterX;
let shooterY = 650;
let fallingBubbles = [];
let speed = 0.5;
let playerShots = [];
let hitCounter = 750;
let gameOver = false;
let gameStarted = false;
let startButton;

function preload() {
  blueText = loadImage("https://i.imgur.com/XA07lHY.png");
  greyText = loadImage("https://i.imgur.com/7RFRQXz.png");
  arrow = loadImage("https://i.imgur.com/u6USHfv.png");
  wallpaper = loadImage("https://i.imgur.com/EKosE3S.png");
}

function setup() {
  createCanvas(1340, 785);

  for (let y = 0; y < rows; y++) {
    grid[y] = [];
    for (let x = 0; x < cols; x++) {
      grid[y][x] = null;
    }
  }
  
  startButton = createButton("Start");
  startButton.position(windowWidth / 2 - 40, windowHeight/ 2 + 20 );
  startButton.size(80, 40);
  startButton.style("background-color", "#2196F3");
  startButton.style("color", "white");
  startButton.style("border-radius", "20px");
  startButton.style("border", "none");
  startButton.style("font-size", "18px");

  startButton.mouseOver(() => {
    startButton.style("background-color", "#4CAF50");
  });

  startButton.mouseOut(() => {
    startButton.style("background-color", "#2196F3");
  });

  startButton.mousePressed(startGame);
}

function draw() {
  if (!gameStarted) {
    displayHomeScreen();
  } else if (gameOver) {
    displayOverScreen();
  } else {
    background(wallpaper);

    push();
    fill(255, 0, 0);
    stroke(255, 0, 0); //red
    strokeWeight(2);
    line(85, 690, 1345, 690);
    rect(10, 35, 64, 30, 20);
    pop();

    let constrainedX = constrain(
      mouseX - arrow.width / 2,
      50,
      width - arrow.width
    );
    image(arrow, constrainedX, shooterY);

    fill(255, 255, 255);
    textSize(20);
    text(hitCounter, 42, 50);
  }

  if (frameCount % 60 === 0 && gameStarted == true) {
    spawnNewRow();
  }

  moveBubbles();
  drawBubbles();
  checkCollisions();
  drawShots();
}

function spawnNewRow() {
  let newRow = [];
  let availableColumns = Array.from({ length: cols }, (_, i) => i);
  availableColumns = shuffle(availableColumns); 
  let selectedColumns = availableColumns.slice(0, 15);
  for (let x = 0; x < cols; x++) {
    if (selectedColumns.includes(x)) {
      newRow.push({
        x: x * bubbleSize + 100,
        y: 50, 
        active: true, 
      });
    } else {
      newRow.push(null);
    }
  }

  fallingBubbles.push(newRow); 
}

function moveBubbles() {
  for (let i = 0; i < fallingBubbles.length; i++) {
    for (let j = 0; j < fallingBubbles[i].length; j++) {
      let bubble = fallingBubbles[i][j];

      if (bubble !== null && bubble.active) {
        bubble.y += speed; 

        if (bubble.y == 690 - greyText.width && !gameOver) {
          gameOver = true; 
        }

        if (bubble.y >= height) {
          let gridY = rows - 1;
          let gridX = j; 
          grid[gridY][gridX] = bubble; 
          bubble.active = false; 
        }
      }
    }
  }
}

function mousePressed() {
  if (!gameOver && gameStarted == true) {
    playerShots.push({
      x: mouseX,
      y: height - 120, 
      speed: 15,
    });
  }
}

function drawShots() {
  for (let i = 0; i < playerShots.length; i++) {
    image(
      blueText,
      playerShots[i].x - greyText.width / 2,
      playerShots[i].y - greyText.height / 2
    );

    playerShots[i].y -= playerShots[i].speed;
  }
}

function checkCollisions() {
  for (let i = 0; i < playerShots.length; i++) {
    let shot = playerShots[i];

    for (let row of fallingBubbles) {
      for (let bubble of row) {
        
        if (bubble !== null && bubble.active) {
          if (
            dist(
              shot.x,
              shot.y,
              bubble.x + bubbleSize / 2,
              bubble.y + bubbleSize / 2
            ) <
            bubbleSize / 2
          ) {
            bubble.active = false; 
            playerShots.splice(i, 1); 
            hitCounter--; 
            break;
          }
        }
      }
    }
  }
}

function drawBubbles() {
  for (let row of fallingBubbles) {
    for (let bubble of row) {
      if (bubble !== null && bubble.active && gameStarted && !gameOver) {
        image(greyText, bubble.x, bubble.y); 
      }
    }
  }
}


for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    if (grid[y] !== undefined && grid[y][x] !== null) {  
      fill(200, 100, 100);
      ellipse(
        grid[y][x].x + bubbleSize / 2,
        height - bubbleSize / 2,
        bubbleSize
      ); 
    }
  }
}

function displayHomeScreen() {
  background(255);
  fill(0);
  textAlign(CENTER, CENTER); 

  push();
  textSize(64); 
  text("Notify Burst", windowWidth / 2, windowHeight / 2 - 150); 
  pop();

  push();
  textSize(20); 
  text(
    "Help clear my messages! Use your mouse to aim,\n and click to shoot at incoming messages.",
    windowWidth / 2,
    windowHeight / 2 - 80
  ); 
  pop();
  
  push()
  fill("#FF0000");
  noStroke();
  rect(windowWidth / 2 - 100, windowHeight/ 2 - 35 ,200,40,20);
  pop()
  
  push();
  fill(255, 255, 255);
  textSize(20);
  text(hitCounter + " Messages", windowWidth / 2 - 100, windowHeight/ 2 - 35 ,200,40);
  pop();

}

function displayOverScreen () {
  background(255);
  fill(0);
  textAlign(CENTER, CENTER);  

  push();
  textSize(64); 
  text("Game Over", windowWidth / 2, windowHeight / 2 - 150); 
  pop();
  
  push()
  fill("#FF0000");
  noStroke();
  rect(windowWidth / 2 - 100, windowHeight/ 2 - 35 ,200,40,20);
  pop()
  
  push();
  textSize(20); 
  text(
    "Thanks for playing Notify Burst! \n your final score was:",
    windowWidth / 2,
    windowHeight / 2 - 80
  ); 
  pop();
  push();
  fill(255, 255, 255);
  textSize(20);
  text(hitCounter + " Messages", windowWidth / 2 - 100, windowHeight/ 2 - 35 ,200,40,20);
  pop();

}

function startGame() {
  gameStarted = true;
  startButton.hide(); // Hide the start button once the game begins
  hitCounter = 750; // Reset the hit counter
  fallingBubbles = []; // Clear falling bubbles array
  gameOver = false; // Reset the game over flag
}
