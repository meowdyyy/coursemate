const File = require('../models/File');

//File controller methods 
exports.getAllFiles = async (req, res) => {
  //Getting filter values and `browse` flag from query parameters 
  const {
    field = '',
    branch = '',
    course = '',
    resourceType = '',
    semester = '',
    year = '',
    browse = 'false',
    sort = 'rating'
  } = req.query;

  console.log('Notes request with query parameters:', req.query);

  try {
    //Set filter to include `userId` only if `browse` is not specified or is false 
    let filter = browse === 'true' ? {} : { userId: req.userId };

    //Adding additional filters if provided (using trim to handle whitespace) 
    if (field && field.trim()) {
      filter.field = field.trim();
      console.log(`Filtering by field: ${field}`);
    }

    if (branch && branch.trim()) {
      filter.branch = branch.trim();
      console.log(`Filtering by branch: ${branch}`);
    }

    if (course && course.trim()) {
      filter.course = course.trim();
      console.log(`Filtering by course: ${course}`);
    }

    //Handle resourceType filter - ensure it matches the enum values in the schema 
    if (resourceType && resourceType.trim()) {
      //Converting to lowercase to match the schema's enum values 
      const normalizedResourceType = resourceType.trim().toLowerCase();

      //Checking if it's one of the valid resource types 
      const validResourceTypes = ['notes', 'quiz', 'midterm', 'final', 'video'];
      if (validResourceTypes.includes(normalizedResourceType)) {
        filter.resourceType = normalizedResourceType;
      } else {
        //If not a valid resource type, use a case-insensitive regex as fallback 
        filter.resourceType = new RegExp('^' + resourceType.trim() + '$', 'i');
      }

      console.log(`Filtering by resourceType: ${resourceType} (normalized: ${normalizedResourceType})`);
    }

    //Handling semester filter 
    if (semester && semester.trim()) {
      filter.semester = semester.trim();
      console.log(`Filtering by semester: ${semester}`);
    }

    //Handle year filter - ensure it's a valid number within reasonable range 
    if (year && year.trim() && !isNaN(parseInt(year.trim()))) {
      const yearValue = parseInt(year.trim());

      //Only accept years between 2000 and 2100 to avoid potential errors 
      if (yearValue >= 2000 && yearValue <= 2100) {
        filter.year = yearValue;
        console.log(`Filtering by year: ${filter.year}`);
      } else {
        console.log(`Ignoring invalid year value: ${yearValue}`);
      }
    }

    //Determine the sort order 
    let sortOption = {};
    if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'date') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'downloads') {
      sortOption = { downloads: -1 };
    } else {
      //Default sort by rating 
      sortOption = { rating: -1 };
    }

    //Fetch files based on the filter and sort 
    console.log('Applying filter:', JSON.stringify(filter, null, 2));
    console.log('Applying sort:', JSON.stringify(sortOption, null, 2));

    try {
      const files = await File.find(filter).sort(sortOption);
      console.log(`Found ${files.length} files matching the criteria`);

      //Log the first few files for debugging 
      if (files.length > 0) {
        console.log('Sample of matching files:');
        files.slice(0, 3).forEach((file, index) => {
          console.log(`File ${index + 1}:`, {
            id: file._id,
            title: file.title,
            field: file.field,
            branch: file.branch,
            course: file.course,
            resourceType: file.resourceType,
            semester: file.semester,
            year: file.year
          });
        });
      } else {
        //If no files are found, log all files in the database for debugging 
        console.log('No files found with the current filters. Checking all files in the database:');
        const allFiles = await File.find({}).limit(5);
        allFiles.forEach((file, index) => {
          console.log(`Database file ${index + 1}:`, {
            id: file._id,
            title: file.title,
            field: file.field,
            branch: file.branch,
            course: file.course,
            resourceType: file.resourceType,
            semester: file.semester,
            year: file.year
          });
        });
      }

      res.json(files); //Returning files based on the filter 
    } catch (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ message: 'Error executing query', error: err.message });
    }
  } catch (err) {
    console.error('Error fetching documents:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });
    res.json(file);
  } catch (err) {
    console.error('Error fetching file details:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateFile = async (req, res) => {
  const { title, field, branch, course } = req.body;

  //Check for required fields (only `title` is mandatory in this case) 
  if (!title) return res.status(400).json({ message: 'Title is required' });

  try {
    const updatedFile = await File.findByIdAndUpdate(
      req.params.id,
      {
        title,
        field,
        branch,
        course,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedFile) return res.status(404).json({ message: 'File not found' });

    res.json({ message: 'File updated successfully', file: updatedFile });
  } catch (err) {
    console.error('Error updating file:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.uploadFile = async (req, res) => {
  const { field, branch, course, title, resourceType, semester, year } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  if (!field || !branch || !course || !title) {
    return res.status(400).json({ message: 'Field, branch, course, and title are required' });
  }

  //Validating course format (should be like CSE110) 
  const courseCodeRegex = /^[A-Z]{2,4}\d{3,4}$/;
  if (!courseCodeRegex.test(course)) {
    return res.status(400).json({ message: 'Course code should follow format like CSE110' });
  }

  console.log('Received file:', req.file);
  console.log('Received body:', req.body);

  //Save the file details to the database 
  const newFile = new File({
    userId: req.userId,
    filename: req.file.filename,
    originalName: req.file.originalname,
    path: req.file.path,
    fileURL: `http://localhost:5050/notes/uploads/${req.file.filename}`,
    fileSize: req.file.size,
    fileType: req.file.mimetype,
    title,
    field,
    branch,
    course,
    resourceType: resourceType ? resourceType.toLowerCase() : 'notes',
    semester: semester || 'Spring',
    year: year ? parseInt(year) : new Date().getFullYear(),
    rating: 0,
    ratingCount: 0,
    downloads: 0
  });

  console.log('Creating new file with properties:', {
    title,
    field,
    branch,
    course,
    resourceType: resourceType ? resourceType.toLowerCase() : 'notes',
    semester: semester || 'Spring',
    year: year ? parseInt(year) : new Date().getFullYear()
  });

  try {
    await newFile.save();
    res.json({ message: 'File uploaded successfully', file: req.file });
  } catch (err) {
    console.error('Error saving file details:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.trackDownload = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    //Increment the download count 
    file.downloads += 1;
    await file.save();

    res.json({ message: 'Download tracked successfully', downloads: file.downloads });
  } catch (err) {
    console.error('Error tracking download:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.rateFile = async (req, res) => {
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    //Update ratings 
    const newRatingTotal = (file.rating * file.ratingCount) + parseInt(rating);
    file.ratingCount += 1;
    file.rating = newRatingTotal / file.ratingCount;

    await file.save();

    res.json({ message: 'Rating submitted successfully', rating: file.rating });
  } catch (err) {
    console.error('Error submitting rating:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    //Find all unique course values in the files collection 
    const courses = await File.distinct('course');

    console.log('Available courses found:', courses);

    //Sort the courses alphabetically for better user experience 
    courses.sort();

    //If no courses found, return some default courses for testing 
    if (!courses || courses.length === 0) {
      console.log('No courses found, returning default courses');
      return res.json(['CSE110', 'CSE220', 'CSE422']);
    }

    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    //Even on error, return some default courses to ensure the dropdown works 
    res.json(['CSE110', 'CSE220', 'CSE422']);
  }
};
