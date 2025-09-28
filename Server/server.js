import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

// APP CONFIG
const PORT = process.env.PORT || 4000;
const app = express();
await connectDB();

// MIDDLEWARE
// Raw body for Clerk webhooks verification (must be before express.json)
app.use('/api/user/webhooks', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '5mb' }));
app.use(cors());

// API ROUTES
app.get('/',(req,res)=> res.send('API is running...'));
app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);

// Only listen if not running in Vercel (for local dev)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
