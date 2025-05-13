import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DocumentView.css';

function DocumentView() {
  const { id } = useParams();  // Extract `id` from the URL
  const [file, setFile] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [starred, setStarred] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [replyIndex, setReplyIndex] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [newFile, setNewFile] = useState(null);
  const [username] = useState('User123');
  const [objectURL, setObjectURL] = useState(null);
  console.log("Document ID:", id); 

  console.log(localStorage.getItem('authtoken'));
  useEffect(() => {
    if (!id) return;  // If there's no ID, don't try to fetch data

    const fetchFileData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`http://localhost:5050/notes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFile(response.data);  // Set the file data from the API response
      } catch (error) {
        console.error("Error fetching file data:", error);
      }
    };

    fetchFileData();
  }, [id]);  // Dependency on `id`, so it re-fetches when the ID changes

  useEffect(() => {
    if (file?.fileURL) {
      setObjectURL(file.fileURL);  // Use fileURL from the backend response
    } else if (file instanceof File) {
      setObjectURL(URL.createObjectURL(file));  // For local file objects
    }
  }, [file]);

  // Handle comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, { text: newComment, replies: [], owner: username }]);
      setNewComment('');
    }
  };

  // Handle comment reply submission
  const handleReplySubmit = (index) => {
    if (replyText.trim()) {
      setComments((prevComments) => {
        const updatedComments = [...prevComments];
        updatedComments[index].replies.push(replyText);
        return updatedComments;
      });
      setReplyIndex(null);
      setReplyText('');
    }
  };

  // Handle comment deletion
  const handleDeleteComment = (index) => {
    if (comments[index]?.owner === username) {
      setComments((prevComments) => prevComments.filter((_, i) => i !== index));
    } else {
      alert("You can only delete your own comments.");
    }
  };

  // Handle file upload
  const uploadFile = () => {
    if (newFile) {
      console.log('Uploading file:', newFile);
      
    }
  };

  return (<div className="document-view">
    <div className="document-header">
      {/* Check if file is available */}
      <h1>{file ? file.title : 'Loading...'}</h1>
    </div>
  
    <div className="document-content">
      {file ? (
        <div className="document-placeholder">
          <p>
            File uploaded: {file.originalName || 'N/A'} &nbsp; Type: {file.fileType || 'N/A'} &nbsp; Size: {file.fileSize ? (file.fileSize / 1024).toFixed(2) : 'N/A'} KB
          </p>
          {file.fileType?.startsWith('image/') && objectURL && (
            <img src={objectURL} alt={file.originalName} style={{ width: '100%', maxHeight: '600px', objectFit: 'contain' }} />
          )}
          {file.fileType === 'application/pdf' && objectURL && (
            <iframe src={objectURL} title={file.originalName} style={{ width: '100%', height: '600px' }} />
          )}
        </div>
      ) : (
        <div className="document-placeholder">No document available.</div>
      )}
    </div>
  
    <div className="document-actions">
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-comment'}`}></i> {isSidebarOpen ? 'Close' : 'Comments'}
      </button>
      <button onClick={() => setStarred(!starred)}>
        <i className={`fas fa-star ${starred ? 'starred' : ''}`}></i>
      </button>
    </div>
  
    {isSidebarOpen && (
      <div className="comment-sidebar">
        <div className="comment-sidebar-header">
          <h3>Comments</h3>
        </div>
  
        <div className="comment-section">
          {/* Move comment input to the top */}
          <form onSubmit={handleCommentSubmit} className="add-comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
            />
            <button type="submit">Add Comment</button>
          </form>
  
          {comments.length === 0 ? (
            <p>No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment, index) => (
              <div key={index} className="comment">
                <p>{comment.owner}: {comment.text}</p>
                {comment.replies.length > 0 && (
                  <div className="replies">
                    {comment.replies.map((reply, i) => (
                      <p key={i} className="reply">- {reply}</p>
                    ))}
                  </div>
                )}
                {replyIndex === index ? (
                  <div className="reply-form">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                    />
                    <button onClick={() => handleReplySubmit(index)}>Submit Reply</button>
                  </div>
                ) : (
                  <button onClick={() => setReplyIndex(index)}>Reply</button>
                )}
                <button onClick={() => handleDeleteComment(index)}>Delete</button>
              </div>
            ))
          )}
        </div>
      </div>
    )}
  </div>
  
  );
}

export default DocumentView;