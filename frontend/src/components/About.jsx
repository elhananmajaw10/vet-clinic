import React, { useState, useEffect } from 'react';
import axios from 'axios';

const About = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get('/content/about');
      setContent(response.data);
    } catch (error) {
      // Fallback to static content if dynamic content is not available
      setContent({
        title: "About VetCare+",
        subtitle: "Your trusted partner in pet healthcare",
        sections: [
          {
            title: "Our Journey Together",
            content: "It all started with a simple dream: to create a place where pets could receive the kind of care that makes both them and their humans feel completely at ease. What began as a small practice has grown into a community hub, but our heart remains the same - we're still that friendly local clinic where we know your pet by name, not just by chart.",
            type: "text"
          },
          {
            title: "The People Who Care For Your Family", 
            content: "Meet the faces behind the smiles! Our team isn't just highly trained - they're genuinely passionate about animals. From our veterinarians who stay updated on the latest treatments to our receptionists who always have treats ready, every team member is here because they truly love what they do. We're the kind of people who remember your pet's birthday and celebrate their recovery milestones right alongside you.",
            type: "text"
          },
          {
            title: "Where Comfort Meets Care",
            content: "Step into our clinic and you'll notice it feels different. We've designed our space to be warm and welcoming, not clinical and cold. From the calming colors on our walls to the separate waiting areas for cats and dogs, every detail is thoughtfully planned to reduce stress for both pets and their people.",
            type: "text"
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <h1>{content?.title || "About VetCare+"}</h1>
          <p>{content?.subtitle || "Your trusted partner in pet healthcare"}</p>
        </div>
        
        <div className="about-content">
          <div className="about-text">
            {content?.sections?.map((section, index) => (
              <div key={index}>
                <h2>{section.title}</h2>
                <p>{section.content}</p>
              </div>
            ))}
          </div>
          
          <div className="about-stats">
            <div className="stat-card">
              <h3>15+</h3>
              <p>Years Experience</p>
            </div>
            <div className="stat-card">
              <h3>5,000+</h3>
              <p>Happy Pets</p>
            </div>
            <div className="stat-card">
              <h3>24/7</h3>
              <p>Emergency Care</p>
            </div>
            <div className="stat-card">
              <h3>98%</h3>
              <p>Client Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;