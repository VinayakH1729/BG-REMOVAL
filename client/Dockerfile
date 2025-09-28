# Use Node.js 20 Alpine for Vite compatibility
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose the port that Vite dev server runs on
EXPOSE 5173

# Set environment to development for now (change to production as needed)
ENV NODE_ENV=development

# Start the development server
CMD ["npm", "run", "dev", "--", "--host"]