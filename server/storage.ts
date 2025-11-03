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
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Blog Posts
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;

  // Products
  getAllProducts(): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Resources
  getAllResources(): Promise<Resource[]>;
  getResourceBySlug(slug: string): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;

  // Services
  getAllServices(): Promise<Service[]>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;

  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
}

export class MemStorage implements IStorage {
  private blogPosts: Map<string, BlogPost>;
  private products: Map<string, Product>;
  private resources: Map<string, Resource>;
  private services: Map<string, Service>;
  private contacts: Map<string, Contact>;

  constructor() {
    this.blogPosts = new Map();
    this.products = new Map();
    this.resources = new Map();
    this.services = new Map();
    this.contacts = new Map();
    
    this.seedData();
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
}

export const storage = new MemStorage();
