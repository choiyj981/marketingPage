import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSchema, 
  insertBlogPostSchema, 
  insertProductSchema, 
  insertResourceSchema, 
  insertServiceSchema,
  insertNewsletterSubscriptionSchema,
  insertReviewSchema,
  insertFaqEntrySchema,
  insertMetricsSnapshotSchema
} from "@shared/schema";
import { z } from "zod";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { uploadImage, uploadFile } from "./upload";

// Admin middleware - checks if user has isAdmin permission
const isAdmin = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.user || !req.user.claims || !req.user.claims.sub) {
      return res.status(401).json({ error: "인증이 필요합니다" });
    }

    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "관리자 권한이 필요합니다" });
    }

    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Auth endpoints
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Blog endpoints
  app.get("/api/blog", async (_req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // Products endpoints
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const product = await storage.getProductBySlug(slug);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Resources endpoints
  app.get("/api/resources", async (_req, res) => {
    try {
      const resources = await storage.getAllResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  });

  app.get("/api/resources/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const resource = await storage.getResourceBySlug(slug);
      
      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }
      
      res.json(resource);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resource" });
    }
  });

  // Services endpoints
  app.get("/api/services", async (_req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.get("/api/services/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const service = await storage.getServiceBySlug(slug);
      
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch service" });
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  });

  // Get all contacts (for admin purposes)
  app.get("/api/contacts", isAuthenticated, isAdmin, async (_req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.delete("/api/contacts/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const contacts = await storage.getAllContacts();
      const existing = contacts.find(c => c.id === id);
      if (!existing) {
        return res.status(404).json({ error: "문의사항을 찾을 수 없습니다" });
      }
      await storage.deleteContact(id);
      res.json({ message: "문의사항이 삭제되었습니다" });
    } catch (error) {
      res.status(500).json({ error: "문의사항 삭제에 실패했습니다" });
    }
  });

  // File upload endpoint
  app.post("/api/upload/image", isAuthenticated, isAdmin, uploadImage, async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "파일이 업로드되지 않았습니다" });
      }
      const imageUrl = `/uploads/images/${req.file.filename}`;
      res.json({ url: imageUrl });
    } catch (error) {
      res.status(500).json({ error: "이미지 업로드에 실패했습니다" });
    }
  });

  app.post("/api/upload/file", isAuthenticated, isAdmin, uploadFile, async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "파일이 업로드되지 않았습니다" });
      }
      const fileUrl = `/uploads/files/${req.file.filename}`;
      res.json({ url: fileUrl, filename: req.file.originalname, size: req.file.size });
    } catch (error) {
      res.status(500).json({ error: "파일 업로드에 실패했습니다" });
    }
  });

  // Admin Blog CRUD
  app.post("/api/blog", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "유효성 검사 실패", details: error.errors });
      }
      res.status(500).json({ error: "블로그 포스트 생성에 실패했습니다" });
    }
  });

  app.put("/api/blog/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await storage.getBlogPostById(id);
      if (!existing) {
        return res.status(404).json({ error: "블로그 포스트를 찾을 수 없습니다" });
      }
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(id, validatedData);
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "유효성 검사 실패", details: error.errors });
      }
      res.status(500).json({ error: "블로그 포스트 수정에 실패했습니다" });
    }
  });

  app.delete("/api/blog/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await storage.getBlogPostById(id);
      if (!existing) {
        return res.status(404).json({ error: "블로그 포스트를 찾을 수 없습니다" });
      }
      await storage.deleteBlogPost(id);
      res.json({ message: "블로그 포스트가 삭제되었습니다" });
    } catch (error) {
      res.status(500).json({ error: "블로그 포스트 삭제에 실패했습니다" });
    }
  });

  // Admin Products CRUD
  app.post("/api/products", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "유효성 검사 실패", details: error.errors });
      }
      res.status(500).json({ error: "제품 생성에 실패했습니다" });
    }
  });

  app.put("/api/products/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await storage.getProductById(id);
      if (!existing) {
        return res.status(404).json({ error: "제품을 찾을 수 없습니다" });
      }
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "유효성 검사 실패", details: error.errors });
      }
      res.status(500).json({ error: "제품 수정에 실패했습니다" });
    }
  });

  app.delete("/api/products/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await storage.getProductById(id);
      if (!existing) {
        return res.status(404).json({ error: "제품을 찾을 수 없습니다" });
      }
      await storage.deleteProduct(id);
      res.json({ message: "제품이 삭제되었습니다" });
    } catch (error) {
      res.status(500).json({ error: "제품 삭제에 실패했습니다" });
    }
  });

  // Admin Resources CRUD
  app.post("/api/resources", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(validatedData);
      res.status(201).json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "유효성 검사 실패", details: error.errors });
      }
      res.status(500).json({ error: "자료 생성에 실패했습니다" });
    }
  });

  app.put("/api/resources/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await storage.getResourceById(id);
      if (!existing) {
        return res.status(404).json({ error: "자료를 찾을 수 없습니다" });
      }
      const validatedData = insertResourceSchema.partial().parse(req.body);
      const resource = await storage.updateResource(id, validatedData);
      res.json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "유효성 검사 실패", details: error.errors });
      }
      res.status(500).json({ error: "자료 수정에 실패했습니다" });
    }
  });

  app.delete("/api/resources/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await storage.getResourceById(id);
      if (!existing) {
        return res.status(404).json({ error: "자료를 찾을 수 없습니다" });
      }
      await storage.deleteResource(id);
      res.json({ message: "자료가 삭제되었습니다" });
    } catch (error) {
      res.status(500).json({ error: "자료 삭제에 실패했습니다" });
    }
  });

  // Admin Services CRUD
  app.post("/api/services", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "유효성 검사 실패", details: error.errors });
      }
      res.status(500).json({ error: "서비스 생성에 실패했습니다" });
    }
  });

  app.put("/api/services/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await storage.getServiceById(id);
      if (!existing) {
        return res.status(404).json({ error: "서비스를 찾을 수 없습니다" });
      }
      const validatedData = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(id, validatedData);
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "유효성 검사 실패", details: error.errors });
      }
      res.status(500).json({ error: "서비스 수정에 실패했습니다" });
    }
  });

  app.delete("/api/services/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await storage.getServiceById(id);
      if (!existing) {
        return res.status(404).json({ error: "서비스를 찾을 수 없습니다" });
      }
      await storage.deleteService(id);
      res.json({ message: "서비스가 삭제되었습니다" });
    } catch (error) {
      res.status(500).json({ error: "서비스 삭제에 실패했습니다" });
    }
  });

  // Newsletter endpoints
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const validatedData = insertNewsletterSubscriptionSchema.parse(req.body);
      const subscription = await storage.subscribeNewsletter(validatedData.email, validatedData.name);
      res.status(201).json(subscription);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "유효성 검사 실패", details: error.errors });
      }
      res.status(500).json({ error: "뉴스레터 구독에 실패했습니다" });
    }
  });

  app.get("/api/admin/newsletter", isAuthenticated, isAdmin, async (_req, res) => {
    try {
      const subscribers = await storage.getNewsletterSubscribers();
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ error: "구독자 목록을 가져오는데 실패했습니다" });
    }
  });

  // Review endpoints
  app.get("/api/reviews/:productId", async (req, res) => {
    try {
      const { productId } = req.params;
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ error: "제품을 찾을 수 없습니다" });
      }
      const reviewsList = await storage.getReviewsByProduct(productId);
      res.json(reviewsList);
    } catch (error) {
      res.status(500).json({ error: "리뷰를 가져오는데 실패했습니다" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const product = await storage.getProductById(validatedData.productId);
      if (!product) {
        return res.status(404).json({ error: "제품을 찾을 수 없습니다" });
      }
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "유효성 검사 실패", details: error.errors });
      }
      res.status(500).json({ error: "리뷰 작성에 실패했습니다" });
    }
  });

  app.get("/api/admin/reviews", isAuthenticated, isAdmin, async (_req, res) => {
    try {
      const reviewsList = await storage.getAllReviews();
      res.json(reviewsList);
    } catch (error) {
      res.status(500).json({ error: "리뷰 목록을 가져오는데 실패했습니다" });
    }
  });

  app.put("/api/admin/reviews/:id/status", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: "유효하지 않은 상태입니다" });
      }

      const reviewsList = await storage.getAllReviews();
      const existing = reviewsList.find(r => r.id === id);
      if (!existing) {
        return res.status(404).json({ error: "리뷰를 찾을 수 없습니다" });
      }

      const review = await storage.updateReviewStatus(id, status);
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: "리뷰 상태 업데이트에 실패했습니다" });
    }
  });

  app.delete("/api/admin/reviews/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const reviewsList = await storage.getAllReviews();
      const existing = reviewsList.find(r => r.id === id);
      if (!existing) {
        return res.status(404).json({ error: "리뷰를 찾을 수 없습니다" });
      }
      await storage.deleteReview(id);
      res.json({ message: "리뷰가 삭제되었습니다" });
    } catch (error) {
      res.status(500).json({ error: "리뷰 삭제에 실패했습니다" });
    }
  });

  // FAQ endpoints
  app.get("/api/faq", async (_req, res) => {
    try {
      const faqs = await storage.getFaqs();
      res.json(faqs);
    } catch (error) {
      res.status(500).json({ error: "FAQ를 가져오는데 실패했습니다" });
    }
  });

  app.post("/api/admin/faq", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertFaqEntrySchema.parse(req.body);
      const faq = await storage.createFaq(validatedData);
      res.status(201).json(faq);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "유효성 검사 실패", details: error.errors });
      }
      res.status(500).json({ error: "FAQ 생성에 실패했습니다" });
    }
  });

  app.get("/api/admin/faq", isAuthenticated, isAdmin, async (_req, res) => {
    try {
      const faqs = await storage.getAllFaqs();
      res.json(faqs);
    } catch (error) {
      res.status(500).json({ error: "FAQ 목록을 가져오는데 실패했습니다" });
    }
  });

  app.put("/api/admin/faq/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const allFaqs = await storage.getAllFaqs();
      const existing = allFaqs.find(f => f.id === id);
      if (!existing) {
        return res.status(404).json({ error: "FAQ를 찾을 수 없습니다" });
      }
      const validatedData = insertFaqEntrySchema.partial().parse(req.body);
      const faq = await storage.updateFaq(id, validatedData);
      res.json(faq);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "유효성 검사 실패", details: error.errors });
      }
      res.status(500).json({ error: "FAQ 수정에 실패했습니다" });
    }
  });

  app.delete("/api/admin/faq/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const allFaqs = await storage.getAllFaqs();
      const existing = allFaqs.find(f => f.id === id);
      if (!existing) {
        return res.status(404).json({ error: "FAQ를 찾을 수 없습니다" });
      }
      await storage.deleteFaq(id);
      res.json({ message: "FAQ가 삭제되었습니다" });
    } catch (error) {
      res.status(500).json({ error: "FAQ 삭제에 실패했습니다" });
    }
  });

  // Metrics endpoints
  app.get("/api/metrics", async (_req, res) => {
    try {
      const metrics = await storage.getMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "메트릭을 가져오는데 실패했습니다" });
    }
  });

  app.put("/api/admin/metrics", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertMetricsSnapshotSchema.parse(req.body);
      const metric = await storage.updateMetric(validatedData.name, validatedData.value);
      res.json(metric);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "유효성 검사 실패", details: error.errors });
      }
      res.status(500).json({ error: "메트릭 업데이트에 실패했습니다" });
    }
  });

  // Search endpoint
  app.get("/api/search", async (req, res) => {
    try {
      const { q, type } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: "검색어를 입력해주세요" });
      }

      if (type && typeof type !== 'string') {
        return res.status(400).json({ error: "유효하지 않은 타입입니다" });
      }

      if (type && !['blog', 'product'].includes(type)) {
        return res.status(400).json({ error: "타입은 'blog' 또는 'product'여야 합니다" });
      }

      const results = await storage.searchContent(q, type as string | undefined);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "검색에 실패했습니다" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
