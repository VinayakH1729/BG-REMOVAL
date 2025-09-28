// Simple authentication middleware for API routes
// In a production app, you'd verify the JWT token properly

export const requireAuth = (req, res, next) => {
  // For now, we'll do a basic check - in production you'd verify Clerk JWT
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required. Please sign in to use this feature.' 
    });
  }

  // In production, you would:
  // 1. Extract the JWT token from the Bearer header
  // 2. Verify it with Clerk's public key or use Clerk's middleware
  // 3. Set req.user with the verified user data
  
  // For this demo, we'll just pass through if there's any Bearer token
  next();
};