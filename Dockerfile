# Base on Node 20 or newer
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first for maximum cache leverage
COPY package*.json ./
RUN npm ci

# Copy full application code
COPY . .

# Build the Vite React Frontend statically into the /dist folder
RUN npm run build

# ==================================
# Stage 2: Production Execution Environment
# ==================================
FROM node:20-alpine AS runner

WORKDIR /app

# We need express, cors, dotenv, nodemailer to run the backend server
COPY package*.json ./
RUN npm ci --omit=dev

# Copy only the compiled frontend, server code, and the flat-file CMS data
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./
COPY --from=builder /app/data ./data

# Set environment
ENV NODE_ENV=production
# Expose port (Cloud Run automatically injects process.env.PORT, usually 8080)
EXPOSE 8080

# Run the single backend server
CMD ["node", "server.js"]
