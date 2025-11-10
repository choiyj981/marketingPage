---
title: "React + TypeScript + Express 풀스택 프로젝트 구조 완벽 이해하기"
slug: "react-typescript-express-architecture"
excerpt: "jQuery에서 React로 넘어온 개발자를 위한 실전 가이드. 프로젝트 구조부터 API 호출, 데이터베이스 연결까지 Mermaid 다이어그램으로 시각화하여 설명합니다."
category: "개발"
imageUrl: "/uploads/images/architecture.jpg"
tags: ["React", "TypeScript", "Express", "풀스택", "웹개발", "프론트엔드", "백엔드", "아키텍처"]
publishedAt: "2025-01-15"
readTime: "20분"
author: "Business Platform"
authorImage: "/avatar.png"
featured: 1
---

# React + TypeScript + Express 풀스택 프로젝트 구조 완벽 이해하기

> jQuery에서 React로 넘어온 개발자를 위한 실전 가이드

## 📋 목차

1. [프로젝트 전체 구조](#프로젝트-전체-구조)
2. [React 컴포넌트 구조](#react-컴포넌트-구조)
3. [API 호출 흐름](#api-호출-흐름)
4. [데이터베이스 연결 흐름](#데이터베이스-연결-흐름)
5. [개발 모드 vs 프로덕션 모드](#개발-모드-vs-프로덕션-모드)
6. [Express 프레임워크 이해하기](#express-프레임워크-이해하기)

---

## 🏗️ 프로젝트 전체 구조

이 프로젝트는 **모노레포(Monorepo)** 구조로, 프론트엔드와 백엔드가 하나의 프로젝트 안에 함께 있습니다.

```mermaid
graph TB
    Root[프로젝트 루트]
    Root --> Client[client/ - 프론트엔드]
    Root --> Server[server/ - 백엔드]
    Root --> Shared[shared/ - 공유 코드]
    Root --> Package[package.json - 의존성 관리]
    
    Client --> ClientSrc[src/]
    ClientSrc --> Pages[pages/ - 페이지 컴포넌트]
    ClientSrc --> Components[components/ - 재사용 컴포넌트]
    ClientSrc --> Lib[lib/ - 유틸리티]
    ClientSrc --> Main[main.tsx - 시작점]
    
    Server --> ServerIndex[index.ts - 서버 시작]
    Server --> Routes[routes.ts - API 엔드포인트]
    Server --> DB[db.ts - DB 연결]
    Server --> Storage[storage.ts - DB 쿼리]
    
    Shared --> Schema[schema.ts - DB 스키마]
    
    style Client fill:#e1f5ff
    style Server fill:#fff4e1
    style Shared fill:#e8f5e9
```

### 폴더별 역할

| 폴더 | 역할 | 기술 스택 |
|------|------|-----------|
| `client/` | 프론트엔드 | React + TypeScript + Vite |
| `server/` | 백엔드 | Express + TypeScript |
| `shared/` | 공유 코드 | TypeScript (스키마 정의) |

### 주요 특징

- **하나의 package.json**: 프론트엔드와 백엔드 의존성을 한 곳에서 관리
- **공유 타입**: `shared/schema.ts`로 프론트와 서버가 같은 타입 사용
- **단일 포트**: 개발/프로덕션 모두 하나의 포트(5000)에서 실행

---

## 🧩 React 컴포넌트 구조

jQuery에서 React로 넘어올 때 가장 큰 변화는 **컴포넌트 기반 구조**입니다.

```mermaid
graph TD
    HTML[index.html<br/>진입점]
    HTML --> Main[main.tsx<br/>React 시작]
    Main --> App[App.tsx<br/>앱 뼈대]
    App --> Router[Router<br/>페이지 전환]
    Router --> Home[Home.tsx]
    Router --> Blog[Blog.tsx]
    Router --> Products[Products.tsx]
    
    Home --> Hero[Hero 컴포넌트]
    Home --> BlogCard[BlogCard 컴포넌트]
    Home --> ProductCard[ProductCard 컴포넌트]
    
    Blog --> BlogCard
    Products --> ProductCard
    
    style HTML fill:#ffebee
    style Main fill:#e3f2fd
    style App fill:#f3e5f5
    style Router fill:#e8f5e9
    style Home fill:#fff3e0
    style Blog fill:#fff3e0
    style Products fill:#fff3e0
```

### jQuery vs React 비교

```mermaid
graph LR
    subgraph jQuery["jQuery 방식"]
        J1[단일 HTML 파일]
        J2[모든 코드가 한 곳]
        J3[직접 DOM 조작]
        J1 --> J2 --> J3
    end
    
    subgraph React["React 방식"]
        R1[여러 파일로 분리]
        R2[컴포넌트 기반]
        R3[자동 DOM 업데이트]
        R1 --> R2 --> R3
    end
    
    style jQuery fill:#ffcdd2
    style React fill:#c8e6c9
```

### 주요 차이점

#### jQuery 방식
```javascript
// 모든 코드가 하나의 HTML 파일에
$('#content').html('<div>' + data.title + '</div>');
```

#### React 방식
```typescript
// 컴포넌트로 분리
function BlogCard({ post }) {
  return <Card>{post.title}</Card>;
}
```

**장점**:
- 코드 재사용성 증가
- 유지보수 용이
- 타입 안정성 (TypeScript)
- 자동 업데이트

---

## 🔄 API 호출 흐름

`useQuery`를 사용한 API 호출의 전체 흐름을 시퀀스 다이어그램으로 표현했습니다.

```mermaid
sequenceDiagram
    participant C as 클라이언트<br/>(Blog.tsx)
    participant QC as queryClient.ts
    participant S as 서버<br/>(routes.ts)
    participant ST as storage.ts
    participant DB as PostgreSQL
    
    C->>QC: useQuery({ queryKey: ["/api/blog"] })
    QC->>QC: queryKey를 URL로 변환
    QC->>S: fetch("/api/blog")
    S->>ST: storage.getAllBlogPosts()
    ST->>DB: db.select().from(blogPosts)
    DB-->>ST: 데이터 반환
    ST-->>S: BlogPost[]
    S-->>QC: JSON 응답
    QC-->>C: data에 저장
    C->>C: 화면 자동 업데이트
```

### 단계별 상세 설명

```mermaid
flowchart TD
    Start[useQuery 호출] --> Step1[queryKey: /api/blog]
    Step1 --> Step2[fetch 요청]
    Step2 --> Step3[Express 라우트 처리]
    Step3 --> Step4[Storage 함수 호출]
    Step4 --> Step5[DB 쿼리 실행]
    Step5 --> Step6[데이터 반환]
    Step6 --> Step7[React 자동 리렌더링]
    
    style Start fill:#e1f5ff
    style Step7 fill:#c8e6c9
```

### 실제 코드 예시

#### 1. 클라이언트에서 호출
```typescript
// Blog.tsx
const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
  queryKey: ["/api/blog"],
});
```

#### 2. queryClient가 HTTP 요청
```typescript
// queryClient.ts
async ({ queryKey }) => {
  const res = await fetch(queryKey.join("/")); // "/api/blog"
  return await res.json();
}
```

#### 3. 서버에서 처리
```typescript
// routes.ts
app.get("/api/blog", async (_req, res) => {
  const posts = await storage.getAllBlogPosts();
  res.json(posts);
});
```

#### 4. 데이터베이스 쿼리
```typescript
// storage.ts
async getAllBlogPosts() {
  return await db.select().from(blogPosts);
}
```

---

## 💾 데이터베이스 연결 흐름

데이터베이스 연결부터 쿼리 실행까지의 과정입니다.

```mermaid
graph TB
    Start[서버 시작] --> Check{DATABASE_URL<br/>존재?}
    Check -->|Yes| Connect[PostgreSQL 연결]
    Check -->|No| Dummy[더미 연결 생성]
    
    Connect --> Drizzle[Drizzle ORM 초기화]
    Drizzle --> DB[db 객체 생성]
    
    API[API 요청] --> Storage[storage.ts]
    Storage --> DB
    DB --> Query[SQL 쿼리 실행]
    Query --> Result[데이터 반환]
    
    style Connect fill:#c8e6c9
    style Dummy fill:#ffcdd2
    style DB fill:#fff9c4
```

### 실제 코드 흐름

```mermaid
sequenceDiagram
    participant ENV as 환경변수<br/>DATABASE_URL
    participant DB as db.ts
    participant DZ as Drizzle ORM
    participant PG as PostgreSQL
    
    ENV->>DB: postgresql://user:pass@host/db
    DB->>PG: 연결 시도
    PG-->>DB: 연결 성공
    DB->>DZ: drizzle(sql, { schema })
    DZ-->>DB: db 객체 생성
    
    Note over DB,PG: 이후 모든 쿼리는 db 객체를 통해 실행
```

### DB 연결 코드

```typescript
// db.ts
const sql = postgres(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });
```

**특징**:
- 환경변수로 연결 정보 관리
- Drizzle ORM으로 타입 안정성 보장
- 스키마 기반 쿼리

---

## 🛠️ 개발 모드 vs 프로덕션 모드

개발 모드와 프로덕션 모드의 차이를 시각화했습니다.

### 개발 모드 (npm run dev)

```mermaid
graph TB
    Start[npm run dev] --> Express[Express 서버 시작]
    Express --> Vite[Vite 미들웨어 통합]
    Vite --> HMR[핫 모듈 리로드<br/>HMR 활성화]
    
    Browser[브라우저 요청] --> Express
    Express --> Vite
    Vite --> Transform[TypeScript 변환]
    Transform --> React[React 컴포넌트]
    React --> Browser
    
    style HMR fill:#c8e6c9
    style Transform fill:#fff9c4
```

**특징**:
- 코드 변경 시 자동 리로드
- 소스맵 제공 (디버깅 용이)
- 빠른 개발 경험

### 프로덕션 모드 (npm run build + npm start)

```mermaid
graph TB
    Build[npm run build] --> ViteBuild[Vite 빌드]
    Build --> Esbuild[esbuild 서버 빌드]
    
    ViteBuild --> Static[정적 파일<br/>dist/public/]
    Esbuild --> ServerJS[서버 코드<br/>dist/index.js]
    
    Start[npm start] --> Express[Express 서버]
    Express --> StaticFiles[정적 파일 서빙]
    
    Browser[브라우저 요청] --> Express
    Express --> StaticFiles
    
    style Static fill:#e1f5ff
    style ServerJS fill:#fff4e1
```

**특징**:
- 코드 최적화 및 압축
- 빠른 로딩 속도
- 프로덕션 환경에 최적화

### 모드별 비교

```mermaid
graph LR
    subgraph Dev["개발 모드"]
        D1[Vite 통합]
        D2[핫 리로드]
        D3[소스맵]
        D1 --> D2 --> D3
    end
    
    subgraph Prod["프로덕션 모드"]
        P1[빌드된 파일]
        P2[최적화]
        P3[압축]
        P1 --> P2 --> P3
    end
    
    style Dev fill:#c8e6c9
    style Prod fill:#fff4e1
```

| 항목 | 개발 모드 | 프로덕션 모드 |
|------|----------|--------------|
| 빌드 | 실시간 변환 | 사전 빌드 |
| 리로드 | 핫 리로드 | 없음 |
| 최적화 | 없음 | 최적화 + 압축 |
| 디버깅 | 쉬움 (소스맵) | 어려움 |

---

## 🚀 Express 프레임워크 이해하기

Express는 TypeScript 언어가 아니라, **Node.js용 웹 프레임워크**입니다.

```mermaid
graph TB
    NodeJS[Node.js<br/>런타임 환경] --> Express[Express<br/>웹 프레임워크]
    Express --> TypeScript[TypeScript로 사용 가능]
    Express --> JavaScript[JavaScript로 사용 가능]
    
    Express --> Routes[라우팅]
    Express --> Middleware[미들웨어]
    Express --> Static[정적 파일 서빙]
    
    style Express fill:#fff4e1
    style TypeScript fill:#e1f5ff
```

### Express vs 다른 프레임워크

```mermaid
graph TB
    subgraph Node["Node.js 생태계"]
        Express[Express<br/>JavaScript/TypeScript]
    end
    
    subgraph Java["Java 생태계"]
        Spring[Spring<br/>Java]
    end
    
    subgraph Python["Python 생태계"]
        Django[Django<br/>Python]
    end
    
    Express -.->|같은 역할| Spring
    Express -.->|같은 역할| Django
    
    style Express fill:#fff4e1
    style Spring fill:#ffcdd2
    style Django fill:#c8e6c9
```

**핵심 정리**:
- Express = 웹 프레임워크 (도구)
- TypeScript = 프로그래밍 언어
- Express는 TypeScript로 사용 가능하지만, TypeScript 자체는 아님

### Express 라우팅 구조

```mermaid
graph TD
    App[Express App] --> Routes[routes.ts]
    
    Routes --> Blog[GET /api/blog]
    Routes --> Products[GET /api/products]
    Routes --> Contact[POST /api/contact]
    Routes --> Admin[GET /api/admin/*]
    
    Blog --> Storage1[storage.getAllBlogPosts]
    Products --> Storage2[storage.getAllProducts]
    Contact --> Storage3[storage.createContact]
    Admin --> Auth[인증 미들웨어]
    
    Storage1 --> DB[(PostgreSQL)]
    Storage2 --> DB
    Storage3 --> DB
    
    style App fill:#fff4e1
    style DB fill:#e1f5ff
```

### Express 사용 예시

```typescript
// 서버 시작
const app = express();

// 라우트 정의
app.get("/api/blog", async (req, res) => {
  const posts = await storage.getAllBlogPosts();
  res.json(posts);
});

// 서버 실행
app.listen(5000);
```

---

## 📊 전체 아키텍처 다이어그램

프로젝트의 전체 아키텍처를 한눈에 볼 수 있는 다이어그램입니다.

```mermaid
graph TB
    subgraph Client["클라이언트 (프론트엔드)"]
        Browser[브라우저]
        React[React 컴포넌트]
        Query[React Query]
        Browser --> React
        React --> Query
    end
    
    subgraph Server["서버 (백엔드)"]
        Express[Express 서버]
        Routes[API Routes]
        Storage[Storage Layer]
        Express --> Routes
        Routes --> Storage
    end
    
    subgraph Database["데이터베이스"]
        PG[(PostgreSQL)]
        Drizzle[Drizzle ORM]
        Storage --> Drizzle
        Drizzle --> PG
    end
    
    Query -->|HTTP 요청| Express
    Express -->|JSON 응답| Query
    
    style Client fill:#e1f5ff
    style Server fill:#fff4e1
    style Database fill:#e8f5e9
```

### 데이터 흐름

```mermaid
flowchart LR
    User[사용자] --> Browser[브라우저]
    Browser --> React[React 앱]
    React --> API[API 호출]
    API --> Express[Express 서버]
    Express --> DB[(PostgreSQL)]
    DB --> Express
    Express --> API
    API --> React
    React --> Browser
    Browser --> User
    
    style User fill:#ffebee
    style DB fill:#e8f5e9
```

---

## 🎯 핵심 정리

### 1. 프로젝트 구조
- **모노레포**: 프론트엔드와 백엔드가 하나의 프로젝트
- **폴더 분리**: `client/`, `server/`, `shared/`로 역할 분리
- **공유 코드**: `shared/` 폴더로 타입과 스키마 공유

### 2. React 컴포넌트
- **컴포넌트 기반**: 재사용 가능한 부품으로 구성
- **자동 업데이트**: 데이터 변경 시 자동 리렌더링
- **파일 분리**: 각 컴포넌트가 독립적인 파일

### 3. API 호출
- **useQuery**: 간단한 API 호출 Hook
- **자동 캐싱**: 같은 데이터는 캐시에서 재사용
- **자동 리패치**: 필요 시 자동으로 데이터 갱신

### 4. 데이터베이스
- **Drizzle ORM**: TypeScript 친화적인 ORM
- **타입 안정성**: 스키마로 타입 보장
- **환경변수**: `DATABASE_URL`로 연결 관리

### 5. Express
- **웹 프레임워크**: Node.js용 서버 프레임워크
- **TypeScript 지원**: 타입 정의 제공
- **라우팅**: RESTful API 쉽게 구현

---

## 📚 다음 단계

이제 프로젝트 구조를 이해했으니, 다음을 학습해보세요:

1. **컴포넌트 만들기**: 새로운 컴포넌트 추가하기
2. **API 엔드포인트 추가**: 새로운 API 만들기
3. **데이터베이스 스키마**: 테이블 추가 및 수정
4. **인증 시스템**: 로그인/로그아웃 구현
5. **에러 처리**: 에러 핸들링 패턴

---

## 💡 실전 팁

### 개발 시 주의사항

1. **타입 안정성**: TypeScript를 최대한 활용하세요
2. **컴포넌트 재사용**: 작은 컴포넌트부터 만들기
3. **에러 처리**: 항상 에러 케이스를 고려하세요
4. **성능 최적화**: 불필요한 리렌더링 방지

### 디버깅 팁

1. **React DevTools**: 컴포넌트 상태 확인
2. **Network 탭**: API 호출 확인
3. **Console 로그**: 서버 로그 확인
4. **TypeScript 에러**: 타입 에러 먼저 해결

---

**작성일**: 2025년 1월 15일  
**태그**: #React #TypeScript #Express #풀스택 #웹개발 #프론트엔드 #백엔드 #아키텍처

