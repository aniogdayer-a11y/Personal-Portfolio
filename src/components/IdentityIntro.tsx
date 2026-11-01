import { routeHref } from '../utils/sitePaths';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { portfolio } from '../data/portfolioData';
import { dragTarget, PULL_THRESHOLD, stepMotion } from '../utils/physics';
import type { Motion } from '../utils/physics';
import { TypewriterText } from './TypewriterText';

interface Props { onEnter: () => void; onNavigate: (path: string) => void; reduced: boolean }
export function IdentityIntro({ onEnter, onNavigate, reduced }: Props) {
  const getSize = () => ({ w: window.innerWidth, h: window.innerHeight - (window.innerWidth <= 600 ? 80 : window.innerWidth <= 900 ? 85 : 100) });
  const [size, setSize] = useState(getSize);
  const [lit, setLit] = useState(false);
  const [render, setRender] = useState({ dragging: false, ready: false });
  const assembly = useRef<HTMLDivElement>(null);
  const straps = useRef<SVGSVGElement>(null);
  const tension = useRef<HTMLElement>(null);
  const renderedStatus = useRef({ dragging: false, ready: false });
  const motion = useRef<Motion>({ x: 0, y: 0, vx: 0, vy: 0, angle: 0, angularVelocity: 0 });
  const drag = useRef({ active: false, id: -1, sx: 0, sy: 0, ox: 0, oy: 0, tx: 0, ty: 0 });
  const activated = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const scale = Math.min(1, Math.max(.56, (size.h - 220) / 485), size.w < 600 ? .87 : 1);
  const anchorX = size.w < 760 ? size.w / 2 : size.w * .27;
  const restY = Math.max(106, Math.min(205, size.h * .23));
  useEffect(() => {
    const activeTimers = timers.current;
    const resize = () => { drag.current.active = false; drag.current.tx = 0; drag.current.ty = 0; setSize(getSize()); };
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      activeTimers.forEach(clearTimeout);
    };
  }, []);
  useEffect(() => {
    let frame = 0; let previous = performance.now(); let elapsed = 0;
    const groups = Array.from(straps.current?.querySelectorAll<SVGGElement>(':scope > g') ?? []);
    const animate = (now: number) => {
      if (document.hidden) { previous = now; frame = requestAnimationFrame(animate); return; }
      const d = drag.current;
      const dt = Math.min((now - previous) / 1000, .04);
      elapsed += dt;
      const idle = reduced || activated.current ? 0 : Math.sin(elapsed * .85) * 5.2;
      const target = d.active ? { x: d.tx, y: d.ty } : { x: idle, y: 0 };
      stepMotion(motion.current, target, dt, d.active, restY, reduced);
      previous = now;
      const state = motion.current;
      if (assembly.current) assembly.current.style.transform = `translate3d(calc(-50% + ${state.x.toFixed(3)}px),${state.y.toFixed(3)}px,0) rotate(${state.angle.toFixed(3)}deg) scale(${scale})`;
      groups.forEach((group, index) => {
        const side = index === 0 ? -1 : 1;
        const ax = anchorX + side * 36;
        const dx = state.x + side * 8 - side * 36;
        const length = Math.hypot(dx, restY + state.y + 3);
        group.setAttribute('transform', `translate(${ax},0) rotate(${-Math.atan2(dx, restY + state.y + 3) * 180 / Math.PI})`);
        group.querySelectorAll(':scope > rect').forEach(rect => rect.setAttribute('height', String(length)));
        group.querySelector(':scope > svg')?.setAttribute('height', String(length + 12));
      });
      if (tension.current) tension.current.style.width = `${Math.max(0, Math.min(1, state.y / PULL_THRESHOLD)) * 100}%`;
      const ready = state.y >= PULL_THRESHOLD;
      if (renderedStatus.current.dragging !== d.active || renderedStatus.current.ready !== ready) {
        renderedStatus.current = { dragging: d.active, ready };
        setRender({ dragging: d.active, ready });
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [restY, reduced, anchorX, scale]);
  const enter = useCallback(() => {
    if (activated.current) return;
    activated.current = true; drag.current.active = false;
    motion.current.vy = reduced ? 0 : -240;
    setLit(true); timers.current.push(setTimeout(onEnter, reduced ? 50 : 1050));
  }, [onEnter, reduced]);
  const start = (e: ReactPointerEvent<HTMLElement | SVGSVGElement>) => {
    if (activated.current || (e.pointerType === 'mouse' && e.button !== 0) || drag.current.active) return;
    e.preventDefault();
    if (e.currentTarget instanceof HTMLElement) e.currentTarget.focus({ preventScroll: true });
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { active: true, id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: motion.current.x, oy: motion.current.y, tx: motion.current.x, ty: motion.current.y };
  };
  const move = useCallback((e: { pointerId: number; clientX: number; clientY: number }) => {
    const d = drag.current; if (!d.active || e.pointerId !== d.id) return;
    const target = dragTarget(e.clientX - d.sx, e.clientY - d.sy, Math.min(125, size.w * .24));
    d.tx = target.x + d.ox; d.ty = Math.min(114, target.y + d.oy);
  }, [size.w]);
  const release = useCallback((e: { pointerId: number; type: string }) => {
    const d = drag.current; if (!d.active || e.pointerId !== d.id) return;
    const shouldEnter = motion.current.y >= PULL_THRESHOLD && e.type !== 'pointercancel' && e.type !== 'lostpointercapture';
    d.active = false;
    if (shouldEnter) enter();
  }, [enter]);
  useEffect(() => {
    // Global tracking also handles release outside the card or a capture loss.
    const pointerMove = (e: PointerEvent) => { if (drag.current.active && e.buttons === 0 && e.pointerType === 'mouse') drag.current.active = false; else move(e); };
    const pointerRelease = (e: PointerEvent) => release(e);
    const blur = () => { drag.current.active = false; };
    window.addEventListener('pointermove', pointerMove, true);
    window.addEventListener('pointerup', pointerRelease, true);
    window.addEventListener('pointercancel', pointerRelease, true);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('pointermove', pointerMove, true);
      window.removeEventListener('pointerup', pointerRelease, true);
      window.removeEventListener('pointercancel', pointerRelease, true);
      window.removeEventListener('blur', blur);
    };
  }, [move, release]);
  const x = anchorX; const y = restY;
  const ready = render.ready;
  return <section className={`identity-intro ${lit ? 'is-lit' : ''}`} aria-label="Interactive ID introduction">
    <div className="intro-grain" /><div className="room-light" />
    <div className="ceiling-mount" style={{ left: anchorX }}><i /><i /></div>
    <svg ref={straps} className="lanyard-canvas" width={size.w} height={size.h} onPointerDown={start} onPointerMove={move} onPointerUp={release} onPointerCancel={release} aria-label="Lanyard strap. Drag the card below to interact.">
      <defs><linearGradient id="navy" x1="0" x2="1"><stop stopColor="#0b1630" /><stop offset=".5" stopColor="#1f3051" /><stop offset="1" stopColor="#0a1528" /></linearGradient><pattern id="weave" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 1H3" stroke="#64728c" strokeOpacity=".25" /></pattern></defs>
      {[-1, 1].map(side => {
        const ax = anchorX + side * 36; const endX = x + side * 8;
        const dx = endX - ax; const length = Math.hypot(dx, y + 3); const angle = -Math.atan2(dx, y + 3) * 180 / Math.PI;
        return <g key={side} transform={`translate(${ax},0) rotate(${angle})`}><rect x="-13" width="26" height={length} rx="2" fill="url(#navy)" /><rect x="-13" width="26" height={length} fill="url(#weave)" /><svg x="-13" y="-12" width="26" height={length + 12} viewBox="440 0 180 1484" preserveAspectRatio="none"><image href={portfolio.strapImage} width="1024" height="1484" /></svg></g>;
      })}
    </svg>
    <div ref={assembly} className={`id-assembly ${render.dragging ? 'is-grabbed' : ''} ${ready ? 'is-ready' : ''}`} style={{ left: x, top: y, transform: `translate3d(-50%,0,0) scale(${scale})` }} onPointerDown={start} onPointerMove={move} onPointerUp={release} onPointerCancel={release} tabIndex={0} role="button" aria-label="Pull ID downward and release to enter, or press Enter" onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); enter(); } }}>
      <svg className="id-hardware" width="84" height="138" viewBox="0 0 84 138" aria-hidden="true">
        <defs><linearGradient id="metal"><stop stopColor="#6c716e" /><stop offset=".48" stopColor="#d2d6ca" /><stop offset=".7" stopColor="#686e67" /><stop offset="1" stopColor="#323a35" /></linearGradient><pattern id="gold-weave" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#ad872e" /><path d="M0 1H4" stroke="#d5b45d" strokeWidth="1" opacity=".5" /></pattern></defs>
        <path d="M25 0H59V18L63 28V47H21V28L25 18Z" fill="#181f22" stroke="#3b4347" strokeWidth="1.3" /><path d="M25 6H59M27 36H57M27 40H57" stroke="#434b4b" strokeWidth="2" />
        <path d="M30 47H54V97H30Z" fill="url(#gold-weave)" stroke="#6a5528" /><circle cx="42" cy="72" r="8" fill="none" stroke="#343d37" strokeWidth="1.6" /><text x="42" y="75" fontSize="7" textAnchor="middle" fill="#343d37" fontWeight="bold">JRU</text><text x="42" y="90" fontSize="4" textAnchor="middle" fill="#343d37">est. 1919</text>
        <path d="M27 95V100Q42 106 57 100V95" fill="none" stroke="url(#metal)" strokeWidth="4" /><path d="M42 103V121Q42 134 37 132Q33 130 37 120" fill="none" stroke="url(#metal)" strokeWidth="4" />
      </svg>
      <img className="actual-id" src={portfolio.idImage} alt="Dayer C. Aniog’s José Rizal University college ID in its original clear holder" draggable={false} fetchPriority="high" />
      <div className="id-ground-shadow" />
    </div>

    <div className="intro-copy">
      <span className="eyebrow intro-anim intro-anim--1">DESIGN WITH PURPOSE. BUILD WITH CARE.</span>
      <h1 className="intro-anim intro-anim--2" aria-label="Hi, I'm Dayer Aniog."><TypewriterText text={'Hi, I’m\nDayer Aniog.'} disabled={reduced} /></h1>
      <div className="intro-roles intro-anim intro-anim--3">{portfolio.title}</div>
      <p className="intro-anim intro-anim--4">{portfolio.intro}</p>
      <div className="hero-actions intro-anim intro-anim--5">
        <a className="button button-outline" href={routeHref('/projects')} onClick={e => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) { e.preventDefault(); onNavigate('/projects'); } }}>View Projects <ArrowUpRight size={16} /></a>
        <button className="button button-outline" onClick={enter}>About Me <ArrowUpRight size={16} /></button>
      </div>
      <span className="hero-location intro-anim intro-anim--6">BASED IN THE PHILIPPINES</span>
    </div>
    <div className={`pull-guide ${ready ? 'ready' : ''}`}><ArrowDown size={14} strokeWidth={1.4} /><p aria-live="polite">{lit ? 'Welcome in.' : ready ? 'Release to reveal.' : render.dragging ? 'A little further…' : 'Pull down to discover more'}</p><div className="tension-track"><i ref={tension} /></div></div>
    <div className="transition-veil" aria-hidden="true" />
  </section>;
}
