//////////////////////////////////////////////// VARIABLES////////////////////////////////////
let player; // variable for player object, handles player's position, mvt and rendering
let score = 0; // variable to track player's score
let gameOver = false; // variable to track if game has ended
let lives = 9; // variable for max number of lives player starts with
let tileSize = 50; // variable for no. of pixels for each tile
let tileImages = {}; // variable to store tilemap image assets
let tileMap = []; // variable for tilemap array
let collisionMap = []; // variable for collision map array

// variable for object for tracking keyboard
let keys = { 
    left: false, // checking for left arrow key
    right: false, // checking for right arrow key
    up: false, // checking for up arrow key 
};

// variables for all the bg images 
let startScreenBackgroundImage; // start screen bg
let startScreenLogoImage; // play button image
let cutsceneImage; // level 2 cutscene bg
let cutscene2Image; // level 3 cutscene bg
let cutscene3Image; // level 4 cutscene bg
let level2BackgroundImage; // level 2 bg
let level3BackgroundImage;  // level 3 bg
let level4BackgroundImage; // level 4 bg
let endScreenBackgroundImage; // end screen bg 
let endScreenGameOverImage; //game over image
let endScreenRetryImage; // replay button image

// varibale for the player's image
let playerImage;
let imagesLoaded = 0;
let totalImages = 16; 
let cameraX = 0;

// variables for the bg music
let currentMusic = null; 
let lastGameState = null; 
let bgMusicStart;
let bgMusicLevelOne;
let bgMusicCutScene;
let bgMusicLevelTwo;
let bgMusicCutSceneTwo;
let bgMusicLevelThree; 
let bgMusicCutSceneThree;
let bgMusicLevelFour;
let bgMusicEnd; 

// variable for different game screens
let gameState = "START"; // game states include: START, PLAYING, CUTSCENE, LEVEL2, CUTSCENE2, LEVEL3, CUTSCENE 3, LEVEL 4, END

// a variable for the start time of all the cutscenes
let cutsceneStartTime;
const cutsceneDuration = 10000; // length of cutscene (10000 milliseconds/10 seconds)

// preload function to load all image and audio assets 
function preload() {
    // loading the player image/sprite
    playerImage = loadImage('fish.png');

    // loading tile images and assigning their tilemap numbers
    tileImages[1] = loadImage('sand.png'); // sand platform block
    tileImages[2] = loadImage('stonebricks.png'); // stone bricks platform block
    tileImages[3] = loadImage('seaweed.png'); // seaweed 
    tileImages[4] = loadImage('coral.png'); // coral
    tileImages[5] = loadImage('coin.png'); // gold coin
    tileImages[6] = loadImage('treasurechest.png'); // treasure chest
    tileImages[7] = loadImage('seasnake.png'); // sea snake
    tileImages[8] = loadImage('transparentsq.png'); // transparent platform block
    tileImages[9] = loadImage('plat coin.png'); // platinum coin
    tileImages[10] = loadImage('cashbag.png'); // cash bag
    tileImages[11] = loadImage('key.png'); // gold key
    tileImages[12] = loadImage('diamond.png'); // diamond
    tileImages[13] = loadImage('lotus pad.png'); // lotus pad
    tileImages[14] = loadImage('cattail.png'); // cattail
    tileImages[15] = loadImage('frog.png'); // frog
    tileImages[16] = loadImage('metal pipe.png'); // metal pipe platform block

    
    // loading the start screen's images
    startScreenBackgroundImage = loadImage('tilepage.png');
    startScreenLogoImage = loadImage('play.png');
    
    //Level 1's bg image was loaded in the setup function in the earlier stages of the game dev project//
    
    // loading level 2's bg and cutscene images
    cutsceneImage = loadImage('cutscene.png');
    level2BackgroundImage = loadImage('temple.png');

    //loading level 3's bg and cutscene images 
    cutscene2Image = loadImage('cutscene2.png');
    level3BackgroundImage = loadImage('sub windows.png'); 

    //loading level 4's bg and cutscene images 
    cutscene3Image = loadImage('cutscene3.png');
    level4BackgroundImage = loadImage('marshes.png'); 
    
    // loading the end screen's images
    endScreenBackgroundImage = loadImage('blackout.png'); 
    endScreenGameOverImage = loadImage('gameover.png');
    endScreenRetryImage = loadImage('replay.png');
}

// a setup function to set canvas and the game elements // the setup function calls level 1's elements (the following levels have their own functions)
function setup() {
    // loading level one bg image
    bg = loadImage('oceanbackground.png')

    createCanvas(700, 700); // setting a 700 by 700 pixel canvas
    initializeTileMap(); // initialising the tilemap/collison map

    // loading the bg music for each screen/level 
    bgMusicStart = new Audio("casiopea.mp3"); // start screen = Swallow - Casiopea
    bgMusicStart.loop = true; // looping the audio for the entirety of each level's gameplay

    bgMusicLevelOne = new Audio("RushSeatbelts.mp3"); // level 1 = Rush - Seatbelts
    bgMusicLevelOne.loop = true;

    bgMusicCutScene = new Audio("videoplayback.mp3"); // cutscene = Swallow - Casiopea
    bgMusicCutScene.loop = true;

    bgMusicLevelTwo = new Audio("madvillain.mp3"); // level 2 = America's Most Blunted - Madvillain
    bgMusicLevelTwo.loop = true;

    bgMusicCutSceneTwo = new Audio("videoplayback.mp3"); // cutscene 2 = Swallow - Casiopea
    bgMusicCutSceneTwo.loop = true;

    bgMusicLevelThree = new Audio("clinteastwoodgorillaz.mp3") // level 3 = Clint Eastwood - Gorillaz
    bgMusicLevelThree.loop = true;

    bgMusicCutSceneThree = new Audio("videoplayback.mp3"); // cutscene 3 = Swallow - Casiopea 
    bgMusicCutSceneThree.loop = true;


    bgMusicLevelFour = new Audio("NeverGoingBackAgainFleetwoodMac.mp3"); // level 4 = Never Going Back Again - Fleetwood Mac
    bgMusicLevelFour.loop = true;

    bgMusicEnd = new Audio("SofaKingMFDoom.mp3"); // end screen = Sofa King MF DOOM
    bgMusicEnd.loop = true;

    // player object for player's position and size proportions 
    player = new Player(50, height - 150, 50, 50);
    
    // console.log for debugging to check if initially missing 'sand.png' is visible
    if (tileImages[1]) {
        console.log('sand image file is loaded on tiles'); // successful
    } else {
        console.log('sand image file is NOT loaded on tiles'); // unsucessful
    }
}

// a function to play the bg music according to the game states/levels
function playMusicForState() {
    // checking if the game states/levels have changed
    if (gameState !== lastGameState) {
        // pausing the previous bg music to prevernt audio overlapping/clashing
        if (currentMusic) {
            currentMusic.pause();
        }

        // switch/case/break statements (an alternative method to if-else statements) for checking the bg music conditions between gamestates/screens
        switch (gameState) {
            case "START": // each loaded sound will play according to its designated game state
                currentMusic = bgMusicStart; // setting currentmusic to the bg music for its gamestate/level
                break; // exiting onto the next case
            case "PLAYING":
                currentMusic = bgMusicLevelOne;
                break;
            case "CUTSCENE":
                currentMusic = bgMusicCutScene;
                break;
            case "LEVEL2":
                currentMusic = bgMusicLevelTwo;
                break;
            case "CUTSCENE2":
                currentMusic = bgMusicCutSceneTwo;
                break;
            case "LEVEL3":
                currentMusic = bgMusicLevelThree;
                break; 
            case "CUTSCENE3":
                currentMusic = bgMusicCutSceneThree;
                break;
            case "LEVEL4":
                currentMusic = bgMusicLevelFour;
                break;
            case "END":
                currentMusic = bgMusicEnd;
                break;
            default: // when none of the cases match the current game state/level the bg music is declared as 'null'
                currentMusic = null; // null means no bg music should play
                break;
        }

        // playing the new music if it exists
        if (currentMusic) {
            currentMusic.play(); // calling play() method in currentMusic to begin playing bg music 
        }

        // updating/storing the last game state
        lastGameState = gameState;
    }
}

// this event listener willl ensure that the bg music stops when the server's tab is inactive
document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === 'hidden') {
        if (currentMusic) currentMusic.pause();
    } else {
        if (currentMusic) currentMusic.play();
    }
});

// a draw function to display the game loop/game states
function draw() {
    background(bg);
    playMusicForState(); // calling the bg music's function containg the switch statements  

    // the game's chronology according to conditionals 
    if (gameState === "START") { 
        displayStartScreen();
    } else if (gameState === "PLAYING") { 
        playGame();
        checkCollision();
    } else if (gameState === "CUTSCENE") { 
        displayCutscene();         
    } else if (gameState === "LEVEL2") { 
        playLevel2();
        checkCollision();
    } else if (gameState === "CUTSCENE2") {
        displayCutscene2();
    } else if (gameState === "LEVEL3") {
        playLevel3();
        checkCollision();
    } else if (gameState === "CUTSCENE3") {
        displayCutscene3();
    } else if (gameState === "LEVEL4") {
        playLevel4();
        checkCollision(); 
    } else if (gameState === "END") { 
        displayEndScreen();
    }
}

// a function to initialize and create the tilemap for level one and the collision map
// the numbers of the tiles correspond with the tile images loaded in preload function
function initializeTileMap() {
    tileMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 5, 5, 6, 5, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 5, 5, 5, 5, 0, 0, 0, 5, 5, 0, 0, 5, 5, 5, 0, 3, 0, 5, 5, 5, 5, 0, 0, 0, 6, 6],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    collisionMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 3, 0, 0, 3, 0, 3, 0, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];
}

// function to render the tilemaps with the loaded image assets
function renderTilemap() {
    for (let row = 0; row < tileMap.length; row++) {
        for (let col = 0; col < tileMap[row].length; col++) {
            const tile = tileMap[row][col];
            if (tileImages[tile]) {

                // rendering tiles in accordance with the camera's x axis position
                let x = col * tileSize - cameraX;
                let y = row * tileSize;
                if (x + tileSize > 0 && x < width) {
                    image(tileImages[tile], x, y, tileSize, tileSize);
                }
            }
        }
    }
}

// the player class will the rendering and the movement of the player sprite
class Player {
    // setting the bounds of the player's movement physics (jumping, speed, falling, etc) 
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 6;
        this.gravity = 0.5;
        this.jumpStrength = 15;
        this.grounded = false;
    }

    // adding an update to the player's position according to the keys pressed (up, down, left and right) and movement physics
    update() {
        // conditions for horizontal/x-axis movement
        if (keys.right) {
            this.velocityX = this.speed;
        } else if (keys.left) {
            this.velocityX = -this.speed;
        } else {
            this.velocityX = 0;
        }

        // conditions for vertical/y-axis movement
        if (!this.grounded) {
            this.velocityY += this.gravity; // gravity
        } else {
            this.velocityY = 0;
        }
        if (keys.up && this.grounded) {
            this.velocityY = -this.jumpStrength; // jumping
            this.grounded = false;
        }

        // updating player's position according to movements above
        this.x += this.velocityX;
        this.y += this.velocityY;

        // detecting collision on the canvas' base
        if (this.y + this.height >= height) {
            this.y = height - this.height;
            this.grounded = true;
        } else {
            this.grounded = false;
        }

        // updating the camera's condition in accordance with the player's position (like a tracking shot)
        cameraX = this.x - width / 2 + this.width / 2;

        // stopping the camera from showing any areas out of the canvas' bounds on the window 
        cameraX = constrain(cameraX, 0, tileMap[0].length * tileSize - width);
    }

    // rendering the player onto the canvas with the camera on x-position
    render() {
        image(playerImage, this.x - cameraX, this.y, this.width, this.height);
    }
}

// this function handles the collisions between the player and the tiles
function checkCollision() {
    for (let row = 0; row < tileMap.length; row++) {
        for (let col = 0; col < tileMap[row].length; col++) {
            let tile = tileMap[row][col];
            let tileX = col * tileSize;
            let tileY = row * tileSize;

            if (player.x < tileX + tileSize &&
                player.x + player.width > tileX &&
                player.y < tileY + tileSize &&
                player.y + player.height > tileY) {

                if (tile === 1) {
                    player.y = tileY - player.height;
                    player.grounded = true; // sand tile = solid platform block
                } else if (tile === 2) {
                    player.y = tileY - player.height;
                    player.grounded = true; // stone brick tile = solid platform block
                } else if (tile === 8) {
                    player.y = tileY - player.height;
                    player.grounded = true; // transparent tile = solid platform block
                  if (gameState === "LEVEL4") {
                    resetLevel4(); // calling a reset function of level 4's gameplay every time the player touches/falls onto the bottom of the screen (the clear tiles)
                  }
                } else if (tile === 13) {
                    player.y = tileY - player.height;
                    player.grounded = true; // lotus pad tile = solid platform block
                } else if (tile === 14) {
                    player.y = tileY - player.height;
                    player.grounded = true; // cattail tile = solid platform block 
                } else if (tile === 16) {
                    player.y = tileY - player.height;
                    player.grounded = true; // metal pipe tile = solid platform block
                } else if (tile === 3) {
                    lives--; // 1 live is lost with aseaweed collision
                    tileMap[row][col] = 0; // the seaweed is removed after the collision as the tile is set to 0
                } else if (tile === 4) {
                    lives++; // 1 live is gained with acoral collision
                    tileMap[row][col] = 0; // the tile is set to 0 so the coral is removed after a collision
                } else if (tile === 15) {
                    lives--; // player loses 1 live if they collide with a frog
                    tileMap[row][col] = 0; // the tile is now set to 0 so the frog disappears post-collision 
                } else if (tile === 11) {
                    lives++; // live is gained with a gold key colliison
                    tileMap[row][col] = 0; // key tile removal after a collision 
                } else if (tile === 5) {
                    score += 10; // 10 points gained with coin collision 
                    tileMap[row][col] = 0; // removing the coin after player collides
                } else if (tile === 6) {
                    score += 50; // 50 points are gained with treasure chest collision
                    tileMap[row][col] = 0; // removing treasure chest after player collides
                } else if (tile === 9) {
                    score += 25; // 25 points gained with platinum coin collision
                    tileMap[row][col] = 0; // removal after collision 
                } else if (tile === 10) {
                    score += 100; // 100 points gained with cash bag collision 
                    tileMap[row][col] = 0; // removal after collision
                } else if (tile === 12) {
                    score += 200; // 200 points are gained with a diamond collision 
                    tileMap[row][col] = 0 // coin removal after the collision 
                } else if (tile === 7) {
                    gameOver = true; // sea snake collision = gameover 
                }
            }
        }
    }
}

// a head-up display (HUD) fuction to display a live coin and live score count on the screen
function displayHUD() {
    // designing the display 
    fill(0);
    textSize(24);
    text("COINS - " + score, 100, 50);
    text("LIVES - " + lives, 400, 50);
}

// a function to run the start screen 
function displayStartScreen() {
        // dislaying the start screen bg image and play button logo
        image(startScreenBackgroundImage, 0, 0, width, height); 

        // displaying and proportioning the start screen logo
        let logoWidth = 600; 
        let logoHeight = 500; 
        let logoX = (width - logoWidth) / 2; 
        let logoY = (height - logoHeight) / 1 - 0; 
        image(startScreenLogoImage, logoX, logoY, logoWidth, logoHeight);
    
    // displaying and proprtioning directional text on the start screen
    fill(0);
    textSize(30);
    textAlign(CENTER);
    textStyle(BOLD)
    text("PRESS ENTER TO BEGIN", width / 2, height / 1 - 40);
}

// a function for the keys pressed conditions to correspond with and switch between game states
function keyPressed() {
    if (keyCode === LEFT_ARROW) keys.left = true;
    if (keyCode === RIGHT_ARROW) keys.right = true;
    if (keyCode === UP_ARROW) keys.up = true;
    if (keyCode === ENTER && gameState === "START") {
        gameState = "PLAYING";
    } else if (keyCode === ENTER && gameState === "END") {
        resetGame();
        gameState = "START";
    }
}

// a function to handling of key release events
function keyReleased() {
    if (keyCode === LEFT_ARROW) keys.left = false;
    if (keyCode === RIGHT_ARROW) keys.right = false;
    if (keyCode === UP_ARROW) keys.up = false;
}

// a function to handle level one's game logic 
function playGame() {
    renderTilemap(); // displaying the tilemap
    if (!gameOver) {
        player.update();
        player.render();
        checkCollision();
    } else {
        gameState = "END";
    }
    displayHUD(); // running the lives and score count in level one 

    // moving from level one to the cutscene
    if (player.x > tileMap[0].length * tileSize - player.width) {
        gameState = "CUTSCENE";
        cutsceneStartTime = millis(); // starting the 10s timer for the cutscene
    }
}

// a function to display the cutscene
function displayCutscene() {
    // displaying the cutscene bg image 
    background(cutsceneImage);

    // conditions for the cutscene
    if (millis() - cutsceneStartTime > cutsceneDuration) {
        gameState = "LEVEL2";
        // calling the level 2 tilemap
        initializeLevel2(); // if cutscene timer is over game state changes to level two
    }
}

// a function to run level two's game logic
function playLevel2() {
    // displaying the level two bg image 
    background(0);
    image(level2BackgroundImage, 0, 0, width, height); 
    
    // conditions for rendering level two's tilemap 
    renderTilemap();
    if (!gameOver) {
        player.update(); // updating the player's position
        player.render(); // rendering the player 
        checkCollision(); // checking for hazardous collisions 
    } else {
        gameState = "END" // changing game state based on any hazardous collisions
    }
    displayHUD(); // displaying lives and coin count over level two's screen
    
    // game over based on lives condition 
    if (lives>= 100) { // setting the live's condition to an unattainable number (100 lives) as setting it to 9 caused the game to end prematurely when the player gains lives 
        gameState = "END";
    } else if (player.x > tileMap[0].length * tileSize - player.width) {
            gameState = "CUTSCENE2"; // switching to the 2nd cutscene when the player finishes level 2
            cutsceneStartTime = millis(); // starting the 10s timer for the cutscene
        }
    }

    // a function for the 2nd cutscene 
    function displayCutscene2() {
        // displaying the bg image for cutscene 2 
        background(cutscene2Image);
      
        // after 10 seconds, the gamestae will move to level 3 
        if (millis() - cutsceneStartTime > cutsceneDuration) {
          gameState = "LEVEL3";
          initializeLevel3(); // calling lvel 3's tilemap 
        }
      }

    // a function for level 3's gameplay 
    function playLevel3() {
        // displaying the level three background
        background(0);
        image(level3BackgroundImage, 0, 0, width, height);
        
        // rendering the tilemap and updating the players position 
        renderTilemap();
        if (!gameOver) {
          player.update();
          player.render();
          checkCollision(); // calling the collision conditional function 
        } else {
          gameState = "END";
        }
        displayHUD();// calling the live and score live count in level 3
      
        // switching from level 3 to the 3rd cutscene 
        if (lives >= 100) {
          gameState = "END";
        } else if (player.x > tileMap[0].length * tileSize - player.width) {
          gameState = "CUTSCENE3";
          cutsceneStartTime = millis();
        }
      }
    
      // a function for the 3rd cutscene 
      function displayCutscene3() {
        // displaying the previously loaded bg image 
        background(cutscene3Image);
      
        // switching from the cutscene to level four after 10 seconds 
        if (millis() - cutsceneStartTime > cutsceneDuration) {
          gameState = "LEVEL4";
          initializeLevel4(); // calling level 4's tilemap 
        }
      }

      function playLevel4() {
        // displaying level three's background image 
        background(0);
        image(level4BackgroundImage, 0, 0, width, height);
        
        // rendering the tilemap and upadating and rendering the player 
        renderTilemap();
        if (!gameOver) {
          player.update();
          player.render();
          checkCollision(); // calling the funtion for checking collision conditionals in level 4 
        } else {
          gameState = "END";
        }
        displayHUD(); // displaying the live and score live count in level 4 
      
        // switching to the end screen 
        if (lives >= 100) {
          gameState = "END";
        }
      }
      

// a function to initialize level two's tilemap and position each preloaded tile image by their designated tile numbers 
function initializeLevel2() {
    tileMap = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 6, 6, 6, 0, 7, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 5, 0, 3, 0, 0, 0, 0, 5, 4, 5, 5, 5, 5, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 4, 2, 2, 2, 2, 2, 0, 7, 0, 0],
        [0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 3, 0, 5, 5, 0, 6, 3, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 7, 7],
        [0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 5, 5, 5, 6, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 3, 0, 5, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0],
        [0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 6, 5, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ];

    // player's position on level 2
    player.x = 50;
    player.y = height - 150;

    // camera's position on level 2
    cameraX = 50;
}

// level 3's tilemap 
function initializeLevel3() {
    tileMap = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 9, 9, 9, 9, 9, 0, 0, 0, 0, 9, 9, 9, 0, 0, 0, 9, 9, 9, 0, 0, 9, 9, 9, 10, 0, 0, 9, 9, 0, 10, 0, 9, 9, 0, 11, 11, 11, 0, 0, 0, 9, 9, 9, 0, 0, 9, 9, 9, 10, 9, 9, 0, 0, 0, 0, 0, 0, 11, 0, 11, 0, 11, 0, 0, 10, 0, 0, 9, 9, 9, 0, 9, 9, 9, 9],
        [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         
    ];

    // player's position on level 3
    player.x = 50;
    player.y = height - 600;

    // camera's position on level 3
    cameraX = 50;
}

// level 4's tilemap
function initializeLevel4() {
    tileMap = [
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0, 12,  0,  0,  0, 12,  0,  0, 12,  0,  0, 12,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 13, 13,  0,  0, 13,  0,  0, 13, 13,  0,  0, 13, 13,  0,  0, 12,  0, 13, 13,  0,  0, 13, 13,  0,  0, 13,  0,  0, 13,  0,  0, 13,  0,  0, 13,  0,  0, 13, 13,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0, 12,  0, 13,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 13,  0,  0, 13,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 13,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 13,  0,  0, 13,  0,  0, 13, 13,  0,  0, 13,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 13,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 13,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 13,  0,  0, 12,  0,  0, 12,  0,  0, 12,  0,  0,  0],
        [  0,  0,  0, 12,  0,  0,  0, 12,  0,  0,  0, 12,  0, 13,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 13,  0,  0, 13,  0,  0, 13,  0,  0, 13,  0,  0, 13,  0,  0, 13,  0],
        [ 13, 13,  0,  0, 13, 13,  0,  0, 13, 13,  0,  0, 13,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,],
    ];

    // player's position on level 4
    player.x = 50;
    player.y = height - 450;

    // camera's position on level 4
    cameraX = 50;
}

// this function reset's level 4 when the player touches/falls to the bottom of the screen (tile no.8) in level 4 and is called above in the checkCollisions function under tile [8]
function resetLevel4() {
    // resetting the player and the camera's positions 
    player.x = 50;
    player.y = height - 450;
    cameraX = 50;
}


// a function to display the end screen 
function displayEndScreen() {
    // displaying a solid black background for the end screen 
    background(0); 
    
    // displaying and proportioning the GAME OVER iMAGE one the end screen
    let gameOverWidth = 700; 
    let gameOverHeight = 500; 
    let gameOverX = (width - gameOverWidth) / 2 + 100;
    let gameOverY = (height - gameOverHeight) / 6; 
    image(endScreenGameOverImage, gameOverX, gameOverY, gameOverWidth, gameOverHeight);

    // displaying and proportioning the replay button logo on the end screen
    let retryWidth = 500; 
    let retryHeight = 400; 
    let retryX = (width - retryWidth) / 2; 
    let retryY = (height - retryHeight) / 2 + 150; 
    image(endScreenRetryImage, retryX, retryY, retryWidth, retryHeight);

    // displaying and proportioning directional text on the end screen
    fill(225);
    textSize(30);
    textAlign(CENTER);
    textStyle(BOLD)
    text("PRESS ENTER TO BEGIN", width / 2, height / 1 - 40);

}

// a function to reset the game logic after the GAMEOVER gameState is called 
function resetGame() {
    // resetting player position
    player.x = 50;
    player.y = height - 150;

    // resetting the score/coin count
    score = 0;

    // resetting the lives
    lives = 3;
    gameOver = false;

    // recallimg the tilemap 
    initializeTileMap();
}
