# 마스터 계정 설정 가이드

## 📋 개요

마스터 계정은 `master='Y'` 속성을 가진 최고 권한 계정입니다. 마스터 계정은 관리자 권한(`isAdmin=true`)을 자동으로 가지며, 모든 관리자 기능에 접근할 수 있습니다.

## 🔐 마스터 계정 생성

### 방법 1: 스크립트 사용 (권장)

**로컬에서 실행:**
```bash
# 환경 변수로 마스터 정보 설정
MASTER_EMAIL=master@example.com \
MASTER_PASSWORD=master1234 \
MASTER_FIRST_NAME=마스터 \
MASTER_LAST_NAME=사용자 \
MASTER_USERNAME=master \
npm run create-master
```

**기본값:**
- 이메일: `master@example.com`
- 비밀번호: `master1234`
- 이름: `Master`
- 성: `User`
- 사용자명: `master_${timestamp}`

### 방법 2: API 엔드포인트 사용

```bash
curl -X POST http://localhost:5000/api/admin/create-master \
  -H "Content-Type: application/json" \
  -d '{
    "email": "master@example.com",
    "password": "master1234",
    "firstName": "마스터",
    "lastName": "사용자",
    "username": "master"
  }'
```

### 서버에서 실행

SSH로 서버에 접속한 후:

```bash
# 서버에 접속
ssh choiyj981@35.237.229.92

# 프로젝트 디렉토리로 이동
cd ~/marketingPage

# 1. 데이터베이스 마이그레이션 실행 (master 컬럼 추가)
docker-compose -f docker-compose.prod.yml exec app npm run db:push

# 2. 마스터 계정 생성
docker-compose -f docker-compose.prod.yml exec app npm run create-master
```

## 📊 Users 테이블 구조 업데이트

### 추가된 컬럼

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `master` | VARCHAR | DEFAULT 'N' | 마스터 계정 여부 (Y: 마스터, N: 일반) |

### 마스터 계정 특징

- `master='Y'`: 마스터 계정
- `isAdmin=true`: 자동으로 관리자 권한 부여
- 모든 관리자 기능 접근 가능
- 일반 관리자와 동일한 권한

## 🔑 권한 체계

### 계정 유형별 권한

| 계정 유형 | `isAdmin` | `master` | 관리자 페이지 접근 |
|-----------|-----------|----------|-------------------|
| 일반 사용자 | `false` | `N` | ❌ |
| 관리자 | `true` | `N` | ✅ |
| 마스터 | `true` | `Y` | ✅ |

### 접근 제어 로직

```typescript
// 관리자 권한 확인
if (user.isAdmin || user.master === "Y") {
  // 관리자 기능 접근 허용
}
```

## 🛠️ 사용 방법

### 1. 마스터 계정으로 로그인

1. 웹사이트에서 `/login` 페이지로 이동
2. 마스터 계정 정보로 로그인
3. 로그인 성공 후 `/admin` 페이지로 자동 리다이렉트

### 2. 관리자 기능 사용

마스터 계정으로 로그인하면 다음 기능을 사용할 수 있습니다:

- ✅ 블로그 포스트 관리
- ✅ 제품/강의 관리
- ✅ 자료실 관리
- ✅ 서비스 관리
- ✅ 문의사항 관리
- ✅ FAQ 관리
- ✅ 리뷰 관리
- ✅ 뉴스레터 구독자 관리
- ✅ 통계 관리
- ✅ 파일 업로드
- ✅ SEO 관리

## ⚠️ 주의사항

1. **보안**: 프로덕션 환경에서는 기본 비밀번호를 반드시 변경하세요.
2. **마스터 계정**: 마스터 계정은 최고 권한이므로 신중하게 관리하세요.
3. **데이터베이스 마이그레이션**: 스키마 변경 후 반드시 `npm run db:push`를 실행하세요.

## 🔄 데이터베이스 마이그레이션

스키마 변경 후 데이터베이스에 반영:

```bash
# 로컬 개발 환경
npm run db:push

# 서버 프로덕션 환경
docker-compose -f docker-compose.prod.yml exec app npm run db:push
```

## 📝 예제

### 마스터 계정 생성 예제

```bash
# 환경 변수 설정
export MASTER_EMAIL="master@marketingpage.com"
export MASTER_PASSWORD="SecureMaster123!"
export MASTER_FIRST_NAME="마스터"
export MASTER_LAST_NAME="관리자"
export MASTER_USERNAME="master"

# 스크립트 실행
npm run create-master
```

### API를 통한 마스터 계정 생성

```bash
curl -X POST http://35.237.229.92:8080/api/admin/create-master \
  -H "Content-Type: application/json" \
  -d '{
    "email": "master@marketingpage.com",
    "password": "SecureMaster123!",
    "firstName": "마스터",
    "lastName": "관리자",
    "username": "master"
  }'
```

## 🐛 문제 해결

### "이미 존재하는 이메일입니다" 오류

기존 사용자에게 마스터 권한 부여:

```bash
# API를 통해 기존 계정에 마스터 권한 부여
curl -X POST http://localhost:5000/api/admin/create-master \
  -H "Content-Type: application/json" \
  -d '{
    "email": "existing@example.com",
    "password": "newpassword123"
  }'
```

### 데이터베이스 마이그레이션 오류

스키마 변경 후 마이그레이션이 실패하는 경우:

1. 데이터베이스 백업
2. 마이그레이션 재실행
3. 필요시 수동으로 컬럼 추가

```sql
-- PostgreSQL에서 직접 실행
ALTER TABLE users ADD COLUMN IF NOT EXISTS master VARCHAR DEFAULT 'N';
```


