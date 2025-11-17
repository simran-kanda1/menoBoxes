import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';

const Quiz = ({ userEmail, onComplete, onGoToProfile, onGoToShop }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    email: userEmail || '',
    stage: '',
    ageRange: '',
    symptoms: {},
    takesSupplements: '',
    currentSupplements: [],
    preferredApproach: [],
    interested: '',
    password: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [existingPassword, setExistingPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = sessionStorage.getItem('userEmail');
    if (storedUser || userEmail) {
      setIsLoggedIn(true);
      setFormData(prev => ({ ...prev, email: userEmail || storedUser }));
      checkExistingUser(userEmail || storedUser);
    }
  }, [userEmail]);

  const checkExistingUser = async (email) => {
    if (!email) return;
    
    try {
      const docId = email.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, '_');
      const profileDoc = await getDoc(doc(db, 'user-profiles', docId));
      
      if (profileDoc.exists()) {
        const profileData = profileDoc.data();
        setIsExistingUser(true);
        setExistingPassword(profileData.password);
        // Pre-fill existing data
        setFormData(prev => ({
          ...prev,
          email: email,
          password: profileData.password,
          stage: profileData.stage || '',
          ageRange: profileData.ageRange || '',
          symptoms: profileData.symptoms || {},
          takesSupplements: profileData.takesSupplements || '',
          currentSupplements: profileData.currentSupplements || [],
          preferredApproach: profileData.preferredApproach || [],
          interested: profileData.interested || ''
        }));
      }
    } catch (err) {
      console.error('Error checking existing user:', err);
    }
  };

  const symptoms = [
    'Hot flashes',
    'Night sweats',
    'Sleep problems',
    'Anxiety / overwhelm',
    'Irritability',
    'Low mood / depression',
    'Brain fog',
    'Memory issues',
    'Fatigue',
    'Irregular periods',
    'Weight gain',
    'Joint pain / stiffness',
    'Low libido',
    'Vaginal dryness',
    'Hair thinning',
    'Skin dryness',
    'Headaches',
    'Bloating',
    'Mood swings'
  ];

  const supplementOptions = [
    'Magnesium',
    'Vitamin D',
    'Multivitamin',
    'Omega-3',
    'Calcium',
    'B-Complex',
    'Other'
  ];

  const approachOptions = [
    'Natural supplements',
    'Lifestyle tools',
    'Education/guides',
    'A mix of all',
    'Not sure yet'
  ];

  const steps = [
    {
      id: 'email',
      title: "Let's start with your email",
      subtitle: "We'll save your progress so you can come back anytime",
      type: 'email-first',
      skip: isLoggedIn || userEmail // Skip if already logged in
    },
    {
      id: 'stage',
      title: 'What stage are you in?',
      subtitle: 'Help us understand where you are in your journey',
      type: 'cards',
      options: [
        { value: 'Not Sure', description: 'Still figuring things out' },
        { value: 'Perimenopause', description: 'Irregular periods, symptoms starting' },
        { value: 'Menopause', description: 'No period for 12+ months' },
        { value: 'Postmenopause', description: 'Several years past last period' }
      ]
    },
    {
      id: 'ageRange',
      title: "What's your age range?",
      subtitle: 'This helps us personalize your recommendations',
      type: 'simple',
      options: ['Under 40', '40–45', '46–50', '51–55', '56+']
    },
    {
      id: 'symptoms',
      title: 'How would you rate these symptoms?',
      subtitle: 'Select the severity for symptoms you experience',
      type: 'symptom-rating'
    },
    {
      id: 'takesSupplements',
      title: 'Do you currently take any supplements?',
      type: 'simple',
      options: ['Yes', 'No', 'Sometimes']
    },
    {
      id: 'currentSupplements',
      title: 'Which supplements do you take?',
      type: 'multi-choice',
      options: supplementOptions,
      conditional: (data) => data.takesSupplements === 'Yes' || data.takesSupplements === 'Sometimes'
    },
    {
      id: 'preferredApproach',
      title: 'What is your preferred approach?',
      subtitle: 'Select all that apply',
      type: 'multi-choice',
      options: approachOptions
    },
    {
      id: 'interested',
      title: 'Are you interested in quarterly personalized support boxes?',
      type: 'simple',
      options: [
        'Yes',
        'Most likely',
        'Maybe, depending on price',
        'Just curious'
      ]
    },
    {
      id: 'password',
      title: isExistingUser ? 'Update Complete!' : 'Create your account',
      subtitle: isExistingUser ? 'Your symptom profile has been updated' : 'Set a password to access your personalized profile anytime',
      type: 'create-password',
      skip: isExistingUser // Skip password step if updating existing profile
    }
  ];

  const visibleSteps = steps.filter(step => !step.skip && (!step.conditional || step.conditional(formData)));

  const currentStepData = visibleSteps[currentStep];
  const progress = ((currentStep + 1) / visibleSteps.length) * 100;

  // Save progress to Firebase whenever user moves forward
  const saveProgress = async () => {
    if (!formData.email || !formData.email.includes('@')) return;

    setIsSavingProgress(true);
    try {
      const userEmail = formData.email.toLowerCase().trim();
      const docId = userEmail.replace(/[^a-zA-Z0-9]/g, '_');

      await setDoc(doc(db, 'quiz-progress', docId), {
        ...formData,
        lastUpdated: new Date().toISOString(),
        currentStep: currentStep,
        progress: progress
      }, { merge: true });

      setUserId(docId);
    } catch (error) {
      console.error('Error saving progress:', error);
    } finally {
      setIsSavingProgress(false);
    }
  };

  const handleSingleChoice = (value) => {
    setFormData({ ...formData, [currentStepData.id]: value });
  };

  const handleMultiChoice = (value) => {
    const currentValues = formData[currentStepData.id] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    setFormData({ ...formData, [currentStepData.id]: newValues });
  };

  const handleSymptomRating = (symptom, rating) => {
    setFormData({
      ...formData,
      symptoms: {
        ...formData.symptoms,
        [symptom]: rating
      }
    });
  };

  const handleNext = async () => {
    // Save progress after email step and every step after
    if (currentStep >= 0) {
      await saveProgress();
    }

    if (currentStep < visibleSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    // If existing user, use existing password. Otherwise, check new password
    const passwordToUse = isExistingUser ? existingPassword : formData.password;
    
    if (!isExistingUser && (!formData.password || formData.password.length < 6)) {
      alert('Please create a password (at least 6 characters)');
      return;
    }

    setIsSubmitting(true);

    try {
      const userEmail = formData.email.toLowerCase().trim();
      const docId = userEmail.replace(/[^a-zA-Z0-9]/g, '_');

      // Save completed profile with the correct password
      await setDoc(doc(db, 'user-profiles', docId), {
        ...formData,
        password: passwordToUse, // Use existing password if updating
        completedAt: new Date().toISOString(),
        timestamp: Date.now(),
        isComplete: true
      });

      // Also save to quiz-submissions collection
      await addDoc(collection(db, 'quiz-submissions'), {
        ...formData,
        password: passwordToUse,
        submittedAt: new Date().toISOString(),
        timestamp: Date.now()
      });

      setUserId(docId);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    const step = currentStepData;
    if (step.type === 'email-first') {
      return formData.email && formData.email.includes('@');
    }
    if (step.type === 'simple' || step.type === 'cards') {
      return formData[step.id] !== '';
    }
    if (step.type === 'multi-choice') {
      return formData[step.id]?.length > 0;
    }
    if (step.type === 'symptom-rating') {
      return Object.keys(formData.symptoms).length > 0;
    }
    if (step.type === 'create-password') {
      return formData.password && formData.password.length >= 6;
    }
    return true;
  };

  if (isSubmitted) {
    return (
      <div className="quiz-page">
        <nav className="quiz-nav">
          <div className="nav-content">
            <div className="logo">
              <div className="logo-icon">💜</div>
              <span className="logo-text">menoMade</span>
            </div>
          </div>
        </nav>
        
        <div className="quiz-container">
          <div className="success-card">
            <div className="success-checkmark">✓</div>
            <h2>{isExistingUser ? 'Profile Updated!' : 'Your Profile is Complete!'}</h2>
            <p>
              {isExistingUser 
                ? "Your symptom profile has been updated with your latest responses."
                : "We've created your personalized symptom profile and saved it to your account."
              }
              <br/>You can now shop for boxes or update your profile anytime.
            </p>
            <p className="success-email">
              {isLoggedIn ? 'Logged in as: ' : 'Login email: '}
              <strong>{formData.email}</strong>
            </p>

            <div className="success-actions">
              <button className="success-btn primary-gradient" onClick={onGoToShop}>
                Shop Personalized Boxes
              </button>
              <button className="success-btn secondary" onClick={onGoToProfile}>
                View My Profile
              </button>
            </div>

            <div className="next-steps">
              <h3>What's Next?</h3>
              <div className="next-step-item">
                <span>📦</span>
                <p>Browse our curated and personalized box options</p>
              </div>
              <div className="next-step-item">
                <span>✏️</span>
                <p>Update your symptom profile anytime as things change</p>
              </div>
              <div className="next-step-item">
                <span>💌</span>
                <p>Check your email for your personalized recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <nav className="quiz-nav">
        <div className="nav-content">
          <div className="logo">
            <div className="logo-icon">💜</div>
            <span className="logo-text">menoMade</span>
          </div>
          {isSavingProgress && (
            <div className="saving-indicator">
              <span className="saving-dot"></span>
              Saving...
            </div>
          )}
        </div>
      </nav>

      <div className="quiz-hero">
        <h1 className="quiz-main-title">
          {isExistingUser ? 'Update Your ' : 'Your Personalized '}
          <span className="gradient-text">Symptom Profile</span>
        </h1>
        <p className="quiz-main-subtitle">
          {isExistingUser 
            ? 'Update your symptoms — your progress is automatically saved'
            : 'Help us understand your unique journey — your progress is automatically saved'
          }
        </p>
      </div>

      <div className="quiz-container">
        {currentStep > 0 && (
          <div className="progress-section">
            <div className="progress-info">
              <span className="progress-step">Step {currentStep + 1} of {visibleSteps.length}</span>
              <span className="progress-percent">{Math.round(progress)}% Complete</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        <div className="quiz-card">
          <h2 className="quiz-question">{currentStepData.title}</h2>
          {currentStepData.subtitle && (
            <p className="quiz-subtitle">{currentStepData.subtitle}</p>
          )}

          {currentStepData.type === 'email-first' && (
            <div className="email-section">
              <input
                type="email"
                className="email-field"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <p className="email-note">
                💾 Your answers will be saved automatically so you can return anytime
              </p>
            </div>
          )}

          {currentStepData.type === 'cards' && (
            <div className="options-grid">
              {currentStepData.options.map((option) => (
                <button
                  key={option.value}
                  className={`option-card ${formData[currentStepData.id] === option.value ? 'selected' : ''}`}
                  onClick={() => handleSingleChoice(option.value)}
                >
                  <div className="option-title">{option.value}</div>
                  <div className="option-description">{option.description}</div>
                </button>
              ))}
            </div>
          )}

          {currentStepData.type === 'simple' && (
            <div className="options-list">
              {currentStepData.options.map((option) => (
                <button
                  key={option}
                  className={`option-button ${formData[currentStepData.id] === option ? 'selected' : ''}`}
                  onClick={() => handleSingleChoice(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {currentStepData.type === 'multi-choice' && (
            <div className="checkbox-list">
              {currentStepData.options.map((option) => (
                <label key={option} className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={formData[currentStepData.id]?.includes(option) || false}
                    onChange={() => handleMultiChoice(option)}
                  />
                  <span className="checkbox-label">{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentStepData.type === 'symptom-rating' && (
            <div className="symptoms-list">
              {symptoms.map((symptom) => (
                <div key={symptom} className="symptom-row">
                  <div className="symptom-name">{symptom}</div>
                  <div className="rating-buttons">
                    {['Not at all', 'Mild', 'Moderate', 'Severe'].map((rating) => (
                      <button
                        key={rating}
                        className={`rating-btn ${formData.symptoms[symptom] === rating ? 'selected' : ''}`}
                        onClick={() => handleSymptomRating(symptom, rating)}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentStepData.type === 'create-password' && !isExistingUser && (
            <div className="password-section">
              <div className="password-info">
                <p className="password-note">
                  🔒 Create a password to access your profile and update your symptoms anytime
                </p>
              </div>
              <input
                type="password"
                className="email-field"
                placeholder="Create password (min 6 characters)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <p className="password-hint">
                You'll use <strong>{formData.email}</strong> and this password to log in
              </p>
            </div>
          )}

          <div className="quiz-actions">
            <button
              className="btn-back"
              onClick={handleBack}
              disabled={currentStep === 0}
              style={{ visibility: currentStep === 0 ? 'hidden' : 'visible' }}
            >
              ← Back
            </button>

            {currentStep === visibleSteps.length - 1 ? (
              <button
                className="btn-next"
                onClick={handleSubmit}
                disabled={(!isExistingUser && !canProceed()) || isSubmitting}
              >
                {isSubmitting ? (isExistingUser ? 'Updating...' : 'Creating Account...') : (isExistingUser ? 'Update Profile →' : 'Complete Profile →')}
              </button>
            ) : (
              <button
                className="btn-next"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Continue →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;