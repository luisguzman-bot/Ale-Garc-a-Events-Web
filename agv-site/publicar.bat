@echo off
rem Todo en uno: compila el sitio y genera el ZIP listo para subir a Pixoft.
call "%~dp0build.bat" nopausa || goto :fin
call "%~dp0zip.bat" nopausa || goto :fin

:fin
if "%~1" neq "nopausa" pause
exit /b %errorlevel%
