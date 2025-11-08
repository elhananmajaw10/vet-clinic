import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const specializations = ['all', 'general', 'surgery', 'dental', 'dermatology', 'emergency', 'internal_medicine'];

  const filteredDoctors = selectedSpecialization === 'all' 
    ? doctors 
    : doctors.filter(doctor => doctor.specialization === selectedSpecialization);

  const getSpecializationLabel = (spec) => {
    const labels = {
      general: 'General Practice',
      surgery: 'Surgery',
      dental: 'Dental Care',
      dermatology: 'Dermatology',
      emergency: 'Emergency Care',
      internal_medicine: 'Internal Medicine'
    };
    return labels[spec] || spec;
  };

  if (loading) {
    return <div className="loading">Loading doctors...</div>;
  }

  return (
    <div className="page-container">
      <div className="container">
        <div className="card">
          <h1>Our Veterinary Doctors</h1>
          <p className="subtitle">Meet our team of experienced veterinary professionals</p>

          {/* Specialization Filter */}
          <div className="filter-section">
            <label>Filter by Specialization:</label>
            <select 
              value={selectedSpecialization} 
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="form-control"
              style={{ width: '200px', marginLeft: '10px' }}
            >
              {specializations.map(spec => (
                <option key={spec} value={spec}>
                  {spec === 'all' ? 'All Specializations' : getSpecializationLabel(spec)}
                </option>
              ))}
            </select>
          </div>

          {/* Doctors Grid */}
          <div className="doctors-grid">
            {filteredDoctors.map(doctor => (
              <div key={doctor._id} className="doctor-card">
                <div className="doctor-image">
                  {doctor.image ? (
                    <img src={doctor.image} alt={doctor.name} />
                  ) : (
                    <div className="doctor-placeholder">👨‍⚕️</div>
                  )}
                </div>
                <div className="doctor-info">
                  <h3>{doctor.name}</h3>
                  <span className={`specialization-badge ${doctor.specialization}`}>
                    {getSpecializationLabel(doctor.specialization)}
                  </span>
                  <p className="doctor-experience">{doctor.experience}+ years experience</p>
                  <p className="doctor-description">{doctor.description}</p>
                  <p className="doctor-education">
                    <strong>Education:</strong> {doctor.education}
                  </p>
                  <div className={`availability ${doctor.available ? 'available' : 'unavailable'}`}>
                    {doctor.available ? 'Available' : 'Not Available'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <h3>No doctors found</h3>
              <p>Try selecting a different specialization</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;