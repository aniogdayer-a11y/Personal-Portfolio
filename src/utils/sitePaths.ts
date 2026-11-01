// Vite supplies the deployment prefix; Node-based data tests use the root default.
const base = import.meta.env?.BASE_URL ?? '/';
const prefixed = base !== '/';

export function assetPath(path: string) {
  if (!path.startsWith('/') || path.startsWith('//') || !prefixed || path.startsWith(base)) return path;
  return `${base}${path.slice(1)}`;
}

// Project Pages cannot resolve arbitrary server routes. Hash routes survive refreshes.
export function routeHref(path: string) {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  return prefixed ? `${base}#${path}` : path;
}

export function readRoute() {
  if (prefixed && window.location.hash.startsWith('#/')) return window.location.hash.slice(1).split('#')[0].replace(/\/$/, '') || '/';
  const path = prefixed && window.location.pathname.startsWith(base) ? `/${window.location.pathname.slice(base.length)}` : window.location.pathname;
  return path.replace(/\/$/, '') || '/';
}
