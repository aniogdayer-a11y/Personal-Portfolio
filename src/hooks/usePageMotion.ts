import { useLayoutEffect } from 'react';
import type { RefObject } from 'react';

const revealTargets = '.featured-project,.booth-photograph,.project-card,.credential-gallery article,.skill-groups article,.timeline-item,.ai-dock-container,.ai-reference-card,.project-artwork-hero,.artwork-grid figure,.stack-list>div';
const textTargets = '.motion-title,h2,h3,p,.eyebrow,.profile-disciplines,.hero-actions,.hero-caption';

export function usePageMotion(root: RefObject<HTMLElement | null>, route: string, disabled: boolean) {
  useLayoutEffect(() => {
    const element = root.current;
    if (!element || disabled) return;
    const observed = new Set<HTMLElement>();
    const textObserved = new Set<HTMLElement>();
    const show = (target: HTMLElement) => { target.dataset.reveal = 'visible'; observer.unobserve(target); };
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) show(entry.target as HTMLElement);
    }), { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    const textObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      (entry.target as HTMLElement).dataset.textReveal = 'visible';
      textObserver.unobserve(entry.target);
    }), { threshold: 0.12, rootMargin: '0px 0px -20px 0px' });
    const collect = () => {
      element.querySelectorAll<HTMLElement>(revealTargets).forEach(target => {
        if (observed.has(target)) return;
        observed.add(target);
        target.dataset.reveal = 'pending';
        observer.observe(target);
      });
      element.querySelectorAll<HTMLElement>(textTargets).forEach(target => {
        // Leave live controls, artwork captions, and modal content immediately readable.
        if (textObserved.has(target) || target.closest('dialog,button,.showcase-card,[aria-live],.project-video,.edufocus-teaser-player')) return;
        textObserved.add(target);
        target.dataset.textReveal = 'pending';
        const delay = target.matches('.eyebrow') ? 0 : target.matches('.motion-title,h2,h3') ? 70 : 150;
        target.style.setProperty('--copy-delay', `${delay}ms`);
        textObserver.observe(target);
      });
    };
    collect();
    // Filtering can introduce new cards without changing the page route.
    const changes = new MutationObserver(() => {
      observed.forEach(target => { if (!target.isConnected) { observer.unobserve(target); observed.delete(target); } });
      textObserved.forEach(target => { if (!target.isConnected) { textObserver.unobserve(target); textObserved.delete(target); } });
      collect();
    });
    changes.observe(element, { childList: true, subtree: true });
    const focus = (event: FocusEvent) => {
      const target = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>('[data-reveal="pending"]') : null;
      if (target) show(target);
      const copy = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>('[data-text-reveal="pending"]') : null;
      if (copy) { copy.dataset.textReveal = 'visible'; textObserver.unobserve(copy); }
    };
    element.addEventListener('focusin', focus);
    return () => {
      observer.disconnect(); textObserver.disconnect(); changes.disconnect(); element.removeEventListener('focusin', focus);
      observed.forEach(target => { delete target.dataset.reveal; });
      textObserved.forEach(target => { delete target.dataset.textReveal; target.style.removeProperty('--copy-delay'); });
    };
  }, [root, route, disabled]);
}
