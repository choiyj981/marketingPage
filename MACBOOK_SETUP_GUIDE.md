# 🍎 맥북 전용 Docker Hub 이미지 실행 가이드

## 📋 목차

1. [사전 준비](#사전-준비)
2. [빠른 시작](#빠른-시작)
3. [상세 설정](#상세-설정)
4. [문제 해결](#문제-해결)
5. [유용한 명령어](#유용한-명령어)

---

## 🚀 사전 준비

### 1. Docker Desktop 설치

맥북에 Docker Desktop이 설치되어 있어야 합니다.

**설치 방법:**
1. [Docker Desktop 다운로드](https://www.docker.com/products/docker-desktop)
2. 다운로드한 `.dmg` 파일 실행
3. Docker.app을 Applications 폴더로 드래그
4. Applications에서 Docker 실행
5. Docker가 실행될 때까지 대기 (상단 메뉴바에 Docker 아이콘 표시)

**설치 확인:**
```bash
docker --version
docker-compose --version
```

**예상 출력:**
```
Docker version 24.0.0, build abc123
Docker Compose version v2.20.0
```

---

## ⚡ 빠른 시작

### 방법 1: 자동 스크립트 사용 (권장)

```bash
# 1. 프로젝트 클론
git clone https://github.com/choiyj981/marketingPage.git
cd marketingPage

# 2. 스크립트 실행 권한 부여
chmod +x macbook-setup.sh

# 3. 스크립트 실행
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
# 1. 프로젝트 클론
git clone https://github.com/choiyj981/marketingPage.git
cd marketingPage

# 2. Docker Hub에서 이미지 다운로드
docker-compose -f docker-compose.prod.yml pull

# 3. 컨테이너 실행
docker-compose -f docker-compose.prod.yml up -d

# 4. 접속
open http://localhost:8080
```

---

## 🔧 상세 설정

### 데이터베이스 설정

#### 옵션 1: 서버의 PostgreSQL 사용 (권장)

서버의 PostgreSQL을 사용하면 데이터가 서버와 동기화됩니다.

**설정:**
`docker-compose.prod.yml` 파일이 이미 서버 PostgreSQL을 사용하도록 설정되어 있습니다:

```yaml
environment:
  DATABASE_URL: postgresql://choiyj981:981749@35.237.229.92:5432/marketingpage
```

**주의사항:**
- 서버의 PostgreSQL이 외부 접근을 허용해야 합니다
- 방화벽 설정 확인 필요
- 네트워크 연결 필요

#### 옵션 2: 로컬 PostgreSQL 사용

로컬에서 독립적으로 실행하려면:

```yaml
# docker-compose.prod.yml 수정
services:
  postgres:
    image: postgres:15-alpine
    container_name: marketingpage-db
    environment:
      POSTGRES_USER: choiyj981
      POSTGRES_PASSWORD: 981749
      POSTGRES_DB: marketingpage
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  app:
    image: docckerchoi/marketingpage:latest
    environment:
      DATABASE_URL: postgresql://choiyj981:981749@postgres:5432/marketingpage
      # 로컬 PostgreSQL 사용
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
```

### 포트 변경

8080 포트가 사용 중이면 다른 포트로 변경:

```yaml
# docker-compose.prod.yml
services:
  app:
    ports:
      - "5000:8080"  # 외부 포트를 5000으로 변경
```

또는 스크립트 실행 시 자동으로 포트를 변경할 수 있습니다.

---

## 🐛 문제 해결

### 문제 1: 포트가 이미 사용 중

**증상:**
```
Error: bind: address already in use
```

**해결 방법:**

```bash
# 8080 포트를 사용하는 프로세스 확인
lsof -i :8080

# 프로세스 종료
lsof -ti:8080 | xargs kill -9

# 또는 다른 포트 사용
# docker-compose.prod.yml에서 포트 변경
```

### 문제 2: Docker가 실행되지 않음

**증상:**
```
Cannot connect to the Docker daemon
```

**해결 방법:**
1. Docker Desktop 실행 확인
2. 상단 메뉴바에 Docker 아이콘 확인
3. Docker Desktop 재시작

### 문제 3: 이미지를 찾을 수 없음

**증상:**
```
Error: pull access denied for docckerchoi/marketingpage
```

**해결 방법:**

```bash
# Docker Hub 로그인
docker login

# 사용자명: docckerchoi
# 비밀번호: (Docker Hub 비밀번호)
```

### 문제 4: 데이터베이스 연결 실패

**증상:**
```
Error: connect ECONNREFUSED 35.237.229.92:5432
```

**해결 방법:**

1. **서버 PostgreSQL 외부 접근 확인**
   - 서버의 PostgreSQL이 외부 접근을 허용하는지 확인
   - 방화벽 설정 확인

2. **로컬 PostgreSQL 사용으로 변경**
   - `docker-compose.prod.yml`에서 로컬 PostgreSQL 사용

### 문제 5: 권한 오류

**증상:**
```
permission denied
```

**해결 방법:**

```bash
# Docker 그룹에 사용자 추가 (일반적으로 Docker Desktop이 자동 처리)
# 또는 sudo 사용 (권장하지 않음)
```

---

## 📝 유용한 명령어

### 컨테이너 관리

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

# 컨테이너 중지 및 제거 (볼륨 포함)
docker-compose -f docker-compose.prod.yml down -v
```

### 로그 확인

```bash
# 모든 로그 확인
docker-compose -f docker-compose.prod.yml logs

# 앱 로그만 확인
docker-compose -f docker-compose.prod.yml logs app

# 실시간 로그 확인 (Ctrl+C로 종료)
docker-compose -f docker-compose.prod.yml logs -f app

# 최근 50줄만 확인
docker-compose -f docker-compose.prod.yml logs --tail=50 app
```

### 이미지 관리

```bash
# 최신 이미지 가져오기
docker-compose -f docker-compose.prod.yml pull

# 이미지 목록 확인
docker images | grep marketingpage

# 이미지 삭제
docker rmi docckerchoi/marketingpage:latest
```

### 컨테이너 내부 접속

```bash
# 앱 컨테이너 내부 접속
docker-compose -f docker-compose.prod.yml exec app sh

# PostgreSQL 컨테이너 접속 (로컬 PostgreSQL 사용 시)
docker-compose -f docker-compose.prod.yml exec postgres psql -U choiyj981 -d marketingpage
```

---

## 🔄 업데이트 방법

새 버전이 배포되면:

```bash
# 1. 최신 이미지 가져오기
docker-compose -f docker-compose.prod.yml pull

# 2. 컨테이너 재시작
docker-compose -f docker-compose.prod.yml up -d

# 3. 로그 확인
docker-compose -f docker-compose.prod.yml logs -f app
```

---

## 📊 전체 실행 흐름

```
1. Docker Desktop 실행
   ↓
2. 프로젝트 클론
   git clone https://github.com/choiyj981/marketingPage.git
   ↓
3. 디렉토리 이동
   cd marketingPage
   ↓
4. 스크립트 실행 (또는 수동 실행)
   ./macbook-setup.sh
   ↓
5. Docker Hub에서 이미지 다운로드
   docker-compose pull
   ↓
6. 컨테이너 실행
   docker-compose up -d
   ↓
7. 접속 확인
   open http://localhost:8080
   ↓
✅ 완료!
```

---

## 🎯 체크리스트

맥북에서 실행하기 전 확인사항:

- [ ] Docker Desktop 설치 및 실행 중
- [ ] `docker --version` 명령어 작동 확인
- [ ] `docker-compose --version` 명령어 작동 확인
- [ ] 프로젝트 클론 완료
- [ ] `docker-compose.prod.yml` 파일 존재 확인
- [ ] 포트 8080 사용 가능 확인 (또는 다른 포트 사용)
- [ ] 데이터베이스 연결 설정 확인 (서버 또는 로컬)

---

## 💡 팁

### 1. 별칭(alias) 설정

`~/.zshrc` 또는 `~/.bash_profile`에 추가:

```bash
# Docker Compose 별칭
alias dc='docker-compose -f docker-compose.prod.yml'
alias dcup='dc up -d'
alias dcdown='dc down'
alias dclogs='dc logs -f app'
alias dcps='dc ps'
```

사용:
```bash
dcup    # 컨테이너 시작
dcdown  # 컨테이너 중지
dclogs  # 로그 확인
dcps    # 상태 확인
```

### 2. 자동 시작 설정

컴퓨터 시작 시 자동으로 실행하려면:

```bash
# ~/.zshrc 또는 ~/.bash_profile에 추가
cd ~/marketingPage && docker-compose -f docker-compose.prod.yml up -d
```

### 3. 리소스 모니터링

```bash
# Docker 리소스 사용량 확인
docker stats

# 특정 컨테이너만 확인
docker stats marketingpage-app
```

---

## ✅ 결론

맥북에서도 Windows와 동일하게 Docker Hub 이미지를 사용할 수 있습니다!

**핵심 포인트:**
- ✅ Docker Desktop만 설치하면 됨
- ✅ `docker-compose pull` 후 `up -d`만 하면 실행
- ✅ 플랫폼 독립적이므로 동일하게 작동
- ✅ 자동 스크립트로 더욱 편리하게 실행 가능

**문제가 발생하면:**
1. Docker Desktop이 실행 중인지 확인
2. 포트 충돌 확인
3. 로그 확인 (`docker-compose logs -f app`)
4. 이 가이드의 문제 해결 섹션 참고

---

## 📞 추가 도움

문제가 계속되면:
1. 로그 확인: `docker-compose -f docker-compose.prod.yml logs app`
2. 컨테이너 상태 확인: `docker-compose -f docker-compose.prod.yml ps`
3. Docker Desktop 재시작

