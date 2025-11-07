# EC2에서 PostgreSQL 설정 가이드

이 문서는 AWS EC2 인스턴스 내에서 PostgreSQL을 설치하고 애플리케이션과 연결하는 방법을 설명합니다.

## 목차

1. [EC2에 PostgreSQL 설치](#1-ec2에-postgresql-설치)
2. [PostgreSQL 데이터베이스 생성](#2-postgresql-데이터베이스-생성)
3. [환경 변수 설정](#3-환경-변수-설정)
4. [데이터베이스 스키마 생성](#4-데이터베이스-스키마-생성)
5. [보안 설정](#5-보안-설정)
6. [애플리케이션 실행](#6-애플리케이션-실행)
7. [문제 해결](#7-문제-해결)

---

## 1. EC2에 PostgreSQL 설치

### 1-1. EC2 인스턴스에 접속

SSH를 사용하여 EC2 인스턴스에 접속합니다:

```bash
ssh -i your-key.pem ec2-user@your-ec2-ip
```

또는 Ubuntu인 경우:

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 1-2. 시스템 업데이트

```bash
# Amazon Linux 2 / RHEL / CentOS
sudo yum update -y

# Ubuntu / Debian
sudo apt update && sudo apt upgrade -y
```

### 1-3. PostgreSQL 설치

#### Amazon Linux 2 / RHEL / CentOS의 경우:

```bash
# PostgreSQL 리포지토리 추가
sudo amazon-linux-extras enable postgresql14

# 또는 PostgreSQL 공식 리포지토리 사용
sudo tee /etc/yum.repos.d/pgdg.repo<<EOF
[pgdg14]
name=PostgreSQL 14 for RHEL/CentOS 7 - x86_64
baseurl=https://download.postgresql.org/pub/repos/yum/14/redhat/rhel-7-x86_64
enabled=1
gpgcheck=0
EOF

# PostgreSQL 설치
sudo yum install postgresql14 postgresql14-server -y

# PostgreSQL 초기화
sudo /usr/pgsql-14/bin/postgresql-14-setup initdb

# PostgreSQL 서비스 시작 및 자동 시작 설정
sudo systemctl enable postgresql-14
sudo systemctl start postgresql-14
```

#### Ubuntu / Debian의 경우:

```bash
# PostgreSQL 설치
sudo apt install postgresql postgresql-contrib -y

# PostgreSQL 서비스 시작 및 자동 시작 설정
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

### 1-4. PostgreSQL 서비스 상태 확인

```bash
# Amazon Linux 2 / RHEL / CentOS
sudo systemctl status postgresql-14

# Ubuntu / Debian
sudo systemctl status postgresql
```

정상적으로 실행 중이면 `active (running)` 상태가 표시됩니다.

---

## 2. PostgreSQL 데이터베이스 생성

### 2-1. PostgreSQL 사용자로 전환

```bash
# postgres 사용자로 전환
sudo -u postgres psql
```

### 2-2. 데이터베이스 및 사용자 생성

PostgreSQL 프롬프트에서 다음 명령어를 실행합니다:

```sql
-- 새 데이터베이스 생성
CREATE DATABASE marketingpage;

-- 새 사용자 생성 (비밀번호는 원하는 것으로 변경)
CREATE USER appuser WITH PASSWORD 'your_secure_password_here';

-- 사용자에게 데이터베이스 권한 부여
GRANT ALL PRIVILEGES ON DATABASE marketingpage TO appuser;

-- PostgreSQL 15 이상의 경우 추가 권한 필요
ALTER DATABASE marketingpage OWNER TO appuser;

-- 연결 종료
\q
```

### 2-3. pg_hba.conf 설정 (로컬 접속 허용)

PostgreSQL이 로컬에서 접속을 허용하도록 설정합니다:

```bash
# pg_hba.conf 파일 찾기
sudo find / -name pg_hba.conf 2>/dev/null

# 일반적인 위치:
# Amazon Linux 2: /var/lib/pgsql/14/data/pg_hba.conf
# Ubuntu: /etc/postgresql/14/main/pg_hba.conf (버전에 따라 다를 수 있음)
```

파일을 편집합니다:

```bash
# Amazon Linux 2
sudo nano /var/lib/pgsql/14/data/pg_hba.conf

# Ubuntu
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

다음 줄을 찾아서 수정하거나 추가합니다:

```
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5
```

또는 더 느슨한 설정 (로컬 네트워크 전체 허용):

```
host    all             all             127.0.0.1/32            md5
host    all             all             0.0.0.0/0               md5
```

### 2-4. PostgreSQL 설정 파일 수정 (필요시)

`postgresql.conf` 파일을 편집하여 로컬 연결을 허용합니다:

```bash
# postgresql.conf 파일 찾기
sudo find / -name postgresql.conf 2>/dev/null

# 일반적인 위치:
# Amazon Linux 2: /var/lib/pgsql/14/data/postgresql.conf
# Ubuntu: /etc/postgresql/14/main/postgresql.conf
```

파일을 편집합니다:

```bash
# Amazon Linux 2
sudo nano /var/lib/pgsql/14/data/postgresql.conf

# Ubuntu
sudo nano /etc/postgresql/14/main/postgresql.conf
```

다음 설정을 확인하고 필요시 수정합니다:

```
listen_addresses = 'localhost'  # 또는 '*' (모든 인터페이스)
port = 5432
```

### 2-5. PostgreSQL 재시작

설정 변경 후 PostgreSQL을 재시작합니다:

```bash
# Amazon Linux 2 / RHEL / CentOS
sudo systemctl restart postgresql-14

# Ubuntu / Debian
sudo systemctl restart postgresql
```

### 2-6. 연결 테스트

새로 생성한 사용자와 데이터베이스로 연결을 테스트합니다:

```bash
psql -h localhost -U appuser -d marketingpage
```

비밀번호를 입력하면 PostgreSQL 프롬프트가 표시됩니다.

---

## 3. 환경 변수 설정

### 3-1. .env 파일 생성

EC2 인스턴스에서 프로젝트 디렉토리로 이동한 후 `.env` 파일을 생성합니다:

```bash
cd /path/to/your/project
nano .env
```

### 3-2. DATABASE_URL 설정

`.env` 파일에 다음 내용을 추가합니다:

```env
# EC2 내부에서 PostgreSQL 연결 (localhost 사용)
DATABASE_URL=postgresql://appuser:your_secure_password_here@localhost:5432/marketingpage

# 다른 환경 변수들
SESSION_SECRET=your-session-secret-key-here
PORT=5000
NODE_ENV=production
```

**DATABASE_URL 형식:**
```
postgresql://사용자명:비밀번호@호스트:포트/데이터베이스명
```

**EC2 내부에서 사용 시:**
- 호스트: `localhost` 또는 `127.0.0.1`
- 포트: `5432` (기본값)
- 사용자명: 위에서 생성한 사용자 (예: `appuser`)
- 비밀번호: 위에서 설정한 비밀번호
- 데이터베이스명: 위에서 생성한 데이터베이스 (예: `marketingpage`)

### 3-3. .env 파일 권한 설정

보안을 위해 `.env` 파일의 권한을 제한합니다:

```bash
chmod 600 .env
```

이렇게 하면 파일 소유자만 읽고 쓸 수 있습니다.

---

## 4. 데이터베이스 스키마 생성

### 4-1. 프로젝트 의존성 설치

EC2 인스턴스에서 프로젝트를 클론하고 의존성을 설치합니다:

```bash
# Git에서 프로젝트 클론 (예시)
git clone your-repository-url
cd your-project-directory

# Node.js 설치 확인 (필요시)
node --version
npm --version

# 의존성 설치
npm install
```

### 4-2. 데이터베이스 스키마 생성

Drizzle을 사용하여 데이터베이스 스키마를 생성합니다:

```bash
npm run db:push
```

이 명령어는 `shared/schema.ts` 파일에 정의된 테이블들을 PostgreSQL 데이터베이스에 생성합니다.

### 4-3. 생성된 테이블 확인

PostgreSQL에 접속하여 테이블이 생성되었는지 확인합니다:

```bash
psql -h localhost -U appuser -d marketingpage
```

PostgreSQL 프롬프트에서:

```sql
-- 테이블 목록 확인
\dt

-- 특정 테이블 구조 확인
\d users
\d blog_posts

-- 종료
\q
```

---

## 5. 보안 설정

### 5-1. EC2 보안 그룹 설정

외부에서 PostgreSQL에 직접 접근할 필요가 없다면, 보안 그룹에서 PostgreSQL 포트(5432)를 열지 않아도 됩니다. 애플리케이션은 EC2 내부에서 `localhost`로 접속하므로 외부 접근이 필요하지 않습니다.

**보안 그룹 설정 권장사항:**
- **인바운드 규칙:**
  - HTTP (포트 80): 0.0.0.0/0 또는 특정 IP
  - HTTPS (포트 443): 0.0.0.0/0 또는 특정 IP
  - 애플리케이션 포트 (예: 5000): 필요한 경우
  - SSH (포트 22): 자신의 IP만
  - **PostgreSQL (포트 5432): 외부 접근 불필요 (열지 않음)**

- **아웃바운드 규칙:**
  - 모든 트래픽 허용 (기본값)

### 5-2. 방화벽 설정 (iptables)

EC2에서 방화벽을 사용하는 경우, PostgreSQL 포트는 로컬에서만 접근 가능하도록 설정합니다:

```bash
# iptables 규칙 확인
sudo iptables -L -n

# PostgreSQL 포트를 로컬에서만 허용 (이미 기본값이므로 보통 필요 없음)
# 외부 접근을 완전히 차단하려면:
sudo iptables -A INPUT -p tcp --dport 5432 -s 127.0.0.1 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 5432 -j DROP
```

### 5-3. 비밀번호 보안

- 강력한 비밀번호 사용
- `.env` 파일을 Git에 커밋하지 않기 (`.gitignore`에 추가)
- 정기적으로 비밀번호 변경

---

## 6. 애플리케이션 실행

### 6-1. 프로젝트 빌드

프로덕션 환경에서는 먼저 빌드합니다:

```bash
npm run build
```

### 6-2. 애플리케이션 시작

#### 개발 환경 (PM2 사용 권장):

PM2를 설치하여 프로세스 관리:

```bash
# PM2 설치
npm install -g pm2

# 개발 모드로 실행
pm2 start npm --name "app" -- run dev

# 또는 프로덕션 모드
pm2 start npm --name "app" -- start

# PM2 상태 확인
pm2 status

# 로그 확인
pm2 logs

# 시스템 재시작 시 자동 시작 설정
pm2 startup
pm2 save
```

#### 직접 실행:

```bash
# 개발 모드
npm run dev

# 프로덕션 모드
npm run start
```

### 6-3. 연결 확인

애플리케이션이 시작되면 콘솔에 다음과 같은 메시지가 표시되어야 합니다:

```
✓ 데이터베이스 연결 성공
serving on port 5000
```

---

## 7. 문제 해결

### 7-1. PostgreSQL 연결 실패

**증상:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**해결 방법:**

1. PostgreSQL 서비스 상태 확인:
   ```bash
   sudo systemctl status postgresql-14  # 또는 postgresql
   ```

2. PostgreSQL 포트 확인:
   ```bash
   sudo netstat -tlnp | grep 5432
   # 또는
   sudo ss -tlnp | grep 5432
   ```

3. `pg_hba.conf` 설정 확인:
   ```bash
   sudo cat /var/lib/pgsql/14/data/pg_hba.conf | grep -v "^#"
   ```

4. PostgreSQL 로그 확인:
   ```bash
   # Amazon Linux 2
   sudo tail -f /var/lib/pgsql/14/data/log/postgresql-*.log
   
   # Ubuntu
   sudo tail -f /var/log/postgresql/postgresql-14-main.log
   ```

### 7-2. 인증 실패

**증상:**
```
Error: password authentication failed for user "appuser"
```

**해결 방법:**

1. 사용자 비밀번호 재설정:
   ```bash
   sudo -u postgres psql
   ```
   ```sql
   ALTER USER appuser WITH PASSWORD 'new_password';
   \q
   ```

2. `.env` 파일의 `DATABASE_URL` 비밀번호 확인

3. `pg_hba.conf`에서 `md5` 인증 방식 확인

### 7-3. 데이터베이스가 존재하지 않음

**증상:**
```
Error: database "marketingpage" does not exist
```

**해결 방법:**

1. 데이터베이스 생성 확인:
   ```bash
   sudo -u postgres psql -l
   ```

2. 데이터베이스가 없으면 생성:
   ```bash
   sudo -u postgres psql
   ```
   ```sql
   CREATE DATABASE marketingpage;
   GRANT ALL PRIVILEGES ON DATABASE marketingpage TO appuser;
   \q
   ```

### 7-4. 권한 오류

**증상:**
```
Error: permission denied for schema public
```

**해결 방법:**

PostgreSQL에 접속하여 권한을 부여합니다:

```bash
sudo -u postgres psql -d marketingpage
```

```sql
GRANT ALL ON SCHEMA public TO appuser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO appuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO appuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO appuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO appuser;
\q
```

### 7-5. 환경 변수가 로드되지 않음

**증상:**
```
⚠️  DATABASE_URL이 설정되지 않았습니다.
```

**해결 방법:**

1. `.env` 파일이 프로젝트 루트에 있는지 확인
2. `server/index.ts`에 `import "dotenv/config";`가 있는지 확인
3. `dotenv` 패키지가 설치되어 있는지 확인:
   ```bash
   npm list dotenv
   ```

---

## 요약

EC2에서 PostgreSQL을 사용하는 기본 단계:

1. ✅ PostgreSQL 설치 및 서비스 시작
2. ✅ 데이터베이스 및 사용자 생성
3. ✅ `pg_hba.conf` 설정으로 로컬 접속 허용
4. ✅ `.env` 파일에 `DATABASE_URL` 설정 (localhost 사용)
5. ✅ 데이터베이스 스키마 생성 (`npm run db:push`)
6. ✅ 애플리케이션 실행 및 연결 확인

**DATABASE_URL 예시:**
```
DATABASE_URL=postgresql://appuser:your_password@localhost:5432/marketingpage
```

이제 애플리케이션이 EC2 내부의 PostgreSQL 데이터베이스와 연결되어 작동합니다!



