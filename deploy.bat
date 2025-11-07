@echo off
REM Docker Hub 배포 스크립트 (Windows)
REM 사용법: deploy.bat YOUR_DOCKERHUB_USERNAME

setlocal enabledelayedexpansion

if "%~1"=="" (
    echo ❌ 오류: Docker Hub 사용자명을 입력해주세요!
    echo 사용법: deploy.bat YOUR_DOCKERHUB_USERNAME
    exit /b 1
)

set DOCKERHUB_USERNAME=%~1
set IMAGE_NAME=marketingpage
set IMAGE_TAG=latest
set FULL_IMAGE_NAME=%DOCKERHUB_USERNAME%/%IMAGE_NAME%:%IMAGE_TAG%

echo 🚀 Docker Hub 배포 시작
echo ================================
echo Docker Hub 사용자명: %DOCKERHUB_USERNAME%
echo 이미지 이름: %FULL_IMAGE_NAME%
echo ================================
echo.

echo 📋 Docker Hub 로그인 확인 중...
docker info | findstr /C:"Username" >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Docker Hub에 로그인되지 않았습니다.
    echo 로그인 중...
    docker login
)

echo.
echo 🔨 Docker 이미지 빌드 중...
docker build -t %FULL_IMAGE_NAME% .

if errorlevel 1 (
    echo ❌ 이미지 빌드 실패!
    exit /b 1
)

echo ✅ 이미지 빌드 완료!
echo.
echo 📤 Docker Hub에 업로드 중...
docker push %FULL_IMAGE_NAME%

if errorlevel 1 (
    echo ❌ 업로드 실패!
    exit /b 1
)

echo.
echo ✅ 배포 완료!
echo ================================
echo 이미지: %FULL_IMAGE_NAME%
echo Docker Hub에서 확인: https://hub.docker.com/r/%DOCKERHUB_USERNAME%/%IMAGE_NAME%
echo.
echo 서버에서 실행하려면:
echo   cd ~/marketingpage
echo   docker-compose pull
echo   docker-compose up -d
echo ================================

