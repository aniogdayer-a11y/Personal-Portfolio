import { ProjectArtwork } from './ProjectArtwork';
import { ArrowUpRight, ArrowRight, Expand, ExternalLink, Check } from 'lucide-react';
import type { PortfolioProject } from '../data/portfolioData';
import { RouteLink } from './PortfolioPages';
import type { Navigate } from './PortfolioPages';
import { ProjectVisual } from './ProjectVisual';
import { SoftwareUsed } from './SoftwareUsed';
import { ProjectTools } from './ProjectTools';
import { categoriesFor } from '../utils/projectCatalog';

export function UiUxStudioView({
  project,
  navigate,
  onInspect,
}: {
  project: PortfolioProject;
  navigate: Navigate;
  onInspect: (p: PortfolioProject) => void;
}) {
  return (
    <article className="uiux-studio-featured" aria-labelledby={`uiux-title-${project.id}`}>
      <div
        className="uiux-preview-column"
      >
        <div
          className="uiux-mockup-canvas"
        >
          <ProjectVisual src={project.image} alt={project.images?.[0]?.alt ?? `${project.title} interface showcase`} width={project.images?.[0]?.width} height={project.images?.[0]?.height} />
          <div className="uiux-canvas-overlay">
            <button
              type="button"
              className="uiux-inspect-button"
              onClick={() => onInspect(project)}
              aria-label={`View ${project.title} in full resolution`}
            >
              <Expand size={14} /> Full Resolution
            </button>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="uiux-live-button"
              >
                Visit Live Site <ArrowUpRight size={14} />
              </a>
            )}
            {project.video && <RouteLink to={`/projects/${project.id}`} navigate={navigate} className="uiux-live-button">Watch {project.video.kind} <ArrowUpRight size={14} /></RouteLink>}
          </div>
        </div>
      </div>

      <div className="uiux-brief-column">
        <span className="eyebrow">{project.category === 'Game Map Design' ? 'GAME MAP DESIGN / TILED' : 'UI/UX DESIGN'}</span>
        <h2 id={`uiux-title-${project.id}`} className="uiux-project-title">{project.title}</h2>
        <div className="uiux-role-meta">
          <span>{project.role ?? 'UI/UX Designer'}</span>
          {project.tools?.length ? (
            <>
              <span className="meta-sep">/</span>
              <ProjectTools tools={project.tools} />
            </>
          ) : null}
          {project.organization ? (
            <>
              <span className="meta-sep">/</span>
              <span>{project.organization}</span>
            </>
          ) : null}
        </div>

        <p className="uiux-overview">{project.overview ?? project.description}</p>

        {project.approach && (
          <div className="uiux-brief-block">
            <span className="small-label">DESIGN APPROACH</span>
            <p>{project.approach}</p>
          </div>
        )}

        {project.deliverables?.length ? (
          <div className="uiux-brief-block">
            <span className="small-label">DELIVERABLES</span>
            <ul className="uiux-deliverables-list">
              {project.deliverables.map(d => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="tags">
          {(project.tags ?? project.technologies ?? []).map(t => (
            <span key={t}>{t}</span>
          ))}
        </div>

        <div className="uiux-action-buttons">
          <RouteLink
            className="button button-dark"
            to={`/projects/${project.id}`}
            navigate={navigate}
          >
            Project details <ArrowUpRight size={16} />
          </RouteLink>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              Visit live site <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function WebDevTechnicalView({
  project,
  navigate,
  onInspect,
}: {
  project: PortfolioProject;
  navigate: Navigate;
  onInspect: (p: PortfolioProject) => void;
}) {
  return (
    <article className="webdev-technical-showcase" aria-labelledby={`webdev-title-${project.id}`}>
      <div className="webdev-media-column">
        <div className="webdev-screenshot-container">
          {project.demo ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="webdev-clickable-screen"
              aria-label="Visit EduFocus live platform (opens in new tab)"
            >
              <img
                src={project.image}
                alt={project.images?.[0]?.alt ?? `${project.title} application screenshot`}
                className="webdev-screenshot-image"
                loading="lazy"
                decoding="async"
              />
              <span className="webdev-visit-badge">Visit EduFocus ↗</span>
            </a>
          ) : (
            <img
              src={project.image}
              alt={project.images?.[0]?.alt ?? `${project.title} application screenshot`}
              className="webdev-screenshot-image"
              loading="lazy"
              decoding="async"
            />
          )}
          <button
            type="button"
            className="webdev-expand-button"
            onClick={() => onInspect(project)}
            aria-label="Inspect screenshot full size"
          >
            <Expand size={14} /> Full size
          </button>
        </div>
      </div>

      <div className="webdev-spec-column">
        <span className="eyebrow">WEB DEVELOPMENT · FULL-STACK APPLICATION</span>
        <h2 id={`webdev-title-${project.id}`} className="webdev-title">{project.title}</h2>
        <div className="webdev-role-badge">
          <span>{project.role ?? 'Full-Stack Developer'}</span>
          {project.year && (
            <>
              <span className="meta-sep">/</span>
              <span>{project.year}</span>
            </>
          )}
        </div>

        <p className="webdev-overview-text">{project.description}</p>

        {project.features?.length ? (
          <div className="webdev-spec-block">
            <span className="small-label">FEATURES</span>
            <ul className="webdev-feature-items">
              {project.features.map(f => (
                <li key={f}>
                  <Check size={14} className="webdev-check-icon" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {project.technologies?.length ? (
          <div className="webdev-spec-block">
            <span className="small-label">TECHNOLOGIES</span>
            <div className="tags">
              {project.technologies.map(tech => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>
          </div>
        ) : null}

        {project.tags?.length ? (
          <div className="webdev-spec-block">
            <span className="small-label">MY CONTRIBUTION</span>
            <div className="tags">
              {project.tags.map(tag => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        ) : null}

        {project.id === 'edufocus' && <SoftwareUsed />}
        <div className="webdev-actions">
          {project.video && <RouteLink to={`/projects/${project.id}`} navigate={navigate} className="button button-dark">Watch {project.video.kind} <ArrowRight size={16} /></RouteLink>}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-dark"
            >
              Visit EduFocus <ArrowUpRight size={16} />
            </a>
          )}
          <RouteLink
            className="text-link"
            to={`/projects/${project.id}`}
            navigate={navigate}
          >
            Read project overview <ArrowRight size={15} />
          </RouteLink>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              GitHub repository <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProjectOverview({ projects, navigate }: { projects: PortfolioProject[]; navigate: Navigate }) {
 return <div className="project-gallery project-overview">{projects.map((project,index)=><RouteLink className="project-card" key={project.id} to={`/projects/${project.id}`} navigate={navigate}><div className="project-image">{project.images?.[0] ? <ProjectArtwork asset={project.images[0]} /> : <img src={project.image} alt={project.title} loading="lazy" />}<span className="project-index">{String(index+1).padStart(2,'0')}</span><span className="project-arrow"><ArrowUpRight size={22} /></span></div><div className="project-card-title"><h2>{project.title}</h2><span>{categoriesFor(project).join(' / ')}</span></div><p>{project.description}</p><div className="tags">{(project.tags ?? project.technologies).map(tag=><span key={tag}>{tag}</span>)}</div></RouteLink>)}</div>;
}
