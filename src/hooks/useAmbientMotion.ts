import { useEffect } from 'react';
import type { RefObject } from 'react';

/** Run ambient movement only while its artwork is on screen. */
export function useAmbientMotion(root: RefObject<HTMLElement | null>, route: string, enabled: boolean) {
  useEffect(() => {
    const element = root.current;
    if (!element || !enabled) return;
    const targets = new Set<HTMLElement>();
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      (entry.target as HTMLElement).dataset.motionVisible = String(entry.isIntersecting);
    }), { threshold: 0.05 });
    const collect = () => {
      targets.forEach(target => { if (!target.isConnected) { observer.unobserve(target); targets.delete(target); } });
      element.querySelectorAll<HTMLElement>('.project-visual,.project-float,.project-image,.featured-project>img,.booth-photograph img,.portrait-tools,.toolkit-float,.floating-ai-cluster,.ai-dock-shelf').forEach(target => {
        if (!targets.has(target)) { targets.add(target); observer.observe(target); }
      });
    };
    collect();
    const changes = new MutationObserver(collect);
    changes.observe(element, { childList: true, subtree: true });
    return () => { observer.disconnect(); changes.disconnect(); targets.forEach(target => { delete target.dataset.motionVisible; }); };
  }, [root, route, enabled]);
}
