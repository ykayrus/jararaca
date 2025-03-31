let posX = 0;
let posY = 0;
let velocidade = 10;
let direcao = 'right';  // Direção inicial da cobra
let movimentoCobra;
let corpoCobra = [];  // Array para armazenar os segmentos do corpo
let tamanhoSegmento = 30;  // Tamanho do segmento do corpo

// Adiciona música de fundo
const musicaFundo = document.createElement("audio");
musicaFundo.src = "song/chaos.mp3" // Caminho do arquivo de música
musicaFundo.loop = true;
musicaFundo.volume = 0.5; // Volume ajustável
document.body.appendChild(musicaFundo);

// Garante que a música comece a tocar ao carregar o jogo
document.addEventListener("DOMContentLoaded", function () {
    musicaFundo.play().catch(error => console.log("Autoplay bloqueado, clique na tela para ativar o som", error));
});

// Adiciona o som de comer (coin.mp3)
const somComer = new Audio("song/coin.mp3"); // Caminho do arquivo de som
somComer.volume = 0.3;

const campo = document.createElement("div");
campo.style.width = "80vw";
campo.style.height = "50vh";
campo.style.maxWidth = "80vh";
campo.style.maxHeight = "50vh";
campo.style.backgroundColor = "black";
campo.style.position = "absolute";
campo.style.top = "40%";
campo.style.left = "50%";
campo.style.transform = "translate(-50%, -50%)";
campo.style.border = "2px solid white";
document.body.appendChild(campo);

// Cria o elemento da cabeça da cobra (snake_1.png)
const snakeHead = document.createElement("img");
snakeHead.src = "img/snake_1.png";
snakeHead.style.position = "absolute";
snakeHead.style.width = tamanhoSegmento + "px"; // Tamanho ajustado da cabeça
snakeHead.style.height = tamanhoSegmento + "px";
campo.appendChild(snakeHead);

// Função para mover a cobra
function moverCobra() {
    // Armazena a posição da cabeça antes de mover
    let posXAnterior = posX;
    let posYAnterior = posY;

    // Movimentação da cabeça
    if (direcao === "up") {
        posY -= velocidade;
        snakeHead.style.transform = "rotate(180deg)"; // Cabeça virada para cima
    } else if (direcao === "down") {
        posY += velocidade;
        snakeHead.style.transform = "rotate(0deg)"; // Cabeça virada para baixo
    } else if (direcao === "left") {
        posX -= velocidade;
        snakeHead.style.transform = "rotate(90deg)"; // Cabeça virada para a esquerda
    } else if (direcao === "right") {
        posX += velocidade;
        snakeHead.style.transform = "rotate(270deg)"; // Cabeça virada para a direita
    }

    // Atualiza a posição da cabeça
    snakeHead.style.left = posX + "px";
    snakeHead.style.top = posY + "px";

    // Atualiza os segmentos do corpo
    for (let i = corpoCobra.length - 1; i > 0; i--) {
        corpoCobra[i].x = corpoCobra[i - 1].x;
        corpoCobra[i].y = corpoCobra[i - 1].y;
    }

    // O primeiro segmento do corpo recebe a posição da cabeça
    if (corpoCobra.length > 0) {
        corpoCobra[0].x = posXAnterior;
        corpoCobra[0].y = posYAnterior;
    }

    // Atualiza a posição de todos os segmentos do corpo
    for (let i = 0; i < corpoCobra.length; i++) {
        const segmento = corpoCobra[i];
        let segmentoImg = document.querySelector(`#segmento${i}`);
        if (!segmentoImg) {
            // Cria um novo elemento de imagem para o segmento
            segmentoImg = document.createElement("img");
            segmentoImg.id = `segmento${i}`;
            segmentoImg.src = "img/snake_2.png";
            segmentoImg.style.position = "absolute";
            segmentoImg.style.width = tamanhoSegmento + "px";
            segmentoImg.style.height = tamanhoSegmento + "px";
            campo.appendChild(segmentoImg);
        }
        // Posiciona cada segmento
        segmentoImg.style.left = segmento.x + "px";
        segmentoImg.style.top = segmento.y + "px";
    }

    // Impede que a cobra ultrapasse os limites do campo
    if (posX < 0) posX = 0;
    if (posY < 0) posY = 0;
    if (posX > campo.offsetWidth - tamanhoSegmento) posX = campo.offsetWidth - tamanhoSegmento;
    if (posY > campo.offsetHeight - tamanhoSegmento) posY = campo.offsetHeight - tamanhoSegmento;

    // Verifica a colisão com o corpo da cobra
    verificarColisaoComCorpo();
}

// Função para verificar colisão com o corpo
function verificarColisaoComCorpo() {
    for (let i = 0; i < corpoCobra.length; i++) {
        const segmento = corpoCobra[i];
        if (posX === segmento.x && posY === segmento.y) {
            // Se a cabeça colidir com o corpo, o jogo termina
            fimDeJogo();
            return;
        }
    }
}

// Função para adicionar um novo segmento ao corpo quando a cobra come o alimento
function crescerCobra() {
    corpoCobra.push({ x: posX, y: posY });
}

// Função para verificar se a cobra pegou o alimento
let comidaImg;
function verificarColisaoComComida() {
    if (posX < handX + 30 && posX + tamanhoSegmento > handX && posY < handY + 30 && posY + tamanhoSegmento > handY) {
        crescerCobra();
        somComer.play(); // Toca o som ao comer
        campo.removeChild(comidaImg);
        colocarComida();
    }
}

// Função para gerar uma nova posição para o alimento
let handX = 0, handY = 0;
function colocarComida() {
    handX = Math.floor(Math.random() * (campo.offsetWidth - 30));
    handY = Math.floor(Math.random() * (campo.offsetHeight - 30));

    comidaImg = document.createElement("img");
    comidaImg.src = "img/hand.png";
    comidaImg.style.position = "absolute";
    comidaImg.style.left = handX + "px";
    comidaImg.style.top = handY + "px";
    comidaImg.style.width = "30px";
    comidaImg.style.height = "30px";
    campo.appendChild(comidaImg);
}

// Função de fim de jogo
function fimDeJogo() {
    clearInterval(movimentoCobra);
    alert("Fim de Jogo! Você colidiu!");
    reiniciarJogo();
}

// Função para reiniciar o jogo
function reiniciarJogo() {
    campo.innerHTML = '';
    posX = 0;
    posY = 0;
    corpoCobra = [];
    direcao = "right";
    iniciarJogo();
}

// Função para iniciar o jogo
function iniciarJogo() {
    colocarComida();
    movimentoCobra = setInterval(() => {
        moverCobra();
        verificarColisaoComComida();
    }, 100);
}

// Controles de botões
document.querySelector(".up-btn").addEventListener("click", () => {
    if (direcao !== "down") direcao = "up";
});

document.querySelector(".down-btn").addEventListener("click", () => {
    if (direcao !== "up") direcao = "down";
});

document.querySelector(".left-btn").addEventListener("click", () => {
    if (direcao !== "right") direcao = "left";
});

document.querySelector(".right-btn").addEventListener("click", () => {
    if (direcao !== "left") direcao = "right";
});

// Controles de teclado
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direcao !== "down") direcao = "up";
    if (event.key === "ArrowDown" && direcao !== "up") direcao = "down";
    if (event.key === "ArrowLeft" && direcao !== "right") direcao = "left";
    if (event.key === "ArrowRight" && direcao !== "left") direcao = "right";
});

// Inicia o jogo
iniciarJogo();
