# 🍎 맥북 세팅 완료 가이드

## ✅ 완료된 작업

1. ✅ 스크립트 실행 권한 부여 완료
2. ✅ public/uploads 디렉토리 생성 완료
3. ✅ SESSION_SECRET 기본값 설정 완료
4. ✅ 포트 8080 사용 가능 확인 완료

## 📋 다음 단계: Docker Desktop 설치

### 1. Docker Desktop 설치

Docker Desktop이 설치되어 있지 않습니다. 다음 단계를 따라 설치해주세요:

1. **Docker Desktop 다운로드**
   - 브라우저에서 https://www.docker.com/products/docker-desktop 접속
   - "Download for Mac" 버튼 클릭
   - Apple Silicon (M1/M2/M3) 또는 Intel 맥북에 맞는 버전 선택

2. **설치**
   - 다운로드한 `.dmg` 파일 실행
   - Docker.app을 Applications 폴더로 드래그
   - Applications 폴더에서 Docker 실행

3. **Docker 시작 대기**
   - Docker Desktop이 완전히 시작될 때까지 대기 (상단 메뉴바에 Docker 아이콘 표시)
   - 처음 실행 시 약 1-2분 소요될 수 있습니다

4. **설치 확인**
   ```bash
   docker --version
   docker-compose --version
   ```

## 🚀 Docker 설치 후 실행 방법

### 방법 1: 자동 스크립트 사용 (권장)

```bash
cd /Users/choiyj981/웹사이트/marketingPage
./macbook-setup.sh
```

스크립트가 자동으로:
- ✅ Docker 설치 확인
- ✅ 포트 확인 및 설정
- ✅ Docker Hub에서 이미지 다운로드
- ✅ 컨테이너 실행
- ✅ 상태 확인

### 방법 2: 수동 실행

```bash
cd /Users/choiyj981/웹사이트/marketingPage

# Docker Hub에서 이미지 가져오기
docker-compose -f docker-compose.prod.yml pull

# 컨테이너 실행
docker-compose -f docker-compose.prod.yml up -d

# 접속
open http://localhost:8080
```

## 📝 환경 변수 설정 (선택사항)

더 안전한 SESSION_SECRET을 사용하려면:

1. 프로젝트 루트에 `.env` 파일 생성:
   ```bash
   cd /Users/choiyj981/웹사이트/marketingPage
   echo "SESSION_SECRET=$(openssl rand -hex 32)" > .env
   ```

2. docker-compose.prod.yml이 자동으로 `.env` 파일을 읽습니다.

## 🔍 확인 사항

### Docker 설치 확인
```bash
docker --version
# 예상 출력: Docker version 24.0.0, build abc123

docker-compose --version
# 예상 출력: Docker Compose version v2.20.0
```

### 컨테이너 상태 확인
```bash
docker-compose -f docker-compose.prod.yml ps
```

### 로그 확인
```bash
docker-compose -f docker-compose.prod.yml logs -f app
```

## 🌐 접속 주소

설정이 완료되면 다음 주소로 접속할 수 있습니다:
- **로컬**: http://localhost:8080
- **관리자 페이지**: http://localhost:8080/admin
- **로그인 페이지**: http://localhost:8080/login

## 🛠️ 유용한 명령어

```bash
# 컨테이너 중지
docker-compose -f docker-compose.prod.yml stop

# 컨테이너 시작
docker-compose -f docker-compose.prod.yml start

# 컨테이너 재시작
docker-compose -f docker-compose.prod.yml restart

# 컨테이너 중지 및 제거
docker-compose -f docker-compose.prod.yml down

# 최신 이미지 가져오기
docker-compose -f docker-compose.prod.yml pull

# 컨테이너 내부 접속
docker-compose -f docker-compose.prod.yml exec app sh
```

## ❓ 문제 해결

### 문제 1: Docker가 실행되지 않음
- Docker Desktop이 실행 중인지 확인 (상단 메뉴바에 Docker 아이콘 확인)
- Docker Desktop 재시작

### 문제 2: 포트 8080이 이미 사용 중
- 스크립트 실행 시 다른 포트 선택
- 또는 수동으로 포트 변경:
  ```bash
  # docker-compose.prod.yml에서 포트 변경
  # ports: "5000:8080"  # 8080 대신 5000 사용
  ```

### 문제 3: 이미지를 찾을 수 없음
- Docker Hub 로그인 필요할 수 있음:
  ```bash
  docker login
  ```

## 📚 추가 참고 자료

- [MACBOOK_SETUP_GUIDE.md](./MACBOOK_SETUP_GUIDE.md) - 상세 가이드
- [README.md](./README.md) - 프로젝트 전체 가이드

---

**다음 단계**: Docker Desktop을 설치한 후 `./macbook-setup.sh` 스크립트를 실행하세요! 🚀





