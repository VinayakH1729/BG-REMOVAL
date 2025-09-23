import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    photo: { type: String},
    firstname: { type: String},
    lastname: { type: String},
})

const userModel = mongoose.model.user || mongoose.model('user', userSchema);

export default userModel;