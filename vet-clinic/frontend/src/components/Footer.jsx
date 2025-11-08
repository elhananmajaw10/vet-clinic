import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Company Info Section */}
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🏥</span>
              <div className="logo-text">
                <h3>VetCare+</h3>
                <p>Professional Veterinary Care</p>
              </div>
            </div>
            <p className="footer-description">
              Providing exceptional veterinary care for your beloved pets with compassion and expertise.
            </p>
          </div>

          {/* Services Section */}
          <div className="footer-section">
            <h4>Services</h4>
            <ul className="footer-links">
              <li><Link to="/services">General Checkup</Link></li>
              <li><Link to="/services">Vaccinations</Link></li>
              <li><Link to="/services">Dental Care</Link></li>
              <li><Link to="/services">Emergency Care</Link></li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="footer-section">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#resources">Resources</a></li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <p>📞 +91 9436180927</p>
              <p>✉️ hello@vetcareplus.com</p>
              <p>📍 Garikhana, Shillong</p>
              <p>Meghalaya, 793002</p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; 2025 VetCare+. All rights reserved.</p>
          </div>
          <div className="footer-legal">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;