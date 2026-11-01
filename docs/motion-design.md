# Portfolio motion

The portfolio keeps its dark editorial identity and original project assets. `src/motion.css` groups the interaction styling: wider multi-stop side fades, slightly staggered poster positions, small pointer-responsive hover tilts, gentle image emphasis, restrained arrow movement, and short preview transitions. The artwork remains uncropped.

`GraphicDesignShowcase` uses a single animation frame loop for eased wheel/control scrolling and mouse-release momentum. Easing and friction use elapsed time, keeping movement consistent across refresh rates. Mouse velocity is filtered and capped; a held or cancelled drag does not coast. Direct input interrupts motion, rapid arrow presses accumulate destinations, and the row stays bounded. Touch and horizontal trackpad gestures retain native browser scrolling. Vertical wheel input at either horizontal boundary can scroll the page.

`usePageMotion` reveals page sections and cards once they enter the viewport. It observes newly filtered content and releases removed nodes. Focused content appears immediately. Observers, listeners, and frames are cleaned up on route changes or unmount; hidden pages and a reduced-motion preference stop gallery animation. The ID introduction is excluded from page reveals.

Reduced-motion mode removes card tilt, entrance movement, hover scaling, and animated scrolling. Keyboard controls, the range scrubber, modal focus restoration, full-resolution previews, original-size zoom, and native touch interactions remain available.

Validation: production TypeScript/Vite build; local Chrome checks for wheel/trackpad scrolling, mouse-release momentum and click suppression, rapid arrow presses, keyboard boundaries, hover tilt, page reveals, dynamic filtering, touch swipe/tap, preview controls/focus restoration, reduced motion, 1440px/390px/320px layouts, and retention of the 1536 × 2048 booth original. No animation library or new dependency was added.

## Floating projects and artwork peeks

The app icons now use separate raised faces and extruded edge layers with perspective, deeper shadows, and pointer tilt. Project artwork bobs vertically with staggered phases while captions stay still. Visible project art on About and the development grid also moves gently. Ambient movement pauses offscreen, when the document is hidden, during gallery drag, and on hover/focus so previews remain easy to select.

For collections with several artworks, a small preview of the next distinct export slides out beside the cover on desktop hover or keyboard focus. Selecting that peek opens its exact artwork in the full-resolution viewer. Selecting the cover opens the currently displayed artwork. Touch users tap directly to open the viewer. A soft neutral halo appears on hover/focus; the interface remains black-dominant.

A shared Enable motion / Pause motion control is visible under the portrait and beside the gallery controls, including when Windows/browser reduced motion is active. The system setting remains the default. A deliberate visitor choice is persisted under `dayer-motion`, synchronizes across the site, and can explicitly enable motion. Reduced-motion CSS is scoped to visitors without that opt-in. Pausing also stops ongoing gallery momentum. Blocked storage falls back to an in-memory choice.

Validation: production build; desktop and 390/320px layouts; actual position sampling for icon/project movement; OS-reduced default and explicit override; hover glow and exact-artwork peek selection; full-resolution modal; drag/swipe and keyboard controls; original ID interaction regression suite.

Publication for this update could not proceed because the Sites connector returned NOT_FOUND (Sites project not found) for the unchanged project ID in `.openai/hosting.json`. Local source and localhost preview contain the update.

## Focused application layout

Application icons remain around the profile portrait and in the organized creative toolkit. The scattered page-heading and closing-section compositions were removed at the user's request, restoring the original content width and spacing. A shared Enable/Pause motion control remains in the site footer and Home footer. Smooth project movement, hover previews, toolkit motion, and the extended detail-page scroll reveals remain active.

## Interface refinement and parallax

`refinement.css` defines the current shared visual treatment: aligned gutters, readable typography, a translucent dark navigation bar, clearer buttons and filters, open project layouts, restrained credentials surfaces, and consistent Skills, AI tools, Experience, and Contact sections. The profile retains the real portrait and the original app marks. Existing project data, live links, and ID physics remain intact.

`useParallax` supplies scroll depth and pointer response to the portrait, its app tiles, selected project/credential media, and decorative page numbers. It uses one event-driven requestAnimationFrame loop, time-based easing, batched geometry reads and style writes, viewport observation, and explicit cleanup. Floating portrait children use stable scene geometry. Mobile keeps native scrolling and a smaller scroll-only displacement. Hidden pages, open artwork dialogs, mobile navigation, and paused effects suspend the effect. No animation dependency or scroll hijacking was introduced.

The persistent header control reads “Enable effects” when motion is off and “Effects on” when enabled. It shares the existing visitor preference with all animation controls. System reduced motion remains the default unless a visitor explicitly enables effects. This makes the opt-in visible immediately, including on mobile.

Validation: production build; eight routes at 1440/768/390/320px; measured scroll and cursor displacement; reduced-motion opt-in and cleanup; project filtering and gallery controls; artwork modal; AI application keyboard navigation and diagram preview; existing ID, touch, keyboard, and navigation regression suite. Browser checks reported no runtime exceptions or page overflow. Publication remains blocked by the existing Sites project's NOT_FOUND response; the updated interface is available locally.

## Current interaction refinement

The owner requested effects always on, so motion no longer depends on the old browser-storage setting or global controls. Project previews use the original artwork with gentle vertical/rotational movement, eased pointer tilt, and a soft moving reflection. The AWS image appears in About, its category showcase, and its detail page. Viewport observers pause offscreen animation; dialogs pause the presentation motion. This is motion applied to the original composite artwork, not a separately animated reconstruction of the laptop screens or mascot.

ID rendering now updates the assembly transform and SVG strap geometry directly each frame. React state updates only for drag and pull-threshold status. Horizontal recoil has lighter damping and the angular spring uses less velocity-driven rotation. Idle sway uses a local continuous clock. Existing pull limits, threshold, release/cancellation behavior, connected strap, and keyboard entry remain intact. Physics checks include 60/120 Hz sway consistency.

The wide frame board no longer has the large artificial halo. Closing filler copy and the large contact banner were removed; the footer presents LinkedIn, Gmail, and GitHub directly. EduFocus copy reflects its short development timeframe, learner-selected topics, multiple learning modes, customizable themes, and the owner's front-end/back-end work with AI assistance.

Validated with production build, six physics checks, the ID browser regression suite, and targeted desktop/390/320px checks of icon rendering, real preview displacement, social destinations, graphic gallery, EduFocus software list, and AWS full-resolution viewer.
