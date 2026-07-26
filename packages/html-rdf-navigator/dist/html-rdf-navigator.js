import{c as $e,d as fe,e as de,f as He,g as st,h as ge,i as be,j as ze,k as O,l as Ee,m as ne,n as je,o as ct}from"./chunks/chunk-37NUEJFD.js";var Yt="http://www.w3.org/2000/01/rdf-schema#seeAlso",Xt="http://www.w3.org/2000/01/rdf-schema#isDefinedBy",Jt="http://purl.org/dc/terms/requires",Zt="http://purl.org/dc/terms/source",en="http://www.w3.org/ns/prov#wasDerivedFrom",tn="http://www.w3.org/2002/07/owl#imports",nn="http://www.w3.org/ns/dcat#qualifiedRelation",on="http://purl.org/dc/terms/relation",rn="http://www.w3.org/ns/dcat#hadRole",ut=new Set([Yt,Xt,Jt,Zt,en,tn]);function oe(o){return o?`${o.termType}:${o.value}`:"default"}function lt(o,e){return oe(o)===oe(e)}function dt(o){try{let e=new URL(o);return e.hash="",e.href}catch{return o.replace(/#.*$/s,"")}}function an(o){let e=2166136261;for(let t=0;t<o.length;t+=1)e^=o.charCodeAt(t),e=Math.imul(e,16777619);return`discovery-${(e>>>0).toString(36)}`}function pt(o,e){o.some(t=>t.value===e.value)||o.push(e)}function sn(o,e){o.some(t=>oe(t)===oe(e))||o.push(e)}function Se(o,e){o.includes(e)||o.push(e)}function _e(o){let e=new Map,t=dt(o.sourceDocumentIri),n=(r,a,i)=>{if(dt(a.value)===t)return null;let s=`${oe(r)}|${oe(i)}|${a.value}`,c=e.get(s);return c||(c={context:r,graph:i,id:an(s),predicates:[],qualifiedRelationships:[],roles:[],sources:[],target:a},e.set(s,c)),c};for(let r of o.quads){if(!ut.has(r.predicate.value)||r.object.termType!=="NamedNode")continue;let a=n(r.subject,r.object,r.graph);a&&(pt(a.predicates,r.predicate),Se(a.sources,r.source))}for(let r of o.quads){if(r.predicate.value!==nn||r.object.termType!=="NamedNode"&&r.object.termType!=="BlankNode")continue;let a=r.object,i=o.quads.filter(l=>lt(l.subject,a)&&lt(l.graph,r.graph)),s=i.filter(l=>l.predicate.value===on&&l.object.termType==="NamedNode"),c=i.filter(l=>l.predicate.value===rn&&l.object.termType==="NamedNode");for(let l of s){if(l.object.termType!=="NamedNode")continue;let d=n(r.subject,l.object,r.graph);if(d){sn(d.qualifiedRelationships,a),Se(d.sources,r.source),Se(d.sources,l.source);for(let p of c)p.object.termType==="NamedNode"&&(pt(d.roles,p.object),Se(d.sources,p.source))}}}return Array.from(e.values()).sort((r,a)=>r.target.value.localeCompare(a.target.value))}function Oe(o,e){let t=[...o.quads],n=new Map(o.graphs.map(a=>[oe(a),a])),r=[...o.diagnostics];for(let a of e){let i=$e(a.result.sourceDocumentIri);for(let s of a.result.quads){let c=s.graph??i;t.push({...s,graph:c}),n.set(oe(c),c)}for(let s of a.result.graphs)n.set(oe(s),s);r.push(...a.result.diagnostics.map(s=>({...s,message:`Contribution ${a.result.sourceDocumentIri}: ${s.message}`})))}return{...o,diagnostics:r,graphs:Array.from(n.values()),quads:t}}function K(o){return o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var Fe=[{position:"right",label:"Right, full height",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M13 2h5v12h-5z"/></svg>'},{position:"right-top",label:"Right, top half",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M13 2h5v5.5h-5z"/></svg>'},{position:"right-bottom",label:"Right, bottom half",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M13 8.5h5V14h-5z"/></svg>'},{position:"bottom",label:"Bottom, full width",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 9h16v5H2z"/></svg>'},{position:"floating",label:"Floating, centered",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><rect class="position-region" x="5" y="4.5" width="10" height="7" rx="1"/></svg>'},{position:"top",label:"Top, full width",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 2h16v5H2z"/></svg>'},{position:"left",label:"Left, full height",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 2h5v12H2z"/></svg>'},{position:"left-bottom",label:"Left, bottom half",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 8.5h5V14H2z"/></svg>'},{position:"left-top",label:"Left, top half",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 2h5v5.5H2z"/></svg>'}],ft=`
  .ia2-window-surface {
    border-left: 1px solid var(--ia2-window-rule, currentColor);
    bottom: 0;
    box-shadow: -12px 0 48px oklch(20% 0.03 286 / 18%);
    max-width: 100vw;
    position: fixed;
    right: 0;
    top: 0;
    transform: translateX(105%);
    transition:
      opacity 180ms ease,
      transform var(--ia2-window-transition-duration, 220ms) cubic-bezier(.22, 1, .36, 1),
      visibility var(--ia2-window-transition-duration, 220ms);
    visibility: hidden;
    width: var(--ia2-window-width, min(760px, 72vw));
  }
  .ia2-window-surface[data-open=""],
  .ia2-window-surface[data-open="true"] {
    transform: translateX(0);
    visibility: visible;
  }
  .ia2-window-surface[data-position^="left"] {
    border-left: 0;
    border-right: 1px solid var(--ia2-window-rule, currentColor);
    box-shadow: 12px 0 48px oklch(20% 0.03 286 / 18%);
    left: 0;
    right: auto;
    transform: translateX(-105%);
  }
  .ia2-window-surface[data-position^="left"][data-open=""],
  .ia2-window-surface[data-position^="left"][data-open="true"] {
    transform: translateX(0);
  }
  .ia2-window-surface[data-position$="-top"] {
    bottom: auto;
    border-bottom: 1px solid var(--ia2-window-rule, currentColor);
    height: var(--ia2-window-half-height, 50vh);
    top: 0;
  }
  .ia2-window-surface[data-position$="-bottom"] {
    border-top: 1px solid var(--ia2-window-rule, currentColor);
    bottom: 0;
    height: var(--ia2-window-half-height, 50vh);
    top: auto;
  }
  .ia2-window-surface[data-position="top"],
  .ia2-window-surface[data-position="bottom"] {
    border: 0;
    height: var(--ia2-window-horizontal-height, 50vh);
    left: 0;
    max-width: none;
    right: 0;
    width: 100vw;
  }
  .ia2-window-surface[data-position="top"] {
    border-bottom: 1px solid var(--ia2-window-rule, currentColor);
    bottom: auto;
    box-shadow: 0 12px 48px oklch(20% 0.03 286 / 18%);
    top: 0;
    transform: translateY(-105%);
  }
  .ia2-window-surface[data-position="bottom"] {
    border-top: 1px solid var(--ia2-window-rule, currentColor);
    bottom: 0;
    box-shadow: 0 -12px 48px oklch(20% 0.03 286 / 18%);
    top: auto;
    transform: translateY(105%);
  }
  .ia2-window-surface[data-position="top"][data-open=""],
  .ia2-window-surface[data-position="top"][data-open="true"],
  .ia2-window-surface[data-position="bottom"][data-open=""],
  .ia2-window-surface[data-position="bottom"][data-open="true"] {
    transform: translateY(0);
  }
  .ia2-window-surface[data-position="floating"] {
    border: 1px solid var(--ia2-window-rule, currentColor);
    border-radius: var(--ia2-window-floating-radius, 14px);
    bottom: auto;
    box-shadow: 0 18px 64px oklch(20% 0.03 286 / 24%);
    height: var(--ia2-window-floating-height, min(860px, calc(100vh - 48px)));
    left: var(--ia2-window-floating-left, 50%);
    opacity: 0;
    overflow: hidden;
    right: auto;
    top: var(--ia2-window-floating-top, 50%);
    transform: var(--ia2-window-floating-closed-transform, translate(-50%, -48%) scale(.985));
    width: var(--ia2-window-floating-width, min(760px, calc(100vw - 48px)));
  }
  .ia2-window-surface[data-position="floating"][data-open=""],
  .ia2-window-surface[data-position="floating"][data-open="true"] {
    opacity: 1;
    transform: var(--ia2-window-floating-open-transform, translate(-50%, -50%) scale(1));
  }
  .ia2-window-surface[data-position="floating"][data-dragged="true"] {
    transform: none;
  }
  .ia2-window-resize-handles {
    display: none;
  }
  .ia2-window-surface[data-position="floating"] .ia2-window-resize-handles {
    display: contents;
  }
  .ia2-window-resize-handle {
    position: absolute;
    touch-action: none;
    z-index: 12;
  }
  .ia2-window-resize-handle[data-resize="n"],
  .ia2-window-resize-handle[data-resize="s"] {
    height: 10px;
    left: 18px;
    right: 18px;
  }
  .ia2-window-resize-handle[data-resize="n"] {
    cursor: ns-resize;
    top: 0;
  }
  .ia2-window-resize-handle[data-resize="s"] {
    bottom: 0;
    cursor: ns-resize;
  }
  .ia2-window-resize-handle[data-resize="e"],
  .ia2-window-resize-handle[data-resize="w"] {
    bottom: 18px;
    top: 18px;
    width: 10px;
  }
  .ia2-window-resize-handle[data-resize="e"] {
    cursor: ew-resize;
    right: 0;
  }
  .ia2-window-resize-handle[data-resize="w"] {
    cursor: ew-resize;
    left: 0;
  }
  .ia2-window-resize-handle[data-resize="ne"],
  .ia2-window-resize-handle[data-resize="nw"],
  .ia2-window-resize-handle[data-resize="se"],
  .ia2-window-resize-handle[data-resize="sw"] {
    height: 20px;
    width: 20px;
  }
  .ia2-window-resize-handle[data-resize="ne"] {
    cursor: nesw-resize;
    right: 0;
    top: 0;
  }
  .ia2-window-resize-handle[data-resize="nw"] {
    cursor: nwse-resize;
    left: 0;
    top: 0;
  }
  .ia2-window-resize-handle[data-resize="se"] {
    bottom: 0;
    cursor: nwse-resize;
    right: 0;
  }
  .ia2-window-resize-handle[data-resize="sw"] {
    bottom: 0;
    cursor: nesw-resize;
    left: 0;
  }
  .ia2-window-resize-handle[data-resize="se"]::after {
    border-bottom: 2px solid color-mix(in oklch, currentColor, transparent 68%);
    border-right: 2px solid color-mix(in oklch, currentColor, transparent 68%);
    bottom: 5px;
    content: "";
    height: 6px;
    position: absolute;
    right: 5px;
    width: 6px;
  }
  .ia2-window-surface.is-resizing {
    transition: none;
    user-select: none;
  }
  @media (max-width: 760px) {
    .ia2-window-surface,
    .ia2-window-surface[data-position] {
      border: 0;
      border-radius: 0;
      bottom: 0;
      height: 100vh;
      left: auto;
      max-width: none;
      opacity: 1;
      right: 0;
      top: 0;
      transform: translateX(105%);
      width: 100%;
    }
    .ia2-window-surface[data-position][data-open=""],
    .ia2-window-surface[data-position][data-open="true"] {
      transform: translateX(0);
    }
    .ia2-window-surface[data-position^="left"] {
      left: 0;
      right: auto;
      transform: translateX(-105%);
    }
    .ia2-window-surface[data-position="floating"] .ia2-window-resize-handles {
      display: none;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .ia2-window-surface { transition: none; }
  }
`;function ke(o){return typeof o=="string"&&Fe.some(({position:e})=>e===o)}function gt({allowed:o=Fe.map(({position:a})=>a),ariaLabel:e,current:t,groupClass:n="",optionClass:r=""}){let a=K(n),i=K(r),s=new Set(o),c=Fe.filter(({position:l})=>s.has(l)).map(({icon:l,label:d,position:p})=>`<button class="ia2-position-option ${i}" type="button" role="radio" data-position="${p}" aria-checked="${t===p}" aria-label="${K(d)}" title="${K(d)}" tabindex="${t===p?"0":"-1"}">${l}</button>`).join("");return`<div class="ia2-position-switch ${a}" role="radiogroup" aria-label="${K(e)}">${c}</div>`}function ht(o,e,t=!1){let n=Array.from(o.querySelectorAll(".ia2-position-option"));for(let r of n){let a=r.dataset.position===e;r.setAttribute("aria-checked",String(a)),r.tabIndex=a?0:-1,a&&t&&r.focus()}}function bt(o,e){let t=o instanceof HTMLElement&&o.matches(".ia2-position-switch")?o:o.querySelector(".ia2-position-switch"),n=Array.from(o.querySelectorAll(".ia2-position-option")),r=[];for(let i of n){let s=()=>{ke(i.dataset.position)&&e(i.dataset.position,!1)!==!1&&ht(o,i.dataset.position)};i.addEventListener("click",s),r.push(()=>i.removeEventListener("click",s))}let a=i=>{if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(i.key))return;i.preventDefault();let s=i.target instanceof HTMLButtonElement?n.indexOf(i.target):n.findIndex(d=>d.getAttribute("aria-checked")==="true"),c=s;i.key==="Home"&&(c=0),i.key==="End"&&(c=n.length-1),(i.key==="ArrowRight"||i.key==="ArrowDown")&&(c=(s+1)%n.length),(i.key==="ArrowLeft"||i.key==="ArrowUp")&&(c=(s-1+n.length)%n.length);let l=n[c]?.dataset.position;ke(l)&&e(l,!0)!==!1&&ht(o,l,!0)};return t?.addEventListener("keydown",a),r.push(()=>t?.removeEventListener("keydown",a)),()=>{for(let i of r)i()}}var vt=[{mode:"off",label:"Scroll synchronization off",icon:`<svg class="sync-icon" viewBox="0 0 32 16" aria-hidden="true" focusable="false">
      <path d="M16 2v5" />
      <path d="M11.7 4.4a6 6 0 1 0 8.6 0" />
    </svg>`},{mode:"page",label:"Follow page viewport in panel",icon:`<svg class="sync-icon" viewBox="0 0 34 16" aria-hidden="true" focusable="false">
      <rect x="1" y="2" width="8" height="12" rx="1.5" />
      <path d="M3.5 5h3M3.5 8h3M3.5 11h3M11.5 8h9m-3-3 3 3-3 3" />
      <circle cx="24" cy="4" r=".8" fill="currentColor" stroke="none" />
      <circle cx="24" cy="8" r=".8" fill="currentColor" stroke="none" />
      <circle cx="24" cy="12" r=".8" fill="currentColor" stroke="none" />
      <path d="M27 4h6M27 8h6M27 12h6" />
    </svg>`},{mode:"panel",label:"Follow panel in page",icon:`<svg class="sync-icon" viewBox="0 0 34 16" aria-hidden="true" focusable="false">
      <circle cx="2" cy="4" r=".8" fill="currentColor" stroke="none" />
      <circle cx="2" cy="8" r=".8" fill="currentColor" stroke="none" />
      <circle cx="2" cy="12" r=".8" fill="currentColor" stroke="none" />
      <path d="M5 4h6M5 8h6M5 12h6M22.5 8h-9m3-3-3 3 3 3" />
      <rect x="25" y="2" width="8" height="12" rx="1.5" />
      <path d="M27.5 5h3M27.5 8h3M27.5 11h3" />
    </svg>`}];function mt(o){return typeof o=="string"&&vt.some(({mode:e})=>e===o)}function wt({ariaLabel:o="Scroll synchronization",controlClass:e="",current:t,label:n="Sync",labels:r={},optionClass:a="",switchClass:i=""}){let s=K(e),c=K(a),l=K(i),d=vt.map(({icon:p,label:g,mode:m})=>{let h=r[m]??g;return`<button class="ia2-sync-option ${c}" type="button" role="radio" data-sync-mode="${m}" aria-checked="${t===m}" aria-label="${K(h)}" title="${K(h)}" tabindex="${t===m?"0":"-1"}">${p}</button>`}).join("");return`<div class="ia2-sync-control ${s}"><span class="ia2-sync-label sync-label">${K(n)}</span><div class="ia2-sync-switch ${l}" role="radiogroup" aria-label="${K(o)}">${d}</div></div>`}function Le(o,e,t=!1){let n=Array.from(o.querySelectorAll(".ia2-sync-option"));for(let r of n){let a=r.dataset.syncMode===e;r.setAttribute("aria-checked",String(a)),r.tabIndex=a?0:-1,a&&t&&r.focus()}}function xt(o,e){let t=o instanceof HTMLElement&&o.matches(".ia2-sync-switch")?o:o.querySelector(".ia2-sync-switch"),n=Array.from(o.querySelectorAll(".ia2-sync-option")),r=[];for(let i of n){let s=()=>{mt(i.dataset.syncMode)&&e(i.dataset.syncMode,!1)!==!1&&Le(o,i.dataset.syncMode)};i.addEventListener("click",s),r.push(()=>i.removeEventListener("click",s))}let a=i=>{if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(i.key))return;i.preventDefault();let s=i.target instanceof HTMLButtonElement?n.indexOf(i.target):n.findIndex(d=>d.getAttribute("aria-checked")==="true"),c=s;i.key==="Home"&&(c=0),i.key==="End"&&(c=n.length-1),(i.key==="ArrowRight"||i.key==="ArrowDown")&&(c=(s+1)%n.length),(i.key==="ArrowLeft"||i.key==="ArrowUp")&&(c=(s-1+n.length)%n.length);let l=n[c]?.dataset.syncMode;mt(l)&&e(l,!0)!==!1&&Le(o,l,!0)};return t?.addEventListener("keydown",a),r.push(()=>t?.removeEventListener("keydown",a)),()=>{for(let i of r)i()}}var cn=/(<https?:\/\/[^>]+>)|("(?:\\.|[^"\\])*"(?:@[A-Za-z0-9-]+(?:--(?:ltr|rtl))?|\^\^(?:<[^>]+>|[A-Za-z][\w-]*:[\w.-]+))?)|(^|\s)(@[a-z]+|[A-Za-z][\w-]*:[\w.-]+)|(_:[A-Za-z][\w-]*)|(#[^\n]*)/gim,ln=/("(?:\\.|[^"\\])*")\s*(?=:)|("(?:\\.|[^"\\])*")|\b(true|false|null)\b|\b(-?\d+(?:\.\d+)?)\b/g,dn=/(#[^\n\r]*)|("""(?:\\.|[\s\S])*?"""|'''(?:\\.|[\s\S])*?'''|"(?:\\.|[^"\\])*"(?:@[A-Za-z0-9-]+|\^\^(?:<[^>]+>|[A-Za-z][\w-]*:[\w.-]+))?|'(?:\\.|[^'\\])*'(?:@[A-Za-z0-9-]+|\^\^(?:<[^>]+>|[A-Za-z][\w-]*:[\w.-]+))?)|(<[^<>"{}|^`\\\u0000-\u0020]*>)|([?$][A-Za-z_][\w-]*)|\b(ADD|ALL|AS|ASC|ASK|BASE|BIND|BY|CLEAR|CONSTRUCT|COPY|CREATE|DATA|DEFAULT|DELETE|DESC|DESCRIBE|DISTINCT|DROP|EXISTS|FILTER|FROM|GRAPH|GROUP|HAVING|IN|INSERT|LIMIT|LOAD|MINUS|MOVE|NAMED|NOT|OFFSET|OPTIONAL|ORDER|PREFIX|REDUCED|SELECT|SERVICE|SILENT|TO|UNDEF|UNION|USING|VALUES|WHERE|WITH|TRUE|FALSE|A)\b|(\b-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?\b)|((?:[A-Za-z_][\w-]*)?:[\w.-]*)|([{}()[\];,.])/gim;function re(o,e,t,n){let r=n.createElement("span");r.className=`tok ${t}`,r.textContent=e,o.appendChild(r)}function pn(o,e,t,n){if(t==="iri"){let r=e.slice(1,-1),a=n.createElement("a");a.className="tok iri",a.textContent=e,a.href=r,a.target="_blank",a.rel="noopener noreferrer",o.appendChild(a);return}re(o,e,t,n)}function un(o){return o[1]?"iri":o[2]?"string":o[4]?"keyword":o[5]?"blank":o[6]?"comment":"name"}function hn(o){if(o[1])return"key";if(o[2]){try{let e=JSON.parse(o[2]);if(/^https?:\/\//.test(e))return"json-iri"}catch{}return"string"}return o[3]?"keyword":"number"}function mn(o){return o[1]?"comment":o[2]?"string":o[3]?"iri":o[4]?"variable":o[5]?"keyword":o[6]?"number":o[7]?"name":"punctuation"}function yt(o,e,t){if(e.startsWith("<!--")){re(o,e,"comment",t);return}if(/^<!doctype/i.test(e)){re(o,e,"keyword",t);return}let n=/^(<\/?)([^\s/>]+)([\s\S]*?)(\/?>)$/.exec(e);if(!n){o.appendChild(t.createTextNode(e));return}re(o,n[1],"punctuation",t),re(o,n[2],"name",t);let r=n[3]??"",a=/(\s+)([^\s=]+)(?:(\s*=\s*)("[^"]*"|'[^']*'|[^\s]+))?/g,i=0,s;for(;s=a.exec(r);)o.appendChild(t.createTextNode(r.slice(i,s.index)+s[1])),re(o,s[2],"key",t),s[3]&&o.appendChild(t.createTextNode(s[3])),s[4]&&re(o,s[4],"string",t),i=a.lastIndex;o.appendChild(t.createTextNode(r.slice(i))),re(o,n[4],"punctuation",t)}function fn(o,e,t){let n=0;for(;n<o.length;){let r=o.indexOf("<",n);if(r<0){e.appendChild(t.createTextNode(o.slice(n)));return}if(e.appendChild(t.createTextNode(o.slice(n,r))),o.startsWith("<!--",r)){let s=o.indexOf("-->",r+4),c=s<0?o.length:s+3;yt(e,o.slice(r,c),t),n=c;continue}let a="",i=r+1;for(;i<o.length;i+=1){let s=o[i];if(a)s===a&&(a="");else if(s==='"'||s==="'")a=s;else if(s===">"){i+=1;break}}yt(e,o.slice(r,i),t),n=i}}function pe(o,e,t){let n=t.createElement("pre"),r=t.createElement("code");if(n.append(r),e==="html")return fn(o,r,t),n;let a=e==="turtle"?new RegExp(cn):e==="sparql"?new RegExp(dn):new RegExp(ln),i=0,s;for(;s=a.exec(o);){r.append(t.createTextNode(o.slice(i,s.index)));let c=e==="turtle"?un(s):e==="sparql"?mn(s):hn(s);if(c==="json-iri"){let l=t.createElement("a");l.className="tok iri",l.textContent=s[0],l.href=JSON.parse(s[0]),l.target="_blank",l.rel="noopener noreferrer",r.append(l)}else e==="sparql"&&c==="iri"?re(r,s[0],c,t):pn(r,s[0],c,t);i=a.lastIndex}return r.append(t.createTextNode(o.slice(i))),n}function Et(o,e,t){let n=e.get(o);if(n)return n;let r=`source-${e.size+1}`;return e.set(o,r),t.push({id:r,markup:o.outerHTML}),r}function gn(o){let e=new Map,t=[];return{baseIri:o.baseIri,diagnostics:o.diagnostics.map(n=>({code:n.code,message:n.message,severity:n.severity,...n.source?{sourceId:Et(n.source,e,t)}:{}})),graphs:o.graphs,portableVersion:1,quads:o.quads.map(n=>({graph:n.graph,object:n.object,predicate:n.predicate,sourceId:Et(n.source,e,t),subject:n.subject})),retrievalDocumentIri:o.retrievalDocumentIri,sourceDocumentIri:o.sourceDocumentIri,sources:t,version:"1.2"}}function St(o,e){let t=e.implementation.createHTMLDocument(""),n=t.createElement("template");return n.innerHTML=o,n.content.firstElementChild??t.createElement("span")}function Ue(o,e){if(o.portableVersion!==1||o.version!=="1.2")throw new Error("Unsupported portable Navigator source version.");let t=new Map(o.sources.map(r=>[r.id,St(r.markup,e)])),n=r=>t.get(r)??St("<span></span>",e);return{baseIri:o.baseIri,diagnostics:o.diagnostics.map(r=>({code:r.code,message:r.message,severity:r.severity,...r.sourceId?{source:n(r.sourceId)}:{}})),graphs:o.graphs,quads:o.quads.map(r=>({graph:r.graph,object:r.object,predicate:r.predicate,source:n(r.sourceId),subject:r.subject})),retrievalDocumentIri:o.retrievalDocumentIri,sourceDocumentIri:o.sourceDocumentIri,version:"1.2"}}var bn="http://www.w3.org/1999/02/22-rdf-syntax-ns#type",V="http://www.w3.org/ns/shacl#",vn=`${V}NodeShape`,wn=`${V}PropertyShape`,xn=`${V}PropertyGroup`,Nt=`${V}name`,Mt=`${V}description`,We=`${V}order`,Ke=`${V}group`,Te=`${V}path`,Qe=`${V}property`,yn=new Set([`${V}node`,`${V}not`,`${V}qualifiedValueShape`]),kt=[Nt,"http://purl.org/dc/terms/title","http://www.w3.org/2000/01/rdf-schema#label","http://www.w3.org/2004/02/skos/core#prefLabel","https://schema.org/name"],En=[Mt,"http://purl.org/dc/terms/description","http://www.w3.org/2000/01/rdf-schema#comment","https://schema.org/description"],Sn=new Set([Nt,Mt,We,Ke,Te,Qe]);function ie(o){return o.termType==="NamedNode"||o.termType==="BlankNode"?`${o.termType}:${o.value}`:null}function Ve(o){return o.termType==="NamedNode"||o.termType==="BlankNode"?o:null}function kn(o,e){let t=ie(e);o.some(n=>ie(n)===t)||o.push(e)}function Ln(o,e){o.includes(e)||o.push(e)}function Tn(o,e){for(let t of e){let n=o.find(r=>r.predicate.value===t)?.object;if(n?.termType==="Literal")return n.value}}function Lt(o,e){let t=o.find(r=>r.predicate.value===e)?.object;if(t?.termType!=="Literal")return;let n=Number(t.value);return Number.isFinite(n)?n:void 0}function Be(o){return o===`${V}target`||o.startsWith(`${V}target`)}function Tt(o){if(o.termType==="BlankNode")return`Blank node ${o.value}`;try{let e=new URL(o.value),t=decodeURIComponent(e.hash.slice(1));if(t)return t;let n=e.pathname.split("/").filter(Boolean);return decodeURIComponent(n.at(-1)??o.value)}catch{return o.value}}function Rt(o,e){let t=o.order??Number.POSITIVE_INFINITY,n=e.order??Number.POSITIVE_INFINITY;return t!==n?t-n:(o.label??Tt(o.term)).localeCompare(e.label??Tt(e.term))}function Ge(o){let e=new Map,t=new Map,n=new Set,r=new Map,a=(c,l)=>{let d=ie(c);if(e.set(d,c),!l)return;let p=t.get(d);p||(p=new Set,t.set(d,p)),p.add(l)};for(let c of o.quads){let l=ie(c.subject);if(c.predicate.value===bn&&c.object.termType==="NamedNode"&&(c.object.value===vn&&a(c.subject,"node"),c.object.value===wn&&a(c.subject,"property"),c.object.value===xn&&r.set(l,c.subject)),Be(c.predicate.value)&&a(c.subject),c.predicate.value===Te&&a(c.subject,"property"),c.predicate.value===Qe){a(c.subject,"node");let d=Ve(c.object);d&&(a(d,"property"),n.add(ie(d)))}if(yn.has(c.predicate.value)){a(c.subject);let d=Ve(c.object);d&&a(d)}if(c.predicate.value===Ke){let d=Ve(c.object);d&&r.set(ie(d),d)}}let i=Array.from(e,([c,l])=>{let d=o.quads.filter(u=>ie(u.subject)===c),p=Array.from(t.get(c)??[]);p.length||p.push(n.has(c)||d.some(u=>u.predicate.value===Te)?"property":"node");let g=d.find(u=>u.predicate.value===Ke)?.object,m=[],h=[];for(let u of d)u.graph&&kn(m,u.graph),Ln(h,u.source);let w=d.filter(u=>Be(u.predicate.value)),R=d.filter(u=>u.predicate.value===Te),E=d.filter(u=>u.predicate.value===Qe),q=d.filter(u=>u.predicate.value.startsWith(V)&&!Sn.has(u.predicate.value)&&!Be(u.predicate.value)),x=ne(o.quads,l,{predicates:kt}),L=Tn(d,En),k=Lt(d,We);return{constraints:q,graphs:m,kinds:p,paths:R,properties:E,quads:d,sources:h,targets:w,term:l,...L?{description:L}:{},...g&&(g.termType==="NamedNode"||g.termType==="BlankNode")?{group:g}:{},...x?{label:x}:{},...k!==void 0?{order:k}:{}}}).sort(Rt),s=Array.from(r,([c,l])=>{let d=o.quads.filter(m=>ie(m.subject)===c),p=ne(o.quads,l,{predicates:kt}),g=Lt(d,We);return{quads:d,term:l,...p?{label:p}:{},...g!==void 0?{order:g}:{}}}).sort(Rt);return{count:i.length,groups:s,shapes:i}}var Rn="http://www.w3.org/1999/02/22-rdf-syntax-ns#type",Nn="http://www.w3.org/2000/01/rdf-schema#comment",Mn="http://purl.org/dc/terms/description",J="http://www.w3.org/ns/shacl#",Cn=new Set([`${J}SPARQLExecutable`,`${J}SPARQLSelectExecutable`,`${J}SPARQLAskExecutable`,`${J}SPARQLConstructExecutable`]),Ct=[{iri:`${J}select`,kind:"select"},{iri:`${J}ask`,kind:"ask"},{iri:`${J}construct`,kind:"construct"}];function qt(o){return`${o.termType}:${o.value}`}function Dt(o){if(o.termType==="BlankNode")return`Query ${o.value}`;let e=o.value.match(/[#/]([^#/]+)$/)?.[1];return e?decodeURIComponent(e).replace(/[-_]+/g," ").replace(/\b\w/g,t=>t.toUpperCase()):o.value}function Dn(o,e,t){if(o.termType==="NamedNode")return qt(o);let n=2166136261;for(let r of`${e}
${t}`)n^=r.codePointAt(0)??0,n=Math.imul(n,16777619);return`BlankNodeQuery:${(n>>>0).toString(16)}`}function Re(o){let e=new Map,t=a=>{let i=qt(a),s=e.get(i);return s||(s={executable:!1,queries:{},subject:a},e.set(i,s)),s};for(let a of o.quads){let i=t(a.subject);if(a.predicate.value===Rn&&a.object.termType==="NamedNode"&&Cn.has(a.object.value)&&(i.executable=!0),a.object.termType!=="Literal")continue;let s=Ct.find(({iri:c})=>c===a.predicate.value);if(s&&(i.queries[s.kind]=a.object.value.trim()),[Mn,Nn,`${J}description`].includes(a.predicate.value)&&(i.description??=a.object.value.trim()),a.predicate.value===`${J}order`){let c=Number(a.object.value);Number.isFinite(c)&&(i.order=c)}}let n=[],r=Array.from(e.values()).flatMap(a=>{if(!a.executable)return[];let i=Ct.map(({kind:c})=>({kind:c,query:a.queries[c]})).filter(c=>!!c.query);if(i.length!==1)return n.push(`${Dt(a.subject)} must declare exactly one sh:select, sh:ask, or sh:construct query.`),[];let s=i[0];return[{description:a.description??"",id:Dn(a.subject,s.kind,s.query),kind:s.kind,label:ne(o.quads,a.subject,{predicates:[...Ee,`${J}name`]})?.trim()||Dt(a.subject),order:a.order??Number.POSITIVE_INFINITY,query:s.query}]}).sort((a,i)=>a.order-i.order||a.label.localeCompare(i.label));return{diagnostics:n,queries:r}}function qn(o){return Re(o).queries}var An="http://www.w3.org/1999/02/22-rdf-syntax-ns#type",In="http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",Pn="http://www.w3.org/2000/01/rdf-schema#Class",$n="http://www.w3.org/2000/01/rdf-schema#subClassOf",Hn="http://www.w3.org/2000/01/rdf-schema#subPropertyOf",zn=new Set([Pn,"http://www.w3.org/2002/07/owl#Class","http://www.w3.org/2002/07/owl#DeprecatedClass"]),jn=new Set([In,"http://www.w3.org/2002/07/owl#ObjectProperty","http://www.w3.org/2002/07/owl#DatatypeProperty","http://www.w3.org/2002/07/owl#AnnotationProperty","http://www.w3.org/2002/07/owl#FunctionalProperty","http://www.w3.org/2002/07/owl#InverseFunctionalProperty","http://www.w3.org/2002/07/owl#TransitiveProperty","http://www.w3.org/2002/07/owl#SymmetricProperty","http://www.w3.org/2002/07/owl#AsymmetricProperty","http://www.w3.org/2002/07/owl#ReflexiveProperty","http://www.w3.org/2002/07/owl#IrreflexiveProperty","http://www.w3.org/2002/07/owl#DeprecatedProperty","http://www.w3.org/2002/07/owl#OntologyProperty"]);function Ye(o,e){o.some(t=>t.value===e.value)||o.push(e)}function Xe(o,e){o.includes(e)||o.push(e)}function Ne(o,e){o.includes(e)||o.push(e)}function Je(o){let e=new Map,t=i=>{let s=e.get(i.value);return s||(s={classParents:[],kinds:[],propertyParents:[],sources:[],term:i,types:[]},e.set(i.value,s)),s};for(let i of o.quads)if(i.subject.termType==="NamedNode"){if(i.predicate.value===An&&i.object.termType==="NamedNode"){let s=zn.has(i.object.value),c=jn.has(i.object.value);if(!s&&!c)continue;let l=t(i.subject);s&&Ne(l.kinds,"class"),c&&Ne(l.kinds,"property"),Ye(l.types,i.object),Xe(l.sources,i.source);continue}if(i.predicate.value===$n){let s=t(i.subject);Ne(s.kinds,"class"),i.object.termType==="NamedNode"&&Ye(s.classParents,i.object),Xe(s.sources,i.source);continue}if(i.predicate.value===Hn){let s=t(i.subject);Ne(s.kinds,"property"),i.object.termType==="NamedNode"&&Ye(s.propertyParents,i.object),Xe(s.sources,i.source)}}let n=Array.from(e.values()).map(i=>{let s=ne(o.quads,i.term);return{...i,...s?{label:s}:{}}}).sort((i,s)=>(i.label??i.term.value).localeCompare(s.label??s.term.value)),r=n.filter(i=>i.kinds.includes("class")),a=n.filter(i=>i.kinds.includes("property"));return{classes:r,count:n.length,definitions:n,properties:a}}var _n=String.raw`
  :host {
    --ink: oklch(27% 0.018 286);
    --muted: oklch(52% 0.018 286);
    --paper: oklch(98.4% 0.007 286);
    --layer: oklch(95.5% 0.012 286);
    --line: oklch(86% 0.018 286);
    --accent: oklch(55% 0.17 294);
    --accent-soft: oklch(93% 0.035 294);
    --warning: oklch(64% 0.15 67);
    color: var(--ink);
    font: 400 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
    position: fixed;
    z-index: 2147483000;
  }
  *, *::before, *::after { box-sizing: border-box; }
  [hidden] { display: none !important; }
  button { font: inherit; }
  .launcher {
    align-items: center;
    background: var(--ink);
    border: 1px solid color-mix(in oklch, var(--ink), var(--paper) 18%);
    border-radius: 999px;
    bottom: var(--ia2-rdf-launcher-bottom, 20px);
    box-shadow: 0 8px 28px oklch(20% 0.03 286 / 22%);
    color: var(--paper);
    cursor: grab;
    display: flex;
    gap: 9px;
    min-height: 44px;
    padding: 9px 13px 9px 11px;
    position: fixed;
    right: 20px;
    touch-action: none;
    transition: transform 180ms cubic-bezier(.22,1,.36,1), background 180ms ease;
    user-select: none;
  }
  .launcher:hover { background: color-mix(in oklch, var(--ink), var(--accent) 22%); transform: translateY(-2px); }
  .launcher.is-dragging { cursor: grabbing; transform: none; }
  .launcher[data-position^="left"] { left: 20px; right: auto; }
  .launcher:focus-visible, button:focus-visible, a:focus-visible { outline: 3px solid color-mix(in oklch, var(--accent), transparent 35%); outline-offset: 3px; }
  .mark { display: grid; height: 22px; place-items: center; width: 22px; }
  .mark svg { height: 100%; width: 100%; }
  .count { background: var(--accent); border-radius: 999px; color: var(--paper); font-size: 11px; font-variant-numeric: tabular-nums; font-weight: 700; min-width: 20px; padding: 1px 6px; text-align: center; }
  .panel {
    --ia2-window-floating-closed-transform: translateY(14px) scale(.985);
    --ia2-window-floating-left: 24px;
    --ia2-window-floating-open-transform: translateY(0) scale(1);
    --ia2-window-floating-top: 24px;
    --ia2-window-rule: var(--line);
    --ia2-window-transition-duration: 240ms;
    --ia2-window-width: min(760px, 72vw);
    background: var(--paper);
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
  }
  .panel:focus { outline: none; }
  .toolbar { align-items: center; border-bottom: 1px solid var(--line); display: flex; gap: 8px; min-width: 0; padding: 0 8px 0 12px; }
  .drag-grip { color: var(--muted); display: none; flex: 0 0 30px; height: 36px; place-items: center; touch-action: none; user-select: none; }
  .panel[data-position="floating"] .drag-grip { cursor: grab; display: grid; }
  .panel[data-position="floating"] .tabs { cursor: grab; }
  .panel[data-position="floating"].is-dragging .drag-grip, .panel[data-position="floating"].is-dragging .tabs { cursor: grabbing; }
  .drag-grip svg { fill: currentColor; height: 18px; opacity: .68; width: 10px; }
  .header-actions { align-items: center; display: flex; flex: 0 0 auto; gap: 4px; }
  .position-switch { align-items: center; background: transparent; border: 1px solid transparent; border-radius: 7px; display: inline-flex; flex: 0 0 auto; overflow: hidden; transition: background 140ms ease, border-color 140ms ease; width: auto; }
  .position-switch:hover, .position-switch:focus-within { background: var(--layer); border-color: var(--line); }
  .position-switch:focus-within { border-color: var(--accent); }
  .position-option { align-items: center; background: transparent; border: 0; border-right: 1px solid transparent; color: var(--muted); cursor: pointer; display: inline-flex; flex: 0 0 28px; height: 32px; justify-content: center; opacity: .26; padding: 0; pointer-events: none; transition: background 140ms ease, border-color 140ms ease, color 140ms ease, opacity 110ms ease; visibility: visible; width: 28px; }
  .position-switch:hover .position-option, .position-switch:focus-within .position-option { border-right-color: var(--line); opacity: 1; pointer-events: auto; }
  .position-option:last-child { border-right: 0; }
  .position-option:hover { background: var(--accent-soft); color: var(--accent); }
  .position-option[aria-checked="true"] { background: var(--accent); color: var(--paper); opacity: 1; pointer-events: auto; visibility: visible; }
  .position-option:focus-visible { outline: 2px solid var(--accent); outline-offset: -3px; position: relative; z-index: 1; }
  .position-icon { display: block; fill: none; height: 16px; stroke: currentColor; stroke-linejoin: round; stroke-width: 1.25; width: 20px; }
  .position-region { fill: currentColor; stroke: none; }
  .resize-handles { display: none; }
  .panel[data-position="floating"] .resize-handles { display: contents; }
  .resize-handle { position: absolute; touch-action: none; z-index: 12; }
  .resize-handle[data-resize="n"], .resize-handle[data-resize="s"] { cursor: ns-resize; height: 8px; left: 14px; right: 14px; }
  .resize-handle[data-resize="n"] { top: 0; }
  .resize-handle[data-resize="s"] { bottom: 0; }
  .resize-handle[data-resize="e"], .resize-handle[data-resize="w"] { bottom: 14px; cursor: ew-resize; top: 14px; width: 8px; }
  .resize-handle[data-resize="e"] { right: 0; }
  .resize-handle[data-resize="w"] { left: 0; }
  .resize-handle[data-resize="ne"], .resize-handle[data-resize="nw"], .resize-handle[data-resize="se"], .resize-handle[data-resize="sw"] { height: 18px; width: 18px; }
  .resize-handle[data-resize="ne"] { cursor: nesw-resize; right: 0; top: 0; }
  .resize-handle[data-resize="nw"] { cursor: nwse-resize; left: 0; top: 0; }
  .resize-handle[data-resize="se"] { bottom: 0; cursor: nwse-resize; right: 0; }
  .resize-handle[data-resize="sw"] { bottom: 0; cursor: nesw-resize; left: 0; }
  .resize-handle[data-resize="se"]::after { border-bottom: 2px solid color-mix(in oklch, var(--muted), transparent 24%); border-right: 2px solid color-mix(in oklch, var(--muted), transparent 24%); bottom: 4px; content: ""; height: 6px; position: absolute; right: 4px; width: 6px; }
  .icon-button { align-items: center; background: transparent; border: 0; border-radius: 7px; color: var(--muted); cursor: pointer; display: flex; height: 36px; justify-content: center; padding: 0; width: 36px; }
  .icon-button:hover { background: var(--layer); color: var(--ink); }
  .tabs { align-items: end; align-self: stretch; display: flex; flex: 1 1 auto; gap: 3px; min-width: 0; overflow: hidden; padding: 0; }
  .tab { align-items: center; background: transparent; border: 0; border-bottom: 2px solid transparent; color: var(--muted); cursor: pointer; display: inline-flex; flex: 0 0 auto; font-size: 13px; font-weight: 650; gap: 0; justify-content: center; margin-bottom: -1px; min-width: 0; padding: 12px 10px 10px; white-space: nowrap; }
  .tab:focus-visible { border-radius: 5px 5px 2px 2px; outline: 2px solid color-mix(in oklch, var(--accent), transparent 25%); outline-offset: -4px; }
  .tab[aria-selected="true"] { border-bottom-color: var(--accent); color: var(--ink); }
  .tab-icon { display: none; height: 18px; place-items: center; width: 18px; }
  .tab-icon svg { fill: none; height: 18px; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.45; width: 18px; }
  .tabs[data-compact="1"] .tab-count, .tabs[data-compact="2"] .tab-count { display: none; }
  .tabs[data-compact="2"] .tab-label { font-size: 0; }
  .tabs[data-compact="2"] .tab-label::after { content: attr(data-short); font-size: 13px; }
  .tabs[data-compact="3"] .tab { min-height: 42px; padding-inline: 9px; }
  .tabs[data-compact="3"] .tab-label, .tabs[data-compact="3"] .tab-count { display: none; }
  .tabs[data-compact="3"] .tab-icon { display: grid; }
  .viewport { min-height: 0; overflow: auto; overscroll-behavior: contain; padding: 18px 22px 28px; }
  .notice { background: var(--accent-soft); border: 1px solid color-mix(in oklch, var(--accent), var(--paper) 68%); border-radius: 8px; color: color-mix(in oklch, var(--ink), var(--accent) 25%); font-size: 12px; margin: 0 0 14px; padding: 9px 11px; }
  .sources-intro { color: var(--muted); font-size: 12px; margin: 0 0 16px; max-width: 66ch; }
  .source-list { border-bottom: 1px solid var(--line); list-style: none; margin: 0; padding: 0; }
  .source-item { border-top: 1px solid var(--line); }
  .source-option { align-items: start; cursor: pointer; display: grid; gap: 10px; grid-template-columns: auto minmax(0, 1fr) auto; padding: 14px 4px; }
  .source-option:hover { background: color-mix(in oklch, var(--accent-soft), transparent 42%); }
  .source-option input { accent-color: var(--accent); margin: 3px 0 0; }
  .source-copy { min-width: 0; }
  .source-title { display: block; font-size: 13px; font-weight: 700; line-height: 1.35; }
  .source-url { color: var(--muted); display: block; font: 11px/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; margin-top: 3px; overflow-wrap: anywhere; }
  .source-access { color: var(--muted); display: block; font-size: 10.5px; line-height: 1.35; margin-top: 5px; }
  .source-count { color: var(--muted); font-size: 11px; font-variant-numeric: tabular-nums; padding-top: 2px; white-space: nowrap; }
  .discovery-intro { color: var(--muted); font-size: 12px; margin: 0 0 16px; max-width: 66ch; }
  .discovery-list { list-style: none; margin: 0; padding: 0; }
  .discovery-item { border-bottom: 1px solid var(--line); display: grid; gap: 10px; grid-template-columns: minmax(0, 1fr) auto; padding: 15px 0; }
  .discovery-item:first-child { border-top: 1px solid var(--line); }
  .discovery-copy { min-width: 0; }
  .discovery-target { color: var(--accent); display: block; font: 650 12.5px/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow-wrap: anywhere; text-decoration-color: color-mix(in oklch, currentColor, transparent 55%); text-underline-offset: 3px; }
  .discovery-target:hover { text-decoration-color: currentColor; }
  .discovery-context { color: var(--muted); font: 11px/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; margin: 4px 0 0; overflow-wrap: anywhere; }
  .discovery-meta { align-items: center; display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
  .discovery-chip { background: var(--layer); border: 1px solid var(--line); border-radius: 999px; color: var(--muted); font-size: 10.5px; line-height: 1.2; max-width: 100%; overflow: hidden; padding: 4px 7px; text-overflow: ellipsis; white-space: nowrap; }
  .discovery-chip.role { background: var(--accent-soft); border-color: color-mix(in oklch, var(--accent), var(--paper) 72%); color: color-mix(in oklch, var(--accent), var(--ink) 20%); }
  .discovery-state { align-items: flex-end; display: flex; flex-direction: column; gap: 7px; justify-content: center; min-width: 112px; }
  .discovery-status { color: var(--muted); font-size: 10.5px; max-width: 24ch; text-align: right; }
  .discovery-status[data-state="loaded"] { color: oklch(45% 0.12 145); }
  .discovery-status[data-state="error"] { color: var(--warning); }
  .discovery-action { background: var(--accent); border: 1px solid var(--accent); border-radius: 7px; color: var(--paper); cursor: pointer; font-size: 12px; font-weight: 700; min-height: 34px; padding: 6px 11px; }
  .discovery-action:hover { background: color-mix(in oklch, var(--accent), var(--ink) 12%); }
  .discovery-action[data-state="loaded"], .discovery-action[data-state="loading"] { background: transparent; border-color: var(--line); color: var(--muted); }
  .discovery-action[data-state="loaded"]:hover, .discovery-action[data-state="loading"]:hover { background: var(--layer); color: var(--ink); }
  .ontology-intro { color: var(--muted); font-size: 12px; margin: 0 0 18px; max-width: 66ch; }
  .ontology-section + .ontology-section { margin-top: 26px; }
  .ontology-heading { align-items: baseline; border-bottom: 1px solid var(--line); display: flex; gap: 8px; margin: 0; padding: 0 2px 8px; }
  .ontology-heading h3 { font-size: 13px; margin: 0; }
  .ontology-count { color: var(--muted); font-size: 11px; font-variant-numeric: tabular-nums; }
  .ontology-tree, .ontology-children { list-style: none; margin: 0; padding: 0; }
  .ontology-tree { padding-top: 5px; }
  .ontology-children { border-left: 1px solid var(--line); margin-left: 13px; padding-left: 14px; }
  .ontology-node { min-width: 0; }
  .ontology-term-row { align-items: center; border-radius: 7px; display: grid; gap: 8px; grid-template-columns: minmax(0, 1fr) auto; min-width: 0; padding: 7px 5px 7px 7px; }
  .ontology-term-row:hover, .ontology-term-row:focus-within, .ontology-term-row.is-corresponding { background: color-mix(in oklch, var(--accent-soft), transparent 25%); }
  .ontology-term-copy { min-width: 0; }
  .ontology-term-copy code { display: block; font: 600 12px/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow-wrap: anywhere; }
  .ontology-label { color: var(--ink); font-size: 11.5px; line-height: 1.35; margin-top: 2px; }
  .ontology-meta { color: var(--muted); font-size: 10px; line-height: 1.35; margin-top: 2px; }
  .ontology-context .ontology-term-copy code, .ontology-context .ontology-label { color: var(--muted); font-weight: 500; }
  .ontology-actions { opacity: 0; pointer-events: none; }
  .ontology-term-row:hover .ontology-actions, .ontology-term-row:focus-within .ontology-actions { opacity: 1; pointer-events: auto; }
  .ontology-actions .locate-button { opacity: 1; }
  .shapes-browser { margin: 0 auto; max-width: 920px; }
  .shapes-intro { color: var(--muted); font-size: 12px; margin: 0 0 15px; max-width: 70ch; }
  .shapes-tools { align-items: center; background: color-mix(in oklch, var(--paper), transparent 4%); border-bottom: 1px solid var(--line); display: grid; gap: 10px; grid-template-columns: minmax(180px, 1fr) auto; margin: 0 0 18px; padding: 0 0 12px; position: sticky; top: -18px; z-index: 4; }
  .shapes-search {
    background: var(--layer);
    border: 1px solid var(--line);
    border-radius: 8px;
    color: var(--ink);
    font: inherit;
    height: 36px;
    min-width: 0;
    padding: 6px 10px;
    width: 100%;
  }
  .shapes-search:hover { border-color: color-mix(in oklch, var(--accent), var(--line) 55%); }
  .shapes-search:focus { border-color: var(--accent); outline: 3px solid color-mix(in oklch, var(--accent), transparent 78%); outline-offset: 1px; }
  .shapes-filter-count { color: var(--muted); font-size: 11px; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .shape-group + .shape-group { margin-top: 24px; }
  .shape-group-heading { align-items: baseline; border-bottom: 1px solid var(--line); display: flex; gap: 8px; margin: 0; padding: 0 2px 8px; }
  .shape-group-heading h3 { font-size: 13px; margin: 0; }
  .shape-group-count { color: var(--muted); font-size: 11px; font-variant-numeric: tabular-nums; }
  .shape-list { list-style: none; margin: 0; padding: 0; }
  .shape-row { border-bottom: 1px solid var(--line); }
  .shape-row summary { align-items: start; cursor: pointer; display: grid; gap: 6px 12px; grid-template-columns: minmax(0, 1fr) auto; list-style: none; padding: 12px 5px; }
  .shape-row summary::-webkit-details-marker { display: none; }
  .shape-row summary::after { color: var(--muted); content: "›"; font-size: 20px; line-height: 1; margin-top: 2px; transform: rotate(0); transition: transform 160ms cubic-bezier(.22,1,.36,1); }
  .shape-row[open] summary::after { transform: rotate(90deg); }
  .shape-row summary:hover, .shape-row summary:focus-visible { background: color-mix(in oklch, var(--accent-soft), transparent 34%); }
  .shape-row summary:focus-visible { border-radius: 7px; outline: 2px solid color-mix(in oklch, var(--accent), transparent 25%); outline-offset: -3px; }
  .shape-summary-copy { min-width: 0; }
  .shape-name { display: block; font-size: 13px; font-weight: 700; line-height: 1.35; }
  .shape-identifier { color: var(--muted); display: block; font: 10.5px/1.4 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; margin-top: 2px; overflow-wrap: anywhere; }
  .shape-summary-meta { align-items: center; display: flex; flex-wrap: wrap; gap: 5px; margin-top: 6px; }
  .shape-kind, .shape-stat { border: 1px solid var(--line); border-radius: 999px; color: var(--muted); font-size: 10px; line-height: 1.2; padding: 3px 6px; }
  .shape-kind { background: var(--accent-soft); border-color: color-mix(in oklch, var(--accent), var(--paper) 74%); color: color-mix(in oklch, var(--accent), var(--ink) 22%); }
  .shape-detail { background: color-mix(in oklch, var(--layer), transparent 48%); border-radius: 8px; margin: 0 4px 12px; padding: 14px 15px 16px; }
  .shape-description { color: var(--muted); font-size: 11.5px; margin: 0 0 13px; max-width: 70ch; }
  .shape-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 13px; }
  .shape-locate { align-items: center; background: transparent; border: 1px solid var(--line); border-radius: 7px; color: var(--ink); cursor: pointer; display: inline-flex; font-size: 11px; font-weight: 700; gap: 6px; min-height: 32px; padding: 5px 9px; }
  .shape-locate:hover { background: var(--paper); border-color: color-mix(in oklch, var(--accent), var(--line) 55%); color: var(--accent); }
  .shape-block + .shape-block { margin-top: 13px; }
  .shape-block h4 { color: var(--muted); font-size: 10px; letter-spacing: .045em; margin: 0 0 5px; text-transform: uppercase; }
  .shape-facts { margin: 0; }
  .shape-fact { border-top: 1px solid color-mix(in oklch, var(--line), transparent 22%); display: grid; gap: 8px; grid-template-columns: minmax(105px, .34fr) minmax(0, 1fr); padding: 7px 0; }
  .shape-fact:first-child { border-top: 0; }
  .shape-fact dt { color: var(--muted); font-size: 10.5px; margin: 0; }
  .shape-fact dd { margin: 0; min-width: 0; }
  .shape-value + .shape-value { margin-top: 5px; }
  .shape-value-label { display: block; font-size: 11.5px; font-weight: 650; line-height: 1.35; }
  .shape-value code { color: var(--muted); display: block; font: 10.5px/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow-wrap: anywhere; }
  .shape-value .term-link { color: var(--accent); }
  .shape-literal { font-size: 11.5px; line-height: 1.45; overflow-wrap: anywhere; }
  .shapes-empty { color: var(--muted); font-size: 12px; margin: 24px 0; text-align: center; }
  .sparql-workbench { display: grid; gap: 15px; margin: 0 auto; max-width: 920px; min-width: 0; }
  .sparql-intro { color: var(--muted); font-size: 12px; margin: 0; max-width: 72ch; }
  .sparql-catalog { display: grid; gap: 6px; min-width: 0; }
  .sparql-label { color: var(--ink); font-size: 12px; font-weight: 700; }
  .sparql-select, .sparql-editor-shell {
    background: var(--layer);
    border: 1px solid var(--line);
    border-radius: 8px;
    box-sizing: border-box;
    color: var(--ink);
    width: 100%;
  }
  .sparql-select { font: inherit; min-height: 38px; padding: 7px 10px; }
  .sparql-editor-shell {
    min-width: 0;
    overflow: hidden;
    position: relative;
  }
  .sparql-highlight, .sparql-editor {
    box-sizing: border-box;
    font: 12.5px/1.55 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    min-height: 230px;
    overflow-wrap: anywhere;
    padding: 13px 14px;
    tab-size: 2;
    white-space: pre-wrap;
    width: 100%;
  }
  .sparql-highlight {
    border: 0;
    inset: 0;
    margin: 0;
    overflow: hidden;
    pointer-events: none;
    position: absolute;
    z-index: 0;
  }
  .sparql-highlight code { font: inherit; }
  .sparql-highlight code::after { content: " "; }
  .sparql-editor {
    -webkit-text-fill-color: transparent;
    background: transparent;
    border: 0;
    caret-color: var(--ink);
    color: transparent;
    display: block;
    overflow-x: hidden;
    position: relative;
    resize: vertical;
    z-index: 1;
  }
  .sparql-editor::selection {
    background: color-mix(in oklch, var(--accent), transparent 72%);
  }
  .sparql-select:hover, .sparql-editor-shell:hover { border-color: color-mix(in oklch, var(--accent), var(--line) 55%); }
  .sparql-select:focus, .sparql-editor-shell:focus-within {
    border-color: var(--accent);
    outline: 3px solid color-mix(in oklch, var(--accent), transparent 78%);
    outline-offset: 1px;
  }
  .sparql-description { color: var(--muted); font-size: 11px; margin: 0; min-height: 1.5em; }
  .sparql-actions { align-items: center; display: flex; flex-wrap: wrap; gap: 9px; }
  .sparql-run, .sparql-reset {
    border: 1px solid var(--accent);
    border-radius: 7px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 700;
    min-height: 36px;
    padding: 7px 13px;
  }
  .sparql-run { background: var(--accent); color: var(--paper); }
  .sparql-run:hover { background: color-mix(in oklch, var(--accent), var(--ink) 12%); }
  .sparql-run:disabled { cursor: wait; opacity: .62; }
  .sparql-reset { background: transparent; border-color: var(--line); color: var(--muted); }
  .sparql-reset:hover { background: var(--layer); color: var(--ink); }
  .sparql-observe {
    align-items: center;
    color: var(--muted);
    display: inline-flex;
    font-size: 11px;
    gap: 6px;
    min-height: 36px;
  }
  .sparql-observe input { accent-color: var(--accent); height: 16px; margin: 0; width: 16px; }
  .sparql-safety { color: var(--muted); flex: 1 1 240px; font-size: 10.5px; margin: 0; text-align: right; }
  .sparql-output { border-top: 1px solid var(--line); min-height: 56px; padding-top: 14px; }
  .sparql-status { color: var(--muted); font-size: 12px; margin: 0; }
  .sparql-status[data-state="error"] {
    background: color-mix(in oklch, var(--warning), transparent 88%);
    border: 1px solid color-mix(in oklch, var(--warning), var(--line) 30%);
    border-radius: 8px;
    color: var(--ink);
    padding: 10px 11px;
  }
  .sparql-summary { color: var(--muted); font-size: 11px; margin: 0 0 8px; }
  .sparql-boolean { color: var(--accent); font: 750 28px/1.2 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; margin: 4px 0; }
  .sparql-table-wrap { border: 1px solid var(--line); border-radius: 8px; overflow: auto; }
  .sparql-table { border-collapse: collapse; font-size: 11.5px; min-width: 100%; text-align: left; }
  .sparql-table th { background: var(--layer); color: var(--muted); font-size: 10px; letter-spacing: .045em; padding: 8px 10px; position: sticky; text-transform: uppercase; top: 0; white-space: nowrap; }
  .sparql-table td { border-top: 1px solid var(--line); max-width: 480px; padding: 8px 10px; vertical-align: top; }
  .sparql-table code, .sparql-table a { color: var(--ink); font: 11.5px/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow-wrap: anywhere; }
  .sparql-table a { color: var(--accent); text-decoration-color: color-mix(in oklch, currentColor, transparent 60%); text-underline-offset: 2px; }
  .sparql-resource-term { display: block; min-width: 13ch; }
  .sparql-table .sparql-resource-label {
    color: var(--ink);
    font: 650 12px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
  }
  .sparql-table .sparql-resource-label:hover { color: var(--accent); }
  .sparql-literal-value { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; line-height: 1.5; }
  .sparql-literal-qualifier { color: var(--muted); display: inline-block; font-size: 10.5px; margin-left: 5px; }
  .sparql-unbound { color: var(--muted); }
  .sparql-pagination { align-items: center; display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
  .sparql-page-size-label { align-items: center; color: var(--muted); display: inline-flex; font-size: 11px; gap: 7px; }
  .sparql-page-size {
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: 7px;
    color: var(--ink);
    font: inherit;
    min-height: 32px;
    padding: 4px 25px 4px 8px;
  }
  .sparql-page-size:hover { border-color: color-mix(in oklch, var(--accent), var(--line) 55%); }
  .sparql-page-size:focus { border-color: var(--accent); outline: 3px solid color-mix(in oklch, var(--accent), transparent 78%); outline-offset: 1px; }
  .sparql-page-status { color: var(--muted); flex: 1 1 auto; font-size: 11px; font-variant-numeric: tabular-nums; margin: 0; min-width: max-content; text-align: right; }
  .sparql-page-button {
    background: transparent;
    border: 1px solid var(--line);
    border-radius: 7px;
    color: var(--ink);
    cursor: pointer;
    font-size: 11px;
    font-weight: 700;
    min-height: 32px;
    padding: 5px 10px;
  }
  .sparql-page-button:hover:not(:disabled) { background: var(--layer); border-color: color-mix(in oklch, var(--accent), var(--line) 55%); }
  .sparql-page-button:disabled { color: var(--muted); cursor: default; opacity: .52; }
  pre { background: var(--layer); border: 1px solid var(--line); border-radius: 10px; color: var(--ink); font: 12.5px/1.65 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; margin: 0; min-height: 100%; overflow: auto; padding: 16px 17px; tab-size: 2; white-space: pre; }
  .tok.iri, .tok.name { color: oklch(49% 0.17 290); }
  .tok.variable { color: oklch(45% 0.13 235); }
  .tok.iri { text-decoration-color: color-mix(in oklch, currentColor, transparent 55%); text-underline-offset: 3px; }
  .tok.string { color: oklch(45% 0.12 145); }
  .tok.key, .tok.keyword { color: oklch(50% 0.15 32); }
  .tok.blank, .tok.number { color: oklch(50% 0.13 235); }
  .tok.comment { color: var(--muted); font-style: italic; }
  .navigator-tools { background: var(--paper); border-bottom: 1px solid var(--line); margin: -18px -22px 4px; padding: 18px 22px 12px; position: sticky; top: -18px; z-index: 5; }
  .navigator-filter { align-items: start; display: grid; gap: 10px; grid-template-columns: minmax(0, 1fr) auto; margin: 0 0 12px; }
  .navigator-search-group { min-width: 0; position: relative; }
  .navigator-search { background: var(--layer); border: 1px solid var(--line); border-radius: 8px; color: var(--ink); font: inherit; height: 36px; min-width: 0; padding: 6px 10px; width: 100%; }
  .navigator-search::placeholder { color: var(--muted); }
  .navigator-search:hover { border-color: color-mix(in oklch, var(--accent), var(--line) 55%); }
  .navigator-search:focus { border-color: var(--accent); outline: 3px solid color-mix(in oklch, var(--accent), transparent 78%); outline-offset: 1px; }
  .typeahead { background: var(--paper); border: 1px solid var(--line); border-radius: 9px; box-shadow: 0 12px 36px oklch(20% 0.03 286 / 20%); left: 0; list-style: none; margin: 5px 0 0; max-height: min(320px, 42vh); overflow: auto; padding: 4px; position: absolute; right: 0; top: 36px; z-index: 9; }
  .typeahead-option { border-radius: 6px; cursor: pointer; display: grid; gap: 2px; min-width: 0; padding: 7px 8px; }
  .typeahead-option[aria-selected="true"] { background: var(--accent-soft); }
  .typeahead-option:hover { background: color-mix(in oklch, var(--accent-soft), var(--paper) 24%); }
  .typeahead-primary { align-items: baseline; display: flex; gap: 7px; min-width: 0; }
  .typeahead-term { color: var(--accent); flex: 0 1 auto; font: 600 11.5px/1.4 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .typeahead-label { color: var(--ink); flex: 1 1 auto; font-size: 12px; font-weight: 650; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .typeahead-meta { color: var(--muted); font-size: 10.5px; line-height: 1.35; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sync-control { align-items: center; display: inline-flex; gap: 6px; }
  .sync-label { color: var(--muted); font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
  .sync-switch { align-items: stretch; background: var(--layer); border: 1px solid var(--line); border-radius: 8px; display: inline-flex; height: 36px; overflow: hidden; }
  .sync-switch:focus-within { border-color: var(--accent); }
  .sync-option { align-items: center; background: transparent; border: 0; border-right: 1px solid var(--line); color: var(--muted); cursor: pointer; display: inline-flex; justify-content: center; padding: 0; width: 42px; }
  .sync-option:last-child { border-right: 0; }
  .sync-option:hover { background: var(--accent-soft); color: var(--accent); }
  .sync-option[aria-checked="true"] { background: var(--accent); color: var(--paper); }
  .sync-option:focus-visible { outline: 2px solid var(--accent); outline-offset: -3px; position: relative; z-index: 1; }
  .sync-icon { display: block; fill: none; height: 16px; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.5; width: 32px; }
  .filter-count { color: var(--muted); display: block; font-size: 10px; font-variant-numeric: tabular-nums; line-height: 15px; margin: 2px 2px 0; min-height: 15px; white-space: nowrap; }
  .filter-count:empty { visibility: hidden; }
  .navigator { list-style: none; margin: 0; padding: 0; }
  .vocabularies { margin: 0; padding: 0 2px; position: relative; }
  .vocabularies::before, .vocabularies::after { bottom: 7px; content: ""; opacity: 0; pointer-events: none; position: absolute; top: 23px; transition: opacity 140ms ease; width: 28px; z-index: 2; }
  .vocabularies::before { background: linear-gradient(90deg, var(--paper) 15%, transparent); left: 2px; }
  .vocabularies::after { background: linear-gradient(270deg, var(--paper) 15%, transparent); right: 2px; }
  .vocabularies:not(:hover):not(:focus-within)[data-overflow-left="true"]::before, .vocabularies:not(:hover):not(:focus-within)[data-overflow-right="true"]::after { opacity: 1; }
  .vocabularies-label { color: var(--muted); font-size: 11px; font-weight: 700; letter-spacing: .08em; margin: 0 0 8px; text-transform: uppercase; }
  .vocabulary-links { display: flex; gap: 6px; overflow-x: auto; overflow-y: hidden; overscroll-behavior-inline: contain; padding: 0 0 7px; scrollbar-color: transparent transparent; scrollbar-gutter: stable; scrollbar-width: thin; }
  .vocabulary-links::-webkit-scrollbar { height: 6px; }
  .vocabulary-links::-webkit-scrollbar-track { background: transparent; }
  .vocabulary-links::-webkit-scrollbar-thumb { background: transparent; border-radius: 999px; }
  .vocabularies:hover .vocabulary-links, .vocabularies:focus-within .vocabulary-links { scrollbar-color: color-mix(in oklch, var(--muted), transparent 42%) transparent; }
  .vocabularies:hover .vocabulary-links::-webkit-scrollbar-thumb, .vocabularies:focus-within .vocabulary-links::-webkit-scrollbar-thumb { background: color-mix(in oklch, var(--muted), transparent 42%); }
  .vocabulary-control { align-items: stretch; background: var(--paper); border: 1px solid var(--line); border-radius: 999px; display: inline-flex; flex: 0 0 auto; overflow: hidden; }
  .vocabulary-control:focus-within { border-color: var(--accent); }
  .vocabulary-toggle { align-items: center; background: transparent; border: 0; color: color-mix(in oklch, var(--muted), var(--paper) 20%); cursor: pointer; display: inline-flex; font-size: 12px; font-weight: 650; gap: 6px; opacity: .68; padding: 5px 7px 5px 9px; }
  .vocabulary-toggle[aria-pressed="true"] { background: color-mix(in oklch, var(--accent), var(--paper) 18%); color: var(--paper); opacity: 1; }
  .vocabulary-toggle:hover { background: var(--accent-soft); color: var(--accent); opacity: 1; }
  .vocabulary-toggle[aria-pressed="true"]:hover { background: color-mix(in oklch, var(--accent), var(--ink) 10%); color: var(--paper); }
  .vocabulary-name { max-width: min(300px, 55vw); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .vocabulary-count { align-items: center; background: color-mix(in oklch, currentColor, transparent 84%); border-radius: 999px; display: inline-flex; font-size: 10px; font-variant-numeric: tabular-nums; font-weight: 750; justify-content: center; min-width: 18px; padding: 1px 5px; }
  .vocabulary-link { align-items: center; border-left: 1px solid var(--line); color: var(--muted); display: inline-flex; padding: 5px 7px; text-decoration: none; }
  .vocabulary-link:hover { background: var(--accent-soft); color: var(--accent); }
  .external-mark { color: var(--muted); font-size: 10px; }
  .quad { border-bottom: 1px solid var(--line); contain-intrinsic-size: auto 88px; content-visibility: auto; display: grid; gap: 7px; grid-template-columns: minmax(0, 1fr) auto; padding-block: 13px; padding-inline: calc(2px + var(--rdf-indent, 0px)) 2px; position: relative; }
  .quad.is-corresponding { background: color-mix(in oklch, var(--accent-soft), transparent 30%); border-radius: 7px; }
  .quad:first-child { padding-top: 0; }
  .quad code { display: block; font: 12px/1.55 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow-wrap: anywhere; }
  .quad .graph code { display: inline; }
  .quad .predicate { color: var(--accent); }
  .term-link { color: inherit; text-decoration-color: color-mix(in oklch, currentColor, transparent 55%); text-underline-offset: 3px; }
  .term-link:hover { text-decoration-color: currentColor; }
  .term-link.local-term { text-decoration-style: dotted; }
  .resource-preview { background: var(--paper); border: 1px solid var(--line); border-radius: 10px; box-shadow: 0 18px 64px oklch(20% 0.03 286 / 28%); display: grid; grid-template-rows: 32px minmax(0, 1fr); overflow: hidden; position: fixed; z-index: 20; }
  .resource-preview-bar { align-items: center; background: var(--layer); border-bottom: 1px solid var(--line); cursor: grab; display: flex; gap: 4px; min-width: 0; padding: 0 5px 0 10px; user-select: none; }
  .resource-preview.is-dragging .resource-preview-bar { cursor: grabbing; }
  .resource-preview-url { color: var(--muted); flex: 1 1 auto; font: 11px/1.3 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .resource-preview-action { align-items: center; background: transparent; border: 0; border-radius: 5px; color: var(--muted); cursor: pointer; display: inline-flex; flex: 0 0 24px; font: inherit; font-size: 14px; height: 24px; justify-content: center; line-height: 1; padding: 0; position: relative; text-decoration: none; z-index: 13; }
  .resource-preview-action:hover { background: var(--accent-soft); color: var(--accent); }
  .resource-preview-frame { background: var(--paper); border: 0; display: block; height: 100%; width: 100%; }
  .resource-preview-resize-handles { display: contents; }
  .term-locate-button { margin-left: 6px; opacity: 0; vertical-align: -3px; }
  .quad:hover .term-locate-button, .quad:focus-within .term-locate-button { opacity: 1; }
  .structure-marker { color: color-mix(in oklch, var(--muted), transparent 22%); font: 600 11px/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; inset-inline-start: calc(4px + var(--rdf-indent) - 13px); position: absolute; top: 18px; }
  .quad-terms { min-width: 0; }
  .quad-actions { align-items: center; align-self: start; display: flex; flex-wrap: wrap; gap: 5px; justify-content: flex-end; max-width: 230px; min-height: 32px; }
  .preview-actions { align-items: center; display: flex; gap: 3px; opacity: 0; pointer-events: none; transition: opacity 140ms cubic-bezier(.22,1,.36,1); }
  .quad:hover .preview-actions, .quad:focus-within .preview-actions, .quad.source-open .preview-actions { opacity: 1; pointer-events: auto; }
  .row-action-button { align-items: center; background: color-mix(in oklch, var(--accent-soft), var(--paper) 35%); border: 1px solid color-mix(in oklch, var(--accent), var(--paper) 68%); border-radius: 5px; color: color-mix(in oklch, var(--accent), var(--ink) 18%); cursor: pointer; display: inline-flex; height: 22px; justify-content: center; min-width: 26px; padding: 0 5px; }
  .row-action-button:hover { background: var(--accent-soft); border-color: color-mix(in oklch, var(--accent), var(--paper) 38%); color: var(--accent); }
  .source-toggle[aria-expanded="true"] { background: var(--accent); border-color: var(--accent); color: var(--paper); }
  .source-glyph { font: 650 10px/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; letter-spacing: -.05em; }
  .locate-glyph { font-size: 14px; line-height: 1; }
  .source-code { grid-column: 1 / -1; min-width: 0; padding-top: 3px; }
  .source-code-label { color: var(--muted); font-size: 11px; font-weight: 700; letter-spacing: .04em; margin: 0 0 6px; text-transform: uppercase; }
  .source-code pre { max-height: 320px; min-height: 0; padding: 12px 14px; white-space: pre-wrap; }
  .tok.punctuation { color: var(--muted); }
  .graph { color: var(--muted); font-size: 11px; margin-top: 2px; }
  .empty { color: var(--muted); margin: 28px auto; max-width: 42ch; text-align: center; }
  .diagnostics { list-style: none; margin: 0; padding: 0; }
  .diagnostic { border-bottom: 1px solid var(--line); padding: 12px 0; }
  .diagnostic strong { color: var(--warning); display: block; font-size: 12px; margin-bottom: 3px; }
  .diagnostic p { margin: 0; }
  .footer { align-items: center; background: var(--layer); border-top: 1px solid var(--line); color: var(--muted); display: flex; font-size: 12px; justify-content: space-between; padding: 10px 18px; }
  .copy { background: transparent; border: 0; color: var(--accent); cursor: pointer; font-size: 12px; font-weight: 700; padding: 4px 5px; }
  .sr-only { height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px; clip: rect(0,0,0,0); }
  @media (max-width: 760px) {
    .launcher { bottom: var(--ia2-rdf-launcher-bottom, 14px); right: 14px; }
    .launcher[data-position^="left"] { left: 14px; right: auto; }
    .toolbar { flex-wrap: wrap; padding: 8px 10px 0; }
    .drag-grip { order: 1; }
    .header-actions { margin-left: auto; order: 2; }
    .tabs { flex-basis: 100%; order: 3; }
    .viewport { padding-inline: 16px; }
    .navigator-tools { margin-inline: -16px; padding-inline: 16px; }
    .navigator-search-group { grid-column: 1 / -1; }
    .sync-control { grid-column: 2; justify-self: end; }
    .quad { grid-template-columns: minmax(0, 1fr); }
    .quad-actions { justify-content: flex-start; max-width: none; }
    .shapes-tools { top: -18px; }
    .shape-fact { grid-template-columns: minmax(0, 1fr); gap: 2px; }
    .discovery-item { grid-template-columns: minmax(0, 1fr); }
    .discovery-state { align-items: flex-start; min-width: 0; }
    .discovery-status { text-align: left; }
    .sparql-safety { flex-basis: 100%; text-align: left; }
    .sparql-highlight, .sparql-editor { min-height: 190px; }
    .sparql-pagination { display: grid; grid-template-columns: minmax(0, 1fr) auto; }
    .sparql-page-status { grid-column: 2; grid-row: 1; }
    .sparql-page-button { min-width: 76px; }
    .sparql-page-previous { grid-column: 1; grid-row: 2; justify-self: end; }
    .sparql-page-next { grid-column: 2; grid-row: 2; }
  }
  @media (hover: none) {
    .preview-actions { opacity: 1; pointer-events: auto; }
    .term-locate-button { opacity: 1; }
    .ontology-actions { opacity: 1; pointer-events: auto; }
    .position-switch { background: var(--layer); border-color: var(--line); }
    .position-option { border-right-color: var(--line); opacity: 1; pointer-events: auto; visibility: visible; }
  }
  @media (prefers-color-scheme: dark) {
    :host { --ink: oklch(92% 0.012 286); --muted: oklch(70% 0.018 286); --paper: oklch(20% 0.016 286); --layer: oklch(24% 0.019 286); --line: oklch(34% 0.022 286); --accent: oklch(73% 0.15 294); --accent-soft: oklch(29% 0.05 294); }
    .launcher { background: var(--accent); color: oklch(18% 0.02 286); }
    .tok.iri, .tok.name { color: oklch(77% 0.13 290); }
    .tok.variable { color: oklch(77% 0.1 235); }
    .tok.string { color: oklch(75% 0.11 145); }
    .tok.key, .tok.keyword { color: oklch(75% 0.12 42); }
    .tok.blank, .tok.number { color: oklch(77% 0.1 235); }
  }
  @media (forced-colors: active) {
    .sparql-highlight { display: none; }
    .sparql-editor {
      -webkit-text-fill-color: CanvasText;
      color: CanvasText;
    }
  }
  @media (prefers-reduced-motion: reduce) { .launcher { transition: none; } }
  ${ft}
`,On={navigator:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><circle cx="3" cy="5" r=".8" fill="currentColor" stroke="none"/><circle cx="3" cy="9" r=".8" fill="currentColor" stroke="none"/><circle cx="3" cy="13" r=".8" fill="currentColor" stroke="none"/><path d="M6 5h9M6 9h9M6 13h9"/></svg>',sources:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><rect x="2.5" y="3" width="13" height="9" rx="1.5"/><path d="M6 15h6M9 12v3"/></svg>',vocabulary:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><circle cx="9" cy="3.5" r="2"/><circle cx="4" cy="14" r="2"/><circle cx="14" cy="14" r="2"/><path d="M9 5.5v3M4 12V9h10v3"/></svg>',shapes:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M3 3.5h5v5H3zM10 9.5h5v5h-5zM8 6h3v3.5"/><path d="m4.3 11.8 1.3 1.3 2.6-3"/></svg>',discovery:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><circle cx="9" cy="9" r="6.5"/><path d="m11.7 6.3-1.5 3.9-3.9 1.5 1.5-3.9z"/></svg>',sparql:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M3 4.5h8M3 9h6M3 13.5h5"/><circle cx="13" cy="12" r="3"/><path d="m15.2 14.2 1.5 1.5"/></svg>',turtle:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="m6.5 4.5-4 4.5 4 4.5M11.5 4.5l4 4.5-4 4.5"/></svg>',json:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M7 3.5H5.5c-1 0-1.5.5-1.5 1.5v2c0 1-.5 1.5-1.5 2 1 .5 1.5 1 1.5 2v2c0 1 .5 1.5 1.5 1.5H7M11 3.5h1.5c1 0 1.5.5 1.5 1.5v2c0 1 .5 1.5 1.5 2-1 .5-1.5 1-1.5 2v2c0 1-.5 1.5-1.5 1.5H11"/></svg>',diagnostics:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M8 3.2 2.3 13a1.2 1.2 0 0 0 1 1.8h11.4a1.2 1.2 0 0 0 1-1.8L10 3.2a1.15 1.15 0 0 0-2 0Z"/><path d="M9 6.8v3.4M9 13h.01"/></svg>'};function ae(o,e,t,n,r,a){let i=r===void 0?t:`${t} (${r})`,s=r===void 0||!a?t:`${t}, ${r} ${a}${r===1?"":"s"}`;return`<button class="tab" role="tab" data-view="${o}" aria-selected="${e}" aria-label="${i}" title="${s}"><span class="tab-icon" aria-hidden="true">${On[o]}</span><span class="tab-label" data-short="${n}">${t}</span>${r===void 0?"":`<span class="tab-count"> (${r})</span>`}</button>`}var At="ia2:rdf-navigator:state:v1",Ze=`SELECT ?subject ?predicate ?object ?graph
WHERE {
  {
    ?subject ?predicate ?object
    BIND("default graph" AS ?graph)
  }
  UNION
  {
    GRAPH ?graph {
      ?subject ?predicate ?object
    }
  }
}
LIMIT 100`,It=25,Pt=[10,25,50,100],$t=[...Ee,"http://www.w3.org/ns/shacl#name"],Fn=4,Me=28,Ht=2e6,Un=1e4,Vn="text/html, application/xhtml+xml;q=0.95",Bn=2e6,Wn=4,Kn=2,Qn=3e3,Ce="allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts",zt=`${Ce} allow-same-origin`,me=new Map,Gn=new Set(["ontology.inferal.com","purl.archive.org","purl.org","schema.org","www.schema.org","www.w3.org"]),Yn={Alt:"ch_alt",Bag:"ch_bag",first:"ch_first",HTML:"ch_html",JSON:"ch_json",langString:"ch_langstring",List:"ch_list",nil:"ch_nil",object:"ch_object",predicate:"ch_predicate",Property:"ch_property",reifies:"ch_reifies",rest:"ch_rest",Seq:"ch_seq",Statement:"ch_statement",subject:"ch_subject",type:"ch_type",value:"ch_value",XMLLiteral:"ch_xmlliteral"},Xn={Class:"ch_class",comment:"ch_comment",Container:"ch_container",ContainerMembershipProperty:"ch_containermembershipproperty",Datatype:"ch_datatype",domain:"ch_domain",isDefinedBy:"ch_isdefinedby",label:"ch_label",Literal:"ch_literal",member:"ch_member",Proposition:"ch_proposition",range:"ch_range",Resource:"ch_resource",seeAlso:"ch_seealso",subClassOf:"ch_subclassof",subPropertyOf:"ch_subpropertyof"};function Jn(o){if(!o||typeof o!="object")return!1;let e=o;return typeof e.height=="number"&&Number.isFinite(e.height)&&e.height>0&&typeof e.width=="number"&&Number.isFinite(e.width)&&e.width>0&&typeof e.x=="number"&&Number.isFinite(e.x)&&typeof e.y=="number"&&Number.isFinite(e.y)}function Zn(o){if(!o||typeof o!="object")return!1;let e=o;return typeof e.x=="number"&&Number.isFinite(e.x)&&typeof e.y=="number"&&Number.isFinite(e.y)}var eo="http://www.w3.org/1999/02/22-rdf-syntax-ns#type",to="http://www.w3.org/2000/01/rdf-schema#domain",no="http://www.w3.org/2000/01/rdf-schema#range",oo=8,ro={"http://www.w3.org/1999/02/22-rdf-syntax-ns#Property":"RDF property","http://www.w3.org/2000/01/rdf-schema#Class":"RDFS class","http://www.w3.org/2002/07/owl#AnnotationProperty":"Annotation property","http://www.w3.org/2002/07/owl#Class":"OWL class","http://www.w3.org/2002/07/owl#DatatypeProperty":"Datatype property","http://www.w3.org/2002/07/owl#ObjectProperty":"Object property","http://www.w3.org/2002/07/owl#Ontology":"OWL ontology"},ao=new Set(["area","base","head","link","meta","noscript","script","source","style","template","title","track"]);function Q(o){let e=o.id?`#${o.id}`:"";return`<${o.localName}${e}>`}function et(o){return o.termType==="NamedNode"||o.termType==="BlankNode"?`${o.termType}:${o.value}`:null}function jt(o){if(o.termType==="BlankNode")return`Blank node ${o.value}`;try{let e=new URL(o.value),t=decodeURIComponent(e.hash.slice(1));if(t)return t.replaceAll(/[-_]+/g," ");let n=e.pathname.split("/").filter(Boolean).at(-1);return decodeURIComponent(n??o.value).replaceAll(/[-_]+/g," ")}catch{return o.value}}function io(o){return(o.startsWith("http://www.w3.org/ns/shacl#")?o.slice(27):O({termType:"NamedNode",value:o})).replaceAll(/([a-z0-9])([A-Z])/g,"$1 $2").replaceAll(/[-_]+/g," ").replace(/^./,t=>t.toUpperCase())}function so(o){return o.kinds.length>1?"Node + property shape":o.kinds[0]==="property"?"Property shape":"Node shape"}function Ae(o){return/^https?:\/\//i.test(o)}function _t(o){let e=new URL(o),t=e.hostname==="www.w3.org"&&e.pathname==="/1999/02/22-rdf-syntax-ns"?decodeURIComponent(e.hash.slice(1)):"";if(t)return new URL(`https://www.w3.org/TR/rdf12-schema/#${Yn[t]??"rdf-namespace"}`);let n=e.hostname==="www.w3.org"&&e.pathname==="/2000/01/rdf-schema"?decodeURIComponent(e.hash.slice(1)):"";if(n)return new URL(`https://www.w3.org/TR/rdf12-schema/#${Xn[n]??"rdfs-namespace"}`);let r=e.hostname==="purl.org"?e.pathname.match(/^\/dc\/terms\/([^/]+)$/):null;return r?new URL(`https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#${encodeURIComponent(r[1])}`):e.hostname==="purl.org"&&e.pathname==="/dc/terms/"?new URL("https://www.dublincore.org/specifications/dublin-core/dcmi-terms/"):(e.protocol==="http:"&&Gn.has(e.hostname)&&(e.protocol="https:"),e)}function Ot(o){return o.hostname==="www.dublincore.org"&&o.pathname==="/specifications/dublin-core/dcmi-terms/"||o.hostname==="www.w3.org"&&o.pathname.startsWith("/TR/")}function co(o){let e=new URL(o.href);return e.hash="",e.href}function lo(o,e){for(me.delete(o),me.set(o,e);me.size>Wn;){let t=me.keys().next().value;if(!t)break;me.delete(t)}}function ue(o){return`<!doctype html><meta charset="utf-8"><meta name="color-scheme" content="light dark"><style>
    :root { color: oklch(34% 0.015 286); font: 13px/1.45 ui-sans-serif, system-ui, sans-serif; }
    body { align-items: center; display: flex; justify-content: center; margin: 0; min-height: 100vh; }
    p { color: oklch(54% 0.018 286); margin: 24px; text-align: center; }
  </style><p role="status">${o}</p>`}function po(o,e,t){return new Promise((n,r)=>{let a=new o.AbortController,i=!1,s=0,c=d=>{i||(i=!0,o.clearTimeout(s),t.signal.removeEventListener("abort",l),d())},l=()=>{a.abort(),c(()=>r(new Error("Resource preview request was cancelled.")))};t.signal.addEventListener("abort",l,{once:!0}),s=o.setTimeout(()=>{a.abort(),c(()=>r(new Error("Resource preview request timed out.")))},Qn),o.fetch(e,{credentials:"omit",redirect:"follow",referrerPolicy:"no-referrer",signal:a.signal}).then(async d=>{let p=await d.text();c(()=>n({html:p,response:d}))}).catch(d=>c(()=>r(d)))})}function Ft(o,e,t=""){let r=`<base href="${e.replaceAll("&","&amp;").replaceAll('"',"&quot;")}">`,a=JSON.stringify(e).replaceAll("<","\\u003c"),i=JSON.stringify(t).replaceAll("<","\\u003c"),s=`<script data-ia2-preview-bridge>(() => {
    const baseUrl = new URL(${a});
    const fragment = ${i};
    const revealFragment = () => fragment && document.getElementById(fragment)?.scrollIntoView({ block: "start" });
    if (document.readyState === "loading") addEventListener("DOMContentLoaded", revealFragment, { once: true });
    else revealFragment();
    document.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!target || (target.target && target.target.toLowerCase() !== "_self")) return;
      const next = new URL(target.href, document.baseURI);
      if (!/^https?:$/.test(next.protocol)) return;
      const sameDocumentFragment = next.origin === baseUrl.origin && next.pathname === baseUrl.pathname && next.search === baseUrl.search && next.hash;
      if (sameDocumentFragment) return;
      event.preventDefault();
      parent.postMessage({ type: "ia2-rdf-preview-navigate", href: next.href }, "*");
    }, true);
  })();<\/script>`,c=`${r}${s}`,l=/<head(?:\s[^>]*)?>/i.exec(o);if(!l)return`${c}${o}`;let d=l.index+l[0].length;return`${o.slice(0,d)}${c}${o.slice(d)}`}function le(o){let e=o.ownerDocument.defaultView;if(!e||!(o instanceof e.HTMLElement)||!o.isConnected||ao.has(o.localName)||o.closest("head, template, [hidden]")||o.localName==="input"&&o.getAttribute("type")?.toLowerCase()==="hidden")return!1;let t=e.getComputedStyle(o);return t.display!=="none"&&t.visibility!=="hidden"&&t.visibility!=="collapse"}function uo(o){return o.localName==="template"&&"content"in o?o.content.childNodes.length>0:o.childNodes.length>0}function ho(o,e){let t=0,n=o.parentElement;for(;n;)e.has(n)&&(t+=1),n=n.parentElement;return t}function mo(o){let e=o.ownerDocument.defaultView;if(!e||!le(o))return!1;let t=o.getBoundingClientRect();return t.width>0&&t.height>0&&t.bottom>0&&t.right>0&&t.top<e.innerHeight&&t.left<e.innerWidth}function se(o){if(o.termType==="Triple")return[O(o),se(o.subject),se(o.predicate),se(o.object)].join(" ");let e=o.termType==="Literal"?`${o.datatype.value} ${o.language} ${o.direction??""}`:"";return`${O(o)} ${o.value} ${e}`}function fo(o){return[se(o.subject),se(o.predicate),se(o.object),o.graph?se(o.graph):"",Q(o.source)].join(" ").toLocaleLowerCase()}function we(o,e,t=o.URL,n){if(n?.has(e))return n.get(e)??null;let r=null;try{let a=new URL(e),i=new URL(t),s=new URL(a),c=new URL(i);s.hash="",c.hash="",r=s.href===c.href?a:null}catch{r=null}return n?.set(e,r),r}function go(o,e){try{let t=new URL(o),n=new URL(e.sourceDocumentIri),r=new URL(t);if(r.hash="",n.hash="",r.href!==n.href)return t.href;let a=new URL(e.retrievalDocumentIri);return a.hash=t.hash,a.href}catch{return o}}function Bt(o,e,t){if(t.metaKey||t.ctrlKey||t.shiftKey||t.altKey)return;t.preventDefault();let n=o.defaultView;if(!n)return;let r=new URL(o.URL);r.hash=e.hash,n.history.pushState(null,"",r.href),(e.hash?nt(o,e):o.documentElement)?.scrollIntoView({behavior:n.matchMedia?.("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"})}function nt(o,e){let t=o.documentElement;if(e.hash){let n=e.hash.slice(1);try{t=o.getElementById(decodeURIComponent(n))}catch{t=o.getElementById(n)}}return t&&le(t)?t:null}function De(o,e,t=o.URL,n,r){if(e.termType!=="NamedNode"||!Ae(e.value))return null;if(r?.has(e.value))return r.get(e.value)??null;let a=we(o,e.value,t,n),i=a?nt(o,a):null;return r?.set(e.value,i),i}function bo(o,e,t){let n=De(o,e.term,t);if(n)return n;for(let r of e.sources){let a=r.closest("[id]");if(a&&le(a))return a;if(le(r))return r}return null}function tt(o,e,t,n,r){let a=o.createElement("button");a.className=`row-action-button locate-button ${t}`,a.type="button",a.setAttribute("aria-label",`Locate ${Q(e)}`),a.title=a.getAttribute("aria-label");let i=o.createElement("span");return i.className="locate-glyph",i.setAttribute("aria-hidden","true"),i.textContent="\u2316",a.append(i),r?r.set(a,e):a.addEventListener("click",()=>n(e)),a}function he(o,e,t="",n="",r,a=o.URL,i,s,c,l){let d=o.createElement("code");n&&(d.className=n),t&&d.append(o.createTextNode(t));let p=O(e);if(e.termType!=="NamedNode"||!Ae(e.value))return d.append(o.createTextNode(p)),d;let g=o.createElement("a");g.className="term-link",g.href=e.value;let m=we(o,e.value,a,i);m?(g.classList.add("local-term"),g.title=m.hash?`Scroll to ${m.hash} in this document`:"Scroll to the start of this document",c?c.set(g,m):g.addEventListener("click",w=>Bt(o,m,w))):(g.target="_blank",g.rel="noopener noreferrer",g.title=`Open ${e.value} in a new tab`),g.textContent=p,d.append(g);let h=De(o,e,a,i,s);return h&&r&&d.append(tt(o,h,"term-locate-button",r,l)),d}function vo(o){for(let[a,i]of Object.entries(He))if(o.startsWith(i))return{label:a,namespace:i};if(!Ae(o))return null;let e=o.lastIndexOf("#"),t=o.lastIndexOf("/"),n=Math.max(e,t);if(n<8)return null;let r=o.slice(0,n+1);try{let a=new URL(r),i=a.pathname.replace(/\/$/,""),s=r.endsWith("#")?"#":"";return{label:`${a.host}${i}${s}`,namespace:r}}catch{return null}}function G(o){return o.termType==="NamedNode"?[o.value]:o.termType==="BlankNode"?[]:o.termType==="Literal"?O(o).includes("^^")?[o.datatype.value]:[]:[...G(o.subject),...G(o.predicate),...G(o.object)]}function qe(o){return O({termType:"NamedNode",value:o})}function Wt(o){let e=o.replace(/[\/#]+$/,""),t=Math.max(e.lastIndexOf("#"),e.lastIndexOf("/")),n=t>=0?e.slice(t+1):e;try{return decodeURIComponent(n)}catch{return n}}function wo(o){let t=Wt(o).replace(/\.[A-Za-z0-9]+$/u,"").replace(/([\p{Ll}\d])(\p{Lu})/gu,"$1 $2").replace(/[_-]+/gu," ").replace(/\s+/gu," ").trim();return t?`${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}`:qe(o)}function ve(o,e){if(!o)return"unbound";let t=o.termType==="NamedNode"||o.termType==="BlankNode"?e.get(`${o.termType}:${o.value}`)??"":"";return JSON.stringify([o.termType,o.value,o.datatype??"",o.language??"",o.direction??"",t])}function Ut(o,e){if(o.kind==="ask")return`ask:${String(o.value)}`;if(o.kind==="quads"){let n=o.quads.map(r=>JSON.stringify([ve(r.subject,e),ve(r.predicate,e),ve(r.object,e),ve(r.graph,e)])).sort();return JSON.stringify(["quads",n])}let t=o.rows.map(n=>JSON.stringify(o.variables.map(r=>ve(n[r],e)))).sort();return JSON.stringify(["bindings",o.variables,t])}function xo(o){let e=new Map,t=n=>{let r=e.get(n);if(r)return r;let a={domains:new Set,iri:n,ranges:new Set,statementCount:0,types:new Set};return e.set(n,a),a};for(let n of o.quads){let r=new Set([...G(n.subject),...G(n.predicate),...G(n.object),...n.graph?G(n.graph):[]]);for(let i of r)t(i).statementCount+=1;if(n.subject.termType!=="NamedNode")continue;let a=t(n.subject.value);n.predicate.value===eo&&n.object.termType==="NamedNode"&&a.types.add(n.object.value),n.predicate.value===to&&a.domains.add(O(n.object)),n.predicate.value===no&&a.ranges.add(O(n.object))}return Array.from(e.values()).map(n=>{let r=qe(n.iri),a=Wt(n.iri),i=ne(o.quads,n.iri)??"",s=Array.from(n.types,p=>ro[p]??`type ${qe(p)}`).sort(),c=Array.from(n.domains).sort(),l=Array.from(n.ranges).sort(),d=[r,n.iri,a,i,...s,...c.flatMap(p=>["domain",p,`domain ${p}`]),...l.flatMap(p=>["range",p,`range ${p}`])].join(" ").toLocaleLowerCase();return{display:r,domains:c,iri:n.iri,kinds:s,label:i,localName:a,ranges:l,searchText:d,statementCount:n.statementCount}})}function yo(o,e,t=oo){let n=e.trim().toLocaleLowerCase();if(!n)return[];let r=n.split(/\s+/).filter(Boolean);return o.map(a=>{if(!r.every(c=>a.searchText.includes(c)))return null;let i=[a.display,a.localName,a.label].join(" ").toLocaleLowerCase(),s=60;return[a.display,a.localName,a.label].some(c=>c.toLocaleLowerCase()===n)?s=0:[a.display,a.localName,a.label].some(c=>c.toLocaleLowerCase().startsWith(n))?s=10:i.includes(n)?s=20:r.every(c=>i.includes(c))&&(s=35),{score:s-Math.min(a.statementCount,20)/100,suggestion:a}}).filter(a=>a!==null).sort((a,i)=>a.score-i.score||a.suggestion.display.localeCompare(i.suggestion.display)).slice(0,t).map(({suggestion:a})=>a)}function Eo(o){let e=[...o.kinds,...o.domains.map(n=>`domain ${n}`),...o.ranges.map(n=>`range ${n}`)],t=`${o.statementCount} statement${o.statementCount===1?"":"s"}`;return[...e,t]}function Kt(o){let e=[...G(o.subject),...G(o.predicate),...G(o.object),...o.graph?G(o.graph):[]],t=new Map;for(let n of e){let r=vo(n);r&&t.set(r.namespace,r)}return Array.from(t.values())}function So(o){let e=new Map;for(let t of o.quads)for(let n of Kt(t)){let r=e.get(n.namespace);r?r.count+=1:e.set(n.namespace,{...n,count:1})}return Array.from(e.values()).sort((t,n)=>t.label.localeCompare(n.label))}var ko=new Set(["content","datetime","dir","href","lang","src","value"]),Vt="[rdf-predicate], [rdf-graph], [rdf-graph-key], base[href], link[rel]";function Lo(o){if(o.type==="characterData")return o.target.parentElement?.closest("[rdf-predicate]")!==null;if(o.type==="attributes"){let t=o.target instanceof Element?o.target:null,n=o.attributeName??"";return t?n.startsWith("rdf-")||t.localName==="base"&&n==="href"||t.localName==="link"&&(n==="href"||n==="rel")?!0:t.hasAttribute("rdf-predicate")?n==="id"||ko.has(n):!1:!1}return(o.target instanceof Element?o.target:null)?.closest("[rdf-predicate]")?!0:[...o.addedNodes,...o.removedNodes].some(t=>t instanceof Element?t.matches(Vt)||t.querySelector(Vt)!==null:!1)}function To(o,e){let t=new URL(o),n=new URL(e.sourceDocumentIri),r=new URL(e.retrievalDocumentIri);return t.origin!==n.origin||n.origin===r.origin?t.href:new URL(`${t.pathname}${t.search}${t.hash}`,r.origin).href}function Ro(o,e){try{Object.defineProperty(o,"URL",{configurable:!0,value:e})}catch{}let t=o.head?.querySelector("base[href]");t&&(t.href=new URL(t.getAttribute("href")??"",e).href),o.head?.querySelectorAll('link[rel~="canonical"][href]').forEach(n=>{n.href=new URL(n.getAttribute("href")??"",e).href})}function No(o){return o instanceof DOMException&&o.name==="AbortError"?"Retrieval timed out.":o instanceof TypeError?"Retrieval was blocked by CORS or network policy.":o instanceof Error?o.message:"The contribution could not be loaded."}var xe=class extends HTMLElement{#n=null;#m=null;#U=null;#me=[];#fe=[];#r=[];#i="top-document";#ge=new WeakMap;#He=1;#k=[];#a=new Map;#L={classes:[],count:0,definitions:[],properties:[]};#v={count:0,groups:[],shapes:[]};#e="navigator";#o=!1;#T="";#q="";#J="";#f=[];#Z=[];#w="";#x=Ze;#t={status:"idle"};#V=!0;#g="";#A=new Map;#s=0;#S=It;#b=0;#y=new Set;#p="off";#c="right";#u=null;#I=null;#l=null;#P=null;#B=!1;#d=new Map;#R=null;#W=null;#be=20;#ee=null;#te=null;#K=null;#ne=null;#N=null;#E=null;#M=null;#C=null;#Q=[];#oe=!1;constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.#Ve(),this.refresh(),this.addEventListener("keydown",this.#Ae),this.addEventListener("keyup",this.#Ie),this.ownerDocument.defaultView?.addEventListener("resize",this.#qe,{passive:!0}),this.#We()}disconnectedCallback(){this.removeEventListener("keydown",this.#Ae),this.removeEventListener("keyup",this.#Ie),this.ownerDocument.defaultView?.removeEventListener("resize",this.#qe),this.#M?.disconnect(),this.#M=null;for(let e of this.#a.values())e.controller?.abort();this.#a.clear(),this.#N?.disconnect(),this.#N=null,this.#E?.disconnect(),this.#E=null,this.#C!==null&&window.clearTimeout(this.#C),this.#Y(),this.#ue(),this.#ie(),this.#F(),this.#G(),this.#re()}#G(){this.#te?.(),this.#te=null}#ze(){if(this.#K){this.#K();return}this.#p="off",this.#G()}#re(){this.#ne?.(),this.#ne=null}#je(e){if(this.#E?.disconnect(),this.#E=null,!e)return;let t=()=>{if(e.dataset.compact="0",!(e.clientWidth<=0)){for(let r=0;r<=3;r+=1)if(e.dataset.compact=String(r),e.scrollWidth<=e.clientWidth+1)return}};t();let n=this.ownerDocument.defaultView?.ResizeObserver;n&&(this.#E=new n(t),this.#E.observe(e))}#$(e){this.#d.has(e)&&(this.#R=e,e.style.zIndex=String(++this.#be))}#ae(e){let t=this.#d.get(e);if(!t||(t.abortController?.abort(),t.interactionCleanup?.(),t.navigationCleanup?.(),e.remove(),this.#d.delete(e),this.#W===e&&(this.#W=null),this.#R!==e))return;let n=Array.from(this.#d.keys()).at(-1)??null;this.#R=null,n&&this.#$(n)}#ie(){for(let e of Array.from(this.#d.keys()))this.#ae(e);this.#R=null,this.#be=20}#ve(e){let t=e.getBoundingClientRect();return{height:Number.parseFloat(e.style.height)||t.height,width:Number.parseFloat(e.style.width)||t.width,x:Number.parseFloat(e.style.left)||t.left,y:Number.parseFloat(e.style.top)||t.top}}#se(e,t){let n=this.#z(t);e.style.height=`${n.height}px`,e.style.left=`${n.x}px`,e.style.top=`${n.y}px`,e.style.width=`${n.width}px`}#we(e){this.#se(e,this.#ve(e))}#xe(e,t,n){if(e.button!==0)return;let r=this.ownerDocument.defaultView,a=this.#d.get(t);if(!r||!a)return;e.preventDefault(),this.#$(t),a.interactionCleanup?.(),a.interactionCleanup=null,this.#we(t);let i=this.#ve(t),s=e.clientX,c=e.clientY;t.classList.add(n?"is-resizing":"is-dragging");let l=p=>{let g=p.clientX-s,m=p.clientY-c,h=this.#H(),w={...i};n?(n.includes("e")&&(w.width=Math.min(Math.max(i.width+g,h.minWidth),h.width-h.margin-i.x)),n.includes("s")&&(w.height=Math.min(Math.max(i.height+m,h.minHeight),h.height-h.margin-i.y)),n.includes("w")&&(w.x=Math.min(Math.max(i.x+g,h.margin),i.x+i.width-h.minWidth),w.width=i.x+i.width-w.x),n.includes("n")&&(w.y=Math.min(Math.max(i.y+m,h.margin),i.y+i.height-h.minHeight),w.height=i.y+i.height-w.y)):(w.x=i.x+g,w.y=i.y+m),this.#se(t,w)},d=()=>{r.removeEventListener("pointermove",l),r.removeEventListener("pointerup",d),r.removeEventListener("pointercancel",d),t.classList.remove("is-dragging","is-resizing"),a.interactionCleanup===d&&(a.interactionCleanup=null)};r.addEventListener("pointermove",l),r.addEventListener("pointerup",d),r.addEventListener("pointercancel",d),a.interactionCleanup=d}#ye(e,t,n){let r=this.ownerDocument.defaultView,a=this.#d.get(e);if(!r||!a)return;a.abortController?.abort(),a.abortController=null;let i=_t(n),s=Ot(i),c=co(i),l=i.hash?decodeURIComponent(i.hash.slice(1)):"";if(t.removeAttribute("srcdoc"),s){t.removeAttribute("src"),t.setAttribute("sandbox",Ce);let m=me.get(c);if(m){t.srcdoc=Ft(m.html,m.baseUrl,l);return}t.srcdoc=ue("Loading definition\u2026")}else t.setAttribute("sandbox",zt),t.src=i.href;if(typeof r.fetch!="function"||typeof r.AbortController!="function"){s&&(t.srcdoc=ue("Preview unavailable. Use the open button above."));return}let d=new r.AbortController;a.abortController=d;let p=s?Kn:1;(async()=>{let m;for(let h=0;h<p;h+=1)try{return await po(r,i.href,d)}catch(w){if(m=w,d.signal.aborted||h+1>=p)throw w;s&&t.isConnected&&(t.srcdoc=ue("Still loading; retrying\u2026"))}throw m})().then(({html:m,response:h})=>{let w=h.headers.get("content-type")?.toLowerCase()??"";if(!h.ok||!w.includes("text/html")&&!w.includes("application/xhtml+xml")){s&&t.isConnected&&(t.srcdoc=ue("Preview unavailable. Use the open button above."));return}if(m.length>Bn||d.signal.aborted||!t.isConnected){s&&!d.signal.aborted&&t.isConnected&&(t.srcdoc=ue("Preview is too large. Use the open button above."));return}let R=new URL(h.url||i.href);R.hash="",lo(c,{baseUrl:R.href,html:m}),t.setAttribute("sandbox",Ce),t.srcdoc=Ft(m,R.href,l)}).catch(()=>{s&&t.isConnected&&!d.signal.aborted&&(t.srcdoc=ue("Preview unavailable. Use the open button above."))}).finally(()=>{a.abortController===d&&(a.abortController=null)})}#Ee(e,t){let n=e.querySelector(".resource-preview-frame"),r=e.querySelector(".resource-preview-open"),a=e.querySelector(".resource-preview-url");if(!n||!r||!a)return;let s=(e.dataset.previewKind==="definition"?"definition":"resource")==="definition"?"Definition":"Resource";e.setAttribute("aria-label",`${s} preview of ${t}`),a.textContent=t,a.title=t,r.href=t,r.setAttribute("aria-label",`Open ${t} in a new tab`),r.title=r.getAttribute("aria-label"),n.title=`${s} preview of ${t}`,this.#ye(e,n,t)}#_e(e,t,n){let r=this.ownerDocument.defaultView;if(!r||!this.shadowRoot||!e.isConnected)return null;let a=this.ownerDocument,i=a.createElement("section");i.className="resource-preview";let s=e.closest(".predicate")?"definition":"resource";i.dataset.previewKind=s,i.setAttribute("role","dialog"),i.setAttribute("aria-label",`${s==="definition"?"Definition":"Resource"} preview of ${e.href}`);let{height:c,margin:l,width:d}=this.#H(),p=Math.max(1,d-l*2),g=Math.max(1,c-l*2),m=s==="definition"?620:Math.max(760,Math.round(d*.72)),h=s==="definition"?520:Math.min(760,Math.max(560,Math.round(c*.82))),w=Math.min(m,p),R=Math.min(h,g),E=this.#d.size%6*24,q=this.#z({height:R,width:w,x:s==="definition"?t-24:Math.round((d-w)/2),y:s==="definition"?n-40:Math.round((c-R)/2)});this.#se(i,{...q,x:q.x+E,y:q.y+E});let x=a.createElement("header");x.className="resource-preview-bar";let L=a.createElement("span");L.className="resource-preview-url",L.title=e.href,L.textContent=e.href;let k=a.createElement("a");k.className="resource-preview-action resource-preview-open",k.href=e.href,k.target="_blank",k.rel="noopener noreferrer",k.setAttribute("aria-label",`Open ${e.href} in a new tab`),k.title=k.getAttribute("aria-label"),k.textContent="\u2197",x.append(L,k);let u=a.createElement("button");u.className="resource-preview-action resource-preview-close",u.type="button",u.setAttribute("aria-label","Close resource preview"),u.title=u.getAttribute("aria-label"),u.textContent="\xD7",u.addEventListener("click",()=>this.#ae(i)),x.append(u),x.addEventListener("pointerdown",D=>{(D.target instanceof Element?D.target:null)?.closest("a, button")||this.#xe(D,i)});let v=a.createElement("iframe");v.className="resource-preview-frame",v.title=`${s==="definition"?"Definition":"Resource"} preview of ${e.href}`,v.setAttribute("sandbox",Ot(_t(e.href))?Ce:zt),v.referrerPolicy="no-referrer",v.tabIndex=0,i.append(x,v);let b=a.createElement("div");b.className="resource-preview-resize-handles",b.setAttribute("aria-hidden","true");for(let D of["n","ne","e","se","s","sw","w","nw"]){let N=a.createElement("span");N.className="resize-handle",N.dataset.resize=D,N.addEventListener("pointerdown",P=>this.#xe(P,i,D)),b.append(N)}i.append(b),this.shadowRoot.append(i);let T={abortController:null,interactionCleanup:null,navigationCleanup:null};this.#d.set(i,T),i.addEventListener("pointerdown",()=>this.#$(i),{capture:!0}),this.#$(i);let S=D=>{let N=D.data;D.source!==v.contentWindow||N?.type!=="ia2-rdf-preview-navigate"||typeof N.href!="string"||!Ae(N.href)||this.#Ee(i,N.href)};return r.addEventListener("message",S),T.navigationCleanup=()=>r.removeEventListener("message",S),this.#ye(i,v,e.href),i}#Se(e,t){let n=e.getBoundingClientRect(),r=t.clientX||n.left+Math.min(n.width/2,24),a=t.clientY||n.top+Math.min(n.height/2,12);return this.#_e(e,r,a)}#Oe(e,t){let n=this.#W;if(n?.isConnected&&this.#d.has(n)){this.#$(n),this.#Ee(n,e.href);return}this.#W=this.#Se(e,t)}#Fe(e){if(!(e instanceof Element))return null;let t=e.closest("a.term-link[href], a.vocabulary-link[href], a.tok.iri[href], a.sparql-resource-label[href]");if(!t||!this.shadowRoot?.contains(t))return null;let n=this.#n?.sourceDocumentIri??this.ownerDocument.URL,r=t.dataset.semanticIri??t.href;return we(this.ownerDocument,r,n)?null:t}#Ue(){if(!this.shadowRoot)return;let e=this.shadowRoot.querySelector(".viewport");e&&e.addEventListener("click",t=>{let n=this.#Fe(t.target);!n||t.button!==0||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||(t.preventDefault(),n.classList.contains("sparql-resource-label")?this.#Oe(n,t):this.#Se(n,t))})}#Ve(){try{let e=this.ownerDocument.defaultView?.sessionStorage.getItem(At);if(!e)return;let t=JSON.parse(e);ke(t.position)&&(this.#c=t.position),Jn(t.floatingRect)&&(this.#u=this.#z(t.floatingRect)),Zn(t.launcherPosition)&&(this.#l=t.launcherPosition)}catch{}}#D(){try{let e={floatingRect:this.#u,launcherPosition:this.#l,position:this.#c};this.ownerDocument.defaultView?.sessionStorage.setItem(At,JSON.stringify(e))}catch{}}#ce(){let e=this.shadowRoot?.activeElement;if(!(e instanceof HTMLElement))return null;if(e.classList.contains("navigator-search")){let t=e;return{kind:"search",start:t.selectionStart,end:t.selectionEnd}}if(e.classList.contains("shapes-search")){let t=e;return{kind:"shapes-search",start:t.selectionStart,end:t.selectionEnd}}if(e.classList.contains("sparql-editor")){let t=e;return{kind:"sparql-editor",start:t.selectionStart,end:t.selectionEnd}}return e.classList.contains("sparql-suggestion")?{kind:"sparql-suggestion"}:e.classList.contains("sparql-run")?{kind:"sparql-run"}:e.classList.contains("sparql-reset")?{kind:"sparql-reset"}:e.classList.contains("sparql-observe-input")?{kind:"sparql-observe"}:e.classList.contains("vocabulary-toggle")&&e.dataset.namespace?{kind:"namespace",key:e.dataset.namespace}:e.classList.contains("sync-option")&&e.dataset.syncMode?{kind:"sync",key:e.dataset.syncMode}:e.classList.contains("position-option")&&e.dataset.position?{kind:"position",key:e.dataset.position}:e.classList.contains("discovery-action")&&e.dataset.candidateId?{kind:"discovery-action",key:e.dataset.candidateId}:e.classList.contains("source-input")&&e.dataset.sourceId?{kind:"source",key:e.dataset.sourceId}:e.classList.contains("tab")&&e.dataset.view?{kind:"tab",key:e.dataset.view}:e.classList.contains("launcher")?{kind:"launcher"}:e.classList.contains("refresh")?{kind:"refresh"}:e.classList.contains("close")?{kind:"close"}:e.classList.contains("copy")?{kind:"copy"}:e.classList.contains("viewport")?{kind:"viewport"}:this.shadowRoot?.querySelector(".panel")?.contains(e)?{kind:"fallback"}:null}#le(e){if(!this.shadowRoot)return;let t=null;e.kind==="search"&&(t=this.shadowRoot.querySelector(".navigator-search")),e.kind==="shapes-search"&&(t=this.shadowRoot.querySelector(".shapes-search")),e.kind==="sparql-editor"&&(t=this.shadowRoot.querySelector(".sparql-editor")),e.kind==="sparql-suggestion"&&(t=this.shadowRoot.querySelector(".sparql-suggestion")),e.kind==="sparql-run"&&(t=this.shadowRoot.querySelector(".sparql-run")),e.kind==="sparql-reset"&&(t=this.shadowRoot.querySelector(".sparql-reset")),e.kind==="sparql-observe"&&(t=this.shadowRoot.querySelector(".sparql-observe-input")),e.kind==="namespace"&&(t=Array.from(this.shadowRoot.querySelectorAll(".vocabulary-toggle")).find(n=>n.dataset.namespace===e.key)??null),e.kind==="sync"&&(t=Array.from(this.shadowRoot.querySelectorAll(".sync-option")).find(n=>n.dataset.syncMode===e.key)??null),e.kind==="position"&&(t=Array.from(this.shadowRoot.querySelectorAll(".position-option")).find(n=>n.dataset.position===e.key)??null),e.kind==="discovery-action"&&(t=Array.from(this.shadowRoot.querySelectorAll(".discovery-action")).find(n=>n.dataset.candidateId===e.key)??null),e.kind==="source"&&(t=Array.from(this.shadowRoot.querySelectorAll(".source-input")).find(n=>n.dataset.sourceId===e.key)??null),e.kind==="tab"&&(t=Array.from(this.shadowRoot.querySelectorAll(".tab")).find(n=>n.dataset.view===e.key)??null),e.kind==="launcher"&&(t=this.shadowRoot.querySelector(".launcher")),e.kind==="refresh"&&(t=this.shadowRoot.querySelector(".refresh")),e.kind==="close"&&(t=this.shadowRoot.querySelector(".close")),e.kind==="copy"&&(t=this.shadowRoot.querySelector(".copy")),e.kind==="viewport"&&(t=this.shadowRoot.querySelector(".viewport")),!t&&e.kind==="fallback"&&(t=this.shadowRoot.querySelector('[role="tab"][aria-selected="true"]')),t?.focus({preventScroll:!0}),e.kind==="search"&&t instanceof HTMLInputElement&&t.setSelectionRange(e.start??t.value.length,e.end??t.value.length),e.kind==="shapes-search"&&t instanceof HTMLInputElement&&t.setSelectionRange(e.start??t.value.length,e.end??t.value.length),e.kind==="sparql-editor"&&t instanceof HTMLTextAreaElement&&t.setSelectionRange(e.start??t.value.length,e.end??t.value.length)}#Be(){let e=this.shadowRoot?.querySelector(".panel");return e?[e,...this.#d.keys()].flatMap(n=>Array.from(n.querySelectorAll("a[href], button, input, select, textarea, [tabindex]"))).filter(n=>n.tabIndex>=0&&!n.hasAttribute("disabled")&&!n.closest("[hidden]")&&n.getAttribute("aria-hidden")!=="true"):[]}#We(){this.#M?.disconnect();let e=this.ownerDocument.defaultView?.MutationObserver??MutationObserver;this.#M=new e(t=>{t.some(n=>n.target!==this&&Lo(n))&&(this.#C!==null&&window.clearTimeout(this.#C),this.#C=window.setTimeout(()=>{this.#C=null,this.#t.status==="success"?this.#et():this.refresh()},120))});try{this.#M.observe(this.ownerDocument.documentElement,{attributes:!0,characterData:!0,childList:!0,subtree:!0})}catch{this.#M=null}}#ke(){if(!this.#m){this.#n=null,this.#v={count:0,groups:[],shapes:[]},this.#A.clear();return}let e=Array.from(this.#a.values()).flatMap(t=>t.status==="loaded"&&t.contribution?[t.contribution]:[]);this.#n=Oe(this.#m,e),this.#v=Ge(this.#n),this.#A=je(this.#n.quads,{predicates:$t,languages:[this.ownerDocument.documentElement.lang||"en"]})}#de(e){this.#ke(),this.#h(),queueMicrotask(()=>{Array.from(this.shadowRoot?.querySelectorAll(".discovery-action")??[]).find(t=>t.dataset.candidateId===e)?.focus({preventScroll:!0})})}#Ke(e){this.#a.get(e)?.controller?.abort(),this.#a.delete(e),this.#de(e)}async#Qe(e){let t=this.#m,n=this.ownerDocument.defaultView;if(!t||!n)return;let r=this.#a.get(e.id);if(r?.status==="loading"||r?.status==="loaded"){this.#Ke(e.id);return}let a=new AbortController;this.#a.set(e.id,{controller:a,status:"loading"}),this.#de(e.id);let i=n.setTimeout(()=>a.abort(),Un);try{let s=To(e.target.value,t),c=new URL(s).protocol;if(c!=="http:"&&c!=="https:")throw new Error(`Unsupported retrieval protocol: ${c}`);let l=await n.fetch(s,{credentials:"omit",headers:{Accept:Vn},redirect:"follow",referrerPolicy:"no-referrer",signal:a.signal});if(!l.ok)throw new Error(`Retrieval failed with HTTP ${l.status}.`);let d=Number.parseInt(l.headers.get("content-length")??"",10);if(Number.isFinite(d)&&d>Ht)throw new Error("The representation is larger than the 2 MB enrichment limit.");let p=(l.headers.get("content-type")??"").split(";",1)[0].trim().toLowerCase(),g=await l.text();if(g.length>Ht)throw new Error("The representation is larger than the 2 MB enrichment limit.");let m=/<!doctype\s+html|<html[\s>]/i.test(g);if(p&&p!=="text/html"&&p!=="application/xhtml+xml")throw new Error(`Unsupported enrichment representation: ${p}. This preview currently extracts HTML/RDF.`);if(!p&&!m)throw new Error("The target did not return an identifiable HTML representation.");let h=new n.DOMParser().parseFromString(g,"text/html"),w=l.url||s;Ro(h,w);let R=de(h);if(!R.quads.length&&!R.graphs.length)throw new Error("The retrieved HTML contained no extractable RDF.");if(this.#a.get(e.id)?.controller!==a)return;this.#a.set(e.id,{contribution:{candidateId:e.id,result:R,retrievalIri:w},status:"loaded"})}catch(s){if(this.#a.get(e.id)?.controller!==a)return;this.#a.set(e.id,{message:No(s),status:"error"})}finally{n.clearTimeout(i)}this.#de(e.id)}#Ge(e){let t=this.#ge.get(e);return t||(t=`document-frame-${this.#He++}`,this.#ge.set(e,t)),t}#Ye(){return Array.from(this.ownerDocument.querySelectorAll("iframe, frame")).flatMap((t,n)=>{let r=null;try{if(r=t.contentDocument,!r?.documentElement)return[];r.documentElement.localName}catch{return[]}let a=r.URL||r.baseURI,i="Opaque origin";try{i=new URL(a).origin}catch{}let s=t.getAttribute("title")?.trim()||r.title.trim()||`Embedded document ${n+1}`;return[{access:"direct",id:this.#Ge(t),label:s,origin:i,result:de(r),url:a}]})}#Le(e,t=!1){let n=this.#r.find(i=>i.id===this.#i)??this.#r[0];if(!n)return;if(this.#i=n.id,this.#m=n.result,!e){for(let i of this.#a.values())i.controller?.abort();this.#a.clear()}this.#k=_e(this.#m),this.#L=Je(this.#m);let r=Re(this.#m);this.#f=r.queries,this.#Z=r.diagnostics,this.#f.some(i=>i.id===this.#w)||(this.#w=""),t||(this.#b+=1,this.#s=0,this.#t={status:"idle"},this.#g="");let a=new Set(this.#k.map(i=>i.id));for(let[i,s]of this.#a)a.has(i)||(s.controller?.abort(),this.#a.delete(i));this.#ke()}#Te(e,t=!1){if(!this.#U)return;let n=this.#i,r=this.ownerDocument.URL||this.ownerDocument.baseURI,a="Opaque origin";try{a=new URL(r).origin}catch{}let i=new Set,s=[{access:"direct",id:"top-document",label:"Top document",origin:a,result:this.#U,url:r},...this.#me,...this.#fe];this.#r=s.filter(d=>i.has(d.id)?!1:(i.add(d.id),!0)),this.#r.some(d=>d.id===this.#i)||(this.#i="top-document");let c=this.#r[0],l=this.#r.slice(1).filter(d=>d.result.quads.length>0);this.#i===c.id&&c.result.quads.length===0&&l.length===1&&(this.#i=l[0].id),this.#Le(e,t&&n===this.#i)}#Xe(e){e===this.#i||!this.#r.some(t=>t.id===e)||(this.#i=e,this.#Le(!1),this.#e="navigator",this.#q="",this.#J="",this.#y.clear(),this.#p="off",this.#h())}setSources(e){if(this.#fe=e.flatMap(n=>{if(!n||n.access!=="portable"||!n.id||n.id==="top-document")return[];try{return[{access:"portable",id:n.id,label:n.label||"Embedded document",origin:n.origin||"Opaque origin",result:Ue(n.result,this.ownerDocument),url:n.url||n.result.retrievalDocumentIri}]}catch{return[]}}),!this.#U)return;let t=this.#ce();this.#Te(!0),this.#h(),t&&queueMicrotask(()=>this.#le(t))}#Re(e){this.#U=de(this.ownerDocument),this.#me=this.#Ye(),this.#Te(!0,e)}#Ne(){let e=this.#r.find(r=>r.id===this.#i)??this.#r[0],t=this.#r.reduce((r,a)=>r+a.result.quads.length,0),n=Math.max(0,(this.#n?.quads.length??0)-(e?.result.quads.length??0));return t+n}#Je(){let e=this.shadowRoot?.querySelector(".launcher .count");e&&(e.textContent=String(this.#Ne()))}#Ze(){let e=this.shadowRoot?.querySelector(".sparql-output");e&&(e.replaceChildren(),this.#he(e))}async#Me(){let e=this.#x.trim();if(!this.#V||!e||!this.#n||this.#t.status!=="success")return;let t=++this.#b,n=this.#n;try{let{executeSparql:r}=await import("./chunks/sparql-engine-FOALRXFP.js"),a=await r(e,n);if(t!==this.#b)return;let i=Ut(a,this.#A);if(i===this.#g)return;this.#t={result:a,status:"success"},this.#g=i}catch(r){if(t!==this.#b)return;this.#t={error:r instanceof Error?r.message:"The query could not be run.",status:"error"},this.#g=""}this.#e==="sparql"&&this.#Ze()}async#et(){let e=this.#i;if(this.#Re(!0),e!==this.#i||this.#t.status!=="success"){this.#h();return}this.#e==="sparql"?this.#Je():this.#h(),await this.#Me()}refresh(){let e=this.#ce();this.#Re(!1),this.#h(),e&&queueMicrotask(()=>this.#le(e))}open(e="tab"){if(this.#o)return;this.#o=!0,this.#oe||this.#h(),this.shadowRoot?.querySelector(".launcher")?.setAttribute("aria-expanded","true");let t=this.shadowRoot?.querySelector(".panel");t&&(t.dataset.open="true"),queueMicrotask(()=>{let n=this.shadowRoot?.activeElement;if(n instanceof HTMLElement&&t?.contains(n))return;(e==="tab"?this.shadowRoot?.querySelector('[role="tab"][aria-selected="true"]'):this.shadowRoot?.querySelector(".panel"))?.focus({preventScroll:!0})})}close(){this.#o=!1,this.#Y(),this.#ie(),this.#F(),this.#ze(),this.shadowRoot?.querySelector(".launcher")?.setAttribute("aria-expanded","false");let e=this.shadowRoot?.querySelector(".panel");e&&(e.dataset.open="false"),queueMicrotask(()=>{let t=this.shadowRoot?.querySelector(".launcher");if(t?.hidden){this.shadowRoot?.activeElement?.blur();return}t?.focus()})}toggle(e="tab"){this.#o?this.close():this.open(e)}revealSource(e,t="left"){return!(this.#m?.quads.some(r=>r.source===e)??!1)||e.ownerDocument!==this.ownerDocument?!1:(this.#c=t,this.#e="navigator",this.#q="",this.#y.clear(),this.#p="off",this.#h(),this.#D(),this.open("panel"),queueMicrotask(()=>{let r=this.#Q.filter(({quad:s})=>s.source===e),a=r[0]?.item;if(!a)return;this.#Q.forEach(({item:s})=>s.classList.remove("is-corresponding")),r.forEach(({item:s})=>{s.hidden=!1,s.classList.add("is-corresponding")}),a.tabIndex=-1,a.scrollIntoView?.({block:"center"}),a.focus({preventScroll:!0}),this.#T=`Showing statements carried by ${Q(e)}`;let i=this.shadowRoot?.querySelector(".sr-only");i&&(i.textContent=this.#T)}),!0)}#H(){let e=this.ownerDocument.defaultView,t=Math.max(e?.innerWidth??1024,1),n=Math.max(e?.innerHeight??768,1),r=t<=760?10:24;return{height:n,margin:r,minHeight:Math.min(280,Math.max(n-r*2,1)),minWidth:Math.min(360,Math.max(t-r*2,1)),width:t}}#z(e){let{height:t,margin:n,minHeight:r,minWidth:a,width:i}=this.#H(),s=Math.max(i-n*2,1),c=Math.max(t-n*2,1),l=Math.min(Math.max(e.width,a),s),d=Math.min(Math.max(e.height,r),c);return{height:d,width:l,x:Math.min(Math.max(e.x,n),i-n-l),y:Math.min(Math.max(e.y,n),t-n-d)}}#tt(){let{height:e,margin:t,width:n}=this.#H(),r=Math.min(760,Math.max(n-t*2,1)),a=Math.min(860,Math.max(e-t*2,1),Math.max(360,Math.round(e*.82)));return{height:a,width:r,x:Math.round((n-r)/2),y:Math.round((e-a)/2)}}#j(e){this.#u=this.#z(this.#u??this.#tt()),e.style.height=`${this.#u.height}px`,e.style.left=`${this.#u.x}px`,e.style.top=`${this.#u.y}px`,e.style.width=`${this.#u.width}px`}#nt(e){e.style.height="",e.style.left="",e.style.top="",e.style.width=""}#Ce(e){let t=this.ownerDocument.defaultView,n=Math.max(t?.innerWidth??1024,1),r=Math.max(t?.innerHeight??768,1),a=n<=760?14:20,i=e.getBoundingClientRect(),s=i.width||e.offsetWidth,c=i.height||e.offsetHeight||44;return{margin:a,maxX:Math.max(a,n-a-s),maxY:Math.max(a,r-a-c)}}#pe(e,t){let{margin:n,maxX:r,maxY:a}=this.#Ce(e);return{x:Math.min(Math.max(t.x,n),r),y:Math.min(Math.max(t.y,n),a)}}#ot(e,t){let{margin:n,maxX:r,maxY:a}=this.#Ce(e),i=this.#pe(e,t);return i.x-n<=Me&&(i.x=n),r-i.x<=Me&&(i.x=r),i.y-n<=Me&&(i.y=n),a-i.y<=Me&&(i.y=a),i}#_(e){this.#l&&(this.#l=this.#pe(e,this.#l),e.style.bottom="auto",e.style.left=`${this.#l.x}px`,e.style.right="auto",e.style.top=`${this.#l.y}px`)}#ue(){this.#P?.(),this.#P=null}#rt(e,t){if(e.button!==0)return;let n=this.ownerDocument.defaultView;if(!n)return;this.#ue();let r=t.getBoundingClientRect(),a={x:r.left,y:r.top},i=e.clientX,s=e.clientY,c=!1,l=p=>{let g=p.clientX-i,m=p.clientY-s;!c&&Math.hypot(g,m)<Fn||(c||(c=!0,e.preventDefault(),t.classList.add("is-dragging")),this.#l=this.#pe(t,{x:a.x+g,y:a.y+m}),this.#_(t))},d=()=>{n.removeEventListener("pointermove",l),n.removeEventListener("pointerup",d),n.removeEventListener("pointercancel",d),t.classList.remove("is-dragging"),c&&this.#l&&(this.#l=this.#ot(t,this.#l),this.#_(t),this.#D(),this.#B=!0,n.setTimeout(()=>{this.#B=!1},0)),this.#P===d&&(this.#P=null)};n.addEventListener("pointermove",l),n.addEventListener("pointerup",d),n.addEventListener("pointercancel",d),this.#P=d}#Y(){this.#I?.(),this.#I=null}#De(e,t,n){if(this.#c!=="floating"||e.button!==0)return;let r=this.ownerDocument.defaultView;if(!r)return;e.preventDefault(),this.#Y(),this.#j(t);let a={...this.#u},i=e.clientX,s=e.clientY;t.classList.add(n?"is-resizing":"is-dragging");let c=d=>{let p=d.clientX-i,g=d.clientY-s,m=this.#H(),h={...a};n?(n.includes("e")&&(h.width=Math.min(Math.max(a.width+p,m.minWidth),m.width-m.margin-a.x)),n.includes("s")&&(h.height=Math.min(Math.max(a.height+g,m.minHeight),m.height-m.margin-a.y)),n.includes("w")&&(h.x=Math.min(Math.max(a.x+p,m.margin),a.x+a.width-m.minWidth),h.width=a.x+a.width-h.x),n.includes("n")&&(h.y=Math.min(Math.max(a.y+g,m.margin),a.y+a.height-m.minHeight),h.height=a.y+a.height-h.y)):(h.x=a.x+p,h.y=a.y+g),this.#u=this.#z(h),this.#j(t)},l=()=>{r.removeEventListener("pointermove",c),r.removeEventListener("pointerup",l),r.removeEventListener("pointercancel",l),t.classList.remove("is-dragging","is-resizing"),this.#D(),this.#I===l&&(this.#I=null)};r.addEventListener("pointermove",c),r.addEventListener("pointerup",l),r.addEventListener("pointercancel",l),this.#I=l}#qe=()=>{for(let n of this.#d.keys())this.#we(n);let e=this.shadowRoot?.querySelector(".launcher");if(e&&this.#l&&(this.#_(e),this.#D()),this.#c!=="floating")return;let t=this.shadowRoot?.querySelector(".panel");t&&(this.#j(t),this.#D())};#Ae=e=>{if(e.stopPropagation(),!!this.#o){if(e.key==="Escape"){if(e.preventDefault(),this.#R){this.#ae(this.#R);return}this.close();return}if(e.key==="Tab"){let t=this.#Be();if(!t.length)return;let n=this.shadowRoot?.activeElement,r=t[0],a=t.at(-1);e.shiftKey&&(n===r||!t.includes(n))?(e.preventDefault(),a.focus()):!e.shiftKey&&(n===a||!t.includes(n))&&(e.preventDefault(),r.focus())}}};#Ie=e=>{e.stopPropagation()};#at(e){this.#e=e,this.#h(),queueMicrotask(()=>this.shadowRoot?.querySelector(`[data-view="${e}"]`)?.focus())}async#it(){if(!this.#n)return;let e=this.#e==="json"?be(this.#n):ge(this.#n);try{await navigator.clipboard.writeText(e),this.#T="Copied to clipboard"}catch{this.#T="Clipboard access was not available"}let t=this.shadowRoot?.querySelector(".sr-only");t&&(t.textContent=this.#T)}#O(e){this.#F();let t=e,n=t.ownerDocument.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1;t.scrollIntoView({behavior:n?"auto":"smooth",block:"center"}),n||(this.#ee=t.animate?.([{outline:"3px solid transparent",outlineOffset:"8px"},{outline:"3px solid oklch(62% 0.18 294)",outlineOffset:"4px",offset:.16},{outline:"3px solid transparent",outlineOffset:"8px"}],{duration:1800,easing:"cubic-bezier(.22,1,.36,1)"})??null)}#st(e,t){if(t.metaKey||t.ctrlKey||t.shiftKey||t.altKey)return;let n=this.#n?.sourceDocumentIri??this.ownerDocument.URL,r=we(this.ownerDocument,e,n);if(!r)return;let a=nt(this.ownerDocument,r),i=this.#n?.quads.filter(l=>l.subject.termType==="NamedNode"&&l.subject.value===e).map(l=>l.source).find(l=>le(l)),s=a??i;if(!s)return;t.preventDefault();let c=this.ownerDocument.defaultView;if(c){let l=new URL(this.ownerDocument.URL);l.hash=r.hash,c.history.pushState(null,"",l.href)}this.#O(s)}#F(){this.#ee?.cancel(),this.#ee=null}#ct(e,t,n,r){if(this.#G(),this.#p==="off")return;let a=this.ownerDocument.defaultView;if(!a)return;let i=[],s=null,c=null,l=null,d=(u,v,b,T)=>{u.addEventListener(v,b,T),i.push(()=>u.removeEventListener(v,b,T))},p=u=>{s!==null&&a.clearTimeout(s),s=a.setTimeout(()=>{s=null,u()},32)},g=new Map;for(let u of t){let v=g.get(u.quad.source)??[];v.push(u),g.set(u.quad.source,v)}let m=u=>{c?.cancel(),!a.matchMedia?.("(prefers-reduced-motion: reduce)").matches&&(c=u.animate?.([{outline:"2px solid transparent",outlineOffset:"7px"},{outline:"2px solid oklch(62% 0.18 294)",outlineOffset:"4px"}],{direction:"alternate",duration:520,easing:"cubic-bezier(.22,1,.36,1)",iterations:1/0})??null)},h=()=>{c?.cancel(),c=null},w=u=>{let v=[],b=u instanceof Element?u:null;for(;b;)g.has(b)&&v.push(b),b=b.parentElement;return v},R=u=>{for(let v of w(u.target))u.relatedTarget instanceof Node&&v.contains(u.relatedTarget)||(r(v),g.get(v)?.forEach(({item:b})=>{b.classList.add("is-corresponding"),b.scrollIntoView?.({block:"nearest"})}))},E=u=>{for(let v of w(u.target))u.relatedTarget instanceof Node&&v.contains(u.relatedTarget)||(g.get(v)?.forEach(({item:b})=>b.classList.remove("is-corresponding")),r(null))},q=new WeakMap(t.map(u=>[u.item,u])),x=u=>{if(!(u instanceof Element))return null;let v=u.closest(".quad");return v?q.get(v)??null:null},L=u=>{let v=x(u.target);if(!v||u.relatedTarget instanceof Node&&v.item.contains(u.relatedTarget))return;let b=v.quad.source;v.item.classList.add("is-corresponding"),m(b),this.#p==="panel"&&b.scrollIntoView({behavior:a.matchMedia?.("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"center"})},k=u=>{let v=x(u.target);!v||u.relatedTarget instanceof Node&&v.item.contains(u.relatedTarget)||(v.item.classList.remove("is-corresponding"),h())};if(d(this.ownerDocument,"pointerover",R),d(this.ownerDocument,"pointerout",E),d(e,"pointerover",L),d(e,"pointerout",k),this.#p==="page"){let u=()=>p(n);d(a,"scroll",u,{passive:!0}),d(a,"resize",u,{passive:!0})}else{let u=()=>{let v=e.getBoundingClientRect(),b=v.top+Math.min(v.height*.35,140),T=null,S=Number.POSITIVE_INFINITY;for(let N of t){if(N.item.hidden)continue;let P=N.item.getBoundingClientRect();if(P.bottom<=v.top||P.top>=v.bottom)continue;let H=Math.abs(P.top-b);H<S&&(T=N,S=H)}let D=T?.quad.source;!D||D===l||!le(D)||(l=D,D.scrollIntoView({behavior:"auto",block:"center"}),m(D))};d(e,"scroll",()=>p(u),{passive:!0}),p(u)}this.#te=()=>{i.forEach(u=>u()),s!==null&&a.clearTimeout(s),h()}}#lt(e,t,n,r,a,i=!1){let c=e.querySelector(".source-code")?.dataset.children===String(r);if(e.querySelectorAll(".source-toggle").forEach(m=>{m.setAttribute("aria-expanded","false");let h=m.dataset.showLabel;h&&(m.setAttribute("aria-label",h),m.title=h)}),e.querySelector(".source-code")?.remove(),e.classList.remove("source-open"),c)return;e.classList.add("source-open"),t.setAttribute("aria-expanded","true");let l=t.dataset.hideLabel;l&&(t.setAttribute("aria-label",l),t.title=l);let d=this.ownerDocument.createElement("section");d.className="source-code",d.id=a,d.dataset.children=String(r),d.setAttribute("aria-label",i?"Element HTML":r?"Element HTML with children":"Element HTML without children");let p=this.ownerDocument.createElement("p");p.className="source-code-label",p.textContent=i?Q(n):r?`${Q(n)} with children`:`${Q(n)} without children`;let g=n.cloneNode(r);d.append(p,pe(g.outerHTML,"html",this.ownerDocument)),e.append(d)}#dt(e,t){if(!t.quads.length){let f=document.createElement("p");f.className="empty",f.textContent="No asserted IA2 statements were found in the document light tree.",e.append(f);return}let n=document.createElement("div");n.className="navigator-tools";let r=document.createElement("div");r.className="navigator-filter";let a=document.createElement("label");a.className="sr-only",a.htmlFor="ia2-navigator-search",a.textContent="Filter RDF statements";let i=document.createElement("input");i.className="navigator-search",i.id="ia2-navigator-search",i.type="search",i.placeholder="Filter statements",i.autocomplete="off",i.spellcheck=!1,i.value=this.#q,i.setAttribute("role","combobox"),i.setAttribute("aria-autocomplete","list"),i.setAttribute("aria-controls","ia2-navigator-suggestions"),i.setAttribute("aria-expanded","false");let s=document.createElement("div");s.className="navigator-search-group";let c=document.createElement("ul");c.className="typeahead",c.id="ia2-navigator-suggestions",c.setAttribute("role","listbox"),c.setAttribute("aria-label","Semantic term suggestions"),c.hidden=!0;let l=document.createElement("span");l.className="sr-only typeahead-status",l.setAttribute("role","status"),l.setAttribute("aria-live","polite");let d=document.createElement("output");d.className="filter-count",d.setAttribute("for",i.id),d.setAttribute("aria-live","polite");let p=document.createElement("div");p.innerHTML=wt({current:this.#p,controlClass:"sync-control",labels:{page:"Follow page viewport in Navigator",panel:"Follow Navigator in page"},optionClass:"sync-option",switchClass:"sync-switch"});let g=p.firstElementChild,m=g.querySelector(".sync-switch");s.append(i,c,d,l),r.append(a,s,g),n.append(r),e.append(n);let h=So(t),w=xo(t),R=new Map,E=()=>{};if(h.length){let f=document.createElement("nav");f.className="vocabularies",f.setAttribute("aria-label","Namespaces used in this document");let A=document.createElement("p");A.className="vocabularies-label",A.textContent="Namespaces";let M=document.createElement("div");M.className="vocabulary-links";for(let C of h){let _=document.createElement("span");_.className="vocabulary-control";let j=document.createElement("button");j.className="vocabulary-toggle",j.type="button",j.dataset.namespace=C.namespace;let ee=document.createElement("span");ee.className="vocabulary-name",ee.textContent=C.label;let X=document.createElement("span");X.className="vocabulary-count",X.setAttribute("aria-hidden","true"),X.textContent=String(C.count),j.append(ee,X),j.addEventListener("click",()=>{this.#y.has(C.namespace)?this.#y.delete(C.namespace):this.#y.add(C.namespace),E()}),R.set(C.namespace,j);let B=document.createElement("a");B.className="vocabulary-link",B.href=C.namespace,B.target="_blank",B.rel="noopener noreferrer",B.title=`Open ${C.namespace} in a new tab`,B.setAttribute("aria-label",`Open ${C.namespace} in a new tab`);let te=document.createElement("span");te.className="external-mark",te.setAttribute("aria-hidden","true"),te.textContent="\u2197",B.append(te),_.append(j,B),M.append(_)}f.append(A,M),n.append(f);let y=()=>{let C=Math.max(M.scrollWidth-M.clientWidth,0);f.dataset.overflowLeft=String(M.scrollLeft>1),f.dataset.overflowRight=String(M.scrollLeft<C-1)};M.addEventListener("scroll",y,{passive:!0}),M.addEventListener("pointerenter",y),M.addEventListener("focusin",y);let I=this.ownerDocument.defaultView?.ResizeObserver;I&&(this.#N=new I(()=>y()),this.#N.observe(M)),queueMicrotask(y)}let q=document.createElement("ol");q.className="navigator";let x=new Set(t.quads.map(f=>f.source)),L=new Map,k=new Map,u=new WeakMap,v=new WeakMap,b=new WeakMap,T=[];t.quads.forEach((f,A)=>{let M=document.createElement("li");M.className="quad";let y=ho(f.source,x),I=Math.min(y,6);if(M.dataset.depth=String(y),M.style.setProperty("--rdf-indent",`${I*16}px`),y>0){let $=document.createElement("span");$.className="structure-marker",$.setAttribute("aria-hidden","true"),$.textContent="\u21B3",M.append($)}let C=document.createElement("div");C.className="quad-terms";let _=$=>this.#O($),j=he(document,f.subject,"","subject",_,t.sourceDocumentIri,L,k,u,v),ee=he(document,f.predicate,"   ","predicate",_,t.sourceDocumentIri,L,k,u,v),X=he(document,f.object,"   ","object",_,t.sourceDocumentIri,L,k,u,v);if(C.append(j,ee,X),f.graph){let $=document.createElement("div");$.className="graph",$.append("Graph: ",he(document,f.graph,"","",_,t.sourceDocumentIri,L,k,u,v)),C.append($)}let B=new Set([f.subject,f.predicate,f.object,f.graph].filter($=>$!==null).map($=>De(document,$,t.sourceDocumentIri,L,k)).filter($=>$!==null)),te=`ia2-source-${A}`,ce=document.createElement("div");ce.className="preview-actions",ce.setAttribute("role","group"),ce.setAttribute("aria-label",`Actions for ${Q(f.source)}`),le(f.source)&&!B.has(f.source)&&ce.append(tt(document,f.source,"carrier-locate-button",_,v));let ot=uo(f.source),rt=($,at=!1)=>{let W=document.createElement("button");W.className="row-action-button source-toggle",W.type="button",W.dataset.children=String($),W.setAttribute("aria-expanded","false"),W.setAttribute("aria-controls",te);let it=at?"":$?" with child content":" without child content",Pe=`Show HTML for ${Q(f.source)}${it}`,Gt=`Hide HTML for ${Q(f.source)}${it}`;W.dataset.showLabel=Pe,W.dataset.hideLabel=Gt,W.setAttribute("aria-label",Pe),W.title=Pe;let ye=document.createElement("span");return ye.className="source-glyph",ye.setAttribute("aria-hidden","true"),ye.textContent=$?"</>+":"</>",W.append(ye),b.set(W,{equivalentOutput:at,includeChildren:$,item:M,source:f.source,sourceId:te}),W};ce.append(rt(!1,!ot)),ot&&ce.append(rt(!0)),M.append(C);let Ie=document.createElement("div");Ie.className="quad-actions",Ie.append(ce),M.append(Ie),q.append(M),T.push({item:M,namespaces:new Set(Kt(f).map($=>$.namespace)),quad:f,searchText:fo(f)})}),q.addEventListener("click",f=>{if(!(f.target instanceof Element))return;let A=f.target.closest("a.local-term"),M=A?u.get(A):void 0;if(M){Bt(document,M,f);return}let y=f.target.closest("button");if(!y)return;let I=v.get(y);if(I){this.#O(I);return}let C=b.get(y);C&&this.#lt(C.item,y,C.source,C.includeChildren,C.sourceId,C.equivalentOutput)}),q.addEventListener("pointerout",f=>{if(!(f.target instanceof Element))return;let A=f.target.closest(".quad");!A||f.relatedTarget instanceof Node&&A.contains(f.relatedTarget)||this.#F()}),e.append(q),this.#Q=T;let S=document.createElement("p");S.className="empty filter-empty",S.textContent="No statements match the active filters.",S.hidden=!0,e.append(S);let D=null;E=()=>{this.#q=i.value;let f=i.value.trim().toLocaleLowerCase(),A=0;T.forEach(({item:I,namespaces:C,quad:_,searchText:j})=>{let ee=Array.from(C).every(te=>!this.#y.has(te)),X=this.#p!=="page"||mo(_.source),B=_.source===D||ee&&X&&(!f||j.includes(f));I.hidden=!B,B&&(A+=1)}),R.forEach((I,C)=>{let _=!this.#y.has(C),j=h.find(X=>X.namespace===C)?.count??0,ee=`${j} statement${j===1?"":"s"}`;I.setAttribute("aria-pressed",String(_)),I.setAttribute("aria-label",`${_?"Hide":"Show"} ${ee} using ${C}`),I.title=I.getAttribute("aria-label")});let M=h.some(I=>this.#y.has(I.namespace)),y=!!f||M||this.#p==="page";d.textContent=y&&A!==T.length?`${A} of ${T.length}`:"",S.hidden=!y||A>0,q.hidden=y&&A===0};let N=[],P=-1,H=()=>{N=[],P=-1,c.hidden=!0,c.replaceChildren(),i.setAttribute("aria-expanded","false"),i.removeAttribute("aria-activedescendant"),l.textContent=""},U=f=>{if(!N.length)return;P=(f+N.length)%N.length;let A=Array.from(c.querySelectorAll('[role="option"]'));A.forEach((y,I)=>y.setAttribute("aria-selected",String(I===P)));let M=A[P];M&&(i.setAttribute("aria-activedescendant",M.id),M.scrollIntoView?.({block:"nearest"}))},Z=f=>{i.value=f.display,this.#q=i.value,E(),H()},z=()=>{if(N=yo(w,i.value),P=-1,c.replaceChildren(),i.removeAttribute("aria-activedescendant"),!N.length||this.shadowRoot?.activeElement!==i){c.hidden=!0,i.setAttribute("aria-expanded","false"),l.textContent="";return}N.forEach((f,A)=>{let M=document.createElement("li");M.className="typeahead-option",M.id=`ia2-navigator-suggestion-${A}`,M.setAttribute("role","option"),M.setAttribute("aria-selected","false");let y=document.createElement("span");y.className="typeahead-primary";let I=document.createElement("span");if(I.className="typeahead-term",I.textContent=f.display,y.append(I),f.label&&f.label!==f.display){let j=document.createElement("span");j.className="typeahead-label",j.textContent=f.label,y.append(j)}let C=Eo(f),_=document.createElement("span");_.className="typeahead-meta",_.textContent=C.join(" \xB7 "),M.setAttribute("aria-label",[f.display,f.label,...C].filter(Boolean).join(", ")),M.append(y,_),M.addEventListener("pointerdown",j=>j.preventDefault()),M.addEventListener("pointermove",()=>U(A)),M.addEventListener("click",()=>Z(f)),c.append(M)}),c.hidden=!1,i.setAttribute("aria-expanded","true"),l.textContent=`${N.length} semantic suggestion${N.length===1?"":"s"} available.`};i.addEventListener("input",()=>{E(),z()}),i.addEventListener("focus",z),i.addEventListener("blur",()=>{this.ownerDocument.defaultView?.setTimeout(()=>{this.shadowRoot?.activeElement!==i&&H()},0)}),i.addEventListener("keydown",f=>{if(f.key==="ArrowDown"||f.key==="ArrowUp"){if(c.hidden&&z(),!N.length)return;f.preventDefault(),f.stopPropagation(),U(P+(f.key==="ArrowDown"?1:-1));return}if(f.key==="Enter"&&P>=0){f.preventDefault(),f.stopPropagation(),Z(N[P]);return}if(f.key==="Escape"&&!c.hidden){f.preventDefault(),f.stopPropagation(),H();return}f.key==="Tab"&&H()});let F=()=>{this.#ct(e,T,E,f=>{D=f,E()})},Y=(f,A=!1)=>{this.#p=f,D=null,Le(m,f,A),E(),F()};this.#K=()=>Y("off"),xt(m,(f,A)=>Y(f,A)),E(),F()}#pt(e){let t=this.#n;if(!t||!this.#v.count)return;let n=this.ownerDocument,r=n.createElement("div");r.className="shapes-browser";let a=n.createElement("p");a.className="shapes-intro",a.textContent="Shape definitions found in the extracted dataset. This view exposes targets, paths, groups, and constraints; it does not run SHACL validation or rules.",r.append(a);let i=n.createElement("div");i.className="shapes-tools";let s=n.createElement("input");s.className="shapes-search",s.type="search",s.placeholder="Filter shapes, paths, targets, or constraints",s.setAttribute("aria-label",s.placeholder),s.value=this.#J;let c=n.createElement("span");c.className="shapes-filter-count",i.append(s,c),r.append(i);let l=je(t.quads,{predicates:$t,languages:[n.documentElement.lang||"en"]}),d=x=>x.label??jt(x.term),p=x=>{let L=n.createElement("div");if(L.className="shape-value",x.termType==="Literal"){let u=n.createElement("span");if(u.className="shape-literal",u.textContent=x.value,L.append(u),x.datatype.value!==fe||x.language||x.direction){let v=n.createElement("code");v.textContent=[x.language?`@${x.language}${x.direction?`--${x.direction}`:""}`:"",x.datatype.value!==fe?O(x.datatype):""].filter(Boolean).join(" \xB7 "),L.append(v)}return L}let k=l.get(et(x));if(k){let u=n.createElement("span");u.className="shape-value-label",u.textContent=k,L.append(u)}return L.append(he(n,x,"","",void 0,t.sourceDocumentIri)),L},g=(x,L,k)=>{if(!k.length)return;let u=n.createElement("section");u.className="shape-block";let v=n.createElement("h4");v.textContent=L;let b=n.createElement("dl");b.className="shape-facts";let T=new Map;for(let S of k){let D=S.predicate.value,N=T.get(D)??[];N.push(S),T.set(D,N)}for(let[S,D]of T){let N=n.createElement("div");N.className="shape-fact";let P=n.createElement("dt");P.textContent=io(S);let H=n.createElement("dd");D.forEach(U=>H.append(p(U.object))),N.append(P,H),b.append(N)}u.append(v,b),x.append(u)},m=(x,L)=>{let k=n.createElement("section");k.className="shape-block";let u=n.createElement("h4");u.textContent="Definition";let v=n.createElement("dl");v.className="shape-facts";let b=n.createElement("div");b.className="shape-fact";let T=n.createElement("dt");T.textContent="Shape";let S=n.createElement("dd");if(S.append(p(L.term)),b.append(T,S),v.append(b),L.graphs.length){let D=n.createElement("div");D.className="shape-fact";let N=n.createElement("dt");N.textContent=L.graphs.length===1?"Graph":"Graphs";let P=n.createElement("dd");L.graphs.forEach(H=>P.append(p(H))),D.append(N,P),v.append(D)}k.append(u,v),x.append(k)},h=[],w=new Map;for(let x of this.#v.shapes){let L=x.group?et(x.group):"",k=w.get(L)??[];k.push(x),w.set(L,k)}let R=[...this.#v.groups.map(x=>({key:et(x.term),label:x.label??jt(x.term)})),{key:"",label:"Ungrouped shapes"}];for(let x of R){let L=w.get(x.key)??[];if(!L.length)continue;let k=n.createElement("section");k.className="shape-group";let u=n.createElement("header");u.className="shape-group-heading";let v=n.createElement("h3");v.textContent=x.label;let b=n.createElement("span");b.className="shape-group-count",b.textContent=`${L.length} ${L.length===1?"shape":"shapes"}`,u.append(v,b);let T=n.createElement("div");T.className="shape-list";for(let S of L){let D=n.createElement("details");D.className="shape-row";let N=d(S),P=[N,O(S.term),x.label,...S.quads.flatMap(y=>[y.predicate.value,se(y.object)])].join(" ").toLocaleLowerCase();D.dataset.search=P;let H=n.createElement("summary"),U=n.createElement("span");U.className="shape-summary-copy";let Z=n.createElement("span");Z.className="shape-name",Z.textContent=N;let z=n.createElement("span");z.className="shape-identifier",z.textContent=O(S.term);let F=n.createElement("span");F.className="shape-summary-meta";let Y=n.createElement("span");if(Y.className="shape-kind",Y.textContent=so(S),F.append(Y),S.targets.length){let y=n.createElement("span");y.className="shape-stat",y.textContent=`${S.targets.length} ${S.targets.length===1?"target":"targets"}`,F.append(y)}if(S.paths.length){let y=n.createElement("span");y.className="shape-stat",y.textContent=`${S.paths.length} ${S.paths.length===1?"path":"paths"}`,F.append(y)}if(S.constraints.length){let y=n.createElement("span");y.className="shape-stat",y.textContent=`${S.constraints.length} ${S.constraints.length===1?"constraint":"constraints"}`,F.append(y)}U.append(Z,z,F),H.append(U);let f=n.createElement("div");if(f.className="shape-detail",S.description){let y=n.createElement("p");y.className="shape-description",y.textContent=S.description,f.append(y)}let A=new Set(ct(t.quads,S.term));for(let y of S.targets)y.predicate.value==="http://www.w3.org/ns/shacl#targetNode"&&y.object.termType==="NamedNode"&&A.add(y.object.value);let M=Array.from(A).flatMap(y=>{let I=De(n,{termType:"NamedNode",value:y},t.sourceDocumentIri);return I?[I]:[]}).filter((y,I,C)=>C.indexOf(y)===I);if(M.length){let y=n.createElement("div");y.className="shape-actions",M.slice(0,4).forEach(I=>{let C=n.createElement("button");C.className="shape-locate",C.type="button",C.textContent=`\u2316 Locate ${Q(I)}`,C.addEventListener("click",()=>this.#O(I)),y.append(C)}),f.append(y)}m(f,S),g(f,"Targets",S.targets),g(f,"Path",S.paths),g(f,"Property shapes",S.properties),g(f,"Constraints",S.constraints),D.append(H,f),T.append(D),h.push(D)}k.append(u,T),r.append(k)}let E=n.createElement("p");E.className="shapes-empty",E.textContent="No shapes match this filter.",E.hidden=!0,r.append(E),e.append(r);let q=()=>{this.#J=s.value;let x=s.value.trim().toLocaleLowerCase(),L=0;h.forEach(k=>{let u=!x||k.dataset.search?.includes(x);k.hidden=!u,u&&(L+=1)}),r.querySelectorAll(".shape-group").forEach(k=>{k.hidden=!Array.from(k.querySelectorAll(".shape-row")).some(u=>!u.hidden)}),c.textContent=x&&L!==h.length?`${L} of ${h.length}`:`${h.length} shapes`,E.hidden=L>0};s.addEventListener("input",q),q()}#ut(e,t){if(!t.length){let r=document.createElement("p");r.className="empty",r.textContent="No extraction diagnostics. The document passed the checks implemented by this preview extractor.",e.append(r);return}let n=document.createElement("ul");n.className="diagnostics";for(let r of t){let a=document.createElement("li");a.className="diagnostic";let i=document.createElement("strong");i.textContent=`${r.severity.toUpperCase()} \xB7 ${r.code}`;let s=document.createElement("p");s.textContent=r.source?`${r.message} Source: ${Q(r.source)}`:r.message,a.append(i,s),n.append(a)}e.append(n)}#ht(e){this.#re();let t=this.ownerDocument.defaultView;if(!t||!e.length)return;let n=[],r=new Map,a=null,i=(l,d,p)=>{l.addEventListener(d,p),n.push(()=>l.removeEventListener(d,p))},s=l=>{a?.cancel(),!t.matchMedia?.("(prefers-reduced-motion: reduce)").matches&&(a=l.animate?.([{outline:"2px solid transparent",outlineOffset:"7px"},{outline:"2px solid oklch(62% 0.18 294)",outlineOffset:"4px"}],{direction:"alternate",duration:520,easing:"cubic-bezier(.22,1,.36,1)",iterations:1/0})??null)},c=()=>{a?.cancel(),a=null};for(let l of e){let d=r.get(l.target)??[];d.push(l.item),r.set(l.target,d),i(l.item,"pointerenter",()=>s(l.target)),i(l.item,"pointerleave",c)}r.forEach((l,d)=>{i(d,"pointerenter",()=>{l.forEach(p=>{p.classList.add("is-corresponding"),p.scrollIntoView?.({block:"nearest"})})}),i(d,"pointerleave",()=>l.forEach(p=>p.classList.remove("is-corresponding")))}),this.#ne=()=>{n.forEach(l=>l()),c()}}#mt(e){let t=this.ownerDocument,n=this.#m?.sourceDocumentIri??t.URL,r=[],a=t.createElement("p");a.className="ontology-intro",a.textContent="Classes and properties defined by this document. The trees follow RDFS hierarchy statements; muted parent terms provide external context.",e.append(a);let i=(s,c,l)=>{if(!c.length)return;let d=t.createElement("section");d.className="ontology-section",d.setAttribute("aria-label",s);let p=t.createElement("div");p.className="ontology-heading";let g=t.createElement("h3");g.textContent=s;let m=t.createElement("span");m.className="ontology-count",m.textContent=`${c.length} defined`,p.append(g,m),d.append(p);let h=new Map(c.map(b=>[b.term.value,b])),w=new Map,R=b=>l==="class"?b.classParents:b.propertyParents;for(let b of c)for(let T of R(b)){let S=w.get(T.value)??[];S.some(D=>D.term.value===b.term.value)||S.push(b),w.set(T.value,S)}let E=b=>[...b].sort((T,S)=>(T.label??T.term.value).localeCompare(S.label??S.term.value));w.forEach((b,T)=>w.set(T,E(b)));let q=new Set,x=b=>this.#O(b),L=(b,T,S,D=!1)=>{let N=t.createElement("li");N.className="ontology-node";let P=t.createElement("div");P.className=`ontology-term-row${T?"":" ontology-context"}`,P.dataset.term=b.value;let H=t.createElement("div");if(H.className="ontology-term-copy",H.append(he(t,b,"","",void 0,n)),T?.label){let z=t.createElement("div");z.className="ontology-label",z.textContent=T.label,H.append(z)}let U=t.createElement("div");if(U.className="ontology-meta",T?D?U.textContent="Cycle reference":T.types.length&&(U.textContent=T.types.map(z=>O(z)).join(" \xB7 ")):U.textContent="External parent",U.textContent&&H.append(U),P.append(H),T){q.add(T.term.value);let z=bo(t,T,n);if(z){let F=t.createElement("div");F.className="ontology-actions",F.append(tt(t,z,"ontology-locate-button",x)),P.append(F),r.push({item:P,target:z})}}if(N.append(P),D)return N;let Z=w.get(b.value)??[];if(Z.length){let z=t.createElement("ul");z.className="ontology-children";let F=new Set(S);F.add(b.value);for(let Y of Z)z.append(L(Y.term,Y,F,F.has(Y.term.value)));N.append(z)}return N},k=t.createElement("ul");k.className="ontology-tree";let u=new Map;for(let b of c)for(let T of R(b))h.has(T.value)||u.set(T.value,T);for(let b of Array.from(u.values()).sort((T,S)=>T.value.localeCompare(S.value)))k.append(L(b,null,new Set));let v=E(c.filter(b=>R(b).length===0));for(let b of v)k.append(L(b.term,b,new Set));for(let b of c)q.has(b.term.value)||k.append(L(b.term,b,new Set));d.append(k),e.append(d)};i("Classes",this.#L.classes,"class"),i("Properties",this.#L.properties,"property"),this.#ht(r)}#ft(e){let t=this.ownerDocument,n=t.createElement("p");n.className="discovery-intro",n.textContent="Additional knowledge advertised by this document. Loading is explicit, sends no credentials or referrer, does not run scripts, and keeps the retrieved contribution in a separate named graph.",e.append(n);let r=t.createElement("ul");r.className="discovery-list";for(let a of this.#k){let i=this.#a.get(a.id),s=i?.status??"available",c=t.createElement("li");c.className="discovery-item",c.dataset.candidateId=a.id;let l=t.createElement("div");l.className="discovery-copy";let d=t.createElement("a");d.className="discovery-target",d.href=a.target.value,d.target="_blank",d.rel="noopener noreferrer",d.textContent=a.target.value,d.title=`Open ${a.target.value} in a new tab`;let p=t.createElement("p");p.className="discovery-context",p.textContent=`About ${O(a.context)}`,l.append(d,p);let g=t.createElement("div");g.className="discovery-meta";for(let R of a.predicates){let E=t.createElement("span");E.className="discovery-chip",E.textContent=O(R),E.title=R.value,g.append(E)}for(let R of a.roles){let E=t.createElement("span");E.className="discovery-chip role",E.textContent=O(R),E.title=R.value,g.append(E)}if(a.graph){let R=t.createElement("span");R.className="discovery-chip",R.textContent=`graph ${O(a.graph)}`,g.append(R)}g.childElementCount&&l.append(g);let m=t.createElement("div");m.className="discovery-state";let h=t.createElement("span");if(h.className="discovery-status",h.dataset.state=s,i||(h.textContent="Available"),i?.status==="loading"&&(h.textContent="Retrieving HTML/RDF\u2026"),i?.status==="error"&&(h.textContent=i.message??"Retrieval failed."),i?.status==="loaded"){let R=i.contribution?.result.quads.length??0;h.textContent=`${R} statement${R===1?"":"s"} loaded`}let w=t.createElement("button");w.className="discovery-action",w.type="button",w.dataset.candidateId=a.id,w.dataset.state=s,i||(w.textContent="Load"),i?.status==="loading"&&(w.textContent="Cancel"),i?.status==="error"&&(w.textContent="Retry"),i?.status==="loaded"&&(w.textContent="Remove"),w.setAttribute("aria-describedby",`${a.id}-status`),h.id=`${a.id}-status`,w.addEventListener("click",()=>void this.#Qe(a)),m.append(h,w),c.append(l,m),r.append(c)}e.append(r)}#gt(e){let t=this.ownerDocument.createElement("p");t.className="sources-intro",t.textContent="Inspect one document at a time. Sources remain separate so blank nodes, bases, and document identity are not silently merged.";let n=this.ownerDocument.createElement("ul");n.className="source-list";for(let r of this.#r){let a=this.ownerDocument.createElement("li");a.className="source-item";let i=this.ownerDocument.createElement("label");i.className="source-option";let s=this.ownerDocument.createElement("input");s.className="source-input",s.type="radio",s.name="ia2-navigator-source",s.checked=r.id===this.#i,s.dataset.sourceId=r.id,s.addEventListener("change",()=>this.#Xe(r.id));let c=this.ownerDocument.createElement("span");c.className="source-copy";let l=this.ownerDocument.createElement("strong");l.className="source-title",l.textContent=r.label;let d=this.ownerDocument.createElement("span");d.className="source-url",d.textContent=r.url;let p=this.ownerDocument.createElement("span");p.className="source-access";let g=r.access==="direct"?"DOM correlation available":"Collected from an isolated frame; source locations are read-only";p.textContent=`${r.origin} \xB7 ${g}`,c.append(l,d,p);let m=this.ownerDocument.createElement("span");m.className="source-count",m.textContent=`${r.result.quads.length} statement${r.result.quads.length===1?"":"s"}`,i.append(s,c,m),a.append(i),n.append(a)}e.append(t,n)}#X(){let e=this.#ce();this.#h(),e&&queueMicrotask(()=>this.#le(e))}#bt(e,t){if(!t){let n=this.ownerDocument.createElement("span");n.className="sparql-unbound",n.textContent="\u2014",e.append(n);return}if(t.termType==="NamedNode"||t.termType==="BlankNode"){let n=this.#A.get(`${t.termType}:${t.value}`);if(t.termType==="BlankNode"&&!n){let i=this.ownerDocument.createElement("code");i.textContent=`_:${t.value}`,e.append(i);return}let r=this.ownerDocument.createElement("span");r.className="sparql-resource-term";let a=t.termType==="NamedNode"?this.ownerDocument.createElement("a"):this.ownerDocument.createElement("span");if(a.className="sparql-resource-label",a.textContent=n??wo(t.value),a instanceof HTMLAnchorElement){let i=qe(t.value),s=this.#n?.sourceDocumentIri??this.ownerDocument.URL,c=we(this.ownerDocument,t.value,s);a.dataset.semanticIri=t.value,a.href=this.#n?go(t.value,this.#n):t.value,c?(a.classList.add("local-term"),a.addEventListener("click",l=>this.#st(t.value,l))):(a.target="_blank",a.rel="noopener noreferrer"),a.title=t.value,a.setAttribute("aria-label",`${a.textContent} (${i})`)}else a.title=`_:${t.value}`;r.append(a),e.append(r);return}if(t.termType==="DefaultGraph"){let n=this.ownerDocument.createElement("code");n.textContent="default graph",e.append(n)}else if(t.termType==="Literal"){let n=this.ownerDocument.createElement("span");n.className="sparql-literal";let r=this.ownerDocument.createElement("span");r.className="sparql-literal-value",r.textContent=t.value||"Empty string";let a=t.language?`@${t.language}${t.direction?`--${t.direction}`:""}`:t.datatype&&t.datatype!==fe?`^^${O({termType:"NamedNode",value:t.datatype})}`:"";if(n.append(r),a){let i=this.ownerDocument.createElement("code");i.className="sparql-literal-qualifier",i.textContent=a,n.append(i)}e.append(n)}else{let n=this.ownerDocument.createElement("code");n.textContent=t.value,e.append(n)}}#vt(e,t,n){let r=this.ownerDocument.createElement("div");r.className="sparql-table-wrap";let a=this.ownerDocument.createElement("table");a.className="sparql-table";let i=a.createTHead().insertRow();for(let c of t){let l=this.ownerDocument.createElement("th");l.scope="col",l.textContent=`?${c}`,i.append(l)}let s=a.createTBody();for(let c of n){let l=s.insertRow();for(let d of t)this.#bt(l.insertCell(),c[d])}r.append(a),e.append(r)}#Pe(e,t,n,r){let a=this.ownerDocument.createElement("p");a.className="sparql-summary";let i=this.ownerDocument.createElement("div");i.className="sparql-result-body",e.append(a,i);let s=n.length>Pt[0],c=null,l=null,d=null,p=null;if(s){let m=this.ownerDocument.createElement("nav");m.className="sparql-pagination",m.setAttribute("aria-label","SPARQL result pages");let h=this.ownerDocument.createElement("label");h.className="sparql-page-size-label",h.append("Rows per page"),c=this.ownerDocument.createElement("select"),c.className="sparql-page-size";for(let w of Pt){let R=this.ownerDocument.createElement("option");R.value=String(w),R.textContent=String(w),R.selected=w===this.#S,c.append(R)}h.append(c),p=this.ownerDocument.createElement("p"),p.className="sparql-page-status",p.setAttribute("aria-live","polite"),l=this.ownerDocument.createElement("button"),l.className="sparql-page-button sparql-page-previous",l.type="button",l.textContent="Previous",d=this.ownerDocument.createElement("button"),d.className="sparql-page-button sparql-page-next",d.type="button",d.textContent="Next",m.append(h,p,l,d),e.append(m)}let g=()=>{let m=Math.max(1,Math.ceil(n.length/this.#S));this.#s=Math.min(Math.max(0,this.#s),m-1);let h=this.#s*this.#S,w=Math.min(h+this.#S,n.length);a.textContent=s?`Showing ${h+1} to ${w} of ${n.length} ${r}${n.length===1?"":"s"}`:`${n.length} ${r}${n.length===1?"":"s"}`,i.replaceChildren(),n.length&&this.#vt(i,t,n.slice(h,w)),p&&(p.textContent=`Page ${this.#s+1} of ${m}`),l&&(l.disabled=this.#s===0),d&&(d.disabled=this.#s===m-1)};c?.addEventListener("change",()=>{let m=this.#s*this.#S;this.#S=Number(c?.value)||It,this.#s=Math.floor(m/this.#S),g()}),l?.addEventListener("click",()=>{this.#s-=1,g()}),d?.addEventListener("click",()=>{this.#s+=1,g()}),g()}#he(e){if(e.className="sparql-output",this.#t.status==="idle"){let n=this.ownerDocument.createElement("p");n.className="sparql-status",n.textContent="Run the query to inspect its results.",e.append(n);return}if(this.#t.status==="running"){let n=this.ownerDocument.createElement("p");n.className="sparql-status",n.setAttribute("role","status"),n.textContent="Running locally\u2026",e.append(n);return}if(this.#t.status==="error"){let n=this.ownerDocument.createElement("p");n.className="sparql-status",n.dataset.state="error",n.setAttribute("role","alert"),n.textContent=this.#t.error||"The query could not be run.",e.append(n);return}let t=this.#t.result;if(t){if(t.kind==="ask"){let n=this.ownerDocument.createElement("p");n.className="sparql-summary",n.textContent="ASK result";let r=this.ownerDocument.createElement("p");r.className="sparql-boolean",r.textContent=String(t.value),e.append(n,r);return}if(t.kind==="bindings"){this.#Pe(e,t.variables,t.rows,"result");return}this.#Pe(e,["subject","predicate","object","graph"],t.quads,"statement")}}async#$e(){let e=this.#x.trim();if(!e||!this.#n||this.#t.status==="running")return;let t=++this.#b,n=this.#n;this.#s=0,this.#t={status:"running"},this.#X();try{let{executeSparql:r}=await import("./chunks/sparql-engine-FOALRXFP.js"),a=await r(e,n);if(t!==this.#b)return;this.#t={result:a,status:"success"},this.#g=Ut(a,this.#A)}catch(r){if(t!==this.#b)return;this.#t={error:r instanceof Error?r.message:"The query could not be run.",status:"error"},this.#g=""}this.#X()}#wt(e){let t=this.ownerDocument.createElement("div");t.className="sparql-workbench";let n=this.ownerDocument.createElement("p");if(n.className="sparql-intro",n.textContent=this.#f.length?"Choose a query suggested by this document or write your own. Suggestions are RDF resources, not Navigator configuration.":"Write a SPARQL query against the RDF currently extracted from this document.",t.append(n),this.#Z.length>0){let E=this.ownerDocument.createElement("p");E.className="sparql-status",E.dataset.state="error",E.setAttribute("role","alert"),E.textContent=this.#Z.join(" "),t.append(E)}if(this.#f.length){let E=this.ownerDocument.createElement("div");E.className="sparql-catalog";let q=this.ownerDocument.createElement("label");q.className="sparql-label",q.htmlFor="ia2-sparql-suggestion",q.textContent="Suggested query";let x=this.ownerDocument.createElement("select");x.id="ia2-sparql-suggestion",x.className="sparql-select sparql-suggestion";let L=this.ownerDocument.createElement("option");L.value="",L.textContent="Custom query",x.append(L);for(let u of this.#f){let v=this.ownerDocument.createElement("option");v.value=u.id,v.textContent=u.label,v.selected=u.id===this.#w,x.append(v)}x.addEventListener("change",()=>{this.#w=x.value;let u=this.#f.find(({id:v})=>v===x.value);u?this.#x=u.query:this.#x=Ze,this.#s=0,this.#t={status:"idle"},this.#g="",this.#X()}),E.append(q,x);let k=this.ownerDocument.createElement("p");k.className="sparql-description",k.textContent=this.#f.find(({id:u})=>u===this.#w)?.description??"",E.append(k),t.append(E)}let r=this.ownerDocument.createElement("label");r.className="sparql-catalog";let a=this.ownerDocument.createElement("span");a.className="sparql-label",a.textContent="SPARQL query";let i=this.ownerDocument.createElement("div");i.className="sparql-editor-shell";let s=pe(this.#x,"sparql",this.ownerDocument);s.className="sparql-highlight",s.setAttribute("aria-hidden","true");let c=this.ownerDocument.createElement("textarea");c.className="sparql-editor",c.autocapitalize="off",c.autocomplete="off",c.spellcheck=!1,c.wrap="soft",c.value=this.#x,c.setAttribute("aria-keyshortcuts","Control+Enter Meta+Enter");let l=()=>{let E=pe(c.value,"sparql",this.ownerDocument);s.replaceChildren(...E.childNodes),s.scrollTop=c.scrollTop};c.addEventListener("input",()=>{if(this.#x=c.value,l(),this.#f.find(({id:q})=>q===this.#w)?.query!==c.value){this.#w="";let q=t.querySelector(".sparql-suggestion");q&&(q.value="");let x=t.querySelector(".sparql-description");x&&(x.textContent="")}if(this.#t.status!=="idle"){this.#b+=1,this.#s=0,this.#t={status:"idle"},this.#g="";let q=t.querySelector(".sparql-output");q&&(q.replaceChildren(),this.#he(q))}}),c.addEventListener("scroll",()=>{s.scrollTop=c.scrollTop,c.scrollLeft=0}),c.addEventListener("keydown",E=>{E.key!=="Enter"||!E.ctrlKey&&!E.metaKey||(E.preventDefault(),this.#$e())}),i.append(s,c),r.append(a,i),t.append(r);let d=this.ownerDocument.createElement("div");d.className="sparql-actions";let p=this.ownerDocument.createElement("button");p.className="sparql-run",p.type="button",p.disabled=this.#t.status==="running",p.textContent=this.#t.status==="running"?"Running\u2026":"Run query",p.addEventListener("click",()=>void this.#$e());let g=this.ownerDocument.createElement("button");g.className="sparql-reset",g.type="button",g.textContent="Reset",g.addEventListener("click",()=>{this.#w="",this.#x=Ze,this.#b+=1,this.#s=0,this.#t={status:"idle"},this.#g="",this.#X()});let m=this.ownerDocument.createElement("label");m.className="sparql-observe";let h=this.ownerDocument.createElement("input");h.className="sparql-observe-input",h.type="checkbox",h.checked=this.#V,h.addEventListener("change",()=>{this.#V=h.checked,this.#V&&this.#Me()}),m.append(h,"Observe changes");let w=this.ownerDocument.createElement("p");w.className="sparql-safety",w.textContent="Local dataset \xB7 Read-only",d.append(p,g,m,w),t.append(d);let R=this.ownerDocument.createElement("section");R.setAttribute("aria-label","SPARQL results"),R.setAttribute("aria-live","polite"),this.#he(R),t.append(R),e.append(t)}#h(){this.#Y(),this.#ue(),this.#ie(),this.#F(),this.#K=null,this.#G(),this.#re(),this.#N?.disconnect(),this.#N=null,this.#E?.disconnect(),this.#E=null,this.#Q=[],this.#oe=!1;let e=this.#n;if(!e||!this.shadowRoot)return;this.#e==="diagnostics"&&!e.diagnostics.length&&(this.#e="navigator"),this.#e==="discovery"&&!this.#k.length&&(this.#e="navigator"),this.#e==="vocabulary"&&!this.#L.count&&(this.#e="navigator"),this.#e==="shapes"&&!this.#v.count&&(this.#e="navigator"),this.#e==="sources"&&this.#r.length<=1&&(this.#e="navigator");let t=this.#r.find(p=>p.id===this.#i)??this.#r[0],n=this.#Ne();this.shadowRoot.innerHTML=`
      <style>${_n}</style>
      <button class="launcher" type="button" data-position="${this.#c}" aria-expanded="${this.#o}" aria-controls="ia2-rdf-panel" title="Open RDF Navigator. Drag to move."${this.hasAttribute("data-ia2-extension")?" hidden":""}>
        <span class="mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="2.6" fill="currentColor"/><circle cx="18.5" cy="5" r="2.6" fill="currentColor"/><circle cx="18.5" cy="19" r="2.6" fill="currentColor"/><path d="M7.2 10.8 16 6.2M7.2 13.2 16 17.8" stroke="currentColor" stroke-width="1.8"/></svg></span>
        <span>RDF</span><span class="count">${n}</span>
      </button>
      <aside class="panel ia2-window-surface" id="ia2-rdf-panel" data-open="${this.#o}" data-position="${this.#c}" aria-label="Document RDF" tabindex="-1">
        <header class="toolbar">
          <span class="drag-grip" aria-hidden="true" title="Drag floating navigator"><svg viewBox="0 0 8 18"><circle cx="2" cy="4" r="1.2"/><circle cx="6" cy="4" r="1.2"/><circle cx="2" cy="9" r="1.2"/><circle cx="6" cy="9" r="1.2"/><circle cx="2" cy="14" r="1.2"/><circle cx="6" cy="14" r="1.2"/></svg></span>
          <div class="tabs" role="tablist" aria-label="RDF views" data-compact="0">
            ${ae("navigator",this.#e==="navigator","Navigator","Nav")}
            ${this.#r.length>1?ae("sources",this.#e==="sources","Sources","Sources",this.#r.length,"document"):""}
            ${this.#L.count?ae("vocabulary",this.#e==="vocabulary","Vocabulary","Vocab",this.#L.count,"definition"):""}
            ${this.#v.count?ae("shapes",this.#e==="shapes","Shapes","Shapes",this.#v.count,"shape"):""}
            ${this.#k.length?ae("discovery",this.#e==="discovery","Discovery","Discover",this.#k.length,"candidate"):""}
            ${ae("sparql",this.#e==="sparql","SPARQL","Query",this.#f.length||void 0,"suggested query")}
            ${ae("turtle",this.#e==="turtle","Turtle","TTL")}
            ${ae("json",this.#e==="json","JSON-LD","JSON")}
            ${e.diagnostics.length?ae("diagnostics",this.#e==="diagnostics","Diagnostics","Issues",e.diagnostics.length,"diagnostic"):""}
          </div>
          <div class="header-actions">
            ${gt({ariaLabel:"Drawer position",current:this.#c,groupClass:"position-switch",optionClass:"position-option"})}
            <button class="icon-button refresh" type="button" aria-label="Refresh extraction" title="Refresh extraction">\u21BB</button><button class="icon-button close" type="button" aria-label="Close RDF Navigator" title="Close">\xD7</button>
          </div>
        </header>
        <section class="viewport" role="tabpanel" tabindex="0"></section>
        <footer class="footer"><span>RDF 1.2 \xB7 ${t?.label??"Document"}</span>${this.#e==="turtle"||this.#e==="json"?'<button class="copy" type="button">Copy view</button>':""}</footer>
        <div class="resize-handles" aria-hidden="true">
          ${["n","ne","e","se","s","sw","w","nw"].map(p=>`<span class="resize-handle" data-resize="${p}"></span>`).join("")}
        </div>
        <p class="sr-only" aria-live="polite">${this.#T}</p>
      </aside>`;let r=this.shadowRoot.querySelector(".viewport"),a=this.shadowRoot.querySelector(".tabs");if(this.#je(a),!r)return;if(this.#o&&this.#e==="turtle"&&r.append(pe(ge(e),"turtle",document)),this.#o&&this.#e==="json"){if(ze(e)){let p=document.createElement("p");p.className="notice",p.textContent="JSON-LD 1.1 has no native RDF 1.2 triple-term syntax. This view preserves triple terms as typed JSON literals; use Turtle for the semantic form.",r.append(p)}r.append(pe(be(e),"json",document))}this.#o&&this.#e==="navigator"&&this.#dt(r,e),this.#o&&this.#e==="sources"&&this.#gt(r),this.#o&&this.#e==="vocabulary"&&this.#mt(r),this.#o&&this.#e==="shapes"&&this.#pt(r),this.#o&&this.#e==="discovery"&&this.#ft(r),this.#o&&this.#e==="sparql"&&this.#wt(r),this.#o&&this.#e==="diagnostics"&&this.#ut(r,e.diagnostics),this.#oe=this.#o;let i=this.shadowRoot.querySelector(".launcher");i&&(this.#_(i),i.addEventListener("pointerdown",p=>this.#rt(p,i)),i.addEventListener("click",p=>{if(this.#B){p.preventDefault(),this.#B=!1;return}this.toggle(p instanceof MouseEvent&&p.detail!==0?"panel":"tab")})),this.shadowRoot.querySelector(".close")?.addEventListener("click",()=>this.close()),this.shadowRoot.querySelector(".refresh")?.addEventListener("click",()=>this.refresh());let s=this.shadowRoot.querySelector(".position-switch"),c=Array.from(this.shadowRoot.querySelectorAll(".position-option")),l=this.shadowRoot.querySelector(".panel"),d=(p,g=!1)=>{this.#c=p;let m=this.shadowRoot?.querySelector(".launcher");l&&(l.dataset.position=this.#c,p==="floating"?this.#j(l):this.#nt(l)),m&&(m.dataset.position=this.#c,this.#_(m));for(let h of c){let w=h.dataset.position===this.#c;h.setAttribute("aria-checked",String(w)),h.tabIndex=w?0:-1,w&&g&&h.focus()}this.#D()};if(l){this.#c==="floating"&&this.#j(l);let p=l.querySelector(".toolbar"),g=p?.querySelector(".tabs");p?.addEventListener("pointerdown",m=>{let h=m.target instanceof Element?m.target:null;h!==p&&h!==g&&!h?.closest(".drag-grip")||this.#De(m,l)}),l.querySelectorAll(".resize-handle").forEach(m=>{m.addEventListener("pointerdown",h=>{this.#De(h,l,m.dataset.resize)})})}s&&bt(s,(p,g)=>{d(p,g)}),this.shadowRoot.querySelector(".copy")?.addEventListener("click",()=>void this.#it()),this.shadowRoot.querySelectorAll("[data-view]").forEach(p=>{p.addEventListener("click",()=>this.#at(p.dataset.view))}),this.#Ue()}};customElements.get("ia2-rdf-navigator")||customElements.define("ia2-rdf-navigator",xe);function Mo(o=document){let e=o.querySelector("ia2-rdf-navigator");if(e)return e;let t=o.createElement("ia2-rdf-navigator");return o.body.append(t),t}function Qt(){window.__IA2_RDF_NAVIGATOR_NO_AUTO__||Mo()}typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Qt,{once:!0}):Qt());export{ut as DISCOVERY_PREDICATES,xe as Ia2RdfNavigator,_e as detectDiscoveryCandidates,de as extractDataset,Je as extractDocumentVocabulary,Ge as extractShaclCatalog,qn as extractSuggestedSparqlQueries,Re as extractSuggestedSparqlQueryCatalog,Ue as fromPortableExtractionResult,Oe as mergeDiscoveryContributions,Mo as mountRdfNavigator,be as serializeJsonLd,ge as serializeTurtle,st as termToTurtle,gn as toPortableExtractionResult};
