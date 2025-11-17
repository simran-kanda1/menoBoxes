// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="footer-inner">
        <div>
          <h4>About</h4>
          <p>
            Menocare is exploring a new way to support women through peri-,
            meno-, and postmenopause with personalized quarterly care boxes.
          </p>
        </div>
        <div id="science">
          <h4>Science Behind the Box</h4>
          <p>
            We’re building boxes informed by evidence-based supplements,
            lifestyle tools, and education. This is not medical advice or a
            diagnostic tool.
          </p>
        </div>
        <div>
          <h4>Contact</h4>
          <p>Have feedback or want early access?</p>
          <a href="mailto:hello@menocare.app">hello@menocare.app</a>
        </div>
      </div>
      <p className="footer-disclaimer">
        Disclaimer: This experience is for information and wellness exploration
        only and is not a substitute for professional medical advice,
        diagnosis, or treatment.
      </p>
    </footer>
  );
};

export default Footer;
