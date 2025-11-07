# marketingPage
마케팅페이지

## 데이터베이스 설정

이 프로젝트는 PostgreSQL 데이터베이스를 사용합니다.

### 설정 옵션

1. **로컬 PostgreSQL** - Docker 또는 로컬 설치
   - 자세한 내용: [LEARNING.md](./LEARNING.md)

2. **GCP Cloud SQL** - Google Cloud Platform의 관리형 PostgreSQL
   - 자세한 내용: [GCP_CLOUD_SQL_SETUP.md](./GCP_CLOUD_SQL_SETUP.md)

3. **Docker Compose** - Docker를 사용한 전체 환경 구성 (로컬 + 서버)
   - 로컬 실행: [DOCKER_LOCAL.md](./DOCKER_LOCAL.md)
   - 서버 배포: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### 빠른 시작

#### Docker를 사용한 로컬 실행 (권장)

```bash
# 프로덕션 모드
docker-compose up -d
docker-compose exec app npm run db:push
# http://localhost:8080 접속

# 개발 모드 (핫 리로드)
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml exec app npm run db:push
# http://localhost:5000 접속
```

#### 일반 방법

1. `.env` 파일 생성:
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   SESSION_SECRET=your-secret-key
   PORT=5000
   NODE_ENV=development
   ```

2. 의존성 설치:
   ```bash
   npm install
   ```

3. 데이터베이스 스키마 생성:
   ```bash
   npm run db:push
   ```

4. 개발 서버 실행:
   ```bash
   npm run dev
   ```