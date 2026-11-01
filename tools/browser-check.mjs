import { writeFile, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const tabs = await (await fetch('http://127.0.0.1:9225/json')).json();
const tab = tabs.find(t => t.type === 'page');
if (!tab) throw new Error('Start headless Chrome with --remote-debugging-port=9225 before this check.');
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let serial = 0; const pending = new Map(); const errors = [];
ws.onmessage = event => { const msg = JSON.parse(event.data); if (msg.id) { const entry = pending.get(msg.id); if (!entry) return; pending.delete(msg.id); if (msg.error) entry.reject(new Error(JSON.stringify(msg.error))); else entry.resolve(msg.result); } if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.text); };
const cdp = (method, params = {}) => new Promise((resolve, reject) => { const id = ++serial; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
const evaluate = async expression => { const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails)); return result.result.value; };
const base = 'http://127.0.0.1:5173';
async function dismissOpening() {
  if (!await evaluate('!!document.querySelector(".home-loader")')) return;
  await evaluate('document.querySelector(".loader-bottom button")?.click()');
  for (let i = 0; i < 40; i++) { if (!await evaluate('!!document.querySelector(".home-loader")')) return; await sleep(50); }
  throw new Error('Home intro did not release the interface');
}
async function navigate(path) { await cdp('Page.navigate', { url: base + path }); await sleep(700); await evaluate('document.fonts.ready'); await dismissOpening(); }
async function click(selector) { await dismissOpening(); const r = await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)throw new Error('Missing '+${JSON.stringify(selector)});e.scrollIntoView({block:'center',behavior:'instant'});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`); await mouse('mousePressed', r.x, r.y); await mouse('mouseReleased', r.x, r.y); await sleep(150); }
let mouseDown = false;
async function mouse(type, x, y) { if (type === 'mousePressed') mouseDown = true; if (type === 'mouseReleased') mouseDown = false; await cdp('Input.dispatchMouseEvent', { type, x, y, button: mouseDown ? 'left' : type === 'mouseMoved' ? 'none' : 'left', buttons: mouseDown ? 1 : 0, clickCount: 1 }); }
async function cardCenter() { return evaluate(`(()=>{const r=document.querySelector('.actual-id').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height*.55}})()`); }
async function drag(dx, dy, release = true) { const p = await cardCenter(); await mouse('mouseMoved', p.x, p.y); await mouse('mousePressed', p.x, p.y); for (let i = 1; i <= 15; i++) { await mouse('mouseMoved', p.x + dx*i/15, p.y + dy*i/15); await sleep(20); } await sleep(300); if (release) await mouse('mouseReleased', p.x+dx, p.y+dy); return p; }
async function capture(name) { const result = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }); await writeFile(`tmp/qa/${name}.png`, Buffer.from(result.data, 'base64')); }
async function noOverflow(label) { assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), `${label}: horizontal overflow`); }
try {
  await mkdir('tmp/qa', { recursive: true }); await cdp('Runtime.enable'); await cdp('Page.enable');
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await cdp('Emulation.setEmulatedMedia', { features: [] });
  await cdp('Emulation.setTouchEmulationEnabled', { enabled: false });
  await mouse('mouseReleased', 0, 0);
  await navigate('/'); await evaluate('sessionStorage.clear()'); await navigate('/');
  await sleep(700); await capture('intro-desktop'); await noOverflow('Desktop intro');
  assert.equal(await evaluate('document.querySelector(".actual-id").naturalWidth'), 1024);
  assert.equal(await evaluate('document.querySelector(".actual-id").naturalHeight'), 1536);
  await drag(600, 0); await sleep(700); assert.equal(await evaluate('location.pathname'), '/', 'Horizontal drag must not enter');
  await drag(0, 35); await sleep(500); assert.equal(await evaluate('location.pathname'), '/', 'Small drag must not enter');
  await drag(0, 210, false); assert.equal(await evaluate('document.querySelector(".id-assembly").classList.contains("is-ready")'), true);
  await capture('intro-pulled');
  // Compare actual strap endpoint to buckle attachment at the moment of tension.
  const connected = await evaluate(`(()=>{const s=document.querySelector('.lanyard-canvas g:last-child').getScreenCTM();const r=document.querySelector('.lanyard-canvas g:last-child rect');const p=new DOMPoint(0,+r.getAttribute('height')).matrixTransform(s);const b=document.querySelector('.id-hardware').getBoundingClientRect();return Math.hypot(p.x-(b.x+b.width/2),p.y-b.y)})()`);
  assert.ok(connected < 22, `Strap should terminate at the buckle (distance ${connected})`);
  const p = await cardCenter(); await mouse('mouseReleased', p.x, p.y); await sleep(1400);
  assert.equal(await evaluate('location.pathname'), '/', 'Pull remains interactive without navigation'); await click('.intro-copy button'); await sleep(1400); assert.equal(await evaluate('location.pathname'), '/about');
  await capture('profile-desktop'); await noOverflow('Desktop profile');
  for (const route of ['/projects','/skills','/certifications','/experience','/contact']) {
    await click(`.site-nav a[href="${route}"]`); await sleep(1400); assert.equal(await evaluate('location.pathname'), route); await noOverflow(route);
    assert.equal(await evaluate('document.querySelectorAll(".identity-intro").length'), 1);
    assert.ok(await evaluate('document.querySelector(".site-nav a[aria-current=page]").getAttribute("href") === location.pathname'));
  }
  await capture('contact-desktop');
  await evaluate('history.back()'); await sleep(350); assert.equal(await evaluate('location.pathname'), '/experience');
  await evaluate('history.forward()'); await sleep(350); assert.equal(await evaluate('location.pathname'), '/contact');
  await navigate('/projects/edufocus'); assert.ok(await evaluate('!!document.querySelector(".detail-preview")'));
  await navigate('/does-not-exist'); assert.ok(await evaluate('document.body.textContent.includes("Page unavailable")'));
  // Direct links enter immediately, independently of intro session state.
  await evaluate('sessionStorage.clear()'); await navigate('/skills'); assert.equal(await evaluate('document.querySelectorAll(".identity-intro").length'), 1);
  await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await cdp('Emulation.setTouchEmulationEnabled', { enabled: true });
  await navigate('/about'); await noOverflow('Mobile profile'); await capture('profile-mobile');
  await click('.mobile-menu-button'); assert.equal(await evaluate('document.querySelector(".mobile-menu-button").getAttribute("aria-expanded")'), 'true');
  await click('.site-nav a[href="/contact"]'); await sleep(1400); assert.equal(await evaluate('location.pathname'), '/contact'); assert.equal(await evaluate('document.querySelector(".mobile-menu-button").getAttribute("aria-expanded")'), 'false');
  assert.ok(await evaluate('Math.abs(document.getElementById("contact").getBoundingClientRect().top-document.querySelector(".site-header").getBoundingClientRect().bottom)<8'), 'Section aligns below header');
  await noOverflow('Mobile contact'); await capture('contact-mobile');
  for (const route of ['/projects','/skills','/certifications','/experience']) { await navigate(route); await noOverflow(`Mobile ${route}`); }
  await evaluate('sessionStorage.clear()'); await navigate('/'); await capture('intro-mobile'); await noOverflow('Mobile intro');
  const cancelled = await cardCenter();
  await cdp('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: cancelled.x, y: cancelled.y }] });
  await cdp('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: cancelled.x, y: cancelled.y + 200 }] });
  await sleep(450);
  await cdp('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] }); await sleep(700);
  assert.equal(await evaluate('location.pathname'), '/', 'Cancelled touch gesture must not activate the switch');
  const touch = await cardCenter();
  await cdp('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: touch.x, y: touch.y }] });
  for (let i = 1; i <= 15; i++) { await cdp('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: touch.x, y: touch.y + i*12 }] }); await sleep(20); }
  await sleep(300); await cdp('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(1400);
  assert.equal(await evaluate('location.pathname'), '/', 'Touch pull stays on Home');
  await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await evaluate('sessionStorage.clear()'); await navigate('/');
  assert.equal(await evaluate('matchMedia("(prefers-reduced-motion: reduce)").matches'), true);
  assert.equal(await evaluate('document.documentElement.dataset.motion'), 'on', 'Effects start enabled even when the system reduces motion');
  assert.equal(await evaluate('document.querySelector(".effects-toggle")'), null, 'Effects remain enabled without a switch');
  const previousTheme = await evaluate('document.documentElement.dataset.theme');
  await click('.theme-toggle');
  assert.notEqual(await evaluate('document.documentElement.dataset.theme'), previousTheme, 'Theme control switches appearance');
  await click('.theme-toggle');
  await evaluate('document.querySelector(".id-assembly").focus()');
  await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 }); await sleep(1400);
  assert.equal(await evaluate('location.pathname'), '/', 'Keyboard swings ID without navigating');
  assert.equal(await evaluate('document.querySelector(".replay-button")'), null, 'Header reset is removed');
  await click('.mobile-menu-button');
  await click('.site-nav a[href="/home"]'); await sleep(250);
  assert.equal(await evaluate('location.pathname'), '/home', 'Explicit Home scrolls back to the introduction');
  await click('.intro-copy button'); await sleep(1400);
  assert.equal(await evaluate('location.pathname'), '/about', 'About Me button provides accessible entry');
  assert.deepEqual(errors, []);
  console.log('PASS: asset dimensions, connected strap, constrained drag, threshold and release, recoil without navigation, continuous sections, history, direct links, details, 404, desktop/mobile layout, touch, keyboard, automatic effects and theme switching, no runtime exceptions.');
} finally { ws.close(); }
