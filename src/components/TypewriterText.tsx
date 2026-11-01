import { useEffect, useState } from 'react';

/** Reserve the complete heading's space while its visual copy types once. */
export function TypewriterText({ text, disabled = false, active = true }: { text: string; disabled?: boolean; active?: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) { setCount(0); return; }
    if (disabled) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      let character = 0;
      interval = setInterval(() => {
        character += 1;
        setCount(character);
        if (character >= text.length) clearInterval(interval);
      }, 78);
    }, 600);
    return () => { clearTimeout(start); clearInterval(interval); };
  }, [text, disabled, active]);
  const complete = disabled || count >= text.length;
  return <span className="typewriter" aria-hidden="true" data-typing={!complete}>
    <span className="typewriter-reserve">{text}</span>
    <span className="typewriter-visible">{disabled ? text : text.slice(0, count)}<span className="typewriter-caret" /></span>
  </span>;
}
