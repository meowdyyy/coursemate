const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

//Load environment variables if .env file exists 
try {
  if (fs.existsSync(path.join(__dirname, '.env'))) {
    require('dotenv').config({ path: path.join(__dirname, '.env') });
  }
} catch (err) {
  console.log('No .env file found, using default or environment variables');
}

//MongoDB URI - Use environment variable or fallback to local MongoDB 
let mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/coursemate';

//Add database name to the URI if not already present 
if (mongoURI.includes('mongodb+srv') && !mongoURI.includes('/coursemate?')) {
  mongoURI = mongoURI.replace('/?', '/coursemate?');
}

//Function to connect to MongoDB 
const connectDB = async () => {
  try {
    //Connect to MongoDB using mongoose 
    await mongoose.connect(mongoURI, {
      //These options help with connection stability 
      serverSelectionTimeoutMS: 5000, //Timeout after 5s instead of 30s 
      socketTimeoutMS: 45000, //Close sockets after 45s of inactivity 
    });
    console.log('MongoDB connected successfully');
    console.log(`Using database: ${mongoURI.includes('mongodb+srv') ? 'MongoDB Atlas' : 'Local MongoDB'}`);

    //Log connection details (without password) 
    const connectionDetails = mongoURI.replace(/\/\/([^:]+):[^@]+@/, '//$1:****@');
    console.log(`Connected to: ${connectionDetails}`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    //Retry connection after 5 seconds instead of exiting 
    console.log('Retrying connection in 5 seconds...');
    setTimeout(() => {
      connectDB();
    }, 5000);
  }
};

module.exports = connectDB;
