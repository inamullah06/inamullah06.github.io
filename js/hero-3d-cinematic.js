/* hero-3d-cinematic.js - Cinematic 3D hero background for inamullah06.github.io
 *
 * Replaces the drifting code-chip cloud with a cinematic scene in the same
 * background layer (the existing #hero-3d-canvas, absolute, z-index 0,
 * pointer-events none in css/hero-3d.css): a glowing wireframe core, six
 * language chips orbiting it (Flutter, Dart, C++, Java, Python, JavaScript,
 * each with a tiny real code snippet), drifting code glyphs, a particle
 * starfield, fog, and a slow camera dolly-in on load. Mouse parallax
 * follows window mouse movement only - the canvas never captures clicks.
 *
 * Kept dim and ambient so hero text and the student ID card stay legible;
 * on narrow screens the scene scales down and thins out so it never
 * covers the title. Same safety as the previous scene: pixel ratio capped
 * at 2 (1.5 on narrow screens), rendering pauses when the tab is hidden or
 * the hero is off-screen, one static frame for prefers-reduced-motion, and
 * if Three.js/WebGL fails the canvas simply stays empty and the hero looks
 * exactly as before. No control row is added, so nothing can overlap hero
 * content.
 *
 * Performance: Three.js is NOT fetched or parsed during first paint. The
 * scene starts only after the window load event, when the browser is idle,
 * so LCP and Total Blocking Time are not hit by Three.js parsing.
 */
(function () {
  'use strict';
  var canvas = document.getElementById('hero-3d-canvas');
  if (!canvas) return;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Deferred start: fetch Three.js only after load, when idle. */
  var started = false;
  function startScene() {
    if (started) return;
    started = true;
  import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js')
    .then(function (THREE) {
      var renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
      } catch (e) {
        return; /* No WebGL - leave the hero as it was. */
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth <= 900 ? 1.5 : 2));
      renderer.setClearColor(0x000000, 0);
      var scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x080b12, 9, 24);
      var camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
      var narrow = window.innerWidth <= 900;
      var dollyTarget = narrow ? 11.5 : 8.5;
      var dollyStart = dollyTarget + 5.5;
      camera.position.set(0, 0, reducedMotion ? dollyTarget : dollyStart);
      /* ---- Soft glow behind the core (radial gradient sprite) ---- */
      function makeGlowTexture() {
        var cv = document.createElement('canvas');
        cv.width = 256; cv.height = 256;
        var ctx = cv.getContext('2d');
        var g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
        g.addColorStop(0, 'rgba(19,185,253,0.55)');
        g.addColorStop(0.4, 'rgba(19,185,253,0.18)');
        g.addColorStop(1, 'rgba(19,185,253,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256);
        var tex = new THREE.CanvasTexture(cv);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
      }
      /* ---- Glowing wireframe core ---- */
      var cinematic = new THREE.Group();
      var glow = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeGlowTexture(), transparent: true, opacity: 0.35, depthWrite: false
      }));
      glow.scale.set(6.5, 6.5, 1);
      cinematic.add(glow);
      var core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.05, 1),
        new THREE.MeshBasicMaterial({ color: 0x13b9fd, wireframe: true, transparent: true, opacity: 0.32 })
      );
      cinematic.add(core);
      var outer = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.5, 0),
        new THREE.MeshBasicMaterial({ color: 0x7c4dff, wireframe: true, transparent: true, opacity: 0.16 })
      );
      cinematic.add(outer);
      var heart = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 24, 24),
        new THREE.MeshBasicMaterial({ color: 0x13b9fd, transparent: true, opacity: 0.14 })
      );
      cinematic.add(heart);
      /* ---- Orbiting language chips with tiny real snippets ---- */
      function makeChipTexture(name, snippet, color) {
        var cv = document.createElement('canvas');
        cv.width = 440; cv.height = 190;
        var ctx = cv.getContext('2d');
        ctx.fillStyle = 'rgba(8,15,26,0.55)';
        ctx.strokeStyle = color; ctx.globalAlpha = 0.55; ctx.lineWidth = 3;
        ctx.beginPath();
        if (ctx.roundRect) { ctx.roundRect(6, 6, 428, 178, 22); } else { ctx.rect(6, 6, 428, 178); }
        ctx.fill(); ctx.stroke(); ctx.globalAlpha = 1;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = '700 46px ui-monospace, Menlo, Consolas, monospace';
        ctx.shadowColor = color; ctx.shadowBlur = 12; ctx.fillStyle = color;
        ctx.fillText(name, 220, 62);
        ctx.shadowBlur = 0;
        ctx.font = '400 25px ui-monospace, Menlo, Consolas, monospace';
        ctx.fillStyle = '#dbeafe';
        ctx.fillText(snippet, 220, 128);
        var tex = new THREE.CanvasTexture(cv);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
      }
      var chipDefs = [
        { t: 'Flutter', s: 'Widget build(BuildContext c)', c: '#13b9fd' },
        { t: 'Dart', s: 'void main() => runApp(App());', c: '#40c4ff' },
        { t: 'C++', s: '#include <iostream>', c: '#659ad2' },
        { t: 'Java', s: 'class App { void main() {} }', c: '#f89820' },
        { t: 'Python', s: "def main(): print('Hello')", c: '#ffd43b' },
        { t: 'JavaScript', s: 'const app = () => render();', c: '#f7df1e' }
      ];
      var orbit = new THREE.Group();
      orbit.rotation.x = 0.35; orbit.rotation.z = -0.15;
      chipDefs.forEach(function (d, i) {
        var sp = new THREE.Sprite(new THREE.SpriteMaterial({
          map: makeChipTexture(d.t, d.s, d.c), transparent: true, opacity: 0.62, depthWrite: false
        }));
        sp.scale.set(1.9, 0.82, 1);
        var a = (i / chipDefs.length) * Math.PI * 2;
        var r = 2.9 + (i % 2) * 0.5;
        sp.position.set(Math.cos(a) * r, (i % 3 - 1) * 0.55, Math.sin(a) * r);
        orbit.add(sp);
      });
      cinematic.add(orbit);
      scene.add(cinematic);
      /* ---- Particle starfield ---- */
      var COUNT = narrow ? 120 : 320;
      var positions = new Float32Array(COUNT * 3);
      var colors = new Float32Array(COUNT * 3);
      var palette = [
        new THREE.Color('#02569b'), new THREE.Color('#13b9fd'),
        new THREE.Color('#7c4dff'), new THREE.Color('#e0f2fe')
      ];
      for (var i = 0; i < COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 28;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 1;
        var col = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3] = col.r; colors[i * 3 + 1] = col.g; colors[i * 3 + 2] = col.b;
      }
      var starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      var stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
        size: 0.06, vertexColors: true, transparent: true, opacity: 0.6
      }));
      scene.add(stars);
      /* ---- Drifting code glyphs ---- */
      function makeGlyphTexture(text, color) {
        var cv = document.createElement('canvas');
        cv.width = 256; cv.height = 128;
        var ctx = cv.getContext('2d');
        ctx.font = '700 56px ui-monospace, Menlo, Consolas, monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.shadowColor = color; ctx.shadowBlur = 14; ctx.fillStyle = color;
        ctx.fillText(text, 128, 64);
        var tex = new THREE.CanvasTexture(cv);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
      }
      var glyphTexts = ['</>', '{ }', '=>', ';'];
      var glyphs = [];
      var glyphCount = narrow ? 4 : 12;
      for (var g = 0; g < glyphCount; g++) {
        var gt = glyphTexts[g % glyphTexts.length];
        var sp2 = new THREE.Sprite(new THREE.SpriteMaterial({
          map: makeGlyphTexture(gt, '#9edcff'), transparent: true, opacity: 0.30, depthWrite: false
        }));
        sp2.scale.set(0.85, 0.42, 1);
        sp2.position.set((Math.random() - 0.5) * 13, (Math.random() - 0.5) * 6.5, (Math.random() - 0.5) * 4 - 1);
        sp2.userData = { baseY: sp2.position.y, speed: 0.10 + Math.random() * 0.12 };
        scene.add(sp2); glyphs.push(sp2);
      }
      /* ---- Sizing: smaller, centred scene on narrow screens ---- */
      function resize() {
        var w = (canvas.parentElement && canvas.parentElement.clientWidth) || window.innerWidth;
        var h = (canvas.parentElement && canvas.parentElement.clientHeight) || window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        if (w > 900) { cinematic.scale.setScalar(1); cinematic.position.set(0.2, 0, -1); }
        else { cinematic.scale.setScalar(0.62); cinematic.position.set(0, -0.2, -1); }
      }
      window.addEventListener('resize', resize);
      resize();
      /* ---- Mouse parallax from the window (canvas never captures clicks) ---- */
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
      var startMs = performance.now();
      function tick() {
        if (!running) return;
        var t = clock.getElapsedTime();
        core.rotation.y = t * 0.12; core.rotation.x = t * 0.05;
        outer.rotation.y = -t * 0.07; outer.rotation.x = t * 0.04;
        orbit.rotation.y = t * 0.08;
        stars.rotation.y = t * 0.015;
        glyphs.forEach(function (sp) {
          var u = sp.userData;
          sp.position.y = -3.5 + (((u.baseY + 3.5 + t * u.speed) % 7) + 7) % 7;
        });
        /* Slow cinematic dolly-in on load (skipped for reduced motion). */
        var p = reducedMotion ? 1 : Math.min((performance.now() - startMs) / 3800, 1);
        var ease = 1 - Math.pow(1 - p, 3);
        mouseX += (targetX - mouseX) * 0.04;
        mouseY += (targetY - mouseY) * 0.04;
        camera.position.z = dollyStart + (dollyTarget - dollyStart) * ease;
        camera.position.x = mouseX * 0.6;
        camera.position.y = -mouseY * 0.4;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
        if (!reducedMotion) requestAnimationFrame(tick);
      }
      tick();
    })
    .catch(function () { /* CDN unreachable - hero stays as before. */ });
  }
  /* Deferred start (perf fix): Three.js (three.module.min.js, 162.5KiB) is an
   * ambient-only dependency — the hero copy, card and buttons are fully usable
   * without it — so it must never compete with first paint or LCP, and its
   * long tasks (259/101/60/55/50ms) must not run during initial load. Start
   * it (a) immediately on the user's first engagement (mouse, touch, scroll,
   * keys), (b) otherwise once LCP has happened and the browser is idle, or
   * (c) at the latest 6s after boot as an absolute fallback. The scene itself
   * (6 language chips orbiting a glowing core) is unchanged; only its start
   * time moves. startScene() is still guarded by `started`, so multiple
   * triggers can never build the scene twice. */
  var sceneScheduled = false;
  function scheduleScene() {
    if (sceneScheduled) return;
    sceneScheduled = true;

    /* (a) First engagement: start the scene right away. */
    var engageEvents = ['pointermove', 'scroll', 'keydown', 'touchstart'];
    engageEvents.forEach(function (ev) {
      window.addEventListener(ev, startScene, { once: true, passive: true });
    });

    /* (b) Otherwise: after LCP, when the browser is idle. */
    var idleStart = function () {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(startScene, { timeout: 4000 });
      } else {
        setTimeout(startScene, 1200);
      }
    };
    if ('PerformanceObserver' in window) {
      try {
        var lcpObserver = new PerformanceObserver(function (list) {
          if (list.getEntries().length) { lcpObserver.disconnect(); idleStart(); }
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) { idleStart(); }
    } else {
      idleStart();
    }

    /* (c) Absolute fallback so the scene still appears with no interaction. */
    setTimeout(startScene, 6000);
  }
  if (document.readyState === 'complete') {
    scheduleScene();
  } else {
    window.addEventListener('load', scheduleScene);
  }
})();
