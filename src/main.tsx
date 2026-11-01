import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'lenis/dist/lenis.css'
import './index.css'
import './motion.css'
import './interactions.css'
import './refinement.css'
import './theme.css'
import App from './App.tsx'
import { motionAllowed } from './hooks/useMotionPreference'
import { initializeTheme } from './hooks/useTheme'

document.documentElement.dataset.motion = motionAllowed() ? 'on' : 'off';
initializeTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
