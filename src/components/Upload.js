import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Upload.css';
import { FaFileAlt, FaTimes } from 'react-icons/fa';

const Upload = ({ isSidenavOpen }) => {
    const [file, setFile] = useState(null);
    const [fileData, setFileData] = useState(null);
    const [title, setTitle] = useState(''); // New title state
    const [selectedField, setSelectedField] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [resourceType, setResourceType] = useState('notes');
    const [semester, setSemester] = useState('Spring');
    const [year, setYear] = useState(new Date().getFullYear());
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const inputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => setFileData(reader.result);
            reader.readAsDataURL(selectedFile);
        }
    };
    const handleSubmit = async (e) => {
        if (!file) {
            setError('File is required');
            return;
        }
        e.preventDefault();
        if (!title.trim()) {
            setError('Title is required');
            return;
        }
        if (!selectedCourse.trim()) {
            setError('Course code is required');
            return;
        }

        // Validate course format (should be like CSE110)
        const courseCodeRegex = /^[A-Z]{2,4}\d{3,4}$/;
        if (!courseCodeRegex.test(selectedCourse)) {
            setError('Course code should follow format like CSE110');
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('field', selectedField);
        formData.append('branch', selectedBranch);
        formData.append('course', selectedCourse);
        formData.append('resourceType', resourceType.toLowerCase()); // Ensure lowercase for consistency
        formData.append('semester', semester);
        formData.append('year', year.toString()); // Ensure it's a string


        // Log FormData for debugging
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        const token = localStorage.getItem('authToken');

        try {
            await axios.post('http://localhost:5050/notes/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            alert('File uploaded successfully! Your file is now available in the Browse section for all users.');
            setFile(null);
            setTitle('');
            setSelectedField('');
            setSelectedBranch('');
            setSelectedCourse('');
            setResourceType('notes');
            setSemester('Spring');
            setYear(new Date().getFullYear());
        } catch (err) {
            alert('File upload failed');
            setError('File upload failed');
            console.error('Error uploading file:', err);
        } finally {
            setLoading(false);
            // Redirect to Browse page with a state parameter to indicate a new upload
            // This will help the Browse component know that it should refresh the course list
            navigate('/browse', {
                state: {
                    newUpload: true,
                    course: selectedCourse
                }
            });
        }
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        handleFileChange(e);
    };

    return (
        <div className={`upload-container ${isSidenavOpen ? 'sidenav-open' : 'sidenav-closed'}`}>
            <div className="upload-content">
                <label htmlFor="title" className="upload-label">Title:</label>
                <input
                    type="text"
                    id="title"
                    className="upload-input"
                    placeholder="Enter a title"
                    value={title}  // This binds the input value to the title state
                    onChange={(e) => {
                        console.log("Title input changed: ", e.target.value);
                        setTitle(e.target.value);
                    }} // Updates the title state when input changes
                    required
                />

                <div className="dropdown-row">
                    <select
                        className="browse-dropdown"
                        value={selectedField}
                        onChange={e => setSelectedField(e.target.value)}
                    >
                        <option value="">Field</option>
                        <option value="Math">Math</option>
                        <option value="Science">Science</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Arts">Arts</option>
                    </select>

                    <select
                        className="browse-dropdown"
                        value={selectedBranch}
                        onChange={e => setSelectedBranch(e.target.value)}
                    >
                        <option value="">Branch</option>
                        <option value="Pure Mathematics">Pure Mathematics</option>
                        <option value="Applied Mathematics">Applied Mathematics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Literature">Literature</option>
                    </select>

                    <input
                        type="text"
                        className="browse-dropdown"
                        placeholder="Enter Course Code (e.g., CSE110)"
                        value={selectedCourse}
                        onChange={e => setSelectedCourse(e.target.value)}
                        required
                    />
                </div>

                <div className="dropdown-row">
                    <select
                        className="browse-dropdown"
                        value={resourceType}
                        onChange={e => setResourceType(e.target.value)}
                    >
                        <option value="notes">Notes</option>
                        <option value="quiz">Quiz</option>
                        <option value="midterm">Midterm</option>
                        <option value="final">Final Exam</option>
                        <option value="video">Video</option>
                    </select>

                    <select
                        className="browse-dropdown"
                        value={semester}
                        onChange={e => setSemester(e.target.value)}
                    >
                        <option value="Spring">Spring</option>
                        <option value="Summer">Summer</option>
                        <option value="Fall">Fall</option>
                        <option value="Winter">Winter</option>
                    </select>

                    <input
                        type="number"
                        className="browse-dropdown"
                        placeholder="Year"
                        value={year}
                        onChange={e => setYear(e.target.value)}
                        min="2000"
                        max="2100"
                    />
                </div>

                <div
                    className={`drag-drop-area ${dragActive ? 'drag-active' : ''}`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current.click()}
                >
                    {file ? (
                        <div className="file-info">
                            <FaFileAlt className="file-icon" />
                            <span className="file-name">{file.name}</span>
                            <FaTimes className="remove-file" onClick={() => setFile(null)} />
                        </div>
                    ) : (
                        <>
                            <p>Drag and drop file to upload</p>
                            <label className="upload-button">
                                <input type="file" ref={inputRef} onChange={handleFileChange} hidden />
                                Upload from your device
                            </label>
                        </>
                    )}
                </div>
                {error && <div className="error-message">{error}</div>}

                <div className="button-container">
                    <button onClick={handleSubmit} className="action-button" disabled={!file || loading}>
                        {loading ? 'Uploading...' : 'Publish'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Upload;
