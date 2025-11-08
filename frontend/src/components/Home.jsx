import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Veterinary Care <span className="highlight">You Can Trust</span>
            </h1>
            <p className="hero-subtitle">
              Professional veterinary services for your beloved pets. 
              From routine checkups to emergency care, we're here to keep 
              your furry friends healthy and happy.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                Book Appointment
              </Link>
              <Link to="/about" className="btn btn-outline btn-large">
                Learn More
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">
              🐾 VetCare Professionals
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose VetCare+?</h2>
            <p>Comprehensive care for all your pet's needs</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3>24/7 Emergency Care</h3>
              <p>Round-the-clock emergency services for your pet's urgent needs</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍⚕️</div>
              <h3>Expert Veterinarians</h3>
              <p>Highly qualified and experienced veterinary professionals</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💊</div>
              <h3>Modern Facilities</h3>
              <p>State-of-the-art equipment and treatment facilities</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">❤️</div>
              <h3>Compassionate Care</h3>
              <p>We treat your pets with the love and care they deserve</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="services-preview">
        <div className="container">
          <div className="section-header">
            <h2>Our Services</h2>
            <p>Comprehensive veterinary services for all pets</p>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <h3>General Checkup</h3>
              <p>Comprehensive health examination and preventive care</p>
              <span className="price">$50</span>
            </div>
            <div className="service-card">
              <h3>Vaccinations</h3>
              <p>Essential vaccinations to protect your pet's health</p>
              <span className="price">$35</span>
            </div>
            <div className="service-card">
              <h3>Dental Care</h3>
              <p>Professional dental cleaning and oral health services</p>
              <span className="price">$120</span>
            </div>
            <div className="service-card">
              <h3>Surgery</h3>
              <p>Advanced surgical procedures by experienced surgeons</p>
              <span className="price">Consultation</span>
            </div>
          </div>
          <div className="text-center">
            <Link to="/services" className="btn btn-primary">
              View All Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;