import bcrypt from "bcrypt";
import { db } from "../server/db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";

async function insertMasterAccount() {
  // 마스터 계정 정보
  const email = "master@example.com";
  const password = "master1234";
  const firstName = "마스터";
  const lastName = "관리자";
  const username = "master";

  try {
    console.log("🔐 USERS 테이블에 마스터 계정 생성 중...");
    console.log(`📧 이메일: ${email}`);
    console.log(`👤 이름: ${firstName} ${lastName}`);
    console.log(`🔑 사용자명: ${username}`);
    console.log(`⭐ 마스터 권한: Y`);
    console.log(`🔒 관리자 권한: true`);

    // 기존 사용자 확인
    const [existingUser] = await db.select().from(users).where(eq(users.email, email));

    if (existingUser) {
      console.log("⚠️  기존 사용자가 발견되었습니다. 마스터 권한을 부여합니다...");
      
      const passwordHash = await bcrypt.hash(password, 10);
      const [updatedUser] = await db
        .update(users)
        .set({
          passwordHash,
          firstName,
          lastName,
          username,
          isAdmin: true,
          master: "Y",
          status: "active",
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingUser.id))
        .returning();

      console.log("\n✅ 마스터 권한이 부여되었습니다!");
      console.log(`   사용자 ID: ${updatedUser.id}`);
      console.log(`   이메일: ${updatedUser.email}`);
      console.log(`   사용자명: ${updatedUser.username || "없음"}`);
      console.log(`   관리자 여부: ${updatedUser.isAdmin}`);
      console.log(`   마스터 여부: ${updatedUser.master}`);
      console.log(`   상태: ${updatedUser.status}`);
      console.log("\n📝 로그인 정보:");
      console.log(`   이메일: ${email}`);
      console.log(`   비밀번호: ${password}`);
      console.log("\n🌐 관리자 페이지 접속:");
      console.log(`   http://35.237.229.92:8080/login`);
      return;
    }

    // 새 마스터 계정 생성
    const passwordHash = await bcrypt.hash(password, 10);
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        username,
        passwordHash,
        firstName,
        lastName,
        isAdmin: true,
        master: "Y",
        status: "active",
      })
      .returning();

    console.log("\n✅ 마스터 계정이 USERS 테이블에 성공적으로 생성되었습니다!");
    console.log(`   사용자 ID: ${newUser.id}`);
    console.log(`   이메일: ${newUser.email}`);
    console.log(`   사용자명: ${newUser.username || "없음"}`);
    console.log(`   관리자 여부: ${newUser.isAdmin}`);
    console.log(`   마스터 여부: ${newUser.master}`);
    console.log(`   상태: ${newUser.status}`);
    console.log("\n📝 로그인 정보:");
    console.log(`   이메일: ${email}`);
    console.log(`   비밀번호: ${password}`);
    console.log("\n🌐 관리자 페이지 접속:");
    console.log(`   http://35.237.229.92:8080/login`);
    console.log("\n✨ 이 계정으로 로그인하면 관리자 모드에 접근할 수 있습니다!");
  } catch (error: any) {
    console.error("\n❌ 마스터 계정 생성 중 오류 발생:");
    console.error(error);
    
    if (error.code === '23505') { // unique_violation
      if (error.constraint?.includes('email')) {
        console.error("   이미 존재하는 이메일입니다.");
      }
      if (error.constraint?.includes('username')) {
        console.error("   이미 사용 중인 사용자명입니다.");
      }
    }
    
    if (error.message?.includes('column "master" does not exist')) {
      console.error("\n⚠️  'master' 컬럼이 없습니다. 먼저 데이터베이스 마이그레이션을 실행하세요:");
      console.error("   docker-compose -f docker-compose.prod.yml exec app npm run db:push");
    }
    
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

insertMasterAccount();


