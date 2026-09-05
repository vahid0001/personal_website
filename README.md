# Personal website — Vahid Reza Khazaie

A static portfolio site for an ML / AI engineer. No build step, no dependencies,
no framework — three files that any static host can serve.

```
index.html            all content
assets/styles.css     design tokens + layout (light & dark)
assets/main.js        theme toggle, scroll reveal, nav state, publication expander, contact form
.nojekyll             tells GitHub Pages to serve files as-is
```

No email address, phone number, or résumé PDF appears anywhere in the source.
Visitors reach out through the contact form, and the form provider holds the
destination address privately.

## 1. Connect the contact form

The form posts to [Formspree](https://formspree.io), which forwards submissions
to your inbox without your address ever appearing in the page. Free tier: 50
submissions a month.

1. Sign up at formspree.io with the email you want messages delivered to.
2. Create a new form. You'll get an endpoint like `https://formspree.io/f/xyzabcde`.
3. In `assets/main.js`, replace the placeholder:

   ```js
   var FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
   ```

4. Commit and push.

Until you do this the form validates input normally but shows a message pointing
visitors to LinkedIn instead of failing silently.

Formspree's dashboard has reCAPTCHA and spam filtering if the honeypot field
already in the form isn't enough. [Web3Forms](https://web3forms.com) is a drop-in
alternative with unlimited submissions if you outgrow the free tier — same
approach, different endpoint.

## 2. Publish on GitHub Pages

Free, no build minutes, and it serves straight from a branch.

**Enable it:** repo → **Settings** → **Pages** → *Source: Deploy from a branch* →
pick the branch and the `/ (root)` folder → **Save**. Live in about a minute.

### Getting your full name into the URL

The URL comes from your GitHub **username**, not the repository name. A repo
named `<username>.github.io` is served at the root of that username's domain:

| GitHub username | Repository name | Resulting URL |
| --- | --- | --- |
| `vahid0001` | `personal_website` | `vahid0001.github.io/personal_website/` |
| `vahid0001` | `vahid0001.github.io` | `vahid0001.github.io/` |
| `vahidrezakhazaie` | `vahidrezakhazaie.github.io` | `vahidrezakhazaie.github.io/` |

So a full-name URL means renaming the **account** under
**Settings → Account → Change username**, then naming the repo to match. GitHub
redirects your old profile and repo links, though any hardcoded links others
have to your old username eventually go stale.

A custom domain avoids the username question entirely and reads better on a
résumé: buy `vahidrezakhazaie.com` (roughly $10–15/year), add it under
**Settings → Pages → Custom domain**, point a DNS `CNAME` record at
`<username>.github.io`, and tick *Enforce HTTPS*. GitHub issues the certificate
free.

Nothing in this codebase depends on the name either way — every path is relative.

## Working on it locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Updating content

Everything lives in `index.html` — there is no CMS or data file to keep in sync.

- **New publication** — copy an existing `<li class="pub">` block in the
  `#publications` section. Add `class="pub reveal is-more" hidden` if it should
  sit behind the *Show earlier publications* button. The `<ul class="pub-links">`
  row holds the arXiv / Code / DOI chips; drop the whole `<ul>` if there's no link yet.
- **New role** — copy a `<div class="tl-role">` block inside the relevant
  `<article class="tl-org">` in `#experience`.
- **New project** — copy an `<article class="card">` block in `#work`. Its
  `<ul class="card-links">` row holds the repo and paper links.

## Design notes

- Colours are CSS custom properties on `:root`, with a dark set under
  `:root[data-theme="dark"]`. Change `--accent` to reskin the site.
- The theme follows the operating system until a visitor clicks the toggle; that
  choice is then remembered in `localStorage`. An inline script in `<head>` applies
  it before first paint so dark-mode visitors never see a light flash.
- Reveal-on-scroll uses `IntersectionObserver` and is skipped entirely for
  visitors with `prefers-reduced-motion: reduce`.
- A print stylesheet strips the chrome so the page prints as a clean document.
