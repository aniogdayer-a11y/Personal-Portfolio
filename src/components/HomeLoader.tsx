import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { portfolio } from '../data/portfolioData';

interface Props { onReveal: () => void; onComplete: () => void }
type Phase = 'waiting' | 'inserting' | 'booting' | 'zooming' | 'skipping';

export function HomeLoader({ onReveal, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('waiting');
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [overSlot, setOverSlot] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const cartridge = useRef<HTMLButtonElement>(null);
  const phaseRef = useRef<Phase>('waiting');
  const drag = useRef<{ id: number; x: number; y: number; scale: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const schedule = useCallback((callback: () => void, ms: number) => {
    timers.current.push(setTimeout(callback, ms));
  }, []);
  const changePhase = useCallback((next: Phase) => { phaseRef.current = next; setPhase(next); }, []);
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const skip = useCallback(() => {
    if (phaseRef.current === 'skipping') return;
    timers.current.forEach(clearTimeout);
    changePhase('skipping'); onReveal(); schedule(onComplete, 350);
  }, [changePhase, onReveal, onComplete, schedule]);
  const zoom = useCallback(() => {
    if (phaseRef.current !== 'booting') return;
    const bounds = screen.current?.getBoundingClientRect();
    if (bounds && world.current) {
      const x = bounds.x + bounds.width / 2, y = bounds.y + bounds.height / 2;
      world.current.style.setProperty('--portal-x', `${x}px`);
      world.current.style.setProperty('--portal-y', `${y}px`);
      world.current.style.setProperty('--camera-x', `${innerWidth / 2 - x}px`);
      world.current.style.setProperty('--camera-y', `${innerHeight / 2 - y}px`);
      world.current.style.setProperty('--camera-scale', String(Math.max(innerWidth / bounds.width, innerHeight / bounds.height) * 1.35));
    }
    changePhase('zooming');
    if (reduced()) { onReveal(); schedule(onComplete, 350); }
    else { schedule(onReveal, 850); schedule(onComplete, 1750); }
  }, [changePhase, onReveal, onComplete, schedule]);
  const insert = () => {
    if (phaseRef.current !== 'waiting') return;
    setDragging(false); setOverSlot(false); changePhase('inserting');
    schedule(() => changePhase('booting'), reduced() ? 100 : 700);
  };
  useEffect(() => {
    let cancelled = false;
    const load = (src: string) => new Promise<void>(resolve => {
      const image = new Image(); image.onload = image.onerror = () => resolve(); image.src = src;
    });
    const fallback = setTimeout(() => { if (!cancelled) setReady(true); }, 5000);
    Promise.allSettled([load(portfolio.idImage), load(portfolio.strapImage), document.fonts.ready])
      .then(() => { if (!cancelled) { clearTimeout(fallback); setReady(true); } });
    cartridge.current?.focus({ preventScroll: true });
    return () => { cancelled = true; clearTimeout(fallback); timers.current.forEach(clearTimeout); };
  }, []);
  useEffect(() => {
    if (phase !== 'booting' || !ready) return;
    const timer = setTimeout(zoom, reduced() ? 150 : 1500);
    return () => clearTimeout(timer);
  }, [phase, ready, zoom]);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); skip(); }
      if (event.key !== 'Tab') return;
      const buttons = Array.from(root.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []);
      const first = buttons[0], last = buttons.at(-1);
      if (event.shiftKey && (document.activeElement === first || !buttons.includes(document.activeElement as HTMLButtonElement))) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !buttons.includes(document.activeElement as HTMLButtonElement))) { event.preventDefault(); first?.focus(); }
    };
    window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key);
  }, [skip]);
  const atSlot = () => {
    const card = cartridge.current?.getBoundingClientRect(), target = slot.current?.getBoundingClientRect();
    if (!card || !target) return false;
    const x = card.x + card.width / 2;
    return x > target.left - 35 && x < target.right + 35 && card.bottom > target.top + 4 && card.top < target.bottom + 40;
  };
  const resetDrag = () => {
    drag.current = null; setDragging(false); setOverSlot(false);
    cartridge.current?.style.setProperty('--drag-x', '0px'); cartridge.current?.style.setProperty('--drag-y', '0px');
  };
  const pointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (phaseRef.current !== 'waiting' || !event.isPrimary || event.button !== 0) return;
    suppressClick.current = false;
    const stage = event.currentTarget.parentElement!;
    const scale = stage.getBoundingClientRect().width / stage.offsetWidth;
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, scale, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId); setDragging(true);
  };
  const pointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const start = drag.current; if (!start || start.id !== event.pointerId) return;
    const x = event.clientX - start.x, y = event.clientY - start.y;
    if (Math.hypot(x, y) > 6) start.moved = true;
    event.currentTarget.style.setProperty('--drag-x', `${x / start.scale}px`); event.currentTarget.style.setProperty('--drag-y', `${y / start.scale}px`);
    setOverSlot(atSlot());
  };
  const pointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    const start = drag.current; if (!start || start.id !== event.pointerId) return;
    const accepted = start.moved && atSlot(); suppressClick.current = start.moved;
    drag.current = null; setDragging(false); setOverSlot(false);
    if (accepted) insert(); else resetDrag();
  };
  const message = phase === 'waiting' ? 'Drag the cartridge into the slot, or tap to insert.' : phase === 'inserting' ? 'Cartridge connected.' : phase === 'booting' ? 'Starting your experience…' : 'Welcome to my portfolio.';
  return <div ref={root} className={`home-loader console-loader${phase === 'zooming' ? ' is-leaving' : ''}${phase === 'skipping' ? ' is-skipping' : ''}`} data-phase={phase} role="dialog" aria-modal="true" aria-label="Interactive portfolio console" aria-describedby="console-instructions">
    <div className="loader-world" ref={world}>
      <div className="loader-curtain" aria-hidden="true" />
      <div className="console-scene">
        <div className={`console-stage${overSlot ? ' is-over-slot' : ''}`}>
          <div ref={slot} className="console-slot" aria-hidden="true"><span /></div>
          <button ref={cartridge} type="button" className={`game-cartridge${dragging ? ' is-dragging' : ''}`} disabled={phase !== 'waiting'} aria-label="Insert portfolio cartridge" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={() => { suppressClick.current = true; resetDrag(); }} onLostPointerCapture={() => { if (drag.current) resetDrag(); }} onClick={() => { if (suppressClick.current) { suppressClick.current = false; return; } insert(); }}>
            <span className="cartridge-grip" aria-hidden="true" />
            <span className="cartridge-label"><span>DA.</span><small>PORTFOLIO</small><span className="cartridge-edition">VOL. 01</span></span>
            <span className="cartridge-contacts" aria-hidden="true" />
          </button>
          <div className="console-insert-guide" aria-hidden="true">⌄</div>
          <div className="game-console">
            <div className="console-topline" aria-hidden="true"><span>DA / PLAY</span><span className="console-power" /></div>
            <div className="console-dpad" aria-hidden="true"><span /></div>
            <div className="console-bezel">
              <div className="console-screen" ref={screen} aria-hidden="true">
                <div className="console-screen-content"><span className="screen-pixel-mark">DA.</span><span>{phase === 'waiting' || phase === 'inserting' ? 'INSERT CARTRIDGE' : 'HELLO, PLAYER.'}</span><span className="screen-boot-line" /></div>
                <div className="screen-glass" />
                <div className="screen-signal" />
              </div>
              <span className="console-screen-brand" aria-hidden="true">DESIGN. BUILD. PLAY.</span>
            </div>
            <div className="console-action-buttons" aria-hidden="true"><span>B</span><span>A</span></div>
            <div className="console-menu-buttons" aria-hidden="true"><span /><span /></div>
            <div className="console-speaker" aria-hidden="true"><i /><i /><i /><i /></div>
          </div>
          <div className="console-ground-shadow" aria-hidden="true" />
        </div>
        <p className="sr-only" id="console-instructions" role="status">{message}</p>
      </div>
    </div>
    <div className="loader-bottom"><button type="button" onClick={skip} disabled={phase === 'skipping'}>Skip intro <span aria-hidden="true">↗</span></button></div>
  </div>;
}
