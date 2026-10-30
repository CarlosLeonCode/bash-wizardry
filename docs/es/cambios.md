# 🆕 ¿Qué hay de nuevo?

## Fase 2: Núcleo Seguro para Agentes (Última Actualización)

Un núcleo más sólido que trabaja para ti en la terminal y no interfiere con los agentes de IA.

### ⚠️ Cambios Incompatibles
- **`rg` ahora es `rgen`** (`rails generate`), así ripgrep (`rg`) deja de quedar oculto.
- **Los hooks `.bw-on-enter` requieren aprobación:** solo se ejecutan después de `ws-trust` (fijado por sha256; cualquier edición exige volver a confiar).
- **Se omiten los hechizos que chocan:** un hechizo que ocultaría un comando instalado, un builtin o una palabra reservada (por ejemplo `rs`, `gs` con Ghostscript, `r` en Zsh) no se carga. `bw-help` los lista; puedes conservarlos con `BW_ALLOW_OVERRIDE`.

### 🌟 Nuevas Funciones
- **Modo agente:** en shells no interactivas o cuando hay una variable de agente (`CLAUDECODE`, `CODEX_SANDBOX`, `CURSOR_AGENT`, `GEMINI_CLI`, `AI_AGENT`...), solo se carga `scripts/`. Contrólalo con `BW_AGENT_MODE=auto|1|0`.
- **CLI `bwiz`:** `bwiz help [módulo]`, `bwiz help --json` para agentes, `bwiz modules`, `bwiz version`.
- **Personaliza sin hacer fork:** tu `config.env` y tus módulos viven en `~/.config/bash-wizardry/`; un módulo de usuario con el mismo nombre que uno del núcleo lo reemplaza. Consulta [Personalización](personalizacion.md).
- **Catálogo de comandos:** `catalog/commands.tsv` es la única fuente de verdad para `bw-help`, `bwiz` y el sitio web.
- **Nuevo sitio web** en [bashwizardry.carlosleoncode.com](https://bashwizardry.carlosleoncode.com/es), en inglés y español, con un video de 72 segundos.

### 🐛 Correcciones
- Las confirmaciones (`greset`, `n-clean`, `dckrprune`, `rdbreset`...) funcionan en Zsh.
- `ws` funciona en Zsh y con varias raíces; el selector de contenedores Docker devuelve el ID correcto.
- `gclean` nunca borra la rama por defecto, la actual ni las protegidas (`BW_GIT_PROTECTED_BRANCHES`) y pregunta antes.
- `bw-update` recarga tu shell e informa los fallos; `djstartapp` funciona en macOS; se cargan los autocompletados; `docker-cleanup.sh` es ejecutable.
- La documentación y las sugerencias usan los comandos Docker reales (`dckrexec`, `dckrlogs`, `dckrclean`).

### 🛠️ Calidad
- Suite de pruebas con bats para Bash y Zsh, y CI con ShellCheck en Ubuntu y macOS.

## Fase 1: Contexto Profundo y Espacios de Trabajo

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
