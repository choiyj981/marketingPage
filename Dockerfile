FROM node:18-alpine

WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# 빌드 실행
RUN npm run build

# 포트 노출
EXPOSE 8080

# 환경 변수 설정
ENV NODE_ENV=production
ENV PORT=8080

# 서버 시작
CMD ["npm", "start"]

