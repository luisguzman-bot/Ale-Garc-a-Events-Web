@echo off
rem Instala las dependencias del sitio (una vez por maquina, o cuando cambie package.json).
call "%~dp0_entorno.cmd" || goto :fin

echo == Instalando dependencias ==
if exist package-lock.json (
    call npm ci --no-audit --no-fund
) else (
    call npm install --no-audit --no-fund
)
if errorlevel 1 (
    echo [ERROR] Fallo la instalacion. Revisa la conexion a internet y vuelve a intentar.
    goto :fin
)
echo.
echo Listo. Ahora puedes correr dev.bat ^(desarrollo^) o publicar.bat ^(build + ZIP para Pixoft^).

:fin
if "%~1" neq "nopausa" pause
exit /b %errorlevel%
