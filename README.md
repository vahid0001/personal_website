# Personal website — Vahid Reza Khazaie

A static portfolio site for an ML / AI engineer. No build step, no dependencies,
no framework — three files that any static host can serve.

```
index.html                          all content
assets/styles.css                   design tokens + layout (light & dark)
assets/main.js                      theme toggle, scroll reveal, nav state, publication expander
assets/Vahid-Reza-Khazaie-Resume.pdf
.nojekyll                           tells GitHub Pages to serve files as-is
```

## Hosting: GitHub Pages

This repo is set up for GitHub Pages, which is free, needs no account beyond
GitHub, and serves straight from a branch.

**Enable it:** repo → **Settings** → **Pages** → *Source: Deploy from a branch* →
pick the branch and the `/ (root)` folder → **Save**. The site is live in about
a minute.

### Which URL you get

| Repository name | URL |
| --- | --- |
| `personal_website` (current) | `https://vahid0001.github.io/personal_website/` |
| `vahid0001.github.io` | `https://vahid0001.github.io/` |

Renaming the repo to `vahid0001.github.io` is the cleaner option — it's a
one-click rename under **Settings → General**, GitHub redirects the old URL, and
nothing in this codebase needs to change (every path here is relative).

### Custom domain

If you buy a domain later (e.g. `vahidkhazaie.com`), add it under
**Settings → Pages → Custom domain**, point a `CNAME` DNS record at
`vahid0001.github.io`, and tick *Enforce HTTPS*. GitHub issues the certificate
for free.

## Working on it locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly with `file://` works too, but a local server
matches how it behaves once deployed.

## Updating content

Everything lives in `index.html` — there is no CMS or data file to keep in sync.

- **New publication** — copy an existing `<li class="pub">` block in the
  `#publications` section. Add `class="pub reveal is-more" hidden` if it should
  sit behind the *Show earlier publications* button.
- **New role** — copy a `<div class="tl-role">` block inside the relevant
  `<article class="tl-org">` in `#experience`.
- **New project** — copy an `<article class="card">` block in `#work`.
- **Résumé** — replace `assets/Vahid-Reza-Khazaie-Resume.pdf`, keeping the filename.

## Design notes

- Colours are CSS custom properties on `:root`, with a dark set under
  `:root[data-theme="dark"]`. Change `--accent` to reskin the site.
- The theme follows the operating system until a visitor clicks the toggle; that
  choice is then remembered in `localStorage`. An inline script in `<head>` applies
  it before first paint so dark-mode visitors never see a light flash.
- Reveal-on-scroll uses `IntersectionObserver` and is skipped entirely for
  visitors with `prefers-reduced-motion: reduce`.
- A print stylesheet strips the chrome so the page prints as a clean document.
