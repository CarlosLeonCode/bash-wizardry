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
Puedes automatizar tareas al entrar en un proyecto. Crea un archivo llamado `.bw-on-enter` en la raíz. `bash-wizardry` lo cargará automáticamente.
*Úsalo para: Cambiar versiones de Node, levantar bases de datos o exportar variables de entorno.*

---

## 🪄 Descubrimiento (Discovery)

Este módulo muestra consejos contextuales cada vez que entras en un directorio.

### Qué detecta:
- **Node.js**: Sugiere `nr` para scripts.
- **Docker**: Sugiere `dkrlogs` o `dkrinto`.
- **Django/Rails**: Sugiere comandos de shell o base de datos.

---
[Volver al Índice](../README.md)
