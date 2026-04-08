# 🔮 El Arsenal del Mago (Herramientas y Módulos)

bash-wizardry está dividido en módulos especializados. Cada uno puede activarse/desactivarse en `config.env`.

## 📂 Espacios de Trabajo (`ws`)
*Navegación mágica.*

- **`ws [búsqueda]`**: Salta a un directorio de proyecto. Búsqueda interactiva con `fzf`.
- **Hooks**: Soporta scripts `.bw-on-enter` en la raíz del proyecto.

## 📦 Node.js
*Workflow universal de JS.*

- **`ni`**, **`na`**, **`nr`**: Gestión agnóstica de paquetes (npm, yarn, pnpm).
- **`n-reinstall`**: Elimina `node_modules` y reinstala desde cero.

## 🐙 Git
*Historial rápido y seguro.*

- **`gup`**: La sincronización definitiva (`pull --rebase` + `push`).
- **`gbd`**: Borrado seguro de ramas con confirmación.
- **`gundo`**: Deshace el último commit suavemente.

## 🐳 Docker
*Gestión interactiva de contenedores.*

- **`dkrinto`**: Entra en un contenedor (menú interactivo).
- **`dkrclean`**: Asistente de limpieza segura.
- **`dkrlogs`**: Streaming de logs interactivo.

## 🌍 Selector de Entornos (`env-set`)
*Gestión de archivos .env.*

- **`env-set [nombre]`**: Cambia archivos `.env` de forma segura.
- **`env-ls`**: Lista entornos disponibles.

## 🪄 Descubrimiento (Discovery)
*Conciencia contextual.*

- Muestra consejos al entrar a un proyecto (ej. "Detected Node.js project. Type 'nr' to manage scripts.")

---
[Volver al README](../README.md)
