# Auditoría de Seguridad de Dependencias

Este documento detalla el estado actual de las vulnerabilidades reportadas por `npm audit` y la justificación de por qué se mantienen en esta versión del proyecto.

## Estado Actual
- **Vulnerabilidades reportadas**: 45 (12 low, 10 moderate, 23 high).
- **Causa**: Dependencias transitorias de `@angular/cli` y `@angular-devkit/build-angular` en la versión 16.2.x.

## Justificación de Mantenimiento
El proyecto requiere estrictamente el uso de **Angular 16.2.16** y **Node.js 16+**. Las vulnerabilidades detectadas (en librerías como `tar`, `picomatch` o `serialize-javascript`) son intrínsecas a las versiones de las herramientas de compilación compatibles con esta versión de Angular.

### Evaluación de Riesgo
1. **Entorno de Desarrollo**: La mayoría de los avisos afectan a herramientas de tiempo de compilación (como `esbuild` o `webpack-dev-server`). El riesgo para el usuario final en producción es mínimo.
2. **Impacto en Producción**: No se han detectado vulnerabilidades críticas que afecten directamente al bundle final de la aplicación en tiempo de ejecución de manera que comprometan la lógica de negocio.

## Plan de Resolución Futuro
Para eliminar estas vulnerabilidades, se recomienda una migración completa del framework siguiendo este orden (una vez que los requisitos del proyecto lo permitan):
1. Actualizar a Angular 17.
2. Actualizar a Angular 18/19.
3. Ejecutar `npm audit fix` en cada paso intermedio.

---
*Nota: Siguiendo las directrices del proyecto, no se han forzado actualizaciones de sub-dependencias para evitar regresiones en la estabilidad del build de Angular 16.*
