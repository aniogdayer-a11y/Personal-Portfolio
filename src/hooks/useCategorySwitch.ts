import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/** Exit old content before mounting the next view; interpolate its container height. */
export function useCategorySwitch(category: string, enabled: boolean) {
  const [displayed, setDisplayed] = useState(category);
  const [phase, setPhase] = useState('idle');
  const stage = useRef<HTMLDivElement>(null);
  const previousHeight = useRef<number | null>(null);
  const heightAnimation = useRef<Animation | null>(null);
  const controls = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const select = (next: string) => {
    timers.current.forEach(clearTimeout);
    heightAnimation.current?.cancel();
    if (next === displayed) { setPhase('idle'); return; }
    previousHeight.current = stage.current?.getBoundingClientRect().height ?? null;
    if (!enabled) { setDisplayed(next); setPhase('idle'); return; }
    setPhase('leaving');
    // Keep the controls on screen when changing a category far down a tall view.
    const bounds = controls.current?.getBoundingClientRect();
    if (bounds && bounds.top < 100) controls.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    timers.current = [setTimeout(() => {
      setDisplayed(next); setPhase('entering');
      timers.current = [setTimeout(() => setPhase('idle'), 380)];
    }, 130)];
  };

  useLayoutEffect(() => {
    const element = stage.current;
    if (!element || previousHeight.current === null || !enabled) return;
    const before = previousHeight.current;
    previousHeight.current = null;
    const after = element.getBoundingClientRect().height;
    const animation = element.animate([{ height: `${before}px` }, { height: `${after}px` }], { duration: 380, easing: 'cubic-bezier(.22,.68,.2,1)' });
    heightAnimation.current = animation;
    return () => { animation.cancel(); };
  }, [displayed, enabled]);

  useEffect(() => {
    const activeTimers = timers;
    return () => { heightAnimation.current?.cancel(); activeTimers.current.forEach(clearTimeout); };
  }, []);
  return { displayed, phase, stage, controls, select };
}
