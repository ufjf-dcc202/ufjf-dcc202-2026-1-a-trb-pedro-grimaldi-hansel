"use strict";

let numDiscos = 8;
let pinos = [[], [], []];
let pinoSelecionado = null;

const tabuleiro = document.getElementById("tabuleiro");
const minimoEl = document.getElementById("minimo");
const mensagemEl = document.getElementById("mensagem");


function iniciar() {
  pinos = [[], [], []];
  pinoSelecionado = null;

  for (let tamanho = numDiscos; tamanho >= 1; tamanho--) {
    pinos[0].push(tamanho);
  }

  minimoEl.textContent = Math.pow(2, numDiscos) - 1;
  render();
}
function render() {
  const colunas = tabuleiro.querySelectorAll(".pino");

  colunas.forEach((coluna, i) => {
    const areaDiscos = coluna.querySelector(".discos");
    areaDiscos.innerHTML = "";

    pinos[i].forEach((tamanho) => {
      const disco = document.createElement("div");
      disco.className = "disco";

      const passo = 70 / Math.max(1, numDiscos - 1);
      disco.style.width = (30 + (tamanho - 1) * passo) + "%";
      disco.style.background = `hsl(${(tamanho - 1) * (300 / numDiscos)}, 55%, 52%)`;

      areaDiscos.appendChild(disco);
    });

    coluna.classList.toggle("selecionado", pinoSelecionado === i);
  });
}

tabuleiro.addEventListener("click", (evento) => {
  const coluna = evento.target.closest(".pino");
  if (!coluna) return;
  clicarPino(Number(coluna.dataset.pino));
});

function clicarPino(indice) {
  if (pinoSelecionado === null) {

    if (pinos[indice].length === 0) {
      mostrarMensagem("Esse pino está vazio, escolha outro.");
      return;
    }
    pinoSelecionado = indice;
    mostrarMensagem("");
    render();
  } else {
   
    if (indice === pinoSelecionado) {
      pinoSelecionado = null;
      render();
      return;
    }
    tentarMover(pinoSelecionado, indice);
    pinoSelecionado = null;
    render();
  }
}

function tentarMover(de, para) {
  if (!movimentoValido(de, para)) {
    mostrarMensagem("Jogada inválida: não pode colocar um disco maior sobre um menor.");
    return;
  }
  const disco = pinos[de].pop();
  pinos[para].push(disco);
  mostrarMensagem("");
}

function mostrarMensagem(texto) {
  mensagemEl.textContent = texto;
}

function movimentoValido(de, para) {
  if (pinos[de].length === 0) return false;                 // não há disco para mover
  const discoMovido = pinos[de][pinos[de].length - 1];      // topo da origem
  const topoDestino = pinos[para][pinos[para].length - 1];  // topo do destino
  if (topoDestino === undefined) return true;               // destino vazio: permitido
  return discoMovido < topoDestino;                         // só sobre um disco maior
}
iniciar();