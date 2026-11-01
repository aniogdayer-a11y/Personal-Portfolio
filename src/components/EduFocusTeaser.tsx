import { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, ArrowUpRight } from 'lucide-react';
import type { PortfolioProject } from '../data/portfolioData';

export function EduFocusTeaser({ project }: { project: PortfolioProject }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(false);
  const [failed, setFailed] = useState(false);
  const played = useRef(false);
  if (!project.video) return null;
  const media = project.video;

  function togglePlayback() {
    const player = video.current;
    if (!player) return;
    if (!player.paused) { player.pause(); return; }
    setFailed(false);
    setLoading(true);
    if (!played.current) {
      player.defaultMuted = false;
      player.muted = false;
      player.volume = 1;
      setMuted(false);
    }
    player.play().catch(() => { setLoading(false); setFailed(true); });
  }

  return <section className="edufocus-teaser" aria-labelledby="edufocus-teaser-title">
    <div className="edufocus-teaser-intro">
      <span className="eyebrow">PRODUCT PREVIEW</span>
      <h2 id="edufocus-teaser-title">EduFocus, in action.</h2>
      <p>A brief introduction to personalized study with EduFocus.</p>
      <span className="edufocus-teaser-note"><Volume2 size={15} aria-hidden="true" /> Best experienced with sound.</span>
    </div>
    <figure className="edufocus-player">
      <div className="edufocus-player-screen">
        <video ref={video} controls playsInline preload="metadata" poster={media.poster} aria-label="EduFocus official teaser"
          onPlay={() => { setPlaying(true); setFailed(false); played.current = true; }}
          onPlaying={() => setLoading(false)}
          onWaiting={() => setLoading(true)}
          onCanPlay={() => setLoading(false)}
          onPause={() => { setPlaying(false); setLoading(false); }}
          onEnded={() => { setPlaying(false); setLoading(false); }}
          onVolumeChange={() => { const player = video.current; if (player) setMuted(player.muted || player.volume === 0); }}
          onError={() => { setFailed(true); setLoading(false); setPlaying(false); }}>
          <source src={media.src} type="video/mp4" />
          {media.webm && <source src={media.webm} type={'video/webm; codecs="vp9, opus"'} />}
          Your browser does not support video playback.
        </video>
      </div>
      <figcaption className="edufocus-player-bar">
        <button type="button" className="edufocus-play-toggle" aria-label={playing ? 'Pause EduFocus teaser' : 'Play EduFocus teaser'} onClick={togglePlayback}>
          {playing ? <Pause size={15} fill="currentColor" aria-hidden="true" /> : <Play size={15} fill="currentColor" aria-hidden="true" />}<span>{playing ? 'Pause' : 'Play'}</span>
        </button>
        <span>{media.duration}</span>
        <button type="button" className="edufocus-sound-toggle" aria-label={muted ? 'Turn teaser sound on' : 'Mute teaser sound'} aria-pressed={!muted} onClick={() => {
          const player = video.current;
          const nextMuted = !muted;
          if (player) { player.muted = nextMuted; if (!nextMuted && player.volume === 0) player.volume = 1; }
          setMuted(nextMuted);
        }}>{muted ? <VolumeX size={15} aria-hidden="true" /> : <Volume2 size={15} aria-hidden="true" />}<span>Sound {muted ? 'off' : 'on'}</span></button>
      </figcaption>
      <div className="edufocus-player-status"><span role="status">{failed ? 'Playback unavailable. Open the video directly.' : loading ? 'Loading teaser...' : 'Official teaser'}</span><a href={media.src} target="_blank" rel="noopener noreferrer" aria-label="Open EduFocus teaser in a new tab">Open video <ArrowUpRight size={12} aria-hidden="true" /></a></div>
    </figure>
  </section>;
}
