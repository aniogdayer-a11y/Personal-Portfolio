import { ProjectArtwork } from './ProjectArtwork';
import { routeHref } from '../utils/sitePaths';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Expand, ExternalLink } from 'lucide-react';
import { work } from '../data/portfolioData';
import { ProjectVisual } from './ProjectVisual';
import { SoftwareUsed } from './SoftwareUsed';
import { ProjectVideo } from './ProjectVideo';
import { EduFocusTeaser } from './EduFocusTeaser';
import { ProjectTools } from './ProjectTools';
import { ArtworkViewer } from './ArtworkViewer';
import type { PortfolioProject } from '../data/portfolioData';
import type { Navigate } from './PortfolioPages';

function routeClick(event: MouseEvent<HTMLAnchorElement>, path: string, navigate: Navigate) {
  if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0) {
    event.preventDefault(); navigate(path);
  }
}

export function ProjectDetail({ project, navigate }: { project: PortfolioProject; navigate: Navigate }) {
  const [viewing, setViewing] = useState<number | null>(null);
  const images = project.images ?? [];
  const tags = project.tags ?? project.technologies;
  const externalDemo = /^https?:\/\//.test(project.demo);
  const isEduFocus = project.id === 'edufocus';
  const next = work[(work.findIndex(item => item.id === project.id) + 1) % work.length];

  return <div className="content-page project-detail">
    <a href={routeHref('/projects')} className="text-link" onClick={event => routeClick(event, '/projects', navigate)}><ArrowLeft size={16} /> Back to projects</a>
    <div className="page-heading"><span className="eyebrow">02 / {project.category.toUpperCase()}</span><h1>{project.title.replace(/\.$/, '')}<span className="period">.</span></h1><p>{project.description}</p></div>

    {images.length > 0 && <figure className={`project-artwork-hero${project.id === 'bsit-student-frames' ? ' frame-project-hero' : ''}`}><button className="artwork-open" onClick={() => setViewing(0)} aria-label={`View ${images[0].label} in full resolution`}>{project.id === 'aws-sbg-jru' ? <ProjectVisual src={images[0].src} alt={images[0].alt} eager /> : <ProjectArtwork className="detail-preview" asset={images[0]} eager />}<span className="artwork-open-label"><Expand size={15} /> View full size</span></button><figcaption>{images[0].label}</figcaption></figure>}

    {project.video && (isEduFocus ? <EduFocusTeaser project={project} /> : <section className={`project-trailer${project.video.height > project.video.width ? ' project-trailer--portrait' : ''}`} aria-label={`${project.title} ${project.video.kind}`}><div className="section-title"><div><span className="eyebrow">GAMEPLAY PREVIEW</span><h2>Watch the {project.video.kind}.</h2></div></div><ProjectVideo project={project} /></section>)}

    <div className="detail-columns"><div><span className="eyebrow">THE PROJECT</span><h2>{project.format ?? project.category}</h2><p>{project.overview ?? project.description}</p>{project.approach && <><h3 className="approach-title">Design approach</h3><p>{project.approach}</p></>}</div><aside>
      {project.role && <div className="project-role"><span className="small-label">MY ROLE</span><p>{project.role}</p></div>}
      <span className="small-label">{project.technologies.length ? 'BUILT WITH' : 'DESIGN FOCUS'}</span><div className="tags">{tags.map(tag => <span key={tag}>{tag}</span>)}</div>
      {project.tools?.length ? <div className="project-tools"><span className="small-label">TOOLS</span><ProjectTools tools={project.tools} /></div> : null}
      {project.aiUsage && <p className="design-process-note">{project.aiUsage}</p>}
      {project.deliverables?.length ? <><span className="small-label">CONTRIBUTION & DELIVERABLES</span><ul className="project-deliverables">{project.deliverables.map(item => <li key={item}>{item}</li>)}</ul></> : null}
      {project.github && <a className="text-link" href={project.github} target="_blank" rel="noopener noreferrer">Source on GitHub <ExternalLink size={15} /></a>}
      {project.demo && <a className="button button-dark" href={routeHref(project.demo)} target={externalDemo ? '_blank' : undefined} rel={externalDemo ? 'noopener noreferrer' : undefined} aria-label={externalDemo ? `Visit ${project.title} live site (opens in a new tab)` : undefined} onClick={externalDemo ? undefined : event => routeClick(event, project.demo, navigate)}>{externalDemo ? (isEduFocus ? 'Visit EduFocus' : 'Visit live site') : 'Try the experience'} <ArrowUpRight size={16} /></a>}
      {isEduFocus && <SoftwareUsed />}
    </aside></div>

    {images.length > 1 && !isEduFocus && <section className={`project-collection${project.id === 'bsit-student-frames' ? ' frame-project-collection' : ''}`} aria-label="Project artwork collection"><div className="section-title"><div><span className="eyebrow">THE COLLECTION</span><h2>Project gallery<span className="period">.</span></h2></div><span className="collection-count">{images.length} ARTWORKS</span></div><div className="artwork-grid">{images.map((asset, index) => <figure key={asset.label}><button className="artwork-open" onClick={() => setViewing(index)} aria-label={`View ${asset.label} in full resolution`}><ProjectArtwork asset={asset} /><span className="artwork-open-label"><Expand size={15} /> View full size</span></button><figcaption><span>{String(index + 1).padStart(2, '0')}</span>{asset.label}</figcaption></figure>)}</div></section>}
    <div className="next-project"><span className="small-label">NEXT PROJECT</span><a href={routeHref(`/projects/${next.id}`)} onClick={event => routeClick(event, `/projects/${next.id}`, navigate)}>{next.title}<ArrowRight size={25} strokeWidth={1.3} /></a></div>
    {viewing !== null && <ArtworkViewer images={images} initialIndex={viewing} title={project.title} project={project} onClose={() => setViewing(null)} />}
  </div>;
}
