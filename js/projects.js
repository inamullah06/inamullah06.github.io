/*
 * Public, verified repository entries. Add liveUrl only when a real deployment exists.
 * Keep challenges and lessons factual; use the provided unpublished note until details exist.
 */
window.Portfolio = window.Portfolio || {};

window.Portfolio.projects = [
  {
    id: "flutter-calculator",
    title: "Flutter Calculator",
    type: "Mobile application",
    categories: ["Flutter"],
    description: "A simple calculator app built with Flutter and Dart for everyday mathematical calculations.",
    overview: "The project focuses on a clean mobile interface for performing basic arithmetic. Its public README describes addition, subtraction, multiplication, and division as the core operations.",
    features: ["Addition, subtraction, multiplication, and division", "Flutter-based mobile interface", "Responsive user interaction"],
    stack: ["Flutter", "Dart", "Material Design"],
    implementation: "The public repository contains a Flutter project with lib, test, Android, iOS, web, and Windows targets.",
    notes: "Detailed challenges and lessons learned have not been published yet.",
    image: "assets/images/project-calculator.webp",
    repo: "https://github.com/inamullah06/Calculator",
    liveUrl: "https://inamullah06.github.io/Calculator/"
  },
  {
    id: "bmi-calculator",
    title: "BMI Calculator",
    type: "Mobile utility",
    categories: ["Flutter"],
    description: "A Flutter and Dart app for calculating Body Mass Index from height and weight inputs.",
    overview: "The app is designed to make a routine health calculation easy to access. The public README describes height and weight entry, BMI calculation, a numeric result, and a corresponding adult BMI category.",
    features: ["Height and weight input", "BMI calculation and result display", "BMI category presentation"],
    stack: ["Flutter", "Dart", "Material Design"],
    implementation: "The public repository contains a Flutter application with lib, test, mobile, web, and desktop platform directories.",
    notes: "Detailed challenges and lessons learned have not been published yet. BMI is a screening measure, not a medical diagnosis.",
    image: "assets/images/project-bmi.webp",
    repo: "https://github.com/inamullah06/BMI",
    liveUrl: "https://inamullah06.github.io/BMI/"
  },
  {
    id: "atmosphere-ai",
    title: "Atmosphere AI",
    type: "Weather dashboard",
    categories: ["Web", "AI"],
    description: "A responsive weather dashboard for current conditions, forecasts, and atmospheric information.",
    overview: "Atmosphere AI presents weather information through a modern dashboard. Its public README describes city search, current conditions, forecasts, humidity, wind, pressure, and sunrise and sunset information.",
    features: ["City-based weather search", "Current conditions and forecasts", "Atmospheric details and weather visualization"],
    stack: ["HTML", "CSS", "JavaScript", "Weather API"],
    implementation: "The public repository is a framework-free web project with separate styles, an AI engine script, and a weather-particles script. AI-powered insights are described conditionally in the README and are not claimed as verified here.",
    notes: "Detailed challenges and lessons learned have not been published yet.",
    image: "assets/images/project-weather.webp",
    repo: "https://github.com/inamullah06/Inrelligent-Weather",
    liveUrl: "https://inamullah06.github.io/Inrelligent-Weather/"
  },
  {
    id: "github-analytics",
    title: "GitHub Analytics Dashboard",
    type: "Data visualization",
    categories: ["Python"],
    description: "A Python-powered Streamlit dashboard for exploring public GitHub profile and repository data.",
    overview: "The dashboard turns public GitHub information into repository insights and interactive visualizations. The public documentation describes profile analysis, repository statistics, language analysis, and activity exploration.",
    features: ["Public GitHub profile and repository analysis", "Interactive charts and repository statistics", "Programming language and activity views"],
    stack: ["Python", "Streamlit", "Pandas", "Plotly", "GitHub REST API"],
    implementation: "The public repository includes app.py, analytics.py, github_client.py, requirements.txt, and tests for analytics and the GitHub client.",
    notes: "Detailed challenges and lessons learned have not been published yet. Displayed metrics depend on the public data returned by GitHub.",
    image: "assets/images/project-analytics.webp",
    repo: "https://github.com/inamullah06/GitHub-Analytics-Dashboard",
    liveUrl: "https://app-a-k5vf4n9fkvjz7qzfmpwbge.streamlit.app/"
  },
  {
    id: "speech-voice-detection",
    title: "Speech Voice Detection",
    type: "Exploratory application",
    categories: ["Flutter"],
    description: "An exploratory project focused on audio input, speech detection, and voice-signal analysis.",
    overview: "This repository documents an exploration of speech and voice detection. The project provides a foundation for learning about audio signals, speech processing, and possible future intelligent voice-based applications.",
    features: ["Audio input and speech-detection exploration", "Voice and audio signal analysis", "A foundation for further speech-processing work"],
    stack: ["Flutter", "Dart", "Audio processing"],
    implementation: "The public repository contains a Flutter project structure with lib, test, mobile, web, and desktop targets. Machine-learning integration is not claimed as implemented.",
    notes: "Detailed challenges and lessons learned have not been published yet.",
    image: "assets/images/project-speech.webp",
    repo: "https://github.com/inamullah06/Speech_Voice_Delect",
    liveUrl: "https://inamullah06.github.io/Speech_Voice_Delect/"
  }
];
