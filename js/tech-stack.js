/* Tech Stack tiles — adapted from the 2026-11-03 alfari-inspired preview.
   Reads the real skills from js/config.js, so it stays in sync when the
   config changes. Renders into #tech-stack-grid (inside the #skills
   section, after #skills-grid) and reveals the block by adding .is-ready.
   Load this file after js/main.js. */
(function () {
  var grid = document.getElementById("tech-stack-grid");
  var block = document.getElementById("tech-stack-block");
  var config = window.Portfolio && window.Portfolio.config;
  if (!grid || !config || !config.skills) return;

  /* Monogram from the name: split on spaces and camelCase boundaries so
     "GitHub" -> "GH" (not "GI", which would collide with "Git") and
     "JavaScript" -> "JS". Single words take their first two letters. */
  var initials = function (name) {
    var parts = name.replace(/[^A-Za-z0-9 ]/g, "").replace(/([a-z])([A-Z])/g, "$1 $2").split(" ").filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase();
  };

  config.skills.forEach(function (group) {
    group.items.forEach(function (skill) {
      var tile = document.createElement("div");
      tile.className = "tech-tile";
      var mark = document.createElement("div");
      mark.className = "tech-mark";
      mark.textContent = initials(skill);
      var label = document.createElement("span");
      label.textContent = skill;
      var tag = document.createElement("small");
      tag.textContent = group.title;
      tile.append(mark, label, tag);
      grid.appendChild(tile);
    });
  });

  if (block) block.classList.add("is-ready");
})();
