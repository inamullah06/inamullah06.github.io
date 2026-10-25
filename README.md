# Inam Ullah — Developer Portfolio

A complete, responsive single-page developer portfolio built with semantic HTML, modern CSS, and vanilla JavaScript. There is no framework and no build step.

## Run locally

The simplest option is to open `index.html` directly. For the most reliable GitHub API and font behavior, serve the folder over HTTP:

```bash
cd portfolio
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Project structure

```text
portfolio/
├── index.html                 # All semantic page sections and SEO metadata
├── 404.html                   # Static-host 404 page
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── icons/favicon.svg
│   ├── images/                # Local WebP concept artwork and social preview
│   └── resume/                # Add the real resume PDF here
├── css/
│   ├── reset.css
│   ├── variables.css          # OKLCH design tokens
│   ├── layout.css
│   ├── components.css
│   ├── animations.css
│   └── responsive.css
└── js/
    ├── config.js              # Profile, integrations, skills, learning topics
    ├── projects.js            # Editable public-project content
    ├── navigation.js          # Mobile menu, scroll state, active section
    ├── animations.js          # IntersectionObserver reveals
    ├── github.js              # GitHub API, cache, and fallback states
    ├── contact.js             # Validation, service submission, mailto fallback
    └── main.js                # Rendering, filters, dialogs, resume behavior
```

All scripts are deferred and loaded in dependency order. Dynamic API content is inserted with `textContent`, not unsafe HTML.

## Update content

### Profile and skills

Edit `js/config.js` to change the email, social links, skills, learning topics, GitHub username, cache duration, or repository limit. The visible profile copy is intentionally easy to find in `index.html`.

### Projects

Edit the array in `js/projects.js`. Each project supports:

- `title`, `type`, `description`, and `overview`
- `categories` used by the filter buttons
- `features`, `stack`, `implementation`, and `notes`
- `image`, `repo`, and optional `liveUrl`

Leave `liveUrl` empty when no deployment exists; the live-demo action will not render. Do not add unverified features, statistics, dates, or links. Current artwork is conceptual and is labeled as such; replace it with real screenshots only when available, then update the image alternative text and artwork labels.

### Add a resume

1. Copy the real PDF to `assets/resume/inam-ullah-resume.pdf`.
2. In `js/config.js`, set:

```js
resumeUrl: "assets/resume/inam-ullah-resume.pdf",
```

Until then, resume buttons display an honest configuration notice and do not download a placeholder document.

## Contact form

### Default: email-app fallback

No service is configured by default. After validation, the form opens the visitor's email application with a prepared message. The page explicitly states that the message has **not** been sent; the visitor must send it from the email app.

### Optional: FormSubmit or a compatible endpoint

Set the public endpoint in `js/config.js`:

```js
formEndpoint: "https://formsubmit.co/your-real-endpoint",
```

Follow the provider's setup and activation instructions. The site sends `FormData` with an `Accept: application/json` header and displays success only for a successful HTTP response. Configure provider-side spam protection where available. A honeypot field is included as a basic additional safeguard. Never put private credentials in frontend JavaScript.

## GitHub integration

The page requests public repositories from the unauthenticated GitHub REST API and caches the sanitized results in LocalStorage for 30 minutes. Loading, empty, rate-limit, network-error, and cached states are handled. If the API cannot be used, the configured public projects are shown instead. No access token is required or included.

## SEO and deployment

Before deploying, replace `https://example.com/` in:

- the canonical link in `index.html`
- `robots.txt`
- `sitemap.xml`

Also update the Open Graph URL/image to absolute production URLs if required by the host or social platform.

### GitHub Pages

1. Create a public repository and upload this folder's contents to the default branch.
2. Open **Settings → Pages**.
3. Choose deployment from the default branch and root folder.
4. Save, wait for the deployment, and verify all sections and asset paths.
5. All asset paths are relative so the site can work from a project subpath.

### Other static hosts

Upload the project root as the publish directory. No install command or build command is required. Configure `404.html` as the host's not-found page if it is not detected automatically.

## Accessibility and motion

- Semantic landmarks, heading hierarchy, labels, and descriptive links
- Keyboard-operable navigation, filters, forms, and native accessible project dialogs
- Escape/backdrop dialog closing and focus restoration
- Visible focus indicators and 44px minimum interactive targets
- Reduced-motion support and non-JavaScript content fallbacks
- Responsive layouts from 320px upward, with safe-area spacing for fixed mobile controls

## Testing checklist

- [ ] Every navigation link scrolls to the correct section; active state updates.
- [ ] Mobile menu opens, closes after navigation, and closes with Escape.
- [ ] Project filters return the correct projects; the AI filter demonstrates the empty state.
- [ ] Project dialogs open, close with button/Escape/backdrop, and restore focus.
- [ ] Missing artwork falls back without a broken-image icon.
- [ ] GitHub loading, success, cache, empty, rate-limit, and offline fallback states work.
- [ ] Resume buttons show a notice until a real PDF is configured; then they download it.
- [ ] Contact validation identifies each invalid field and focuses the first one.
- [ ] Default contact mode never claims a message was sent.
- [ ] Configured contact mode shows success only after a successful service response.
- [ ] External links open the intended public profile or repository.
- [ ] No horizontal overflow at 320, 375, 430, 768, 1024, and 1440px.
- [ ] Keyboard focus is visible; reduced-motion mode removes nonessential motion.
- [ ] No console errors or missing local assets.

## External services and assets

- **Google Fonts:** Manrope and JetBrains Mono, both distributed under the SIL Open Font License. The site falls back to sans-serif/monospace if unavailable.
- **GitHub REST API:** optional, public, unauthenticated, with local fallback content.
- **Form service:** optional and unconfigured by default.
- **Artwork:** original locally generated WebP concept artwork; no third-party images or personal photograph are used.
