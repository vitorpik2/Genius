const botoes = {
    vermelho: document.querySelector(".vermelho"),
    verde: document.querySelector(".verde"),
    azul: document.querySelector(".azul"),
    amarelo: document.querySelector(".amarelo"),
};

let sequencia = [];
let cliqueAtual = [];
let nivel = 0;
let recorde = 0;
let esperandoClique = false;

const contexto = new (window.AudioContext || window.webkitAudioContext)();

function tocarSomFrequencia(freq, duracao = 300) {
    const osc = contexto.createOscillator();
    const gain = contexto.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(contexto.destination);
    osc.start();
    osc.stop(contexto.currentTime + duracao / 1000);
}

function tocarSom(cor) {
    const frequencias = {
        vermelho: 261,
        verde: 329,
        azul: 196,
        amarelo: 392
    };
    tocarSomFrequencia(frequencias[cor]);
}

const somErro = new Audio("sons/erro.mp3");
somErro.volume = 0.8;
const somSucesso = new Audio("sons/sucesso.mp3");
somSucesso.volume = 1.0;

const somFundo = new Audio("sons/fundo.mp3"); // Use "sons/fundo.mp3" se estiver na pasta "sons"
somFundo.loop = true;
let somAtivo = false;
somFundo.volume = 0.4;

document.getElementById("botao-som").addEventListener("click", () => {
    if (!somAtivo) {
        somFundo.play().then(() => {
            somAtivo = true;
            document.getElementById("botao-som").textContent = "Desligar Música";
        }).catch(err => {
            console.error("Erro ao tocar música de fundo:", err);
        });
    } else {
        somFundo.pause();
        somAtivo = false;
        document.getElementById("botao-som").textContent = "Ligar Música";
    }
});

function iniciarJogo() {
    sequencia = [];
    cliqueAtual = [];
    nivel = 0;
    atualizarNivel();
    gerarProximaCor();
}

function gerarProximaCor() {
    const cores = Object.keys(botoes);
    const corAleatoria = cores[Math.floor(Math.random() * cores.length)];
    sequencia.push(corAleatoria);
    cliqueAtual = [];
    nivel++;
    atualizarNivel();
    mostrarSequencia();
    atualizarRecorde();
}

function mostrarSequencia() {
    esperandoClique = false;
    sequencia.forEach((cor, i) => {
        setTimeout(() => {
            piscarBotao(cor);
            tocarSom(cor);
            if (i === sequencia.length - 1) {
                esperandoClique = true;
            }
        }, i * 600);
    });
}

function verificarClique(cor) {
    if (!esperandoClique) return;

    cliqueAtual.push(cor);
    tocarSom(cor);
    piscarBotao(cor);

    const index = cliqueAtual.length - 1;
    if (cliqueAtual[index] !== sequencia[index]) {
        gameOver();
        return;
    }

    if (cliqueAtual.length === sequencia.length) {
        esperandoClique = false;
        somSucesso.play();
        setTimeout(gerarProximaCor, 1000);
    }
}

function piscarBotao(cor) {
    const botao = botoes[cor];
    botao.classList.add("ativa");
    setTimeout(() => botao.classList.remove("ativa"), 300);
}

function gameOver() {
    somErro.play();
    document.getElementById("nivel").textContent = "Errou! Clique em Iniciar Jogo";
    esperandoClique = false;
}

function atualizarNivel() {
    document.getElementById("nivel").textContent = `Rodada ${nivel}`;
}

function atualizarRecorde() {
    if (nivel > recorde) {
        recorde = nivel;
        document.getElementById("recorde").textContent = recorde;
    }
}

function alternarTema() {
    document.body.classList.toggle("tema-escuro");
}