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

## Architecture

Single-page site (`index.html`) with anchor-linked sections, styled by one stylesheet
(`css/style.css`) and one script (`js/script.js`). No routing, no components, no templating.

- **`index.html`** — all content lives here, in order: hero, about, certs, projects, experience, skills,
  github, an interactive terminal easter egg, contact. Content is hand-authored from Navkirat's resume
  (`assets/Navkirat_Wander_Resume.pdf`, also linked as the downloadable resume button) — there is no CMS
  or data file; updating content means editing the HTML directly.
- **`css/style.css`** — design tokens live in `:root` at the top (colors, font, spacing). The whole site
  is a dark "terminal" aesthetic: monospace type (JetBrains Mono), a reusable `.terminal-window` component
  (titlebar dots + body) used for the hero, the about section, the GitHub stats panel, and the interactive
  terminal. `.reveal` / `.reveal.in` classes drive scroll-triggered fade-ins via an IntersectionObserver in
  the JS. Responsive breakpoints at 860px and 720px.
- **`js/script.js`** — four independent behaviors, no shared state between them: (1) hero typewriter effect
  that types into `#heroTyped`, (2) `IntersectionObserver`-based scroll reveal for `.reveal` elements,
  (3) a client-side fetch to `api.github.com/users/Navkirat1` that renders live stats into `#githubStats`
  (has a fallback message if the fetch fails), (4) an interactive terminal (`#termInput`/`#termOutput`)
  with a `commands` object dispatch table — commands either print text or `scrollToSection(id)`. User input
  is escaped via `escapeHtml()` before being echoed back, since it's rendered with `innerHTML`.
- Terminal-style text blocks (e.g. `.static-body`, the github stats template literal) must **not** have
  literal newlines between `<span>` elements in the source — the spans are `display: block` and rely on
  that for line breaks; an extra literal newline renders as a visible blank line (pre-wrap + block spans
  double up). Keep those blocks on one line when editing.

## Deployment

- GitHub repo: `Navkirat1/navkiratwander.dev` (public — required for GitHub Pages on a free account, and
  also fine since there's nothing sensitive in the repo: no secrets, no backend, and the resume's contact
  info is already shown live on the site itself).
- Served via **GitHub Pages** from the `main` branch, root path. A `CNAME` file at repo root
  (`navkiratwander.dev`) points Pages at the custom domain.
- DNS is managed at **Porkbun** (Cloudflare-powered DNS panel there): 4 `A` records on the apex (`@`) to
  GitHub Pages' IPs (185.199.108/109/110/111.153), plus a `CNAME` for `www` → `navkirat1.github.io`.
- `gh` CLI is already authenticated locally as `Navkirat1` — use `gh api repos/Navkirat1/navkiratwander.dev/pages`
  to check Pages/HTTPS status, and `gh api -X PUT ... -f https_enforced=true` to toggle HTTPS enforcement
  once GitHub has issued the custom-domain TLS cert (this is automatic on GitHub's side but not instant —
  can take anywhere from minutes to a few hours after DNS propagates).

## Ongoing goals for this project

This is a living project, not a one-off — Navkirat plans to keep iterating: refining the look, adding more
content/projects/certs over time, fixing bugs, and improving layout across device sizes (regular mobile,
foldables, tablet, desktop). When making changes, verify responsively rather than assuming — the site has
already been checked at desktop and mobile (375px) widths with the Browser pane tool; re-check affected
breakpoints after layout changes, including unusually narrow/wide viewports for foldable phones.

## Known open item

The Projects section (Secure Discord Automation Bot, HTB pentesting labs, Cyber Strike Challenge) is
written as case-study text rather than linking to live repos, because Navkirat's real project code isn't
pushed publicly yet (GitHub `Navkirat1` currently only has git-practice tutorial repos). Revisit this if/when
that code gets pushed — the Discord bot in particular would be worth linking to once sanitized.
