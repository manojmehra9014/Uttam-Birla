@echo off
cls
:start
echo
echo 1. For install dependencies and build application
echo 2. For running / debugging
echo 3. For Release APK
echo 4. For BETA Release
set /p choice=Enter your choice and press enter.

if not '%choice%'=='1' if not '%choice%'=='2' if not '%choice%'=='3' if not '%choice%'=='4' ECHO "%choice%" is not valid please try again
if '%choice%'=='1' goto install
if '%choice%'=='2' goto dubugging
if '%choice%'=='3' goto release
if '%choice%'=='4' goto betaRelease

ECHO.
goto start
:install
call cls
call yarn install
xcopy node_module_changes0.73\*.* node_modules\ /s /y
goto dubugging
:dubugging
call cd android 
call gradlew clean
call cd..
call react-native run-android
goto end
:release
cd android
call gradlew clean
call gradlew :app:assembleRelease
goto end
:betaRelease
cd android
call gradlew clean
call gradlew :app:bundleRelease

