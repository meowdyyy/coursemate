import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import "./EditFilePage.css"

const EditFilePage = () => {
  const { fileId } = useParams();
  const [fileData, setFileData] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios
        .get(`http://localhost:5050/notes/${fileId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => setFileData(response.data))
        .catch(err => setError('Unable to fetch file details.'));
    } else {
      setError('No authentication token found.');
    }
  }, [fileId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFileData({ ...fileData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    try {
      await axios.put(
        `http://localhost:5050/notes/${fileId}`,
        { 
          title: fileData.title, 
          field: fileData.field, 
          branch: fileData.branch, 
          course: fileData.course 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/profile');
    } catch (err) {
      setError('Unable to update file data.');
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="edit-file-page">
      <div className="edit-file-container">
        <h2>Edit File Information</h2>
        {error && <div className="error-message">{error}</div>}
        {!fileData ? (
          <div className="loading-message">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div>
              <label>File Title:</label>
              <input
                type="text"
                name="title"
                value={fileData.title || ''}
                onChange={handleChange}
              />
            </div>
            <div className="rowordering">
              <label>Original Name:</label>
              <p>{fileData.originalName}</p>
            </div>
            <div className="rowordering">
              <label>File Type:</label>
              <p>{fileData.fileType}</p>
            </div>
            <div className="rowordering">
              <label>File Size:</label>
              <p>{fileData.fileSize} bytes</p>
            </div>
            <div className="rowordering">
              <label>Uploaded On:</label>
              <p>{new Date(fileData.createdAt).toLocaleString()}</p>
            </div>
            <div className="rowordering">
              <label>Last Modified:</label>
              <p>{new Date(fileData.updatedAt).toLocaleString()}</p>
            </div>
            <div>
              <label>Field:</label>
              <select name="field" value={fileData.field || ''} onChange={handleChange}>
                <option value="">Select Field</option>
                <option value="Math">Math</option>
                <option value="Science">Science</option>
                <option value="Engineering">Engineering</option>
                <option value="Arts">Arts</option>
              </select>
            </div>
            <div>
              <label>Branch:</label>
              <select name="branch" value={fileData.branch || ''} onChange={handleChange}>
                <option value="">Select Branch</option>
                <option value="Pure Mathematics">Pure Mathematics</option>
                <option value="Applied Mathematics">Applied Mathematics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Literature">Literature</option>
              </select>
            </div>
            <div>
              <label>Course:</label>
              <select name="course" value={fileData.course || ''} onChange={handleChange}>
                <option value="">Select Course</option>
                <option value="Equations">Equations</option>
                <option value="Numbers">Numbers</option>
                <option value="Reactions">Reactions</option>
                <option value="Networks">Networks</option>
                <option value="Drama">Drama</option>
                <option value="Flow">Flow</option>
              </select>
            </div>
            <button type="submit">Save Changes</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditFilePage;
