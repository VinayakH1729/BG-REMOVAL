# BG-REMOVAL Server

A containerized Node.js backend API for background removal application with Express.js and MongoDB integration.

## Quick Start

```bash
docker run -d -p 4000:4000 \
  -e MONGODB_URI=mongodb://your-mongodb-uri \
  superv65/bg-removal-server:latest
```

Access API at: http://localhost:4000

## Complete Stack Deployment

```bash
# 1. Start MongoDB
docker run -d --name mongodb -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:7-jammy

# 2. Start Server
docker run -d --name bg-server -p 4000:4000 \
  --link mongodb \
  -e MONGODB_URI=mongodb://admin:password@mongodb:27017/bgremoveldb?authSource=admin \
  superv65/bg-removal-server:latest

# 3. Start Frontend
docker run -d --name bg-client -p 5173:5173 \
  --link bg-server \
  superv65/bg-removal-client:latest
```

## Technologies

- **Node.js 20**: Alpine-based runtime
- **Express.js 5**: Web application framework
- **MongoDB**: Database with Mongoose ODM
- **Multer**: File upload handling
- **CORS**: Cross-origin resource sharing
- **Clerk**: Webhook authentication

## Environment Variables

- `MONGODB_URI`: MongoDB connection string (required)
- `CLERK_WEBHOOK_SECRET`: Clerk webhook secret for authentication
- `NODE_ENV`: Environment mode (default: production)
- `PORT`: Server port (default: 4000)

## API Endpoints

- `GET /`: Health check
- `POST /api/user/*`: User management routes
- `POST /api/image/*`: Image processing routes

## Image Details

- **Size**: 242MB
- **Base**: node:20-alpine
- **Port**: 4000
- **Architecture**: x86_64

## Related Images

- **Frontend**: [superv65/bg-removal-client](https://hub.docker.com/r/superv65/bg-removal-client)
- **Database**: mongo:7-jammy

## Source Code

GitHub: https://github.com/VinayakH1729/BG-REMOVAL

## Support

For issues and support, please visit the GitHub repository.