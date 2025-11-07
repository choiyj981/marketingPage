FROM node:18-alpine

WORKDIR /app

# 빌드 인자로 Git 커밋 시간 받기 (선택사항)
ARG GIT_COMMIT_TIME

# 패키지 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# Git 커밋 시간을 환경 변수로 설정 (빌드 시 사용)
ENV GIT_COMMIT_TIME=${GIT_COMMIT_TIME}

# 빌드 실행
RUN npm run build

# 포트 노출
EXPOSE 8080

# 환경 변수 설정
ENV NODE_ENV=production
ENV PORT=8080

# 서버 시작
CMD ["npm", "start"]

