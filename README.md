# sheets.ch

[![Static validation](https://github.com/cjsheets/sheets.ch/actions/workflows/static-validation.yml/badge.svg)](https://github.com/cjsheets/sheets.ch/actions/workflows/static-validation.yml)
[![Browser validation](https://github.com/cjsheets/sheets.ch/actions/workflows/browser-validation.yml/badge.svg)](https://github.com/cjsheets/sheets.ch/actions/workflows/browser-validation.yml)

Source for [sheets.ch](https://sheets.ch), a personal site and technical notebook built with Astro.

## Quality gates

Every pull request must pass two focused checks before it can merge:

- **Static validation** installs the locked dependency graph, verifies formatting, runs Astro and TypeScript diagnostics, and produces the deployable site.
- **Browser validation • Chromium** crawls every discoverable public route, verifies page metadata and responsive containment, exercises the sticky article header and table of contents, and compares seven targeted visual baselines.

The visual suite protects reusable layouts and interaction states instead of snapshotting every article. Recent post and project labels on the home page are replaced with fixed representative strings before screenshots are captured; separate browser assertions validate the real links and ordering. This keeps content additions from causing irrelevant image churn while retaining meaningful layout coverage.

The committed visual scenarios are:

1. Home at desktop and mobile widths.
2. Resume at its mobile breakpoint.
3. A representative code-heavy article at desktop and mobile widths.
4. The article after scrolling, including its compact header and active table of contents.
5. The representative article in dark mode.

Failed browser runs retain the Playwright report, trace, and image differences as a short-lived GitHub Actions artifact. Visual baselines are never updated automatically.

## Local validation

Install dependencies and the Chromium runtime once:

```sh
npm ci
npx playwright install chromium
```

Run the same validation used by pull requests:

```sh
npm run validate
```

When an intentional visual change has been reviewed, regenerate the baselines with:

```sh
npm run test:browser:update
```

Screenshot rendering varies by operating system, so baselines are stored separately by platform. Linux is authoritative for GitHub Actions; macOS baselines keep the same visual checks useful during local development.
