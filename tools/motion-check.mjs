import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
const wait = ms => new Promise(r => setTimeout(r, ms));
const tabs = await (await fetch('http://127.0.0.1:9225/json')).json();
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(), errors = [];
ws.onmessage = e => { const m=JSON.parse(e.data); if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result)} if(m.method==='Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text) };
const cdp=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
const ev=async expression=>{const r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const until=async fn=>{for(let i=0;i<100;i++){if(await fn())return;await wait(100)}throw Error('Timed out: '+fn)};
const phase=()=>ev('document.querySelector(".home-loader")?.dataset.phase');
const size=(width,height)=>cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<760});
const home=async()=>{await cdp('Page.navigate',{url:'http://127.0.0.1:5173/home'});await until(async()=>await phase()==='waiting')};
const rect=selector=>ev(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);
const mouse=(type,x,y)=>cdp('Input.dispatchMouseEvent',{type,x,y,button:'left',buttons:type==='mouseReleased'?0:1,clickCount:1});
const measure=()=>ev('(()=>{const id=document.querySelector(".id-assembly"),scene=document.querySelector(".identity-intro");return{top:id.style.top,left:id.style.left,scale:id.style.transform.match(/scale\\(([^)]+)/)?.[1],position:getComputedStyle(id).position,y:id.getBoundingClientRect().top-scene.getBoundingClientRect().top}})()');
try{
 await cdp('Page.enable');await cdp('Runtime.enable');await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});await size(1440,900);await home();await ev('document.querySelector(".game-cartridge").click()');
 const frames=await ev(`new Promise(resolve=>{const rows=[];const start=performance.now();function tick(){if(document.querySelector('.portfolio-shell').dataset.homeEntry==='revealing'){const id=document.querySelector('.id-assembly');rows.push({y:id.getBoundingClientRect().top,transform:getComputedStyle(document.querySelector('main')).transform})}if(performance.now()-start<4700)requestAnimationFrame(tick);else resolve(rows)}tick()})`);
 assert.ok(frames.length>5);assert.ok(frames.every(f=>f.transform==='none'));const range=Math.max(...frames.map(f=>f.y))-Math.min(...frames.map(f=>f.y));assert.ok(range<1,`Reveal displacement ${range}px`);console.log('PASS stable console reveal:',range.toFixed(3),'px');
 await until(async()=>!await phase());
 await until(()=>ev('document.querySelector(".identity-intro").dataset.idMotion==="resting"'));
 const resting=await ev('document.querySelector(".id-assembly").style.transform');
 const hover=await rect('.actual-id');
 for(let i=0;i<8;i++){await mouse('mouseMoved',hover.x+(i%2?10:-10),hover.y);await wait(30)}
 assert.equal(await ev('document.querySelector(".id-assembly").style.transform'),resting,'Hover must not move the ID');
 console.log('PASS resting ID remains steady on hover');
 const before=await measure();await ev('window.scrollTo({top:250,behavior:"instant"})');await wait(350);const after=await measure();assert.equal(after.position,'absolute');assert.ok(Math.abs(after.y-before.y)<2,'ID stays at its home anchor during scroll');
 await ev('[...document.querySelectorAll(".site-nav a")].find(a=>a.pathname==="/about").click()');await wait(1800);const frozen=await ev('document.querySelector(".id-assembly").style.transform');await wait(600);assert.equal(await ev('document.querySelector(".id-assembly").style.transform'),frozen,'Offscreen physics pauses');
 await ev('[...document.querySelectorAll(".site-nav a")].find(a=>a.pathname==="/home").click()');await wait(1800);let p=await rect('.actual-id');await mouse('mousePressed',p.x,p.y);await mouse('mouseMoved',p.x,p.y+170);await wait(400);assert.equal(await ev('document.querySelector(".id-assembly").classList.contains("is-grabbed")'),true);
 await cdp('Input.dispatchMouseEvent',{type:'mouseWheel',x:p.x,y:p.y+100,deltaX:0,deltaY:200});await wait(500);assert.equal(await ev('document.querySelector(".id-assembly").classList.contains("is-grabbed")'),false);await mouse('mouseReleased',p.x,p.y+170);assert.equal(await ev('location.pathname'),'/home');console.log('PASS anchored scroll, offscreen pause, scroll cancels drag without navigation');
 await size(390,844);await home();await ev('document.querySelector(".loader-bottom button").click()');await wait(700);const mobile=await measure();await size(390,740);await wait(350);const resized=await measure();assert.equal(mobile.top,resized.top);assert.equal(mobile.scale,resized.scale);console.log('PASS mobile browser height changes preserve ID position and scale');
 await size(1920,1080);await wait(500);assert.ok(await ev('Math.abs(parseFloat(document.querySelector(".id-assembly").style.left)-document.querySelector(".identity-intro").clientWidth*.27)<1'));assert.equal(await ev('document.documentElement.scrollWidth>innerWidth+1'),false);console.log('PASS wide viewport uses actual hero width');
 await size(1440,900);await ev('[...document.querySelectorAll(".site-nav a")].find(a=>a.pathname==="/contact").click()');await wait(1750);assert.ok(await ev('Math.abs(document.getElementById("contact").getBoundingClientRect().top-document.querySelector(".site-header").getBoundingClientRect().bottom)<8'));console.log('PASS long navbar transition aligns smoothly');
 assert.deepEqual(errors,[]);
}finally{ws.close()}
