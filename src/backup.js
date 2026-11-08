/* Importación local de respaldos. Nunca sincroniza ni transmite datos personales. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.NutriBackup=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const MAX_BYTES=2*1024*1024;
function isRecord(x){return x!==null&&typeof x==='object'&&!Array.isArray(x)}
function validate(json){
 if(typeof json!=='string'||new TextEncoder().encode(json).length>MAX_BYTES)throw new Error('El respaldo supera 2 MB o no es texto');
 let data;try{data=JSON.parse(json)}catch{throw new Error('El archivo no contiene JSON válido')}
 if(!isRecord(data)||!isRecord(data.yo)||!isRecord(data.pareja))throw new Error('El respaldo debe contener los perfiles yo y pareja');
 const clean=Object.create(null);
 for(const id of ['yo','pareja']){
  const profile=data[id];
  if(!isRecord(profile))throw new Error('Perfil inválido: '+id);
  for(const field of ['entries','weights','walks','exercise']){
   if(profile[field]!==undefined){
    if(!Array.isArray(profile[field])||profile[field].length>20000)throw new Error('Lista inválida: '+field);
    for(const row of profile[field]){
     if(!isRecord(row))throw new Error('Registro inválido en '+field);
    }
   }
  }
  if(Array.isArray(profile.entries))for(const entry of profile.entries){
   if(typeof entry.name!=='string'||entry.name.length>250||typeof entry.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(entry.date)||typeof entry.kcal!=='number'||!Number.isFinite(entry.kcal)||entry.kcal<0||entry.kcal>20000)throw new Error('Registro alimentario inválido');
  }
  const copy=Object.create(null);
  for(const [key,value] of Object.entries(profile)){
   if(key==='__proto__'||key==='constructor'||key==='prototype')continue;
   copy[key]=value;
  }
  clean[id]=copy;
 }
 return clean;
}
return Object.freeze({validate,MAX_BYTES});
});
