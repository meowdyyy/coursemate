const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, required: true, unique: true },
  phone: String,
  password: { type: String, required: true },
  age: Number,
  gender: String,
  status: String,
  education: String,
  location: String,
  languages: String,
  quote: String,
  bio: String,
  badges: [String],
  profilePicture: { type: String },
  courses: [{
    courseId: String,
    courseName: String,
    semester: String,
    year: Number,
    addedAt: { type: Date, default: Date.now }
  }],
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
