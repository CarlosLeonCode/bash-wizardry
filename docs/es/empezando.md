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

### Desinstalar
Elimina bash-wizardry de los archivos de inicio de tu shell y borra `~/.bash-wizardry`:
```bash
curl -fsSL https://raw.githubusercontent.com/CarlosLeonCode/bash-wizardry/main/uninstall.sh | bash
```
O ejecuta la copia que ya tienes: `~/.bash-wizardry/uninstall.sh`.

- Muestra lo que va a cambiar y pide confirmación antes de hacerlo (`--yes` omite la pregunta).
- Cada archivo que modifica (`~/.zshrc`, `~/.bashrc`, `~/.bash_profile`) se respalda como `<archivo>.bw-backup.<fecha>`.
- Tu configuración en `~/.config/bash-wizardry/` se conserva. Agrega `--purge` para borrarla también (tu `config.env`, tus módulos de usuario y los hooks aprobados):
  ```bash
  curl -fsSL https://raw.githubusercontent.com/CarlosLeonCode/bash-wizardry/main/uninstall.sh | bash -s -- --purge
  ```
- Después, abre una terminal nueva: los hechizos ya cargados en la actual siguen disponibles hasta que la cierres.

## ⚙️ Configuración

El proyecto utiliza un archivo `config.env` en la raíz. Puedes activar o desactivar módulos y definir tus rutas de trabajo.

1. Crea `config.env` desde la plantilla:
   ```bash
   cp config.env.example config.env
   ```
2. Edita `config.env` según tus necesidades:
   - `BW_ENABLE_GIT=true` (Activar/Desactivar módulos)
   - `BW_WORKSPACE_ROOTS="$HOME/Dev"` (Define tus rutas de proyectos)

> [!TIP]
> Mantén tu configuración fuera del repositorio en `~/.config/bash-wizardry/config.env`: se carga después del `config.env` del repositorio, tiene prioridad sobre él y no se pierde al actualizar. Tus propios módulos van en `~/.config/bash-wizardry/modules/`. Consulta [Personalización](personalizacion.md).

## 🧙‍♂️ Uso Básico

- **`bw-help`**: Lista todos los hechizos por módulo (`bw-help git` para uno solo), además de los comandos omitidos y tus módulos de usuario cargados.
- **`bwiz`**: El asistente de línea de comandos en tu `PATH`: `bwiz help [--json] [modulo]`, `bwiz modules`, `bwiz version`.
- **`bw-update`**: Descarga los últimos cambios (solo fast-forward) y recarga el sistema en tu shell actual. Si tienes cambios locales que bloquean la actualización, muestra un error.
- **`ws`**: Salta entre tus espacios de trabajo.

## 🛡️ Seguridad Ante Todo
Comandos como `gbd` (borrar rama) o `rdbreset` (resetear base de datos) siempre pedirán confirmación. ¡Úsalos sin miedo!

### 🤖 Agentes de IA y colisiones de comandos
- **Modo agente:** cuando la shell no es interactiva o existe una variable conocida de agente (como `CLAUDECODE`), `init.sh` solo agrega `scripts/` al `PATH` y se detiene. Los agentes de programación con IA nunca ven los alias, funciones ni hooks de bash-wizardry.
- **Protección contra colisiones:** cualquier comando que ocultaría un comando real, un builtin o una palabra reservada (por ejemplo `rs` frente a `/usr/bin/rs`, o `r` en Zsh) se omite al cargar. `bw-help` muestra los nombres omitidos.

Opciones en `config.env`:
- `BW_AGENT_MODE=auto` (`auto` detecta agentes, `1` siempre modo agente, `0` siempre carga completa)
- `BW_ALLOW_OVERRIDE="rs"` (comandos separados por espacios que pueden ocultar comandos existentes)

---
[Volver al README](../../README.md)
