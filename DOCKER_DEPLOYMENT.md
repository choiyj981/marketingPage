# Docker Hub를 사용한 배포 가이드

이 가이드는 Docker Hub를 사용하여 애플리케이션을 배포하는 방법을 설명합니다.

## 📋 전체 프로세스 요약

```
로컬 PC → Docker 이미지 빌드 → Docker Hub 업로드 → 서버에서 다운로드 → 실행
```

---

## 🚀 단계별 배포 가이드

### 1단계: Docker Hub 계정 준비

1. **Docker Hub 가입**
   - https://hub.docker.com 접속
   - 회원가입 (무료)
   - 사용자명 확인 (예: `choiyj981`)

2. **로컬에서 Docker Hub 로그인**
   ```bash
   docker login
   # 사용자명과 비밀번호 입력
   ```

---

### 2단계: 로컬에서 Docker 이미지 빌드 및 업로드

#### 2-1. docker-compose.yml 수정

프로젝트 루트의 `docker-compose.yml` 파일을 열어서:

```yaml
# 이 부분을 찾아서
image: YOUR_DOCKERHUB_USERNAME/marketingpage:latest

# 본인의 Docker Hub 사용자명으로 변경
image: choiyj981/marketingpage:latest  # 예시
```

#### 2-2. Docker 이미지 빌드

로컬 PC에서 프로젝트 디렉토리로 이동:

```bash
# Windows PowerShell 또는 CMD
cd C:\Users\CYJ\Desktop\모든파일\파이썬자동화프로그램\웹사이트

# Docker 이미지 빌드 (YOUR_DOCKERHUB_USERNAME을 본인 사용자명으로 변경)
docker build -t YOUR_DOCKERHUB_USERNAME/marketingpage:latest .

# 예시: 사용자명이 choiyj981인 경우
# docker build -t choiyj981/marketingpage:latest .
```

#### 2-3. 빌드된 이미지 확인

```bash
docker images

# 다음과 같이 보여야 합니다:
# choiyj981/marketingpage   latest   abc123def456   2 minutes ago   250MB
```

#### 2-4. Docker Hub에 업로드

```bash
# Docker Hub에 푸시
docker push YOUR_DOCKERHUB_USERNAME/marketingpage:latest

# 예시:
# docker push choiyj981/marketingpage:latest
```

업로드가 완료되면 Docker Hub 웹사이트에서 확인할 수 있습니다.

---

### 3단계: 서버에서 다운로드 및 실행

#### 3-1. 서버에 프로젝트 전송

**방법 A: Git 사용 (권장)**

로컬에서:
```bash
git add .
git commit -m "Add Docker support"
git push
```

서버 SSH에서:
```bash
git clone [YOUR_GIT_REPO_URL] ~/marketingpage
cd ~/marketingpage
```

**방법 B: 직접 파일 전송**

로컬에서:
```bash
# 필요한 파일만 압축
tar -czf marketingpage.tar.gz --exclude='node_modules' --exclude='.git' --exclude='dist' .

# 서버로 전송
scp marketingpage.tar.gz choiyj981@[GCP_IP]:~/marketingpage.tar.gz
```

서버 SSH에서:
```bash
mkdir -p ~/marketingpage
tar -xzf marketingpage.tar.gz -C ~/marketingpage
cd ~/marketingpage
```

#### 3-2. 서버에 Docker 설치 (없는 경우)

GCP 서버 SSH에서:

```bash
# Docker 설치 확인
docker --version

# 없다면 설치 (Debian/Ubuntu)
sudo apt update
sudo apt install docker.io docker-compose -y

# Docker 서비스 시작
sudo systemctl start docker
sudo systemctl enable docker

# 현재 사용자를 docker 그룹에 추가
sudo usermod -aG docker $USER

# 로그아웃 후 다시 로그인하거나
newgrp docker

# 확인
docker --version
docker-compose --version
```

#### 3-3. Docker Hub 로그인 (서버)

서버 SSH에서:

```bash
docker login
# 사용자명과 비밀번호 입력
```

#### 3-4. docker-compose.yml 수정 (서버)

서버에서 `docker-compose.yml` 파일의 이미지 이름을 확인/수정:

```bash
nano docker-compose.yml
```

`YOUR_DOCKERHUB_USERNAME`을 본인의 Docker Hub 사용자명으로 변경:

```yaml
image: choiyj981/marketingpage:latest  # 예시
```

#### 3-5. 이미지 다운로드 및 실행

서버 SSH에서:

```bash
# 프로젝트 디렉토리로 이동
cd ~/marketingpage

# Docker Hub에서 최신 이미지 다운로드
docker-compose pull

# 백그라운드에서 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f
```

#### 3-6. 데이터베이스 스키마 생성

```bash
# 데이터베이스 테이블 생성 (처음 한 번만)
docker-compose exec app npm run db:push
```

#### 3-7. 접속 확인

브라우저에서:
- `http://[서버IP]:8080` 접속

---

## 📦 데이터베이스 백업 및 복원

### 백업 생성

```bash
# 데이터베이스 덤프 생성
docker-compose exec postgres pg_dump -U choiyj981 marketingpage > backup.sql

# 또는 타임스탬프 포함
docker-compose exec postgres pg_dump -U choiyj981 marketingpage > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 데이터 복원

```bash
# 백업 파일에서 복원
docker-compose exec -T postgres psql -U choiyj981 marketingpage < backup.sql
```

---

## 🔄 업데이트 프로세스

### 로컬에서 코드 수정 후 재배포

```bash
# 1. 코드 수정 후 이미지 재빌드
docker build -t YOUR_DOCKERHUB_USERNAME/marketingpage:latest .

# 2. Docker Hub에 업로드
docker push YOUR_DOCKERHUB_USERNAME/marketingpage:latest

# 3. 서버에서 업데이트
# 서버 SSH에서:
cd ~/marketingpage
docker-compose pull
docker-compose up -d
```

---

## 🛠️ 유용한 명령어

### 컨테이너 관리

```bash
# 실행 중인 컨테이너 확인
docker-compose ps

# 컨테이너 중지
docker-compose stop

# 컨테이너 시작
docker-compose start

# 컨테이너 재시작
docker-compose restart

# 컨테이너 중지 및 제거
docker-compose down

# 컨테이너 중지 및 제거 (볼륨 포함)
docker-compose down -v
```

### 로그 확인

```bash
# 모든 서비스 로그 확인
docker-compose logs -f

# 특정 서비스 로그만 확인
docker-compose logs -f app
docker-compose logs -f postgres
```

### 컨테이너 내부 접속

```bash
# 애플리케이션 컨테이너 접속
docker-compose exec app sh

# PostgreSQL 컨테이너 접속
docker-compose exec postgres psql -U choiyj981 -d marketingpage
```

---

## ⚠️ 주의사항

1. **Docker Hub 사용자명**: 모든 곳에서 동일하게 사용해야 합니다
2. **이미지 이름 형식**: `사용자명/프로젝트명:태그` (예: `choiyj981/marketingpage:latest`)
3. **비밀번호 보안**: Docker Hub 비밀번호는 안전하게 관리하세요
4. **환경 변수**: 프로덕션에서는 `.env` 파일이나 환경 변수로 `SESSION_SECRET` 등을 설정하세요
5. **포트 충돌**: 서버에서 8080 포트가 이미 사용 중이면 `docker-compose.yml`의 포트를 변경하세요

---

## 🐛 문제 해결

### 이미지 다운로드 실패

```bash
# Docker Hub 로그인 확인
docker login

# 이미지 이름 확인
docker-compose config
```

### 컨테이너가 시작되지 않음

```bash
# 로그 확인
docker-compose logs

# 컨테이너 상태 확인
docker-compose ps
```

### 데이터베이스 연결 실패

```bash
# PostgreSQL 컨테이너 상태 확인
docker-compose ps postgres

# PostgreSQL 로그 확인
docker-compose logs postgres

# 네트워크 확인
docker network ls
docker network inspect marketingpage_app-network
```

---

## 📝 요약

1. ✅ Docker Hub 가입 및 로그인
2. ✅ 로컬에서 이미지 빌드 및 업로드
3. ✅ 서버에서 프로젝트 클론/전송
4. ✅ 서버에서 Docker 설치 (없는 경우)
5. ✅ docker-compose.yml 수정 (이미지 이름)
6. ✅ Docker Hub 로그인 (서버)
7. ✅ 이미지 다운로드 및 실행
8. ✅ 데이터베이스 스키마 생성

이제 Docker Hub를 통해 쉽게 배포할 수 있습니다! 🎉

