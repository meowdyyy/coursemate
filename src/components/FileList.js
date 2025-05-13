import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FileList() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Fetch files from the backend
    axios.get('http://localhost:5050/notes')
      .then(response => {
        setFiles(response.data); // Store the file metadata
      })
      .catch(error => {
        console.error('Error fetching files:', error);
      });
  }, []);

  return (
    <div>
      <h2>Uploaded Files</h2>
      {files.length > 0 ? (
        files.map(file => (
          <div key={file._id}>
            <p>{file.fileName} - {file.fileType} - {file.fileSize} bytes</p>
            <a href={`http://localhost:5050/${file.fileURL}`} target="_blank" rel="noopener noreferrer">
              Download
            </a>
          </div>
        ))
      ) : (
        <p>No files uploaded.</p>
      )}
    </div>
  );
}

export default FileList;
