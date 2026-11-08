/* Geometría del escáner: el encuadre completo nunca debe recortar el alimento. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.NutriFrame=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function frame(w,h,ratio,size=384){
 if(![w,h,ratio,size].every(v=>typeof v==='number'&&Number.isFinite(v)&&v>0)||ratio>1)throw Error('Dimensiones inválidas');
 if(ratio===1){const scale=Math.min(size/w,size/h),dw=w*scale,dh=h*scale;return {sx:0,sy:0,sw:w,sh:h,dx:(size-dw)/2,dy:(size-dh)/2,dw,dh};}
 const side=Math.min(w,h)*ratio;return {sx:(w-side)/2,sy:(h-side)/2,sw:side,sh:side,dx:0,dy:0,dw:size,dh:size};
}
return Object.freeze({frame});
});
