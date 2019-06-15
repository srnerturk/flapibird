baseURL = "";
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let game;
let death=false;
let gameScore=0;
play();

let constant;
let gap = 150;


let player = new Image();
let bg = new Image();
let ground = new Image();
let pipeTop = new Image();
let pipeBottom = new Image();


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
            width: 600,
            height: 600
        },
        gravity: 2,
        images: {
            background: baseURL + "assets/bg2.png",
            ground: baseURL + "assets/ground.png",
            bird: baseURL + "assets/bird.png",
            tubeN: baseURL + "assets/blockN.png",
            tubeS: baseURL + "assets/blockS.png"
        },
        player: {
            x: 10,
            y: 250
        },
    }
    canvas.width = game.screen.width;
    canvas.height = game.screen.height;

    game.blocks[0] = {
        x: canvas.width / 2,
        y: 0
    };

    var btn=document.getElementById("startGame");
    btn.style.display="block";

        if(death){
            var status=document.getElementById("status");
            status.style.display="block";
            status.innerHTML="Geberdin :) Skorun : " + gameScore;
        }

}

function draw() {
    playerHeight = 60;
    groundHeight = 70;
    playerWidth = 60;

    if (game.player.y + playerHeight >= game.screen.height - groundHeight) {
        death=true;
        gameScore=game.score;
        play();
    }
    for (let i = 0; i < game.blocks.length; i++) {
        let block = game.blocks[i];
        constant = pipeTop.height + gap;
        context.drawImage(pipeTop, block.x, block.y);
        context.drawImage(pipeBottom, block.x, block.y + constant);

        if (game.state == "started") {
            block.x--;
            var btn=document.getElementById("startGame");
            var status=document.getElementById("status");
            btn.style.display="none";
            status.style.display="none";
        }
        if (
            (game.player.x + playerWidth >= block.x &&
                game.player.x <= block.x + pipeTop.width &&
                (game.player.y <= block.y + pipeTop.height ||
                    game.player.y + playerHeight >= block.y + constant)) ||
            game.player.y + playerHeight >= canvas.height - groundHeight
        ) {
            gameScore=game.score;
            death=true;
            play();
            resizeWindow();
        }

        if (block.x == 250) {
            game.blocks.push({
                x: game.screen.width,
                y: Math.floor(Math.random() * pipeTop.height) - pipeTop.height
            });
        }

        if (block.x == -5) {
            game.score++;
        }
    }

    context.drawImage(
        ground,
        0,
        game.screen.height - ground.height + 150,
        game.screen.width,
        60
    );
    context.drawImage(
        player,
        game.player.x,
        game.player.y,
        65,
        65
    );

    if (game.state == "started") {
        game.player.y += game.gravity;
    }
}

function resizeWindow() {
    if (innerWidth <= game.screen.width) {
        game.screen.width = innerWidth;
        canvas.width = innerWidth;
    } else {
        game.screen.width = 600;
        canvas.width = 600;
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
        game.player.y -= 30;
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

function touchEvent(e) {
    let key = e.type;
  
    if (key == "touchstart") {
      game.player.y -= 30;
      game.state = "started";
    }
  }


function StartGame(){
    game.state="started";
}

window.addEventListener("keydown", keyDown);
window.addEventListener("touchstart", touchEvent);
