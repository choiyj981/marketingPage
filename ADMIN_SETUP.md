# 관리자 계정 설정 가이드

## 테스트 관리자 계정 정보

- **이메일**: `admin@test.com`
- **비밀번호**: `admin123!`

## 관리자 계정 생성 방법

### 방법 1: API 엔드포인트 사용 (권장)

브라우저 개발자 도구 콘솔에서 다음 코드를 실행하세요:

```javascript
fetch('/api/admin/create-admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@test.com',
    password: 'admin123!'
  })
})
.then(res => res.json())
.then(data => {
  console.log('관리자 계정 생성:', data);
  alert('관리자 계정이 생성되었습니다!');
})
.catch(error => {
  console.error('오류:', error);
  alert('관리자 계정 생성 실패');
});
```

### 방법 2: 데이터베이스 직접 수정

PostgreSQL에 접속하여 직접 관리자 계정을 생성하세요:

```sql
-- PostgreSQL에 접속
psql -h localhost -U appuser -d marketingpage

-- 비밀번호 해시 생성은 Node.js에서 해야 합니다
-- 또는 기존 사용자에게 관리자 권한 부여
UPDATE users 
SET is_admin = true 
WHERE email = 'admin@test.com';
```

## 로그인 방법

1. 브라우저에서 `/login` 페이지로 이동
2. 다음 정보로 로그인:
   - 이메일: `admin@test.com`
   - 비밀번호: `admin123!`
3. 로그인 성공 후 `/admin` 페이지로 자동 리다이렉트됩니다

## 관리자 계정 생성 엔드포인트

**엔드포인트**: `POST /api/admin/create-admin`

**요청 본문**:
```json
{
  "email": "admin@test.com",
  "password": "admin123!"
}
```

**응답**:
```json
{
  "message": "관리자 계정이 생성되었습니다.",
  "user": {
    "id": "...",
    "email": "admin@test.com",
    "firstName": "Admin",
    "lastName": "User",
    "isAdmin": true
  }
}
```

**참고**: 
- 기존 계정이 있으면 관리자 권한만 부여합니다
- 비밀번호는 최소 8자 이상이어야 합니다
- 이 엔드포인트는 개발용입니다. 프로덕션 환경에서는 제거하거나 보안을 강화하세요

## 보안 고려사항

1. **프로덕션 환경**: `/api/admin/create-admin` 엔드포인트를 제거하거나 인증 추가
2. **비밀번호 강도**: 프로덕션에서는 더 강력한 비밀번호 사용
3. **HTTPS**: 프로덕션에서는 반드시 HTTPS 사용
4. **세션 관리**: 세션 만료 시간 설정 확인


