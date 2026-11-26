const fs=require("fs");const src=fs.readFileSync(__dirname+"/test_urls.js","utf8");
eval(src.split("let fail=0")[0]);
const out=[];for(const j of ["operario","limpieza","repositor","chofer"])for(const p of ["Morón","González Catán"]){const r=run(j,p);for(const n of ["Computrabajo","Talent.com","Indeed Argentina","Jooble Argentina","Bumeran","ZonaJobs"])out.push([j,p,n,r[n]].join("\t"))}
console.log(out.join("\n"));
