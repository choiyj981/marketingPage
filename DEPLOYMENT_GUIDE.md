# 서버 배포 가이드

이 가이드는 SSH 서버에 애플리케이션을 배포하는 전체 과정을 설명합니다.

## 📋 사전 준비

### 필요한 정보
- Git 저장소: https://github.com/choiyj981/marketingPage
- Docker Hub 사용자명: `docckerchoi`
- SSH 서버 IP: `35.237.229.92` (외부), `10.142.0.2` (내부)
- SSH 사용자명: `docckerchoi`
- 데이터베이스:
  - 사용자명: `choiyj981`
  - 비밀번호: `981749`
  - 데이터베이스명: `marketingpage`
- SESSION_SECRET: `OWE1NDhmOWQtNjA0MS00YTQwLTk4MDgtMWYyYjJkYmYzYzFmY2UwZGIwNzYtMTJiMi00MDMxLWFiODYtYzkzODhjYjkzMGM2`

---

## 🚀 SSH 서버에서 실행할 명령어

### 1단계: SSH 접속

```bash
ssh docckerchoi@35.237.229.92
```

### 2단계: 기존 PostgreSQL 백업 및 제거

```bash
# 1. 기존 데이터베이스 백업 (중요!)
sudo -u postgres pg_dump -U choiyj981 marketingpage > ~/old_postgres_backup.sql

# 백업 확인
ls -lh ~/old_postgres_backup.sql

# 2. PostgreSQL 서비스 중지
sudo systemctl stop postgresql

# 3. 자동 시작 해제
sudo systemctl disable postgresql

# 4. PostgreSQL 패키지 제거
sudo apt remove --purge postgresql postgresql-contrib postgresql-* -y
sudo apt autoremove -y

# 5. 포트 확인 (5432가 비어있는지)
sudo netstat -tlnp | grep 5432
```

### 3단계: Docker 설치 확인

```bash
# Docker 확인
docker --version
docker-compose --version

# 없다면 설치
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
newgrp docker
```

### 4단계: 프로젝트 클론

```bash
# 프로젝트 디렉토리로 이동
cd ~
git clone https://github.com/choiyj981/marketingPage.git
cd marketingPage

# 최신 코드 확인
git pull origin main
```

### 5단계: 환경 변수 설정

```bash
# .env 파일 생성
nano .env
```

다음 내용 입력:
```env
SESSION_SECRET=OWE1NDhmOWQtNjA0MS00YTQwLTk4MDgtMWYyYjJkYmYzYzFmY2UwZGIwNzYtMTJiMi00MDMxLWFiODYtYzkzODhjYjkzMGM2
```

저장: `Ctrl+O`, 엔터, `Ctrl+X`

### 6단계: 로컬 백업 파일 전송 (로컬 PC에서 실행)

로컬 PC의 PowerShell 또는 CMD에서:

```bash
cd C:\Users\CYJ\Desktop\모든파일\파이썬자동화프로그램\웹사이트
scp local_backup.sql docckerchoi@35.237.229.92:~/marketingPage/
```

### 7단계: Docker Hub 로그인

SSH 서버에서:

```bash
docker login
# 사용자명: docckerchoi
# 비밀번호: Docker Hub 비밀번호 입력
```

### 8단계: Docker Compose로 실행

```bash
cd ~/marketingPage

# 이미지 다운로드
docker-compose -f docker-compose.prod.yml pull

# 실행
docker-compose -f docker-compose.prod.yml up -d

# 상태 확인
docker-compose -f docker-compose.prod.yml ps

# 로그 확인
docker-compose -f docker-compose.prod.yml logs -f
```

### 9단계: 데이터베이스 스키마 생성

```bash
# 스키마 생성
docker-compose -f docker-compose.prod.yml exec app npm run db:push
```

### 10단계: 로컬 데이터 복원

```bash
# 백업 파일 확인
ls -lh ~/marketingPage/local_backup.sql

# 데이터 복원
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U choiyj981 -d marketingpage < ~/marketingPage/local_backup.sql
```

### 11단계: 접속 확인

```bash
# 컨테이너 상태 확인
docker-compose -f docker-compose.prod.yml ps

# PostgreSQL 접속 테스트
docker-compose -f docker-compose.prod.yml exec postgres psql -U choiyj981 -d marketingpage

# PostgreSQL 프롬프트에서:
# SELECT COUNT(*) FROM users;  # 데이터 확인
# \q  # 종료
```

---

## ✅ 완료 확인

브라우저에서 접속:
- **애플리케이션**: http://35.237.229.92:8080
- **PostgreSQL**: 35.237.229.92:5432

---

## 🔄 업데이트 워크플로우

### 로컬에서 코드 수정 후

로컬 PC에서:

```bash
# 1. 로컬에서 테스트
docker-compose up -d

# 2. Git에 커밋 및 푸시
git add .
git commit -m "Update feature"
git push origin main

# 3. Docker 이미지 재빌드 및 업로드
docker build -t docckerchoi/marketingpage:latest .
docker push docckerchoi/marketingpage:latest
```

### SSH 서버에서 업데이트

SSH 서버에서:

```bash
# 1. Git에서 최신 코드 가져오기
cd ~/marketingPage
git pull origin main

# 2. Docker Hub에서 최신 이미지 가져오기
docker-compose -f docker-compose.prod.yml pull

# 3. 재시작
docker-compose -f docker-compose.prod.yml up -d

# 4. 로그 확인
docker-compose -f docker-compose.prod.yml logs -f
```

---

## 🛠️ 유용한 명령어

### 컨테이너 관리

```bash
# 상태 확인
docker-compose -f docker-compose.prod.yml ps

# 로그 확인
docker-compose -f docker-compose.prod.yml logs -f

# 특정 서비스 로그만
docker-compose -f docker-compose.prod.yml logs -f app
docker-compose -f docker-compose.prod.yml logs -f postgres

# 재시작
docker-compose -f docker-compose.prod.yml restart

# 중지
docker-compose -f docker-compose.prod.yml stop

# 시작
docker-compose -f docker-compose.prod.yml start

# 완전 중지 및 제거 (주의!)
docker-compose -f docker-compose.prod.yml down
```

### 데이터베이스 관리

```bash
# PostgreSQL 접속
docker-compose -f docker-compose.prod.yml exec postgres psql -U choiyj981 -d marketingpage

# 백업 생성
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U choiyj981 marketingpage > backup_$(date +%Y%m%d).sql

# 데이터 복원
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U choiyj981 -d marketingpage < backup.sql
```

---

## 🐛 문제 해결

### 포트 충돌

```bash
# 포트 사용 확인
sudo netstat -tlnp | grep 5432
sudo netstat -tlnp | grep 8080

# 사용 중이면 docker-compose.prod.yml에서 포트 변경
```

### 컨테이너가 시작되지 않음

```bash
# 로그 확인
docker-compose -f docker-compose.prod.yml logs

# 재생성
docker-compose -f docker-compose.prod.yml up -d --force-recreate
```

### 데이터베이스 연결 실패

```bash
# PostgreSQL 컨테이너 상태 확인
docker-compose -f docker-compose.prod.yml ps postgres

# PostgreSQL 로그 확인
docker-compose -f docker-compose.prod.yml logs postgres
```

---

## 📝 체크리스트

- [ ] 기존 PostgreSQL 백업 완료
- [ ] 기존 PostgreSQL 제거 완료
- [ ] Docker 설치 확인 완료
- [ ] 프로젝트 Git 클론 완료
- [ ] `.env` 파일 생성 완료
- [ ] 로컬 백업 파일 전송 완료
- [ ] Docker Hub 로그인 완료
- [ ] Docker Compose 실행 완료
- [ ] 데이터베이스 스키마 생성 완료
- [ ] 로컬 데이터 복원 완료
- [ ] 접속 확인 완료

---

이제 SSH 서버에서 위 명령어들을 순서대로 실행하세요!

