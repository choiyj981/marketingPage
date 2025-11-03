# Business Platform - Digital Products & Services

## Overview

This is a premium business platform built with React, Express, and PostgreSQL, designed to showcase and deliver digital products, educational programs, blog content, and business services. The application features a sophisticated, content-first design inspired by platforms like Stripe, Notion, and Linear, with support for both English and Korean content.

The platform serves as a comprehensive business solution for managing and presenting:
- Blog posts with SEO optimization
- Digital products and programs
- Downloadable resources
- Business services
- Contact/inquiry management

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
- Separate route handlers for blog, products, resources, services, and contacts
- In-memory storage implementation (IStorage interface) designed for future database migration
- Response standardization with error handling

**Data Layer**:
- Storage abstraction via IStorage interface (currently MemStorage implementation)
- Prepared for Drizzle ORM integration with PostgreSQL
- Schema definitions in shared directory for type safety across client/server

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

**Database Configuration**:
- Connection via DATABASE_URL environment variable
- Migration files output to `./migrations` directory
- Schema validation using Drizzle-Zod for runtime type checking

### External Dependencies

**Database**: 
- PostgreSQL via Neon serverless (@neondatabase/serverless)
- Connection pooling handled by Neon adapter
- Session storage using connect-pg-simple (PostgreSQL session store for Express)

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