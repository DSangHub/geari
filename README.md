# GEARI

**Every shift. Scored.** — [geari.app](https://geari.app)

Landing page and product spec for a manual-transmission driving score app. The phone pairs with the vehicle computer (OBD-II / CAN / OBDBr / EOBD / JOBD / KOBD / China 6 / BS-VI). Every gear change is logged. Smooth shifts, lane changes, and braking earn points. Rideshare drivers get an independent rating the platforms do not own.

## Live

- Site: [https://dsanghub.github.io/geari/](https://dsanghub.github.io/geari/)
- Repo: [https://github.com/DSangHub/geari](https://github.com/DSangHub/geari)

If Pages is not live yet: **Settings → Pages → Source = GitHub Actions**. The workflow in `.github/workflows/pages.yml` deploys `main`.

Open [`index.html`](index.html) locally in a browser. No build step.

## What is on the page

- Live trip HUD (simulated RPM, speed, gear, shift log)
- Connect your car — 16-pin diagram, adapter allow-list, South America / Far East OBD matrix
- Scoring table (explainable points)
- Safe-arrival commute planner (work address first-class)
- Independent rideshare profile mock
- Language toggle: English, Español, हिन्दी, اردو (RTL), ਪੰਜਾਬੀ, Tagalog, ไทย

## Files

| File | What it is |
|---|---|
| `index.html` | Full product site |
| `style.css` | Theme, HUD, matrix, RTL |
| `app.js` | HUD sim, region filter, planner, i18n apply |
| `i18n.js` | `I18N` root object |
| `i18n-en.js` … `i18n-th.js` | Per-language strings |
| `PRODUCT.md` | Scoring rules, backend, hardware, market matrix |
| `.github/workflows/pages.yml` | GitHub Pages deploy |

Concept only. Not a certified telematics device.
