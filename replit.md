# 모두의광고 - 광고 & 마케팅 플랫폼

## Overview

"모두의광고"는 React, Express, PostgreSQL로 구축된 프리미엄 광고 및 마케팅 플랫폼입니다. 광고 교육 프로그램, 마케팅 자료, 비즈니스 서비스를 제공하며, Stripe, Notion, Linear에서 영감을 받은 세련된 디자인을 특징으로 합니다.

플랫폼의 주요 기능:
- SEO 최적화된 블로그 포스트
- 광고/마케팅 교육 프로그램 및 제품
- 다운로드 가능한 마케팅 자료
- 광고 컨설팅 서비스
- 문의사항 관리
- 뉴스레터 구독 시스템
- 통합 검색 기능
- 리뷰/평가 시스템
- FAQ
- 소셜 공유

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript using Vite as the build tool

**Routing**: Client-side routing implemented with Wouter (lightweight React router)

**State Management**: 
- TanStack Query (React Query v5) for server state management
- Query client configured with infinite stale time and disabled auto-refetching for optimal caching
- Custom query functions with 401 unauthorized handling

**UI Component System**:
- Shadcn/ui component library (New York style variant)
- Radix UI primitives for accessible components (dialogs, dropdowns, navigation, etc.)
- Tailwind CSS for styling with custom design tokens
- Class Variance Authority (CVA) for component variants
- Custom color system with HSL-based theming supporting light/dark modes

**Design System**:
- Typography: Inter for UI/body text, SF Pro Display for headlines (with system font fallbacks)
- Responsive spacing scale using Tailwind units (2, 4, 6, 8, 12, 16, 20, 24, 32)
- Card-based layouts with premium minimalist aesthetic
- Korean typography optimized with adequate line-height (1.6-1.8)
- Custom border radius system (9px/6px/3px for lg/md/sm)

**Form Handling**: React Hook Form with Zod validation via @hookform/resolvers

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js

**Server Configuration**:
- Development mode uses tsx for TypeScript execution
- Production build uses esbuild for server bundling (ESM format, external packages)
- Vite middleware integration for HMR in development
- Custom logging middleware for API request/response tracking

**API Design**:
- RESTful endpoints under `/api` prefix
- Separate route handlers for blog, products, resources, services, contacts, and authentication
- PostgreSQL storage via Drizzle ORM (migrated from in-memory implementation)
- Response standardization with error handling
- Protected routes using isAuthenticated middleware

**Data Layer**:
- Storage abstraction via IStorage interface (PostgreSQL implementation via DbStorage)
- Drizzle ORM for type-safe database operations
- Schema definitions in shared directory for type safety across client/server

**Authentication**:
- Replit Auth integration using OpenID Connect (OIDC)
- Support for multiple login providers: Google, GitHub, X, Apple, email/password
- Session management using express-session with PostgreSQL session store (connect-pg-simple)
- Environment-aware configuration (HTTP for dev, HTTPS for production)
- Token refresh and user session management
- Protected API routes with isAuthenticated middleware

### Database Schema

**ORM**: Drizzle ORM configured for PostgreSQL with Neon serverless adapter

**Tables** (defined in shared/schema.ts):

1. **blog_posts**: Blog content management
   - UUID primary key, slug-based routing
   - Category, featured flag, SEO fields (excerpt, read time)
   - Author information with images
   - Full markdown/HTML content support

2. **products**: Digital product catalog
   - UUID primary key, slug-based routing
   - Pricing, categories, badges (Hot, Premium, etc.)
   - Feature lists stored as text arrays
   - Featured flag for homepage display

3. **resources**: Downloadable resource library
   - File metadata (type, size, download URL)
   - Download tracking counter
   - Tag system using text arrays
   - Category and featured flags

4. **services**: Business service offerings
   - Service descriptions and features
   - Designed for service catalog presentation

5. **contacts**: User inquiry/contact form submissions
   - Name, email, subject, message fields
   - Timestamp tracking

6. **users**: User accounts for authentication
   - UUID primary key
   - OIDC subject (sub) for Replit Auth integration
   - Email, first name, last name
   - Refresh token storage for token renewal
   - Timestamp tracking

7. **sessions**: Express session storage for authentication
   - Session ID, data (JSON), expiration timestamp
   - Managed by connect-pg-simple

**Database Configuration**:
- Connection via DATABASE_URL environment variable
- Migration files output to `./migrations` directory
- Schema validation using Drizzle-Zod for runtime type checking

### External Dependencies

**Database**: 
- PostgreSQL via Neon serverless (@neondatabase/serverless)
- Connection pooling handled by Neon adapter
- Session storage using connect-pg-simple (PostgreSQL session store for Express)
- Migrated from in-memory storage to persistent database

**Authentication**:
- Replit Auth via openid-client and passport
- Session management via express-session and connect-pg-simple
- Token refresh with memoization for performance
- Multi-provider support (Google, GitHub, X, Apple, email/password)

**Development Tools**:
- Replit-specific plugins for development experience (cartographer, dev banner, runtime error modal)
- TypeScript compilation with strict mode enabled
- Path aliases configured (@/, @shared/, @assets/)

**Key Third-Party Libraries**:
- date-fns: Date formatting and manipulation
- nanoid: Unique ID generation
- Lucide React: Icon library
- Embla Carousel: Image/content carousels
- cmdk: Command palette component

**Build Pipeline**:
- Vite for client bundling with React plugin
- esbuild for server bundling (production)
- PostCSS with Tailwind CSS and Autoprefixer
- Source maps enabled for debugging

### Content Management

**Multi-language Support**: Content structure supports both Korean and English (evidenced by Korean markdown content in attached_assets)

**Content Types**:
- Static markdown files in attached_assets directory
- Database-driven content for dynamic pages
- Image assets referenced via public URLs

**SEO Considerations**:
- Structured metadata in blog posts (excerpts, read time)
- Slug-based URLs for all content types
- Featured content flags for homepage prioritization