# 로컬 Docker 실행 가이드

이 가이드는 로컬 PC에서 Docker를 사용하여 애플리케이션을 실행하는 방법을 설명합니다.

## 🚀 빠른 시작

### 프로덕션 모드 (빌드된 버전)

```bash
# 1. Docker Compose로 전체 환경 시작
docker-compose up -d

# 2. 로그 확인
docker-compose logs -f

# 3. 데이터베이스 스키마 생성 (처음 한 번만)
docker-compose exec app npm run db:push

# 4. 브라우저에서 접속
# http://localhost:8080
```

### 개발 모드 (핫 리로드)

```bash
# 1. 개발 모드로 시작
docker-compose -f docker-compose.dev.yml up -d

# 2. 로그 확인
docker-compose -f docker-compose.dev.yml logs -f

# 3. 데이터베이스 스키마 생성 (처음 한 번만)
docker-compose -f docker-compose.dev.yml exec app npm run db:push

# 4. 브라우저에서 접속
# http://localhost:5000
```

---

## 📋 두 가지 모드 비교

| 항목 | 프로덕션 모드 | 개발 모드 |
|------|-------------|----------|
| 파일 | `docker-compose.yml` | `docker-compose.dev.yml` |
| 포트 | 8080 | 5000 |
| 빌드 | 사전 빌드 필요 | 소스 코드 직접 사용 |
| 핫 리로드 | ❌ | ✅ |
| 성능 | 최적화됨 | 개발용 |
| 사용 시기 | 테스트/프로덕션 | 개발 중 |

---

## 🔧 상세 사용법

### 프로덕션 모드

#### 1. 시작

```bash
docker-compose up -d
```

#### 2. 빌드만 다시 하기 (코드 변경 후)

```bash
# 이미지 재빌드
docker-compose build app

# 컨테이너 재시작
docker-compose up -d app
```

#### 3. 중지

```bash
docker-compose down
```

#### 4. 완전 삭제 (데이터 포함)

```bash
docker-compose down -v
```

---

### 개발 모드

#### 1. 시작

```bash
docker-compose -f docker-compose.dev.yml up -d
```

#### 2. 코드 변경

개발 모드에서는 소스 코드를 직접 수정하면 자동으로 반영됩니다!

```bash
# server/index.ts 수정
# client/src/App.tsx 수정
# 등등...

# 변경 사항이 자동으로 감지되어 재시작됩니다
```

#### 3. 중지

```bash
docker-compose -f docker-compose.dev.yml down
```

---

## 🗄️ 데이터베이스 관리

### 데이터베이스 접속

```bash
# 프로덕션 모드
docker-compose exec postgres psql -U choiyj981 -d marketingpage

# 개발 모드
docker-compose -f docker-compose.dev.yml exec postgres psql -U choiyj981 -d marketingpage
```

### 데이터베이스 백업

```bash
# 프로덕션 모드
docker-compose exec postgres pg_dump -U choiyj981 marketingpage > backup.sql

# 개발 모드
docker-compose -f docker-compose.dev.yml exec postgres pg_dump -U choiyj981 marketingpage > backup_dev.sql
```

### 데이터베이스 복원

```bash
# 프로덕션 모드
docker-compose exec -T postgres psql -U choiyj981 marketingpage < backup.sql

# 개발 모드
docker-compose -f docker-compose.dev.yml exec -T postgres psql -U choiyj981 marketingpage < backup_dev.sql
```

---

## 🛠️ 유용한 명령어

### 컨테이너 상태 확인

```bash
# 프로덕션 모드
docker-compose ps

# 개발 모드
docker-compose -f docker-compose.dev.yml ps
```

### 로그 확인

```bash
# 모든 서비스 로그
docker-compose logs -f

# 특정 서비스만
docker-compose logs -f app
docker-compose logs -f postgres
```

### 컨테이너 재시작

```bash
# 특정 서비스만 재시작
docker-compose restart app

# 모든 서비스 재시작
docker-compose restart
```

### 컨테이너 내부 접속

```bash
# 애플리케이션 컨테이너 접속
docker-compose exec app sh

# 개발 모드
docker-compose -f docker-compose.dev.yml exec app sh
```

---

## 🔍 문제 해결

### 포트가 이미 사용 중

```bash
# 포트 확인
netstat -ano | findstr :8080  # Windows
lsof -i :8080                  # Mac/Linux

# docker-compose.yml에서 포트 변경
ports:
  - "8081:8080"  # 외부 포트를 8081로 변경
```

### 컨테이너가 시작되지 않음

```bash
# 로그 확인
docker-compose logs

# 컨테이너 상태 확인
docker-compose ps -a

# 컨테이너 재생성
docker-compose up -d --force-recreate
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

### 개발 모드에서 변경 사항이 반영되지 않음

```bash
# 컨테이너 재시작
docker-compose -f docker-compose.dev.yml restart app

# 또는 완전히 재생성
docker-compose -f docker-compose.dev.yml up -d --force-recreate app
```

---

## 📝 환경 변수 설정

### .env 파일 생성 (선택사항)

프로젝트 루트에 `.env` 파일을 만들면 환경 변수를 설정할 수 있습니다:

```env
SESSION_SECRET=your-secret-key-here
NODE_ENV=development
PORT=5000
```

docker-compose.yml에서 `${SESSION_SECRET}` 형식으로 사용할 수 있습니다.

---

## 🎯 추천 워크플로우

### 개발 중

1. 개발 모드로 시작: `docker-compose -f docker-compose.dev.yml up -d`
2. 코드 수정 (자동 반영됨)
3. 브라우저에서 확인: `http://localhost:5000`

### 배포 전 테스트

1. 프로덕션 모드로 시작: `docker-compose up -d`
2. 빌드 확인: `docker-compose build app`
3. 테스트: `http://localhost:8080`

---

## ✅ 체크리스트

- [ ] Docker Desktop 실행 중
- [ ] 포트 5000, 8080, 5432 사용 가능
- [ ] 프로젝트 디렉토리에서 명령어 실행
- [ ] 데이터베이스 스키마 생성 완료 (`npm run db:push`)

이제 로컬에서 Docker로 모든 것을 실행할 수 있습니다! 🎉

