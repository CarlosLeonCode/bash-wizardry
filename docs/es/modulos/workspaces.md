# 📂 Espacios de Trabajo y Descubrimiento

Convierte tu terminal en una herramienta de navegación profesional.

## 🗺️ Workspaces (`ws`)

El comando `ws` es tu centro principal para moverte entre proyectos.

### Uso
- **`ws [búsqueda]`**: Escribe parte del nombre de un proyecto para saltar a su directorio.
- **`ws` (solo)**: Abre un menú interactivo `fzf` para buscar entre todos tus proyectos.

### Configuración
Define tus rutas de trabajo en `config.env`:
```bash
BW_WORKSPACE_ROOTS="$HOME/Dev:$HOME/Personal"
```

### Automatización con Hooks (`.bw-on-enter`)
Puedes automatizar tareas al entrar en un proyecto. Crea un archivo llamado `.bw-on-enter` en la raíz. `bash-wizardry` lo cargará en cada visita con `ws`, pero solo después de que lo marques como confiable.
*Úsalo para: Cambiar versiones de Node, levantar bases de datos o exportar variables de entorno.*

Por seguridad, los hooks nunca se ejecutan hasta que los apruebas (un repositorio clonado podría incluir uno malicioso). Desde la raíz del proyecto, ejecuta **`ws-trust`**: muestra el contenido del hook y pide confirmación. La aprobación está ligada al contenido del archivo, así que cualquier cambio en `.bw-on-enter` requiere ejecutar `ws-trust` de nuevo. Los hooks aprobados se guardan en `~/.config/bash-wizardry/trusted_hooks` (configurable con `BW_TRUST_FILE`).

---

## 🪄 Descubrimiento (Discovery)

Este módulo muestra consejos contextuales cada vez que entras en un directorio.

### Qué detecta:
- **Node.js**: Sugiere `nr` para scripts.
- **Docker**: Sugiere `dckrexec`.
- **Django/Rails**: Sugiere comandos de shell o base de datos.

---
[Volver al Índice](../README.md)
