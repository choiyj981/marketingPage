import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';
import { blogPosts } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import type { InsertBlogPost } from '@shared/schema';

// 환경 변수 로드
config();

// 설정
const BLOG_POSTS_DIR = process.env.BLOG_POSTS_DIR || './blog-posts';
const DATABASE_URL = process.env.DATABASE_URL;

console.log('🔄 마크다운 → DB 동기화 시작...\n');
console.log('🔍 환경 변수 확인 중...');
console.log(`   DATABASE_URL: ${DATABASE_URL ? '설정됨' : '설정 안됨'}`);
console.log(`   BLOG_POSTS_DIR: ${BLOG_POSTS_DIR}\n`);

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL이 설정되지 않았습니다.');
  console.error('   .env 파일에 DATABASE_URL을 설정해주세요.\n');
  process.exit(1);
}

// 데이터베이스 연결
console.log('🔌 데이터베이스 연결 시도 중...');
let sql: ReturnType<typeof postgres>;
let db: ReturnType<typeof drizzle>;

try {
  sql = postgres(DATABASE_URL);
  db = drizzle(sql);
  console.log('✅ 데이터베이스 연결 성공\n');
} catch (error) {
  console.error('❌ 데이터베이스 연결 실패:');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

/**
 * 마크다운 파일 → DB 동기화 (메타데이터만)
 */
async function syncMarkdownToDb() {
  try {
    console.log('📤 마크다운 → DB 동기화 시작...');
    
    const files = await readdir(BLOG_POSTS_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md'));

    console.log(`   ${mdFiles.length}개의 마크다운 파일 발견\n`);

    let createdCount = 0;
    let updatedCount = 0;

    for (const fileName of mdFiles) {
      try {
        const filePath = join(BLOG_POSTS_DIR, fileName);
        const fileContent = await readFile(filePath, 'utf-8');
        const { data: frontmatter, content: markdownContent } = matter(fileContent);

        if (!frontmatter.title || !frontmatter.slug) {
          console.log(`⚠️  건너뜀: ${fileName} (title 또는 slug 없음)`);
          continue;
        }

        // 메타데이터만 DB에 저장 (content는 파일에 그대로 둠)
        const postData: InsertBlogPost = {
          title: frontmatter.title,
          slug: frontmatter.slug,
          excerpt: frontmatter.excerpt || frontmatter.title.substring(0, 150),
          content: null, // content는 마크다운 파일에서 읽음
          category: frontmatter.category || '기타',
          imageUrl: frontmatter.imageUrl || '/default-blog-image.jpg',
          author: frontmatter.author || 'Business Platform',
          authorImage: frontmatter.authorImage || '/avatar.png',
          publishedAt: frontmatter.publishedAt || new Date().toISOString().split('T')[0],
          readTime: frontmatter.readTime || '5분',
          featured: frontmatter.featured || 0,
          tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
          attachmentUrl: frontmatter.attachmentUrl || undefined,
          attachmentFilename: frontmatter.attachmentFilename || undefined,
          attachmentSize: frontmatter.attachmentSize || undefined,
        };

        // 기존 포스트 확인
        const existingPosts = await db
          .select()
          .from(blogPosts)
          .where(eq(blogPosts.slug, postData.slug));

        if (existingPosts.length > 0) {
          await db
            .update(blogPosts)
            .set(postData)
            .where(eq(blogPosts.id, existingPosts[0].id));
          updatedCount++;
          console.log(`   📝 업데이트: ${postData.slug}`);
        } else {
          await db.insert(blogPosts).values(postData);
          createdCount++;
          console.log(`   ✨ 생성: ${postData.slug}`);
        }
      } catch (error) {
        console.error(`   ❌ 실패: ${fileName}`);
        console.error(`      ${error instanceof Error ? error.message : error}`);
      }
    }

    console.log(`\n✅ 마크다운 → DB 완료!`);
    console.log(`   생성: ${createdCount}개, 업데이트: ${updatedCount}개\n`);

    await sql.end();
  } catch (error) {
    console.error('❌ 동기화 실패:');
    console.error(error instanceof Error ? error.message : error);
    await sql.end();
    process.exit(1);
  }
}

// 실행
syncMarkdownToDb();

