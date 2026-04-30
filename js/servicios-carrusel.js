(function () {
  'use strict';

  var MQ = '(max-width: 1023px)';

  function initCarrusel(root) {
    var viewport = root.querySelector('.servicios-carrusel__viewport');
    var track = root.querySelector('.servicios-carrusel__track');
    var prevBtn = root.querySelector('.servicios-carrusel__btn--prev');
    var nextBtn = root.querySelector('.servicios-carrusel__btn--next');
    var dotsBox = root.querySelector('.servicios-carrusel__indicadores');
    if (!viewport || !track || !prevBtn || !nextBtn || !dotsBox) return;

    var slides = track.querySelectorAll(':scope > article');
    if (slides.length < 2) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      dotsBox.style.display = 'none';
      return;
    }

    var index = 0;
    var dots = [];
    var mq = window.matchMedia(MQ);

    function slideWidth() {
      return viewport.clientWidth || 0;
    }

    function update() {
      if (!mq.matches) {
        track.style.transform = '';
        return;
      }
      var w = slideWidth();
      if (w <= 0) return;
      track.style.transform = 'translateX(' + (-index * w) + 'px)';
      dots.forEach(function (d, i) {
        d.classList.toggle('activo', i === index);
      });
    }

    function go(delta) {
      var n = slides.length;
      index = (index + delta + n) % n;
      update();
    }

    function goTo(i) {
      index = Math.max(0, Math.min(slides.length - 1, i));
      update();
    }

    function reset() {
      index = 0;
      update();
    }

    dotsBox.removeAttribute('aria-hidden');
    dotsBox.setAttribute('role', 'tablist');
    dotsBox.setAttribute('aria-label', 'Tarjetas del servicio');

    slides.forEach(function (_, i) {
      var d = document.createElement('button');
      d.type = 'button';
      d.className = 'servicios-carrusel__dot';
      d.setAttribute('aria-label', 'Ir a la tarjeta ' + (i + 1));
      d.addEventListener('click', function () {
        goTo(i);
      });
      dotsBox.appendChild(d);
      dots.push(d);
    });

    prevBtn.addEventListener('click', function () {
      go(-1);
    });
    nextBtn.addEventListener('click', function () {
      go(1);
    });

    var touchStartX = 0;
    var touchStartY = 0;
    viewport.addEventListener(
      'touchstart',
      function (e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      },
      { passive: true }
    );
    viewport.addEventListener(
      'touchend',
      function (e) {
        var t = e.changedTouches[0];
        if (!t) return;
        var dx = t.clientX - touchStartX;
        var dy = t.clientY - touchStartY;
        if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy)) return;
        if (dx > 0) go(-1);
        else go(1);
      },
      { passive: true }
    );

    mq.addEventListener('change', update);
    window.addEventListener('resize', update);

    root._serviciosCarruselUpdate = update;
    root._serviciosCarruselReset = reset;

    update();
  }

  function refreshAll() {
    document.querySelectorAll('.servicios-carrusel').forEach(function (root) {
      if (root._serviciosCarruselUpdate) root._serviciosCarruselUpdate();
    });
  }

  function resetAll() {
    document.querySelectorAll('.servicios-carrusel').forEach(function (root) {
      if (root._serviciosCarruselReset) root._serviciosCarruselReset();
    });
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.elegir-servicio')) {
      resetAll();
      requestAnimationFrame(function () {
        requestAnimationFrame(refreshAll);
      });
    }
  });

  function boot() {
    document.querySelectorAll('.servicios-carrusel').forEach(initCarrusel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
