import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { PortfolioProject } from '../data/portfolioData';
import { motionAllowed } from '../hooks/useMotionPreference';
import type { CSSProperties } from 'react';

/** Crossfades the real collection exports; never scrolls or moves focus. */
export function CollectionPoster({ project, playing }: { project: PortfolioProject; playing: boolean }) {
  const root = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const images = project.images ?? [];
  useEffect(() => {
    const element = root.current;
    if (!element || !playing || images.length < 2) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    let visible = false;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const stop = () => { clearInterval(timer); timer = undefined; };
    const sync = () => {
      stop();
      if (visible && !document.hidden && motionAllowed()) timer = setInterval(() => {
        setActive(current => {
          const next = (current + 1) % images.length;
          const image = element.querySelectorAll<HTMLImageElement>('.collection-frame img')[next];
          return image?.complete && image.naturalWidth > 0 ? next : current;
        });
      }, 4000);
    };
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) element.querySelectorAll<HTMLImageElement>('.collection-frame img').forEach(image => { image.loading = 'eager'; });
      sync();
    }, { threshold: 0.3 });
    observer.observe(element);
    document.addEventListener('visibilitychange', sync);
    preference.addEventListener('change', sync);
    return () => { stop(); observer.disconnect(); document.removeEventListener('visibilitychange', sync); preference.removeEventListener('change', sync); };
  }, [playing, images.length]);

  const next = (active + 1) % Math.max(1, images.length);
  return <span ref={root} data-artwork-index={active} style={{ '--poster-ratio': images[0] ? `${images[0].width} / ${images[0].height}` : '1' } as CSSProperties} className={`showcase-poster${images.length > 1 ? ' has-layers' : ''}${project.id === 'bsit-student-frames' ? ' showcase-poster--wide' : ''}`}>
    {images.slice(1, 3).reverse().map((image, layer) => <span className={`poster-layer poster-layer--${layer + 1}`} key={image.src} aria-hidden="true"><img src={image.src} alt="" loading="lazy" decoding="async" draggable={false} /></span>)}
    <span className="collection-frames">
      {images.length ? images.map((image, index) => <span key={image.src} className={`collection-frame${index === active ? ' is-active' : ''}`} aria-hidden={index !== active}><img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" draggable={false} /></span>) : <img src={project.image} alt={project.title} loading="lazy" draggable={false} />}
    </span>
    {images.length > 1 && <span className="poster-peek" data-artwork-index={next} aria-hidden="true"><img src={images[next].src} alt="" loading="lazy" decoding="async" draggable={false} /><span><span>{images[next].label}</span><ArrowUpRight size={13} /></span></span>}
    {images.length > 1 && <span className="collection-frame-count" aria-hidden="true">{String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>}
    <span className="showcase-open"><ArrowUpRight size={20} /></span>
  </span>;
}
