/* NutriScan: cálculo nutricional seguro. Sin dependencias, navegador y Node. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  else root.NutriNutrition=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function number(value,name){
    if(typeof value!=='number'||!Number.isFinite(value)) throw new TypeError(name+' debe ser un número finito');
    return value;
  }
  function calculate({grams,kcalPer100g,proteinPer100g=0,carbsPer100g=0,fatPer100g=0}){
    number(grams,'grams');number(kcalPer100g,'kcalPer100g');
    if(grams<=0||grams>5000) throw new RangeError('grams fuera de rango (0, 5000]');
    const nutrients={kcalPer100g,proteinPer100g,carbsPer100g,fatPer100g};
    for(const [key,val] of Object.entries(nutrients)){
      number(val,key);
      if(val<0||val>1000) throw new RangeError(key+' fuera de rango');
    }
    if(proteinPer100g>100||carbsPer100g>100||fatPer100g>100) throw new RangeError('macronutrientes fuera de rango');
    const factor=grams/100;
    const round=n=>Math.round((n+Number.EPSILON)*100)/100;
    return Object.freeze({
      grams,
      kcal:round(kcalPer100g*factor),
      protein:round(proteinPer100g*factor),
      carbs:round(carbsPer100g*factor),
      fat:round(fatPer100g*factor)
    });
  }
  function confirmedRecord({foodId,foodName,grams,nutrients,source,sourceVersion,confirmed}){
    if(confirmed!==true) throw new Error('Se requiere confirmación explícita del alimento');
    if(typeof foodId!=='string'||!foodId.trim()||typeof foodName!=='string'||!foodName.trim()) throw new Error('Identificación de alimento incompleta');
    if(typeof source!=='string'||!source.trim()||typeof sourceVersion!=='string'||!sourceVersion.trim()) throw new Error('Fuente nutricional y versión obligatorias');
    if(!nutrients||typeof nutrients!=='object') throw new Error('Datos nutricionales ausentes');
    const values=calculate({grams,...nutrients});
    return Object.freeze({foodId,foodName,source,sourceVersion,confirmed:true,estimated:true,...values});
  }
  function canRecordRecognition(recognition){
    return Boolean(recognition&&recognition.userConfirmed===true&&typeof recognition.foodId==='string'&&recognition.foodId.trim());
  }
  return Object.freeze({calculate,confirmedRecord,canRecordRecognition});
});
