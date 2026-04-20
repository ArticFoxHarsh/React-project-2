import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import './ProfileModal.css';

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateUserName, updateUserAvatar } = useFinance();
  const [name, setName] = useState(user.name);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      updateUserAvatar(reader.result);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateUserName(name);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          {/* Avatar Section */}
          <div className="profile-upload">
            <div className="profile-preview">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" />
              ) : (
                <div className="avatar-placeholder">{user.name[0]}</div>
              )}
              {loading && <div className="upload-loader">...</div>}
            </div>
            <label className="upload-btn">
              <span>Change Photo</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
            </label>
          </div>

          {/* Name Section */}
          <div className="f-group">
            <label>Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="f-input"
              placeholder="Enter your name"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
