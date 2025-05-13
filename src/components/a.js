import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Upload.css';
import { FaFileAlt, FaTimes } from 'react-icons/fa';

const Upload = ({ isSidenavOpen }) => {
    const [file, setFile] = useState(null);
    const [fileData, setFileData] = useState(null);
    const [description, setDescription] = useState('');
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
        e.preventDefault();
        setLoading(true);
        setError('');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', description);

        try {
            await axios.post('http://localhost:5000/notes/upload', formData);
            alert('File uploaded successfully');
            setFile(null);
            setDescription('');
        } catch (err) {
            alert('File error');
            console.error('Error uploading file:', err);
            setError('File upload failed. Please try again.');
        } finally {
            setLoading(false);
            navigate('/profile');
        }
    };

    const goToEditor = () => {
        if (fileData) {
            navigate('/editor', { state: { fileData, description } });
        } else {
            alert("Please upload a file first.");
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

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
                    <button onClick={goToEditor} className="action-button">Editor</button>
                    <button onClick={handleSubmit} className="action-button" disabled={!file || loading}>
                        {loading ? 'Uploading...' : 'Publish'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Upload;
