/* Edit this file to update profile settings, skills, learning topics, and integrations. */
window.Portfolio = window.Portfolio || {};

window.Portfolio.config = {
  profile: {
    name: "Inam Ullah",
    email: "inamullah4938@gmail.com",
    github: "https://github.com/inamullah06",
    linkedin: "https://www.linkedin.com/in/inamullah4938",
    location: "Pakistan"
  },

  // Example: "assets/resume/inam-ullah-resume.pdf". Leave empty until a real PDF exists.
  resumeUrl: "assets/resume/inam-ullah-resume.pdf",

  // Optional FormSubmit or compatible form endpoint. Leave empty for the mailto fallback.
  // Never put private API keys or secrets in this public file.
  formEndpoint: "",

  github: {
    username: "inamullah06",
    cacheMinutes: 30,
    repositoryLimit: 6
  },

  skills: [
    { title: "Mobile development", label: "01 / MOBILE", items: ["Flutter", "Dart"] },
    { title: "Frontend development", label: "02 / WEB", items: ["HTML5", "CSS3", "JavaScript"] },
    { title: "Programming & interests", label: "03 / EXPLORE", items: ["Python", "AI fundamentals", "Networking & cybersecurity"] },
    { title: "Tools", label: "04 / TOOLKIT", items: ["Git", "GitHub", "VS Code", "Android Studio", "Linux"] }
  ],

  learning: [
    "Advanced Flutter development",
    "Better software architecture",
    "Modern JavaScript",
    "Python programming",
    "AI-assisted applications",
    "Networking & cybersecurity fundamentals"
  ]
};
