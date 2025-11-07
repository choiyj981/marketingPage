import { db } from "../server/db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "1";
  const firstName = process.env.ADMIN_FIRST_NAME || "Admin";
  const lastName = process.env.ADMIN_LAST_NAME || "User";
  const username = process.env.ADMIN_USERNAME || `admin_${Date.now()}`;

  try {
    console.log("🔐 관리자 계정 생성 중...");
    console.log(`📧 이메일: ${email}`);
    console.log(`👤 이름: ${firstName} ${lastName}`);
    console.log(`🔑 사용자명: ${username}`);

    // 기존 사용자 확인
    const [existingUser] = await db.select().from(users).where(eq(users.email, email));

    if (existingUser) {
      console.log("⚠️  기존 사용자가 발견되었습니다. 관리자 권한을 부여합니다...");
      
      // 평문 비밀번호 저장
      const [updatedUser] = await db
        .update(users)
        .set({
          passwordHash: password, // 평문으로 저장
          firstName,
          lastName,
          username,
          isAdmin: true,
          status: "active",
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingUser.id))
        .returning();

      console.log("✅ 관리자 권한이 부여되었습니다!");
      console.log(`   사용자 ID: ${updatedUser.id}`);
      console.log(`   이메일: ${updatedUser.email}`);
      console.log(`   관리자 여부: ${updatedUser.isAdmin}`);
      return;
    }

    // 새 관리자 계정 생성
    // 평문 비밀번호 저장, ID를 "admin"으로 설정
    const adminId = "admin";
    const [newUser] = await db
      .insert(users)
      .values({
        id: adminId, // ID를 "admin"으로 설정
        email,
        username,
        passwordHash: password, // 평문으로 저장
        firstName,
        lastName,
        isAdmin: true,
        status: "active",
      })
      .returning();

    console.log("✅ 관리자 계정이 성공적으로 생성되었습니다!");
    console.log(`   사용자 ID: ${newUser.id}`);
    console.log(`   이메일: ${newUser.email}`);
    console.log(`   사용자명: ${newUser.username || "없음"}`);
    console.log(`   관리자 여부: ${newUser.isAdmin}`);
    console.log(`   상태: ${newUser.status}`);
    console.log("\n📝 로그인 정보:");
    console.log(`   이메일: ${email}`);
    console.log(`   비밀번호: ${password}`);
    console.log("\n⚠️  보안을 위해 프로덕션 환경에서는 비밀번호를 변경하세요!");
  } catch (error: any) {
    console.error("❌ 관리자 계정 생성 중 오류 발생:");
    console.error(error);
    
    if (error.code === '23505') { // unique_violation
      if (error.constraint?.includes('email')) {
        console.error("   이미 존재하는 이메일입니다.");
      }
      if (error.constraint?.includes('username')) {
        console.error("   이미 사용 중인 사용자명입니다.");
      }
    }
    
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

createAdmin();


