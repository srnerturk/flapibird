baseURL = "https://raw.githubusercontent.com/srnerturk/flapibird/master/";
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let game;
let death = false;
let gameScore = 0;
play();

let constant;
let gap = 310;


let player = new Image();
let bg = new Image();
let ground = new Image();
let pipeTop = new Image();
let pipeBottom = new Image();


let jump = new Audio();
jump.src = game.sounds.jump;


player.src = game.images.bird;
ground.src = game.images.ground;
bg.src = game.images.background;
pipeTop.src = game.images.tubeN;
pipeBottom.src = game.images.tubeS;

function play() {
    game = {
        state: "pause",
        blocks: [],
        score: 0,
        screen: {
            width: 1000,
            height: 809
        },
        gravity: 0,
        images: {
            background: baseURL + "assets/bg.png",
            ground: baseURL + "assets/ground.png",
            bird: baseURL + "assets/bird.png",
            tubeN: baseURL + "assets/blockN.png",
            tubeS: baseURL + "assets/blockS.png"
        },
        sounds: {
            jump: baseURL + "assets/jump.wav"
        },
        player: {
            x: 10,
            y: 150
        },
    }
    canvas.width = game.screen.width;
    canvas.height = game.screen.height;

    game.blocks[0] = {
        x: 440,
        y: 0
    };



    var btn = document.getElementById("startGame");
    btn.style.display = "block";

    if (death) {
        var status = document.getElementById("status");
        status.style.display = "block";
        status.innerHTML = "Geberdin :) Skorun : " + gameScore;
    }

}

function draw() {
    playerHeight = 80;
    groundHeight = 110;
    playerWidth = 80;

    if (game.player.y + playerHeight >= game.screen.height - groundHeight + 25) {
        death = true;
        gameScore = game.score;
        play();
    }
    for (let i = 0; i < game.blocks.length; i++) {
        let block = game.blocks[i];
        constant = pipeTop.height + gap;
        context.drawImage(pipeTop, block.x, block.y);
        context.drawImage(pipeBottom, block.x, block.y + constant);
        if (game.state == "started") {
            block.x = block.x - 2;
            var btn = document.getElementById("startGame");
            var status = document.getElementById("status");
            btn.style.display = "none";
            status.style.display = "none";
        }
        if (
            (game.player.x + playerWidth - 20 >= block.x &&
                game.player.x <= block.x + pipeTop.width &&
                (game.player.y <= block.y + pipeTop.height ||
                    game.player.y + playerHeight - 20 >= block.y - 10 + constant)) ||
            game.player.y + playerHeight - 20 >= canvas.height - groundHeight
        ) {
            gameScore = game.score;
            death = true;
            play();
            resizeWindow();
        }



        if (block.x == 430) {
            let value = 0;
            value = Math.floor(Math.random() * pipeTop.height) - pipeTop.height;
            if (value < -180) {
                value = -150;
            }
            console.log(value);
            game.blocks.push({
                x: game.screen.width,
                y: value
            });
        }
        if (block.x == -6) {
            game.score++;
        }
    }

    context.drawImage(
        ground,
        0,
        game.screen.height - ground.height + 110,
        game.screen.width,
        110
    );
    context.drawImage(
        player,
        game.player.x,
        game.player.y,
        85,
        85
    );

    if (game.state == "started") {
        game.player.y += game.gravity;
        game.gravity += 1.25;
    }
}

function resizeWindow() {
    if (innerWidth <= game.screen.width) {
        game.screen.width = innerWidth;
        canvas.width = innerWidth;
    } else {
        game.screen.width = 1026;
        canvas.width = 1026;
    }
}

function render() {
    context.drawImage(bg, 0, 0);
    draw();
    requestAnimationFrame(render);
    context.font = "24px monospace";
    context.fillStyle = "white";
    context.fillText("PUAN: " + game.score, 40, 40);
}


resizeWindow();
render();

function keyDown(e) {
    let key = e.code;
    if ((key == "KeyW") | (key == "Space")) {
        game.gravity = -13;
        jump.play();
        game.state = "started";
    }

    if (key == "KeyP") {
        if (game.state == "pause") {
            game.state = "started";
        } else {
            game.state = "pause";
        }
    }
}

let velocityY = 0;

function touchEvent(e) {
    let key = e.type;

    if (key == "touchstart") {
        game.gravity = -13;
        jump.play();
        game.state = "started";

    }
}


function StartGame() {
    game.state = "started";
}

window.addEventListener("keydown", keyDown);
window.addEventListener("touchstart", touchEvent);
