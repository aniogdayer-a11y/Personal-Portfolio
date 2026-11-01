import { assetPath, routeHref } from '../utils/sitePaths';
import { useMotionPreference } from '../hooks/useMotionPreference';
import type { CSSProperties, ReactNode, PointerEvent } from 'react';

const creativeTools = [
  { id: 'canva', name: 'Canva', detail: 'Layouts & visual storytelling', image: 'canva-wordmark.svg' },
  { id: 'picsart', name: 'Picsart', detail: 'Photo editing & compositions', image: 'picsart.svg' },
  { id: 'figma', name: 'Figma', detail: 'Interfaces & prototypes', image: 'figma-color.svg' },
  { id: 'ibispaint', name: 'ibisPaint', detail: 'Digital illustration', image: 'ibispaint.png' },
  { id: 'photoshop', name: 'Photoshop', detail: 'Image editing & composites', image: 'photoshop.svg' },
  { id: 'tiled', name: 'Tiled', detail: 'Tile maps & level layouts', image: 'tiled.png' },
  { id: 'generative-ai', name: 'Generative AI', detail: 'Visual concepts & creative exploration', image: '/assets/ai-tools/ai-design.png' },
];

export function ToolIcon({ id, image }: { id: string; image: string }) {
  return <span className={`tool-icon tool-icon--${id}`}><span className="tool-icon-aura" aria-hidden="true" /><span className="tool-icon-edge" aria-hidden="true" /><span className="tool-icon-face"><img src={assetPath(image.startsWith('/') ? image : `/assets/tools/${image}`)} alt="" width="40" height="40" decoding="async" /></span></span>;
}

export function CreativePortrait({ children }: { children: ReactNode }) {
  const { enabled } = useMotionPreference();
  const tilt = (event: PointerEvent<HTMLAnchorElement>) => {
    if (!enabled || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--icon-rx', `${(0.5 - (event.clientY - rect.top) / rect.height) * 24}deg`);
    event.currentTarget.style.setProperty('--icon-ry', `${((event.clientX - rect.left) / rect.width - 0.5) * 30}deg`);
  };
  return <div className={`creative-portrait${enabled ? '' : ' motion-paused'}`}>
    <div className="portrait-depth" data-parallax="-0.06" aria-hidden="true" />
    <div className="portrait-parallax" data-parallax="0.07">{children}</div>
    <ul className="portrait-tools" aria-label="My creative toolkit">{creativeTools.map((tool, index) => <li key={tool.id} className={`portrait-tool--${tool.id}`} style={{ '--tool-index': index } as CSSProperties}>
      <a data-parallax={tool.id === 'generative-ai' ? '0.07' : index % 2 ? '0.16' : '-0.12'} onPointerMove={tilt} onPointerLeave={event => { event.currentTarget.style.removeProperty('--icon-rx'); event.currentTarget.style.removeProperty('--icon-ry'); }} href={`${routeHref('/about')}#creative-toolkit`} onClick={event => { event.preventDefault(); document.getElementById('creative-toolkit')?.scrollIntoView({ behavior: 'smooth' }); }} aria-label={`${tool.name} — explore my creative toolkit`}><ToolIcon {...tool} /><span className="tool-tooltip">{tool.name}</span></a>
    </li>)}</ul>
  </div>;
}

export function CreativeToolkit() {
  return <section id="creative-toolkit" className="creative-toolkit" aria-labelledby="creative-toolkit-title">
    <div className="section-title"><div><span className="eyebrow">MY CREATIVE TOOLKIT</span><h2 id="creative-toolkit-title">Creative software.</h2></div><p>Tools I use for design and illustration.</p></div>
    <ul className="creative-tool-list">{creativeTools.map((tool, index) => <li key={tool.id} style={{ '--tool-index': index } as CSSProperties}><span className="toolkit-float"><ToolIcon {...tool} /></span><div><h3>{tool.name}</h3><p>{tool.detail}</p>{tool.id === 'tiled' && <a className="tool-project-link" href={routeHref('/projects/the-last-ember')}>View map-design project ↗</a>}</div></li>)}</ul>
  </section>;
}
