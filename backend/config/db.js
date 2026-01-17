const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
    try {
        // Check if we're using a real MongoDB URI (Atlas or remote) or need to start in-memory server
        if (process.env.MONGODB_URI &&
            (process.env.MONGODB_URI.includes('mongodb+srv://') ||
                (process.env.MONGODB_URI.includes('mongodb://') && !process.env.MONGODB_URI.includes('localhost')))) {
            // Use the provided MongoDB URI (e.g., MongoDB Atlas)
            console.log('Connecting to MongoDB Atlas...');
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('MongoDB Atlas connected successfully ✅');
        } else {
            // Start in-memory MongoDB server for development
            console.log('Starting in-memory MongoDB server...');
            mongoServer = await MongoMemoryServer.create();
            const mongoUri = mongoServer.getUri();
            await mongoose.connect(mongoUri);
            console.log('In-memory MongoDB server started successfully');
            console.log('Note: Data will be lost when server restarts. Use MongoDB Atlas for persistence.');
        }
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
