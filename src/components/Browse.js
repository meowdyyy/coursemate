import React, { useState, useEffect, useRef } from 'react';
import './Browse.css';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

function Browse() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedResourceType, setSelectedResourceType] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [documents, setDocuments] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [notification, setNotification] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //Use a ref to track previous courses to avoid infinite loops 
  const prevCoursesRef = useRef([]);

  //Function to fetch available courses 
  const fetchAvailableCourses = async () => {
    try {
      //Small delay to ensure the server has processed any new uploads 
      if (location.state && location.state.newUpload) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      //No authentication needed for courses endpoint now 
      const response = await axios.get('http://localhost:5050/courses');

      console.log('Courses response from API:', response.data);

      //Only update if we have courses and they're different from what we already have 
      if (response.data && response.data.length > 0) {
        const newCourses = [...response.data].sort();
        const prevCourses = prevCoursesRef.current;

        if (JSON.stringify(newCourses) !== JSON.stringify(prevCourses)) {
          setAvailableCourses(newCourses);
          prevCoursesRef.current = newCourses;
        }
      }
    } catch (error) {
      console.error("Error fetching available courses:", error);
      //We don't need the fallback approach anymore since we're extracting courses from documents in the main useEffect
    }
  };

  //Fetch available courses when component mounts or when navigating to this page 
  useEffect(() => {
    fetchAvailableCourses();

    //Check if we're coming from the Upload page with a new course 
    if (location.state && location.state.newUpload && location.state.course) {
      //Setting the selected course to the newly uploaded one
      setSelectedCourse(location.state.course);

      //Set notification message 
      setNotification(`Your file for course ${location.state.course} has been uploaded and is now available in the dropdown.`);

      //Clear notification after 8 seconds 
      const timer = setTimeout(() => {
        setNotification("");
      }, 8000);

      return () => clearTimeout(timer);
    }

    //Set up polling to periodically check for new courses 
    const coursePollingInterval = setInterval(() => {
      fetchAvailableCourses();
    }, 10000); //Check every 10 seconds 

    //Clean up the interval when the component unmounts 
    return () => clearInterval(coursePollingInterval);

    //This will re-fetch courses whenever the user navigates to this page 
  }, [location.pathname, location.state]);

  //Fetch data from the backend when the component mounts or filters change 
  useEffect(() => {
    const token = localStorage.getItem('authToken'); //Use consistent token name 
    console.log(token);

    //Set loading state 
    setIsLoading(true);

    //Build the query string with selected filters 
    //Use URLSearchParams for proper URL encoding 
    const params = new URLSearchParams();
    params.append('browse', 'true');

    if (selectedField) params.append('field', selectedField);
    if (selectedBranch) params.append('branch', selectedBranch);
    if (selectedCourse) params.append('course', selectedCourse);

    //Ensure resourceType is properly formatted 
    if (selectedResourceType) {
      //Make sure it matches one of the enum values in the schema 
      params.append('resourceType', selectedResourceType.toLowerCase());
    }

    //Ensure semester is properly formatted 
    if (selectedSemester) {
      //Make sure first letter is capitalized 
      const formattedSemester = selectedSemester.charAt(0).toUpperCase() + selectedSemester.slice(1).toLowerCase();
      params.append('semester', formattedSemester);
    }

    //Ensure year is a valid number 
    if (selectedYear) {
      const yearValue = parseInt(selectedYear);
      if (!isNaN(yearValue) && yearValue >= 2000 && yearValue <= 2100) {
        params.append('year', yearValue.toString());
      }
    }

    params.append('sort', sortBy);

    const query = `http://localhost:5050/notes?${params.toString()}`;

    console.log('Filter parameters:', {
      field: selectedField,
      branch: selectedBranch,
      course: selectedCourse,
      resourceType: selectedResourceType ? selectedResourceType.toLowerCase() : '',
      semester: selectedSemester ? (selectedSemester.charAt(0).toUpperCase() + selectedSemester.slice(1).toLowerCase()) : '',
      year: selectedYear ? parseInt(selectedYear) : '',
      sort: sortBy
    });
    console.log('Query URL:', query);

    //Adding a small delay to make the loading state visible 
    setTimeout(() => {
      axios
        .get(query, {
          headers: {
            Authorization: `Bearer ${token}`, //Making sure `token` is the valid JWT 
          },
        })
        .then(response => {
          console.log(response.data); //Check the response format 
          setDocuments(response.data); //Update the state with the fetched documents 
          setIsLoading(false); //Clear loading state 

          //Extract unique courses from the fetched documents 
          //This ensures the course list is always up-to-date with the latest documents 
          if (response.data && response.data.length > 0) {
            const uniqueCourses = [...new Set(response.data.map(doc => doc.course))].filter(Boolean);

            //Only update if we found courses and they're different from what we already have 
            if (uniqueCourses.length > 0) {
              const newCourses = [...uniqueCourses].sort();
              const prevCourses = prevCoursesRef.current;

              if (JSON.stringify(newCourses) !== JSON.stringify(prevCourses)) {
                console.log('Updating course list from documents:', uniqueCourses);
                setAvailableCourses(newCourses);
                prevCoursesRef.current = newCourses;
              }
            }
          }
        })
        .catch(error => {
          console.error("Error fetching documents:", error);
          setIsLoading(false); //Clear loading state even on error 
        });
    }, 300); //300ms delay to make loading state visible 

    //Cleanup function to handle component unmount during loading 
    return () => {
      setIsLoading(false);
    };
  }, [selectedField, selectedBranch, selectedCourse, selectedResourceType, selectedSemester, selectedYear, sortBy]);

  //Client-side filtering for search term only 
  //All other filtering is handled by the server 
  const filteredDocuments = documents.filter(doc => {
    //Filter by search term (case-insensitive) 
    const matchesSearch = !searchTerm ||
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.field && doc.field.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doc.branch && doc.branch.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doc.course && doc.course.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });
  return (
    <div className="browse-page">
      {notification && (
        <div className="notification-message">
          <p>{notification}</p>
        </div>
      )}
      <div className="browse-header">
        <input
          className="browse-search-bar"
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        {/* Active filters display */}
        {(selectedField || selectedBranch || selectedCourse || selectedResourceType || selectedSemester || selectedYear) && (
          <div className="active-filters">
            <span className="active-filters-label">Active Filters:</span>
            {selectedField && <span className="filter-tag">Field: {selectedField}</span>}
            {selectedBranch && <span className="filter-tag">Branch: {selectedBranch}</span>}
            {selectedCourse && <span className="filter-tag">Course: {selectedCourse}</span>}
            {selectedResourceType && <span className="filter-tag">Type: {
              selectedResourceType === 'final' ? 'Final Exam' :
              selectedResourceType.charAt(0).toUpperCase() + selectedResourceType.slice(1)
            }</span>}
            {selectedSemester && <span className="filter-tag">Semester: {selectedSemester}</span>}
            {selectedYear && <span className="filter-tag">Year: {selectedYear}</span>}
          </div>
        )}
      </div>

      <div className="browse-filters">
        <select
          className={`browse-dropdown ${selectedField ? 'active-filter' : ''}`}
          onChange={e => setSelectedField(e.target.value)}
          value={selectedField}
        >
          <option value="">Field</option>
          <option value="Math">Math</option>
          <option value="Science">Science</option>
          <option value="Engineering">Engineering</option>
          <option value="Arts">Arts</option>
        </select>
        <select
          className={`browse-dropdown ${selectedBranch ? 'active-filter' : ''}`}
          onChange={e => setSelectedBranch(e.target.value)}
          value={selectedBranch}
        >
          <option value="">Branch</option>
          <option value="Pure Mathematics">Pure Mathematics</option>
          <option value="Applied Mathematics">Applied Mathematics</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Mechanical Engineering">Mechanical Engineering</option>
          <option value="Literature">Literature</option>
        </select>
        <select
          className={`browse-dropdown ${selectedCourse ? 'active-filter' : ''} ${location.state && location.state.newUpload ? 'highlight-dropdown' : ''}`}
          onChange={e => setSelectedCourse(e.target.value)}
          value={selectedCourse}
        >
          <option value="">Course</option>
          {availableCourses && availableCourses.length > 0 ? (
            availableCourses.map(course => (
              <option
                key={course}
                value={course}
                className={location.state && location.state.newUpload && course === location.state.course ? 'highlight-option' : ''}
              >
                {course} {location.state && location.state.newUpload && course === location.state.course ? '(New)' : ''}
              </option>
            ))
          ) : (
            <>
              <option value="" disabled>Loading courses...</option>
              {/* Fallback options for testing */}
              <option value="CSE110">CSE110</option>
              <option value="CSE220">CSE220</option>
              <option value="CSE422">CSE422</option>
            </>
          )}
        </select>

        <select
          className={`browse-dropdown ${selectedResourceType ? 'active-filter' : ''}`}
          onChange={e => setSelectedResourceType(e.target.value)}
          value={selectedResourceType}
        >
          <option value="">Resource Type</option>
          <option value="notes">Notes</option>
          <option value="quiz">Quiz</option>
          <option value="midterm">Midterm</option>
          <option value="final">Final</option>
          <option value="video">Video</option>
        </select>

        <select
          className={`browse-dropdown ${selectedSemester ? 'active-filter' : ''}`}
          onChange={e => setSelectedSemester(e.target.value)}
          value={selectedSemester}
        >
          <option value="">Semester</option>
          <option value="Spring">Spring</option>
          <option value="Summer">Summer</option>
          <option value="Fall">Fall</option>
          <option value="Winter">Winter</option>
        </select>

        <input
          type="number"
          className={`browse-dropdown ${selectedYear ? 'active-filter' : ''}`}
          placeholder="Year"
          value={selectedYear}
          onChange={e => {
            //Ensure we're setting a valid number or empty string 
            const value = e.target.value;
            if (value === '' || (parseInt(value) >= 2000 && parseInt(value) <= 2100)) {
              setSelectedYear(value);
            }
          }}
          min="2000"
          max="2100"
        />

        <select className="browse-dropdown" onChange={e => setSortBy(e.target.value)} value={sortBy}>
          <option value="rating">Sort by Rating</option>
          <option value="date">Sort by Date</option>
          <option value="downloads">Sort by Downloads</option>
        </select>

        <button
          className="clear-filters-btn"
          onClick={() => {
            setSelectedField("");
            setSelectedBranch("");
            setSelectedCourse("");
            setSelectedResourceType("");
            setSelectedSemester("");
            setSelectedYear("");
            //Keep the sort option as is 
          }}
        >
          Clear Filters
        </button>
      </div>

      <div className="document-cards-container">
        {isLoading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Loading resources...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <p>No documents found. Try adjusting your search or filters.</p>
        ) : (
          filteredDocuments.map(doc => (
            <div key={doc._id} className="document-card">
              {/* Placeholder for document image */}
              <div className="document-image-placeholder"></div>

              <h3>{doc.title}</h3>

              <div className="document-info">
                <p>Field: {doc.field ? doc.field : 'N/A'}</p>
                <p>Branch: {doc.branch ? doc.branch : 'N/A'}</p>
                <p>Course: {doc.course ? doc.course : 'N/A'}</p>
                <p>Type: {doc.resourceType ?
                  (doc.resourceType === 'final' ? 'Final Exam' :
                   doc.resourceType.charAt(0).toUpperCase() + doc.resourceType.slice(1))
                  : 'Notes'}</p>
                <p>Semester: {doc.semester ? doc.semester : 'N/A'} {doc.year ? doc.year : ''}</p>
                {/* Debug info - only visible in development */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="debug-info">
                    <small>ResourceType: {JSON.stringify(doc.resourceType)}</small><br/>
                    <small>Semester: {JSON.stringify(doc.semester)}</small><br/>
                    <small>Year: {JSON.stringify(doc.year)}</small>
                  </div>
                )}
                <p>Rating: {doc.rating ? doc.rating.toFixed(1) : '0.0'} ({doc.ratingCount || 0} ratings)</p>
                <p>Downloads: {doc.downloads || 0}</p>
              </div>

              <div className="actions">
                <Link
                  to={`/fileview/${doc._id}`}
                  className="action-link"
                >
                  File Details →
                </Link>
                <Link
                  to={`/document/${doc._id}`}  //Passing just the ID as part of the URL 
                  className="action-link"
                >
                  View →
                </Link>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Browse;
