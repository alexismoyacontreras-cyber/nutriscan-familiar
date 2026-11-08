const assert=require('node:assert/strict');
const {frame}=require('../src/frame.js');
for(const [w,h] of [[1200,800],[800,1200],[800,800],[3024,4032]]){
 const full=frame(w,h,1);
 assert.equal(full.sx,0);assert.equal(full.sy,0);assert.equal(full.sw,w);assert.equal(full.sh,h);
 assert.ok(full.dx>=0&&full.dy>=0&&full.dx+full.dw<=384.00001&&full.dy+full.dh<=384.00001);
 const center=frame(w,h,.72);
 assert.ok(center.sw<=w&&center.sh<=h&&center.sx>=0&&center.sy>=0);
 assert.equal(center.dw,384);assert.equal(center.dh,384);
}
assert.throws(()=>frame(0,500,1),/inválidas/);
assert.throws(()=>frame(500,500,2),/inválidas/);
console.log('OK: fotografía vertical, horizontal y cuadrada conservan encuadre completo');
