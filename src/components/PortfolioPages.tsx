import { routeHref } from '../utils/sitePaths';
import { MotionText } from './MotionText';
import { useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { ArrowUpRight, ArrowRight, Mail, GraduationCap, MapPin, FileText, Clock3, Code2, Award, Check, Copy, Search, ExternalLink } from 'lucide-react';
import { portfolio, work, skillGroups, certificates, credlyProfile, milestones, type PortfolioProject, education } from '../data/portfolioData';
import { ProjectVisual } from './ProjectVisual';
import { ProjectOverview, UiUxStudioView, WebDevTechnicalView } from './ProjectCategoryViews';
import { projectCategories, filterProjects } from '../utils/projectCatalog';
import { useCategorySwitch } from '../hooks/useCategorySwitch';
import { useMotionPreference } from '../hooks/useMotionPreference';
import { ProjectDetail } from './ProjectDetail';
import { GraphicDesignShowcase } from './GraphicDesignShowcase';
import { CreativePortrait, CreativeToolkit } from './CreativeTools';
import { ArtworkViewer } from './ArtworkViewer';

export type Navigate = (path: string) => void;
function TechnologyIcon({ name }: { name: string }) {
  if (name === 'TypeScript') return <svg width="21" height="21" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="2" fill="none" stroke="currentColor" /><text x="5" y="17" fontFamily="Arial,sans-serif" fontSize="10" fontWeight="bold" fill="currentColor">TS</text></svg>;
  if (name === 'React') return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true"><ellipse cx="12" cy="12" rx="10" ry="4" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /></svg>;
  if (name === 'Vite') return <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 10-13h-7l1-7Z" /></svg>;
  return <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 5L2 12l6 7M16 5l6 7-6 7M14 3l-4 18" /></svg>;
}
function Github({ size = 20 }: { size?: number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 19c-4.3 1.4-4.3-2.4-6-3m12 6v-3.9c0-1.1-.1-1.6-.6-2.1 3.1-.4 6.3-1.5 6.3-6.9a5.3 5.3 0 0 0-1.5-3.7 4.9 4.9 0 0 0-.1-3.6s-1.2-.4-3.9 1.4a13 13 0 0 0-7 0C5.5 1.4 4.3 1.8 4.3 1.8a4.9 4.9 0 0 0-.1 3.6A5.3 5.3 0 0 0 2.7 9c0 5.4 3.2 6.5 6.3 6.9-.5.5-.6 1.2-.6 2.1V22" /></svg>; }
function Linkedin({ size = 20 }: { size?: number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7.5 10v7M12 17v-7m0 3a3 3 0 0 1 6 0v4M7.5 7v.01" /></svg>; }
export function RouteLink({ to, navigate, children, className = '' }: { to: string; navigate: Navigate; children: ReactNode; className?: string }) {
  return <a className={className} href={routeHref(to)} onClick={(e: MouseEvent<HTMLAnchorElement>) => { if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigate(to); } }}>{children}</a>;
}
export function Portrait({ className = '' }: { className?: string }) {
  return <img className={className} src={portfolio.portrait} alt="Dayer C. Aniog wearing a dark pinstripe suit and striped tie" width="1254" height="1254" decoding="async" fetchPriority="high" />;
}
export function ResumeLink() {
  return portfolio.resume ? <a className="text-link" href={portfolio.resume} download="Dayer-Aniog-Resume.pdf"><FileText size={16} /> Download résumé <ArrowUpRight size={15} /></a> : <span className="resume-pending"><FileText size={16} /> Résumé <span><Clock3 size={12} /> Currently updating</span></span>;
}
export function SocialLinks({ labeled = false }: { labeled?: boolean }) {
  return <div className="social-links"><a href={portfolio.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Dayer on LinkedIn"><Linkedin size={19} />{labeled && <span>LinkedIn</span>}</a><a href={`mailto:${portfolio.email}`} aria-label="Email Dayer"><Mail size={19} />{labeled && <span>Email</span>}</a><a href={portfolio.github} target="_blank" rel="noopener noreferrer" aria-label="Dayer on GitHub"><Github size={19} />{labeled && <span>GitHub</span>}</a></div>;
}
function PageHeading({ number, label, title, children }: { number: string; label: string; title: string; children: ReactNode }) {
  return <div className="page-heading"><span className="page-index" aria-hidden="true" data-parallax="0.12">{number}</span><span className="eyebrow">{number} / {label}</span><h1><MotionText>{title}<span className="period">.</span></MotionText></h1><p>{children}</p></div>;
}
function EmptyState({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return <div className="empty-state"><span className="empty-icon">{icon}</span><h2>{title}</h2><p>{children}</p><span className="small-label">PORTFOLIO COLLECTION</span></div>;
}
export function ProfilePage({ navigate }: { navigate: Navigate }) {
  return <>
    <section className="profile-hero" data-parallax-scene>
      <div className="profile-text"><span className="eyebrow"><i /> DESIGNER & DEVELOPER / PHILIPPINES</span><h1><MotionText>Hi, I’m Dayer<span className="period">.</span><br /><span className="subtle-title">Designing ideas.<br />Building experiences.</span></MotionText></h1><div className="profile-disciplines"><span>Front-End Development</span><span>UI/UX</span><span>Graphic Design</span></div><p className="intro-description">{portfolio.intro}</p><div className="hero-actions"><RouteLink className="button button-dark" to="/projects" navigate={navigate}>View selected projects <ArrowUpRight size={18} /></RouteLink></div><div className="hero-caption"><span className="status-dot" /> COLLEGE STUDENT <span className="caption-separator">/</span> SCROLL TO EXPLORE</div></div>
      <div className="profile-visual profile-visual--blend"><CreativePortrait><Portrait className="profile-portrait profile-portrait--blend" /></CreativePortrait></div>
    </section>
    <section className="about-editorial"><div><span className="eyebrow">PROFILE</span><h2>Design and<br /> development.</h2></div><div className="about-story"><p>{portfolio.about}</p><SocialLinks labeled /></div><div className="education-note"><GraduationCap size={24} strokeWidth={1.5} /><span className="small-label">EDUCATION</span><ol className="education-history">{education.map(item => <li key={item.school}><h3>{item.school}</h3><p className="education-period">{item.period}</p>{item.location && <><p>{item.course}</p><span className="education-location"><MapPin size={13} /> {item.location}</span></>}</li>)}</ol><ResumeLink /></div></section>
    <CreativeToolkit />
    <section className="featured-section"><div className="section-title"><div><span className="eyebrow">SELECTED PROJECTS</span><h2>Design in practice<span className="period">.</span></h2></div><RouteLink to="/projects" navigate={navigate} className="text-link">All projects <ArrowUpRight size={17} /></RouteLink></div>{work.filter(p => p.featured).map(p => <RouteLink className="featured-project" key={p.id} to={`/projects/${p.id}`} navigate={navigate}><ProjectVisual src={p.image} alt={p.images?.[0]?.alt ?? `${p.title} preview`} /><div><span className="small-label">{p.category} / {p.status}</span><h3>{p.title}</h3><p>{p.description}</p><div className="tags">{(p.tags ?? p.technologies).map(t => <span key={t}>{t}</span>)}</div><span className="project-open">Explore the project <ArrowUpRight size={18} /></span></div></RouteLink>)}</section>
  </>;
}


export function ProjectsPage({ navigate, projectId }: { navigate: Navigate; projectId?: string }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string>('All Work');
  const { enabled } = useMotionPreference();
  const { displayed: displayFilter, phase, stage, controls, select } = useCategorySwitch(filter, enabled);
  const [viewingProject, setViewingProject] = useState<PortfolioProject | null>(null);

  const project = work.find(p => p.id === projectId);
  if (projectId && !project) return <NotFoundPage navigate={navigate} />;
  if (project) return <ProjectDetail project={project} navigate={navigate} />;

  const categoryCounts = Object.fromEntries(projectCategories.map(category => [category, filterProjects(work, category).length]));
  const shown = filterProjects(work, displayFilter, query);
  const resultCount = filterProjects(work, filter, query).length;

  return (
    <div className="content-page projects-content-page">
      <PageHeading number="02" label="PROJECTS" title="Selected work">
        Selected work in interface design, web development, game-map design, and visual communication.
      </PageHeading>

      <div className="work-summary">
        <span>DESIGN &amp; DEVELOPMENT</span>
        <span role="status" aria-live="polite">
          {resultCount.toString().padStart(2, '0')} {resultCount === 1 ? 'project displayed' : 'projects displayed'}
        </span>
      </div>

      <div className="project-toolbar" ref={controls}>
        <div className="filter-tabs" role="group" aria-label="Filter projects">
          {projectCategories.map(c => (
            <button
              key={c}
              className={filter === c ? 'active' : ''}
              aria-pressed={filter === c}
              onClick={() => { setFilter(c); select(c); }}
            >
              {c} <span className="filter-count">{categoryCounts[c] ?? 0}</span>
            </button>
          ))}
        </div>
        <label className="search-input">
          <Search size={16} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Find a project or technology"
            aria-label="Search projects"
          />
        </label>
      </div>

      <div ref={stage} className="project-category-stage" data-phase={phase} aria-busy={filter !== displayFilter}><div key={displayFilter} className="project-category-view" data-category={displayFilter}>
        {shown.length === 0 ? (
          <EmptyState icon={<Search size={25} />} title="No matching projects">
            Try another project name or technology.
          </EmptyState>
        ) : displayFilter === 'All Work' ? (
          <ProjectOverview projects={shown} navigate={navigate} />
        ) : displayFilter === 'Design' ? (
          <div className="uiux-projects-container">
            {shown.map(p => (
              <UiUxStudioView
                key={p.id}
                project={p}
                navigate={navigate}
                onInspect={setViewingProject}
              />
            ))}
          </div>
        ) : displayFilter === 'Web Development' ? (
          <div className="webdev-projects-container">
            {shown.map(p => (
              <WebDevTechnicalView
                key={p.id}
                project={p}
                navigate={navigate}
                onInspect={setViewingProject}
              />
            ))}
          </div>
        ) : (
          <div className="graphic-design-gallery-wrapper">
            {shown.filter(p => p.id !== 'aws-sbg-booth').length > 0 && (
              <GraphicDesignShowcase
                key={shown.map(p => p.id).join('|')}
                projects={shown.filter(p => p.id !== 'aws-sbg-booth')}
                navigate={navigate}
              />
            )}
            {shown.some(p => p.id === 'aws-sbg-booth') && (() => {
              const boothProject = shown.find(p => p.id === 'aws-sbg-booth')!;
              return (
                <section className="booth-feature" aria-labelledby="booth-feature-title">
                  {boothProject.image && (
                    <RouteLink className="booth-photograph" to={`/projects/${boothProject.id}`} navigate={navigate}>
                      <img
                        data-parallax="0.06"
                        src={boothProject.image}
                        alt={boothProject.images?.[0]?.alt ?? boothProject.title}
                        width={boothProject.images?.[0]?.width}
                        height={boothProject.images?.[0]?.height}
                        loading="lazy"
                        decoding="async"
                      />
                    </RouteLink>
                  )}
                  <div className="booth-feature-heading">
                    <span className="eyebrow">EXHIBITION DESIGN / CREATIVES TEAM</span>
                    <h2 id="booth-feature-title">Sustainable<br /> exhibition design<span className="period">.</span></h2>
                  </div>
                  <div className="booth-feature-story">
                    <span className="small-label">AWS SBG — RECYCLED BOOTH</span>
                    <p>{boothProject.description}</p>
                    <div className="tags">{boothProject.tags?.map(tag => <span key={tag}>{tag}</span>)}</div>
                    <RouteLink className="text-link" to={`/projects/${boothProject.id}`} navigate={navigate}>
                      Explore the team project <ArrowUpRight size={17} />
                    </RouteLink>
                  </div>
                </section>
              );
            })()}
          </div>
        )}
      </div></div>

      {viewingProject?.images?.length ? (
        <ArtworkViewer
          images={viewingProject.images}
          initialIndex={0}
          title={viewingProject.title}
          project={viewingProject}
          onClose={() => setViewingProject(null)}
          onProjectDetails={() => {
            setViewingProject(null);
            navigate(`/projects/${viewingProject.id}`);
          }}
        />
      ) : null}
    </div>
  );
}

export function SkillsPage() {
  return <div className="content-page"><PageHeading number="03" label="SKILLS" title="Skills & tools">Design disciplines, development practices, and software used across my projects.</PageHeading><CreativeToolkit />{skillGroups.length ? <div className="skill-groups">{skillGroups.map(g => <article key={g.category}><Code2 size={24} /><h2>{g.category}</h2><p>{g.description}</p><div className="tags">{g.skills.map(s => <span key={s}>{s}</span>)}</div></article>)}</div> : <EmptyState icon={<Code2 size={26} />} title="Learning, then documenting">My personal skills and areas of study will be added here as I document them.</EmptyState>}<section className="toolkit-note"><span className="eyebrow">BEHIND THIS WEBSITE</span><h2>Portfolio technology stack.</h2><p>Technologies used to build this portfolio and its interactive features.</p><div className="stack-list">{[['React', 'Component-based interface'], ['TypeScript', 'Typed interactions and spring physics'], ['CSS & SVG', 'Responsive layouts and lanyard rendering'], ['Vite', 'Development and production build']].map(([name, detail]) => <div key={name}><TechnologyIcon name={name} /><h3>{name}</h3><p>{detail}</p><ArrowUpRight size={17} /></div>)}</div></section></div>;
}
const credentialDate = (value: string) => new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
export function CertificationsPage() {
  const [filter, setFilter] = useState('All');
  const shown = certificates.filter(c => filter === 'All' || c.type === filter);
  return <div className="content-page">
    <PageHeading number="04" label="CERTIFICATIONS & BADGES" title="Certifications & badges">Verified credentials in programming and databases, with issuer details and verification links.</PageHeading>
    <div className="credential-toolbar"><div className="filter-tabs" role="group" aria-label="Filter credentials">{['All', 'Certificate', 'Badge'].map(type => <button key={type} onClick={() => setFilter(type)} aria-pressed={filter === type} className={filter === type ? 'active' : ''}>{type === 'All' ? 'All credentials' : type === 'Certificate' ? 'Certifications' : 'Badges'} <span className="filter-count">{type === 'All' ? certificates.length : certificates.filter(c => c.type === type).length}</span></button>)}</div><a className="text-link" href={credlyProfile} target="_blank" rel="noopener noreferrer">Credly profile <ArrowUpRight size={16} /></a></div>
    {shown.length ? <div className="certificate-grid credential-gallery">{shown.map(credential => <article key={credential.id}>
      <a className="credential-artwork" href={credential.verify} target="_blank" rel="noopener noreferrer" aria-label={`View ${credential.title} on Credly`}><img data-parallax="0.055" src={credential.image} alt={`${credential.title} official badge`} width="600" height="600" loading="lazy" decoding="async" /><span><ArrowUpRight size={18} /></span></a>
      <div className="credential-copy"><span className="small-label">{credential.type === 'Certificate' ? 'CERTIFICATION' : 'DIGITAL BADGE'}</span><h2>{credential.title}</h2><p className="credential-issuer">{credential.issuer}</p><p className="credential-description">{credential.description}</p>
      <dl className="credential-dates"><div><dt>Issued</dt><dd><time dateTime={credential.date}>{credentialDate(credential.date)}</time></dd></div>{credential.expires && <div><dt>Expires</dt><dd><time dateTime={credential.expires}>{credentialDate(credential.expires)}</time></dd></div>}</dl>
      <a href={credential.verify} target="_blank" rel="noopener noreferrer" className="text-link">Verify on Credly <ExternalLink size={14} /></a></div>
    </article>)}</div> : <EmptyState icon={<Award size={28} />} title="No credentials in this category">No {filter === 'Certificate' ? 'certifications' : 'badges'} have been published yet.</EmptyState>}
  </div>;
}
export function ExperiencePage() {
  // Only use supplied dates. Year-only education entries keep their year precision.
  const entries = [
    ...education.map(item => ({
      id: item.school, title: item.school, dateTime: String(item.startYear), dateLabel: item.period,
      category: 'Education', context: item.course, description: item.description, education: true,
    })),
    ...milestones.map(item => ({
      id: item.title, title: item.title, dateTime: item.dateISO, dateLabel: item.date,
      category: item.category ?? 'Experience', context: item.role ? `${item.role} ? ${item.organization}` : item.organization,
      description: item.description, education: false,
    })),
  ].sort((a, b) => b.dateTime.localeCompare(a.dateTime));
  const years = [...new Set(entries.map(item => item.dateTime.slice(0, 4)))];

  return <div className="content-page experience-page">
    <PageHeading number="05" label="EXPERIENCE & ACHIEVEMENTS" title="Experience & achievements">Education, creative achievements, and innovation challenges, from most recent to earliest.</PageHeading>
    <div className="experience-years">{years.map(year => <section className="experience-year" key={year} data-year={year} aria-labelledby={`experience-year-${year}`}>
      <h2 className="experience-year-heading" id={`experience-year-${year}`}>{year}</h2>
      <div className="timeline">{entries.filter(item => item.dateTime.startsWith(year)).map(item => <article className="timeline-item" key={item.id}>
        <div className="timeline-dot" />
        <div className="timeline-meta"><span className="small-label">{item.category}</span><time className="small-label" dateTime={item.dateTime}>{item.dateLabel}</time>{item.education ? <GraduationCap size={23} aria-hidden="true" /> : item.category === 'Achievement' ? <Award size={23} aria-hidden="true" /> : null}</div>
        <div><h3 className="timeline-entry-title">{item.title}</h3><span className="timeline-org">{item.context}</span><p>{item.description}</p></div>
      </article>)}</div>
    </section>)}</div>
  </div>;
}
export function ContactPage() {
  const [copied, setCopied] = useState(false); const [copyError, setCopyError] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(portfolio.email); setCopied(true); setCopyError(false); setTimeout(() => setCopied(false), 2500); } catch { setCopyError(true); } };
  return <div className="content-page"><PageHeading number="06" label="CONTACT" title="Contact">For project inquiries, collaboration opportunities, and professional correspondence.</PageHeading><div className="contact-layout"><div className="email-feature"><span className="eyebrow">PROJECT INQUIRIES</span><a className="large-email" href={`mailto:${portfolio.email}`}>aniog.dayer<br />@gmail.com <ArrowUpRight strokeWidth={1.2} /></a><div className="email-actions"><a className="button button-dark" href={`mailto:${portfolio.email}`}>Write an email <ArrowUpRight size={17} /></a><button className="text-link" onClick={copy}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied!' : 'Copy email'}</button></div><p className="copy-feedback" aria-live="polite">{copyError ? 'Select and copy the address above, or use “Write an email”.' : copied ? 'Email address copied to your clipboard.' : ''}</p></div><div className="contact-list"><a href={portfolio.github} target="_blank" rel="noopener noreferrer"><Github size={22} /><div><span className="small-label">GITHUB</span><strong>aniogdayer-a11y</strong></div><ArrowUpRight size={19} /></a><a href={portfolio.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={22} /><div><span className="small-label">LINKEDIN</span><strong>Dayer C. Aniog</strong></div><ArrowUpRight size={19} /></a><a href={`mailto:${portfolio.schoolEmail}`}><GraduationCap size={22} /><div><span className="small-label">SCHOOL EMAIL</span><strong>{portfolio.schoolEmail}</strong></div><ArrowUpRight size={19} /></a><div className="contact-resume"><ResumeLink /></div></div></div><div className="contact-bottom"><span className="status-dot" /><span>Based in Mandaluyong City, Philippines.</span><span className="contact-flower">✳</span></div></div>;
}
export function NotFoundPage({ navigate }: { navigate: Navigate }) {
  return <div className="content-page"><PageHeading number="404" label="PAGE NOT FOUND" title="Page unavailable">The requested address does not match a portfolio page. Return to the profile to continue browsing.</PageHeading><RouteLink className="button button-dark" to="/profile" navigate={navigate}>Back to my profile <ArrowRight size={17} /></RouteLink></div>;
}
