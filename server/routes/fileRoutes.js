const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const authenticate = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

//Get all files (with optional filters) 
router.get('/', authenticate, fileController.getAllFiles);

//Getting a specific file 
router.get('/:id', authenticate, fileController.getFileById);

//Update a file 
router.put('/:id', authenticate, fileController.updateFile);

//Upload a new file 
router.post('/upload', authenticate, upload.single('file'), handleMulterError, fileController.uploadFile);

//Track a file download 
router.post('/:id/download', authenticate, fileController.trackDownload);

//Rate a file 
router.post('/:id/rate', authenticate, fileController.rateFile);

//Get all available courses 
router.get('/courses/all', authenticate, fileController.getAllCourses);

module.exports = router;
