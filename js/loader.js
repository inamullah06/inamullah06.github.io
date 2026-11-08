/* Loading screen — adapted from the 2026-11-03 alfari-inspired preview.
   Shows a 0–100% counter while the page loads, then fades out. Loaded
   first among the deferred scripts so the counter starts as early as
   possible. Safety: hides on window load (+400ms), when the counter hits
   100 (+350ms), and on a 2.5s absolute fallback — plus a CSS failsafe in
   css/loader.css that fades the overlay out at 3s even if this file fails
   to load. Reduced-motion users never see the loader at all (CSS hides it
   and this script exits immediately). */
(function () {
  var loader = document.getElementById("site-loader");
  if (!loader) return;

  var done = false;
  var hide = function () {
    if (done) return;
    done = true;
    loader.classList.add("hidden");
    loader.setAttribute("aria-hidden", "true");
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    hide();
    return;
  }

  var num = document.getElementById("loader-num");
  var bar = document.getElementById("loader-bar");
  var p = 0;
  var tick = setInterval(function () {
    p = Math.min(100, p + Math.floor(Math.random() * 16) + 6);
    if (num) num.textContent = p;
    if (bar) bar.style.width = p + "%";
    if (p >= 100) {
      clearInterval(tick);
      setTimeout(hide, 350);
    }
  }, 130);

  window.addEventListener("load", function () { setTimeout(hide, 400); });
  setTimeout(function () { clearInterval(tick); hide(); }, 2500);
})();
