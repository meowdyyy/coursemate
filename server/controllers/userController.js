const User = require('../models/User');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// User controller methods
exports.signup = async (req, res) => {
  console.log('Received signup request:', req.body);
  const { fullName, email, phone, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    console.log('Missing required fields');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create new user
    const newUser = new User({
      fullName,
      email,
      phone,
      password
    });

    // Save user to database
    await newUser.save();
    console.log('User registered successfully:', email);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error during signup:', err);

    // Provide more detailed error messages
    if (err.name === 'ValidationError') {
      // Mongoose validation error
      const messages = Object.values(err.errors).map(val => val.message);
      console.log('Validation error:', messages);
      return res.status(400).json({ message: messages.join(', ') });
    } else if (err.code === 11000) {
      // Duplicate key error
      console.log('Duplicate key error');
      return res.status(400).json({ message: 'Email already in use' });
    }

    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1000000h' });
    res.json({ token, message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  const { fullName, age, status, education, location, languages, profilePicture } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { fullName, age, status, education, location, languages, profilePicture },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDashboardCourses = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.courses);
  } catch (err) {
    console.error('Error fetching dashboard courses:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addDashboardCourse = async (req, res) => {
  const { courseId, courseName, semester, year } = req.body;

  if (!courseId || !courseName) {
    return res.status(400).json({ message: 'Course ID and name are required' });
  }

  // Validate course format (should be like CSE110)
  const courseCodeRegex = /^[A-Z]{2,4}\d{3,4}$/;
  if (!courseCodeRegex.test(courseId)) {
    return res.status(400).json({ message: 'Course code should follow format like CSE110' });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if course already exists in user's dashboard
    const courseExists = user.courses.some(course => course.courseId === courseId);
    if (courseExists) {
      return res.status(400).json({ message: 'Course already in dashboard' });
    }

    // Add course to dashboard
    user.courses.push({
      courseId,
      courseName,
      semester: semester || 'Spring',
      year: year || new Date().getFullYear(),
      addedAt: new Date()
    });

    await user.save();

    res.json({ message: 'Course added to dashboard', courses: user.courses });
  } catch (err) {
    console.error('Error adding course to dashboard:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeDashboardCourse = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Filter out the course to remove
    user.courses = user.courses.filter(course => course.courseId !== req.params.courseId);

    await user.save();

    res.json({ message: 'Course removed from dashboard', courses: user.courses });
  } catch (err) {
    console.error('Error removing course from dashboard:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePassword = async (req, res) => {
  console.log('Password update request received');
  const { currentPassword, newPassword } = req.body;
  console.log('Request body:', { currentPassword: '***', newPassword: '***' });

  if (!currentPassword || !newPassword) {
    console.log('Missing required fields');
    return res.status(400).json({ message: 'Current and new password are required' });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      console.log('User not found:', req.userId);
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      console.log('Current password is incorrect');
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    console.log('Password verified, updating to new password');
    
    // Update password
    user.password = newPassword;
    await user.save();
    console.log('Password updated successfully');

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating password:', err);
    
    // Provide more detailed error messages
    if (err.name === 'ValidationError') {
      // Mongoose validation error
      const messages = Object.values(err.errors).map(val => val.message);
      console.log('Validation error:', messages);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  console.log('Avatar upload request received');
  console.log('Request file:', req.file);
  
  if (!req.file) {
    console.log('No file in request');
    return res.status(400).json({ message: 'No avatar file uploaded' });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      console.log('User not found:', req.userId);
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user's profile picture with the file URL
    const avatarUrl = `http://localhost:5050/uploads/avatars/${req.file.filename}`;
    console.log('Setting avatar URL:', avatarUrl);
    
    user.profilePicture = avatarUrl;
    await user.save();
    console.log('User updated with new avatar');

    res.json({ 
      message: 'Avatar uploaded successfully',
      profilePicture: user.profilePicture
    });
  } catch (err) {
    console.error('Error uploading avatar:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

