# 🧙‍♂️ Bash Wizardry: Magia en tu Terminal ✨  
¡Potencia tu terminal con una colección de **aliases mágicos** para optimizar tu flujo de trabajo! 🚀  
Ahorra tiempo, automatiza comandos repetitivos y comparte tus mejores trucos con la comunidad.  

---

## 🎩 ¿Cómo usar?  
Ya sea que uses **Bash**, **Zsh** u otra shell, sigue estos pasos para activar la magia:  

### 1️⃣ Abre una terminal y navega al root:  
```sh
cd ~
```
### 2️⃣ Clona este libro de hechizos (repositorio):
```sh
# 🪄 Con SSH (más seguro si tienes configurada tu clave)
git clone git@github.com:CarlosLeonCode/bash-wizardry.git

# 🔓 Sin SSH (acceso universal)
git clone https://github.com/CarlosLeonCode/bash-wizardry.
```

### 3️⃣ Verifica que el libro se haya clonado correctamente:
```sh
ls -la | grep bash-wizardry

# Deberías ver algo como esto:
# drwxr-xr-x@  11 <tu_usuario> staff  352 Jan 30 14:34 bash-wizardry
```
### 4️⃣ Edita el archivo de configuración de tu shell
Dependiendo de la shell que uses, edita el archivo correspondiente:

- **Bash** → `~/.bashrc`
- **Zsh** → `~/.zshrc`
- **Fish** → `~/.config/fish/config.fish` (requiere adaptación)

Abre el archivo con tu editor favorito:
```sh
# ✏️ Con Nano
nano ~/.zshrc  # Si usas Bash, cambia a ~/.bashrc  

# 🖥️ Con VS Code
EDITOR="code --wait" ~/.zshrc
```

### 5️⃣ Agrega estas líneas al final del archivo:
Esto cargará automáticamente todos los aliases de la carpeta. 🔥
```sh
for file in ~/bash-wizardry/*.sh; do
  [ -r "$file" ] && source "$file"
done
```

### 6️⃣ Guarda los cambios y reinicia la terminal:
```sh
source ~/.zshrc  # ó source ~/.bashrc según tu shell
```

## 🎉 ¡Listo!
Ahora puedes usar tus alias sin esfuerzo. 

## 🏆¿Tienes un alias épico? 
¡Compártelo con la comunidad! 🚀
