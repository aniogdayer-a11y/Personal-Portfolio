# Creative toolkit and artwork motion

The profile and Skills page list the user's confirmed tools: Canva, Picsart, Figma, ibisPaint, Photoshop, and Tiled. These are general toolkit entries; software is not attributed to individual projects without confirmation.

The portrait uses six labeled, keyboard-accessible floating icons, anchored outside the face. A pause/resume control and the reduced-motion preference stop the float. Selecting an icon jumps to the visible toolkit. The gallery now layers actual secondary campaign artworks behind each collection cover, with a small fan-out on hover or keyboard focus. Originals and the full-resolution viewer are unchanged.

Reference direction: the supplied profile JPG and two MP4s in `references/` were inspected locally. Floating tools, layered compositions, and editorial artwork presentation were adapted to the existing black palette. Reference videos are not shipped as website media.

## Icon sources

- Canva, Figma, Photoshop: Simple Icons v11 SVGs from `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/` (`canva.svg`, `figma.svg`, `adobephotoshop.svg`). Brand marks belong to their respective owners.
- Picsart: official website favicon, `https://cdn-cms-uploads.picsart.com/cms-uploads/8cf1cbff-3ab9-4b27-b012-688bbbb181e5.svg`.
- ibisPaint: official high-resolution touch icon, `https://ibispaint.com/img/touch-icon.png`.
- Tiled: official repository, `https://raw.githubusercontent.com/mapeditor/tiled/master/snap/gui/tiled.png`.

All icons are self-hosted. CSS provides presentation and color treatment; image and artwork files are not AI-generated.

## Reference transition refinement

Removed the header replay/reset control at the user's request. Home and the footer introduction link remain available. Updated the navigation browser check to use Home.

Campaign covers crossfade between the real artwork exports every four seconds, with a 1.05-second dissolve. A labeled pause/play control manages previews. Timers run only while the poster is visible, the document is visible, no artwork viewer is open, and the gallery is not being dragged. Reduced-motion preference disables autoplay and dissolves. Failed or unloaded images are not selected. The gallery does not auto-scroll.

Section entrances use restrained directional movement and image reveals, inspired by the supplied video references. Tool tiles have CSS bevels, directional lighting, depth shadows, and perspective; the underlying marks remain sharp. Figma uses the full-color vector at https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg. Other icon sources remain as documented above. This is a CSS dimensional treatment, not fabricated 3D geometry or a claim to upscale original artwork.

## Luminous app icon refinement

Following the supplied creative-portfolio reference, the six portrait icons now use larger glossy faces, brighter beveled rims, thicker extruded edges, and brand-colored ambient halos. Figma uses a porcelain-white face; Canva uses a teal/blue glass face; the other tools retain their recognizable source marks over coordinated darker faces. Logos remain sharp above the illuminated surfaces. Hover/focus strengthens the glow and lifts the icon. The 390/320px treatment reduces size and halo spread to preserve the portrait and prevent page overflow.

Validated with a production build and local browser checks at 1440, 390, and 320px: all six assets decode, all aura layers render, hover raises halo opacity, motion toggles and reduced-motion behavior work, and no runtime errors or horizontal overflow occur. Hosted publication remains unavailable: the existing Sites project still returns NOT_FOUND.

Application icons are confined to the profile portrait and the creative toolkit. Scattered decorations across other pages were removed at the user’s request; original logo assets, dimensional styling, and smooth motion remain.

The latest reference refinement uses dark rounded tile faces, layered rims, and softer reflections in both the portrait and toolkit. Figma now has a charcoal face and Canva a darker teal face. A small 4–6px blur is confined to the ambient halo, with a slight blur on the reflective overlay; the source logos and portrait remain sharp. Hover lighting, floating motion, and reduced-motion controls are preserved. Production build and desktop/390/320px browser checks passed.

## Current software icons

The toolkit contains seven items, including the supplied Generative AI emblem. Canva now uses the original vector lettering with its circular container removed, over a rounded cyan-to-violet CSS tile. The AI emblem uses the existing cropped asset with intact white lettering, rounded clipping, and no extra raster editing. Both render in the portrait and software list; app icons are not scattered on other pages.

At the user's request, global effects are always enabled, including when legacy local storage contains an off setting. The global controls were removed. Gallery preview playback has its own local pause control. EduFocus's six development assistants appear as a compact Software used list instead of an artwork collage.
