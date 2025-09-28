# BG-REMOVAL Docker Images

A complete background removal application with React frontend and Node.js backend.

## Quick Start

```bash
# Pull and run the complete application
curl -o docker-compose.yml https://raw.githubusercontent.com/VinayakH1729/BG-REMOVAL/main/docker-compose.hub.yml
docker-compose up -d
```

## Services

- **Frontend**: React + Vite dev server on port 5173
- **Backend**: Node.js + Express API on port 4000  
- **Database**: MongoDB on port 27017

## Access Points

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000
- MongoDB: localhost:27017

## Environment Variables

### Server
- `NODE_ENV`: production/development
- `MONGODB_URI`: MongoDB connection string

### Client  
- `VITE_SERVER_URL`: Backend API URL

## Manual Run

```bash
# Run MongoDB
docker run -d --name mongodb -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:7-jammy

# Run Backend
docker run -d --name bg-server -p 4000:4000 \
  --link mongodb \
  -e MONGODB_URI=mongodb://admin:password@mongodb:27017/bgremoveldb?authSource=admin \
  superv65/bg-removal-server:latest

# Run Frontend
docker run -d --name bg-client -p 5173:5173 \
  --link bg-server \
  -e VITE_SERVER_URL=http://localhost:4000 \
  superv65/bg-removal-client:latest
```

## Image Details

- **superv65/bg-removal-client**: React frontend (1.74GB)
- **superv65/bg-removal-server**: Node.js backend (242MB)

Built with Node.js 20 Alpine for optimal performance and security.