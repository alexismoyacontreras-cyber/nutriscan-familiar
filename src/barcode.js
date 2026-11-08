/* Consulta opcional de código de barras; la información es comunitaria y debe verificarse en el envase. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.NutriBarcode=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function parseBarcode(input){
 const code=String(input??'').replace(/[\s-]/g,'');
 if(!/^\d{8,14}$/.test(code))throw new Error('Introduce un código de barras de 8 a 14 dígitos');
 return code;
}
function normalizeProduct(payload,barcode){
 if(!payload||payload.status!==1||!payload.product)throw new Error('Producto no encontrado en Open Food Facts');
 const p=payload.product,n=p.nutriments||{};
 const name=String(p.product_name_es||p.product_name||'').trim();
 if(!name)throw new Error('El producto no tiene nombre utilizable');
 const kcal=n['energy-kcal_100g'];
 if(typeof kcal!=='number'||!Number.isFinite(kcal)||kcal<0||kcal>1000)throw new Error('Sin calorías válidas por 100 g');
 const nutrients={kcalPer100g:kcal};
 for(const [field,key] of [['proteins_100g','proteinPer100g'],['carbohydrates_100g','carbsPer100g'],['fat_100g','fatPer100g']]){
  const value=n[field];
  if(typeof value==='number'&&Number.isFinite(value)&&value>=0&&value<=100)nutrients[key]=value;
 }
 if(Object.keys(nutrients).length===4&&nutrients.proteinPer100g+nutrients.carbsPer100g+nutrients.fatPer100g>100.01)throw new Error('Los nutrientes informados son incompatibles');
 return Object.freeze({barcode,name,brand:String(p.brands||''),nutrients:Object.freeze(nutrients),source:'Open Food Facts (datos colaborativos, no verificados)',sourceVersion:'API v2',sourceUrl:'https://world.openfoodfacts.org/product/'+barcode,estimated:true});
}
async function lookup(input,fetcher){
 const barcode=parseBarcode(input);
 const request=fetcher||(typeof fetch==='function'?fetch:null);
 if(!request)throw new Error('Sin conexión de consulta disponible');
 const url='https://world.openfoodfacts.org/api/v2/product/'+barcode+'.json?fields=product_name,product_name_es,brands,nutriments';
 const response=await request(url,{headers:{Accept:'application/json'}});
 if(!response.ok)throw new Error('No fue posible consultar Open Food Facts ('+response.status+')');
 return normalizeProduct(await response.json(),barcode);
}
return Object.freeze({parseBarcode,normalizeProduct,lookup});
});
