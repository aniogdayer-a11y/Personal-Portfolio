# Formal profile portrait

Asset: `public/assets/dayer-suit-portrait.png` (1254 × 1254, transparent PNG).

The user supplied a new formal portrait and requested a faded suit effect against the black website. The built-in image-generation edit tool extracted the subject from the white background. This is an AI-edited cutout derived from the supplied photo; the unchanged ID and lanyard remain separate assets.

The profile now uses `portfolio.portrait` directly. It has no frame, border, grayscale filter, or baked-in fade. CSS masks keep the face and upper body opaque through 68% of the image height, then gradually fade the lower suit to transparency. This blends into the actual page colour at desktop and phone widths. Adjust the `.profile-portrait--blend` mask stops in `src/index.css` to tune the effect.

## Final prompt (built-in edit mode)

Use case: background-extraction and identity-preserve. EDIT TARGET: the most recent user attachment, the square formal portrait of Dayer wearing a dark pinstripe suit, pale lavender shirt and diagonally striped black tie against a white background. Create a precise background-removed cutout of this exact photograph with genuine alpha transparency. Change ONLY the plain white background to alpha zero. Preserve the original person pixel-faithfully: same face, exact facial features, skin texture, hair silhouette and fine strands, expression, pose, proportions, suit lapels and pinstripes, shirt colour, striped tie, lighting, and original crop including both shoulders and the lower torso. Do not reinterpret or regenerate the face, beautify, smooth skin, alter age, change clothing, crop off hair, add new hair, add glow, add a border, add a shadow, add text, or add a background. Maintain the source's square composition and generous headroom, output a high-resolution 2048x2048 transparent PNG with the person naturally centred as in the input. No fade should be baked into the face or clothes; the website will apply the lower-suit fade separately in CSS.
