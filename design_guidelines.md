# Design Guidelines: 오토마케터 (AutoMarketer)

## Design Approach

**Reference-Based Design**: Drawing from Stripe's premium restraint, Notion's content clarity, and Linear's sophisticated typography, adapted for advertising/marketing industry. Creates professional authority with modern creative energy - positioning as a trusted advertising and marketing expertise platform.

**Core Principles**:
- Premium minimalism with bold advertising-focused visuals
- Card-based layouts showcasing campaigns, services, and case studies
- Gradient treatments and layered shadows for dimensional depth
- Mobile-first responsive architecture
- Korean typography optimization with generous spacing

---

## Brand Colors & Visual Treatment

**Primary Palette**:
- **Indigo #6366F1**: Primary CTAs, links, key UI elements
- **Green #10B981**: Success states, metrics, growth indicators
- **Amber #F59E0B**: Highlighted content, urgent CTAs, special badges
- **Dark #1A1A1A**: Headers, footers, text on light backgrounds
- **Light #FAFAFA**: Page backgrounds, card backgrounds
- **Muted #374151**: Secondary text, metadata, subtle borders

**Gradient Applications**:
- Hero backgrounds: Indigo to Dark (from-indigo-600 to-gray-900)
- Card overlays: Transparent to Dark gradient on images
- Section dividers: Subtle indigo-to-transparent gradients
- Button hover states: Brightness adjustments maintaining brand colors

**Shadow System**:
- **Subtle**: shadow-sm (default cards)
- **Medium**: shadow-lg (elevated cards, navigation)
- **Heavy**: shadow-2xl (modals, featured content)
- **Hover Enhancement**: shadow-lg → shadow-2xl transitions

---

## Typography Hierarchy

**Font Stack**: Inter (UI/body), SF Pro Display (headlines), Poppins (accent numbers/stats)

**Heading Scales**:
- **H1**: text-5xl md:text-6xl lg:text-7xl, font-bold, tracking-tight, leading-tight
- **H2**: text-3xl md:text-4xl lg:text-5xl, font-bold, leading-tight
- **H3**: text-2xl md:text-3xl, font-semibold
- **H4**: text-xl md:text-2xl, font-semibold
- **H5**: text-lg md:text-xl, font-medium
- **H6**: text-sm md:text-base, font-medium, uppercase, tracking-wider

**Body Text**: 
- **Hero/Large**: text-lg md:text-xl, leading-relaxed (line-height 1.7)
- **Standard**: text-base, leading-relaxed (line-height 1.7)
- **Small**: text-sm, leading-normal (line-height 1.6)
- **Caption**: text-xs, leading-snug

**Korean Optimization**: line-height 1.7-1.8 for all Korean text, letter-spacing normal (no tight tracking)

---

## Layout System & Spacing

**Container Strategy**:
- **Max-width Standard**: max-w-7xl for content sections
- **Max-width Narrow**: max-w-4xl for article content
- **Full-width**: w-full for heroes, immersive sections

**Spacing Units**: Tailwind primitives **2, 4, 6, 8, 12, 16, 20, 24, 32**
- **Component padding**: p-6 md:p-8 lg:p-12
- **Section spacing**: py-16 md:py-24 lg:py-32
- **Card gaps**: gap-6 md:gap-8 lg:gap-12
- **Element spacing**: space-y-4, space-x-6

**Grid Systems**:
- **Service Cards**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- **Case Studies**: grid-cols-1 md:grid-cols-2
- **Testimonials**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- **Stats Display**: grid-cols-2 md:grid-cols-4

---

## Component Library

### Navigation
**Desktop Header**: Sticky header, dark background with slight transparency (backdrop-blur-md), logo left, primary links center, dual CTAs right (secondary outlined + primary solid), mega menu for Services dropdown

**Mobile Header**: Dark header, hamburger menu, full-screen overlay navigation with stacked links, gradient background, CTAs at bottom

### Hero Sections

**Homepage Hero**: 
- Full-width gradient background (indigo-to-dark gradient)
- Large hero image: Modern advertising workspace, marketing analytics dashboard, or creative team collaboration scene with gradient overlay
- Centered content with H1, large subheading, dual CTAs (primary + secondary)
- Height: min-h-[700px] md:min-h-[800px]
- Floating stats cards overlay (transparent cards showing key metrics)
- CTA buttons with blurred backgrounds (backdrop-blur-sm), no hover state modifications

**Service Page Hero**: 
- Split layout: content left (60%), service visualization right (40%)
- Service category badge, title, description
- Key benefits list with checkmark icons
- Primary CTA with blurred background

### Cards

**Service Cards**:
- White background, rounded-2xl, shadow-lg hover:shadow-2xl
- Icon or illustration at top (gradient-filled icons using brand colors)
- Service title, description (2-3 lines)
- Feature list with icons
- "Learn More" link with arrow
- Hover: Subtle lift (translate-y-[-6px]), shadow enhancement

**Case Study Cards**:
- Featured image with dark gradient overlay
- Client logo overlay (top-left)
- Results metrics badges (top-right): "+150% ROI", "300% Growth"
- Title, industry tag, brief description
- "View Case Study" CTA
- Aspect ratio: 16:9 for images

**Blog/Resource Cards**:
- Thumbnail image with category badge overlay
- Title, excerpt, author avatar, date
- Read time indicator
- Hover: Scale image slightly (scale-105)

**Testimonial Cards**:
- Light background with subtle border
- Quote text (large, italic)
- Client photo (circular avatar)
- Name, company, role
- Star rating (if applicable)

### Content Sections

**Stats/Metrics Display**:
- Large numbers (text-5xl md:text-6xl, Poppins font) in success green
- Descriptive label below
- Icon accompaniment
- Animated counter effect on scroll
- 4-column grid desktop, 2-column mobile

**Service Showcase**:
- Alternating left/right layouts
- Image/illustration on one side, content on other
- Numbered sections (large gradient numbers)
- Feature highlights with icons
- Background pattern or subtle gradient

**Process Timeline**:
- Horizontal timeline on desktop, vertical on mobile
- Step numbers in gradient circles
- Connecting lines between steps
- Step title, description, icon
- Optional screenshot/illustration per step

**Pricing Tables**:
- 3-column layout (stacks on mobile)
- Featured plan with amber accent border and "Most Popular" badge
- Plan name, price (large Poppins font), billing cycle
- Feature checklist with icons
- CTA button per plan
- Background: light for standard, subtle gradient for featured

**FAQ Accordion**:
- Question text with expand icon (chevron)
- Answer content with generous padding
- Smooth height transition
- Alternating background shades (light/white)

**Video Showcase**:
- Large video thumbnail with play button overlay (indigo gradient background)
- Video title, duration, view count
- Grid layout for multiple videos: 2 columns desktop, 1 column mobile

### Forms

**Contact/Inquiry Forms**:
- Label above input, clear hierarchy
- Input styling: rounded-lg, border-2 (muted), focus:border-indigo-600
- Large padding for inputs (px-4 py-3)
- Select dropdowns with custom arrow
- Textarea for messages
- Submit button with loading spinner state
- Inline validation messages (success green, error red)

**Newsletter Signup**:
- Inline email + submit button
- Compact design with rounded-full inputs
- Success message below on submit

### Footer

**Multi-Column Footer**:
- Dark background (#1A1A1A)
- Logo and tagline left column
- 3 middle columns: Services, Resources, Company links
- Right column: Contact info, social media icons
- Newsletter signup section above columns
- Bottom bar: Copyright, legal links, language selector
- Subtle top border with indigo accent

---

## Page-Specific Layouts

### Homepage
1. **Hero**: Large hero image, dual CTAs, floating metrics cards
2. **Services Overview**: 3-column service cards with icons
3. **Results/Stats**: 4-column metrics display with large numbers
4. **Featured Case Studies**: 2-column showcase with results badges
5. **Process Timeline**: 5-step horizontal timeline
6. **Client Testimonials**: 3-column testimonial cards with carousel
7. **Latest Insights**: 3-column blog preview cards
8. **CTA Section**: Full-width gradient background, centered content, dual CTAs

### Services Page
- Service category navigation tabs
- Hero per service with split layout
- Benefits grid (3 columns)
- Case study examples (2 columns)
- Pricing comparison table
- Process breakdown
- Related services cards

### Case Studies Page
- Filter sidebar: Industry, service type, results
- Featured case study (full-width card)
- Grid of case studies (2 columns)
- Pagination

### Blog/Resources
- Category filter tabs (horizontal scroll mobile)
- Featured post (large card)
- Grid of posts (3 columns)
- Load more button

### Contact Page
- Split layout: Form left (60%), contact info + map right (40%)
- Office locations cards
- Social media links
- Business hours

---

## Images

**Homepage Hero**: Modern advertising workspace showing multiple screens with campaign analytics, creative team in bright office setting, or abstract marketing visualization with geometric shapes and gradient overlays

**Service Pages**: Specific service visualizations - social media dashboards, SEO analytics, content creation scenes, video production equipment

**Case Study Images**: Before/after campaign results, client product shots, campaign creative samples

**Card Thumbnails**: Industry-specific stock images, abstract patterns with brand gradients, client logos on solid backgrounds

**Team/About**: Professional team photos in modern office, candid collaboration moments

**Icons**: Line icons from Heroicons for features, Font Awesome for social media

**Background Patterns**: Subtle geometric patterns, gradient mesh overlays for section backgrounds

---

## Interaction & Animation

**Smooth Transitions**: All hover states use transition-all duration-300
**Card Hovers**: Lift + shadow enhancement (transform translate-y-[-6px] + shadow-2xl)
**Button States**: Primary buttons brighten on hover (brightness-110), outlined buttons fill
**Scroll Animations**: Fade-in on scroll for sections, counter animations for stats (use sparingly)
**Loading States**: Skeleton screens for content, spinner for forms
**Navigation**: Smooth dropdown slide-down, mobile menu slide-in from right
**Hero CTAs**: Blurred backgrounds (backdrop-blur-sm bg-white/10), maintain consistent appearance regardless of state

This comprehensive system creates a premium advertising platform balancing professional credibility with modern creative energy, optimized for Korean users and mobile-first interactions.