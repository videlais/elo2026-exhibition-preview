# Electronic Literature Collection — Exhibition App

A React single-page application for presenting an electronic literature exhibition. Works are described by two JSON data files (`works.json` and `about.json`) that are bundled at build time. The app pre-renders all routes to static HTML for SEO and fast first-paint, then hydrates on the client.

---

## Data Files

### `src/json/about.json`

Describes the exhibition itself. Fields consumed by the app:

| Field | Used in |
|---|---|
| `citation.exhibitionName` | Site `<title>`, header branding, work page meta tags |
| `citation.publicationYear` | Work citation cards |
| `citation.editors` | Work citation cards |
| `citation.publisher` | Work citation cards |
| `citation.language` | Work citation cards |
| `citation.ogType` | Open Graph meta tags |
| `citation.twitterCard` | Twitter/X card meta tags |
| `organizers.chair` | About page, header organizers line |
| `organizers.coChairs` | About page, header organizers line |
| `organizers.team` | About page |
| `statement.title` / `statement.paragraphs` | About page |
| `description` | Header subtitle |
| `licenses.entries` | About page software licenses section |

### `src/json/works.json`

An array of ELMS-format work records. Each record has the following structure:

**Identity / display**
- `id` — numeric work ID
- `slug` — URL-safe identifier (used in routes)
- `collectionSlug` — groups works into a collection (derived from `collectionInformation.collectionName`)
- `title` — work title
- `authorDisplayName` — primary creator display name (also derived from `entityInformation`)
- `collaborators` — secondary contributors
- `creatorBiography` — artist/author biography text
- `descriptionOfWork` — short work description
- `creatorNationality` / `geographicalOriginOfWork` — used in metadata card

**Nested sub-objects**
- `workInformation` — `{ workId, title, workDescription }` — canonical work identity
- `versionInformation` — `{ versionId, versionNumber, originalPublicationYear, genres, computerLanguages, languages, softwareDependencies, digitalQualities, rightsNotice }` — version and rights data; `genres` drives keyword filtering
- `exhibitionInformation` — `{ curatorialStatement, instructions, documentationLicense }` — curatorial and access content
- `entityInformation[]` — `{ entityName, role, primaryRole, ... }` — creators and contributors; primary role entity becomes `authorDisplayName`
- `copyInformation[]` — `{ copyId, originalUrl, hostedUrl, downloadLink, ... }` — access copies; first copy URL becomes the work's canonical `url`
- `accessibilityInformation` — `{ contentTiming, textFormat, colorAndContrast, visualImpact, auditory, touch, hapticFeedback, repetitiveMotion, movementAndGesture }` — accessibility metadata shown in the work detail accessibility card
- `aiInformation` — `{ aiUsedForAssets, aiUsedForCode, tools }` — AI disclosure
- `collectionInformation` — `{ collectionName, collectionDescription, startYearCollected, endYearCollected, responsibility, ... }` — collection-level metadata shown on collection landing pages

The `normalizeWorksDataset` adapter in `src/utils/elmsAdapters.ts` maps this nested structure to flat `Work` objects used throughout the app.

---

## Citation Style (CSL) Files

The citation widget on each work page renders APA, MLA, Chicago, and BibTeX bibliographies via [`@citation-js/core`](https://github.com/citation-js/citation-js). APA is bundled with `@citation-js/plugin-csl`; **MLA and Chicago templates are committed to the repo** under `src/citation/csl/` and imported as raw strings at build time (via Vite's `?raw` suffix). This avoids a runtime network call to `zotero.org` from every visitor.

Bundled files:

| File | Source |
|---|---|
| `src/citation/csl/modern-language-association.csl` | <https://www.zotero.org/styles/modern-language-association> |
| `src/citation/csl/chicago-author-date.csl` | <https://www.zotero.org/styles/chicago-author-date> |

**Re-pull for each new archive / exhibition cut.** CSL definitions evolve (slowly) as MLA/Chicago publish style updates. Before cutting a new archival build, refresh the local copies:

```sh
curl -sSfL https://www.zotero.org/styles/modern-language-association \
  -o src/citation/csl/modern-language-association.csl
curl -sSfL https://www.zotero.org/styles/chicago-author-date \
  -o src/citation/csl/chicago-author-date.csl
```

Then commit any resulting diff.

---

## Routes and Pages

| Route | Page | Description |
|---|---|---|
| `/` | `HomePage` | Gallery grid of all works as clickable cover tiles (shared `WorkGrid`) |
| `/search` | `SearchPage` | Free-text keyword search (title, description, author, genre, language) backed by the shared playlist filter engine; links through to the playlist builder to refine |
| `/playlist` | `PlaylistPage` | Build a shareable sub-gallery: free-text query plus include/exclude facet filters (works, genre, keyword, publication year, authoring platform, AI usage), all persisted in the URL |
| `/about` | `AboutPage` | Exhibition statement, organizer credits, software licenses |
| `/work/:workId` | `WorkPage` | Full work detail page |
| `/index` | — | Redirects to `/search` |

### Work detail page sections (`WorkPage`)

Each work page renders a card-based layout with:

- **TitleCard** — work title, author, cover image
- **TraversalCard** — access button that opens `WorkAccessModal` (video preview + begin links)
- **MetaDataCard** — year, format, language, platform, nationality, categories with navigation links
- **ArtistCard** — artist statement and biography
- **EditorialCard** — curatorial statement
- **AccessibilityCard** — structured accessibility information
- **DownloadsCard** — downloadable copies
- **LicenseCard** — work and documentation license badges
- **WorkHeadMeta** — `<head>` meta tags (Open Graph, Twitter card, canonical URL)

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server at `http://localhost:3000` |
| `npm run build` | Production client build to `build/` |
| `npm run build:ssr` | SSR bundle to `dist-ssr/` |
| `npm run prerender` | Pre-render all routes to static HTML in `build/` (requires client + SSR builds) |
| `npm run build:full` | Client build + SSR build + pre-render + cleanup |
| `npm run preview` | Serve the `build/` folder locally |
| `npm run test` | Run Vitest in watch mode |
| `npm run test:coverage` | Run Vitest with V8 coverage report |
| `npm run type-check` | TypeScript type check (no emit) |
| `npm run lint` | ESLint over `src/` |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run storybook` | Start Storybook dev server on port 6006 |
| `npm run all` | Lint + type-check + coverage (CI gate) |
| `npm run predeploy:gh` | Build with GitHub Pages base path (`/egg/`) |
| `npm run deploy:gh` | Push `build/` to `gh-pages` branch |

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_APP_BASE_PATH` | `/` | Base path for Vite builds and routing. Set to `/egg/` for GitHub Pages deployment. |

---

## Local CI with act

You can run GitHub Actions workflows locally with [`act`](https://github.com/nektos/act) without committing changes. An `.actrc` maps all matrix runners to a compatible Linux image.

```bash
# List available jobs
act -l

# Dry-run lint + unit
act pull_request -j lint-and-unit -n

# Execute lint + unit locally
act pull_request -j lint-and-unit

# Dry-run build
act pull_request -j build -n
```

> macOS/Windows runners are emulated via Linux containers when running locally; canonical cross-platform validation still comes from GitHub-hosted runners.

---

## Schema

`schema/elms-schema.json` is a JSON Schema definition for the ELMS work record format used in `works.json`. Use it to validate data or generate type stubs when updating the dataset.
