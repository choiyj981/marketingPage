import { readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

// 마크다운 설정
marked.setOptions({
  breaks: false, // 표준 마크다운 동작: 단일 줄바꿈은 무시, 빈 줄만 문단 구분
  gfm: true, // GitHub Flavored Markdown 지원
});

const BLOG_POSTS_DIR = process.env.BLOG_POSTS_DIR || './blog-posts';

/**
 * 마크다운 파일에서 본문 내용 읽기
 */
export async function getMarkdownContent(slug: string): Promise<string | null> {
  try {
    const filePath = join(BLOG_POSTS_DIR, `${slug}.md`);
    const fileContent = await readFile(filePath, 'utf-8');
    const { content } = matter(fileContent);
    
    // 불필요한 빈 줄 정리 (연속된 빈 줄을 하나로)
    const cleanedContent = content
      .replace(/\n{3,}/g, '\n\n') // 3개 이상의 연속된 줄바꿈을 2개로
      .trim();
    
    // 마크다운 → HTML 변환
    let htmlContent = marked(cleanedContent);
    
    // Mermaid 코드 블록을 div.mermaid로 변환 (Mermaid 자동 렌더링을 위해)
    htmlContent = htmlContent.replace(
      /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
      '<div class="mermaid">$1</div>'
    );
    
    return htmlContent;
  } catch (error) {
    console.error(`마크다운 파일 읽기 실패 (${slug}):`, error);
    return null;
  }
}

/**
 * 마크다운 파일 존재 여부 확인
 */
export async function markdownFileExists(slug: string): Promise<boolean> {
  try {
    const filePath = join(BLOG_POSTS_DIR, `${slug}.md`);
    await readFile(filePath, 'utf-8');
    return true;
  } catch {
    return false;
  }
}

