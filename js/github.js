window.Portfolio = window.Portfolio || {};

window.Portfolio.initGithub = function () {
  const grid = document.getElementById("repo-grid");
  const status = document.getElementById("github-status");
  if (!grid || !status) return;

  const { username, cacheMinutes, repositoryLimit } = window.Portfolio.config.github;
  const cacheKey = `iu-github-repos-v1-${username}`;
  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined && text !== null) element.textContent = text;
    return element;
  };

  const icon = (path) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    line.setAttribute("d", path);
    svg.appendChild(line);
    return svg;
  };

  const renderRepos = (repos) => {
    grid.replaceChildren();
    grid.setAttribute("aria-busy", "false");
    repos.forEach((repo) => {
      const card = make("article", "repo-card");
      const top = make("div", "repo-top");
      top.appendChild(icon("M4 5a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Z"));
      top.appendChild(make("span", "repo-language", repo.language || "Repository"));
      card.appendChild(top);
      card.appendChild(make("h3", "", repo.name));
      if (repo.description) card.appendChild(make("p", "", repo.description));
      const bottom = make("div", "repo-bottom");
      if (typeof repo.stargazers_count === "number") {
        const stars = make("span", "", `★ ${repo.stargazers_count}`);
        stars.setAttribute("aria-label", `${repo.stargazers_count} GitHub stars`);
        bottom.appendChild(stars);
      } else {
        bottom.appendChild(make("span", "", "Public source"));
      }
      const link = make("a", "", "View repository ↗");
      link.href = repo.html_url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", `View ${repo.name} on GitHub`);
      bottom.appendChild(link);
      card.appendChild(bottom);
      grid.appendChild(card);
    });
  };

  const fallback = window.Portfolio.projects.slice(0, repositoryLimit).map((project) => ({
    name: project.repo.split("/").pop(),
    description: project.description,
    language: project.stack[0],
    html_url: project.repo,
    stargazers_count: null
  }));

  const showFallback = (message) => {
    status.textContent = message;
    renderRepos(fallback);
  };

  const readCache = () => {
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey));
      if (!cached || !Array.isArray(cached.data) || Date.now() - cached.time > cacheMinutes * 60 * 1000) return null;
      return cached.data;
    } catch (_) {
      return null;
    }
  };

  const writeCache = (data) => {
    try { localStorage.setItem(cacheKey, JSON.stringify({ time: Date.now(), data })); } catch (_) { /* Storage is optional. */ }
  };

  grid.replaceChildren();
  for (let index = 0; index < 3; index += 1) grid.appendChild(make("div", "repo-skeleton"));

  const cached = readCache();
  if (cached) {
    status.textContent = "Recently cached public repositories.";
    renderRepos(cached.slice(0, repositoryLimit));
    return;
  }

  fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=${repositoryLimit}&type=public`, {
    headers: { Accept: "application/vnd.github+json" }
  }).then((response) => {
    if (!response.ok) {
      const error = new Error(`GitHub returned ${response.status}`);
      error.rateLimited = response.status === 403 || response.status === 429;
      throw error;
    }
    return response.json();
  }).then((data) => {
    if (!Array.isArray(data)) throw new Error("Unexpected GitHub response");
    const repos = data.filter((repo) => !repo.fork).map((repo) => ({
      name: String(repo.name || "Untitled repository"),
      description: repo.description ? String(repo.description).replace(/\*\*/g, "").replace(/[\u2600-\u27BF]/gu, "").trim() : "",
      language: repo.language ? String(repo.language) : "",
      html_url: String(repo.html_url || `https://github.com/${username}`),
      stargazers_count: Number.isFinite(repo.stargazers_count) ? repo.stargazers_count : null
    }));
    grid.setAttribute("aria-busy", "false");
    if (!repos.length) {
      grid.replaceChildren();
      status.textContent = "No public repositories are currently available to display.";
      return;
    }
    writeCache(repos);
    status.textContent = "Public repositories loaded from the GitHub API.";
    renderRepos(repos.slice(0, repositoryLimit));
  }).catch((error) => {
    showFallback(error.rateLimited
      ? "GitHub’s public API rate limit was reached. Showing configured public repositories instead."
      : "GitHub is unavailable right now. Showing configured public repositories instead.");
  });
};
