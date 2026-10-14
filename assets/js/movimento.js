/* movimento.js — movimento DESTE site (Kit de Design wmovement.com, seção "Movimento"; specs/design.md §10).
   A referência não anima entradas nem o carregamento: só pontos pulsantes (CSS), hovers (CSS) e cabeçalho fixo.
   Aqui ficam os comportamentos que precisam de JS:
   1. Como atua (assinatura): a ficha de recursos abre uma linha por vez (o "+" vira "×", a linha ganha fundo e fio malva).
   2. Dúvidas: acordeão (grid-template-rows 0fr → 1fr, 250 ms no CSS).
   3. Menu do celular: Lenis parado enquanto o painel está aberto.
   Os acordeões funcionam também com prefers-reduced-motion (só a transição some, pelo base.css). */
(function () {
  'use strict';

  /* 1. Ficha de recursos (Como atua): uma linha aberta por vez; a linha inteira é clicável, o botão "+" é o controle acessível */
  var ficha = document.querySelector('[data-recursos]');
  if (ficha) {
    var linhas = Array.prototype.slice.call(ficha.querySelectorAll('.recurso'));
    var abrirLinha = function (linha, abrir) {
      var botao = linha.querySelector('.recurso__mais');
      linha.dataset.aberto = abrir ? 'true' : 'false';
      if (botao) botao.setAttribute('aria-expanded', abrir ? 'true' : 'false');
    };
    linhas.forEach(function (linha) {
      abrirLinha(linha, false);
      linha.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        var abrir = linha.dataset.aberto !== 'true';
        linhas.forEach(function (outra) { if (outra !== linha) abrirLinha(outra, false); });
        abrirLinha(linha, abrir);
      });
    });
  }

  /* 2. Dúvidas: cada pergunta abre e fecha sozinha */
  document.querySelectorAll('[data-faq] .faq__botao').forEach(function (botao) {
    botao.addEventListener('click', function () {
      var item = botao.closest('.faq__item');
      var abrir = botao.getAttribute('aria-expanded') !== 'true';
      botao.setAttribute('aria-expanded', abrir ? 'true' : 'false');
      if (item) item.dataset.aberto = abrir ? 'true' : 'false';
    });
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* 3. Menu do celular aberto: a rolagem suave para (main.js põe body[data-menu]) */
  if ('MutationObserver' in window) {
    new MutationObserver(function () {
      var lenis = window.__lenis;
      if (!lenis) return;
      if (document.body.dataset.menu === 'true') lenis.stop(); else lenis.start();
    }).observe(document.body, { attributes: true, attributeFilter: ['data-menu'] });
  }
})();
