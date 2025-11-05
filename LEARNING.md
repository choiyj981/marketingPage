# 학습 로그 (Learning Log)

이 문서는 프로젝트 진행 과정에서 학습한 내용과 문제 해결 과정을 기록합니다.

---

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [환경 설정 단계별 가이드](#환경-설정-단계별-가이드)
- [문제 해결 로그](#문제-해결-로그)
- [학습 포인트](#학습-포인트)
- [다음 단계](#다음-단계)

---

## 프로젝트 개요

### 프로젝트 구조
```
웹사이트/
├── server/          # Express.js 백엔드 서버
├── client/          # React 프론트엔드
├── shared/          # 공유 스키마 및 타입
└── .env            # 환경 변수 (로컬 개발용)
```

### 기술 스택
- **백엔드**: Express.js, TypeScript
- **프론트엔드**: React, Vite
- **데이터베이스**: PostgreSQL (Docker)
- **ORM**: Drizzle ORM
- **인증**: Passport.js (Local Strategy)

---

## 환경 설정 단계별 가이드

### 1단계: Docker 설치 및 PostgreSQL 실행

#### 목표
로컬 개발 환경에서 PostgreSQL 데이터베이스를 실행하기

#### 진행 시간
2024년 12월 중순

#### 단계별 작업

**1-1. Docker Desktop 설치**
- Docker 공식 사이트에서 다운로드 및 설치
- 설치 후 재시작 필요

**1-2. PostgreSQL 컨테이너 실행**
```bash
docker run --name postgres-local \
  -e POSTGRES_PASSWORD=1234 \
  -e POSTGRES_DB=marketingpage \
  -p 5433:5432 \
  -d postgres
```

**설명:**
- `--name postgres-local`: 컨테이너 이름 지정
- `-e POSTGRES_PASSWORD=1234`: PostgreSQL 비밀번호 설정
- `-e POSTGRES_DB=marketingpage`: 데이터베이스 이름 자동 생성
- `-p 5433:5432`: 포트 매핑 (호스트:컨테이너)
- `-d`: 백그라운드 실행
- `postgres`: 사용할 이미지

**1-3. 컨테이너 실행 확인**
```bash
docker ps
```

**예상 결과:**
```
CONTAINER ID   IMAGE     STATUS         PORTS                    NAMES
c8cb6f374757   postgres  Up 2 minutes   0.0.0.0:5433->5432/tcp  postgres-local
```

---

### 2단계: 환경 변수 설정

#### 목표
애플리케이션이 데이터베이스에 연결할 수 있도록 환경 변수 설정

#### 진행 시간
2024년 12월 중순

#### 단계별 작업

**2-1. .env 파일 생성**
프로젝트 루트에 `.env` 파일 생성:

```env
DATABASE_URL=postgresql://postgres:1234@localhost:5433/marketingpage
SESSION_SECRET=dev-secret-key-change-in-production
PORT=5000
NODE_ENV=development
```

**각 변수 설명:**
- `DATABASE_URL`: PostgreSQL 연결 정보
  - 형식: `postgresql://사용자:비밀번호@주소:포트/데이터베이스명`
  - 포트: 5433 (Docker 컨테이너 포트 매핑)
- `SESSION_SECRET`: 세션 암호화용 비밀키
- `PORT`: 서버가 실행될 포트 번호
- `NODE_ENV`: 환경 모드 (development/production)

**2-2. dotenv 패키지 확인**
```bash
npm list dotenv
```

**2-3. 서버 코드에 dotenv 로드 추가**
`server/index.ts` 파일 맨 위에 추가:
```typescript
import "dotenv/config";
```

**왜 필요한가?**
- Node.js는 기본적으로 `.env` 파일을 읽지 않음
- `dotenv` 패키지가 `.env` 파일을 읽어서 `process.env`에 로드
- 그래야 코드에서 `process.env.DATABASE_URL` 사용 가능

---

### 3단계: 데이터베이스 스키마 생성

#### 목표
데이터베이스에 테이블 구조 생성

#### 진행 시간
2024년 12월 중순

#### 단계별 작업

**3-1. 스키마 파일 확인**
- 위치: `shared/schema.ts`
- 내용: 테이블 정의 (users, blog_posts, products 등)

**3-2. 스키마 생성 명령어 실행**
```bash
npm run db:push
```

**예상 결과:**
```
> rest-express@1.0.0 db:push
> drizzle-kit push

[✓] Pulling schema from database...
[✓] Changes applied
```

**3-3. 생성된 테이블 확인**
PostgreSQL에 다음 테이블들이 생성됨:
- `users` - 사용자 정보
- `sessions` - 세션 저장
- `blog_posts` - 블로그 게시글
- `products` - 제품 정보
- `resources` - 리소스 파일
- `services` - 서비스 정보
- 기타...

---

## 문제 해결 로그

### 문제 1: DATABASE_URL이 설정되지 않음

#### 발생 시간
2024년 12월 중순

#### 증상
```
⚠️  DATABASE_URL이 설정되지 않았습니다. 서버는 시작되지만 데이터베이스 기능은 작동하지 않습니다.
⚠️  데이터베이스 없이 메모리 세션 스토어를 사용합니다.
```

#### 원인 분석
1. `.env` 파일이 없었음
2. `dotenv` 패키지가 로드되지 않음
3. 환경 변수가 `process.env`에 로드되지 않음

#### 해결 과정

**1단계: .env 파일 생성**
- 프로젝트 루트에 `.env` 파일 생성
- DATABASE_URL 등 필요한 환경 변수 추가

**2단계: dotenv 로드 코드 추가**
- `server/index.ts` 파일 맨 위에 `import "dotenv/config";` 추가
- 서버 시작 시 자동으로 `.env` 파일 읽기

**3단계: .gitignore 업데이트**
- `.env` 파일을 Git에 올리지 않도록 `.gitignore`에 추가
- 보안상 중요한 정보(비밀번호 등)가 코드 저장소에 올라가지 않도록 방지

#### 해결 결과
- ✅ `.env` 파일 생성 완료
- ✅ dotenv 로드 코드 추가 완료
- ✅ 환경 변수 정상 로드 확인
- ✅ 데이터베이스 연결 성공

---

### 문제 2: 파일 이름 오류 (db_data.env)

#### 발생 시간
2024년 12월 중순

#### 증상
- `db_data.env` 파일은 존재하지만 인식되지 않음
- 환경 변수를 읽지 못함

#### 원인 분석
- Node.js는 기본적으로 `.env` 파일만 자동으로 읽음
- 다른 이름(`db_data.env`, `config.env` 등)은 인식하지 않음

#### 해결 과정
- `db_data.env` 파일을 `.env`로 이름 변경
- 또는 환경 변수 로더에서 파일 경로 명시 지정

#### 해결 결과
- ✅ 파일 이름을 `.env`로 변경
- ✅ 환경 변수 정상 인식

---

### 문제 3: Neon 클라이언트와 로컬 PostgreSQL 호환성 문제

#### 발생 시간
2024년 12월 중순

#### 증상
```
Error seeding database: NeonDbError: Error connecting to database: fetch failed
connect ECONNREFUSED ::1:443
```

서버는 실행되지만 데이터베이스 연결 실패

#### 원인 분석
1. `@neondatabase/serverless` 패키지는 Neon 클라우드 데이터베이스 전용
2. 로컬 PostgreSQL은 직접 TCP 연결을 사용해야 함
3. Neon 클라이언트는 HTTP/HTTPS(포트 443)로 연결 시도
4. 로컬 PostgreSQL은 PostgreSQL 프로토콜(포트 5432/5433)을 사용

**차이점:**
- Neon 클라우드: HTTP 기반 연결 (웹 API처럼)
- 로컬 PostgreSQL: 직접 TCP 연결 (소켓 연결)

#### 해결 과정

**1단계: 로컬 PostgreSQL용 패키지 설치**
```bash
npm install pg postgres
```

**2단계: server/db.ts 파일 수정**
- `drizzle-orm/neon-http` → `drizzle-orm/postgres-js`로 변경
- `@neondatabase/serverless` → `postgres` 패키지로 변경
- 로컬 PostgreSQL과 Neon 모두 지원하도록 수정

**변경 전:**
```typescript
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
```

**변경 후:**
```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL);
```

#### 해결 결과
- ✅ 로컬 PostgreSQL용 드라이버로 변경 완료
- ✅ 데이터베이스 연결 성공 메시지 확인
- ✅ 서버 정상 실행

**학습 포인트:**
- 클라우드 데이터베이스와 로컬 데이터베이스는 다른 연결 방식 사용
- 개발 환경에서는 로컬용 드라이버 사용
- 프로덕션에서는 배포 플랫폼에 맞는 드라이버 사용

---

### 문제 4: Primary Key 제약 조건 오류

#### 발생 시간
2024년 12월 중순

#### 증상
```
error: column "id" is in a primary key
code: '42P16'
```

#### 원인 분석
- 이미 테이블이 생성된 상태에서 스키마 변경 시도
- Primary Key 제약 조건을 변경하려고 할 때 발생

#### 해결 과정
- 개발 환경이므로 데이터베이스 초기화 (컨테이너 재생성)
- 프로덕션 환경에서는 마이그레이션 사용 권장

#### 해결 결과
- ✅ 데이터베이스 재생성으로 해결
- ✅ 스키마 정상 생성

---

## 학습 포인트

### 1. Docker와 컨테이너 개념

**Docker란?**
- 프로그램을 컨테이너라는 독립된 환경에서 실행하는 도구
- "가상 상자" 같은 개념

**왜 사용하나?**
- 컴퓨터에 직접 설치하지 않아도 프로그램 실행 가능
- 삭제가 쉬움 (컨테이너만 삭제하면 됨)
- 여러 버전을 동시에 실행 가능
- 설정이 간단함

**PostgreSQL을 Docker로 실행하는 이유**
- 로컬에 직접 설치하지 않아도 됨
- 개발 환경 설정이 빠름
- 테스트 후 쉽게 삭제 가능

---

### 2. 환경 변수와 .env 파일

**환경 변수란?**
- 프로그램 실행 시 필요한 설정 값
- 예: 데이터베이스 주소, 비밀번호, API 키 등

**왜 .env 파일을 사용하나?**
- 코드에 직접 비밀번호를 적지 않기 위해
- 환경별로 다른 설정을 쉽게 관리하기 위해
- Git에 올리지 않아 보안 유지

**dotenv 패키지의 역할**
- `.env` 파일을 읽어서 `process.env`에 로드
- Node.js가 기본적으로 `.env`를 읽지 않으므로 필요

**사용 방법:**
```typescript
import "dotenv/config";  // 파일 맨 위에 추가

// 이제 process.env.DATABASE_URL 사용 가능
const dbUrl = process.env.DATABASE_URL;
```

---

### 3. 데이터베이스 연결 과정

**전체 흐름:**
```
[1] Docker 컨테이너 실행
    ↓ PostgreSQL 서버 시작
    
[2] .env 파일 설정
    ↓ DATABASE_URL 등 환경 변수 정의
    
[3] dotenv 로드
    ↓ .env 파일 읽어서 process.env에 로드
    
[4] 서버 시작
    ↓ server/db.ts에서 process.env.DATABASE_URL 읽기
    
[5] 데이터베이스 연결
    ↓ PostgreSQL에 연결 성공
    
[6] 스키마 생성
    ↓ npm run db:push로 테이블 생성
```

**각 단계의 중요성:**
- 하나라도 빠지면 연결 실패
- 순서가 중요함

---

### 4. 개발 vs 프로덕션 환경

**개발 환경 (로컬)**
- `.env` 파일 사용
- Docker로 PostgreSQL 실행
- 데이터 초기화가 쉬움

**프로덕션 환경 (서버)**
- Railway, Render 등 플랫폼의 환경 변수 사용
- 클라우드 데이터베이스 사용
- 데이터 백업 필요

**차이점:**
| 항목 | 개발 환경 | 프로덕션 환경 |
|------|----------|-------------|
| 데이터베이스 | 로컬 Docker | 클라우드 (Railway PostgreSQL) |
| 환경 변수 | .env 파일 | 플랫폼 설정 |
| 코드 | 동일 | 동일 |

---

## 다음 단계

### 완료된 작업
- ✅ Docker 설치
- ✅ PostgreSQL 컨테이너 실행
- ✅ .env 파일 생성
- ✅ dotenv 설정
- ✅ 데이터베이스 스키마 생성

### 진행 중인 작업
- ⏳ 서버 실행 및 데이터베이스 연결 확인
- ⏳ 웹사이트 접속 테스트

### 예정된 작업
- [ ] 사용자 인증 기능 테스트
- [ ] 관리자 페이지 테스트
- [ ] 데이터 CRUD 작업 테스트
- [ ] Railway 배포 설정 완료

---

## 참고 자료

### 유용한 명령어

**Docker 관련:**
```bash
# 컨테이너 실행 확인
docker ps

# 컨테이너 중지
docker stop postgres-local

# 컨테이너 시작
docker start postgres-local

# 컨테이너 삭제
docker rm postgres-local
```

**데이터베이스 관련:**
```bash
# 스키마 생성/업데이트
npm run db:push

# 서버 실행
npm run dev
```

**환경 변수 확인:**
```bash
# .env 파일 내용 확인 (Windows)
type .env

# .env 파일 내용 확인 (Linux/Mac)
cat .env
```

---

## 업데이트 로그

### 2024-12-XX (초기 설정)
- Docker로 PostgreSQL 설정 완료
- .env 파일 생성 및 dotenv 설정 완료
- 데이터베이스 연결 문제 해결
- LEARNING.md 문서 생성

### 2024-12-XX (드라이버 수정)
- Neon 클라이언트 → postgres-js 드라이버로 변경
- 로컬 PostgreSQL 연결 성공
- 서버 정상 실행 확인

### 2024-12-XX (Google Cloud Run 배포)
- Dockerfile 생성 (Cloud Run 배포용)
- .dockerignore, .gcloudignore 파일 생성
- GitHub에 푸시 완료
- Cloud Run 서비스 생성: business-jun-site
- URL: https://business-jun-site-466122825675.europe-west1.run.app

---

**마지막 업데이트:** 2024년 12월 중순

