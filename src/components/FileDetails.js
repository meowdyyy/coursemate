import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import "./FileDetails.css"

const FileDetails = () => {
  const { fileId } = useParams(); // Get the file ID from the URL
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

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

  // Handle file download and track it
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const token = localStorage.getItem('authToken');

      // First track the download
      await axios.post(`http://localhost:5050/notes/${fileId}/download`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Then open the file URL in a new tab
      window.open(fileData.fileURL, '_blank');

      // Refresh file data to show updated download count
      const response = await axios.get(`http://localhost:5050/notes/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFileData(response.data);
      setIsDownloading(false);
    } catch (err) {
      console.error('Error downloading file:', err);
      setError('Failed to download file');
      setIsDownloading(false);
    }
  };

  // Handle rating submission
  const handleRating = async (rating) => {
    try {
      const token = localStorage.getItem('authToken');

      await axios.post(`http://localhost:5050/notes/${fileId}/rate`, { rating }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh file data to show updated rating
      const response = await axios.get(`http://localhost:5050/notes/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFileData(response.data);
      setUserRating(rating);
    } catch (err) {
      console.error('Error submitting rating:', err);
      setError('Failed to submit rating');
    }
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!fileData) return <div className="loading-message">Loading...</div>;

  return (
    <div className="file-details-page">
      <h2 className="file-title">{fileData.title}</h2>
      <div className="file-info">
        <div className="file-info-row">
          <strong>Field:</strong>
          <span>{fileData.field}</span>
        </div>
        <div className="file-info-row">
          <strong>Original Filename:</strong>
          <span>{fileData.originalName}</span>
        </div>
        <div className="file-info-row">
          <strong>Branch:</strong>
          <span>{fileData.branch}</span>
        </div>
        <div className="file-info-row">
          <strong>File Size:</strong>
          <span>{(fileData.fileSize / 1024).toFixed(2)} KB</span>
        </div>
        <div className="file-info-row">
          <strong>Course:</strong>
          <span>{fileData.course}</span>
        </div>

        <div className="file-info-row">
          <strong>File Type:</strong>
          <span>{fileData.fileType}</span>
        </div>

        <div className="file-info-row">
          <strong>Resource Type:</strong>
          <span>{fileData.resourceType ? fileData.resourceType.charAt(0).toUpperCase() + fileData.resourceType.slice(1) : 'Notes'}</span>
        </div>

        <div className="file-info-row">
          <strong>Semester:</strong>
          <span>{fileData.semester || 'Spring'} {fileData.year || new Date().getFullYear()}</span>
        </div>

        <div className="file-info-row">
          <strong>Downloads:</strong>
          <span>{fileData.downloads || 0}</span>
        </div>

        <div className="file-info-row">
          <strong>Rating:</strong>
          <span>{fileData.rating ? fileData.rating.toFixed(1) : '0.0'} / 5 ({fileData.ratingCount || 0} ratings)</span>
        </div>
      </div>

      <div className="file-actions">
        <button
          className="download-button"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? 'Downloading...' : 'Download File'}
        </button>

        <div className="rating-container">
          <p>Rate this resource:</p>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${userRating >= star ? 'selected' : ''}`}
                onClick={() => handleRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>

      <Link to="/browse" className="back-link">← Back to Browse</Link>
    </div>
  );
};

export default FileDetails;
