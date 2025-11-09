import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, index, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content"), // nullable: 마크다운 파일에서 읽음
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  author: text("author").notNull().default("Business Platform"),
  authorImage: text("author_image").notNull().default("/avatar.png"),
  publishedAt: text("published_at").notNull(),
  readTime: text("read_time").notNull(),
  featured: integer("featured").notNull().default(0),
  tags: text("tags").array().notNull().default(sql`'{}'::text[]`),
  attachmentUrl: text("attachment_url"),
  attachmentFilename: text("attachment_filename"),
  attachmentSize: text("attachment_size"),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  fullDescription: text("full_description").notNull(),
  price: text("price").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  badge: text("badge"),
  featured: integer("featured").notNull().default(0),
  features: text("features").array().notNull(),
  tags: text("tags").array().notNull().default(sql`'{}'::text[]`),
  attachmentUrl: text("attachment_url"),
  attachmentFilename: text("attachment_filename"),
  attachmentSize: text("attachment_size"),
});

export const resources = pgTable("resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: text("file_size").notNull(),
  downloadUrl: text("download_url").notNull(),
  category: text("category").notNull(),
  downloads: integer("downloads").notNull().default(0),
  author: text("author").notNull().default("Business Platform"),
  publishedAt: text("published_at").notNull(),
  featured: integer("featured").notNull().default(0),
  tags: text("tags").array().notNull(),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  features: text("features").array().notNull(),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for local authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  username: varchar("username").unique(),
  passwordHash: varchar("password_hash").notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  phone: varchar("phone"),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: boolean("is_admin").notNull().default(false),
  status: varchar("status").notNull().default("active"), // active, inactive, suspended
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Newsletter subscriptions
export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
  status: text("status").notNull().default("active"),
});

// Product reviews
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  rating: integer("rating").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  status: text("status").notNull().default("pending"),
});

// FAQ entries
export const faqEntries = pgTable("faq_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  status: text("status").notNull().default("published"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Metrics snapshots
export const metricsSnapshots = pgTable("metrics_snapshots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  value: integer("value").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).omit({
  id: true,
  subscribedAt: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  status: z.enum(["active", "unsubscribed"]).optional(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
}).extend({
  productId: z.string().min(1, "Product ID is required"),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  body: z.string().min(10, "Review must be at least 10 characters"),
  authorName: z.string().min(2, "Name must be at least 2 characters"),
  authorEmail: z.string().email("Please enter a valid email address"),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
});

export const insertFaqEntrySchema = createInsertSchema(faqEntries).omit({
  id: true,
  createdAt: true,
}).extend({
  question: z.string().min(5, "Question must be at least 5 characters"),
  answer: z.string().min(10, "Answer must be at least 10 characters"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  displayOrder: z.number().int().min(0).optional(),
  status: z.enum(["published", "draft"]).optional(),
});

export const insertMetricsSnapshotSchema = createInsertSchema(metricsSnapshots).omit({
  id: true,
  updatedAt: true,
}).extend({
  name: z.string().min(1, "Metric name is required"),
  value: z.number().int().min(0, "Value must be a non-negative integer"),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type FaqEntry = typeof faqEntries.$inferSelect;
export type InsertFaqEntry = z.infer<typeof insertFaqEntrySchema>;

export type MetricsSnapshot = typeof metricsSnapshots.$inferSelect;
export type InsertMetricsSnapshot = z.infer<typeof insertMetricsSnapshotSchema>;

export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
