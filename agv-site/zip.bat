@echo off
rem Empaqueta el CONTENIDO de dist\ en un ZIP listo para "Subir paquete" en Pixoft > Sitios Web.
rem index.html queda en la raiz del ZIP, que es lo que Pixoft espera.
setlocal
cd /d "%~dp0"
set ZIP=%~dp0ale-garcia-events-sitio.zip

if not exist dist\index.html (
    echo [ERROR] No existe dist\index.html. Corre build.bat primero ^(o publicar.bat^).
    exit /b 1
)
if exist "%ZIP%" del /q "%ZIP%"

echo == Generando %ZIP% ==
rem tar.exe de Windows (bsdtar) escribe ZIP estandar. Se llama por ruta completa porque Git
rem pone su propio tar (GNU, sin soporte de ZIP) antes en el PATH.
if exist "%SystemRoot%\System32\tar.exe" (
    pushd dist
    "%SystemRoot%\System32\tar.exe" -a -cf "%ZIP%" *
    popd
) else (
    powershell -NoProfile -Command "Compress-Archive -Path 'dist\*' -DestinationPath '%ZIP%' -Force"
)
if errorlevel 1 (
    echo [ERROR] No se pudo generar el ZIP.
    exit /b 1
)

for %%A in ("%ZIP%") do set /a MB=%%~zA/1048576
echo.
echo ZIP listo ^(%MB% MB^): %ZIP%
echo Subelo en Pixoft: Sitios Web ^> Subir paquete ^(ZIP^) ^> Subir y publicar.
endlocal

if "%~1" neq "nopausa" pause
exit /b 0
