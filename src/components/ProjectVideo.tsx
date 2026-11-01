import { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import type { PortfolioProject } from '../data/portfolioData';

/** Load project media only when the visitor chooses to watch it. */
export function ProjectVideo({ project }: { project: PortfolioProject }) {
  const [failed, setFailed] = useState(false);
  const [started, setStarted] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  if (!project.video) return null;
  const { kind, duration, width, height } = project.video;
  return <figure className="project-video" data-portrait={height > width}>
    <div className="trailer-stage" data-started={started}>
    <video ref={video} controls playsInline preload="none" poster={project.video.poster} aria-label={`${project.title} ${kind}`} onPlay={() => setStarted(true)} onError={() => setFailed(true)}>
      <source src={project.video.src} type="video/mp4" />
      Your browser does not support video playback.
    </video>
    {!started && <button type="button" className="trailer-cover" aria-label={`Play ${project.title} ${kind}`} onClick={() => {
      setFailed(false); setStarted(true);
      video.current?.play().catch(() => { setStarted(false); setFailed(true); });
    }}>
      <img src={project.video.poster} alt="" loading="lazy" />
      <span className="trailer-play"><Play size={23} fill="currentColor" aria-hidden="true" /></span>
      <span className="trailer-cover-caption"><span>{project.title.toUpperCase()}</span><span>PLAY {kind.toUpperCase()} · {duration}</span></span>
    </button>}
    </div>
    <figcaption>{project.video.caption}</figcaption>
    {failed && <p role="status">The preview could not load. <a href={project.video.src}>Open the video</a>.</p>}
  </figure>;
}
