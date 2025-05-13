const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

// Public routes
router.post('/signup', userController.signup);
router.post('/signin', userController.signin);

// Protected routes
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);
router.get('/dashboard/courses', authenticate, userController.getDashboardCourses);
router.post('/dashboard/courses', authenticate, userController.addDashboardCourse);
router.delete('/dashboard/courses/:courseId', authenticate, userController.removeDashboardCourse);
router.put('/password', authenticate, userController.updatePassword);
router.post('/avatar', authenticate, upload.single('avatar'), handleMulterError, userController.uploadAvatar);

module.exports = router;
