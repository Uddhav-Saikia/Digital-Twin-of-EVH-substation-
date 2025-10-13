import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, Shield, Settings, Bell, Moon, Globe, Save, Edit2, Camera } from 'lucide-react';
import { mockUserProfile } from '../data/mockData';
import './Profile.css';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState(mockUserProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setEditedProfile({
      ...editedProfile,
      [field]: value
    });
  };

  const handlePreferenceChange = (field: string, value: any) => {
    setEditedProfile({
      ...editedProfile,
      preferences: {
        ...editedProfile.preferences,
        [field]: value
      }
    });
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <div>
          <h1>User Profile</h1>
          <p className="page-subtitle">Manage your account settings and preferences</p>
        </div>
        <div className="header-actions">
          {!isEditing ? (
            <button className="btn-primary" onClick={() => setIsEditing(true)}>
              <Edit2 size={18} />
              Edit Profile
            </button>
          ) : (
            <>
              <button className="btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSave}>
                <Save size={18} />
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      <div className="profile-container">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-header-section">
            <div className="profile-avatar-container">
              <div className="profile-avatar">
                <User size={64} />
              </div>
              {isEditing && (
                <button className="avatar-upload-btn">
                  <Camera size={18} />
                </button>
              )}
            </div>
            <div className="profile-header-info">
              <h2>{profile.fullName}</h2>
              <p className="profile-role">{profile.role}</p>
              <p className="profile-department">{profile.department}</p>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <Calendar size={20} />
              <div>
                <div className="stat-label">Member Since</div>
                <div className="stat-value">{new Date(profile.joinDate).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="stat-item">
              <Shield size={20} />
              <div>
                <div className="stat-label">Permissions</div>
                <div className="stat-value">{profile.permissions.length}</div>
              </div>
            </div>
            <div className="stat-item">
              <Calendar size={20} />
              <div>
                <div className="stat-label">Last Login</div>
                <div className="stat-value">{new Date(profile.lastLogin).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="info-section">
          <div className="section-header">
            <User size={20} />
            <h3>Account Information</h3>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <label>Username</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                />
              ) : (
                <div className="info-value">{profile.username}</div>
              )}
            </div>
            <div className="info-item">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
              ) : (
                <div className="info-value">{profile.fullName}</div>
              )}
            </div>
            <div className="info-item">
              <label>
                <Mail size={16} />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              ) : (
                <div className="info-value">{profile.email}</div>
              )}
            </div>
            <div className="info-item">
              <label>
                <Phone size={16} />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedProfile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              ) : (
                <div className="info-value">{profile.phone}</div>
              )}
            </div>
            <div className="info-item">
              <label>Role</label>
              <div className="info-value">
                <span className="role-badge">{profile.role}</span>
              </div>
            </div>
            <div className="info-item">
              <label>Department</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                />
              ) : (
                <div className="info-value">{profile.department}</div>
              )}
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="info-section">
          <div className="section-header">
            <Settings size={20} />
            <h3>Preferences</h3>
          </div>
          <div className="preferences-grid">
            <div className="preference-item">
              <div className="preference-info">
                <Bell size={20} />
                <div>
                  <div className="preference-label">Push Notifications</div>
                  <div className="preference-description">Receive real-time alerts</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={isEditing ? editedProfile.preferences.notifications : profile.preferences.notifications}
                  onChange={(e) => {
                    if (isEditing) {
                      handlePreferenceChange('notifications', e.target.checked);
                    } else {
                      setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences,
                          notifications: e.target.checked
                        }
                      });
                    }
                  }}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <Mail size={20} />
                <div>
                  <div className="preference-label">Email Alerts</div>
                  <div className="preference-description">Get important updates via email</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={isEditing ? editedProfile.preferences.emailAlerts : profile.preferences.emailAlerts}
                  onChange={(e) => {
                    if (isEditing) {
                      handlePreferenceChange('emailAlerts', e.target.checked);
                    } else {
                      setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences,
                          emailAlerts: e.target.checked
                        }
                      });
                    }
                  }}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <Moon size={20} />
                <div>
                  <div className="preference-label">Dark Mode</div>
                  <div className="preference-description">Use dark theme</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={isEditing ? editedProfile.preferences.darkMode : profile.preferences.darkMode}
                  onChange={(e) => {
                    if (isEditing) {
                      handlePreferenceChange('darkMode', e.target.checked);
                    } else {
                      setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences,
                          darkMode: e.target.checked
                        }
                      });
                    }
                  }}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <Globe size={20} />
                <div>
                  <div className="preference-label">Language</div>
                  <div className="preference-description">Choose your preferred language</div>
                </div>
              </div>
              {isEditing ? (
                <select
                  value={editedProfile.preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  className="language-select"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              ) : (
                <div className="info-value">{profile.preferences.language.toUpperCase()}</div>
              )}
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="info-section">
          <div className="section-header">
            <Shield size={20} />
            <h3>Permissions & Access</h3>
          </div>
          <div className="permissions-list">
            {profile.permissions.map((permission, index) => (
              <div key={index} className="permission-badge">
                <Shield size={14} />
                {permission.replace(/_/g, ' ').toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
