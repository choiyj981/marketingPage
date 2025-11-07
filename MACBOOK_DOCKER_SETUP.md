# 맥북에서 Docker Hub 이미지 실행 가이드

## ✅ 맥북에서 실행 가능 여부

**네, 완전히 가능합니다!** Docker Hub 이미지는 플랫폼 독립적이므로 Windows, macOS, Linux 모두에서 동일하게 작동합니다.

## 🚀 맥북에서 실행 방법

### 1단계: Docker 설치 확인

```bash
# Docker 설치 확인
docker --version
docker-compose --version

# 없다면 설치
# macOS: Docker Desktop 다운로드 및 설치
# https://www.docker.com/products/docker-desktop
```

### 2단계: 프로젝트 클론

```bash
git clone https://github.com/choiyj981/marketingPage.git
cd marketingPage
```

### 3단계: docker-compose.prod.yml 수정 (선택사항)

맥북에서 실행할 때는 두 가지 옵션이 있습니다:

#### 옵션 1: 서버의 PostgreSQL 사용 (권장)

서버의 PostgreSQL을 사용하려면 `docker-compose.prod.yml`을 그대로 사용하면 됩니다:

```yaml
# docker-compose.prod.yml
services:
  app:
    image: docckerchoi/marketingpage:latest
    environment:
      DATABASE_URL: postgresql://choiyj981:981749@35.237.229.92:5432/marketingpage
      # 서버의 PostgreSQL 사용
```

**주의**: 서버의 PostgreSQL이 외부 접근을 허용해야 합니다.

#### 옵션 2: 로컬 PostgreSQL 사용

로컬에서 PostgreSQL을 실행하려면:

```yaml
# docker-compose.prod.yml
services:
  postgres:
    image: postgres:15-alpine
    # ... (기존 설정)
  
  app:
    image: docckerchoi/marketingpage:latest
    environment:
      DATABASE_URL: postgresql://choiyj981:981749@postgres:5432/marketingpage
      # 로컬 PostgreSQL 사용
```

### 4단계: Docker Hub에서 이미지 다운로드 및 실행

```bash
# Docker Hub에서 최신 이미지 가져오기
docker-compose -f docker-compose.prod.yml pull

# 컨테이너 실행
docker-compose -f docker-compose.prod.yml up -d

# 로그 확인
docker-compose -f docker-compose.prod.yml logs -f app
```

### 5단계: 접속 확인

브라우저에서 접속:
```
http://localhost:8080
```

## 📋 맥북 실행 시 주의사항

### 1. 포트 충돌 확인

```bash
# 8080 포트가 사용 중인지 확인
lsof -i :8080

# 사용 중이면 docker-compose.prod.yml에서 포트 변경
ports:
  - "5000:8080"  # 외부 포트를 5000으로 변경
```

### 2. 데이터베이스 연결

**서버 PostgreSQL 사용 시**:
- 서버의 PostgreSQL이 외부 접근을 허용해야 함
- 방화벽 설정 확인 필요
- IP: `35.237.229.92:5432`

**로컬 PostgreSQL 사용 시**:
- `docker-compose.prod.yml`에서 `postgres` 서비스 활성화
- 데이터는 로컬에 저장됨

### 3. 파일 업로드 경로

업로드된 파일은 다음 경로에 저장됩니다:
```
./public/uploads
```

맥북에서도 동일하게 작동합니다.

## 🔄 업데이트 방법

새 버전이 배포되면:

```bash
# 최신 이미지 가져오기
docker-compose -f docker-compose.prod.yml pull

# 컨테이너 재시작
docker-compose -f docker-compose.prod.yml up -d
```

## 🛠️ 유용한 명령어

```bash
# 컨테이너 상태 확인
docker-compose -f docker-compose.prod.yml ps

# 컨테이너 중지
docker-compose -f docker-compose.prod.yml stop

# 컨테이너 시작
docker-compose -f docker-compose.prod.yml start

# 컨테이너 재시작
docker-compose -f docker-compose.prod.yml restart

# 컨테이너 중지 및 제거
docker-compose -f docker-compose.prod.yml down

# 로그 확인
docker-compose -f docker-compose.prod.yml logs -f app
```

## ✅ 결론

**맥북에서도 완벽하게 작동합니다!**

- ✅ Docker Hub 이미지는 플랫폼 독립적
- ✅ Windows, macOS, Linux 모두 동일하게 작동
- ✅ 단순히 `docker-compose pull` 후 `up -d`만 하면 됨
- ✅ 데이터베이스만 연결 설정하면 바로 사용 가능

## 🎯 빠른 시작 (맥북)

```bash
# 1. 프로젝트 클론
git clone https://github.com/choiyj981/marketingPage.git
cd marketingPage

# 2. 이미지 다운로드 및 실행
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# 3. 접속
open http://localhost:8080
```

끝! 🎉

