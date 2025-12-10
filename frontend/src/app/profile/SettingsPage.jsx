import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [username, setUsername] = useState('@johndoe');
  const [bio, setBio] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('lose_weight');
  const [desiredWeight, setDesiredWeight] = useState('');
  const [email, setEmail] = useState('john.doe@example.com');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);

  const navigate = useNavigate();

  const handleSaveProfile = () => {
    alert('Profile updated successfully!');
  };

  const handleSendResetLink = () => {
    alert('Password reset link sent! Check your email. The link will expire in 20 minutes.');
  };

  const handleDeactivate = () => {
    alert('Account deactivated. You can reactivate anytime by logging back in.');
    setShowDeactivateDialog(false);
  };

  const handleDelete = () => {
    alert('Account permanently deleted. We\'re sad to see you go.');
    setShowDeleteDialog(false);
  };
  
useEffect(() => {
  // Remove default body margin and set background to match the app
  document.body.style.margin = '0';
  document.body.style.backgroundColor = isDarkMode ? '#0f172b' : '#f8fafc';

  // Optional: make sure the html element also matches
  document.documentElement.style.backgroundColor = isDarkMode ? '#0f172b' : '#f8fafc';

  // Cleanup when this component unmounts
  return () => {
    document.body.style.margin = '';
    document.body.style.backgroundColor = '';
    document.documentElement.style.backgroundColor = '';
  };
}, [isDarkMode]);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div style={{ minHeight: '100vh', backgroundColor: isDarkMode ? '#0f172b' : '#f8fafc' }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#0f172b',
          borderBottom: '1px solid #1d293d',
          padding: '24px 32px'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '0px',
                height: '40px',
                backgroundColor: '#4f39f6',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
              </div>
              <span 
                style={{ color: 'white', fontSize: '24px', fontWeight: '600' }}
                onClick={() => navigate("/feed")}>MacroTok</span>
            </div>
            <button style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: '#90a1b9',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
               Sign Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 32px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '600', 
            marginBottom: '8px',
            color: isDarkMode ? 'white' : '#0f172b'
          }}>
            Settings
          </h1>
          <p style={{ 
            fontSize: '16px', 
            color: isDarkMode ? '#90a1b9' : '#45556c',
            marginBottom: '32px'
          }}>
            Manage your account settings and preferences
          </p>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: '16px',
            borderBottom: `1px solid ${isDarkMode ? '#45556c' : '#e2e8f0'}`,
            marginBottom: '32px'
          }}>
            {['profile', 'security', 'preferences', 'privacy', 'account'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab ? '2px solid #4f39f6' : '2px solid transparent',
                  color: activeTab === tab 
                    ? (isDarkMode ? 'white' : '#0f172b')
                    : (isDarkMode ? '#90a1b9' : '#45556c'),
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: activeTab === tab ? '600' : '400',
                  textTransform: 'capitalize'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Profile Section */}
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ 
                fontSize: '24px', 
                color: isDarkMode ? 'white' : '#0f172b',
                marginBottom: '8px'
              }}>
                Profile Settings
              </h2>
              <p style={{ 
                fontSize: '16px', 
                color: isDarkMode ? '#90a1b9' : '#45556c',
                marginBottom: '24px'
              }}>
                Manage your personal information and profile picture
              </p>

              <div style={{
                backgroundColor: isDarkMode ? '#1e293b' : 'white',
                padding: '24px',
                borderRadius: '12px',
                border: `1px solid ${isDarkMode ? '#45556c' : '#cad5e2'}`,
                boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)'
              }}>
                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
                  <div style={{
                    width: '96px',
                    height: '96px',
                    backgroundColor: '#4f39f6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '32px',
                    fontWeight: '600'
                  }}>
                    JD
                  </div>
                  <div>
                    <button style={{
                      padding: '10px 20px',
                      backgroundColor: '#4f39f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      marginBottom: '8px'
                    }}>
                      Upload Photo
                    </button>
                    <p style={{ fontSize: '14px', color: isDarkMode ? '#90a1b9' : '#45556c' }}>
                      JPG, PNG or GIF. Max size 2MB
                    </p>
                  </div>
                </div>

                <hr style={{ 
                  border: 'none', 
                  borderTop: `1px solid ${isDarkMode ? '#45556c' : '#e2e8f0'}`,
                  margin: '24px 0'
                }} />

                {/* Name Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px',
                      color: isDarkMode ? 'white' : '#0f172b'
                    }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      defaultValue="John"
                      style={{
                        width: '100%',
                        padding: '10px 2px',
                        border: `1px solid ${isDarkMode ? '#45556c' : '#cad5e2'}`,
                        borderRadius: '8px',
                        backgroundColor: isDarkMode ? '#0f172b' : 'white',
                        color: isDarkMode ? 'white' : '#0f172b'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px',
                      color: isDarkMode ? 'white' : '#0f172b'
                    }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Doe"
                      style={{
                        width: '100%',
                        padding: '10px 2px',
                        border: `1px solid ${isDarkMode ? '#45556c' : '#cad5e2'}`,
                        borderRadius: '8px',
                        backgroundColor: isDarkMode ? '#0f172b' : 'white',
                        color: isDarkMode ? 'white' : '#0f172b'
                      }}
                    />
                  </div>
                </div>

                {/* Username */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    color: isDarkMode ? 'white' : '#0f172b'
                  }}>
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 1px',
                      border: `1px solid ${isDarkMode ? '#45556c' : '#cad5e2'}`,
                      borderRadius: '8px',
                      backgroundColor: isDarkMode ? '#0f172b' : 'white',
                      color: isDarkMode ? 'white' : '#0f172b'
                    }}
                  />
                </div>

                {/* Bio */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    color: isDarkMode ? 'white' : '#0f172b'
                  }}>
                    Bio
                  </label>
                  <textarea
                    rows="4"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself and your fitness journey..."
                    style={{
                      width: '100%',
                      padding: '10px 1px',
                      border: `1px solid ${isDarkMode ? '#45556c' : '#cad5e2'}`,
                      borderRadius: '8px',
                      backgroundColor: isDarkMode ? '#0f172b' : 'white',
                      color: isDarkMode ? 'white' : '#0f172b',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                {/* Fitness Goals */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px',
                      color: isDarkMode ? 'white' : '#0f172b'
                    }}>
                      Fitness Goal
                    </label>
                    <select
                      value={fitnessGoal}
                      onChange={(e) => setFitnessGoal(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${isDarkMode ? '#45556c' : '#cad5e2'}`,
                        borderRadius: '8px',
                        backgroundColor: isDarkMode ? '#0f172b' : 'white',
                        color: isDarkMode ? 'white' : '#0f172b'
                      }}
                    >
                      <option value="lose_weight">Lose Weight</option>
                      <option value="get_lean">Get Lean</option>
                      <option value="bulk">Bulk</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px',
                      color: isDarkMode ? 'white' : '#0f172b'
                    }}>
                      Desired Weight (lbs)
                    </label>
                    <input
                      type="number"
                      value={desiredWeight}
                      onChange={(e) => setDesiredWeight(e.target.value)}
                      placeholder="e.g., 165"
                      style={{
                        width: '100%',
                        padding: '10px 1px',
                        border: `1px solid ${isDarkMode ? '#45556c' : '#cad5e2'}`,
                        borderRadius: '8px',
                        backgroundColor: isDarkMode ? '#0f172b' : 'white',
                        color: isDarkMode ? 'white' : '#0f172b'
                      }}
                    />
                  </div>
                </div>

                <button 
                  onClick={handleSaveProfile}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: isDarkMode ? '#4f39f6' : '#4f39f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeTab === 'security' && (
            <div>
              <h2 style={{ 
                fontSize: '24px', 
                color: isDarkMode ? 'white' : '#182b0fff',
                marginBottom: '8px'
              }}>
                Account Security
              </h2>
              <p style={{ 
                fontSize: '16px', 
                color: isDarkMode ? '#90a1b9' : '#45556c',
                marginBottom: '24px'
              }}>
                Update your password and security settings
              </p>

              <div style={{
                backgroundColor: isDarkMode ? '#1e293b' : 'white',
                padding: '24px',
                borderRadius: '12px',
                border: `1px solid ${isDarkMode ? '#45556c' : '#cad5e2'}`,
                boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
                marginBottom: '24px'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  color: isDarkMode ? 'white' : '#0f172b',
                  marginBottom: '4px'
                }}>
                  Change Password
                </h3>
                <p style={{ 
                  fontSize: '14px', 
                  color: isDarkMode ? '#90a1b9' : '#45556c',
                  marginBottom: '16px'
                }}>
                  Please provide your email to send a password reset link. The link will expire in 20 minutes.
                </p>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    color: isDarkMode ? 'white' : '#0f172b'
                  }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 0px',
                      border: `1px solid ${isDarkMode ? '#45556c' : '#cad5e2'}`,
                      borderRadius: '8px',
                      backgroundColor: isDarkMode ? '#0f172b' : 'white',
                      color: isDarkMode ? 'white' : '#0f172b'
                    }}
                  />
                </div>

                <button 
                  onClick={handleSendResetLink}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#4f39f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  ✉️ Send Password Reset Link
                </button>
              </div>

              <div style={{
                backgroundColor: isDarkMode ? '#1e293b' : 'white',
                padding: '24px',
                borderRadius: '12px',
                border: `1px solid ${isDarkMode ? '#45556c' : '#cad5e2'}`,
                boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  color: isDarkMode ? 'white' : '#0f172b',
                  marginBottom: '4px'
                }}>
                  Two-Factor Authentication
                </h3>
                <p style={{ 
                  fontSize: '14px', 
                  color: isDarkMode ? '#90a1b9' : '#45556c',
                  marginBottom: '16px'
                }}>
                  Add an extra layer of security to your account
                </p>
                <button style={{
                  padding: '10px 20px',
                  backgroundColor: 'transparent',
                  color: isDarkMode ? 'white' : '#0f172b',
                  border: `1px solid ${isDarkMode ? '#45556c' : '#cad5e2'}`,
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  Enable 2FA
                </button>
              </div>
            </div>
          )}

          {/* Preferences Section */}
          {activeTab === 'preferences' && (
            <div>
              <h2 style={{ 
                fontSize: '24px', 
                color: isDarkMode ? 'white' : '#0f172b',
                marginBottom: '8px'
              }}>
                Preferences
              </h2>
              <p style={{ 
                fontSize: '16px', 
                color: isDarkMode ? '#90a1b9' : '#45556c',
                marginBottom: '24px'
              }}>
                Customize your MacroTok experience
              </p>

              <div style={{
                backgroundColor: isDarkMode ? '#1e293b' : 'white',
                padding: '24px',
                borderRadius: '12px',
                border: `1px solid ${isDarkMode ? '#45556c' : '#cad5e2'}`,
                boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)'
              }}>
                {/* Dark Mode Toggle */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <div>
                    <div style={{ 
                      color: isDarkMode ? 'white' : '#0f172b',
                      marginBottom: '4px'
                    }}>
                      Dark Mode
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: isDarkMode ? '#90a1b9' : '#45556c'
                    }}>
                      Switch between light and dark theme
                    </div>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                    <input 
                      type="checkbox" 
                      checked={isDarkMode}
                      onChange={() => setIsDarkMode(!isDarkMode)}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: isDarkMode ? '#4f39f6' : '#ccc',
                      transition: '0.4s',
                      borderRadius: '24px'
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '',
                        height: '18px',
                        width: '18px',
                        left: isDarkMode ? '27px' : '3px',
                        bottom: '3px',
                        backgroundColor: 'white',
                        transition: '0.4s',
                        borderRadius: '50%'
                      }} />
                    </span>
                  </label>
                </div>

                <hr style={{ 
                  border: 'none', 
                  borderTop: `1px solid ${isDarkMode ? '#45556c' : '#e2e8f0'}`,
                  margin: '24px 0'
                }} />

                {/* Email Notifications */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <div>
                    <div style={{ 
                      color: isDarkMode ? 'white' : '#0f172b',
                      marginBottom: '4px'
                    }}>
                      Email Notifications
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: isDarkMode ? '#90a1b9' : '#45556c'
                    }}>
                      Receive emails about your meal plans and recipes
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
                </div>

                <hr style={{ 
                  border: 'none', 
                  borderTop: `1px solid ${isDarkMode ? '#45556c' : '#e2e8f0'}`,
                  margin: '24px 0'
                }} />

                {/* Push Notifications */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <div>
                    <div style={{ 
                      color: isDarkMode ? 'white' : '#0f172b',
                      marginBottom: '4px'
                    }}>
                      Push Notifications
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: isDarkMode ? '#90a1b9' : '#45556c'
                    }}>
                      Get reminders for meal times and weekly planning
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
                </div>

                <hr style={{ 
                  border: 'none', 
                  borderTop: `1px solid ${isDarkMode ? '#45556c' : '#e2e8f0'}`,
                  margin: '24px 0'
                }} />

                {/* Community Updates */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <div>
                    <div style={{ 
                      color: isDarkMode ? 'white' : '#0f172b',
                      marginBottom: '4px'
                    }}>
                      Community Updates
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: isDarkMode ? '#90a1b9' : '#45556c'
                    }}>
                      Stay informed about community recipes and content
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
                </div>

                <hr style={{ 
                  border: 'none', 
                  borderTop: `1px solid ${isDarkMode ? '#45556c' : '#e2e8f0'}`,
                  margin: '24px 0'
                }} />

                {/* Timezone */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '12px',
                    color: isDarkMode ? 'white' : '#0f172b'
                  }}>
                    Time Zone
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${isDarkMode ? '#45556c' : '#cad5e2'}`,
                    borderRadius: '8px',
                    backgroundColor: isDarkMode ? '#0f172b' : 'white',
                    color: isDarkMode ? 'white' : '#0f172b'
                  }}>
                    <option>Pacific Time (PT)</option>
                    <option>Mountain Time (MT)</option>
                    <option>Central Time (CT)</option>
                    <option>Eastern Time (ET)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Section */}
          {activeTab === 'privacy' && (
            <div>
              <h2 style={{ 
                fontSize: '24px', 
                color: isDarkMode ? 'white' : '#0f172b',
                marginBottom: '8px'
              }}>
                Privacy Settings
              </h2>
              <p style={{ 
                fontSize: '16px', 
                color: isDarkMode ? '#90a1b9' : '#45556c',
                marginBottom: '24px'
              }}>
                Control who can see your content and activity
              </p>

              <div style={{
                backgroundColor: isDarkMode ? '#1e293b' : 'white',
                padding: '24px',
                borderRadius: '12px',
                border: `1px solid ${isDarkMode ? '#45556c' : '#cad5e2'}`,
                boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
                marginBottom: '24px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ 
                      color: isDarkMode ? 'white' : '#0f172b',
                      marginBottom: '4px'
                    }}>
                      Public Profile
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: isDarkMode ? '#90a1b9' : '#45556c'
                    }}>
                      Make your profile visible to all users
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
                </div>
              </div>

              <div style={{
                backgroundColor: isDarkMode ? '#1e293b' : 'white',
                padding: '24px',
                borderRadius: '12px',
                border: `1px solid ${isDarkMode ? '#45556c' : '#cad5e2'}`,
                boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  color: isDarkMode ? 'white' : '#0f172b',
                  marginBottom: '4px'
                }}>
                  Data & Privacy
                </h3>
                <p style={{ 
                  fontSize: '14px', 
                  color: isDarkMode ? '#90a1b9' : '#45556c',
                  marginBottom: '16px'
                }}>
                  Download or manage your personal data
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button style={{
                    padding: '10px 20px',
                    backgroundColor: 'transparent',
                    color: isDarkMode ? 'white' : '#0f172b',
                    border: `1px solid ${isDarkMode ? '#45556c' : '#cad5e2'}`,
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}>
                    Download My Data
                  </button>
                  <button style={{
                    padding: '10px 20px',
                    backgroundColor: 'transparent',
                    color: isDarkMode ? 'white' : '#0f172b',
                    border: `1px solid ${isDarkMode ? '#45556c' : '#cad5e2'}`,
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}>
                    Privacy Policy
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Account Management Section */}
          {activeTab === 'account' && (
            <div>
              <h2 style={{ 
                fontSize: '24px', 
                color: isDarkMode ? 'white' : '#0f172b',
                marginBottom: '8px'
              }}>
                Account Management
              </h2>
              <p style={{ 
                fontSize: '16px', 
                color: isDarkMode ? '#90a1b9' : '#45556c',
                marginBottom: '24px'
              }}>
                Deactivate or delete your account
              </p>

              {/* Deactivate Account */}
              <div style={{
                backgroundColor: isDarkMode ? '#1e293b' : 'white',
                padding: '24px',
                borderRadius: '12px',
                border: `1px solid ${isDarkMode ? 'rgba(251, 191, 36, 0.5)' : 'rgb(254, 240, 199)'}`,
                boxShadow: '0px 10px 15px -3px rgba(251,191,36,0.1)',
                marginBottom: '24px'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  color: isDarkMode ? 'rgb(251, 191, 36)' : 'rgb(180, 83, 9)',
                  marginBottom: '4px'
                }}>
                  Deactivate Account
                </h3>
                <p style={{ 
                  fontSize: '14px', 
                  color: isDarkMode ? '#90a1b9' : '#45556c',
                  marginBottom: '16px'
                }}>
                  Temporarily disable your account. You can reactivate it anytime by logging back in. Your data will be preserved.
                </p>
                <button 
                  onClick={() => setShowDeactivateDialog(true)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'transparent',
                    color: isDarkMode ? 'rgb(251, 191, 36)' : 'rgb(180, 83, 9)',
                    border: `1px solid ${isDarkMode ? 'rgb(251, 191, 36)' : 'rgb(217, 119, 6)'}`,
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Deactivate Account
                </button>
              </div>

              {/* Delete Account */}
              <div style={{
                backgroundColor: isDarkMode ? '#1e293b' : 'white',
                padding: '24px',
                borderRadius: '12px',
                border: `1px solid ${isDarkMode ? 'rgba(239, 68, 68, 0.5)' : 'rgb(254, 226, 226)'}`,
                boxShadow: '0px 10px 15px -3px rgba(239,68,68,0.1)'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  color: isDarkMode ? 'rgb(248, 113, 113)' : 'rgb(220, 38, 38)',
                  marginBottom: '4px'
                }}>
                  Delete Account
                </h3>
                <p style={{ 
                  fontSize: '14px', 
                  color: isDarkMode ? '#90a1b9' : '#45556c',
                  marginBottom: '16px'
                }}>
                  Once you delete your account, there is no going back. All your meal plans, recipes, and data will be permanently deleted. This action cannot be undone.
                </p>
                <button 
                  onClick={() => setShowDeleteDialog(true)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'transparent',
                    color: isDarkMode ? 'rgb(248, 113, 113)' : 'rgb(220, 38, 38)',
                    border: `1px solid ${isDarkMode ? 'rgb(239, 68, 68)' : 'rgb(220, 38, 38)'}`,
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Delete My Account
                </button>
              </div>

              {/* Deactivate Dialog */}
              {showDeactivateDialog && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000
                }}>
                  <div style={{
                    backgroundColor: isDarkMode ? '#1e293b' : 'white',
                    padding: '32px',
                    borderRadius: '12px',
                    maxWidth: '500px',
                    border: `1px solid ${isDarkMode ? '#45556c' : '#cad5e2'}`
                  }}>
                    <h3 style={{ 
                      fontSize: '20px',
                      color: isDarkMode ? 'white' : '#0f172b',
                      marginBottom: '12px'
                    }}>
                      Deactivate your account?
                    </h3>
                    <p style={{ 
                      fontSize: '14px',
                      color: isDarkMode ? '#90a1b9' : '#45556c',
                      marginBottom: '24px'
                    }}>
                      Your profile and content will be hidden until you reactivate your account by logging back in. Your data will be safely stored.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => setShowDeactivateDialog(false)}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: 'transparent',
                          color: isDarkMode ? 'white' : '#0f172b',
                          border: `1px solid ${isDarkMode ? '#45556c' : '#cad5e2'}`,
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleDeactivate}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: 'rgb(217, 119, 6)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        Deactivate
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Delete Dialog */}
              {showDeleteDialog && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000
                }}>
                  <div style={{
                    backgroundColor: isDarkMode ? '#1e293b' : 'white',
                    padding: '32px',
                    borderRadius: '12px',
                    maxWidth: '500px',
                    border: `1px solid ${isDarkMode ? '#45556c' : '#cad5e2'}`
                  }}>
                    <h3 style={{ 
                      fontSize: '20px',
                      color: isDarkMode ? 'white' : '#0f172b',
                      marginBottom: '12px'
                    }}>
                      Are you absolutely sure?
                    </h3>
                    <p style={{ 
                      fontSize: '14px',
                      color: isDarkMode ? '#90a1b9' : '#45556c',
                      marginBottom: '12px'
                    }}>
                      This action cannot be undone. This will permanently delete your account and remove all your data from our servers including:
                    </p>
                    <ul style={{ 
                      fontSize: '14px',
                      color: isDarkMode ? '#90a1b9' : '#45556c',
                      marginBottom: '24px',
                      paddingLeft: '20px'
                    }}>
                      <li>Your profile and account information</li>
                      <li>All meal plans and recipes</li>
                      <li>Saved preferences and settings</li>
                      <li>Community contributions</li>
                    </ul>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => setShowDeleteDialog(false)}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: 'transparent',
                          color: isDarkMode ? 'white' : '#0f172b',
                          border: `1px solid ${isDarkMode ? '#45556c' : '#cad5e2'}`,
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleDelete}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: 'rgb(220, 38, 38)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
