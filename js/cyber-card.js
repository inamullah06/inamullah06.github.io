/* cyber-card.js — Futuristic 3D Cyber ID Card behaviour for the portfolio hero.
 *
 * Source: standalone export (workspace/your_files/futuristic-3d-cyber-id-card-inam-ullah/).
 * Builds the decorative barcodes, drives the 3D tilt + holographic sheen,
 * flips the card, and toggles the scanline. Element IDs (stage/tilt/flip/
 * flipBtn/tiltBtn/scanBtn) do not exist elsewhere on the portfolio page.
 * The two document-wide queries are scoped to .cyber-scene.
 * No dependencies. Respects prefers-reduced-motion (tilt starts off).
 */
      (function () {
        var stage = document.getElementById("stage");
        if (!stage) return; // cyber card not on this page
        var tiltEl = document.getElementById("tilt");
        var flipEl = document.getElementById("flip");
        var flipBtn = document.getElementById("flipBtn");
        var tiltBtn = document.getElementById("tiltBtn");
        var scanBtn = document.getElementById("scanBtn");
        var beams = document.querySelectorAll(".cyber-scene .scanbeam");
        var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        /* --- build barcodes from a fixed pattern --- */
        var pattern = [3,1,2,1,1,3,1,2,2,1,3,1,1,1,2,3,1,2,1,1,3,2,1,1,2,1,3,1,2,2,1,3,1,1,2,1,3,1,2,1,1,2,3,1];
        document.querySelectorAll(".cyber-scene [data-barcode]").forEach(function (box) {
          pattern.forEach(function (w, i) {
            if (i % 2 === 0) {
              var bar = document.createElement("i");
              bar.style.width = w + "px";
              box.appendChild(bar);
            } else {
              var gap = document.createElement("i");
              gap.style.width = w + "px";
              gap.style.background = "transparent";
              box.appendChild(gap);
            }
          });
          box.style.justifyContent = "center";
        });

        /* --- 3D tilt with smooth easing --- */
        var tiltOn = !reduced;
        var targetX = 0, targetY = 0, curX = 0, curY = 0, raf = null;

        function applySheen() {
          var o = tiltOn && (Math.abs(curX) > 0.4 || Math.abs(curY) > 0.4 || hovering) ? 0.85 : 0;
          flipEl.style.setProperty("--sheen-o", o);
          flipEl.style.setProperty("--sheen-rot", (curY * 9 + curX * 5).toFixed(1));
          flipEl.style.setProperty("--gx", (50 + curY * 3.2) + "%");
          flipEl.style.setProperty("--gy", (50 - curX * 3.2) + "%");
        }
        function loop() {
          curX += (targetX - curX) * 0.12;
          curY += (targetY - curY) * 0.12;
          tiltEl.style.transform = "rotateX(" + curX.toFixed(2) + "deg) rotateY(" + curY.toFixed(2) + "deg)";
          applySheen();
          if (Math.abs(targetX - curX) > 0.02 || Math.abs(targetY - curY) > 0.02 || hovering) {
            raf = requestAnimationFrame(loop);
          } else {
            raf = null;
          }
        }
        function kick() { if (!raf) raf = requestAnimationFrame(loop); }

        var hovering = false;
        function fromEvent(e) {
          var r = flipEl.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          targetY = Math.max(-16, Math.min(16, px * 30));
          targetX = Math.max(-14, Math.min(14, -py * 26));
        }
        stage.addEventListener("pointermove", function (e) {
          if (!tiltOn) return;
          hovering = true;
          fromEvent(e);
          kick();
        });
        stage.addEventListener("pointerdown", function (e) {
          if (!tiltOn) return;
          hovering = true;
          fromEvent(e);
          kick();
        });
        function release() {
          hovering = false;
          targetX = 0; targetY = 0;
          kick();
          setTimeout(applySheen, 350);
        }
        stage.addEventListener("pointerleave", release);
        stage.addEventListener("pointerup", release);
        stage.addEventListener("pointercancel", release);

        function syncTiltBtn() {
          tiltBtn.textContent = "3D tilt: " + (tiltOn ? "On" : "Off");
          tiltBtn.setAttribute("aria-pressed", String(tiltOn));
        }
        tiltBtn.addEventListener("click", function () {
          tiltOn = !tiltOn;
          if (!tiltOn) { targetX = 0; targetY = 0; hovering = false; kick(); setTimeout(applySheen, 350); }
          syncTiltBtn();
        });
        syncTiltBtn();

        /* --- flip --- */
        flipBtn.addEventListener("click", function () {
          flipEl.classList.toggle("flipped");
        });
        flipEl.addEventListener("dblclick", function () {
          flipEl.classList.toggle("flipped");
        });

        /* --- scanline toggle --- */
        var scanOn = true;
        scanBtn.addEventListener("click", function () {
          scanOn = !scanOn;
          beams.forEach(function (b) { b.style.display = scanOn ? "" : "none"; });
          scanBtn.textContent = "Scanline: " + (scanOn ? "On" : "Off");
          scanBtn.setAttribute("aria-pressed", String(scanOn));
        });
      })();
