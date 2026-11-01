import { useCallback, useLayoutEffect, useRef } from 'react';
import Lenis from 'lenis';

// Keep the browser's real scroll position so sticky elements, focus, and parallax
// continue to work. Touch scrolling and nested interactive surfaces stay native.
export function useSmoothScroll(route: string) {
  const instance = useRef<Lenis | null>(null);
  const resetScroll = useCallback(() => {
    const scroll = instance.current;
    if (scroll) {
      scroll.resize();
      scroll.scrollTo(0, { immediate: true, force: true });
    } else window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useLayoutEffect(() => {
    const previousRestoration = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    const cancelMomentum = () => scroll.scrollTo(window.scrollY, { immediate: true, force: true });
    const nativeSurface = 'dialog, .site-nav, textarea, select, video';
    const scroll = new Lenis({
      autoRaf: true,
      lerp: 0.12,
      smoothWheel: true,
      syncTouch: false,
      anchors: false,
      prevent: node => node.matches(nativeSurface),
      virtualScroll: ({ event, deltaX, deltaY }) => {
        // The gallery consumes vertical wheels itself. At either end it lets
        // them bubble normally, allowing the page to continue scrolling.
        if (event.defaultPrevented || event.shiftKey || Math.abs(deltaX) > Math.abs(deltaY)
          || (event.target instanceof Element && event.target.closest(nativeSurface))) {
          cancelMomentum();
          return false;
        }
        return true;
      },
    });
    instance.current = scroll;
    const syncLock = () => {
      const overflow = document.body.style.overflow;
      if (document.hidden || overflow === 'hidden' || overflow === 'clip') scroll.stop();
      else scroll.start();
    };
    const keyboard = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) cancelMomentum();
    };
    const lockObserver = new MutationObserver(syncLock);
    lockObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    syncLock();
    document.addEventListener('visibilitychange', syncLock);
    window.addEventListener('pointerdown', cancelMomentum, { capture: true, passive: true });
    window.addEventListener('keydown', keyboard, true);
    return () => {
      lockObserver.disconnect();
      document.removeEventListener('visibilitychange', syncLock);
      window.removeEventListener('pointerdown', cancelMomentum, true);
      window.removeEventListener('keydown', keyboard, true);
      scroll.destroy();
      instance.current = null;
      history.scrollRestoration = previousRestoration;
    };
  }, []);

  useLayoutEffect(resetScroll, [route, resetScroll]);
  return resetScroll;
}
