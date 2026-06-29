# Stage 1: Build Next.js
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run Next.js
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# Copy public assets and static files
COPY --from=builder /app/public ./public
# Copy standalone build (which contains the compiled server and minimum node_modules)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
