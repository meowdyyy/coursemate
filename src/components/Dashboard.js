import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [courseResources, setCourseResources] = useState({});
  const [newCourse, setNewCourse] = useState({ courseId: '', courseName: '', semester: 'Spring', year: new Date().getFullYear() });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user's dashboard courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:5050/users/dashboard/courses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load dashboard courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch resources for each course
  useEffect(() => {
    const fetchCourseResources = async () => {
      const resourcesObj = {};

      for (const course of courses) {
        try {
          const token = localStorage.getItem('authToken');
          const response = await axios.get(`http://localhost:5050/notes?course=${course.courseId}&browse=true`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          console.log(`Fetched ${response.data.length} resources for course ${course.courseId}`);
          resourcesObj[course.courseId] = response.data;
        } catch (err) {
          console.error(`Error fetching resources for ${course.courseId}:`, err);
          resourcesObj[course.courseId] = [];
        }
      }

      setCourseResources(resourcesObj);
    };

    if (courses.length > 0) {
      fetchCourseResources();
    }
  }, [courses]);

  // Handle adding a new course
  const handleAddCourse = async (e) => {
    e.preventDefault();

    if (!newCourse.courseId || !newCourse.courseName) {
      setError('Course ID and name are required');
      return;
    }

    // Validate course format (should be like CSE110)
    const courseCodeRegex = /^[A-Z]{2,4}\d{3,4}$/;
    if (!courseCodeRegex.test(newCourse.courseId)) {
      setError('Course code should follow format like CSE110');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('http://localhost:5050/users/dashboard/courses', newCourse, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCourses(response.data.courses);
      setNewCourse({ courseId: '', courseName: '', semester: 'Spring', year: new Date().getFullYear() });
      setError('');
    } catch (err) {
      console.error('Error adding course:', err);
      setError(err.response?.data?.message || 'Failed to add course');
    }
  };

  // Handle removing a course
  const handleRemoveCourse = async (courseId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.delete(`http://localhost:5050/users/dashboard/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCourses(response.data.courses);
    } catch (err) {
      console.error('Error removing course:', err);
      setError('Failed to remove course');
    }
  };

  // Handle input change for new course form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>My Course Dashboard</h1>

      {error && <div className="dashboard-error">{error}</div>}

      <div className="add-course-form">
        <h2>Add a New Course</h2>
        <form onSubmit={handleAddCourse}>
          <div className="form-group">
            <label>Course Code:</label>
            <input
              type="text"
              name="courseId"
              value={newCourse.courseId}
              onChange={handleInputChange}
              placeholder="e.g., CSE110"
              required
            />
          </div>

          <div className="form-group">
            <label>Course Name:</label>
            <input
              type="text"
              name="courseName"
              value={newCourse.courseName}
              onChange={handleInputChange}
              placeholder="e.g., Introduction to Computer Science"
              required
            />
          </div>

          <div className="form-group">
            <label>Semester:</label>
            <select name="semester" value={newCourse.semester} onChange={handleInputChange}>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Fall">Fall</option>
              <option value="Winter">Winter</option>
            </select>
          </div>

          <div className="form-group">
            <label>Year:</label>
            <input
              type="number"
              name="year"
              value={newCourse.year}
              onChange={handleInputChange}
              min="2000"
              max="2100"
            />
          </div>

          <button type="submit" className="add-course-btn">Add Course</button>
        </form>
      </div>

      <div className="courses-list">
        <h2>My Courses</h2>

        {courses.length === 0 ? (
          <p>No courses added yet. Add a course to get started.</p>
        ) : (
          courses.map((course) => (
            <div key={course.courseId} className="course-card">
              <div className="course-header">
                <h3>{course.courseName} ({course.courseId})</h3>
                <span>{course.semester} {course.year}</span>
                <button
                  className="remove-course-btn"
                  onClick={() => handleRemoveCourse(course.courseId)}
                >
                  Remove
                </button>
              </div>

              <div className="course-resources">
                <h4>Resources</h4>

                {!courseResources[course.courseId] ? (
                  <p>Loading resources...</p>
                ) : courseResources[course.courseId].length === 0 ? (
                  <p>No resources available for this course.</p>
                ) : (
                  <div className="resource-list">
                    {courseResources[course.courseId].map((resource) => (
                      <div key={resource._id} className="resource-item">
                        <Link to={`/fileview/${resource._id}`}>
                          <div className="resource-title">{resource.title}</div>
                          <div className="resource-details">
                            <span className="resource-type">
                              {resource.resourceType === 'final' ? 'Final Exam' :
                               resource.resourceType.charAt(0).toUpperCase() + resource.resourceType.slice(1)}
                            </span>
                            <span className="resource-semester">{resource.semester} {resource.year}</span>
                            <span className="resource-rating">Rating: {resource.rating.toFixed(1)}/5 ({resource.ratingCount} votes)</span>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                <Link to={`/browse?course=${encodeURIComponent(course.courseId)}`} className="browse-course-link">
                  Browse all resources for this course
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
