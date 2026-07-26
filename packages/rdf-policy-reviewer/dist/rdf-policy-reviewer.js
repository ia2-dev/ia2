import{d as k}from"./chunks/chunk-YRXWK2EZ.js";var v=t=>({termType:"NamedNode",value:t}),X=t=>({termType:"BlankNode",value:t}),le="http://www.w3.org/2001/XMLSchema#string",H="http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",G="http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString",Z=new Set(["rdf-version","rdf-subject","rdf-subject-key","rdf-predicate","rdf-object-key","rdf-datatype","rdf-graph","rdf-graph-key"]),ue={a:["href"],area:["href"],link:["href"],audio:["src"],embed:["src"],iframe:["src"],img:["src"],input:["src","formaction"],script:["src"],source:["src"],track:["src"],video:["src","poster"],blockquote:["cite"],del:["cite"],ins:["cite"],q:["cite"],form:["action"],button:["formaction"],object:["data"]},p=class extends Error{constructor(t,e){super(e),this.code=t}};function de(t){if(t.nodeType===Node.DOCUMENT_NODE)return t;let e=t.ownerDocument;if(!e)throw new Error("The extraction root has no owner document.");return e}function he(t,e){return(t.getAttribute("rel")??"").split(/[\t\n\f\r ]+/).some(r=>r.toLowerCase()===e)}function pe(t,e){let r=t.URL||t.baseURI,n=t.baseURI||r,i=Array.from(t.head?.querySelectorAll("link[rel][href]")??[]).filter(s=>he(s,"canonical")),a=r;if(i.length>1)e.push({severity:"warning",code:"multiple-canonical-links",message:"More than one canonical link was declared; the retrieval IRI remains the source document IRI.",source:i[0]});else if(i.length===1){let s=i[0];try{let c=new URL(s.getAttribute("href")??"",n).href;c.includes("#")?e.push({severity:"warning",code:"canonical-iri-has-fragment",message:"The canonical document IRI cannot contain a fragment; the retrieval IRI remains the source document IRI.",source:s}):a=c}catch{e.push({severity:"warning",code:"invalid-canonical-iri",message:"The canonical link does not resolve to an absolute IRI; the retrieval IRI remains the source document IRI.",source:s})}}let o=!!t.head?.querySelector("base[href]");return{retrievalDocumentIri:r,sourceDocumentIri:a,baseIri:o?n:a}}function T(t,e,r=!1){try{let n=r&&t.startsWith("#")?e.sourceDocumentIri:e.baseIri,i=new URL(t,n).href;if(!/^[A-Za-z][A-Za-z0-9+.-]*:/.test(i))throw new Error("The result is not absolute.");return i}catch{throw new p("invalid-iri",`Cannot resolve IRI reference \u201C${t}\u201D.`)}}function E(t,e){if(!t||/[\t\n\f\r ]/.test(t))throw new p("invalid-key","Local RDF keys must be non-empty and contain no ASCII whitespace.");let r=e.keys.get(t);return r||(r=X(`b${e.nextBlank++}`),e.keys.set(t,r)),r}function fe(t,e){let r=e.elementNodes.get(t);return r||(r=X(`b${e.nextBlank++}`),e.elementNodes.set(t,r)),r}function ge(t){return Array.from(t,e=>e==="%"?"%25":encodeURIComponent(e).replace(/%[0-9a-f]{2}/gi,r=>r.toUpperCase())).join("")}function me(t,e){let r=t.hasAttribute("rdf-subject"),n=t.hasAttribute("rdf-subject-key");if(r&&n)throw new p("competing-subjects","A statement cannot carry both rdf-subject and rdf-subject-key.");if(r){let a=t.getAttribute("rdf-subject")??"";return v(T(a,e,!0))}if(n)return E(t.getAttribute("rdf-subject-key")??"",e);let i=t.getAttribute("id");if(i){let a=e.sourceDocumentIri.replace(/#.*$/s,"");return v(`${a}#${ge(i)}`)}return fe(t,e)}function Y(t){return Array.from(t.children).filter(e=>e.localName==="template")}function be(t){return(ue[t.localName]??[]).flatMap(r=>{let n=t.getAttribute(r);return n===null?[]:[{attribute:r,value:n}]})}function ve(t){let e=[],r=n=>{if(n.nodeType===Node.TEXT_NODE){e.push(n.nodeValue??"");return}if(n.nodeType!==Node.ELEMENT_NODE)return;let i=n;i.localName!=="template"&&i.childNodes.forEach(r)};return t.childNodes.forEach(r),e.join("").replace(/[\t\n\f\r ]+/g," ").replace(/^ | $/g,"")}function ye(t){if(!/^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$/.test(t))return!1;try{return new Intl.Locale(t),!0}catch{return!1}}function we(t,e,r){let n=t.getAttribute("rdf-datatype"),i=t.getAttribute("lang")??"",a=t.getAttribute("dir"),o=a?.toLowerCase();if(n!==null){let c=T(n,r);if(c===H||c===G)throw new p("invalid-literal-metadata","rdf-datatype cannot explicitly select an RDF language-string datatype.");if(i||o==="ltr"||o==="rtl")throw new p("competing-literal-metadata","A typed literal cannot also carry RDF language or direction.");return{termType:"Literal",value:e,datatype:v(c),language:""}}if(a!==null&&o!=="ltr"&&o!=="rtl"&&o!=="auto")throw new p("invalid-direction",`Unsupported RDF base direction \u201C${a}\u201D.`);let s=o==="ltr"||o==="rtl"?o:void 0;if(s&&!i)throw new p("direction-without-language","RDF base direction requires a non-empty language tag.");if(i&&!ye(i))throw new p("invalid-language",`\u201C${i}\u201D is not a supported BCP 47 language tag.`);return i&&s?{termType:"Literal",value:e,datatype:v(G),language:i,direction:s}:i?{termType:"Literal",value:e,datatype:v(H),language:i}:{termType:"Literal",value:e,datatype:v(le),language:""}}function je(t,e){if(Array.from(t.attributes).some(s=>Z.has(s.name)))throw new p("annotated-term-template","An object-position template cannot carry Core rdf-* attributes.");let r=Array.from(t.content.children),n=Array.from(t.content.childNodes).some(s=>s.nodeType===Node.TEXT_NODE&&/\S/.test(s.nodeValue??"")),i=t.content.querySelectorAll("[rdf-predicate]");if(r.length!==1||n||i.length!==1)throw new p("invalid-term-fragment","A triple-term template must contain exactly one statement element and no other non-whitespace content.");let a=i[0];if(!a||a!==r[0])throw new p("nested-term-statement","The triple-term statement must be the template's sole top-level element.");if(a.hasAttribute("rdf-graph")||a.hasAttribute("rdf-graph-key"))throw new p("graphed-triple-term","A triple term cannot carry graph membership.");let o=ee(a,e);return{termType:"Triple",subject:o.subject,predicate:o.predicate,object:o.object}}function Te(t,e){let r=Y(t),n=t.hasAttribute("rdf-object-key"),i=be(t),a=t.localName==="meta"&&t.hasAttribute("content")||t.localName==="data"&&t.hasAttribute("value")||t.localName==="time"&&t.hasAttribute("datetime"),o=(r.length?1:0)+(n?1:0)+i.length+(a?1:0);if(r.length>1||o>1)throw new p("competing-objects","A statement must have exactly one unambiguous object carrier.");if(r.length===1){if(t.hasAttribute("rdf-datatype")||t.hasAttribute("lang")||t.hasAttribute("dir"))throw new p("metadata-on-nonliteral","Literal metadata cannot be applied to a triple-term object.");return je(r[0],e)}if(n){if(t.hasAttribute("rdf-datatype")||t.hasAttribute("lang")||t.hasAttribute("dir"))throw new p("metadata-on-nonliteral","Literal metadata cannot be applied to a blank-node object.");return E(t.getAttribute("rdf-object-key")??"",e)}if(i.length===1){if(t.hasAttribute("rdf-datatype")||t.hasAttribute("lang")||t.hasAttribute("dir"))throw new p("metadata-on-nonliteral","Literal metadata cannot be applied to an IRI object.");return v(T(i[0].value,e))}let s;if(t.localName==="meta"&&t.hasAttribute("content"))s=t.getAttribute("content")??"";else if(t.localName==="data"&&t.hasAttribute("value"))s=t.getAttribute("value")??"";else if(t.localName==="time"&&t.hasAttribute("datetime"))s=t.getAttribute("datetime")??"";else{if(t.querySelector("[rdf-predicate]"))throw new p("nested-statement-in-literal","A text literal carrier cannot contain another asserted statement.");s=ve(t)}return we(t,s,e)}function ee(t,e){let r=t.getAttribute("rdf-predicate");if(r===null)throw new p("missing-predicate","The statement has no rdf-predicate.");return{subject:me(t,e),predicate:v(T(r,e)),object:Te(t,e)}}function J(t,e){let r=t.getAttribute("rdf-graph"),n=t.getAttribute("rdf-graph-key");if(r!==null&&n!==null)throw new p("competing-graphs","An RDF statement cannot carry both rdf-graph and rdf-graph-key.");return r!==null?v(T(r,e)):n!==null?E(n,e):null}function K(t,e,r){let n=e instanceof p?e:new p("extractor-error",String(e));t.diagnostics.push({severity:"error",code:n.code,message:n.message,source:r})}function W(t){return`${t.termType}:${t.value}`}function D(t=document){let e=de(t),r=[],{retrievalDocumentIri:n,sourceDocumentIri:i,baseIri:a}=pe(e,r),o={document:e,sourceDocumentIri:i,baseIri:a,diagnostics:r,keys:new Map,elementNodes:new WeakMap,nextBlank:0},c=e.documentElement?.getAttribute("rdf-version");if(c===null)o.diagnostics.push({severity:"warning",code:"missing-version",message:"No rdf-version was declared; IA2 Core 0.1 defaults to RDF 1.2."});else if(c!=="1.2")return o.diagnostics.push({severity:"error",code:"unsupported-version",message:`Unsupported rdf-version \u201C${c}\u201D.`}),{version:"1.2",quads:[],graphs:[],diagnostics:o.diagnostics,retrievalDocumentIri:n,sourceDocumentIri:i,baseIri:a};let h=[],l=new Map;return t.querySelectorAll("[rdf-predicate]").forEach(d=>{try{let u=ee(d,o),f=J(d,o);h.push({...u,graph:f,source:d}),f&&l.set(W(f),f)}catch(u){K(o,u,d)}}),t.querySelectorAll("[rdf-graph]:not([rdf-predicate]), [rdf-graph-key]:not([rdf-predicate])").forEach(d=>{let u=d.parentElement;if(!(d.localName==="template"&&u?.hasAttribute("rdf-predicate")&&Y(u).includes(d)))try{if(Array.from(d.attributes).filter($=>Z.has($.name)).length!==1)throw new p("invalid-graph-declaration","A graph declaration can carry exactly one graph attribute and no other Core rdf-* attribute.");let b=J(d,o);if(!b)throw new p("missing-graph","The graph declaration has no graph name.");l.set(W(b),b)}catch(f){K(o,f,d)}}),e.querySelectorAll("[rdf-version]:not(html)").forEach(d=>{o.diagnostics.push({severity:"warning",code:"misplaced-version",message:"rdf-version only has processing effect on the html element.",source:d})}),{version:"1.2",quads:h,graphs:Array.from(l.values()),diagnostics:o.diagnostics,retrievalDocumentIri:n,sourceDocumentIri:i,baseIri:a}}var te="ia2-rdf-dataset-change",I=["http://www.w3.org/2000/01/rdf-schema#label","http://www.w3.org/2004/02/skos/core#prefLabel","http://purl.org/dc/terms/title","https://schema.org/name"];function Ae(t,e){return(t.termType==="NamedNode"||t.termType==="BlankNode")&&t.termType===e.termType&&t.value===e.value}function Re(t){return typeof t=="string"?{termType:"NamedNode",value:t}:t}function $e(t,e,r={}){let n=Re(e),i=r.predicates??I,a=r.languages?.map(o=>o.toLowerCase())??[];for(let o of i){let s=t.filter(l=>Ae(l.subject,n)&&l.predicate.value===o&&l.object.termType==="Literal");for(let l of a){let d=s.find(({object:u})=>u.termType==="Literal"&&u.language.toLowerCase()===l);if(d?.object.termType==="Literal")return d.object.value}let c=s.find(({object:l})=>l.termType==="Literal"&&!l.language);if(c?.object.termType==="Literal")return c.object.value;let h=s[0]?.object;if(h?.termType==="Literal")return h.value}}function re(t,e={}){let r=Array.from(new Set(t.flatMap(n=>n.subject.termType==="NamedNode"?[n.subject.value]:[])));return new Map(r.flatMap(n=>{let i=$e(t,n,e);return i===void 0?[]:[[n,i]]}))}function Ie(t,e){return t?e.includes(t.value):e.includes(null)}function L(t,e={}){let r=e.graphs;return t.filter(n=>!r||Ie(n.graph,r)).map(n=>({...n,graph:null}))}function j(t,e){return t.termType==="NamedNode"?e.namedNode(t.value):t.termType==="BlankNode"?e.blankNode(t.value):t.termType==="Literal"?Se(t,e):_e(t,e)}function Se(t,e){return t.language||t.direction?e.literal(t.value,{language:t.language,...t.direction?{direction:t.direction}:{}}):e.literal(t.value,e.namedNode(t.datatype.value))}function _e(t,e){return e.quad(j(t.subject,e),e.namedNode(t.predicate.value),j(t.object,e))}function Ne(t,e){return t?j(t,e):e.defaultGraph()}function xe(t,e){return e.quad(j(t.subject,e),e.namedNode(t.predicate.value),j(t.object,e),Ne(t.graph,e))}function C(t,e,r){return r.dataset(t.map(n=>xe(n,e)))}function y(t){return typeof t=="string"||t instanceof String}var ke="http://www.w3.org/2001/XMLSchema#string";function g(t){if(typeof t=="string")return t;if(!t)return"";if(typeof t.id<"u"&&t.termType!=="Quad")return t.id;let e,r,n,i;switch(t.termType){case"NamedNode":return t.value;case"BlankNode":return`_:${t.value}`;case"Variable":return`?${t.value}`;case"DefaultGraph":return"";case"Literal":return t.language?`"${t.value}"@${t.language}${t.direction?`--${t.direction}`:""}`:`"${t.value}"${t.datatype&&t.datatype.value!==ke?`^^${t.datatype.value}`:""}`;case"Quad":return e=M(g(t.subject)),r=M(g(t.predicate)),n=M(g(t.object)),i=t.graph.termType==="DefaultGraph"?"":` ${g(t.graph)}`,`<<${e} ${r} ${n}${i}>>`;default:throw new Error(`Unexpected termType: ${t.termType}`)}}var Ee=/^"(.*".*)(?="[^"]*$)/;function M(t){return t.replace(Ee,(e,r)=>`"${r.replace(/"/g,'""')}`)}var F=class{constructor(e){if(this._size=0,this._graphs=Object.create(null),this._id=0,this._ids=Object.create(null),this._ids["><"]=0,this._entities=Object.create(null),this._quads=new Map,e)for(let r of e)this.add(r)}get size(){let e=this._size;if(e!==null)return e;e=0;let r=this._graphs,n,i;for(let a in r)for(let o in n=r[a].subjects)for(let s in i=n[o])e+=Object.keys(i[s]).length;return this._size=e,this._size}add(e){let r=g(e.subject),n=g(e.predicate),i=g(e.object),a=g(e.graph),o=this._graphs[a];o||(o=this._graphs[a]={subjects:{},predicates:{},objects:{}},Object.freeze(o));let s=this._ids,c=this._entities;return r=s[r]||(s[c[++this._id]=r]=this._id),n=s[n]||(s[c[++this._id]=n]=this._id),i=s[i]||(s[c[++this._id]=i]=this._id),this._addToIndex(o.subjects,r,n,i),this._addToIndex(o.predicates,n,i,r),this._addToIndex(o.objects,i,r,n),this._setQuad(r,n,i,a,e),this._size=null,this}delete(e){let r=g(e.subject),n=g(e.predicate),i=g(e.object),a=g(e.graph),o=this._ids,s=this._graphs,c,h,l;if(!(r=o[r])||!(n=o[n])||!(i=o[i])||!(c=s[a])||!(h=c.subjects[r])||!(l=h[n])||!(i in l))return this;this._removeFromIndex(c.subjects,r,n,i),this._removeFromIndex(c.predicates,n,i,r),this._removeFromIndex(c.objects,i,r,n),this._size!==null&&this._size--,this._deleteQuad(r,n,i,a);for(r in c.subjects)return this;return delete s[a],this}has(e){let r=g(e.subject),n=g(e.predicate),i=g(e.object),a=g(e.graph),o=this._graphs[a];if(!o)return!1;let s=this._ids,c,h,l;return y(r)&&!(c=s[r])||y(n)&&!(h=s[n])||y(i)&&!(l=s[i])?!1:this._countInIndex(o.objects,l,c,h)===1}match(e,r,n,i){return this._createDataset(this._match(e,r,n,i))}[Symbol.iterator](){return this._match()[Symbol.iterator]()}_addToIndex(e,r,n,i){let a=e[r]||(e[r]={}),o=a[n]||(a[n]={}),s=i in o;return s||(o[i]=null),!s}_removeFromIndex(e,r,n,i){let a=e[r],o=a[n];delete o[i];for(let s in o)return;delete a[n];for(let s in a)return;delete e[r]}_findInIndex(e,r,n,i,a,o,s,c,h,l){let d,u,f;r&&((d=e,e={})[r]=d[r]);for(let b in e)if(u=e[b],u){n&&((d=u,u={})[n]=d[n]);for(let $ in u)if(f=u[$],f){let V=i?i in f?[i]:[]:Object.keys(f);for(let N=0;N<V.length;N++){let x={[a]:b,[o]:$,[s]:V[N]},q=this._getQuad(x.subject,x.predicate,x.object,c);if(l)l.push(q);else if(h(q))return!0}}}return l}_countInIndex(e,r,n,i){let a=0,o,s,c;r&&((o=e,e={})[r]=o[r]);for(let h in e)if(s=e[h],s){n&&((o=s,s={})[n]=o[n]);for(let l in s)c=s[l],c&&(i?i in c&&a++:a+=Object.keys(c).length)}return a}_getGraphs(e){return y(e)?{[e]:this._graphs[e]}:this._graphs}_match(e,r,n,i){e=e&&g(e),r=r&&g(r),n=n&&g(n),i=i&&g(i);let a=[],o=this._getGraphs(i),s=this._ids,c,h,l,d;if(y(e)&&!(h=s[e])||y(r)&&!(l=s[r])||y(n)&&!(d=s[n]))return a;for(let u in o)c=o[u],c&&(h?d?this._findInIndex(c.objects,d,h,l,"object","subject","predicate",u,null,a):this._findInIndex(c.subjects,h,l,null,"subject","predicate","object",u,null,a):l?this._findInIndex(c.predicates,l,d,null,"predicate","object","subject",u,null,a):d?this._findInIndex(c.objects,d,null,null,"object","subject","predicate",u,null,a):this._findInIndex(c.subjects,null,null,null,"subject","predicate","object",u,null,a));return a}_getQuad(e,r,n,i){return this._quads.get(this._toId(e,r,n,i))}_setQuad(e,r,n,i,a){this._quads.set(this._toId(e,r,n,i),a)}_deleteQuad(e,r,n,i){this._quads.delete(this._toId(e,r,n,i))}_createDataset(e){return new this.constructor(e)}_toId(e,r,n,i){return`${e}:${r}:${n}:${i}`}},ne=F;var S=class{dataset(e){return new ne(e)}};S.exports=["dataset"];var ie=S;var De=new ie,z=De;function w(t){if(t.termType==="NamedNode")return`I${t.value}`;if(t.termType==="BlankNode")throw new Error("Semantic diff requires stable named resources. Select a diff graph without blank nodes or canonicalize the datasets before comparison.");return t.termType==="Literal"?`L${JSON.stringify(t.value)}|${t.language}|${t.direction??""}|${t.datatype.value}`:`T${w(t.subject)}|${t.predicate.value}|${w(t.object)}`}function _(t){return t.termType==="BlankNode"?!0:t.termType!=="Triple"?!1:_(t.subject)||_(t.object)}function A(t){return[w(t.subject),t.predicate.value,w(t.object),t.graph?w(t.graph):""].join(`
`)}function P(t){return[w(t.subject),t.predicate.value,t.graph?w(t.graph):""].join(`
`)}function ae(t){let e=new Map;for(let r of t){let n=P(r),i=e.get(n);i?i.push(r):e.set(n,[r])}return e}function Q(t,e,r){let n=u=>!r||u.graph?.termType==="NamedNode"&&r.has(u.graph.value),i=t.filter(n),a=e.filter(n);if([...i,...a].some(u=>_(u.subject)||_(u.object)||u.graph?.termType==="BlankNode"))throw new Error("Semantic diff requires stable named resources. Select a diff graph without blank nodes or canonicalize the datasets before comparison.");let o=new Map(i.map(u=>[A(u),u])),s=new Map(a.map(u=>[A(u),u])),c=ae(i),h=ae(a),l=[],d=new Set;for(let[u,f]of c){let b=h.get(u);f.length===1&&b?.length===1&&A(f[0])!==A(b[0])&&(l.push({kind:"changed",previousQuad:f[0],quad:b[0]}),d.add(u))}for(let[u,f]of o)!s.has(u)&&!d.has(P(f))&&l.push({kind:"removed",quad:f});for(let[u,f]of s)!o.has(u)&&!d.has(P(f))&&l.push({kind:"added",quad:f});return l}var oe="http://www.w3.org/ns/shacl#name";function m(t){return t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}function se(t){try{let e=new URL(t),r=decodeURIComponent(e.hash.slice(1));return r?r.replaceAll(/[-_]+/g," "):(decodeURIComponent(e.pathname.split("/").filter(Boolean).at(-1)??"")||e.hostname).replaceAll(/[-_]+/g," ")}catch{return t}}function ce(t){let e=new URL(t);return e.hash="",e.href}function U(t){return t.nodeType===9}function O(t){return U(t)?t:t.ownerDocument}function B(t,e){try{return{element:t.querySelector(e),valid:!0}}catch{return{element:null,valid:!1}}}var R=class extends HTMLElement{static observedAttributes=["change-events","diff-graphs","heading","profile-root","source-frame","source-root"];#r=[];#g=null;#u=null;#y=0;#d;#i;#n;#w=new Map;#a;#o;#s;#j=0;#c;#h=[];#l;#t="Waiting for the reviewed document.";constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.#e(),this.#p()}disconnectedCallback(){this.#b(),this.#n?.removeEventListener("load",this.#m)}attributeChangedCallback(e,r,n){if(!(r===n||!this.isConnected)){if(e==="heading"){this.#e();return}queueMicrotask(()=>void this.#p())}}get sourceRoot(){return this.#u}set sourceRoot(e){this.#u=e,this.isConnected&&this.#p()}get profileRoot(){return this.#g}set profileRoot(e){this.#g=e,this.isConnected&&this.#p()}get validationResult(){return this.#c}get semanticChanges(){return this.#r}async refresh(){if(!this.#l||!this.#o)return;let e=++this.#j,r=D(this.#l);if(r.diagnostics.some(({severity:d})=>d==="error")){this.#t="The reviewed document contains RDF extraction errors.",this.#e();return}let n=this.#I(r.sourceDocumentIri),i=!!this.#i,a="",o=[];if(this.#i)try{o=Q(this.#i,r.quads,n)}catch(d){a=d instanceof Error?d.message:String(d)}let s=C(L(r.quads),k,z),c=C(L(this.#o.quads),k,z),{validatePolicy:h}=await import("./chunks/validation-EICDD2KK.js"),l=await h(s,c,{languages:[this.ownerDocument.documentElement.lang||"en"]});return e!==this.#j||!this.isConnected||(this.#d=r,this.#i??=[...r.quads],this.#c=l,this.#w=re([...r.quads,...this.#o.quads],{predicates:[...I,oe],languages:[this.ownerDocument.documentElement.lang||"en"]}),this.#r=o,this.#t=a||(o.length>0?`${o.length} semantic ${o.length===1?"change":"changes"} since review began.`:i?"The document matches the review baseline.":"Policy profile loaded."),this.#e(),this.dispatchEvent(new CustomEvent("ia2-rdf-policy-review",{bubbles:!0,composed:!0,detail:{changes:o,result:l,sourceDocumentIri:r.sourceDocumentIri}}))),l}async#p(){this.#b(),this.#n?.removeEventListener("load",this.#m),this.#n=void 0;let e=this.getAttribute("profile-root")?.trim(),r=e?B(this.ownerDocument,e):{element:this.ownerDocument,valid:!0};if(!r.valid){this.#t=`Policy profile root is not valid CSS: ${e}`,this.#e();return}let n=this.#g??r.element;if(!n){this.#t=`Policy profile root not found: ${e}`,this.#e();return}if(this.#o=D(n),this.#o.diagnostics.some(({severity:c})=>c==="error")){this.#t="The policy profile contains RDF extraction errors.",this.#e();return}if(this.#u){await this.#f(this.#u);return}let i=this.getAttribute("source-frame")?.trim();if(i){let c=B(this.ownerDocument,i),h=c.element;if(!c.valid){this.#t=`Reviewed document frame is not valid CSS: ${i}`,this.#e();return}if(!(h instanceof HTMLIFrameElement)){this.#t=`Reviewed document frame not found: ${i}`,this.#e();return}this.#n=h,h.addEventListener("load",this.#m);let l=h.contentDocument;l&&l.URL!=="about:blank"&&await this.#f(l);return}let a=this.getAttribute("source-root")?.trim(),o=a?B(this.ownerDocument,a):{element:this.ownerDocument,valid:!0};if(!o.valid){this.#t=`Reviewed document root is not valid CSS: ${a}`,this.#e();return}let s=o.element;if(!s){this.#t=`Reviewed document root not found: ${a}`,this.#e();return}await this.#f(s)}#m=()=>{let e=this.#n?.contentDocument;e?this.#f(e):(this.#t="The reviewed document frame is not same-origin and cannot be inspected.",this.#e())};async#f(e){let r=++this.#y;if(this.#b(),this.#l=e,this.#i=void 0,this.#r=[],await this.refresh(),r!==this.#y||this.#n&&this.#n.contentDocument!==e)return;let n=O(e),i=n.defaultView?.MutationObserver??MutationObserver;this.#a=new i(()=>this.#A()),this.#h=(this.getAttribute("change-events")??te).split(/\s+/).filter(Boolean);for(let a of this.#h)n.addEventListener(a,this.#T);try{this.#a.observe(U(e)?e.documentElement:e,{attributes:!0,characterData:!0,childList:!0,subtree:!0})}catch{this.#a=void 0}}#b(){this.#a?.disconnect(),this.#a=void 0;let e=this.#l,r=e&&O(e);for(let n of this.#h)r?.removeEventListener(n,this.#T);this.#h=[],this.#s!==void 0&&window.clearTimeout(this.#s)}#T=()=>this.#A();#A(){this.#s!==void 0&&window.clearTimeout(this.#s),this.#s=window.setTimeout(()=>void this.refresh(),80)}#I(e){let r=this.getAttribute("diff-graphs")?.trim().split(/\s+/).filter(Boolean);if(r?.length)return new Set(r.flatMap(n=>{try{return[new URL(n,e).href]}catch{return[]}}))}#v(e){return e?this.#w.get(e)??se(e):"Policy finding"}#R(e){return e.termType==="Literal"?e.value:e.termType==="Triple"?"quoted statement":this.#v(e.value)}#$(e,r="Show in document"){return e?`<button class="target" type="button" data-target="${m(e)}">${m(r)}</button>`:""}#S(e){let r=e.targets.length>0?e.targets:e.focusNode?[e.focusNode]:[];return`
      <article class="finding" data-severity="${e.severity}">
        <div class="finding-heading">
          <span class="severity"${e.severityIri?` title="${m(e.severityIri)}"`:""}>${m(e.severity)}</span>
          <h3>${m(e.name)}</h3>
        </div>
        <p>${m(e.message)}</p>
        ${r.map((n,i)=>this.#$(n,r.length===1?"Show in document":`Show target ${i+1}`)).join("")}
      </article>
    `}#_(e){let{quad:r}=e,n=this.#R(r.object),i=this.#v(r.subject.value),a=r.object.termType==="Literal"&&i===r.object.value&&[...I,oe].includes(r.predicate.value)?se(r.subject.value):i,o=this.#v(r.predicate.value),s=e.kind==="changed"?this.#R(e.previousQuad.object):"",c=r.subject.termType==="NamedNode"?r.subject.value:void 0;return`
      <li class="change" data-kind="${e.kind}">
        <span class="change-kind">${e.kind}</span>
        <span class="statement">
          <strong>${m(a)}</strong>
          <span>${m(o)}</span>
          ${e.kind==="changed"?`<span class="replacement"><del>${m(s)}</del><span aria-hidden="true">\u2192</span><b>${m(n)}</b></span>`:`<b>${m(n)}</b>`}
        </span>
        ${this.#$(c,"Locate")}
      </li>
    `}#e(){if(!this.shadowRoot)return;let e=this.#c?.findings??[],r=e.filter(({severity:a})=>a==="violation").length,n=e.filter(({severity:a})=>a==="warning").length,i=this.#c?e.length===0?"No policy findings":`${e.length} ${e.length===1?"finding":"findings"}`:"Loading policy";this.shadowRoot.innerHTML=`
      <style>${Le}</style>
      <section class="reviewer" aria-label="Executable policy review">
        <header class="header">
          <div>
            <p class="eyebrow">External review profile</p>
            <h2>${m(this.getAttribute("heading")||"Live policy review")}</h2>
            <p class="intro">SHACL Core and SHACL-SPARQL run against the document's current RDF dataset. The policy remains in this review artifact.</p>
          </div>
          <div class="summary" aria-live="polite">
            <strong>${m(i)}</strong>
            <span>${r} blocking \xB7 ${n} advisory</span>
          </div>
        </header>
        <div class="status" role="status">${m(this.#t)}</div>
        <section class="section" aria-labelledby="policy-findings-title">
          <div class="section-heading">
            <h3 id="policy-findings-title">Policy findings</h3>
            <button class="rerun" type="button">Rerun</button>
          </div>
          <div class="findings">
            ${e.length?e.map(a=>this.#S(a)).join(""):`<p class="empty">${this.#c?"The current RDF dataset conforms to the supplied profile.":"Waiting for the document and profile."}</p>`}
          </div>
        </section>
        <section class="section changes-section" aria-labelledby="semantic-changes-title">
          <div class="section-heading">
            <div>
              <h3 id="semantic-changes-title">Semantic consequence diff</h3>
              <p class="baseline-note">Compared with the document when review began</p>
            </div>
            <span class="count">${this.#r.length} ${this.#r.length===1?"change":"changes"}</span>
          </div>
          ${this.#r.length?`<ol class="changes">${this.#r.map(a=>this.#_(a)).join("")}</ol>`:'<p class="empty">Change a value or drafting choice in the document to see added and removed RDF statements.</p>'}
        </section>
        <details>
          <summary>Why this is generic</summary>
          <p>The component discovers a source dataset and a separate shapes dataset. Names, conditions, severities, SPARQL tests, and clause targets come from RDF. No legal field or clause is encoded in the component.</p>
        </details>
      </section>
    `,this.shadowRoot.querySelector(".rerun")?.addEventListener("click",()=>void this.refresh());for(let a of this.shadowRoot.querySelectorAll("[data-target]"))a.addEventListener("click",()=>this.#N(a.dataset.target))}#N(e){let r=this.#l;if(!r||!this.#d)return;let n=O(r),i;try{if(i=new URL(e,this.#d.sourceDocumentIri),ce(i.href)!==ce(this.#d.sourceDocumentIri)){window.open(i.href,"_blank","noopener");return}}catch{return}let a=decodeURIComponent(i.hash.slice(1)),o=U(r)?r.getElementById(a):Array.from(r.querySelectorAll("[id]")).find(c=>c.id===a);if(!o)return;let s=n.querySelector("style[data-ia2-policy-target]");s||(s=n.createElement("style"),s.dataset.ia2PolicyTarget="",s.textContent=`
        [data-ia2-policy-highlight] {
          background: oklch(91% 0.09 100) !important;
          box-shadow: 0 0 0 4px oklch(74% 0.15 100 / 48%) !important;
          scroll-margin-top: 5.5rem !important;
        }
      `,n.head.append(s)),n.querySelector("[data-ia2-policy-highlight]")?.removeAttribute("data-ia2-policy-highlight"),o.setAttribute("data-ia2-policy-highlight",""),o.scrollIntoView({behavior:"smooth",block:"center"}),o.hasAttribute("tabindex")||o.setAttribute("tabindex","-1"),o.focus({preventScroll:!0}),window.setTimeout(()=>o.removeAttribute("data-ia2-policy-highlight"),3200)}},Le=`
  :host {
    --policy-ink: oklch(22% 0.025 294);
    --policy-muted: oklch(48% 0.025 294);
    --policy-rule: oklch(84% 0.025 294);
    --policy-violet: oklch(48% 0.16 294);
    --policy-violet-soft: oklch(96% 0.025 294);
    --policy-warning: oklch(57% 0.13 62);
    --policy-danger: oklch(48% 0.17 28);
    color: var(--policy-ink);
    display: block;
    font-family: "Avenir Next", Avenir, "Segoe UI Variable", "Segoe UI", sans-serif;
  }
  * { box-sizing: border-box; }
  button, summary { font: inherit; }
  button:focus-visible, summary:focus-visible {
    outline: 3px solid oklch(58% 0.17 294);
    outline-offset: 2px;
  }
  .reviewer {
    background: oklch(99% 0.006 294);
    border: 1px solid var(--policy-rule);
    min-width: 0;
  }
  .header {
    align-items: start;
    background: var(--policy-violet-soft);
    border-bottom: 1px solid var(--policy-rule);
    display: grid;
    gap: 1.2rem;
    grid-template-columns: minmax(0, 1fr) auto;
    padding: 1.2rem;
  }
  .eyebrow {
    color: var(--policy-violet);
    font-size: .68rem;
    font-weight: 800;
    letter-spacing: .08em;
    margin: 0 0 .35rem;
    text-transform: uppercase;
  }
  h2 { font-size: 1.25rem; letter-spacing: -.02em; margin: 0; }
  .intro {
    color: var(--policy-muted);
    font-size: .78rem;
    line-height: 1.5;
    margin: .5rem 0 0;
    max-width: 60ch;
  }
  .summary { min-width: 8.5rem; text-align: right; }
  .summary strong { display: block; font-size: .88rem; }
  .summary span { color: var(--policy-muted); display: block; font-size: .7rem; margin-top: .25rem; }
  .status {
    border-bottom: 1px solid var(--policy-rule);
    color: var(--policy-muted);
    font-size: .7rem;
    padding: .65rem 1.2rem;
  }
  .section { padding: 1rem 1.2rem 1.2rem; }
  .section + .section { border-top: 1px solid var(--policy-rule); }
  .section-heading {
    align-items: center;
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    margin-bottom: .8rem;
  }
  .section-heading h3 {
    font-size: .72rem;
    letter-spacing: .07em;
    margin: 0;
    text-transform: uppercase;
  }
  .rerun, .target {
    background: transparent;
    border: 0;
    color: var(--policy-violet);
    cursor: pointer;
    font-size: .72rem;
    font-weight: 750;
    padding: .25rem 0;
    text-decoration: underline;
    text-underline-offset: .2em;
  }
  .finding { border-top: 1px solid var(--policy-rule); padding: .9rem 0; }
  .finding:last-child { padding-bottom: 0; }
  .finding-heading { align-items: baseline; display: flex; gap: .55rem; }
  .finding-heading h3 { font-size: .84rem; margin: 0; }
  .severity {
    color: var(--policy-muted);
    font-size: .61rem;
    font-weight: 800;
    letter-spacing: .06em;
    text-transform: uppercase;
  }
  [data-severity="warning"] .severity { color: var(--policy-warning); }
  [data-severity="violation"] .severity { color: var(--policy-danger); }
  .finding p { font-size: .78rem; line-height: 1.48; margin: .4rem 0 .25rem; }
  .empty { color: var(--policy-muted); font-size: .78rem; line-height: 1.5; margin: 0; }
  .count { color: var(--policy-muted); font-size: .68rem; }
  .changes { list-style: none; margin: 0; padding: 0; }
  .change {
    align-items: start;
    border-top: 1px solid var(--policy-rule);
    display: grid;
    gap: .55rem;
    grid-template-columns: 3.4rem minmax(0, 1fr) auto;
    padding: .7rem 0;
  }
  .change-kind {
    color: var(--policy-muted);
    font-size: .62rem;
    font-weight: 800;
    letter-spacing: .05em;
    padding-top: .12rem;
    text-transform: uppercase;
  }
  [data-kind="added"] .change-kind { color: oklch(45% 0.12 145); }
  [data-kind="removed"] .change-kind { color: var(--policy-danger); }
  [data-kind="changed"] .change-kind { color: var(--policy-violet); }
  .statement { display: grid; font-size: .72rem; gap: .18rem; line-height: 1.35; min-width: 0; }
  .statement strong, .statement b { overflow-wrap: anywhere; }
  .statement span { color: var(--policy-muted); }
  .statement b { font-weight: 650; }
  .replacement { align-items: baseline; display: flex; flex-wrap: wrap; gap: .45rem; }
  .replacement del { color: var(--policy-muted); overflow-wrap: anywhere; }
  .replacement b { color: var(--policy-ink); }
  .baseline-note { color: var(--policy-muted); font-size: .66rem; line-height: 1.35; margin: .25rem 0 0; }
  details { border-top: 1px solid var(--policy-rule); padding: .85rem 1.2rem 1rem; }
  summary { color: var(--policy-violet); cursor: pointer; font-size: .72rem; font-weight: 750; }
  details p { color: var(--policy-muted); font-size: .72rem; line-height: 1.5; margin: .6rem 0 0; }
  @media (max-width: 560px) {
    .header { grid-template-columns: 1fr; }
    .summary { text-align: left; }
    .change { grid-template-columns: 3.2rem minmax(0, 1fr); }
    .change .target { grid-column: 2; justify-self: start; }
  }
  @media (prefers-reduced-motion: reduce) {
    * { scroll-behavior: auto !important; }
  }
`;async function Je(t,e,r={}){return(await import("./chunks/validation-EICDD2KK.js")).validatePolicy(t,e,r)}customElements.get("ia2-rdf-policy-reviewer")||customElements.define("ia2-rdf-policy-reviewer",R);export{R as Ia2RdfPolicyReviewer,Q as diffQuads,A as quadKey,Je as validatePolicy};
