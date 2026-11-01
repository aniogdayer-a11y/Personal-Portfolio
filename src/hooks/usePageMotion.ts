import { useEffect } from 'react';
import type { RefObject } from 'react';

const revealTargets = '.page-heading,.showcase-heading,.section-title,.featured-project,.booth-photograph,.booth-feature-heading,.booth-feature-story,.project-card,.credential-gallery article,.skill-groups article,.timeline-item,.contact-layout,.about-editorial,.contact-banner,.creative-toolkit,.ai-applications-section,.ai-dock-container,.ai-reference-card,.project-artwork-hero,.detail-columns,.artwork-grid figure,.next-project,.stack-list>div';

export function usePageMotion(root: RefObject<HTMLElement | null>, route: string, disabled: boolean) {
  useEffect(() => {
    const element = root.current;
    if (!element || disabled) return;
    const observed = new Set<HTMLElement>();
    const show = (target: HTMLElement) => { target.dataset.reveal = 'visible'; observer.unobserve(target); };
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) show(entry.target as HTMLElement);
    }), { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    const collect = () => element.querySelectorAll<HTMLElement>(revealTargets).forEach(target => {
      if (observed.has(target)) return;
      observed.add(target);
      target.dataset.reveal = 'pending';
      observer.observe(target);
    });
    collect();
    // Filtering can introduce new cards without changing the page route.
    const changes = new MutationObserver(() => {
      observed.forEach(target => { if (!target.isConnected) { observer.unobserve(target); observed.delete(target); } });
      collect();
    });
    changes.observe(element, { childList: true, subtree: true });
    const focus = (event: FocusEvent) => {
      const target = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>('[data-reveal="pending"]') : null;
      if (target) show(target);
    };
    element.addEventListener('focusin', focus);
    return () => {
      observer.disconnect(); changes.disconnect(); element.removeEventListener('focusin', focus);
      observed.forEach(target => { delete target.dataset.reveal; });
    };
  }, [root, route, disabled]);
}
