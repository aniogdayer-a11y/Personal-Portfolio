# Dayer Aniog — Interactive ID Portfolio

A React + TypeScript portfolio featuring a JRU ID and navy/gold lanyard, constrained spring physics, pull-and-release entry, and a soft white-light transition that preserves the black theme. The interface uses Manrope headings, Inter body text, and the requested #0A0A0A / #111111 / #171717 palette.

## Run

```sh
npm install
npm run dev
npm run build
npm test
```

On Windows PowerShell with script execution disabled, use `npm.cmd` in place of `npm`.

On Windows, double-click `START-PORTFOLIO.cmd` to start the preview. Keep that terminal window open while browsing. Both `http://localhost:5173` and `http://127.0.0.1:5173` use the same server. If either refuses the connection, start the server again. Port 5173 is fixed; Vite reports a conflict instead of silently switching ports.

## Edit content

The header's sun/moon button switches between dark (default) and light mode. The choice is saved locally and restored before the application renders. Theme tokens and light-mode styles are in `src/theme.css`; artwork colors remain original. The Home greeting types once on entry, with reserved space and a complete accessible heading for screen readers.

Update `src/data/portfolioData.ts`. It contains public contact details, project records, skills, certificates, and milestones. Nine unique projects appear across Design, Web Development, and Graphic Design. EduFocus belongs to both Design and Web Development. The Last Ember is the third Design entry, credited as collaborative map-design support in Tiled. See `docs/tiled-project-and-loading.md` for its media provenance.

The résumé download is enabled on About and Contact. The original `Resume/RESUME Dayer.pdf` is copied unchanged to `public/assets/dayer-aniog-resume.pdf`; replace that public PDF when updating the résumé.

## Routes

`/` and `/home` are the interactive Home page. `/about`, `/profile` (About alias), `/projects`, `/projects/:id`, `/skills`, `/certifications`, `/experience`, and `/contact` are independently addressable client routes. Direct page links bypass the intro. Select Home to return to the ID interaction. The Last Ember detail page is `/projects/the-last-ember`.

## Architecture

- `src/components/IdentityIntro.tsx`: pointer capture, responsive suspension geometry, lanyard rendering, switch detection, typing greeting, entrance transition.
- `src/utils/physics.ts`: constrained drag mapping and fixed-substep damped spring simulation.
- `src/components/PortfolioPages.tsx`: individual page views and reusable content components.
- `src/App.tsx`: history-based routing, shared navigation, session state, motion preferences.
- `src/index.css`: responsive visual system and motion accommodations.

The card pivots at the buckle; two lanyard ribbons terminate at that attachment point. Mouse and touch pulls must exceed 80 physical pixels and then release; small and sideways gestures do not activate entry. Pointer cancellation disarms the switch. Enter/Space on the ID and the “About Me” button provide alternatives. Sound defaults off.

## Verification

`npm test` runs six physics checks. `node --test tests/*.test.mjs` also checks project membership, search, and contribution attribution. `npm run test:browser` connects to a local Chrome DevTools endpoint on port 9225 and a dev server on port 5173. It verifies asset resolution, attachment geometry, dragging, page routing, browser history, direct links, phone layouts, touch, keyboard entry, and explicit effects pause. Screenshots are written under ignored `tmp/qa/`.

Assets and their preparation are documented in `docs/asset-notes.md`. Built output is in `dist/`. Hosting identity is in `.openai/hosting.json`.
