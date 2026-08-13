# Khaemenes High School Modernization v3

Replace the root `index.html` in:

`vervenveda/Khaemenes_High.github.io`

with the included:

`Khaemenes_High.github.io/index.html`

## What changed

- Adopts the current Verve N Veda gateway shell:
  - 36px network ticker
  - 72px light sticky header
  - compact centered navigation
  - 7px controls
- Preserves the existing local storage keys:
  - `khaemenes-high-profile-v1`
  - `khaemenes-high-pinned-courses-v2`
  - `khaemenes-high-resource-favorites-v2`
- Preserves the central family registry + High School bridge.
- Preserves PWA install/service-worker behavior.
- Keeps existing Grade 9–12 course links and department routes.
- Expands course pinning beyond Grade 9 so Grade 10–12 cards can also be pinned.
- Makes Career a permanent header, ticker, senior-year, department, transition, and footer destination.
- Adds a direct transition to Khaemenes Higher Learning.
- Integrates PE, Health & Wellness, federated electives, and Career natively.
- Removes the need for the old `data/repair08b-health-federation.js` append-at-runtime patch on this page.
- Replaces the giant manually maintained resource array with the central federation:
  `https://vervenveda.com/assessment-engine/mentor/registry/ecosystem-resources.json`
- Includes a small core fallback resource set if the registry cannot load.
- Exposes a read-only browser API:
  - `KhaemenesHighDirectoryAGI.all()`
  - `KhaemenesHighDirectoryAGI.find(term)`
  - `KhaemenesHighDirectoryAGI.resolve(name)`
  - `KhaemenesHighDirectoryAGI.categories()`
  - `KhaemenesHighDirectoryAGI.summary()`
  - `KhaemenesHighDirectoryAGI.refresh()`

## Important

The existing `data/repair08b-health-federation.js` file may remain in the repository.
The new `index.html` simply does not import it because its useful routes are now native.

No other High School files need to be deleted.

## Link correction discovered during modernization

The previous homepage linked Grade 10 Mathematics to `courses/mathematics/grade-10/index.html`, which does not exist. The modernized page points Grade 10 to the verified `courses/mathematics/algebra-1/index.html` portal instead.
