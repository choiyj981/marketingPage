---
title: "Docker 완벽 이해하기 - 초보자를 위한 실전 가이드"
slug: "docker-complete-guide"
excerpt: "Docker가 뭔지 모르는 초보자를 위한 완벽 가이드. 직접 실행 vs Docker 실행, 볼륨 마운트, 포트 설정, Docker Hub 연동까지 Mermaid 다이어그램으로 쉽게 설명합니다."
category: "개발"
imageUrl: "/uploads/images/docker-guide.jpg"
tags: ["Docker", "컨테이너", "개발환경", "배포", "DevOps", "인프라"]
publishedAt: "2025-01-15"
readTime: "25분"
author: "Business Platform"
authorImage: "/avatar.png"
featured: 1
---

# Docker 완벽 이해하기 - 초보자를 위한 실전 가이드

> Docker가 뭔지 모르는 초보자를 위한 완벽 가이드

## 📋 목차

1. [Docker란 무엇인가?](#docker란-무엇인가)
2. [직접 실행 vs Docker 실행](#직접-실행-vs-docker-실행)
3. [볼륨 마운트 완벽 이해](#볼륨-마운트-완벽-이해)
4. [포트 설정과 충돌 해결](#포트-설정과-충돌-해결)
5. [Docker Hub와 자동 배포](#docker-hub와-자동-배포)
6. [이미지 최적화 (.dockerignore)](#이미지-최적화-dockerignore)
7. [실전 팁과 주의사항](#실전-팁과-주의사항)

---

## 🐳 Docker란 무엇인가?

### 가장 쉬운 비유: 포장된 상자

Docker는 **포장된 상자**입니다. 상자 안에 애플리케이션이 들어있고, 어디서든 같은 상자를 열면 똑같이 작동합니다.

```mermaid
graph TB
    PC1[내 PC<br/>Windows]
    PC2[동료 PC<br/>Mac]
    Server[서버<br/>Linux]
    
    PC1 --> Docker[Docker 이미지<br/>포장된 상자]
    PC2 --> Docker
    Server --> Docker
    
    Docker --> Same[어디서든<br/>똑같이 작동]
    
    style Docker fill:#e1f5ff
    style Same fill:#c8e6c9
```

### 컨테이너 = 가상의 집

```mermaid
graph TB
    PC[내 PC<br/>Windows/Mac]
    PC --> DockerDesktop[Docker Desktop<br/>가상화 엔진]
    DockerDesktop --> Container[컨테이너<br/>가상의 Linux 집]
    
    Container --> NodeJS[Node.js<br/>설치됨]
    Container --> Project[프로젝트<br/>실행 중]
    
    style PC fill:#e1f5ff
    style DockerDesktop fill:#fff4e1
    style Container fill:#c8e6c9
```

### 핵심 개념

| 개념 | 설명 | 비유 |
|------|------|------|
| **Docker Desktop** | Docker를 실행하는 프로그램 | 상자 관리자 |
| **이미지** | 애플리케이션과 환경이 담긴 템플릿 | 상자 설계도 |
| **컨테이너** | 이미지를 실행한 것 | 실제 상자 |
| **볼륨 마운트** | 폴더를 연결하는 것 | 창문 |

---

## 💻 직접 실행 vs Docker 실행

### 직접 실행 = 내 집에서 살기

```mermaid
graph TB
    PC[내 PC]
    PC --> NodeJS[Node.js<br/>직접 설치]
    PC --> Project[프로젝트 폴더]
    NodeJS --> Run[npm run dev 실행]
    Project --> Run
    
    style PC fill:#e1f5ff
    style NodeJS fill:#fff4e1
```

**특징**:
- 내 PC에 직접 설치
- 내 PC 환경에 의존
- 다른 PC에서는 안 될 수 있음

### Docker 실행 = 포장된 집

```mermaid
graph TB
    PC[내 PC]
    PC --> Docker[Docker Desktop]
    Docker --> Container[컨테이너<br/>가상의 Linux]
    
    Container --> NodeJS[Node.js<br/>컨테이너 안에]
    Container --> Project[프로젝트<br/>볼륨 마운트]
    
    NodeJS --> Run[npm run dev 실행]
    Project --> Run
    
    style PC fill:#e1f5ff
    style Docker fill:#fff4e1
    style Container fill:#c8e6c9
```

**특징**:
- 가상 환경에서 실행
- 어디서든 똑같이 작동
- 내 PC와 분리됨

### 비교표

| 항목 | 직접 실행 | Docker 실행 |
|------|----------|-------------|
| 실행 위치 | 내 PC | 컨테이너 (가상 환경) |
| Node.js 위치 | 내 PC에 설치 | 컨테이너 안에 설치 |
| 파일 접근 | 직접 접근 | 볼륨 마운트로 접근 |
| 환경 의존성 | 있음 | 없음 (컨테이너 안에서 동일) |
| 다른 PC에서 | 안 될 수 있음 | 똑같이 작동 |

---

## 📁 볼륨 마운트 완벽 이해

### 볼륨 마운트 = 폴더 연결하기

가장 쉬운 비유: **USB 메모리** 또는 **창문**

```mermaid
graph LR
    Local[내 PC<br/>blog-posts 폴더]
    Local --> Mount[볼륨 마운트<br/>연결]
    Mount --> Container[컨테이너<br/>/app/blog-posts]
    
    style Local fill:#e1f5ff
    style Mount fill:#fff4e1
    style Container fill:#c8e6c9
```

### 실제 설정 예시

```yaml
volumes:
  - ./blog-posts:/app/blog-posts
```

**의미**:
- `./blog-posts` = 내 PC의 폴더
- `:/app/blog-posts` = 컨테이너 안의 폴더
- `:` = 연결 (마운트)

### 볼륨 마운트 시점

```mermaid
sequenceDiagram
    participant User as 사용자
    participant Docker as Docker
    participant Container as 컨테이너
    
    User->>Docker: docker-compose up
    Docker->>Container: 컨테이너 생성
    Docker->>Docker: 볼륨 마운트 설정
    Note over Docker: ./blog-posts → /app/blog-posts
    Docker->>Container: 연결 완료!
    Container->>Container: npm run dev 실행
    
    Note over Container: 이후 계속 연결된 상태
```

**중요**: 볼륨 마운트는 **컨테이너 시작 시 한 번만** 설정되고, 이후 계속 연결된 상태입니다.

### 파일 변경 감지 흐름

```mermaid
graph TB
    A[내가 파일 수정] --> B[Windows 파일 시스템]
    B --> C[Docker Desktop]
    C --> D[볼륨 마운트]
    D --> E[컨테이너 파일 시스템]
    E --> F[chokidar 감지]
    F --> G[동기화 실행]
    
    style A fill:#e1f5ff
    style F fill:#fff4e1
    style G fill:#c8e6c9
```

**동작 원리**:
1. 내가 파일 수정
2. Windows 파일 시스템이 변경 감지
3. Docker Desktop이 볼륨 마운트를 통해 변경 감지
4. 컨테이너 안의 파일도 업데이트
5. chokidar가 변경 감지 (polling 방식)
6. 자동 동기화 실행

### 양방향 동기화

```
[내 PC]                    [컨테이너]
  │                          │
  │  파일 수정                │
  │  ────────────────────→   │
  │                          │
  │                          │  파일 수정
  │  ←────────────────────   │
  │                          │
```

**특징**: 양방향으로 실시간 동기화됩니다.

---

## 🔌 포트 설정과 충돌 해결

### 포트 매핑 이해하기

```mermaid
graph LR
    Browser[브라우저] --> Port1[5001 포트]
    Port1 --> Docker[Docker 컨테이너]
    Docker --> Port2[5000 포트<br/>내부]
    
    style Port1 fill:#e1f5ff
    style Port2 fill:#fff4e1
```

### 포트 설정 비교

| 실행 방법 | 명령어 | 접속 포트 | 컨테이너 내부 포트 |
|----------|--------|----------|-------------------|
| **Docker 개발** | `docker-compose -f docker-compose.dev.yml up` | **5001** | 5000 |
| **Docker 프로덕션** | `docker-compose up` | **5000** | 8080 |
| **로컬 직접** | `npm run dev` | **5000** | - |

### 포트 충돌 해결

#### 문제 상황

```
[Docker 프로덕션 실행 중]
  └─ 포트 5000 사용 중
  
[로컬 서버 실행 시도]
  └─ 포트 5000 사용 시도
  └─ ❌ 충돌!
```

#### 해결 방법

```mermaid
graph TB
    Problem[포트 충돌 발생]
    Problem --> Solution1[Docker 중지]
    Problem --> Solution2[다른 포트 사용]
    
    Solution1 --> Run1[npm run dev]
    Solution2 --> Run2[PORT=5002 npm run dev]
    
    style Problem fill:#ffcdd2
    style Solution1 fill:#c8e6c9
    style Solution2 fill:#c8e6c9
```

**해결책**:
1. Docker 중지 후 로컬 실행
2. 로컬 서버를 다른 포트로 실행 (`PORT=5002 npm run dev`)

---

## 🚀 Docker Hub와 자동 배포

### Docker Hub란?

Docker Hub는 **Docker 이미지를 저장하는 클라우드 저장소**입니다. GitHub와 비슷하지만 이미지를 저장합니다.

```mermaid
graph TB
    Local[로컬 프로젝트]
    Local --> Build[Docker 이미지 빌드]
    Build --> Push[Docker Hub에 푸시]
    Push --> Hub[Docker Hub<br/>클라우드 저장소]
    
    Hub --> Server[서버에서 다운로드]
    Server --> Run[서버에서 실행]
    
    style Hub fill:#e1f5ff
    style Server fill:#fff4e1
```

### 자동 배포 흐름

```mermaid
sequenceDiagram
    participant User as 사용자
    participant GitHub as GitHub
    participant Actions as GitHub Actions
    participant DockerHub as Docker Hub
    participant Server as 서버
    
    User->>GitHub: git push origin main
    GitHub->>Actions: 워크플로우 시작
    Actions->>Actions: 1. 코드 검증
    Actions->>Actions: 2. Docker 이미지 빌드
    Actions->>DockerHub: 3. 이미지 푸시 (자동!)
    Actions->>Server: 4. 서버 배포
    Server->>DockerHub: 5. 이미지 다운로드
    Server->>Server: 6. 컨테이너 실행
```

### 반영 시점

| 시점 | 동작 |
|------|------|
| **git push** | GitHub에 코드 푸시 |
| **자동 실행** | GitHub Actions 시작 (약 2-5분) |
| **Docker Hub 반영** | 이미지 빌드 및 푸시 완료 |
| **서버 배포** | 서버에 자동 배포 |

**중요**: 직접 반영할 필요 없습니다! `git push`만 하면 자동으로 반영됩니다.

---

## 🎯 이미지 최적화 (.dockerignore)

### .dockerignore란?

`.dockerignore`는 Docker 이미지 빌드 시 **제외할 파일/폴더를 지정**하는 파일입니다. `.gitignore`와 비슷합니다.

### 왜 필요한가?

```mermaid
graph TB
    Without[.dockerignore 없음]
    Without --> Large[큰 이미지<br/>불필요한 파일 포함]
    
    With[.dockerignore 있음]
    With --> Small[작은 이미지<br/>필요한 파일만]
    
    style Large fill:#ffcdd2
    style Small fill:#c8e6c9
```

### 볼륨 마운트를 사용할 때

```
[이미지 빌드 시]
  └─ blog-posts 포함 (10MB)
  └─ 이미지 크기: 300MB

[프로덕션 실행 시]
  └─ 볼륨 마운트로 덮어씌움
  └─ 이미지의 blog-posts: 사용 안 됨 ❌
```

**문제점**:
- 불필요한 용량 사용
- 빌드 시간 증가
- 업로드 시간 증가

### 최적화 후

```
[이미지 빌드 시]
  └─ blog-posts 제외
  └─ 이미지 크기: 290MB (-10MB)

[프로덕션 실행 시]
  └─ 볼륨 마운트만 사용
  └─ 서버의 blog-posts 사용 ✅
```

**장점**:
- 이미지 크기 감소
- 빌드 시간 단축
- 업로드 시간 단축

### .dockerignore 예시

```dockerignore
node_modules
dist
.env
.env.local
.git
.DS_Store
*.log
public/uploads
attached_assets
blog-posts  # 볼륨 마운트 사용 시 제외
```

---

## 💡 실전 팁과 주의사항

### Docker Desktop은 항상 켜져있어야 함

```mermaid
graph TB
    PC[내 PC]
    PC --> DockerDesktop{Docker Desktop<br/>켜져있나?}
    DockerDesktop -->|켜져있음| Container{컨테이너<br/>실행 중?}
    DockerDesktop -->|꺼져있음| Stop[작동 안 함]
    
    Container -->|실행 중| Working[볼륨 마운트 작동<br/>파일 동기화됨]
    Container -->|중지됨| Stop2[작동 안 함]
    
    style Working fill:#c8e6c9
    style Stop fill:#ffcdd2
    style Stop2 fill:#ffcdd2
```

### 컨테이너는 리눅스 환경

| 항목 | 설명 |
|------|------|
| **내 PC** | Windows/Mac 가능 |
| **컨테이너 안** | 리눅스 환경 |
| **이유** | Docker Desktop이 가상화로 리눅스 환경 제공 |

**비유**: 내 집은 Windows지만, 상자 안(컨테이너)은 리눅스입니다.

### 볼륨 마운트 vs Git

```mermaid
graph LR
    subgraph Git["Git (버전 관리)"]
        G1[변경사항 추적]
        G2[히스토리 저장]
        G3[커밋/푸시 필요]
        G1 --> G2 --> G3
    end
    
    subgraph Volume["볼륨 마운트 (폴더 공유)"]
        V1[실시간 동기화]
        V2[추적 안 함]
        V3[즉시 반영]
        V1 --> V2 --> V3
    end
    
    style Git fill:#e1f5ff
    style Volume fill:#fff4e1
```

**차이점**:
- **Git**: 버전 관리 (추적, 히스토리)
- **볼륨 마운트**: 폴더 공유 (실시간 동기화)

### 파일 변경 감지 (chokidar)

```mermaid
graph TB
    File[파일 수정] --> Windows[Windows 파일 시스템]
    Windows --> Docker[Docker Desktop]
    Docker --> Volume[볼륨 마운트]
    Volume --> Container[컨테이너]
    Container --> Chokidar[chokidar 감지<br/>polling 방식]
    Chokidar --> Sync[동기화 실행]
    
    style File fill:#e1f5ff
    style Chokidar fill:#fff4e1
    style Sync fill:#c8e6c9
```

**Polling 방식**: 주기적으로 파일을 확인하여 변경을 감지합니다. Docker 환경에서 안정적으로 작동합니다.

---

## 🎓 핵심 정리

### Docker의 핵심 개념

1. **컨테이너 = 가상의 집**
   - 내 PC는 Windows/Mac 가능
   - 컨테이너 안은 리눅스 환경
   - 어디서든 똑같이 작동

2. **볼륨 마운트 = 폴더 연결**
   - 내 PC 폴더 ↔ 컨테이너 폴더
   - 실시간 동기화
   - 컨테이너 시작 시 한 번만 설정

3. **Docker Hub = 이미지 저장소**
   - `git push`만 하면 자동 반영
   - 직접 작업 불필요
   - 서버에서 자동 다운로드

4. **이미지 최적화**
   - `.dockerignore`로 불필요한 파일 제외
   - 볼륨 마운트 사용 시 이미지에 포함 불필요
   - 이미지 크기 감소

### 실전 체크리스트

- [ ] Docker Desktop 설치 및 실행 확인
- [ ] 포트 충돌 확인 (5000 vs 5001)
- [ ] 볼륨 마운트 설정 확인
- [ ] `.dockerignore` 최적화
- [ ] GitHub Actions 자동 배포 확인

---

## 📚 다음 단계

이제 Docker를 이해했으니, 다음을 학습해보세요:

1. **Docker Compose**: 여러 컨테이너 관리
2. **Docker 네트워크**: 컨테이너 간 통신
3. **Docker 볼륨**: 데이터 영구 저장
4. **Kubernetes**: 컨테이너 오케스트레이션

---

**작성일**: 2025년 1월 15일  
**태그**: #Docker #컨테이너 #개발환경 #배포 #DevOps #인프라

