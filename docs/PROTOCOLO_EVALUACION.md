# Protocolo de evaluación del reconocimiento visual (versión 2.4)

## Objetivo
Comparar el reconocimiento CLIP existente con cualquier modelo candidato sin confundir puntuaciones del modelo con probabilidades de acierto.

## Conjunto de prueba
- Fotografías reales de alimentos, con consentimiento, en varios teléfonos, iluminación, fondos y distancias.
- Incluir explícitamente confusiones anteriores: **tomate / pan (marraqueta)** y **palta / choclo**.
- Registrar la etiqueta real mediante revisión humana independiente; no usar como verdad la respuesta de ningún modelo.
- Mantener **exactamente las mismas imágenes** para el modelo actual y el candidato. Conservar IDs únicos por imagen.
- Separar las imágenes usadas para ajustar umbrales de las reservadas para evaluación final.
- No subir fotos personales al repositorio público. Usar datos anónimos o un conjunto privado con autorización.

## Formato de evaluación
Cada predicción se representa como:
`{"id":"foto-001","actual":"Tomate","predicted":"Tomate"}`

Si el modelo no reconoce el alimento, usar `"predicted":null` (abstención). No sustituir una abstención por una etiqueta inventada.

## Indicadores
`src/benchmark.js` mide aciertos, errores, abstenciones, cobertura, precisión entre predicciones emitidas y acierto total; desglosa por alimento. El módulo requiere por defecto al menos 30 muestras para emitir una decisión distinta de «datos insuficientes». **30 es un mínimo técnico de protección, no un tamaño de muestra suficiente para afirmar precisión clínica o generalización.**

## Regla de publicación
Una mejora no puede aprobarse automáticamente. Si hay más identificaciones erróneas o no aumenta el acierto total, la evaluación devuelve `DO_NOT_RELEASE`. Si mejora, devuelve `REVIEW_REQUIRED`: exige revisar errores críticos por clase, diversidad de fotos, rendimiento y privacidad antes de publicar. Las pruebas de software no sustituyen un ensayo con fotografías reales.

## Nutrición
El reconocimiento visual no estima gramos con fiabilidad desde una sola fotografía sin referencia de escala. El usuario debe introducir la porción. No declarar valores oficiales hasta vincular cada ficha con una fuente real, identificación y versión verificables.
