import type { PointerEvent } from 'react';
import { motionAllowed } from '../hooks/useMotionPreference';

/** Give the original presentation a little depth without modifying its artwork. */
export function ProjectVisual({ src, alt, width, height, eager = false, className = '' }: { src: string; alt: string; width?: number; height?: number; eager?: boolean; className?: string }) {
  const move = (event: PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== 'mouse' || !motionAllowed()) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--visual-x', `${((event.clientX - bounds.left) / bounds.width - .5) * 7}deg`);
    event.currentTarget.style.setProperty('--visual-y', `${(.5 - (event.clientY - bounds.top) / bounds.height) * 6}deg`);
  };
  return <span className={`project-visual ${className}`} onPointerMove={move} onPointerLeave={event => { event.currentTarget.style.removeProperty('--visual-x'); event.currentTarget.style.removeProperty('--visual-y'); }}>
    <span className="project-visual-float"><span className="project-visual-tilt"><img src={src} alt={alt} width={width} height={height} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" /><span className="project-visual-reflection" aria-hidden="true" /></span></span>
  </span>;
}
