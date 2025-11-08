import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      name: 'General Checkup',
      description: 'Comprehensive health examination and preventive care',
      price: '₹800',
      duration: '30 mins'
    },
    {
      name: 'Vaccinations',
      description: 'Essential vaccinations to protect your pet\'s health',
      price: '₹1000',
      duration: '20 mins'
    },
    {
      name: 'Dental Care',
      description: 'Professional dental cleaning and oral health services',
      price: '₹4000',
      duration: '60 mins'
    },
    {
      name: 'Surgery',
      description: 'Advanced surgical procedures by experienced surgeons',
      price: 'Consultation',
      duration: 'Varies'
    },
    {
      name: 'Grooming',
      description: 'Professional grooming and hygiene services',
      price: '₹500',
      duration: '45 mins'
    },
    {
      name: 'Emergency Care',
      description: '24/7 emergency veterinary services',
      price: '₹1500',
      duration: 'Emergency'
    }
  ];

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <h1>Our Services</h1>
          <p>Comprehensive veterinary care for all your pet's needs</p>
        </div>
        
        <div className="services-grid-full">
          {services.map((service, index) => (
            <div key={index} className="service-card-full">
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="service-details">
                <span className="price">{service.price}</span>
                <span className="duration">{service.duration}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="cta-section">
          <h2>Ready to Book an Appointment?</h2>
          <p>Schedule your pet's visit with our expert veterinarians</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary btn-large">
              Book Now
            </Link>
            <Link to="/contact" className="btn btn-secondary btn-large">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;