import React from 'react';
import './Logo.css';

const Logo = () => {
  return (
    <div className="logo-container">
      <div className="logo-icon">
        <div className="laptop">
          <div className="laptop-screen">
            <div className="play-button"></div>
          </div>
          <div className="laptop-base"></div>
        </div>
        <div className="graduation-cap">
          <div className="cap-top"></div>
          <div className="cap-tassel"></div>
        </div>
        <div className="icon-book"></div>
        <div className="icon-lightbulb"></div>
        <div className="icon-checklist"></div>
        <div className="connection-line"></div>
      </div>
      <div className="logo-text">
        <span className="logo-text-main">Online Course</span>
        <span className="logo-text-sub">MANAGEMENT</span>
      </div>
    </div>
  );
};

export default Logo;

