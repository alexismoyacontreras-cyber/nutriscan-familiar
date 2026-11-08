/* Catálogo nutricional trazable: no inventa valores ni certifica fuentes. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  else root.NutriCatalog=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const trustedKinds=Object.freeze(['USDA_FDC','ETIQUETA_FABRICANTE','TABLA_OFICIAL']);
  function validate(item){
    if(!item||typeof item!=='object') throw new TypeError('Ficha nutricional ausente');
    for(const key of ['id','name','sourceKind','sourceId','sourceVersion','sourceUrl','basis']){
      if(typeof item[key]!=='string'||!item[key].trim()) throw new Error('Falta '+key);
    }
    if(!trustedKinds.includes(item.sourceKind)) throw new Error('Tipo de fuente no reconocido');
    if(item.basis!=='100g') throw new Error('Solo se admiten valores por 100 g comestibles');
    if(!/^https:\/\//.test(item.sourceUrl)) throw new Error('Se requiere URL HTTPS de la fuente');
    const n=item.nutrients;
    if(!n||typeof n!=='object') throw new Error('Faltan nutrientes');
    for(const key of ['kcalPer100g','proteinPer100g','carbsPer100g','fatPer100g']){
      if(typeof n[key]!=='number'||!Number.isFinite(n[key])||n[key]<0) throw new Error('Nutriente inválido: '+key);
    }
    if(n.proteinPer100g+n.carbsPer100g+n.fatPer100g>100.01) throw new Error('Macronutrientes incompatibles');
    if(n.kcalPer100g>1000) throw new Error('Energía incompatible');
    return Object.freeze({...item,nutrients:Object.freeze({...n})});
  }
  function lookup(catalog,id){
    if(!Array.isArray(catalog)) throw new TypeError('Catálogo inválido');
    return catalog.find(item=>item.id===id)||null;
  }
  return Object.freeze({validate,lookup,trustedKinds});
});
