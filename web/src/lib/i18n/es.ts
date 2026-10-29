import type { Dictionary } from "@/lib/i18n/types";
import {
  countFor,
  leader,
  SCRIPTS,
  SHELL_MODULES,
  SPELL_COUNT,
} from "@/lib/site";

const NEW_TAB = "(se abre en una pestaña nueva)";

export const es: Dictionary = {
  meta: {
    title: "Bash Wizardry | Hechizos inteligentes para la terminal",
    description:
      "Una colección curada de hechizos de shell para Bash y Zsh que entienden el contexto: Workspaces mágicos, Git, Node.js, Docker, Rails y Django. Shell puro, sin binarios, 100% bajo tu control.",
    keywords: [
      "bash",
      "zsh",
      "terminal",
      "cli",
      "alias de shell",
      "productividad",
      "herramientas para desarrolladores",
      "git",
      "docker",
      "node.js",
    ],
    appDescription:
      "Una colección curada de hechizos de shell para Bash y Zsh que entienden el contexto. Shell puro, sin binarios, 100% bajo tu control.",
  },

  common: {
    skipToContent: "Saltar al contenido",
    newTab: NEW_TAB,
    copy: {
      idle: "COPIAR",
      copied: "COPIADO",
      error: "FALLÓ",
      copiedMessage: "Copiado al portapapeles",
      errorMessage: "No se pudo copiar",
      title: "Copiar al portapapeles",
    },
  },

  topLinks: {
    label: "Enlaces del proyecto y del autor",
    project: "proyecto:",
    projectLinks: {
      github: "github: repositorio de bash-wizardry en GitHub",
      issues: "issues: incidencias de bash-wizardry en GitHub",
      web: "web: sitio de bash-wizardry, bashwizardry.com",
    },
    authorLinks: {
      github: "github: perfil de carlosleoncode en GitHub",
      youtube: "youtube: canal de carlosleoncode en YouTube",
      web: "web: sitio de carlosleoncode, carlosleoncode.com",
      kofi: "ko-fi: página de carlosleoncode en Ko-fi",
    },
  },

  nav: {
    primary: "Principal",
    mobile: "Móvil",
    home: "inicio de bash-wizardry",
    links: {
      agents: "agentes",
      tour: "recorrido",
      principles: "principios",
      spellbook: "grimorio",
      install: "instalar",
    },
    menu: "menú",
    close: "cerrar",
    language: "Idioma",
    spells: "hechizos",
  },

  sidebar: {
    label: "Estructura de la instalación",
    summary: `${SPELL_COUNT} hechizos en ${SHELL_MODULES.length} módulos: ${SHELL_MODULES.map(
      (m) => `${m.module} ${m.count}`,
    ).join(", ")}.`,
    userNote: "tuyo",
  },

  hero: {
    titleLines: ["tu terminal,", "superpoderes incluidos"],
    lead: [
      `${SPELL_COUNT} hechizos que entienden el contexto para git, node, docker, rails y django.`,
      "bash/zsh puro. sin binarios. sin daemons. invisible para los agentes de IA.",
    ],
    copyInstall: "Copiar el comando de instalación",
    viewSource: "ver el código",
    panesLabel:
      "Dos paneles de terminal. En tu shell interactiva, 'exec zsh' carga todos los módulos de bash-wizardry " +
      "y un módulo de usuario, y omite 'rs' porque ocultaría /usr/bin/rs. " +
      "En la shell de un agente de IA no hay ningún alias definido, 'type gup' no encuentra nada " +
      `y 'bwiz help --json git' lista los ${countFor("git")} hechizos de git bajo demanda.`,
    paneYou: "panel 0: tú",
    paneAgent: "panel 1: agente",
    bootLog: [
      { status: "init", text: "bash-wizardry init" },
      ...SHELL_MODULES.map(({ module, count }) => ({
        status: "ok" as const,
        text: `${leader(`módulo ${module}`)} ${String(count).padStart(2)} hechizos`,
      })),
      { status: "ok", text: `${leader("módulo usuario my-team")} cargado` },
      { status: "skip", text: "rs → ocultaría /usr/bin/rs" },
      { status: "ready", text: "hechizos listos · prueba bw-help" },
    ],
    agentComments: {
      type: "modo sigilo: sin aliases, sin hooks",
      discover: "los agentes descubren hechizos bajo demanda",
    },
  },

  agents: {
    title: "Hecho para humanos. Invisible para los agentes.",
    lead: "Cuando Claude Code, Codex, Cursor o Gemini CLI ejecutan comandos en tu shell, bash-wizardry se hace a un lado: sin alias, sin funciones, sin sorpresas.",
    detection: {
      title: "Quién activa el modo sigilo",
      caption:
        "Agentes de IA para programar, las variables de entorno que ponen su shell en modo agente y el resultado",
      columns: { agent: "AGENTE", signal: "DETECTADO POR", result: "RESULTADO" },
      other: "cualquier otro agente",
      or: "o",
      notes: { codex: "una shell no interactiva" },
      result: "sigilo",
      footnote:
        "Es una heurística, no una integración oficial: los nombres de las variables pueden cambiar entre herramientas y versiones. Con `auto`, cualquier shell no interactiva también cuenta como agente.",
    },
    shell: {
      title: "Lo que recibe la shell del agente",
      off: "No se carga:",
      on: "Disponible:",
      items: {
        aliases: "alias",
        functions: "funciones",
        hooks: "hooks: `.bw-on-enter`, sugerencias de descubrimiento",
        completions: "autocompletado",
        scripts: `\`scripts/\` en el PATH: ${SCRIPTS.map((s) => `\`${s}\``).join(", ")}`,
        json: "`bwiz help --json [module]`: el catálogo de hechizos en JSON",
        flag: "`BW_AGENT_ACTIVE=1`, para que tus propios scripts lo sepan",
      },
    },
    config: {
      label: "Ajustes de agentes en config.env",
      modeComment: [
        "auto (por defecto) | 1 = siempre | 0 = nunca.",
        "Déjala comentada para que el entorno del agente pueda definirla.",
      ],
      varsComment: [
        "Definir la lista reemplaza la de por defecto:",
        "consérvala y añade la variable de tu agente.",
      ],
    },
    faq: {
      title: "Preguntas frecuentes",
      items: {
        break: {
          question: "¿Romperá los comandos de mi agente?",
          answer:
            "No. En modo agente bash-wizardry no define nada, así que cada comando que ejecuta el agente hace lo que este espera. Incluso en tu propia shell, un hechizo que ocultaría un ejecutable real, un builtin o una palabra reservada se omite, salvo que lo permitas en `BW_ALLOW_OVERRIDE`.",
        },
        spells: {
          question: "¿Puede mi agente seguir usando los hechizos?",
          answer:
            "Puede consultarlos. `bwiz` sigue en el PATH y `bwiz help --json [module]` devuelve de cada hechizo su módulo, nombre, tipo, uso, descripción y si su módulo está activado. Los alias y las funciones en sí no se cargan.",
        },
        detect: {
          question: "¿Mi agente no se detecta?",
          answer:
            "Exporta `BW_AGENT_MODE=1` en el entorno del agente o añade a `BW_AGENT_ENV_VARS` la variable que define. Para comprobarlo, ejecuta `echo $BW_AGENT_ACTIVE` desde el agente: `1` significa sigilo.",
        },
      },
    },
  },

  showcase: {
    title: "Mira los hechizos en acción",
    lead: "Cada sesión reproduce los mensajes que los scripts imprimen de verdad. Sin funciones de mentira, sin binarios ocultos.",
    commandsLabel: "Comandos",
    pane: "panel",
    items: {
      workspaces: {
        eyebrow: "Workspaces mágicos",
        title: "Salta a cualquier proyecto. Ejecuta solo los hooks en los que confías.",
        description:
          "`ws` busca en cada directorio de BW_WORKSPACE_ROOTS: primero la coincidencia exacta, después la aproximada, o un selector fzf si no escribes nada. Los proyectos pueden incluir un hook `.bw-on-enter` que prepara su entorno al llegar.",
        points: [
          "Los hooks nunca se ejecutan hasta que los revisas y apruebas con ws-trust.",
          "La aprobación queda ligada al sha256 del archivo: cualquier cambio exige aprobarlo de nuevo.",
        ],
        sessionLabel:
          "Demo de terminal: 'ws api' entra en el workspace api y avisa de que su hook .bw-on-enter no es de confianza. 'ws-trust' muestra el hook, pide confirmación y lo aprueba. El siguiente 'ws api' ejecuta el hook aprobado.",
      },
      discovery: {
        eyebrow: "Descubrimiento contextual",
        title: "El mago entiende dónde está.",
        description:
          "Cada vez que cambias de directorio en Zsh (y después de cada salto con `ws`), bash-wizardry busca package.json, archivos de Docker, manage.py y un Gemfile de Rails, y muestra los hechizos que encajan con ese proyecto.",
        points: [
          "Node → nr, Docker → dckrexec, Django → djshell, Rails → rcs.",
          "Guarda silencio en tu directorio personal y en los proyectos que no reconoce.",
        ],
        sessionLabel:
          "Demo de terminal: al entrar en el directorio de un proyecto aparecen los Wizard Tips, que sugieren 'nr' para los scripts de Node.js, 'dckrexec' para los contenedores de Docker y 'rcs' para la consola de Rails.",
      },
      env: {
        eyebrow: "Selector de .env",
        title: "Cambia de archivo .env sin perder tus ediciones.",
        description:
          "`env-ls` lista cada archivo .env.<name> y marca el activo. `env-set` pone uno en su lugar (o abre un selector fzf) y respalda un .env editado a mano antes de sobrescribirlo.",
        points: [
          "Los .env personalizados se guardan como .env.backup.<timestamp>.",
          "Funciona en cualquier proyecto: Node, Rails, Django, Docker Compose.",
        ],
        sessionLabel:
          "Demo de terminal: 'env-ls' lista los archivos de entorno local, production y staging. 'env-set production' respalda el .env personalizado en un archivo con marca de tiempo y activa el entorno production.",
      },
      node: {
        eyebrow: "Node.js",
        title: "Los mismos comandos para npm, yarn y pnpm.",
        description:
          "bash-wizardry lee el lockfile (pnpm > yarn > npm) y ejecuta el gestor de paquetes correcto por ti. `nr` sin argumentos abre un menú con los scripts de tu package.json.",
        points: [
          "ni, na, nad, nrm y nup se comportan igual en todos los proyectos.",
          "n-reinstall borra node_modules y los lockfiles (tras confirmar) y vuelve a instalar.",
        ],
        sessionLabel:
          "Demo de terminal: 'nr' muestra un menú numerado con los scripts de package.json (build, dev, lint); al elegir dev, lo ejecuta con pnpm.",
      },
      git: {
        eyebrow: "Git",
        title: "Git rápido, con barandillas.",
        description:
          "`gup` hace pull con rebase y push de una sola vez. `gclean` borra las ramas ya fusionadas en la rama por defecto de origin, pero nunca la rama por defecto, tu rama actual ni nada de BW_GIT_PROTECTED_BRANCHES, y siempre pregunta antes.",
        points: [
          "greset y gbd piden confirmación antes de descartar nada.",
          "gundo es un soft reset: el commit desaparece, tus cambios se quedan.",
        ],
        sessionLabel:
          "Demo de terminal: 'gclean' hace fetch de origin, lista dos ramas fusionadas en origin/main, pide confirmación y las borra.",
      },
    },
  },

  principles: {
    title: "Potente, pero nunca imprudente",
    lead: "bash-wizardry es un conjunto de funciones de shell sencillas que puedes leer en una tarde. Te hace más rápido sin quitarte el control.",
    userCommands: "Comandos de usuario",
    options: "OPCIONES",
    license: "Licencia MIT",
    items: {
      "--agent-safe": {
        title: "Seguro con agentes por defecto",
        description:
          "Invisible para los agentes de IA que programan: en shells no interactivas o de agentes solo scripts/ se suma a tu PATH. Y ningún hechizo oculta jamás un comando real, un builtin o una palabra reservada.",
      },
      "--trusted-hooks": {
        title: "Solo hooks de confianza",
        description:
          "Un hook .bw-on-enter solo se ejecuta después de que lo apruebes con ws-trust. Las aprobaciones quedan ligadas al sha256 del archivo, así que cualquier cambio requiere una nueva revisión.",
      },
      "--forkable": {
        title: "Tuyo para ampliarlo",
        description:
          "Añade tus propios módulos en ~/.config/bash-wizardry/modules. Un archivo con el nombre de un módulo base lo reemplaza, y bw-update nunca toca tus archivos.",
      },
      "--confirm": {
        title: "La seguridad primero",
        description:
          "Los hechizos destructivos como greset, gbd, gclean, rdbreset, djflushmigrations y dckrprune piden confirmación, tanto en Bash como en Zsh.",
      },
      "--interactive": {
        title: "Docker interactivo",
        description:
          "Elige un contenedor desde un menú para exec, logs, stop, start, restart o rm. dckrclean pregunta antes de podar cada tipo de recurso.",
      },
      "--lockfile-aware": {
        title: "Node sin importar el gestor",
        description:
          "El lockfile decide: pnpm, yarn o npm. Tus dedos solo necesitan ni, na, nr y compañía.",
      },
      "--modular": {
        title: "Modular por diseño",
        description:
          "Activa o desactiva cualquier módulo con BW_ENABLE_<MODULE>=true|false en config.env. bw-update avanza con fast-forward y recarga en el momento.",
      },
      "--pure-shell": {
        title: "Shell puro",
        description:
          "Scripts de Bash y Zsh legibles. Sin binarios, sin daemons, nada ejecutándose en segundo plano.",
      },
    },
  },

  spellbook: {
    title: "Todos los hechizos, de un vistazo",
    lead: `Los ${SPELL_COUNT} hechizos por módulo, directamente del catálogo. Los marcados con \`[confirm]\` preguntan antes de hacer algo destructivo.`,
    tablist: "Módulos",
    caption:
      "Hechizos de {module}: nombre, uso, descripción y si preguntan antes de actuar",
    columns: {
      name: "NOMBRE",
      usage: "USO",
      description: "DESCRIPCIÓN",
      safety: "SEGURIDAD",
    },
    none: "ninguna",
    summaries: {
      git: "Git de todos los días, más corto, con confirmación en todo lo destructivo.",
      node: "Detecta pnpm > yarn > npm a partir del lockfile.",
      docker:
        "Selector interactivo de contenedores siempre que omites el ID del contenedor.",
      rails:
        "Atajos de Rails y utilidades de Ruby que funcionan con asdf, rbenv o rvm.",
      django: "manage.py sin tanto teclear.",
      workspaces: "Navegación, archivos de entorno y los comandos base.",
    },
  },

  install: {
    title: "Empieza a lanzar hechizos en menos de un minuto",
    lead: "Un instalador y una recarga. Funciona en macOS, Linux y WSL, con Bash y Zsh.",
    steps: {
      run: "Ejecuta el instalador",
      reload: "Recarga tu shell",
      customize: "Hazlo tuyo",
    },
    copyInstall: "Copiar el comando de instalación",
    copyReload: "Copiar el comando de recarga",
    reloadComment: "# o: source ~/.bashrc",
    note: "Ejecuta `bw-help` para listar los módulos, desactiva cualquiera de ellos en `config.env` y mantente al día con `bw-update`. Tu configuración y tus módulos viven en `~/.config/bash-wizardry`, así que las actualizaciones nunca los tocan.",
    configLabel: "Ejemplo de config.env",
  },

  community: {
    title: "Hecho por developers, para developers",
    cards: {
      contribute: {
        title: "Contribuye",
        description:
          "Nuevos hechizos, correcciones y documentación son bienvenidos. Empieza por la guía.",
        cta: "leer la guía",
      },
      issue: {
        title: "Reporta un problema",
        description:
          "¿Encontraste un bug o algo mejorable? Abre un issue en GitHub.",
        cta: "abrir un issue",
      },
      star: {
        title: "Dale una estrella",
        description:
          "Las estrellas ayudan a que otros developers descubran el proyecto.",
        cta: "dar estrella en github",
      },
    },
  },

  footer: {
    label: "Pie de página",
    tagline:
      "El kit de productividad para developers que vive en tu terminal. Seguro, rápido y hackeable.",
    columns: {
      product: "producto",
      project: "proyecto",
      community: "comunidad",
    },
    links: {
      tour: "recorrido",
      spellbook: "grimorio",
      install: "instalar",
      source: "código fuente",
      releases: "versiones",
      license: "licencia MIT",
      contributing: "cómo contribuir",
      issues: "issues",
      youtube: "youtube",
      kofi: "ko-fi",
    },
    license: "Licencia MIT",
    builtBy: "Diseñado y construido por",
    spells: "hechizos",
  },
};
