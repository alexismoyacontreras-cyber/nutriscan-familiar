const assert=require('node:assert/strict');
const {normalize}=require('../src/scan-scores.js');
const labels=['Tomate','Palta','Marraqueta'];
assert.deepEqual(normalize([{label:'Palta',score:.1},{label:'Marraqueta',score:.2},{label:'Tomate',score:.7}],labels),[.7,.1,.2]);
assert.throws(()=>normalize([{label:'Tomate',score:.8}],labels),/incompleto/);
assert.throws(()=>normalize([{label:'Tomate',score:.8},{label:'Tomate',score:.1},{label:'Palta',score:.1}],labels),/duplicada/);
assert.throws(()=>normalize([{label:'Tomate',score:.8},{label:'Palta',score:.1},{label:'Pan',score:.1}],labels),/desconocida/);
assert.throws(()=>normalize([{label:'Tomate',score:NaN},{label:'Palta',score:.1},{label:'Marraqueta',score:.1}],labels),/inválida/);
console.log('OK: salida del clasificador completa, única y numérica');
