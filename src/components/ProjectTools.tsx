import { assetPath } from '../utils/sitePaths';
const toolImages: Record<string, { src: string; className?: string }> = {
  Tiled: { src: assetPath('/assets/tools/tiled.png') },
  Canva: { src: assetPath('/assets/tools/canva-wordmark.svg'), className: 'project-tool-icon--canva' },
  Figma: { src: assetPath('/assets/tools/figma-color.svg') },
  Photoshop: { src: assetPath('/assets/tools/photoshop.svg'), className: 'project-tool-icon--photoshop' },
  Picsart: { src: assetPath('/assets/tools/picsart.svg') },
  ibisPaint: { src: assetPath('/assets/tools/ibispaint.png') },
};

/** Tiny software marks accompany labels without borrowing the large 3D tile styling. */
export function ProjectTools({ tools }: { tools: string[] }) {
  return <ul className="project-tools-list">{tools.map(name => {
    const icon = toolImages[name];
    return <li key={name}>{icon && <img className={icon.className} src={icon.src} width="15" height="15" alt="" loading="lazy" />}<span>{name}</span></li>;
  })}</ul>;
}
