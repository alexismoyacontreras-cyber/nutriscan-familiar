const assert=require('node:assert/strict');
const {assess}=require('../src/acceptance');
const classes={Tomate:{total:10,correct:10},Palta:{total:10,correct:9},Choclo:{total:10,correct:9},Marraqueta:{total:10,correct:8}};
assert.equal(assess({samples:40,correct:36,wrong:4,abstained:0,perClass:classes}).passed,true);
assert.equal(assess({samples:40,correct:35,wrong:0,abstained:5,perClass:classes}).passed,false);
assert.equal(assess({samples:40,correct:36,wrong:4,abstained:0,perClass:{...classes,Palta:{total:9,correct:9}}}).passed,false);
assert.equal(assess({samples:4,correct:4,wrong:0,abstained:0,perClass:classes}).passed,false);
assert.throws(()=>assess({samples:4,correct:5,wrong:0,abstained:0}),/inválido/);
console.log('OK: criterio 90 % y mínimo por alimento');
