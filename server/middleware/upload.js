const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

// File size limit (configurable)
const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE || 100 * 1024 * 1024; 

// Ensure uploads directory exists (async)
const uploadsDir = path.join(__dirname, '../uploads');

// Ensure avatar uploads directory exists
const avatarsDir = path.join(uploadsDir, 'avatars');

const ensureDirectories = async () => {
  try {
    // Ensure main uploads directory exists
    await fs.access(uploadsDir);
  } catch (error) {
    // Directory doesn't exist, create it
    await fs.mkdir(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
  }

  try {
    // Ensure avatars directory exists
    await fs.access(avatarsDir);
  } catch (error) {
    // Directory doesn't exist, create it
    await fs.mkdir(avatarsDir, { recursive: true });
    console.log('Created avatars directory');
  }
};

// Call the async function
ensureDirectories().catch(err => {
  console.error('Error creating directories:', err);
});

// Configure storage for different file types
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine destination based on route or file type
    if (req.originalUrl.includes('/avatar')) {
      cb(null, path.join(uploadsDir, 'avatars'));
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: function (req, file, cb) {
    // Create cryptographically secure random filename
    crypto.randomBytes(16, (err, raw) => {
      if (err) return cb(err);

      // Get safe extension from original file
      const ext = path.extname(file.originalname).toLowerCase();

      // For avatars, only allow image files
      if (req.originalUrl.includes('/avatar')) {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
        if (!allowedExtensions.includes(ext)) {
          return cb(new Error('Invalid file extension for avatar'));
        }
      } else {
        // For other files, validate extension (additional security)
        const allowedExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.txt', '.jpg', '.jpeg', '.png', '.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
        if (!allowedExtensions.includes(ext)) {
          return cb(new Error('Invalid file extension'));
        }
      }

      // Create filename with timestamp for uniqueness
      const filename = raw.toString('hex') + '-' + Date.now() + ext;
      cb(null, filename);
    });
  }
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  // Define allowed MIME types
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'image/jpeg',
    'image/png',
    'video/mp4',
    'video/avi',
    'video/quicktime',
    'video/x-ms-wmv',
    'video/x-flv',
    'video/x-matroska'
  ];

  // For avatar uploads, only allow images
  if (req.originalUrl.includes('/avatar')) {
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (imageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type for avatar. Only JPG, PNG, and GIF files are allowed.'), false);
    }
  } else if (allowedTypes.includes(file.mimetype)) {
    // For other uploads, check against all allowed types
    // Additional validation: check file extension matches mimetype
    const ext = path.extname(file.originalname).toLowerCase();
    const validExtension = validateExtensionWithMimetype(ext, file.mimetype);

    if (validExtension) {
      cb(null, true);
    } else {
      cb(new Error('File extension does not match its content type'), false);
    }
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, JPG, PNG, MP4, AVI, MOV, WMV, FLV, and MKV files are allowed.'), false);
  }
};

// Helper function to validate extension matches mimetype
function validateExtensionWithMimetype(extension, mimetype) {
  const mimeToExt = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-powerpoint': ['.ppt'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'text/plain': ['.txt'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'video/mp4': ['.mp4'],
    'video/avi': ['.avi'],
    'video/quicktime': ['.mov'],
    'video/x-ms-wmv': ['.wmv'],
    'video/x-flv': ['.flv'],
    'video/x-matroska': ['.mkv']
  };

  return mimeToExt[mimetype] && mimeToExt[mimetype].includes(extension);
}

// Configure upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: fileFilter
});

// Export a function to handle errors
const handleMulterError = (err, req, res, next) => {
  console.error('Multer error:', err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      });
    }
    return res.status(400).json({ message: err.message });
  }
  next(err);
};

// Make sure the export is correct
module.exports = {
  upload,
  handleMulterError
};