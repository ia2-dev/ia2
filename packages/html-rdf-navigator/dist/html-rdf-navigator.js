import{c as Ae,d as ue,e as se,f as Ie,g as rt,h as he,i as me,j as $e,k as j,l as we,m as Z,n as Pe,o as at}from"./chunks/chunk-37NUEJFD.js";var Wt="http://www.w3.org/2000/01/rdf-schema#seeAlso",Kt="http://www.w3.org/2000/01/rdf-schema#isDefinedBy",Qt="http://purl.org/dc/terms/requires",Gt="http://purl.org/dc/terms/source",Yt="http://www.w3.org/ns/prov#wasDerivedFrom",Xt="http://www.w3.org/2002/07/owl#imports",Jt="http://www.w3.org/ns/dcat#qualifiedRelation",Zt="http://purl.org/dc/terms/relation",en="http://www.w3.org/ns/dcat#hadRole",lt=new Set([Wt,Kt,Qt,Gt,Yt,Xt]);function ee(o){return o?`${o.termType}:${o.value}`:"default"}function it(o,e){return ee(o)===ee(e)}function st(o){try{let e=new URL(o);return e.hash="",e.href}catch{return o.replace(/#.*$/s,"")}}function tn(o){let e=2166136261;for(let t=0;t<o.length;t+=1)e^=o.charCodeAt(t),e=Math.imul(e,16777619);return`discovery-${(e>>>0).toString(36)}`}function ct(o,e){o.some(t=>t.value===e.value)||o.push(e)}function nn(o,e){o.some(t=>ee(t)===ee(e))||o.push(e)}function xe(o,e){o.includes(e)||o.push(e)}function ze(o){let e=new Map,t=st(o.sourceDocumentIri),n=(r,a,i)=>{if(st(a.value)===t)return null;let s=`${ee(r)}|${ee(i)}|${a.value}`,c=e.get(s);return c||(c={context:r,graph:i,id:tn(s),predicates:[],qualifiedRelationships:[],roles:[],sources:[],target:a},e.set(s,c)),c};for(let r of o.quads){if(!lt.has(r.predicate.value)||r.object.termType!=="NamedNode")continue;let a=n(r.subject,r.object,r.graph);a&&(ct(a.predicates,r.predicate),xe(a.sources,r.source))}for(let r of o.quads){if(r.predicate.value!==Jt||r.object.termType!=="NamedNode"&&r.object.termType!=="BlankNode")continue;let a=r.object,i=o.quads.filter(l=>it(l.subject,a)&&it(l.graph,r.graph)),s=i.filter(l=>l.predicate.value===Zt&&l.object.termType==="NamedNode"),c=i.filter(l=>l.predicate.value===en&&l.object.termType==="NamedNode");for(let l of s){if(l.object.termType!=="NamedNode")continue;let d=n(r.subject,l.object,r.graph);if(d){nn(d.qualifiedRelationships,a),xe(d.sources,r.source),xe(d.sources,l.source);for(let p of c)p.object.termType==="NamedNode"&&(ct(d.roles,p.object),xe(d.sources,p.source))}}}return Array.from(e.values()).sort((r,a)=>r.target.value.localeCompare(a.target.value))}function He(o,e){let t=[...o.quads],n=new Map(o.graphs.map(a=>[ee(a),a])),r=[...o.diagnostics];for(let a of e){let i=Ae(a.result.sourceDocumentIri);for(let s of a.result.quads){let c=s.graph??i;t.push({...s,graph:c}),n.set(ee(c),c)}for(let s of a.result.graphs)n.set(ee(s),s);r.push(...a.result.diagnostics.map(s=>({...s,message:`Contribution ${a.result.sourceDocumentIri}: ${s.message}`})))}return{...o,diagnostics:r,graphs:Array.from(n.values()),quads:t}}function W(o){return o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var je=[{position:"right",label:"Right, full height",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M13 2h5v12h-5z"/></svg>'},{position:"right-top",label:"Right, top half",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M13 2h5v5.5h-5z"/></svg>'},{position:"right-bottom",label:"Right, bottom half",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M13 8.5h5V14h-5z"/></svg>'},{position:"bottom",label:"Bottom, full width",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 9h16v5H2z"/></svg>'},{position:"floating",label:"Floating, centered",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><rect class="position-region" x="5" y="4.5" width="10" height="7" rx="1"/></svg>'},{position:"top",label:"Top, full width",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 2h16v5H2z"/></svg>'},{position:"left",label:"Left, full height",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 2h5v12H2z"/></svg>'},{position:"left-bottom",label:"Left, bottom half",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 8.5h5V14H2z"/></svg>'},{position:"left-top",label:"Left, top half",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 2h5v5.5H2z"/></svg>'}],ut=`
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
`;function ye(o){return typeof o=="string"&&je.some(({position:e})=>e===o)}function ht({allowed:o=je.map(({position:a})=>a),ariaLabel:e,current:t,groupClass:n="",optionClass:r=""}){let a=W(n),i=W(r),s=new Set(o),c=je.filter(({position:l})=>s.has(l)).map(({icon:l,label:d,position:p})=>`<button class="ia2-position-option ${i}" type="button" role="radio" data-position="${p}" aria-checked="${t===p}" aria-label="${W(d)}" title="${W(d)}" tabindex="${t===p?"0":"-1"}">${l}</button>`).join("");return`<div class="ia2-position-switch ${a}" role="radiogroup" aria-label="${W(e)}">${c}</div>`}function dt(o,e,t=!1){let n=Array.from(o.querySelectorAll(".ia2-position-option"));for(let r of n){let a=r.dataset.position===e;r.setAttribute("aria-checked",String(a)),r.tabIndex=a?0:-1,a&&t&&r.focus()}}function mt(o,e){let t=o instanceof HTMLElement&&o.matches(".ia2-position-switch")?o:o.querySelector(".ia2-position-switch"),n=Array.from(o.querySelectorAll(".ia2-position-option")),r=[];for(let i of n){let s=()=>{ye(i.dataset.position)&&e(i.dataset.position,!1)!==!1&&dt(o,i.dataset.position)};i.addEventListener("click",s),r.push(()=>i.removeEventListener("click",s))}let a=i=>{if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(i.key))return;i.preventDefault();let s=i.target instanceof HTMLButtonElement?n.indexOf(i.target):n.findIndex(d=>d.getAttribute("aria-checked")==="true"),c=s;i.key==="Home"&&(c=0),i.key==="End"&&(c=n.length-1),(i.key==="ArrowRight"||i.key==="ArrowDown")&&(c=(s+1)%n.length),(i.key==="ArrowLeft"||i.key==="ArrowUp")&&(c=(s-1+n.length)%n.length);let l=n[c]?.dataset.position;ye(l)&&e(l,!0)!==!1&&dt(o,l,!0)};return t?.addEventListener("keydown",a),r.push(()=>t?.removeEventListener("keydown",a)),()=>{for(let i of r)i()}}var ft=[{mode:"off",label:"Scroll synchronization off",icon:`<svg class="sync-icon" viewBox="0 0 32 16" aria-hidden="true" focusable="false">
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
    </svg>`}];function pt(o){return typeof o=="string"&&ft.some(({mode:e})=>e===o)}function gt({ariaLabel:o="Scroll synchronization",controlClass:e="",current:t,label:n="Sync",labels:r={},optionClass:a="",switchClass:i=""}){let s=W(e),c=W(a),l=W(i),d=ft.map(({icon:p,label:b,mode:h})=>{let u=r[h]??b;return`<button class="ia2-sync-option ${c}" type="button" role="radio" data-sync-mode="${h}" aria-checked="${t===h}" aria-label="${W(u)}" title="${W(u)}" tabindex="${t===h?"0":"-1"}">${p}</button>`}).join("");return`<div class="ia2-sync-control ${s}"><span class="ia2-sync-label sync-label">${W(n)}</span><div class="ia2-sync-switch ${l}" role="radiogroup" aria-label="${W(o)}">${d}</div></div>`}function Ee(o,e,t=!1){let n=Array.from(o.querySelectorAll(".ia2-sync-option"));for(let r of n){let a=r.dataset.syncMode===e;r.setAttribute("aria-checked",String(a)),r.tabIndex=a?0:-1,a&&t&&r.focus()}}function bt(o,e){let t=o instanceof HTMLElement&&o.matches(".ia2-sync-switch")?o:o.querySelector(".ia2-sync-switch"),n=Array.from(o.querySelectorAll(".ia2-sync-option")),r=[];for(let i of n){let s=()=>{pt(i.dataset.syncMode)&&e(i.dataset.syncMode,!1)!==!1&&Ee(o,i.dataset.syncMode)};i.addEventListener("click",s),r.push(()=>i.removeEventListener("click",s))}let a=i=>{if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(i.key))return;i.preventDefault();let s=i.target instanceof HTMLButtonElement?n.indexOf(i.target):n.findIndex(d=>d.getAttribute("aria-checked")==="true"),c=s;i.key==="Home"&&(c=0),i.key==="End"&&(c=n.length-1),(i.key==="ArrowRight"||i.key==="ArrowDown")&&(c=(s+1)%n.length),(i.key==="ArrowLeft"||i.key==="ArrowUp")&&(c=(s-1+n.length)%n.length);let l=n[c]?.dataset.syncMode;pt(l)&&e(l,!0)!==!1&&Ee(o,l,!0)};return t?.addEventListener("keydown",a),r.push(()=>t?.removeEventListener("keydown",a)),()=>{for(let i of r)i()}}var on=/(<https?:\/\/[^>]+>)|("(?:\\.|[^"\\])*"(?:@[A-Za-z0-9-]+(?:--(?:ltr|rtl))?|\^\^(?:<[^>]+>|[A-Za-z][\w-]*:[\w.-]+))?)|(^|\s)(@[a-z]+|[A-Za-z][\w-]*:[\w.-]+)|(_:[A-Za-z][\w-]*)|(#[^\n]*)/gim,rn=/("(?:\\.|[^"\\])*")\s*(?=:)|("(?:\\.|[^"\\])*")|\b(true|false|null)\b|\b(-?\d+(?:\.\d+)?)\b/g,an=/(#[^\n\r]*)|("""(?:\\.|[\s\S])*?"""|'''(?:\\.|[\s\S])*?'''|"(?:\\.|[^"\\])*"(?:@[A-Za-z0-9-]+|\^\^(?:<[^>]+>|[A-Za-z][\w-]*:[\w.-]+))?|'(?:\\.|[^'\\])*'(?:@[A-Za-z0-9-]+|\^\^(?:<[^>]+>|[A-Za-z][\w-]*:[\w.-]+))?)|(<[^<>"{}|^`\\\u0000-\u0020]*>)|([?$][A-Za-z_][\w-]*)|\b(ADD|ALL|AS|ASC|ASK|BASE|BIND|BY|CLEAR|CONSTRUCT|COPY|CREATE|DATA|DEFAULT|DELETE|DESC|DESCRIBE|DISTINCT|DROP|EXISTS|FILTER|FROM|GRAPH|GROUP|HAVING|IN|INSERT|LIMIT|LOAD|MINUS|MOVE|NAMED|NOT|OFFSET|OPTIONAL|ORDER|PREFIX|REDUCED|SELECT|SERVICE|SILENT|TO|UNDEF|UNION|USING|VALUES|WHERE|WITH|TRUE|FALSE|A)\b|(\b-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?\b)|((?:[A-Za-z_][\w-]*)?:[\w.-]*)|([{}()[\];,.])/gim;function te(o,e,t,n){let r=n.createElement("span");r.className=`tok ${t}`,r.textContent=e,o.appendChild(r)}function sn(o,e,t,n){if(t==="iri"){let r=e.slice(1,-1),a=n.createElement("a");a.className="tok iri",a.textContent=e,a.href=r,a.target="_blank",a.rel="noopener noreferrer",o.appendChild(a);return}te(o,e,t,n)}function cn(o){return o[1]?"iri":o[2]?"string":o[4]?"keyword":o[5]?"blank":o[6]?"comment":"name"}function ln(o){if(o[1])return"key";if(o[2]){try{let e=JSON.parse(o[2]);if(/^https?:\/\//.test(e))return"json-iri"}catch{}return"string"}return o[3]?"keyword":"number"}function dn(o){return o[1]?"comment":o[2]?"string":o[3]?"iri":o[4]?"variable":o[5]?"keyword":o[6]?"number":o[7]?"name":"punctuation"}function vt(o,e,t){if(e.startsWith("<!--")){te(o,e,"comment",t);return}if(/^<!doctype/i.test(e)){te(o,e,"keyword",t);return}let n=/^(<\/?)([^\s/>]+)([\s\S]*?)(\/?>)$/.exec(e);if(!n){o.appendChild(t.createTextNode(e));return}te(o,n[1],"punctuation",t),te(o,n[2],"name",t);let r=n[3]??"",a=/(\s+)([^\s=]+)(?:(\s*=\s*)("[^"]*"|'[^']*'|[^\s]+))?/g,i=0,s;for(;s=a.exec(r);)o.appendChild(t.createTextNode(r.slice(i,s.index)+s[1])),te(o,s[2],"key",t),s[3]&&o.appendChild(t.createTextNode(s[3])),s[4]&&te(o,s[4],"string",t),i=a.lastIndex;o.appendChild(t.createTextNode(r.slice(i))),te(o,n[4],"punctuation",t)}function pn(o,e,t){let n=0;for(;n<o.length;){let r=o.indexOf("<",n);if(r<0){e.appendChild(t.createTextNode(o.slice(n)));return}if(e.appendChild(t.createTextNode(o.slice(n,r))),o.startsWith("<!--",r)){let s=o.indexOf("-->",r+4),c=s<0?o.length:s+3;vt(e,o.slice(r,c),t),n=c;continue}let a="",i=r+1;for(;i<o.length;i+=1){let s=o[i];if(a)s===a&&(a="");else if(s==='"'||s==="'")a=s;else if(s===">"){i+=1;break}}vt(e,o.slice(r,i),t),n=i}}function ce(o,e,t){let n=t.createElement("pre"),r=t.createElement("code");if(n.append(r),e==="html")return pn(o,r,t),n;let a=e==="turtle"?new RegExp(on):e==="sparql"?new RegExp(an):new RegExp(rn),i=0,s;for(;s=a.exec(o);){r.append(t.createTextNode(o.slice(i,s.index)));let c=e==="turtle"?cn(s):e==="sparql"?dn(s):ln(s);if(c==="json-iri"){let l=t.createElement("a");l.className="tok iri",l.textContent=s[0],l.href=JSON.parse(s[0]),l.target="_blank",l.rel="noopener noreferrer",r.append(l)}else e==="sparql"&&c==="iri"?te(r,s[0],c,t):sn(r,s[0],c,t);i=a.lastIndex}return r.append(t.createTextNode(o.slice(i))),n}function wt(o,e,t){let n=e.get(o);if(n)return n;let r=`source-${e.size+1}`;return e.set(o,r),t.push({id:r,markup:o.outerHTML}),r}function un(o){let e=new Map,t=[];return{baseIri:o.baseIri,diagnostics:o.diagnostics.map(n=>({code:n.code,message:n.message,severity:n.severity,...n.source?{sourceId:wt(n.source,e,t)}:{}})),graphs:o.graphs,portableVersion:1,quads:o.quads.map(n=>({graph:n.graph,object:n.object,predicate:n.predicate,sourceId:wt(n.source,e,t),subject:n.subject})),retrievalDocumentIri:o.retrievalDocumentIri,sourceDocumentIri:o.sourceDocumentIri,sources:t,version:"1.2"}}function xt(o,e){let t=e.implementation.createHTMLDocument(""),n=t.createElement("template");return n.innerHTML=o,n.content.firstElementChild??t.createElement("span")}function _e(o,e){if(o.portableVersion!==1||o.version!=="1.2")throw new Error("Unsupported portable Navigator source version.");let t=new Map(o.sources.map(r=>[r.id,xt(r.markup,e)])),n=r=>t.get(r)??xt("<span></span>",e);return{baseIri:o.baseIri,diagnostics:o.diagnostics.map(r=>({code:r.code,message:r.message,severity:r.severity,...r.sourceId?{source:n(r.sourceId)}:{}})),graphs:o.graphs,quads:o.quads.map(r=>({graph:r.graph,object:r.object,predicate:r.predicate,source:n(r.sourceId),subject:r.subject})),retrievalDocumentIri:o.retrievalDocumentIri,sourceDocumentIri:o.sourceDocumentIri,version:"1.2"}}var hn="http://www.w3.org/1999/02/22-rdf-syntax-ns#type",U="http://www.w3.org/ns/shacl#",mn=`${U}NodeShape`,fn=`${U}PropertyShape`,gn=`${U}PropertyGroup`,Lt=`${U}name`,Tt=`${U}description`,Ue=`${U}order`,Ve=`${U}group`,Se=`${U}path`,Be=`${U}property`,bn=new Set([`${U}node`,`${U}not`,`${U}qualifiedValueShape`]),yt=[Lt,"http://purl.org/dc/terms/title","http://www.w3.org/2000/01/rdf-schema#label","http://www.w3.org/2004/02/skos/core#prefLabel","https://schema.org/name"],vn=[Tt,"http://purl.org/dc/terms/description","http://www.w3.org/2000/01/rdf-schema#comment","https://schema.org/description"],wn=new Set([Lt,Tt,Ue,Ve,Se,Be]);function oe(o){return o.termType==="NamedNode"||o.termType==="BlankNode"?`${o.termType}:${o.value}`:null}function Oe(o){return o.termType==="NamedNode"||o.termType==="BlankNode"?o:null}function xn(o,e){let t=oe(e);o.some(n=>oe(n)===t)||o.push(e)}function yn(o,e){o.includes(e)||o.push(e)}function En(o,e){for(let t of e){let n=o.find(r=>r.predicate.value===t)?.object;if(n?.termType==="Literal")return n.value}}function Et(o,e){let t=o.find(r=>r.predicate.value===e)?.object;if(t?.termType!=="Literal")return;let n=Number(t.value);return Number.isFinite(n)?n:void 0}function Fe(o){return o===`${U}target`||o.startsWith(`${U}target`)}function St(o){if(o.termType==="BlankNode")return`Blank node ${o.value}`;try{let e=new URL(o.value),t=decodeURIComponent(e.hash.slice(1));if(t)return t;let n=e.pathname.split("/").filter(Boolean);return decodeURIComponent(n.at(-1)??o.value)}catch{return o.value}}function kt(o,e){let t=o.order??Number.POSITIVE_INFINITY,n=e.order??Number.POSITIVE_INFINITY;return t!==n?t-n:(o.label??St(o.term)).localeCompare(e.label??St(e.term))}function We(o){let e=new Map,t=new Map,n=new Set,r=new Map,a=(c,l)=>{let d=oe(c);if(e.set(d,c),!l)return;let p=t.get(d);p||(p=new Set,t.set(d,p)),p.add(l)};for(let c of o.quads){let l=oe(c.subject);if(c.predicate.value===hn&&c.object.termType==="NamedNode"&&(c.object.value===mn&&a(c.subject,"node"),c.object.value===fn&&a(c.subject,"property"),c.object.value===gn&&r.set(l,c.subject)),Fe(c.predicate.value)&&a(c.subject),c.predicate.value===Se&&a(c.subject,"property"),c.predicate.value===Be){a(c.subject,"node");let d=Oe(c.object);d&&(a(d,"property"),n.add(oe(d)))}if(bn.has(c.predicate.value)){a(c.subject);let d=Oe(c.object);d&&a(d)}if(c.predicate.value===Ve){let d=Oe(c.object);d&&r.set(oe(d),d)}}let i=Array.from(e,([c,l])=>{let d=o.quads.filter(g=>oe(g.subject)===c),p=Array.from(t.get(c)??[]);p.length||p.push(n.has(c)||d.some(g=>g.predicate.value===Se)?"property":"node");let b=d.find(g=>g.predicate.value===Ve)?.object,h=[],u=[];for(let g of d)g.graph&&xn(h,g.graph),yn(u,g.source);let m=d.filter(g=>Fe(g.predicate.value)),x=d.filter(g=>g.predicate.value===Se),v=d.filter(g=>g.predicate.value===Be),M=d.filter(g=>g.predicate.value.startsWith(U)&&!wn.has(g.predicate.value)&&!Fe(g.predicate.value)),w=Z(o.quads,l,{predicates:yt}),y=En(d,vn),E=Et(d,Ue);return{constraints:M,graphs:h,kinds:p,paths:x,properties:v,quads:d,sources:u,targets:m,term:l,...y?{description:y}:{},...b&&(b.termType==="NamedNode"||b.termType==="BlankNode")?{group:b}:{},...w?{label:w}:{},...E!==void 0?{order:E}:{}}}).sort(kt),s=Array.from(r,([c,l])=>{let d=o.quads.filter(h=>oe(h.subject)===c),p=Z(o.quads,l,{predicates:yt}),b=Et(d,Ue);return{quads:d,term:l,...p?{label:p}:{},...b!==void 0?{order:b}:{}}}).sort(kt);return{count:i.length,groups:s,shapes:i}}var Sn="http://www.w3.org/1999/02/22-rdf-syntax-ns#type",kn="http://www.w3.org/2000/01/rdf-schema#comment",Ln="http://purl.org/dc/terms/description",Y="http://www.w3.org/ns/shacl#",Tn=new Set([`${Y}SPARQLExecutable`,`${Y}SPARQLSelectExecutable`,`${Y}SPARQLAskExecutable`,`${Y}SPARQLConstructExecutable`]),Rt=[{iri:`${Y}select`,kind:"select"},{iri:`${Y}ask`,kind:"ask"},{iri:`${Y}construct`,kind:"construct"}];function Mt(o){return`${o.termType}:${o.value}`}function Nt(o){if(o.termType==="BlankNode")return`Query ${o.value}`;let e=o.value.match(/[#/]([^#/]+)$/)?.[1];return e?decodeURIComponent(e).replace(/[-_]+/g," ").replace(/\b\w/g,t=>t.toUpperCase()):o.value}function Rn(o,e,t){if(o.termType==="NamedNode")return Mt(o);let n=2166136261;for(let r of`${e}
${t}`)n^=r.codePointAt(0)??0,n=Math.imul(n,16777619);return`BlankNodeQuery:${(n>>>0).toString(16)}`}function ke(o){let e=new Map,t=a=>{let i=Mt(a),s=e.get(i);return s||(s={executable:!1,queries:{},subject:a},e.set(i,s)),s};for(let a of o.quads){let i=t(a.subject);if(a.predicate.value===Sn&&a.object.termType==="NamedNode"&&Tn.has(a.object.value)&&(i.executable=!0),a.object.termType!=="Literal")continue;let s=Rt.find(({iri:c})=>c===a.predicate.value);if(s&&(i.queries[s.kind]=a.object.value.trim()),[Ln,kn,`${Y}description`].includes(a.predicate.value)&&(i.description??=a.object.value.trim()),a.predicate.value===`${Y}order`){let c=Number(a.object.value);Number.isFinite(c)&&(i.order=c)}}let n=[],r=Array.from(e.values()).flatMap(a=>{if(!a.executable)return[];let i=Rt.map(({kind:c})=>({kind:c,query:a.queries[c]})).filter(c=>!!c.query);if(i.length!==1)return n.push(`${Nt(a.subject)} must declare exactly one sh:select, sh:ask, or sh:construct query.`),[];let s=i[0];return[{description:a.description??"",id:Rn(a.subject,s.kind,s.query),kind:s.kind,label:Z(o.quads,a.subject,{predicates:[...we,`${Y}name`]})?.trim()||Nt(a.subject),order:a.order??Number.POSITIVE_INFINITY,query:s.query}]}).sort((a,i)=>a.order-i.order||a.label.localeCompare(i.label));return{diagnostics:n,queries:r}}function Nn(o){return ke(o).queries}var Mn="http://www.w3.org/1999/02/22-rdf-syntax-ns#type",Cn="http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",Dn="http://www.w3.org/2000/01/rdf-schema#Class",qn="http://www.w3.org/2000/01/rdf-schema#subClassOf",An="http://www.w3.org/2000/01/rdf-schema#subPropertyOf",In=new Set([Dn,"http://www.w3.org/2002/07/owl#Class","http://www.w3.org/2002/07/owl#DeprecatedClass"]),$n=new Set([Cn,"http://www.w3.org/2002/07/owl#ObjectProperty","http://www.w3.org/2002/07/owl#DatatypeProperty","http://www.w3.org/2002/07/owl#AnnotationProperty","http://www.w3.org/2002/07/owl#FunctionalProperty","http://www.w3.org/2002/07/owl#InverseFunctionalProperty","http://www.w3.org/2002/07/owl#TransitiveProperty","http://www.w3.org/2002/07/owl#SymmetricProperty","http://www.w3.org/2002/07/owl#AsymmetricProperty","http://www.w3.org/2002/07/owl#ReflexiveProperty","http://www.w3.org/2002/07/owl#IrreflexiveProperty","http://www.w3.org/2002/07/owl#DeprecatedProperty","http://www.w3.org/2002/07/owl#OntologyProperty"]);function Ke(o,e){o.some(t=>t.value===e.value)||o.push(e)}function Qe(o,e){o.includes(e)||o.push(e)}function Le(o,e){o.includes(e)||o.push(e)}function Ge(o){let e=new Map,t=i=>{let s=e.get(i.value);return s||(s={classParents:[],kinds:[],propertyParents:[],sources:[],term:i,types:[]},e.set(i.value,s)),s};for(let i of o.quads)if(i.subject.termType==="NamedNode"){if(i.predicate.value===Mn&&i.object.termType==="NamedNode"){let s=In.has(i.object.value),c=$n.has(i.object.value);if(!s&&!c)continue;let l=t(i.subject);s&&Le(l.kinds,"class"),c&&Le(l.kinds,"property"),Ke(l.types,i.object),Qe(l.sources,i.source);continue}if(i.predicate.value===qn){let s=t(i.subject);Le(s.kinds,"class"),i.object.termType==="NamedNode"&&Ke(s.classParents,i.object),Qe(s.sources,i.source);continue}if(i.predicate.value===An){let s=t(i.subject);Le(s.kinds,"property"),i.object.termType==="NamedNode"&&Ke(s.propertyParents,i.object),Qe(s.sources,i.source)}}let n=Array.from(e.values()).map(i=>{let s=Z(o.quads,i.term);return{...i,...s?{label:s}:{}}}).sort((i,s)=>(i.label??i.term.value).localeCompare(s.label??s.term.value)),r=n.filter(i=>i.kinds.includes("class")),a=n.filter(i=>i.kinds.includes("property"));return{classes:r,count:n.length,definitions:n,properties:a}}var Pn=String.raw`
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
  ${ut}
`,zn={navigator:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><circle cx="3" cy="5" r=".8" fill="currentColor" stroke="none"/><circle cx="3" cy="9" r=".8" fill="currentColor" stroke="none"/><circle cx="3" cy="13" r=".8" fill="currentColor" stroke="none"/><path d="M6 5h9M6 9h9M6 13h9"/></svg>',sources:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><rect x="2.5" y="3" width="13" height="9" rx="1.5"/><path d="M6 15h6M9 12v3"/></svg>',vocabulary:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><circle cx="9" cy="3.5" r="2"/><circle cx="4" cy="14" r="2"/><circle cx="14" cy="14" r="2"/><path d="M9 5.5v3M4 12V9h10v3"/></svg>',shapes:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M3 3.5h5v5H3zM10 9.5h5v5h-5zM8 6h3v3.5"/><path d="m4.3 11.8 1.3 1.3 2.6-3"/></svg>',discovery:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><circle cx="9" cy="9" r="6.5"/><path d="m11.7 6.3-1.5 3.9-3.9 1.5 1.5-3.9z"/></svg>',sparql:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M3 4.5h8M3 9h6M3 13.5h5"/><circle cx="13" cy="12" r="3"/><path d="m15.2 14.2 1.5 1.5"/></svg>',turtle:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="m6.5 4.5-4 4.5 4 4.5M11.5 4.5l4 4.5-4 4.5"/></svg>',json:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M7 3.5H5.5c-1 0-1.5.5-1.5 1.5v2c0 1-.5 1.5-1.5 2 1 .5 1.5 1 1.5 2v2c0 1 .5 1.5 1.5 1.5H7M11 3.5h1.5c1 0 1.5.5 1.5 1.5v2c0 1 .5 1.5 1.5 2-1 .5-1.5 1-1.5 2v2c0 1-.5 1.5-1.5 1.5H11"/></svg>',diagnostics:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M8 3.2 2.3 13a1.2 1.2 0 0 0 1 1.8h11.4a1.2 1.2 0 0 0 1-1.8L10 3.2a1.15 1.15 0 0 0-2 0Z"/><path d="M9 6.8v3.4M9 13h.01"/></svg>'};function ne(o,e,t,n,r,a){let i=r===void 0?t:`${t} (${r})`,s=r===void 0||!a?t:`${t}, ${r} ${a}${r===1?"":"s"}`;return`<button class="tab" role="tab" data-view="${o}" aria-selected="${e}" aria-label="${i}" title="${s}"><span class="tab-icon" aria-hidden="true">${zn[o]}</span><span class="tab-label" data-short="${n}">${t}</span>${r===void 0?"":`<span class="tab-count"> (${r})</span>`}</button>`}var Ct="ia2:rdf-navigator:state:v1",Ye=`SELECT ?subject ?predicate ?object ?graph
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
LIMIT 100`,Dt=25,qt=[10,25,50,100],At=[...we,"http://www.w3.org/ns/shacl#name"],Hn=4,Te=28,It=2e6,jn=1e4,_n="text/html, application/xhtml+xml;q=0.95",On=2e6,Fn=4,Un=2,Vn=3e3,Re="allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts",$t=`${Re} allow-same-origin`,pe=new Map,Bn=new Set(["ontology.inferal.com","purl.archive.org","purl.org","schema.org","www.schema.org","www.w3.org"]),Wn={Alt:"ch_alt",Bag:"ch_bag",first:"ch_first",HTML:"ch_html",JSON:"ch_json",langString:"ch_langstring",List:"ch_list",nil:"ch_nil",object:"ch_object",predicate:"ch_predicate",Property:"ch_property",reifies:"ch_reifies",rest:"ch_rest",Seq:"ch_seq",Statement:"ch_statement",subject:"ch_subject",type:"ch_type",value:"ch_value",XMLLiteral:"ch_xmlliteral"},Kn={Class:"ch_class",comment:"ch_comment",Container:"ch_container",ContainerMembershipProperty:"ch_containermembershipproperty",Datatype:"ch_datatype",domain:"ch_domain",isDefinedBy:"ch_isdefinedby",label:"ch_label",Literal:"ch_literal",member:"ch_member",Proposition:"ch_proposition",range:"ch_range",Resource:"ch_resource",seeAlso:"ch_seealso",subClassOf:"ch_subclassof",subPropertyOf:"ch_subpropertyof"};function Qn(o){if(!o||typeof o!="object")return!1;let e=o;return typeof e.height=="number"&&Number.isFinite(e.height)&&e.height>0&&typeof e.width=="number"&&Number.isFinite(e.width)&&e.width>0&&typeof e.x=="number"&&Number.isFinite(e.x)&&typeof e.y=="number"&&Number.isFinite(e.y)}function Gn(o){if(!o||typeof o!="object")return!1;let e=o;return typeof e.x=="number"&&Number.isFinite(e.x)&&typeof e.y=="number"&&Number.isFinite(e.y)}var Yn="http://www.w3.org/1999/02/22-rdf-syntax-ns#type",Xn="http://www.w3.org/2000/01/rdf-schema#domain",Jn="http://www.w3.org/2000/01/rdf-schema#range",Zn=8,eo={"http://www.w3.org/1999/02/22-rdf-syntax-ns#Property":"RDF property","http://www.w3.org/2000/01/rdf-schema#Class":"RDFS class","http://www.w3.org/2002/07/owl#AnnotationProperty":"Annotation property","http://www.w3.org/2002/07/owl#Class":"OWL class","http://www.w3.org/2002/07/owl#DatatypeProperty":"Datatype property","http://www.w3.org/2002/07/owl#ObjectProperty":"Object property","http://www.w3.org/2002/07/owl#Ontology":"OWL ontology"},to=new Set(["area","base","head","link","meta","noscript","script","source","style","template","title","track"]);function K(o){let e=o.id?`#${o.id}`:"";return`<${o.localName}${e}>`}function Xe(o){return o.termType==="NamedNode"||o.termType==="BlankNode"?`${o.termType}:${o.value}`:null}function Pt(o){if(o.termType==="BlankNode")return`Blank node ${o.value}`;try{let e=new URL(o.value),t=decodeURIComponent(e.hash.slice(1));if(t)return t.replaceAll(/[-_]+/g," ");let n=e.pathname.split("/").filter(Boolean).at(-1);return decodeURIComponent(n??o.value).replaceAll(/[-_]+/g," ")}catch{return o.value}}function no(o){return(o.startsWith("http://www.w3.org/ns/shacl#")?o.slice(27):j({termType:"NamedNode",value:o})).replaceAll(/([a-z0-9])([A-Z])/g,"$1 $2").replaceAll(/[-_]+/g," ").replace(/^./,t=>t.toUpperCase())}function oo(o){return o.kinds.length>1?"Node + property shape":o.kinds[0]==="property"?"Property shape":"Node shape"}function Ce(o){return/^https?:\/\//i.test(o)}function zt(o){let e=new URL(o),t=e.hostname==="www.w3.org"&&e.pathname==="/1999/02/22-rdf-syntax-ns"?decodeURIComponent(e.hash.slice(1)):"";if(t)return new URL(`https://www.w3.org/TR/rdf12-schema/#${Wn[t]??"rdf-namespace"}`);let n=e.hostname==="www.w3.org"&&e.pathname==="/2000/01/rdf-schema"?decodeURIComponent(e.hash.slice(1)):"";if(n)return new URL(`https://www.w3.org/TR/rdf12-schema/#${Kn[n]??"rdfs-namespace"}`);let r=e.hostname==="purl.org"?e.pathname.match(/^\/dc\/terms\/([^/]+)$/):null;return r?new URL(`https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#${encodeURIComponent(r[1])}`):e.hostname==="purl.org"&&e.pathname==="/dc/terms/"?new URL("https://www.dublincore.org/specifications/dublin-core/dcmi-terms/"):(e.protocol==="http:"&&Bn.has(e.hostname)&&(e.protocol="https:"),e)}function Ht(o){return o.hostname==="www.dublincore.org"&&o.pathname==="/specifications/dublin-core/dcmi-terms/"||o.hostname==="www.w3.org"&&o.pathname.startsWith("/TR/")}function ro(o){let e=new URL(o.href);return e.hash="",e.href}function ao(o,e){for(pe.delete(o),pe.set(o,e);pe.size>Fn;){let t=pe.keys().next().value;if(!t)break;pe.delete(t)}}function le(o){return`<!doctype html><meta charset="utf-8"><meta name="color-scheme" content="light dark"><style>
    :root { color: oklch(34% 0.015 286); font: 13px/1.45 ui-sans-serif, system-ui, sans-serif; }
    body { align-items: center; display: flex; justify-content: center; margin: 0; min-height: 100vh; }
    p { color: oklch(54% 0.018 286); margin: 24px; text-align: center; }
  </style><p role="status">${o}</p>`}function io(o,e,t){return new Promise((n,r)=>{let a=new o.AbortController,i=!1,s=0,c=d=>{i||(i=!0,o.clearTimeout(s),t.signal.removeEventListener("abort",l),d())},l=()=>{a.abort(),c(()=>r(new Error("Resource preview request was cancelled.")))};t.signal.addEventListener("abort",l,{once:!0}),s=o.setTimeout(()=>{a.abort(),c(()=>r(new Error("Resource preview request timed out.")))},Vn),o.fetch(e,{credentials:"omit",redirect:"follow",referrerPolicy:"no-referrer",signal:a.signal}).then(async d=>{let p=await d.text();c(()=>n({html:p,response:d}))}).catch(d=>c(()=>r(d)))})}function jt(o,e,t=""){let r=`<base href="${e.replaceAll("&","&amp;").replaceAll('"',"&quot;")}">`,a=JSON.stringify(e).replaceAll("<","\\u003c"),i=JSON.stringify(t).replaceAll("<","\\u003c"),s=`<script data-ia2-preview-bridge>(() => {
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
  })();<\/script>`,c=`${r}${s}`,l=/<head(?:\s[^>]*)?>/i.exec(o);if(!l)return`${c}${o}`;let d=l.index+l[0].length;return`${o.slice(0,d)}${c}${o.slice(d)}`}function ie(o){let e=o.ownerDocument.defaultView;if(!e||!(o instanceof e.HTMLElement)||!o.isConnected||to.has(o.localName)||o.closest("head, template, [hidden]")||o.localName==="input"&&o.getAttribute("type")?.toLowerCase()==="hidden")return!1;let t=e.getComputedStyle(o);return t.display!=="none"&&t.visibility!=="hidden"&&t.visibility!=="collapse"}function so(o){return o.localName==="template"&&"content"in o?o.content.childNodes.length>0:o.childNodes.length>0}function co(o,e){let t=0,n=o.parentElement;for(;n;)e.has(n)&&(t+=1),n=n.parentElement;return t}function lo(o){let e=o.ownerDocument.defaultView;if(!e||!ie(o))return!1;let t=o.getBoundingClientRect();return t.width>0&&t.height>0&&t.bottom>0&&t.right>0&&t.top<e.innerHeight&&t.left<e.innerWidth}function re(o){if(o.termType==="Triple")return[j(o),re(o.subject),re(o.predicate),re(o.object)].join(" ");let e=o.termType==="Literal"?`${o.datatype.value} ${o.language} ${o.direction??""}`:"";return`${j(o)} ${o.value} ${e}`}function po(o){return[re(o.subject),re(o.predicate),re(o.object),o.graph?re(o.graph):"",K(o.source)].join(" ").toLocaleLowerCase()}function ge(o,e,t=o.URL,n){if(n?.has(e))return n.get(e)??null;let r=null;try{let a=new URL(e),i=new URL(t),s=new URL(a),c=new URL(i);s.hash="",c.hash="",r=s.href===c.href?a:null}catch{r=null}return n?.set(e,r),r}function uo(o,e){try{let t=new URL(o),n=new URL(e.sourceDocumentIri),r=new URL(t);if(r.hash="",n.hash="",r.href!==n.href)return t.href;let a=new URL(e.retrievalDocumentIri);return a.hash=t.hash,a.href}catch{return o}}function ho(o,e,t){if(t.metaKey||t.ctrlKey||t.shiftKey||t.altKey)return;t.preventDefault();let n=o.defaultView;if(!n)return;let r=new URL(o.URL);r.hash=e.hash,n.history.pushState(null,"",r.href),(e.hash?Ze(o,e):o.documentElement)?.scrollIntoView({behavior:n.matchMedia?.("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"})}function Ze(o,e){let t=o.documentElement;if(e.hash){let n=e.hash.slice(1);try{t=o.getElementById(decodeURIComponent(n))}catch{t=o.getElementById(n)}}return t&&ie(t)?t:null}function Ne(o,e,t=o.URL,n,r){if(e.termType!=="NamedNode"||!Ce(e.value))return null;if(r?.has(e.value))return r.get(e.value)??null;let a=ge(o,e.value,t,n),i=a?Ze(o,a):null;return r?.set(e.value,i),i}function mo(o,e,t){let n=Ne(o,e.term,t);if(n)return n;for(let r of e.sources){let a=r.closest("[id]");if(a&&ie(a))return a;if(ie(r))return r}return null}function Je(o,e,t,n){let r=o.createElement("button");r.className=`row-action-button locate-button ${t}`,r.type="button",r.setAttribute("aria-label",`Locate ${K(e)}`),r.title=r.getAttribute("aria-label");let a=o.createElement("span");return a.className="locate-glyph",a.setAttribute("aria-hidden","true"),a.textContent="\u2316",r.append(a),r.addEventListener("click",()=>n(e)),r}function de(o,e,t="",n="",r,a=o.URL,i,s){let c=o.createElement("code");n&&(c.className=n),t&&c.append(o.createTextNode(t));let l=j(e);if(e.termType!=="NamedNode"||!Ce(e.value))return c.append(o.createTextNode(l)),c;let d=o.createElement("a");d.className="term-link",d.href=e.value;let p=ge(o,e.value,a,i);p?(d.classList.add("local-term"),d.title=p.hash?`Scroll to ${p.hash} in this document`:"Scroll to the start of this document",d.addEventListener("click",h=>ho(o,p,h))):(d.target="_blank",d.rel="noopener noreferrer",d.title=`Open ${e.value} in a new tab`),d.textContent=l,c.append(d);let b=Ne(o,e,a,i,s);return b&&r&&c.append(Je(o,b,"term-locate-button",r)),c}function fo(o){for(let[a,i]of Object.entries(Ie))if(o.startsWith(i))return{label:a,namespace:i};if(!Ce(o))return null;let e=o.lastIndexOf("#"),t=o.lastIndexOf("/"),n=Math.max(e,t);if(n<8)return null;let r=o.slice(0,n+1);try{let a=new URL(r),i=a.pathname.replace(/\/$/,""),s=r.endsWith("#")?"#":"";return{label:`${a.host}${i}${s}`,namespace:r}}catch{return null}}function Q(o){return o.termType==="NamedNode"?[o.value]:o.termType==="BlankNode"?[]:o.termType==="Literal"?j(o).includes("^^")?[o.datatype.value]:[]:[...Q(o.subject),...Q(o.predicate),...Q(o.object)]}function Me(o){return j({termType:"NamedNode",value:o})}function Ft(o){let e=o.replace(/[\/#]+$/,""),t=Math.max(e.lastIndexOf("#"),e.lastIndexOf("/")),n=t>=0?e.slice(t+1):e;try{return decodeURIComponent(n)}catch{return n}}function go(o){let t=Ft(o).replace(/\.[A-Za-z0-9]+$/u,"").replace(/([\p{Ll}\d])(\p{Lu})/gu,"$1 $2").replace(/[_-]+/gu," ").replace(/\s+/gu," ").trim();return t?`${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}`:Me(o)}function fe(o,e){if(!o)return"unbound";let t=o.termType==="NamedNode"||o.termType==="BlankNode"?e.get(`${o.termType}:${o.value}`)??"":"";return JSON.stringify([o.termType,o.value,o.datatype??"",o.language??"",o.direction??"",t])}function _t(o,e){if(o.kind==="ask")return`ask:${String(o.value)}`;if(o.kind==="quads"){let n=o.quads.map(r=>JSON.stringify([fe(r.subject,e),fe(r.predicate,e),fe(r.object,e),fe(r.graph,e)])).sort();return JSON.stringify(["quads",n])}let t=o.rows.map(n=>JSON.stringify(o.variables.map(r=>fe(n[r],e)))).sort();return JSON.stringify(["bindings",o.variables,t])}function bo(o){let e=new Map,t=n=>{let r=e.get(n);if(r)return r;let a={domains:new Set,iri:n,ranges:new Set,statementCount:0,types:new Set};return e.set(n,a),a};for(let n of o.quads){let r=new Set([...Q(n.subject),...Q(n.predicate),...Q(n.object),...n.graph?Q(n.graph):[]]);for(let i of r)t(i).statementCount+=1;if(n.subject.termType!=="NamedNode")continue;let a=t(n.subject.value);n.predicate.value===Yn&&n.object.termType==="NamedNode"&&a.types.add(n.object.value),n.predicate.value===Xn&&a.domains.add(j(n.object)),n.predicate.value===Jn&&a.ranges.add(j(n.object))}return Array.from(e.values()).map(n=>{let r=Me(n.iri),a=Ft(n.iri),i=Z(o.quads,n.iri)??"",s=Array.from(n.types,p=>eo[p]??`type ${Me(p)}`).sort(),c=Array.from(n.domains).sort(),l=Array.from(n.ranges).sort(),d=[r,n.iri,a,i,...s,...c.flatMap(p=>["domain",p,`domain ${p}`]),...l.flatMap(p=>["range",p,`range ${p}`])].join(" ").toLocaleLowerCase();return{display:r,domains:c,iri:n.iri,kinds:s,label:i,localName:a,ranges:l,searchText:d,statementCount:n.statementCount}})}function vo(o,e,t=Zn){let n=e.trim().toLocaleLowerCase();if(!n)return[];let r=n.split(/\s+/).filter(Boolean);return o.map(a=>{if(!r.every(c=>a.searchText.includes(c)))return null;let i=[a.display,a.localName,a.label].join(" ").toLocaleLowerCase(),s=60;return[a.display,a.localName,a.label].some(c=>c.toLocaleLowerCase()===n)?s=0:[a.display,a.localName,a.label].some(c=>c.toLocaleLowerCase().startsWith(n))?s=10:i.includes(n)?s=20:r.every(c=>i.includes(c))&&(s=35),{score:s-Math.min(a.statementCount,20)/100,suggestion:a}}).filter(a=>a!==null).sort((a,i)=>a.score-i.score||a.suggestion.display.localeCompare(i.suggestion.display)).slice(0,t).map(({suggestion:a})=>a)}function wo(o){let e=[...o.kinds,...o.domains.map(n=>`domain ${n}`),...o.ranges.map(n=>`range ${n}`)],t=`${o.statementCount} statement${o.statementCount===1?"":"s"}`;return[...e,t]}function Ut(o){let e=[...Q(o.subject),...Q(o.predicate),...Q(o.object),...o.graph?Q(o.graph):[]],t=new Map;for(let n of e){let r=fo(n);r&&t.set(r.namespace,r)}return Array.from(t.values())}function xo(o){let e=new Map;for(let t of o.quads)for(let n of Ut(t)){let r=e.get(n.namespace);r?r.count+=1:e.set(n.namespace,{...n,count:1})}return Array.from(e.values()).sort((t,n)=>t.label.localeCompare(n.label))}var yo=new Set(["content","datetime","dir","href","lang","src","value"]),Ot="[rdf-predicate], [rdf-graph], [rdf-graph-key], base[href], link[rel]";function Eo(o){if(o.type==="characterData")return o.target.parentElement?.closest("[rdf-predicate]")!==null;if(o.type==="attributes"){let t=o.target instanceof Element?o.target:null,n=o.attributeName??"";return t?n.startsWith("rdf-")||t.localName==="base"&&n==="href"||t.localName==="link"&&(n==="href"||n==="rel")?!0:t.hasAttribute("rdf-predicate")?n==="id"||yo.has(n):!1:!1}return(o.target instanceof Element?o.target:null)?.closest("[rdf-predicate]")?!0:[...o.addedNodes,...o.removedNodes].some(t=>t instanceof Element?t.matches(Ot)||t.querySelector(Ot)!==null:!1)}function So(o,e){let t=new URL(o),n=new URL(e.sourceDocumentIri),r=new URL(e.retrievalDocumentIri);return t.origin!==n.origin||n.origin===r.origin?t.href:new URL(`${t.pathname}${t.search}${t.hash}`,r.origin).href}function ko(o,e){try{Object.defineProperty(o,"URL",{configurable:!0,value:e})}catch{}let t=o.head?.querySelector("base[href]");t&&(t.href=new URL(t.getAttribute("href")??"",e).href),o.head?.querySelectorAll('link[rel~="canonical"][href]').forEach(n=>{n.href=new URL(n.getAttribute("href")??"",e).href})}function Lo(o){return o instanceof DOMException&&o.name==="AbortError"?"Retrieval timed out.":o instanceof TypeError?"Retrieval was blocked by CORS or network policy.":o instanceof Error?o.message:"The contribution could not be loaded."}var be=class extends HTMLElement{#n=null;#m=null;#F=null;#me=[];#fe=[];#r=[];#i="top-document";#ge=new WeakMap;#ze=1;#k=[];#a=new Map;#L={classes:[],count:0,definitions:[],properties:[]};#v={count:0,groups:[],shapes:[]};#e="navigator";#o=!1;#T="";#q="";#J="";#f=[];#Z=[];#w="";#x=Ye;#t={status:"idle"};#U=!0;#g="";#A=new Map;#s=0;#S=Dt;#b=0;#y=new Set;#p="off";#c="right";#u=null;#I=null;#l=null;#$=null;#V=!1;#d=new Map;#R=null;#B=null;#be=20;#ee=null;#te=null;#W=null;#ne=null;#N=null;#E=null;#M=null;#C=null;#K=[];#oe=!1;constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.#Ve(),this.refresh(),this.addEventListener("keydown",this.#Ae),this.addEventListener("keyup",this.#Ie),this.ownerDocument.defaultView?.addEventListener("resize",this.#qe,{passive:!0}),this.#We()}disconnectedCallback(){this.removeEventListener("keydown",this.#Ae),this.removeEventListener("keyup",this.#Ie),this.ownerDocument.defaultView?.removeEventListener("resize",this.#qe),this.#M?.disconnect(),this.#M=null;for(let e of this.#a.values())e.controller?.abort();this.#a.clear(),this.#N?.disconnect(),this.#N=null,this.#E?.disconnect(),this.#E=null,this.#C!==null&&window.clearTimeout(this.#C),this.#G(),this.#ue(),this.#ie(),this.#O(),this.#Q(),this.#re()}#Q(){this.#te?.(),this.#te=null}#He(){if(this.#W){this.#W();return}this.#p="off",this.#Q()}#re(){this.#ne?.(),this.#ne=null}#je(e){if(this.#E?.disconnect(),this.#E=null,!e)return;let t=()=>{if(e.dataset.compact="0",!(e.clientWidth<=0)){for(let r=0;r<=3;r+=1)if(e.dataset.compact=String(r),e.scrollWidth<=e.clientWidth+1)return}};t();let n=this.ownerDocument.defaultView?.ResizeObserver;n&&(this.#E=new n(t),this.#E.observe(e))}#P(e){this.#d.has(e)&&(this.#R=e,e.style.zIndex=String(++this.#be))}#ae(e){let t=this.#d.get(e);if(!t||(t.abortController?.abort(),t.interactionCleanup?.(),t.navigationCleanup?.(),e.remove(),this.#d.delete(e),this.#B===e&&(this.#B=null),this.#R!==e))return;let n=Array.from(this.#d.keys()).at(-1)??null;this.#R=null,n&&this.#P(n)}#ie(){for(let e of Array.from(this.#d.keys()))this.#ae(e);this.#R=null,this.#be=20}#ve(e){let t=e.getBoundingClientRect();return{height:Number.parseFloat(e.style.height)||t.height,width:Number.parseFloat(e.style.width)||t.width,x:Number.parseFloat(e.style.left)||t.left,y:Number.parseFloat(e.style.top)||t.top}}#se(e,t){let n=this.#H(t);e.style.height=`${n.height}px`,e.style.left=`${n.x}px`,e.style.top=`${n.y}px`,e.style.width=`${n.width}px`}#we(e){this.#se(e,this.#ve(e))}#xe(e,t,n){if(e.button!==0)return;let r=this.ownerDocument.defaultView,a=this.#d.get(t);if(!r||!a)return;e.preventDefault(),this.#P(t),a.interactionCleanup?.(),a.interactionCleanup=null,this.#we(t);let i=this.#ve(t),s=e.clientX,c=e.clientY;t.classList.add(n?"is-resizing":"is-dragging");let l=p=>{let b=p.clientX-s,h=p.clientY-c,u=this.#z(),m={...i};n?(n.includes("e")&&(m.width=Math.min(Math.max(i.width+b,u.minWidth),u.width-u.margin-i.x)),n.includes("s")&&(m.height=Math.min(Math.max(i.height+h,u.minHeight),u.height-u.margin-i.y)),n.includes("w")&&(m.x=Math.min(Math.max(i.x+b,u.margin),i.x+i.width-u.minWidth),m.width=i.x+i.width-m.x),n.includes("n")&&(m.y=Math.min(Math.max(i.y+h,u.margin),i.y+i.height-u.minHeight),m.height=i.y+i.height-m.y)):(m.x=i.x+b,m.y=i.y+h),this.#se(t,m)},d=()=>{r.removeEventListener("pointermove",l),r.removeEventListener("pointerup",d),r.removeEventListener("pointercancel",d),t.classList.remove("is-dragging","is-resizing"),a.interactionCleanup===d&&(a.interactionCleanup=null)};r.addEventListener("pointermove",l),r.addEventListener("pointerup",d),r.addEventListener("pointercancel",d),a.interactionCleanup=d}#ye(e,t,n){let r=this.ownerDocument.defaultView,a=this.#d.get(e);if(!r||!a)return;a.abortController?.abort(),a.abortController=null;let i=zt(n),s=Ht(i),c=ro(i),l=i.hash?decodeURIComponent(i.hash.slice(1)):"";if(t.removeAttribute("srcdoc"),s){t.removeAttribute("src"),t.setAttribute("sandbox",Re);let h=pe.get(c);if(h){t.srcdoc=jt(h.html,h.baseUrl,l);return}t.srcdoc=le("Loading definition\u2026")}else t.setAttribute("sandbox",$t),t.src=i.href;if(typeof r.fetch!="function"||typeof r.AbortController!="function"){s&&(t.srcdoc=le("Preview unavailable. Use the open button above."));return}let d=new r.AbortController;a.abortController=d;let p=s?Un:1;(async()=>{let h;for(let u=0;u<p;u+=1)try{return await io(r,i.href,d)}catch(m){if(h=m,d.signal.aborted||u+1>=p)throw m;s&&t.isConnected&&(t.srcdoc=le("Still loading; retrying\u2026"))}throw h})().then(({html:h,response:u})=>{let m=u.headers.get("content-type")?.toLowerCase()??"";if(!u.ok||!m.includes("text/html")&&!m.includes("application/xhtml+xml")){s&&t.isConnected&&(t.srcdoc=le("Preview unavailable. Use the open button above."));return}if(h.length>On||d.signal.aborted||!t.isConnected){s&&!d.signal.aborted&&t.isConnected&&(t.srcdoc=le("Preview is too large. Use the open button above."));return}let x=new URL(u.url||i.href);x.hash="",ao(c,{baseUrl:x.href,html:h}),t.setAttribute("sandbox",Re),t.srcdoc=jt(h,x.href,l)}).catch(()=>{s&&t.isConnected&&!d.signal.aborted&&(t.srcdoc=le("Preview unavailable. Use the open button above."))}).finally(()=>{a.abortController===d&&(a.abortController=null)})}#Ee(e,t){let n=e.querySelector(".resource-preview-frame"),r=e.querySelector(".resource-preview-open"),a=e.querySelector(".resource-preview-url");if(!n||!r||!a)return;let s=(e.dataset.previewKind==="definition"?"definition":"resource")==="definition"?"Definition":"Resource";e.setAttribute("aria-label",`${s} preview of ${t}`),a.textContent=t,a.title=t,r.href=t,r.setAttribute("aria-label",`Open ${t} in a new tab`),r.title=r.getAttribute("aria-label"),n.title=`${s} preview of ${t}`,this.#ye(e,n,t)}#_e(e,t,n){let r=this.ownerDocument.defaultView;if(!r||!this.shadowRoot||!e.isConnected)return null;let a=this.ownerDocument,i=a.createElement("section");i.className="resource-preview";let s=e.closest(".predicate")?"definition":"resource";i.dataset.previewKind=s,i.setAttribute("role","dialog"),i.setAttribute("aria-label",`${s==="definition"?"Definition":"Resource"} preview of ${e.href}`);let{height:c,margin:l,width:d}=this.#z(),p=Math.max(1,d-l*2),b=Math.max(1,c-l*2),h=s==="definition"?620:Math.max(760,Math.round(d*.72)),u=s==="definition"?520:Math.min(760,Math.max(560,Math.round(c*.82))),m=Math.min(h,p),x=Math.min(u,b),v=this.#d.size%6*24,M=this.#H({height:x,width:m,x:s==="definition"?t-24:Math.round((d-m)/2),y:s==="definition"?n-40:Math.round((c-x)/2)});this.#se(i,{...M,x:M.x+v,y:M.y+v});let w=a.createElement("header");w.className="resource-preview-bar";let y=a.createElement("span");y.className="resource-preview-url",y.title=e.href,y.textContent=e.href;let E=a.createElement("a");E.className="resource-preview-action resource-preview-open",E.href=e.href,E.target="_blank",E.rel="noopener noreferrer",E.setAttribute("aria-label",`Open ${e.href} in a new tab`),E.title=E.getAttribute("aria-label"),E.textContent="\u2197",w.append(y,E);let g=a.createElement("button");g.className="resource-preview-action resource-preview-close",g.type="button",g.setAttribute("aria-label","Close resource preview"),g.title=g.getAttribute("aria-label"),g.textContent="\xD7",g.addEventListener("click",()=>this.#ae(i)),w.append(g),w.addEventListener("pointerdown",D=>{(D.target instanceof Element?D.target:null)?.closest("a, button")||this.#xe(D,i)});let N=a.createElement("iframe");N.className="resource-preview-frame",N.title=`${s==="definition"?"Definition":"Resource"} preview of ${e.href}`,N.setAttribute("sandbox",Ht(zt(e.href))?Re:$t),N.referrerPolicy="no-referrer",N.tabIndex=0,i.append(w,N);let S=a.createElement("div");S.className="resource-preview-resize-handles",S.setAttribute("aria-hidden","true");for(let D of["n","ne","e","se","s","sw","w","nw"]){let q=a.createElement("span");q.className="resize-handle",q.dataset.resize=D,q.addEventListener("pointerdown",H=>this.#xe(H,i,D)),S.append(q)}i.append(S),this.shadowRoot.append(i);let T={abortController:null,interactionCleanup:null,navigationCleanup:null};this.#d.set(i,T),i.addEventListener("pointerdown",()=>this.#P(i),{capture:!0}),this.#P(i);let k=D=>{let q=D.data;D.source!==N.contentWindow||q?.type!=="ia2-rdf-preview-navigate"||typeof q.href!="string"||!Ce(q.href)||this.#Ee(i,q.href)};return r.addEventListener("message",k),T.navigationCleanup=()=>r.removeEventListener("message",k),this.#ye(i,N,e.href),i}#Se(e,t){let n=e.getBoundingClientRect(),r=t.clientX||n.left+Math.min(n.width/2,24),a=t.clientY||n.top+Math.min(n.height/2,12);return this.#_e(e,r,a)}#Oe(e,t){let n=this.#B;if(n?.isConnected&&this.#d.has(n)){this.#P(n),this.#Ee(n,e.href);return}this.#B=this.#Se(e,t)}#Fe(e){if(!(e instanceof Element))return null;let t=e.closest("a.term-link[href], a.vocabulary-link[href], a.tok.iri[href], a.sparql-resource-label[href]");if(!t||!this.shadowRoot?.contains(t))return null;let n=this.#n?.sourceDocumentIri??this.ownerDocument.URL,r=t.dataset.semanticIri??t.href;return ge(this.ownerDocument,r,n)?null:t}#Ue(){if(!this.shadowRoot)return;let e=this.shadowRoot.querySelector(".viewport");e&&e.addEventListener("click",t=>{let n=this.#Fe(t.target);!n||t.button!==0||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||(t.preventDefault(),n.classList.contains("sparql-resource-label")?this.#Oe(n,t):this.#Se(n,t))})}#Ve(){try{let e=this.ownerDocument.defaultView?.sessionStorage.getItem(Ct);if(!e)return;let t=JSON.parse(e);ye(t.position)&&(this.#c=t.position),Qn(t.floatingRect)&&(this.#u=this.#H(t.floatingRect)),Gn(t.launcherPosition)&&(this.#l=t.launcherPosition)}catch{}}#D(){try{let e={floatingRect:this.#u,launcherPosition:this.#l,position:this.#c};this.ownerDocument.defaultView?.sessionStorage.setItem(Ct,JSON.stringify(e))}catch{}}#ce(){let e=this.shadowRoot?.activeElement;if(!(e instanceof HTMLElement))return null;if(e.classList.contains("navigator-search")){let t=e;return{kind:"search",start:t.selectionStart,end:t.selectionEnd}}if(e.classList.contains("shapes-search")){let t=e;return{kind:"shapes-search",start:t.selectionStart,end:t.selectionEnd}}if(e.classList.contains("sparql-editor")){let t=e;return{kind:"sparql-editor",start:t.selectionStart,end:t.selectionEnd}}return e.classList.contains("sparql-suggestion")?{kind:"sparql-suggestion"}:e.classList.contains("sparql-run")?{kind:"sparql-run"}:e.classList.contains("sparql-reset")?{kind:"sparql-reset"}:e.classList.contains("sparql-observe-input")?{kind:"sparql-observe"}:e.classList.contains("vocabulary-toggle")&&e.dataset.namespace?{kind:"namespace",key:e.dataset.namespace}:e.classList.contains("sync-option")&&e.dataset.syncMode?{kind:"sync",key:e.dataset.syncMode}:e.classList.contains("position-option")&&e.dataset.position?{kind:"position",key:e.dataset.position}:e.classList.contains("discovery-action")&&e.dataset.candidateId?{kind:"discovery-action",key:e.dataset.candidateId}:e.classList.contains("source-input")&&e.dataset.sourceId?{kind:"source",key:e.dataset.sourceId}:e.classList.contains("tab")&&e.dataset.view?{kind:"tab",key:e.dataset.view}:e.classList.contains("launcher")?{kind:"launcher"}:e.classList.contains("refresh")?{kind:"refresh"}:e.classList.contains("close")?{kind:"close"}:e.classList.contains("copy")?{kind:"copy"}:e.classList.contains("viewport")?{kind:"viewport"}:this.shadowRoot?.querySelector(".panel")?.contains(e)?{kind:"fallback"}:null}#le(e){if(!this.shadowRoot)return;let t=null;e.kind==="search"&&(t=this.shadowRoot.querySelector(".navigator-search")),e.kind==="shapes-search"&&(t=this.shadowRoot.querySelector(".shapes-search")),e.kind==="sparql-editor"&&(t=this.shadowRoot.querySelector(".sparql-editor")),e.kind==="sparql-suggestion"&&(t=this.shadowRoot.querySelector(".sparql-suggestion")),e.kind==="sparql-run"&&(t=this.shadowRoot.querySelector(".sparql-run")),e.kind==="sparql-reset"&&(t=this.shadowRoot.querySelector(".sparql-reset")),e.kind==="sparql-observe"&&(t=this.shadowRoot.querySelector(".sparql-observe-input")),e.kind==="namespace"&&(t=Array.from(this.shadowRoot.querySelectorAll(".vocabulary-toggle")).find(n=>n.dataset.namespace===e.key)??null),e.kind==="sync"&&(t=Array.from(this.shadowRoot.querySelectorAll(".sync-option")).find(n=>n.dataset.syncMode===e.key)??null),e.kind==="position"&&(t=Array.from(this.shadowRoot.querySelectorAll(".position-option")).find(n=>n.dataset.position===e.key)??null),e.kind==="discovery-action"&&(t=Array.from(this.shadowRoot.querySelectorAll(".discovery-action")).find(n=>n.dataset.candidateId===e.key)??null),e.kind==="source"&&(t=Array.from(this.shadowRoot.querySelectorAll(".source-input")).find(n=>n.dataset.sourceId===e.key)??null),e.kind==="tab"&&(t=Array.from(this.shadowRoot.querySelectorAll(".tab")).find(n=>n.dataset.view===e.key)??null),e.kind==="launcher"&&(t=this.shadowRoot.querySelector(".launcher")),e.kind==="refresh"&&(t=this.shadowRoot.querySelector(".refresh")),e.kind==="close"&&(t=this.shadowRoot.querySelector(".close")),e.kind==="copy"&&(t=this.shadowRoot.querySelector(".copy")),e.kind==="viewport"&&(t=this.shadowRoot.querySelector(".viewport")),!t&&e.kind==="fallback"&&(t=this.shadowRoot.querySelector('[role="tab"][aria-selected="true"]')),t?.focus({preventScroll:!0}),e.kind==="search"&&t instanceof HTMLInputElement&&t.setSelectionRange(e.start??t.value.length,e.end??t.value.length),e.kind==="shapes-search"&&t instanceof HTMLInputElement&&t.setSelectionRange(e.start??t.value.length,e.end??t.value.length),e.kind==="sparql-editor"&&t instanceof HTMLTextAreaElement&&t.setSelectionRange(e.start??t.value.length,e.end??t.value.length)}#Be(){let e=this.shadowRoot?.querySelector(".panel");return e?[e,...this.#d.keys()].flatMap(n=>Array.from(n.querySelectorAll("a[href], button, input, select, textarea, [tabindex]"))).filter(n=>n.tabIndex>=0&&!n.hasAttribute("disabled")&&!n.closest("[hidden]")&&n.getAttribute("aria-hidden")!=="true"):[]}#We(){this.#M?.disconnect();let e=this.ownerDocument.defaultView?.MutationObserver??MutationObserver;this.#M=new e(t=>{t.some(n=>n.target!==this&&Eo(n))&&(this.#C!==null&&window.clearTimeout(this.#C),this.#C=window.setTimeout(()=>{this.#C=null,this.#t.status==="success"?this.#et():this.refresh()},120))});try{this.#M.observe(this.ownerDocument.documentElement,{attributes:!0,characterData:!0,childList:!0,subtree:!0})}catch{this.#M=null}}#ke(){if(!this.#m){this.#n=null,this.#v={count:0,groups:[],shapes:[]},this.#A.clear();return}let e=Array.from(this.#a.values()).flatMap(t=>t.status==="loaded"&&t.contribution?[t.contribution]:[]);this.#n=He(this.#m,e),this.#v=We(this.#n),this.#A=Pe(this.#n.quads,{predicates:At,languages:[this.ownerDocument.documentElement.lang||"en"]})}#de(e){this.#ke(),this.#h(),queueMicrotask(()=>{Array.from(this.shadowRoot?.querySelectorAll(".discovery-action")??[]).find(t=>t.dataset.candidateId===e)?.focus({preventScroll:!0})})}#Ke(e){this.#a.get(e)?.controller?.abort(),this.#a.delete(e),this.#de(e)}async#Qe(e){let t=this.#m,n=this.ownerDocument.defaultView;if(!t||!n)return;let r=this.#a.get(e.id);if(r?.status==="loading"||r?.status==="loaded"){this.#Ke(e.id);return}let a=new AbortController;this.#a.set(e.id,{controller:a,status:"loading"}),this.#de(e.id);let i=n.setTimeout(()=>a.abort(),jn);try{let s=So(e.target.value,t),c=new URL(s).protocol;if(c!=="http:"&&c!=="https:")throw new Error(`Unsupported retrieval protocol: ${c}`);let l=await n.fetch(s,{credentials:"omit",headers:{Accept:_n},redirect:"follow",referrerPolicy:"no-referrer",signal:a.signal});if(!l.ok)throw new Error(`Retrieval failed with HTTP ${l.status}.`);let d=Number.parseInt(l.headers.get("content-length")??"",10);if(Number.isFinite(d)&&d>It)throw new Error("The representation is larger than the 2 MB enrichment limit.");let p=(l.headers.get("content-type")??"").split(";",1)[0].trim().toLowerCase(),b=await l.text();if(b.length>It)throw new Error("The representation is larger than the 2 MB enrichment limit.");let h=/<!doctype\s+html|<html[\s>]/i.test(b);if(p&&p!=="text/html"&&p!=="application/xhtml+xml")throw new Error(`Unsupported enrichment representation: ${p}. This preview currently extracts HTML/RDF.`);if(!p&&!h)throw new Error("The target did not return an identifiable HTML representation.");let u=new n.DOMParser().parseFromString(b,"text/html"),m=l.url||s;ko(u,m);let x=se(u);if(!x.quads.length&&!x.graphs.length)throw new Error("The retrieved HTML contained no extractable RDF.");if(this.#a.get(e.id)?.controller!==a)return;this.#a.set(e.id,{contribution:{candidateId:e.id,result:x,retrievalIri:m},status:"loaded"})}catch(s){if(this.#a.get(e.id)?.controller!==a)return;this.#a.set(e.id,{message:Lo(s),status:"error"})}finally{n.clearTimeout(i)}this.#de(e.id)}#Ge(e){let t=this.#ge.get(e);return t||(t=`document-frame-${this.#ze++}`,this.#ge.set(e,t)),t}#Ye(){return Array.from(this.ownerDocument.querySelectorAll("iframe, frame")).flatMap((t,n)=>{let r=null;try{if(r=t.contentDocument,!r?.documentElement)return[];r.documentElement.localName}catch{return[]}let a=r.URL||r.baseURI,i="Opaque origin";try{i=new URL(a).origin}catch{}let s=t.getAttribute("title")?.trim()||r.title.trim()||`Embedded document ${n+1}`;return[{access:"direct",id:this.#Ge(t),label:s,origin:i,result:se(r),url:a}]})}#Le(e,t=!1){let n=this.#r.find(i=>i.id===this.#i)??this.#r[0];if(!n)return;if(this.#i=n.id,this.#m=n.result,!e){for(let i of this.#a.values())i.controller?.abort();this.#a.clear()}this.#k=ze(this.#m),this.#L=Ge(this.#m);let r=ke(this.#m);this.#f=r.queries,this.#Z=r.diagnostics,this.#f.some(i=>i.id===this.#w)||(this.#w=""),t||(this.#b+=1,this.#s=0,this.#t={status:"idle"},this.#g="");let a=new Set(this.#k.map(i=>i.id));for(let[i,s]of this.#a)a.has(i)||(s.controller?.abort(),this.#a.delete(i));this.#ke()}#Te(e,t=!1){if(!this.#F)return;let n=this.#i,r=this.ownerDocument.URL||this.ownerDocument.baseURI,a="Opaque origin";try{a=new URL(r).origin}catch{}let i=new Set,s=[{access:"direct",id:"top-document",label:"Top document",origin:a,result:this.#F,url:r},...this.#me,...this.#fe];this.#r=s.filter(d=>i.has(d.id)?!1:(i.add(d.id),!0)),this.#r.some(d=>d.id===this.#i)||(this.#i="top-document");let c=this.#r[0],l=this.#r.slice(1).filter(d=>d.result.quads.length>0);this.#i===c.id&&c.result.quads.length===0&&l.length===1&&(this.#i=l[0].id),this.#Le(e,t&&n===this.#i)}#Xe(e){e===this.#i||!this.#r.some(t=>t.id===e)||(this.#i=e,this.#Le(!1),this.#e="navigator",this.#q="",this.#J="",this.#y.clear(),this.#p="off",this.#h())}setSources(e){if(this.#fe=e.flatMap(n=>{if(!n||n.access!=="portable"||!n.id||n.id==="top-document")return[];try{return[{access:"portable",id:n.id,label:n.label||"Embedded document",origin:n.origin||"Opaque origin",result:_e(n.result,this.ownerDocument),url:n.url||n.result.retrievalDocumentIri}]}catch{return[]}}),!this.#F)return;let t=this.#ce();this.#Te(!0),this.#h(),t&&queueMicrotask(()=>this.#le(t))}#Re(e){this.#F=se(this.ownerDocument),this.#me=this.#Ye(),this.#Te(!0,e)}#Ne(){let e=this.#r.find(r=>r.id===this.#i)??this.#r[0],t=this.#r.reduce((r,a)=>r+a.result.quads.length,0),n=Math.max(0,(this.#n?.quads.length??0)-(e?.result.quads.length??0));return t+n}#Je(){let e=this.shadowRoot?.querySelector(".launcher .count");e&&(e.textContent=String(this.#Ne()))}#Ze(){let e=this.shadowRoot?.querySelector(".sparql-output");e&&(e.replaceChildren(),this.#he(e))}async#Me(){let e=this.#x.trim();if(!this.#U||!e||!this.#n||this.#t.status!=="success")return;let t=++this.#b,n=this.#n;try{let{executeSparql:r}=await import("./chunks/sparql-engine-FOALRXFP.js"),a=await r(e,n);if(t!==this.#b)return;let i=_t(a,this.#A);if(i===this.#g)return;this.#t={result:a,status:"success"},this.#g=i}catch(r){if(t!==this.#b)return;this.#t={error:r instanceof Error?r.message:"The query could not be run.",status:"error"},this.#g=""}this.#e==="sparql"&&this.#Ze()}async#et(){let e=this.#i;if(this.#Re(!0),e!==this.#i||this.#t.status!=="success"){this.#h();return}this.#e==="sparql"?this.#Je():this.#h(),await this.#Me()}refresh(){let e=this.#ce();this.#Re(!1),this.#h(),e&&queueMicrotask(()=>this.#le(e))}open(e="tab"){if(this.#o)return;this.#o=!0,this.#oe||this.#h(),this.shadowRoot?.querySelector(".launcher")?.setAttribute("aria-expanded","true");let t=this.shadowRoot?.querySelector(".panel");t&&(t.dataset.open="true"),queueMicrotask(()=>{let n=this.shadowRoot?.activeElement;if(n instanceof HTMLElement&&t?.contains(n))return;(e==="tab"?this.shadowRoot?.querySelector('[role="tab"][aria-selected="true"]'):this.shadowRoot?.querySelector(".panel"))?.focus({preventScroll:!0})})}close(){this.#o=!1,this.#G(),this.#ie(),this.#O(),this.#He(),this.shadowRoot?.querySelector(".launcher")?.setAttribute("aria-expanded","false");let e=this.shadowRoot?.querySelector(".panel");e&&(e.dataset.open="false"),queueMicrotask(()=>{let t=this.shadowRoot?.querySelector(".launcher");if(t?.hidden){this.shadowRoot?.activeElement?.blur();return}t?.focus()})}toggle(e="tab"){this.#o?this.close():this.open(e)}revealSource(e,t="left"){return!(this.#m?.quads.some(r=>r.source===e)??!1)||e.ownerDocument!==this.ownerDocument?!1:(this.#c=t,this.#e="navigator",this.#q="",this.#y.clear(),this.#p="off",this.#h(),this.#D(),this.open("panel"),queueMicrotask(()=>{let r=this.#K.filter(({quad:s})=>s.source===e),a=r[0]?.item;if(!a)return;this.#K.forEach(({item:s})=>s.classList.remove("is-corresponding")),r.forEach(({item:s})=>{s.hidden=!1,s.classList.add("is-corresponding")}),a.tabIndex=-1,a.scrollIntoView?.({block:"center"}),a.focus({preventScroll:!0}),this.#T=`Showing statements carried by ${K(e)}`;let i=this.shadowRoot?.querySelector(".sr-only");i&&(i.textContent=this.#T)}),!0)}#z(){let e=this.ownerDocument.defaultView,t=Math.max(e?.innerWidth??1024,1),n=Math.max(e?.innerHeight??768,1),r=t<=760?10:24;return{height:n,margin:r,minHeight:Math.min(280,Math.max(n-r*2,1)),minWidth:Math.min(360,Math.max(t-r*2,1)),width:t}}#H(e){let{height:t,margin:n,minHeight:r,minWidth:a,width:i}=this.#z(),s=Math.max(i-n*2,1),c=Math.max(t-n*2,1),l=Math.min(Math.max(e.width,a),s),d=Math.min(Math.max(e.height,r),c);return{height:d,width:l,x:Math.min(Math.max(e.x,n),i-n-l),y:Math.min(Math.max(e.y,n),t-n-d)}}#tt(){let{height:e,margin:t,width:n}=this.#z(),r=Math.min(760,Math.max(n-t*2,1)),a=Math.min(860,Math.max(e-t*2,1),Math.max(360,Math.round(e*.82)));return{height:a,width:r,x:Math.round((n-r)/2),y:Math.round((e-a)/2)}}#j(e){this.#u=this.#H(this.#u??this.#tt()),e.style.height=`${this.#u.height}px`,e.style.left=`${this.#u.x}px`,e.style.top=`${this.#u.y}px`,e.style.width=`${this.#u.width}px`}#nt(e){e.style.height="",e.style.left="",e.style.top="",e.style.width=""}#Ce(e){let t=this.ownerDocument.defaultView,n=Math.max(t?.innerWidth??1024,1),r=Math.max(t?.innerHeight??768,1),a=n<=760?14:20,i=e.getBoundingClientRect(),s=i.width||e.offsetWidth,c=i.height||e.offsetHeight||44;return{margin:a,maxX:Math.max(a,n-a-s),maxY:Math.max(a,r-a-c)}}#pe(e,t){let{margin:n,maxX:r,maxY:a}=this.#Ce(e);return{x:Math.min(Math.max(t.x,n),r),y:Math.min(Math.max(t.y,n),a)}}#ot(e,t){let{margin:n,maxX:r,maxY:a}=this.#Ce(e),i=this.#pe(e,t);return i.x-n<=Te&&(i.x=n),r-i.x<=Te&&(i.x=r),i.y-n<=Te&&(i.y=n),a-i.y<=Te&&(i.y=a),i}#_(e){this.#l&&(this.#l=this.#pe(e,this.#l),e.style.bottom="auto",e.style.left=`${this.#l.x}px`,e.style.right="auto",e.style.top=`${this.#l.y}px`)}#ue(){this.#$?.(),this.#$=null}#rt(e,t){if(e.button!==0)return;let n=this.ownerDocument.defaultView;if(!n)return;this.#ue();let r=t.getBoundingClientRect(),a={x:r.left,y:r.top},i=e.clientX,s=e.clientY,c=!1,l=p=>{let b=p.clientX-i,h=p.clientY-s;!c&&Math.hypot(b,h)<Hn||(c||(c=!0,e.preventDefault(),t.classList.add("is-dragging")),this.#l=this.#pe(t,{x:a.x+b,y:a.y+h}),this.#_(t))},d=()=>{n.removeEventListener("pointermove",l),n.removeEventListener("pointerup",d),n.removeEventListener("pointercancel",d),t.classList.remove("is-dragging"),c&&this.#l&&(this.#l=this.#ot(t,this.#l),this.#_(t),this.#D(),this.#V=!0,n.setTimeout(()=>{this.#V=!1},0)),this.#$===d&&(this.#$=null)};n.addEventListener("pointermove",l),n.addEventListener("pointerup",d),n.addEventListener("pointercancel",d),this.#$=d}#G(){this.#I?.(),this.#I=null}#De(e,t,n){if(this.#c!=="floating"||e.button!==0)return;let r=this.ownerDocument.defaultView;if(!r)return;e.preventDefault(),this.#G(),this.#j(t);let a={...this.#u},i=e.clientX,s=e.clientY;t.classList.add(n?"is-resizing":"is-dragging");let c=d=>{let p=d.clientX-i,b=d.clientY-s,h=this.#z(),u={...a};n?(n.includes("e")&&(u.width=Math.min(Math.max(a.width+p,h.minWidth),h.width-h.margin-a.x)),n.includes("s")&&(u.height=Math.min(Math.max(a.height+b,h.minHeight),h.height-h.margin-a.y)),n.includes("w")&&(u.x=Math.min(Math.max(a.x+p,h.margin),a.x+a.width-h.minWidth),u.width=a.x+a.width-u.x),n.includes("n")&&(u.y=Math.min(Math.max(a.y+b,h.margin),a.y+a.height-h.minHeight),u.height=a.y+a.height-u.y)):(u.x=a.x+p,u.y=a.y+b),this.#u=this.#H(u),this.#j(t)},l=()=>{r.removeEventListener("pointermove",c),r.removeEventListener("pointerup",l),r.removeEventListener("pointercancel",l),t.classList.remove("is-dragging","is-resizing"),this.#D(),this.#I===l&&(this.#I=null)};r.addEventListener("pointermove",c),r.addEventListener("pointerup",l),r.addEventListener("pointercancel",l),this.#I=l}#qe=()=>{for(let n of this.#d.keys())this.#we(n);let e=this.shadowRoot?.querySelector(".launcher");if(e&&this.#l&&(this.#_(e),this.#D()),this.#c!=="floating")return;let t=this.shadowRoot?.querySelector(".panel");t&&(this.#j(t),this.#D())};#Ae=e=>{if(e.stopPropagation(),!!this.#o){if(e.key==="Escape"){if(e.preventDefault(),this.#R){this.#ae(this.#R);return}this.close();return}if(e.key==="Tab"){let t=this.#Be();if(!t.length)return;let n=this.shadowRoot?.activeElement,r=t[0],a=t.at(-1);e.shiftKey&&(n===r||!t.includes(n))?(e.preventDefault(),a.focus()):!e.shiftKey&&(n===a||!t.includes(n))&&(e.preventDefault(),r.focus())}}};#Ie=e=>{e.stopPropagation()};#at(e){this.#e=e,this.#h(),queueMicrotask(()=>this.shadowRoot?.querySelector(`[data-view="${e}"]`)?.focus())}async#it(){if(!this.#n)return;let e=this.#e==="json"?me(this.#n):he(this.#n);try{await navigator.clipboard.writeText(e),this.#T="Copied to clipboard"}catch{this.#T="Clipboard access was not available"}let t=this.shadowRoot?.querySelector(".sr-only");t&&(t.textContent=this.#T)}#Y(e){this.#O();let t=e,n=t.ownerDocument.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1;t.scrollIntoView({behavior:n?"auto":"smooth",block:"center"}),n||(this.#ee=t.animate?.([{outline:"3px solid transparent",outlineOffset:"8px"},{outline:"3px solid oklch(62% 0.18 294)",outlineOffset:"4px",offset:.16},{outline:"3px solid transparent",outlineOffset:"8px"}],{duration:1800,easing:"cubic-bezier(.22,1,.36,1)"})??null)}#st(e,t){if(t.metaKey||t.ctrlKey||t.shiftKey||t.altKey)return;let n=this.#n?.sourceDocumentIri??this.ownerDocument.URL,r=ge(this.ownerDocument,e,n);if(!r)return;let a=Ze(this.ownerDocument,r),i=this.#n?.quads.filter(l=>l.subject.termType==="NamedNode"&&l.subject.value===e).map(l=>l.source).find(l=>ie(l)),s=a??i;if(!s)return;t.preventDefault();let c=this.ownerDocument.defaultView;if(c){let l=new URL(this.ownerDocument.URL);l.hash=r.hash,c.history.pushState(null,"",l.href)}this.#Y(s)}#O(){this.#ee?.cancel(),this.#ee=null}#ct(e,t,n,r){if(this.#Q(),this.#p==="off")return;let a=this.ownerDocument.defaultView;if(!a)return;let i=[],s=null,c=null,l=null,d=(m,x,v,M)=>{m.addEventListener(x,v,M),i.push(()=>m.removeEventListener(x,v,M))},p=m=>{s!==null&&a.clearTimeout(s),s=a.setTimeout(()=>{s=null,m()},32)},b=new Map;for(let m of t){let x=b.get(m.quad.source)??[];x.push(m),b.set(m.quad.source,x)}let h=m=>{c?.cancel(),!a.matchMedia?.("(prefers-reduced-motion: reduce)").matches&&(c=m.animate?.([{outline:"2px solid transparent",outlineOffset:"7px"},{outline:"2px solid oklch(62% 0.18 294)",outlineOffset:"4px"}],{direction:"alternate",duration:520,easing:"cubic-bezier(.22,1,.36,1)",iterations:1/0})??null)},u=()=>{c?.cancel(),c=null};if(b.forEach((m,x)=>{d(x,"pointerenter",()=>{r(x),m.forEach(({item:v})=>{v.classList.add("is-corresponding"),v.scrollIntoView?.({block:"nearest"})})}),d(x,"pointerleave",()=>{m.forEach(({item:v})=>v.classList.remove("is-corresponding")),r(null)})}),t.forEach(({item:m,quad:x})=>{let v=x.source;d(m,"pointerenter",()=>{m.classList.add("is-corresponding"),h(v),this.#p==="panel"&&v.scrollIntoView({behavior:a.matchMedia?.("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"center"})}),d(m,"pointerleave",()=>{m.classList.remove("is-corresponding"),u()})}),this.#p==="page"){let m=()=>p(n);d(a,"scroll",m,{passive:!0}),d(a,"resize",m,{passive:!0})}else{let m=()=>{let x=e.getBoundingClientRect(),v=x.top+Math.min(x.height*.35,140),M=null,w=Number.POSITIVE_INFINITY;for(let E of t){if(E.item.hidden)continue;let g=E.item.getBoundingClientRect();if(g.bottom<=x.top||g.top>=x.bottom)continue;let N=Math.abs(g.top-v);N<w&&(M=E,w=N)}let y=M?.quad.source;!y||y===l||!ie(y)||(l=y,y.scrollIntoView({behavior:"auto",block:"center"}),h(y))};d(e,"scroll",()=>p(m),{passive:!0}),p(m)}this.#te=()=>{i.forEach(m=>m()),s!==null&&a.clearTimeout(s),u()}}#lt(e,t,n,r,a,i=!1){let c=e.querySelector(".source-code")?.dataset.children===String(r);if(e.querySelectorAll(".source-toggle").forEach(h=>{h.setAttribute("aria-expanded","false");let u=h.dataset.showLabel;u&&(h.setAttribute("aria-label",u),h.title=u)}),e.querySelector(".source-code")?.remove(),e.classList.remove("source-open"),c)return;e.classList.add("source-open"),t.setAttribute("aria-expanded","true");let l=t.dataset.hideLabel;l&&(t.setAttribute("aria-label",l),t.title=l);let d=this.ownerDocument.createElement("section");d.className="source-code",d.id=a,d.dataset.children=String(r),d.setAttribute("aria-label",i?"Element HTML":r?"Element HTML with children":"Element HTML without children");let p=this.ownerDocument.createElement("p");p.className="source-code-label",p.textContent=i?K(n):r?`${K(n)} with children`:`${K(n)} without children`;let b=n.cloneNode(r);d.append(p,ce(b.outerHTML,"html",this.ownerDocument)),e.append(d)}#dt(e,t){if(!t.quads.length){let f=document.createElement("p");f.className="empty",f.textContent="No asserted IA2 statements were found in the document light tree.",e.append(f);return}let n=document.createElement("div");n.className="navigator-tools";let r=document.createElement("div");r.className="navigator-filter";let a=document.createElement("label");a.className="sr-only",a.htmlFor="ia2-navigator-search",a.textContent="Filter RDF statements";let i=document.createElement("input");i.className="navigator-search",i.id="ia2-navigator-search",i.type="search",i.placeholder="Filter statements",i.autocomplete="off",i.spellcheck=!1,i.value=this.#q,i.setAttribute("role","combobox"),i.setAttribute("aria-autocomplete","list"),i.setAttribute("aria-controls","ia2-navigator-suggestions"),i.setAttribute("aria-expanded","false");let s=document.createElement("div");s.className="navigator-search-group";let c=document.createElement("ul");c.className="typeahead",c.id="ia2-navigator-suggestions",c.setAttribute("role","listbox"),c.setAttribute("aria-label","Semantic term suggestions"),c.hidden=!0;let l=document.createElement("span");l.className="sr-only typeahead-status",l.setAttribute("role","status"),l.setAttribute("aria-live","polite");let d=document.createElement("output");d.className="filter-count",d.setAttribute("for",i.id),d.setAttribute("aria-live","polite");let p=document.createElement("div");p.innerHTML=gt({current:this.#p,controlClass:"sync-control",labels:{page:"Follow page viewport in Navigator",panel:"Follow Navigator in page"},optionClass:"sync-option",switchClass:"sync-switch"});let b=p.firstElementChild,h=b.querySelector(".sync-switch");s.append(i,c,d,l),r.append(a,s,b),n.append(r),e.append(n);let u=xo(t),m=bo(t),x=new Map,v=()=>{};if(u.length){let f=document.createElement("nav");f.className="vocabularies",f.setAttribute("aria-label","Namespaces used in this document");let C=document.createElement("p");C.className="vocabularies-label",C.textContent="Namespaces";let R=document.createElement("div");R.className="vocabulary-links";for(let I of u){let L=document.createElement("span");L.className="vocabulary-control";let $=document.createElement("button");$.className="vocabulary-toggle",$.type="button",$.dataset.namespace=I.namespace;let O=document.createElement("span");O.className="vocabulary-name",O.textContent=I.label;let G=document.createElement("span");G.className="vocabulary-count",G.setAttribute("aria-hidden","true"),G.textContent=String(I.count),$.append(O,G),$.addEventListener("click",()=>{this.#y.has(I.namespace)?this.#y.delete(I.namespace):this.#y.add(I.namespace),v()}),x.set(I.namespace,$);let V=document.createElement("a");V.className="vocabulary-link",V.href=I.namespace,V.target="_blank",V.rel="noopener noreferrer",V.title=`Open ${I.namespace} in a new tab`,V.setAttribute("aria-label",`Open ${I.namespace} in a new tab`);let J=document.createElement("span");J.className="external-mark",J.setAttribute("aria-hidden","true"),J.textContent="\u2197",V.append(J),L.append($,V),R.append(L)}f.append(C,R),n.append(f);let A=()=>{let I=Math.max(R.scrollWidth-R.clientWidth,0);f.dataset.overflowLeft=String(R.scrollLeft>1),f.dataset.overflowRight=String(R.scrollLeft<I-1)};R.addEventListener("scroll",A,{passive:!0}),R.addEventListener("pointerenter",A),R.addEventListener("focusin",A);let z=this.ownerDocument.defaultView?.ResizeObserver;z&&(this.#N=new z(()=>A()),this.#N.observe(R)),queueMicrotask(A)}let M=document.createElement("ol");M.className="navigator";let w=new Set(t.quads.map(f=>f.source)),y=new Map,E=new Map,g=[];t.quads.forEach((f,C)=>{let R=document.createElement("li");R.className="quad";let A=co(f.source,w),z=Math.min(A,6);if(R.dataset.depth=String(A),R.style.setProperty("--rdf-indent",`${z*16}px`),A>0){let P=document.createElement("span");P.className="structure-marker",P.setAttribute("aria-hidden","true"),P.textContent="\u21B3",R.append(P)}let I=document.createElement("div");I.className="quad-terms";let L=P=>this.#Y(P),$=de(document,f.subject,"","subject",L,t.sourceDocumentIri,y,E),O=de(document,f.predicate,"   ","predicate",L,t.sourceDocumentIri,y,E),G=de(document,f.object,"   ","object",L,t.sourceDocumentIri,y,E);if(I.append($,O,G),f.graph){let P=document.createElement("div");P.className="graph",P.append("Graph: ",de(document,f.graph,"","",L,t.sourceDocumentIri,y,E)),I.append(P)}let V=new Set([f.subject,f.predicate,f.object,f.graph].filter(P=>P!==null).map(P=>Ne(document,P,t.sourceDocumentIri,y,E)).filter(P=>P!==null)),J=`ia2-source-${C}`,ae=document.createElement("div");ae.className="preview-actions",ae.setAttribute("role","group"),ae.setAttribute("aria-label",`Actions for ${K(f.source)}`),ie(f.source)&&!V.has(f.source)&&ae.append(Je(document,f.source,"carrier-locate-button",L));let et=so(f.source),tt=(P,nt=!1)=>{let B=document.createElement("button");B.className="row-action-button source-toggle",B.type="button",B.dataset.children=String(P),B.setAttribute("aria-expanded","false"),B.setAttribute("aria-controls",J);let ot=nt?"":P?" with child content":" without child content",qe=`Show HTML for ${K(f.source)}${ot}`,Bt=`Hide HTML for ${K(f.source)}${ot}`;B.dataset.showLabel=qe,B.dataset.hideLabel=Bt,B.setAttribute("aria-label",qe),B.title=qe;let ve=document.createElement("span");return ve.className="source-glyph",ve.setAttribute("aria-hidden","true"),ve.textContent=P?"</>+":"</>",B.append(ve),B.addEventListener("click",()=>this.#lt(R,B,f.source,P,J,nt)),B};ae.append(tt(!1,!et)),et&&ae.append(tt(!0)),R.append(I);let De=document.createElement("div");De.className="quad-actions",De.append(ae),R.append(De),R.addEventListener("pointerleave",()=>this.#O()),M.append(R),g.push({item:R,namespaces:new Set(Ut(f).map(P=>P.namespace)),quad:f,searchText:po(f)})}),e.append(M),this.#K=g;let N=document.createElement("p");N.className="empty filter-empty",N.textContent="No statements match the active filters.",N.hidden=!0,e.append(N);let S=null;v=()=>{this.#q=i.value;let f=i.value.trim().toLocaleLowerCase(),C=0;g.forEach(({item:z,namespaces:I,quad:L,searchText:$})=>{let O=Array.from(I).every(J=>!this.#y.has(J)),G=this.#p!=="page"||lo(L.source),V=L.source===S||O&&G&&(!f||$.includes(f));z.hidden=!V,V&&(C+=1)}),x.forEach((z,I)=>{let L=!this.#y.has(I),$=u.find(G=>G.namespace===I)?.count??0,O=`${$} statement${$===1?"":"s"}`;z.setAttribute("aria-pressed",String(L)),z.setAttribute("aria-label",`${L?"Hide":"Show"} ${O} using ${I}`),z.title=z.getAttribute("aria-label")});let R=u.some(z=>this.#y.has(z.namespace)),A=!!f||R||this.#p==="page";d.textContent=A&&C!==g.length?`${C} of ${g.length}`:"",N.hidden=!A||C>0,M.hidden=A&&C===0};let T=[],k=-1,D=()=>{T=[],k=-1,c.hidden=!0,c.replaceChildren(),i.setAttribute("aria-expanded","false"),i.removeAttribute("aria-activedescendant"),l.textContent=""},q=f=>{if(!T.length)return;k=(f+T.length)%T.length;let C=Array.from(c.querySelectorAll('[role="option"]'));C.forEach((A,z)=>A.setAttribute("aria-selected",String(z===k)));let R=C[k];R&&(i.setAttribute("aria-activedescendant",R.id),R.scrollIntoView?.({block:"nearest"}))},H=f=>{i.value=f.display,this.#q=i.value,v(),D()},_=()=>{if(T=vo(m,i.value),k=-1,c.replaceChildren(),i.removeAttribute("aria-activedescendant"),!T.length||this.shadowRoot?.activeElement!==i){c.hidden=!0,i.setAttribute("aria-expanded","false"),l.textContent="";return}T.forEach((f,C)=>{let R=document.createElement("li");R.className="typeahead-option",R.id=`ia2-navigator-suggestion-${C}`,R.setAttribute("role","option"),R.setAttribute("aria-selected","false");let A=document.createElement("span");A.className="typeahead-primary";let z=document.createElement("span");if(z.className="typeahead-term",z.textContent=f.display,A.append(z),f.label&&f.label!==f.display){let $=document.createElement("span");$.className="typeahead-label",$.textContent=f.label,A.append($)}let I=wo(f),L=document.createElement("span");L.className="typeahead-meta",L.textContent=I.join(" \xB7 "),R.setAttribute("aria-label",[f.display,f.label,...I].filter(Boolean).join(", ")),R.append(A,L),R.addEventListener("pointerdown",$=>$.preventDefault()),R.addEventListener("pointermove",()=>q(C)),R.addEventListener("click",()=>H(f)),c.append(R)}),c.hidden=!1,i.setAttribute("aria-expanded","true"),l.textContent=`${T.length} semantic suggestion${T.length===1?"":"s"} available.`};i.addEventListener("input",()=>{v(),_()}),i.addEventListener("focus",_),i.addEventListener("blur",()=>{this.ownerDocument.defaultView?.setTimeout(()=>{this.shadowRoot?.activeElement!==i&&D()},0)}),i.addEventListener("keydown",f=>{if(f.key==="ArrowDown"||f.key==="ArrowUp"){if(c.hidden&&_(),!T.length)return;f.preventDefault(),f.stopPropagation(),q(k+(f.key==="ArrowDown"?1:-1));return}if(f.key==="Enter"&&k>=0){f.preventDefault(),f.stopPropagation(),H(T[k]);return}if(f.key==="Escape"&&!c.hidden){f.preventDefault(),f.stopPropagation(),D();return}f.key==="Tab"&&D()});let F=()=>{this.#ct(e,g,v,f=>{S=f,v()})},X=(f,C=!1)=>{this.#p=f,S=null,Ee(h,f,C),v(),F()};this.#W=()=>X("off"),bt(h,(f,C)=>X(f,C)),v(),F()}#pt(e){let t=this.#n;if(!t||!this.#v.count)return;let n=this.ownerDocument,r=n.createElement("div");r.className="shapes-browser";let a=n.createElement("p");a.className="shapes-intro",a.textContent="Shape definitions found in the extracted dataset. This view exposes targets, paths, groups, and constraints; it does not run SHACL validation or rules.",r.append(a);let i=n.createElement("div");i.className="shapes-tools";let s=n.createElement("input");s.className="shapes-search",s.type="search",s.placeholder="Filter shapes, paths, targets, or constraints",s.setAttribute("aria-label",s.placeholder),s.value=this.#J;let c=n.createElement("span");c.className="shapes-filter-count",i.append(s,c),r.append(i);let l=Pe(t.quads,{predicates:At,languages:[n.documentElement.lang||"en"]}),d=w=>w.label??Pt(w.term),p=w=>{let y=n.createElement("div");if(y.className="shape-value",w.termType==="Literal"){let g=n.createElement("span");if(g.className="shape-literal",g.textContent=w.value,y.append(g),w.datatype.value!==ue||w.language||w.direction){let N=n.createElement("code");N.textContent=[w.language?`@${w.language}${w.direction?`--${w.direction}`:""}`:"",w.datatype.value!==ue?j(w.datatype):""].filter(Boolean).join(" \xB7 "),y.append(N)}return y}let E=l.get(Xe(w));if(E){let g=n.createElement("span");g.className="shape-value-label",g.textContent=E,y.append(g)}return y.append(de(n,w,"","",void 0,t.sourceDocumentIri)),y},b=(w,y,E)=>{if(!E.length)return;let g=n.createElement("section");g.className="shape-block";let N=n.createElement("h4");N.textContent=y;let S=n.createElement("dl");S.className="shape-facts";let T=new Map;for(let k of E){let D=k.predicate.value,q=T.get(D)??[];q.push(k),T.set(D,q)}for(let[k,D]of T){let q=n.createElement("div");q.className="shape-fact";let H=n.createElement("dt");H.textContent=no(k);let _=n.createElement("dd");D.forEach(F=>_.append(p(F.object))),q.append(H,_),S.append(q)}g.append(N,S),w.append(g)},h=(w,y)=>{let E=n.createElement("section");E.className="shape-block";let g=n.createElement("h4");g.textContent="Definition";let N=n.createElement("dl");N.className="shape-facts";let S=n.createElement("div");S.className="shape-fact";let T=n.createElement("dt");T.textContent="Shape";let k=n.createElement("dd");if(k.append(p(y.term)),S.append(T,k),N.append(S),y.graphs.length){let D=n.createElement("div");D.className="shape-fact";let q=n.createElement("dt");q.textContent=y.graphs.length===1?"Graph":"Graphs";let H=n.createElement("dd");y.graphs.forEach(_=>H.append(p(_))),D.append(q,H),N.append(D)}E.append(g,N),w.append(E)},u=[],m=new Map;for(let w of this.#v.shapes){let y=w.group?Xe(w.group):"",E=m.get(y)??[];E.push(w),m.set(y,E)}let x=[...this.#v.groups.map(w=>({key:Xe(w.term),label:w.label??Pt(w.term)})),{key:"",label:"Ungrouped shapes"}];for(let w of x){let y=m.get(w.key)??[];if(!y.length)continue;let E=n.createElement("section");E.className="shape-group";let g=n.createElement("header");g.className="shape-group-heading";let N=n.createElement("h3");N.textContent=w.label;let S=n.createElement("span");S.className="shape-group-count",S.textContent=`${y.length} ${y.length===1?"shape":"shapes"}`,g.append(N,S);let T=n.createElement("div");T.className="shape-list";for(let k of y){let D=n.createElement("details");D.className="shape-row";let q=d(k),H=[q,j(k.term),w.label,...k.quads.flatMap(L=>[L.predicate.value,re(L.object)])].join(" ").toLocaleLowerCase();D.dataset.search=H;let _=n.createElement("summary"),F=n.createElement("span");F.className="shape-summary-copy";let X=n.createElement("span");X.className="shape-name",X.textContent=q;let f=n.createElement("span");f.className="shape-identifier",f.textContent=j(k.term);let C=n.createElement("span");C.className="shape-summary-meta";let R=n.createElement("span");if(R.className="shape-kind",R.textContent=oo(k),C.append(R),k.targets.length){let L=n.createElement("span");L.className="shape-stat",L.textContent=`${k.targets.length} ${k.targets.length===1?"target":"targets"}`,C.append(L)}if(k.paths.length){let L=n.createElement("span");L.className="shape-stat",L.textContent=`${k.paths.length} ${k.paths.length===1?"path":"paths"}`,C.append(L)}if(k.constraints.length){let L=n.createElement("span");L.className="shape-stat",L.textContent=`${k.constraints.length} ${k.constraints.length===1?"constraint":"constraints"}`,C.append(L)}F.append(X,f,C),_.append(F);let A=n.createElement("div");if(A.className="shape-detail",k.description){let L=n.createElement("p");L.className="shape-description",L.textContent=k.description,A.append(L)}let z=new Set(at(t.quads,k.term));for(let L of k.targets)L.predicate.value==="http://www.w3.org/ns/shacl#targetNode"&&L.object.termType==="NamedNode"&&z.add(L.object.value);let I=Array.from(z).flatMap(L=>{let $=Ne(n,{termType:"NamedNode",value:L},t.sourceDocumentIri);return $?[$]:[]}).filter((L,$,O)=>O.indexOf(L)===$);if(I.length){let L=n.createElement("div");L.className="shape-actions",I.slice(0,4).forEach($=>{let O=n.createElement("button");O.className="shape-locate",O.type="button",O.textContent=`\u2316 Locate ${K($)}`,O.addEventListener("click",()=>this.#Y($)),L.append(O)}),A.append(L)}h(A,k),b(A,"Targets",k.targets),b(A,"Path",k.paths),b(A,"Property shapes",k.properties),b(A,"Constraints",k.constraints),D.append(_,A),T.append(D),u.push(D)}E.append(g,T),r.append(E)}let v=n.createElement("p");v.className="shapes-empty",v.textContent="No shapes match this filter.",v.hidden=!0,r.append(v),e.append(r);let M=()=>{this.#J=s.value;let w=s.value.trim().toLocaleLowerCase(),y=0;u.forEach(E=>{let g=!w||E.dataset.search?.includes(w);E.hidden=!g,g&&(y+=1)}),r.querySelectorAll(".shape-group").forEach(E=>{E.hidden=!Array.from(E.querySelectorAll(".shape-row")).some(g=>!g.hidden)}),c.textContent=w&&y!==u.length?`${y} of ${u.length}`:`${u.length} shapes`,v.hidden=y>0};s.addEventListener("input",M),M()}#ut(e,t){if(!t.length){let r=document.createElement("p");r.className="empty",r.textContent="No extraction diagnostics. The document passed the checks implemented by this preview extractor.",e.append(r);return}let n=document.createElement("ul");n.className="diagnostics";for(let r of t){let a=document.createElement("li");a.className="diagnostic";let i=document.createElement("strong");i.textContent=`${r.severity.toUpperCase()} \xB7 ${r.code}`;let s=document.createElement("p");s.textContent=r.source?`${r.message} Source: ${K(r.source)}`:r.message,a.append(i,s),n.append(a)}e.append(n)}#ht(e){this.#re();let t=this.ownerDocument.defaultView;if(!t||!e.length)return;let n=[],r=new Map,a=null,i=(l,d,p)=>{l.addEventListener(d,p),n.push(()=>l.removeEventListener(d,p))},s=l=>{a?.cancel(),!t.matchMedia?.("(prefers-reduced-motion: reduce)").matches&&(a=l.animate?.([{outline:"2px solid transparent",outlineOffset:"7px"},{outline:"2px solid oklch(62% 0.18 294)",outlineOffset:"4px"}],{direction:"alternate",duration:520,easing:"cubic-bezier(.22,1,.36,1)",iterations:1/0})??null)},c=()=>{a?.cancel(),a=null};for(let l of e){let d=r.get(l.target)??[];d.push(l.item),r.set(l.target,d),i(l.item,"pointerenter",()=>s(l.target)),i(l.item,"pointerleave",c)}r.forEach((l,d)=>{i(d,"pointerenter",()=>{l.forEach(p=>{p.classList.add("is-corresponding"),p.scrollIntoView?.({block:"nearest"})})}),i(d,"pointerleave",()=>l.forEach(p=>p.classList.remove("is-corresponding")))}),this.#ne=()=>{n.forEach(l=>l()),c()}}#mt(e){let t=this.ownerDocument,n=this.#m?.sourceDocumentIri??t.URL,r=[],a=t.createElement("p");a.className="ontology-intro",a.textContent="Classes and properties defined by this document. The trees follow RDFS hierarchy statements; muted parent terms provide external context.",e.append(a);let i=(s,c,l)=>{if(!c.length)return;let d=t.createElement("section");d.className="ontology-section",d.setAttribute("aria-label",s);let p=t.createElement("div");p.className="ontology-heading";let b=t.createElement("h3");b.textContent=s;let h=t.createElement("span");h.className="ontology-count",h.textContent=`${c.length} defined`,p.append(b,h),d.append(p);let u=new Map(c.map(S=>[S.term.value,S])),m=new Map,x=S=>l==="class"?S.classParents:S.propertyParents;for(let S of c)for(let T of x(S)){let k=m.get(T.value)??[];k.some(D=>D.term.value===S.term.value)||k.push(S),m.set(T.value,k)}let v=S=>[...S].sort((T,k)=>(T.label??T.term.value).localeCompare(k.label??k.term.value));m.forEach((S,T)=>m.set(T,v(S)));let M=new Set,w=S=>this.#Y(S),y=(S,T,k,D=!1)=>{let q=t.createElement("li");q.className="ontology-node";let H=t.createElement("div");H.className=`ontology-term-row${T?"":" ontology-context"}`,H.dataset.term=S.value;let _=t.createElement("div");if(_.className="ontology-term-copy",_.append(de(t,S,"","",void 0,n)),T?.label){let f=t.createElement("div");f.className="ontology-label",f.textContent=T.label,_.append(f)}let F=t.createElement("div");if(F.className="ontology-meta",T?D?F.textContent="Cycle reference":T.types.length&&(F.textContent=T.types.map(f=>j(f)).join(" \xB7 ")):F.textContent="External parent",F.textContent&&_.append(F),H.append(_),T){M.add(T.term.value);let f=mo(t,T,n);if(f){let C=t.createElement("div");C.className="ontology-actions",C.append(Je(t,f,"ontology-locate-button",w)),H.append(C),r.push({item:H,target:f})}}if(q.append(H),D)return q;let X=m.get(S.value)??[];if(X.length){let f=t.createElement("ul");f.className="ontology-children";let C=new Set(k);C.add(S.value);for(let R of X)f.append(y(R.term,R,C,C.has(R.term.value)));q.append(f)}return q},E=t.createElement("ul");E.className="ontology-tree";let g=new Map;for(let S of c)for(let T of x(S))u.has(T.value)||g.set(T.value,T);for(let S of Array.from(g.values()).sort((T,k)=>T.value.localeCompare(k.value)))E.append(y(S,null,new Set));let N=v(c.filter(S=>x(S).length===0));for(let S of N)E.append(y(S.term,S,new Set));for(let S of c)M.has(S.term.value)||E.append(y(S.term,S,new Set));d.append(E),e.append(d)};i("Classes",this.#L.classes,"class"),i("Properties",this.#L.properties,"property"),this.#ht(r)}#ft(e){let t=this.ownerDocument,n=t.createElement("p");n.className="discovery-intro",n.textContent="Additional knowledge advertised by this document. Loading is explicit, sends no credentials or referrer, does not run scripts, and keeps the retrieved contribution in a separate named graph.",e.append(n);let r=t.createElement("ul");r.className="discovery-list";for(let a of this.#k){let i=this.#a.get(a.id),s=i?.status??"available",c=t.createElement("li");c.className="discovery-item",c.dataset.candidateId=a.id;let l=t.createElement("div");l.className="discovery-copy";let d=t.createElement("a");d.className="discovery-target",d.href=a.target.value,d.target="_blank",d.rel="noopener noreferrer",d.textContent=a.target.value,d.title=`Open ${a.target.value} in a new tab`;let p=t.createElement("p");p.className="discovery-context",p.textContent=`About ${j(a.context)}`,l.append(d,p);let b=t.createElement("div");b.className="discovery-meta";for(let x of a.predicates){let v=t.createElement("span");v.className="discovery-chip",v.textContent=j(x),v.title=x.value,b.append(v)}for(let x of a.roles){let v=t.createElement("span");v.className="discovery-chip role",v.textContent=j(x),v.title=x.value,b.append(v)}if(a.graph){let x=t.createElement("span");x.className="discovery-chip",x.textContent=`graph ${j(a.graph)}`,b.append(x)}b.childElementCount&&l.append(b);let h=t.createElement("div");h.className="discovery-state";let u=t.createElement("span");if(u.className="discovery-status",u.dataset.state=s,i||(u.textContent="Available"),i?.status==="loading"&&(u.textContent="Retrieving HTML/RDF\u2026"),i?.status==="error"&&(u.textContent=i.message??"Retrieval failed."),i?.status==="loaded"){let x=i.contribution?.result.quads.length??0;u.textContent=`${x} statement${x===1?"":"s"} loaded`}let m=t.createElement("button");m.className="discovery-action",m.type="button",m.dataset.candidateId=a.id,m.dataset.state=s,i||(m.textContent="Load"),i?.status==="loading"&&(m.textContent="Cancel"),i?.status==="error"&&(m.textContent="Retry"),i?.status==="loaded"&&(m.textContent="Remove"),m.setAttribute("aria-describedby",`${a.id}-status`),u.id=`${a.id}-status`,m.addEventListener("click",()=>void this.#Qe(a)),h.append(u,m),c.append(l,h),r.append(c)}e.append(r)}#gt(e){let t=this.ownerDocument.createElement("p");t.className="sources-intro",t.textContent="Inspect one document at a time. Sources remain separate so blank nodes, bases, and document identity are not silently merged.";let n=this.ownerDocument.createElement("ul");n.className="source-list";for(let r of this.#r){let a=this.ownerDocument.createElement("li");a.className="source-item";let i=this.ownerDocument.createElement("label");i.className="source-option";let s=this.ownerDocument.createElement("input");s.className="source-input",s.type="radio",s.name="ia2-navigator-source",s.checked=r.id===this.#i,s.dataset.sourceId=r.id,s.addEventListener("change",()=>this.#Xe(r.id));let c=this.ownerDocument.createElement("span");c.className="source-copy";let l=this.ownerDocument.createElement("strong");l.className="source-title",l.textContent=r.label;let d=this.ownerDocument.createElement("span");d.className="source-url",d.textContent=r.url;let p=this.ownerDocument.createElement("span");p.className="source-access";let b=r.access==="direct"?"DOM correlation available":"Collected from an isolated frame; source locations are read-only";p.textContent=`${r.origin} \xB7 ${b}`,c.append(l,d,p);let h=this.ownerDocument.createElement("span");h.className="source-count",h.textContent=`${r.result.quads.length} statement${r.result.quads.length===1?"":"s"}`,i.append(s,c,h),a.append(i),n.append(a)}e.append(t,n)}#X(){let e=this.#ce();this.#h(),e&&queueMicrotask(()=>this.#le(e))}#bt(e,t){if(!t){let n=this.ownerDocument.createElement("span");n.className="sparql-unbound",n.textContent="\u2014",e.append(n);return}if(t.termType==="NamedNode"||t.termType==="BlankNode"){let n=this.#A.get(`${t.termType}:${t.value}`);if(t.termType==="BlankNode"&&!n){let i=this.ownerDocument.createElement("code");i.textContent=`_:${t.value}`,e.append(i);return}let r=this.ownerDocument.createElement("span");r.className="sparql-resource-term";let a=t.termType==="NamedNode"?this.ownerDocument.createElement("a"):this.ownerDocument.createElement("span");if(a.className="sparql-resource-label",a.textContent=n??go(t.value),a instanceof HTMLAnchorElement){let i=Me(t.value),s=this.#n?.sourceDocumentIri??this.ownerDocument.URL,c=ge(this.ownerDocument,t.value,s);a.dataset.semanticIri=t.value,a.href=this.#n?uo(t.value,this.#n):t.value,c?(a.classList.add("local-term"),a.addEventListener("click",l=>this.#st(t.value,l))):(a.target="_blank",a.rel="noopener noreferrer"),a.title=t.value,a.setAttribute("aria-label",`${a.textContent} (${i})`)}else a.title=`_:${t.value}`;r.append(a),e.append(r);return}if(t.termType==="DefaultGraph"){let n=this.ownerDocument.createElement("code");n.textContent="default graph",e.append(n)}else if(t.termType==="Literal"){let n=this.ownerDocument.createElement("span");n.className="sparql-literal";let r=this.ownerDocument.createElement("span");r.className="sparql-literal-value",r.textContent=t.value||"Empty string";let a=t.language?`@${t.language}${t.direction?`--${t.direction}`:""}`:t.datatype&&t.datatype!==ue?`^^${j({termType:"NamedNode",value:t.datatype})}`:"";if(n.append(r),a){let i=this.ownerDocument.createElement("code");i.className="sparql-literal-qualifier",i.textContent=a,n.append(i)}e.append(n)}else{let n=this.ownerDocument.createElement("code");n.textContent=t.value,e.append(n)}}#vt(e,t,n){let r=this.ownerDocument.createElement("div");r.className="sparql-table-wrap";let a=this.ownerDocument.createElement("table");a.className="sparql-table";let i=a.createTHead().insertRow();for(let c of t){let l=this.ownerDocument.createElement("th");l.scope="col",l.textContent=`?${c}`,i.append(l)}let s=a.createTBody();for(let c of n){let l=s.insertRow();for(let d of t)this.#bt(l.insertCell(),c[d])}r.append(a),e.append(r)}#$e(e,t,n,r){let a=this.ownerDocument.createElement("p");a.className="sparql-summary";let i=this.ownerDocument.createElement("div");i.className="sparql-result-body",e.append(a,i);let s=n.length>qt[0],c=null,l=null,d=null,p=null;if(s){let h=this.ownerDocument.createElement("nav");h.className="sparql-pagination",h.setAttribute("aria-label","SPARQL result pages");let u=this.ownerDocument.createElement("label");u.className="sparql-page-size-label",u.append("Rows per page"),c=this.ownerDocument.createElement("select"),c.className="sparql-page-size";for(let m of qt){let x=this.ownerDocument.createElement("option");x.value=String(m),x.textContent=String(m),x.selected=m===this.#S,c.append(x)}u.append(c),p=this.ownerDocument.createElement("p"),p.className="sparql-page-status",p.setAttribute("aria-live","polite"),l=this.ownerDocument.createElement("button"),l.className="sparql-page-button sparql-page-previous",l.type="button",l.textContent="Previous",d=this.ownerDocument.createElement("button"),d.className="sparql-page-button sparql-page-next",d.type="button",d.textContent="Next",h.append(u,p,l,d),e.append(h)}let b=()=>{let h=Math.max(1,Math.ceil(n.length/this.#S));this.#s=Math.min(Math.max(0,this.#s),h-1);let u=this.#s*this.#S,m=Math.min(u+this.#S,n.length);a.textContent=s?`Showing ${u+1} to ${m} of ${n.length} ${r}${n.length===1?"":"s"}`:`${n.length} ${r}${n.length===1?"":"s"}`,i.replaceChildren(),n.length&&this.#vt(i,t,n.slice(u,m)),p&&(p.textContent=`Page ${this.#s+1} of ${h}`),l&&(l.disabled=this.#s===0),d&&(d.disabled=this.#s===h-1)};c?.addEventListener("change",()=>{let h=this.#s*this.#S;this.#S=Number(c?.value)||Dt,this.#s=Math.floor(h/this.#S),b()}),l?.addEventListener("click",()=>{this.#s-=1,b()}),d?.addEventListener("click",()=>{this.#s+=1,b()}),b()}#he(e){if(e.className="sparql-output",this.#t.status==="idle"){let n=this.ownerDocument.createElement("p");n.className="sparql-status",n.textContent="Run the query to inspect its results.",e.append(n);return}if(this.#t.status==="running"){let n=this.ownerDocument.createElement("p");n.className="sparql-status",n.setAttribute("role","status"),n.textContent="Running locally\u2026",e.append(n);return}if(this.#t.status==="error"){let n=this.ownerDocument.createElement("p");n.className="sparql-status",n.dataset.state="error",n.setAttribute("role","alert"),n.textContent=this.#t.error||"The query could not be run.",e.append(n);return}let t=this.#t.result;if(t){if(t.kind==="ask"){let n=this.ownerDocument.createElement("p");n.className="sparql-summary",n.textContent="ASK result";let r=this.ownerDocument.createElement("p");r.className="sparql-boolean",r.textContent=String(t.value),e.append(n,r);return}if(t.kind==="bindings"){this.#$e(e,t.variables,t.rows,"result");return}this.#$e(e,["subject","predicate","object","graph"],t.quads,"statement")}}async#Pe(){let e=this.#x.trim();if(!e||!this.#n||this.#t.status==="running")return;let t=++this.#b,n=this.#n;this.#s=0,this.#t={status:"running"},this.#X();try{let{executeSparql:r}=await import("./chunks/sparql-engine-FOALRXFP.js"),a=await r(e,n);if(t!==this.#b)return;this.#t={result:a,status:"success"},this.#g=_t(a,this.#A)}catch(r){if(t!==this.#b)return;this.#t={error:r instanceof Error?r.message:"The query could not be run.",status:"error"},this.#g=""}this.#X()}#wt(e){let t=this.ownerDocument.createElement("div");t.className="sparql-workbench";let n=this.ownerDocument.createElement("p");if(n.className="sparql-intro",n.textContent=this.#f.length?"Choose a query suggested by this document or write your own. Suggestions are RDF resources, not Navigator configuration.":"Write a SPARQL query against the RDF currently extracted from this document.",t.append(n),this.#Z.length>0){let v=this.ownerDocument.createElement("p");v.className="sparql-status",v.dataset.state="error",v.setAttribute("role","alert"),v.textContent=this.#Z.join(" "),t.append(v)}if(this.#f.length){let v=this.ownerDocument.createElement("div");v.className="sparql-catalog";let M=this.ownerDocument.createElement("label");M.className="sparql-label",M.htmlFor="ia2-sparql-suggestion",M.textContent="Suggested query";let w=this.ownerDocument.createElement("select");w.id="ia2-sparql-suggestion",w.className="sparql-select sparql-suggestion";let y=this.ownerDocument.createElement("option");y.value="",y.textContent="Custom query",w.append(y);for(let g of this.#f){let N=this.ownerDocument.createElement("option");N.value=g.id,N.textContent=g.label,N.selected=g.id===this.#w,w.append(N)}w.addEventListener("change",()=>{this.#w=w.value;let g=this.#f.find(({id:N})=>N===w.value);g?this.#x=g.query:this.#x=Ye,this.#s=0,this.#t={status:"idle"},this.#g="",this.#X()}),v.append(M,w);let E=this.ownerDocument.createElement("p");E.className="sparql-description",E.textContent=this.#f.find(({id:g})=>g===this.#w)?.description??"",v.append(E),t.append(v)}let r=this.ownerDocument.createElement("label");r.className="sparql-catalog";let a=this.ownerDocument.createElement("span");a.className="sparql-label",a.textContent="SPARQL query";let i=this.ownerDocument.createElement("div");i.className="sparql-editor-shell";let s=ce(this.#x,"sparql",this.ownerDocument);s.className="sparql-highlight",s.setAttribute("aria-hidden","true");let c=this.ownerDocument.createElement("textarea");c.className="sparql-editor",c.autocapitalize="off",c.autocomplete="off",c.spellcheck=!1,c.wrap="soft",c.value=this.#x,c.setAttribute("aria-keyshortcuts","Control+Enter Meta+Enter");let l=()=>{let v=ce(c.value,"sparql",this.ownerDocument);s.replaceChildren(...v.childNodes),s.scrollTop=c.scrollTop};c.addEventListener("input",()=>{if(this.#x=c.value,l(),this.#f.find(({id:M})=>M===this.#w)?.query!==c.value){this.#w="";let M=t.querySelector(".sparql-suggestion");M&&(M.value="");let w=t.querySelector(".sparql-description");w&&(w.textContent="")}if(this.#t.status!=="idle"){this.#b+=1,this.#s=0,this.#t={status:"idle"},this.#g="";let M=t.querySelector(".sparql-output");M&&(M.replaceChildren(),this.#he(M))}}),c.addEventListener("scroll",()=>{s.scrollTop=c.scrollTop,c.scrollLeft=0}),c.addEventListener("keydown",v=>{v.key!=="Enter"||!v.ctrlKey&&!v.metaKey||(v.preventDefault(),this.#Pe())}),i.append(s,c),r.append(a,i),t.append(r);let d=this.ownerDocument.createElement("div");d.className="sparql-actions";let p=this.ownerDocument.createElement("button");p.className="sparql-run",p.type="button",p.disabled=this.#t.status==="running",p.textContent=this.#t.status==="running"?"Running\u2026":"Run query",p.addEventListener("click",()=>void this.#Pe());let b=this.ownerDocument.createElement("button");b.className="sparql-reset",b.type="button",b.textContent="Reset",b.addEventListener("click",()=>{this.#w="",this.#x=Ye,this.#b+=1,this.#s=0,this.#t={status:"idle"},this.#g="",this.#X()});let h=this.ownerDocument.createElement("label");h.className="sparql-observe";let u=this.ownerDocument.createElement("input");u.className="sparql-observe-input",u.type="checkbox",u.checked=this.#U,u.addEventListener("change",()=>{this.#U=u.checked,this.#U&&this.#Me()}),h.append(u,"Observe changes");let m=this.ownerDocument.createElement("p");m.className="sparql-safety",m.textContent="Local dataset \xB7 Read-only",d.append(p,b,h,m),t.append(d);let x=this.ownerDocument.createElement("section");x.setAttribute("aria-label","SPARQL results"),x.setAttribute("aria-live","polite"),this.#he(x),t.append(x),e.append(t)}#h(){this.#G(),this.#ue(),this.#ie(),this.#O(),this.#W=null,this.#Q(),this.#re(),this.#N?.disconnect(),this.#N=null,this.#E?.disconnect(),this.#E=null,this.#K=[],this.#oe=!1;let e=this.#n;if(!e||!this.shadowRoot)return;this.#e==="diagnostics"&&!e.diagnostics.length&&(this.#e="navigator"),this.#e==="discovery"&&!this.#k.length&&(this.#e="navigator"),this.#e==="vocabulary"&&!this.#L.count&&(this.#e="navigator"),this.#e==="shapes"&&!this.#v.count&&(this.#e="navigator"),this.#e==="sources"&&this.#r.length<=1&&(this.#e="navigator");let t=this.#r.find(p=>p.id===this.#i)??this.#r[0],n=this.#Ne();this.shadowRoot.innerHTML=`
      <style>${Pn}</style>
      <button class="launcher" type="button" data-position="${this.#c}" aria-expanded="${this.#o}" aria-controls="ia2-rdf-panel" title="Open RDF Navigator. Drag to move."${this.hasAttribute("data-ia2-extension")?" hidden":""}>
        <span class="mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="2.6" fill="currentColor"/><circle cx="18.5" cy="5" r="2.6" fill="currentColor"/><circle cx="18.5" cy="19" r="2.6" fill="currentColor"/><path d="M7.2 10.8 16 6.2M7.2 13.2 16 17.8" stroke="currentColor" stroke-width="1.8"/></svg></span>
        <span>RDF</span><span class="count">${n}</span>
      </button>
      <aside class="panel ia2-window-surface" id="ia2-rdf-panel" data-open="${this.#o}" data-position="${this.#c}" aria-label="Document RDF" tabindex="-1">
        <header class="toolbar">
          <span class="drag-grip" aria-hidden="true" title="Drag floating navigator"><svg viewBox="0 0 8 18"><circle cx="2" cy="4" r="1.2"/><circle cx="6" cy="4" r="1.2"/><circle cx="2" cy="9" r="1.2"/><circle cx="6" cy="9" r="1.2"/><circle cx="2" cy="14" r="1.2"/><circle cx="6" cy="14" r="1.2"/></svg></span>
          <div class="tabs" role="tablist" aria-label="RDF views" data-compact="0">
            ${ne("navigator",this.#e==="navigator","Navigator","Nav")}
            ${this.#r.length>1?ne("sources",this.#e==="sources","Sources","Sources",this.#r.length,"document"):""}
            ${this.#L.count?ne("vocabulary",this.#e==="vocabulary","Vocabulary","Vocab",this.#L.count,"definition"):""}
            ${this.#v.count?ne("shapes",this.#e==="shapes","Shapes","Shapes",this.#v.count,"shape"):""}
            ${this.#k.length?ne("discovery",this.#e==="discovery","Discovery","Discover",this.#k.length,"candidate"):""}
            ${ne("sparql",this.#e==="sparql","SPARQL","Query",this.#f.length||void 0,"suggested query")}
            ${ne("turtle",this.#e==="turtle","Turtle","TTL")}
            ${ne("json",this.#e==="json","JSON-LD","JSON")}
            ${e.diagnostics.length?ne("diagnostics",this.#e==="diagnostics","Diagnostics","Issues",e.diagnostics.length,"diagnostic"):""}
          </div>
          <div class="header-actions">
            ${ht({ariaLabel:"Drawer position",current:this.#c,groupClass:"position-switch",optionClass:"position-option"})}
            <button class="icon-button refresh" type="button" aria-label="Refresh extraction" title="Refresh extraction">\u21BB</button><button class="icon-button close" type="button" aria-label="Close RDF Navigator" title="Close">\xD7</button>
          </div>
        </header>
        <section class="viewport" role="tabpanel" tabindex="0"></section>
        <footer class="footer"><span>RDF 1.2 \xB7 ${t?.label??"Document"}</span>${this.#e==="turtle"||this.#e==="json"?'<button class="copy" type="button">Copy view</button>':""}</footer>
        <div class="resize-handles" aria-hidden="true">
          ${["n","ne","e","se","s","sw","w","nw"].map(p=>`<span class="resize-handle" data-resize="${p}"></span>`).join("")}
        </div>
        <p class="sr-only" aria-live="polite">${this.#T}</p>
      </aside>`;let r=this.shadowRoot.querySelector(".viewport"),a=this.shadowRoot.querySelector(".tabs");if(this.#je(a),!r)return;if(this.#o&&this.#e==="turtle"&&r.append(ce(he(e),"turtle",document)),this.#o&&this.#e==="json"){if($e(e)){let p=document.createElement("p");p.className="notice",p.textContent="JSON-LD 1.1 has no native RDF 1.2 triple-term syntax. This view preserves triple terms as typed JSON literals; use Turtle for the semantic form.",r.append(p)}r.append(ce(me(e),"json",document))}this.#o&&this.#e==="navigator"&&this.#dt(r,e),this.#o&&this.#e==="sources"&&this.#gt(r),this.#o&&this.#e==="vocabulary"&&this.#mt(r),this.#o&&this.#e==="shapes"&&this.#pt(r),this.#o&&this.#e==="discovery"&&this.#ft(r),this.#o&&this.#e==="sparql"&&this.#wt(r),this.#o&&this.#e==="diagnostics"&&this.#ut(r,e.diagnostics),this.#oe=this.#o;let i=this.shadowRoot.querySelector(".launcher");i&&(this.#_(i),i.addEventListener("pointerdown",p=>this.#rt(p,i)),i.addEventListener("click",p=>{if(this.#V){p.preventDefault(),this.#V=!1;return}this.toggle(p instanceof MouseEvent&&p.detail!==0?"panel":"tab")})),this.shadowRoot.querySelector(".close")?.addEventListener("click",()=>this.close()),this.shadowRoot.querySelector(".refresh")?.addEventListener("click",()=>this.refresh());let s=this.shadowRoot.querySelector(".position-switch"),c=Array.from(this.shadowRoot.querySelectorAll(".position-option")),l=this.shadowRoot.querySelector(".panel"),d=(p,b=!1)=>{this.#c=p;let h=this.shadowRoot?.querySelector(".launcher");l&&(l.dataset.position=this.#c,p==="floating"?this.#j(l):this.#nt(l)),h&&(h.dataset.position=this.#c,this.#_(h));for(let u of c){let m=u.dataset.position===this.#c;u.setAttribute("aria-checked",String(m)),u.tabIndex=m?0:-1,m&&b&&u.focus()}this.#D()};if(l){this.#c==="floating"&&this.#j(l);let p=l.querySelector(".toolbar"),b=p?.querySelector(".tabs");p?.addEventListener("pointerdown",h=>{let u=h.target instanceof Element?h.target:null;u!==p&&u!==b&&!u?.closest(".drag-grip")||this.#De(h,l)}),l.querySelectorAll(".resize-handle").forEach(h=>{h.addEventListener("pointerdown",u=>{this.#De(u,l,h.dataset.resize)})})}s&&mt(s,(p,b)=>{d(p,b)}),this.shadowRoot.querySelector(".copy")?.addEventListener("click",()=>void this.#it()),this.shadowRoot.querySelectorAll("[data-view]").forEach(p=>{p.addEventListener("click",()=>this.#at(p.dataset.view))}),this.#Ue()}};customElements.get("ia2-rdf-navigator")||customElements.define("ia2-rdf-navigator",be);function To(o=document){let e=o.querySelector("ia2-rdf-navigator");if(e)return e;let t=o.createElement("ia2-rdf-navigator");return o.body.append(t),t}function Vt(){window.__IA2_RDF_NAVIGATOR_NO_AUTO__||To()}typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Vt,{once:!0}):Vt());export{lt as DISCOVERY_PREDICATES,be as Ia2RdfNavigator,ze as detectDiscoveryCandidates,se as extractDataset,Ge as extractDocumentVocabulary,We as extractShaclCatalog,Nn as extractSuggestedSparqlQueries,ke as extractSuggestedSparqlQueryCatalog,_e as fromPortableExtractionResult,He as mergeDiscoveryContributions,To as mountRdfNavigator,me as serializeJsonLd,he as serializeTurtle,rt as termToTurtle,un as toPortableExtractionResult};
