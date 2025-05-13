/**
 * Database seeding script for CourseMate
 *
 * This script populates the MongoDB database with sample data for testing.
 * Run this script with: node seed.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');
const File = require('./models/File');

//Loading the environment variables 
try {
  if (fs.existsSync(path.join(__dirname, '.env'))) {
    require('dotenv').config({ path: path.join(__dirname, '.env') });
  }
} catch (err) {
  console.log('No .env file found, using default or environment variables');
}

//MongoDB URI - Use environment variable or fallback to local MongoDB 
let mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/coursemate';

//Adding database name to the URI if not already present 
if (mongoURI.includes('mongodb+srv') && !mongoURI.includes('/coursemate?')) {
  mongoURI = mongoURI.replace('/?', '/coursemate?');
}

//Some Sample users 
const users = [
  {
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    password: 'password123',
    age: 22,
    gender: 'Male',
    status: 'Student',
    education: 'Computer Science',
    location: 'New York',
    languages: 'English, Spanish',
    quote: 'Learning never exhausts the mind.',
    bio: 'Computer Science student passionate about web development.',
    badges: ['Top Contributor', 'Resource Expert'],
    courses: [
      {
        courseId: 'CSE110',
        courseName: 'Introduction to Computer Science',
        semester: 'Fall',
        year: 2023,
        addedAt: new Date()
      },
      {
        courseId: 'CSE220',
        courseName: 'Data Structures',
        semester: 'Spring',
        year: 2023,
        addedAt: new Date()
      }
    ]
  },
  {
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    phone: '987-654-3210',
    password: 'password123',
    age: 21,
    gender: 'Female',
    status: 'Student',
    education: 'Mathematics',
    location: 'Boston',
    languages: 'English, French',
    quote: 'Mathematics is the queen of sciences.',
    bio: 'Mathematics major with a minor in Computer Science.',
    badges: ['Math Wizard'],
    courses: [
      {
        courseId: 'MATH240',
        courseName: 'Linear Algebra',
        semester: 'Fall',
        year: 2023,
        addedAt: new Date()
      },
      {
        courseId: 'CSE110',
        courseName: 'Introduction to Computer Science',
        semester: 'Spring',
        year: 2023,
        addedAt: new Date()
      }
    ]
  }
];

//Sample files 
const generateFiles = (users) => {
  const files = [];
  const resourceTypes = ['notes', 'quiz', 'midterm', 'final', 'video'];
  const semesters = ['Spring', 'Summer', 'Fall', 'Winter'];
  const years = [2021, 2022, 2023, 2024];
  const fields = ['Math', 'Science', 'Engineering', 'Arts'];
  const branches = ['Pure Mathematics', 'Applied Mathematics', 'Chemistry', 'Computer Science', 'Mechanical Engineering', 'Literature'];
  const courses = ['CSE110', 'CSE220', 'CSE422', 'MATH240', 'PHYS101', 'ENG210'];

  users.forEach(user => {
    // Generate 5 files for each user
    for (let i = 0; i < 5; i++) {
      const resourceType = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
      const semester = semesters[Math.floor(Math.random() * semesters.length)];
      const year = years[Math.floor(Math.random() * years.length)];
      const field = fields[Math.floor(Math.random() * fields.length)];
      const branch = branches[Math.floor(Math.random() * branches.length)];
      const course = courses[Math.floor(Math.random() * courses.length)];

      files.push({
        userId: user._id,
        filename: `sample-${i}-${Date.now()}.pdf`,
        originalName: `sample-file-${i}.pdf`,
        title: `Sample ${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} for ${course}`,
        path: `uploads/sample-${i}-${Date.now()}.pdf`,
        fileURL: `http://localhost:5050/notes/uploads/sample-${i}-${Date.now()}.pdf`,
        fileSize: 1024 * 1024 * (1 + Math.floor(Math.random() * 5)), // 1-5 MB
        fileType: 'application/pdf',
        field,
        branch,
        course,
        resourceType,
        semester,
        year,
        rating: Math.floor(Math.random() * 5) + 1, // 1-5 rating
        ratingCount: Math.floor(Math.random() * 50) + 1, // 1-50 ratings
        downloads: Math.floor(Math.random() * 100) + 1 // 1-100 downloads
      });
    }
  });

  return files;
};

//Connecting to MongoDB and seed the database 
const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    console.log(`Using connection string: ${mongoURI.replace(/\/\/([^:]+):[^@]+@/, '//\$1:****@')}`);

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB Atlas successfully');

    //Ask for confirmation before clearing data 
    console.log('\nWARNING: This will clear all existing data in the database.');
    console.log('Press Ctrl+C now to cancel if you want to keep existing data.');
    console.log('Waiting 5 seconds before proceeding...');

    await new Promise(resolve => setTimeout(resolve, 5000));

    //Clearing existing data 
    await User.deleteMany({});
    await File.deleteMany({});
    console.log('Cleared existing data');

    //Create users with hashed passwords 
    const createdUsers = [];
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = new User({
        ...user,
        password: hashedPassword
      });
      const savedUser = await newUser.save();
      createdUsers.push(savedUser);
    }
    console.log(`Created ${createdUsers.length} users`);

    //Create files 
    const files = generateFiles(createdUsers);
    await File.insertMany(files);
    console.log(`Created ${files.length} files`);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

//Running the seeding function 
seedDatabase();
