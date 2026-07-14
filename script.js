"use strict";

let numDiscos = 8;
let pinos = [[], [], []];
let pinoSelecionado = null;
let historico = [];
const NOMES_PINOS = ["A", "B", "C"];
let reproduzindo = false;

const tabuleiro = document.getElementById("tabuleiro");
const minimoEl = document.getElementById("minimo");
const mensagemEl = document.getElementById("mensagem");
const historicoEl = document.getElementById("historico");
const contadorEl = document.getElementById("contador");
const btnReiniciar = document.getElementById("btn-reiniciar");
const btnReproduzir = document.getElementById("btn-reproduzir");
const seletorDiscos = document.getElementById("qtd-discos");


function iniciar() {
  pinos = [[], [], []];
  pinoSelecionado = null;
  historico = [];

  for (let tamanho = numDiscos; tamanho >= 1; tamanho--) {
    pinos[0].push(tamanho);
  }

  minimoEl.textContent = Math.pow(2, numDiscos) - 1;
  mostrarMensagem("");
  render();
  atualizarHistorico();
  atualizarContador();
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
  if (reproduzindo) return;
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
  historico.push({ de, para });
  atualizarHistorico();
  atualizarContador();
  mostrarMensagem("");
  verificarVitoria();
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

function atualizarHistorico() {
  historicoEl.innerHTML = "";
  historico.forEach((jogada) => {
    const item = document.createElement("li");
    item.textContent = `Pino ${NOMES_PINOS[jogada.de]} → Pino ${NOMES_PINOS[jogada.para]}`;
    historicoEl.appendChild(item);
  });
  historicoEl.scrollTop = historicoEl.scrollHeight;
}

function atualizarContador() {
  contadorEl.textContent = historico.length;
}

function verificarVitoria() {
  // venceu quando todos os discos estão no pino B ou C
  if (pinos[1].length === numDiscos || pinos[2].length === numDiscos) {
    const minimo = Math.pow(2, numDiscos) - 1;
    if (historico.length === minimo) {
      mostrarMensagem(`Parabéns! Você venceu no número mínimo de ${minimo} jogadas!`);
    } else {
      mostrarMensagem(`Parabéns! Você venceu em ${historico.length} jogadas (mínimo: ${minimo}).`);
    }
  }
}

function reproduzir() {
  if (reproduzindo) return;
  if (historico.length === 0) {
    mostrarMensagem("Não há jogadas no histórico para reproduzir.");
    return;
  }

  const jogadas = historico.slice(); // copia antes de resetar o tabuleiro
  reproduzindo = true;
  pinoSelecionado = null;
  travarControles(true);

  // volta o tabuleiro ao estado inicial, mantendo a lista de jogadas
  pinos = [[], [], []];
  for (let tamanho = numDiscos; tamanho >= 1; tamanho--) pinos[0].push(tamanho);
  render();
  mostrarMensagem("Reproduzindo histórico...");

  let i = 0;
  const intervalo = setInterval(() => {
    const jogada = jogadas[i];
    pinos[jogada.para].push(pinos[jogada.de].pop());
    render();
    i++;
    if (i >= jogadas.length) {
      clearInterval(intervalo);
      reproduzindo = false;
      travarControles(false);
      mostrarMensagem("Reprodução concluída.");
    }
  }, 700);
}

function travarControles(travar) {
  btnReiniciar.disabled = travar;
  btnReproduzir.disabled = travar;
  seletorDiscos.disabled = travar;
}

btnReproduzir.addEventListener("click", reproduzir);

iniciar();