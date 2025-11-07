# 마스터 계정 설정 가이드

## 🎯 목표

USERS 테이블에 마스터 계정(`master='Y'`)을 생성하고, 해당 계정으로 관리자 모드에 접근할 수 있도록 설정합니다.

## 📋 생성될 계정 정보

- **이메일**: `master@example.com`
- **비밀번호**: `master1234`
- **이름**: 마스터
- **성**: 관리자
- **사용자명**: `master`
- **마스터 권한**: `Y`
- **관리자 권한**: `true`

## 🚀 서버에서 실행 방법

### 1단계: 서버 접속

```bash
ssh choiyj981@35.237.229.92
```

### 2단계: 프로젝트 디렉토리로 이동

```bash
cd ~/marketingPage
```

### 3단계: 데이터베이스 마이그레이션 실행 (master 컬럼 추가)

```bash
docker-compose -f docker-compose.prod.yml exec app npm run db:push
```

**예상 출력:**
```
[✓] Pulling schema from database...
[✓] Changes applied
```

### 4단계: 마스터 계정 생성

```bash
docker-compose -f docker-compose.prod.yml exec app npm run insert-master
```

**예상 출력:**
```
🔐 USERS 테이블에 마스터 계정 생성 중...
📧 이메일: master@example.com
👤 이름: 마스터 관리자
🔑 사용자명: master
⭐ 마스터 권한: Y
🔒 관리자 권한: true

✅ 마스터 계정이 USERS 테이블에 성공적으로 생성되었습니다!
   사용자 ID: [UUID]
   이메일: master@example.com
   사용자명: master
   관리자 여부: true
   마스터 여부: Y
   상태: active

📝 로그인 정보:
   이메일: master@example.com
   비밀번호: master1234

🌐 관리자 페이지 접속:
   http://35.237.229.92:8080/login

✨ 이 계정으로 로그인하면 관리자 모드에 접근할 수 있습니다!
```

## ✅ 확인 방법

### 1. 데이터베이스에서 확인

```bash
# PostgreSQL에 접속
docker run -it --rm postgres:15-alpine psql -h 35.237.229.92 -p 5432 -U choiyj981 -d marketingpage

# USERS 테이블 조회
SELECT id, email, username, first_name, last_name, is_admin, master, status FROM users WHERE master = 'Y';
```

### 2. 웹사이트에서 로그인 테스트

1. 브라우저에서 `http://35.237.229.92:8080/login` 접속
2. 다음 정보로 로그인:
   - 이메일: `master@example.com`
   - 비밀번호: `master1234`
3. 로그인 성공 시 `/admin` 페이지로 자동 리다이렉트
4. 관리자 대시보드가 표시되면 성공!

## 🔐 권한 확인

마스터 계정(`master='Y'`)은 다음 권한을 가집니다:

- ✅ 관리자 페이지 접근 (`/admin/*`)
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

## 📊 USERS 테이블 구조

마스터 계정 생성 후 테이블 구조:

| 컬럼명 | 값 | 설명 |
|--------|-----|------|
| `id` | UUID | 고유 ID |
| `email` | `master@example.com` | 이메일 |
| `username` | `master` | 사용자명 |
| `password_hash` | 해시값 | 비밀번호 해시 |
| `first_name` | `마스터` | 이름 |
| `last_name` | `관리자` | 성 |
| `is_admin` | `true` | 관리자 권한 |
| `master` | `Y` | 마스터 계정 |
| `status` | `active` | 상태 |
| `created_at` | 현재 시간 | 생성일시 |
| `updated_at` | 현재 시간 | 수정일시 |

## 🔄 전체 실행 명령어 (한 번에)

```bash
# 서버 접속
ssh choiyj981@35.237.229.92

# 프로젝트 디렉토리로 이동
cd ~/marketingPage

# 마이그레이션 실행
docker-compose -f docker-compose.prod.yml exec app npm run db:push

# 마스터 계정 생성
docker-compose -f docker-compose.prod.yml exec app npm run insert-master
```

## ⚠️ 문제 해결

### 오류: "column 'master' does not exist"

**원인**: 데이터베이스 마이그레이션이 실행되지 않았습니다.

**해결**:
```bash
docker-compose -f docker-compose.prod.yml exec app npm run db:push
```

### 오류: "이미 존재하는 이메일입니다"

**원인**: 동일한 이메일의 계정이 이미 존재합니다.

**해결**: 기존 계정에 마스터 권한이 부여됩니다. 계속 진행하세요.

### 로그인 후 관리자 페이지에 접근할 수 없음

**확인 사항**:
1. `master='Y'`인지 확인
2. `isAdmin=true`인지 확인
3. 브라우저 캐시 삭제 후 재시도

## 📝 참고

- 마스터 계정은 최고 권한 계정입니다.
- 프로덕션 환경에서는 비밀번호를 변경하세요.
- 마스터 계정 정보는 안전하게 보관하세요.


