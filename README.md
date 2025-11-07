# marketingPage
마케팅페이지

## 데이터베이스 설정

이 프로젝트는 PostgreSQL 데이터베이스를 사용합니다.

### 설정 옵션

1. **로컬 PostgreSQL** - Docker 또는 로컬 설치
   - 자세한 내용: [LEARNING.md](./LEARNING.md)

2. **EC2 내부 PostgreSQL** - AWS EC2 인스턴스에서 PostgreSQL 설치 및 연결
   - 자세한 내용: [EC2_POSTGRESQL_SETUP.md](./EC2_POSTGRESQL_SETUP.md)

3. **Neon (Cloud)** - 클라우드 PostgreSQL 서비스
   - 자세한 내용: [replit.md](./replit.md)

4. **GCP Cloud SQL** - Google Cloud Platform의 관리형 PostgreSQL
   - 자세한 내용: [GCP_CLOUD_SQL_SETUP.md](./GCP_CLOUD_SQL_SETUP.md)

### 빠른 시작

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