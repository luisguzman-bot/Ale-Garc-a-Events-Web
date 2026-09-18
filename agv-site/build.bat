@echo off
rem Compila el sitio: deja la version lista para publicar en la carpeta dist\
call "%~dp0_entorno.cmd" || goto :fin
if not exist node_modules (
    echo Faltan las dependencias: corriendo instalar.bat primero...
    call "%~dp0instalar.bat" nopausa || goto :fin
)

echo == Compilando ^(vite build^) ==
call npm run build
if errorlevel 1 (
    echo [ERROR] El build fallo. Revisa los errores de arriba.
    goto :fin
)
if not exist dist\index.html (
    echo [ERROR] El build termino pero no existe dist\index.html
    exit /b 1
)
echo.
echo Build listo en: %~dp0dist
echo Para empaquetarlo para Pixoft corre zip.bat ^(o publicar.bat, que hace las dos cosas^).

:fin
if "%~1" neq "nopausa" pause
exit /b %errorlevel%
