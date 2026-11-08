const assert=require('node:assert/strict');
const {inspect}=require('../src/photo-quality.js');
function make(fn){const w=48,h=48,p=new Uint8ClampedArray(w*h*4);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const v=fn(x,y),i=(y*w+x)*4;p[i]=p[i+1]=p[i+2]=v;p[i+3]=255;}return inspect(p,w,h)}
assert.equal(make(()=>0).reason,'DARK');
assert.equal(make(()=>255).reason,'OVEREXPOSED');
assert.equal(make(()=>128).reason,'LOW_DETAIL');
assert.equal(make((x,y)=>(x+y)%2?40:220).reason,'OK');
assert.throws(()=>inspect(new Uint8ClampedArray(4),48,48),/inválida/);
console.log('OK: control de iluminación y detalle fotográfico');
