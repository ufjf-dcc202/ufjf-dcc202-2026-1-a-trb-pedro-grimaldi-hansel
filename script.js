"use strict";

let numDiscos = 8;
let pinos = [[], [], []];
let pinoSelecionado = null;

const tabuleiro = document.getElementById("tabuleiro");
const minimoEl = document.getElementById("minimo");


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

iniciar();