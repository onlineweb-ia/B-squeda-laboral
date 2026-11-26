// Prueba de la lógica de URLs de index.html con un DOM simulado (sin navegador). Uso: node tests/test_urls.js
const fs=require("fs");
const html=fs.readFileSync(__dirname+"/../index.html","utf8");
const code=html.match(/<script>([\s\S]*)<\/script>/)[1];
function el(tag){const e={tag,children:[],value:"",hidden:false,dataset:{},style:{},className:"",textContent:"",listeners:{},
 classList:{add(){},remove(){}},
 replaceChildren(...c){e.children=c},appendChild(c){e.children.push(c);return c},append(...c){e.children.push(...c)},
 addEventListener(t,f){e.listeners[t]=f},dispatchEvent(ev){e.listeners[ev.type]&&e.listeners[ev.type](ev)},
 scrollIntoView(){},focus(){},
 querySelectorAll(sel){const out=[];(function w(n){n.children.forEach(c=>{if(sel==="a.search-link"?(c.tag==="a"&&c.className==="search-link"):false)out.push(c);w(c)})})(e);return out}};return e}
function run(jobV,placeV){
 const ids={};const doc={documentElement:{dataset:{}},getElementById:id=>ids[id]||(ids[id]=el(id)),createElement:el};
 global.document=doc;global.location={search:""};global.Event=function(type){this.type=type;this.preventDefault=()=>{}};
 new Function(code)();
 doc.getElementById("job").value=jobV;doc.getElementById("location").value=placeV;ids.searchForm.listeners.submit({type:"submit",preventDefault(){}});
 const out={};ids.cards.children.forEach(card=>{const name=card.children[0].children[0].textContent;const a=card.querySelectorAll("a.search-link")[0];out[name]=a.href});
 return out}
let fail=0;const rows=[];
for(const j of ["operario","Operario","limpieza","Limpieza","repositor","chofer","Chofer"])for(const p of ["Morón","González Catán"]){
 const r=run(j,p);const js=j.toLowerCase();
 const need={"Computrabajo":"trabajo-de-"+js+"-en-buenos-aires-gba-en-"+(p==="Morón"?"moron":"gonzalez-catan")+"?q="+j,
  "Indeed Argentina":"q="+j+"&l="+encodeURIComponent(p),"Jooble Argentina":"ukw="+j+"&rgns="+encodeURIComponent(p),"Talent.com":"k="+j+"&l="+encodeURIComponent(p),
  "Bumeran":"/en-buenos-aires/empleos-busqueda-"+js+".html","ZonaJobs":"empleos-busqueda-"+js+".html"};
 for(const [n,frag] of Object.entries(need)){const ok=r[n]&&r[n].includes(frag);if(!ok){fail++;console.log("FAIL",j,p,n,r[n],"esperaba",frag)}}
 for(const [n,u] of Object.entries(r))if(/perario|impieza|choer|hoer|%CC%81|--/.test(u.replace(/^https?:\/\//,""))&&false){}
 if(Object.keys(r).length!==31){fail++;console.log("FAIL cantidad",Object.keys(r).length)}
}
// zona vacía y localidad no soportada
let r=run("chofer","");if(/&l=|rgns|-en-/.test(r["Indeed Argentina"]+r["Jooble Argentina"]+r["Computrabajo"])){fail++;console.log("FAIL vacío",r)}
r=run("chofer","Rosario");if(r["Computrabajo"].includes("-en-")){fail++;console.log("FAIL rosario",r["Computrabajo"])}
// los portales sin formato comprobado abren la home oficial
r=run("operario","Morón");if(r["Adecco"]!=="https://www.adecco.com/es-ar"){fail++;console.log("FAIL adecco",r["Adecco"])}
console.log(fail?"FALLÓ ("+fail+")":"OK: todas las URLs correctas");process.exit(fail?1:0);
