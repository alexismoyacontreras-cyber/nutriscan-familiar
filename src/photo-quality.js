/* Control de calidad fotográfica antes de descargar/ejecutar el modelo. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.NutriPhotoQuality=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function inspect(pixels,width,height){
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<16||height<16||!pixels||pixels.length!==width*height*4)throw Error('Imagen inválida');
 const gray=new Float32Array(width*height);let sum=0,black=0,white=0;
 for(let i=0,j=0;i<pixels.length;i+=4,j++){
  const v=(.2126*pixels[i]+.7152*pixels[i+1]+.0722*pixels[i+2]);
  gray[j]=v;sum+=v;if(v<22)black++;if(v>245)white++;
 }
 const n=width*height,mean=sum/n;let edges=0,count=0;
 for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++){
  const i=y*width+x;
  const lap=Math.abs(4*gray[i]-gray[i-1]-gray[i+1]-gray[i-width]-gray[i+width]);
  edges+=lap;count++;
 }
 const detail=edges/count,dark=mean<32||black/n>.85,overexposed=mean>235||white/n>.85;
 // El detalle no es una medida calibrada de desenfoque; puede ser bajo en alimentos lisos.
 const lowDetail=detail<2.5;
 return {usable:!dark&&!overexposed,reason:dark?'DARK':overexposed?'OVEREXPOSED':lowDetail?'LOW_DETAIL':'OK',lowDetail,mean:Math.round(mean),detail:Math.round(detail*100)/100};
}
return Object.freeze({inspect});
});
