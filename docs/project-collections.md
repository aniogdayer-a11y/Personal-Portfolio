# Supplied project collections

The user provided `C:\Users\Yasy\Downloads\Graphic Designs` as their project source and authorized writing descriptions. All twelve supplied image files are represented across seven design collections:

1. AWS Student Builder Group — JRU: one UI/UX presentation.
2. EduFocus: one interface presentation for a full-stack study platform. Dayer confirmed responsibility for UI/UX design, front-end development, and back-end development with AI assistance; it is categorized under Web Development.
3. The Cloud Grand Prix: three distinct event artworks (announcement, registration reminder, and Reloaded). The visually duplicate Reloaded export is retained among the source assets but excluded from the public collection.
4. Zodiac Says: three social-media graphics.
5. BSIT & BSIT-BA Student Frames: one presentation board containing eight frame designs.
6. AWS SBG — Organization Flag: one flag artwork.
7. Five Days to Come: one countdown graphic.

The interactive portfolio itself is excluded from the project listing at the user's request. EduFocus is the only Web Development entry. Three supplied design projects are featured on the About page.

User-provided live links: AWS SBG–JRU at https://www.awssbgjru.me/ and EduFocus at https://edu-focus.infinityfreeapp.com/login. Their project detail pages expose “Visit live site” actions that open externally in a new tab with `noopener noreferrer`. The ID introduction remains available at `/home`.

Descriptions are based on the visible artwork, supplied filenames, and the user's confirmed contributions. AWS SBG–JRU is labelled as an interface showcase; EduFocus credits Dayer's confirmed full-stack development with AI assistance. Tags describe design focus or confirmed responsibilities; they do not assert a particular software stack. No clients, performance results, user research, deployment status, or implementation technologies were invented for the supplied work. GitHub and live-demo actions appear only when an actual link is available.

`tools/import-project-assets.ps1` copies source images byte-for-byte into `public/assets/projects/originals/` and verifies SHA-256 equality. `docs/project-assets.json` records each source filename, public path, dimensions, hash, and file sizes. Source files outside the repository are never modified.

High-quality JPEG previews (quality 92, longest edge up to 1600px, no cropping) are written under `public/assets/projects/previews/`. These reduce gallery transfer size from roughly 29.3MB of originals to 3.2MB of previews across all twelve files. The original 5875 × 3189 student-frame board is retained for close inspection. Project artwork was not edited with generative tools.

Every collection has an individual route, project-specific overview, design approach, deliverables, and complete-image previews. The full-size dialog loads original files on demand, supports previous/next artwork, original-size zoom with scrolling, Escape to close, and a direct original-file link. The native modal manages focus; page scrolling is restored on close.

The Projects page presents five Graphic Design collections (ten original artworks) in a horizontal showcase. Complete, uncropped cover images use open compositions with no artificial frames, surface fills, or shadows. Soft fades appear at scrollable edges. Desktop hover lifts and brightens the selected artwork; an IntersectionObserver reveals each collection as it enters view. The row accepts vertical mouse-wheel scrolling, native horizontal trackpad scrolling, mouse dragging, native touch swipes, arrow controls, a minimal range scrubber, and keyboard arrows/Home/End. A completed drag suppresses the resulting click. Reduced-motion preferences remove tilt, reveals, and animated scrolling.

AWS SBG — Recycled Booth is an additional Graphic Design project with its own editorial feature and detail route. The user's supplied description is preserved verbatim and attributes the recyclable-material booth, posters, newspaper-inspired layouts, branding, and decorations to the Creatives Team. The supplied 1536 × 2048 event photograph from `booth/73e958c2-1a0c-496a-84dd-82d652c26086.jpg` is copied byte-for-byte to `public/assets/projects/originals/aws-sbg-booth.jpg`; its source, dimensions, size, and SHA-256 are recorded in `booth-photo.json`. The feature uses a subtle CSS side fade. The detail page and full-resolution viewer preserve the entire original photograph without cropping, recompression, or generative alteration.

Manrope and Inter Latin variable WOFF2 files are hosted locally under `public/assets/fonts/` with their official SIL Open Font Licenses. The navbar uses larger text, a solid dark sticky header, full-height mobile navigation, keyboard focus wrapping and Escape dismissal, inert page/footer content while open, and a responsive reset that releases the page scroll lock when returning to desktop width.

Selecting a cover opens the shared original-image viewer with its collection title, category, description, and tools. Confirmed software names can be added to each project's optional `tools` array in `src/data/portfolioData.ts`; absent values display “Not specified.” Related artwork variants remain available through previous/next controls, and “View project details” opens the existing collection route. Category filters and search apply to both the showcase and the interface/development grid.

Verified in the local Chrome preview at desktop and mobile sizes: wheel/trackpad scrolling, mouse drag and click suppression, hover emphasis, arrows/range/keyboard navigation, filters and search, full-resolution modal metadata and collection navigation, focus and page-scroll restoration, 5875px original-size zoom, native touch swipe/tap, reduced motion, and page overflow. Production TypeScript/Vite build passed. Lint reports only the two existing hook warnings in `IdentityIntro.tsx`.

To re-import the supplied folder on Windows:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File tools/import-project-assets.ps1 -SourceRoot 'C:\Users\Yasy\Downloads\Graphic Designs'
```
