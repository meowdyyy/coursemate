import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState({});
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (token) {
      // Fetch profile data, fix the endpoint URL
      axios
        .get('http://localhost:5050/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUserData(response.data);
          setUpdatedUserData(response.data);
          // Set avatar preview if user has one
          if (response.data.profilePicture) {
            setAvatarPreview(response.data.profilePicture);
          }
        })
        .catch((err) => {
          console.error('Error fetching profile:', err.response || err);
          setError(
            err.response?.status === 403
              ? 'Access denied: You do not have permission to view this profile.'
              : 'Unable to fetch profile data.'
          );
        });

      // Fetch user specific uploads
      axios
        .get('http://localhost:5050/notes', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUploads(response.data);
        })
        .catch((err) => {
          console.error('Error fetching uploads:', err.response || err);
          setError(
            err.response?.status === 403
              ? 'Access denied: You do not have permission to view uploads.'
              : 'Unable to fetch uploads.'
          );
        });
    } else {
      setError('No authentication token found.');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserData({ ...updatedUserData, [name]: value });
  };

  // Handle avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Selected avatar file:', file.name, file.type, file.size);
      setAvatarFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  // Handle password change inputs
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  // Handle password update submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.put(
        'http://localhost:5050/users/password',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      console.log('Password update response:', response.data);
      
      // Reset password fields
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password updated successfully');
    } catch (err) {
      console.error('Error updating password:', err);
      setPasswordError(err.response?.data?.message || 'Failed to update password');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('authToken');
    
    try {
      let updatedProfile = { ...updatedUserData };
      
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        
        console.log('Uploading avatar file:', avatarFile.name, avatarFile.type);
        
        try {
          const avatarResponse = await axios.post(
            'http://localhost:5050/users/avatar',
            formData,
            {
              headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              },
            }
          );
          
          console.log('Avatar upload response:', avatarResponse.data);
          
          if (avatarResponse.data.profilePicture) {
            updatedProfile.profilePicture = avatarResponse.data.profilePicture;
          }
        } catch (avatarErr) {
          console.error('Avatar upload error:', avatarErr.response?.data || avatarErr);
          setError('Avatar upload failed: ' + (avatarErr.response?.data?.message || avatarErr.message));
          return;
        }
      }
      
      console.log('Updating profile with data:', updatedProfile);
      
      // Update the profile
      const response = await axios.put(
        'http://localhost:5050/users/profile',
        updatedProfile,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      console.log('Profile update response:', response.data);
      
      setUserData(response.data);
      setEditing(false);
      setAvatarFile(null);
    } catch (err) {
      console.error('Error updating profile:', err.response?.data || err);
      setError('Unable to update profile data: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEditFileInfo = (fileId) => {
    navigate(`/editfile/${fileId}`);
  };

  if (error) return <div>{error}</div>;
  if (!userData) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile-sidebar">
        <div className="profile-info">
          <h2 className="username">{userData.fullName}</h2>
          <p className="userid">@{userData.email}</p>

          {editing ? (
            <form onSubmit={handleSubmit}>
              <div className="avatar-upload">
                <label>Profile Picture:</label>
                <div className="avatar-preview">
                  {avatarPreview && <img src={avatarPreview} alt="Avatar preview" />}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>
              <div>
                <label>Full Name:</label>
                <input
                  type="text"
                  name="fullName"
                  value={updatedUserData.fullName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Age:</label>
                <input
                  type="number"
                  name="age"
                  value={updatedUserData.age || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Status:</label>
                <input
                  type="text"
                  name="status"
                  value={updatedUserData.status || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Education:</label>
                <input
                  type="text"
                  name="education"
                  value={updatedUserData.education || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Location:</label>
                <input
                  type="text"
                  name="location"
                  value={updatedUserData.location || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Languages:</label>
                <input
                  type="text"
                  name="languages"
                  value={updatedUserData.languages || ''}
                  onChange={handleChange}
                />
              </div>
              <button type="submit">Save Changes</button>
            </form>
          ) : (
            <div className="profile-details">
              {userData.profilePicture && (
                <div className="avatar-display">
                  <img src={userData.profilePicture} alt="User avatar" />
                </div>
              )}
              <p>
                <strong>AGE:</strong> {userData.age || 'N/A'}
              </p>
              <p>
                <strong>STATUS:</strong> {userData.status || 'N/A'}
              </p>
              <p>
                <strong>EDUCATION:</strong> {userData.education || 'N/A'}
              </p>
              <p>
                <strong>LOCATION:</strong> {userData.location || 'N/A'}
              </p>
              <p>
                <strong>LANGUAGES:</strong> {userData.languages || 'N/A'}
              </p>
            </div>
          )}

          <button onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <div className="uploads-section">
        <h2>Your Uploaded Files</h2>
        <div className="uploads-grid">
          {uploads.map((upload) => (
            <div key={upload._id} className="upload-card">
              <h3>{upload.title}</h3>
              <p>Field: {upload.field}</p>
              <p>Branch: {upload.branch}</p>
              <p>Course: {upload.course}</p>
              <button className="editfile" onClick={() => handleEditFileInfo(upload._id)}>
                Edit Document Info
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add password change form */}
      {editing && (
        <div className="password-change-section">
          <h3>Change Password</h3>
          {passwordError && <p className="error">{passwordError}</p>}
          <form onSubmit={handlePasswordSubmit}>
            <div>
              <label>Current Password:</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div>
              <label>New Password:</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div>
              <label>Confirm New Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <button type="submit">Update Password</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;