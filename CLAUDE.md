# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Navkirat Wander's personal portfolio site, served at `navkiratwander.dev`. Plain static HTML/CSS/JS —
no framework, no build step, no package.json, no dependencies. Everything is hand-written and meant to
stay that way; don't introduce a bundler/framework unless explicitly asked.

## Commands

There is no build/lint/test tooling — it's static files served as-is.

- **Local preview**: a dev server config already exists at `.claude/launch.json` (name `"site"`, python
  `http.server` on port 8811). Use the `preview_start` tool with name `"site"`, or manually:
  `python3 -m http.server 8811`
- **Deploy**: pushing to `main` on GitHub auto-publishes via GitHub Pages (see Deployment below). There is
  no separate build/deploy command — the repo *is* the deployed output.

## Design direction

The site went through a full rebrand (2026-09-13): from a "terminal/hacker" aesthetic to a professional
"enterprise cybersecurity & software developer" look aimed at corporate recruiters. This is the current,
intended direction — don't revert toward the old terminal-everywhere look without being asked.

- **Typography**: sans-serif (Inter) for all headings, nav, and body copy. Monospace (JetBrains Mono) is
  **scoped only** to: the interactive terminal component, technical tag/pill chips (`.tag`), and the cert
  icon initials. Don't spread monospace back into headings or prose.
- **Palette**: dark slate/charcoal (`--bg`, `--panel` tokens in `css/style.css`), white/near-white text,
  electric blue accent (`--accent`) as primary, teal (`--teal`) as a secondary/"earned" accent, red
  (`--danger`) reserved for the terminal's permission-denied state. All tokens live in `:root` at the top
  of `css/style.css`.
- **Cards over ASCII**: certifications, projects, GitHub stats, and the "coursework" panel are all clean
  card/tile components now (`.cert-card`, `.project-card`, `.stat-tile`, `.panel-card`) — not simulated
  terminal/log output. Only the actual `#term` section terminal keeps the retro chrome.

## Architecture

Single-page site (`index.html`) with anchor-linked sections, styled by one stylesheet
(`css/style.css`) and one script (`js/script.js`). No routing, no components, no templating.

- **`index.html`** — content order: hero, about, certs, projects, experience, skills, github, interactive
  terminal, contact, plus a hidden cert-verification modal at the end of `<body>`. Content is hand-authored
  from Navkirat's resume (`assets/Navkirat_Wander_Resume.pdf`, also linked as the downloadable resume
  button) — there is no CMS or data file; updating content means editing the HTML directly.
- **`css/style.css`** — design tokens in `:root` (see Design direction above). `.reveal` / `.reveal.in`
  classes drive scroll-triggered fade-ins via an IntersectionObserver in the JS. Responsive breakpoints at
  860px, 720px, and 340px (checked down to 280px wide for foldable-phone widths — nothing should overflow
  or clip below that).
- **`js/script.js`** — independent behaviors, no shared state between them:
  1. `IntersectionObserver`-based scroll reveal for `.reveal` elements.
  2. A client-side fetch to `api.github.com/users/Navkirat1` that renders live stats as tiles into
     `#githubStats` (has a fallback message if the fetch fails).
  3. **Cert verification modal**: `certData` object keyed by cert id (`google`, `securityplus`), each with
     a `verifyUrl`. Clicking a `[data-cert]` button calls `openCertModal(id)` — if `verifyUrl` is set, it
     opens that link directly in a new tab (`window.open`); if empty, it opens the in-page modal showing
     issuer/date/description instead, with a note that a public link is "coming soon." Currently both
     Google Cybersecurity Professional Certificate and CompTIA Security+ have real `verifyUrl`s set
     (Coursera share link and Credly public badge URL respectively), so they link out — the modal fallback
     path still exists in code for any future cert added without a link yet (e.g. Microsoft SC-900, which
     has no verify button at all since it isn't earned yet — just an "In Progress" badge + progress bar).
  4. An interactive terminal (`#termInput`/`#termOutput`) with a `commands` object dispatch table —
     commands either print text or `scrollToSection(id)`. A separate `privilegedCommands` check
     (`sudo`/`su`/`root`/`admin`) short-circuits before the dispatch table and always prints a styled
     "Permission Denied" message (`.danger` class, red) rather than executing anything. User input is
     escaped via `escapeHtml()` before being echoed back, since it's rendered with `innerHTML`.
- Card/tile markup (project cards, cert cards, stat tiles) is normal block-level HTML — no whitespace
  gotchas there. The one place that still matters: if new monospace terminal-style text blocks are added
  inside `.terminal-body`, don't put literal newlines between `<span>` elements — those spans are
  `display: block`, and `white-space: pre-wrap` on the parent turns a stray newline into a visible blank
  line. Keep such blocks on one line when editing.

## Deployment

- GitHub repo: `Navkirat1/navkiratwander.dev` (public — required for GitHub Pages on a free account, and
  also fine since there's nothing sensitive in the repo: no secrets, no backend, and the resume's contact
  info is already shown live on the site itself).
- Served via **GitHub Pages** from the `main` branch, root path. A `CNAME` file at repo root
  (`navkiratwander.dev`) points Pages at the custom domain.
- DNS is managed at **Porkbun** (Cloudflare-powered DNS panel there): 4 `A` records on the apex (`@`) to
  GitHub Pages' IPs (185.199.108/109/110/111.153), plus a `CNAME` for `www` → `navkirat1.github.io`.
- HTTPS is fully live and enforced (`https_enforced: true`). `gh` CLI is authenticated locally as
  `Navkirat1` — use `gh api repos/Navkirat1/navkiratwander.dev/pages` to check Pages/HTTPS status. If the
  custom domain or DNS ever changes, re-provisioning the cert can take anywhere from minutes to about an
  hour; clearing and re-setting the `cname` field via the API (`PUT .../pages -f cname=`) forces GitHub to
  restart cert issuance if it seems stuck.

## Ongoing goals for this project

This is a living project, not a one-off — Navkirat plans to keep iterating: refining the look, adding more
content/projects/certs over time, fixing bugs, and improving layout across device sizes (regular mobile,
foldables, tablet, desktop). Verify responsively rather than assuming — check both the standard 375px
mobile width and something narrower (~280px, for foldables) after layout changes, in addition to desktop.

## Known open items

- **HayuuugeBot** (the Python/Discord/SQLite/RBAC project) was **removed** from the Projects section
  (2026-09-13) — the local project files were lost, so the card was pulled rather than link to a repo that
  no longer exists. Navkirat plans to build a new project to fill this slot; add it as a fresh card when
  ready rather than reviving the HayuuugeBot content, since it no longer reflects real, existing work.
- **Microsoft SC-900** is in-progress (not yet earned) — no verify button, just a status badge + progress
  bar. Once earned, give it a proper "Earned" cert-card treatment matching Google/Security+, with a real
  verify link if one exists (Microsoft Learn / Credly).
- Two other projects from an earlier draft of this redesign — "Nexus" (university coursework, cloud
  companion-robot management system) and a C++ e-commerce OOP project — were explicitly **dropped** by
  Navkirat and should not be re-added without being asked again.
