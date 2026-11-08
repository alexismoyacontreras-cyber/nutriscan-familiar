/* Valida la salida del clasificador: nunca convertir clases ausentes en puntuación cero. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.NutriScanScores=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function normalize(response,labels){
 if(!Array.isArray(labels)||labels.length<2||new Set(labels).size!==labels.length)throw Error('Catálogo de etiquetas inválido');
 if(!Array.isArray(response)||response.length!==labels.length)throw Error('El modelo devolvió un número incompleto de alimentos');
 const allowed=new Set(labels),seen=new Map();
 for(const row of response){
  if(!row||typeof row.label!=='string'||!allowed.has(row.label)||seen.has(row.label))throw Error('El modelo devolvió una etiqueta desconocida o duplicada');
  if(typeof row.score!=='number'||!Number.isFinite(row.score)||row.score<0||row.score>1)throw Error('Puntuación inválida del modelo');
  seen.set(row.label,row.score);
 }
 if(seen.size!==labels.length)throw Error('Faltan alimentos en el resultado');
 return labels.map(label=>seen.get(label));
}
return Object.freeze({normalize});
});
