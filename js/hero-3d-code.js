/* hero-3d-code.js — Code-only 3D hero background for inamullah06.github.io
 *
 * No phone, no knot: a floating "code cloud" — language names and code
 * symbols for C++, Java, Python, Flutter, Dart and JavaScript, drifting
 * slowly over a subtle particle field, behind the hero text. The chips are
 * small and sit behind the content (canvas layer), so the title stays
 * readable — nothing big covers the text.
 *
 * Same safety as the earlier hero scenes: capped pixel ratio, pauses when
 * the tab is hidden or the hero scrolls off-screen, single static frame
 * on prefers-reduced-motion, and if Three.js/WebGL fails the canvas simply
 * stays empty and the hero looks exactly as before.
 */
(function () {
  'use strict';

  var canvas = document.getElementById('hero-3d-canvas');
  if (!canvas) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js')
    .then(function (THREE) {
      var renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
      } catch (e) {
        return; /* No WebGL — leave the hero as it was. */
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
      camera.position.set(0, 0, 9);

      /* ---- Subtle particle field (Flutter blue -> cyan -> violet) ---- */
      var COUNT = 300;
      var positions = new Float32Array(COUNT * 3);
      var colors = new Float32Array(COUNT * 3);
      var palette = [
        new THREE.Color('#02569b'),
        new THREE.Color('#13b9fd'),
        new THREE.Color('#7c4dff')
      ];
      for (var i = 0; i < COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 26;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 13;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
        var c = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }
      var geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      var particles = new THREE.Points(geo, new THREE.PointsMaterial({
        size: 0.05, vertexColors: true, transparent: true, opacity: 0.7
      }));
      scene.add(particles);

      /* ---- Code chips: 6 languages + code symbols ---- */
      function makeChipTexture(text, color) {
        var cv = document.createElement('canvas');
        cv.width = 320;
        cv.height = 128;
        var ctx = cv.getContext('2d');
        ctx.font = '700 52px ui-monospace, Menlo, Consolas, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = color;
        ctx.shadowBlur = 16;
        ctx.fillStyle = color;
        ctx.fillText(text, 160, 64);
        var tex = new THREE.CanvasTexture(cv);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
      }
      var chipDefs = [
        { t: 'C++', c: '#659ad2', big: true },
        { t: 'Java', c: '#f89820', big: true },
        { t: 'Python', c: '#ffd43b', big: true },
        { t: 'Flutter', c: '#13b9fd', big: true },
        { t: 'Dart', c: '#40c4ff', big: true },
        { t: 'JavaScript', c: '#f7df1e', big: true },
        { t: '</>', c: '#e0f2fe', big: false },
        { t: '{ }', c: '#7c4dff', big: false },
        { t: '=>', c: '#c792ea', big: false },
        { t: '#include', c: '#659ad2', big: false },
        { t: 'class', c: '#82aaff', big: false },
        { t: 'def', c: '#ffd43b', big: false },
        { t: 'print()', c: '#e0f2fe', big: false },
        { t: 'Widget', c: '#13b9fd', big: false },
        { t: 'build()', c: '#c792ea', big: false },
        { t: 'void main()', c: '#40c4ff', big: false }
      ];
      var cloud = new THREE.Group();
      var chips = chipDefs.map(function (d, i) {
        var sp = new THREE.Sprite(new THREE.SpriteMaterial({
          map: makeChipTexture(d.t, d.c), transparent: true, opacity: 0.85, depthWrite: false
        }));
        sp.scale.set(d.big ? 1.35 : 1.0, d.big ? 0.54 : 0.4, 1);
        /* Spread across the hero, not in one clump over the title. */
        sp.position.set(
          (Math.random() - 0.5) * 11,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 3
        );
        sp.userData = {
          baseY: sp.position.y,
          bobSpeed: 0.4 + Math.random() * 0.5,
          bobAmp: 0.15 + Math.random() * 0.2,
          offset: Math.random() * Math.PI * 2
        };
        cloud.add(sp);
        return sp;
      });
      scene.add(cloud);

      /* ---- Sizing: smaller + slightly lower cloud on phones ---- */
      function resize() {
        var w = canvas.parentElement.clientWidth || window.innerWidth;
        var h = canvas.parentElement.clientHeight || window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        if (w > 900) {
          cloud.scale.setScalar(1);
          cloud.position.y = 0;
        } else {
          cloud.scale.setScalar(0.72);
          cloud.position.y = -0.6;
        }
      }
      window.addEventListener('resize', resize);
      resize();

      /* ---- Gentle mouse parallax ---- */
      var mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
      window.addEventListener('pointermove', function (e) {
        targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetY = (e.clientY / window.innerHeight - 0.5) * 2;
      }, { passive: true });

      /* ---- Pause when hidden / off-screen ---- */
      var running = true;
      document.addEventListener('visibilitychange', function () {
        running = !document.hidden;
        if (running) requestAnimationFrame(tick);
      });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          var visible = entries[0].isIntersecting;
          if (visible && !running) { running = true; requestAnimationFrame(tick); }
          if (!visible) running = false;
        }).observe(canvas);
      }

      var clock = new THREE.Clock();
      function tick() {
        if (!running) return;
        var t = clock.getElapsedTime();
        /* Whole cloud slowly orbits; each chip bobs on its own. */
        cloud.rotation.y = t * 0.05;
        chips.forEach(function (sp) {
          var u = sp.userData;
          sp.position.y = u.baseY + Math.sin(t * u.bobSpeed + u.offset) * u.bobAmp;
        });
        particles.rotation.y = t * 0.02;
        mouseX += (targetX - mouseX) * 0.04;
        mouseY += (targetY - mouseY) * 0.04;
        camera.position.x = mouseX * 0.6;
        camera.position.y = -mouseY * 0.4;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
        if (!reducedMotion) requestAnimationFrame(tick);
      }

      /* Reduced motion: one calm static frame, no loop. */
      tick();
    })
    .catch(function () { /* CDN unreachable — hero stays as before. */ });
})();
