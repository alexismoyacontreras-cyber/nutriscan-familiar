const assert=require('node:assert/strict');
const {foods}=require('../src/vision-catalog.js');
const names=foods.map(f=>f[0]);
assert.equal(new Set(names).size,names.length,'Nombres duplicados');
for(const name of ['Tomate','Palta','Choclo','Marraqueta','Pan'])assert.ok(names.includes(name),'Falta '+name);
assert.notEqual(foods.find(f=>f[0]==='Pan')[1],foods.find(f=>f[0]==='Marraqueta')[1]);
assert.ok(foods.every(f=>f.length===3&&f.every((v,i)=>i<2?typeof v==='string'&&v.length>0:Number.isFinite(v))));
assert.ok(Object.isFrozen(foods)&&Object.isFrozen(foods[0]));
console.log('OK: catálogo visual incluye marraqueta y no duplica clases');
