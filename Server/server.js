import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/mongodb.js';

//APP CONFIG
const PORT = process.env.PORT || 4000;
const app = express();
await connectDB();

//MIDDLEWARE
app.use(express.json());
app.use(cors());

//API ROUTES
app.get('/',(req,res)=> res.send('API is running...'));

app.listen(PORT, () => console.log(`Server running on port` + PORT))
