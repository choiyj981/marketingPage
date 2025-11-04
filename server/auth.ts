import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import type { User } from "@shared/schema";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  // 임시: 데이터베이스 없이 서버 시작 테스트용
  let sessionStore;
  if (process.env.DATABASE_URL) {
    const pgStore = connectPg(session);
    sessionStore = new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: false,
      ttl: sessionTtl,
      tableName: "sessions",
    });
  } else {
    // 메모리 기반 세션 스토어 사용 (서버 재시작 시 세션 초기화됨)
    console.warn("⚠️  데이터베이스 없이 메모리 세션 스토어를 사용합니다.");
    sessionStore = undefined; // undefined면 메모리 스토어 사용
  }
  
  // Use secure cookies only in production (HTTPS)
  const isProduction = process.env.NODE_ENV === "production";
  
  return session({
    secret: process.env.SESSION_SECRET || "dev-secret-key-change-in-production",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport-local strategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user || !user.passwordHash) {
            return done(null, false, { message: "이메일 또는 비밀번호가 올바르지 않습니다." });
          }

          const isValidPassword = await bcrypt.compare(password, user.passwordHash);
          if (!isValidPassword) {
            return done(null, false, { message: "이메일 또는 비밀번호가 올바르지 않습니다." });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user: Express.User, done) => {
    const dbUser = user as User;
    done(null, dbUser.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      // Don't send password hash to client
      const { passwordHash, ...userWithoutPassword } = user;
      done(null, userWithoutPassword);
    } catch (error) {
      done(error);
    }
  });

  // Login endpoint
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "인증에 실패했습니다." });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "로그인 중 오류가 발생했습니다." });
        }
        const { passwordHash, ...userWithoutPassword } = user as User & { passwordHash?: string };
        return res.json({ message: "로그인 성공", user: userWithoutPassword });
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "로그아웃 중 오류가 발생했습니다." });
      }
      res.json({ message: "로그아웃되었습니다." });
    });
  });

  // Register endpoint (optional, for creating new accounts)
  app.post("/api/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "이메일과 비밀번호를 입력해주세요." });
      }

      if (password.length < 8) {
        return res.status(400).json({ message: "비밀번호는 최소 8자 이상이어야 합니다." });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "이미 존재하는 이메일입니다." });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await storage.upsertUser({
        email,
        passwordHash,
        firstName: firstName || null,
        lastName: lastName || null,
        isAdmin: false,
      });

      const { passwordHash: _, ...userWithoutPassword } = newUser;
      res.status(201).json({ message: "회원가입이 완료되었습니다.", user: userWithoutPassword });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "회원가입 중 오류가 발생했습니다." });
    }
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "인증이 필요합니다." });
  }
  return next();
};

