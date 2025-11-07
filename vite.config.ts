import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Git 커밋 시간 가져오기 (빌드 시점)
function getGitCommitTime() {
  // 1. 환경 변수에서 가져오기 (Docker 빌드 시)
  if (process.env.GIT_COMMIT_TIME) {
    try {
      const date = new Date(process.env.GIT_COMMIT_TIME);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch (error) {
      // 날짜 파싱 실패 시 Git 명령어 시도
    }
  }
  
  // 2. Git 명령어로 가져오기 (로컬 빌드 시)
  try {
    // 마지막 커밋의 커밋 시간 가져오기 (YYYY-MM-DD HH:mm 형식)
    const commitTime = execSync('git log -1 --format=%ci', { encoding: 'utf-8' }).trim();
    // ISO 형식을 YYYY-MM-DD HH:mm 형식으로 변환
    const date = new Date(commitTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (error) {
    // Git이 없거나 오류가 발생하면 현재 시간 사용
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
}

export default defineConfig({
  plugins: [
    react(),
  ],
  define: {
    // Git 커밋 시간을 빌드 시점에 주입 (버전 및 배포 시간으로 사용)
    'import.meta.env.VITE_BUILD_TIME': JSON.stringify(getGitCommitTime()),
    'import.meta.env.VITE_VERSION': JSON.stringify(getGitCommitTime()), // 버전도 커밋 시간으로 설정
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
