import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react';
import { IdentityIntro } from './components/IdentityIntro';
import { ProfilePage, ProjectsPage, SkillsPage, CertificationsPage, ExperiencePage, ContactPage, NotFoundPage, RouteLink } from './components/PortfolioPages';
import { useParallax } from './hooks/useParallax';
import { usePageMotion } from './hooks/usePageMotion';
import { useAmbientMotion } from './hooks/useAmbientMotion';
import { useMotionPreference } from './hooks/useMotionPreference';
import { useTheme } from './hooks/useTheme';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { readRoute, routeHref } from './utils/sitePaths';

const pages = [
  ['/home', 'Home'], ['/about', 'About'], ['/projects', 'Projects'], ['/skills', 'Skills'],
  ['/certifications', 'Credentials'], ['/experience', 'Experience'], ['/contact', 'Contact'],
];
function readSession() { try { return sessionStorage.getItem('dayer-introduced') === 'yes'; } catch { return false; } }
function writeSession(value: boolean) { try { if (value) sessionStorage.setItem('dayer-introduced', 'yes'); else sessionStorage.removeItem('dayer-introduced'); } catch { /* Private browsing may disable storage. */ } }

export function App() {
  const [route, setRoute] = useState(() => {
    if (readRoute() === '/' && readSession()) { history.replaceState(null, '', routeHref('/about')); return '/about'; }
    return readRoute();
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { enabled: motionEnabled } = useMotionPreference();
  const reduced = !motionEnabled;
  const main = useRef<HTMLElement>(null);
  const header = useRef<HTMLElement>(null);
  const resetScroll = useSmoothScroll(route);
  const navigate = useCallback((path: string) => {
    if (path === '/' || path === '/home') writeSession(false);
    else writeSession(true);
    if (readRoute() !== path) history.pushState(null, '', routeHref(path));
    resetScroll(); setRoute(path); setMenuOpen(false);
  }, [resetScroll]);
  useEffect(() => {
    const pop = () => { setRoute(readRoute()); setMenuOpen(false); };
    window.addEventListener('popstate', pop);
    window.addEventListener('hashchange', pop);
    return () => { window.removeEventListener('popstate', pop); window.removeEventListener('hashchange', pop); };
  }, []);
  useEffect(() => {
    const active = pages.find(([url]) => route.startsWith(url));
    document.title = route === '/' || route === '/home' ? 'Dayer Aniog — Design & Development' : `${route === '/profile' ? 'About' : active?.[1] ?? 'Page not found'} — Dayer Aniog`;
    if (route !== '/' && route !== '/home') { writeSession(true); main.current?.focus({ preventScroll: true }); }
  }, [route]);
  useEffect(() => { document.body.style.overflow = menuOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [menuOpen]);
  useEffect(() => {
    if (!menuOpen) return;
    document.querySelector<HTMLAnchorElement>('.site-nav a')?.focus();
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMenuOpen(false); document.querySelector<HTMLButtonElement>('.mobile-menu-button')?.focus(); }
      if (e.key === 'Tab') {
        const items = Array.from(header.current?.querySelectorAll<HTMLElement>('a,button') ?? []);
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close);
  }, [menuOpen]);
  useEffect(() => {
    const mobile = window.matchMedia('(max-width:1100px)');
    const resize = () => { if (!mobile.matches) setMenuOpen(false); };
    mobile.addEventListener('change', resize);
    return () => mobile.removeEventListener('change', resize);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = motionEnabled ? 'on' : 'off';
    const visibility = () => { document.documentElement.dataset.pageHidden = String(document.hidden); };
    visibility(); document.addEventListener('visibilitychange', visibility);
    return () => document.removeEventListener('visibilitychange', visibility);
  }, [motionEnabled]);
  const enter = useCallback(() => navigate('/about'), [navigate]);
  const home = route === '/' || route === '/home';
  usePageMotion(main, route, reduced || home);
  useAmbientMotion(main, route, motionEnabled && !home);
  useParallax(main, route, motionEnabled && !home && !menuOpen);
  return <div className={`portfolio-shell ${home ? 'home-shell' : ''}`}>
    <a className="skip-content" href="#main-content" onClick={event => { event.preventDefault(); main.current?.focus(); }}>Skip to content</a>
    <header ref={header} className="site-header"><RouteLink to="/home" navigate={navigate} className="wordmark">Dayer<span>Aniog.</span></RouteLink><nav className={`site-nav ${menuOpen ? 'menu-open' : ''}`} id="primary-navigation" aria-label="Primary navigation">{pages.map(([url, title]) => <a href={routeHref(url)} key={url} aria-label={url === '/certifications' ? 'Certifications & Badges' : url === '/experience' ? 'Experience & Achievements' : title} aria-current={(home && url === '/home') || ((route === '/profile' ? '/about' : route).startsWith(url)) ? 'page' : undefined} onClick={e => { if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigate(url); } }}><span>{title}</span>{url === '/contact' && <ArrowUpRight size={15} />}</a>)}</nav><div className="header-actions"><button type="button" className="theme-toggle" aria-label="Light mode" aria-pressed={theme === 'light'} title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggleTheme}>{theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}</button><button className="mobile-menu-button" aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(v => !v)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>{menuOpen ? <X /> : <Menu />}</button></div></header>
    <main key={route} ref={main} tabIndex={-1} id="main-content" className="page-enter" inert={menuOpen}>
      {home ? <IdentityIntro onEnter={enter} onNavigate={navigate} reduced={reduced} /> : route === '/profile' || route === '/about' ? <ProfilePage navigate={navigate} /> : route === '/projects' || route.startsWith('/projects/') ? <ProjectsPage navigate={navigate} projectId={route.split('/')[2]} /> : route === '/skills' ? <SkillsPage /> : route === '/certifications' ? <CertificationsPage /> : route === '/experience' ? <ExperiencePage /> : route === '/contact' ? <ContactPage /> : <NotFoundPage navigate={navigate} />}
    </main>
  </div>;
}
export default App;
