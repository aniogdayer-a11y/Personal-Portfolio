# Portfolio text motion

The owner requested text motion inspired by https://vons-portfolio.vercel.app/ on every navigation page except Home. The reference uses masked staggered entrances and upward fade-in reveals. This implementation retains Dayer's typography, content, and layout.

- `MotionText` preserves natural word wrapping and inline styling while giving each word a clipped entrance with a short stagger.
- `usePageMotion` reveals primary headings and supporting copy as they enter the viewport. It also discovers content introduced by project filtering.
- Each text block animates once per page visit. Animation uses transforms and opacity without changing the layout dimensions.
- Text in dialogs, live statuses, gallery controls, and media controls remains immediately available. Keyboard focus reveals its container immediately.
- Home keeps its existing typewriter heading and hanging-ID interaction. Print styles show all text immediately.

Browser checks cover all six navigation pages plus the EduFocus detail page at desktop and narrow mobile widths, stable heading dimensions, dynamic filtering, modal text, and the Home exclusion.
