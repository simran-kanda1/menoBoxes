// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          meno<span>care</span>
        </Link>
        <nav className="nav-links">
          <a href="#why">Why this exists</a>
          <a href="#inside">What’s inside</a>
          <a href="#science">Science</a>
          <Link to="/quiz" className="nav-cta">
            Take the Quiz
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
