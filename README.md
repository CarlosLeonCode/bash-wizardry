# 🧙‍♂️ bash-wizardry
<p align="center">
<img width="250" height="250" alt="Untitled design" src="https://github.com/user-attachments/assets/0ecc72f6-e94f-45f5-a0cf-a47ee32297b1" />

</p>

### Tu terminal, con superpoderes. Simple, seguro y bajo tu control.

Una suite de herramientas para la línea de comandos diseñada para ser **simple, segura y estar bajo tu control**. `bash-wizardry` transforma comandos largos y flujos de trabajo repetitivos en hechizos cortos e inteligentes, sin modificar nunca tu sistema de forma automática.

## ✨ Filosofía y Características

*   🧠 **Inteligente y Contextual:** Comandos como `nr` te dan un menú interactivo de tus scripts, y `ni` sabe si tu proyecto usa `npm`, `yarn` o `pnpm`.
*   🛡️ **Seguro por Defecto:** Operaciones destructivas como `git branch -D` o `git reset` ahora piden confirmación, protegiéndote de errores.
*   🌐 **Unificado y Simple:** Usa el mismo comando (`na`, `nr`, `n-clean`) en todos tus proyectos de Node.js.
*   🚫 **Sin Magia Negra: 100% Transparente:** No hay instaladores que modifican tus archivos de configuración sin que lo sepas. Tú tienes el control total sobre la instalación, que consiste en una sola línea en tu `.zshrc` o `.bashrc`.
*   🚀 **Hecho para la Velocidad:** Flujos de trabajo completos, como sincronizar una rama (`gup`) o resetear una base de datos de Rails (`rdbreset`), se reducen a un solo comando.

## 🚀 Instalación Manual (El Método Seguro y Recomendado)

La instalación es un proceso manual de dos pasos que te da control total y tarda menos de 30 segundos.

**Paso 1: Clona el Repositorio**

Elige un lugar permanente para el código. `~/.bash-wizardry` es una buena convención.
```sh
git clone https://github.com/CarlosLeonCode/bash-wizardry.git ~/.bash-wizardry
```

**Paso 2: Conecta tu Shell**

Abre tu archivo de configuración (`~/.zshrc` para Zsh o `~/.bashrc` para Bash) y añade la siguiente línea **al final del archivo**:

```bash
# ~/.zshrc o ~/.bashrc

# ... (otro contenido de tu configuración) ...

# Cargar bash-wizardry
source ~/.bash-wizardry/init.sh
```
Después, **reinicia tu terminal** y todos los comandos estarán disponibles.

---

## ✨ Un Vistazo a la Magia

Haz clic en cada módulo para descubrir algunos de sus hechizos más poderosos.

<details>
<summary><b>🐙 Módulo de Git</b></summary>

| Comando | Descripción |
| :--- | :--- |
| `gup` | **Sincroniza tu rama:** hace `pull --rebase` y luego `push`. Indispensable. |
| `gclean` | Limpia tu repositorio local eliminando ramas que ya han sido fusionadas. |
| `gundo` | Deshace el último commit, pero mantiene todos los cambios en tus archivos. |
| `gbd <branch>` | Borra una rama local, **pidiendo confirmación**. |
| `gco` + `Tab` | Autocompleta con nombres de ramas locales **y remotas**. |

</details>

<details>
<summary><b>📦 Módulo de Node.js (npm/yarn/pnpm)</b></summary>

El sistema detecta automáticamente qué gestor usar. ¡Los mismos comandos para todos tus proyectos!

| Comando | Descripción |
| :--- | :--- |
| `ni` | Instala dependencias (`npm i`, `yarn`, o `pnpm i`). |
| `na <pkg>` | Añade una nueva dependencia. |
| `nr` | **Muestra un menú interactivo** para que elijas qué script ejecutar. |
| `n-reinstall` | Soluciona el 99% de los problemas de dependencias (`rm -rf node_modules` y reinstala). |
| `p i` | Usa `p`, `y`, o `n` para forzar el uso de un gestor de paquetes específico. |

</details>

<details>
<summary><b>🐳 Módulo de Docker</b></summary>

| Comando | Descripción |
| :--- | :--- |
| `dkrinto` | Entra a un contenedor. **Muestra un menú interactivo** si no especificas un ID. |
| `dkrlogs` | Muestra los logs de un contenedor. También es interactivo. |
| `dkrclean` | Inicia un **asistente seguro e interactivo** para limpiar todo (contenedores, imágenes, volúmenes). |
| `dkrip` | Muestra las direcciones IP de todos los contenedores en ejecución. |

</details>

<details>
<summary><b>🚂 Módulos de Backend (Django & Rails)</b></summary>

| Comando | Descripción |
| :--- | :--- |
| `djstartapp <app>`| (Django) Crea una app Y **la añade automáticamente a `INSTALLED_APPS`**. |
| `djshell` | (Django) Inicia `shell_plus` con auto-importación de modelos si está disponible. |
| `rdbreset` | (Rails) **Resetea toda la BD:** drop, create, migrate & seed (pide confirmación). |
| `rcs` | (Rails) Abre una consola en modo `sandbox` (los cambios no se guardan). |

</details>

---

## 🔄 Actualización

Cuando quieras actualizar `bash-wizardry` a la última versión, simplemente haz un `pull` en el repositorio:
```sh
cd ~/.bash-wizardry && git pull
```
Reinicia tu terminal para que los nuevos cambios se carguen.

## 🛠️ Desarrollo y Pruebas Locales

¿Quieres añadir tu propia magia o probar cambios de forma segura?

1.  Navega al directorio donde clonas tus proyectos para desarrollo (ej. `~/Dev/bash-wizardry`).
2.  Abre una terminal limpia en esa ubicación.
3.  Carga el sistema en tu sesión actual con el comando:
    ```sh
    source init.sh
    ```
4.  ¡Listo! Ahora puedes probar todos los alias y funciones. Cuando hagas un cambio en el código, simplemente vuelve a ejecutar `source init.sh` para recargar.

## 🤝 Contribuye

¿Tienes tu propia magia? ¡Compártela! Haz un Fork, añade tu hechizo y envía un Pull Request.

## 📜 Licencia

[MIT](https://github.com/CarlosLeonCode/bash-wizardry/blob/main/LICENSE)
