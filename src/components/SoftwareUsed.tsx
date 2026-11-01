import { aiTools } from '../data/portfolioData';

// Display complete tiles from the original artwork; the old individual exports clipped their edges.
const tilePositions: Record<string, [number, number, number]> = {
  antigravity: [1095, 355, 350], gemini: [980, 15, 340], chatgpt: [360, 40, 326],
  codex: [650, 245, 340], copilot: [220, 365, 350], aistudio: [625, 575, 350],
};

export function SoftwareUsed() {
  return <section className="software-used" aria-labelledby="software-used-title"><h3 id="software-used-title">Development tools</h3><p>AI assistants used during front-end and back-end development.</p><ul>{aiTools.filter(tool => tool.id !== 'ai-design').map(tool => {
    const [x, y, size] = tilePositions[tool.id];
    return <li key={tool.id}><span className="software-tool-icon" aria-hidden="true" style={{ backgroundSize: `${1672 / size * 100}% ${941 / size * 100}%`, backgroundPosition: `${x / (1672 - size) * 100}% ${y / (941 - size) * 100}%`, clipPath: tool.id === 'codex' ? 'polygon(25% 0,100% 0,100% 100%,0 100%,0 35%)' : undefined }} /><span>{tool.name}</span></li>;
  })}</ul></section>;
}
