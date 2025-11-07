#!/bin/bash

# Docker Hub 배포 스크립트
# 사용법: ./deploy.sh YOUR_DOCKERHUB_USERNAME

set -e

DOCKERHUB_USERNAME=${1:-YOUR_DOCKERHUB_USERNAME}
IMAGE_NAME="marketingpage"
IMAGE_TAG="latest"
FULL_IMAGE_NAME="${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}"

echo "🚀 Docker Hub 배포 시작"
echo "================================"
echo "Docker Hub 사용자명: ${DOCKERHUB_USERNAME}"
echo "이미지 이름: ${FULL_IMAGE_NAME}"
echo "================================"

# Docker Hub 사용자명 확인
if [ "$DOCKERHUB_USERNAME" == "YOUR_DOCKERHUB_USERNAME" ]; then
    echo "❌ 오류: Docker Hub 사용자명을 입력해주세요!"
    echo "사용법: ./deploy.sh YOUR_DOCKERHUB_USERNAME"
    exit 1
fi

# Docker 로그인 확인
echo ""
echo "📋 Docker Hub 로그인 확인 중..."
if ! docker info | grep -q "Username"; then
    echo "⚠️  Docker Hub에 로그인되지 않았습니다."
    echo "로그인 중..."
    docker login
fi

# 이미지 빌드
echo ""
echo "🔨 Docker 이미지 빌드 중..."
docker build -t "${FULL_IMAGE_NAME}" .

# 빌드 성공 확인
if [ $? -eq 0 ]; then
    echo "✅ 이미지 빌드 완료!"
else
    echo "❌ 이미지 빌드 실패!"
    exit 1
fi

# Docker Hub에 푸시
echo ""
echo "📤 Docker Hub에 업로드 중..."
docker push "${FULL_IMAGE_NAME}"

# 푸시 성공 확인
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 배포 완료!"
    echo "================================"
    echo "이미지: ${FULL_IMAGE_NAME}"
    echo "Docker Hub에서 확인: https://hub.docker.com/r/${DOCKERHUB_USERNAME}/${IMAGE_NAME}"
    echo ""
    echo "서버에서 실행하려면:"
    echo "  cd ~/marketingpage"
    echo "  docker-compose pull"
    echo "  docker-compose up -d"
    echo "================================"
else
    echo "❌ 업로드 실패!"
    exit 1
fi

