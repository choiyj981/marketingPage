# SSH에서 PostgreSQL 접속 가이드

## 🚀 빠른 접속 방법

### 방법 1: 직접 명령어 실행 (가장 빠름)

SSH 서버에 접속한 후:

```bash
cd ~/marketingPage
docker-compose -f docker-compose.prod.yml exec postgres psql -U choiyj981 -d marketingpage
```

### 방법 2: 스크립트 사용

1. **로컬에서 스크립트를 서버로 전송**:
```bash
scp ssh_postgres.sh docckerchoi@34.73.27.245:~/marketingPage/
```

2. **SSH 서버에서 실행 권한 부여**:
```bash
ssh docckerchoi@34.73.27.245
cd ~/marketingPage
chmod +x ssh_postgres.sh
```

3. **스크립트 실행**:
```bash
./ssh_postgres.sh
```

### 방법 3: 별칭(alias) 설정 (가장 편리함)

SSH 서버의 `~/.bashrc` 또는 `~/.bash_aliases` 파일에 추가:

```bash
# ~/.bashrc 파일 편집
nano ~/.bashrc

# 다음 줄 추가
alias pg='cd ~/marketingPage && docker-compose -f docker-compose.prod.yml exec postgres psql -U choiyj981 -d marketingpage'

# 저장 후 적용
source ~/.bashrc
```

이제 SSH 서버에서 `pg` 명령어만 입력하면 PostgreSQL에 접속됩니다!

---

## 📝 PostgreSQL 사용법

### 접속 후 유용한 명령어

```sql
-- 모든 테이블 목록 보기
\dt

-- 특정 테이블 구조 보기
\d 테이블명

-- 데이터 조회
SELECT * FROM users LIMIT 10;

-- 데이터베이스 목록 보기
\l

-- 현재 데이터베이스 정보 보기
\conninfo

-- PostgreSQL 종료
\q
```

### 빠르게 나가기

PostgreSQL 프롬프트에서:
- `\q` 입력 후 엔터
- 또는 `Ctrl+D`

---

## 🔧 문제 해결

### 컨테이너가 실행 중이 아닌 경우

```bash
# 컨테이너 상태 확인
docker-compose -f docker-compose.prod.yml ps

# 컨테이너가 중지되어 있으면 시작
docker-compose -f docker-compose.prod.yml start postgres

# 또는 전체 재시작
docker-compose -f docker-compose.prod.yml up -d
```

### 프로젝트 디렉토리를 찾을 수 없는 경우

```bash
# 프로젝트 디렉토리 찾기
find ~ -name "docker-compose.prod.yml" -type f 2>/dev/null

# 또는 직접 경로 지정
docker-compose -f /경로/로/docker-compose.prod.yml exec postgres psql -U choiyj981 -d marketingpage
```

---

## 💡 팁

1. **빠른 쿼리 실행**: 한 줄로 쿼리 실행
```bash
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U choiyj981 -d marketingpage -c "SELECT COUNT(*) FROM users;"
```

2. **백업 생성**: 접속 없이 백업
```bash
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U choiyj981 marketingpage > backup_$(date +%Y%m%d).sql
```

3. **데이터 복원**: 접속 없이 복원
```bash
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U choiyj981 -d marketingpage < backup.sql
```

