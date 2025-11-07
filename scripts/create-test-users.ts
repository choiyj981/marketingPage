import { db } from "../server/db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";

async function createTestUsers() {
  try {
    console.log("🔐 테스트 계정 10개 생성 중...");

    const testUsers = [
      { email: "test1@example.com", username: "test1", firstName: "테스트", lastName: "사용자1", password: "1" },
      { email: "test2@example.com", username: "test2", firstName: "테스트", lastName: "사용자2", password: "1" },
      { email: "test3@example.com", username: "test3", firstName: "테스트", lastName: "사용자3", password: "1" },
      { email: "test4@example.com", username: "test4", firstName: "테스트", lastName: "사용자4", password: "1" },
      { email: "test5@example.com", username: "test5", firstName: "테스트", lastName: "사용자5", password: "1" },
      { email: "test6@example.com", username: "test6", firstName: "테스트", lastName: "사용자6", password: "1" },
      { email: "test7@example.com", username: "test7", firstName: "테스트", lastName: "사용자7", password: "1" },
      { email: "test8@example.com", username: "test8", firstName: "테스트", lastName: "사용자8", password: "1" },
      { email: "test9@example.com", username: "test9", firstName: "테스트", lastName: "사용자9", password: "1" },
      { email: "test10@example.com", username: "test10", firstName: "테스트", lastName: "사용자10", password: "1" },
    ];

    const createdUsers: Array<{ email: string; username: string | null; id: string }> = [];
    const skippedUsers: string[] = [];

    for (const userData of testUsers) {
      try {
        // 기존 사용자 확인
        const [existingUser] = await db.select().from(users).where(eq(users.email, userData.email));

        if (existingUser) {
          console.log(`⚠️  ${userData.email} 이미 존재합니다. 건너뜁니다.`);
          skippedUsers.push(userData.email);
          continue;
        }

        // 평문 비밀번호 저장, ID를 username으로 설정
        const [newUser] = await db
          .insert(users)
          .values({
            id: userData.username, // ID를 username으로 설정 (test1, test2 등)
            email: userData.email,
            username: userData.username,
            passwordHash: userData.password, // 평문으로 저장
            firstName: userData.firstName,
            lastName: userData.lastName,
            isAdmin: false,
            status: "active",
          })
          .returning();

        createdUsers.push({
          email: newUser.email,
          username: newUser.username,
          id: newUser.id,
        });

        console.log(`✅ ${userData.email} 생성 완료`);
      } catch (error: any) {
        if (error.code === '23505') { // unique_violation
          console.log(`⚠️  ${userData.email} 또는 ${userData.username} 이미 존재합니다. 건너뜁니다.`);
          skippedUsers.push(userData.email);
        } else {
          console.error(`❌ ${userData.email} 생성 실패:`, error.message);
        }
      }
    }

    console.log("\n📊 생성 결과:");
    console.log(`   생성된 계정: ${createdUsers.length}개`);
    console.log(`   건너뛴 계정: ${skippedUsers.length}개`);

    if (createdUsers.length > 0) {
      console.log("\n✅ 생성된 테스트 계정:");
      createdUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} (${user.username})`);
      });
    }

    if (skippedUsers.length > 0) {
      console.log("\n⚠️  건너뛴 계정:");
      skippedUsers.forEach((email, index) => {
        console.log(`   ${index + 1}. ${email}`);
      });
    }

    console.log("\n📝 로그인 정보 (모든 계정 공통):");
    console.log(`   비밀번호: 1`);
  } catch (error: any) {
    console.error("❌ 테스트 계정 생성 중 오류 발생:");
    console.error(error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

createTestUsers();

