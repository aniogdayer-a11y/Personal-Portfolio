import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, X, ZoomIn, ZoomOut } from 'lucide-react';
import type { PortfolioProject, ProjectImage } from '../data/portfolioData';

export function ArtworkViewer({ images, initialIndex, title, project, onProjectDetails, onClose }: { images: ProjectImage[]; initialIndex: number; title: string; project?: PortfolioProject; onProjectDetails?: () => void; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);
  const asset = images[index];
  useEffect(() => {
    const element = dialog.current;
    const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element?.showModal();
    return () => {
      if (element?.open) element.close();
      document.body.style.overflow = previousOverflow;
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => { stage.current?.scrollTo({ left: 0, top: 0 }); if (zoomed) stage.current?.focus({ preventScroll: true }); }, [index, zoomed]);
  const change = (direction: number) => { setIndex(current => (current + direction + images.length) % images.length); setZoomed(false); };
  return <dialog ref={dialog} className="artwork-dialog" aria-labelledby="artwork-title" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }} onKeyDown={event => {
    if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
    if (!zoomed && images.length > 1 && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) { event.preventDefault(); change(event.key === 'ArrowRight' ? 1 : -1); }
  }}>
    <div className="artwork-toolbar"><div><h2 id="artwork-title">{title}</h2><p aria-live="polite">{asset.label} <span>{index + 1} / {images.length}</span></p></div><div className="artwork-controls">
      {images.length > 1 && <><button onClick={() => change(-1)} aria-label="Previous artwork"><ChevronLeft size={20} /></button><button onClick={() => change(1)} aria-label="Next artwork"><ChevronRight size={20} /></button></>}
      <button onClick={() => setZoomed(value => !value)} aria-label={zoomed ? 'Fit artwork to screen' : 'View artwork at original size'} aria-pressed={zoomed}>{zoomed ? <ZoomOut size={19} /> : <ZoomIn size={19} />}</button>
      <a href={asset.original} target="_blank" rel="noopener noreferrer" aria-label="Open original artwork in a new tab"><ExternalLink size={18} /></a><button onClick={onClose} aria-label="Close artwork viewer"><X size={21} /></button>
    </div></div>
    <div ref={stage} tabIndex={0} aria-label="Artwork canvas. Scroll to explore when viewing at original size." className={`artwork-stage ${zoomed ? 'is-zoomed' : ''}`}><img key={asset.original} src={asset.original} alt={asset.alt} width={asset.width} height={asset.height} /></div>
    {project && <div className="artwork-context"><dl><div><dt>Category</dt><dd>{project.category}</dd></div>{project.tools?.length ? <div><dt>Design Tools</dt><dd>{project.tools.join(', ')}</dd></div> : null}{project.year && <div><dt>Year</dt><dd>{project.year}</dd></div>}{project.organization && <div><dt>Organization / Client</dt><dd>{project.organization}</dd></div>}</dl><p>{project.description}</p>{onProjectDetails && <button className="text-link" onClick={onProjectDetails}>View project details <ExternalLink size={14} /></button>}</div>}
    <div className="artwork-footer"><span>{asset.width.toLocaleString()} × {asset.height.toLocaleString()} px</span><span>{zoomed ? 'Scroll to explore the artwork.' : 'Original artwork · Full resolution'}</span><span>ESC TO CLOSE</span></div>
  </dialog>;
}

