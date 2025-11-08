# 🚀 소스 반영 및 배포 로직 구조 (간단 버전)

## 핵심 구조 다이어그램

```mermaid
flowchart TD
    Start([👨‍💻 개발자<br/>코드 작성]) --> Git[📁 Git<br/>커밋 & 푸시]
    
    Git -->|git push origin main| GitHub[☁️ GitHub<br/>코드 저장]
    
    GitHub -->|트리거| Actions[🤖 GitHub Actions<br/>자동 실행]
    
    Actions --> Step1[1️⃣ 검증<br/>코드 체크 & 빌드 테스트]
    Step1 -->|✅ 통과| Step2[2️⃣ Docker 이미지 빌드<br/>애플리케이션 패키징]
    Step2 -->|푸시| DockerHub[🐳 Docker Hub<br/>이미지 저장소]
    
    DockerHub -->|다운로드| Server[🖥️ 운영 서버<br/>배포 실행]
    
    Server --> Step3[3️⃣ 최신 코드 가져오기<br/>git pull]
    Step3 --> Step4[4️⃣ 최신 이미지 가져오기<br/>docker-compose pull]
    Step4 --> Step5[5️⃣ 컨테이너 재시작<br/>docker-compose up -d]
    
    Step5 --> End([✅ 배포 완료<br/>서버 업데이트됨])
    
    Step1 -->|❌ 실패| Fail([❌ 중단])
    
    style Start fill:#e1f5ff
    style Git fill:#fff3cd
    style GitHub fill:#d1ecf1
    style Actions fill:#f8d7da
    style DockerHub fill:#d4edda
    style Server fill:#e1f5ff
    style End fill:#d4edda
    style Fail fill:#f8d7da
```

---

## 단계별 상세 구조

```mermaid
sequenceDiagram
    autonumber
    
    participant Dev as 👨‍💻 개발자
    participant Git as 📁 Git
    participant GitHub as ☁️ GitHub
    participant Actions as 🤖 GitHub Actions
    participant DockerHub as 🐳 Docker Hub
    participant Server as 🖥️ 서버

    Note over Dev,Server: ===== 1단계: 코드 작성 및 푸시 =====
    Dev->>Git: 코드 작성/수정
    Dev->>Git: git add . & commit
    Dev->>GitHub: git push origin main

    Note over Dev,Server: ===== 2단계: GitHub Actions 자동 실행 =====
    GitHub->>Actions: 푸시 감지 (트리거)
    
    Actions->>Actions: 검증 (코드 체크, 빌드 테스트)
    Actions->>Actions: Docker 이미지 빌드
    Actions->>DockerHub: 이미지 푸시

    Note over Dev,Server: ===== 3단계: 서버 배포 =====
    Actions->>Server: SSH 접속
    Server->>GitHub: git pull (최신 코드)
    Server->>DockerHub: docker-compose pull (최신 이미지)
    Server->>Server: 컨테이너 재시작
    Server-->>Actions: 배포 완료
```

---

## GitHub Actions 3단계 구조

```mermaid
graph LR
    Trigger[git push] --> Actions[GitHub Actions 시작]
    
    Actions --> Job1[Job 1: validate<br/>검증]
    Job1 -->|통과| Job2[Job 2: build-and-push<br/>Docker 이미지 빌드]
    Job2 -->|완료| Job3[Job 3: deploy<br/>서버 배포]
    
    Job1 -->|실패| Stop1[❌ 중단]
    Job2 -->|실패| Stop2[❌ 중단]
    Job3 -->|완료| Success[✅ 배포 완료]
    
    style Trigger fill:#e1f5ff
    style Actions fill:#fff3cd
    style Job1 fill:#d1ecf1
    style Job2 fill:#d1ecf1
    style Job3 fill:#d1ecf1
    style Success fill:#d4edda
    style Stop1 fill:#f8d7da
    style Stop2 fill:#f8d7da
```

---

## 서버 배포 과정 구조

```mermaid
flowchart LR
    Start([GitHub Actions<br/>SSH 접속]) --> PullCode[git pull<br/>최신 코드]
    PullCode --> PullImage[docker-compose pull<br/>최신 이미지]
    PullImage --> StopOld[기존 컨테이너 중지]
    StopOld --> StartNew[새 컨테이너 시작]
    StartNew --> Check[상태 확인]
    Check --> End([✅ 완료])
    
    style Start fill:#e1f5ff
    style PullCode fill:#fff3cd
    style PullImage fill:#d1ecf1
    style StopOld fill:#f8d7da
    style StartNew fill:#d4edda
    style Check fill:#fff3cd
    style End fill:#d4edda
```

---

## 전체 데이터 흐름

```mermaid
graph TD
    Code[소스 코드] -->|git push| GitHub[GitHub 저장]
    
    GitHub -->|트리거| Actions[GitHub Actions]
    
    Actions -->|빌드| Image[Docker 이미지]
    Image -->|푸시| DockerHub[Docker Hub 저장]
    
    Actions -->|SSH 명령| Server[서버]
    Server -->|pull| GitHub
    Server -->|pull| DockerHub
    
    Server -->|실행| Container[컨테이너 실행]
    Container -->|서비스 제공| Users[사용자]
    
    style Code fill:#e1f5ff
    style GitHub fill:#d1ecf1
    style Actions fill:#f8d7da
    style Image fill:#fff3cd
    style DockerHub fill:#d4edda
    style Server fill:#e1f5ff
    style Container fill:#d4edda
    style Users fill:#fff3cd
```

---

## 핵심 개념 구조

```mermaid
graph TB
    subgraph 개발["💻 개발"]
        Write[코드 작성]
        Commit[Git 커밋]
        Push[GitHub 푸시]
    end
    
    subgraph 자동화["🤖 자동화"]
        Validate[검증]
        Build[이미지 빌드]
        PushImage[이미지 푸시]
    end
    
    subgraph 배포["🚀 배포"]
        PullCode[코드 가져오기]
        PullImage[이미지 가져오기]
        Restart[컨테이너 재시작]
    end
    
    Write --> Commit
    Commit --> Push
    Push --> Validate
    Validate --> Build
    Build --> PushImage
    PushImage --> PullCode
    PullCode --> PullImage
    PullImage --> Restart
    
    style Write fill:#e1f5ff
    style Commit fill:#fff3cd
    style Push fill:#d1ecf1
    style Validate fill:#f8d7da
    style Build fill:#f8d7da
    style PushImage fill:#f8d7da
    style PullCode fill:#d4edda
    style PullImage fill:#d4edda
    style Restart fill:#d4edda
```

---

## 간단 요약

```
개발자 코드 작성
    ↓
Git 커밋 & 푸시
    ↓
GitHub 저장
    ↓
GitHub Actions 자동 실행
    ├─ 검증 (코드 체크)
    ├─ Docker 이미지 빌드
    └─ Docker Hub 푸시
    ↓
서버 배포
    ├─ 최신 코드 가져오기
    ├─ 최신 이미지 가져오기
    └─ 컨테이너 재시작
    ↓
배포 완료 ✅
```



