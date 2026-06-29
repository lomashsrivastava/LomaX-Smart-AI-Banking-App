# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy application code
COPY . .

# Build TS to JS
RUN npm run build

# Stage 2: Production runtime image
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy compiled JavaScript and required asset files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/branchesData2.csv ./
COPY --from=builder /app/seedEmployeesAtlas.js ./

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
