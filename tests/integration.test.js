/* Ejecutar: node tests/integration.test.js */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');
assert.match(html,/<script src="src\/nutrition\.js"><\/script><script>/);
assert.match(html,/NutriNutrition\.confirmedRecord\(/);
assert.match(html,/const prev=p\(\);db\[person\]=candidate;if\(!target\(\)\)\{db\[person\]=prev;/);
assert.match(html,/if\(h>=1&&h<3\)candidate\.height=/);
assert.match(html,/String\(d\.getDate\(\)\)\.padStart\(2,'0'\)/);
assert.match(html,/KEY='nutriscan_family_v2'/);
assert.doesNotMatch(html,/if\(reliable\)select\.value=String\(top\.i\)/);
assert.match(html,/Sugerencia visual:/);
assert.match(html,/Selecciona tú el alimento real/);
console.log('OK: integraciones y compatibilidad de almacenamiento verificadas por inspección estática');
