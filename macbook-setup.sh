#!/bin/bash

# 맥북 전용 Docker Hub 이미지 실행 스크립트
# 사용법: ./macbook-setup.sh

set -e

echo "🍎 맥북 Docker Hub 이미지 실행 스크립트"
echo "=========================================="
echo ""

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Docker 설치 확인
echo "1️⃣ Docker 설치 확인 중..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker가 설치되어 있지 않습니다.${NC}"
    echo "Docker Desktop을 설치해주세요: https://www.docker.com/products/docker-desktop"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ docker-compose가 설치되어 있지 않습니다.${NC}"
    echo "Docker Desktop에 포함되어 있습니다."
    exit 1
fi

echo -e "${GREEN}✅ Docker 설치 확인 완료${NC}"
docker --version
docker-compose --version
echo ""

# 2. 포트 확인
echo "2️⃣ 포트 확인 중..."
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  8080 포트가 이미 사용 중입니다.${NC}"
    echo "다른 포트를 사용하시겠습니까? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "사용할 포트 번호를 입력하세요 (예: 5000):"
        read -r PORT
        export APP_PORT=${PORT:-5000}
    else
        echo "기존 프로세스를 종료하고 계속하시겠습니까? (y/n)"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            echo "8080 포트를 사용하는 프로세스를 종료합니다..."
            lsof -ti:8080 | xargs kill -9 2>/dev/null || true
            export APP_PORT=8080
        else
            echo "스크립트를 종료합니다."
            exit 1
        fi
    fi
else
    echo -e "${GREEN}✅ 8080 포트 사용 가능${NC}"
    export APP_PORT=8080
fi
echo ""

# 3. 프로젝트 디렉토리 확인
echo "3️⃣ 프로젝트 디렉토리 확인 중..."
if [ ! -f "docker-compose.prod.yml" ]; then
    echo -e "${RED}❌ docker-compose.prod.yml 파일을 찾을 수 없습니다.${NC}"
    echo "프로젝트 루트 디렉토리에서 실행해주세요."
    exit 1
fi
echo -e "${GREEN}✅ 프로젝트 디렉토리 확인 완료${NC}"
echo ""

# 4. 포트가 다르면 docker-compose.prod.yml 수정
if [ "$APP_PORT" != "8080" ]; then
    echo "4️⃣ 포트 설정 변경 중..."
    # 임시 파일 생성
    sed "s/8080:8080/${APP_PORT}:8080/g" docker-compose.prod.yml > docker-compose.prod.macbook.yml
    COMPOSE_FILE="docker-compose.prod.macbook.yml"
    echo -e "${GREEN}✅ 포트를 ${APP_PORT}로 변경했습니다.${NC}"
else
    COMPOSE_FILE="docker-compose.prod.yml"
fi
echo ""

# 5. Docker Hub에서 이미지 가져오기
echo "5️⃣ Docker Hub에서 이미지 가져오기..."
docker-compose -f "$COMPOSE_FILE" pull
echo -e "${GREEN}✅ 이미지 다운로드 완료${NC}"
echo ""

# 6. 컨테이너 실행
echo "6️⃣ 컨테이너 실행 중..."
docker-compose -f "$COMPOSE_FILE" up -d
echo -e "${GREEN}✅ 컨테이너 실행 완료${NC}"
echo ""

# 7. 컨테이너 상태 확인
echo "7️⃣ 컨테이너 상태 확인 중..."
sleep 3
docker-compose -f "$COMPOSE_FILE" ps
echo ""

# 8. 로그 확인 (선택사항)
echo "로그를 확인하시겠습니까? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo ""
    echo "📋 최근 로그 (Ctrl+C로 종료):"
    docker-compose -f "$COMPOSE_FILE" logs -f app
else
    echo ""
    echo -e "${GREEN}🎉 설정 완료!${NC}"
    echo ""
    echo "=========================================="
    echo "접속 주소: http://localhost:${APP_PORT}"
    echo "=========================================="
    echo ""
    echo "유용한 명령어:"
    echo "  - 로그 확인: docker-compose -f $COMPOSE_FILE logs -f app"
    echo "  - 컨테이너 중지: docker-compose -f $COMPOSE_FILE stop"
    echo "  - 컨테이너 시작: docker-compose -f $COMPOSE_FILE start"
    echo "  - 컨테이너 재시작: docker-compose -f $COMPOSE_FILE restart"
    echo "  - 컨테이너 제거: docker-compose -f $COMPOSE_FILE down"
fi

