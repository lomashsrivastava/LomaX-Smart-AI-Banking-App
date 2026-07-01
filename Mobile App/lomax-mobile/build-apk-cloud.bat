@echo off
echo ===================================================
echo LomaX Android APK Cloud Build (Expo EAS)
echo ===================================================
echo.
echo This script will help you build a production-ready Android APK 
echo in the cloud using Expo Application Services (EAS).
echo.
echo Prerequisites:
echo 1. You need an Expo developer account (register at expo.dev)
echo 2. You will be prompted to log in to your account.
echo.
echo Press any key to start the process...
pause > null

echo.
echo Step 1: Checking for EAS CLI installation...
call eas --version >nul 2>&1
if %errorlevel% neq 0 (
    echo EAS CLI is not installed. Installing it globally now...
    npm install -g eas-cli
) else (
    echo EAS CLI is already installed.
)

echo.
echo Step 2: Logging in to Expo account...
echo Please enter your Expo credentials when prompted below.
call eas login

echo.
echo Step 3: Configuring EAS project...
echo This will link your project with your Expo account.
call eas build:configure --platform android

echo.
echo Step 4: Starting Android APK Build (Preview Profile)...
echo EAS will compile your app in the cloud.
echo When completed, you will receive a direct download link for the APK.
echo.
call eas build --platform android --profile preview

echo.
echo ===================================================
echo Cloud Build process completed!
echo If successful, download the APK from the link above, 
echo rename it to 'lomax-mobile.apk', and place it in the
echo 'frontend/public/' directory.
echo ===================================================
pause
