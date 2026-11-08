const assert=require('node:assert/strict');
const {evaluate,compare}=require('../src/benchmark.js');
const examples=[
 {id:'1',actual:'Tomate',predicted:'Tomate'},
 {id:'2',actual:'Palta',predicted:'Choclo'},
 {id:'3',actual:'Pan',predicted:null}
];
const result=evaluate(examples,{minSamples:3});
assert.equal(result.samples,3);
assert.equal(result.correct,1);
assert.equal(result.wrong,1);
assert.equal(result.abstained,1);
assert.equal(result.coverage,0.6667);
assert.equal(result.accuracyWhenPredicted,0.5);
assert.equal(result.overallCorrectRate,0.3333);
assert.equal(result.perClass.Palta.wrong,1);
assert.equal(compare(result,result).decision,'DO_NOT_RELEASE');
assert.equal(compare(evaluate(examples,{minSamples:30}),evaluate(examples,{minSamples:30})).decision,'INSUFFICIENT_DATA');
assert.throws(()=>evaluate([]),/etiquetado/);
assert.throws(()=>evaluate([{...examples[0]},{...examples[0]}]),/duplicado/);
const better=evaluate([{id:'1',actual:'Tomate',predicted:'Tomate'},{id:'2',actual:'Palta',predicted:'Palta'},{id:'3',actual:'Pan',predicted:null}],{minSamples:3});
assert.equal(compare(better,result).decision,'REVIEW_REQUIRED');
const risky=evaluate([{id:'1',actual:'Tomate',predicted:'Palta'},{id:'2',actual:'Palta',predicted:'Palta'},{id:'3',actual:'Pan',predicted:'Tomate'}],{minSamples:3});
assert.equal(compare(risky,result).decision,'DO_NOT_RELEASE');
const sameSizeDifferentImages=evaluate([{id:'otra-1',actual:'Tomate',predicted:'Tomate'},{id:'otra-2',actual:'Palta',predicted:'Palta'},{id:'otra-3',actual:'Pan',predicted:null}],{minSamples:3});
assert.throws(()=>compare(sameSizeDifferentImages,result),/mismas imágenes/);
const sameIdWrongGroundTruth=evaluate([{id:'1',actual:'Tomate',predicted:'Tomate'},{id:'2',actual:'Choclo',predicted:'Choclo'},{id:'3',actual:'Pan',predicted:null}],{minSamples:3});
assert.throws(()=>compare(sameIdWrongGroundTruth,result),/mismas imágenes/);
const reversed=evaluate([...examples].reverse(),{minSamples:3});
assert.equal(reversed.datasetSignature,result.datasetSignature);
console.log('OK: evaluación de aciertos, errores y abstenciones');
