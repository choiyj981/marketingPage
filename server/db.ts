import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

// 임시: 데이터베이스 없이 서버 시작 테스트용
let db: ReturnType<typeof drizzle>;
if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL이 설정되지 않았습니다. 서버는 시작되지만 데이터베이스 기능은 작동하지 않습니다.");
  // 더미 연결 생성 (실제로는 사용되지 않음)
  const dummySql = neon("postgresql://dummy:dummy@localhost:5432/dummy");
  db = drizzle(dummySql, { schema });
} else {
  // Use HTTP-based neon client (works without WebSocket)
  const sql = neon(process.env.DATABASE_URL);
  db = drizzle(sql, { schema });
}

export { db };
