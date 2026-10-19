# Kollene Aika Leyson — Architecture Portfolio

- **Live Deployment (Vercel):** [https://kollene-architecture-portfolio.vercel.app](https://kollene-architecture-portfolio.vercel.app)
- **GitHub Repository:** [https://github.com/narcisoJavier/kollene-architecture-portfolio](https://github.com/narcisoJavier/kollene-architecture-portfolio)

A responsive editorial architecture portfolio built from `abou.pdf` (`SOURCE-NOTES.md` & `PORTFOLIO-PROMPT.md`) with native HTML, CSS, JavaScript, and local Three.js (`dist/assets/three.min.js`).

## Preview

Run `python -m http.server 4173 --directory dist` from this folder, then open http://localhost:4173.

## Content

Source: the supplied twenty-page `abou.pdf`. Project images and original presentation boards were extracted from that PDF and optimized as WebP. Project descriptions identify academic proposals and preserve the supplied collaboration credits. No software proficiency, professional experience, measured outcomes, or social links were invented.

Featured work is filtered by category. Native dialogs show case studies and all twenty original presentation boards. Contact uses the supplied email, phone, Instagram, and Facebook. The email-copy button reports clipboard failures accurately. Native dialogs provide keyboard focus management and Escape dismissal; motion respects reduced-motion preferences.

`PORTFOLIO-PROMPT.md` contains the tailored reusable brief. `.openai/hosting.json` records the private Sites project identity. `dist/` is the complete deployable website.

## Verification

Run `node check.cjs` while the preview server is running. This development check uses the bundled Playwright installation on the authoring machine. It verifies local assets, project filters and dialogs, original-board navigation, keyboard behavior, reduced-motion preferences, and desktop/mobile overflow. The site itself has no runtime dependencies.

Fonts: DM Sans and DM Serif Display, distributed under the SIL Open Font License (see `dist/assets/OFL-sans.txt` and `dist/assets/OFL-serif.txt`).
