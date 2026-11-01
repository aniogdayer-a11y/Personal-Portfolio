import { routeHref } from '../utils/sitePaths';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { portfolio } from '../data/portfolioData';
import { clamp, dragTarget, pendulumRise, PULL_THRESHOLD, stepEntryDrop, stepMotion } from '../utils/physics';
import type { EntryDrop, Motion } from '../utils/physics';
import { TypewriterText } from './TypewriterText';

interface Props { active?: boolean; entrySignal?: number; onNavigate: (path: string) => void; reduced: boolean }
const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
const readReducedMotion = () => matchMedia(reducedMotionQuery).matches;
const subscribeReducedMotion = (notify: () => void) => {
  const query = matchMedia(reducedMotionQuery);
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
};
export function IdentityIntro({ onNavigate, reduced, active = true, entrySignal = 0 }: Props) {
  const systemReduced = useSyncExternalStore(subscribeReducedMotion, readReducedMotion, () => false);
  const physicsReduced = reduced || systemReduced;
  const getSize = () => ({ w: window.innerWidth, h: window.innerHeight - (window.innerWidth <= 600 ? 80 : window.innerWidth <= 900 ? 85 : 100) });
  const [size, setSize] = useState(getSize);
  const scene = useRef<HTMLElement>(null);
  const wakeMotion = useRef<() => void>(() => {});
  const requestDrop = useRef(true);
  const lastEntry = useRef(entrySignal);
  const [render, setRender] = useState({ dragging: false, ready: false });
  const assembly = useRef<HTMLDivElement>(null);
  const straps = useRef<SVGSVGElement>(null);
  const tension = useRef<HTMLElement>(null);
  const renderedStatus = useRef({ dragging: false, ready: false });
  const motion = useRef<Motion>({ x: 0, y: 0, vx: 0, vy: 0, angle: 0, angularVelocity: 0 });
  const entryDrop = useRef<EntryDrop | null>(null);
  const capture = useRef<HTMLElement | SVGSVGElement | null>(null);
  const drag = useRef({ active: false, id: -1, sx: 0, sy: 0, ox: 0, oy: 0, tx: 0, ty: 0, lastX: 0, lastY: 0, lastTime: 0, vx: 0, vy: 0 });
  const scale = Math.min(1, Math.max(.56, (size.h - 220) / 485), size.w < 600 ? .87 : 1);
  const anchorX = size.w < 760 ? size.w / 2 : size.w * .27;
  const restY = Math.max(106, Math.min(205, size.h * .23));
  useLayoutEffect(() => {
    if (lastEntry.current === entrySignal) return;
    lastEntry.current = entrySignal;
    requestDrop.current = true;
    wakeMotion.current();
  }, [entrySignal]);
  useLayoutEffect(() => {
    const element = scene.current;
    if (!element) return;
    const resize = () => {
      const w = element.clientWidth;
      const h = getSize().h;
      setSize(previous => {
        // Mobile browser chrome changes innerHeight during scrolling; it must not
        // reposition the ceiling mount, card, or strap until the layout width changes.
        if (w === previous.w && (w < 760 || h === previous.h)) return previous;
        drag.current.active = false;
        return { w, h };
      });
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    window.addEventListener('resize', resize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);
  useLayoutEffect(() => {
    let frame = 0; let previous = performance.now(); let visible = false;
    const groups = Array.from(straps.current?.querySelectorAll<SVGGElement>(':scope > g') ?? []).map(group => ({
      group, rects: Array.from(group.querySelectorAll(':scope > rect')), image: group.querySelector(':scope > svg'),
    }));
    const paint = () => {
      const state = motion.current;
      const y = state.y + (entryDrop.current?.y ?? 0);
      if (assembly.current) assembly.current.style.transform = `translate3d(calc(-50% + ${state.x.toFixed(3)}px),${y.toFixed(3)}px,0) rotate(${state.angle.toFixed(3)}deg) scale(${scale})`;
      groups.forEach(({ group, rects, image }, index) => {
        const side = index === 0 ? -1 : 1;
        const ax = anchorX + side * 36;
        const dx = state.x + side * 8 - side * 36;
        const endY = restY + y + 3;
        const length = Math.hypot(dx, Math.max(0, endY));
        group.setAttribute('visibility', endY < 0 ? 'hidden' : 'visible');
        group.setAttribute('transform', `translate(${ax},0) rotate(${-Math.atan2(dx, Math.max(0, endY)) * 180 / Math.PI})`);
        rects.forEach(rect => rect.setAttribute('height', String(length)));
        image?.setAttribute('height', String(length + 12));
      });
      if (tension.current) tension.current.style.width = `${Math.max(0, Math.min(1, state.y / PULL_THRESHOLD)) * 100}%`;
      const ready = state.y >= PULL_THRESHOLD;
      if (renderedStatus.current.dragging !== drag.current.active || renderedStatus.current.ready !== ready) {
        renderedStatus.current = { dragging: drag.current.active, ready };
        setRender({ dragging: drag.current.active, ready });
      }
    };
    const animate = (now: number) => {
      frame = 0;
      if (document.hidden || !visible) return;
      const d = drag.current;
      if (requestDrop.current && !d.active) beginEntry();
      const dt = Math.min((now - previous) / 1000, .08);
      stepMotion(motion.current, d.active ? { x: d.tx, y: d.ty } : { x: 0, y: 0 }, dt, d.active, restY, physicsReduced);
      const drop = entryDrop.current;
      if (drop) {
        stepEntryDrop(drop, dt, physicsReduced);
        if (Math.abs(drop.y) < .02 && Math.abs(drop.vy) < .05) entryDrop.current = null;
      }
      previous = now;
      const state = motion.current;
      const settled = !entryDrop.current && !d.active && Math.abs(state.x) < .02 && Math.abs(state.y) < .02
        && Math.abs(state.vx) < .05 && Math.abs(state.vy) < .05 && Math.abs(state.angle) < .02 && Math.abs(state.angularVelocity) < .05;
      if (settled) Object.assign(state, { x: 0, y: 0, vx: 0, vy: 0, angle: 0, angularVelocity: 0 });
      if (scene.current) scene.current.dataset.idMotion = d.active ? 'dragging' : entryDrop.current ? 'entering' : settled ? 'resting' : 'settling';
      paint();
      if (!settled) frame = requestAnimationFrame(animate);
    };
    const beginEntry = () => {
      requestDrop.current = false;
      entryDrop.current = null;
      if (!physicsReduced) {
        const height = (assembly.current?.offsetHeight ?? 471) * scale;
        entryDrop.current = { x: 0, y: -restY - height - 24, vx: 0, vy: 0, angle: 0, angularVelocity: 0, caught: false };
        const x = Math.min(28, restY * .14);
        Object.assign(motion.current, { x, y: -pendulumRise(x, restY), vx: -18, vy: 0, angle: -4, angularVelocity: 0 });
      }
    };
    if (!active) {
      // Keep the ID above the scene throughout the console reveal, so it
      // doesn't flash at rest before beginning its drop.
      beginEntry();
      requestDrop.current = true;
      paint();
      return;
    }
    const wake = () => {
      if (visible && !document.hidden && !frame) {
        if (requestDrop.current && !drag.current.active) {
          beginEntry();
          paint();
        }
        previous = performance.now(); frame = requestAnimationFrame(animate);
      }
      else if (!visible || document.hidden) {
        cancelAnimationFrame(frame); frame = 0; drag.current.active = false;
        entryDrop.current = null;
        Object.assign(motion.current, { x: 0, y: 0, vx: 0, vy: 0, angle: 0, angularVelocity: 0 });
        if (scene.current) scene.current.dataset.idMotion = 'resting';
        paint();
      }
    };
    wakeMotion.current = wake;
    const headerHeight = document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 100;
    const bounds = scene.current?.getBoundingClientRect();
    visible = !!bounds && bounds.bottom > headerHeight && bounds.top < innerHeight * .8;
    if (visible) wake();
    else paint();
    const observer = new IntersectionObserver(entries => {
      const nextVisible = entries[0].isIntersecting && entries[0].intersectionRect.height > 1;
      visible = nextVisible;
      wake();
    }, { rootMargin: `-${headerHeight}px 0px -20% 0px`, threshold: .05 });
    if (scene.current) observer.observe(scene.current);
    document.addEventListener('visibilitychange', wake);
    return () => { cancelAnimationFrame(frame); wakeMotion.current = () => {}; observer.disconnect(); document.removeEventListener('visibilitychange', wake); };
  }, [restY, physicsReduced, anchorX, scale, active]);
  const start = (e: ReactPointerEvent<HTMLElement | SVGSVGElement>) => {
    if (!active || !e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0) || drag.current.active) return;
    if (entryDrop.current && !entryDrop.current.caught) return;
    e.preventDefault();
    if (e.currentTarget instanceof HTMLElement) e.currentTarget.focus({ preventScroll: true });
    e.currentTarget.setPointerCapture(e.pointerId);
    capture.current = e.currentTarget;
    requestDrop.current = false;
    // Taking hold during the entrance keeps the current pose without a jump.
    if (entryDrop.current) {
      motion.current.y += entryDrop.current.y;
      motion.current.vy += entryDrop.current.vy;
      entryDrop.current = null;
    }
    drag.current = { active: true, id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: motion.current.x, oy: motion.current.y, tx: motion.current.x, ty: motion.current.y,
      lastX: e.clientX, lastY: e.clientY, lastTime: performance.now(), vx: 0, vy: 0 };
    wakeMotion.current();
  };
  const move = useCallback((e: { pointerId: number; clientX: number; clientY: number }) => {
    const d = drag.current; if (!d.active || e.pointerId !== d.id) return;
    const now = performance.now(), elapsed = (now - d.lastTime) / 1000;
    if (elapsed > .001) {
      const blend = 1 - Math.exp(-elapsed / .045);
      d.vx += (clamp((e.clientX - d.lastX) / elapsed, -900, 900) - d.vx) * blend;
      d.vy += (clamp((e.clientY - d.lastY) / elapsed, -900, 900) - d.vy) * blend;
      d.lastX = e.clientX; d.lastY = e.clientY; d.lastTime = now;
    }
    const target = dragTarget(e.clientX - d.sx + d.ox, e.clientY - d.sy + d.oy + pendulumRise(d.ox, restY), Math.min(125, size.w * .24), restY);
    d.tx = target.x; d.ty = target.y;
    wakeMotion.current();
  }, [size.w, restY]);
  const release = useCallback((e: { pointerId: number; type: string }) => {
    const d = drag.current; if (!d.active || e.pointerId !== d.id) return;
    d.active = false;
    // Retain some hand momentum only on an intentional, recent release. A
    // cancellation or capture loss must settle safely without adding a fling.
    if (!physicsReduced && e.type === 'pointerup' && performance.now() - d.lastTime < 80) {
      motion.current.vx = clamp(motion.current.vx * .8 + d.vx * .2, -360, 360);
      motion.current.vy = clamp(motion.current.vy * .9 + d.vy * .1, -300, 300);
      if (motion.current.x * motion.current.vx > 0) {
        const limit = Math.min(150, Math.max(100, restY) * .75);
        const outwardSpeed = Math.sqrt(Math.max(0, (limit * limit - motion.current.x ** 2) * clamp(1800 / restY, 6, 18))) * .8;
        motion.current.vx = clamp(motion.current.vx, -outwardSpeed, outwardSpeed);
      }
    }
    const element = capture.current;
    capture.current = null;
    if (element?.hasPointerCapture(d.id)) element.releasePointerCapture(d.id);
    wakeMotion.current();
  }, [physicsReduced, restY]);
  useEffect(() => {
    // Global tracking also handles release outside the card or a capture loss.
    const pointerMove = (e: PointerEvent) => {
      if (drag.current.active && e.pointerId === drag.current.id && e.buttons === 0 && e.pointerType === 'mouse') release({ pointerId: e.pointerId, type: 'pointercancel' });
      else move(e.getCoalescedEvents?.().at(-1) ?? e);
    };
    const pointerRelease = (e: PointerEvent) => release(e);
    const blur = () => release({ pointerId: drag.current.id, type: 'pointercancel' });
    window.addEventListener('pointermove', pointerMove, true);
    window.addEventListener('pointerup', pointerRelease, true);
    window.addEventListener('pointercancel', pointerRelease, true);
    window.addEventListener('blur', blur);
    window.addEventListener('scroll', blur, { passive: true });
    window.addEventListener('wheel', blur, { passive: true });
    return () => {
      blur();
      window.removeEventListener('pointermove', pointerMove, true);
      window.removeEventListener('pointerup', pointerRelease, true);
      window.removeEventListener('pointercancel', pointerRelease, true);
      window.removeEventListener('blur', blur);
      window.removeEventListener('scroll', blur);
      window.removeEventListener('wheel', blur);
    };
  }, [move, release]);
  const x = anchorX; const y = restY;
  const ready = render.ready;
  return <section ref={scene} className="identity-intro" aria-label="Interactive ID introduction">
    <div className="intro-grain" /><div className="room-light" />
    <div className="ceiling-mount" style={{ left: anchorX }}><i /><i /></div>
    <svg ref={straps} className="lanyard-canvas" width={size.w} height={size.h} onPointerDown={start} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release} aria-label="Lanyard strap. Drag the card below to interact.">
      <defs><linearGradient id="navy" x1="0" x2="1"><stop stopColor="#0b1630" /><stop offset=".5" stopColor="#1f3051" /><stop offset="1" stopColor="#0a1528" /></linearGradient><pattern id="weave" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 1H3" stroke="#64728c" strokeOpacity=".25" /></pattern></defs>
      {[-1, 1].map(side => {
        const ax = anchorX + side * 36; const endX = x + side * 8;
        const dx = endX - ax; const length = Math.hypot(dx, y + 3); const angle = -Math.atan2(dx, y + 3) * 180 / Math.PI;
        return <g key={side} transform={`translate(${ax},0) rotate(${angle})`}><rect x="-13" width="26" height={length} rx="2" fill="url(#navy)" /><rect x="-13" width="26" height={length} fill="url(#weave)" /><svg x="-13" y="-12" width="26" height={length + 12} viewBox="440 0 180 1484" preserveAspectRatio="none"><image href={portfolio.strapImage} width="1024" height="1484" /></svg></g>;
      })}
    </svg>
    <div ref={assembly} className={`id-assembly ${render.dragging ? 'is-grabbed' : ''} ${ready ? 'is-ready' : ''}`} style={{ left: x, top: y, transform: `translate3d(-50%,0,0) scale(${scale})` }} onPointerDown={start} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release} tabIndex={0} role="button" aria-label="Drag the ID to sway it, or press Enter to give it a gentle swing" onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); requestDrop.current = false; motion.current.vx = physicsReduced ? 0 : 80; wakeMotion.current(); } }}>
      <svg className="id-hardware" width="84" height="138" viewBox="0 0 84 138" aria-hidden="true">
        <defs><linearGradient id="metal"><stop stopColor="#6c716e" /><stop offset=".48" stopColor="#d2d6ca" /><stop offset=".7" stopColor="#686e67" /><stop offset="1" stopColor="#323a35" /></linearGradient><pattern id="gold-weave" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#ad872e" /><path d="M0 1H4" stroke="#d5b45d" strokeWidth="1" opacity=".5" /></pattern></defs>
        <path d="M25 0H59V18L63 28V47H21V28L25 18Z" fill="#181f22" stroke="#3b4347" strokeWidth="1.3" /><path d="M25 6H59M27 36H57M27 40H57" stroke="#434b4b" strokeWidth="2" />
        <path d="M30 47H54V97H30Z" fill="url(#gold-weave)" stroke="#6a5528" /><circle cx="42" cy="72" r="8" fill="none" stroke="#343d37" strokeWidth="1.6" /><text x="42" y="75" fontSize="7" textAnchor="middle" fill="#343d37" fontWeight="bold">JRU</text><text x="42" y="90" fontSize="4" textAnchor="middle" fill="#343d37">est. 1919</text>
        <path d="M27 95V100Q42 106 57 100V95" fill="none" stroke="url(#metal)" strokeWidth="4" /><path d="M42 103V121Q42 134 37 132Q33 130 37 120" fill="none" stroke="url(#metal)" strokeWidth="4" />
      </svg>
      <img className="actual-id" src={portfolio.idImage} alt="Dayer C. Aniog’s José Rizal University college ID in its original clear holder" width="1024" height="1536" draggable={false} fetchPriority="high" />
      <div className="id-ground-shadow" />
    </div>

    <div className="intro-copy">
      <span className="eyebrow intro-anim intro-anim--1">DESIGN WITH PURPOSE. BUILD WITH CARE.</span>
      <h1 className="intro-anim intro-anim--2" aria-label="Hi, I'm Dayer Aniog."><TypewriterText active={active} text={'Hi, I’m\nDayer Aniog.'} disabled={reduced} /></h1>
      <div className="intro-roles intro-anim intro-anim--3">{portfolio.title}</div>
      <p className="intro-anim intro-anim--4">{portfolio.intro}</p>
      <div className="hero-actions intro-anim intro-anim--5">
        <a className="button button-outline" href={routeHref('/projects')} onClick={e => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) { e.preventDefault(); onNavigate('/projects'); } }}>View Projects <ArrowUpRight size={16} /></a>
        <button className="button button-outline" onClick={() => onNavigate('/about')}>About Me <ArrowUpRight size={16} /></button>
      </div>
      <span className="hero-location intro-anim intro-anim--6">BASED IN THE PHILIPPINES</span>
    </div>
    <div className={`pull-guide ${ready ? 'ready' : ''}`}><ArrowDown size={14} strokeWidth={1.4} /><p aria-live="polite">{render.dragging ? 'Release to let it sway' : 'Drag to interact'}</p><div className="tension-track"><i ref={tension} /></div></div>
  </section>;
}
