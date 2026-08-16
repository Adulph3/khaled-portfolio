# Security Policy

## Supported version

Security fixes are applied to the latest version on the default branch and to the currently deployed production build. Older commits, forks, and downloaded copies are not maintained.

## Reporting a vulnerability

Please report suspected security issues privately by email to [khaledhani.work@gmail.com](mailto:khaledhani.work@gmail.com) with the subject `Portfolio security report`.

Include the affected URL or commit, a concise reproduction, expected impact, and any suggested mitigation. Please do not publish exploit details or test against other users. This personal project does not promise a formal bounty or fixed response SLA, but good-faith reports will be reviewed and acknowledged when possible.

## Security assumptions

This project is a public, static frontend. Every file shipped to the browser must be treated as public. The design deliberately excludes a backend, database, authentication, user accounts, form submission, analytics, tracking, third-party scripts, secrets, private environment variables, and remote data APIs.

The site stores only the theme choice in local storage under `kh-theme`. It does not rely on cookies. Public profile links and a `mailto:` link leave the site by explicit user action. The hosting platform, DNS provider, source repository, CI system, browser, and linked third-party sites remain outside the application's trust boundary.

No static-site policy can guarantee permanent freedom from vulnerabilities. The release goal is a minimized attack surface with no known high or critical production dependency vulnerabilities at handoff.

## Static-site threat model

| Threat | Primary control | Residual consideration |
| --- | --- | --- |
| Supply-chain compromise | Minimal pinned dependencies, reviewed lockfile, `npm ci`, and production audit | Registry, maintainer, CI, and developer-account compromise remain possible |
| Cross-site scripting | React escaping, no HTML injection APIs, self-hosted scripts, strict CSP, no `eval` | A future unsafe component or incorrect CSP edit can reintroduce risk |
| Clickjacking | `frame-ancestors 'none'` and `X-Frame-Options: DENY` | Requires a host that preserves configured response headers |
| Data or privacy leakage | No analytics, cookies, backend, secrets, unintended private contact data, or external fetches | All committed frontend files and repository history are public |
| Malicious outbound navigation | Fixed HTTPS profile URLs and `noopener noreferrer` on new tabs | Destination sites have independent security and privacy policies |
| Mixed or downgraded transport | HTTPS hosting, HSTS, and `upgrade-insecure-requests` | First connection and custom-domain security depend on DNS and host configuration |
| Content or deployment tampering | Protected repository/hosting accounts, reviewed CI, and least privilege | Account takeover and compromised deployment credentials are operational risks |
| Denial of service | Small static assets and CDN hosting | Volumetric attacks are handled by the hosting provider |

There are no server-side authorization, session, payment, upload, or personal-data-processing flows in scope.

## Security headers

`vercel.json` applies the following production policy:

- `Content-Security-Policy` restricts content to the same origin, permits data URLs only for images/fonts, disallows objects, frames, form submission, inline style attributes, inline executable scripts, and dynamic evaluation, and prevents framing with `frame-ancestors 'none'`.
- The inline JSON-LD metadata block and the tiny no-flash theme bootstrap are each authorized by an exact SHA-256 hash. The bootstrap is kept minimal and parser-blocking so the correct persisted/system theme is applied before first paint without permitting arbitrary inline scripts.
- `X-Content-Type-Options: nosniff` prevents MIME sniffing.
- `X-Frame-Options: DENY` provides legacy clickjacking protection in addition to CSP.
- `Referrer-Policy: strict-origin-when-cross-origin` limits cross-origin referrer detail.
- `Permissions-Policy` disables browser capabilities the portfolio does not use while allowing same-origin clipboard writes for the copy-email control.
- `Strict-Transport-Security` asks supported browsers to use HTTPS for future visits.
- `Cross-Origin-Opener-Policy: same-origin` isolates the top-level browsing context.
- `X-XSS-Protection: 0` disables obsolete browser XSS filters that can introduce their own parsing issues; CSP is the modern control.

Both inline-script hashes in `vercel.json` must match the exact blocks in the generated `dist/index.html`, including whitespace. Follow the hash procedure in `README.md` after every JSON-LD, theme-bootstrap, or HTML transformation change. Never replace either hash with `unsafe-inline` or add `unsafe-eval`.

GitHub Pages does not allow repository-defined response headers. Deploy behind a host or edge layer that supports custom headers when the full policy is required.

## Dependency updates

Use a supported Node.js LTS release and keep the committed lockfile exact.

```bash
npm outdated
npm audit
npm audit --omit=dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Prefer small, reviewed updates. Read upstream changelogs, inspect `package-lock.json`, avoid automatic force fixes that introduce breaking major upgrades, and use `npm ci` in CI or clean verification environments. A development-only advisory still deserves triage even when the production audit is clean.

## Mandatory pre-commit and pre-push gate

Treat the working tree, every commit, and all reachable history as permanently public. Stop immediately if the directory is not a valid Git worktree or if any required check cannot be completed.

1. Run `git status --short --branch --untracked-files=all`, inspect tracked and untracked files, and list ignored files with `git ls-files --others --ignored --exclude-standard`.
2. Scan the working tree, ignored files, binary/archive contents, and all refs/history with a maintained secret scanner. Review every finding; never suppress a real credential.
3. Keep `.env` files, credentials, private keys, certificates, databases, backups, office lock files, all DOCX/PDF files, and the editable source CV outside Git. A redacted public PDF may ship only after explicit approval and a new full review.
4. Review `git diff --cached --check` and the complete `git diff --cached` immediately before committing. Repeat the secret scan against the final staged snapshot.
5. Confirm there are no first-party HTML injection APIs, dynamic code execution, unsafe remote scripts or URLs, and that every external `target="_blank"` link has `rel="noopener noreferrer"`.
6. Recompute both inline-script CSP hashes, confirm `unsafe-eval` and `unsafe-inline` are absent, and review every header in `vercel.json`.
7. Run `npm audit --omit=dev`, `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build`. Do not commit or push while a high or critical production advisory remains.
8. Do not use `npm audit fix --force`, automatic major-version upgrades, or automatic dependency merging. Review dependency and lockfile changes individually.

The GitHub security workflow repeats CodeQL, production dependency audit, and pull-request dependency review. Dependabot opens reviewable update pull requests; it does not merge them automatically. For a public GitHub repository, also keep the dependency graph, secret scanning, push protection, branch protection, and required security checks enabled in repository settings.

## Release and maintenance recommendations

- Require multi-factor authentication for source-control, DNS, and hosting accounts; use least-privilege deployment tokens and protected branches.
- Review the repository and its history before publishing. Never place private contact details, API keys, credentials, local paths, or `.env` files in tracked frontend content.
- Recalculate and test the CSP after changes to scripts, inline metadata, fonts, images, workers, forms, or remote origins.
- Verify response headers with browser developer tools or `curl -I` on the deployed HTTPS URL.
- Test the copy-email action, outbound links, both themes, the console, keyboard flow, reduced motion, and responsive layouts before each release.
- Re-run audits and browser tests on a regular schedule and when security advisories affect React, Vite, the build toolchain, or transitive dependencies.
- Rotate deployment credentials immediately after suspected exposure, revoke old sessions, inspect deployment history, and redeploy from a known-good commit.
