import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent } from 'react';
import { ArrowLeft, ArrowRight, Images, Pause, Play } from 'lucide-react';
import type { PortfolioProject } from '../data/portfolioData';
import type { Navigate } from './PortfolioPages';
import { ArtworkViewer } from './ArtworkViewer';
import { CollectionPoster } from './CollectionPoster';
import { motionAllowed } from '../hooks/useMotionPreference';

const reducedMotion = () => !motionAllowed();
interface ScrollMotion { cancel: () => void; to: (left: number) => void; coast: (velocity: number) => void; destination: () => number }

export function GraphicDesignShowcase({ projects, navigate }: { projects: PortfolioProject[]; navigate: Navigate }) {
  const track = useRef<HTMLDivElement>(null);
  const motion = useRef<ScrollMotion>({ cancel: () => {}, to: () => {}, coast: () => {}, destination: () => 0 });
  const gesture = useRef({ id: -1, x: 0, y: 0, left: 0, dragged: false, lastX: 0, lastTime: 0, velocity: 0 });
  const [playing, setPlaying] = useState(true);
  const toggleMotion = () => setPlaying(value => !value);
  const [hovered, setHovered] = useState<string | null>(null);
  const [viewingIndex, setViewingIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ left: 0, max: 0 });
  const [viewing, setViewing] = useState<PortfolioProject | null>(null);
  const collectionKey = projects.map(project => project.id).join('|');
  const artworkCount = projects.reduce((total, project) => total + (project.images?.length ?? 0), 0);

  useEffect(() => { if (!playing) motion.current.cancel(); }, [playing]);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    let frame = 0;
    let target = element.scrollLeft;
    let velocity = 0;
    let previousTime = 0;
    let mode: 'target' | 'coast' = 'target';
    const limit = (left: number) => Math.max(0, Math.min(element.scrollWidth - element.clientWidth, left));
    const stop = () => { cancelAnimationFrame(frame); frame = 0; target = element.scrollLeft; velocity = 0; };
    const update = () => setPosition({ left: element.scrollLeft, max: Math.max(0, element.scrollWidth - element.clientWidth) });
    const animate = (time: number) => {
      const elapsed = Math.min(40, Math.max(1, time - previousTime));
      previousTime = time;
      const before = element.scrollLeft;
      if (mode === 'coast') {
        element.scrollLeft = limit(before + velocity * elapsed);
        velocity *= Math.exp(-elapsed / 180);
        if (Math.abs(velocity) < 0.025 || element.scrollLeft === before) { stop(); return; }
      } else {
        const distance = target - before;
        if (Math.abs(distance) < 4) { element.scrollLeft = target; stop(); return; }
        element.scrollLeft = before + distance * (1 - Math.exp(-elapsed / 85));
        if (element.scrollLeft === before) { element.scrollLeft = target; stop(); return; }
      }
      frame = requestAnimationFrame(animate);
    };
    const to = (left: number) => {
      target = limit(left); mode = 'target';
      if (reducedMotion()) { const destination = target; stop(); element.scrollLeft = destination; return; }
      if (!frame) { previousTime = performance.now(); frame = requestAnimationFrame(animate); }
    };
    motion.current = {
      cancel: stop, to, destination: () => frame && mode === 'target' ? target : element.scrollLeft,
      coast: speed => {
        stop();
        if (reducedMotion() || Math.abs(speed) < 0.08) return;
        mode = 'coast'; velocity = Math.max(-2.2, Math.min(2.2, speed));
        previousTime = performance.now(); frame = requestAnimationFrame(animate);
      },
    };
    const wheel = (event: WheelEvent) => {
      // Trackpads keep their native horizontal momentum; vertical wheels explore the row.
      if (event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) { stop(); return; }
      const max = element.scrollWidth - element.clientWidth;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientWidth : 1);
      if (max <= 0 || (delta < 0 && element.scrollLeft <= 1) || (delta > 0 && element.scrollLeft >= max - 1)) { stop(); return; }
      event.preventDefault();
      to((frame && mode === 'target' ? target : element.scrollLeft) + delta);
    };
    const resize = new ResizeObserver(() => { stop(); update(); });
    resize.observe(element);
    element.scrollLeft = 0;
    update();
    element.addEventListener('scroll', update, { passive: true });
    element.addEventListener('wheel', wheel, { passive: false });
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); reveal.unobserve(entry.target); }
    }), { threshold: 0.08 });
    if (!reducedMotion()) {
      element.classList.add('has-scroll-reveal');
      Array.from(element.children).forEach(child => reveal.observe(child));
    }
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const preferenceChanged = () => { if (preference.matches) stop(); };
    const visibilityChanged = () => { if (document.hidden) stop(); };
    preference.addEventListener('change', preferenceChanged);
    document.addEventListener('visibilitychange', visibilityChanged);
    return () => { stop(); resize.disconnect(); reveal.disconnect(); element.removeEventListener('scroll', update); element.removeEventListener('wheel', wheel); preference.removeEventListener('change', preferenceChanged); document.removeEventListener('visibilitychange', visibilityChanged); };
  }, [collectionKey]);

  const align = (direction: number) => {
    const element = track.current;
    if (!element) return;
    const destination = motion.current.destination();
    const inset = parseFloat(getComputedStyle(element).paddingLeft);
    const points = Array.from(element.children).map(child => (child as HTMLElement).offsetLeft - inset);
    const next = direction > 0 ? points.find(point => point > destination + 8) : points.findLast(point => point < destination - 8);
    motion.current.to(next ?? (direction > 0 ? element.scrollWidth : 0));
  };
  const pointerDown = (event: PointerEvent<HTMLDivElement>) => {
    motion.current.cancel();
    gesture.current = { id: event.pointerType === 'mouse' && event.button === 0 ? event.pointerId : -1, x: event.clientX, y: event.clientY, left: event.currentTarget.scrollLeft, dragged: false, lastX: event.clientX, lastTime: event.timeStamp, velocity: 0 };
  };
  const pointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = gesture.current;
    if (current.id !== event.pointerId) return;
    // A press can end outside the row before the drag threshold captures it.
    if (!(event.buttons & 1)) { current.id = -1; setDragging(false); return; }
    const delta = event.clientX - current.x;
    if (!current.dragged && Math.abs(delta) > 7 && Math.abs(delta) > Math.abs(event.clientY - current.y)) {
      current.dragged = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    if (current.dragged) {
      event.preventDefault(); event.currentTarget.scrollLeft = current.left - delta;
      const elapsed = Math.max(8, event.timeStamp - current.lastTime);
      current.velocity = current.velocity * 0.6 + (current.lastX - event.clientX) / elapsed * 0.4;
    }
    current.lastX = event.clientX; current.lastTime = event.timeStamp;
  };
  const pointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (gesture.current.id !== event.pointerId) return;
    gesture.current.id = -1;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false);
    if (event.type === 'pointerup' && gesture.current.dragged && event.timeStamp - gesture.current.lastTime < 80) motion.current.coast(gesture.current.velocity);
  };
  const tilt = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== 'mouse' || gesture.current.id !== -1 || reducedMotion()) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--pointer-x', `${((event.clientX - bounds.left) / bounds.width - 0.5) * 2.4}deg`);
    event.currentTarget.style.setProperty('--pointer-y', `${((event.clientY - bounds.top) / bounds.height - 0.5) * -1.8}deg`);
  };

  return <section className="design-showcase" data-motion-playing={playing && !viewing && !dragging} aria-labelledby="design-showcase-title">
    <div className="showcase-heading"><div><span className="eyebrow">VISUAL WORK / SELECTED COLLECTIONS</span><h2 id="design-showcase-title">Graphic Design<span className="period">.</span></h2><p>Designed in Figma, with AI used for ideas and concept exploration.</p></div><div className="showcase-controls"><button className="preview-motion-toggle" onClick={toggleMotion} aria-pressed={playing} aria-label={playing ? 'Pause artwork previews' : 'Play artwork previews'}>{playing ? <Pause size={14} /> : <Play size={14} />}<span>{playing ? 'Pause previews' : 'Play previews'}</span></button><div className="showcase-navigation" aria-label="Gallery controls"><button onClick={() => align(-1)} disabled={position.left <= 1} aria-label="Scroll designs left" aria-controls="design-track"><ArrowLeft size={18} /></button><button onClick={() => align(1)} disabled={position.left >= position.max - 1} aria-label="Scroll designs right" aria-controls="design-track"><ArrowRight size={18} /></button></div></div></div>
    <div className="showcase-window" data-scroll-left={position.left > 1} data-scroll-right={position.left < position.max - 1}><div ref={track} id="design-track" className={`showcase-track${dragging ? ' is-dragging' : ''}`} tabIndex={0} role="region" aria-label="Graphic design collections, horizontally scrollable" aria-describedby="showcase-instructions"
      onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd} onLostPointerCapture={() => { gesture.current.id = -1; setDragging(false); }}
      onClickCapture={event => { if (gesture.current.dragged && event.detail !== 0) { event.preventDefault(); event.stopPropagation(); } }}
      onDragStart={event => event.preventDefault()}
      onKeyDown={event => {
        if (event.target !== event.currentTarget) return;
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); align(event.key === 'ArrowRight' ? 1 : -1); }
        if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); motion.current.to(event.key === 'Home' ? 0 : event.currentTarget.scrollWidth); }
      }}>
      {projects.map((project, index) => <div className="showcase-slide" key={project.id} style={{ '--artwork-aspect': (project.images?.[0]?.width ?? 1) / (project.images?.[0]?.height ?? 1), '--card-tilt': `${[-0.7, 0.6, -0.4, 0.7, -0.5][index % 5]}deg`, '--enter-delay': `${index % 3 * 60}ms`, '--float-delay': `${index * -1.3}s` } as CSSProperties}>
        <button className="showcase-card" onPointerMove={tilt} onPointerLeave={event => { setHovered(null); event.currentTarget.style.removeProperty('--pointer-x'); event.currentTarget.style.removeProperty('--pointer-y'); }} onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(project.id); }} onFocus={() => setHovered(project.id)} onBlur={() => setHovered(null)} onClick={event => {
            motion.current.cancel();
            const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-artwork-index]') : null;
            const active = event.currentTarget.querySelector<HTMLElement>('.showcase-poster')?.dataset.artworkIndex;
            setViewingIndex(Number(target?.dataset.artworkIndex ?? active ?? 0));
            setViewing(project);
          }} aria-label={`Preview ${project.title}`} aria-haspopup="dialog">
          <span className="artwork-depth" data-parallax="0.08"><span className="project-float"><CollectionPoster project={project} playing={playing && !viewing && !dragging && hovered !== project.id} /></span></span>
          <span className="showcase-caption"><span className="showcase-meta"><span>{String(index + 1).padStart(2, '0')} / {project.category}</span><span><Images size={12} /> {project.images?.length ?? 1}</span></span><span className="showcase-title">{project.title}</span><span className="showcase-format">{project.format}</span><span className="showcase-description">{project.description}</span></span>
        </button>
      </div>)}
    </div></div>
    <div className="showcase-footer"><span>{projects.length} {projects.length === 1 ? 'collection' : 'collections'} · {artworkCount} artworks</span><input className="showcase-progress" type="range" min="0" max="100" step="0.1" value={position.max ? position.left / position.max * 100 : 0} disabled={!position.max} aria-label="Scroll graphic design showcase" aria-controls="design-track" aria-valuetext={`${Math.round(position.max ? position.left / position.max * 100 : 0)}% scrolled`} onChange={event => { motion.current.cancel(); if (track.current) track.current.scrollLeft = Number(event.target.value) / 100 * position.max; }} /><span id="showcase-instructions">Scroll or drag to explore · Select to preview</span></div>
    {viewing?.images?.length ? <ArtworkViewer images={viewing.images} initialIndex={viewingIndex} title={viewing.title} project={viewing} onClose={() => setViewing(null)} onProjectDetails={() => { setViewing(null); navigate(`/projects/${viewing.id}`); }} /> : null}
  </section>;
}
