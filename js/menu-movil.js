(function () {
  'use strict';

  function init() {
    var header = document.querySelector('.menu-navegacion');
    var btn = document.querySelector('.btn-menu-movil');
    if (!header || !btn) return;

    var fondo = header.querySelector('.menu-movil-fondo');

    function setAbierto(abierto) {
      if (abierto) {
        header.classList.add('menu-movil-abierto');
        document.body.classList.add('menu-movil-abierto');
        btn.setAttribute('aria-expanded', 'true');
        btn.setAttribute('aria-label', 'Cerrar menú');
        if (fondo) fondo.setAttribute('aria-hidden', 'false');
      } else {
        header.classList.remove('menu-movil-abierto');
        document.body.classList.remove('menu-movil-abierto');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Abrir menú');
        if (fondo) fondo.setAttribute('aria-hidden', 'true');
      }
    }

    function cerrar() {
      setAbierto(false);
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      setAbierto(!header.classList.contains('menu-movil-abierto'));
    });

    if (fondo) {
      fondo.addEventListener('click', cerrar);
    }

    header.querySelectorAll('.opciones-btn a').forEach(function (a) {
      a.addEventListener('click', cerrar);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') cerrar();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) cerrar();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
