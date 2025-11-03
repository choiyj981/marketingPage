import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertBlogPostSchema, insertProductSchema, insertResourceSchema, insertServiceSchema } from "@shared/schema";
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

  const httpServer = createServer(app);
  return httpServer;
}
