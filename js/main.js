window.Portfolio = window.Portfolio || {};

(function () {
  const app = window.Portfolio;
  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined && text !== null) element.textContent = text;
    return element;
  };

  const svg = (path) => {
    const element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    element.setAttribute("viewBox", "0 0 24 24");
    element.setAttribute("aria-hidden", "true");
    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    line.setAttribute("d", path);
    element.appendChild(line);
    return element;
  };

  let toastTimer;
  app.showToast = (message) => {
    const toast = document.getElementById("toast");
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 4800);
  };

  const setImageFallback = (image) => {
    image.addEventListener("error", () => {
      if (!image.dataset.fallbackApplied) {
        image.dataset.fallbackApplied = "true";
        image.src = "assets/images/project-fallback.webp";
      } else {
        image.hidden = true;
        image.parentElement?.classList.add("image-unavailable");
      }
    });
  };

  const renderSkills = () => {
    const grid = document.getElementById("skills-grid");
    if (!grid) return;
    app.config.skills.forEach((group) => {
      const article = make("article", "skill-group");
      const header = make("div", "skill-group-header");
      header.appendChild(make("h3", "", group.title));
      header.appendChild(make("span", "", group.label));
      article.appendChild(header);
      const tags = make("ul", "skill-tags");
      group.items.forEach((skill) => tags.appendChild(make("li", "skill-tag", skill)));
      article.appendChild(tags);
      grid.appendChild(article);
    });
  };

  const renderLearning = () => {
    const list = document.getElementById("learning-list");
    if (!list) return;
    app.config.learning.forEach((topic, index) => {
      const item = make("li");
      item.appendChild(make("span", "", String(index + 1).padStart(2, "0")));
      item.appendChild(document.createTextNode(topic));
      list.appendChild(item);
    });
  };

  const modal = document.getElementById("project-modal");
  const modalContent = document.getElementById("modal-content");
  let lastFocused = null;

  const closeModal = () => { if (modal?.open) modal.close(); };

  const openProject = (project, trigger) => {
    if (!modal || !modalContent) return;
    lastFocused = trigger;
    modalContent.replaceChildren();

    const hero = make("div", "modal-hero");
    const image = make("img");
    image.src = project.image;
    image.alt = `Abstract artwork for ${project.title}`;
    image.width = 1200;
    image.height = 750;
    setImageFallback(image);
    hero.appendChild(image);
    hero.appendChild(make("p", "modal-kicker", `${project.type} / Abstract project artwork`));
    const title = make("h2", "", project.title);
    title.id = "modal-title";
    hero.appendChild(title);
    hero.appendChild(make("p", "modal-overview", project.overview));
    modalContent.appendChild(hero);

    const details = make("div", "modal-grid");
    const featureBlock = make("section", "modal-block");
    featureBlock.appendChild(make("h3", "", "Key features"));
    const features = make("ul");
    project.features.forEach((feature) => features.appendChild(make("li", "", feature)));
    featureBlock.appendChild(features);
    details.appendChild(featureBlock);

    const stackBlock = make("section", "modal-block");
    stackBlock.appendChild(make("h3", "", "Technology stack"));
    const stack = make("ul");
    project.stack.forEach((technology) => stack.appendChild(make("li", "", technology)));
    stackBlock.appendChild(stack);
    details.appendChild(stackBlock);

    const implementation = make("section", "modal-block");
    implementation.appendChild(make("h3", "", "Implementation notes"));
    implementation.appendChild(make("p", "", project.implementation));
    details.appendChild(implementation);

    const problem = make("section", "modal-block");
    problem.appendChild(make("h3", "", "Problem explored"));
    problem.appendChild(make("p", "", project.description));
    details.appendChild(problem);
    modalContent.appendChild(details);

    const notes = make("div", "modal-notes");
    notes.appendChild(make("h3", "", "Challenges & lessons learned"));
    notes.appendChild(make("p", "", project.notes));
    modalContent.appendChild(notes);

    const actions = make("div", "modal-actions");
    const repo = make("a", "button button-primary", "View public repository");
    repo.href = project.repo;
    repo.target = "_blank";
    repo.rel = "noopener noreferrer";
    repo.appendChild(svg("M7 17 17 7M7 7h10v10"));
    actions.appendChild(repo);
    if (project.liveUrl) {
      const live = make("a", "button button-outline", "Open live demo");
      live.href = project.liveUrl;
      live.target = "_blank";
      live.rel = "noopener noreferrer";
      actions.appendChild(live);
    }
    modalContent.appendChild(actions);
    modal.showModal();
    document.documentElement.style.overflow = "hidden";
    modal.querySelector("[data-modal-close]")?.focus();
  };

  const createProjectCard = (project, index) => {
    const card = make("article", "project-card filter-enter");
    card.style.animationDelay = `${Math.min(index * 45, 180)}ms`;
    const imageWrap = make("div", "project-image");
    const image = make("img");
    image.src = project.image;
    image.alt = `Abstract project artwork for ${project.title}`;
    image.width = 1200;
    image.height = 750;
    image.loading = "lazy";
    image.decoding = "async";
    setImageFallback(image);
    imageWrap.appendChild(image);
    imageWrap.appendChild(make("span", "artwork-label", "Concept artwork"));
    card.appendChild(imageWrap);

    const body = make("div", "project-body");
    const meta = make("div", "project-meta");
    meta.appendChild(make("span", "", project.type));
    meta.appendChild(make("span", "", String(index + 1).padStart(2, "0")));
    body.appendChild(meta);
    body.appendChild(make("h3", "", project.title));
    body.appendChild(make("p", "project-description", project.description));
    const tags = make("ul", "project-tags");
    project.stack.slice(0, 4).forEach((technology) => tags.appendChild(make("li", "", technology)));
    body.appendChild(tags);

    const actions = make("div", "project-actions");
    const details = make("button", "button button-outline", "View details");
    details.type = "button";
    details.addEventListener("click", () => openProject(project, details));
    actions.appendChild(details);
    const repo = make("a", "repo-link", "GitHub");
    repo.href = project.repo;
    repo.target = "_blank";
    repo.rel = "noopener noreferrer";
    repo.setAttribute("aria-label", `View ${project.title} source on GitHub`);
    repo.appendChild(svg("M7 17 17 7M7 7h10v10"));
    actions.appendChild(repo);
    body.appendChild(actions);
    card.appendChild(body);
    return card;
  };

  const initProjects = () => {
    const grid = document.getElementById("project-grid");
    const empty = document.getElementById("project-empty");
    const count = document.getElementById("filter-count");
    const filters = Array.from(document.querySelectorAll("[data-filter]"));
    if (!grid || !empty || !count) return;

    const render = (filter) => {
      const matches = filter === "All" ? app.projects : app.projects.filter((project) => project.categories.includes(filter));
      grid.replaceChildren();
      matches.forEach((project, index) => grid.appendChild(createProjectCard(project, index)));
      grid.hidden = matches.length === 0;
      empty.hidden = matches.length !== 0;
      count.textContent = `${matches.length} ${matches.length === 1 ? "project" : "projects"}${filter === "All" ? " in the collection" : ` tagged ${filter}`}`;
    };

    const selectFilter = (filter) => {
      filters.forEach((button) => {
        const selected = button.dataset.filter === filter;
        button.classList.toggle("active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
      render(filter);
    };
    filters.forEach((button) => button.addEventListener("click", () => selectFilter(button.dataset.filter)));
    document.getElementById("reset-filter")?.addEventListener("click", () => selectFilter("All"));
    render("All");
  };

  const initModal = () => {
    if (!modal) return;
    modal.querySelector("[data-modal-close]")?.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });
    modal.addEventListener("close", () => {
      document.documentElement.style.overflow = "";
      if (lastFocused?.isConnected) lastFocused.focus();
    });
  };

  const initResume = () => {
    document.querySelectorAll("[data-resume]").forEach((button) => {
      button.addEventListener("click", () => {
        const path = app.config.resumeUrl.trim();
        if (!path) {
          app.showToast("The resume PDF hasn’t been added yet. You can contact Inam by email instead.");
          return;
        }
        const link = document.createElement("a");
        link.href = path;
        link.download = path.split("/").pop() || "inam-ullah-resume.pdf";
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
    });
  };

  document.getElementById("current-year").textContent = String(new Date().getFullYear());
  renderSkills();
  renderLearning();
  initProjects();
  initModal();
  initResume();
  app.initNavigation();
  app.initAnimations();
  app.initGithub();
  app.initContact();
})();
