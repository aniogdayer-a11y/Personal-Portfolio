import { useId } from 'react';
import type { ProjectImage } from '../data/portfolioData';

/** View an original board region through SVG; the supplied image stays unchanged. */
export function ProjectArtwork({ asset, original = false, eager = false, className = '' }: { asset: ProjectImage; original?: boolean; eager?: boolean; className?: string }) {
  const clipId = useId();
  const src = original ? asset.original : asset.src;
  if (!asset.viewport) return <img className={`project-artwork ${className}`} src={src} alt={asset.alt} width={asset.width} height={asset.height} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable={false} />;
  const { x, y, sourceWidth, sourceHeight } = asset.viewport;
  return <svg className={`project-artwork frame-artwork ${className}`} viewBox={`${x} ${y} ${asset.width} ${asset.height}`} width={asset.width} height={asset.height} role="img" aria-label={asset.alt}>
    <defs><clipPath id={clipId}><rect x={x} y={y} width={asset.width} height={asset.height} /></clipPath></defs>
    <image href={src} x="0" y="0" width={sourceWidth} height={sourceHeight} preserveAspectRatio="none" clipPath={`url(#${clipId})`} onLoad={event => event.currentTarget.parentElement?.setAttribute('data-loaded', 'true')} />
  </svg>;
}
