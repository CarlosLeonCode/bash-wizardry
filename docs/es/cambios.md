# 🆕 ¿Qué hay de nuevo?

## Fase 1: Contexto Profundo y Espacios de Trabajo (Última Actualización)

Hemos implementado las funciones principales de la Fase 1, enfocándonos en que el terminal entienda dónde estás y qué necesitas.

### 🌟 Nuevas Funciones

#### 1. Espacios de Trabajo Mágicos (`ws`)
- **Búsqueda Interactiva**: Usa `fzf` para saltar entre tus proyectos instantáneamente.
- **Hooks de Entrada**: Añade un archivo `.bw-on-enter` en cualquier raíz de proyecto para automatizar la configuración del entorno (nvm, docker, exports).
- **Múltiples Raíces**: Define varios directorios de proyectos en `BW_WORKSPACE_ROOTS`.

#### 2. Auto-Descubrimiento y Consejos Contextuales
- **Conciencia**: Al entrar en un directorio, el mago detecta el tipo de proyecto (Node, Docker, Django, Rails).
- **Consejos Sutiles**: Muestra tips especializados sobre los scripts o herramientas disponibles para ese contexto específico.

#### 3. Selector Inteligente de `.env` (`env-set`)
- **Cambio Seguro**: Cambia fácilmente entre `.env.staging`, `.env.prod`, etc.
- **Backups de Seguridad**: Si tu `.env` actual tiene cambios manuales, se hará un respaldo automático antes de cambiarlo.

### 🛠️ Mejoras del Núcleo
- **Compatibilidad Multiplataforma**: Mejorado `init.sh` para soportar versiones antiguas de Bash (como la 3.2 por defecto en macOS).
- **Soporte Bilingüe**: Documentación ahora disponible tanto en Inglés como en Español.

---
[Volver al Índice](README.md)
