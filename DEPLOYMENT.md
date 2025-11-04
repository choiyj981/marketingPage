# 배포 가이드

## Railway로 배포하기 (가장 쉬움)

### 1단계: Railway 가입
1. https://railway.app 접속
2. "Start a New Project" 클릭
3. GitHub로 로그인

### 2단계: 프로젝트 연결
1. "Deploy from GitHub repo" 선택
2. `choiyj981/marketingPage` 저장소 선택
3. "Deploy Now" 클릭

### 3단계: PostgreSQL 데이터베이스 추가
1. 프로젝트에서 "New" → "Database" → "Add PostgreSQL"
2. 자동으로 DATABASE_URL 환경 변수가 생성됨

### 4단계: 환경 변수 설정
프로젝트 Settings → Variables에서 추가:
- `SESSION_SECRET`: 랜덤 문자열 (터미널에서 `openssl rand -hex 32` 실행)
- `NODE_ENV`: `production`
- `PORT`: `5000` (Railway가 자동 설정)

### 5단계: 데이터베이스 마이그레이션
배포 후 Railway 대시보드에서:
1. "View Logs" 클릭
2. 또는 프로젝트에서 "Deployments" → 최신 배포 → "View Logs"
3. 수동으로 마이그레이션 실행:
   - Railway 터미널에서: `npm run db:push`

### 6단계: 완료!
Railway가 자동으로 URL을 생성합니다. (예: `https://your-app.up.railway.app`)

## Render로 배포하기

### 1단계: Render 가입
1. https://render.com 접속
2. GitHub로 로그인

### 2단계: Web Service 생성
1. "New +" → "Web Service"
2. GitHub 저장소 선택 (`choiyj981/marketingPage`)
3. 설정:
   - Name: 원하는 이름
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: Free

### 3단계: PostgreSQL 데이터베이스 추가
1. "New +" → "PostgreSQL"
2. Plan: Free 선택
3. 생성된 데이터베이스의 "Internal Database URL" 복사

### 4단계: 환경 변수 설정
Web Service의 Environment 탭에서:
- `DATABASE_URL`: PostgreSQL의 Internal Database URL
- `SESSION_SECRET`: 랜덤 문자열
- `NODE_ENV`: `production`
- `PORT`: `5000` (Render가 자동 설정)

### 5단계: 배포 완료
Render가 자동으로 배포합니다. (예: `https://your-app.onrender.com`)

## 자동 배포

GitHub에 코드를 푸시하면 자동으로 배포됩니다:

```bash
git add .
git commit -m "변경사항"
git push origin main
```

배포 플랫폼이 자동으로:
1. 코드 변경 감지
2. 빌드 실행
3. 서버 재시작

