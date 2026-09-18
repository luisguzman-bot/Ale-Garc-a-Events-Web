@echo off
rem Levanta el sitio en modo desarrollo (recarga en caliente) en http://localhost:5173
call "%~dp0_entorno.cmd" || goto :fin
if not exist node_modules (
    echo Faltan las dependencias: corriendo instalar.bat primero...
    call "%~dp0instalar.bat" nopausa || goto :fin
)

echo == Sitio en desarrollo: http://localhost:5173  ^(Ctrl+C para detener^) ==
call npm run dev

:fin
if "%~1" neq "nopausa" pause
exit /b %errorlevel%
