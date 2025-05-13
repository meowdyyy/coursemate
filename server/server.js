const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050;

//Adding this middleware to log all the incoming requests 
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

//Importing routes 
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');

//Middleware 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Serve static files from the uploads directory 
app.use('/notes/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/coursemate';

//Adding database name to the URI if not already present 
let finalMongoURI = mongoURI;
if (finalMongoURI.includes('mongodb+srv') && !finalMongoURI.includes('/coursemate?')) {
  finalMongoURI = finalMongoURI.replace('/?', '/coursemate?');
}

console.log('Connecting to MongoDB...');
console.log(`Using connection string: ${finalMongoURI.replace(/\/\/([^:]+):[^@]+@/, '//$1:****@')}`);

mongoose.connect(finalMongoURI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('Connected to MongoDB successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

//Routes 
app.use('/users', userRoutes);
app.use('/notes', fileRoutes);

//Root route 
app.get('/', (req, res) => {
  res.send('CourseMate API is running');
});

//Start the server 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
