import{c as De,d as de,e as ae,f as qe,g as nt,h as pe,i as ue,j as Ae,k as O,l as be,m as X,n as Ie,o as ot}from"./chunks/chunk-37NUEJFD.js";var Vt="http://www.w3.org/2000/01/rdf-schema#seeAlso",Bt="http://www.w3.org/2000/01/rdf-schema#isDefinedBy",Wt="http://purl.org/dc/terms/requires",Kt="http://purl.org/dc/terms/source",Qt="http://www.w3.org/ns/prov#wasDerivedFrom",Gt="http://www.w3.org/2002/07/owl#imports",Yt="http://www.w3.org/ns/dcat#qualifiedRelation",Xt="http://purl.org/dc/terms/relation",Jt="http://www.w3.org/ns/dcat#hadRole",st=new Set([Vt,Bt,Wt,Kt,Qt,Gt]);function J(o){return o?`${o.termType}:${o.value}`:"default"}function rt(o,e){return J(o)===J(e)}function at(o){try{let e=new URL(o);return e.hash="",e.href}catch{return o.replace(/#.*$/s,"")}}function Zt(o){let e=2166136261;for(let t=0;t<o.length;t+=1)e^=o.charCodeAt(t),e=Math.imul(e,16777619);return`discovery-${(e>>>0).toString(36)}`}function it(o,e){o.some(t=>t.value===e.value)||o.push(e)}function en(o,e){o.some(t=>J(t)===J(e))||o.push(e)}function ve(o,e){o.includes(e)||o.push(e)}function $e(o){let e=new Map,t=at(o.sourceDocumentIri),n=(r,a,i)=>{if(at(a.value)===t)return null;let s=`${J(r)}|${J(i)}|${a.value}`,c=e.get(s);return c||(c={context:r,graph:i,id:Zt(s),predicates:[],qualifiedRelationships:[],roles:[],sources:[],target:a},e.set(s,c)),c};for(let r of o.quads){if(!st.has(r.predicate.value)||r.object.termType!=="NamedNode")continue;let a=n(r.subject,r.object,r.graph);a&&(it(a.predicates,r.predicate),ve(a.sources,r.source))}for(let r of o.quads){if(r.predicate.value!==Yt||r.object.termType!=="NamedNode"&&r.object.termType!=="BlankNode")continue;let a=r.object,i=o.quads.filter(l=>rt(l.subject,a)&&rt(l.graph,r.graph)),s=i.filter(l=>l.predicate.value===Xt&&l.object.termType==="NamedNode"),c=i.filter(l=>l.predicate.value===Jt&&l.object.termType==="NamedNode");for(let l of s){if(l.object.termType!=="NamedNode")continue;let d=n(r.subject,l.object,r.graph);if(d){en(d.qualifiedRelationships,a),ve(d.sources,r.source),ve(d.sources,l.source);for(let p of c)p.object.termType==="NamedNode"&&(it(d.roles,p.object),ve(d.sources,p.source))}}}return Array.from(e.values()).sort((r,a)=>r.target.value.localeCompare(a.target.value))}function Pe(o,e){let t=[...o.quads],n=new Map(o.graphs.map(a=>[J(a),a])),r=[...o.diagnostics];for(let a of e){let i=De(a.result.sourceDocumentIri);for(let s of a.result.quads){let c=s.graph??i;t.push({...s,graph:c}),n.set(J(c),c)}for(let s of a.result.graphs)n.set(J(s),s);r.push(...a.result.diagnostics.map(s=>({...s,message:`Contribution ${a.result.sourceDocumentIri}: ${s.message}`})))}return{...o,diagnostics:r,graphs:Array.from(n.values()),quads:t}}function W(o){return o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var ze=[{position:"right",label:"Right, full height",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M13 2h5v12h-5z"/></svg>'},{position:"right-top",label:"Right, top half",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M13 2h5v5.5h-5z"/></svg>'},{position:"right-bottom",label:"Right, bottom half",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M13 8.5h5V14h-5z"/></svg>'},{position:"bottom",label:"Bottom, full width",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 9h16v5H2z"/></svg>'},{position:"floating",label:"Floating, centered",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><rect class="position-region" x="5" y="4.5" width="10" height="7" rx="1"/></svg>'},{position:"top",label:"Top, full width",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 2h16v5H2z"/></svg>'},{position:"left",label:"Left, full height",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 2h5v12H2z"/></svg>'},{position:"left-bottom",label:"Left, bottom half",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 8.5h5V14H2z"/></svg>'},{position:"left-top",label:"Left, top half",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 2h5v5.5H2z"/></svg>'}],dt=`
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
`;function we(o){return typeof o=="string"&&ze.some(({position:e})=>e===o)}function pt({allowed:o=ze.map(({position:a})=>a),ariaLabel:e,current:t,groupClass:n="",optionClass:r=""}){let a=W(n),i=W(r),s=new Set(o),c=ze.filter(({position:l})=>s.has(l)).map(({icon:l,label:d,position:p})=>`<button class="ia2-position-option ${i}" type="button" role="radio" data-position="${p}" aria-checked="${t===p}" aria-label="${W(d)}" title="${W(d)}" tabindex="${t===p?"0":"-1"}">${l}</button>`).join("");return`<div class="ia2-position-switch ${a}" role="radiogroup" aria-label="${W(e)}">${c}</div>`}function ct(o,e,t=!1){let n=Array.from(o.querySelectorAll(".ia2-position-option"));for(let r of n){let a=r.dataset.position===e;r.setAttribute("aria-checked",String(a)),r.tabIndex=a?0:-1,a&&t&&r.focus()}}function ut(o,e){let t=o instanceof HTMLElement&&o.matches(".ia2-position-switch")?o:o.querySelector(".ia2-position-switch"),n=Array.from(o.querySelectorAll(".ia2-position-option")),r=[];for(let i of n){let s=()=>{we(i.dataset.position)&&e(i.dataset.position,!1)!==!1&&ct(o,i.dataset.position)};i.addEventListener("click",s),r.push(()=>i.removeEventListener("click",s))}let a=i=>{if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(i.key))return;i.preventDefault();let s=i.target instanceof HTMLButtonElement?n.indexOf(i.target):n.findIndex(d=>d.getAttribute("aria-checked")==="true"),c=s;i.key==="Home"&&(c=0),i.key==="End"&&(c=n.length-1),(i.key==="ArrowRight"||i.key==="ArrowDown")&&(c=(s+1)%n.length),(i.key==="ArrowLeft"||i.key==="ArrowUp")&&(c=(s-1+n.length)%n.length);let l=n[c]?.dataset.position;we(l)&&e(l,!0)!==!1&&ct(o,l,!0)};return t?.addEventListener("keydown",a),r.push(()=>t?.removeEventListener("keydown",a)),()=>{for(let i of r)i()}}var ht=[{mode:"off",label:"Scroll synchronization off",icon:`<svg class="sync-icon" viewBox="0 0 32 16" aria-hidden="true" focusable="false">
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
    </svg>`}];function lt(o){return typeof o=="string"&&ht.some(({mode:e})=>e===o)}function mt({ariaLabel:o="Scroll synchronization",controlClass:e="",current:t,label:n="Sync",labels:r={},optionClass:a="",switchClass:i=""}){let s=W(e),c=W(a),l=W(i),d=ht.map(({icon:p,label:b,mode:h})=>{let u=r[h]??b;return`<button class="ia2-sync-option ${c}" type="button" role="radio" data-sync-mode="${h}" aria-checked="${t===h}" aria-label="${W(u)}" title="${W(u)}" tabindex="${t===h?"0":"-1"}">${p}</button>`}).join("");return`<div class="ia2-sync-control ${s}"><span class="ia2-sync-label sync-label">${W(n)}</span><div class="ia2-sync-switch ${l}" role="radiogroup" aria-label="${W(o)}">${d}</div></div>`}function xe(o,e,t=!1){let n=Array.from(o.querySelectorAll(".ia2-sync-option"));for(let r of n){let a=r.dataset.syncMode===e;r.setAttribute("aria-checked",String(a)),r.tabIndex=a?0:-1,a&&t&&r.focus()}}function ft(o,e){let t=o instanceof HTMLElement&&o.matches(".ia2-sync-switch")?o:o.querySelector(".ia2-sync-switch"),n=Array.from(o.querySelectorAll(".ia2-sync-option")),r=[];for(let i of n){let s=()=>{lt(i.dataset.syncMode)&&e(i.dataset.syncMode,!1)!==!1&&xe(o,i.dataset.syncMode)};i.addEventListener("click",s),r.push(()=>i.removeEventListener("click",s))}let a=i=>{if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(i.key))return;i.preventDefault();let s=i.target instanceof HTMLButtonElement?n.indexOf(i.target):n.findIndex(d=>d.getAttribute("aria-checked")==="true"),c=s;i.key==="Home"&&(c=0),i.key==="End"&&(c=n.length-1),(i.key==="ArrowRight"||i.key==="ArrowDown")&&(c=(s+1)%n.length),(i.key==="ArrowLeft"||i.key==="ArrowUp")&&(c=(s-1+n.length)%n.length);let l=n[c]?.dataset.syncMode;lt(l)&&e(l,!0)!==!1&&xe(o,l,!0)};return t?.addEventListener("keydown",a),r.push(()=>t?.removeEventListener("keydown",a)),()=>{for(let i of r)i()}}var tn=/(<https?:\/\/[^>]+>)|("(?:\\.|[^"\\])*"(?:@[A-Za-z0-9-]+(?:--(?:ltr|rtl))?|\^\^(?:<[^>]+>|[A-Za-z][\w-]*:[\w.-]+))?)|(^|\s)(@[a-z]+|[A-Za-z][\w-]*:[\w.-]+)|(_:[A-Za-z][\w-]*)|(#[^\n]*)/gim,nn=/("(?:\\.|[^"\\])*")\s*(?=:)|("(?:\\.|[^"\\])*")|\b(true|false|null)\b|\b(-?\d+(?:\.\d+)?)\b/g,on=/(#[^\n\r]*)|("""(?:\\.|[\s\S])*?"""|'''(?:\\.|[\s\S])*?'''|"(?:\\.|[^"\\])*"(?:@[A-Za-z0-9-]+|\^\^(?:<[^>]+>|[A-Za-z][\w-]*:[\w.-]+))?|'(?:\\.|[^'\\])*'(?:@[A-Za-z0-9-]+|\^\^(?:<[^>]+>|[A-Za-z][\w-]*:[\w.-]+))?)|(<[^<>"{}|^`\\\u0000-\u0020]*>)|([?$][A-Za-z_][\w-]*)|\b(ADD|ALL|AS|ASC|ASK|BASE|BIND|BY|CLEAR|CONSTRUCT|COPY|CREATE|DATA|DEFAULT|DELETE|DESC|DESCRIBE|DISTINCT|DROP|EXISTS|FILTER|FROM|GRAPH|GROUP|HAVING|IN|INSERT|LIMIT|LOAD|MINUS|MOVE|NAMED|NOT|OFFSET|OPTIONAL|ORDER|PREFIX|REDUCED|SELECT|SERVICE|SILENT|TO|UNDEF|UNION|USING|VALUES|WHERE|WITH|TRUE|FALSE|A)\b|(\b-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?\b)|((?:[A-Za-z_][\w-]*)?:[\w.-]*)|([{}()[\];,.])/gim;function Z(o,e,t,n){let r=n.createElement("span");r.className=`tok ${t}`,r.textContent=e,o.appendChild(r)}function rn(o,e,t,n){if(t==="iri"){let r=e.slice(1,-1),a=n.createElement("a");a.className="tok iri",a.textContent=e,a.href=r,a.target="_blank",a.rel="noopener noreferrer",o.appendChild(a);return}Z(o,e,t,n)}function an(o){return o[1]?"iri":o[2]?"string":o[4]?"keyword":o[5]?"blank":o[6]?"comment":"name"}function sn(o){if(o[1])return"key";if(o[2]){try{let e=JSON.parse(o[2]);if(/^https?:\/\//.test(e))return"json-iri"}catch{}return"string"}return o[3]?"keyword":"number"}function cn(o){return o[1]?"comment":o[2]?"string":o[3]?"iri":o[4]?"variable":o[5]?"keyword":o[6]?"number":o[7]?"name":"punctuation"}function gt(o,e,t){if(e.startsWith("<!--")){Z(o,e,"comment",t);return}if(/^<!doctype/i.test(e)){Z(o,e,"keyword",t);return}let n=/^(<\/?)([^\s/>]+)([\s\S]*?)(\/?>)$/.exec(e);if(!n){o.appendChild(t.createTextNode(e));return}Z(o,n[1],"punctuation",t),Z(o,n[2],"name",t);let r=n[3]??"",a=/(\s+)([^\s=]+)(?:(\s*=\s*)("[^"]*"|'[^']*'|[^\s]+))?/g,i=0,s;for(;s=a.exec(r);)o.appendChild(t.createTextNode(r.slice(i,s.index)+s[1])),Z(o,s[2],"key",t),s[3]&&o.appendChild(t.createTextNode(s[3])),s[4]&&Z(o,s[4],"string",t),i=a.lastIndex;o.appendChild(t.createTextNode(r.slice(i))),Z(o,n[4],"punctuation",t)}function ln(o,e,t){let n=0;for(;n<o.length;){let r=o.indexOf("<",n);if(r<0){e.appendChild(t.createTextNode(o.slice(n)));return}if(e.appendChild(t.createTextNode(o.slice(n,r))),o.startsWith("<!--",r)){let s=o.indexOf("-->",r+4),c=s<0?o.length:s+3;gt(e,o.slice(r,c),t),n=c;continue}let a="",i=r+1;for(;i<o.length;i+=1){let s=o[i];if(a)s===a&&(a="");else if(s==='"'||s==="'")a=s;else if(s===">"){i+=1;break}}gt(e,o.slice(r,i),t),n=i}}function ie(o,e,t){let n=t.createElement("pre"),r=t.createElement("code");if(n.append(r),e==="html")return ln(o,r,t),n;let a=e==="turtle"?new RegExp(tn):e==="sparql"?new RegExp(on):new RegExp(nn),i=0,s;for(;s=a.exec(o);){r.append(t.createTextNode(o.slice(i,s.index)));let c=e==="turtle"?an(s):e==="sparql"?cn(s):sn(s);if(c==="json-iri"){let l=t.createElement("a");l.className="tok iri",l.textContent=s[0],l.href=JSON.parse(s[0]),l.target="_blank",l.rel="noopener noreferrer",r.append(l)}else e==="sparql"&&c==="iri"?Z(r,s[0],c,t):rn(r,s[0],c,t);i=a.lastIndex}return r.append(t.createTextNode(o.slice(i))),n}function bt(o,e,t){let n=e.get(o);if(n)return n;let r=`source-${e.size+1}`;return e.set(o,r),t.push({id:r,markup:o.outerHTML}),r}function dn(o){let e=new Map,t=[];return{baseIri:o.baseIri,diagnostics:o.diagnostics.map(n=>({code:n.code,message:n.message,severity:n.severity,...n.source?{sourceId:bt(n.source,e,t)}:{}})),graphs:o.graphs,portableVersion:1,quads:o.quads.map(n=>({graph:n.graph,object:n.object,predicate:n.predicate,sourceId:bt(n.source,e,t),subject:n.subject})),retrievalDocumentIri:o.retrievalDocumentIri,sourceDocumentIri:o.sourceDocumentIri,sources:t,version:"1.2"}}function vt(o,e){let t=e.implementation.createHTMLDocument(""),n=t.createElement("template");return n.innerHTML=o,n.content.firstElementChild??t.createElement("span")}function He(o,e){if(o.portableVersion!==1||o.version!=="1.2")throw new Error("Unsupported portable Navigator source version.");let t=new Map(o.sources.map(r=>[r.id,vt(r.markup,e)])),n=r=>t.get(r)??vt("<span></span>",e);return{baseIri:o.baseIri,diagnostics:o.diagnostics.map(r=>({code:r.code,message:r.message,severity:r.severity,...r.sourceId?{source:n(r.sourceId)}:{}})),graphs:o.graphs,quads:o.quads.map(r=>({graph:r.graph,object:r.object,predicate:r.predicate,source:n(r.sourceId),subject:r.subject})),retrievalDocumentIri:o.retrievalDocumentIri,sourceDocumentIri:o.sourceDocumentIri,version:"1.2"}}var pn="http://www.w3.org/1999/02/22-rdf-syntax-ns#type",V="http://www.w3.org/ns/shacl#",un=`${V}NodeShape`,hn=`${V}PropertyShape`,mn=`${V}PropertyGroup`,St=`${V}name`,kt=`${V}description`,Oe=`${V}order`,Fe=`${V}group`,ye=`${V}path`,Ue=`${V}property`,fn=new Set([`${V}node`,`${V}not`,`${V}qualifiedValueShape`]),wt=[St,"http://purl.org/dc/terms/title","http://www.w3.org/2000/01/rdf-schema#label","http://www.w3.org/2004/02/skos/core#prefLabel","https://schema.org/name"],gn=[kt,"http://purl.org/dc/terms/description","http://www.w3.org/2000/01/rdf-schema#comment","https://schema.org/description"],bn=new Set([St,kt,Oe,Fe,ye,Ue]);function te(o){return o.termType==="NamedNode"||o.termType==="BlankNode"?`${o.termType}:${o.value}`:null}function je(o){return o.termType==="NamedNode"||o.termType==="BlankNode"?o:null}function vn(o,e){let t=te(e);o.some(n=>te(n)===t)||o.push(e)}function wn(o,e){o.includes(e)||o.push(e)}function xn(o,e){for(let t of e){let n=o.find(r=>r.predicate.value===t)?.object;if(n?.termType==="Literal")return n.value}}function xt(o,e){let t=o.find(r=>r.predicate.value===e)?.object;if(t?.termType!=="Literal")return;let n=Number(t.value);return Number.isFinite(n)?n:void 0}function _e(o){return o===`${V}target`||o.startsWith(`${V}target`)}function yt(o){if(o.termType==="BlankNode")return`Blank node ${o.value}`;try{let e=new URL(o.value),t=decodeURIComponent(e.hash.slice(1));if(t)return t;let n=e.pathname.split("/").filter(Boolean);return decodeURIComponent(n.at(-1)??o.value)}catch{return o.value}}function Et(o,e){let t=o.order??Number.POSITIVE_INFINITY,n=e.order??Number.POSITIVE_INFINITY;return t!==n?t-n:(o.label??yt(o.term)).localeCompare(e.label??yt(e.term))}function Ve(o){let e=new Map,t=new Map,n=new Set,r=new Map,a=(c,l)=>{let d=te(c);if(e.set(d,c),!l)return;let p=t.get(d);p||(p=new Set,t.set(d,p)),p.add(l)};for(let c of o.quads){let l=te(c.subject);if(c.predicate.value===pn&&c.object.termType==="NamedNode"&&(c.object.value===un&&a(c.subject,"node"),c.object.value===hn&&a(c.subject,"property"),c.object.value===mn&&r.set(l,c.subject)),_e(c.predicate.value)&&a(c.subject),c.predicate.value===ye&&a(c.subject,"property"),c.predicate.value===Ue){a(c.subject,"node");let d=je(c.object);d&&(a(d,"property"),n.add(te(d)))}if(fn.has(c.predicate.value)){a(c.subject);let d=je(c.object);d&&a(d)}if(c.predicate.value===Fe){let d=je(c.object);d&&r.set(te(d),d)}}let i=Array.from(e,([c,l])=>{let d=o.quads.filter(g=>te(g.subject)===c),p=Array.from(t.get(c)??[]);p.length||p.push(n.has(c)||d.some(g=>g.predicate.value===ye)?"property":"node");let b=d.find(g=>g.predicate.value===Fe)?.object,h=[],u=[];for(let g of d)g.graph&&vn(h,g.graph),wn(u,g.source);let m=d.filter(g=>_e(g.predicate.value)),x=d.filter(g=>g.predicate.value===ye),v=d.filter(g=>g.predicate.value===Ue),C=d.filter(g=>g.predicate.value.startsWith(V)&&!bn.has(g.predicate.value)&&!_e(g.predicate.value)),w=X(o.quads,l,{predicates:wt}),E=xn(d,gn),k=xt(d,Oe);return{constraints:C,graphs:h,kinds:p,paths:x,properties:v,quads:d,sources:u,targets:m,term:l,...E?{description:E}:{},...b&&(b.termType==="NamedNode"||b.termType==="BlankNode")?{group:b}:{},...w?{label:w}:{},...k!==void 0?{order:k}:{}}}).sort(Et),s=Array.from(r,([c,l])=>{let d=o.quads.filter(h=>te(h.subject)===c),p=X(o.quads,l,{predicates:wt}),b=xt(d,Oe);return{quads:d,term:l,...p?{label:p}:{},...b!==void 0?{order:b}:{}}}).sort(Et);return{count:i.length,groups:s,shapes:i}}var yn="http://www.w3.org/1999/02/22-rdf-syntax-ns#type",En="http://www.w3.org/2000/01/rdf-schema#comment",Sn="http://purl.org/dc/terms/description",G="http://www.w3.org/ns/shacl#",kn=new Set([`${G}SPARQLExecutable`,`${G}SPARQLSelectExecutable`,`${G}SPARQLAskExecutable`,`${G}SPARQLConstructExecutable`]),Lt=[{iri:`${G}select`,kind:"select"},{iri:`${G}ask`,kind:"ask"},{iri:`${G}construct`,kind:"construct"}];function Rt(o){return`${o.termType}:${o.value}`}function Tt(o){if(o.termType==="BlankNode")return`Query ${o.value}`;let e=o.value.match(/[#/]([^#/]+)$/)?.[1];return e?decodeURIComponent(e).replace(/[-_]+/g," ").replace(/\b\w/g,t=>t.toUpperCase()):o.value}function Ln(o,e,t){if(o.termType==="NamedNode")return Rt(o);let n=2166136261;for(let r of`${e}
${t}`)n^=r.codePointAt(0)??0,n=Math.imul(n,16777619);return`BlankNodeQuery:${(n>>>0).toString(16)}`}function Ee(o){let e=new Map,t=a=>{let i=Rt(a),s=e.get(i);return s||(s={executable:!1,queries:{},subject:a},e.set(i,s)),s};for(let a of o.quads){let i=t(a.subject);if(a.predicate.value===yn&&a.object.termType==="NamedNode"&&kn.has(a.object.value)&&(i.executable=!0),a.object.termType!=="Literal")continue;let s=Lt.find(({iri:c})=>c===a.predicate.value);if(s&&(i.queries[s.kind]=a.object.value.trim()),[Sn,En,`${G}description`].includes(a.predicate.value)&&(i.description??=a.object.value.trim()),a.predicate.value===`${G}order`){let c=Number(a.object.value);Number.isFinite(c)&&(i.order=c)}}let n=[],r=Array.from(e.values()).flatMap(a=>{if(!a.executable)return[];let i=Lt.map(({kind:c})=>({kind:c,query:a.queries[c]})).filter(c=>!!c.query);if(i.length!==1)return n.push(`${Tt(a.subject)} must declare exactly one sh:select, sh:ask, or sh:construct query.`),[];let s=i[0];return[{description:a.description??"",id:Ln(a.subject,s.kind,s.query),kind:s.kind,label:X(o.quads,a.subject,{predicates:[...be,`${G}name`]})?.trim()||Tt(a.subject),order:a.order??Number.POSITIVE_INFINITY,query:s.query}]}).sort((a,i)=>a.order-i.order||a.label.localeCompare(i.label));return{diagnostics:n,queries:r}}function Tn(o){return Ee(o).queries}var Rn="http://www.w3.org/1999/02/22-rdf-syntax-ns#type",Nn="http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",Cn="http://www.w3.org/2000/01/rdf-schema#Class",Mn="http://www.w3.org/2000/01/rdf-schema#subClassOf",Dn="http://www.w3.org/2000/01/rdf-schema#subPropertyOf",qn=new Set([Cn,"http://www.w3.org/2002/07/owl#Class","http://www.w3.org/2002/07/owl#DeprecatedClass"]),An=new Set([Nn,"http://www.w3.org/2002/07/owl#ObjectProperty","http://www.w3.org/2002/07/owl#DatatypeProperty","http://www.w3.org/2002/07/owl#AnnotationProperty","http://www.w3.org/2002/07/owl#FunctionalProperty","http://www.w3.org/2002/07/owl#InverseFunctionalProperty","http://www.w3.org/2002/07/owl#TransitiveProperty","http://www.w3.org/2002/07/owl#SymmetricProperty","http://www.w3.org/2002/07/owl#AsymmetricProperty","http://www.w3.org/2002/07/owl#ReflexiveProperty","http://www.w3.org/2002/07/owl#IrreflexiveProperty","http://www.w3.org/2002/07/owl#DeprecatedProperty","http://www.w3.org/2002/07/owl#OntologyProperty"]);function Be(o,e){o.some(t=>t.value===e.value)||o.push(e)}function We(o,e){o.includes(e)||o.push(e)}function Se(o,e){o.includes(e)||o.push(e)}function Ke(o){let e=new Map,t=i=>{let s=e.get(i.value);return s||(s={classParents:[],kinds:[],propertyParents:[],sources:[],term:i,types:[]},e.set(i.value,s)),s};for(let i of o.quads)if(i.subject.termType==="NamedNode"){if(i.predicate.value===Rn&&i.object.termType==="NamedNode"){let s=qn.has(i.object.value),c=An.has(i.object.value);if(!s&&!c)continue;let l=t(i.subject);s&&Se(l.kinds,"class"),c&&Se(l.kinds,"property"),Be(l.types,i.object),We(l.sources,i.source);continue}if(i.predicate.value===Mn){let s=t(i.subject);Se(s.kinds,"class"),i.object.termType==="NamedNode"&&Be(s.classParents,i.object),We(s.sources,i.source);continue}if(i.predicate.value===Dn){let s=t(i.subject);Se(s.kinds,"property"),i.object.termType==="NamedNode"&&Be(s.propertyParents,i.object),We(s.sources,i.source)}}let n=Array.from(e.values()).map(i=>{let s=X(o.quads,i.term);return{...i,...s?{label:s}:{}}}).sort((i,s)=>(i.label??i.term.value).localeCompare(s.label??s.term.value)),r=n.filter(i=>i.kinds.includes("class")),a=n.filter(i=>i.kinds.includes("property"));return{classes:r,count:n.length,definitions:n,properties:a}}var In=String.raw`
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
  .quad { border-bottom: 1px solid var(--line); display: grid; gap: 7px; grid-template-columns: minmax(0, 1fr) auto; padding-block: 13px; padding-inline: calc(2px + var(--rdf-indent, 0px)) 2px; position: relative; }
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
  ${dt}
`,$n={navigator:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><circle cx="3" cy="5" r=".8" fill="currentColor" stroke="none"/><circle cx="3" cy="9" r=".8" fill="currentColor" stroke="none"/><circle cx="3" cy="13" r=".8" fill="currentColor" stroke="none"/><path d="M6 5h9M6 9h9M6 13h9"/></svg>',sources:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><rect x="2.5" y="3" width="13" height="9" rx="1.5"/><path d="M6 15h6M9 12v3"/></svg>',vocabulary:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><circle cx="9" cy="3.5" r="2"/><circle cx="4" cy="14" r="2"/><circle cx="14" cy="14" r="2"/><path d="M9 5.5v3M4 12V9h10v3"/></svg>',shapes:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M3 3.5h5v5H3zM10 9.5h5v5h-5zM8 6h3v3.5"/><path d="m4.3 11.8 1.3 1.3 2.6-3"/></svg>',discovery:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><circle cx="9" cy="9" r="6.5"/><path d="m11.7 6.3-1.5 3.9-3.9 1.5 1.5-3.9z"/></svg>',sparql:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M3 4.5h8M3 9h6M3 13.5h5"/><circle cx="13" cy="12" r="3"/><path d="m15.2 14.2 1.5 1.5"/></svg>',turtle:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="m6.5 4.5-4 4.5 4 4.5M11.5 4.5l4 4.5-4 4.5"/></svg>',json:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M7 3.5H5.5c-1 0-1.5.5-1.5 1.5v2c0 1-.5 1.5-1.5 2 1 .5 1.5 1 1.5 2v2c0 1 .5 1.5 1.5 1.5H7M11 3.5h1.5c1 0 1.5.5 1.5 1.5v2c0 1 .5 1.5 1.5 2-1 .5-1.5 1-1.5 2v2c0 1-.5 1.5-1.5 1.5H11"/></svg>',diagnostics:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M8 3.2 2.3 13a1.2 1.2 0 0 0 1 1.8h11.4a1.2 1.2 0 0 0 1-1.8L10 3.2a1.15 1.15 0 0 0-2 0Z"/><path d="M9 6.8v3.4M9 13h.01"/></svg>'};function ee(o,e,t,n,r,a){let i=r===void 0?t:`${t} (${r})`,s=r===void 0||!a?t:`${t}, ${r} ${a}${r===1?"":"s"}`;return`<button class="tab" role="tab" data-view="${o}" aria-selected="${e}" aria-label="${i}" title="${s}"><span class="tab-icon" aria-hidden="true">${$n[o]}</span><span class="tab-label" data-short="${n}">${t}</span>${r===void 0?"":`<span class="tab-count"> (${r})</span>`}</button>`}var Nt="ia2:rdf-navigator:state:v1",Qe=`SELECT ?subject ?predicate ?object ?graph
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
LIMIT 100`,Ct=25,Mt=[10,25,50,100],Dt=[...be,"http://www.w3.org/ns/shacl#name"],Pn=4,ke=28,qt=2e6,zn=1e4,Hn="text/html, application/xhtml+xml;q=0.95",jn=2e6,_n=4,On=2,Fn=3e3,Le="allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts",At=`${Le} allow-same-origin`,le=new Map,Un=new Set(["ontology.inferal.com","purl.archive.org","purl.org","schema.org","www.schema.org","www.w3.org"]),Vn={Alt:"ch_alt",Bag:"ch_bag",first:"ch_first",HTML:"ch_html",JSON:"ch_json",langString:"ch_langstring",List:"ch_list",nil:"ch_nil",object:"ch_object",predicate:"ch_predicate",Property:"ch_property",reifies:"ch_reifies",rest:"ch_rest",Seq:"ch_seq",Statement:"ch_statement",subject:"ch_subject",type:"ch_type",value:"ch_value",XMLLiteral:"ch_xmlliteral"},Bn={Class:"ch_class",comment:"ch_comment",Container:"ch_container",ContainerMembershipProperty:"ch_containermembershipproperty",Datatype:"ch_datatype",domain:"ch_domain",isDefinedBy:"ch_isdefinedby",label:"ch_label",Literal:"ch_literal",member:"ch_member",Proposition:"ch_proposition",range:"ch_range",Resource:"ch_resource",seeAlso:"ch_seealso",subClassOf:"ch_subclassof",subPropertyOf:"ch_subpropertyof"};function Wn(o){if(!o||typeof o!="object")return!1;let e=o;return typeof e.height=="number"&&Number.isFinite(e.height)&&e.height>0&&typeof e.width=="number"&&Number.isFinite(e.width)&&e.width>0&&typeof e.x=="number"&&Number.isFinite(e.x)&&typeof e.y=="number"&&Number.isFinite(e.y)}function Kn(o){if(!o||typeof o!="object")return!1;let e=o;return typeof e.x=="number"&&Number.isFinite(e.x)&&typeof e.y=="number"&&Number.isFinite(e.y)}var Qn="http://www.w3.org/1999/02/22-rdf-syntax-ns#type",Gn="http://www.w3.org/2000/01/rdf-schema#domain",Yn="http://www.w3.org/2000/01/rdf-schema#range",Xn=8,Jn={"http://www.w3.org/1999/02/22-rdf-syntax-ns#Property":"RDF property","http://www.w3.org/2000/01/rdf-schema#Class":"RDFS class","http://www.w3.org/2002/07/owl#AnnotationProperty":"Annotation property","http://www.w3.org/2002/07/owl#Class":"OWL class","http://www.w3.org/2002/07/owl#DatatypeProperty":"Datatype property","http://www.w3.org/2002/07/owl#ObjectProperty":"Object property","http://www.w3.org/2002/07/owl#Ontology":"OWL ontology"},Zn=new Set(["area","base","head","link","meta","noscript","script","source","style","template","title","track"]);function K(o){let e=o.id?`#${o.id}`:"";return`<${o.localName}${e}>`}function Ge(o){return o.termType==="NamedNode"||o.termType==="BlankNode"?`${o.termType}:${o.value}`:null}function It(o){if(o.termType==="BlankNode")return`Blank node ${o.value}`;try{let e=new URL(o.value),t=decodeURIComponent(e.hash.slice(1));if(t)return t.replaceAll(/[-_]+/g," ");let n=e.pathname.split("/").filter(Boolean).at(-1);return decodeURIComponent(n??o.value).replaceAll(/[-_]+/g," ")}catch{return o.value}}function eo(o){return(o.startsWith("http://www.w3.org/ns/shacl#")?o.slice(27):O({termType:"NamedNode",value:o})).replaceAll(/([a-z0-9])([A-Z])/g,"$1 $2").replaceAll(/[-_]+/g," ").replace(/^./,t=>t.toUpperCase())}function to(o){return o.kinds.length>1?"Node + property shape":o.kinds[0]==="property"?"Property shape":"Node shape"}function Ne(o){return/^https?:\/\//i.test(o)}function $t(o){let e=new URL(o),t=e.hostname==="www.w3.org"&&e.pathname==="/1999/02/22-rdf-syntax-ns"?decodeURIComponent(e.hash.slice(1)):"";if(t)return new URL(`https://www.w3.org/TR/rdf12-schema/#${Vn[t]??"rdf-namespace"}`);let n=e.hostname==="www.w3.org"&&e.pathname==="/2000/01/rdf-schema"?decodeURIComponent(e.hash.slice(1)):"";if(n)return new URL(`https://www.w3.org/TR/rdf12-schema/#${Bn[n]??"rdfs-namespace"}`);let r=e.hostname==="purl.org"?e.pathname.match(/^\/dc\/terms\/([^/]+)$/):null;return r?new URL(`https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#${encodeURIComponent(r[1])}`):e.hostname==="purl.org"&&e.pathname==="/dc/terms/"?new URL("https://www.dublincore.org/specifications/dublin-core/dcmi-terms/"):(e.protocol==="http:"&&Un.has(e.hostname)&&(e.protocol="https:"),e)}function Pt(o){return o.hostname==="www.dublincore.org"&&o.pathname==="/specifications/dublin-core/dcmi-terms/"||o.hostname==="www.w3.org"&&o.pathname.startsWith("/TR/")}function no(o){let e=new URL(o.href);return e.hash="",e.href}function oo(o,e){for(le.delete(o),le.set(o,e);le.size>_n;){let t=le.keys().next().value;if(!t)break;le.delete(t)}}function se(o){return`<!doctype html><meta charset="utf-8"><meta name="color-scheme" content="light dark"><style>
    :root { color: oklch(34% 0.015 286); font: 13px/1.45 ui-sans-serif, system-ui, sans-serif; }
    body { align-items: center; display: flex; justify-content: center; margin: 0; min-height: 100vh; }
    p { color: oklch(54% 0.018 286); margin: 24px; text-align: center; }
  </style><p role="status">${o}</p>`}function ro(o,e,t){return new Promise((n,r)=>{let a=new o.AbortController,i=!1,s=0,c=d=>{i||(i=!0,o.clearTimeout(s),t.signal.removeEventListener("abort",l),d())},l=()=>{a.abort(),c(()=>r(new Error("Resource preview request was cancelled.")))};t.signal.addEventListener("abort",l,{once:!0}),s=o.setTimeout(()=>{a.abort(),c(()=>r(new Error("Resource preview request timed out.")))},Fn),o.fetch(e,{credentials:"omit",redirect:"follow",referrerPolicy:"no-referrer",signal:a.signal}).then(async d=>{let p=await d.text();c(()=>n({html:p,response:d}))}).catch(d=>c(()=>r(d)))})}function zt(o,e,t=""){let r=`<base href="${e.replaceAll("&","&amp;").replaceAll('"',"&quot;")}">`,a=JSON.stringify(e).replaceAll("<","\\u003c"),i=JSON.stringify(t).replaceAll("<","\\u003c"),s=`<script data-ia2-preview-bridge>(() => {
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
  })();<\/script>`,c=`${r}${s}`,l=/<head(?:\s[^>]*)?>/i.exec(o);if(!l)return`${c}${o}`;let d=l.index+l[0].length;return`${o.slice(0,d)}${c}${o.slice(d)}`}function re(o){let e=o.ownerDocument.defaultView;if(!e||!(o instanceof e.HTMLElement)||!o.isConnected||Zn.has(o.localName)||o.closest("head, template, [hidden]")||o.localName==="input"&&o.getAttribute("type")?.toLowerCase()==="hidden")return!1;let t=e.getComputedStyle(o);return t.display!=="none"&&t.visibility!=="hidden"&&t.visibility!=="collapse"}function ao(o){return o.localName==="template"&&"content"in o?o.content.childNodes.length>0:o.childNodes.length>0}function io(o,e){let t=0,n=o.parentElement;for(;n;)e.has(n)&&(t+=1),n=n.parentElement;return t}function so(o){let e=o.ownerDocument.defaultView;if(!e||!re(o))return!1;let t=o.getBoundingClientRect();return t.width>0&&t.height>0&&t.bottom>0&&t.right>0&&t.top<e.innerHeight&&t.left<e.innerWidth}function ne(o){if(o.termType==="Triple")return[O(o),ne(o.subject),ne(o.predicate),ne(o.object)].join(" ");let e=o.termType==="Literal"?`${o.datatype.value} ${o.language} ${o.direction??""}`:"";return`${O(o)} ${o.value} ${e}`}function co(o){return[ne(o.subject),ne(o.predicate),ne(o.object),o.graph?ne(o.graph):"",K(o.source)].join(" ").toLocaleLowerCase()}function me(o,e,t=o.URL){try{let n=new URL(e),r=new URL(t),a=new URL(n),i=new URL(r);return a.hash="",i.hash="",a.href===i.href?n:null}catch{return null}}function lo(o,e){try{let t=new URL(o),n=new URL(e.sourceDocumentIri),r=new URL(t);if(r.hash="",n.hash="",r.href!==n.href)return t.href;let a=new URL(e.retrievalDocumentIri);return a.hash=t.hash,a.href}catch{return o}}function po(o,e,t){if(t.metaKey||t.ctrlKey||t.shiftKey||t.altKey)return;t.preventDefault();let n=o.defaultView;if(!n)return;let r=new URL(o.URL);r.hash=e.hash,n.history.pushState(null,"",r.href),(e.hash?Xe(o,e):o.documentElement)?.scrollIntoView({behavior:n.matchMedia?.("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"})}function Xe(o,e){let t=o.documentElement;if(e.hash){let n=e.hash.slice(1);try{t=o.getElementById(decodeURIComponent(n))}catch{t=o.getElementById(n)}}return t&&re(t)?t:null}function Te(o,e,t=o.URL){if(e.termType!=="NamedNode"||!Ne(e.value))return null;let n=me(o,e.value,t);return n?Xe(o,n):null}function uo(o,e,t){let n=Te(o,e.term,t);if(n)return n;for(let r of e.sources){let a=r.closest("[id]");if(a&&re(a))return a;if(re(r))return r}return null}function Ye(o,e,t,n){let r=o.createElement("button");r.className=`row-action-button locate-button ${t}`,r.type="button",r.setAttribute("aria-label",`Locate ${K(e)}`),r.title=r.getAttribute("aria-label");let a=o.createElement("span");return a.className="locate-glyph",a.setAttribute("aria-hidden","true"),a.textContent="\u2316",r.append(a),r.addEventListener("click",()=>n(e)),r}function ce(o,e,t="",n="",r,a=o.URL){let i=o.createElement("code");n&&(i.className=n),t&&i.append(o.createTextNode(t));let s=O(e);if(e.termType!=="NamedNode"||!Ne(e.value))return i.append(o.createTextNode(s)),i;let c=o.createElement("a");c.className="term-link",c.href=e.value;let l=me(o,e.value,a);l?(c.classList.add("local-term"),c.title=l.hash?`Scroll to ${l.hash} in this document`:"Scroll to the start of this document",c.addEventListener("click",p=>po(o,l,p))):(c.target="_blank",c.rel="noopener noreferrer",c.title=`Open ${e.value} in a new tab`),c.textContent=s,i.append(c);let d=Te(o,e,a);return d&&r&&i.append(Ye(o,d,"term-locate-button",r)),i}function ho(o){for(let[a,i]of Object.entries(qe))if(o.startsWith(i))return{label:a,namespace:i};if(!Ne(o))return null;let e=o.lastIndexOf("#"),t=o.lastIndexOf("/"),n=Math.max(e,t);if(n<8)return null;let r=o.slice(0,n+1);try{let a=new URL(r),i=a.pathname.replace(/\/$/,""),s=r.endsWith("#")?"#":"";return{label:`${a.host}${i}${s}`,namespace:r}}catch{return null}}function Q(o){return o.termType==="NamedNode"?[o.value]:o.termType==="BlankNode"?[]:o.termType==="Literal"?O(o).includes("^^")?[o.datatype.value]:[]:[...Q(o.subject),...Q(o.predicate),...Q(o.object)]}function Re(o){return O({termType:"NamedNode",value:o})}function _t(o){let e=o.replace(/[\/#]+$/,""),t=Math.max(e.lastIndexOf("#"),e.lastIndexOf("/")),n=t>=0?e.slice(t+1):e;try{return decodeURIComponent(n)}catch{return n}}function mo(o){let t=_t(o).replace(/\.[A-Za-z0-9]+$/u,"").replace(/([\p{Ll}\d])(\p{Lu})/gu,"$1 $2").replace(/[_-]+/gu," ").replace(/\s+/gu," ").trim();return t?`${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}`:Re(o)}function he(o,e){if(!o)return"unbound";let t=o.termType==="NamedNode"||o.termType==="BlankNode"?e.get(`${o.termType}:${o.value}`)??"":"";return JSON.stringify([o.termType,o.value,o.datatype??"",o.language??"",o.direction??"",t])}function Ht(o,e){if(o.kind==="ask")return`ask:${String(o.value)}`;if(o.kind==="quads"){let n=o.quads.map(r=>JSON.stringify([he(r.subject,e),he(r.predicate,e),he(r.object,e),he(r.graph,e)])).sort();return JSON.stringify(["quads",n])}let t=o.rows.map(n=>JSON.stringify(o.variables.map(r=>he(n[r],e)))).sort();return JSON.stringify(["bindings",o.variables,t])}function fo(o){let e=new Map,t=n=>{let r=e.get(n);if(r)return r;let a={domains:new Set,iri:n,ranges:new Set,statementCount:0,types:new Set};return e.set(n,a),a};for(let n of o.quads){let r=new Set([...Q(n.subject),...Q(n.predicate),...Q(n.object),...n.graph?Q(n.graph):[]]);for(let i of r)t(i).statementCount+=1;if(n.subject.termType!=="NamedNode")continue;let a=t(n.subject.value);n.predicate.value===Qn&&n.object.termType==="NamedNode"&&a.types.add(n.object.value),n.predicate.value===Gn&&a.domains.add(O(n.object)),n.predicate.value===Yn&&a.ranges.add(O(n.object))}return Array.from(e.values()).map(n=>{let r=Re(n.iri),a=_t(n.iri),i=X(o.quads,n.iri)??"",s=Array.from(n.types,p=>Jn[p]??`type ${Re(p)}`).sort(),c=Array.from(n.domains).sort(),l=Array.from(n.ranges).sort(),d=[r,n.iri,a,i,...s,...c.flatMap(p=>["domain",p,`domain ${p}`]),...l.flatMap(p=>["range",p,`range ${p}`])].join(" ").toLocaleLowerCase();return{display:r,domains:c,iri:n.iri,kinds:s,label:i,localName:a,ranges:l,searchText:d,statementCount:n.statementCount}})}function go(o,e,t=Xn){let n=e.trim().toLocaleLowerCase();if(!n)return[];let r=n.split(/\s+/).filter(Boolean);return o.map(a=>{if(!r.every(c=>a.searchText.includes(c)))return null;let i=[a.display,a.localName,a.label].join(" ").toLocaleLowerCase(),s=60;return[a.display,a.localName,a.label].some(c=>c.toLocaleLowerCase()===n)?s=0:[a.display,a.localName,a.label].some(c=>c.toLocaleLowerCase().startsWith(n))?s=10:i.includes(n)?s=20:r.every(c=>i.includes(c))&&(s=35),{score:s-Math.min(a.statementCount,20)/100,suggestion:a}}).filter(a=>a!==null).sort((a,i)=>a.score-i.score||a.suggestion.display.localeCompare(i.suggestion.display)).slice(0,t).map(({suggestion:a})=>a)}function bo(o){let e=[...o.kinds,...o.domains.map(n=>`domain ${n}`),...o.ranges.map(n=>`range ${n}`)],t=`${o.statementCount} statement${o.statementCount===1?"":"s"}`;return[...e,t]}function Ot(o){let e=[...Q(o.subject),...Q(o.predicate),...Q(o.object),...o.graph?Q(o.graph):[]],t=new Map;for(let n of e){let r=ho(n);r&&t.set(r.namespace,r)}return Array.from(t.values())}function vo(o){let e=new Map;for(let t of o.quads)for(let n of Ot(t)){let r=e.get(n.namespace);r?r.count+=1:e.set(n.namespace,{...n,count:1})}return Array.from(e.values()).sort((t,n)=>t.label.localeCompare(n.label))}var wo=new Set(["content","datetime","dir","href","lang","src","value"]),jt="[rdf-predicate], [rdf-graph], [rdf-graph-key], base[href], link[rel]";function xo(o){if(o.type==="characterData")return o.target.parentElement?.closest("[rdf-predicate]")!==null;if(o.type==="attributes"){let t=o.target instanceof Element?o.target:null,n=o.attributeName??"";return t?n.startsWith("rdf-")||t.localName==="base"&&n==="href"||t.localName==="link"&&(n==="href"||n==="rel")?!0:t.hasAttribute("rdf-predicate")?n==="id"||wo.has(n):!1:!1}return(o.target instanceof Element?o.target:null)?.closest("[rdf-predicate]")?!0:[...o.addedNodes,...o.removedNodes].some(t=>t instanceof Element?t.matches(jt)||t.querySelector(jt)!==null:!1)}function yo(o,e){let t=new URL(o),n=new URL(e.sourceDocumentIri),r=new URL(e.retrievalDocumentIri);return t.origin!==n.origin||n.origin===r.origin?t.href:new URL(`${t.pathname}${t.search}${t.hash}`,r.origin).href}function Eo(o,e){try{Object.defineProperty(o,"URL",{configurable:!0,value:e})}catch{}let t=o.head?.querySelector("base[href]");t&&(t.href=new URL(t.getAttribute("href")??"",e).href),o.head?.querySelectorAll('link[rel~="canonical"][href]').forEach(n=>{n.href=new URL(n.getAttribute("href")??"",e).href})}function So(o){return o instanceof DOMException&&o.name==="AbortError"?"Retrieval timed out.":o instanceof TypeError?"Retrieval was blocked by CORS or network policy.":o instanceof Error?o.message:"The contribution could not be loaded."}var fe=class extends HTMLElement{#n=null;#u=null;#F=null;#he=[];#me=[];#o=[];#a="top-document";#fe=new WeakMap;#Pe=1;#S=[];#r=new Map;#k={classes:[],count:0,definitions:[],properties:[]};#b={count:0,groups:[],shapes:[]};#e="navigator";#L=!1;#T="";#q="";#J="";#h=[];#Z=[];#v="";#w=Qe;#t={status:"idle"};#U=!0;#m="";#A=new Map;#i=0;#E=Ct;#f=0;#x=new Set;#d="off";#s="right";#p=null;#I=null;#c=null;#$=null;#V=!1;#l=new Map;#R=null;#B=null;#ge=20;#ee=null;#te=null;#W=null;#ne=null;#N=null;#y=null;#C=null;#M=null;#K=[];constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.#Ue(),this.refresh(),this.addEventListener("keydown",this.#qe),this.addEventListener("keyup",this.#Ae),this.ownerDocument.defaultView?.addEventListener("resize",this.#De,{passive:!0}),this.#Be()}disconnectedCallback(){this.removeEventListener("keydown",this.#qe),this.removeEventListener("keyup",this.#Ae),this.ownerDocument.defaultView?.removeEventListener("resize",this.#De),this.#C?.disconnect(),this.#C=null;for(let e of this.#r.values())e.controller?.abort();this.#r.clear(),this.#N?.disconnect(),this.#N=null,this.#y?.disconnect(),this.#y=null,this.#M!==null&&window.clearTimeout(this.#M),this.#G(),this.#pe(),this.#ae(),this.#O(),this.#Q(),this.#oe()}#Q(){this.#te?.(),this.#te=null}#ze(){if(this.#W){this.#W();return}this.#d="off",this.#Q()}#oe(){this.#ne?.(),this.#ne=null}#He(e){if(this.#y?.disconnect(),this.#y=null,!e)return;let t=()=>{if(e.dataset.compact="0",!(e.clientWidth<=0)){for(let r=0;r<=3;r+=1)if(e.dataset.compact=String(r),e.scrollWidth<=e.clientWidth+1)return}};t();let n=this.ownerDocument.defaultView?.ResizeObserver;n&&(this.#y=new n(t),this.#y.observe(e))}#P(e){this.#l.has(e)&&(this.#R=e,e.style.zIndex=String(++this.#ge))}#re(e){let t=this.#l.get(e);if(!t||(t.abortController?.abort(),t.interactionCleanup?.(),t.navigationCleanup?.(),e.remove(),this.#l.delete(e),this.#B===e&&(this.#B=null),this.#R!==e))return;let n=Array.from(this.#l.keys()).at(-1)??null;this.#R=null,n&&this.#P(n)}#ae(){for(let e of Array.from(this.#l.keys()))this.#re(e);this.#R=null,this.#ge=20}#be(e){let t=e.getBoundingClientRect();return{height:Number.parseFloat(e.style.height)||t.height,width:Number.parseFloat(e.style.width)||t.width,x:Number.parseFloat(e.style.left)||t.left,y:Number.parseFloat(e.style.top)||t.top}}#ie(e,t){let n=this.#H(t);e.style.height=`${n.height}px`,e.style.left=`${n.x}px`,e.style.top=`${n.y}px`,e.style.width=`${n.width}px`}#ve(e){this.#ie(e,this.#be(e))}#we(e,t,n){if(e.button!==0)return;let r=this.ownerDocument.defaultView,a=this.#l.get(t);if(!r||!a)return;e.preventDefault(),this.#P(t),a.interactionCleanup?.(),a.interactionCleanup=null,this.#ve(t);let i=this.#be(t),s=e.clientX,c=e.clientY;t.classList.add(n?"is-resizing":"is-dragging");let l=p=>{let b=p.clientX-s,h=p.clientY-c,u=this.#z(),m={...i};n?(n.includes("e")&&(m.width=Math.min(Math.max(i.width+b,u.minWidth),u.width-u.margin-i.x)),n.includes("s")&&(m.height=Math.min(Math.max(i.height+h,u.minHeight),u.height-u.margin-i.y)),n.includes("w")&&(m.x=Math.min(Math.max(i.x+b,u.margin),i.x+i.width-u.minWidth),m.width=i.x+i.width-m.x),n.includes("n")&&(m.y=Math.min(Math.max(i.y+h,u.margin),i.y+i.height-u.minHeight),m.height=i.y+i.height-m.y)):(m.x=i.x+b,m.y=i.y+h),this.#ie(t,m)},d=()=>{r.removeEventListener("pointermove",l),r.removeEventListener("pointerup",d),r.removeEventListener("pointercancel",d),t.classList.remove("is-dragging","is-resizing"),a.interactionCleanup===d&&(a.interactionCleanup=null)};r.addEventListener("pointermove",l),r.addEventListener("pointerup",d),r.addEventListener("pointercancel",d),a.interactionCleanup=d}#xe(e,t,n){let r=this.ownerDocument.defaultView,a=this.#l.get(e);if(!r||!a)return;a.abortController?.abort(),a.abortController=null;let i=$t(n),s=Pt(i),c=no(i),l=i.hash?decodeURIComponent(i.hash.slice(1)):"";if(t.removeAttribute("srcdoc"),s){t.removeAttribute("src"),t.setAttribute("sandbox",Le);let h=le.get(c);if(h){t.srcdoc=zt(h.html,h.baseUrl,l);return}t.srcdoc=se("Loading definition\u2026")}else t.setAttribute("sandbox",At),t.src=i.href;if(typeof r.fetch!="function"||typeof r.AbortController!="function"){s&&(t.srcdoc=se("Preview unavailable. Use the open button above."));return}let d=new r.AbortController;a.abortController=d;let p=s?On:1;(async()=>{let h;for(let u=0;u<p;u+=1)try{return await ro(r,i.href,d)}catch(m){if(h=m,d.signal.aborted||u+1>=p)throw m;s&&t.isConnected&&(t.srcdoc=se("Still loading; retrying\u2026"))}throw h})().then(({html:h,response:u})=>{let m=u.headers.get("content-type")?.toLowerCase()??"";if(!u.ok||!m.includes("text/html")&&!m.includes("application/xhtml+xml")){s&&t.isConnected&&(t.srcdoc=se("Preview unavailable. Use the open button above."));return}if(h.length>jn||d.signal.aborted||!t.isConnected){s&&!d.signal.aborted&&t.isConnected&&(t.srcdoc=se("Preview is too large. Use the open button above."));return}let x=new URL(u.url||i.href);x.hash="",oo(c,{baseUrl:x.href,html:h}),t.setAttribute("sandbox",Le),t.srcdoc=zt(h,x.href,l)}).catch(()=>{s&&t.isConnected&&!d.signal.aborted&&(t.srcdoc=se("Preview unavailable. Use the open button above."))}).finally(()=>{a.abortController===d&&(a.abortController=null)})}#ye(e,t){let n=e.querySelector(".resource-preview-frame"),r=e.querySelector(".resource-preview-open"),a=e.querySelector(".resource-preview-url");if(!n||!r||!a)return;let s=(e.dataset.previewKind==="definition"?"definition":"resource")==="definition"?"Definition":"Resource";e.setAttribute("aria-label",`${s} preview of ${t}`),a.textContent=t,a.title=t,r.href=t,r.setAttribute("aria-label",`Open ${t} in a new tab`),r.title=r.getAttribute("aria-label"),n.title=`${s} preview of ${t}`,this.#xe(e,n,t)}#je(e,t,n){let r=this.ownerDocument.defaultView;if(!r||!this.shadowRoot||!e.isConnected)return null;let a=this.ownerDocument,i=a.createElement("section");i.className="resource-preview";let s=e.closest(".predicate")?"definition":"resource";i.dataset.previewKind=s,i.setAttribute("role","dialog"),i.setAttribute("aria-label",`${s==="definition"?"Definition":"Resource"} preview of ${e.href}`);let{height:c,margin:l,width:d}=this.#z(),p=Math.max(1,d-l*2),b=Math.max(1,c-l*2),h=s==="definition"?620:Math.max(760,Math.round(d*.72)),u=s==="definition"?520:Math.min(760,Math.max(560,Math.round(c*.82))),m=Math.min(h,p),x=Math.min(u,b),v=this.#l.size%6*24,C=this.#H({height:x,width:m,x:s==="definition"?t-24:Math.round((d-m)/2),y:s==="definition"?n-40:Math.round((c-x)/2)});this.#ie(i,{...C,x:C.x+v,y:C.y+v});let w=a.createElement("header");w.className="resource-preview-bar";let E=a.createElement("span");E.className="resource-preview-url",E.title=e.href,E.textContent=e.href;let k=a.createElement("a");k.className="resource-preview-action resource-preview-open",k.href=e.href,k.target="_blank",k.rel="noopener noreferrer",k.setAttribute("aria-label",`Open ${e.href} in a new tab`),k.title=k.getAttribute("aria-label"),k.textContent="\u2197",w.append(E,k);let g=a.createElement("button");g.className="resource-preview-action resource-preview-close",g.type="button",g.setAttribute("aria-label","Close resource preview"),g.title=g.getAttribute("aria-label"),g.textContent="\xD7",g.addEventListener("click",()=>this.#re(i)),w.append(g),w.addEventListener("pointerdown",A=>{(A.target instanceof Element?A.target:null)?.closest("a, button")||this.#we(A,i)});let T=a.createElement("iframe");T.className="resource-preview-frame",T.title=`${s==="definition"?"Definition":"Resource"} preview of ${e.href}`,T.setAttribute("sandbox",Pt($t(e.href))?Le:At),T.referrerPolicy="no-referrer",T.tabIndex=0,i.append(w,T);let y=a.createElement("div");y.className="resource-preview-resize-handles",y.setAttribute("aria-hidden","true");for(let A of["n","ne","e","se","s","sw","w","nw"]){let q=a.createElement("span");q.className="resize-handle",q.dataset.resize=A,q.addEventListener("pointerdown",_=>this.#we(_,i,A)),y.append(q)}i.append(y),this.shadowRoot.append(i);let R={abortController:null,interactionCleanup:null,navigationCleanup:null};this.#l.set(i,R),i.addEventListener("pointerdown",()=>this.#P(i),{capture:!0}),this.#P(i);let L=A=>{let q=A.data;A.source!==T.contentWindow||q?.type!=="ia2-rdf-preview-navigate"||typeof q.href!="string"||!Ne(q.href)||this.#ye(i,q.href)};return r.addEventListener("message",L),R.navigationCleanup=()=>r.removeEventListener("message",L),this.#xe(i,T,e.href),i}#Ee(e,t){let n=e.getBoundingClientRect(),r=t.clientX||n.left+Math.min(n.width/2,24),a=t.clientY||n.top+Math.min(n.height/2,12);return this.#je(e,r,a)}#_e(e,t){let n=this.#B;if(n?.isConnected&&this.#l.has(n)){this.#P(n),this.#ye(n,e.href);return}this.#B=this.#Ee(e,t)}#Oe(e){if(!(e instanceof Element))return null;let t=e.closest("a.term-link[href], a.vocabulary-link[href], a.tok.iri[href], a.sparql-resource-label[href]");if(!t||!this.shadowRoot?.contains(t))return null;let n=this.#n?.sourceDocumentIri??this.ownerDocument.URL,r=t.dataset.semanticIri??t.href;return me(this.ownerDocument,r,n)?null:t}#Fe(){if(!this.shadowRoot)return;let e=this.shadowRoot.querySelector(".viewport");e&&e.addEventListener("click",t=>{let n=this.#Oe(t.target);!n||t.button!==0||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||(t.preventDefault(),n.classList.contains("sparql-resource-label")?this.#_e(n,t):this.#Ee(n,t))})}#Ue(){try{let e=this.ownerDocument.defaultView?.sessionStorage.getItem(Nt);if(!e)return;let t=JSON.parse(e);we(t.position)&&(this.#s=t.position),Wn(t.floatingRect)&&(this.#p=this.#H(t.floatingRect)),Kn(t.launcherPosition)&&(this.#c=t.launcherPosition)}catch{}}#D(){try{let e={floatingRect:this.#p,launcherPosition:this.#c,position:this.#s};this.ownerDocument.defaultView?.sessionStorage.setItem(Nt,JSON.stringify(e))}catch{}}#se(){let e=this.shadowRoot?.activeElement;if(!(e instanceof HTMLElement))return null;if(e.classList.contains("navigator-search")){let t=e;return{kind:"search",start:t.selectionStart,end:t.selectionEnd}}if(e.classList.contains("shapes-search")){let t=e;return{kind:"shapes-search",start:t.selectionStart,end:t.selectionEnd}}if(e.classList.contains("sparql-editor")){let t=e;return{kind:"sparql-editor",start:t.selectionStart,end:t.selectionEnd}}return e.classList.contains("sparql-suggestion")?{kind:"sparql-suggestion"}:e.classList.contains("sparql-run")?{kind:"sparql-run"}:e.classList.contains("sparql-reset")?{kind:"sparql-reset"}:e.classList.contains("sparql-observe-input")?{kind:"sparql-observe"}:e.classList.contains("vocabulary-toggle")&&e.dataset.namespace?{kind:"namespace",key:e.dataset.namespace}:e.classList.contains("sync-option")&&e.dataset.syncMode?{kind:"sync",key:e.dataset.syncMode}:e.classList.contains("position-option")&&e.dataset.position?{kind:"position",key:e.dataset.position}:e.classList.contains("discovery-action")&&e.dataset.candidateId?{kind:"discovery-action",key:e.dataset.candidateId}:e.classList.contains("source-input")&&e.dataset.sourceId?{kind:"source",key:e.dataset.sourceId}:e.classList.contains("tab")&&e.dataset.view?{kind:"tab",key:e.dataset.view}:e.classList.contains("launcher")?{kind:"launcher"}:e.classList.contains("refresh")?{kind:"refresh"}:e.classList.contains("close")?{kind:"close"}:e.classList.contains("copy")?{kind:"copy"}:e.classList.contains("viewport")?{kind:"viewport"}:this.shadowRoot?.querySelector(".panel")?.contains(e)?{kind:"fallback"}:null}#ce(e){if(!this.shadowRoot)return;let t=null;e.kind==="search"&&(t=this.shadowRoot.querySelector(".navigator-search")),e.kind==="shapes-search"&&(t=this.shadowRoot.querySelector(".shapes-search")),e.kind==="sparql-editor"&&(t=this.shadowRoot.querySelector(".sparql-editor")),e.kind==="sparql-suggestion"&&(t=this.shadowRoot.querySelector(".sparql-suggestion")),e.kind==="sparql-run"&&(t=this.shadowRoot.querySelector(".sparql-run")),e.kind==="sparql-reset"&&(t=this.shadowRoot.querySelector(".sparql-reset")),e.kind==="sparql-observe"&&(t=this.shadowRoot.querySelector(".sparql-observe-input")),e.kind==="namespace"&&(t=Array.from(this.shadowRoot.querySelectorAll(".vocabulary-toggle")).find(n=>n.dataset.namespace===e.key)??null),e.kind==="sync"&&(t=Array.from(this.shadowRoot.querySelectorAll(".sync-option")).find(n=>n.dataset.syncMode===e.key)??null),e.kind==="position"&&(t=Array.from(this.shadowRoot.querySelectorAll(".position-option")).find(n=>n.dataset.position===e.key)??null),e.kind==="discovery-action"&&(t=Array.from(this.shadowRoot.querySelectorAll(".discovery-action")).find(n=>n.dataset.candidateId===e.key)??null),e.kind==="source"&&(t=Array.from(this.shadowRoot.querySelectorAll(".source-input")).find(n=>n.dataset.sourceId===e.key)??null),e.kind==="tab"&&(t=Array.from(this.shadowRoot.querySelectorAll(".tab")).find(n=>n.dataset.view===e.key)??null),e.kind==="launcher"&&(t=this.shadowRoot.querySelector(".launcher")),e.kind==="refresh"&&(t=this.shadowRoot.querySelector(".refresh")),e.kind==="close"&&(t=this.shadowRoot.querySelector(".close")),e.kind==="copy"&&(t=this.shadowRoot.querySelector(".copy")),e.kind==="viewport"&&(t=this.shadowRoot.querySelector(".viewport")),!t&&e.kind==="fallback"&&(t=this.shadowRoot.querySelector('[role="tab"][aria-selected="true"]')),t?.focus({preventScroll:!0}),e.kind==="search"&&t instanceof HTMLInputElement&&t.setSelectionRange(e.start??t.value.length,e.end??t.value.length),e.kind==="shapes-search"&&t instanceof HTMLInputElement&&t.setSelectionRange(e.start??t.value.length,e.end??t.value.length),e.kind==="sparql-editor"&&t instanceof HTMLTextAreaElement&&t.setSelectionRange(e.start??t.value.length,e.end??t.value.length)}#Ve(){let e=this.shadowRoot?.querySelector(".panel");return e?[e,...this.#l.keys()].flatMap(n=>Array.from(n.querySelectorAll("a[href], button, input, select, textarea, [tabindex]"))).filter(n=>n.tabIndex>=0&&!n.hasAttribute("disabled")&&!n.closest("[hidden]")&&n.getAttribute("aria-hidden")!=="true"):[]}#Be(){this.#C?.disconnect();let e=this.ownerDocument.defaultView?.MutationObserver??MutationObserver;this.#C=new e(t=>{t.some(n=>n.target!==this&&xo(n))&&(this.#M!==null&&window.clearTimeout(this.#M),this.#M=window.setTimeout(()=>{this.#M=null,this.#t.status==="success"?this.#Ze():this.refresh()},120))});try{this.#C.observe(this.ownerDocument.documentElement,{attributes:!0,characterData:!0,childList:!0,subtree:!0})}catch{this.#C=null}}#Se(){if(!this.#u){this.#n=null,this.#b={count:0,groups:[],shapes:[]},this.#A.clear();return}let e=Array.from(this.#r.values()).flatMap(t=>t.status==="loaded"&&t.contribution?[t.contribution]:[]);this.#n=Pe(this.#u,e),this.#b=Ve(this.#n),this.#A=Ie(this.#n.quads,{predicates:Dt,languages:[this.ownerDocument.documentElement.lang||"en"]})}#le(e){this.#Se(),this.#g(),queueMicrotask(()=>{Array.from(this.shadowRoot?.querySelectorAll(".discovery-action")??[]).find(t=>t.dataset.candidateId===e)?.focus({preventScroll:!0})})}#We(e){this.#r.get(e)?.controller?.abort(),this.#r.delete(e),this.#le(e)}async#Ke(e){let t=this.#u,n=this.ownerDocument.defaultView;if(!t||!n)return;let r=this.#r.get(e.id);if(r?.status==="loading"||r?.status==="loaded"){this.#We(e.id);return}let a=new AbortController;this.#r.set(e.id,{controller:a,status:"loading"}),this.#le(e.id);let i=n.setTimeout(()=>a.abort(),zn);try{let s=yo(e.target.value,t),c=new URL(s).protocol;if(c!=="http:"&&c!=="https:")throw new Error(`Unsupported retrieval protocol: ${c}`);let l=await n.fetch(s,{credentials:"omit",headers:{Accept:Hn},redirect:"follow",referrerPolicy:"no-referrer",signal:a.signal});if(!l.ok)throw new Error(`Retrieval failed with HTTP ${l.status}.`);let d=Number.parseInt(l.headers.get("content-length")??"",10);if(Number.isFinite(d)&&d>qt)throw new Error("The representation is larger than the 2 MB enrichment limit.");let p=(l.headers.get("content-type")??"").split(";",1)[0].trim().toLowerCase(),b=await l.text();if(b.length>qt)throw new Error("The representation is larger than the 2 MB enrichment limit.");let h=/<!doctype\s+html|<html[\s>]/i.test(b);if(p&&p!=="text/html"&&p!=="application/xhtml+xml")throw new Error(`Unsupported enrichment representation: ${p}. This preview currently extracts HTML/RDF.`);if(!p&&!h)throw new Error("The target did not return an identifiable HTML representation.");let u=new n.DOMParser().parseFromString(b,"text/html"),m=l.url||s;Eo(u,m);let x=ae(u);if(!x.quads.length&&!x.graphs.length)throw new Error("The retrieved HTML contained no extractable RDF.");if(this.#r.get(e.id)?.controller!==a)return;this.#r.set(e.id,{contribution:{candidateId:e.id,result:x,retrievalIri:m},status:"loaded"})}catch(s){if(this.#r.get(e.id)?.controller!==a)return;this.#r.set(e.id,{message:So(s),status:"error"})}finally{n.clearTimeout(i)}this.#le(e.id)}#Qe(e){let t=this.#fe.get(e);return t||(t=`document-frame-${this.#Pe++}`,this.#fe.set(e,t)),t}#Ge(){return Array.from(this.ownerDocument.querySelectorAll("iframe, frame")).flatMap((t,n)=>{let r=null;try{if(r=t.contentDocument,!r?.documentElement)return[];r.documentElement.localName}catch{return[]}let a=r.URL||r.baseURI,i="Opaque origin";try{i=new URL(a).origin}catch{}let s=t.getAttribute("title")?.trim()||r.title.trim()||`Embedded document ${n+1}`;return[{access:"direct",id:this.#Qe(t),label:s,origin:i,result:ae(r),url:a}]})}#ke(e,t=!1){let n=this.#o.find(i=>i.id===this.#a)??this.#o[0];if(!n)return;if(this.#a=n.id,this.#u=n.result,!e){for(let i of this.#r.values())i.controller?.abort();this.#r.clear()}this.#S=$e(this.#u),this.#k=Ke(this.#u);let r=Ee(this.#u);this.#h=r.queries,this.#Z=r.diagnostics,this.#h.some(i=>i.id===this.#v)||(this.#v=""),t||(this.#f+=1,this.#i=0,this.#t={status:"idle"},this.#m="");let a=new Set(this.#S.map(i=>i.id));for(let[i,s]of this.#r)a.has(i)||(s.controller?.abort(),this.#r.delete(i));this.#Se()}#Le(e,t=!1){if(!this.#F)return;let n=this.#a,r=this.ownerDocument.URL||this.ownerDocument.baseURI,a="Opaque origin";try{a=new URL(r).origin}catch{}let i=new Set,s=[{access:"direct",id:"top-document",label:"Top document",origin:a,result:this.#F,url:r},...this.#he,...this.#me];this.#o=s.filter(d=>i.has(d.id)?!1:(i.add(d.id),!0)),this.#o.some(d=>d.id===this.#a)||(this.#a="top-document");let c=this.#o[0],l=this.#o.slice(1).filter(d=>d.result.quads.length>0);this.#a===c.id&&c.result.quads.length===0&&l.length===1&&(this.#a=l[0].id),this.#ke(e,t&&n===this.#a)}#Ye(e){e===this.#a||!this.#o.some(t=>t.id===e)||(this.#a=e,this.#ke(!1),this.#e="navigator",this.#q="",this.#J="",this.#x.clear(),this.#d="off",this.#g())}setSources(e){if(this.#me=e.flatMap(n=>{if(!n||n.access!=="portable"||!n.id||n.id==="top-document")return[];try{return[{access:"portable",id:n.id,label:n.label||"Embedded document",origin:n.origin||"Opaque origin",result:He(n.result,this.ownerDocument),url:n.url||n.result.retrievalDocumentIri}]}catch{return[]}}),!this.#F)return;let t=this.#se();this.#Le(!0),this.#g(),t&&queueMicrotask(()=>this.#ce(t))}#Te(e){this.#F=ae(this.ownerDocument),this.#he=this.#Ge(),this.#Le(!0,e)}#Re(){let e=this.#o.find(r=>r.id===this.#a)??this.#o[0],t=this.#o.reduce((r,a)=>r+a.result.quads.length,0),n=Math.max(0,(this.#n?.quads.length??0)-(e?.result.quads.length??0));return t+n}#Xe(){let e=this.shadowRoot?.querySelector(".launcher .count");e&&(e.textContent=String(this.#Re()))}#Je(){let e=this.shadowRoot?.querySelector(".sparql-output");e&&(e.replaceChildren(),this.#ue(e))}async#Ne(){let e=this.#w.trim();if(!this.#U||!e||!this.#n||this.#t.status!=="success")return;let t=++this.#f,n=this.#n;try{let{executeSparql:r}=await import("./chunks/sparql-engine-FOALRXFP.js"),a=await r(e,n);if(t!==this.#f)return;let i=Ht(a,this.#A);if(i===this.#m)return;this.#t={result:a,status:"success"},this.#m=i}catch(r){if(t!==this.#f)return;this.#t={error:r instanceof Error?r.message:"The query could not be run.",status:"error"},this.#m=""}this.#e==="sparql"&&this.#Je()}async#Ze(){let e=this.#a;if(this.#Te(!0),e!==this.#a||this.#t.status!=="success"){this.#g();return}this.#e==="sparql"?this.#Xe():this.#g(),await this.#Ne()}refresh(){let e=this.#se();this.#Te(!1),this.#g(),e&&queueMicrotask(()=>this.#ce(e))}open(e="tab"){this.#L=!0,this.shadowRoot?.querySelector(".launcher")?.setAttribute("aria-expanded","true");let t=this.shadowRoot?.querySelector(".panel");t&&(t.dataset.open="true"),queueMicrotask(()=>{(e==="tab"?this.shadowRoot?.querySelector('[role="tab"][aria-selected="true"]'):this.shadowRoot?.querySelector(".panel"))?.focus({preventScroll:!0})})}close(){this.#L=!1,this.#G(),this.#ae(),this.#O(),this.#ze(),this.shadowRoot?.querySelector(".launcher")?.setAttribute("aria-expanded","false");let e=this.shadowRoot?.querySelector(".panel");e&&(e.dataset.open="false"),queueMicrotask(()=>{let t=this.shadowRoot?.querySelector(".launcher");if(t?.hidden){this.shadowRoot?.activeElement?.blur();return}t?.focus()})}toggle(e="tab"){this.#L?this.close():this.open(e)}revealSource(e,t="left"){return!(this.#u?.quads.some(r=>r.source===e)??!1)||e.ownerDocument!==this.ownerDocument?!1:(this.#s=t,this.#e="navigator",this.#q="",this.#x.clear(),this.#d="off",this.#g(),this.#D(),this.open("panel"),queueMicrotask(()=>{let r=this.#K.filter(({quad:s})=>s.source===e),a=r[0]?.item;if(!a)return;this.#K.forEach(({item:s})=>s.classList.remove("is-corresponding")),r.forEach(({item:s})=>{s.hidden=!1,s.classList.add("is-corresponding")}),a.tabIndex=-1,a.scrollIntoView?.({block:"center"}),a.focus({preventScroll:!0}),this.#T=`Showing statements carried by ${K(e)}`;let i=this.shadowRoot?.querySelector(".sr-only");i&&(i.textContent=this.#T)}),!0)}#z(){let e=this.ownerDocument.defaultView,t=Math.max(e?.innerWidth??1024,1),n=Math.max(e?.innerHeight??768,1),r=t<=760?10:24;return{height:n,margin:r,minHeight:Math.min(280,Math.max(n-r*2,1)),minWidth:Math.min(360,Math.max(t-r*2,1)),width:t}}#H(e){let{height:t,margin:n,minHeight:r,minWidth:a,width:i}=this.#z(),s=Math.max(i-n*2,1),c=Math.max(t-n*2,1),l=Math.min(Math.max(e.width,a),s),d=Math.min(Math.max(e.height,r),c);return{height:d,width:l,x:Math.min(Math.max(e.x,n),i-n-l),y:Math.min(Math.max(e.y,n),t-n-d)}}#et(){let{height:e,margin:t,width:n}=this.#z(),r=Math.min(760,Math.max(n-t*2,1)),a=Math.min(860,Math.max(e-t*2,1),Math.max(360,Math.round(e*.82)));return{height:a,width:r,x:Math.round((n-r)/2),y:Math.round((e-a)/2)}}#j(e){this.#p=this.#H(this.#p??this.#et()),e.style.height=`${this.#p.height}px`,e.style.left=`${this.#p.x}px`,e.style.top=`${this.#p.y}px`,e.style.width=`${this.#p.width}px`}#tt(e){e.style.height="",e.style.left="",e.style.top="",e.style.width=""}#Ce(e){let t=this.ownerDocument.defaultView,n=Math.max(t?.innerWidth??1024,1),r=Math.max(t?.innerHeight??768,1),a=n<=760?14:20,i=e.getBoundingClientRect(),s=i.width||e.offsetWidth,c=i.height||e.offsetHeight||44;return{margin:a,maxX:Math.max(a,n-a-s),maxY:Math.max(a,r-a-c)}}#de(e,t){let{margin:n,maxX:r,maxY:a}=this.#Ce(e);return{x:Math.min(Math.max(t.x,n),r),y:Math.min(Math.max(t.y,n),a)}}#nt(e,t){let{margin:n,maxX:r,maxY:a}=this.#Ce(e),i=this.#de(e,t);return i.x-n<=ke&&(i.x=n),r-i.x<=ke&&(i.x=r),i.y-n<=ke&&(i.y=n),a-i.y<=ke&&(i.y=a),i}#_(e){this.#c&&(this.#c=this.#de(e,this.#c),e.style.bottom="auto",e.style.left=`${this.#c.x}px`,e.style.right="auto",e.style.top=`${this.#c.y}px`)}#pe(){this.#$?.(),this.#$=null}#ot(e,t){if(e.button!==0)return;let n=this.ownerDocument.defaultView;if(!n)return;this.#pe();let r=t.getBoundingClientRect(),a={x:r.left,y:r.top},i=e.clientX,s=e.clientY,c=!1,l=p=>{let b=p.clientX-i,h=p.clientY-s;!c&&Math.hypot(b,h)<Pn||(c||(c=!0,e.preventDefault(),t.classList.add("is-dragging")),this.#c=this.#de(t,{x:a.x+b,y:a.y+h}),this.#_(t))},d=()=>{n.removeEventListener("pointermove",l),n.removeEventListener("pointerup",d),n.removeEventListener("pointercancel",d),t.classList.remove("is-dragging"),c&&this.#c&&(this.#c=this.#nt(t,this.#c),this.#_(t),this.#D(),this.#V=!0,n.setTimeout(()=>{this.#V=!1},0)),this.#$===d&&(this.#$=null)};n.addEventListener("pointermove",l),n.addEventListener("pointerup",d),n.addEventListener("pointercancel",d),this.#$=d}#G(){this.#I?.(),this.#I=null}#Me(e,t,n){if(this.#s!=="floating"||e.button!==0)return;let r=this.ownerDocument.defaultView;if(!r)return;e.preventDefault(),this.#G(),this.#j(t);let a={...this.#p},i=e.clientX,s=e.clientY;t.classList.add(n?"is-resizing":"is-dragging");let c=d=>{let p=d.clientX-i,b=d.clientY-s,h=this.#z(),u={...a};n?(n.includes("e")&&(u.width=Math.min(Math.max(a.width+p,h.minWidth),h.width-h.margin-a.x)),n.includes("s")&&(u.height=Math.min(Math.max(a.height+b,h.minHeight),h.height-h.margin-a.y)),n.includes("w")&&(u.x=Math.min(Math.max(a.x+p,h.margin),a.x+a.width-h.minWidth),u.width=a.x+a.width-u.x),n.includes("n")&&(u.y=Math.min(Math.max(a.y+b,h.margin),a.y+a.height-h.minHeight),u.height=a.y+a.height-u.y)):(u.x=a.x+p,u.y=a.y+b),this.#p=this.#H(u),this.#j(t)},l=()=>{r.removeEventListener("pointermove",c),r.removeEventListener("pointerup",l),r.removeEventListener("pointercancel",l),t.classList.remove("is-dragging","is-resizing"),this.#D(),this.#I===l&&(this.#I=null)};r.addEventListener("pointermove",c),r.addEventListener("pointerup",l),r.addEventListener("pointercancel",l),this.#I=l}#De=()=>{for(let n of this.#l.keys())this.#ve(n);let e=this.shadowRoot?.querySelector(".launcher");if(e&&this.#c&&(this.#_(e),this.#D()),this.#s!=="floating")return;let t=this.shadowRoot?.querySelector(".panel");t&&(this.#j(t),this.#D())};#qe=e=>{if(e.stopPropagation(),!!this.#L){if(e.key==="Escape"){if(e.preventDefault(),this.#R){this.#re(this.#R);return}this.close();return}if(e.key==="Tab"){let t=this.#Ve();if(!t.length)return;let n=this.shadowRoot?.activeElement,r=t[0],a=t.at(-1);e.shiftKey&&(n===r||!t.includes(n))?(e.preventDefault(),a.focus()):!e.shiftKey&&(n===a||!t.includes(n))&&(e.preventDefault(),r.focus())}}};#Ae=e=>{e.stopPropagation()};#rt(e){this.#e=e,this.#g(),queueMicrotask(()=>this.shadowRoot?.querySelector(`[data-view="${e}"]`)?.focus())}async#at(){if(!this.#n)return;let e=this.#e==="json"?ue(this.#n):pe(this.#n);try{await navigator.clipboard.writeText(e),this.#T="Copied to clipboard"}catch{this.#T="Clipboard access was not available"}let t=this.shadowRoot?.querySelector(".sr-only");t&&(t.textContent=this.#T)}#Y(e){this.#O();let t=e,n=t.ownerDocument.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1;t.scrollIntoView({behavior:n?"auto":"smooth",block:"center"}),n||(this.#ee=t.animate?.([{outline:"3px solid transparent",outlineOffset:"8px"},{outline:"3px solid oklch(62% 0.18 294)",outlineOffset:"4px",offset:.16},{outline:"3px solid transparent",outlineOffset:"8px"}],{duration:1800,easing:"cubic-bezier(.22,1,.36,1)"})??null)}#it(e,t){if(t.metaKey||t.ctrlKey||t.shiftKey||t.altKey)return;let n=this.#n?.sourceDocumentIri??this.ownerDocument.URL,r=me(this.ownerDocument,e,n);if(!r)return;let a=Xe(this.ownerDocument,r),i=this.#n?.quads.filter(l=>l.subject.termType==="NamedNode"&&l.subject.value===e).map(l=>l.source).find(l=>re(l)),s=a??i;if(!s)return;t.preventDefault();let c=this.ownerDocument.defaultView;if(c){let l=new URL(this.ownerDocument.URL);l.hash=r.hash,c.history.pushState(null,"",l.href)}this.#Y(s)}#O(){this.#ee?.cancel(),this.#ee=null}#st(e,t,n,r){if(this.#Q(),this.#d==="off")return;let a=this.ownerDocument.defaultView;if(!a)return;let i=[],s=null,c=null,l=null,d=(m,x,v,C)=>{m.addEventListener(x,v,C),i.push(()=>m.removeEventListener(x,v,C))},p=m=>{s!==null&&a.clearTimeout(s),s=a.setTimeout(()=>{s=null,m()},32)},b=new Map;for(let m of t){let x=b.get(m.quad.source)??[];x.push(m),b.set(m.quad.source,x)}let h=m=>{c?.cancel(),!a.matchMedia?.("(prefers-reduced-motion: reduce)").matches&&(c=m.animate?.([{outline:"2px solid transparent",outlineOffset:"7px"},{outline:"2px solid oklch(62% 0.18 294)",outlineOffset:"4px"}],{direction:"alternate",duration:520,easing:"cubic-bezier(.22,1,.36,1)",iterations:1/0})??null)},u=()=>{c?.cancel(),c=null};if(b.forEach((m,x)=>{d(x,"pointerenter",()=>{r(x),m.forEach(({item:v})=>{v.classList.add("is-corresponding"),v.scrollIntoView?.({block:"nearest"})})}),d(x,"pointerleave",()=>{m.forEach(({item:v})=>v.classList.remove("is-corresponding")),r(null)})}),t.forEach(({item:m,quad:x})=>{let v=x.source;d(m,"pointerenter",()=>{m.classList.add("is-corresponding"),h(v),this.#d==="panel"&&v.scrollIntoView({behavior:a.matchMedia?.("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"center"})}),d(m,"pointerleave",()=>{m.classList.remove("is-corresponding"),u()})}),this.#d==="page"){let m=()=>p(n);d(a,"scroll",m,{passive:!0}),d(a,"resize",m,{passive:!0})}else{let m=()=>{let x=e.getBoundingClientRect(),v=x.top+Math.min(x.height*.35,140),C=null,w=Number.POSITIVE_INFINITY;for(let k of t){if(k.item.hidden)continue;let g=k.item.getBoundingClientRect();if(g.bottom<=x.top||g.top>=x.bottom)continue;let T=Math.abs(g.top-v);T<w&&(C=k,w=T)}let E=C?.quad.source;!E||E===l||!re(E)||(l=E,E.scrollIntoView({behavior:"auto",block:"center"}),h(E))};d(e,"scroll",()=>p(m),{passive:!0}),p(m)}this.#te=()=>{i.forEach(m=>m()),s!==null&&a.clearTimeout(s),u()}}#ct(e,t,n,r,a,i=!1){let c=e.querySelector(".source-code")?.dataset.children===String(r);if(e.querySelectorAll(".source-toggle").forEach(h=>{h.setAttribute("aria-expanded","false");let u=h.dataset.showLabel;u&&(h.setAttribute("aria-label",u),h.title=u)}),e.querySelector(".source-code")?.remove(),e.classList.remove("source-open"),c)return;e.classList.add("source-open"),t.setAttribute("aria-expanded","true");let l=t.dataset.hideLabel;l&&(t.setAttribute("aria-label",l),t.title=l);let d=this.ownerDocument.createElement("section");d.className="source-code",d.id=a,d.dataset.children=String(r),d.setAttribute("aria-label",i?"Element HTML":r?"Element HTML with children":"Element HTML without children");let p=this.ownerDocument.createElement("p");p.className="source-code-label",p.textContent=i?K(n):r?`${K(n)} with children`:`${K(n)} without children`;let b=n.cloneNode(r);d.append(p,ie(b.outerHTML,"html",this.ownerDocument)),e.append(d)}#lt(e,t){if(!t.quads.length){let f=document.createElement("p");f.className="empty",f.textContent="No asserted IA2 statements were found in the document light tree.",e.append(f);return}let n=document.createElement("div");n.className="navigator-tools";let r=document.createElement("div");r.className="navigator-filter";let a=document.createElement("label");a.className="sr-only",a.htmlFor="ia2-navigator-search",a.textContent="Filter RDF statements";let i=document.createElement("input");i.className="navigator-search",i.id="ia2-navigator-search",i.type="search",i.placeholder="Filter statements",i.autocomplete="off",i.spellcheck=!1,i.value=this.#q,i.setAttribute("role","combobox"),i.setAttribute("aria-autocomplete","list"),i.setAttribute("aria-controls","ia2-navigator-suggestions"),i.setAttribute("aria-expanded","false");let s=document.createElement("div");s.className="navigator-search-group";let c=document.createElement("ul");c.className="typeahead",c.id="ia2-navigator-suggestions",c.setAttribute("role","listbox"),c.setAttribute("aria-label","Semantic term suggestions"),c.hidden=!0;let l=document.createElement("span");l.className="sr-only typeahead-status",l.setAttribute("role","status"),l.setAttribute("aria-live","polite");let d=document.createElement("output");d.className="filter-count",d.setAttribute("for",i.id),d.setAttribute("aria-live","polite");let p=document.createElement("div");p.innerHTML=mt({current:this.#d,controlClass:"sync-control",labels:{page:"Follow page viewport in Navigator",panel:"Follow Navigator in page"},optionClass:"sync-option",switchClass:"sync-switch"});let b=p.firstElementChild,h=b.querySelector(".sync-switch");s.append(i,c,d,l),r.append(a,s,b),n.append(r),e.append(n);let u=vo(t),m=fo(t),x=new Map,v=()=>{};if(u.length){let f=document.createElement("nav");f.className="vocabularies",f.setAttribute("aria-label","Namespaces used in this document");let I=document.createElement("p");I.className="vocabularies-label",I.textContent="Namespaces";let S=document.createElement("div");S.className="vocabulary-links";for(let M of u){let H=document.createElement("span");H.className="vocabulary-control";let P=document.createElement("button");P.className="vocabulary-toggle",P.type="button",P.dataset.namespace=M.namespace;let N=document.createElement("span");N.className="vocabulary-name",N.textContent=M.label;let F=document.createElement("span");F.className="vocabulary-count",F.setAttribute("aria-hidden","true"),F.textContent=String(M.count),P.append(N,F),P.addEventListener("click",()=>{this.#x.has(M.namespace)?this.#x.delete(M.namespace):this.#x.add(M.namespace),v()}),x.set(M.namespace,P);let j=document.createElement("a");j.className="vocabulary-link",j.href=M.namespace,j.target="_blank",j.rel="noopener noreferrer",j.title=`Open ${M.namespace} in a new tab`,j.setAttribute("aria-label",`Open ${M.namespace} in a new tab`);let Y=document.createElement("span");Y.className="external-mark",Y.setAttribute("aria-hidden","true"),Y.textContent="\u2197",j.append(Y),H.append(P,j),S.append(H)}f.append(I,S),n.append(f);let D=()=>{let M=Math.max(S.scrollWidth-S.clientWidth,0);f.dataset.overflowLeft=String(S.scrollLeft>1),f.dataset.overflowRight=String(S.scrollLeft<M-1)};S.addEventListener("scroll",D,{passive:!0}),S.addEventListener("pointerenter",D),S.addEventListener("focusin",D);let $=this.ownerDocument.defaultView?.ResizeObserver;$&&(this.#N=new $(()=>D()),this.#N.observe(S)),queueMicrotask(D)}let C=document.createElement("ol");C.className="navigator";let w=new Set(t.quads.map(f=>f.source)),E=[];t.quads.forEach((f,I)=>{let S=document.createElement("li");S.className="quad";let D=io(f.source,w),$=Math.min(D,6);if(S.dataset.depth=String(D),S.style.setProperty("--rdf-indent",`${$*16}px`),D>0){let z=document.createElement("span");z.className="structure-marker",z.setAttribute("aria-hidden","true"),z.textContent="\u21B3",S.append(z)}let M=document.createElement("div");M.className="quad-terms";let H=z=>this.#Y(z),P=ce(document,f.subject,"","subject",H,t.sourceDocumentIri),N=ce(document,f.predicate,"   ","predicate",H,t.sourceDocumentIri),F=ce(document,f.object,"   ","object",H,t.sourceDocumentIri);if(M.append(P,N,F),f.graph){let z=document.createElement("div");z.className="graph",z.append("Graph: ",ce(document,f.graph,"","",H,t.sourceDocumentIri)),M.append(z)}let j=new Set([f.subject,f.predicate,f.object,f.graph].filter(z=>z!==null).map(z=>Te(document,z,t.sourceDocumentIri)).filter(z=>z!==null)),Y=`ia2-source-${I}`,oe=document.createElement("div");oe.className="preview-actions",oe.setAttribute("role","group"),oe.setAttribute("aria-label",`Actions for ${K(f.source)}`),re(f.source)&&!j.has(f.source)&&oe.append(Ye(document,f.source,"carrier-locate-button",H));let Je=ao(f.source),Ze=(z,et=!1)=>{let B=document.createElement("button");B.className="row-action-button source-toggle",B.type="button",B.dataset.children=String(z),B.setAttribute("aria-expanded","false"),B.setAttribute("aria-controls",Y);let tt=et?"":z?" with child content":" without child content",Me=`Show HTML for ${K(f.source)}${tt}`,Ut=`Hide HTML for ${K(f.source)}${tt}`;B.dataset.showLabel=Me,B.dataset.hideLabel=Ut,B.setAttribute("aria-label",Me),B.title=Me;let ge=document.createElement("span");return ge.className="source-glyph",ge.setAttribute("aria-hidden","true"),ge.textContent=z?"</>+":"</>",B.append(ge),B.addEventListener("click",()=>this.#ct(S,B,f.source,z,Y,et)),B};oe.append(Ze(!1,!Je)),Je&&oe.append(Ze(!0)),S.append(M);let Ce=document.createElement("div");Ce.className="quad-actions",Ce.append(oe),S.append(Ce),S.addEventListener("pointerleave",()=>this.#O()),C.append(S),E.push({item:S,namespaces:new Set(Ot(f).map(z=>z.namespace)),quad:f,searchText:co(f)})}),e.append(C),this.#K=E;let k=document.createElement("p");k.className="empty filter-empty",k.textContent="No statements match the active filters.",k.hidden=!0,e.append(k);let g=null;v=()=>{this.#q=i.value;let f=i.value.trim().toLocaleLowerCase(),I=0;E.forEach(({item:$,namespaces:M,quad:H,searchText:P})=>{let N=Array.from(M).every(Y=>!this.#x.has(Y)),F=this.#d!=="page"||so(H.source),j=H.source===g||N&&F&&(!f||P.includes(f));$.hidden=!j,j&&(I+=1)}),x.forEach(($,M)=>{let H=!this.#x.has(M),P=u.find(F=>F.namespace===M)?.count??0,N=`${P} statement${P===1?"":"s"}`;$.setAttribute("aria-pressed",String(H)),$.setAttribute("aria-label",`${H?"Hide":"Show"} ${N} using ${M}`),$.title=$.getAttribute("aria-label")});let S=u.some($=>this.#x.has($.namespace)),D=!!f||S||this.#d==="page";d.textContent=D&&I!==E.length?`${I} of ${E.length}`:"",k.hidden=!D||I>0,C.hidden=D&&I===0};let T=[],y=-1,R=()=>{T=[],y=-1,c.hidden=!0,c.replaceChildren(),i.setAttribute("aria-expanded","false"),i.removeAttribute("aria-activedescendant"),l.textContent=""},L=f=>{if(!T.length)return;y=(f+T.length)%T.length;let I=Array.from(c.querySelectorAll('[role="option"]'));I.forEach((D,$)=>D.setAttribute("aria-selected",String($===y)));let S=I[y];S&&(i.setAttribute("aria-activedescendant",S.id),S.scrollIntoView?.({block:"nearest"}))},A=f=>{i.value=f.display,this.#q=i.value,v(),R()},q=()=>{if(T=go(m,i.value),y=-1,c.replaceChildren(),i.removeAttribute("aria-activedescendant"),!T.length||this.shadowRoot?.activeElement!==i){c.hidden=!0,i.setAttribute("aria-expanded","false"),l.textContent="";return}T.forEach((f,I)=>{let S=document.createElement("li");S.className="typeahead-option",S.id=`ia2-navigator-suggestion-${I}`,S.setAttribute("role","option"),S.setAttribute("aria-selected","false");let D=document.createElement("span");D.className="typeahead-primary";let $=document.createElement("span");if($.className="typeahead-term",$.textContent=f.display,D.append($),f.label&&f.label!==f.display){let P=document.createElement("span");P.className="typeahead-label",P.textContent=f.label,D.append(P)}let M=bo(f),H=document.createElement("span");H.className="typeahead-meta",H.textContent=M.join(" \xB7 "),S.setAttribute("aria-label",[f.display,f.label,...M].filter(Boolean).join(", ")),S.append(D,H),S.addEventListener("pointerdown",P=>P.preventDefault()),S.addEventListener("pointermove",()=>L(I)),S.addEventListener("click",()=>A(f)),c.append(S)}),c.hidden=!1,i.setAttribute("aria-expanded","true"),l.textContent=`${T.length} semantic suggestion${T.length===1?"":"s"} available.`};i.addEventListener("input",()=>{v(),q()}),i.addEventListener("focus",q),i.addEventListener("blur",()=>{this.ownerDocument.defaultView?.setTimeout(()=>{this.shadowRoot?.activeElement!==i&&R()},0)}),i.addEventListener("keydown",f=>{if(f.key==="ArrowDown"||f.key==="ArrowUp"){if(c.hidden&&q(),!T.length)return;f.preventDefault(),f.stopPropagation(),L(y+(f.key==="ArrowDown"?1:-1));return}if(f.key==="Enter"&&y>=0){f.preventDefault(),f.stopPropagation(),A(T[y]);return}if(f.key==="Escape"&&!c.hidden){f.preventDefault(),f.stopPropagation(),R();return}f.key==="Tab"&&R()});let _=()=>{this.#st(e,E,v,f=>{g=f,v()})},U=(f,I=!1)=>{this.#d=f,g=null,xe(h,f,I),v(),_()};this.#W=()=>U("off"),ft(h,(f,I)=>U(f,I)),v(),_()}#dt(e){let t=this.#n;if(!t||!this.#b.count)return;let n=this.ownerDocument,r=n.createElement("div");r.className="shapes-browser";let a=n.createElement("p");a.className="shapes-intro",a.textContent="Shape definitions found in the extracted dataset. This view exposes targets, paths, groups, and constraints; it does not run SHACL validation or rules.",r.append(a);let i=n.createElement("div");i.className="shapes-tools";let s=n.createElement("input");s.className="shapes-search",s.type="search",s.placeholder="Filter shapes, paths, targets, or constraints",s.setAttribute("aria-label",s.placeholder),s.value=this.#J;let c=n.createElement("span");c.className="shapes-filter-count",i.append(s,c),r.append(i);let l=Ie(t.quads,{predicates:Dt,languages:[n.documentElement.lang||"en"]}),d=w=>w.label??It(w.term),p=w=>{let E=n.createElement("div");if(E.className="shape-value",w.termType==="Literal"){let g=n.createElement("span");if(g.className="shape-literal",g.textContent=w.value,E.append(g),w.datatype.value!==de||w.language||w.direction){let T=n.createElement("code");T.textContent=[w.language?`@${w.language}${w.direction?`--${w.direction}`:""}`:"",w.datatype.value!==de?O(w.datatype):""].filter(Boolean).join(" \xB7 "),E.append(T)}return E}let k=l.get(Ge(w));if(k){let g=n.createElement("span");g.className="shape-value-label",g.textContent=k,E.append(g)}return E.append(ce(n,w,"","",void 0,t.sourceDocumentIri)),E},b=(w,E,k)=>{if(!k.length)return;let g=n.createElement("section");g.className="shape-block";let T=n.createElement("h4");T.textContent=E;let y=n.createElement("dl");y.className="shape-facts";let R=new Map;for(let L of k){let A=L.predicate.value,q=R.get(A)??[];q.push(L),R.set(A,q)}for(let[L,A]of R){let q=n.createElement("div");q.className="shape-fact";let _=n.createElement("dt");_.textContent=eo(L);let U=n.createElement("dd");A.forEach(f=>U.append(p(f.object))),q.append(_,U),y.append(q)}g.append(T,y),w.append(g)},h=(w,E)=>{let k=n.createElement("section");k.className="shape-block";let g=n.createElement("h4");g.textContent="Definition";let T=n.createElement("dl");T.className="shape-facts";let y=n.createElement("div");y.className="shape-fact";let R=n.createElement("dt");R.textContent="Shape";let L=n.createElement("dd");if(L.append(p(E.term)),y.append(R,L),T.append(y),E.graphs.length){let A=n.createElement("div");A.className="shape-fact";let q=n.createElement("dt");q.textContent=E.graphs.length===1?"Graph":"Graphs";let _=n.createElement("dd");E.graphs.forEach(U=>_.append(p(U))),A.append(q,_),T.append(A)}k.append(g,T),w.append(k)},u=[],m=new Map;for(let w of this.#b.shapes){let E=w.group?Ge(w.group):"",k=m.get(E)??[];k.push(w),m.set(E,k)}let x=[...this.#b.groups.map(w=>({key:Ge(w.term),label:w.label??It(w.term)})),{key:"",label:"Ungrouped shapes"}];for(let w of x){let E=m.get(w.key)??[];if(!E.length)continue;let k=n.createElement("section");k.className="shape-group";let g=n.createElement("header");g.className="shape-group-heading";let T=n.createElement("h3");T.textContent=w.label;let y=n.createElement("span");y.className="shape-group-count",y.textContent=`${E.length} ${E.length===1?"shape":"shapes"}`,g.append(T,y);let R=n.createElement("div");R.className="shape-list";for(let L of E){let A=n.createElement("details");A.className="shape-row";let q=d(L),_=[q,O(L.term),w.label,...L.quads.flatMap(N=>[N.predicate.value,ne(N.object)])].join(" ").toLocaleLowerCase();A.dataset.search=_;let U=n.createElement("summary"),f=n.createElement("span");f.className="shape-summary-copy";let I=n.createElement("span");I.className="shape-name",I.textContent=q;let S=n.createElement("span");S.className="shape-identifier",S.textContent=O(L.term);let D=n.createElement("span");D.className="shape-summary-meta";let $=n.createElement("span");if($.className="shape-kind",$.textContent=to(L),D.append($),L.targets.length){let N=n.createElement("span");N.className="shape-stat",N.textContent=`${L.targets.length} ${L.targets.length===1?"target":"targets"}`,D.append(N)}if(L.paths.length){let N=n.createElement("span");N.className="shape-stat",N.textContent=`${L.paths.length} ${L.paths.length===1?"path":"paths"}`,D.append(N)}if(L.constraints.length){let N=n.createElement("span");N.className="shape-stat",N.textContent=`${L.constraints.length} ${L.constraints.length===1?"constraint":"constraints"}`,D.append(N)}f.append(I,S,D),U.append(f);let M=n.createElement("div");if(M.className="shape-detail",L.description){let N=n.createElement("p");N.className="shape-description",N.textContent=L.description,M.append(N)}let H=new Set(ot(t.quads,L.term));for(let N of L.targets)N.predicate.value==="http://www.w3.org/ns/shacl#targetNode"&&N.object.termType==="NamedNode"&&H.add(N.object.value);let P=Array.from(H).flatMap(N=>{let F=Te(n,{termType:"NamedNode",value:N},t.sourceDocumentIri);return F?[F]:[]}).filter((N,F,j)=>j.indexOf(N)===F);if(P.length){let N=n.createElement("div");N.className="shape-actions",P.slice(0,4).forEach(F=>{let j=n.createElement("button");j.className="shape-locate",j.type="button",j.textContent=`\u2316 Locate ${K(F)}`,j.addEventListener("click",()=>this.#Y(F)),N.append(j)}),M.append(N)}h(M,L),b(M,"Targets",L.targets),b(M,"Path",L.paths),b(M,"Property shapes",L.properties),b(M,"Constraints",L.constraints),A.append(U,M),R.append(A),u.push(A)}k.append(g,R),r.append(k)}let v=n.createElement("p");v.className="shapes-empty",v.textContent="No shapes match this filter.",v.hidden=!0,r.append(v),e.append(r);let C=()=>{this.#J=s.value;let w=s.value.trim().toLocaleLowerCase(),E=0;u.forEach(k=>{let g=!w||k.dataset.search?.includes(w);k.hidden=!g,g&&(E+=1)}),r.querySelectorAll(".shape-group").forEach(k=>{k.hidden=!Array.from(k.querySelectorAll(".shape-row")).some(g=>!g.hidden)}),c.textContent=w&&E!==u.length?`${E} of ${u.length}`:`${u.length} shapes`,v.hidden=E>0};s.addEventListener("input",C),C()}#pt(e,t){if(!t.length){let r=document.createElement("p");r.className="empty",r.textContent="No extraction diagnostics. The document passed the checks implemented by this preview extractor.",e.append(r);return}let n=document.createElement("ul");n.className="diagnostics";for(let r of t){let a=document.createElement("li");a.className="diagnostic";let i=document.createElement("strong");i.textContent=`${r.severity.toUpperCase()} \xB7 ${r.code}`;let s=document.createElement("p");s.textContent=r.source?`${r.message} Source: ${K(r.source)}`:r.message,a.append(i,s),n.append(a)}e.append(n)}#ut(e){this.#oe();let t=this.ownerDocument.defaultView;if(!t||!e.length)return;let n=[],r=new Map,a=null,i=(l,d,p)=>{l.addEventListener(d,p),n.push(()=>l.removeEventListener(d,p))},s=l=>{a?.cancel(),!t.matchMedia?.("(prefers-reduced-motion: reduce)").matches&&(a=l.animate?.([{outline:"2px solid transparent",outlineOffset:"7px"},{outline:"2px solid oklch(62% 0.18 294)",outlineOffset:"4px"}],{direction:"alternate",duration:520,easing:"cubic-bezier(.22,1,.36,1)",iterations:1/0})??null)},c=()=>{a?.cancel(),a=null};for(let l of e){let d=r.get(l.target)??[];d.push(l.item),r.set(l.target,d),i(l.item,"pointerenter",()=>s(l.target)),i(l.item,"pointerleave",c)}r.forEach((l,d)=>{i(d,"pointerenter",()=>{l.forEach(p=>{p.classList.add("is-corresponding"),p.scrollIntoView?.({block:"nearest"})})}),i(d,"pointerleave",()=>l.forEach(p=>p.classList.remove("is-corresponding")))}),this.#ne=()=>{n.forEach(l=>l()),c()}}#ht(e){let t=this.ownerDocument,n=this.#u?.sourceDocumentIri??t.URL,r=[],a=t.createElement("p");a.className="ontology-intro",a.textContent="Classes and properties defined by this document. The trees follow RDFS hierarchy statements; muted parent terms provide external context.",e.append(a);let i=(s,c,l)=>{if(!c.length)return;let d=t.createElement("section");d.className="ontology-section",d.setAttribute("aria-label",s);let p=t.createElement("div");p.className="ontology-heading";let b=t.createElement("h3");b.textContent=s;let h=t.createElement("span");h.className="ontology-count",h.textContent=`${c.length} defined`,p.append(b,h),d.append(p);let u=new Map(c.map(y=>[y.term.value,y])),m=new Map,x=y=>l==="class"?y.classParents:y.propertyParents;for(let y of c)for(let R of x(y)){let L=m.get(R.value)??[];L.some(A=>A.term.value===y.term.value)||L.push(y),m.set(R.value,L)}let v=y=>[...y].sort((R,L)=>(R.label??R.term.value).localeCompare(L.label??L.term.value));m.forEach((y,R)=>m.set(R,v(y)));let C=new Set,w=y=>this.#Y(y),E=(y,R,L,A=!1)=>{let q=t.createElement("li");q.className="ontology-node";let _=t.createElement("div");_.className=`ontology-term-row${R?"":" ontology-context"}`,_.dataset.term=y.value;let U=t.createElement("div");if(U.className="ontology-term-copy",U.append(ce(t,y,"","",void 0,n)),R?.label){let S=t.createElement("div");S.className="ontology-label",S.textContent=R.label,U.append(S)}let f=t.createElement("div");if(f.className="ontology-meta",R?A?f.textContent="Cycle reference":R.types.length&&(f.textContent=R.types.map(S=>O(S)).join(" \xB7 ")):f.textContent="External parent",f.textContent&&U.append(f),_.append(U),R){C.add(R.term.value);let S=uo(t,R,n);if(S){let D=t.createElement("div");D.className="ontology-actions",D.append(Ye(t,S,"ontology-locate-button",w)),_.append(D),r.push({item:_,target:S})}}if(q.append(_),A)return q;let I=m.get(y.value)??[];if(I.length){let S=t.createElement("ul");S.className="ontology-children";let D=new Set(L);D.add(y.value);for(let $ of I)S.append(E($.term,$,D,D.has($.term.value)));q.append(S)}return q},k=t.createElement("ul");k.className="ontology-tree";let g=new Map;for(let y of c)for(let R of x(y))u.has(R.value)||g.set(R.value,R);for(let y of Array.from(g.values()).sort((R,L)=>R.value.localeCompare(L.value)))k.append(E(y,null,new Set));let T=v(c.filter(y=>x(y).length===0));for(let y of T)k.append(E(y.term,y,new Set));for(let y of c)C.has(y.term.value)||k.append(E(y.term,y,new Set));d.append(k),e.append(d)};i("Classes",this.#k.classes,"class"),i("Properties",this.#k.properties,"property"),this.#ut(r)}#mt(e){let t=this.ownerDocument,n=t.createElement("p");n.className="discovery-intro",n.textContent="Additional knowledge advertised by this document. Loading is explicit, sends no credentials or referrer, does not run scripts, and keeps the retrieved contribution in a separate named graph.",e.append(n);let r=t.createElement("ul");r.className="discovery-list";for(let a of this.#S){let i=this.#r.get(a.id),s=i?.status??"available",c=t.createElement("li");c.className="discovery-item",c.dataset.candidateId=a.id;let l=t.createElement("div");l.className="discovery-copy";let d=t.createElement("a");d.className="discovery-target",d.href=a.target.value,d.target="_blank",d.rel="noopener noreferrer",d.textContent=a.target.value,d.title=`Open ${a.target.value} in a new tab`;let p=t.createElement("p");p.className="discovery-context",p.textContent=`About ${O(a.context)}`,l.append(d,p);let b=t.createElement("div");b.className="discovery-meta";for(let x of a.predicates){let v=t.createElement("span");v.className="discovery-chip",v.textContent=O(x),v.title=x.value,b.append(v)}for(let x of a.roles){let v=t.createElement("span");v.className="discovery-chip role",v.textContent=O(x),v.title=x.value,b.append(v)}if(a.graph){let x=t.createElement("span");x.className="discovery-chip",x.textContent=`graph ${O(a.graph)}`,b.append(x)}b.childElementCount&&l.append(b);let h=t.createElement("div");h.className="discovery-state";let u=t.createElement("span");if(u.className="discovery-status",u.dataset.state=s,i||(u.textContent="Available"),i?.status==="loading"&&(u.textContent="Retrieving HTML/RDF\u2026"),i?.status==="error"&&(u.textContent=i.message??"Retrieval failed."),i?.status==="loaded"){let x=i.contribution?.result.quads.length??0;u.textContent=`${x} statement${x===1?"":"s"} loaded`}let m=t.createElement("button");m.className="discovery-action",m.type="button",m.dataset.candidateId=a.id,m.dataset.state=s,i||(m.textContent="Load"),i?.status==="loading"&&(m.textContent="Cancel"),i?.status==="error"&&(m.textContent="Retry"),i?.status==="loaded"&&(m.textContent="Remove"),m.setAttribute("aria-describedby",`${a.id}-status`),u.id=`${a.id}-status`,m.addEventListener("click",()=>void this.#Ke(a)),h.append(u,m),c.append(l,h),r.append(c)}e.append(r)}#ft(e){let t=this.ownerDocument.createElement("p");t.className="sources-intro",t.textContent="Inspect one document at a time. Sources remain separate so blank nodes, bases, and document identity are not silently merged.";let n=this.ownerDocument.createElement("ul");n.className="source-list";for(let r of this.#o){let a=this.ownerDocument.createElement("li");a.className="source-item";let i=this.ownerDocument.createElement("label");i.className="source-option";let s=this.ownerDocument.createElement("input");s.className="source-input",s.type="radio",s.name="ia2-navigator-source",s.checked=r.id===this.#a,s.dataset.sourceId=r.id,s.addEventListener("change",()=>this.#Ye(r.id));let c=this.ownerDocument.createElement("span");c.className="source-copy";let l=this.ownerDocument.createElement("strong");l.className="source-title",l.textContent=r.label;let d=this.ownerDocument.createElement("span");d.className="source-url",d.textContent=r.url;let p=this.ownerDocument.createElement("span");p.className="source-access";let b=r.access==="direct"?"DOM correlation available":"Collected from an isolated frame; source locations are read-only";p.textContent=`${r.origin} \xB7 ${b}`,c.append(l,d,p);let h=this.ownerDocument.createElement("span");h.className="source-count",h.textContent=`${r.result.quads.length} statement${r.result.quads.length===1?"":"s"}`,i.append(s,c,h),a.append(i),n.append(a)}e.append(t,n)}#X(){let e=this.#se();this.#g(),e&&queueMicrotask(()=>this.#ce(e))}#gt(e,t){if(!t){let n=this.ownerDocument.createElement("span");n.className="sparql-unbound",n.textContent="\u2014",e.append(n);return}if(t.termType==="NamedNode"||t.termType==="BlankNode"){let n=this.#A.get(`${t.termType}:${t.value}`);if(t.termType==="BlankNode"&&!n){let i=this.ownerDocument.createElement("code");i.textContent=`_:${t.value}`,e.append(i);return}let r=this.ownerDocument.createElement("span");r.className="sparql-resource-term";let a=t.termType==="NamedNode"?this.ownerDocument.createElement("a"):this.ownerDocument.createElement("span");if(a.className="sparql-resource-label",a.textContent=n??mo(t.value),a instanceof HTMLAnchorElement){let i=Re(t.value),s=this.#n?.sourceDocumentIri??this.ownerDocument.URL,c=me(this.ownerDocument,t.value,s);a.dataset.semanticIri=t.value,a.href=this.#n?lo(t.value,this.#n):t.value,c?(a.classList.add("local-term"),a.addEventListener("click",l=>this.#it(t.value,l))):(a.target="_blank",a.rel="noopener noreferrer"),a.title=t.value,a.setAttribute("aria-label",`${a.textContent} (${i})`)}else a.title=`_:${t.value}`;r.append(a),e.append(r);return}if(t.termType==="DefaultGraph"){let n=this.ownerDocument.createElement("code");n.textContent="default graph",e.append(n)}else if(t.termType==="Literal"){let n=this.ownerDocument.createElement("span");n.className="sparql-literal";let r=this.ownerDocument.createElement("span");r.className="sparql-literal-value",r.textContent=t.value||"Empty string";let a=t.language?`@${t.language}${t.direction?`--${t.direction}`:""}`:t.datatype&&t.datatype!==de?`^^${O({termType:"NamedNode",value:t.datatype})}`:"";if(n.append(r),a){let i=this.ownerDocument.createElement("code");i.className="sparql-literal-qualifier",i.textContent=a,n.append(i)}e.append(n)}else{let n=this.ownerDocument.createElement("code");n.textContent=t.value,e.append(n)}}#bt(e,t,n){let r=this.ownerDocument.createElement("div");r.className="sparql-table-wrap";let a=this.ownerDocument.createElement("table");a.className="sparql-table";let i=a.createTHead().insertRow();for(let c of t){let l=this.ownerDocument.createElement("th");l.scope="col",l.textContent=`?${c}`,i.append(l)}let s=a.createTBody();for(let c of n){let l=s.insertRow();for(let d of t)this.#gt(l.insertCell(),c[d])}r.append(a),e.append(r)}#Ie(e,t,n,r){let a=this.ownerDocument.createElement("p");a.className="sparql-summary";let i=this.ownerDocument.createElement("div");i.className="sparql-result-body",e.append(a,i);let s=n.length>Mt[0],c=null,l=null,d=null,p=null;if(s){let h=this.ownerDocument.createElement("nav");h.className="sparql-pagination",h.setAttribute("aria-label","SPARQL result pages");let u=this.ownerDocument.createElement("label");u.className="sparql-page-size-label",u.append("Rows per page"),c=this.ownerDocument.createElement("select"),c.className="sparql-page-size";for(let m of Mt){let x=this.ownerDocument.createElement("option");x.value=String(m),x.textContent=String(m),x.selected=m===this.#E,c.append(x)}u.append(c),p=this.ownerDocument.createElement("p"),p.className="sparql-page-status",p.setAttribute("aria-live","polite"),l=this.ownerDocument.createElement("button"),l.className="sparql-page-button sparql-page-previous",l.type="button",l.textContent="Previous",d=this.ownerDocument.createElement("button"),d.className="sparql-page-button sparql-page-next",d.type="button",d.textContent="Next",h.append(u,p,l,d),e.append(h)}let b=()=>{let h=Math.max(1,Math.ceil(n.length/this.#E));this.#i=Math.min(Math.max(0,this.#i),h-1);let u=this.#i*this.#E,m=Math.min(u+this.#E,n.length);a.textContent=s?`Showing ${u+1} to ${m} of ${n.length} ${r}${n.length===1?"":"s"}`:`${n.length} ${r}${n.length===1?"":"s"}`,i.replaceChildren(),n.length&&this.#bt(i,t,n.slice(u,m)),p&&(p.textContent=`Page ${this.#i+1} of ${h}`),l&&(l.disabled=this.#i===0),d&&(d.disabled=this.#i===h-1)};c?.addEventListener("change",()=>{let h=this.#i*this.#E;this.#E=Number(c?.value)||Ct,this.#i=Math.floor(h/this.#E),b()}),l?.addEventListener("click",()=>{this.#i-=1,b()}),d?.addEventListener("click",()=>{this.#i+=1,b()}),b()}#ue(e){if(e.className="sparql-output",this.#t.status==="idle"){let n=this.ownerDocument.createElement("p");n.className="sparql-status",n.textContent="Run the query to inspect its results.",e.append(n);return}if(this.#t.status==="running"){let n=this.ownerDocument.createElement("p");n.className="sparql-status",n.setAttribute("role","status"),n.textContent="Running locally\u2026",e.append(n);return}if(this.#t.status==="error"){let n=this.ownerDocument.createElement("p");n.className="sparql-status",n.dataset.state="error",n.setAttribute("role","alert"),n.textContent=this.#t.error||"The query could not be run.",e.append(n);return}let t=this.#t.result;if(t){if(t.kind==="ask"){let n=this.ownerDocument.createElement("p");n.className="sparql-summary",n.textContent="ASK result";let r=this.ownerDocument.createElement("p");r.className="sparql-boolean",r.textContent=String(t.value),e.append(n,r);return}if(t.kind==="bindings"){this.#Ie(e,t.variables,t.rows,"result");return}this.#Ie(e,["subject","predicate","object","graph"],t.quads,"statement")}}async#$e(){let e=this.#w.trim();if(!e||!this.#n||this.#t.status==="running")return;let t=++this.#f,n=this.#n;this.#i=0,this.#t={status:"running"},this.#X();try{let{executeSparql:r}=await import("./chunks/sparql-engine-FOALRXFP.js"),a=await r(e,n);if(t!==this.#f)return;this.#t={result:a,status:"success"},this.#m=Ht(a,this.#A)}catch(r){if(t!==this.#f)return;this.#t={error:r instanceof Error?r.message:"The query could not be run.",status:"error"},this.#m=""}this.#X()}#vt(e){let t=this.ownerDocument.createElement("div");t.className="sparql-workbench";let n=this.ownerDocument.createElement("p");if(n.className="sparql-intro",n.textContent=this.#h.length?"Choose a query suggested by this document or write your own. Suggestions are RDF resources, not Navigator configuration.":"Write a SPARQL query against the RDF currently extracted from this document.",t.append(n),this.#Z.length>0){let v=this.ownerDocument.createElement("p");v.className="sparql-status",v.dataset.state="error",v.setAttribute("role","alert"),v.textContent=this.#Z.join(" "),t.append(v)}if(this.#h.length){let v=this.ownerDocument.createElement("div");v.className="sparql-catalog";let C=this.ownerDocument.createElement("label");C.className="sparql-label",C.htmlFor="ia2-sparql-suggestion",C.textContent="Suggested query";let w=this.ownerDocument.createElement("select");w.id="ia2-sparql-suggestion",w.className="sparql-select sparql-suggestion";let E=this.ownerDocument.createElement("option");E.value="",E.textContent="Custom query",w.append(E);for(let g of this.#h){let T=this.ownerDocument.createElement("option");T.value=g.id,T.textContent=g.label,T.selected=g.id===this.#v,w.append(T)}w.addEventListener("change",()=>{this.#v=w.value;let g=this.#h.find(({id:T})=>T===w.value);g?this.#w=g.query:this.#w=Qe,this.#i=0,this.#t={status:"idle"},this.#m="",this.#X()}),v.append(C,w);let k=this.ownerDocument.createElement("p");k.className="sparql-description",k.textContent=this.#h.find(({id:g})=>g===this.#v)?.description??"",v.append(k),t.append(v)}let r=this.ownerDocument.createElement("label");r.className="sparql-catalog";let a=this.ownerDocument.createElement("span");a.className="sparql-label",a.textContent="SPARQL query";let i=this.ownerDocument.createElement("div");i.className="sparql-editor-shell";let s=ie(this.#w,"sparql",this.ownerDocument);s.className="sparql-highlight",s.setAttribute("aria-hidden","true");let c=this.ownerDocument.createElement("textarea");c.className="sparql-editor",c.autocapitalize="off",c.autocomplete="off",c.spellcheck=!1,c.wrap="soft",c.value=this.#w,c.setAttribute("aria-keyshortcuts","Control+Enter Meta+Enter");let l=()=>{let v=ie(c.value,"sparql",this.ownerDocument);s.replaceChildren(...v.childNodes),s.scrollTop=c.scrollTop};c.addEventListener("input",()=>{if(this.#w=c.value,l(),this.#h.find(({id:C})=>C===this.#v)?.query!==c.value){this.#v="";let C=t.querySelector(".sparql-suggestion");C&&(C.value="");let w=t.querySelector(".sparql-description");w&&(w.textContent="")}if(this.#t.status!=="idle"){this.#f+=1,this.#i=0,this.#t={status:"idle"},this.#m="";let C=t.querySelector(".sparql-output");C&&(C.replaceChildren(),this.#ue(C))}}),c.addEventListener("scroll",()=>{s.scrollTop=c.scrollTop,c.scrollLeft=0}),c.addEventListener("keydown",v=>{v.key!=="Enter"||!v.ctrlKey&&!v.metaKey||(v.preventDefault(),this.#$e())}),i.append(s,c),r.append(a,i),t.append(r);let d=this.ownerDocument.createElement("div");d.className="sparql-actions";let p=this.ownerDocument.createElement("button");p.className="sparql-run",p.type="button",p.disabled=this.#t.status==="running",p.textContent=this.#t.status==="running"?"Running\u2026":"Run query",p.addEventListener("click",()=>void this.#$e());let b=this.ownerDocument.createElement("button");b.className="sparql-reset",b.type="button",b.textContent="Reset",b.addEventListener("click",()=>{this.#v="",this.#w=Qe,this.#f+=1,this.#i=0,this.#t={status:"idle"},this.#m="",this.#X()});let h=this.ownerDocument.createElement("label");h.className="sparql-observe";let u=this.ownerDocument.createElement("input");u.className="sparql-observe-input",u.type="checkbox",u.checked=this.#U,u.addEventListener("change",()=>{this.#U=u.checked,this.#U&&this.#Ne()}),h.append(u,"Observe changes");let m=this.ownerDocument.createElement("p");m.className="sparql-safety",m.textContent="Local dataset \xB7 Read-only",d.append(p,b,h,m),t.append(d);let x=this.ownerDocument.createElement("section");x.setAttribute("aria-label","SPARQL results"),x.setAttribute("aria-live","polite"),this.#ue(x),t.append(x),e.append(t)}#g(){this.#G(),this.#pe(),this.#ae(),this.#O(),this.#W=null,this.#Q(),this.#oe(),this.#N?.disconnect(),this.#N=null,this.#y?.disconnect(),this.#y=null,this.#K=[];let e=this.#n;if(!e||!this.shadowRoot)return;this.#e==="diagnostics"&&!e.diagnostics.length&&(this.#e="navigator"),this.#e==="discovery"&&!this.#S.length&&(this.#e="navigator"),this.#e==="vocabulary"&&!this.#k.count&&(this.#e="navigator"),this.#e==="shapes"&&!this.#b.count&&(this.#e="navigator"),this.#e==="sources"&&this.#o.length<=1&&(this.#e="navigator");let t=this.#o.find(p=>p.id===this.#a)??this.#o[0],n=this.#Re();this.shadowRoot.innerHTML=`
      <style>${In}</style>
      <button class="launcher" type="button" data-position="${this.#s}" aria-expanded="${this.#L}" aria-controls="ia2-rdf-panel" title="Open RDF Navigator. Drag to move."${this.hasAttribute("data-ia2-extension")?" hidden":""}>
        <span class="mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="2.6" fill="currentColor"/><circle cx="18.5" cy="5" r="2.6" fill="currentColor"/><circle cx="18.5" cy="19" r="2.6" fill="currentColor"/><path d="M7.2 10.8 16 6.2M7.2 13.2 16 17.8" stroke="currentColor" stroke-width="1.8"/></svg></span>
        <span>RDF</span><span class="count">${n}</span>
      </button>
      <aside class="panel ia2-window-surface" id="ia2-rdf-panel" data-open="${this.#L}" data-position="${this.#s}" aria-label="Document RDF" tabindex="-1">
        <header class="toolbar">
          <span class="drag-grip" aria-hidden="true" title="Drag floating navigator"><svg viewBox="0 0 8 18"><circle cx="2" cy="4" r="1.2"/><circle cx="6" cy="4" r="1.2"/><circle cx="2" cy="9" r="1.2"/><circle cx="6" cy="9" r="1.2"/><circle cx="2" cy="14" r="1.2"/><circle cx="6" cy="14" r="1.2"/></svg></span>
          <div class="tabs" role="tablist" aria-label="RDF views" data-compact="0">
            ${ee("navigator",this.#e==="navigator","Navigator","Nav")}
            ${this.#o.length>1?ee("sources",this.#e==="sources","Sources","Sources",this.#o.length,"document"):""}
            ${this.#k.count?ee("vocabulary",this.#e==="vocabulary","Vocabulary","Vocab",this.#k.count,"definition"):""}
            ${this.#b.count?ee("shapes",this.#e==="shapes","Shapes","Shapes",this.#b.count,"shape"):""}
            ${this.#S.length?ee("discovery",this.#e==="discovery","Discovery","Discover",this.#S.length,"candidate"):""}
            ${ee("sparql",this.#e==="sparql","SPARQL","Query",this.#h.length||void 0,"suggested query")}
            ${ee("turtle",this.#e==="turtle","Turtle","TTL")}
            ${ee("json",this.#e==="json","JSON-LD","JSON")}
            ${e.diagnostics.length?ee("diagnostics",this.#e==="diagnostics","Diagnostics","Issues",e.diagnostics.length,"diagnostic"):""}
          </div>
          <div class="header-actions">
            ${pt({ariaLabel:"Drawer position",current:this.#s,groupClass:"position-switch",optionClass:"position-option"})}
            <button class="icon-button refresh" type="button" aria-label="Refresh extraction" title="Refresh extraction">\u21BB</button><button class="icon-button close" type="button" aria-label="Close RDF Navigator" title="Close">\xD7</button>
          </div>
        </header>
        <section class="viewport" role="tabpanel" tabindex="0"></section>
        <footer class="footer"><span>RDF 1.2 \xB7 ${t?.label??"Document"}</span>${this.#e==="turtle"||this.#e==="json"?'<button class="copy" type="button">Copy view</button>':""}</footer>
        <div class="resize-handles" aria-hidden="true">
          ${["n","ne","e","se","s","sw","w","nw"].map(p=>`<span class="resize-handle" data-resize="${p}"></span>`).join("")}
        </div>
        <p class="sr-only" aria-live="polite">${this.#T}</p>
      </aside>`;let r=this.shadowRoot.querySelector(".viewport"),a=this.shadowRoot.querySelector(".tabs");if(this.#He(a),!r)return;if(this.#e==="turtle"&&r.append(ie(pe(e),"turtle",document)),this.#e==="json"){if(Ae(e)){let p=document.createElement("p");p.className="notice",p.textContent="JSON-LD 1.1 has no native RDF 1.2 triple-term syntax. This view preserves triple terms as typed JSON literals; use Turtle for the semantic form.",r.append(p)}r.append(ie(ue(e),"json",document))}this.#e==="navigator"&&this.#lt(r,e),this.#e==="sources"&&this.#ft(r),this.#e==="vocabulary"&&this.#ht(r),this.#e==="shapes"&&this.#dt(r),this.#e==="discovery"&&this.#mt(r),this.#e==="sparql"&&this.#vt(r),this.#e==="diagnostics"&&this.#pt(r,e.diagnostics);let i=this.shadowRoot.querySelector(".launcher");i&&(this.#_(i),i.addEventListener("pointerdown",p=>this.#ot(p,i)),i.addEventListener("click",p=>{if(this.#V){p.preventDefault(),this.#V=!1;return}this.toggle(p instanceof MouseEvent&&p.detail!==0?"panel":"tab")})),this.shadowRoot.querySelector(".close")?.addEventListener("click",()=>this.close()),this.shadowRoot.querySelector(".refresh")?.addEventListener("click",()=>this.refresh());let s=this.shadowRoot.querySelector(".position-switch"),c=Array.from(this.shadowRoot.querySelectorAll(".position-option")),l=this.shadowRoot.querySelector(".panel"),d=(p,b=!1)=>{this.#s=p;let h=this.shadowRoot?.querySelector(".launcher");l&&(l.dataset.position=this.#s,p==="floating"?this.#j(l):this.#tt(l)),h&&(h.dataset.position=this.#s,this.#_(h));for(let u of c){let m=u.dataset.position===this.#s;u.setAttribute("aria-checked",String(m)),u.tabIndex=m?0:-1,m&&b&&u.focus()}this.#D()};if(l){this.#s==="floating"&&this.#j(l);let p=l.querySelector(".toolbar"),b=p?.querySelector(".tabs");p?.addEventListener("pointerdown",h=>{let u=h.target instanceof Element?h.target:null;u!==p&&u!==b&&!u?.closest(".drag-grip")||this.#Me(h,l)}),l.querySelectorAll(".resize-handle").forEach(h=>{h.addEventListener("pointerdown",u=>{this.#Me(u,l,h.dataset.resize)})})}s&&ut(s,(p,b)=>{d(p,b)}),this.shadowRoot.querySelector(".copy")?.addEventListener("click",()=>void this.#at()),this.shadowRoot.querySelectorAll("[data-view]").forEach(p=>{p.addEventListener("click",()=>this.#rt(p.dataset.view))}),this.#Fe()}};customElements.get("ia2-rdf-navigator")||customElements.define("ia2-rdf-navigator",fe);function ko(o=document){let e=o.querySelector("ia2-rdf-navigator");if(e)return e;let t=o.createElement("ia2-rdf-navigator");return o.body.append(t),t}function Ft(){window.__IA2_RDF_NAVIGATOR_NO_AUTO__||ko()}typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ft,{once:!0}):Ft());export{st as DISCOVERY_PREDICATES,fe as Ia2RdfNavigator,$e as detectDiscoveryCandidates,ae as extractDataset,Ke as extractDocumentVocabulary,Ve as extractShaclCatalog,Tn as extractSuggestedSparqlQueries,Ee as extractSuggestedSparqlQueryCatalog,He as fromPortableExtractionResult,Pe as mergeDiscoveryContributions,ko as mountRdfNavigator,ue as serializeJsonLd,pe as serializeTurtle,nt as termToTurtle,dn as toPortableExtractionResult};
