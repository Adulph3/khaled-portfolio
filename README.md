# Khaled Hani Bin Taleb — Portfolio

A production-oriented, single-page portfolio for a Computer Science student focused on IT infrastructure, networking, Linux systems, packet analysis, and server-client environments. The site is intentionally static: there is no backend, database, authentication, analytics, or visitor tracking.

## Preview

Run the local production preview, then open the URL printed by Vite:

```bash
npm install
npm run build
npm run preview
```

The social-sharing preview is available at `public/og-khaled-hani.png`. The Chromium screenshot case in the Playwright suite captures desktop dark, desktop light, mobile dark, and mobile-menu evidence in its test output.

## Technology stack

- React and TypeScript in strict mode
- Vite
- Tailwind CSS with CSS custom properties for design tokens
- Lucide React icons
- Vitest and React Testing Library
- Playwright and axe-core for browser and accessibility checks
- Static Vercel configuration with a restrictive Content Security Policy

## Local development

Requirements: a current Node.js LTS release and npm.

```bash
npm install
npm run dev
```

Vite prints the local development URL. No environment variables or external services are required.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
npm run preview
npm audit
npm audit --omit=dev
```

`npm run test:all` runs linting, type checking, unit tests, a production build, and the end-to-end suite in sequence. Install Playwright's local browser binaries once, if needed, with `npx playwright install`. On a supported Debian/Ubuntu CI host where installing system packages is permitted, `npx playwright install --with-deps` also installs the libraries required by Firefox and WebKit.

The production build is emitted to `dist/`. Vite disables production source maps for this project.

## Project structure

```text
.
├── e2e/                     # Playwright browser and responsive checks
├── public/                  # Reviewed metadata images and crawler files
├── src/
│   ├── assets/              # App-owned visual assets
│   ├── components/          # Reusable interface components
│   ├── data/portfolio.ts    # Typed portfolio content and profile links
│   ├── hooks/               # Theme, navigation, and viewport behavior
│   ├── sections/            # Semantic page sections
│   ├── styles/              # Tokens, global styles, and component styling
│   └── test/                # Test setup and component tests
├── index.html               # Metadata and JSON-LD
├── vercel.json              # Static deployment headers and caching
└── SECURITY.md              # Threat model and disclosure policy
```

Some directories are created only when they contain implementation or test files; use `src/data/portfolio.ts` as the primary content entry point.

## Updating portfolio content

- Edit personal details, navigation, skills, projects, labs, education, certifications, languages, and social links in `src/data/portfolio.ts`.
- Keep claims factual. Do not add repository, demo, credential, or employment links unless they are real and verified.
- When a project obtains a public repository, add an optional repository URL to its typed data record and render it with the same safe external-link behavior used for the profile links: a new tab plus `rel="noopener noreferrer"`.
- Do not add private contact details to client-side files. Everything in `src/`, `public/`, and `index.html` is publicly downloadable after deployment.

## Resume publication

The public site intentionally has no resume download until a redacted PDF is explicitly approved. All local DOCX and PDF files, including the editable source CV, are excluded from Git and must remain private. When a redacted PDF is approved, add a narrow exception for that exact file to `.gitignore`, review its text and metadata, add the download control, and rerun the full security and test gates. Never use `git add -f` to bypass the exclusion policy.

## Design customization

Color, spacing, radius, shadow, and typography tokens live in `src/styles/`. Change the CSS custom properties for both `[data-theme="dark"]` and `[data-theme="light"]` together so each theme remains complete. Keep focus indicators and text contrast at WCAG 2.2 AA or better. The small pre-render theme bootstrap is the `data-theme-bootstrap` script in `index.html`; it reads only the `kh-theme` preference. It is intentionally parser-blocking to prevent a theme flash and is authorized by an exact CSP hash rather than `unsafe-inline`.

## Canonical URL configuration

`https://example.com/` is an intentional deployment placeholder. Before publishing, replace it with the final HTTPS site origin, including the correct GitHub Pages repository path when applicable, in all of these locations:

- `index.html`: canonical link, `og:url`, absolute social image URLs, and the `Person`/`WebSite` JSON-LD URLs
- `public/robots.txt`: the `Sitemap` URL
- `public/sitemap.xml`: the page `<loc>` value

Use one consistent URL and trailing-slash convention. After changing the HTML or JSON-LD, rebuild and refresh both exact CSP hashes in `vercel.json`. Compute them from the built scripts, including their exact whitespace:

```bash
npm run build
node --input-type=module -e "import fs from 'node:fs'; import crypto from 'node:crypto'; const html=fs.readFileSync('dist/index.html','utf8'); const blocks=[['theme',/<script data-theme-bootstrap>([\\s\\S]*?)<\\/script>/],['json-ld',/<script type=\"application\\/ld\\+json\">([\\s\\S]*?)<\\/script>/]]; for(const [label,pattern] of blocks){const match=html.match(pattern); if(!match) throw new Error(label+' block not found'); console.log(label+': sha256-'+crypto.createHash('sha256').update(match[1]).digest('base64'))}"
```

Replace the matching theme-bootstrap and JSON-LD hash sources in `vercel.json` with the printed values. Rebuild once more and verify that both values remain unchanged before deploying. Do not add `unsafe-inline` or `unsafe-eval` to make a hash mismatch disappear.

## Deployment

### Vercel

1. Replace the canonical URL placeholder and finalize both inline-script hashes as described above.
2. Import the repository into Vercel and select the Vite framework preset.
3. Use `npm run build` as the build command and `dist` as the output directory. No environment variables are needed.
4. Deploy, then inspect the response headers and browser console. `vercel.json` supplies the CSP, clickjacking protection, privacy permissions, HSTS, and immutable caching for fingerprinted Vite assets.

The CSP hash must match the deployed `dist/index.html`; any later metadata edit requires a new hash.

### GitHub Pages

This repository currently uses a relative Vite asset base (`./`), which keeps this single-page build relocatable without guessing a repository name. Once the destination is known, Vite's documented GitHub Pages configuration is `base: '/'` for a user site or custom domain and `base: '/<repository>/'` for a project site. Either keep the tested relative base or set that exact known path in `vite.config.ts`; never commit a guessed repository name.

1. Replace the canonical placeholder with `https://<owner>.github.io/<repository>/` for a project site, or `https://<owner>.github.io/` for a user site.
2. Run `npm ci && npm run build` in a GitHub Actions workflow.
3. Run `actions/configure-pages`, upload only `dist/` with `actions/upload-pages-artifact`, then deploy it with `actions/deploy-pages`. Grant the workflow `contents: read`, `pages: write`, and `id-token: write` permissions and use the `github-pages` environment.
4. Keep `public/.nojekyll`; Vite copies it into `dist/` and prevents Jekyll processing.

GitHub Pages does not provide repository-controlled custom HTTP response headers. The application remains static and avoids arbitrary or unhashed inline executable code, but the full Vercel header policy cannot be enforced there. Use Vercel, Cloudflare, or another configurable edge host when strict response headers are a deployment requirement.

## Security

- No API keys, credentials, backend endpoints, analytics, cookies, remote scripts, or dynamic HTML injection are required.
- Theme preference is the only value stored locally, under `kh-theme`.
- External profile links must use `noopener noreferrer` when opening a new tab.
- `vercel.json` denies framing, plugins, unnecessary browser capabilities, inline style attributes, arbitrary inline executable scripts, and dynamic code evaluation.
- Run both `npm audit` and `npm audit --omit=dev` before releases, review the lockfile diff, and rebuild from a clean checkout.

See [SECURITY.md](SECURITY.md) for the supported version, static-site threat model, header rationale, disclosure channel, and maintenance checklist.

## Accessibility

The implementation targets WCAG 2.2 AA with semantic landmarks, logical headings, a skip link, visible keyboard focus, a focus-managed mobile menu, 44-pixel touch targets, accessible theme controls, live copy feedback, sufficient contrast, and reduced-motion behavior. Treat automated axe checks as a baseline; manually test keyboard order, focus return, zoom/reflow, both themes, and screen-reader names before each release.

## Performance goals

The release target is 95 or higher for Lighthouse Performance, Accessibility, Best Practices, and SEO. Preserve the static architecture, self-hosted assets, production source-map setting, stable media dimensions, restrained animation, and minimal dependencies. Re-run Lighthouse on the deployed HTTPS origin because local and hosted results can differ.

## Maintenance checklist

1. Review portfolio facts, availability, graduation date, and links.
2. Run `npm outdated`, then apply dependency updates in small reviewed groups.
3. Run lint, type checking, unit tests, browser tests, production build, and both npm audits.
4. Verify the CSP after any HTML, script, font, or asset-source change.
5. Test dark and light themes at 320, 375, 390, 768, 1024, 1280, and 1440 pixels with no horizontal overflow.
6. Check keyboard navigation, reduced motion, external links, the console, metadata, `robots.txt`, and `sitemap.xml` on the deployed origin.
7. Review Lighthouse results and response headers before promoting the release.
