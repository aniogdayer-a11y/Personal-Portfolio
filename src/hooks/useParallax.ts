import { useEffect } from 'react';
import type { RefObject } from 'react';

type Layer = { x: number; y: number; depth: number; visible: boolean };
const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

/** Event-driven depth: native scrolling, one settling frame loop, no React renders. */
export function useParallax(root: RefObject<HTMLElement | null>, route: string, enabled: boolean) {
  useEffect(() => {
    const container = root.current;
    if (!container || !enabled) return;
    const layers = new Map<HTMLElement, Layer>();
    let frame = 0;
    let previous = 0;
    let pointer: { x: number; y: number } | null = null;
    const tick = (now: number) => {
      frame = 0;
      if (document.hidden || container.inert || document.querySelector('dialog[open]')) return;
      const ease = 1 - Math.exp(-Math.min(now - previous || 16, 48) / 110);
      previous = now;
      let settling = false;
      // Read all geometry before writing transforms to avoid layout thrashing.
      const updates: { element: HTMLElement; layer: Layer; x: number; y: number }[] = [];
      const mobile = innerWidth < 760;
      layers.forEach((layer, element) => {
        if (!layer.visible) return;
        const rect = element.getBoundingClientRect();
        const scene = element.closest('[data-parallax-scene]')?.getBoundingClientRect();
        // Use the stable scene for floating children, so their idle motion cannot
        // keep waking the scroll easing loop after the visitor stops interacting.
        const center = scene ? scene.top + scene.height / 2 : rect.top - layer.y + rect.height / 2;
        const inside = pointer && scene && pointer.x >= scene.left && pointer.x <= scene.right && pointer.y >= scene.top && pointer.y <= scene.bottom;
        const px = inside ? clamp((pointer!.x - scene!.left) / scene!.width - .5, .5) * 2 : 0;
        const py = inside ? clamp((pointer!.y - scene!.top) / scene!.height - .5, .5) * 2 : 0;
        const limit = mobile ? 14 : 38;
        const targetX = mobile ? 0 : px * layer.depth * 105;
        const targetY = clamp((innerHeight * .5 - center) * layer.depth, limit) + (mobile ? 0 : py * layer.depth * 75);
        const x = layer.x + (targetX - layer.x) * ease;
        const y = layer.y + (targetY - layer.y) * ease;
        if (Math.abs(targetX - x) > .08 || Math.abs(targetY - y) > .08) settling = true;
        updates.push({ element, layer, x, y });
      });
      updates.forEach(({ element, layer, x, y }) => {
        layer.x = x; layer.y = y;
        element.style.setProperty('--depth-x', `${x.toFixed(2)}px`);
        element.style.setProperty('--depth-y', `${y.toFixed(2)}px`);
      });
      if (settling) frame = requestAnimationFrame(tick);
    };
    const wake = () => { if (!frame && !document.hidden) { previous = performance.now(); frame = requestAnimationFrame(tick); } };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { const layer = layers.get(entry.target as HTMLElement); if (layer) layer.visible = entry.isIntersecting; });
      wake();
    }, { rootMargin: '80px', threshold: 0 });
    const collect = () => {
      layers.forEach((_, element) => { if (!element.isConnected) { observer.unobserve(element); layers.delete(element); } });
      container.querySelectorAll<HTMLElement>('[data-parallax]').forEach(element => {
        if (!layers.has(element)) { layers.set(element, { x: 0, y: 0, depth: Number(element.dataset.parallax) || .08, visible: false }); observer.observe(element); }
      });
      wake();
    };
    const move = (event: PointerEvent) => { if (event.pointerType !== 'mouse') return; pointer = { x: event.clientX, y: event.clientY }; wake(); };
    const leave = () => { pointer = null; wake(); };
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else wake(); };
    const changes = new MutationObserver(collect);
    changes.observe(container, { childList: true, subtree: true });
    collect();
    window.addEventListener('scroll', wake, { passive: true });
    window.addEventListener('resize', wake);
    container.addEventListener('pointermove', move, { passive: true });
    container.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); changes.disconnect();
      window.removeEventListener('scroll', wake); window.removeEventListener('resize', wake);
      container.removeEventListener('pointermove', move); container.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', visibility);
      layers.forEach((_, element) => { element.style.removeProperty('--depth-x'); element.style.removeProperty('--depth-y'); });
    };
  }, [root, route, enabled]);
}
