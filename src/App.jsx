import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Quiz from './components/Quiz';
import Shop from './components/Shop';
import Profile from './components/Profile';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './styles/App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStartQuiz = () => {
    setCurrentPage('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToShop = () => {
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToProfile = () => {
    setCurrentPage('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="app">
      {currentPage === 'home' && (
        <LandingPage 
          onStartQuiz={handleStartQuiz} 
          onGoToShop={handleGoToShop}
          onGoToProfile={handleGoToProfile}
          currentUser={currentUser}
        />
      )}
      {currentPage === 'quiz' && (
        <Quiz 
          currentUser={currentUser}
          onGoToProfile={handleGoToProfile}
          onGoToShop={handleGoToShop}
        />
      )}
      {currentPage === 'shop' && (
        <Shop 
          onBackToHome={handleBackToHome}
          onStartQuiz={handleStartQuiz}
          onGoToProfile={handleGoToProfile}
          currentUser={currentUser}
        />
      )}
      {currentPage === 'profile' && (
        <Profile 
          onBackToHome={handleBackToHome}
          onStartQuiz={handleStartQuiz}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

export default App;