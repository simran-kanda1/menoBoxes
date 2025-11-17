import React from 'react';

const LandingPage = ({ onStartQuiz, onGoToShop, onGoToProfile }) => {
  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">
            <div className="logo-icon">💜</div>
            <span className="logo-text">menoMade</span>
          </div>
          <div className="nav-right">
            <a href="#home" className="nav-link">Home</a>
            <button className="nav-link-btn" onClick={onGoToShop}>Shop</button>
            <button className="profile-icon-btn" onClick={onGoToProfile} title="My Profile">
              <span className="profile-icon">👤</span>
            </button>
            <button className="nav-quiz-btn" onClick={onStartQuiz}>Take Quiz</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">✨</span>
              <span>Personalized Menopause Care</span>
            </div>
            
            <h1 className="hero-title">
              Your Menopause Symptoms <br />
              <span className="gradient-text">Change. Your Care Should Too.</span>
            </h1>
            
            <p className="hero-subtitle">
              A science-backed, customizable wellness box created around your real symptoms — from perimenopause to postmenopause.
            </p>
            
            <button className="hero-cta" onClick={onStartQuiz}>
              Take the 2-Minute Symptom Quiz
              <span className="arrow">→</span>
            </button>
            
            <p className="hero-trust">
              ✨ Free • No commitment • 100% personalized
            </p>
          </div>

          <div className="hero-image">
            <div className="box-mockup">
              <div className="box-placeholder">
                {/* Image placeholder for subscription box */}
                <div className="placeholder-content">
                  <span className="placeholder-icon">📦</span>
                  <p>Your Personalized Box</p>
                </div>
              </div>
            </div>
            
            {/* Floating icons */}
            <div className="floating-icon icon-1">
              <span>💊</span>
              <p>Supplements</p>
            </div>
            <div className="floating-icon icon-2">
              <span>💉</span>
              <p>Relief Tools</p>
            </div>
            <div className="floating-icon icon-3">
              <span>📚</span>
              <p>Education</p>
            </div>
            <div className="floating-icon icon-4">
              <span>💝</span>
              <p>Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="why-section">
        <div className="section-container">
          <div className="section-icon">💜</div>
          <h2 className="section-title">Why We're Creating This</h2>
          
          <div className="why-content">
            <p className="why-text">
              Menopause doesn't look the same for everyone — and your symptoms don't stay the same either. 
              We're creating a <span className="highlight">personalized quarterly support box</span> designed 
              around your changing needs: sleep, mood, hot flashes, joint health, libido, energy, and more.
            </p>
            <p className="why-cta">
              <span className="purple-text">Tell us what you're experiencing,</span> and we'll tailor your first box.
            </p>
          </div>

          <div className="features-row">
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <h4>Personalized</h4>
              <p>Every box is customized based on your unique symptom profile</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔄</div>
              <h4>Adaptive</h4>
              <p>Update your symptoms anytime, and your next box adjusts automatically</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🧬</div>
              <h4>Science-Backed</h4>
              <p>Evidence-based supplements and tools recommended by experts</p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="inside-section">
        <div className="section-container">
          <h2 className="section-title">What's Inside Your Box</h2>
          <p className="section-subtitle">Each quarterly box is carefully curated around your evolving needs</p>

          <div className="inside-grid">
            <div className="inside-card">
              <div className="card-icon pink">💊</div>
              <h3>Targeted Supplements</h3>
              <p>Evidence-backed vitamins, minerals, and herbs matched to your symptoms.</p>
            </div>

            <div className="inside-card">
              <div className="card-icon purple">🌡️</div>
              <h3>Relief Tools</h3>
              <p>Items like cooling wraps, sleep masks, scalp tools, and more.</p>
            </div>

            <div className="inside-card">
              <div className="card-icon pink">📖</div>
              <h3>Education & Guidance</h3>
              <p>Easy-to-follow cards explaining why symptoms happen and what helps.</p>
            </div>

            <div className="inside-card">
              <div className="card-icon purple">🔄</div>
              <h3>Personalization Every Quarter</h3>
              <p>You update your symptoms, we adjust your box.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Science & Research Section */}
      <section className="science-section">
        <div className="section-container">
          <div className="science-content">
            <div className="science-text">
              <div className="section-label">Science-Backed</div>
              <h2 className="section-title">Researched. Vetted. Trusted.</h2>
              <p className="science-intro">
                Every product in our boxes is carefully researched and vetted by healthcare professionals 
                to ensure it's backed by clinical evidence and proven to help the majority of women 
                experiencing menopause symptoms.
              </p>

              <div className="science-stats">
                <div className="science-stat">
                  <div className="stat-icon">🔬</div>
                  <div className="stat-content">
                    <h4>Clinical Evidence</h4>
                    <p>All supplements backed by peer-reviewed research</p>
                  </div>
                </div>

                <div className="science-stat">
                  <div className="stat-icon">✓</div>
                  <div className="stat-content">
                    <h4>Expert Vetted</h4>
                    <p>Reviewed by menopause specialists and nutritionists</p>
                  </div>
                </div>

                <div className="science-stat">
                  <div className="stat-icon">🎯</div>
                  <div className="stat-content">
                    <h4>Proven Results</h4>
                    <p>Products shown to help 70%+ of women in studies</p>
                  </div>
                </div>
              </div>

              <div className="research-process">
                <h3>Our Vetting Process</h3>
                <div className="process-steps">
                  <div className="process-step-item">
                    <span className="step-num">1</span>
                    <p>Review clinical studies and research</p>
                  </div>
                  <div className="process-step-item">
                    <span className="step-num">2</span>
                    <p>Consult with menopause specialists</p>
                  </div>
                  <div className="process-step-item">
                    <span className="step-num">3</span>
                    <p>Test for quality and efficacy</p>
                  </div>
                  <div className="process-step-item">
                    <span className="step-num">4</span>
                    <p>Monitor real-world results</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="science-visual">
              <div className="science-card card-1">
                <div className="card-header">
                  <span className="card-emoji">📊</span>
                  <span className="card-badge">Published Study</span>
                </div>
                <h4>Black Cohosh for Hot Flashes</h4>
                <p className="study-result">73% reduction in frequency</p>
                <p className="study-source">Journal of Women's Health, 2023</p>
              </div>

              <div className="science-card card-2">
                <div className="card-header">
                  <span className="card-emoji">🔬</span>
                  <span className="card-badge">Clinical Trial</span>
                </div>
                <h4>Magnesium for Sleep Quality</h4>
                <p className="study-result">82% improved sleep scores</p>
                <p className="study-source">Sleep Medicine Reviews, 2024</p>
              </div>

              <div className="science-card card-3">
                <div className="card-header">
                  <span className="card-emoji">✓</span>
                  <span className="card-badge">Meta-Analysis</span>
                </div>
                <h4>Omega-3 for Mood Support</h4>
                <p className="study-result">68% reduction in mood swings</p>
                <p className="study-source">Menopause Journal, 2023</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Info */}
      <section className="delivery-section">
        <div className="delivery-card">
          <span className="delivery-icon">📦</span>
          <h3>Quarterly Delivery</h3>
          <p>New box every 3 months, perfectly timed with your changing journey</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-container">
          <h2 className="section-title">You're Not Alone</h2>
          <p className="section-subtitle">These are real sentiments from women navigating menopause</p>

          <div className="testimonials-grid">
            <div className="testimonial-card pink-bg">
              <div className="quote-mark">❝</div>
              <p className="testimonial-text">
                "I wish something like this existed. Every time my symptoms change, I have to research everything from scratch."
              </p>
            </div>

            <div className="testimonial-card purple-bg">
              <div className="quote-mark">❝</div>
              <p className="testimonial-text">
                "It's impossible to find menopause care that feels personalized. Everything is so generic."
              </p>
            </div>

            <div className="testimonial-card pink-bg">
              <div className="quote-mark">❝</div>
              <p className="testimonial-text">
                "I'd love a box that changes as my symptoms change. My hot flashes are better but now I can't sleep."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section className="waitlist-section">
        <div className="waitlist-card">
          <p className="waitlist-badge">
            💜 Join <span className="highlight-text">hundreds of women</span> helping us build the menopause support we all deserve
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta-section">
        <div className="final-cta-content">
          <button className="early-access-btn">✨ Get Early Access</button>
          
          <h2 className="final-cta-title">
            Ready to Experience<br />
            Personalized Menopause Care?
          </h2>
          
          <p className="final-cta-subtitle">
            Take our 2-minute quiz and discover what your personalized box could look like
          </p>
          
          <button className="final-cta-btn" onClick={onStartQuiz}>
            Take the Quiz Now
            <span className="arrow">→</span>
          </button>
          
          <p className="final-cta-trust">
            ✨ 100% free • No credit card required • Takes less than 2 minutes
          </p>
        </div>

        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-number">2min</div>
            <div className="stat-label">Quick Quiz</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Personalized</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">Quarterly</div>
            <div className="stat-label">Delivery</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">Expert</div>
            <div className="stat-label">Curated</div>
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
              Because your journey deserves care that evolves with you.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Quick Links</h4>
              <a href="#home">Home</a>
              <a href="#quiz">Take Quiz</a>
              <a href="#about">About</a>
              <a href="#science">Science</a>
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
            Please consult with your healthcare provider before starting any new supplements.
          </p>
          <p className="footer-copyright">© 2025 menoMade. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;