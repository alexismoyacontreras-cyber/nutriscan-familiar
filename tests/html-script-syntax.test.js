/* Comprueba sintaxis real de JavaScript embebido en las páginas de prueba. */
const fs=require('node:fs');
const vm=require('node:vm');
for(const file of ['index.html','scanner-benchmark.html','scanner-food101-lab.html']){
 const html=fs.readFileSync(file,'utf8');
 const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(Boolean);
 if(!scripts.length)throw Error(file+': sin scripts embebidos');
 for(const [i,script] of scripts.entries())new vm.Script(script,{filename:file+'#inline-'+i});
 console.log('OK sintaxis JS embebido:',file,scripts.length);
}
