# Source Organization (DE/EN)

This project now uses a **source vs output** structure and has started a **single-template + locale JSON** migration.

## Source of truth

### Template + i18n (Phase 1 + Phase 2)

- `src/templates/nav.template.html`: shared bilingual navigation template
- `src/templates/index.template.html`: shared home page template
- `src/templates/subpage.template.html`: shared shell for non-home pages
- `src/i18n/de.json`: German locale content for home page
- `src/i18n/en.json`: English locale content for home page
- `src/content/de/*.html`: German content fragments for subpages
- `src/content/en/*.html`: English content fragments for subpages

### Direct HTML sources (currently still used for non-home pages)

- `src/shared/nav.html`: shared bilingual navigation
- `src/de/index.html`: German home page (root output)
- `src/de/pages/*.html`: German secondary pages (output to `deutsch/`)
- `src/en/pages/*.html`: English pages (output to `english/`)

## Runtime output

- `nav.html`
- `index.html`
- `deutsch/**`
- `english/**`

These files are generated from `src/**` by build script.

At the moment:

- `index.html` and `english/index_en.html` are rendered from `src/templates/index.template.html` + locale JSON.
- Main subpages are rendered from `src/templates/subpage.template.html` + locale JSON + content fragments:
	- `deutsch/angebote.html`, `deutsch/event.html`, `deutsch/firmen.html`, `deutsch/ueber_mich.html`, `deutsch/impressum_datenschutz.html`
	- `english/angebote_en.html`, `english/event_en.html`, `english/firmen_en.html`, `english/ueber_mich_en.html`, `english/impressum_datenschutz_en.html`
- `nav.html` is published from `src/templates/nav.template.html`.

## Commands

PowerShell (works without Node/npm):

- `powershell -ExecutionPolicy Bypass -File .\\scripts\\build-site.ps1`
- `powershell -ExecutionPolicy Bypass -File .\\scripts\\build-site.ps1 --clean`

Node/npm (optional, if installed):

- `npm run build`
- `npm run build:clean`

## Recommended workflow

1. Edit templates/locales (`src/templates/**`, `src/i18n/**`) and content fragments (`src/content/**`) for migrated pages.
2. Edit direct source HTML under `src/de/pages/**` and `src/en/pages/**` for non-migrated pages.
3. Run build:
	- `powershell -ExecutionPolicy Bypass -File .\\scripts\\build-site.ps1`
4. Test site behavior.

This keeps language versions organized and prevents accidental drift in production folders.
