import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
    });

    try {
        // Use the full MONGODB_URI (with database name if provided)
        const mongoUri = process.env.MONGODB_URI.includes('?') 
            ? process.env.MONGODB_URI 
            : `${process.env.MONGODB_URI}/bg-removal`;
        
        await mongoose.connect(mongoUri);
        console.log('MongoDB connection established');
        console.log('Connected to:', mongoUri.replace(/\/\/[^@]*@/, '//***:***@')); // Hide credentials in logs
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }

}

export default connectDB