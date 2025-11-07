# GitHub Secrets 설정 가이드

이 문서는 GitHub Actions 자동 배포를 위한 Secrets 설정 방법을 설명합니다.

## 🔐 필요한 GitHub Secrets

GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**에서 다음을 추가하세요:

### 1. DOCKER_USERNAME
- **이름**: `DOCKER_USERNAME`
- **값**: `docckerchoi`
- **설명**: Docker Hub 사용자명

### 2. DOCKER_PASSWORD
- **이름**: `DOCKER_PASSWORD`
- **값**: Docker Hub 비밀번호 또는 Access Token
- **설명**: Docker Hub 비밀번호 (보안을 위해 Access Token 권장)

### 3. SSH_PRIVATE_KEY (이미 설정되어 있을 수 있음)
- **이름**: `SSH_PRIVATE_KEY`
- **값**: SSH 개인 키 전체 내용
- **설명**: 서버 SSH 접속용 개인 키

### 4. SSH_HOST (이미 설정되어 있을 수 있음)
- **이름**: `SSH_HOST`
- **값**: `35.237.229.92`
- **설명**: 서버 IP 주소

### 5. SSH_USER (이미 설정되어 있을 수 있음)
- **이름**: `SSH_USER`
- **값**: `choiyj981`
- **설명**: SSH 사용자명

## 📝 Docker Hub Access Token 생성 방법 (권장)

비밀번호 대신 Access Token을 사용하는 것이 더 안전합니다:

1. [Docker Hub](https://hub.docker.com/) 로그인
2. 계정 설정 → **Security** → **New Access Token**
3. 토큰 이름 입력 (예: `github-actions`)
4. 권한: **Read & Write** 선택
5. 생성된 토큰을 복사하여 `DOCKER_PASSWORD`에 저장

## ✅ 확인 방법

모든 Secrets가 설정되었는지 확인:
- [ ] DOCKER_USERNAME
- [ ] DOCKER_PASSWORD
- [ ] SSH_PRIVATE_KEY
- [ ] SSH_HOST
- [ ] SSH_USER

## 🚨 중요 사항

- Secrets는 한 번 설정하면 값이 보이지 않습니다
- 수정하려면 삭제 후 다시 생성해야 합니다
- Access Token은 생성 시 한 번만 보이므로 안전하게 저장하세요

