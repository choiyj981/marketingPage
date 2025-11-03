# Design Guidelines: Premium Business Platform

## Design Approach

**Reference-Based Design**: Drawing inspiration from Stripe's premium restraint, Notion's content clarity, and Linear's sophisticated typography. The platform balances professional authority with approachable learning - positioning as a trusted AI education and service provider.

**Core Design Principles**:
- Premium minimalism with purposeful visual hierarchy
- Content-first approach emphasizing readability and scanability
- Sophisticated card-based layouts for products and content
- Clear information architecture across multiple content types
- Trust-building through structured, professional presentation

---

## Typography Hierarchy

**Font Stack**: Inter for UI elements and body text, SF Pro Display for headlines (fallback to system fonts)

**Heading Scales**:
- **H1 (Hero)**: text-5xl md:text-6xl lg:text-7xl, font-bold, tracking-tight
- **H2 (Section)**: text-3xl md:text-4xl lg:text-5xl, font-bold
- **H3 (Subsection)**: text-2xl md:text-3xl, font-semibold
- **H4 (Card Title)**: text-xl md:text-2xl, font-semibold
- **H5 (Component Header)**: text-lg md:text-xl, font-medium
- **H6 (Label)**: text-base, font-medium, uppercase tracking-wide

**Body Text**:
- **Large Body**: text-lg leading-relaxed (hero subheadings, important descriptions)
- **Regular Body**: text-base leading-relaxed (standard content)
- **Small Body**: text-sm leading-normal (metadata, captions)
- **Micro**: text-xs (labels, timestamps)

**Korean Typography Considerations**: Ensure adequate line-height (1.6-1.8) for Korean characters, maintain consistent vertical rhythm

---

## Layout System & Spacing

**Container Strategy**:
- **Max-width**: max-w-7xl for main content containers
- **Max-width prose**: max-w-4xl for blog content and long-form text
- **Full-width**: w-full for hero sections and immersive content

**Spacing Primitives**: Use Tailwind spacing units of **2, 4, 6, 8, 12, 16, 20, 24, 32**
- **Component padding**: p-6 md:p-8 lg:p-12
- **Section spacing**: py-16 md:py-20 lg:py-32
- **Card gaps**: gap-6 md:gap-8
- **Inline spacing**: space-x-4, space-y-2

**Grid Systems**:
- **Product/Service Cards**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- **Feature Highlights**: grid-cols-1 md:grid-cols-2
- **Blog Posts**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- **Resource Items**: Single column list on mobile, grid-cols-2 lg:grid-cols-3 on desktop

---

## Component Library

### Navigation
**Desktop Header**: Fixed top navigation with transparent-to-solid on scroll, logo left, primary links center, CTA button right, dropdown menus for "더보기" (More) section containing GPTs, Services, Resources

**Mobile Header**: Hamburger menu icon, slide-in navigation drawer with stacked links, prominent CTA at bottom

**Mega Menu Pattern** (for GPTs section): Multi-column dropdown showing categorized tools (Blog GPTs, Other GPTs, Templates) with icons and descriptions

### Hero Sections
**Homepage Hero**: 
- Large gradient background (subtle gradient from deep black to charcoal)
- Centered content with large H1, subheading, dual CTAs
- Hero image/illustration showing AI-powered platform concept
- Height: min-h-[600px] md:min-h-[700px]

**Product Page Hero**:
- Split layout: content left, product preview/video right
- Status badges ("모집 중", "HOT", etc.)
- Enrollment countdown timer component

### Cards
**Product/Service Cards**:
- Clean white background with subtle shadow (shadow-lg hover:shadow-xl)
- Card image with 16:9 aspect ratio
- Category badge (top-left overlay or above title)
- Title, description excerpt, metadata (author, date)
- Hover: Subtle lift effect (transform translate-y-[-4px])

**Blog Post Cards**:
- Featured image with gradient overlay for text readability
- Category tag, title, excerpt, author avatar, read time
- Consistent aspect ratio across all images

**Resource/Download Cards**:
- Icon or thumbnail preview
- File type badge, file size indicator
- Download count, date added
- Primary download button

### Forms
**Contact Forms**:
- Clean label-above-input layout
- Input styling: border-2, rounded-lg, focus states with brand color
- Validation feedback inline
- Submit button with loading state

**Search Input**:
- Prominent search bar with icon
- Dropdown suggestions on focus
- Category filters below search

### Content Sections
**Step-by-Step Guides**:
- Numbered step indicators (large circled numbers)
- Visual flow with connecting lines between steps
- Card-based step content with icons
- Screenshots or illustrations for each step

**Pricing Tables**:
- 4-column grid on desktop (stacks on mobile)
- Highlighted "recommended" plan with visual distinction
- Feature comparison checkmarks
- Prominent CTA buttons per plan

**Video Preview Sections**:
- Video thumbnail with play overlay
- Title and duration below
- Grid layout for multiple videos

**FAQ Accordion**:
- Clean expandable sections
- Plus/minus icon indicators
- Smooth height transitions

**Stats/Metrics Display**:
- Large numbers (text-4xl md:text-5xl) with labels
- Grid layout: 2 columns mobile, 4 columns desktop
- Icon accompaniment optional

### Footer
**Multi-column Footer**:
- Logo and tagline (left column)
- Quick links organized by category (2-3 middle columns)
- Newsletter signup form (right column)
- Bottom bar: Copyright, social media icons, legal links
- Background: Deep black (#1A1A1A)

---

## Page-Specific Layouts

### Homepage
1. **Hero Section**: Large hero with video background option, dual CTAs
2. **Value Proposition**: 3-column feature grid highlighting AI benefits
3. **Latest Blog Posts**: 3-column card grid with "View All" link
4. **GPTS Tools Preview**: Featured tools with category tabs
5. **Services Overview**: 2-column showcase of main services
6. **Resources Teaser**: Download highlights with preview
7. **Community Section**: Split layout - chat room preview left, business inquiry right
8. **Learning Path**: Progressive disclosure of beginner/intermediate/advanced content

### Blog Listing
- **Filter Sidebar**: Category filter (left on desktop, top on mobile)
- **Main Grid**: 3-column post cards with pagination
- **Featured Post**: Large card at top (full-width)

### Blog Post
- **Hero Image**: Full-width featured image with gradient overlay for title
- **Content Container**: max-w-4xl, generous line spacing
- **Typography**: Larger text (text-lg) for readability
- **Related Posts**: 3-card grid at bottom

### Product/Course Pages
- **Hero**: Video preview + enrollment section
- **Course Preview Videos**: 2-column grid
- **Curriculum Section**: Accordion-style module breakdown
- **Value Propositions**: Icon + text blocks
- **Countdown Timer**: Prominent enrollment deadline
- **FAQs**: Full-width accordion

### Resources/Downloads
- **Filter Options**: Category tags (horizontal scroll on mobile)
- **Featured Resources**: Large cards with prominent badges
- **Resource Grid**: Table-style layout on desktop, cards on mobile
- **Download Stats**: Visual indicators for popularity

### Contact Page
- **Split Layout**: Form left (60%), contact info + map right (40%)
- **Form Fields**: Name, email, subject, message
- **Alternative Contact**: Business inquiry specific CTAs

---

## Images

**Hero Images**:
- **Homepage**: Abstract AI/technology visualization with gradient overlay (blurred buttons with backdrop-blur-sm on CTAs)
- **Product Pages**: Course thumbnail or product screenshot
- **Blog Posts**: Category-relevant featured images

**Product/Service Images**:
- Consistent aspect ratios (16:9 for cards)
- Screenshot mockups for digital products
- Lifestyle/conceptual images for services

**GPTS Tool Icons**: Logo placeholder images for each GPT tool (uniform sizing)

**Avatars**: Author profile images (circular, 40px × 40px for cards, 80px × 80px for full posts)

**Badges/Icons**: Category badges, "HOT" labels, "추천" (Recommended) tags, file type icons

---

## Interaction Patterns

**Buttons**:
- **Primary CTA**: Solid indigo (#6366F1) background, white text, rounded-lg, hover:brightness-110
- **Secondary CTA**: Outlined style, transparent background, border-2
- **Text Links**: Underline on hover, color transition

**Card Interactions**:
- Subtle hover lift (transform translate-y-[-4px])
- Shadow enhancement on hover
- Smooth transitions (transition-all duration-300)

**Navigation**:
- Dropdown menus slide down smoothly
- Mobile menu slides from right
- Active page indicator (border-b-2 or background highlight)

**Loading States**: Skeleton screens for content loading, spinner for form submissions

**Scroll Behaviors**: Sticky header on scroll, fade-in animations for sections (use sparingly)

---

## Special Components

**Countdown Timer**: Large numeric display with labels (Days, Hours, Minutes, Seconds), updates in real-time

**Badge System**: Category badges (rounded-full, px-3, py-1, text-xs), status indicators ("모집 중", "HOT")

**Video Player Embeds**: Responsive 16:9 containers for embedded video content

**Table Components**: Responsive tables that convert to cards on mobile for resource listings

**Social Proof Elements**: Download counts, user testimonials (if applicable), trust indicators

This design system creates a premium, professional platform that effectively showcases digital products, educational content, and services while maintaining accessibility and user-friendly navigation across all device sizes.