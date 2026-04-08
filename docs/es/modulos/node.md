# 📦 Módulo Node.js

Gestiona tus proyectos de JavaScript con facilidad. Este módulo detecta automáticamente si estás usando `npm`, `yarn` o `pnpm` y utiliza el comando correcto.

## 🤖 Detección Automática
No necesitas recordar qué manager usa cada proyecto. `bash-wizardry` busca archivos como `package-lock.json`, `yarn.lock` o `pnpm-lock.yaml` por ti.

## 🚀 Comandos Clave

### `ni` (Instalar)
Instala las dependencias.
- Ejecuta `npm install`, `yarn` o `pnpm install` según el proyecto.

### `na <paquete>` (Añadir)
Añade una nueva dependencia.
- Ejecuta `npm install`, `yarn add` o `pnpm add`.

### `nr [script]` (Ejecutar)
La forma más inteligente de correr scripts.
- **Sin script:** Muestra un **menú interactivo** (si `fzf` está instalado) para elegir un script de tu `package.json`.
- **Con script:** Lo ejecuta usando el manager detectado.

### `n-reinstall` (La solución al 99% de errores)
Cuando algo va mal con las dependencias.
- **Qué hace:** Borra `node_modules` y el archivo lock (opcional), luego hace una instalación limpia.

---
[Volver a Herramientas](../herramientas.md)
