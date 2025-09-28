# BG-REMOVAL - Professional Docker Container Project

## 🐳 Docker Hub Links (For Resume)

**Primary Repository Links:**
- **Docker Hub Profile**: https://hub.docker.com/u/superv65
- **Client Image**: https://hub.docker.com/r/superv65/bg-removal-client
- **Server Image**: https://hub.docker.com/r/superv65/bg-removal-server

## 📋 Resume-Ready Project Description

**Project Title**: Background Removal Web Application (Dockerized)
**Technologies**: React, Node.js, MongoDB, Docker, Vite, Express.js
**Deployment**: Multi-container Docker architecture with Docker Hub distribution

### Key Achievement Points for Resume:
- ✅ **Containerized full-stack application** using Docker and Docker Compose
- ✅ **Published Docker images** to Docker Hub with 1.74GB (client) + 242MB (server)
- ✅ **Multi-service architecture** with React frontend, Node.js backend, and MongoDB
- ✅ **Production-ready deployment** with environment variables and networking
- ✅ **Open-source distribution** via public Docker repositories

## 🚀 One-Click Deployment Commands

Anyone can now run your entire application with these commands:

### Method 1: Using Docker Compose (Recommended)
```bash
# Download and run the complete application
curl -o docker-compose.yml https://raw.githubusercontent.com/VinayakH1729/BG-REMOVAL/main/docker-compose.hub.yml
docker-compose up -d
```

### Method 2: Individual Container Deployment
```bash
# 1. Start MongoDB
docker run -d --name mongodb -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:7-jammy

# 2. Start Backend Server
docker run -d --name bg-server -p 4000:4000 \
  --link mongodb \
  -e MONGODB_URI=mongodb://admin:password@mongodb:27017/bgremoveldb?authSource=admin \
  superv65/bg-removal-server:latest

# 3. Start Frontend Client
docker run -d --name bg-client -p 5173:5173 \
  --link bg-server \
  -e VITE_SERVER_URL=http://localhost:4000 \
  superv65/bg-removal-client:latest
```

### Method 3: Direct Image Pull
```bash
docker pull superv65/bg-removal-client:latest
docker pull superv65/bg-removal-server:latest
```

## 🌐 Live Demo Access
- **Frontend**: http://localhost:5173
- **API Endpoint**: http://localhost:4000
- **Database**: localhost:27017

## 📊 Project Stats
- **Frontend Image Size**: 1.74GB (Node.js 20 + React + Vite)
- **Backend Image Size**: 242MB (Node.js 20 Alpine + Express)
- **Total Downloads**: Available on Docker Hub
- **Architecture**: Multi-container microservices

## 🔧 Technical Implementation
- **Base Image**: Node.js 20 Alpine (optimized for production)
- **Build System**: Multi-stage Docker builds
- **Networking**: Custom Docker bridge network
- **Persistence**: MongoDB volume mounting
- **Environment**: Production-ready configuration

## 📄 Documentation Links
- **GitHub Repository**: https://github.com/VinayakH1729/BG-REMOVAL
- **Docker Hub**: https://hub.docker.com/u/superv65
- **Project README**: https://github.com/VinayakH1729/BG-REMOVAL/blob/main/README.md

---

### 💼 Professional Summary for Resume/LinkedIn:

*"Developed and containerized a full-stack background removal application using React, Node.js, and MongoDB. Implemented Docker containerization with multi-service architecture, published images to Docker Hub (1.74GB client, 242MB server), and created one-click deployment solutions. Demonstrated expertise in microservices, container orchestration, and production deployment strategies."*