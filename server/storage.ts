import {
  type BlogPost,
  type InsertBlogPost,
  type Product,
  type InsertProduct,
  type Resource,
  type InsertResource,
  type Service,
  type InsertService,
  type Contact,
  type InsertContact,
  type User,
  type UpsertUser,
  type NewsletterSubscription,
  type InsertNewsletterSubscription,
  type Review,
  type InsertReview,
  type FaqEntry,
  type InsertFaqEntry,
  type MetricsSnapshot,
  type InsertMetricsSnapshot,
  blogPosts,
  products,
  resources,
  services,
  contacts,
  users,
  newsletterSubscriptions,
  reviews,
  faqEntries,
  metricsSnapshots,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, ilike, or, and, asc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Blog Posts
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPostById(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: string): Promise<void>;

  // Products
  getAllProducts(): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductById(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;

  // Resources
  getAllResources(): Promise<Resource[]>;
  getResourceBySlug(slug: string): Promise<Resource | undefined>;
  getResourceById(id: string): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResource(id: string, resource: Partial<InsertResource>): Promise<Resource>;
  deleteResource(id: string): Promise<void>;

  // Services
  getAllServices(): Promise<Service[]>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  getServiceById(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: string): Promise<void>;

  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
  deleteContact(id: string): Promise<void>;

  // Newsletter
  subscribeNewsletter(email: string, name: string): Promise<NewsletterSubscription>;
  unsubscribeNewsletter(email: string): Promise<void>;
  getNewsletterSubscribers(): Promise<NewsletterSubscription[]>;

  // Reviews
  createReview(data: InsertReview): Promise<Review>;
  getReviewsByProduct(productId: string): Promise<Review[]>;
  getAllReviews(): Promise<Review[]>;
  updateReviewStatus(id: string, status: string): Promise<Review>;
  deleteReview(id: string): Promise<void>;

  // FAQ
  createFaq(data: InsertFaqEntry): Promise<FaqEntry>;
  getFaqs(): Promise<FaqEntry[]>;
  getAllFaqs(): Promise<FaqEntry[]>;
  updateFaq(id: string, data: Partial<InsertFaqEntry>): Promise<FaqEntry>;
  deleteFaq(id: string): Promise<void>;

  // Metrics
  getMetrics(): Promise<MetricsSnapshot[]>;
  updateMetric(name: string, value: number): Promise<MetricsSnapshot>;

  // Search
  searchContent(query: string, type?: string): Promise<{ blogs: BlogPost[], products: Product[] }>;
}

// Legacy MemStorage class - no longer used, removed for clarity
/* class MemStorage implements IStorage {
  private blogPosts: Map<string, BlogPost>;
  private products: Map<string, Product>;
  private resources: Map<string, Resource>;
  private services: Map<string, Service>;
  private contacts: Map<string, Contact>;
  private users: Map<string, User>;

  constructor() {
    this.blogPosts = new Map();
    this.products = new Map();
    this.resources = new Map();
    this.services = new Map();
    this.contacts = new Map();
    this.users = new Map();
    
    this.seedData();
  }

  // Users (stub implementation)
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      ...userData,
      id: userData.id || `user-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
    };
    this.users.set(user.id, user);
    return user;
  }

  // Blog Posts
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find((post) => post.slug === slug);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const post: BlogPost = { ...insertPost, id };
    this.blogPosts.set(id, post);
    return post;
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find((product) => product.slug === slug);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  // Resources
  async getAllResources(): Promise<Resource[]> {
    return Array.from(this.resources.values()).sort((a, b) => b.downloads - a.downloads);
  }

  async getResourceBySlug(slug: string): Promise<Resource | undefined> {
    return Array.from(this.resources.values()).find((resource) => resource.slug === slug);
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = randomUUID();
    const resource: Resource = { ...insertResource, id };
    this.resources.set(id, resource);
    return resource;
  }

  // Services
  async getAllServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    return Array.from(this.services.values()).find((service) => service.slug === slug);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = randomUUID();
    const service: Service = { ...insertService, id };
    this.services.set(id, service);
    return service;
  }

  // Contacts
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { 
      ...insertContact, 
      id,
      createdAt: new Date()
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  // Seed initial data
  private seedData() {
    // Seed Blog Posts
    const blogPosts: InsertBlogPost[] = [
      {
        title: "The Future of Digital Transformation",
        slug: "future-of-digital-transformation",
        excerpt: "Explore how emerging technologies are reshaping business operations and customer experiences in the digital age.",
        content: `<h2>Introduction</h2><p>Digital transformation is no longer optional—it's essential for businesses looking to thrive in today's competitive landscape. This comprehensive guide explores the key trends and strategies driving successful digital initiatives.</p>
        
<h2>Key Trends Shaping Digital Transformation</h2><p>From artificial intelligence to cloud computing, discover the technologies revolutionizing how businesses operate and serve their customers.</p>

<h2>Implementing Digital Solutions</h2><p>Learn practical strategies for implementing digital transformation in your organization, from initial planning to execution and measurement.</p>

<h2>Measuring Success</h2><p>Understand the key metrics and KPIs that matter when evaluating your digital transformation journey and ROI.</p>`,
        category: "Technology",
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop",
        author: "Sarah Johnson",
        authorImage: "/avatar.png",
        publishedAt: "2025-01-15",
        readTime: "8 min read",
        featured: 1,
      },
      {
        title: "Mastering Customer Experience in 2025",
        slug: "mastering-customer-experience-2025",
        excerpt: "Learn the essential strategies for creating exceptional customer experiences that drive loyalty and growth.",
        content: `<h2>The Customer-First Approach</h2><p>In today's market, customer experience is the ultimate differentiator. This article explores how to build a customer-centric culture.</p>

<h2>Tools and Technologies</h2><p>Discover the platforms and solutions that enable personalized, seamless customer interactions across all touchpoints.</p>

<h2>Best Practices</h2><p>Implement proven strategies from industry leaders who have successfully transformed their customer experience initiatives.</p>`,
        category: "Business Strategy",
        imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop",
        author: "Michael Chen",
        authorImage: "/avatar.png",
        publishedAt: "2025-01-10",
        readTime: "6 min read",
        featured: 1,
      },
      {
        title: "Building Scalable SaaS Products",
        slug: "building-scalable-saas-products",
        excerpt: "A comprehensive guide to architecting and scaling SaaS applications for rapid growth and reliability.",
        content: `<h2>Architecture Principles</h2><p>Learn the fundamental principles of building robust, scalable SaaS architectures that can grow with your business.</p>

<h2>Performance Optimization</h2><p>Discover techniques for optimizing performance, reducing latency, and ensuring your application delivers exceptional user experiences at scale.</p>

<h2>Security and Compliance</h2><p>Understand the critical security considerations and compliance requirements for modern SaaS products.</p>`,
        category: "Development",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
        author: "David Martinez",
        authorImage: "/avatar.png",
        publishedAt: "2025-01-05",
        readTime: "10 min read",
        featured: 1,
      },
      {
        title: "Data-Driven Marketing Strategies",
        slug: "data-driven-marketing-strategies",
        excerpt: "Harness the power of data analytics to create more effective marketing campaigns and drive measurable results.",
        content: `<h2>The Power of Data</h2><p>Discover how data analytics is transforming marketing from an art into a science, enabling precision targeting and optimization.</p>

<h2>Tools and Platforms</h2><p>Explore the essential tools for collecting, analyzing, and acting on marketing data to improve campaign performance.</p>`,
        category: "Marketing",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
        author: "Emma Williams",
        authorImage: "/avatar.png",
        publishedAt: "2024-12-28",
        readTime: "7 min read",
        featured: 0,
      },
    ];

    blogPosts.forEach((post) => {
      const id = randomUUID();
      this.blogPosts.set(id, { ...post, id });
    });

    // Seed Products
    const products: InsertProduct[] = [
      {
        title: "Professional Business Suite",
        slug: "professional-business-suite",
        description: "Comprehensive digital tools and resources for modern businesses",
        fullDescription: "Our Professional Business Suite includes everything you need to streamline operations, boost productivity, and scale your business effectively.",
        price: "$299/month",
        imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop",
        category: "Software",
        badge: "HOT",
        featured: 1,
        features: [
          "Advanced analytics dashboard",
          "Team collaboration tools",
          "Automated workflows",
          "24/7 premium support",
          "Custom integrations",
        ],
      },
      {
        title: "Growth Marketing Program",
        slug: "growth-marketing-program",
        description: "Complete marketing automation and growth framework",
        fullDescription: "Accelerate your business growth with our proven marketing frameworks, automation tools, and expert guidance.",
        price: "$499/month",
        imageUrl: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&auto=format&fit=crop",
        category: "Marketing",
        badge: "Featured",
        featured: 1,
        features: [
          "Multi-channel campaigns",
          "AI-powered optimization",
          "Real-time analytics",
          "A/B testing platform",
          "Expert consultation",
        ],
      },
      {
        title: "Enterprise Solutions Package",
        slug: "enterprise-solutions-package",
        description: "Tailored solutions for large-scale organizations",
        fullDescription: "Enterprise-grade tools and dedicated support designed for organizations with complex requirements and high-volume operations.",
        price: "Custom Pricing",
        imageUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format&fit=crop",
        category: "Enterprise",
        badge: null,
        featured: 1,
        features: [
          "Dedicated account manager",
          "Custom development",
          "Advanced security features",
          "SLA guarantees",
          "White-label options",
        ],
      },
    ];

    products.forEach((product) => {
      const id = randomUUID();
      this.products.set(id, { ...product, id });
    });

    // Seed Resources
    const resources: InsertResource[] = [
      {
        title: "Complete Digital Strategy Guide",
        slug: "digital-strategy-guide",
        description: "A comprehensive 50-page guide to planning and executing successful digital transformation initiatives.",
        fileType: "PDF",
        fileSize: "12.4 MB",
        downloadUrl: "#",
        category: "Guides",
        downloads: 2847,
        author: "Business Platform",
        publishedAt: "2025-01-10",
        featured: 1,
        tags: ["Strategy", "Digital", "Transformation"],
      },
      {
        title: "Marketing Templates Bundle",
        slug: "marketing-templates-bundle",
        description: "Essential marketing templates including campaign planners, content calendars, and analytics dashboards.",
        fileType: "ZIP",
        fileSize: "8.2 MB",
        downloadUrl: "#",
        category: "Templates",
        downloads: 1923,
        author: "Business Platform",
        publishedAt: "2025-01-05",
        featured: 1,
        tags: ["Marketing", "Templates", "Planning"],
      },
      {
        title: "Business Model Canvas Workbook",
        slug: "business-model-canvas",
        description: "Interactive workbook for developing and validating your business model with practical examples.",
        fileType: "PDF",
        fileSize: "5.6 MB",
        downloadUrl: "#",
        category: "Workbooks",
        downloads: 1456,
        author: "Business Platform",
        publishedAt: "2024-12-20",
        featured: 0,
        tags: ["Business", "Planning", "Strategy"],
      },
    ];

    resources.forEach((resource) => {
      const id = randomUUID();
      this.resources.set(id, { ...resource, id });
    });

    // Seed Services
    const services: InsertService[] = [
      {
        title: "Strategic Consulting",
        slug: "strategic-consulting",
        description: "Expert guidance to help you navigate complex business challenges and unlock growth opportunities.",
        icon: "target",
        features: [
          "One-on-one strategy sessions",
          "Market analysis and insights",
          "Growth roadmap development",
          "Quarterly business reviews",
        ],
      },
      {
        title: "Custom Development",
        slug: "custom-development",
        description: "Tailored software solutions built to your exact specifications and business requirements.",
        icon: "code",
        features: [
          "Full-stack development",
          "API integrations",
          "Mobile and web applications",
          "Ongoing maintenance and support",
        ],
      },
      {
        title: "Digital Marketing",
        slug: "digital-marketing",
        description: "Comprehensive marketing services to increase your online presence and drive measurable results.",
        icon: "megaphone",
        features: [
          "SEO and content strategy",
          "Social media management",
          "Paid advertising campaigns",
          "Performance tracking and optimization",
        ],
      },
      {
        title: "Training & Workshops",
        slug: "training-workshops",
        description: "Hands-on training programs to upskill your team and maximize technology adoption.",
        icon: "graduation-cap",
        features: [
          "Customized curriculum",
          "Interactive workshops",
          "Certification programs",
          "Post-training support",
        ],
      },
    ];

    services.forEach((service) => {
      const id = randomUUID();
      this.services.set(id, { ...service, id });
    });
  }
} */

// PostgreSQL-based storage implementation
export class PgStorage implements IStorage {
  // Users (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Blog Posts
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const results = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return results[0];
  }

  async getBlogPostById(id: string): Promise<BlogPost | undefined> {
    const results = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return results[0];
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const results = await db.insert(blogPosts).values(insertPost).returning();
    return results[0];
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost> {
    const results = await db.update(blogPosts).set(post).where(eq(blogPosts.id, id)).returning();
    return results[0];
  }

  async deleteBlogPost(id: string): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const results = await db.select().from(products).where(eq(products.slug, slug));
    return results[0];
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const results = await db.select().from(products).where(eq(products.id, id));
    return results[0];
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const results = await db.insert(products).values(insertProduct).returning();
    return results[0];
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> {
    const results = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return results[0];
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Resources
  async getAllResources(): Promise<Resource[]> {
    return await db.select().from(resources).orderBy(desc(resources.downloads));
  }

  async getResourceBySlug(slug: string): Promise<Resource | undefined> {
    const results = await db.select().from(resources).where(eq(resources.slug, slug));
    return results[0];
  }

  async getResourceById(id: string): Promise<Resource | undefined> {
    const results = await db.select().from(resources).where(eq(resources.id, id));
    return results[0];
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const results = await db.insert(resources).values(insertResource).returning();
    return results[0];
  }

  async updateResource(id: string, resource: Partial<InsertResource>): Promise<Resource> {
    const results = await db.update(resources).set(resource).where(eq(resources.id, id)).returning();
    return results[0];
  }

  async deleteResource(id: string): Promise<void> {
    await db.delete(resources).where(eq(resources.id, id));
  }

  // Services
  async getAllServices(): Promise<Service[]> {
    return await db.select().from(services);
  }

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    const results = await db.select().from(services).where(eq(services.slug, slug));
    return results[0];
  }

  async getServiceById(id: string): Promise<Service | undefined> {
    const results = await db.select().from(services).where(eq(services.id, id));
    return results[0];
  }

  async createService(insertService: InsertService): Promise<Service> {
    const results = await db.insert(services).values(insertService).returning();
    return results[0];
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service> {
    const results = await db.update(services).set(service).where(eq(services.id, id)).returning();
    return results[0];
  }

  async deleteService(id: string): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  // Contacts
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const results = await db.insert(contacts).values(insertContact).returning();
    return results[0];
  }

  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async deleteContact(id: string): Promise<void> {
    await db.delete(contacts).where(eq(contacts.id, id));
  }

  // Newsletter
  async subscribeNewsletter(email: string, name: string): Promise<NewsletterSubscription> {
    const results = await db
      .insert(newsletterSubscriptions)
      .values({ email, name, status: 'active' })
      .onConflictDoUpdate({
        target: newsletterSubscriptions.email,
        set: { name, status: 'active', subscribedAt: new Date() },
      })
      .returning();
    return results[0];
  }

  async unsubscribeNewsletter(email: string): Promise<void> {
    await db
      .update(newsletterSubscriptions)
      .set({ status: 'unsubscribed' })
      .where(eq(newsletterSubscriptions.email, email));
  }

  async getNewsletterSubscribers(): Promise<NewsletterSubscription[]> {
    return await db.select().from(newsletterSubscriptions).orderBy(desc(newsletterSubscriptions.subscribedAt));
  }

  // Reviews
  async createReview(data: InsertReview): Promise<Review> {
    const results = await db.insert(reviews).values(data).returning();
    return results[0];
  }

  async getReviewsByProduct(productId: string): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.productId, productId), eq(reviews.status, 'approved')))
      .orderBy(desc(reviews.createdAt));
  }

  async getAllReviews(): Promise<Review[]> {
    return await db.select().from(reviews).orderBy(desc(reviews.createdAt));
  }

  async updateReviewStatus(id: string, status: string): Promise<Review> {
    const results = await db
      .update(reviews)
      .set({ status })
      .where(eq(reviews.id, id))
      .returning();
    return results[0];
  }

  async deleteReview(id: string): Promise<void> {
    await db.delete(reviews).where(eq(reviews.id, id));
  }

  // FAQ
  async createFaq(data: InsertFaqEntry): Promise<FaqEntry> {
    const results = await db.insert(faqEntries).values(data).returning();
    return results[0];
  }

  async getFaqs(): Promise<FaqEntry[]> {
    return await db
      .select()
      .from(faqEntries)
      .where(eq(faqEntries.status, 'published'))
      .orderBy(asc(faqEntries.category), asc(faqEntries.displayOrder));
  }

  async getAllFaqs(): Promise<FaqEntry[]> {
    return await db
      .select()
      .from(faqEntries)
      .orderBy(asc(faqEntries.category), asc(faqEntries.displayOrder));
  }

  async updateFaq(id: string, data: Partial<InsertFaqEntry>): Promise<FaqEntry> {
    const results = await db
      .update(faqEntries)
      .set(data)
      .where(eq(faqEntries.id, id))
      .returning();
    return results[0];
  }

  async deleteFaq(id: string): Promise<void> {
    await db.delete(faqEntries).where(eq(faqEntries.id, id));
  }

  // Metrics
  async getMetrics(): Promise<MetricsSnapshot[]> {
    return await db.select().from(metricsSnapshots).orderBy(asc(metricsSnapshots.name));
  }

  async updateMetric(name: string, value: number): Promise<MetricsSnapshot> {
    const results = await db
      .insert(metricsSnapshots)
      .values({ name, value })
      .onConflictDoUpdate({
        target: metricsSnapshots.name,
        set: { value, updatedAt: new Date() },
      })
      .returning();
    return results[0];
  }

  // Search
  async searchContent(query: string, type?: string): Promise<{ blogs: BlogPost[], products: Product[] }> {
    const searchPattern = `%${query}%`;
    
    let blogs: BlogPost[] = [];
    let productResults: Product[] = [];

    if (!type || type === 'blog') {
      blogs = await db
        .select()
        .from(blogPosts)
        .where(
          or(
            ilike(blogPosts.title, searchPattern),
            ilike(blogPosts.excerpt, searchPattern),
            ilike(blogPosts.content, searchPattern)
          )
        )
        .orderBy(desc(blogPosts.publishedAt));
    }

    if (!type || type === 'product') {
      productResults = await db
        .select()
        .from(products)
        .where(
          or(
            ilike(products.title, searchPattern),
            ilike(products.description, searchPattern),
            ilike(products.fullDescription, searchPattern)
          )
        );
    }

    return { blogs, products: productResults };
  }
}

// Seed database with initial data
async function seedDatabase() {
  try {
    // Check if database is already seeded
    const existingPosts = await db.select().from(blogPosts).limit(1);
    if (existingPosts.length > 0) {
      console.log("Database already seeded, skipping seed operation");
      return;
    }

    console.log("Seeding database with initial data...");

    // Seed Blog Posts
    const blogPostsData: InsertBlogPost[] = [
      {
        title: "ChatGPT로 시작하는 블로그 자동화 완벽 가이드",
        slug: "chatgpt-blog-automation-guide",
        excerpt: "AI를 활용한 블로그 콘텐츠 제작부터 SEO 최적화까지, 블로그 운영을 혁신하는 실전 노하우를 공개합니다.",
        content: `<h2>왜 지금 블로그 자동화인가?</h2><p>2025년, 콘텐츠 소비의 시대입니다. 하지만 매일 양질의 콘텐츠를 생산하는 것은 쉽지 않죠. ChatGPT를 활용하면 누구나 전문가 수준의 블로그 콘텐츠를 빠르게 제작할 수 있습니다.</p>
        
<h2>블로그 자동화 3단계 전략</h2><p>1단계에서는 키워드 검색과 분석을 진행합니다. 2단계에서 SEO 최적화된 본문을 생성하고, 3단계에서 이미지와 메타데이터를 완성합니다. 각 단계별 GPT 활용법을 자세히 알려드립니다.</p>

<h2>실전 사례: 월 100만 조회수 달성 비법</h2><p>실제로 이 방법을 활용해 3개월 만에 월 100만 조회수를 달성한 사례를 공유합니다. 키워드 선정부터 포스팅 주기 관리까지, 검증된 전략을 확인해보세요.</p>

<h2>수익화 전략</h2><p>애드센스, 제휴 마케팅, 디지털 상품 판매까지. 블로그를 통한 다양한 수익화 방법과 각각의 장단점을 분석합니다.</p>`,
        category: "AI 마케팅",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop",
        author: "알파GOGOGO",
        authorImage: "/avatar.png",
        publishedAt: "2025-01-15",
        readTime: "8분",
        featured: 1,
      },
      {
        title: "퍼스널 브랜딩 성공 사례 - 비전문가도 가능한 브랜딩 전략",
        slug: "personal-branding-success-story",
        excerpt: "개발 지식 없이도 나만의 브랜드를 만들 수 있습니다. 실제 성공 사례를 통해 배우는 퍼스널 브랜딩 노하우.",
        content: `<h2>퍼스널 브랜딩의 시작</h2><p>콘텐츠 소비의 시대, 콘텐츠가 돈이 되는 세상입니다. 이제 비전문인, 비개발자도 누구나 브랜딩할 수 있습니다. 나만의 전문성과 개성을 어떻게 브랜드로 만들 수 있을까요?</p>

<h2>본질을 찾아서 - 마케팅의 본질</h2><p>퍼스널 브랜딩 전략과 효과적인 콘텐츠 마케팅을 통해 시장에서의 가치를 높이는 방법을 배웁니다. SNS부터 블로그, 유튜브까지 플랫폼별 전략을 공유합니다.</p>

<h2>AI 시대의 브랜딩 전략</h2><p>노코드 툴과 AI를 활용하면 개발 지식 없이도 전문적인 웹사이트와 콘텐츠를 만들 수 있습니다. 실제 도구 활용법과 함께 단계별 가이드를 제공합니다.</p>`,
        category: "퍼스널 브랜딩",
        imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop",
        author: "알파GOGOGO",
        authorImage: "/avatar.png",
        publishedAt: "2025-01-10",
        readTime: "6분",
        featured: 1,
      },
      {
        title: "블로그 SEO 최적화 완벽 가이드 - 검색 1페이지 진입 전략",
        slug: "blog-seo-optimization-guide",
        excerpt: "구글과 네이버 검색 상위 노출을 위한 실전 SEO 전략. 키워드 분석부터 메타태그 최적화까지 모든 것을 알려드립니다.",
        content: `<h2>SEO의 기초 이해하기</h2><p>검색 엔진 최적화(SEO)는 블로그 성공의 핵심입니다. 알고리즘을 이해하고 전략적으로 접근하면 누구나 검색 상위에 노출될 수 있습니다.</p>

<h2>키워드 검색 & 분석 전략</h2><p>효과적인 블로그 작성을 위한 첫 단계로, 관련 키워드를 검색하고 분석하는 방법을 배웁니다. GPT를 활용한 자동화된 키워드 분석 도구 사용법도 함께 소개합니다.</p>

<h2>메타태그와 구조화된 데이터</h2><p>title, description, og 태그 등 메타데이터 최적화는 필수입니다. 검색 엔진이 선호하는 구조화된 데이터 마크업 방법을 실전 예제와 함께 설명합니다.</p>

<h2>백링크 전략과 콘텐츠 품질</h2><p>단순히 키워드만 넣는다고 SEO가 되지 않습니다. 고품질 콘텐츠 작성법과 자연스러운 백링크 확보 전략을 공유합니다.</p>`,
        category: "SEO 최적화",
        imageUrl: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&auto=format&fit=crop",
        author: "알파GOGOGO",
        authorImage: "/avatar.png",
        publishedAt: "2025-01-05",
        readTime: "10분",
        featured: 1,
      },
      {
        title: "유튜브 데이터 분석으로 트렌드 파악하기",
        slug: "youtube-data-analysis-trends",
        excerpt: "AI 챗봇 어시스턴트를 활용한 유튜브 데이터 수집과 분석 방법. 트렌드를 읽고 콘텐츠 전략을 수립하세요.",
        content: `<h2>데이터 기반 콘텐츠 전략</h2><p>감이 아닌 데이터로 콘텐츠를 기획하는 시대입니다. 유튜브 API를 활용해 조회수, 댓글, 키워드 트렌드를 분석하고 성공 확률 높은 콘텐츠를 만드세요.</p>

<h2>AI 챗봇 어시스턴트 활용법</h2><p>유튜브 데이터를 수집하고 분석하는 프로그램을 무료로 배포합니다. AI 챗봇을 통해 자동으로 인사이트를 추출하고 리포트를 생성할 수 있습니다.</p>`,
        category: "데이터 분석",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
        author: "알파GOGOGO",
        authorImage: "/avatar.png",
        publishedAt: "2024-12-28",
        readTime: "7분",
        featured: 0,
      },
    ];

    await db.insert(blogPosts).values(blogPostsData);

    // Seed Products
    const productsData: InsertProduct[] = [
      {
        title: "본질을 찾아서 Vol.3 - 퍼스널 브랜딩의 시작",
        slug: "personal-branding-course-vol3",
        description: "콘텐츠 소비의 시대, 콘텐츠가 돈이 되는 세상. 비전문가도 가능한 브랜딩 전략",
        fullDescription: "이제 비전문인, 비개발자도 누구나 브랜딩할 수 있습니다. 마케팅의 본질부터 AI를 활용한 실전 브랜딩까지, 퍼스널 브랜딩 성공을 위한 모든 것을 담았습니다.",
        price: "₩199,000",
        imageUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format&fit=crop",
        category: "온라인 강의",
        badge: "모집중",
        featured: 1,
        features: [
          "마케팅의 본질 이해하기",
          "퍼스널 브랜딩 전략 수립",
          "AI 도구를 활용한 콘텐츠 제작",
          "노코드 웹 개발 기초",
          "수익화 전략 및 실전 사례",
        ],
      },
      {
        title: "블로그 수익화 마스터 과정",
        slug: "blog-monetization-master",
        description: "ChatGPT와 함께하는 블로그 자동화부터 월 100만원 수익까지",
        fullDescription: "검색 엔진 최적화(SEO)부터 애드센스, 제휴 마케팅, 디지털 상품 판매까지. 블로그로 수익을 만드는 모든 전략을 실전 사례와 함께 배웁니다.",
        price: "₩149,000",
        imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop",
        category: "온라인 강의",
        badge: "HOT",
        featured: 1,
        features: [
          "블로그 자동화 3단계 전략",
          "SEO 최적화 완벽 가이드",
          "키워드 분석 및 콘텐츠 기획",
          "ChatGPT 활용한 글쓰기",
          "애드센스 & 제휴 마케팅 실전",
        ],
      },
      {
        title: "AI 콘텐츠 자동화 패키지",
        slug: "ai-content-automation-package",
        description: "유튜브, 블로그, SNS 콘텐츠를 AI로 자동 생성하는 올인원 솔루션",
        fullDescription: "데이터 수집부터 콘텐츠 생성, 이미지 제작, 자동 포스팅까지. AI를 활용한 완전한 콘텐츠 자동화 시스템을 구축하세요.",
        price: "₩299,000",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop",
        category: "프로그램",
        badge: "프리미엄",
        featured: 1,
        features: [
          "유튜브 데이터 수집 프로그램",
          "블로그 자동화 프로그램",
          "AI 이미지 생성기 통합",
          "SEO 최적화 자동 적용",
          "평생 무료 업데이트",
        ],
      },
    ];

    await db.insert(products).values(productsData);

    // Seed Resources
    const resourcesData: InsertResource[] = [
      {
        title: "유튜브 데이터 수집 + 분석 + AI 챗봇 어시스턴트 프로그램 무료 배포",
        slug: "youtube-data-analysis-ai-assistant",
        description: "유튜브 API를 활용한 데이터 수집부터 AI 챗봇 어시스턴트를 통한 자동 분석까지, 완전한 유튜브 분석 솔루션입니다.",
        fileType: "템플릿",
        fileSize: "41.4 MB",
        downloadUrl: "#",
        category: "프로그램",
        downloads: 1838,
        author: "알파GOGOGO",
        publishedAt: "2025-01-10",
        featured: 1,
        tags: ["유튜브", "AI", "무료"],
      },
      {
        title: "블로그 자동화 프로그램",
        slug: "blog-automation-program",
        description: "ChatGPT를 활용한 블로그 콘텐츠 자동 생성 및 포스팅 프로그램. SEO 최적화 기능 포함.",
        fileType: "기타",
        fileSize: "126.65 MB",
        downloadUrl: "#",
        category: "프로그램",
        downloads: 3802,
        author: "알파GOGOGO",
        publishedAt: "2025-01-05",
        featured: 1,
        tags: ["AI", "프리미엄", "무료"],
      },
      {
        title: "AdSense SEO 블로그 글쓰기 마스터 GPT 지침",
        slug: "adsense-seo-blog-gpt-guide",
        description: "구글 애드센스 승인과 수익 극대화를 위한 SEO 최적화 블로그 글쓰기 GPT 프롬프트 모음집.",
        fileType: "PDF",
        fileSize: "3.2 MB",
        downloadUrl: "#",
        category: "가이드",
        downloads: 2156,
        author: "알파GOGOGO",
        publishedAt: "2024-12-28",
        featured: 0,
        tags: ["SEO", "애드센스", "GPT"],
      },
      {
        title: "누구나 쉽게 만드는 크롤링 프로그램 - 올리브영 크롤링 프롬프트",
        slug: "crawling-program-prompt",
        description: "코딩 지식 없이도 ChatGPT로 크롤링 프로그램을 만드는 방법. 올리브영 크롤링 실전 예제 포함.",
        fileType: "프롬프트",
        fileSize: "2.8 MB",
        downloadUrl: "#",
        category: "템플릿",
        downloads: 1547,
        author: "알파GOGOGO",
        publishedAt: "2024-12-20",
        featured: 0,
        tags: ["크롤링", "AI", "프롬프트"],
      },
    ];

    await db.insert(resources).values(resourcesData);

    // Seed Services
    const servicesData: InsertService[] = [
      {
        title: "블로그 1단계, 키워드 검색 & 분석 GPT",
        slug: "blog-keyword-search-gpt",
        description: "효과적인 블로그 작성을 위한 첫 단계로, 관련 키워드를 검색하고 분석해주는 AI 도구입니다.",
        icon: "search",
        features: [
          "네이버/구글 키워드 트렌드 분석",
          "경쟁도 자동 분석",
          "주차별 키워드 생성",
          "검색량 기반 우선순위 제안",
        ],
      },
      {
        title: "블로그 2단계, SEO 블로그 글 생성기 GPT",
        slug: "seo-blog-generator-gpt",
        description: "검색 엔진 최적화를 고려한 블로그 콘텐츠를 자동으로 생성해주는 AI 도구입니다.",
        icon: "file-text",
        features: [
          "SEO 최적화 콘텐츠 자동 생성",
          "메타태그 및 description 작성",
          "키워드 밀도 자동 조절",
          "마크다운 및 HTML 형식 지원",
        ],
      },
      {
        title: "블로그 3단계, 이미지 생성기 GPT",
        slug: "blog-image-generator-gpt",
        description: "블로그 콘텐츠에 어울리는 맞춤형 이미지를 AI로 생성해주는 도구입니다.",
        icon: "image",
        features: [
          "블로그 주제에 맞는 이미지 자동 생성",
          "썸네일 최적화",
          "저작권 걱정 없는 AI 이미지",
          "다양한 스타일 선택 가능",
        ],
      },
      {
        title: "블로그 버튼 생성기",
        slug: "blog-button-creator",
        description: "블로그용 커스텀 HTML 버튼을 쉽게 디자인하고 생성할 수 있는 도구입니다.",
        icon: "mouse-pointer",
        features: [
          "색상/폰트/크기 커스터마이징",
          "HTML 코드 자동 생성",
          "반응형 디자인 지원",
          "다양한 버튼 스타일 템플릿",
        ],
      },
    ];

    await db.insert(services).values(servicesData);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Initialize PostgreSQL storage
export const storage: IStorage = new PgStorage();

// Seed database (runs async but doesn't block)
seedDatabase().catch(console.error);
