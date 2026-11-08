/* Criterio de aceptación verificable: 90 % de aciertos sobre TODAS las fotos, incluyendo abstenciones. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.NutriAcceptance=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const DEFAULT_PRIORITY=['Tomate','Palta','Choclo','Marraqueta'];
function assess(report,options={}){
 if(!report||!Number.isInteger(report.samples)||report.samples<1||!Number.isInteger(report.correct)||!Number.isInteger(report.wrong)||!Number.isInteger(report.abstained)||report.correct+report.wrong+report.abstained!==report.samples)throw Error('Informe inválido');
 const minSamples=options.minSamples??40,minPerClass=options.minPerClass??10,target=options.target??.90,priority=options.priority??DEFAULT_PRIORITY;
 if(!Number.isInteger(minSamples)||minSamples<1||!Number.isInteger(minPerClass)||minPerClass<1||!Number.isFinite(target)||target<=0||target>1||!Array.isArray(priority)||!priority.length||new Set(priority).size!==priority.length)throw Error('Criterios inválidos');
 const perClass=priority.map(name=>{const p=report.perClass?.[name],total=p?.total??0,correct=p?.correct??0;return {name,total,correct,rate:total?correct/total:null,minimumReached:total>=minPerClass}});
 const overall=report.correct/report.samples,hasSamples=report.samples>=minSamples&&perClass.every(x=>x.minimumReached);
 const weakClasses=perClass.filter(x=>x.minimumReached&&x.rate<target).map(x=>x.name);
 const passed=hasSamples&&overall>=target&&weakClasses.length===0;
 return Object.freeze({passed,hasSamples,target,overall,minimumRequired:minSamples,perClass,weakClasses,reason:!hasSamples?'INSUFFICIENT_LABELED_PHOTOS':overall<target?'BELOW_OVERALL_TARGET':weakClasses.length?'BELOW_CLASS_TARGET':'TARGET_REACHED_PENDING_EXTERNAL_VALIDATION'});
}
return Object.freeze({assess,DEFAULT_PRIORITY});
});
