# 📊 개발-배포 전체 과정 Mermaid 다이어그램

이 문서는 개발부터 배포까지의 전체 과정을 Mermaid 다이어그램으로 시각화한 것입니다.

---

## 1. 전체 시퀀스 다이어그램 (개발자 관점)

```mermaid
sequenceDiagram
    participant Dev as 👨‍💻 개발자<br/>(커서)
    participant LocalGit as 📁 로컬 Git
    participant GitHub as ☁️ GitHub
    participant Actions as 🤖 GitHub Actions
    participant DockerHub as 🐳 Docker Hub
    participant Server as 🖥️ 운영 서버

    rect rgb(240, 248, 255)
        Note over Dev,Server: ===== 1단계: 로컬 개발 =====
        Dev->>LocalGit: 1️⃣ 코드 작성/수정<br/>(커서에서 파일 편집)
        Dev->>LocalGit: 2️⃣ git add .<br/>(변경사항 스테이징)
        Dev->>LocalGit: 3️⃣ git commit -m "메시지"<br/>(현재 상태 저장)
        Note right of Dev: 💡 커밋 = 사진 찍기<br/>현재 코드 상태를 기록
    end

    rect rgb(240, 255, 240)
        Note over Dev,Server: ===== 2단계: GitHub에 푸시 =====
        Dev->>GitHub: 4️⃣ git push origin main
        Note right of Dev: 💡 푸시 = 클라우드에 업로드<br/>GitHub에 코드 저장
        GitHub->>GitHub: 5️⃣ 코드 저장 완료
    end

    rect rgb(255, 248, 240)
        Note over Dev,Server: ===== 3단계: GitHub Actions 자동 실행 =====
        GitHub->>Actions: 6️⃣ main 브랜치 푸시 감지!<br/>트리거 발생
        Note right of Actions: ⚡ 트리거: push to main
    end

    rect rgb(255, 240, 245)
        Note over Actions: ===== 3-1. 검증 단계 (validate) =====
        Actions->>Actions: 7-1️⃣ 코드 체크아웃<br/>(GitHub에서 코드 가져오기)
        Actions->>Actions: 7-2️⃣ Node.js 18 설치<br/>(실행 환경 준비)
        Actions->>Actions: 7-3️⃣ npm ci<br/>(의존성 라이브러리 설치)
        Actions->>Actions: 7-4️⃣ npm run check<br/>(TypeScript 문법 체크)
        Actions->>Actions: 7-5️⃣ npm run build<br/>(빌드 테스트)
        Note right of Actions: ❌ 문제 있으면 여기서 중단!<br/>✅ 통과하면 다음 단계
    end

    rect rgb(240, 240, 255)
        Note over Actions: ===== 3-2. Docker 이미지 빌드 (build-and-push) =====
        Actions->>Actions: 8-1️⃣ Docker Hub 로그인<br/>(Secrets에서 인증 정보 사용)
        Note right of Actions: 🔑 DOCKER_USERNAME<br/>🔑 DOCKER_PASSWORD
        Actions->>Actions: 8-2️⃣ Git 커밋 시간 가져오기<br/>(빌드 정보 기록)
        Actions->>Actions: 8-3️⃣ Dockerfile 읽기<br/>(설계도 확인)
        Note right of Actions: 📐 Dockerfile = 집 설계도
        Actions->>Actions: 8-4️⃣ Docker 이미지 빌드<br/>(설계도대로 패키징)
        Note right of Actions: 🏗️ 설계도대로 집 짓기<br/>(애플리케이션 패키징)
        Actions->>DockerHub: 8-5️⃣ 이미지 푸시<br/>(docckerchoi/marketingpage:latest)
        Note right of DockerHub: 📦 완성된 집을<br/>택배 창고에 보관
        DockerHub-->>Actions: 8-6️⃣ 업로드 완료
    end

    rect rgb(255, 255, 240)
        Note over Actions: ===== 3-3. 서버 배포 (deploy) =====
        Actions->>Actions: 9-1️⃣ SSH 키 설정<br/>(서버 접속 준비)
        Note right of Actions: 🔑 SSH_PRIVATE_KEY 사용
        Actions->>Server: 9-2️⃣ SSH 연결 테스트<br/>(서버 접속 가능한지 확인)
        Server-->>Actions: 9-3️⃣ 연결 성공! ✅
        Actions->>Server: 9-4️⃣ SSH로 서버 접속<br/>(명령 전달 시작)
    end

    rect rgb(240, 255, 255)
        Note over Server: ===== 서버에서 실행되는 작업 =====
        Server->>Server: 10-1️⃣ 프로젝트 디렉토리로 이동<br/>(cd ~/marketingPage)
        Server->>GitHub: 10-2️⃣ git pull origin main<br/>(최신 코드 가져오기)
        Note right of Server: 📥 최신 코드 다운로드
        GitHub-->>Server: 10-3️⃣ 코드 전달 완료
        Server->>DockerHub: 10-4️⃣ docker-compose pull<br/>(최신 이미지 가져오기)
        Note right of Server: 📦 Docker Hub에서<br/>최신 이미지 다운로드
        DockerHub-->>Server: 10-5️⃣ 최신 이미지 전달
        Server->>Server: 10-6️⃣ 기존 컨테이너 중지<br/>(docker-compose down)
        Note right of Server: 🏚️ 오래된 집 철거
        Server->>Server: 10-7️⃣ 새 컨테이너 시작<br/>(docker-compose up -d)
        Note right of Server: 🏠 새 집에서 살기 시작<br/>(새 버전 실행)
        Server->>Server: 10-8️⃣ 컨테이너 상태 확인<br/>(docker-compose ps)
        Server->>Server: 10-9️⃣ 로그 확인<br/>(docker-compose logs)
        Server-->>Actions: 10-🔟 배포 완료 알림 ✅
    end

    rect rgb(240, 255, 240)
        Note over Dev,Server: ===== 4단계: 완료 =====
        Actions->>Actions: 1️⃣1️⃣ 배포 완료 로그 출력
        Note right of Dev: 🎉 배포 성공!<br/>서버가 새 버전으로 업데이트됨<br/>🌐 http://35.237.229.92:8080
    end
```

---

## 2. Docker 빌드 과정 상세 다이어그램

```mermaid
flowchart TD
    Start([GitHub Actions 시작]) --> ReadDockerfile[📄 Dockerfile 읽기]
    
    ReadDockerfile --> Step1[1️⃣ FROM node:18-alpine<br/>기본 이미지 선택]
    Step1 -->|비유: 기본 땅 구매| Step2[2️⃣ WORKDIR /app<br/>작업 공간 생성]
    Step2 -->|비유: 작업 공간 준비| Step3[3️⃣ COPY package*.json<br/>패키지 파일 복사]
    Step3 -->|비유: 재료 목록 가져오기| Step4[4️⃣ RUN npm ci<br/>의존성 설치]
    Step4 -->|비유: 재료 구매| Step5[5️⃣ COPY . .<br/>소스 코드 복사]
    Step5 -->|비유: 설계도 가져오기| Step6[6️⃣ RUN npm run build<br/>빌드 실행]
    Step6 -->|비유: 집 짓기| Step7[7️⃣ EXPOSE 8080<br/>포트 노출]
    Step7 -->|비유: 문 열기| Step8[8️⃣ CMD npm start<br/>서버 시작 명령]
    Step8 -->|비유: 집 사용 준비 완료| BuildComplete[✅ 이미지 빌드 완료]
    
    BuildComplete --> LoginDockerHub[🔐 Docker Hub 로그인]
    LoginDockerHub --> TagImage[🏷️ 이미지에 태그 붙이기<br/>docckerchoi/marketingpage:latest]
    TagImage --> PushImage[📤 Docker Hub에 푸시]
    PushImage --> End([✅ 완료!<br/>이미지가 Docker Hub에 저장됨])
    
    style Start fill:#e1f5ff
    style End fill:#d4edda
    style Step1 fill:#fff3cd
    style Step2 fill:#fff3cd
    style Step3 fill:#fff3cd
    style Step4 fill:#fff3cd
    style Step5 fill:#fff3cd
    style Step6 fill:#fff3cd
    style Step7 fill:#fff3cd
    style Step8 fill:#fff3cd
    style BuildComplete fill:#d1ecf1
    style LoginDockerHub fill:#f8d7da
    style TagImage fill:#d4edda
    style PushImage fill:#d4edda
```

---

## 3. GitHub Actions 워크플로우 상세 다이어그램

```mermaid
flowchart LR
    Trigger([git push origin main]) -->|트리거| Actions[🤖 GitHub Actions 시작]
    
    Actions --> Job1[Job 1: validate<br/>코드 검증]
    Job1 --> Step1_1[코드 체크아웃]
    Step1_1 --> Step1_2[Node.js 설치]
    Step1_2 --> Step1_3[npm ci]
    Step1_3 --> Step1_4[TypeScript 체크]
    Step1_4 --> Step1_5[빌드 테스트]
    Step1_5 -->|✅ 통과| Job2[Job 2: build-and-push<br/>Docker 이미지 빌드]
    Step1_5 -->|❌ 실패| Fail1([❌ 중단])
    
    Job2 --> Step2_1[Docker Hub 로그인]
    Step2_1 --> Step2_2[Git 커밋 시간 가져오기]
    Step2_2 --> Step2_3[Dockerfile 읽기]
    Step2_3 --> Step2_4[이미지 빌드]
    Step2_4 --> Step2_5[Docker Hub 푸시]
    Step2_5 -->|✅ 완료| Job3[Job 3: deploy<br/>서버 배포]
    Step2_5 -->|❌ 실패| Fail2([❌ 중단])
    
    Job3 --> Step3_1[SSH 키 설정]
    Step3_1 --> Step3_2[SSH 연결 테스트]
    Step3_2 -->|✅ 성공| Step3_3[서버에 명령 전달]
    Step3_2 -->|❌ 실패| Fail3([❌ 중단])
    
    Step3_3 --> Success([✅ 배포 완료!])
    
    style Trigger fill:#e1f5ff
    style Actions fill:#fff3cd
    style Job1 fill:#d1ecf1
    style Job2 fill:#d1ecf1
    style Job3 fill:#d1ecf1
    style Success fill:#d4edda
    style Fail1 fill:#f8d7da
    style Fail2 fill:#f8d7da
    style Fail3 fill:#f8d7da
```

---

## 4. 서버 배포 과정 상세 다이어그램

```mermaid
sequenceDiagram
    participant Actions as 🤖 GitHub Actions
    participant Server as 🖥️ 운영 서버
    participant GitHub as ☁️ GitHub
    participant DockerHub as 🐳 Docker Hub
    participant Container as 📦 Docker 컨테이너

    Actions->>Server: SSH 접속
    Note over Server: 서버에서 실행되는 명령들
    
    Server->>Server: cd ~/marketingPage
    Note right of Server: 프로젝트 폴더로 이동
    
    Server->>GitHub: git pull origin main
    GitHub-->>Server: 최신 코드 전달
    Note right of Server: docker-compose.prod.yml 등<br/>설정 파일 업데이트
    
    Server->>DockerHub: docker-compose pull
    Note right of Server: docker-compose.prod.yml 읽기<br/>docckerchoi/marketingpage:latest<br/>이미지 가져오기
    DockerHub-->>Server: 최신 이미지 다운로드 완료
    
    Server->>Container: docker-compose down
    Note right of Container: 기존 컨테이너 중지<br/>오래된 버전 종료
    Container-->>Server: 컨테이너 중지 완료
    
    Server->>Container: docker-compose up -d
    Note right of Container: 새 컨테이너 시작<br/>최신 이미지로 실행
    Container-->>Server: 컨테이너 시작 완료
    
    Server->>Server: docker-compose ps
    Note right of Server: 컨테이너 상태 확인<br/>실행 중인지 체크
    
    Server->>Server: docker-compose logs --tail=20
    Note right of Server: 로그 확인<br/>에러가 없는지 체크
    
    Server-->>Actions: 배포 완료 알림 ✅
    
    Note over Actions,Container: 🎉 서버가 새 버전으로 업데이트됨!
```

---

## 5. Docker 개념 다이어그램 (비유: 집 짓기)

```mermaid
flowchart TD
    subgraph 설계도["📐 Dockerfile (설계도)"]
        D1[FROM node:18-alpine]
        D2[WORKDIR /app]
        D3[COPY package*.json ./]
        D4[RUN npm ci]
        D5[COPY . .]
        D6[RUN npm run build]
        D7[EXPOSE 8080]
        D8[CMD npm start]
    end
    
    설계도 -->|빌드| 이미지["🏠 Docker Image<br/>(완성된 집)<br/>docckerchoi/marketingpage:latest"]
    
    이미지 -->|업로드| DockerHub["📦 Docker Hub<br/>(택배 창고)"]
    
    DockerHub -->|다운로드| 서버이미지["🖥️ 서버에 이미지 다운로드"]
    
    서버이미지 -->|실행| 컨테이너1["📦 Container 1<br/>(집에서 살기)<br/>포트: 8080"]
    서버이미지 -->|실행| 컨테이너2["📦 Container 2<br/>(또 다른 집)<br/>포트: 8081"]
    
    Note1["💡 같은 이미지로<br/>여러 컨테이너 실행 가능"]
    
    style 설계도 fill:#e1f5ff
    style 이미지 fill:#fff3cd
    style DockerHub fill:#d1ecf1
    style 서버이미지 fill:#d4edda
    style 컨테이너1 fill:#f8d7da
    style 컨테이너2 fill:#f8d7da
```

---

## 6. Git 워크플로우 다이어그램

```mermaid
flowchart LR
    subgraph 로컬["💻 로컬 컴퓨터 (커서)"]
        작업공간[작업 공간<br/>Working Directory]
        스테이징[스테이징 영역<br/>Staging Area]
        로컬저장소[로컬 Git 저장소<br/>Local Repository]
    end
    
    subgraph 원격["☁️ GitHub (원격 저장소)"]
        GitHub저장소[GitHub 저장소<br/>Remote Repository]
    end
    
    작업공간 -->|git add .| 스테이징
    Note1["💡 변경사항을<br/>기록할 준비"]
    
    스테이징 -->|git commit -m "메시지"| 로컬저장소
    Note2["💡 현재 상태를<br/>사진으로 찍기"]
    
    로컬저장소 -->|git push origin main| GitHub저장소
    Note3["💡 클라우드에<br/>사진 업로드"]
    
    GitHub저장소 -->|git pull origin main| 작업공간
    Note4["💡 최신 사진<br/>다운로드"]
    
    style 작업공간 fill:#e1f5ff
    style 스테이징 fill:#fff3cd
    style 로컬저장소 fill:#d1ecf1
    style GitHub저장소 fill:#d4edda
```

---

## 7. 전체 시스템 아키텍처 다이어그램

```mermaid
graph TB
    subgraph 개발환경["💻 개발 환경"]
        Cursor[커서 Cursor<br/>코드 편집기]
        LocalGit[로컬 Git<br/>버전 관리]
    end
    
    subgraph 클라우드["☁️ 클라우드 서비스"]
        GitHub[GitHub<br/>코드 저장소]
        GitHubActions[GitHub Actions<br/>자동화 로봇]
        DockerHub[Docker Hub<br/>이미지 저장소]
    end
    
    subgraph 운영서버["🖥️ 운영 서버"]
        ServerOS[서버 운영체제<br/>Linux]
        DockerEngine[Docker Engine<br/>컨테이너 실행 엔진]
        Container[애플리케이션 컨테이너<br/>실행 중인 앱]
        Database[(PostgreSQL<br/>데이터베이스)]
    end
    
    Cursor -->|코드 작성| LocalGit
    LocalGit -->|git push| GitHub
    GitHub -->|푸시 감지| GitHubActions
    GitHubActions -->|코드 검증| GitHubActions
    GitHubActions -->|이미지 빌드| DockerHub
    GitHubActions -->|SSH 접속| ServerOS
    ServerOS -->|이미지 다운로드| DockerHub
    ServerOS -->|컨테이너 실행| DockerEngine
    DockerEngine -->|컨테이너 시작| Container
    Container -->|데이터 저장/조회| Database
    
    style Cursor fill:#e1f5ff
    style LocalGit fill:#fff3cd
    style GitHub fill:#d1ecf1
    style GitHubActions fill:#f8d7da
    style DockerHub fill:#d4edda
    style ServerOS fill:#e1f5ff
    style DockerEngine fill:#fff3cd
    style Container fill:#d1ecf1
    style Database fill:#d4edda
```

---

## 8. 시간 순서별 전체 과정 타임라인

```mermaid
gantt
    title 개발-배포 전체 과정 타임라인
    dateFormat X
    axisFormat %s초
    
    section 로컬 개발
    코드 작성/수정           :0, 300
    git add .               :300, 10
    git commit              :310, 10
    git push                :320, 30
    
    section GitHub Actions
    코드 검증 (validate)    :350, 120
    Docker 이미지 빌드      :470, 180
    서버 배포 (deploy)      :650, 120
    
    section 서버 작업
    코드/이미지 다운로드    :650, 60
    컨테이너 재시작         :710, 30
    상태 확인               :740, 10
    
    section 완료
    배포 완료               :750, 0
```

---

## 9. 에러 처리 및 롤백 과정

```mermaid
flowchart TD
    Start([배포 시작]) --> Validate{검증 단계}
    
    Validate -->|✅ 통과| Build{빌드 단계}
    Validate -->|❌ 실패| Error1[에러 로그 출력]
    Error1 --> Notify1[개발자에게 알림]
    Notify1 --> End1([배포 중단])
    
    Build -->|✅ 성공| Deploy{배포 단계}
    Build -->|❌ 실패| Error2[빌드 에러 로그]
    Error2 --> Notify2[개발자에게 알림]
    Notify2 --> End2([배포 중단])
    
    Deploy -->|✅ 성공| Check{상태 확인}
    Deploy -->|❌ 실패| Error3[배포 에러 로그]
    Error3 --> Rollback[롤백 시도]
    Rollback -->|이전 이미지로 복구| End3([롤백 완료])
    
    Check -->|✅ 정상| Success([✅ 배포 성공])
    Check -->|❌ 비정상| Error4[상태 확인 실패]
    Error4 --> Rollback
    
    style Start fill:#e1f5ff
    style Success fill:#d4edda
    style Error1 fill:#f8d7da
    style Error2 fill:#f8d7da
    style Error3 fill:#f8d7da
    style Error4 fill:#f8d7da
    style Rollback fill:#fff3cd
    style End1 fill:#f8d7da
    style End2 fill:#f8d7da
    style End3 fill:#fff3cd
```

---

## 10. Docker 이미지와 컨테이너의 관계

```mermaid
graph LR
    subgraph 이미지["📦 Docker Image (이미지)"]
        Image1[docckerchoi/marketingpage:latest<br/>완성된 애플리케이션 패키지]
    end
    
    subgraph 컨테이너들["📦 Containers (컨테이너들)"]
        Container1[Container 1<br/>포트: 8080<br/>환경: production]
        Container2[Container 2<br/>포트: 8081<br/>환경: staging]
        Container3[Container 3<br/>포트: 8082<br/>환경: development]
    end
    
    Image1 -->|docker run| Container1
    Image1 -->|docker run| Container2
    Image1 -->|docker run| Container3
    
    Note1["💡 하나의 이미지로<br/>여러 컨테이너 실행 가능"]
    Note2["💡 각 컨테이너는<br/>독립적으로 실행됨"]
    
    style Image1 fill:#fff3cd
    style Container1 fill:#d4edda
    style Container2 fill:#d4edda
    style Container3 fill:#d4edda
```

---

## 📝 사용 방법

이 다이어그램들은 다음 도구에서 볼 수 있습니다:

1. **GitHub**: GitHub의 마크다운 뷰어에서 자동으로 렌더링됩니다
2. **VS Code**: Mermaid 확장 프로그램 설치 시 미리보기 가능
3. **온라인 에디터**: https://mermaid.live 에서 코드를 붙여넣어 확인 가능
4. **Notion, Obsidian**: Mermaid를 지원하는 에디터에서 사용 가능

---

## 🎯 각 다이어그램의 용도

- **다이어그램 1**: 전체 과정을 한눈에 보기
- **다이어그램 2**: Docker 빌드 과정 이해하기
- **다이어그램 3**: GitHub Actions 워크플로우 이해하기
- **다이어그램 4**: 서버 배포 과정 이해하기
- **다이어그램 5**: Docker 개념 이해하기 (비유)
- **다이어그램 6**: Git 워크플로우 이해하기
- **다이어그램 7**: 전체 시스템 구조 이해하기
- **다이어그램 8**: 시간 순서 이해하기
- **다이어그램 9**: 에러 처리 방법 이해하기
- **다이어그램 10**: 이미지와 컨테이너 관계 이해하기

---

## 💡 학습 팁

1. **처음 보는 사람**: 다이어그램 1, 5, 6부터 시작하세요
2. **Docker 학습**: 다이어그램 2, 5, 10을 함께 보세요
3. **GitHub Actions 학습**: 다이어그램 3을 자세히 보세요
4. **배포 과정 학습**: 다이어그램 4를 자세히 보세요
5. **전체 이해**: 다이어그램 7로 전체 구조를 파악하세요



