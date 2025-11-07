#!/bin/bash
# SSH 서버에서 PostgreSQL에 빠르게 접속하는 스크립트

# 프로젝트 디렉토리로 이동
cd ~/marketingPage 2>/dev/null || cd ~/marketingpage 2>/dev/null || echo "프로젝트 디렉토리를 찾을 수 없습니다."

# PostgreSQL 컨테이너에 접속
docker-compose -f docker-compose.prod.yml exec postgres psql -U choiyj981 -d marketingpage


