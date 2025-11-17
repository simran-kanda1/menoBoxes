import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

const Profile = ({ onBackToHome, onStartQuiz }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [showRetakeModal, setShowRetakeModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Check if user is already logged in (from session storage)
    const storedUser = sessionStorage.getItem('userEmail');
    if (storedUser) {
      loadUserProfile(storedUser);
    }
  }, []);

  const loadUserProfile = async (email) => {
    try {
      const docId = email.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, '_');
      const profileDoc = await getDoc(doc(db, 'user-profiles', docId));
      
      if (profileDoc.exists()) {
        const profileData = profileDoc.data();
        setUserProfile(profileData);
        setNotes(profileData.notes || '');
        setIsLoggedIn(true);
        sessionStorage.setItem('userEmail', email);
        
        // Load orders
        await loadUserOrders(email);
      } else {
        setError('Profile not found. Please complete the quiz first.');
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Error loading profile');
      setIsLoggedIn(false);
    }
  };

  const loadUserOrders = async (email) => {
    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('email', '==', email.toLowerCase().trim())
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUserOrders(ordersData);
    } catch (err) {
      console.error('Error loading orders:', err);
    }
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginEmail || !loginPassword) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const docId = loginEmail.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, '_');
      const profileDoc = await getDoc(doc(db, 'user-profiles', docId));
      
      if (profileDoc.exists()) {
        const profileData = profileDoc.data();
        
        // Simple password check (in production, use proper authentication)
        if (profileData.password === loginPassword) {
          await loadUserProfile(loginEmail);
        } else {
          setError('Incorrect password');
        }
      } else {
        setError('Account not found. Please complete the quiz first.');
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setError('Error logging in. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile(null);
    setUserOrders([]);
    setNotes('');
    setLoginEmail('');
    setLoginPassword('');
    setError('');
    sessionStorage.removeItem('userEmail');
  };

  const handleSaveNotes = async () => {
    if (!userProfile) return;

    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const docId = userProfile.email.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, '_');
      
      // Update the notes in Firebase
      await updateDoc(doc(db, 'user-profiles', docId), {
        notes: notes,
        notesUpdatedAt: new Date().toISOString()
      });
      
      // Update local state
      setUserProfile({ ...userProfile, notes: notes, notesUpdatedAt: new Date().toISOString() });
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error saving notes:', err);
      setError('Error saving notes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRetakeQuiz = () => {
    setShowRetakeModal(true);
  };

  const confirmRetakeQuiz = () => {
    setShowRetakeModal(false);
    onStartQuiz(userProfile.email);
  };

  const cancelRetakeQuiz = () => {
    setShowRetakeModal(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getSymptomsList = () => {
    if (!userProfile || !userProfile.symptoms) return [];
    return Object.entries(userProfile.symptoms)
      .filter(([_, severity]) => severity !== 'Not at all')
      .map(([symptom, severity]) => ({ symptom, severity }));
  };

  // Profile Dashboard - when logged in
  if (isLoggedIn && userProfile) {
    const symptomsList = getSymptomsList();

    return (
      <div className="profile-page">
        <nav className="navbar">
          <div className="nav-content">
            <div className="logo">
              <div className="logo-icon">💜</div>
              <span className="logo-text">menoMade</span>
            </div>
            <div className="nav-right">
              <button className="nav-link-btn" onClick={onBackToHome}>Home</button>
              <button className="nav-link-btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </nav>

        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-avatar">
              <span className="avatar-icon">👤</span>
            </div>
            <div className="profile-info">
              <h1>Welcome back!</h1>
              <p className="profile-email">{userProfile.email}</p>
            </div>
          </div>

          <div className="profile-tabs">
            <button 
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              My Profile
            </button>
            <button 
              className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders ({userOrders.length})
            </button>
          </div>

          {activeTab === 'profile' && (
            <div className="profile-content">
              {/* Symptom Profile Card */}
              <div className="profile-card">
                <div className="card-header-profile">
                  <div>
                    <h2>Your Symptom Profile</h2>
                    <p className="last-updated">
                      Last updated: {formatDate(userProfile.completedAt)}
                    </p>
                  </div>
                  <button className="retake-btn" onClick={handleRetakeQuiz}>
                    🔄 Retake Quiz
                  </button>

                  
                </div>

                <div className="profile-details">
                  <div className="detail-row">
                    <span className="detail-label">Stage:</span>
                    <span className="detail-value">{userProfile.stage || 'Not specified'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Age Range:</span>
                    <span className="detail-value">{userProfile.ageRange || 'Not specified'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Takes Supplements:</span>
                    <span className="detail-value">{userProfile.takesSupplements || 'Not specified'}</span>
                  </div>
                </div>

                <div className="symptoms-section">
                  <h3>Active Symptoms</h3>
                  {symptomsList.length > 0 ? (
                    <div className="symptoms-grid">
                      {symptomsList.map(({ symptom, severity }) => (
                        <div key={symptom} className="symptom-badge">
                          <span className="symptom-name">{symptom}</span>
                          <span className={`severity-tag ${severity.toLowerCase()}`}>
                            {severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-symptoms">No symptoms recorded</p>
                  )}
                </div>
              </div>

              {/* Notes Card */}
                <div className="profile-card">
                <div className="card-header-profile">
                    <div>
                    <h2>My Journey Notes</h2>
                    <p className="notes-description">
                        Track what works and what doesn't. Our team uses this to personalize your future boxes.
                    </p>
                    </div>
                </div>

                <textarea
                    className="notes-textarea"
                    placeholder="Example: 'The magnesium supplement really helped with sleep. Hot flashes are worse in the evening. Would love more cooling products...'"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={8}
                />

                {saveSuccess && (
                    <div className="success-message-inline">
                    ✓ Note saved successfully!
                    </div>
                )}

                <button 
                    className="save-notes-btn"
                    onClick={handleSaveNotes}
                    disabled={isSaving}
                >
                    {isSaving ? 'Saving...' : '💾 Save Notes'}
                </button>

                {userProfile.notesUpdatedAt && (
                    <p className="notes-last-saved">
                    Last saved: {formatDate(userProfile.notesUpdatedAt)}
                    </p>
                )}
                </div>
            </div>
            
          )}

          {activeTab === 'orders' && (
            <div className="profile-content">
              <div className="profile-card">
                <h2>Order History</h2>
                
                {userOrders.length > 0 ? (
                  <div className="orders-list">
                    {userOrders.map((order) => (
                      <div key={order.id} className="order-item">
                        <div className="order-header">
                          <div>
                            <h3>Order #{order.id.slice(-8).toUpperCase()}</h3>
                            <p className="order-date">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className="order-status">
                            <span className={`status-badge ${order.status || 'pending'}`}>
                              {order.status || 'Pending'}
                            </span>
                          </div>
                        </div>

                        <div className="order-details">
                          <div className="order-detail">
                            <span className="order-label">Box Type:</span>
                            <span className="order-value">{order.boxType || 'N/A'}</span>
                          </div>
                          <div className="order-detail">
                            <span className="order-label">Amount:</span>
                            <span className="order-value">${order.amount || '0.00'}</span>
                          </div>
                          {order.trackingNumber && (
                            <div className="order-detail">
                              <span className="order-label">Tracking:</span>
                              <span className="order-value tracking">{order.trackingNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-orders">
                    <span className="no-orders-icon">📦</span>
                    <h3>No orders yet</h3>
                    <p>Start your menopause support journey today!</p>
                    <button className="shop-btn" onClick={onBackToHome}>
                      Shop Boxes
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {showRetakeModal && (
          <div className="modal-overlay" onClick={cancelRetakeQuiz}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Retake Symptom Quiz?</h3>
              <p className="modal-text">
                You'll continue with your account <strong>{userProfile.email}</strong>
              </p>
              <p className="modal-subtext">
                Your current symptom profile will be updated with your new responses. 
                This helps us personalize your future boxes based on your changing needs.
              </p>
              
              <div className="modal-actions">
                <button className="modal-btn cancel" onClick={cancelRetakeQuiz}>
                  No, Keep Current Profile
                </button>
                <button className="modal-btn confirm" onClick={confirmRetakeQuiz}>
                  Yes, Update My Symptoms
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Login Page - default view when not logged in
  return (
    <div className="profile-page">
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">
            <div className="logo-icon">💜</div>
            <span className="logo-text">menoMade</span>
          </div>
          <div className="nav-right">
            <button className="nav-link-btn" onClick={onBackToHome}>Back to Home</button>
          </div>
        </div>
      </nav>

      <div className="login-container">
        <div className="login-card">
          <h2>Login to Your Profile</h2>
          <p className="login-subtitle">Access your symptom profile and order history</p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="your@email.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <div className="login-footer">
            <p>Don't have an account?</p>
            <button className="link-btn" onClick={onStartQuiz}>
              Take the Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;