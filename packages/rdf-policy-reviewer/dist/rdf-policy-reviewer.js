import{d as E}from"./chunks/chunk-YRXWK2EZ.js";var y=t=>({termType:"NamedNode",value:t}),X=t=>({termType:"BlankNode",value:t}),le="http://www.w3.org/2001/XMLSchema#string",q="http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",G="http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString",Z=new Set(["rdf-version","rdf-subject","rdf-subject-key","rdf-predicate","rdf-object-key","rdf-datatype","rdf-graph","rdf-graph-key"]),ue={a:["href"],area:["href"],link:["href"],audio:["src"],embed:["src"],iframe:["src"],img:["src"],input:["src","formaction"],script:["src"],source:["src"],track:["src"],video:["src","poster"],blockquote:["cite"],del:["cite"],ins:["cite"],q:["cite"],form:["action"],button:["formaction"],object:["data"]},f=class extends Error{constructor(t,e){super(e),this.code=t}};function de(t){if(t.nodeType===Node.DOCUMENT_NODE)return t;let e=t.ownerDocument;if(!e)throw new Error("The extraction root has no owner document.");return e}function he(t,e){return(t.getAttribute("rel")??"").split(/[\t\n\f\r ]+/).some(r=>r.toLowerCase()===e)}function pe(t,e){let r=t.URL||t.baseURI,n=t.baseURI||r,i=Array.from(t.head?.querySelectorAll("link[rel][href]")??[]).filter(s=>he(s,"canonical")),a=r;if(i.length>1)e.push({severity:"warning",code:"multiple-canonical-links",message:"More than one canonical link was declared; the retrieval IRI remains the source document IRI.",source:i[0]});else if(i.length===1){let s=i[0];try{let c=new URL(s.getAttribute("href")??"",n).href;c.includes("#")?e.push({severity:"warning",code:"canonical-iri-has-fragment",message:"The canonical document IRI cannot contain a fragment; the retrieval IRI remains the source document IRI.",source:s}):a=c}catch{e.push({severity:"warning",code:"invalid-canonical-iri",message:"The canonical link does not resolve to an absolute IRI; the retrieval IRI remains the source document IRI.",source:s})}}let o=!!t.head?.querySelector("base[href]");return{retrievalDocumentIri:r,sourceDocumentIri:a,baseIri:o?n:a}}function I(t,e,r=!1){try{let n=r&&t.startsWith("#")?e.sourceDocumentIri:e.baseIri,i=new URL(t,n).href;if(!/^[A-Za-z][A-Za-z0-9+.-]*:/.test(i))throw new Error("The result is not absolute.");return i}catch{throw new f("invalid-iri",`Cannot resolve IRI reference \u201C${t}\u201D.`)}}function L(t,e){if(!t||/[\t\n\f\r ]/.test(t))throw new f("invalid-key","Local RDF keys must be non-empty and contain no ASCII whitespace.");let r=e.keys.get(t);return r||(r=X(`b${e.nextBlank++}`),e.keys.set(t,r)),r}function fe(t,e){let r=e.elementNodes.get(t);return r||(r=X(`b${e.nextBlank++}`),e.elementNodes.set(t,r)),r}function ge(t){return Array.from(t,e=>e==="%"?"%25":encodeURIComponent(e).replace(/%[0-9a-f]{2}/gi,r=>r.toUpperCase())).join("")}function me(t,e){let r=t.hasAttribute("rdf-subject"),n=t.hasAttribute("rdf-subject-key");if(r&&n)throw new f("competing-subjects","A statement cannot carry both rdf-subject and rdf-subject-key.");if(r){let a=t.getAttribute("rdf-subject")??"";return y(I(a,e,!0))}if(n)return L(t.getAttribute("rdf-subject-key")??"",e);let i=t.getAttribute("id");if(i){let a=e.sourceDocumentIri.replace(/#.*$/s,"");return y(`${a}#${ge(i)}`)}return fe(t,e)}function Y(t){return Array.from(t.children).filter(e=>e.localName==="template")}function be(t){return(ue[t.localName]??[]).flatMap(r=>{let n=t.getAttribute(r);return n===null?[]:[{attribute:r,value:n}]})}function ve(t){let e=[],r=n=>{if(n.nodeType===Node.TEXT_NODE){e.push(n.nodeValue??"");return}if(n.nodeType!==Node.ELEMENT_NODE)return;let i=n;i.localName!=="template"&&i.childNodes.forEach(r)};return t.childNodes.forEach(r),e.join("").replace(/[\t\n\f\r ]+/g," ").replace(/^ | $/g,"")}function ye(t){if(!/^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$/.test(t))return!1;try{return new Intl.Locale(t),!0}catch{return!1}}function we(t,e,r){let n=t.getAttribute("rdf-datatype"),i=t.getAttribute("lang")??"",a=t.getAttribute("dir"),o=a?.toLowerCase();if(n!==null){let c=I(n,r);if(c===q||c===G)throw new f("invalid-literal-metadata","rdf-datatype cannot explicitly select an RDF language-string datatype.");if(i||o==="ltr"||o==="rtl")throw new f("competing-literal-metadata","A typed literal cannot also carry RDF language or direction.");return{termType:"Literal",value:e,datatype:y(c),language:""}}if(a!==null&&o!=="ltr"&&o!=="rtl"&&o!=="auto")throw new f("invalid-direction",`Unsupported RDF base direction \u201C${a}\u201D.`);let s=o==="ltr"||o==="rtl"?o:void 0;if(s&&!i)throw new f("direction-without-language","RDF base direction requires a non-empty language tag.");if(i&&!ye(i))throw new f("invalid-language",`\u201C${i}\u201D is not a supported BCP 47 language tag.`);return i&&s?{termType:"Literal",value:e,datatype:y(G),language:i,direction:s}:i?{termType:"Literal",value:e,datatype:y(q),language:i}:{termType:"Literal",value:e,datatype:y(le),language:""}}function je(t,e){if(Array.from(t.attributes).some(s=>Z.has(s.name)))throw new f("annotated-term-template","An object-position template cannot carry Core rdf-* attributes.");let r=Array.from(t.content.children),n=Array.from(t.content.childNodes).some(s=>s.nodeType===Node.TEXT_NODE&&/\S/.test(s.nodeValue??"")),i=t.content.querySelectorAll("[rdf-predicate]");if(r.length!==1||n||i.length!==1)throw new f("invalid-term-fragment","A triple-term template must contain exactly one statement element and no other non-whitespace content.");let a=i[0];if(!a||a!==r[0])throw new f("nested-term-statement","The triple-term statement must be the template's sole top-level element.");if(a.hasAttribute("rdf-graph")||a.hasAttribute("rdf-graph-key"))throw new f("graphed-triple-term","A triple term cannot carry graph membership.");let o=ee(a,e);return{termType:"Triple",subject:o.subject,predicate:o.predicate,object:o.object}}function Te(t,e){let r=Y(t),n=t.hasAttribute("rdf-object-key"),i=be(t),a=t.localName==="meta"&&t.hasAttribute("content")||t.localName==="data"&&t.hasAttribute("value")||t.localName==="time"&&t.hasAttribute("datetime"),o=(r.length?1:0)+(n?1:0)+i.length+(a?1:0);if(r.length>1||o>1)throw new f("competing-objects","A statement must have exactly one unambiguous object carrier.");if(r.length===1){if(t.hasAttribute("rdf-datatype")||t.hasAttribute("lang")||t.hasAttribute("dir"))throw new f("metadata-on-nonliteral","Literal metadata cannot be applied to a triple-term object.");return je(r[0],e)}if(n){if(t.hasAttribute("rdf-datatype")||t.hasAttribute("lang")||t.hasAttribute("dir"))throw new f("metadata-on-nonliteral","Literal metadata cannot be applied to a blank-node object.");return L(t.getAttribute("rdf-object-key")??"",e)}if(i.length===1){if(t.hasAttribute("rdf-datatype")||t.hasAttribute("lang")||t.hasAttribute("dir"))throw new f("metadata-on-nonliteral","Literal metadata cannot be applied to an IRI object.");return y(I(i[0].value,e))}let s;if(t.localName==="meta"&&t.hasAttribute("content"))s=t.getAttribute("content")??"";else if(t.localName==="data"&&t.hasAttribute("value"))s=t.getAttribute("value")??"";else if(t.localName==="time"&&t.hasAttribute("datetime"))s=t.getAttribute("datetime")??"";else{if(t.querySelector("[rdf-predicate]"))throw new f("nested-statement-in-literal","A text literal carrier cannot contain another asserted statement.");s=ve(t)}return we(t,s,e)}function ee(t,e){let r=t.getAttribute("rdf-predicate");if(r===null)throw new f("missing-predicate","The statement has no rdf-predicate.");return{subject:me(t,e),predicate:y(I(r,e)),object:Te(t,e)}}function J(t,e){let r=t.getAttribute("rdf-graph"),n=t.getAttribute("rdf-graph-key");if(r!==null&&n!==null)throw new f("competing-graphs","An RDF statement cannot carry both rdf-graph and rdf-graph-key.");return r!==null?y(I(r,e)):n!==null?L(n,e):null}function K(t,e,r){let n=e instanceof f?e:new f("extractor-error",String(e));t.diagnostics.push({severity:"error",code:n.code,message:n.message,source:r})}function W(t){return`${t.termType}:${t.value}`}function D(t=document){let e=de(t),r=[],{retrievalDocumentIri:n,sourceDocumentIri:i,baseIri:a}=pe(e,r),o={document:e,sourceDocumentIri:i,baseIri:a,diagnostics:r,keys:new Map,elementNodes:new WeakMap,nextBlank:0},c=e.documentElement?.getAttribute("rdf-version");if(c===null)o.diagnostics.push({severity:"warning",code:"missing-version",message:"No rdf-version was declared; IA2 Core 0.1 defaults to RDF 1.2."});else if(c!=="1.2")return o.diagnostics.push({severity:"error",code:"unsupported-version",message:`Unsupported rdf-version \u201C${c}\u201D.`}),{version:"1.2",quads:[],graphs:[],diagnostics:o.diagnostics,retrievalDocumentIri:n,sourceDocumentIri:i,baseIri:a};let h=[],d=new Map;return t.querySelectorAll("[rdf-predicate]").forEach(l=>{try{let u=ee(l,o),p=J(l,o);h.push({...u,graph:p,source:l}),p&&d.set(W(p),p)}catch(u){K(o,u,l)}}),t.querySelectorAll("[rdf-graph]:not([rdf-predicate]), [rdf-graph-key]:not([rdf-predicate])").forEach(l=>{let u=l.parentElement;if(!(l.localName==="template"&&u?.hasAttribute("rdf-predicate")&&Y(u).includes(l)))try{if(Array.from(l.attributes).filter(w=>Z.has(w.name)).length!==1)throw new f("invalid-graph-declaration","A graph declaration can carry exactly one graph attribute and no other Core rdf-* attribute.");let m=J(l,o);if(!m)throw new f("missing-graph","The graph declaration has no graph name.");d.set(W(m),m)}catch(p){K(o,p,l)}}),e.querySelectorAll("[rdf-version]:not(html)").forEach(l=>{o.diagnostics.push({severity:"warning",code:"misplaced-version",message:"rdf-version only has processing effect on the html element.",source:l})}),{version:"1.2",quads:h,graphs:Array.from(d.values()),diagnostics:o.diagnostics,retrievalDocumentIri:n,sourceDocumentIri:i,baseIri:a}}var te="ia2-rdf-dataset-change",k=["http://www.w3.org/2000/01/rdf-schema#label","http://www.w3.org/2004/02/skos/core#prefLabel","http://purl.org/dc/terms/title","https://schema.org/name"];function re(t,e={}){let r=Re(t,e);return new Map(Array.from(r).flatMap(([n,i])=>n.startsWith("NamedNode:")?[[n.slice(10),i]]:[]))}function Re(t,e={}){let r=e.predicates??k,n=new Map(r.map((l,u)=>[l,u])),i=e.languages?.map(l=>l.toLowerCase())??[],a=new Map(i.map((l,u)=>[l,u])),o=i.length,s=o+1,c=new Set,h=new Map;t.forEach((l,u)=>{let p=`${l.subject.termType}:${l.subject.value}`;if(c.add(p),l.object.termType!=="Literal")return;let m=n.get(l.predicate.value);if(m===void 0)return;let w=l.object.language.toLowerCase(),R=a.get(w)??(w?s:o),A={languageRank:R,predicateRank:m,sourceRank:u,value:l.object.value},v=h.get(p);(!v||m<v.predicateRank||m===v.predicateRank&&(R<v.languageRank||R===v.languageRank&&u<v.sourceRank))&&h.set(p,A)});let d=new Map;for(let l of c){let u=h.get(l);u&&d.set(l,u.value)}return d}function Ae(t,e){return t?e.includes(t.value):e.includes(null)}function C(t,e={}){let r=e.graphs;return t.filter(n=>!r||Ae(n.graph,r)).map(n=>({...n,graph:null}))}function $(t,e){return t.termType==="NamedNode"?e.namedNode(t.value):t.termType==="BlankNode"?e.blankNode(t.value):t.termType==="Literal"?$e(t,e):Ie(t,e)}function $e(t,e){return t.language||t.direction?e.literal(t.value,{language:t.language,...t.direction?{direction:t.direction}:{}}):e.literal(t.value,e.namedNode(t.datatype.value))}function Ie(t,e){return e.quad($(t.subject,e),e.namedNode(t.predicate.value),$(t.object,e))}function Se(t,e){return t?$(t,e):e.defaultGraph()}function _e(t,e){return e.quad($(t.subject,e),e.namedNode(t.predicate.value),$(t.object,e),Se(t.graph,e))}function M(t,e,r){return r.dataset(t.map(n=>_e(n,e)))}function j(t){return typeof t=="string"||t instanceof String}var ke="http://www.w3.org/2001/XMLSchema#string";function g(t){if(typeof t=="string")return t;if(!t)return"";if(typeof t.id<"u"&&t.termType!=="Quad")return t.id;let e,r,n,i;switch(t.termType){case"NamedNode":return t.value;case"BlankNode":return`_:${t.value}`;case"Variable":return`?${t.value}`;case"DefaultGraph":return"";case"Literal":return t.language?`"${t.value}"@${t.language}${t.direction?`--${t.direction}`:""}`:`"${t.value}"${t.datatype&&t.datatype.value!==ke?`^^${t.datatype.value}`:""}`;case"Quad":return e=F(g(t.subject)),r=F(g(t.predicate)),n=F(g(t.object)),i=t.graph.termType==="DefaultGraph"?"":` ${g(t.graph)}`,`<<${e} ${r} ${n}${i}>>`;default:throw new Error(`Unexpected termType: ${t.termType}`)}}var Ne=/^"(.*".*)(?="[^"]*$)/;function F(t){return t.replace(Ne,(e,r)=>`"${r.replace(/"/g,'""')}`)}var z=class{constructor(e){if(this._size=0,this._graphs=Object.create(null),this._id=0,this._ids=Object.create(null),this._ids["><"]=0,this._entities=Object.create(null),this._quads=new Map,e)for(let r of e)this.add(r)}get size(){let e=this._size;if(e!==null)return e;e=0;let r=this._graphs,n,i;for(let a in r)for(let o in n=r[a].subjects)for(let s in i=n[o])e+=Object.keys(i[s]).length;return this._size=e,this._size}add(e){let r=g(e.subject),n=g(e.predicate),i=g(e.object),a=g(e.graph),o=this._graphs[a];o||(o=this._graphs[a]={subjects:{},predicates:{},objects:{}},Object.freeze(o));let s=this._ids,c=this._entities;return r=s[r]||(s[c[++this._id]=r]=this._id),n=s[n]||(s[c[++this._id]=n]=this._id),i=s[i]||(s[c[++this._id]=i]=this._id),this._addToIndex(o.subjects,r,n,i),this._addToIndex(o.predicates,n,i,r),this._addToIndex(o.objects,i,r,n),this._setQuad(r,n,i,a,e),this._size=null,this}delete(e){let r=g(e.subject),n=g(e.predicate),i=g(e.object),a=g(e.graph),o=this._ids,s=this._graphs,c,h,d;if(!(r=o[r])||!(n=o[n])||!(i=o[i])||!(c=s[a])||!(h=c.subjects[r])||!(d=h[n])||!(i in d))return this;this._removeFromIndex(c.subjects,r,n,i),this._removeFromIndex(c.predicates,n,i,r),this._removeFromIndex(c.objects,i,r,n),this._size!==null&&this._size--,this._deleteQuad(r,n,i,a);for(r in c.subjects)return this;return delete s[a],this}has(e){let r=g(e.subject),n=g(e.predicate),i=g(e.object),a=g(e.graph),o=this._graphs[a];if(!o)return!1;let s=this._ids,c,h,d;return j(r)&&!(c=s[r])||j(n)&&!(h=s[n])||j(i)&&!(d=s[i])?!1:this._countInIndex(o.objects,d,c,h)===1}match(e,r,n,i){return this._createDataset(this._match(e,r,n,i))}[Symbol.iterator](){return this._match()[Symbol.iterator]()}_addToIndex(e,r,n,i){let a=e[r]||(e[r]={}),o=a[n]||(a[n]={}),s=i in o;return s||(o[i]=null),!s}_removeFromIndex(e,r,n,i){let a=e[r],o=a[n];delete o[i];for(let s in o)return;delete a[n];for(let s in a)return;delete e[r]}_findInIndex(e,r,n,i,a,o,s,c,h,d){let l,u,p;r&&((l=e,e={})[r]=l[r]);for(let m in e)if(u=e[m],u){n&&((l=u,u={})[n]=l[n]);for(let w in u)if(p=u[w],p){let R=i?i in p?[i]:[]:Object.keys(p);for(let A=0;A<R.length;A++){let v={[a]:m,[o]:w,[s]:R[A]},H=this._getQuad(v.subject,v.predicate,v.object,c);if(d)d.push(H);else if(h(H))return!0}}}return d}_countInIndex(e,r,n,i){let a=0,o,s,c;r&&((o=e,e={})[r]=o[r]);for(let h in e)if(s=e[h],s){n&&((o=s,s={})[n]=o[n]);for(let d in s)c=s[d],c&&(i?i in c&&a++:a+=Object.keys(c).length)}return a}_getGraphs(e){return j(e)?{[e]:this._graphs[e]}:this._graphs}_match(e,r,n,i){e=e&&g(e),r=r&&g(r),n=n&&g(n),i=i&&g(i);let a=[],o=this._getGraphs(i),s=this._ids,c,h,d,l;if(j(e)&&!(h=s[e])||j(r)&&!(d=s[r])||j(n)&&!(l=s[n]))return a;for(let u in o)c=o[u],c&&(h?l?this._findInIndex(c.objects,l,h,d,"object","subject","predicate",u,null,a):this._findInIndex(c.subjects,h,d,null,"subject","predicate","object",u,null,a):d?this._findInIndex(c.predicates,d,l,null,"predicate","object","subject",u,null,a):l?this._findInIndex(c.objects,l,null,null,"object","subject","predicate",u,null,a):this._findInIndex(c.subjects,null,null,null,"subject","predicate","object",u,null,a));return a}_getQuad(e,r,n,i){return this._quads.get(this._toId(e,r,n,i))}_setQuad(e,r,n,i,a){this._quads.set(this._toId(e,r,n,i),a)}_deleteQuad(e,r,n,i){this._quads.delete(this._toId(e,r,n,i))}_createDataset(e){return new this.constructor(e)}_toId(e,r,n,i){return`${e}:${r}:${n}:${i}`}},ne=z;var N=class{dataset(e){return new ne(e)}};N.exports=["dataset"];var ie=N;var xe=new ie,P=xe;function T(t){if(t.termType==="NamedNode")return`I${t.value}`;if(t.termType==="BlankNode")throw new Error("Semantic diff requires stable named resources. Select a diff graph without blank nodes or canonicalize the datasets before comparison.");return t.termType==="Literal"?`L${JSON.stringify(t.value)}|${t.language}|${t.direction??""}|${t.datatype.value}`:`T${T(t.subject)}|${t.predicate.value}|${T(t.object)}`}function x(t){return t.termType==="BlankNode"?!0:t.termType!=="Triple"?!1:x(t.subject)||x(t.object)}function S(t){return[T(t.subject),t.predicate.value,T(t.object),t.graph?T(t.graph):""].join(`
`)}function Q(t){return[T(t.subject),t.predicate.value,t.graph?T(t.graph):""].join(`
`)}function ae(t){let e=new Map;for(let r of t){let n=Q(r),i=e.get(n);i?i.push(r):e.set(n,[r])}return e}function O(t,e,r){let n=u=>!r||u.graph?.termType==="NamedNode"&&r.has(u.graph.value),i=t.filter(n),a=e.filter(n);if([...i,...a].some(u=>x(u.subject)||x(u.object)||u.graph?.termType==="BlankNode"))throw new Error("Semantic diff requires stable named resources. Select a diff graph without blank nodes or canonicalize the datasets before comparison.");let o=new Map(i.map(u=>[S(u),u])),s=new Map(a.map(u=>[S(u),u])),c=ae(i),h=ae(a),d=[],l=new Set;for(let[u,p]of c){let m=h.get(u);p.length===1&&m?.length===1&&S(p[0])!==S(m[0])&&(d.push({kind:"changed",previousQuad:p[0],quad:m[0]}),l.add(u))}for(let[u,p]of o)!s.has(u)&&!l.has(Q(p))&&d.push({kind:"removed",quad:p});for(let[u,p]of s)!o.has(u)&&!l.has(Q(p))&&d.push({kind:"added",quad:p});return d}var oe="http://www.w3.org/ns/shacl#name";function b(t){return t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}function se(t){try{let e=new URL(t),r=decodeURIComponent(e.hash.slice(1));return r?r.replaceAll(/[-_]+/g," "):(decodeURIComponent(e.pathname.split("/").filter(Boolean).at(-1)??"")||e.hostname).replaceAll(/[-_]+/g," ")}catch{return t}}function ce(t){let e=new URL(t);return e.hash="",e.href}function V(t){return t.nodeType===9}function B(t){return V(t)?t:t.ownerDocument}function U(t,e){try{return{element:t.querySelector(e),valid:!0}}catch{return{element:null,valid:!1}}}var _=class extends HTMLElement{static observedAttributes=["change-events","diff-graphs","heading","profile-root","source-frame","source-root"];#r=[];#g=null;#u=null;#y=0;#d;#i;#n;#w=new Map;#a;#o;#s;#j=0;#c;#h=[];#l;#t="Waiting for the reviewed document.";constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.#e(),this.#p()}disconnectedCallback(){this.#b(),this.#n?.removeEventListener("load",this.#m)}attributeChangedCallback(e,r,n){if(!(r===n||!this.isConnected)){if(e==="heading"){this.#e();return}queueMicrotask(()=>void this.#p())}}get sourceRoot(){return this.#u}set sourceRoot(e){this.#u=e,this.isConnected&&this.#p()}get profileRoot(){return this.#g}set profileRoot(e){this.#g=e,this.isConnected&&this.#p()}get validationResult(){return this.#c}get semanticChanges(){return this.#r}async refresh(){if(!this.#l||!this.#o)return;let e=++this.#j,r=D(this.#l);if(r.diagnostics.some(({severity:l})=>l==="error")){this.#t="The reviewed document contains RDF extraction errors.",this.#e();return}let n=this.#I(r.sourceDocumentIri),i=!!this.#i,a="",o=[];if(this.#i)try{o=O(this.#i,r.quads,n)}catch(l){a=l instanceof Error?l.message:String(l)}let s=M(C(r.quads),E,P),c=M(C(this.#o.quads),E,P),{validatePolicy:h}=await import("./chunks/validation-EICDD2KK.js"),d=await h(s,c,{languages:[this.ownerDocument.documentElement.lang||"en"]});return e!==this.#j||!this.isConnected||(this.#d=r,this.#i??=[...r.quads],this.#c=d,this.#w=re([...r.quads,...this.#o.quads],{predicates:[...k,oe],languages:[this.ownerDocument.documentElement.lang||"en"]}),this.#r=o,this.#t=a||(o.length>0?`${o.length} semantic ${o.length===1?"change":"changes"} since review began.`:i?"The document matches the review baseline.":"Policy profile loaded."),this.#e(),this.dispatchEvent(new CustomEvent("ia2-rdf-policy-review",{bubbles:!0,composed:!0,detail:{changes:o,result:d,sourceDocumentIri:r.sourceDocumentIri}}))),d}async#p(){this.#b(),this.#n?.removeEventListener("load",this.#m),this.#n=void 0;let e=this.getAttribute("profile-root")?.trim(),r=e?U(this.ownerDocument,e):{element:this.ownerDocument,valid:!0};if(!r.valid){this.#t=`Policy profile root is not valid CSS: ${e}`,this.#e();return}let n=this.#g??r.element;if(!n){this.#t=`Policy profile root not found: ${e}`,this.#e();return}if(this.#o=D(n),this.#o.diagnostics.some(({severity:c})=>c==="error")){this.#t="The policy profile contains RDF extraction errors.",this.#e();return}if(this.#u){await this.#f(this.#u);return}let i=this.getAttribute("source-frame")?.trim();if(i){let c=U(this.ownerDocument,i),h=c.element;if(!c.valid){this.#t=`Reviewed document frame is not valid CSS: ${i}`,this.#e();return}if(!(h instanceof HTMLIFrameElement)){this.#t=`Reviewed document frame not found: ${i}`,this.#e();return}this.#n=h,h.addEventListener("load",this.#m);let d=h.contentDocument;d&&d.URL!=="about:blank"&&await this.#f(d);return}let a=this.getAttribute("source-root")?.trim(),o=a?U(this.ownerDocument,a):{element:this.ownerDocument,valid:!0};if(!o.valid){this.#t=`Reviewed document root is not valid CSS: ${a}`,this.#e();return}let s=o.element;if(!s){this.#t=`Reviewed document root not found: ${a}`,this.#e();return}await this.#f(s)}#m=()=>{let e=this.#n?.contentDocument;e?this.#f(e):(this.#t="The reviewed document frame is not same-origin and cannot be inspected.",this.#e())};async#f(e){let r=++this.#y;if(this.#b(),this.#l=e,this.#i=void 0,this.#r=[],await this.refresh(),r!==this.#y||this.#n&&this.#n.contentDocument!==e)return;let n=B(e),i=n.defaultView?.MutationObserver??MutationObserver;this.#a=new i(()=>this.#R()),this.#h=(this.getAttribute("change-events")??te).split(/\s+/).filter(Boolean);for(let a of this.#h)n.addEventListener(a,this.#T);try{this.#a.observe(V(e)?e.documentElement:e,{attributes:!0,characterData:!0,childList:!0,subtree:!0})}catch{this.#a=void 0}}#b(){this.#a?.disconnect(),this.#a=void 0;let e=this.#l,r=e&&B(e);for(let n of this.#h)r?.removeEventListener(n,this.#T);this.#h=[],this.#s!==void 0&&window.clearTimeout(this.#s)}#T=()=>this.#R();#R(){this.#s!==void 0&&window.clearTimeout(this.#s),this.#s=window.setTimeout(()=>void this.refresh(),80)}#I(e){let r=this.getAttribute("diff-graphs")?.trim().split(/\s+/).filter(Boolean);if(r?.length)return new Set(r.flatMap(n=>{try{return[new URL(n,e).href]}catch{return[]}}))}#v(e){return e?this.#w.get(e)??se(e):"Policy finding"}#A(e){return e.termType==="Literal"?e.value:e.termType==="Triple"?"quoted statement":this.#v(e.value)}#$(e,r="Show in document"){return e?`<button class="target" type="button" data-target="${b(e)}">${b(r)}</button>`:""}#S(e){let r=e.targets.length>0?e.targets:e.focusNode?[e.focusNode]:[];return`
      <article class="finding" data-severity="${e.severity}">
        <div class="finding-heading">
          <span class="severity"${e.severityIri?` title="${b(e.severityIri)}"`:""}>${b(e.severity)}</span>
          <h3>${b(e.name)}</h3>
        </div>
        <p>${b(e.message)}</p>
        ${r.map((n,i)=>this.#$(n,r.length===1?"Show in document":`Show target ${i+1}`)).join("")}
      </article>
    `}#_(e){let{quad:r}=e,n=this.#A(r.object),i=this.#v(r.subject.value),a=r.object.termType==="Literal"&&i===r.object.value&&[...k,oe].includes(r.predicate.value)?se(r.subject.value):i,o=this.#v(r.predicate.value),s=e.kind==="changed"?this.#A(e.previousQuad.object):"",c=r.subject.termType==="NamedNode"?r.subject.value:void 0;return`
      <li class="change" data-kind="${e.kind}">
        <span class="change-kind">${e.kind}</span>
        <span class="statement">
          <strong>${b(a)}</strong>
          <span>${b(o)}</span>
          ${e.kind==="changed"?`<span class="replacement"><del>${b(s)}</del><span aria-hidden="true">\u2192</span><b>${b(n)}</b></span>`:`<b>${b(n)}</b>`}
        </span>
        ${this.#$(c,"Locate")}
      </li>
    `}#e(){if(!this.shadowRoot)return;let e=this.#c?.findings??[],r=e.filter(({severity:a})=>a==="violation").length,n=e.filter(({severity:a})=>a==="warning").length,i=this.#c?e.length===0?"No policy findings":`${e.length} ${e.length===1?"finding":"findings"}`:"Loading policy";this.shadowRoot.innerHTML=`
      <style>${Ee}</style>
      <section class="reviewer" aria-label="Executable policy review">
        <header class="header">
          <div>
            <p class="eyebrow">External review profile</p>
            <h2>${b(this.getAttribute("heading")||"Live policy review")}</h2>
            <p class="intro">SHACL Core and SHACL-SPARQL run against the document's current RDF dataset. The policy remains in this review artifact.</p>
          </div>
          <div class="summary" aria-live="polite">
            <strong>${b(i)}</strong>
            <span>${r} blocking \xB7 ${n} advisory</span>
          </div>
        </header>
        <div class="status" role="status">${b(this.#t)}</div>
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
    `,this.shadowRoot.querySelector(".rerun")?.addEventListener("click",()=>void this.refresh());for(let a of this.shadowRoot.querySelectorAll("[data-target]"))a.addEventListener("click",()=>this.#k(a.dataset.target))}#k(e){let r=this.#l;if(!r||!this.#d)return;let n=B(r),i;try{if(i=new URL(e,this.#d.sourceDocumentIri),ce(i.href)!==ce(this.#d.sourceDocumentIri)){window.open(i.href,"_blank","noopener");return}}catch{return}let a=decodeURIComponent(i.hash.slice(1)),o=V(r)?r.getElementById(a):Array.from(r.querySelectorAll("[id]")).find(c=>c.id===a);if(!o)return;let s=n.querySelector("style[data-ia2-policy-target]");s||(s=n.createElement("style"),s.dataset.ia2PolicyTarget="",s.textContent=`
        [data-ia2-policy-highlight] {
          background: oklch(91% 0.09 100) !important;
          box-shadow: 0 0 0 4px oklch(74% 0.15 100 / 48%) !important;
          scroll-margin-top: 5.5rem !important;
        }
      `,n.head.append(s)),n.querySelector("[data-ia2-policy-highlight]")?.removeAttribute("data-ia2-policy-highlight"),o.setAttribute("data-ia2-policy-highlight",""),o.scrollIntoView({behavior:"smooth",block:"center"}),o.hasAttribute("tabindex")||o.setAttribute("tabindex","-1"),o.focus({preventScroll:!0}),window.setTimeout(()=>o.removeAttribute("data-ia2-policy-highlight"),3200)}},Ee=`
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
`;async function qe(t,e,r={}){return(await import("./chunks/validation-EICDD2KK.js")).validatePolicy(t,e,r)}customElements.get("ia2-rdf-policy-reviewer")||customElements.define("ia2-rdf-policy-reviewer",_);export{_ as Ia2RdfPolicyReviewer,O as diffQuads,S as quadKey,qe as validatePolicy};
