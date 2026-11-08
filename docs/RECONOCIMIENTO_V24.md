# NutriScan — especificación de reconocimiento seguro v2.4

## Auditoría del código actual (2026-11-08)
- Archivo de entrada: `index.html`, sitio estático GitHub Pages.
- La interfaz utiliza un clasificador de similitud imagen-texto (CLIP) con lista limitada de etiquetas. No es un detector de objetos ni una balanza.
- El reconocimiento no demuestra una exactitud del 99%; las puntuaciones de similitud no deben interpretarse como probabilidad de acierto.
- Las calorías de alimentos manuales están codificadas como valores fijos por porción, sin trazabilidad de fuente, peso ni preparación.
- El perfil y registros se almacenan en `localStorage` del navegador; no existe sincronización entre dispositivos.
- La meta de energía se estima con Mifflin–St Jeor y un multiplicador de actividad. No es una prescripción clínica.

## Requisitos de aceptación antes de reemplazar el escáner
1. No registrar ni asignar calorías automáticamente a una etiqueta inferida sin confirmación explícita del usuario.
2. En resultados ambiguos, mostrar «No identificado» y permitir búsqueda manual; nunca mostrar como certeza una clase inferida.
3. Solicitar gramos de porción comestible; no inferirlos desde una fotografía sin referencia de escala validada.
4. Separar «alimento identificado», «porción declarada» y «datos nutricionales por 100 g» en el registro.
5. Registrar fuente, versión y fecha de la tabla nutricional. Para alimentos preparados, indicar variación por receta.
6. Cámara: HTTPS, permiso explícito, cámara trasera preferida, manejo de rechazo y opción de cargar foto.
7. Privacidad: procesar localmente cuando sea posible, no subir fotos ni datos personales a repositorios públicos.
8. Mantener registro manual funcional si el modelo no carga o el dispositivo carece de recursos.
9. No afirmar «99% de precisión» sin conjunto de prueba independiente y resultados reproducibles.
10. Probar iPhone Safari/Chrome (ambos usan WebKit), Android Chrome y escritorio.

## Evaluación cuantitativa
- Conjunto de prueba independiente, con consentimiento, separado de cualquier dato de entrenamiento.
- Mínimo inicial sugerido: 30 imágenes por clase prioritaria, con distintas iluminaciones, fondos, ángulos y teléfonos; aumentar antes de generalizar.
- Clases prioritarias: tomate, palta, manzana, naranja, mandarina, plátano, pepino, pimentón, choclo, pan y platos preparados.
- Medir exactitud top-1, top-3, matriz de confusión, precisión por clase, tasa de abstención, error entre clases y latencia p50/p95.
- Incluir negativos (objetos que no son comida), múltiples alimentos y oclusiones; nunca forzar etiqueta.
- Publicar resultados por dispositivo y clase. Objetivo 99% es aspiracional, no garantía.

## Arquitectura propuesta
- Capa de captura y recorte con revisión visual.
- Modelo especializado en alimentos (evaluar variantes de Food-101 y modelos de frutas/verduras; confirmar licencias, tamaño, cobertura y funcionamiento real en navegador).
- Comprobación de resultados y abstención cuando no exista evidencia suficiente.
- Selector de corrección con búsqueda, sin dependencia de la inferencia.
- Catálogo local de nutrientes por 100 g con fuente verificable (p. ej. USDA FoodData Central; revisar cobertura chilena y condiciones de uso).
- Cálculo: kcal = gramos comestibles × kcal_por_100g / 100.
- Historial con distinción entre estimación y dato confirmado.

## Seguridad de publicación
La rama `main` es la versión pública. Desarrollar en rama separada, validar y revisar antes de fusionar. No incluir claves API en HTML o JS público. Evitar depender de un endpoint gratuito sin garantías de cuota o disponibilidad.

## Próximos hitos
1. Preparar catálogo normalizado y pruebas automáticas de fórmulas, validaciones y persistencia.
2. Implementar flujo de selección y confirmación explícita con estados accesibles.
3. Integrar y comparar modelos especializados en una página de laboratorio no publicada.
4. Documentar métricas y habilitar despliegue solo tras criterios de aceptación.
