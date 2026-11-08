/* Decisión conservadora sobre rankings CLIP. No equivale a probabilidad calibrada. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.NutriVisionGate=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function decide(crops,labels,opts={}){
 if(!Array.isArray(labels)||labels.length<2||new Set(labels).size!==labels.length)throw Error('Etiquetas inválidas');
 if(!Array.isArray(crops)||crops.length<2)throw Error('Se requieren dos encuadres');
 const minScore=opts.minScore??0.40,minGap=opts.minGap??0.12;
 if(!Number.isFinite(minScore)||!Number.isFinite(minGap)||minGap<0)throw Error('Umbrales inválidos');
 const rankings=crops.map(crop=>{
  if(!Array.isArray(crop)||crop.length!==labels.length||crop.some(v=>typeof v!=='number'||!Number.isFinite(v)||v<0||v>1))throw Error('Puntuaciones inválidas');
  return crop.map((score,i)=>({score,i})).sort((a,b)=>b.score-a.score);
 });
 const mean=labels.map((label,i)=>crops.reduce((sum,c)=>sum+c[i],0)/crops.length);
 const sorted=mean.map((score,i)=>({score,i,label:labels[i]})).sort((a,b)=>b.score-a.score);
 const best=sorted[0],second=sorted[1];
 const agreement=rankings.every(r=>r[0].i===best.i);
 const perCropMargins=rankings.map(r=>r[0].score-r[1].score);
 const strongAcrossCrops=rankings.every(r=>r[0].score>=minScore)&&perCropMargins.every(g=>g>=minGap);
 const suggest=agreement&&strongAcrossCrops&&best.score>=minScore&&best.score-second.score>=minGap;
 return Object.freeze({suggest,label:suggest?best.label:null,reason:!agreement?'DISAGREEMENT':!strongAcrossCrops?'WEAK_CROP':suggest?'CONSISTENT':'AMBIGUOUS',topThree:sorted.slice(0,3).map(r=>r.label),scoresAreProbabilities:false});
}
return Object.freeze({decide});
});
