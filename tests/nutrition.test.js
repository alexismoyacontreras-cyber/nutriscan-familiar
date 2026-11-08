/* Ejecutar: node tests/nutrition.test.js */
const assert=require('node:assert/strict');
const {calculate,confirmedRecord,canRecordRecognition}=require('../src/nutrition.js');
assert.deepEqual(calculate({grams:150,kcalPer100g:20,proteinPer100g:1,carbsPer100g:4,fatPer100g:0.2}),{grams:150,kcal:30,protein:1.5,carbs:6,fat:0.3});
assert.equal(calculate({grams:100,kcalPer100g:18}).kcal,18);
for(const grams of [0,-1,5001,NaN,Infinity,'100']){
 assert.throws(()=>calculate({grams,kcalPer100g:18}));
}
for(const kcalPer100g of [-1,NaN,Infinity,'18']) assert.throws(()=>calculate({grams:100,kcalPer100g}));
assert.equal(canRecordRecognition({foodId:'tomato',userConfirmed:false}),false);
assert.equal(canRecordRecognition({foodId:'tomato',userConfirmed:true}),true);
const args={foodId:'tomato',foodName:'Tomate',grams:100,nutrients:{kcalPer100g:18},source:'Referencia de ejemplo (NO validada)',sourceVersion:'test',confirmed:false};
assert.throws(()=>confirmedRecord(args),/confirmación/);
assert.equal(confirmedRecord({...args,confirmed:true}).kcal,18);
assert.throws(()=>confirmedRecord({...args,confirmed:true,source:''}),/Fuente/);
console.log('OK: pruebas de cálculo y bloqueo de registros sin confirmar');
