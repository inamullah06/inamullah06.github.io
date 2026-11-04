/* student-card.js — flip + tilt + cursor-follow up/down for the portfolio
 * student ID card. No dependencies. Safe to include on any page that
 * contains .id-scene. Respects prefers-reduced-motion: tilt and vertical
 * follow are disabled, flip still works.
 */
(function () {
  'use strict';

  var scene = document.querySelector('.id-scene');
  if (!scene) return;

  var tilt = scene.querySelector('.id-tilt');
  var flipper = scene.querySelector('.id-flipper');
  if (!tilt || !flipper) return;

  /* Flip: both buttons toggle the same card. */
  scene.querySelectorAll('[data-flip]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      flipper.classList.toggle('flipped');
    });
  });

  /* Pointer follow: gentle tilt (max ~7deg) + vertical movement
   * (max ~18px) that follows the cursor up and down. Skipped for
   * reduced motion. Values are smoothed with a lerp so the card
   * glides instead of jumping. */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var raf = null;
  var targetX = 0, targetY = 0, targetT = 0;
  var currentX = 0, currentY = 0, currentT = 0;

  function apply() {
    raf = null;
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    currentT += (targetT - currentT) * 0.12;
    tilt.style.transform =
      'translateY(' + currentT.toFixed(2) + 'px)' +
      ' rotateX(' + currentY.toFixed(2) + 'deg)' +
      ' rotateY(' + currentX.toFixed(2) + 'deg)';
    if (Math.abs(targetX - currentX) > 0.01 ||
        Math.abs(targetY - currentY) > 0.01 ||
        Math.abs(targetT - currentT) > 0.01) {
      raf = requestAnimationFrame(apply);
    }
  }

  scene.addEventListener('pointermove', function (e) {
    var r = scene.getBoundingClientRect();
    var px = (e.clientX - r.left) / r.width - 0.5;
    var py = (e.clientY - r.top) / r.height - 0.5;
    targetY = Math.max(-7, Math.min(7, -py * 14));
    targetX = Math.max(-7, Math.min(7, px * 14));
    targetT = Math.max(-18, Math.min(18, py * 36));
    if (!raf) raf = requestAnimationFrame(apply);
  });

  scene.addEventListener('pointerleave', function () {
    targetX = 0;
    targetY = 0;
    targetT = 0;
    if (!raf) raf = requestAnimationFrame(apply);
  });
})();
