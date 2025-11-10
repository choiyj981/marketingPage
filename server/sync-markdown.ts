import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { blogPosts } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import type { InsertBlogPost } from '@shared/schema';
import { db } from './db';
import chokidar from 'chokidar';

const BLOG_POSTS_DIR = process.env.BLOG_POSTS_DIR || './blog-posts';

/**
 * 마크다운 파일 → DB 동기화 (메타데이터만)
 * 개발 서버 시작 시 자동으로 호출됨
 */
export async function syncMarkdownToDb(): Promise<void> {
  try {
    console.log('📝 마크다운 파일 → DB 동기화 시작...');
    
    const files = await readdir(BLOG_POSTS_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md'));

    if (mdFiles.length === 0) {
      console.log('   마크다운 파일이 없습니다.\n');
      return;
    }

    console.log(`   ${mdFiles.length}개의 마크다운 파일 발견\n`);

    let createdCount = 0;
    let updatedCount = 0;

    for (const fileName of mdFiles) {
      try {
        const filePath = join(BLOG_POSTS_DIR, fileName);
        const fileContent = await readFile(filePath, 'utf-8');
        const { data: frontmatter } = matter(fileContent);

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
        } else {
          await db.insert(blogPosts).values(postData);
          createdCount++;
        }
      } catch (error) {
        console.error(`   ❌ 실패: ${fileName}`);
        console.error(`      ${error instanceof Error ? error.message : error}`);
      }
    }

    if (createdCount > 0 || updatedCount > 0) {
      console.log(`✅ 마크다운 → DB 완료!`);
      console.log(`   생성: ${createdCount}개, 업데이트: ${updatedCount}개\n`);
    } else {
      console.log(`✅ 모든 파일이 이미 동기화되어 있습니다.\n`);
    }
  } catch (error) {
    // 파일 시스템 오류는 무시 (폴더가 없을 수 있음)
    if ((error as any).code === 'ENOENT') {
      console.log('⚠️  blog-posts 폴더가 없습니다. (정상)\n');
      return;
    }
    console.error('⚠️  마크다운 동기화 실패 (계속 진행):');
    console.error(error instanceof Error ? error.message : error);
    console.log('');
  }
}

/**
 * 마크다운 파일 변경 감지 및 자동 동기화
 * 개발 모드에서만 사용
 */
export function watchMarkdownFiles(): void {
  try {
    console.log('👀 마크다운 파일 감시 시작...\n');
    
    const watcher = chokidar.watch(`${BLOG_POSTS_DIR}/*.md`, {
      ignored: /(^|[\/\\])\../, // 숨김 파일 무시
      persistent: true,
      ignoreInitial: true, // 초기 로드는 syncMarkdownToDb()에서 처리
    });

    // 디바운스 함수 (연속된 변경을 하나로 묶음)
    let syncTimeout: NodeJS.Timeout | null = null;
    const debouncedSync = () => {
      if (syncTimeout) {
        clearTimeout(syncTimeout);
      }
      syncTimeout = setTimeout(async () => {
        console.log('📝 파일 변경 감지 → 동기화 시작...');
        await syncMarkdownToDb();
      }, 500); // 500ms 대기
    };

    watcher
      .on('add', (path) => {
        console.log(`➕ 파일 추가: ${path}`);
        debouncedSync();
      })
      .on('change', (path) => {
        console.log(`✏️  파일 변경: ${path}`);
        debouncedSync();
      })
      .on('unlink', (path) => {
        console.log(`🗑️  파일 삭제: ${path}`);
        // 파일 삭제는 수동으로 처리해야 함 (DB에서도 삭제하려면)
        console.log('   ⚠️  DB에서 수동으로 삭제해주세요.\n');
      })
      .on('error', (error) => {
        console.error('❌ 파일 감시 오류:', error);
      });

    console.log(`   감시 중: ${BLOG_POSTS_DIR}/*.md\n`);
  } catch (error) {
    console.error('⚠️  파일 감시 설정 실패:', error);
  }
}

