import { assetPath } from '../utils/sitePaths.ts';
// Edit public information here. Empty values stay unpublished.
export const portfolio = {
  name: 'Dayer C. Aniog', firstName: 'Dayer',
  title: 'Front-End Developer · UI/UX Designer · Graphic Designer', school: 'José Rizal University',
  schoolAddress: 'Mandaluyong City, Philippines',
  intro: 'I create thoughtful digital experiences by combining clean design, intuitive interfaces, and modern web development.',
  about: 'I’m a developer and designer studying at José Rizal University. My work spans front-end development, user interface design, and visual communication, with a focus on usability, clear information, and cohesive visual identities.',
  email: 'aniog.dayer@gmail.com', schoolEmail: 'dayer.aniog@my.jru.edu',
  github: 'https://github.com/aniogdayer-a11y',
  linkedin: 'https://www.linkedin.com/in/dayer-c-aniog-6492b2342/',
  resume: assetPath('/assets/dayer-aniog-resume.pdf'),
  course: 'Bachelor of Science in Information Technology', portrait: assetPath('/assets/dayer-suit-portrait.png'), idImage: assetPath('/assets/jru-id.png'), strapImage: assetPath('/assets/jru-strap-source.png'),
};
export const education = [
  { school: portfolio.school, period: '2025–Present', startYear: 2025, course: portfolio.course, location: portfolio.schoolAddress, description: 'Transferred to José Rizal University in 2025 and shifted to a Bachelor of Science in Information Technology to broaden my technical knowledge and develop practical skills in technology.' },
  { school: 'Technological Institute of the Philippines – Quezon City', period: '2024–2025', startYear: 2024, course: 'Bachelor of Science in Computer Science', location: 'Quezon City, Philippines', description: 'Pursued a Bachelor of Science in Computer Science, building a foundation in programming, coding, and computer systems before transferring to José Rizal University in 2025.' },
];

export interface PortfolioProject {
  id: string; title: string; category: string; categories?: string[]; description: string;
  technologies: string[]; image: string; github: string; demo: string;
  status: string; featured: boolean;
  format?: string; overview?: string; approach?: string; tags?: string[];
  deliverables?: string[]; images?: ProjectImage[];
  tools?: string[]; // List confirmed design software here when available.
  aiUsage?: string;
  techStack?: { category: string; items: string[] }[];
  year?: string;
  organization?: string;
  role?: string;
  features?: string[];
  video?: { src: string; webm?: string; poster: string; caption: string; kind: 'trailer' | 'teaser'; duration: string; width: number; height: number };
}
export interface ProjectImage { src: string; original: string; alt: string; label: string; width: number; height: number; viewport?: { x: number; y: number; sourceWidth: number; sourceHeight: number } }
export interface AiTool {
  id: string;
  name: string;
  category: string;
  detail: string;
  description: string;
  image: string;
  glow: string;
  accent: string;
  workflow: string;
  capabilities: string[];
}
const designImage = (name: string, label: string, alt: string, width: number, height: number, extension = 'png'): ProjectImage => ({
  src: assetPath(`/assets/projects/previews/${name}.jpg`), original: assetPath(`/assets/projects/originals/${name}.${extension}`), label, alt, width, height,
});
const awsInterface = designImage('aws-sbg-jru', 'Website interface showcase', 'AWS Student Builder Group–JRU interface presentation with landing, member, and partnership screens on laptop mockups', 1440, 1024);
const eduFocus = designImage('edufocus', 'Desktop and mobile interface showcase', 'EduFocus interface presentation with desktop dashboards and mobile study screens', 1440, 1024);
const grandPrix = [
  designImage('cloud-grand-prix-announcement', 'General Assembly announcement', 'Red motorsport-themed Cloud Grand Prix General Assembly announcement with race-car imagery and event typography', 1080, 1080),
  designImage('cloud-grand-prix-registration', 'Registration reminder', 'Cloud Grand Prix registration reminder with a central QR code and red racing graphics', 1080, 1080),
  designImage('cloud-grand-prix-reloaded-01', 'Reloaded announcement', 'Cloud Grand Prix General Assembly Reloaded announcement with bold black lettering and a red event cube', 1080, 1080),
];
const zodiac = [
  designImage('zodiac-cancer-s3', 'Cancer × Amazon S3', 'Purple and gold Zodiac Says graphic pairing Cancer with Amazon S3, illustrated storage imagery, and personality-themed copy', 1000, 1000, 'jpg'),
  designImage('zodiac-sagittarius-amplify', 'Sagittarius × AWS Amplify', 'Zodiac Says Sagittarius and AWS Amplify graphic with an illustrated adventurer and gold typography', 1000, 1000, 'jpg'),
  designImage('zodiac-gemini-eventbridge', 'Gemini × Amazon EventBridge', 'Zodiac Says Gemini and Amazon EventBridge graphic using connected characters and a purple tarot-card layout', 1000, 1000, 'jpg'),
];
const frames = designImage('bsit-student-frames', 'BSIT & BSIT-BA frame collection', 'Eight carnival-inspired student portrait frames arranged by BSIT and BSIT-BA year level, using Ferris wheels and admission-ticket lettering', 5875, 3189);
// Show each original design separately without altering or re-exporting the supplied board.
const studentFrames: ProjectImage[] = [[59,54],[451,54],[843,54],[1246,54],[54,519],[454,519],[852,519],[1252,519]].map(([x,y], index) => {
  const program = index < 4 ? 'BSIT' : 'BSIT-BA';
  const year = ['First year', 'Second year', 'Third year', 'Fourth year'][index % 4];
  return { ...frames, label: `${program} · ${year}`, alt: `${program} ${year.toLowerCase()} profile frame with a carnival Ferris-wheel motif and a circular portrait space`, width: 1080, height: 1080, viewport: { x: Math.round(x / 1600 * 5875), y: Math.round(y / 868 * 3189), sourceWidth: 5875, sourceHeight: 3189 } };
});
const graphicDesignTools = ['Figma', 'AI (ideation only)'];
const graphicDesignAiUsage = 'Design and layout were developed in Figma. AI supported brainstorming and concept exploration; the collection is not entirely AI-generated.';
const flag = designImage('aws-sbg-flag', 'Organization flag artwork', 'AWS Student Builder Group flag artwork with a tiger mascot, gold claw marks, blue smoke, and university branding', 1102, 801);
const countdown = designImage('tech-countdown', 'Five-day countdown poster', 'Purple technology-themed countdown poster with a phone displaying five days to come, floating keyboard keys, and event lighting', 1089, 1089);
const boothPhoto: ProjectImage = {
  src: assetPath('/assets/projects/originals/aws-sbg-booth.jpg'), original: assetPath('/assets/projects/originals/aws-sbg-booth.jpg'),
  label: 'Creatives Team booth — event photograph',
  alt: 'Orange AWS Student Builder Group booth featuring newspaper-inspired information panels, a central monitor, a tiger-mascot poster, and decorations made with recyclable materials',
  width: 1536, height: 2048,
};

const gameMaps: ProjectImage[] = [
  { src: assetPath('/assets/projects/the-last-ember/presentation.png'), original: assetPath('/assets/projects/the-last-ember/presentation.png'), label: 'Map-design presentation', alt: 'The Last Ender project artwork showing tile maps in Tiled, game environments on desktop displays, and pixel characters', width: 1440, height: 1024 },
];

export const work: PortfolioProject[] = [
  {
    id: 'aws-sbg-jru', title: 'AWS Student Builder Group — JRU', category: 'UI/UX Design', format: 'Website interface showcase',
    description: "Website interface refinement for AWS Student Builder Group – JRU, focused on visual consistency, layout, and presentation.",
    overview: "Our team was tasked with creating both mobile and website interface designs for the AWS Student Builder Group – JRU. I was assigned to the website deliverable, where I focused on refining and polishing existing designs to improve visual consistency, layout, and overall presentation.",
    approach: "I refined the existing website designs by improving spacing, alignment, and visual consistency across the layouts, while maintaining the chapter’s established identity.",
    deliverables: ['Website design refinement', 'Layout and visual consistency improvements', 'Website interface presentation'],
    tags: ['Interface design', 'Community website', 'Visual identity'], technologies: [], image: awsInterface.src, images: [awsInterface], github: '', demo: 'https://www.awssbgjru.me/', status: 'Interface showcase', featured: true,
    role: 'Website Interface Designer', year: '2026', organization: 'AWS Student Builder Group — JRU', tools: ['Figma'],
  },
  {
    id: 'edufocus', title: 'EduFocus', category: 'Web Development', categories: ['Web Development', 'UI/UX Design'], format: 'Full-stack study platform',
    description: "A learning platform built within a short development period, with multiple study modes, customizable themes, and AI-assisted features.",
    overview: "Our team developed EduFocus within a limited timeframe to support flexible, personalized study. Learners can choose from multiple study modes and customize the visual theme. I contributed to the interface, front end, and back end with AI assistance. The web application uses Laravel and PHP, with Blade templates, JavaScript, and Tailwind CSS for the interface, MySQL for data storage, and Vite for asset builds.",
    approach: "The interface groups learning materials and study tools into clear workflows across desktop and mobile. Customizable themes and multiple learning modes give users control over how they access and review content.",
    deliverables: ['Desktop and mobile interface design', 'Front-end development', 'Back-end development', 'AI-assisted development process'],
    tags: ['Front-End Development', 'Back-End Development', 'UI/UX Design', 'AI-Assisted Development'], technologies: ['Laravel', 'PHP', 'Blade', 'JavaScript', 'Tailwind CSS', 'MySQL', 'Vite'], image: eduFocus.src, images: [eduFocus], github: '', demo: 'https://edu-focus.infinityfreeapp.com/login', status: 'Full-stack project', featured: true,
    techStack: [
      { category: 'Front end', items: ['Blade templates', 'JavaScript', 'Tailwind CSS'] },
      { category: 'Back end', items: ['Laravel 12', 'PHP 8.2+'] },
      { category: 'Database', items: ['MySQL'] },
      { category: 'Build & packages', items: ['Vite', 'npm', 'Composer'] },
      { category: 'PDF & OCR', items: ['PDF.js', 'Tesseract.js'] },
    ],
    role: 'Front-End & Back-End Developer · UI/UX Designer', year: '2026', features: ['Multiple learning modes', 'Customizable color themes', 'AI-assisted study workflows', 'Milestone badges & progress tracking'],
    video: { src: assetPath('/assets/projects/edufocus/teaser-browser.mp4'), webm: assetPath('/assets/projects/edufocus/official-teaser.webm'), poster: assetPath('/assets/projects/edufocus/teaser-poster.jpg'), caption: 'The official 30-second EduFocus teaser.', kind: 'teaser', duration: '0:30', width: 1080, height: 1920 },
  },
  {
    id: 'the-last-ember', title: 'The Last Ember', category: 'Game Map Design', format: 'Collaborative map design',
    description: 'Map-design support in Tiled for a friend’s game project, contributing to the layout of its tile-based environments.',
    overview: 'I assisted a friend with map design in Tiled for The Last Ember, a game presented by The Three Musketeers. My contribution focused on map layouts. The gameplay captures show these environments within the team’s completed game.',
    approach: 'The visual direction uses top-down, tile-based environments. My involvement was limited to assisting with map design; game programming, character artwork, and gameplay systems belong to the project team.',
    deliverables: ['Map-design assistance in Tiled', 'Collaborative environment layout support'],
    tags: ['Tiled', 'Map design', 'Collaborative contribution'], technologies: [], tools: ['Tiled'],
    role: 'Map Design Contributor', organization: 'The Three Musketeers — game project team',
    status: 'Collaborative design', featured: true, image: gameMaps[0].src, images: gameMaps, github: '', demo: '',
    video: { src: assetPath('/assets/projects/the-last-ember/map-walkthrough.mp4'), poster: gameMaps[0].src, caption: '24-second gameplay excerpt from the team’s demonstration. My contribution: map-design assistance in Tiled.', kind: 'trailer', duration: '0:24', width: 1362, height: 492 },
  },
  {
    id: 'cloud-grand-prix', title: 'The Cloud Grand Prix', category: 'Graphic Design', format: 'Event publication campaign',
    description: "An event campaign for the AWS Student Builder Group–JRU General Assembly, covering announcements and registration materials.",
    overview: "A coordinated publication series for the Cloud Grand Prix General Assembly. The collection includes the event announcement, registration reminder, and Reloaded announcement.",
    approach: "Motorsport imagery, condensed typography, and directional layouts establish a recognizable campaign identity. Consistent branding and information hierarchy connect each publication.",
    deliverables: ['General Assembly announcement', 'Registration reminder', 'Reloaded announcement'],
    tags: ['Event campaign', 'Publication design', 'Typography'], technologies: [], image: grandPrix[0].src, images: grandPrix, github: '', demo: '', status: '3 artworks', featured: false,
    year: '2026', organization: 'AWS Student Builder Group — JRU', tools: graphicDesignTools, aiUsage: graphicDesignAiUsage,
  },
  {
    id: 'aws-sbg-booth', title: 'AWS SBG — Recycled Booth', category: 'Graphic Design', format: 'Sustainable booth & event design',
    description: "A collaborative exhibition booth combining recyclable materials, custom publications, and AWS Student Builder Group branding.",
    overview: "Our Creatives Team designed and assembled an AWS Student Builder Group booth using recyclable materials. Custom posters, newspaper-inspired panels, and decorative elements presented the organization in a shared event space.",
    approach: "The team combined editorial layouts and organizational branding with a resource-conscious construction approach. Coordinated print materials helped visitors identify the chapter and explore its activities.",
    deliverables: ['Collaborative Creatives Team booth build', 'Custom posters and newspaper-inspired layouts', 'Organizational branding', 'Decorations using recyclable materials'],
    tags: ['Sustainable design', 'Event branding', 'Team collaboration'], technologies: [], image: boothPhoto.src, images: [boothPhoto], github: '', demo: '', status: 'Creatives Team project', featured: false,
    role: 'Creatives Team Member', year: '2026', organization: 'AWS Student Builder Group — JRU', tools: ['AI (ideation only)'],
    aiUsage: 'AI supported brainstorming and concept exploration only. The Creatives Team collaboratively designed and assembled the booth using recyclable materials.',
  },
  {
    id: 'zodiac-says', title: 'Zodiac Says', category: 'Graphic Design', format: 'Social media design series',
    description: "A social media series pairing zodiac archetypes with AWS services through illustration, typography, and consistent branding.",
    overview: "Three coordinated graphics introduce Amazon S3, AWS Amplify, and Amazon EventBridge through zodiac-based storytelling. The series adapts a single visual system across different subjects.",
    approach: "Purple-and-gold framing, illustrated compositions, and a consistent type hierarchy connect the series. Each graphic balances the service pairing with short, accessible supporting text.",
    deliverables: ['Cancer × Amazon S3 graphic', 'Sagittarius × AWS Amplify graphic', 'Gemini × Amazon EventBridge graphic'],
    tags: ['Social media', 'Visual storytelling', 'Series design'], technologies: [], image: zodiac[0].src, images: zodiac, github: '', demo: '', status: '3 artworks', featured: true,
    year: '2026', organization: 'AWS Student Builder Group — JRU', tools: graphicDesignTools, aiUsage: graphicDesignAiUsage,
  },
  {
    id: 'bsit-student-frames', title: 'BSIT & BSIT-BA Student Frames', category: 'Graphic Design', format: 'Student profile-frame collection',
    description: "Eight coordinated profile frames for BSIT and BSIT-BA students, organized by program and year level.",
    overview: "A student identity collection covering the first through fourth year of BSIT and BSIT-BA. Each frame reserves a clear portrait area while highlighting the program and year level.",
    approach: "A shared carnival theme connects the collection. Ferris-wheel motifs, admission-ticket details, and differentiated color palettes distinguish each year level within a consistent layout.",
    deliverables: ['Four BSIT year-level frame designs', 'Four BSIT-BA year-level frame designs', 'Combined design presentation board'],
    tags: ['Profile frames', 'Student identity', 'Design system'], technologies: [], image: frames.src, images: studentFrames, github: '', demo: '', status: '8 profile frames', featured: false,
    year: '2026', organization: 'José Rizal University', tools: graphicDesignTools, aiUsage: graphicDesignAiUsage,
  },
  {
    id: 'aws-sbg-flag', title: 'AWS SBG — Organization Flag', category: 'Graphic Design', format: 'Organization flag artwork',
    description: "An organizational flag combining the AWS Student Builder Group–JRU mascot, chapter name, and university branding.",
    overview: "A flag design presenting the chapter identity in a single landscape composition. The layout integrates the mascot, organization name, and university marks for event display.",
    approach: "Blue and gold establish the palette, while the mascot and chapter heading provide the main visual anchors. Supporting graphics direct attention through the composition.",
    deliverables: ['Organization flag design'],
    tags: ['Organization identity', 'Mascot composition', 'Layout design'], technologies: [], image: flag.src, images: [flag], github: '', demo: '', status: 'Flag artwork', featured: false,
    year: '2026', organization: 'AWS Student Builder Group — JRU', tools: graphicDesignTools, aiUsage: graphicDesignAiUsage,
  },
  {
    id: 'tech-countdown', title: 'Five Days to Come', category: 'Graphic Design', format: 'Event countdown poster',
    description: "A digital event poster using technology imagery and a clear type hierarchy to communicate a five-day countdown.",
    overview: "A social media publication designed around the event’s five-day reminder. A central phone display presents the countdown alongside chapter branding and technology-related imagery.",
    approach: "The central numeral establishes the reading order. Layered keyboard elements, a limited palette, and supporting event details frame the message without competing with it.",
    deliverables: ['Five-day event countdown graphic'],
    tags: ['Countdown', 'Event promotion', 'Digital composition'], technologies: [], image: countdown.src, images: [countdown], github: '', demo: '', status: 'Countdown artwork', featured: false,
    year: '2026', organization: 'AWS Student Builder Group — JRU', tools: graphicDesignTools, aiUsage: graphicDesignAiUsage,
  },
];
// Add only confirmed skills, certificates, and experiences.
export const skillGroups: { category: string; description: string; skills: string[] }[] = [
  { category: 'Front-End Development', description: "Responsive web interfaces and interactive components.", skills: ['Modern web development'] },
  { category: 'UI/UX Design', description: "Interface layouts, visual hierarchy, and user flows.", skills: ['Intuitive interfaces'] },
  { category: 'Graphic Design', description: "Visual identities, event publications, and digital compositions.", skills: ['Clean design'] },
];
export const credlyProfile = 'https://www.credly.com/users/dayer-aniog/badges';
export interface PortfolioCredential {
  id: string; title: string; issuer: string; date: string; image: string;
  verify?: string; type: 'Certificate' | 'Badge'; description: string; expires?: string;
  document?: string; credentialId?: string; label?: string; imageWidth?: number; imageHeight?: number;
  artworkKind?: 'document' | 'badge';
}
// Public Credly records and user-provided originals; see docs/credentials.md.
export const certificates: PortfolioCredential[] = [
  {
    id: 'huawei-data-communication-network-technology',
    title: 'Data Communication and Network Technology', issuer: 'Huawei ICT Academy',
    date: '2026-10-05', type: 'Certificate', label: 'Course completion', artworkKind: 'document',
    image: assetPath('/assets/credentials/huawei/data-communication-network-technology.png'),
    document: assetPath('/assets/credentials/huawei/data-communication-network-technology.png'),
    imageWidth: 2480, imageHeight: 3507, credentialId: 'ICT20261005000035',
    description: 'Completed the course study and assessment in data communication and network technology through Huawei ICT Academy.',
  },
  {
    id: 'mapua-ai-literacy-responsible-use',
    title: 'Introduction to AI Literacy and Responsible Use', issuer: 'Mapúa University',
    date: '2026-09-14', type: 'Certificate', label: 'Micro-credential certificate', artworkKind: 'document',
    image: assetPath('/assets/credentials/mapua/ai-literacy-responsible-use-certificate.png'),
    document: assetPath('/assets/credentials/mapua/ai-literacy-responsible-use-certificate.pdf'),
    imageWidth: 2105, imageHeight: 1490, credentialId: 'BJ4VBOPK5OX7A',
    description: 'Certificate of completion for the micro-credential course in AI literacy and responsible use.',
  },
  {
    id: 'mapua-ai-literacy-responsible-use-badge',
    title: 'Introduction to AI Literacy and Responsible Use', issuer: 'Mapúa University',
    date: '2026-09-14', type: 'Badge', label: 'Digital badge', artworkKind: 'badge',
    image: assetPath('/assets/credentials/mapua/ai-literacy-responsible-use-badge.png'),
    document: assetPath('/assets/credentials/mapua/ai-literacy-responsible-use-badge.png'),
    imageWidth: 798, imageHeight: 668,
    description: 'Digital badge for the Introduction to AI Literacy and Responsible Use micro-credential, provided by Mapúa University.',
  },
  {
    id: '9be7fe4f-ac72-4637-bc3c-bc962a1eb9ed', title: 'JavaScript Essentials 1', issuer: 'Cisco',
    date: '2026-08-07', type: 'Badge',
    image: assetPath('/assets/credentials/9be7fe4f-ac72-4637-bc3c-bc962a1eb9ed.png'),
    verify: 'https://www.credly.com/badges/9be7fe4f-ac72-4637-bc3c-bc962a1eb9ed/public_url',
    description: 'JavaScript foundations: variables, data types, control flow, functions, and debugging.',
  },
  {
    id: 'fcfd5dfa-3314-4cda-b23c-a64cecfeccb4', title: 'JavaScript Essentials 2', issuer: 'Cisco',
    date: '2026-08-07', type: 'Badge',
    image: assetPath('/assets/credentials/fcfd5dfa-3314-4cda-b23c-a64cecfeccb4.png'),
    verify: 'https://www.credly.com/badges/fcfd5dfa-3314-4cda-b23c-a64cecfeccb4/public_url',
    description: 'Object-oriented JavaScript, built-in objects, complex data structures, and asynchronous programming.',
  },
  {
    id: 'cb0ae71a-cd75-443f-91fc-e628852e7547', title: 'IT Specialist - Databases', issuer: 'Certiport, a Pearson VUE business',
    date: '2026-05-06', expires: '2031-05-06', type: 'Certificate',
    image: assetPath('/assets/credentials/cb0ae71a-cd75-443f-91fc-e628852e7547.png'),
    imageWidth: 1200, imageHeight: 1200,
    verify: 'https://www.credly.com/badges/cb0ae71a-cd75-443f-91fc-e628852e7547/public_url',
    description: 'Foundational knowledge of designing and querying relational databases.',
  },
];
export const milestones: { title: string; organization: string; date: string; dateISO: string; category?: string; role?: string; description: string }[] = [
  {
    title: 'ImaGnation: GCash Innovation Challenge',
    organization: 'GCash', category: 'Hackathon', role: 'Hackathon Participant', date: 'August 25, 2026', dateISO: '2026-08-25',
    description: 'Participated in a team innovation challenge focused on a proposed solution to a real-world problem. The team did not advance to the next stage in Bonifacio Global City. The experience provided practice in concept development, collaborative problem-solving, and presenting ideas.',
  },
  {
    title: 'First Runner-Up — Poster‑Making Competition',
    organization: 'Technological Institute of the Philippines – Quezon City', category: 'Achievement', date: 'May 9, 2025', dateISO: '2025-05-09',
    description: 'Awarded First Runner-Up in a poster-making competition for an original design demonstrating creativity, artistic technique, and clear visual communication. This recognition strengthened my commitment to graphic design and creative expression.',
  },
];

export const aiTools: AiTool[] = [
  {
    id: 'antigravity',
    name: 'Google Antigravity',
    category: "AI development environment",
    detail: "Coding assistance and project workflows",
    description: "An AI-assisted development tool used alongside other assistants during the EduFocus development process.",
    image: assetPath('/assets/ai-tools/antigravity.png'),
    glow: 'rgba(124, 58, 237, 0.55)',
    accent: '#8b5cf6',
    workflow: "Development support",
    capabilities: ['Multi-agent orchestration', 'Codebase refactoring', 'Automated testing & linting', 'Terminal & system execution'],
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    category: "AI assistant",
    detail: "Research and technical questions",
    description: "An AI assistant used to discuss technical questions and review development ideas.",
    image: assetPath('/assets/ai-tools/gemini.png'),
    glow: 'rgba(77, 130, 243, 0.55)',
    accent: '#3b82f6',
    workflow: "Research and review",
    capabilities: ['Visual mockup analysis', 'Large-context comprehension', 'Component architecture design', 'Heuristic UX review'],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: "AI assistant",
    detail: "Planning and development questions",
    description: "An AI assistant used for brainstorming, interface copy, and development discussions.",
    image: assetPath('/assets/ai-tools/chatgpt.png'),
    glow: 'rgba(16, 163, 127, 0.55)',
    accent: '#10a37f',
    workflow: "Planning and iteration",
    capabilities: ['Creative copywriting', 'Interface typography rhythm', 'Edge-case identification', 'Conceptual brainstorming'],
  },
  {
    id: 'codex',
    name: 'OpenAI Codex',
    category: "Coding assistant",
    detail: "Code implementation and review",
    description: "A coding assistant used to support implementation, debugging, and code refinement.",
    image: assetPath('/assets/ai-tools/codex.png'),
    glow: 'rgba(142, 85, 234, 0.55)',
    accent: '#a855f7',
    workflow: "Implementation support",
    capabilities: ['Idiomatic TypeScript synthesis', 'Performance profiling', 'Async flow structuring', 'Data parsing utilities'],
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    category: "Coding assistant",
    detail: "Editor suggestions and code assistance",
    description: "A coding assistant used to support programming tasks within the editor.",
    image: assetPath('/assets/ai-tools/copilot.png'),
    glow: 'rgba(47, 129, 247, 0.55)',
    accent: '#2f81f7',
    workflow: "Editor assistance",
    capabilities: ['Contextual inline suggestions', 'Boilerplate elimination', 'Unit test generation', 'Type annotation inference'],
  },
  {
    id: 'aistudio',
    name: 'Google AI Studio',
    category: "AI prototyping tool",
    detail: "Prompt testing and experimentation",
    description: "A tool used to explore prompts and AI-assisted application workflows.",
    image: assetPath('/assets/ai-tools/aistudio.png'),
    glow: 'rgba(234, 67, 53, 0.55)',
    accent: '#ea4335',
    workflow: "AI prototyping",
    capabilities: ['Prompt system tuning', 'Model parameter testing', 'Structured JSON output schema', 'Multimodal input validation'],
  },
  {
    id: 'ai-design',
    name: 'Generative AI Visual Suite',
    category: "Generative design",
    detail: "Visual concepts and composition studies",
    description: "AI-assisted exploration of visual concepts and design references.",
    image: assetPath('/assets/ai-tools/ai-design.png'),
    glow: 'rgba(168, 85, 247, 0.55)',
    accent: '#c084fc',
    workflow: "Concept exploration",
    capabilities: ['Concept art generation', 'Lighting & texture reference', 'Asset composition ideation', '3D visual prototyping'],
  },
];
