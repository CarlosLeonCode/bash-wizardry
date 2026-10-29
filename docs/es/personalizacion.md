# 🎛️ Personalización

Adapta bash-wizardry sin hacer un fork. Tu configuración y tus propios hechizos viven fuera del repositorio, así que `bw-update` nunca los modifica.

## 📁 Dónde viven tus archivos

| Ruta | Qué es |
| :--- | :--- |
| `~/.config/bash-wizardry/config.env` | Tu configuración. Se carga después del `config.env` del repositorio y tiene prioridad. |
| `~/.config/bash-wizardry/modules/*.sh` | Tus propios módulos. Se cargan después de los módulos principales. |

La carpeta es `$BW_CONFIG_HOME`, cuyo valor por defecto es `${XDG_CONFIG_HOME:-$HOME/.config}/bash-wizardry`. Define `BW_CONFIG_HOME` en tu entorno (o en el `config.env` del repositorio) para moverla, y `BW_USER_MODULES_DIR` para mover solo la carpeta de módulos.

Parte de la plantilla:

```bash
mkdir -p ~/.config/bash-wizardry/modules
cp ~/.bash-wizardry/config.env.example ~/.config/bash-wizardry/config.env
```

Todas las opciones funcionan ahí: `BW_ENABLE_<MODULO>`, `BW_WORKSPACE_ROOTS`, `BW_GIT_PROTECTED_BRANCHES`, `BW_ALLOW_OVERRIDE` e incluso `BW_AGENT_MODE` (la configuración se carga antes de detectar agentes).

## 🧩 Tus propios módulos

Un módulo es un archivo `.sh` en `~/.config/bash-wizardry/modules/`. El nombre del archivo es el nombre del módulo.

```bash
# ~/.config/bash-wizardry/modules/k8s.sh
# Hechizos personales para Kubernetes.

_k8s_context() {
    kubectl config current-context
}

kctx() {
    echo "Context: $(_k8s_context)"
}

kdel() {
    _bw_confirm "Delete pod '$1' in $(_k8s_context)?" && kubectl delete pod "$1"
}
```

Recomendaciones:

- **Actívalo o desactívalo** con `BW_ENABLE_<NOMBRE>=false`. El nombre es el del archivo en mayúsculas, con cualquier carácter que no sea letra, dígito o `_` convertido en `_`: `k8s.sh` → `BW_ENABLE_K8S`, `my-tools.sh` → `BW_ENABLE_MY_TOOLS`.
- **Confirma las acciones destructivas** con `_bw_confirm "¿Pregunta?"`. Funciona en Bash y Zsh y solo tiene éxito con `y`/`Y`.
- **Usa el prefijo `_<modulo>_`** en las funciones auxiliares (como `_k8s_context`) para que nunca choquen con otros módulos.
- **No imprimas nada al cargar.** Los módulos se cargan en cada shell nueva; cualquier salida ahí ralentiza el arranque y rompe herramientas que leen la salida de la shell.
- **Tu código, tu decisión:** la protección contra colisiones solo revisa los módulos principales. Un módulo de usuario puede definir un nombre que oculte un comando real (por ejemplo `kubectl`) y se mantiene.
- **El modo agente lo omite todo:** cuando un agente de IA usa la shell, tampoco se carga ningún módulo de usuario.

`bw-help` muestra los módulos de usuario cargados. `bwiz modules` lista todos los módulos, su origen (`core` o `user`) y si están activos.

## 🔁 Reemplazar un módulo principal

Un módulo de usuario con el mismo nombre de archivo que un módulo principal lo reemplaza. Por ejemplo, con `~/.config/bash-wizardry/modules/git.sh` no se carga el `modules/git.sh` principal (ni sus autocompletados); solo tu versión. `bwiz help` marca los hechizos principales de un módulo reemplazado.

Si solo quieres ajustar algunos hechizos, copia el archivo principal como punto de partida:

```bash
cp ~/.bash-wizardry/modules/git.sh ~/.config/bash-wizardry/modules/git.sh
```

A partir de ese momento, las actualizaciones del `git.sh` principal ya no te llegan, así que conviene que la copia sea pequeña.

## 🧙 Añadir un comando al núcleo

Los hechizos para todos se añaden en `modules/` mediante un pull request. Cada alias o función pública necesita una fila en `catalog/commands.tsv`, la única fuente de verdad que alimenta `bw-help`, `bwiz help --json` y el sitio web:

```text
module	name	kind	usage	description
git	gclean	function		Delete local branches merged into ... Asks first.
```

- Separado por tabuladores, cinco columnas. `kind` es `alias`, `function` o `script`. `usage` puede quedar vacío (se usa el nombre).
- Sin comillas dobles ni barras invertidas en la descripción, que se escribe en inglés. Termínala con `Asks first.` si el comando pide confirmación antes de actuar.
- Añade la descripción en español para el sitio web en `catalog/commands.es.tsv` (`name`, `description`), en el mismo orden y sin `Asks first.`. El generador falla si falta una fila.
- Ejecuta `bash tools/gen-catalog.sh` para actualizar la copia del sitio web y después `bats tests/`. Las pruebas fallan si el catálogo y los módulos no coinciden.

Consulta [CONTRIBUTING.md](../../CONTRIBUTING.md) para ver el flujo completo.

---
[Volver al Índice de Documentación](README.md)
