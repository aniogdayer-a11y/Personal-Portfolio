import { useSyncExternalStore } from 'react';

type Theme = 'dark' | 'light';
const key = 'dayer-color-theme';
const changeEvent = 'dayer-theme-change';

function savedTheme(): Theme {
  try { return localStorage.getItem(key) === 'light' ? 'light' : 'dark'; }
  catch { return 'dark'; }
}

function applyTheme(theme: Theme, persist = true) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#F7F7F5' : '#0A0A0A');
  if (persist) { try { localStorage.setItem(key, theme); } catch { /* Keep the current session usable. */ } }
  window.dispatchEvent(new Event(changeEvent));
}

export function initializeTheme() { applyTheme(savedTheme(), false); }
const currentTheme = (): Theme => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
function subscribe(update: () => void) {
  const storage = (event: StorageEvent) => { if (event.key === key || event.key === null) initializeTheme(); };
  window.addEventListener(changeEvent, update);
  window.addEventListener('storage', storage);
  return () => { window.removeEventListener(changeEvent, update); window.removeEventListener('storage', storage); };
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, currentTheme, () => 'dark' as Theme);
  return { theme, toggleTheme: () => applyTheme(theme === 'dark' ? 'light' : 'dark') };
}
