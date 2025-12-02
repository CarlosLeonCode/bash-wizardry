# 🧙‍♂️ bash-wizardry

### Tu terminal, con superpoderes.

`bash-wizardry` no es solo una colección de alias. Es un framework de productividad para tu línea de comandos que aprende tus flujos de trabajo, te protege de errores y unifica las herramientas que usas a diario.

## 🤔 ¿Por qué `bash-wizardry`?

*   🧠 **Inteligente y Contextual:** Comandos como `nr` te dan un menú interactivo de tus scripts, y `ni` sabe si tu proyecto usa `npm`, `yarn` o `pnpm`.
*   🛡️ **Seguro por Defecto:** Operaciones destructivas como `git branch -D`, `git reset` o la limpieza de Docker ahora piden confirmación. Di adiós al "¡Uy!".
*   🌐 **Unificado y Simple:** Usa el mismo comando (`na`, `nr`, `n-clean`) en todos tus proyectos de Node.js. Memoriza un set de herramientas, no tres.
*   🚀 **Hecho para la Velocidad:** Flujos de trabajo completos, como sincronizar una rama (`gup`) o resetear una base de datos de Rails (`rdbreset`), se reducen a un solo comando.

## 🚀 Instalación Rápida

Pega esto en tu terminal. La magia se encargará del resto.

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/CarlosLeonCode/bash-wizardry/main/install.sh)"
```
> Después, **reinicia tu terminal** o ejecuta `source ~/.bashrc` (o `~/.zshrc`).

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

## 🛠️ Scripts Independientes

Herramientas que puedes ejecutar desde cualquier lugar, como `docker-cleanup.sh`:

```sh
# Limpiar solo contenedores y volúmenes, sin pedir confirmación
docker-cleanup.sh --containers --volumes --force

# Limpiar todas las imágenes no usadas (no solo las "dangling")
docker-cleanup.sh --images --deep
```

## ⚙️ Configuración y Personalización

El script de instalación crea automáticamente tu archivo de configuración personal en `~/.bash-wizardry/config.sh`. Puedes editar este archivo en cualquier momento para habilitar o deshabilitar los módulos que necesites.

Por ejemplo, para desactivar el módulo de Django:
```bash
# Abre el archivo ~/.bash-wizardry/config.sh y cambia la línea:
WIZADRY_DJANGO_ENABLED="false"
```
Los cambios se aplicarán la próxima vez que abras una nueva terminal.

## 🤝 Contribuye

¿Tienes tu propia magia? ¡Compártela! Haz un Fork, añade tu hechizo y envía un Pull Request.

## 📜 Licencia

[MIT](https://github.com/CarlosLeonCode/bash-wizardry/blob/main/LICENSE)
