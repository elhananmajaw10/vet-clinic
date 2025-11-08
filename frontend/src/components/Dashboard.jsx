import React, { useState, useEffect } from 'react'
import axios from 'axios'
import api from '../api';
import.meta.env.VITE_API_URL.replace('/api', '')



const Dashboard = ({ user }) => {
  const [appointments, setAppointments] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState('')
  const [doctors, setDoctors] = useState([])
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  
  const [formData, setFormData] = useState({
    petName: '',
    petType: '',
    customPetType: '',
    appointmentDate: '',
    service: '',
    doctor: '',
    notes: '',
    petPhoto: ''
  })

  useEffect(() => {
    fetchAppointments()
    fetchDoctors()
  }, [])

  const fetchAppointments = async () => {
    try {
      setFetchLoading(true)
      const token = localStorage.getItem('token')
      const response = await api.get('/appointments/my-appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      // Populate doctor information for each appointment
      const appointmentsWithDoctors = await Promise.all(
        response.data.map(async (appointment) => {
          if (appointment.doctor) {
            try {
              const doctorResponse = await api.get(`/doctors/${appointment.doctor}`)
              return {
                ...appointment,
                doctor: doctorResponse.data
              }
            } catch (error) {
              return appointment
            }
          }
          return appointment
        })
      )
      
      setAppointments(appointmentsWithDoctors)
    } catch (error) {
      console.error('Error fetching appointments:', error)
      setError('Failed to fetch appointments. Please try again.')
    } finally {
      setFetchLoading(false)
    }
  }

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors')
      setDoctors(response.data.filter(doctor => doctor.available))
    } catch (error) {
      console.error('Error fetching doctors:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setUploadingPhoto(true)
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('petPhoto', file)

      const response = await api.post('/upload/pet-photo', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      setFormData(prev => ({
        ...prev,
        petPhoto: response.data.filePath
      }))
    } catch (error) {
      setError('Failed to upload photo')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate required fields
    if (!formData.petType || !formData.service) {
      setError('Please select pet type and service')
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem('token')
      
      // Prepare the data to send
      const appointmentData = {
        ...formData,
        // If petType is "other", use the customPetType value instead
        petType: formData.petType === 'other' ? formData.customPetType : formData.petType
      }

      await api.post('/appointments', appointmentData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      // Reset form
      setFormData({
        petName: '',
        petType: '',
        customPetType: '',
        appointmentDate: '',
        service: '',
        doctor: '',
        notes: '',
        petPhoto: ''
      })
      setShowForm(false)
      fetchAppointments()
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create appointment')
    } finally {
      setLoading(false)
    }
  }

  const cancelAppointment = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const token = localStorage.getItem('token')
        await api.patch(`/appointments/${id}`, { status: 'cancelled' }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        fetchAppointments()
      } catch (error) {
        setError('Failed to cancel appointment')
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const getSpecializationLabel = (spec) => {
    const labels = {
      general: 'General Practice',
      surgery: 'Surgery',
      dental: 'Dental Care',
      dermatology: 'Dermatology',
      emergency: 'Emergency Care',
      internal_medicine: 'Internal Medicine',
      vaccination: 'Vaccination Specialist',
      grooming: 'Grooming Specialist'
    }
    return labels[spec] || spec
  }

  // Hide booking form for admin users
  if (user?.role === 'admin') {
    return (
      <div className="page-container">
        <div className="container">
          <div className="card">
            <h1>My Appointments</h1>
            <div className="alert alert-info">
              <strong>Admin View:</strong> As an administrator, you can view all appointments in the Admin Dashboard. 
              Regular users can book appointments from here.
            </div>
            {appointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <h3>No personal appointments</h3>
                <p>Admins don't book appointments. Switch to a user account to book appointments.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Pet Name</th>
                      <th>Pet Type</th>
                      <th>Doctor</th>
                      <th>Appointment Date</th>
                      <th>Service</th>
                      <th>Pet Photo</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment._id}>
                        <td>{appointment.petName}</td>
                        <td>{appointment.petType}</td>
                        <td>
                          {appointment.doctor ? (
                            <div>
                              <strong>{appointment.doctor.name}</strong>
                              <br />
                              <small>{getSpecializationLabel(appointment.doctor.specialization)}</small>
                            </div>
                          ) : (
                            'Not assigned'
                          )}
                        </td>
                        <td>{formatDate(appointment.appointmentDate)}</td>
                        <td>{appointment.service}</td>
                        <td>
                          {appointment.petPhoto && (
                            <img 
                              src={`http://localhost:5000${appointment.petPhoto}`}
                              alt={appointment.petName}
                              style={{ 
                                width: '50px', 
                                height: '50px', 
                                objectFit: 'cover', 
                                borderRadius: '4px' 
                              }}
                            />
                          )}
                        </td>
                        <td>
                          <span className={`status-badge status-${appointment.status}`}>
                            {appointment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="container">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1>My Appointments</h1>
            <button 
              onClick={() => setShowForm(!showForm)} 
              className="btn btn-primary"
            >
              {showForm ? 'Cancel' : 'Book New Appointment'}
            </button>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {showForm && (
            <div className="card" style={{ background: '#f8f9fa', marginBottom: '20px' }}>
              <h3>Book New Appointment</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Pet Name *</label>
                    <input
                      type="text"
                      name="petName"
                      className="form-control"
                      value={formData.petName}
                      onChange={handleChange}
                      placeholder="Enter your pet's name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Pet Type *</label>
                    <select
                      name="petType"
                      className="form-control"
                      value={formData.petType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select your pet type</option>
                      <option value="dog">Dog</option>
                      <option value="cat">Cat</option>
                      <option value="bird">Bird</option>
                      <option value="rabbit">Rabbit</option>
                      <option value="other">Other</option>
                    </select>
                    
                    {/* Show custom pet type input only when "Other" is selected */}
                    {formData.petType === 'other' && (
                      <input
                        type="text"
                        name="customPetType"
                        className="form-control"
                        style={{ marginTop: '8px' }}
                        value={formData.customPetType}
                        onChange={handleChange}
                        placeholder="Specify pet type (e.g., Hamster, Turtle, etc.)"
                        required
                      />
                    )}
                  </div>

                  <div className="form-group">
                    <label>Select Doctor *</label>
                    <select
                      name="doctor"
                      className="form-control"
                      value={formData.doctor}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Choose a doctor</option>
                      {doctors.map(doctor => (
                        <option key={doctor._id} value={doctor._id}>
                          {doctor.name} - {getSpecializationLabel(doctor.specialization)}
                        </option>
                      ))}
                    </select>
                    <small className="text-muted">
                      Choose from our available veterinary specialists
                    </small>
                  </div>

                  <div className="form-group">
                    <label>Appointment Date & Time *</label>
                    <input
                      type="datetime-local"
                      name="appointmentDate"
                      className="form-control"
                      value={formData.appointmentDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Service *</label>
                    <select
                      name="service"
                      className="form-control"
                      value={formData.service}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Choose a service</option>
                      <option value="checkup">General Checkup</option>
                      <option value="vaccination">Vaccination</option>
                      <option value="grooming">Grooming</option>
                      <option value="dental">Dental Care</option>
                      <option value="surgery">Surgery</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Pet Photo (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="form-control"
                      disabled={uploadingPhoto}
                    />
                    {uploadingPhoto && <div className="loading-small">Uploading photo...</div>}
                    {formData.petPhoto && (
                      <div style={{ marginTop: '10px' }}>
                        <img 
                          src={`${import.meta.env.VITE_API_URL.replace('/api','')}${appointment.petPhoto}`} 
                          alt="Pet preview" 
                          style={{ 
                            width: '100px', 
                            height: '100px', 
                            objectFit: 'cover', 
                            borderRadius: '8px',
                            border: '2px solid #ddd'
                          }}
                        />
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                          Photo ready to upload
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Notes (Optional)</label>
                  <textarea
                    name="notes"
                    className="form-control"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special requirements or information about your pet's condition..."
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={loading}
                >
                  {loading ? 'Booking...' : 'Book Appointment'}
                </button>
              </form>
            </div>
          )}

          {fetchLoading ? (
            <div className="loading">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <h3>No appointments yet</h3>
              <p>Book your first appointment to get started!</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Pet Name</th>
                    <th>Pet Type</th>
                    <th>Doctor</th>
                    <th>Appointment Date</th>
                    <th>Service</th>
                    <th>Pet Photo</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>
                        <strong>{appointment.petName}</strong>
                      </td>
                      <td>{appointment.petType}</td>
                      <td>
                        {appointment.doctor ? (
                          <div>
                            <strong>{appointment.doctor.name}</strong>
                            <br />
                            <small style={{ color: '#666' }}>
                              {getSpecializationLabel(appointment.doctor.specialization)}
                            </small>
                          </div>
                        ) : (
                          <span className="text-muted">Not assigned</span>
                        )}
                      </td>
                      <td>{formatDate(appointment.appointmentDate)}</td>
                      <td>
                        <span className="service-badge">{appointment.service}</span>
                      </td>
                      <td>
                        {appointment.petPhoto ? (
                          <img 
                            src={`http://localhost:5000${appointment.petPhoto}`}
                            alt={appointment.petName}
                            style={{ 
                              width: '50px', 
                              height: '50px', 
                              objectFit: 'cover', 
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                            onClick={() => window.open(`http://localhost:5000${appointment.petPhoto}`, '_blank')}
                          />
                        ) : (
                          <span className="text-muted">No photo</span>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge status-${appointment.status}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td>
                        {appointment.status === 'scheduled' && (
                          <button
                            onClick={() => cancelAppointment(appointment._id)}
                            className="btn btn-danger btn-sm"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard