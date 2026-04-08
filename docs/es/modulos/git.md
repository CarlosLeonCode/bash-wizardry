# 🐙 Módulo Git

El módulo Git en `bash-wizardry` está diseñado para hacer que el control de versiones sea más seguro y rápido mediante funciones inteligentes en lugar de simples alias.

## 🚀 Comandos Clave

### `gup` (Sincronizar Rama)
El comando de sincronización definitivo.
- **Qué hace:** Ejecuta `git pull --rebase` seguido de `git push`.
- **Por qué usarlo:** Mantiene un historial lineal y te ahorra escribir dos comandos cada vez que quieras subir tu trabajo.

### `gbd <nombre_rama>` (Borrado Seguro)
Borra una rama local con una red de seguridad.
- **Qué hace:** Pide confirmación antes de ejecutar `git branch -D`.
- **Por qué usarlo:** Evita el borrado accidental de ramas con trabajo no fusionado.

### `gundo` (Deshacer Suave)
Deshaz tu último error.
- **Qué hace:** Ejecuta `git reset --soft HEAD~1`.
- **Por qué usarlo:** Deshace el último commit pero **mantiene todos tus cambios** en el área de preparación (staging). Perfecto para corregir un error en el mensaje de commit o añadir un archivo olvidado.

### `greset` (Reset Hard)
La "opción nuclear" con confirmación.
- **Qué hace:** Pide confirmación antes de ejecutar `git reset --hard HEAD`.
- **Por qué usarlo:** Te protege de borrar accidentalmente todos tus cambios locales.

## 📊 Estado y Logs

- **`gs`**: Estado compacto de git (`git status -sb`).
- **`gl [N]`**: Un log gráfico y elegante. Muestra los últimos 15 commits por defecto.
- **`gdff`**: El comando estándar `git diff`.

## 📦 Staging y Commits

- **`ga [archivos]`**: Add inteligente. Si no especificas archivos, ejecuta `git add .`.
- **`gc "mensaje"`**: Commit inteligente. Si no das un mensaje, abre tu editor por defecto.
- **`gca`**: Enmienda (amend) el último commit.

---
[Volver a Herramientas](../herramientas.md)
