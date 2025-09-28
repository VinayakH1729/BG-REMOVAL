# BG-REMOVAL Client

A containerized React frontend for background removal application built with Vite and modern web technologies.

## Quick Start

```bash
docker run -d -p 5173:5173 superv65/bg-removal-client:latest
```

Access at: http://localhost:5173

## With Backend Integration

```bash
# Start complete application stack
docker run -d --name mongodb -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:7-jammy

docker run -d --name bg-server -p 4000:4000 \
  --link mongodb \
  -e MONGODB_URI=mongodb://admin:password@mongodb:27017/bgremoveldb?authSource=admin \
  superv65/bg-removal-server:latest

docker run -d --name bg-client -p 5173:5173 \
  --link bg-server \
  -e VITE_SERVER_URL=http://localhost:4000 \
  superv65/bg-removal-client:latest
```

## Technologies

- **React 19**: Modern UI framework
- **Vite 7**: Fast build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **Clerk**: Authentication and user management
- **Node.js 20**: Alpine-based runtime

## Environment Variables

- `VITE_SERVER_URL`: Backend API URL (default: http://localhost:4000)

## Image Details

- **Size**: 1.74GB
- **Base**: node:20-alpine
- **Port**: 5173
- **Architecture**: x86_64

## Related Images

- **Backend**: [superv65/bg-removal-server](https://hub.docker.com/r/superv65/bg-removal-server)
- **Database**: mongo:7-jammy

## Source Code

GitHub: https://github.com/VinayakH1729/BG-REMOVAL

## Support

For issues and support, please visit the GitHub repository.