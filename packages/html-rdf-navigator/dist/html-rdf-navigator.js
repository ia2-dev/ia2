import{c as Re,d as Te,e as oe,f as Me,g as Be,h as se,i as ce,j as Ce,k as H,l as me,m as ne,n as We}from"./chunks/chunk-74HIOZ7W.js";var Lt="http://www.w3.org/2000/01/rdf-schema#seeAlso",Rt="http://www.w3.org/2000/01/rdf-schema#isDefinedBy",Tt="http://purl.org/dc/terms/requires",Mt="http://purl.org/dc/terms/source",Ct="http://www.w3.org/ns/prov#wasDerivedFrom",Dt="http://www.w3.org/2002/07/owl#imports",Nt="http://www.w3.org/ns/dcat#qualifiedRelation",qt="http://purl.org/dc/terms/relation",At="http://www.w3.org/ns/dcat#hadRole",Ge=new Set([Lt,Rt,Tt,Mt,Ct,Dt]);function Q(n){return n?`${n.termType}:${n.value}`:"default"}function Ke(n,e){return Q(n)===Q(e)}function Ye(n){try{let e=new URL(n);return e.hash="",e.href}catch{return n.replace(/#.*$/s,"")}}function It(n){let e=2166136261;for(let t=0;t<n.length;t+=1)e^=n.charCodeAt(t),e=Math.imul(e,16777619);return`discovery-${(e>>>0).toString(36)}`}function Qe(n,e){n.some(t=>t.value===e.value)||n.push(e)}function zt(n,e){n.some(t=>Q(t)===Q(e))||n.push(e)}function fe(n,e){n.includes(e)||n.push(e)}function De(n){let e=new Map,t=Ye(n.sourceDocumentIri),o=(r,i,a)=>{if(Ye(i.value)===t)return null;let s=`${Q(r)}|${Q(a)}|${i.value}`,c=e.get(s);return c||(c={context:r,graph:a,id:It(s),predicates:[],qualifiedRelationships:[],roles:[],sources:[],target:i},e.set(s,c)),c};for(let r of n.quads){if(!Ge.has(r.predicate.value)||r.object.termType!=="NamedNode")continue;let i=o(r.subject,r.object,r.graph);i&&(Qe(i.predicates,r.predicate),fe(i.sources,r.source))}for(let r of n.quads){if(r.predicate.value!==Nt||r.object.termType!=="NamedNode"&&r.object.termType!=="BlankNode")continue;let i=r.object,a=n.quads.filter(l=>Ke(l.subject,i)&&Ke(l.graph,r.graph)),s=a.filter(l=>l.predicate.value===qt&&l.object.termType==="NamedNode"),c=a.filter(l=>l.predicate.value===At&&l.object.termType==="NamedNode");for(let l of s){if(l.object.termType!=="NamedNode")continue;let d=o(r.subject,l.object,r.graph);if(d){zt(d.qualifiedRelationships,i),fe(d.sources,r.source),fe(d.sources,l.source);for(let u of c)u.object.termType==="NamedNode"&&(Qe(d.roles,u.object),fe(d.sources,u.source))}}}return Array.from(e.values()).sort((r,i)=>r.target.value.localeCompare(i.target.value))}function Ne(n,e){let t=[...n.quads],o=new Map(n.graphs.map(i=>[Q(i),i])),r=[...n.diagnostics];for(let i of e){let a=Re(i.result.sourceDocumentIri);for(let s of i.result.quads){let c=s.graph??a;t.push({...s,graph:c}),o.set(Q(c),c)}for(let s of i.result.graphs)o.set(Q(s),s);r.push(...i.result.diagnostics.map(s=>({...s,message:`Contribution ${i.result.sourceDocumentIri}: ${s.message}`})))}return{...n,diagnostics:r,graphs:Array.from(o.values()),quads:t}}function O(n){return n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var qe=[{position:"right",label:"Right, full height",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M13 2h5v12h-5z"/></svg>'},{position:"right-top",label:"Right, top half",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M13 2h5v5.5h-5z"/></svg>'},{position:"right-bottom",label:"Right, bottom half",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M13 8.5h5V14h-5z"/></svg>'},{position:"bottom",label:"Bottom, full width",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 9h16v5H2z"/></svg>'},{position:"floating",label:"Floating, centered",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><rect class="position-region" x="5" y="4.5" width="10" height="7" rx="1"/></svg>'},{position:"top",label:"Top, full width",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 2h16v5H2z"/></svg>'},{position:"left",label:"Left, full height",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 2h5v12H2z"/></svg>'},{position:"left-bottom",label:"Left, bottom half",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 8.5h5V14H2z"/></svg>'},{position:"left-top",label:"Left, top half",icon:'<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 2h5v5.5H2z"/></svg>'}],Ze=`
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
`;function ge(n){return typeof n=="string"&&qe.some(({position:e})=>e===n)}function et({allowed:n=qe.map(({position:i})=>i),ariaLabel:e,current:t,groupClass:o="",optionClass:r=""}){let i=O(o),a=O(r),s=new Set(n),c=qe.filter(({position:l})=>s.has(l)).map(({icon:l,label:d,position:u})=>`<button class="ia2-position-option ${a}" type="button" role="radio" data-position="${u}" aria-checked="${t===u}" aria-label="${O(d)}" title="${O(d)}" tabindex="${t===u?"0":"-1"}">${l}</button>`).join("");return`<div class="ia2-position-switch ${i}" role="radiogroup" aria-label="${O(e)}">${c}</div>`}function Xe(n,e,t=!1){let o=Array.from(n.querySelectorAll(".ia2-position-option"));for(let r of o){let i=r.dataset.position===e;r.setAttribute("aria-checked",String(i)),r.tabIndex=i?0:-1,i&&t&&r.focus()}}function tt(n,e){let t=n instanceof HTMLElement&&n.matches(".ia2-position-switch")?n:n.querySelector(".ia2-position-switch"),o=Array.from(n.querySelectorAll(".ia2-position-option")),r=[];for(let a of o){let s=()=>{ge(a.dataset.position)&&e(a.dataset.position,!1)!==!1&&Xe(n,a.dataset.position)};a.addEventListener("click",s),r.push(()=>a.removeEventListener("click",s))}let i=a=>{if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(a.key))return;a.preventDefault();let s=a.target instanceof HTMLButtonElement?o.indexOf(a.target):o.findIndex(d=>d.getAttribute("aria-checked")==="true"),c=s;a.key==="Home"&&(c=0),a.key==="End"&&(c=o.length-1),(a.key==="ArrowRight"||a.key==="ArrowDown")&&(c=(s+1)%o.length),(a.key==="ArrowLeft"||a.key==="ArrowUp")&&(c=(s-1+o.length)%o.length);let l=o[c]?.dataset.position;ge(l)&&e(l,!0)!==!1&&Xe(n,l,!0)};return t?.addEventListener("keydown",i),r.push(()=>t?.removeEventListener("keydown",i)),()=>{for(let a of r)a()}}var ot=[{mode:"off",label:"Scroll synchronization off",icon:`<svg class="sync-icon" viewBox="0 0 32 16" aria-hidden="true" focusable="false">
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
    </svg>`}];function Je(n){return typeof n=="string"&&ot.some(({mode:e})=>e===n)}function nt({ariaLabel:n="Scroll synchronization",controlClass:e="",current:t,label:o="Sync",labels:r={},optionClass:i="",switchClass:a=""}){let s=O(e),c=O(i),l=O(a),d=ot.map(({icon:u,label:g,mode:h})=>{let p=r[h]??g;return`<button class="ia2-sync-option ${c}" type="button" role="radio" data-sync-mode="${h}" aria-checked="${t===h}" aria-label="${O(p)}" title="${O(p)}" tabindex="${t===h?"0":"-1"}">${u}</button>`}).join("");return`<div class="ia2-sync-control ${s}"><span class="ia2-sync-label sync-label">${O(o)}</span><div class="ia2-sync-switch ${l}" role="radiogroup" aria-label="${O(n)}">${d}</div></div>`}function be(n,e,t=!1){let o=Array.from(n.querySelectorAll(".ia2-sync-option"));for(let r of o){let i=r.dataset.syncMode===e;r.setAttribute("aria-checked",String(i)),r.tabIndex=i?0:-1,i&&t&&r.focus()}}function rt(n,e){let t=n instanceof HTMLElement&&n.matches(".ia2-sync-switch")?n:n.querySelector(".ia2-sync-switch"),o=Array.from(n.querySelectorAll(".ia2-sync-option")),r=[];for(let a of o){let s=()=>{Je(a.dataset.syncMode)&&e(a.dataset.syncMode,!1)!==!1&&be(n,a.dataset.syncMode)};a.addEventListener("click",s),r.push(()=>a.removeEventListener("click",s))}let i=a=>{if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(a.key))return;a.preventDefault();let s=a.target instanceof HTMLButtonElement?o.indexOf(a.target):o.findIndex(d=>d.getAttribute("aria-checked")==="true"),c=s;a.key==="Home"&&(c=0),a.key==="End"&&(c=o.length-1),(a.key==="ArrowRight"||a.key==="ArrowDown")&&(c=(s+1)%o.length),(a.key==="ArrowLeft"||a.key==="ArrowUp")&&(c=(s-1+o.length)%o.length);let l=o[c]?.dataset.syncMode;Je(l)&&e(l,!0)!==!1&&be(n,l,!0)};return t?.addEventListener("keydown",i),r.push(()=>t?.removeEventListener("keydown",i)),()=>{for(let a of r)a()}}var $t=/(<https?:\/\/[^>]+>)|("(?:\\.|[^"\\])*"(?:@[A-Za-z0-9-]+(?:--(?:ltr|rtl))?|\^\^(?:<[^>]+>|[A-Za-z][\w-]*:[\w.-]+))?)|(^|\s)(@[a-z]+|[A-Za-z][\w-]*:[\w.-]+)|(_:[A-Za-z][\w-]*)|(#[^\n]*)/gim,Pt=/("(?:\\.|[^"\\])*")\s*(?=:)|("(?:\\.|[^"\\])*")|\b(true|false|null)\b|\b(-?\d+(?:\.\d+)?)\b/g,Ht=/(#[^\n\r]*)|("""(?:\\.|[\s\S])*?"""|'''(?:\\.|[\s\S])*?'''|"(?:\\.|[^"\\])*"(?:@[A-Za-z0-9-]+|\^\^(?:<[^>]+>|[A-Za-z][\w-]*:[\w.-]+))?|'(?:\\.|[^'\\])*'(?:@[A-Za-z0-9-]+|\^\^(?:<[^>]+>|[A-Za-z][\w-]*:[\w.-]+))?)|(<[^<>"{}|^`\\\u0000-\u0020]*>)|([?$][A-Za-z_][\w-]*)|\b(ADD|ALL|AS|ASC|ASK|BASE|BIND|BY|CLEAR|CONSTRUCT|COPY|CREATE|DATA|DEFAULT|DELETE|DESC|DESCRIBE|DISTINCT|DROP|EXISTS|FILTER|FROM|GRAPH|GROUP|HAVING|IN|INSERT|LIMIT|LOAD|MINUS|MOVE|NAMED|NOT|OFFSET|OPTIONAL|ORDER|PREFIX|REDUCED|SELECT|SERVICE|SILENT|TO|UNDEF|UNION|USING|VALUES|WHERE|WITH|TRUE|FALSE|A)\b|(\b-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?\b)|((?:[A-Za-z_][\w-]*)?:[\w.-]*)|([{}()[\];,.])/gim;function G(n,e,t,o){let r=o.createElement("span");r.className=`tok ${t}`,r.textContent=e,n.appendChild(r)}function _t(n,e,t,o){if(t==="iri"){let r=e.slice(1,-1),i=o.createElement("a");i.className="tok iri",i.textContent=e,i.href=r,i.target="_blank",i.rel="noopener noreferrer",n.appendChild(i);return}G(n,e,t,o)}function jt(n){return n[1]?"iri":n[2]?"string":n[4]?"keyword":n[5]?"blank":n[6]?"comment":"name"}function Ot(n){if(n[1])return"key";if(n[2]){try{let e=JSON.parse(n[2]);if(/^https?:\/\//.test(e))return"json-iri"}catch{}return"string"}return n[3]?"keyword":"number"}function Ft(n){return n[1]?"comment":n[2]?"string":n[3]?"iri":n[4]?"variable":n[5]?"keyword":n[6]?"number":n[7]?"name":"punctuation"}function it(n,e,t){if(e.startsWith("<!--")){G(n,e,"comment",t);return}if(/^<!doctype/i.test(e)){G(n,e,"keyword",t);return}let o=/^(<\/?)([^\s/>]+)([\s\S]*?)(\/?>)$/.exec(e);if(!o){n.appendChild(t.createTextNode(e));return}G(n,o[1],"punctuation",t),G(n,o[2],"name",t);let r=o[3]??"",i=/(\s+)([^\s=]+)(?:(\s*=\s*)("[^"]*"|'[^']*'|[^\s]+))?/g,a=0,s;for(;s=i.exec(r);)n.appendChild(t.createTextNode(r.slice(a,s.index)+s[1])),G(n,s[2],"key",t),s[3]&&n.appendChild(t.createTextNode(s[3])),s[4]&&G(n,s[4],"string",t),a=i.lastIndex;n.appendChild(t.createTextNode(r.slice(a))),G(n,o[4],"punctuation",t)}function Ut(n,e,t){let o=0;for(;o<n.length;){let r=n.indexOf("<",o);if(r<0){e.appendChild(t.createTextNode(n.slice(o)));return}if(e.appendChild(t.createTextNode(n.slice(o,r))),n.startsWith("<!--",r)){let s=n.indexOf("-->",r+4),c=s<0?n.length:s+3;it(e,n.slice(r,c),t),o=c;continue}let i="",a=r+1;for(;a<n.length;a+=1){let s=n[a];if(i)s===i&&(i="");else if(s==='"'||s==="'")i=s;else if(s===">"){a+=1;break}}it(e,n.slice(r,a),t),o=a}}function re(n,e,t){let o=t.createElement("pre"),r=t.createElement("code");if(o.append(r),e==="html")return Ut(n,r,t),o;let i=e==="turtle"?new RegExp($t):e==="sparql"?new RegExp(Ht):new RegExp(Pt),a=0,s;for(;s=i.exec(n);){r.append(t.createTextNode(n.slice(a,s.index)));let c=e==="turtle"?jt(s):e==="sparql"?Ft(s):Ot(s);if(c==="json-iri"){let l=t.createElement("a");l.className="tok iri",l.textContent=s[0],l.href=JSON.parse(s[0]),l.target="_blank",l.rel="noopener noreferrer",r.append(l)}else e==="sparql"&&c==="iri"?G(r,s[0],c,t):_t(r,s[0],c,t);a=i.lastIndex}return r.append(t.createTextNode(n.slice(a))),o}function at(n,e,t){let o=e.get(n);if(o)return o;let r=`source-${e.size+1}`;return e.set(n,r),t.push({id:r,markup:n.outerHTML}),r}function Vt(n){let e=new Map,t=[];return{baseIri:n.baseIri,diagnostics:n.diagnostics.map(o=>({code:o.code,message:o.message,severity:o.severity,...o.source?{sourceId:at(o.source,e,t)}:{}})),graphs:n.graphs,portableVersion:1,quads:n.quads.map(o=>({graph:o.graph,object:o.object,predicate:o.predicate,sourceId:at(o.source,e,t),subject:o.subject})),retrievalDocumentIri:n.retrievalDocumentIri,sourceDocumentIri:n.sourceDocumentIri,sources:t,version:"1.2"}}function st(n,e){let t=e.implementation.createHTMLDocument(""),o=t.createElement("template");return o.innerHTML=n,o.content.firstElementChild??t.createElement("span")}function Ae(n,e){if(n.portableVersion!==1||n.version!=="1.2")throw new Error("Unsupported portable Navigator source version.");let t=new Map(n.sources.map(r=>[r.id,st(r.markup,e)])),o=r=>t.get(r)??st("<span></span>",e);return{baseIri:n.baseIri,diagnostics:n.diagnostics.map(r=>({code:r.code,message:r.message,severity:r.severity,...r.sourceId?{source:o(r.sourceId)}:{}})),graphs:n.graphs,quads:n.quads.map(r=>({graph:r.graph,object:r.object,predicate:r.predicate,source:o(r.sourceId),subject:r.subject})),retrievalDocumentIri:n.retrievalDocumentIri,sourceDocumentIri:n.sourceDocumentIri,version:"1.2"}}var Bt="http://www.w3.org/1999/02/22-rdf-syntax-ns#type",Wt="http://www.w3.org/2000/01/rdf-schema#comment",Kt="http://purl.org/dc/terms/description",B="http://www.w3.org/ns/shacl#",Yt=new Set([`${B}SPARQLExecutable`,`${B}SPARQLSelectExecutable`,`${B}SPARQLAskExecutable`,`${B}SPARQLConstructExecutable`]),ct=[{iri:`${B}select`,kind:"select"},{iri:`${B}ask`,kind:"ask"},{iri:`${B}construct`,kind:"construct"}];function dt(n){return`${n.termType}:${n.value}`}function lt(n){if(n.termType==="BlankNode")return`Query ${n.value}`;let e=n.value.match(/[#/]([^#/]+)$/)?.[1];return e?decodeURIComponent(e).replace(/[-_]+/g," ").replace(/\b\w/g,t=>t.toUpperCase()):n.value}function Qt(n,e,t){if(n.termType==="NamedNode")return dt(n);let o=2166136261;for(let r of`${e}
${t}`)o^=r.codePointAt(0)??0,o=Math.imul(o,16777619);return`BlankNodeQuery:${(o>>>0).toString(16)}`}function ve(n){let e=new Map,t=i=>{let a=dt(i),s=e.get(a);return s||(s={executable:!1,queries:{},subject:i},e.set(a,s)),s};for(let i of n.quads){let a=t(i.subject);if(i.predicate.value===Bt&&i.object.termType==="NamedNode"&&Yt.has(i.object.value)&&(a.executable=!0),i.object.termType!=="Literal")continue;let s=ct.find(({iri:c})=>c===i.predicate.value);if(s&&(a.queries[s.kind]=i.object.value.trim()),[Kt,Wt,`${B}description`].includes(i.predicate.value)&&(a.description??=i.object.value.trim()),i.predicate.value===`${B}order`){let c=Number(i.object.value);Number.isFinite(c)&&(a.order=c)}}let o=[],r=Array.from(e.values()).flatMap(i=>{if(!i.executable)return[];let a=ct.map(({kind:c})=>({kind:c,query:i.queries[c]})).filter(c=>!!c.query);if(a.length!==1)return o.push(`${lt(i.subject)} must declare exactly one sh:select, sh:ask, or sh:construct query.`),[];let s=a[0];return[{description:i.description??"",id:Qt(i.subject,s.kind,s.query),kind:s.kind,label:ne(n.quads,i.subject,{predicates:[...me,`${B}name`]})?.trim()||lt(i.subject),order:i.order??Number.POSITIVE_INFINITY,query:s.query}]}).sort((i,a)=>i.order-a.order||i.label.localeCompare(a.label));return{diagnostics:o,queries:r}}function Gt(n){return ve(n).queries}var Xt="http://www.w3.org/1999/02/22-rdf-syntax-ns#type",Jt="http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",Zt="http://www.w3.org/2000/01/rdf-schema#Class",eo="http://www.w3.org/2000/01/rdf-schema#subClassOf",to="http://www.w3.org/2000/01/rdf-schema#subPropertyOf",oo=new Set([Zt,"http://www.w3.org/2002/07/owl#Class","http://www.w3.org/2002/07/owl#DeprecatedClass"]),no=new Set([Jt,"http://www.w3.org/2002/07/owl#ObjectProperty","http://www.w3.org/2002/07/owl#DatatypeProperty","http://www.w3.org/2002/07/owl#AnnotationProperty","http://www.w3.org/2002/07/owl#FunctionalProperty","http://www.w3.org/2002/07/owl#InverseFunctionalProperty","http://www.w3.org/2002/07/owl#TransitiveProperty","http://www.w3.org/2002/07/owl#SymmetricProperty","http://www.w3.org/2002/07/owl#AsymmetricProperty","http://www.w3.org/2002/07/owl#ReflexiveProperty","http://www.w3.org/2002/07/owl#IrreflexiveProperty","http://www.w3.org/2002/07/owl#DeprecatedProperty","http://www.w3.org/2002/07/owl#OntologyProperty"]);function Ie(n,e){n.some(t=>t.value===e.value)||n.push(e)}function ze(n,e){n.includes(e)||n.push(e)}function we(n,e){n.includes(e)||n.push(e)}function $e(n){let e=new Map,t=a=>{let s=e.get(a.value);return s||(s={classParents:[],kinds:[],propertyParents:[],sources:[],term:a,types:[]},e.set(a.value,s)),s};for(let a of n.quads)if(a.subject.termType==="NamedNode"){if(a.predicate.value===Xt&&a.object.termType==="NamedNode"){let s=oo.has(a.object.value),c=no.has(a.object.value);if(!s&&!c)continue;let l=t(a.subject);s&&we(l.kinds,"class"),c&&we(l.kinds,"property"),Ie(l.types,a.object),ze(l.sources,a.source);continue}if(a.predicate.value===eo){let s=t(a.subject);we(s.kinds,"class"),a.object.termType==="NamedNode"&&Ie(s.classParents,a.object),ze(s.sources,a.source);continue}if(a.predicate.value===to){let s=t(a.subject);we(s.kinds,"property"),a.object.termType==="NamedNode"&&Ie(s.propertyParents,a.object),ze(s.sources,a.source)}}let o=Array.from(e.values()).map(a=>{let s=ne(n.quads,a.term);return{...a,...s?{label:s}:{}}}).sort((a,s)=>(a.label??a.term.value).localeCompare(s.label??s.term.value)),r=o.filter(a=>a.kinds.includes("class")),i=o.filter(a=>a.kinds.includes("property"));return{classes:r,count:o.length,definitions:o,properties:i}}var ro=String.raw`
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
  ${Ze}
`,io={navigator:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><circle cx="3" cy="5" r=".8" fill="currentColor" stroke="none"/><circle cx="3" cy="9" r=".8" fill="currentColor" stroke="none"/><circle cx="3" cy="13" r=".8" fill="currentColor" stroke="none"/><path d="M6 5h9M6 9h9M6 13h9"/></svg>',sources:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><rect x="2.5" y="3" width="13" height="9" rx="1.5"/><path d="M6 15h6M9 12v3"/></svg>',vocabulary:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><circle cx="9" cy="3.5" r="2"/><circle cx="4" cy="14" r="2"/><circle cx="14" cy="14" r="2"/><path d="M9 5.5v3M4 12V9h10v3"/></svg>',discovery:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><circle cx="9" cy="9" r="6.5"/><path d="m11.7 6.3-1.5 3.9-3.9 1.5 1.5-3.9z"/></svg>',sparql:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M3 4.5h8M3 9h6M3 13.5h5"/><circle cx="13" cy="12" r="3"/><path d="m15.2 14.2 1.5 1.5"/></svg>',turtle:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="m6.5 4.5-4 4.5 4 4.5M11.5 4.5l4 4.5-4 4.5"/></svg>',json:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M7 3.5H5.5c-1 0-1.5.5-1.5 1.5v2c0 1-.5 1.5-1.5 2 1 .5 1.5 1 1.5 2v2c0 1 .5 1.5 1.5 1.5H7M11 3.5h1.5c1 0 1.5.5 1.5 1.5v2c0 1 .5 1.5 1.5 2-1 .5-1.5 1-1.5 2v2c0 1-.5 1.5-1.5 1.5H11"/></svg>',diagnostics:'<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M8 3.2 2.3 13a1.2 1.2 0 0 0 1 1.8h11.4a1.2 1.2 0 0 0 1-1.8L10 3.2a1.15 1.15 0 0 0-2 0Z"/><path d="M9 6.8v3.4M9 13h.01"/></svg>'};function X(n,e,t,o,r,i){let a=r===void 0?t:`${t} (${r})`,s=r===void 0||!i?t:`${t}, ${r} ${i}${r===1?"":"s"}`;return`<button class="tab" role="tab" data-view="${n}" aria-selected="${e}" aria-label="${a}" title="${s}"><span class="tab-icon" aria-hidden="true">${io[n]}</span><span class="tab-label" data-short="${o}">${t}</span>${r===void 0?"":`<span class="tab-count"> (${r})</span>`}</button>`}var ut="ia2:rdf-navigator:state:v1",Pe=`SELECT ?subject ?predicate ?object ?graph
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
LIMIT 100`,pt=25,ht=[10,25,50,100],ao=[...me,"http://www.w3.org/ns/shacl#name"],so=4,ye=28,mt=2e6,co=1e4,lo="text/html, application/xhtml+xml;q=0.95",uo=2e6,po=4,ho=2,mo=3e3,xe="allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts",ft=`${xe} allow-same-origin`,ae=new Map,fo=new Set(["ontology.inferal.com","purl.archive.org","purl.org","schema.org","www.schema.org","www.w3.org"]),go={Alt:"ch_alt",Bag:"ch_bag",first:"ch_first",HTML:"ch_html",JSON:"ch_json",langString:"ch_langstring",List:"ch_list",nil:"ch_nil",object:"ch_object",predicate:"ch_predicate",Property:"ch_property",reifies:"ch_reifies",rest:"ch_rest",Seq:"ch_seq",Statement:"ch_statement",subject:"ch_subject",type:"ch_type",value:"ch_value",XMLLiteral:"ch_xmlliteral"},bo={Class:"ch_class",comment:"ch_comment",Container:"ch_container",ContainerMembershipProperty:"ch_containermembershipproperty",Datatype:"ch_datatype",domain:"ch_domain",isDefinedBy:"ch_isdefinedby",label:"ch_label",Literal:"ch_literal",member:"ch_member",Proposition:"ch_proposition",range:"ch_range",Resource:"ch_resource",seeAlso:"ch_seealso",subClassOf:"ch_subclassof",subPropertyOf:"ch_subpropertyof"};function vo(n){if(!n||typeof n!="object")return!1;let e=n;return typeof e.height=="number"&&Number.isFinite(e.height)&&e.height>0&&typeof e.width=="number"&&Number.isFinite(e.width)&&e.width>0&&typeof e.x=="number"&&Number.isFinite(e.x)&&typeof e.y=="number"&&Number.isFinite(e.y)}function wo(n){if(!n||typeof n!="object")return!1;let e=n;return typeof e.x=="number"&&Number.isFinite(e.x)&&typeof e.y=="number"&&Number.isFinite(e.y)}var yo="http://www.w3.org/1999/02/22-rdf-syntax-ns#type",xo="http://www.w3.org/2000/01/rdf-schema#domain",Eo="http://www.w3.org/2000/01/rdf-schema#range",So=8,ko={"http://www.w3.org/1999/02/22-rdf-syntax-ns#Property":"RDF property","http://www.w3.org/2000/01/rdf-schema#Class":"RDFS class","http://www.w3.org/2002/07/owl#AnnotationProperty":"Annotation property","http://www.w3.org/2002/07/owl#Class":"OWL class","http://www.w3.org/2002/07/owl#DatatypeProperty":"Datatype property","http://www.w3.org/2002/07/owl#ObjectProperty":"Object property","http://www.w3.org/2002/07/owl#Ontology":"OWL ontology"},Lo=new Set(["area","base","head","link","meta","noscript","script","source","style","template","title","track"]);function W(n){let e=n.id?`#${n.id}`:"";return`<${n.localName}${e}>`}function Se(n){return/^https?:\/\//i.test(n)}function gt(n){let e=new URL(n),t=e.hostname==="www.w3.org"&&e.pathname==="/1999/02/22-rdf-syntax-ns"?decodeURIComponent(e.hash.slice(1)):"";if(t)return new URL(`https://www.w3.org/TR/rdf12-schema/#${go[t]??"rdf-namespace"}`);let o=e.hostname==="www.w3.org"&&e.pathname==="/2000/01/rdf-schema"?decodeURIComponent(e.hash.slice(1)):"";if(o)return new URL(`https://www.w3.org/TR/rdf12-schema/#${bo[o]??"rdfs-namespace"}`);let r=e.hostname==="purl.org"?e.pathname.match(/^\/dc\/terms\/([^/]+)$/):null;return r?new URL(`https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#${encodeURIComponent(r[1])}`):e.hostname==="purl.org"&&e.pathname==="/dc/terms/"?new URL("https://www.dublincore.org/specifications/dublin-core/dcmi-terms/"):(e.protocol==="http:"&&fo.has(e.hostname)&&(e.protocol="https:"),e)}function bt(n){return n.hostname==="www.dublincore.org"&&n.pathname==="/specifications/dublin-core/dcmi-terms/"||n.hostname==="www.w3.org"&&n.pathname.startsWith("/TR/")}function Ro(n){let e=new URL(n.href);return e.hash="",e.href}function To(n,e){for(ae.delete(n),ae.set(n,e);ae.size>po;){let t=ae.keys().next().value;if(!t)break;ae.delete(t)}}function ie(n){return`<!doctype html><meta charset="utf-8"><meta name="color-scheme" content="light dark"><style>
    :root { color: oklch(34% 0.015 286); font: 13px/1.45 ui-sans-serif, system-ui, sans-serif; }
    body { align-items: center; display: flex; justify-content: center; margin: 0; min-height: 100vh; }
    p { color: oklch(54% 0.018 286); margin: 24px; text-align: center; }
  </style><p role="status">${n}</p>`}function Mo(n,e,t){return new Promise((o,r)=>{let i=new n.AbortController,a=!1,s=0,c=d=>{a||(a=!0,n.clearTimeout(s),t.signal.removeEventListener("abort",l),d())},l=()=>{i.abort(),c(()=>r(new Error("Resource preview request was cancelled.")))};t.signal.addEventListener("abort",l,{once:!0}),s=n.setTimeout(()=>{i.abort(),c(()=>r(new Error("Resource preview request timed out.")))},mo),n.fetch(e,{credentials:"omit",redirect:"follow",referrerPolicy:"no-referrer",signal:i.signal}).then(async d=>{let u=await d.text();c(()=>o({html:u,response:d}))}).catch(d=>c(()=>r(d)))})}function vt(n,e,t=""){let r=`<base href="${e.replaceAll("&","&amp;").replaceAll('"',"&quot;")}">`,i=JSON.stringify(e).replaceAll("<","\\u003c"),a=JSON.stringify(t).replaceAll("<","\\u003c"),s=`<script data-ia2-preview-bridge>(() => {
    const baseUrl = new URL(${i});
    const fragment = ${a};
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
  })();<\/script>`,c=`${r}${s}`,l=/<head(?:\s[^>]*)?>/i.exec(n);if(!l)return`${c}${n}`;let d=l.index+l[0].length;return`${n.slice(0,d)}${c}${n.slice(d)}`}function te(n){let e=n.ownerDocument.defaultView;if(!e||!(n instanceof e.HTMLElement)||!n.isConnected||Lo.has(n.localName)||n.closest("head, template, [hidden]")||n.localName==="input"&&n.getAttribute("type")?.toLowerCase()==="hidden")return!1;let t=e.getComputedStyle(n);return t.display!=="none"&&t.visibility!=="hidden"&&t.visibility!=="collapse"}function Co(n){return n.localName==="template"&&"content"in n?n.content.childNodes.length>0:n.childNodes.length>0}function Do(n,e){let t=0,o=n.parentElement;for(;o;)e.has(o)&&(t+=1),o=o.parentElement;return t}function No(n){let e=n.ownerDocument.defaultView;if(!e||!te(n))return!1;let t=n.getBoundingClientRect();return t.width>0&&t.height>0&&t.bottom>0&&t.right>0&&t.top<e.innerHeight&&t.left<e.innerWidth}function ee(n){if(n.termType==="Triple")return[H(n),ee(n.subject),ee(n.predicate),ee(n.object)].join(" ");let e=n.termType==="Literal"?`${n.datatype.value} ${n.language} ${n.direction??""}`:"";return`${H(n)} ${n.value} ${e}`}function qo(n){return[ee(n.subject),ee(n.predicate),ee(n.object),n.graph?ee(n.graph):"",W(n.source)].join(" ").toLocaleLowerCase()}function ue(n,e,t=n.URL){try{let o=new URL(e),r=new URL(t),i=new URL(o),a=new URL(r);return i.hash="",a.hash="",i.href===a.href?o:null}catch{return null}}function Ao(n,e){try{let t=new URL(n),o=new URL(e.sourceDocumentIri),r=new URL(t);if(r.hash="",o.hash="",r.href!==o.href)return t.href;let i=new URL(e.retrievalDocumentIri);return i.hash=t.hash,i.href}catch{return n}}function Io(n,e,t){if(t.metaKey||t.ctrlKey||t.shiftKey||t.altKey)return;t.preventDefault();let o=n.defaultView;if(!o)return;let r=new URL(n.URL);r.hash=e.hash,o.history.pushState(null,"",r.href),(e.hash?_e(n,e):n.documentElement)?.scrollIntoView({behavior:o.matchMedia?.("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"})}function _e(n,e){let t=n.documentElement;if(e.hash){let o=e.hash.slice(1);try{t=n.getElementById(decodeURIComponent(o))}catch{t=n.getElementById(o)}}return t&&te(t)?t:null}function je(n,e,t=n.URL){if(e.termType!=="NamedNode"||!Se(e.value))return null;let o=ue(n,e.value,t);return o?_e(n,o):null}function zo(n,e,t){let o=je(n,e.term,t);if(o)return o;for(let r of e.sources){let i=r.closest("[id]");if(i&&te(i))return i;if(te(r))return r}return null}function He(n,e,t,o){let r=n.createElement("button");r.className=`row-action-button locate-button ${t}`,r.type="button",r.setAttribute("aria-label",`Locate ${W(e)}`),r.title=r.getAttribute("aria-label");let i=n.createElement("span");return i.className="locate-glyph",i.setAttribute("aria-hidden","true"),i.textContent="\u2316",r.append(i),r.addEventListener("click",()=>o(e)),r}function le(n,e,t="",o="",r,i=n.URL){let a=n.createElement("code");o&&(a.className=o),t&&a.append(n.createTextNode(t));let s=H(e);if(e.termType!=="NamedNode"||!Se(e.value))return a.append(n.createTextNode(s)),a;let c=n.createElement("a");c.className="term-link",c.href=e.value;let l=ue(n,e.value,i);l?(c.classList.add("local-term"),c.title=l.hash?`Scroll to ${l.hash} in this document`:"Scroll to the start of this document",c.addEventListener("click",u=>Io(n,l,u))):(c.target="_blank",c.rel="noopener noreferrer",c.title=`Open ${e.value} in a new tab`),c.textContent=s,a.append(c);let d=je(n,e,i);return d&&r&&a.append(He(n,d,"term-locate-button",r)),a}function $o(n){for(let[i,a]of Object.entries(Me))if(n.startsWith(a))return{label:i,namespace:a};if(!Se(n))return null;let e=n.lastIndexOf("#"),t=n.lastIndexOf("/"),o=Math.max(e,t);if(o<8)return null;let r=n.slice(0,o+1);try{let i=new URL(r),a=i.pathname.replace(/\/$/,""),s=r.endsWith("#")?"#":"";return{label:`${i.host}${a}${s}`,namespace:r}}catch{return null}}function U(n){return n.termType==="NamedNode"?[n.value]:n.termType==="BlankNode"?[]:n.termType==="Literal"?H(n).includes("^^")?[n.datatype.value]:[]:[...U(n.subject),...U(n.predicate),...U(n.object)]}function Ee(n){return H({termType:"NamedNode",value:n})}function xt(n){let e=n.replace(/[\/#]+$/,""),t=Math.max(e.lastIndexOf("#"),e.lastIndexOf("/")),o=t>=0?e.slice(t+1):e;try{return decodeURIComponent(o)}catch{return o}}function Po(n){let t=xt(n).replace(/\.[A-Za-z0-9]+$/u,"").replace(/([\p{Ll}\d])(\p{Lu})/gu,"$1 $2").replace(/[_-]+/gu," ").replace(/\s+/gu," ").trim();return t?`${t.charAt(0).toLocaleUpperCase()}${t.slice(1)}`:Ee(n)}function de(n,e){if(!n)return"unbound";let t=n.termType==="NamedNode"||n.termType==="BlankNode"?e.get(`${n.termType}:${n.value}`)??"":"";return JSON.stringify([n.termType,n.value,n.datatype??"",n.language??"",n.direction??"",t])}function wt(n,e){if(n.kind==="ask")return`ask:${String(n.value)}`;if(n.kind==="quads"){let o=n.quads.map(r=>JSON.stringify([de(r.subject,e),de(r.predicate,e),de(r.object,e),de(r.graph,e)])).sort();return JSON.stringify(["quads",o])}let t=n.rows.map(o=>JSON.stringify(n.variables.map(r=>de(o[r],e)))).sort();return JSON.stringify(["bindings",n.variables,t])}function Ho(n){let e=new Map,t=o=>{let r=e.get(o);if(r)return r;let i={domains:new Set,iri:o,ranges:new Set,statementCount:0,types:new Set};return e.set(o,i),i};for(let o of n.quads){let r=new Set([...U(o.subject),...U(o.predicate),...U(o.object),...o.graph?U(o.graph):[]]);for(let a of r)t(a).statementCount+=1;if(o.subject.termType!=="NamedNode")continue;let i=t(o.subject.value);o.predicate.value===yo&&o.object.termType==="NamedNode"&&i.types.add(o.object.value),o.predicate.value===xo&&i.domains.add(H(o.object)),o.predicate.value===Eo&&i.ranges.add(H(o.object))}return Array.from(e.values()).map(o=>{let r=Ee(o.iri),i=xt(o.iri),a=ne(n.quads,o.iri)??"",s=Array.from(o.types,u=>ko[u]??`type ${Ee(u)}`).sort(),c=Array.from(o.domains).sort(),l=Array.from(o.ranges).sort(),d=[r,o.iri,i,a,...s,...c.flatMap(u=>["domain",u,`domain ${u}`]),...l.flatMap(u=>["range",u,`range ${u}`])].join(" ").toLocaleLowerCase();return{display:r,domains:c,iri:o.iri,kinds:s,label:a,localName:i,ranges:l,searchText:d,statementCount:o.statementCount}})}function _o(n,e,t=So){let o=e.trim().toLocaleLowerCase();if(!o)return[];let r=o.split(/\s+/).filter(Boolean);return n.map(i=>{if(!r.every(c=>i.searchText.includes(c)))return null;let a=[i.display,i.localName,i.label].join(" ").toLocaleLowerCase(),s=60;return[i.display,i.localName,i.label].some(c=>c.toLocaleLowerCase()===o)?s=0:[i.display,i.localName,i.label].some(c=>c.toLocaleLowerCase().startsWith(o))?s=10:a.includes(o)?s=20:r.every(c=>a.includes(c))&&(s=35),{score:s-Math.min(i.statementCount,20)/100,suggestion:i}}).filter(i=>i!==null).sort((i,a)=>i.score-a.score||i.suggestion.display.localeCompare(a.suggestion.display)).slice(0,t).map(({suggestion:i})=>i)}function jo(n){let e=[...n.kinds,...n.domains.map(o=>`domain ${o}`),...n.ranges.map(o=>`range ${o}`)],t=`${n.statementCount} statement${n.statementCount===1?"":"s"}`;return[...e,t]}function Et(n){let e=[...U(n.subject),...U(n.predicate),...U(n.object),...n.graph?U(n.graph):[]],t=new Map;for(let o of e){let r=$o(o);r&&t.set(r.namespace,r)}return Array.from(t.values())}function Oo(n){let e=new Map;for(let t of n.quads)for(let o of Et(t)){let r=e.get(o.namespace);r?r.count+=1:e.set(o.namespace,{...o,count:1})}return Array.from(e.values()).sort((t,o)=>t.label.localeCompare(o.label))}var Fo=new Set(["content","datetime","dir","href","lang","src","value"]),yt="[rdf-predicate], [rdf-graph], [rdf-graph-key], base[href], link[rel]";function Uo(n){if(n.type==="characterData")return n.target.parentElement?.closest("[rdf-predicate]")!==null;if(n.type==="attributes"){let t=n.target instanceof Element?n.target:null,o=n.attributeName??"";return t?o.startsWith("rdf-")||t.localName==="base"&&o==="href"||t.localName==="link"&&(o==="href"||o==="rel")?!0:t.hasAttribute("rdf-predicate")?o==="id"||Fo.has(o):!1:!1}return(n.target instanceof Element?n.target:null)?.closest("[rdf-predicate]")?!0:[...n.addedNodes,...n.removedNodes].some(t=>t instanceof Element?t.matches(yt)||t.querySelector(yt)!==null:!1)}function Vo(n,e){let t=new URL(n),o=new URL(e.sourceDocumentIri),r=new URL(e.retrievalDocumentIri);return t.origin!==o.origin||o.origin===r.origin?t.href:new URL(`${t.pathname}${t.search}${t.hash}`,r.origin).href}function Bo(n,e){try{Object.defineProperty(n,"URL",{configurable:!0,value:e})}catch{}let t=n.head?.querySelector("base[href]");t&&(t.href=new URL(t.getAttribute("href")??"",e).href),n.head?.querySelectorAll('link[rel~="canonical"][href]').forEach(o=>{o.href=new URL(o.getAttribute("href")??"",e).href})}function Wo(n){return n instanceof DOMException&&n.name==="AbortError"?"Retrieval timed out.":n instanceof TypeError?"Retrieval was blocked by CORS or network policy.":n instanceof Error?n.message:"The contribution could not be loaded."}var pe=class extends HTMLElement{#o=null;#u=null;#O=null;#de=[];#ue=[];#n=[];#i="top-document";#pe=new WeakMap;#Ae=1;#E=[];#r=new Map;#S={classes:[],count:0,definitions:[],properties:[]};#e="navigator";#k=!1;#L="";#N="";#p=[];#Y=[];#b="";#v=Pe;#t={status:"idle"};#F=!0;#h="";#q=new Map;#a=0;#x=pt;#m=0;#w=new Set;#f="off";#s="right";#d=null;#A=null;#c=null;#I=null;#U=!1;#l=new Map;#R=null;#V=null;#he=20;#Q=null;#G=null;#X=null;#T=null;#y=null;#M=null;#C=null;#B=[];constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.#_e(),this.refresh(),this.addEventListener("keydown",this.#Ce),this.addEventListener("keyup",this.#De),this.ownerDocument.defaultView?.addEventListener("resize",this.#Me,{passive:!0}),this.#Oe()}disconnectedCallback(){this.removeEventListener("keydown",this.#Ce),this.removeEventListener("keyup",this.#De),this.ownerDocument.defaultView?.removeEventListener("resize",this.#Me),this.#M?.disconnect(),this.#M=null;for(let e of this.#r.values())e.controller?.abort();this.#r.clear(),this.#T?.disconnect(),this.#T=null,this.#y?.disconnect(),this.#y=null,this.#C!==null&&window.clearTimeout(this.#C),this.#W(),this.#se(),this.#te(),this.#j(),this.#J(),this.#Z()}#J(){this.#G?.(),this.#G=null}#Z(){this.#X?.(),this.#X=null}#Ie(e){if(this.#y?.disconnect(),this.#y=null,!e)return;let t=()=>{if(e.dataset.compact="0",!(e.clientWidth<=0)){for(let r=0;r<=3;r+=1)if(e.dataset.compact=String(r),e.scrollWidth<=e.clientWidth+1)return}};t();let o=this.ownerDocument.defaultView?.ResizeObserver;o&&(this.#y=new o(t),this.#y.observe(e))}#z(e){this.#l.has(e)&&(this.#R=e,e.style.zIndex=String(++this.#he))}#ee(e){let t=this.#l.get(e);if(!t||(t.abortController?.abort(),t.interactionCleanup?.(),t.navigationCleanup?.(),e.remove(),this.#l.delete(e),this.#V===e&&(this.#V=null),this.#R!==e))return;let o=Array.from(this.#l.keys()).at(-1)??null;this.#R=null,o&&this.#z(o)}#te(){for(let e of Array.from(this.#l.keys()))this.#ee(e);this.#R=null,this.#he=20}#me(e){let t=e.getBoundingClientRect();return{height:Number.parseFloat(e.style.height)||t.height,width:Number.parseFloat(e.style.width)||t.width,x:Number.parseFloat(e.style.left)||t.left,y:Number.parseFloat(e.style.top)||t.top}}#oe(e,t){let o=this.#P(t);e.style.height=`${o.height}px`,e.style.left=`${o.x}px`,e.style.top=`${o.y}px`,e.style.width=`${o.width}px`}#fe(e){this.#oe(e,this.#me(e))}#ge(e,t,o){if(e.button!==0)return;let r=this.ownerDocument.defaultView,i=this.#l.get(t);if(!r||!i)return;e.preventDefault(),this.#z(t),i.interactionCleanup?.(),i.interactionCleanup=null,this.#fe(t);let a=this.#me(t),s=e.clientX,c=e.clientY;t.classList.add(o?"is-resizing":"is-dragging");let l=u=>{let g=u.clientX-s,h=u.clientY-c,p=this.#$(),m={...a};o?(o.includes("e")&&(m.width=Math.min(Math.max(a.width+g,p.minWidth),p.width-p.margin-a.x)),o.includes("s")&&(m.height=Math.min(Math.max(a.height+h,p.minHeight),p.height-p.margin-a.y)),o.includes("w")&&(m.x=Math.min(Math.max(a.x+g,p.margin),a.x+a.width-p.minWidth),m.width=a.x+a.width-m.x),o.includes("n")&&(m.y=Math.min(Math.max(a.y+h,p.margin),a.y+a.height-p.minHeight),m.height=a.y+a.height-m.y)):(m.x=a.x+g,m.y=a.y+h),this.#oe(t,m)},d=()=>{r.removeEventListener("pointermove",l),r.removeEventListener("pointerup",d),r.removeEventListener("pointercancel",d),t.classList.remove("is-dragging","is-resizing"),i.interactionCleanup===d&&(i.interactionCleanup=null)};r.addEventListener("pointermove",l),r.addEventListener("pointerup",d),r.addEventListener("pointercancel",d),i.interactionCleanup=d}#be(e,t,o){let r=this.ownerDocument.defaultView,i=this.#l.get(e);if(!r||!i)return;i.abortController?.abort(),i.abortController=null;let a=gt(o),s=bt(a),c=Ro(a),l=a.hash?decodeURIComponent(a.hash.slice(1)):"";if(t.removeAttribute("srcdoc"),s){t.removeAttribute("src"),t.setAttribute("sandbox",xe);let h=ae.get(c);if(h){t.srcdoc=vt(h.html,h.baseUrl,l);return}t.srcdoc=ie("Loading definition\u2026")}else t.setAttribute("sandbox",ft),t.src=a.href;if(typeof r.fetch!="function"||typeof r.AbortController!="function"){s&&(t.srcdoc=ie("Preview unavailable. Use the open button above."));return}let d=new r.AbortController;i.abortController=d;let u=s?ho:1;(async()=>{let h;for(let p=0;p<u;p+=1)try{return await Mo(r,a.href,d)}catch(m){if(h=m,d.signal.aborted||p+1>=u)throw m;s&&t.isConnected&&(t.srcdoc=ie("Still loading; retrying\u2026"))}throw h})().then(({html:h,response:p})=>{let m=p.headers.get("content-type")?.toLowerCase()??"";if(!p.ok||!m.includes("text/html")&&!m.includes("application/xhtml+xml")){s&&t.isConnected&&(t.srcdoc=ie("Preview unavailable. Use the open button above."));return}if(h.length>uo||d.signal.aborted||!t.isConnected){s&&!d.signal.aborted&&t.isConnected&&(t.srcdoc=ie("Preview is too large. Use the open button above."));return}let b=new URL(p.url||a.href);b.hash="",To(c,{baseUrl:b.href,html:h}),t.setAttribute("sandbox",xe),t.srcdoc=vt(h,b.href,l)}).catch(()=>{s&&t.isConnected&&!d.signal.aborted&&(t.srcdoc=ie("Preview unavailable. Use the open button above."))}).finally(()=>{i.abortController===d&&(i.abortController=null)})}#ve(e,t){let o=e.querySelector(".resource-preview-frame"),r=e.querySelector(".resource-preview-open"),i=e.querySelector(".resource-preview-url");if(!o||!r||!i)return;let s=(e.dataset.previewKind==="definition"?"definition":"resource")==="definition"?"Definition":"Resource";e.setAttribute("aria-label",`${s} preview of ${t}`),i.textContent=t,i.title=t,r.href=t,r.setAttribute("aria-label",`Open ${t} in a new tab`),r.title=r.getAttribute("aria-label"),o.title=`${s} preview of ${t}`,this.#be(e,o,t)}#ze(e,t,o){let r=this.ownerDocument.defaultView;if(!r||!this.shadowRoot||!e.isConnected)return null;let i=this.ownerDocument,a=i.createElement("section");a.className="resource-preview";let s=e.closest(".predicate")?"definition":"resource";a.dataset.previewKind=s,a.setAttribute("role","dialog"),a.setAttribute("aria-label",`${s==="definition"?"Definition":"Resource"} preview of ${e.href}`);let{height:c,margin:l,width:d}=this.#$(),u=Math.max(1,d-l*2),g=Math.max(1,c-l*2),h=s==="definition"?620:Math.max(760,Math.round(d*.72)),p=s==="definition"?520:Math.min(760,Math.max(560,Math.round(c*.82))),m=Math.min(h,u),b=Math.min(p,g),v=this.#l.size%6*24,E=this.#P({height:b,width:m,x:s==="definition"?t-24:Math.round((d-m)/2),y:s==="definition"?o-40:Math.round((c-b)/2)});this.#oe(a,{...E,x:E.x+v,y:E.y+v});let C=i.createElement("header");C.className="resource-preview-bar";let T=i.createElement("span");T.className="resource-preview-url",T.title=e.href,T.textContent=e.href;let k=i.createElement("a");k.className="resource-preview-action resource-preview-open",k.href=e.href,k.target="_blank",k.rel="noopener noreferrer",k.setAttribute("aria-label",`Open ${e.href} in a new tab`),k.title=k.getAttribute("aria-label"),k.textContent="\u2197",C.append(T,k);let L=i.createElement("button");L.className="resource-preview-action resource-preview-close",L.type="button",L.setAttribute("aria-label","Close resource preview"),L.title=L.getAttribute("aria-label"),L.textContent="\xD7",L.addEventListener("click",()=>this.#ee(a)),C.append(L),C.addEventListener("pointerdown",$=>{($.target instanceof Element?$.target:null)?.closest("a, button")||this.#ge($,a)});let x=i.createElement("iframe");x.className="resource-preview-frame",x.title=`${s==="definition"?"Definition":"Resource"} preview of ${e.href}`,x.setAttribute("sandbox",bt(gt(e.href))?xe:ft),x.referrerPolicy="no-referrer",x.tabIndex=0,a.append(C,x);let y=i.createElement("div");y.className="resource-preview-resize-handles",y.setAttribute("aria-hidden","true");for(let $ of["n","ne","e","se","s","sw","w","nw"]){let A=i.createElement("span");A.className="resize-handle",A.dataset.resize=$,A.addEventListener("pointerdown",F=>this.#ge(F,a,$)),y.append(A)}a.append(y),this.shadowRoot.append(a);let S={abortController:null,interactionCleanup:null,navigationCleanup:null};this.#l.set(a,S),a.addEventListener("pointerdown",()=>this.#z(a),{capture:!0}),this.#z(a);let P=$=>{let A=$.data;$.source!==x.contentWindow||A?.type!=="ia2-rdf-preview-navigate"||typeof A.href!="string"||!Se(A.href)||this.#ve(a,A.href)};return r.addEventListener("message",P),S.navigationCleanup=()=>r.removeEventListener("message",P),this.#be(a,x,e.href),a}#we(e,t){let o=e.getBoundingClientRect(),r=t.clientX||o.left+Math.min(o.width/2,24),i=t.clientY||o.top+Math.min(o.height/2,12);return this.#ze(e,r,i)}#$e(e,t){let o=this.#V;if(o?.isConnected&&this.#l.has(o)){this.#z(o),this.#ve(o,e.href);return}this.#V=this.#we(e,t)}#Pe(e){if(!(e instanceof Element))return null;let t=e.closest("a.term-link[href], a.vocabulary-link[href], a.tok.iri[href], a.sparql-resource-label[href]");if(!t||!this.shadowRoot?.contains(t))return null;let o=this.#o?.sourceDocumentIri??this.ownerDocument.URL,r=t.dataset.semanticIri??t.href;return ue(this.ownerDocument,r,o)?null:t}#He(){if(!this.shadowRoot)return;let e=this.shadowRoot.querySelector(".viewport");e&&e.addEventListener("click",t=>{let o=this.#Pe(t.target);!o||t.button!==0||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||(t.preventDefault(),o.classList.contains("sparql-resource-label")?this.#$e(o,t):this.#we(o,t))})}#_e(){try{let e=this.ownerDocument.defaultView?.sessionStorage.getItem(ut);if(!e)return;let t=JSON.parse(e);ge(t.position)&&(this.#s=t.position),vo(t.floatingRect)&&(this.#d=this.#P(t.floatingRect)),wo(t.launcherPosition)&&(this.#c=t.launcherPosition)}catch{}}#D(){try{let e={floatingRect:this.#d,launcherPosition:this.#c,position:this.#s};this.ownerDocument.defaultView?.sessionStorage.setItem(ut,JSON.stringify(e))}catch{}}#ne(){let e=this.shadowRoot?.activeElement;if(!(e instanceof HTMLElement))return null;if(e.classList.contains("navigator-search")){let t=e;return{kind:"search",start:t.selectionStart,end:t.selectionEnd}}if(e.classList.contains("sparql-editor")){let t=e;return{kind:"sparql-editor",start:t.selectionStart,end:t.selectionEnd}}return e.classList.contains("sparql-suggestion")?{kind:"sparql-suggestion"}:e.classList.contains("sparql-run")?{kind:"sparql-run"}:e.classList.contains("sparql-reset")?{kind:"sparql-reset"}:e.classList.contains("sparql-observe-input")?{kind:"sparql-observe"}:e.classList.contains("vocabulary-toggle")&&e.dataset.namespace?{kind:"namespace",key:e.dataset.namespace}:e.classList.contains("sync-option")&&e.dataset.syncMode?{kind:"sync",key:e.dataset.syncMode}:e.classList.contains("position-option")&&e.dataset.position?{kind:"position",key:e.dataset.position}:e.classList.contains("discovery-action")&&e.dataset.candidateId?{kind:"discovery-action",key:e.dataset.candidateId}:e.classList.contains("source-input")&&e.dataset.sourceId?{kind:"source",key:e.dataset.sourceId}:e.classList.contains("tab")&&e.dataset.view?{kind:"tab",key:e.dataset.view}:e.classList.contains("launcher")?{kind:"launcher"}:e.classList.contains("refresh")?{kind:"refresh"}:e.classList.contains("close")?{kind:"close"}:e.classList.contains("copy")?{kind:"copy"}:e.classList.contains("viewport")?{kind:"viewport"}:this.shadowRoot?.querySelector(".panel")?.contains(e)?{kind:"fallback"}:null}#re(e){if(!this.shadowRoot)return;let t=null;e.kind==="search"&&(t=this.shadowRoot.querySelector(".navigator-search")),e.kind==="sparql-editor"&&(t=this.shadowRoot.querySelector(".sparql-editor")),e.kind==="sparql-suggestion"&&(t=this.shadowRoot.querySelector(".sparql-suggestion")),e.kind==="sparql-run"&&(t=this.shadowRoot.querySelector(".sparql-run")),e.kind==="sparql-reset"&&(t=this.shadowRoot.querySelector(".sparql-reset")),e.kind==="sparql-observe"&&(t=this.shadowRoot.querySelector(".sparql-observe-input")),e.kind==="namespace"&&(t=Array.from(this.shadowRoot.querySelectorAll(".vocabulary-toggle")).find(o=>o.dataset.namespace===e.key)??null),e.kind==="sync"&&(t=Array.from(this.shadowRoot.querySelectorAll(".sync-option")).find(o=>o.dataset.syncMode===e.key)??null),e.kind==="position"&&(t=Array.from(this.shadowRoot.querySelectorAll(".position-option")).find(o=>o.dataset.position===e.key)??null),e.kind==="discovery-action"&&(t=Array.from(this.shadowRoot.querySelectorAll(".discovery-action")).find(o=>o.dataset.candidateId===e.key)??null),e.kind==="source"&&(t=Array.from(this.shadowRoot.querySelectorAll(".source-input")).find(o=>o.dataset.sourceId===e.key)??null),e.kind==="tab"&&(t=Array.from(this.shadowRoot.querySelectorAll(".tab")).find(o=>o.dataset.view===e.key)??null),e.kind==="launcher"&&(t=this.shadowRoot.querySelector(".launcher")),e.kind==="refresh"&&(t=this.shadowRoot.querySelector(".refresh")),e.kind==="close"&&(t=this.shadowRoot.querySelector(".close")),e.kind==="copy"&&(t=this.shadowRoot.querySelector(".copy")),e.kind==="viewport"&&(t=this.shadowRoot.querySelector(".viewport")),!t&&e.kind==="fallback"&&(t=this.shadowRoot.querySelector('[role="tab"][aria-selected="true"]')),t?.focus({preventScroll:!0}),e.kind==="search"&&t instanceof HTMLInputElement&&t.setSelectionRange(e.start??t.value.length,e.end??t.value.length),e.kind==="sparql-editor"&&t instanceof HTMLTextAreaElement&&t.setSelectionRange(e.start??t.value.length,e.end??t.value.length)}#je(){let e=this.shadowRoot?.querySelector(".panel");return e?[e,...this.#l.keys()].flatMap(o=>Array.from(o.querySelectorAll("a[href], button, input, select, textarea, [tabindex]"))).filter(o=>o.tabIndex>=0&&!o.hasAttribute("disabled")&&!o.closest("[hidden]")&&o.getAttribute("aria-hidden")!=="true"):[]}#Oe(){this.#M?.disconnect();let e=this.ownerDocument.defaultView?.MutationObserver??MutationObserver;this.#M=new e(t=>{t.some(o=>o.target!==this&&Uo(o))&&(this.#C!==null&&window.clearTimeout(this.#C),this.#C=window.setTimeout(()=>{this.#C=null,this.#t.status==="success"?this.#Qe():this.refresh()},120))});try{this.#M.observe(this.ownerDocument.documentElement,{attributes:!0,characterData:!0,childList:!0,subtree:!0})}catch{this.#M=null}}#ye(){if(!this.#u){this.#o=null,this.#q.clear();return}let e=Array.from(this.#r.values()).flatMap(t=>t.status==="loaded"&&t.contribution?[t.contribution]:[]);this.#o=Ne(this.#u,e),this.#q=We(this.#o.quads,{predicates:ao,languages:[this.ownerDocument.documentElement.lang||"en"]})}#ie(e){this.#ye(),this.#g(),queueMicrotask(()=>{Array.from(this.shadowRoot?.querySelectorAll(".discovery-action")??[]).find(t=>t.dataset.candidateId===e)?.focus({preventScroll:!0})})}#Fe(e){this.#r.get(e)?.controller?.abort(),this.#r.delete(e),this.#ie(e)}async#Ue(e){let t=this.#u,o=this.ownerDocument.defaultView;if(!t||!o)return;let r=this.#r.get(e.id);if(r?.status==="loading"||r?.status==="loaded"){this.#Fe(e.id);return}let i=new AbortController;this.#r.set(e.id,{controller:i,status:"loading"}),this.#ie(e.id);let a=o.setTimeout(()=>i.abort(),co);try{let s=Vo(e.target.value,t),c=new URL(s).protocol;if(c!=="http:"&&c!=="https:")throw new Error(`Unsupported retrieval protocol: ${c}`);let l=await o.fetch(s,{credentials:"omit",headers:{Accept:lo},redirect:"follow",referrerPolicy:"no-referrer",signal:i.signal});if(!l.ok)throw new Error(`Retrieval failed with HTTP ${l.status}.`);let d=Number.parseInt(l.headers.get("content-length")??"",10);if(Number.isFinite(d)&&d>mt)throw new Error("The representation is larger than the 2 MB enrichment limit.");let u=(l.headers.get("content-type")??"").split(";",1)[0].trim().toLowerCase(),g=await l.text();if(g.length>mt)throw new Error("The representation is larger than the 2 MB enrichment limit.");let h=/<!doctype\s+html|<html[\s>]/i.test(g);if(u&&u!=="text/html"&&u!=="application/xhtml+xml")throw new Error(`Unsupported enrichment representation: ${u}. This preview currently extracts HTML/RDF.`);if(!u&&!h)throw new Error("The target did not return an identifiable HTML representation.");let p=new o.DOMParser().parseFromString(g,"text/html"),m=l.url||s;Bo(p,m);let b=oe(p);if(!b.quads.length&&!b.graphs.length)throw new Error("The retrieved HTML contained no extractable RDF.");if(this.#r.get(e.id)?.controller!==i)return;this.#r.set(e.id,{contribution:{candidateId:e.id,result:b,retrievalIri:m},status:"loaded"})}catch(s){if(this.#r.get(e.id)?.controller!==i)return;this.#r.set(e.id,{message:Wo(s),status:"error"})}finally{o.clearTimeout(a)}this.#ie(e.id)}#Ve(e){let t=this.#pe.get(e);return t||(t=`document-frame-${this.#Ae++}`,this.#pe.set(e,t)),t}#Be(){return Array.from(this.ownerDocument.querySelectorAll("iframe, frame")).flatMap((t,o)=>{let r=null;try{if(r=t.contentDocument,!r?.documentElement)return[];r.documentElement.localName}catch{return[]}let i=r.URL||r.baseURI,a="Opaque origin";try{a=new URL(i).origin}catch{}let s=t.getAttribute("title")?.trim()||r.title.trim()||`Embedded document ${o+1}`;return[{access:"direct",id:this.#Ve(t),label:s,origin:a,result:oe(r),url:i}]})}#xe(e,t=!1){let o=this.#n.find(a=>a.id===this.#i)??this.#n[0];if(!o)return;if(this.#i=o.id,this.#u=o.result,!e){for(let a of this.#r.values())a.controller?.abort();this.#r.clear()}this.#E=De(this.#u),this.#S=$e(this.#u);let r=ve(this.#u);this.#p=r.queries,this.#Y=r.diagnostics,this.#p.some(a=>a.id===this.#b)||(this.#b=""),t||(this.#m+=1,this.#a=0,this.#t={status:"idle"},this.#h="");let i=new Set(this.#E.map(a=>a.id));for(let[a,s]of this.#r)i.has(a)||(s.controller?.abort(),this.#r.delete(a));this.#ye()}#Ee(e,t=!1){if(!this.#O)return;let o=this.#i,r=this.ownerDocument.URL||this.ownerDocument.baseURI,i="Opaque origin";try{i=new URL(r).origin}catch{}let a=new Set,s=[{access:"direct",id:"top-document",label:"Top document",origin:i,result:this.#O,url:r},...this.#de,...this.#ue];this.#n=s.filter(d=>a.has(d.id)?!1:(a.add(d.id),!0)),this.#n.some(d=>d.id===this.#i)||(this.#i="top-document");let c=this.#n[0],l=this.#n.slice(1).filter(d=>d.result.quads.length>0);this.#i===c.id&&c.result.quads.length===0&&l.length===1&&(this.#i=l[0].id),this.#xe(e,t&&o===this.#i)}#We(e){e===this.#i||!this.#n.some(t=>t.id===e)||(this.#i=e,this.#xe(!1),this.#e="navigator",this.#N="",this.#w.clear(),this.#f="off",this.#g())}setSources(e){if(this.#ue=e.flatMap(o=>{if(!o||o.access!=="portable"||!o.id||o.id==="top-document")return[];try{return[{access:"portable",id:o.id,label:o.label||"Embedded document",origin:o.origin||"Opaque origin",result:Ae(o.result,this.ownerDocument),url:o.url||o.result.retrievalDocumentIri}]}catch{return[]}}),!this.#O)return;let t=this.#ne();this.#Ee(!0),this.#g(),t&&queueMicrotask(()=>this.#re(t))}#Se(e){this.#O=oe(this.ownerDocument),this.#de=this.#Be(),this.#Ee(!0,e)}#ke(){let e=this.#n.find(r=>r.id===this.#i)??this.#n[0],t=this.#n.reduce((r,i)=>r+i.result.quads.length,0),o=Math.max(0,(this.#o?.quads.length??0)-(e?.result.quads.length??0));return t+o}#Ke(){let e=this.shadowRoot?.querySelector(".launcher .count");e&&(e.textContent=String(this.#ke()))}#Ye(){let e=this.shadowRoot?.querySelector(".sparql-output");e&&(e.replaceChildren(),this.#le(e))}async#Le(){let e=this.#v.trim();if(!this.#F||!e||!this.#o||this.#t.status!=="success")return;let t=++this.#m,o=this.#o;try{let{executeSparql:r}=await import("./chunks/sparql-engine-KXGKCH7C.js"),i=await r(e,o);if(t!==this.#m)return;let a=wt(i,this.#q);if(a===this.#h)return;this.#t={result:i,status:"success"},this.#h=a}catch(r){if(t!==this.#m)return;this.#t={error:r instanceof Error?r.message:"The query could not be run.",status:"error"},this.#h=""}this.#e==="sparql"&&this.#Ye()}async#Qe(){let e=this.#i;if(this.#Se(!0),e!==this.#i||this.#t.status!=="success"){this.#g();return}this.#e==="sparql"?this.#Ke():this.#g(),await this.#Le()}refresh(){let e=this.#ne();this.#Se(!1),this.#g(),e&&queueMicrotask(()=>this.#re(e))}open(e="tab"){this.#k=!0,this.shadowRoot?.querySelector(".launcher")?.setAttribute("aria-expanded","true");let t=this.shadowRoot?.querySelector(".panel");t&&(t.dataset.open="true"),queueMicrotask(()=>{(e==="tab"?this.shadowRoot?.querySelector('[role="tab"][aria-selected="true"]'):this.shadowRoot?.querySelector(".panel"))?.focus({preventScroll:!0})})}close(){this.#k=!1,this.#W(),this.#te(),this.#j(),this.shadowRoot?.querySelector(".launcher")?.setAttribute("aria-expanded","false");let e=this.shadowRoot?.querySelector(".panel");e&&(e.dataset.open="false"),queueMicrotask(()=>{let t=this.shadowRoot?.querySelector(".launcher");if(t?.hidden){this.shadowRoot?.activeElement?.blur();return}t?.focus()})}toggle(e="tab"){this.#k?this.close():this.open(e)}revealSource(e,t="left"){return!(this.#u?.quads.some(r=>r.source===e)??!1)||e.ownerDocument!==this.ownerDocument?!1:(this.#s=t,this.#e="navigator",this.#N="",this.#w.clear(),this.#f="off",this.#g(),this.#D(),this.open("panel"),queueMicrotask(()=>{let r=this.#B.filter(({quad:s})=>s.source===e),i=r[0]?.item;if(!i)return;this.#B.forEach(({item:s})=>s.classList.remove("is-corresponding")),r.forEach(({item:s})=>{s.hidden=!1,s.classList.add("is-corresponding")}),i.tabIndex=-1,i.scrollIntoView?.({block:"center"}),i.focus({preventScroll:!0}),this.#L=`Showing statements carried by ${W(e)}`;let a=this.shadowRoot?.querySelector(".sr-only");a&&(a.textContent=this.#L)}),!0)}#$(){let e=this.ownerDocument.defaultView,t=Math.max(e?.innerWidth??1024,1),o=Math.max(e?.innerHeight??768,1),r=t<=760?10:24;return{height:o,margin:r,minHeight:Math.min(280,Math.max(o-r*2,1)),minWidth:Math.min(360,Math.max(t-r*2,1)),width:t}}#P(e){let{height:t,margin:o,minHeight:r,minWidth:i,width:a}=this.#$(),s=Math.max(a-o*2,1),c=Math.max(t-o*2,1),l=Math.min(Math.max(e.width,i),s),d=Math.min(Math.max(e.height,r),c);return{height:d,width:l,x:Math.min(Math.max(e.x,o),a-o-l),y:Math.min(Math.max(e.y,o),t-o-d)}}#Ge(){let{height:e,margin:t,width:o}=this.#$(),r=Math.min(760,Math.max(o-t*2,1)),i=Math.min(860,Math.max(e-t*2,1),Math.max(360,Math.round(e*.82)));return{height:i,width:r,x:Math.round((o-r)/2),y:Math.round((e-i)/2)}}#H(e){this.#d=this.#P(this.#d??this.#Ge()),e.style.height=`${this.#d.height}px`,e.style.left=`${this.#d.x}px`,e.style.top=`${this.#d.y}px`,e.style.width=`${this.#d.width}px`}#Xe(e){e.style.height="",e.style.left="",e.style.top="",e.style.width=""}#Re(e){let t=this.ownerDocument.defaultView,o=Math.max(t?.innerWidth??1024,1),r=Math.max(t?.innerHeight??768,1),i=o<=760?14:20,a=e.getBoundingClientRect(),s=a.width||e.offsetWidth,c=a.height||e.offsetHeight||44;return{margin:i,maxX:Math.max(i,o-i-s),maxY:Math.max(i,r-i-c)}}#ae(e,t){let{margin:o,maxX:r,maxY:i}=this.#Re(e);return{x:Math.min(Math.max(t.x,o),r),y:Math.min(Math.max(t.y,o),i)}}#Je(e,t){let{margin:o,maxX:r,maxY:i}=this.#Re(e),a=this.#ae(e,t);return a.x-o<=ye&&(a.x=o),r-a.x<=ye&&(a.x=r),a.y-o<=ye&&(a.y=o),i-a.y<=ye&&(a.y=i),a}#_(e){this.#c&&(this.#c=this.#ae(e,this.#c),e.style.bottom="auto",e.style.left=`${this.#c.x}px`,e.style.right="auto",e.style.top=`${this.#c.y}px`)}#se(){this.#I?.(),this.#I=null}#Ze(e,t){if(e.button!==0)return;let o=this.ownerDocument.defaultView;if(!o)return;this.#se();let r=t.getBoundingClientRect(),i={x:r.left,y:r.top},a=e.clientX,s=e.clientY,c=!1,l=u=>{let g=u.clientX-a,h=u.clientY-s;!c&&Math.hypot(g,h)<so||(c||(c=!0,e.preventDefault(),t.classList.add("is-dragging")),this.#c=this.#ae(t,{x:i.x+g,y:i.y+h}),this.#_(t))},d=()=>{o.removeEventListener("pointermove",l),o.removeEventListener("pointerup",d),o.removeEventListener("pointercancel",d),t.classList.remove("is-dragging"),c&&this.#c&&(this.#c=this.#Je(t,this.#c),this.#_(t),this.#D(),this.#U=!0,o.setTimeout(()=>{this.#U=!1},0)),this.#I===d&&(this.#I=null)};o.addEventListener("pointermove",l),o.addEventListener("pointerup",d),o.addEventListener("pointercancel",d),this.#I=d}#W(){this.#A?.(),this.#A=null}#Te(e,t,o){if(this.#s!=="floating"||e.button!==0)return;let r=this.ownerDocument.defaultView;if(!r)return;e.preventDefault(),this.#W(),this.#H(t);let i={...this.#d},a=e.clientX,s=e.clientY;t.classList.add(o?"is-resizing":"is-dragging");let c=d=>{let u=d.clientX-a,g=d.clientY-s,h=this.#$(),p={...i};o?(o.includes("e")&&(p.width=Math.min(Math.max(i.width+u,h.minWidth),h.width-h.margin-i.x)),o.includes("s")&&(p.height=Math.min(Math.max(i.height+g,h.minHeight),h.height-h.margin-i.y)),o.includes("w")&&(p.x=Math.min(Math.max(i.x+u,h.margin),i.x+i.width-h.minWidth),p.width=i.x+i.width-p.x),o.includes("n")&&(p.y=Math.min(Math.max(i.y+g,h.margin),i.y+i.height-h.minHeight),p.height=i.y+i.height-p.y)):(p.x=i.x+u,p.y=i.y+g),this.#d=this.#P(p),this.#H(t)},l=()=>{r.removeEventListener("pointermove",c),r.removeEventListener("pointerup",l),r.removeEventListener("pointercancel",l),t.classList.remove("is-dragging","is-resizing"),this.#D(),this.#A===l&&(this.#A=null)};r.addEventListener("pointermove",c),r.addEventListener("pointerup",l),r.addEventListener("pointercancel",l),this.#A=l}#Me=()=>{for(let o of this.#l.keys())this.#fe(o);let e=this.shadowRoot?.querySelector(".launcher");if(e&&this.#c&&(this.#_(e),this.#D()),this.#s!=="floating")return;let t=this.shadowRoot?.querySelector(".panel");t&&(this.#H(t),this.#D())};#Ce=e=>{if(e.stopPropagation(),!!this.#k){if(e.key==="Escape"){if(e.preventDefault(),this.#R){this.#ee(this.#R);return}this.close();return}if(e.key==="Tab"){let t=this.#je();if(!t.length)return;let o=this.shadowRoot?.activeElement,r=t[0],i=t.at(-1);e.shiftKey&&(o===r||!t.includes(o))?(e.preventDefault(),i.focus()):!e.shiftKey&&(o===i||!t.includes(o))&&(e.preventDefault(),r.focus())}}};#De=e=>{e.stopPropagation()};#et(e){this.#e=e,this.#g(),queueMicrotask(()=>this.shadowRoot?.querySelector(`[data-view="${e}"]`)?.focus())}async#tt(){if(!this.#o)return;let e=this.#e==="json"?ce(this.#o):se(this.#o);try{await navigator.clipboard.writeText(e),this.#L="Copied to clipboard"}catch{this.#L="Clipboard access was not available"}let t=this.shadowRoot?.querySelector(".sr-only");t&&(t.textContent=this.#L)}#ce(e){this.#j();let t=e,o=t.ownerDocument.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1;t.scrollIntoView({behavior:o?"auto":"smooth",block:"center"}),o||(this.#Q=t.animate?.([{outline:"3px solid transparent",outlineOffset:"8px"},{outline:"3px solid oklch(62% 0.18 294)",outlineOffset:"4px",offset:.16},{outline:"3px solid transparent",outlineOffset:"8px"}],{duration:1800,easing:"cubic-bezier(.22,1,.36,1)"})??null)}#ot(e,t){if(t.metaKey||t.ctrlKey||t.shiftKey||t.altKey)return;let o=this.#o?.sourceDocumentIri??this.ownerDocument.URL,r=ue(this.ownerDocument,e,o);if(!r)return;let i=_e(this.ownerDocument,r),a=this.#o?.quads.filter(l=>l.subject.termType==="NamedNode"&&l.subject.value===e).map(l=>l.source).find(l=>te(l)),s=i??a;if(!s)return;t.preventDefault();let c=this.ownerDocument.defaultView;if(c){let l=new URL(this.ownerDocument.URL);l.hash=r.hash,c.history.pushState(null,"",l.href)}this.#ce(s)}#j(){this.#Q?.cancel(),this.#Q=null}#nt(e,t,o,r){if(this.#J(),this.#f==="off")return;let i=this.ownerDocument.defaultView;if(!i)return;let a=[],s=null,c=null,l=null,d=(m,b,v,E)=>{m.addEventListener(b,v,E),a.push(()=>m.removeEventListener(b,v,E))},u=m=>{s!==null&&i.clearTimeout(s),s=i.setTimeout(()=>{s=null,m()},32)},g=new Map;for(let m of t){let b=g.get(m.quad.source)??[];b.push(m),g.set(m.quad.source,b)}let h=m=>{c?.cancel(),!i.matchMedia?.("(prefers-reduced-motion: reduce)").matches&&(c=m.animate?.([{outline:"2px solid transparent",outlineOffset:"7px"},{outline:"2px solid oklch(62% 0.18 294)",outlineOffset:"4px"}],{direction:"alternate",duration:520,easing:"cubic-bezier(.22,1,.36,1)",iterations:1/0})??null)},p=()=>{c?.cancel(),c=null};if(g.forEach((m,b)=>{d(b,"pointerenter",()=>{r(b),m.forEach(({item:v})=>{v.classList.add("is-corresponding"),v.scrollIntoView?.({block:"nearest"})})}),d(b,"pointerleave",()=>{m.forEach(({item:v})=>v.classList.remove("is-corresponding")),r(null)})}),t.forEach(({item:m,quad:b})=>{let v=b.source;d(m,"pointerenter",()=>{m.classList.add("is-corresponding"),h(v),this.#f==="panel"&&v.scrollIntoView({behavior:i.matchMedia?.("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"center"})}),d(m,"pointerleave",()=>{m.classList.remove("is-corresponding"),p()})}),this.#f==="page"){let m=()=>u(o);d(i,"scroll",m,{passive:!0}),d(i,"resize",m,{passive:!0})}else{let m=()=>{let b=e.getBoundingClientRect(),v=b.top+Math.min(b.height*.35,140),E=null,C=Number.POSITIVE_INFINITY;for(let k of t){if(k.item.hidden)continue;let L=k.item.getBoundingClientRect();if(L.bottom<=b.top||L.top>=b.bottom)continue;let x=Math.abs(L.top-v);x<C&&(E=k,C=x)}let T=E?.quad.source;!T||T===l||!te(T)||(l=T,T.scrollIntoView({behavior:"auto",block:"center"}),h(T))};d(e,"scroll",()=>u(m),{passive:!0}),u(m)}this.#G=()=>{a.forEach(m=>m()),s!==null&&i.clearTimeout(s),p()}}#rt(e,t,o,r,i,a=!1){let c=e.querySelector(".source-code")?.dataset.children===String(r);if(e.querySelectorAll(".source-toggle").forEach(h=>{h.setAttribute("aria-expanded","false");let p=h.dataset.showLabel;p&&(h.setAttribute("aria-label",p),h.title=p)}),e.querySelector(".source-code")?.remove(),e.classList.remove("source-open"),c)return;e.classList.add("source-open"),t.setAttribute("aria-expanded","true");let l=t.dataset.hideLabel;l&&(t.setAttribute("aria-label",l),t.title=l);let d=this.ownerDocument.createElement("section");d.className="source-code",d.id=i,d.dataset.children=String(r),d.setAttribute("aria-label",a?"Element HTML":r?"Element HTML with children":"Element HTML without children");let u=this.ownerDocument.createElement("p");u.className="source-code-label",u.textContent=a?W(o):r?`${W(o)} with children`:`${W(o)} without children`;let g=o.cloneNode(r);d.append(u,re(g.outerHTML,"html",this.ownerDocument)),e.append(d)}#it(e,t){if(!t.quads.length){let f=document.createElement("p");f.className="empty",f.textContent="No asserted IA2 statements were found in the document light tree.",e.append(f);return}let o=document.createElement("div");o.className="navigator-tools";let r=document.createElement("div");r.className="navigator-filter";let i=document.createElement("label");i.className="sr-only",i.htmlFor="ia2-navigator-search",i.textContent="Filter RDF statements";let a=document.createElement("input");a.className="navigator-search",a.id="ia2-navigator-search",a.type="search",a.placeholder="Filter statements",a.autocomplete="off",a.spellcheck=!1,a.value=this.#N,a.setAttribute("role","combobox"),a.setAttribute("aria-autocomplete","list"),a.setAttribute("aria-controls","ia2-navigator-suggestions"),a.setAttribute("aria-expanded","false");let s=document.createElement("div");s.className="navigator-search-group";let c=document.createElement("ul");c.className="typeahead",c.id="ia2-navigator-suggestions",c.setAttribute("role","listbox"),c.setAttribute("aria-label","Semantic term suggestions"),c.hidden=!0;let l=document.createElement("span");l.className="sr-only typeahead-status",l.setAttribute("role","status"),l.setAttribute("aria-live","polite");let d=document.createElement("output");d.className="filter-count",d.setAttribute("for",a.id),d.setAttribute("aria-live","polite");let u=document.createElement("div");u.innerHTML=nt({current:this.#f,controlClass:"sync-control",labels:{page:"Follow page viewport in Navigator",panel:"Follow Navigator in page"},optionClass:"sync-option",switchClass:"sync-switch"});let g=u.firstElementChild,h=g.querySelector(".sync-switch");s.append(a,c,d,l),r.append(i,s,g),o.append(r),e.append(o);let p=Oo(t),m=Ho(t),b=new Map,v=()=>{};if(p.length){let f=document.createElement("nav");f.className="vocabularies",f.setAttribute("aria-label","Namespaces used in this document");let D=document.createElement("p");D.className="vocabularies-label",D.textContent="Namespaces";let w=document.createElement("div");w.className="vocabulary-links";for(let M of p){let z=document.createElement("span");z.className="vocabulary-control";let I=document.createElement("button");I.className="vocabulary-toggle",I.type="button",I.dataset.namespace=M.namespace;let K=document.createElement("span");K.className="vocabulary-name",K.textContent=M.label;let V=document.createElement("span");V.className="vocabulary-count",V.setAttribute("aria-hidden","true"),V.textContent=String(M.count),I.append(K,V),I.addEventListener("click",()=>{this.#w.has(M.namespace)?this.#w.delete(M.namespace):this.#w.add(M.namespace),v()}),b.set(M.namespace,I);let _=document.createElement("a");_.className="vocabulary-link",_.href=M.namespace,_.target="_blank",_.rel="noopener noreferrer",_.title=`Open ${M.namespace} in a new tab`,_.setAttribute("aria-label",`Open ${M.namespace} in a new tab`);let Y=document.createElement("span");Y.className="external-mark",Y.setAttribute("aria-hidden","true"),Y.textContent="\u2197",_.append(Y),z.append(I,_),w.append(z)}f.append(D,w),o.append(f);let R=()=>{let M=Math.max(w.scrollWidth-w.clientWidth,0);f.dataset.overflowLeft=String(w.scrollLeft>1),f.dataset.overflowRight=String(w.scrollLeft<M-1)};w.addEventListener("scroll",R,{passive:!0}),w.addEventListener("pointerenter",R),w.addEventListener("focusin",R);let N=this.ownerDocument.defaultView?.ResizeObserver;N&&(this.#T=new N(()=>R()),this.#T.observe(w)),queueMicrotask(R)}let E=document.createElement("ol");E.className="navigator";let C=new Set(t.quads.map(f=>f.source)),T=[];t.quads.forEach((f,D)=>{let w=document.createElement("li");w.className="quad";let R=Do(f.source,C),N=Math.min(R,6);if(w.dataset.depth=String(R),w.style.setProperty("--rdf-indent",`${N*16}px`),R>0){let q=document.createElement("span");q.className="structure-marker",q.setAttribute("aria-hidden","true"),q.textContent="\u21B3",w.append(q)}let M=document.createElement("div");M.className="quad-terms";let z=q=>this.#ce(q),I=le(document,f.subject,"","subject",z,t.sourceDocumentIri),K=le(document,f.predicate,"   ","predicate",z,t.sourceDocumentIri),V=le(document,f.object,"   ","object",z,t.sourceDocumentIri);if(M.append(I,K,V),f.graph){let q=document.createElement("div");q.className="graph",q.append("Graph: ",le(document,f.graph,"","",z,t.sourceDocumentIri)),M.append(q)}let _=new Set([f.subject,f.predicate,f.object,f.graph].filter(q=>q!==null).map(q=>je(document,q,t.sourceDocumentIri)).filter(q=>q!==null)),Y=`ia2-source-${D}`,Z=document.createElement("div");Z.className="preview-actions",Z.setAttribute("role","group"),Z.setAttribute("aria-label",`Actions for ${W(f.source)}`),te(f.source)&&!_.has(f.source)&&Z.append(He(document,f.source,"carrier-locate-button",z));let Oe=Co(f.source),Fe=(q,Ue=!1)=>{let j=document.createElement("button");j.className="row-action-button source-toggle",j.type="button",j.dataset.children=String(q),j.setAttribute("aria-expanded","false"),j.setAttribute("aria-controls",Y);let Ve=Ue?"":q?" with child content":" without child content",Le=`Show HTML for ${W(f.source)}${Ve}`,kt=`Hide HTML for ${W(f.source)}${Ve}`;j.dataset.showLabel=Le,j.dataset.hideLabel=kt,j.setAttribute("aria-label",Le),j.title=Le;let he=document.createElement("span");return he.className="source-glyph",he.setAttribute("aria-hidden","true"),he.textContent=q?"</>+":"</>",j.append(he),j.addEventListener("click",()=>this.#rt(w,j,f.source,q,Y,Ue)),j};Z.append(Fe(!1,!Oe)),Oe&&Z.append(Fe(!0)),w.append(M);let ke=document.createElement("div");ke.className="quad-actions",ke.append(Z),w.append(ke),w.addEventListener("pointerleave",()=>this.#j()),E.append(w),T.push({item:w,namespaces:new Set(Et(f).map(q=>q.namespace)),quad:f,searchText:qo(f)})}),e.append(E),this.#B=T;let k=document.createElement("p");k.className="empty filter-empty",k.textContent="No statements match the active filters.",k.hidden=!0,e.append(k);let L=null;v=()=>{this.#N=a.value;let f=a.value.trim().toLocaleLowerCase(),D=0;T.forEach(({item:N,namespaces:M,quad:z,searchText:I})=>{let K=Array.from(M).every(Y=>!this.#w.has(Y)),V=this.#f!=="page"||No(z.source),_=z.source===L||K&&V&&(!f||I.includes(f));N.hidden=!_,_&&(D+=1)}),b.forEach((N,M)=>{let z=!this.#w.has(M),I=p.find(V=>V.namespace===M)?.count??0,K=`${I} statement${I===1?"":"s"}`;N.setAttribute("aria-pressed",String(z)),N.setAttribute("aria-label",`${z?"Hide":"Show"} ${K} using ${M}`),N.title=N.getAttribute("aria-label")});let w=p.some(N=>this.#w.has(N.namespace)),R=!!f||w||this.#f==="page";d.textContent=R&&D!==T.length?`${D} of ${T.length}`:"",k.hidden=!R||D>0,E.hidden=R&&D===0};let x=[],y=-1,S=()=>{x=[],y=-1,c.hidden=!0,c.replaceChildren(),a.setAttribute("aria-expanded","false"),a.removeAttribute("aria-activedescendant"),l.textContent=""},P=f=>{if(!x.length)return;y=(f+x.length)%x.length;let D=Array.from(c.querySelectorAll('[role="option"]'));D.forEach((R,N)=>R.setAttribute("aria-selected",String(N===y)));let w=D[y];w&&(a.setAttribute("aria-activedescendant",w.id),w.scrollIntoView?.({block:"nearest"}))},$=f=>{a.value=f.display,this.#N=a.value,v(),S()},A=()=>{if(x=_o(m,a.value),y=-1,c.replaceChildren(),a.removeAttribute("aria-activedescendant"),!x.length||this.shadowRoot?.activeElement!==a){c.hidden=!0,a.setAttribute("aria-expanded","false"),l.textContent="";return}x.forEach((f,D)=>{let w=document.createElement("li");w.className="typeahead-option",w.id=`ia2-navigator-suggestion-${D}`,w.setAttribute("role","option"),w.setAttribute("aria-selected","false");let R=document.createElement("span");R.className="typeahead-primary";let N=document.createElement("span");if(N.className="typeahead-term",N.textContent=f.display,R.append(N),f.label&&f.label!==f.display){let I=document.createElement("span");I.className="typeahead-label",I.textContent=f.label,R.append(I)}let M=jo(f),z=document.createElement("span");z.className="typeahead-meta",z.textContent=M.join(" \xB7 "),w.setAttribute("aria-label",[f.display,f.label,...M].filter(Boolean).join(", ")),w.append(R,z),w.addEventListener("pointerdown",I=>I.preventDefault()),w.addEventListener("pointermove",()=>P(D)),w.addEventListener("click",()=>$(f)),c.append(w)}),c.hidden=!1,a.setAttribute("aria-expanded","true"),l.textContent=`${x.length} semantic suggestion${x.length===1?"":"s"} available.`};a.addEventListener("input",()=>{v(),A()}),a.addEventListener("focus",A),a.addEventListener("blur",()=>{this.ownerDocument.defaultView?.setTimeout(()=>{this.shadowRoot?.activeElement!==a&&S()},0)}),a.addEventListener("keydown",f=>{if(f.key==="ArrowDown"||f.key==="ArrowUp"){if(c.hidden&&A(),!x.length)return;f.preventDefault(),f.stopPropagation(),P(y+(f.key==="ArrowDown"?1:-1));return}if(f.key==="Enter"&&y>=0){f.preventDefault(),f.stopPropagation(),$(x[y]);return}if(f.key==="Escape"&&!c.hidden){f.preventDefault(),f.stopPropagation(),S();return}f.key==="Tab"&&S()});let F=()=>{this.#nt(e,T,v,f=>{L=f,v()})},J=(f,D=!1)=>{this.#f=f,L=null,be(h,f,D),v(),F()};rt(h,(f,D)=>J(f,D)),v(),F()}#at(e,t){if(!t.length){let r=document.createElement("p");r.className="empty",r.textContent="No extraction diagnostics. The document passed the checks implemented by this preview extractor.",e.append(r);return}let o=document.createElement("ul");o.className="diagnostics";for(let r of t){let i=document.createElement("li");i.className="diagnostic";let a=document.createElement("strong");a.textContent=`${r.severity.toUpperCase()} \xB7 ${r.code}`;let s=document.createElement("p");s.textContent=r.source?`${r.message} Source: ${W(r.source)}`:r.message,i.append(a,s),o.append(i)}e.append(o)}#st(e){this.#Z();let t=this.ownerDocument.defaultView;if(!t||!e.length)return;let o=[],r=new Map,i=null,a=(l,d,u)=>{l.addEventListener(d,u),o.push(()=>l.removeEventListener(d,u))},s=l=>{i?.cancel(),!t.matchMedia?.("(prefers-reduced-motion: reduce)").matches&&(i=l.animate?.([{outline:"2px solid transparent",outlineOffset:"7px"},{outline:"2px solid oklch(62% 0.18 294)",outlineOffset:"4px"}],{direction:"alternate",duration:520,easing:"cubic-bezier(.22,1,.36,1)",iterations:1/0})??null)},c=()=>{i?.cancel(),i=null};for(let l of e){let d=r.get(l.target)??[];d.push(l.item),r.set(l.target,d),a(l.item,"pointerenter",()=>s(l.target)),a(l.item,"pointerleave",c)}r.forEach((l,d)=>{a(d,"pointerenter",()=>{l.forEach(u=>{u.classList.add("is-corresponding"),u.scrollIntoView?.({block:"nearest"})})}),a(d,"pointerleave",()=>l.forEach(u=>u.classList.remove("is-corresponding")))}),this.#X=()=>{o.forEach(l=>l()),c()}}#ct(e){let t=this.ownerDocument,o=this.#u?.sourceDocumentIri??t.URL,r=[],i=t.createElement("p");i.className="ontology-intro",i.textContent="Classes and properties defined by this document. The trees follow RDFS hierarchy statements; muted parent terms provide external context.",e.append(i);let a=(s,c,l)=>{if(!c.length)return;let d=t.createElement("section");d.className="ontology-section",d.setAttribute("aria-label",s);let u=t.createElement("div");u.className="ontology-heading";let g=t.createElement("h3");g.textContent=s;let h=t.createElement("span");h.className="ontology-count",h.textContent=`${c.length} defined`,u.append(g,h),d.append(u);let p=new Map(c.map(y=>[y.term.value,y])),m=new Map,b=y=>l==="class"?y.classParents:y.propertyParents;for(let y of c)for(let S of b(y)){let P=m.get(S.value)??[];P.some($=>$.term.value===y.term.value)||P.push(y),m.set(S.value,P)}let v=y=>[...y].sort((S,P)=>(S.label??S.term.value).localeCompare(P.label??P.term.value));m.forEach((y,S)=>m.set(S,v(y)));let E=new Set,C=y=>this.#ce(y),T=(y,S,P,$=!1)=>{let A=t.createElement("li");A.className="ontology-node";let F=t.createElement("div");F.className=`ontology-term-row${S?"":" ontology-context"}`,F.dataset.term=y.value;let J=t.createElement("div");if(J.className="ontology-term-copy",J.append(le(t,y,"","",void 0,o)),S?.label){let w=t.createElement("div");w.className="ontology-label",w.textContent=S.label,J.append(w)}let f=t.createElement("div");if(f.className="ontology-meta",S?$?f.textContent="Cycle reference":S.types.length&&(f.textContent=S.types.map(w=>H(w)).join(" \xB7 ")):f.textContent="External parent",f.textContent&&J.append(f),F.append(J),S){E.add(S.term.value);let w=zo(t,S,o);if(w){let R=t.createElement("div");R.className="ontology-actions",R.append(He(t,w,"ontology-locate-button",C)),F.append(R),r.push({item:F,target:w})}}if(A.append(F),$)return A;let D=m.get(y.value)??[];if(D.length){let w=t.createElement("ul");w.className="ontology-children";let R=new Set(P);R.add(y.value);for(let N of D)w.append(T(N.term,N,R,R.has(N.term.value)));A.append(w)}return A},k=t.createElement("ul");k.className="ontology-tree";let L=new Map;for(let y of c)for(let S of b(y))p.has(S.value)||L.set(S.value,S);for(let y of Array.from(L.values()).sort((S,P)=>S.value.localeCompare(P.value)))k.append(T(y,null,new Set));let x=v(c.filter(y=>b(y).length===0));for(let y of x)k.append(T(y.term,y,new Set));for(let y of c)E.has(y.term.value)||k.append(T(y.term,y,new Set));d.append(k),e.append(d)};a("Classes",this.#S.classes,"class"),a("Properties",this.#S.properties,"property"),this.#st(r)}#lt(e){let t=this.ownerDocument,o=t.createElement("p");o.className="discovery-intro",o.textContent="Additional knowledge advertised by this document. Loading is explicit, sends no credentials or referrer, does not run scripts, and keeps the retrieved contribution in a separate named graph.",e.append(o);let r=t.createElement("ul");r.className="discovery-list";for(let i of this.#E){let a=this.#r.get(i.id),s=a?.status??"available",c=t.createElement("li");c.className="discovery-item",c.dataset.candidateId=i.id;let l=t.createElement("div");l.className="discovery-copy";let d=t.createElement("a");d.className="discovery-target",d.href=i.target.value,d.target="_blank",d.rel="noopener noreferrer",d.textContent=i.target.value,d.title=`Open ${i.target.value} in a new tab`;let u=t.createElement("p");u.className="discovery-context",u.textContent=`About ${H(i.context)}`,l.append(d,u);let g=t.createElement("div");g.className="discovery-meta";for(let b of i.predicates){let v=t.createElement("span");v.className="discovery-chip",v.textContent=H(b),v.title=b.value,g.append(v)}for(let b of i.roles){let v=t.createElement("span");v.className="discovery-chip role",v.textContent=H(b),v.title=b.value,g.append(v)}if(i.graph){let b=t.createElement("span");b.className="discovery-chip",b.textContent=`graph ${H(i.graph)}`,g.append(b)}g.childElementCount&&l.append(g);let h=t.createElement("div");h.className="discovery-state";let p=t.createElement("span");if(p.className="discovery-status",p.dataset.state=s,a||(p.textContent="Available"),a?.status==="loading"&&(p.textContent="Retrieving HTML/RDF\u2026"),a?.status==="error"&&(p.textContent=a.message??"Retrieval failed."),a?.status==="loaded"){let b=a.contribution?.result.quads.length??0;p.textContent=`${b} statement${b===1?"":"s"} loaded`}let m=t.createElement("button");m.className="discovery-action",m.type="button",m.dataset.candidateId=i.id,m.dataset.state=s,a||(m.textContent="Load"),a?.status==="loading"&&(m.textContent="Cancel"),a?.status==="error"&&(m.textContent="Retry"),a?.status==="loaded"&&(m.textContent="Remove"),m.setAttribute("aria-describedby",`${i.id}-status`),p.id=`${i.id}-status`,m.addEventListener("click",()=>void this.#Ue(i)),h.append(p,m),c.append(l,h),r.append(c)}e.append(r)}#dt(e){let t=this.ownerDocument.createElement("p");t.className="sources-intro",t.textContent="Inspect one document at a time. Sources remain separate so blank nodes, bases, and document identity are not silently merged.";let o=this.ownerDocument.createElement("ul");o.className="source-list";for(let r of this.#n){let i=this.ownerDocument.createElement("li");i.className="source-item";let a=this.ownerDocument.createElement("label");a.className="source-option";let s=this.ownerDocument.createElement("input");s.className="source-input",s.type="radio",s.name="ia2-navigator-source",s.checked=r.id===this.#i,s.dataset.sourceId=r.id,s.addEventListener("change",()=>this.#We(r.id));let c=this.ownerDocument.createElement("span");c.className="source-copy";let l=this.ownerDocument.createElement("strong");l.className="source-title",l.textContent=r.label;let d=this.ownerDocument.createElement("span");d.className="source-url",d.textContent=r.url;let u=this.ownerDocument.createElement("span");u.className="source-access";let g=r.access==="direct"?"DOM correlation available":"Collected from an isolated frame; source locations are read-only";u.textContent=`${r.origin} \xB7 ${g}`,c.append(l,d,u);let h=this.ownerDocument.createElement("span");h.className="source-count",h.textContent=`${r.result.quads.length} statement${r.result.quads.length===1?"":"s"}`,a.append(s,c,h),i.append(a),o.append(i)}e.append(t,o)}#K(){let e=this.#ne();this.#g(),e&&queueMicrotask(()=>this.#re(e))}#ut(e,t){if(!t){let o=this.ownerDocument.createElement("span");o.className="sparql-unbound",o.textContent="\u2014",e.append(o);return}if(t.termType==="NamedNode"||t.termType==="BlankNode"){let o=this.#q.get(`${t.termType}:${t.value}`);if(t.termType==="BlankNode"&&!o){let a=this.ownerDocument.createElement("code");a.textContent=`_:${t.value}`,e.append(a);return}let r=this.ownerDocument.createElement("span");r.className="sparql-resource-term";let i=t.termType==="NamedNode"?this.ownerDocument.createElement("a"):this.ownerDocument.createElement("span");if(i.className="sparql-resource-label",i.textContent=o??Po(t.value),i instanceof HTMLAnchorElement){let a=Ee(t.value),s=this.#o?.sourceDocumentIri??this.ownerDocument.URL,c=ue(this.ownerDocument,t.value,s);i.dataset.semanticIri=t.value,i.href=this.#o?Ao(t.value,this.#o):t.value,c?(i.classList.add("local-term"),i.addEventListener("click",l=>this.#ot(t.value,l))):(i.target="_blank",i.rel="noopener noreferrer"),i.title=t.value,i.setAttribute("aria-label",`${i.textContent} (${a})`)}else i.title=`_:${t.value}`;r.append(i),e.append(r);return}if(t.termType==="DefaultGraph"){let o=this.ownerDocument.createElement("code");o.textContent="default graph",e.append(o)}else if(t.termType==="Literal"){let o=this.ownerDocument.createElement("span");o.className="sparql-literal";let r=this.ownerDocument.createElement("span");r.className="sparql-literal-value",r.textContent=t.value||"Empty string";let i=t.language?`@${t.language}${t.direction?`--${t.direction}`:""}`:t.datatype&&t.datatype!==Te?`^^${H({termType:"NamedNode",value:t.datatype})}`:"";if(o.append(r),i){let a=this.ownerDocument.createElement("code");a.className="sparql-literal-qualifier",a.textContent=i,o.append(a)}e.append(o)}else{let o=this.ownerDocument.createElement("code");o.textContent=t.value,e.append(o)}}#pt(e,t,o){let r=this.ownerDocument.createElement("div");r.className="sparql-table-wrap";let i=this.ownerDocument.createElement("table");i.className="sparql-table";let a=i.createTHead().insertRow();for(let c of t){let l=this.ownerDocument.createElement("th");l.scope="col",l.textContent=`?${c}`,a.append(l)}let s=i.createTBody();for(let c of o){let l=s.insertRow();for(let d of t)this.#ut(l.insertCell(),c[d])}r.append(i),e.append(r)}#Ne(e,t,o,r){let i=this.ownerDocument.createElement("p");i.className="sparql-summary";let a=this.ownerDocument.createElement("div");a.className="sparql-result-body",e.append(i,a);let s=o.length>ht[0],c=null,l=null,d=null,u=null;if(s){let h=this.ownerDocument.createElement("nav");h.className="sparql-pagination",h.setAttribute("aria-label","SPARQL result pages");let p=this.ownerDocument.createElement("label");p.className="sparql-page-size-label",p.append("Rows per page"),c=this.ownerDocument.createElement("select"),c.className="sparql-page-size";for(let m of ht){let b=this.ownerDocument.createElement("option");b.value=String(m),b.textContent=String(m),b.selected=m===this.#x,c.append(b)}p.append(c),u=this.ownerDocument.createElement("p"),u.className="sparql-page-status",u.setAttribute("aria-live","polite"),l=this.ownerDocument.createElement("button"),l.className="sparql-page-button sparql-page-previous",l.type="button",l.textContent="Previous",d=this.ownerDocument.createElement("button"),d.className="sparql-page-button sparql-page-next",d.type="button",d.textContent="Next",h.append(p,u,l,d),e.append(h)}let g=()=>{let h=Math.max(1,Math.ceil(o.length/this.#x));this.#a=Math.min(Math.max(0,this.#a),h-1);let p=this.#a*this.#x,m=Math.min(p+this.#x,o.length);i.textContent=s?`Showing ${p+1} to ${m} of ${o.length} ${r}${o.length===1?"":"s"}`:`${o.length} ${r}${o.length===1?"":"s"}`,a.replaceChildren(),o.length&&this.#pt(a,t,o.slice(p,m)),u&&(u.textContent=`Page ${this.#a+1} of ${h}`),l&&(l.disabled=this.#a===0),d&&(d.disabled=this.#a===h-1)};c?.addEventListener("change",()=>{let h=this.#a*this.#x;this.#x=Number(c?.value)||pt,this.#a=Math.floor(h/this.#x),g()}),l?.addEventListener("click",()=>{this.#a-=1,g()}),d?.addEventListener("click",()=>{this.#a+=1,g()}),g()}#le(e){if(e.className="sparql-output",this.#t.status==="idle"){let o=this.ownerDocument.createElement("p");o.className="sparql-status",o.textContent="Run the query to inspect its results.",e.append(o);return}if(this.#t.status==="running"){let o=this.ownerDocument.createElement("p");o.className="sparql-status",o.setAttribute("role","status"),o.textContent="Running locally\u2026",e.append(o);return}if(this.#t.status==="error"){let o=this.ownerDocument.createElement("p");o.className="sparql-status",o.dataset.state="error",o.setAttribute("role","alert"),o.textContent=this.#t.error||"The query could not be run.",e.append(o);return}let t=this.#t.result;if(t){if(t.kind==="ask"){let o=this.ownerDocument.createElement("p");o.className="sparql-summary",o.textContent="ASK result";let r=this.ownerDocument.createElement("p");r.className="sparql-boolean",r.textContent=String(t.value),e.append(o,r);return}if(t.kind==="bindings"){this.#Ne(e,t.variables,t.rows,"result");return}this.#Ne(e,["subject","predicate","object","graph"],t.quads,"statement")}}async#qe(){let e=this.#v.trim();if(!e||!this.#o||this.#t.status==="running")return;let t=++this.#m,o=this.#o;this.#a=0,this.#t={status:"running"},this.#K();try{let{executeSparql:r}=await import("./chunks/sparql-engine-KXGKCH7C.js"),i=await r(e,o);if(t!==this.#m)return;this.#t={result:i,status:"success"},this.#h=wt(i,this.#q)}catch(r){if(t!==this.#m)return;this.#t={error:r instanceof Error?r.message:"The query could not be run.",status:"error"},this.#h=""}this.#K()}#ht(e){let t=this.ownerDocument.createElement("div");t.className="sparql-workbench";let o=this.ownerDocument.createElement("p");if(o.className="sparql-intro",o.textContent=this.#p.length?"Choose a query suggested by this document or write your own. Suggestions are RDF resources, not Navigator configuration.":"Write a SPARQL query against the RDF currently extracted from this document.",t.append(o),this.#Y.length>0){let v=this.ownerDocument.createElement("p");v.className="sparql-status",v.dataset.state="error",v.setAttribute("role","alert"),v.textContent=this.#Y.join(" "),t.append(v)}if(this.#p.length){let v=this.ownerDocument.createElement("div");v.className="sparql-catalog";let E=this.ownerDocument.createElement("label");E.className="sparql-label",E.htmlFor="ia2-sparql-suggestion",E.textContent="Suggested query";let C=this.ownerDocument.createElement("select");C.id="ia2-sparql-suggestion",C.className="sparql-select sparql-suggestion";let T=this.ownerDocument.createElement("option");T.value="",T.textContent="Custom query",C.append(T);for(let L of this.#p){let x=this.ownerDocument.createElement("option");x.value=L.id,x.textContent=L.label,x.selected=L.id===this.#b,C.append(x)}C.addEventListener("change",()=>{this.#b=C.value;let L=this.#p.find(({id:x})=>x===C.value);L?this.#v=L.query:this.#v=Pe,this.#a=0,this.#t={status:"idle"},this.#h="",this.#K()}),v.append(E,C);let k=this.ownerDocument.createElement("p");k.className="sparql-description",k.textContent=this.#p.find(({id:L})=>L===this.#b)?.description??"",v.append(k),t.append(v)}let r=this.ownerDocument.createElement("label");r.className="sparql-catalog";let i=this.ownerDocument.createElement("span");i.className="sparql-label",i.textContent="SPARQL query";let a=this.ownerDocument.createElement("div");a.className="sparql-editor-shell";let s=re(this.#v,"sparql",this.ownerDocument);s.className="sparql-highlight",s.setAttribute("aria-hidden","true");let c=this.ownerDocument.createElement("textarea");c.className="sparql-editor",c.autocapitalize="off",c.autocomplete="off",c.spellcheck=!1,c.wrap="soft",c.value=this.#v,c.setAttribute("aria-keyshortcuts","Control+Enter Meta+Enter");let l=()=>{let v=re(c.value,"sparql",this.ownerDocument);s.replaceChildren(...v.childNodes),s.scrollTop=c.scrollTop};c.addEventListener("input",()=>{if(this.#v=c.value,l(),this.#p.find(({id:E})=>E===this.#b)?.query!==c.value){this.#b="";let E=t.querySelector(".sparql-suggestion");E&&(E.value="");let C=t.querySelector(".sparql-description");C&&(C.textContent="")}if(this.#t.status!=="idle"){this.#m+=1,this.#a=0,this.#t={status:"idle"},this.#h="";let E=t.querySelector(".sparql-output");E&&(E.replaceChildren(),this.#le(E))}}),c.addEventListener("scroll",()=>{s.scrollTop=c.scrollTop,c.scrollLeft=0}),c.addEventListener("keydown",v=>{v.key!=="Enter"||!v.ctrlKey&&!v.metaKey||(v.preventDefault(),this.#qe())}),a.append(s,c),r.append(i,a),t.append(r);let d=this.ownerDocument.createElement("div");d.className="sparql-actions";let u=this.ownerDocument.createElement("button");u.className="sparql-run",u.type="button",u.disabled=this.#t.status==="running",u.textContent=this.#t.status==="running"?"Running\u2026":"Run query",u.addEventListener("click",()=>void this.#qe());let g=this.ownerDocument.createElement("button");g.className="sparql-reset",g.type="button",g.textContent="Reset",g.addEventListener("click",()=>{this.#b="",this.#v=Pe,this.#m+=1,this.#a=0,this.#t={status:"idle"},this.#h="",this.#K()});let h=this.ownerDocument.createElement("label");h.className="sparql-observe";let p=this.ownerDocument.createElement("input");p.className="sparql-observe-input",p.type="checkbox",p.checked=this.#F,p.addEventListener("change",()=>{this.#F=p.checked,this.#F&&this.#Le()}),h.append(p,"Observe changes");let m=this.ownerDocument.createElement("p");m.className="sparql-safety",m.textContent="Local dataset \xB7 Read-only",d.append(u,g,h,m),t.append(d);let b=this.ownerDocument.createElement("section");b.setAttribute("aria-label","SPARQL results"),b.setAttribute("aria-live","polite"),this.#le(b),t.append(b),e.append(t)}#g(){this.#W(),this.#se(),this.#te(),this.#j(),this.#J(),this.#Z(),this.#T?.disconnect(),this.#T=null,this.#y?.disconnect(),this.#y=null,this.#B=[];let e=this.#o;if(!e||!this.shadowRoot)return;this.#e==="diagnostics"&&!e.diagnostics.length&&(this.#e="navigator"),this.#e==="discovery"&&!this.#E.length&&(this.#e="navigator"),this.#e==="vocabulary"&&!this.#S.count&&(this.#e="navigator"),this.#e==="sources"&&this.#n.length<=1&&(this.#e="navigator");let t=this.#n.find(u=>u.id===this.#i)??this.#n[0],o=this.#ke();this.shadowRoot.innerHTML=`
      <style>${ro}</style>
      <button class="launcher" type="button" data-position="${this.#s}" aria-expanded="${this.#k}" aria-controls="ia2-rdf-panel" title="Open RDF Navigator. Drag to move."${this.hasAttribute("data-ia2-extension")?" hidden":""}>
        <span class="mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="2.6" fill="currentColor"/><circle cx="18.5" cy="5" r="2.6" fill="currentColor"/><circle cx="18.5" cy="19" r="2.6" fill="currentColor"/><path d="M7.2 10.8 16 6.2M7.2 13.2 16 17.8" stroke="currentColor" stroke-width="1.8"/></svg></span>
        <span>RDF</span><span class="count">${o}</span>
      </button>
      <aside class="panel ia2-window-surface" id="ia2-rdf-panel" data-open="${this.#k}" data-position="${this.#s}" aria-label="Document RDF" tabindex="-1">
        <header class="toolbar">
          <span class="drag-grip" aria-hidden="true" title="Drag floating navigator"><svg viewBox="0 0 8 18"><circle cx="2" cy="4" r="1.2"/><circle cx="6" cy="4" r="1.2"/><circle cx="2" cy="9" r="1.2"/><circle cx="6" cy="9" r="1.2"/><circle cx="2" cy="14" r="1.2"/><circle cx="6" cy="14" r="1.2"/></svg></span>
          <div class="tabs" role="tablist" aria-label="RDF views" data-compact="0">
            ${X("navigator",this.#e==="navigator","Navigator","Nav")}
            ${this.#n.length>1?X("sources",this.#e==="sources","Sources","Sources",this.#n.length,"document"):""}
            ${this.#S.count?X("vocabulary",this.#e==="vocabulary","Vocabulary","Vocab",this.#S.count,"definition"):""}
            ${this.#E.length?X("discovery",this.#e==="discovery","Discovery","Discover",this.#E.length,"candidate"):""}
            ${X("sparql",this.#e==="sparql","SPARQL","Query",this.#p.length||void 0,"suggested query")}
            ${X("turtle",this.#e==="turtle","Turtle","TTL")}
            ${X("json",this.#e==="json","JSON-LD","JSON")}
            ${e.diagnostics.length?X("diagnostics",this.#e==="diagnostics","Diagnostics","Issues",e.diagnostics.length,"diagnostic"):""}
          </div>
          <div class="header-actions">
            ${et({ariaLabel:"Drawer position",current:this.#s,groupClass:"position-switch",optionClass:"position-option"})}
            <button class="icon-button refresh" type="button" aria-label="Refresh extraction" title="Refresh extraction">\u21BB</button><button class="icon-button close" type="button" aria-label="Close RDF Navigator" title="Close">\xD7</button>
          </div>
        </header>
        <section class="viewport" role="tabpanel" tabindex="0"></section>
        <footer class="footer"><span>RDF 1.2 \xB7 ${t?.label??"Document"}</span>${this.#e==="turtle"||this.#e==="json"?'<button class="copy" type="button">Copy view</button>':""}</footer>
        <div class="resize-handles" aria-hidden="true">
          ${["n","ne","e","se","s","sw","w","nw"].map(u=>`<span class="resize-handle" data-resize="${u}"></span>`).join("")}
        </div>
        <p class="sr-only" aria-live="polite">${this.#L}</p>
      </aside>`;let r=this.shadowRoot.querySelector(".viewport"),i=this.shadowRoot.querySelector(".tabs");if(this.#Ie(i),!r)return;if(this.#e==="turtle"&&r.append(re(se(e),"turtle",document)),this.#e==="json"){if(Ce(e)){let u=document.createElement("p");u.className="notice",u.textContent="JSON-LD 1.1 has no native RDF 1.2 triple-term syntax. This view preserves triple terms as typed JSON literals; use Turtle for the semantic form.",r.append(u)}r.append(re(ce(e),"json",document))}this.#e==="navigator"&&this.#it(r,e),this.#e==="sources"&&this.#dt(r),this.#e==="vocabulary"&&this.#ct(r),this.#e==="discovery"&&this.#lt(r),this.#e==="sparql"&&this.#ht(r),this.#e==="diagnostics"&&this.#at(r,e.diagnostics);let a=this.shadowRoot.querySelector(".launcher");a&&(this.#_(a),a.addEventListener("pointerdown",u=>this.#Ze(u,a)),a.addEventListener("click",u=>{if(this.#U){u.preventDefault(),this.#U=!1;return}this.toggle(u instanceof MouseEvent&&u.detail!==0?"panel":"tab")})),this.shadowRoot.querySelector(".close")?.addEventListener("click",()=>this.close()),this.shadowRoot.querySelector(".refresh")?.addEventListener("click",()=>this.refresh());let s=this.shadowRoot.querySelector(".position-switch"),c=Array.from(this.shadowRoot.querySelectorAll(".position-option")),l=this.shadowRoot.querySelector(".panel"),d=(u,g=!1)=>{this.#s=u;let h=this.shadowRoot?.querySelector(".launcher");l&&(l.dataset.position=this.#s,u==="floating"?this.#H(l):this.#Xe(l)),h&&(h.dataset.position=this.#s,this.#_(h));for(let p of c){let m=p.dataset.position===this.#s;p.setAttribute("aria-checked",String(m)),p.tabIndex=m?0:-1,m&&g&&p.focus()}this.#D()};if(l){this.#s==="floating"&&this.#H(l);let u=l.querySelector(".toolbar"),g=u?.querySelector(".tabs");u?.addEventListener("pointerdown",h=>{let p=h.target instanceof Element?h.target:null;p!==u&&p!==g&&!p?.closest(".drag-grip")||this.#Te(h,l)}),l.querySelectorAll(".resize-handle").forEach(h=>{h.addEventListener("pointerdown",p=>{this.#Te(p,l,h.dataset.resize)})})}s&&tt(s,(u,g)=>{d(u,g)}),this.shadowRoot.querySelector(".copy")?.addEventListener("click",()=>void this.#tt()),this.shadowRoot.querySelectorAll("[data-view]").forEach(u=>{u.addEventListener("click",()=>this.#et(u.dataset.view))}),this.#He()}};customElements.get("ia2-rdf-navigator")||customElements.define("ia2-rdf-navigator",pe);function Ko(n=document){let e=n.querySelector("ia2-rdf-navigator");if(e)return e;let t=n.createElement("ia2-rdf-navigator");return n.body.append(t),t}function St(){window.__IA2_RDF_NAVIGATOR_NO_AUTO__||Ko()}typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",St,{once:!0}):St());export{Ge as DISCOVERY_PREDICATES,pe as Ia2RdfNavigator,De as detectDiscoveryCandidates,oe as extractDataset,$e as extractDocumentVocabulary,Gt as extractSuggestedSparqlQueries,ve as extractSuggestedSparqlQueryCatalog,Ae as fromPortableExtractionResult,Ne as mergeDiscoveryContributions,Ko as mountRdfNavigator,ce as serializeJsonLd,se as serializeTurtle,Be as termToTurtle,Vt as toPortableExtractionResult};
