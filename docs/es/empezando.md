# 🚀 Empezando con bash-wizardry

¡Bienvenido a la torre del mago! `bash-wizardry` está diseñado para ser una extensión potente y no intrusiva para tu terminal.

## 🛠️ Instalación

### Automática (Recomendada)
La forma más segura de instalar es usando el script de instalación:
```bash
curl -fsSL https://raw.githubusercontent.com/CarlosLeonCode/bash-wizardry/main/install.sh | bash
```

### Manual
1. Clona el repositorio en una carpeta de tu elección (ej. `~/.bash-wizardry`).
2. Agrega la línea de `source` a tu `init.sh` en tu `.zshrc` o `.bashrc`:
   ```bash
   echo "source ~/.bash-wizardry/init.sh" >> ~/.zshrc
   ```

## ⚙️ Configuración

El proyecto utiliza un archivo `config.env` en la raíz. Puedes activar o desactivar módulos y definir tus rutas de trabajo.

1. Crea `config.env` desde la plantilla:
   ```bash
   cp config.env.example config.env
   ```
2. Edita `config.env` según tus necesidades:
   - `BW_ENABLE_GIT=true` (Activar/Desactivar módulos)
   - `BW_WORKSPACE_ROOTS="$HOME/Dev"` (Define tus rutas de proyectos)

## 🧙‍♂️ Uso Básico

- **`bw-help`**: Muestra los módulos disponibles y ayuda general.
- **`bw-update`**: Descarga los últimos cambios y recarga el sistema.
- **`ws`**: Salta entre tus espacios de trabajo.

## 🛡️ Seguridad Ante Todo
Comandos como `gbd` (borrar rama) o `rdbreset` (resetear base de datos) siempre pedirán confirmación. ¡Úsalos sin miedo!

---
[Volver al README](../../README.md)
