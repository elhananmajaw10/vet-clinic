import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <h1>Contact Us</h1>
          <p>Get in touch with our veterinary team</p>
        </div>
        
        <div className="contact-content">
          <div className="contact-info">
            <h2>Visit Our Clinic</h2>
            <div className="contact-details">
              <div className="contact-item">
                <strong>📍 Address</strong>
                <p>Garikhana, Shillong<br />Meghalaya, 793002</p>
              </div>
              <div className="contact-item">
                <strong>📞 Phone</strong>
                <p>+91 9436180927</p>
              </div>
              <div className="contact-item">
                <strong>✉️ Email</strong>
                <p>hello@vetcareplus.com</p>
              </div>
              <div className="contact-item">
                <strong>🕒 Hours</strong>
                <p>Mon-Fri: 8:00 AM - 8:00 PM<br />Sat-Sun: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
          
          <div className="contact-form">
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  className="form-control"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;