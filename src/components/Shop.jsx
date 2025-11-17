import React, { useState, useEffect } from 'react';

const Shop = ({ onBackToHome, onStartQuiz, onGoToProfile }) => {
  const [selectedBox, setSelectedBox] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = sessionStorage.getItem('userEmail');
    if (storedUser) {
      loadUserProfile(storedUser);
    }

    // Check URL for specific box
    const urlParams = new URLSearchParams(window.location.search);
    const boxId = urlParams.get('box');
    if (boxId) {
      const box = [...curatedBoxes, personalizedBox].find(b => b.id === boxId);
      if (box) {
        setSelectedBox(box);
      }
    }
  }, []);

  const loadUserProfile = async (email) => {
    try {
      const { db } = await import('../firebase');
      const { doc, getDoc } = await import('firebase/firestore');
      
      const docId = email.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, '_');
      const profileDoc = await getDoc(doc(db, 'user-profiles', docId));
      
      if (profileDoc.exists()) {
        setUserProfile(profileDoc.data());
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  const curatedBoxes = [
    {
      id: 'calm',
      name: 'Calm Box',
      tagline: 'Find Your Inner Peace',
      price: 49,
      description: 'Carefully curated to help manage anxiety, mood swings, and stress during menopause.',
      benefits: [
        'Magnesium for relaxation',
        'Ashwagandha supplements',
        'Calming herbal tea blend',
        'Stress-relief aromatherapy',
        'Guided meditation cards'
      ],
      color: '#A855F7'
    },
    {
      id: 'hotflash',
      name: 'Hot Flash Relief Box',
      tagline: 'Stay Cool & Comfortable',
      price: 49,
      description: 'Essential tools and supplements designed to reduce hot flashes and night sweats.',
      benefits: [
        'Cooling neck wrap',
        'Black cohosh supplements',
        'Moisture-wicking pillowcase',
        'Portable mini fan',
        'Temperature-regulating mist'
      ],
      color: '#EC4899'
    },
    {
      id: 'sleep',
      name: 'Sleep Support Box',
      tagline: 'Rest Easy Tonight',
      price: 49,
      description: 'Everything you need for deeper, more restful sleep through menopause.',
      benefits: [
        'Melatonin & magnesium blend',
        'Silk sleep mask',
        'Lavender pillow spray',
        'Sleep hygiene guide',
        'Calming bedtime tea'
      ],
      color: '#8B5CF6'
    },
    {
      id: 'gut',
      name: 'Gut Health Box',
      tagline: 'Nurture Your Microbiome',
      price: 49,
      description: 'Support digestive health and reduce bloating with targeted supplements and tools.',
      benefits: [
        'Probiotic supplement',
        'Digestive enzyme complex',
        'Fiber-rich snacks',
        'Gut health recipe cards',
        'Herbal digestive tea'
      ],
      color: '#10B981'
    }
  ];

  const personalizedBox = {
    id: 'personalized',
    name: 'Personalized Box',
    tagline: 'Created Just For You',
    price: 59,
    description: 'A completely customized quarterly box based on your unique symptom profile and needs.',
    benefits: [
      'Symptom-specific supplements',
      'Adaptive relief tools',
      'Personalized education materials',
      'Evolves with your changing needs',
      'Expert-curated for your profile'
    ],
    isPersonalized: true
  };

  const handleBoxClick = (box) => {
    setSelectedBox(box);
    // Update URL
    window.history.pushState({}, '', `?box=${box.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseDetail = () => {
    setSelectedBox(null);
    // Clear URL parameter
    window.history.pushState({}, '', window.location.pathname);
  };

  const handleCheckout = (boxId) => {
    window.location.href = 'https://buy.stripe.com/6oU6oH6B23t1bCib3k2Ry02';
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

  if (selectedBox) {
    const isPersonalizedBox = selectedBox.isPersonalized;
    const hasProfile = userProfile && userProfile.isComplete;

    return (
      <div className="shop-page">
        {/* Nav */}
        <nav className="navbar">
          <div className="nav-content">
            <div className="logo">
              <div className="logo-icon">💜</div>
              <span className="logo-text">menoMade</span>
            </div>
            <div className="nav-right">
              <button className="nav-link-btn" onClick={onBackToHome}>Home</button>
              <button className="profile-icon-btn" onClick={onGoToProfile} title="My Profile">
                <span className="profile-icon">👤</span>
              </button>
              <button className="nav-quiz-btn" onClick={onStartQuiz}>Take Quiz</button>
            </div>
          </div>
        </nav>

        {/* Back Button */}
        <div className="product-back-section">
          <div className="product-back-container">
            <button className="back-to-shop-btn" onClick={handleCloseDetail}>
              ← Back to All Boxes
            </button>
          </div>
        </div>

        {/* Box Detail */}
        <div className="box-detail-page">
          <div className="box-detail-container">
            <div className="box-detail-grid">
              {/* Images Section */}
              <div className="box-images">
                <div className="main-image" style={{ background: `linear-gradient(135deg, ${selectedBox.color || '#EC4899'}15 0%, ${selectedBox.color || '#EC4899'}05 100%)` }}>
                  <div className="image-placeholder">
                    <span className="placeholder-emoji">📦</span>
                    <p>Product Image</p>
                  </div>
                </div>
                
                <div className="thumbnail-grid">
                  <div className="thumbnail" style={{ background: `linear-gradient(135deg, ${selectedBox.color || '#EC4899'}12 0%, ${selectedBox.color || '#EC4899'}04 100%)` }}>
                    <span>🎁</span>
                  </div>
                  <div className="thumbnail" style={{ background: `linear-gradient(135deg, ${selectedBox.color || '#EC4899'}12 0%, ${selectedBox.color || '#EC4899'}04 100%)` }}>
                    <span>💊</span>
                  </div>
                  <div className="thumbnail" style={{ background: `linear-gradient(135deg, ${selectedBox.color || '#EC4899'}12 0%, ${selectedBox.color || '#EC4899'}04 100%)` }}>
                    <span>✨</span>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="box-info">
                <div className="product-badge" style={{ borderColor: selectedBox.color, color: selectedBox.color }}>
                  {selectedBox.isPersonalized ? 'Customized' : 'Curated'}
                </div>
                
                <h1 className="product-title">{selectedBox.name}</h1>
                <p className="product-tagline">{selectedBox.tagline}</p>
                
                <div className="product-price-section">
                  <div className="product-price">
                    <span className="price-amount">${selectedBox.price}</span>
                    <span className="price-frequency">/quarterly</span>
                  </div>
                  
                  <button 
                    className="buy-now-btn-top"
                    onClick={() => handleCheckout(selectedBox.id)}
                    style={{ background: `linear-gradient(135deg, ${selectedBox.color || '#EC4899'} 0%, ${selectedBox.color || '#A855F7'} 100%)` }}
                  >
                    Buy Now
                  </button>
                </div>

                <p className="product-description">{selectedBox.description}</p>

                {isPersonalizedBox && (
                  <div className="personalized-info-card">
                    <h3>🎯 How Personalization Works</h3>
                    
                    {hasProfile ? (
                      <div className="has-profile-info">
                        <div className="profile-status">
                          <span className="status-icon">✓</span>
                          <div>
                            <p className="status-title">Your Profile is Ready</p>
                            <p className="status-date">Last updated: {formatDate(userProfile.completedAt)}</p>
                          </div>
                        </div>

                        <p className="personalized-explanation">
                          We'll use your symptom profile from your quiz to curate your personalized box with supplements and tools specifically for your needs.
                        </p>

                        <div className="profile-actions">
                          <button className="view-profile-btn" onClick={onGoToProfile}>
                            View My Profile
                          </button>
                          <button className="retake-quiz-btn" onClick={onStartQuiz}>
                            Update Symptoms
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="no-profile-info">
                        <p className="personalized-explanation">
                          Complete our 5-minute symptom quiz to create your personalized profile. We'll use your responses to curate a box specifically for your unique menopause journey.
                        </p>

                        <button className="take-quiz-cta" onClick={onStartQuiz}>
                          Take the Quiz First →
                        </button>

                        <div className="quiz-benefits">
                          <div className="quiz-benefit-item">
                            <span>✓</span>
                            <p>Takes only 5 minutes</p>
                          </div>
                          <div className="quiz-benefit-item">
                            <span>✓</span>
                            <p>Save and update anytime</p>
                          </div>
                          <div className="quiz-benefit-item">
                            <span>✓</span>
                            <p>No commitment required</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="whats-included">
                  <h3>What's Included</h3>
                  <ul className="benefits-list">
                    {selectedBox.benefits.map((benefit, index) => (
                      <li key={index}>
                        <span className="check-icon">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="product-guarantees">
                  <div className="guarantee-item">
                    <span>🚚</span>
                    <p>Free shipping</p>
                  </div>
                  <div className="guarantee-item">
                    <span>🔄</span>
                    <p>Cancel anytime</p>
                  </div>
                  <div className="guarantee-item">
                    <span>💝</span>
                    <p>Satisfaction guaranteed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-page">
      {/* Nav */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">
            <div className="logo-icon">💜</div>
            <span className="logo-text">menoMade</span>
          </div>
          <div className="nav-right">
            <button className="nav-link-btn" onClick={onBackToHome}>Home</button>
            <button className="profile-icon-btn" onClick={onGoToProfile} title="My Profile">
              <span className="profile-icon">👤</span>
            </button>
            <button className="nav-quiz-btn" onClick={onStartQuiz}>Take Quiz</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="shop-hero-new">
        <div className="shop-hero-content-new">
          <h1>Choose Your Support</h1>
          <p>Curated boxes for targeted relief or personalized care tailored to you</p>
        </div>
      </section>

      {/* Personalized Box - Featured */}
      <section className="featured-box-section-new">
        <div className="featured-container">
          <div className="featured-badge-new">⭐ Most Popular</div>
          <div className="featured-box-new" onClick={() => handleBoxClick(personalizedBox)}>
            <div className="featured-grid">
              <div className="featured-image-new">
                <div className="featured-img-placeholder">
                  <span className="featured-emoji-new">🎯</span>
                </div>
              </div>
              
              <div className="featured-content-new">
                <h2>{personalizedBox.name}</h2>
                <p className="featured-tag">{personalizedBox.tagline}</p>
                <p className="featured-desc">{personalizedBox.description}</p>
                
                <div className="featured-price-new">
                  <span className="price-lg">${personalizedBox.price}</span>
                  <span className="price-freq">/quarterly</span>
                </div>
                
                <button className="featured-cta-new">
                  Learn More →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Boxes Grid */}
      <section className="curated-section-new">
        <div className="curated-container">
          <div className="section-header-new">
            <h2>Curated Relief Boxes</h2>
            <p>Targeted solutions for specific symptoms</p>
          </div>

          <div className="products-grid">
            {curatedBoxes.map((box) => (
              <div 
                key={box.id} 
                className="product-card-new"
                onClick={() => handleBoxClick(box)}
              >
                <div className="product-image-new" style={{ background: `linear-gradient(135deg, ${box.color}15 0%, ${box.color}05 100%)` }}>
                  <div className="product-img-placeholder">
                    <span className="product-emoji">📦</span>
                  </div>
                </div>

                <div className="product-content-new">
                  <h3>{box.name}</h3>
                  <p className="product-tag">{box.tagline}</p>
                  
                  <div className="product-price-new">
                    <span className="price-med">${box.price}</span>
                    <span className="price-period">/quarterly</span>
                  </div>

                  <button 
                    className="product-btn-new"
                    style={{ borderColor: box.color, color: box.color }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section-new">
        <div className="trust-container">
          <div className="trust-item">
            <div className="trust-icon">🚚</div>
            <h4>Free Shipping</h4>
            <p>On all quarterly subscriptions</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon">🔄</div>
            <h4>Flexible Subscriptions</h4>
            <p>Cancel or pause anytime</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon">🔬</div>
            <h4>Science-Backed</h4>
            <p>All products vetted by experts</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon">💝</div>
            <h4>Satisfaction Guaranteed</h4>
            <p>Love it or your money back</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon">💜</div>
              <span className="logo-text">menoMade</span>
            </div>
            <p className="footer-tagline">
              Personalized menopause support boxes tailored to your unique symptoms and changing needs.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Quick Links</h4>
              <a href="#home" onClick={onBackToHome}>Home</a>
              <a href="#shop">Shop</a>
              <a href="#quiz" onClick={onStartQuiz}>Take Quiz</a>
            </div>

            <div className="footer-column">
              <h4>Contact</h4>
              <a href="mailto:hello@menomade.com">hello@menomade.com</a>
              <p>Support available 7 days/week</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-disclaimer">
            Disclaimer: This service is not intended to diagnose, treat, cure, or prevent any disease.
          </p>
          <p className="footer-copyright">© 2025 menoMade. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Shop;