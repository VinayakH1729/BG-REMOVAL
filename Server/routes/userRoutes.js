import express from "express";
import { clerkWebhook, getUsers } from "../controllers/UserController.js";

const userRouter = express.Router();

userRouter.post('/webhooks', clerkWebhook);
userRouter.get('/all', getUsers); // Test endpoint to check users

export default userRouter;