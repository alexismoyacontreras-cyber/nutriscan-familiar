/* Evaluación reproducible de predicciones: no sustituye imágenes etiquetadas. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.NutriBenchmark=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function evaluate(samples,options={}){
  if(!Array.isArray(samples)||samples.length===0)throw new Error('Se requiere un conjunto de evaluación etiquetado');
  const minSamples=options.minSamples??30;
  if(!Number.isInteger(minSamples)||minSamples<1)throw new Error('minSamples inválido');
  let correct=0,abstained=0,wrong=0;
  const perClass=Object.create(null),confusions=Object.create(null);
  const ids=new Set();
  for(const sample of samples){
   if(!sample||typeof sample.id!=='string'||!sample.id.trim()||ids.has(sample.id))throw new Error('ID de muestra inválido o duplicado');
   ids.add(sample.id);
   if(typeof sample.actual!=='string'||!sample.actual.trim())throw new Error('Etiqueta real obligatoria');
   const predicted=sample.predicted;
   if(predicted!==null&&(typeof predicted!=='string'||!predicted.trim()))throw new Error('Predicción debe ser etiqueta o null para abstención');
   const label=sample.actual;
   const cls=perClass[label]??={total:0,correct:0,wrong:0,abstained:0};
   cls.total++;
   if(predicted===null){abstained++;cls.abstained++}
   else if(predicted===label){correct++;cls.correct++}
   else{wrong++;cls.wrong++;const errors=confusions[label]??=Object.create(null);errors[predicted]=(errors[predicted]||0)+1}
  }
  const n=samples.length,attempted=correct+wrong;
  const round=x=>Math.round(x*10000)/10000;
  return Object.freeze({
   samples:n,minimumReached:n>=minSamples,
   datasetSignature:JSON.stringify(samples.map(x=>[x.id,x.actual]).sort((a,b)=>a[0].localeCompare(b[0]))),
   correct,wrong,abstained,
   coverage:round(attempted/n),
   accuracyWhenPredicted:attempted?round(correct/attempted):null,
   overallCorrectRate:round(correct/n),
   errorRate:round(wrong/n),
   confusions,perClass
  });
 }
 function compare(candidate,baseline){
  if(!candidate||!baseline||typeof candidate.datasetSignature!=='string'||typeof baseline.datasetSignature!=='string'||candidate.datasetSignature!==baseline.datasetSignature)throw new Error('Comparar resultados requiere exactamente las mismas imágenes y etiquetas');
  if(!candidate.minimumReached||!baseline.minimumReached)return Object.freeze({decision:'INSUFFICIENT_DATA',reason:'Muestras insuficientes'});
  if(candidate.wrong>baseline.wrong)return Object.freeze({decision:'DO_NOT_RELEASE',reason:'Más identificaciones erróneas'});
  if(candidate.overallCorrectRate<=baseline.overallCorrectRate)return Object.freeze({decision:'DO_NOT_RELEASE',reason:'No aumenta el reconocimiento correcto total'});
  return Object.freeze({decision:'REVIEW_REQUIRED',reason:'Mejora observada, requiere revisión por clase y dispositivo'});
 }
 return Object.freeze({evaluate,compare});
});
