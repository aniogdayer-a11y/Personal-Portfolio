import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react';
import { IdentityIntro } from './components/IdentityIntro';
import { HomeLoader } from './components/HomeLoader';
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
const sectionRoute = (path: string) => path === '/' ? '/home' : path === '/profile' ? '/about' : path;
const isSection = (path: string) => pages.some(([url]) => url === sectionRoute(path));

export function App() {
  const [route, setRoute] = useState(readRoute);
  const [homeEntry, setHomeEntry] = useState<'loading' | 'revealing' | 'complete'>(() => ['/', '/home'].includes(readRoute()) ? 'loading' : 'complete');
  const singlePage = isSection(route);
  const viewKey = singlePage ? 'sections' : route;
  const loadingHome = singlePage && homeEntry !== 'complete';
  const [activeSection, setActiveSection] = useState(sectionRoute(route));
  const [scrollRequest, setScrollRequest] = useState({ path: sectionRoute(route), smooth: false, serial: 0 });
  const [homeVisit, setHomeVisit] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { enabled: motionEnabled } = useMotionPreference();
  const reduced = !motionEnabled;
  const main = useRef<HTMLElement>(null);
  const header = useRef<HTMLElement>(null);
  const { scrollTo } = useSmoothScroll(viewKey);
  const navigate = useCallback((path: string) => {
    path = sectionRoute(path);
    if (path === '/home') setHomeVisit(value => value + 1);
    if (readRoute() !== path) history.pushState(null, '', routeHref(path));
    setRoute(path); setMenuOpen(false); setHomeEntry('complete');
    setScrollRequest(previous => ({ path, smooth: singlePage && isSection(path), serial: previous.serial + 1 }));
  }, [singlePage]);
  useEffect(() => {
    const pop = () => { const path = sectionRoute(readRoute()); if (path === '/home') setHomeVisit(value => value + 1); setRoute(path); setMenuOpen(false); setHomeEntry('complete'); setScrollRequest(previous => ({ path, smooth: false, serial: previous.serial + 1 })); };
    window.addEventListener('popstate', pop);
    window.addEventListener('hashchange', pop);
    return () => { window.removeEventListener('popstate', pop); window.removeEventListener('hashchange', pop); };
  }, []);
  useEffect(() => {
    const active = pages.find(([url]) => route.startsWith(url));
    document.title = route === '/' || route === '/home' ? 'Dayer Aniog — Design & Development' : `${route === '/profile' ? 'About' : active?.[1] ?? 'Page not found'} — Dayer Aniog`;
    if (!singlePage) main.current?.focus({ preventScroll: true });
  }, [route, singlePage]);
  useLayoutEffect(() => {
    if (!singlePage || loadingHome) return;
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(scrollRequest.path.slice(1));
      if (target) {
        scrollTo(target, scrollRequest.smooth, -(header.current?.offsetHeight ?? 100));
        target.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [singlePage, loadingHome, scrollRequest, scrollTo]);
  useEffect(() => {
    if (!singlePage || loadingHome) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const threshold = (header.current?.offsetHeight ?? 100) + innerHeight * .22;
      let current = '/home';
      main.current?.querySelectorAll<HTMLElement>('[data-section]').forEach(section => {
        if (section.getBoundingClientRect().top <= threshold) current = `/${section.dataset.section}`;
      });
      setActiveSection(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update(); window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, [singlePage, loadingHome]);
  useEffect(() => { document.body.style.overflow = menuOpen || loadingHome ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [menuOpen, loadingHome]);
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
  const revealHome = useCallback(() => setHomeEntry('revealing'), []);
  const completeHome = useCallback(() => { setHomeEntry('complete'); requestAnimationFrame(() => main.current?.focus({ preventScroll: true })); }, []);
  usePageMotion(main, viewKey, reduced || loadingHome);
  useAmbientMotion(main, viewKey, motionEnabled && !loadingHome);
  useParallax(main, viewKey, motionEnabled && !loadingHome && !menuOpen);
  return <div className={`portfolio-shell ${singlePage ? 'single-page-shell' : ''}`} data-home-entry={singlePage ? homeEntry : undefined}>
    {loadingHome && <HomeLoader onReveal={revealHome} onComplete={completeHome} />}
    <a inert={loadingHome} className="skip-content" href="#main-content" onClick={event => { event.preventDefault(); main.current?.focus(); }}>Skip to content</a>
    <header inert={loadingHome} ref={header} className="site-header"><RouteLink to="/home" navigate={navigate} className="wordmark">Dayer<span>Aniog.</span></RouteLink><nav className={`site-nav ${menuOpen ? 'menu-open' : ''}`} id="primary-navigation" aria-label="Primary navigation">{pages.map(([url, title]) => <a href={routeHref(url)} key={url} aria-label={url === '/certifications' ? 'Certifications & Badges' : url === '/experience' ? 'Experience & Achievements' : title} aria-current={(singlePage ? activeSection === url : route.startsWith(url)) ? 'page' : undefined} onClick={e => { if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigate(url); } }}><span>{title}</span>{url === '/contact' && <ArrowUpRight size={15} />}</a>)}</nav><div className="header-actions"><button type="button" className="theme-toggle" aria-label="Light mode" aria-pressed={theme === 'light'} title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggleTheme}>{theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}</button><button className="mobile-menu-button" aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(v => !v)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>{menuOpen ? <X /> : <Menu />}</button></div></header>
    <main key={viewKey} ref={main} tabIndex={-1} id="main-content" className={singlePage ? 'sections-main' : 'page-enter'} inert={menuOpen || loadingHome}>
      {singlePage ? <>
        <section id="home" data-section="home" tabIndex={-1} aria-label="Home"><IdentityIntro active={homeEntry === 'complete'} entrySignal={homeVisit} onNavigate={navigate} reduced={reduced} /></section>
        <section id="about" data-section="about" tabIndex={-1} aria-label="About"><ProfilePage navigate={navigate} compact /></section>
        <section id="projects" data-section="projects" tabIndex={-1} aria-label="Projects"><ProjectsPage navigate={navigate} /></section>
        <section id="skills" data-section="skills" tabIndex={-1} aria-label="Skills"><SkillsPage /></section>
        <section id="certifications" data-section="certifications" tabIndex={-1} aria-label="Certifications and badges"><CertificationsPage /></section>
        <section id="experience" data-section="experience" tabIndex={-1} aria-label="Experience"><ExperiencePage /></section>
        <section id="contact" data-section="contact" tabIndex={-1} aria-label="Contact"><ContactPage /></section>
      </> : route.startsWith('/projects/') ? <ProjectsPage navigate={navigate} projectId={route.split('/')[2]} /> : <NotFoundPage navigate={navigate} />}
    </main>
  </div>;
}
export default App;
