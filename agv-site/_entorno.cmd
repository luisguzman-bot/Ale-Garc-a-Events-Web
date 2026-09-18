@echo off
rem Comprueba que hay un Node.js utilizable (Vite 5 exige 18+). Lo llaman los demas .bat.
rem El .nvmrc de esta carpeta hace que nvm-windows cambie solo a Node 24 al entrar aqui.
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] No se encontro Node.js. Instala la version LTS desde https://nodejs.org
    echo         o, si usas nvm: nvm install 24 ^&^& nvm use 24
    exit /b 1
)

for /f "tokens=1 delims=." %%v in ('node -p "process.versions.node"') do set NODE_MAYOR=%%v
if %NODE_MAYOR% LSS 18 (
    for /f %%v in ('node -v') do set NODE_VER=%%v
    echo [ERROR] Node %NODE_VER% es demasiado viejo: este sitio necesita Node 18 o superior.
    echo         Con nvm: nvm install 24 ^&^& nvm use 24
    exit /b 1
)
exit /b 0
