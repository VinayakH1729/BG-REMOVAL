# GitHub Pages Deployment

This project is configured to deploy automatically to GitHub Pages when changes are pushed to the main branch.

## Live Demo
🚀 **Live Site**: [https://vinayakh1729.github.io/BG-REMOVAL/](https://vinayakh1729.github.io/BG-REMOVAL/)

## Deployment Configuration

### Automatic Deployment
- **Trigger**: Push to `main` branch
- **Build**: Vite builds the client application
- **Deploy**: Automatically deploys to GitHub Pages
- **URL**: `https://[username].github.io/BG-REMOVAL/`

### Manual Deployment
If you need to deploy manually:

```bash
# Build the project
cd client
npm run build

# Or use the root script
npm run build
```

### Configuration Details

1. **Vite Config**: Configured with proper base path for GitHub Pages
2. **GitHub Actions**: Automated workflow in `.github/workflows/deploy.yml`
3. **Build Output**: Static files in `client/dist/` directory
4. **Environment**: Production build with optimizations

### Features Available on GitHub Pages

✅ **Fully Client-Side**: The free background removal works entirely in the browser  
✅ **No Server Required**: Local mode uses Hugging Face transformers.js  
✅ **Fast Performance**: Optimized build with code splitting  
✅ **Responsive Design**: Works on all device sizes  

### Note
- The server mode will not work on GitHub Pages (static hosting only)
- Only the local/free background removal mode will be available
- All processing happens client-side using WebAssembly

## Repository Settings

Make sure GitHub Pages is enabled in your repository settings:
1. Go to Settings → Pages
2. Source: Deploy from a branch → `gh-pages` branch
3. Or Source: GitHub Actions (recommended)