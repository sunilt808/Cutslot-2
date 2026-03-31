# Build stage
FROM node:22 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage (serve static files)
FROM node:22-slim

WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy built files
COPY --from=build /app/dist ./dist

EXPOSE 3000

# Run frontend
CMD ["serve", "-s", "dist", "-l", "3000"]