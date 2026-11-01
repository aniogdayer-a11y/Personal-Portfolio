# Tiled project and local preview update

- The local development server was stopped. Restarting it with `host: localhost` initially served IPv6 localhost but refused requests to `127.0.0.1`.
- Vite now uses port 5173 with a dual-stack bind (`::`) and strict port selection. Both local addresses returned HTTP 200. `START-PORTFOLIO.cmd` launches the preview from the correct directory.
- No recent error events were returned by the hosted site's runtime log check. This does not establish the cause of an earlier browser error; the confirmed issue was local server availability.
- The Design filter contains AWS SBG, EduFocus, then The Last Ember. The game retains its own `Game Map Design` classification; it is excluded from Web Development and Graphic Design.
- Dayer's credited role is **Map Design Contributor**, assisting a friend with map layouts in **Tiled**. The recording credits the game to **The Three Musketeers**. The portfolio does not attribute game programming, character artwork, or gameplay systems to Dayer.
- Source: the user-provided `references/The last ender.mp4`. The title slide reads **The Last Ember**. The full original stays local and is ignored by Git.
- Two stills are extracted at 285s and 330s. A silent 24-second gameplay excerpt starts at 278s. Exports use the gameplay viewport (1362×492 at x=0, y=294), excluding the presentation webcam. No visual redesign or upscaling was applied.
- The video is served locally with native playback controls and `preload="none"`. It is loaded only when the visitor starts playback.
- Project summaries, overviews, design approaches, page introductions, experience text, and AI-tool descriptions were revised for direct professional language. Project, credential, and contact alignment styles were refined.

## Validation

- Production build and TypeScript compilation passed.
- Ten physics and catalog tests passed, including the third Design position and Tiled contribution scope.
- Browser checks covered both localhost addresses, all primary pages, deep project links, 1440/768/390/320 layouts, category counts, the Tiled software link, actual video playback and seeking, screenshot modal, and image loading. No runtime exceptions or horizontal overflow were observed.
- Existing ID interaction checks passed for drag, pull, recoil, touch, keyboard, routes, and effects pause.

## Presentation refinement

- Replaced the two gameplay stills in the visible project gallery with the user's exact `Downloads/Desktop - 3 (1).png` presentation (1440×1024), copied unchanged to `presentation.png`. The original artwork title is preserved as supplied.
- The 24-second video file remains unchanged (SHA-256 `37BCAB22298588572E0856F91AABA00431765545FFB3D344CD3D4046D3158182`). A trailer section adds a cover, explicit play button, and native controls after playback starts. It does not autoplay or add audio.
- AWS SBG's overview now uses the user's supplied paragraph, attributing website refinement and polishing to Dayer within a team assigned both mobile and website design.
- Tools labels use restrained 15px software icons (12px within compact category metadata). The AI portrait tile shares the other software tiles' frame, depth, and dimensions, while retaining its centered position and purple glow.
- Build and targeted browser checks passed at 1440/390/320: supplied cover, single-image viewer, old screenshots absent, exact AWS overview, tiny tool icons, trailer playback, AI frame consistency, and no horizontal overflow or runtime errors.

## Publication status

The completed update is available locally. Publication was not completed: the Sites connector returned `NOT_FOUND / Sites project not found` for the existing project during credential renewal and the follow-up site read. The hosting identity was retained. No replacement site was created; the hosted version has not received this update.
# EduFocus teaser and development tools

Chrome play-button follow-up: removed the full-video custom cover so native controls stay accessible. A separate Play/Pause button now reflects actual playback events, metadata preloads, and loading/error status plus a persistent direct-video link remain visible. The default preview is now `teaser-browser.mp4` (1080×1920, H.264 Constrained Baseline / yuv420p at 30 fps, AAC audio, fast-start metadata), with WebM as an alternative. The supplied original MP4 remains preserved. Tested on the `localhost` origin with cache disabled: actual mouse clicks on the separate button, native keyboard playback, sound controls, and playback progress at 1440/390/320 pixels. The Last Ember remains unchanged.

Audio follow-up: the original AAC stereo track is non-silent (FFmpeg mean -15.0 dB, peak -0.4 dB). Added a 1080×1920 WebM/VP9 + Opus preview with the original MP4 retained as fallback. The teaser play action explicitly unmutes and restores volume; native volume changes update the sound indicator without a React mute-prop feedback loop. Verified both media formats through actual Web Audio waveform sampling connected to the audio destination, plus zero-volume recovery, mute toggling, and native slider recovery. The Last Ember player remains unchanged. OS volume, tab mute, and the user's actual speakers are outside this browser verification.

- Added the supplied `references/EduFocus_Official_Teaser_30s.mp4` to the EduFocus detail page, with a portrait player, preview frame, click-to-play cover, and native playback controls. The published asset is an exact copy (SHA-256 `60F7DFD87EB5E9A31A895FD5661BCA562EEAFBFD5EA8DC26DC7FFF16748936D3`); its 30-second duration, 1080×1920 resolution, and audio are preserved.
- Generalized project-video labels and metadata, preserving The Last Ember's existing trailer. Added teaser entry links in Design and Web Development.
- Replaced clipped AI tool thumbnails with CSS views of complete tiles from the existing original artwork. Labels use consistent alignment and a single-column arrangement in narrow containers.
- Verified the production build, catalog tests, real teaser playback, and layouts at 1440, 768, 390, and 320 pixels. No runtime errors or horizontal overflow in the targeted browser checks.
- Publication remains blocked: the existing Sites project returns `NOT_FOUND`. The existing site identity remains unchanged; local preview is available at `http://localhost:5173/projects/edufocus`.

