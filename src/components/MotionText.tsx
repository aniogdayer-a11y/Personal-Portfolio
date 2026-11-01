import { Children, cloneElement, isValidElement } from 'react';
import type { CSSProperties, ReactNode } from 'react';

/** Word masks preserve natural wrapping, inline styling, and readable text. */
export function MotionText({ children }: { children: ReactNode }) {
  let word = 0;
  const split = (content: ReactNode): ReactNode => Children.map(content, child => {
    if (typeof child === 'string') return child.split(/(\s+)/).map((part, index) => {
      if (!part.trim()) return part;
      const order = word++;
      return <span className="motion-word-mask" key={index}><span className="motion-word" style={{ '--word-order': Math.min(order, 14) } as CSSProperties}>{part}</span></span>;
    });
    if (isValidElement<{ children?: ReactNode }>(child) && child.props.children) return cloneElement(child, {}, split(child.props.children));
    return child;
  });
  return <span className="motion-title">{split(children)}</span>;
}
