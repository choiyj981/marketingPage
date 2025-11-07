# 관리자 계정 생성 가이드

## 📋 개요

이 가이드는 관리자 계정을 생성하고 회원가입 기능을 사용하는 방법을 설명합니다.

## 🔐 관리자 계정 생성

### 방법 1: 스크립트 사용 (권장)

로컬에서 실행:

```bash
# 환경 변수로 관리자 정보 설정
ADMIN_EMAIL=admin@example.com \
ADMIN_PASSWORD=admin1234 \
ADMIN_FIRST_NAME=관리자 \
ADMIN_LAST_NAME=사용자 \
ADMIN_USERNAME=admin \
npm run create-admin
```

또는 기본값 사용:

```bash
npm run create-admin
```

기본값:
- 이메일: `admin@example.com`
- 비밀번호: `admin1234`
- 이름: `Admin`
- 성: `User`
- 사용자명: `admin_${timestamp}`

### 방법 2: API 엔드포인트 사용

```bash
curl -X POST http://localhost:5000/api/admin/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin1234",
    "firstName": "관리자",
    "lastName": "사용자",
    "username": "admin"
  }'
```

### 서버에서 실행

SSH로 서버에 접속한 후:

```bash
# 서버에 접속
ssh choiyj981@35.237.229.92

# 프로젝트 디렉토리로 이동
cd ~/marketingPage

# Docker 컨테이너 내에서 실행
docker-compose -f docker-compose.prod.yml exec app npm run create-admin
```

## 👥 회원가입 기능

### 사용자 회원가입

1. 웹사이트에서 `/signup` 페이지로 이동
2. 다음 정보 입력:
   - **필수**: 이메일, 비밀번호, 이름, 성
   - **선택**: 사용자명, 전화번호

### 비밀번호 요구사항

- 최소 8자 이상
- 영문과 숫자 포함 필수

### 회원가입 API

```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "홍",
    "lastName": "길동",
    "username": "honggildong",
    "phone": "010-1234-5678"
  }'
```

## 📊 Users 테이블 구조

### 컬럼 정보

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | VARCHAR | PRIMARY KEY | 고유 ID (UUID) |
| `email` | VARCHAR | UNIQUE, NOT NULL | 이메일 주소 |
| `username` | VARCHAR | UNIQUE | 사용자명 (선택) |
| `password_hash` | VARCHAR | NOT NULL | 비밀번호 해시 |
| `first_name` | VARCHAR | NOT NULL | 이름 |
| `last_name` | VARCHAR | NOT NULL | 성 |
| `phone` | VARCHAR | NULL | 전화번호 (선택) |
| `profile_image_url` | VARCHAR | NULL | 프로필 이미지 URL |
| `is_admin` | BOOLEAN | NOT NULL, DEFAULT false | 관리자 여부 |
| `status` | VARCHAR | NOT NULL, DEFAULT 'active' | 상태 (active/inactive/suspended) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | 생성일시 |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | 수정일시 |

## 🔄 데이터베이스 마이그레이션

스키마 변경 후 데이터베이스에 반영:

```bash
# 로컬 개발 환경
npm run db:push

# 서버 프로덕션 환경
docker-compose -f docker-compose.prod.yml exec app npm run db:push
```

## ⚠️ 주의사항

1. **보안**: 프로덕션 환경에서는 기본 비밀번호를 반드시 변경하세요.
2. **이메일 중복**: 동일한 이메일로는 가입할 수 없습니다.
3. **사용자명 중복**: 사용자명도 고유해야 합니다 (제공된 경우).
4. **비밀번호**: 영문과 숫자를 포함한 8자 이상의 비밀번호를 사용하세요.

## 🛠️ 문제 해결

### "이미 존재하는 이메일입니다" 오류

기존 사용자에게 관리자 권한 부여:

```bash
# API를 통해 기존 계정에 관리자 권한 부여
curl -X POST http://localhost:5000/api/admin/create-admin \
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
3. 필요시 수동으로 컬럼 추가/수정

## 📝 예제

### 관리자 계정 생성 예제

```bash
# 환경 변수 설정
export ADMIN_EMAIL="admin@marketingpage.com"
export ADMIN_PASSWORD="SecurePass123!"
export ADMIN_FIRST_NAME="관리자"
export ADMIN_LAST_NAME="시스템"
export ADMIN_USERNAME="admin"

# 스크립트 실행
npm run create-admin
```

### 회원가입 예제

웹 브라우저에서:
1. `http://localhost:5000/signup` 접속
2. 폼 작성 및 제출
3. 성공 시 로그인 페이지로 리다이렉트

API를 통한 회원가입:
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "MyPass123",
    "firstName": "김",
    "lastName": "철수",
    "username": "kimcheolsu",
    "phone": "010-9876-5432"
  }'
```


