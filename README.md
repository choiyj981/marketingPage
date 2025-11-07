# 🚀 마케팅 페이지 프로젝트

> **초보자도 쉽게 따라할 수 있는 완벽한 가이드**

이 프로젝트는 React + Express.js로 만들어진 마케팅 웹사이트입니다. Docker를 사용하여 로컬과 서버에서 동일한 환경으로 실행할 수 있습니다.

---

## 📑 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [현재 구조 (아주 중요!)](#현재-구조-아주-중요)
3. [빠른 시작 (5분 안에 시작하기)](#빠른-시작-5분-안에-시작하기)
4. [기본 사용법](#기본-사용법)
5. [자동 배포 (GitHub Actions)](#자동-배포-github-actions)
6. [데이터 동기화 이해하기](#데이터-동기화-이해하기)
7. [프로젝트 구조](#프로젝트-구조)
8. [문제 해결](#문제-해결)
9. [추가 가이드](#추가-가이드)

---

## 🎯 프로젝트 개요

### 이 프로젝트는 무엇인가요?

- **마케팅 웹사이트**: 제품 소개, 블로그, FAQ 등을 관리하는 웹사이트
- **관리자 페이지**: 웹사이트 내용을 쉽게 추가/수정/삭제할 수 있는 관리 도구
- **자동화된 배포**: Docker를 사용하여 로컬과 서버에서 동일하게 실행

### 기술 스택

| 항목 | 기술 |
|------|------|
| 프론트엔드 | React + TypeScript + Tailwind CSS |
| 백엔드 | Express.js + TypeScript |
| 데이터베이스 | PostgreSQL |
| 컨테이너 | Docker + Docker Compose |
| 배포 | Google Cloud Platform (GCP) |

---

## 🏗️ 현재 구조 (아주 중요!)

### 전체 구조 다이어그램

```
┌─────────────────────────────────────────────────────────────┐
│                    현재 프로젝트 구조                          │
└─────────────────────────────────────────────────────────────┘

    [로컬 PC]                          [GCP 서버]
    ┌──────────┐                       ┌──────────┐
    │  Docker  │                       │  Docker  │
    │  ┌────┐  │                       │  ┌────┐  │
    │  │App │  │                       │  │App │  │
    │  └─┬──┘  │                       │  └─┬──┘  │
    │    │     │                       │    │     │
    └────┼─────┘                       └────┼─────┘
         │                                   │
         │  (인터넷을 통해 연결)              │
         │                                   │
         └───────────┬───────────────────────┘
                     │
                     ▼
              ┌──────────────┐
              │   PostgreSQL  │
              │   (서버 DB)   │
              │               │
              │  📊 데이터 저장 │
              └──────────────┘
```

### 핵심 포인트

✅ **로컬과 서버가 같은 데이터베이스를 사용합니다!**
- 로컬에서 데이터 추가 → 서버에도 자동 반영 ✨
- 서버에서 데이터 추가 → 로컬에도 자동 반영 ✨
- **하나의 데이터베이스, 두 곳에서 접근**

### 데이터 흐름 시퀀스 다이어그램

```
[사용자] → [로컬 웹사이트] → [서버 PostgreSQL] → [데이터 저장]
   │              │                  │
   │              │                  │
   └──────────────┴──────────────────┘
              (같은 데이터베이스)

[사용자] → [서버 웹사이트] → [서버 PostgreSQL] → [데이터 저장]
   │              │                  │
   │              │                  │
   └──────────────┴──────────────────┘
              (같은 데이터베이스)
```

---

## 🚀 빠른 시작 (5분 안에 시작하기)

### 1단계: 사전 준비

#### 필요한 것들

- ✅ Docker Desktop 설치 (Windows/Mac)
- ✅ Git 설치
- ✅ 코드 에디터 (VS Code 권장)

#### Docker Desktop 설치

1. [Docker 공식 사이트](https://www.docker.com/products/docker-desktop) 접속
2. 다운로드 및 설치
3. 설치 후 재시작
4. Docker Desktop 실행 확인

### 2단계: 프로젝트 다운로드

```bash
# 프로젝트 클론
git clone https://github.com/choiyj981/marketingPage.git

# 프로젝트 폴더로 이동
cd marketingPage
```

### 3단계: 로컬에서 실행하기

```bash
# Docker 컨테이너 시작
docker-compose up -d

# 잠시 기다린 후 (약 10초)
# 브라우저에서 http://localhost:5000 접속
```

**완료!** 🎉 이제 웹사이트가 실행 중입니다!

---

## 📖 기본 사용법

### 🔄 코드 변경 후 서버에 반영하기

#### 자동 배포 (권장) ✨

**Git에 푸시만 하면 자동으로 서버에 반영됩니다!**

```bash
# 1. 코드 수정
# 예: client/src/App.tsx 수정

# 2. Git에 커밋 및 푸시
git add .
git commit -m "변경 내용 설명"
git push origin main

# 3. 끝! 🎉
# GitHub Actions가 자동으로 서버에 배포합니다
```

**확인 방법**:
- GitHub 저장소 → "Actions" 탭에서 배포 진행 상황 확인
- 약 1-2분 후 서버에 반영 완료

#### 수동 배포 (필요시)

자동 배포가 작동하지 않을 때만 사용:

```bash
# SSH 서버 접속
ssh choiyj981@35.237.229.92

# 서버에서 실행
cd ~/marketingPage
git pull origin main
docker-compose -f docker-compose.prod.yml up -d --build
```

---

### 로컬에서 웹사이트 실행하기

#### 프로덕션 모드 (일반 사용)

```bash
# 시작
docker-compose up -d

# 중지
docker-compose down

# 재시작
docker-compose restart

# 로그 확인
docker-compose logs -f app
```

**접속 주소**: `http://localhost:5000`

#### 개발 모드 (코드 수정 시)

```bash
# 시작
docker-compose -f docker-compose.dev.yml up -d

# 중지
docker-compose -f docker-compose.dev.yml down

# 로그 확인
docker-compose -f docker-compose.dev.yml logs -f app
```

**접속 주소**: `http://localhost:5000`

**차이점**:
- 프로덕션 모드: 코드 변경 시 재시작 필요
- 개발 모드: 코드 변경 시 자동 반영 (핫 리로드)

### 관리자 페이지 사용하기

1. **관리자 계정 생성** (처음 한 번만)

   브라우저 개발자 도구 콘솔(F12)에서 실행:

   ```javascript
   fetch('/api/admin/create-admin', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       email: 'admin@example.com',
       password: 'your-password'
     })
   })
   .then(r => r.json())
   .then(console.log);
   ```

2. **로그인**

   - `http://localhost:5000/login` 접속
   - 위에서 만든 이메일과 비밀번호 입력

3. **관리자 페이지 사용**

   - 로그인 후 자동으로 `/admin` 페이지로 이동
   - 제품, 블로그, FAQ 등을 추가/수정/삭제 가능

### 데이터베이스 관리

#### 데이터베이스 스키마 생성 (처음 한 번만)

```bash
# 프로덕션 모드
docker-compose exec app npm run db:push

# 개발 모드
docker-compose -f docker-compose.dev.yml exec app npm run db:push
```

#### 데이터베이스 접속 (고급 사용자용)

```bash
# 서버 PostgreSQL에 직접 접속
docker run -it --rm postgres:15-alpine psql -h 35.237.229.92 -p 5432 -U choiyj981 -d marketingpage
```

---

## 🔄 데이터 동기화 이해하기

### Q: 로컬에서 데이터를 추가하면 서버에도 반영되나요?

**A: 네! 완전히 자동으로 반영됩니다!** ✨

### 동작 원리

```
[로컬 PC]
  └─ 웹사이트에서 "제품 추가" 버튼 클릭
      └─ 로컬 Docker 앱이 서버 PostgreSQL에 데이터 저장
          └─ 서버 PostgreSQL에 데이터 저장 완료 ✅

[서버]
  └─ 서버 웹사이트에서 확인
      └─ 서버 Docker 앱이 서버 PostgreSQL에서 데이터 읽기
          └─ 방금 추가한 제품이 보임! 🎉
```

### 실제 예시

1. **로컬에서 제품 추가**
   - `http://localhost:5000/admin` 접속
   - 제품 추가 → 저장

2. **서버에서 확인**
   - `http://35.237.229.92:8080/admin` 접속
   - 방금 추가한 제품이 보임!

3. **반대도 가능**
   - 서버에서 추가 → 로컬에서도 보임!

### 왜 이렇게 되나요?

**이유**: 로컬과 서버가 **같은 데이터베이스**를 사용하기 때문입니다!

```
로컬 Docker 앱 ──┐
                 ├──→ 서버 PostgreSQL (35.237.229.92:5432)
서버 Docker 앱 ──┘
```

---

## 🚀 자동 배포 (GitHub Actions)

### 자동 배포란?

**Git에 푸시만 하면 서버에 자동으로 반영됩니다!**

```
[로컬 PC]
  └─ git push origin main
      │
      ▼
[GitHub]
  └─ 코드 저장 완료
      │
      ▼
[GitHub Actions] ← 자동 실행!
  └─ 1. 서버에 SSH 접속
      └─ 2. git pull 실행
          └─ 3. Docker 재빌드 및 재시작
              └─ 서버에 자동 반영 완료! ✅
```

### 사용 방법

#### 1. 코드 수정

로컬에서 코드를 수정합니다:
```bash
# 예: client/src/App.tsx 파일 수정
```

#### 2. Git에 푸시

```bash
git add .
git commit -m "변경 내용 설명"
git push origin main
```

#### 3. 자동 배포 확인

1. **GitHub에서 확인**
   - 저장소 페이지 → "Actions" 탭 클릭
   - 최신 워크플로우 실행 확인
   - 초록색 체크 표시 = 성공 ✅

2. **서버에서 확인**
   - 약 1-2분 후 `http://35.237.229.92:8080` 접속
   - 변경사항이 반영되었는지 확인

### 자동 배포 설정 (이미 완료됨)

자동 배포는 이미 설정되어 있습니다:
- ✅ GitHub Actions 워크플로우 파일 생성 완료
- ✅ `.github/workflows/deploy.yml` 파일 존재

**필요한 GitHub Secrets** (이미 설정하셨다고 함):
- `SSH_PRIVATE_KEY`: SSH 개인 키
- `SSH_HOST`: 서버 IP (`35.237.229.92`)
- `SSH_USER`: SSH 사용자명 (`choiyj981`)

### 자동 배포 작동 원리

1. **GitHub Actions 트리거**
   - `main` 브랜치에 푸시하면 자동 실행

2. **SSH 접속**
   - GitHub Secrets에 저장된 SSH 키 사용
   - 서버에 자동으로 접속

3. **배포 실행**
   - 서버에서 `git pull` 실행
   - Docker 컨테이너 재빌드 및 재시작

4. **완료**
   - 서버에 변경사항 반영 완료

### 자동 배포 vs 수동 배포

| 항목 | 자동 배포 | 수동 배포 |
|------|----------|----------|
| Git 푸시 후 | 자동 실행 | SSH 접속 필요 |
| 시간 | 1-2분 | 2-3분 |
| 편의성 | 매우 편리 | 수동 작업 필요 |

---

## 📁 프로젝트 구조

```
marketingPage/
│
├── 📂 client/              # 프론트엔드 (React)
│   ├── src/
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── components/    # 재사용 컴포넌트
│   │   └── App.tsx        # 메인 앱 컴포넌트
│   └── index.html
│
├── 📂 server/              # 백엔드 (Express.js)
│   ├── index.ts           # 서버 시작 파일
│   ├── routes.ts          # API 라우트
│   ├── db.ts              # 데이터베이스 연결
│   └── storage.ts         # 데이터 저장 로직
│
├── 📂 shared/             # 공유 코드
│   └── schema.ts          # 데이터베이스 스키마
│
├── 📂 public/             # 정적 파일
│   └── uploads/          # 업로드된 파일
│
├── 📄 docker-compose.yml           # 로컬 프로덕션 모드 설정
├── 📄 docker-compose.dev.yml      # 로컬 개발 모드 설정
├── 📄 docker-compose.prod.yml     # 서버 배포 설정
├── 📄 Dockerfile                  # 프로덕션 이미지 빌드
├── 📄 Dockerfile.dev              # 개발 이미지 빌드
└── 📄 package.json                # 프로젝트 의존성
```

### 주요 파일 설명

| 파일 | 설명 |
|------|------|
| `docker-compose.yml` | 로컬에서 프로덕션 모드로 실행할 때 사용 |
| `docker-compose.dev.yml` | 로컬에서 개발 모드로 실행할 때 사용 |
| `docker-compose.prod.yml` | 서버에서 실행할 때 사용 |
| `client/src/App.tsx` | 프론트엔드 메인 파일 |
| `server/index.ts` | 백엔드 서버 시작 파일 |

---

## 🛠️ 문제 해결

### 문제 1: Docker가 실행되지 않아요

**증상**: `docker-compose up -d` 실행 시 오류

**해결**:
1. Docker Desktop이 실행 중인지 확인
2. Docker Desktop 재시작
3. 다시 시도

### 문제 2: 포트가 이미 사용 중이에요

**증상**: `port is already allocated` 오류

**해결**:
```bash
# 포트를 사용하는 프로세스 확인 (Windows)
netstat -ano | findstr :5000

# docker-compose.yml에서 포트 변경
# ports:
#   - "5001:8080"  # 5000 대신 5001 사용
```

### 문제 3: 데이터베이스 연결 실패

**증상**: `데이터베이스 연결 실패` 오류

**해결**:
1. 서버 PostgreSQL이 실행 중인지 확인
2. 방화벽 규칙 확인 (포트 5432 열려있는지)
3. 네트워크 연결 확인

### 문제 4: 관리자 페이지 접근 불가

**증상**: "접근 권한 없음" 메시지

**해결**:
1. 관리자 계정이 생성되었는지 확인
2. 올바른 이메일/비밀번호로 로그인했는지 확인
3. 관리자 계정 다시 생성

---

## 📚 추가 가이드

### 상세 가이드 문서

| 문서 | 설명 |
|------|------|
| [DOCKER_LOCAL.md](./DOCKER_LOCAL.md) | 로컬 Docker 사용법 상세 가이드 |
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | 서버 배포 가이드 |
| [ADMIN_SETUP.md](./ADMIN_SETUP.md) | 관리자 계정 설정 가이드 |
| [SSH_POSTGRES_GUIDE.md](./SSH_POSTGRES_GUIDE.md) | SSH에서 PostgreSQL 접속 가이드 |
| [LEARNING.md](./LEARNING.md) | 프로젝트 학습 로그 |

### 유용한 명령어 모음

```bash
# 컨테이너 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs -f app

# 컨테이너 재시작
docker-compose restart app

# 컨테이너 내부 접속
docker-compose exec app sh

# 데이터베이스 백업
docker-compose exec postgres pg_dump -U choiyj981 marketingpage > backup.sql
```

---

## 🎓 초보자를 위한 가이드

### Docker가 뭔가요?

**비유로 이해하기**:
- **Docker = 포장된 상자**
- 상자 안에 애플리케이션이 들어있음
- 어디서든 같은 상자를 열면 똑같이 작동함

**장점**:
- 로컬 PC에서도 서버에서도 똑같이 작동
- 환경 설정이 쉬움
- 다른 사람과 공유하기 쉬움

### PostgreSQL이 뭔가요?

**비유로 이해하기**:
- **PostgreSQL = 엑셀 파일**
- 데이터를 표 형태로 저장
- 여러 사람이 동시에 사용 가능

**이 프로젝트에서**:
- 사용자 정보, 제품 정보, 블로그 글 등을 저장
- 로컬과 서버가 같은 데이터베이스 사용

### 왜 로컬과 서버가 같은 DB를 쓰나요?

**이유**:
1. **데이터 일관성**: 어디서 추가해도 같은 데이터
2. **편의성**: 로컬에서 테스트해도 서버에 반영됨
3. **간단함**: 데이터베이스를 하나만 관리하면 됨

---

## ✅ 체크리스트

### 처음 시작할 때

- [ ] Docker Desktop 설치 완료
- [ ] 프로젝트 클론 완료
- [ ] `docker-compose up -d` 실행 성공
- [ ] `http://localhost:5000` 접속 확인
- [ ] 관리자 계정 생성 완료
- [ ] 데이터베이스 스키마 생성 완료 (`npm run db:push`)

### 일상적인 사용

- [ ] 로컬에서 웹사이트 실행 (`docker-compose up -d`)
- [ ] 관리자 페이지에서 데이터 추가/수정
- [ ] 서버에서 데이터 확인
- [ ] 필요시 컨테이너 재시작 (`docker-compose restart`)

---

## 🎯 요약

### 핵심 정리

1. **로컬과 서버가 같은 데이터베이스 사용**
   - 로컬에서 추가 → 서버에도 반영 ✅
   - 서버에서 추가 → 로컬에도 반영 ✅

2. **Docker로 간단하게 실행**
   - `docker-compose up -d` 한 줄로 시작
   - 환경 설정 걱정 없음

3. **관리자 페이지로 쉽게 관리**
   - 웹 브라우저에서 모든 것 관리
   - 코드 수정 불필요

### 다음 단계

1. 로컬에서 웹사이트 실행해보기
2. 관리자 페이지에서 데이터 추가해보기
3. 서버에서 확인해보기
4. 필요시 추가 가이드 문서 참고

---

## 📞 도움이 필요하신가요?

문제가 발생하면:
1. [문제 해결](#문제-해결) 섹션 확인
2. 각 가이드 문서 참고
3. Git 저장소의 이슈 확인

---

**마지막 업데이트**: 2025년 11월 7일
**프로젝트 상태**: ✅ 정상 작동 중
