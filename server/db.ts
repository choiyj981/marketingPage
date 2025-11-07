import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// PostgreSQL 데이터베이스 연결 (로컬, EC2, Neon 등 지원)
let db: ReturnType<typeof drizzle>;
if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL이 설정되지 않았습니다. 서버는 시작되지만 데이터베이스 기능은 작동하지 않습니다.");
  // 더미 연결 생성 (실제로는 사용되지 않음)
  const dummySql = postgres("postgresql://dummy:dummy@localhost:5432/dummy");
  db = drizzle(dummySql, { schema });
} else {
  // 로컬 PostgreSQL, EC2 내부 PostgreSQL, Neon 등 모든 PostgreSQL 연결 지원
  // EC2 사용 시: DATABASE_URL=postgresql://user:password@localhost:5432/dbname
  const sql = postgres(process.env.DATABASE_URL);
  db = drizzle(sql, { schema });
  console.log("✓ 데이터베이스 연결 성공");
}

export { db };
