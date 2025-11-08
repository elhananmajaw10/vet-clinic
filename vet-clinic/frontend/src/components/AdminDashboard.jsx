import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appointments');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Form data
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialization: 'general',
    description: '',
    experience: '',
    education: '',
    available: true
  });

  const [appointmentForm, setAppointmentForm] = useState({
    petName: '',
    petType: 'dog',
    service: 'checkup',
    status: 'scheduled',
    doctor: '',
    notes: ''
  });

  const [userForm, setUserForm] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    role: 'user'
  });

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchUsers();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Populate doctor information for each appointment
      const appointmentsWithDoctors = await Promise.all(
        response.data.map(async (appointment) => {
          if (appointment.doctor) {
            try {
              const doctorResponse = await axios.get(`/doctors/${appointment.doctor}`);
              return {
                ...appointment,
                doctor: doctorResponse.data
              };
            } catch (error) {
              return appointment;
            }
          }
          return appointment;
        })
      );
      setAppointments(appointmentsWithDoctors);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to fetch appointments');
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // APPOINTMENT CRUD
  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/appointments/${appointmentId}`, { status }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSuccess('Appointment status updated successfully');
      fetchAppointments();
    } catch (error) {
      setError('Failed to update appointment status');
    }
  };

  const deleteAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/appointments/${appointmentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setSuccess('Appointment deleted successfully');
        fetchAppointments();
      } catch (error) {
        setError('Failed to delete appointment');
      }
    }
  };

  const editAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setAppointmentForm({
      petName: appointment.petName,
      petType: appointment.petType,
      service: appointment.service,
      status: appointment.status,
      doctor: appointment.doctor?._id || '',
      notes: appointment.notes || ''
    });
  };

  const updateAppointment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/appointments/${editingAppointment._id}`, appointmentForm, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSuccess('Appointment updated successfully');
      setEditingAppointment(null);
      fetchAppointments();
    } catch (error) {
      setError('Failed to update appointment');
    }
  };

  // DOCTOR CRUD
  const addDoctor = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingDoctor) {
        await axios.patch(`/doctors/${editingDoctor._id}`, doctorForm, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setSuccess('Doctor updated successfully');
      } else {
        await axios.post('/doctors', doctorForm, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setSuccess('Doctor added successfully');
      }
      setShowDoctorForm(false);
      setEditingDoctor(null);
      setDoctorForm({
        name: '',
        specialization: 'general',
        description: '',
        experience: '',
        education: '',
        available: true
      });
      fetchDoctors();
    } catch (error) {
      setError('Failed to save doctor');
    }
  };

  const editDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setDoctorForm({
      name: doctor.name,
      specialization: doctor.specialization,
      description: doctor.description,
      experience: doctor.experience,
      education: doctor.education,
      available: doctor.available
    });
  };

  const deleteDoctor = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/doctors/${doctorId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setSuccess('Doctor deleted successfully');
        fetchDoctors();
      } catch (error) {
        setError('Failed to delete doctor');
      }
    }
  };

  const toggleDoctorAvailability = async (doctorId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/doctors/${doctorId}`, { available: !currentStatus }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSuccess('Doctor availability updated');
      fetchDoctors();
    } catch (error) {
      setError('Failed to update doctor availability');
    }
  };

  // USER CRUD
  const editUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role
    });
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/users/${editingUser._id}`, userForm, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSuccess('User updated successfully');
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      setError('Failed to update user');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This will also delete all their appointments.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setSuccess('User deleted successfully');
        fetchUsers();
      } catch (error) {
        setError('Failed to delete user');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

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
    };
    return labels[spec] || spec;
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  if (loading) {
    return <div className="loading">Loading admin dashboard...</div>;
  }

  return (
    <div className="page-container">
      <div className="container">
        <div className="card">
          <h1>Admin Dashboard</h1>
          <p className="subtitle">Welcome, {user?.name}</p>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Tabs */}
          <div className="tabs">
            <button 
              className={`tab-button ${activeTab === 'appointments' ? 'active' : ''}`}
              onClick={() => setActiveTab('appointments')}
            >
              Appointments ({appointments.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'doctors' ? 'active' : ''}`}
              onClick={() => setActiveTab('doctors')}
            >
              Doctors ({doctors.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users ({users.length})
            </button>
          </div>

          {/* APPOINTMENTS TAB */}
          {activeTab === 'appointments' && (
            <div className="tab-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>All Appointments</h2>
              </div>
              
              {appointments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <h3>No appointments found</h3>
                  <p>Appointments will appear here when users book them.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Pet Name</th>
                        <th>Pet Type</th>
                        <th>Owner</th>
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
                            <div>
                              <strong>{appointment.owner?.name}</strong>
                              <br />
                              <small>{appointment.owner?.email}</small>
                              <br />
                              <small>{appointment.owner?.phone}</small>
                            </div>
                          </td>
                          <td>
                            {appointment.doctor ? (
                              <div>
                                <strong>{appointment.doctor.name}</strong>
                                <br />
                                <small className={`specialization-badge ${appointment.doctor.specialization}`}>
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
                                  width: '60px', 
                                  height: '60px', 
                                  objectFit: 'cover', 
                                  borderRadius: '8px', 
                                  cursor: 'pointer',
                                  border: '2px solid #ddd'
                                }}
                                onClick={() => window.open(`http://localhost:5000${appointment.petPhoto}`, '_blank')}
                                title="Click to view full size"
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
                            <div className="action-buttons">
                              <button
                                onClick={() => editAppointment(appointment)}
                                className="btn btn-outline btn-sm"
                                style={{ marginBottom: '5px' }}
                              >
                                Edit
                              </button>
                              {appointment.status === 'scheduled' && (
                                <>
                                  <button
                                    onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                                    className="btn btn-success btn-sm"
                                    style={{ marginBottom: '5px' }}
                                  >
                                    Complete
                                  </button>
                                  <button
                                    onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                                    className="btn btn-warning btn-sm"
                                    style={{ marginBottom: '5px' }}
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => deleteAppointment(appointment._id)}
                                className="btn btn-danger btn-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Edit Appointment Modal */}
              {editingAppointment && (
                <div className="modal-overlay">
                  <div className="modal">
                    <h3>Edit Appointment</h3>
                    <form onSubmit={updateAppointment}>
                      <div className="form-group">
                        <label>Pet Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={appointmentForm.petName}
                          onChange={(e) => setAppointmentForm({...appointmentForm, petName: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Pet Type</label>
                        <select
                          className="form-control"
                          value={appointmentForm.petType}
                          onChange={(e) => setAppointmentForm({...appointmentForm, petType: e.target.value})}
                        >
                          <option value="dog">Dog</option>
                          <option value="cat">Cat</option>
                          <option value="bird">Bird</option>
                          <option value="rabbit">Rabbit</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Service</label>
                        <select
                          className="form-control"
                          value={appointmentForm.service}
                          onChange={(e) => setAppointmentForm({...appointmentForm, service: e.target.value})}
                        >
                          <option value="checkup">General Checkup</option>
                          <option value="vaccination">Vaccination</option>
                          <option value="grooming">Grooming</option>
                          <option value="dental">Dental Care</option>
                          <option value="surgery">Surgery</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Status</label>
                        <select
                          className="form-control"
                          value={appointmentForm.status}
                          onChange={(e) => setAppointmentForm({...appointmentForm, status: e.target.value})}
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Doctor</label>
                        <select
                          className="form-control"
                          value={appointmentForm.doctor}
                          onChange={(e) => setAppointmentForm({...appointmentForm, doctor: e.target.value})}
                        >
                          <option value="">Select Doctor</option>
                          {doctors.map(doctor => (
                            <option key={doctor._id} value={doctor._id}>
                              {doctor.name} - {getSpecializationLabel(doctor.specialization)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Notes</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={appointmentForm.notes}
                          onChange={(e) => setAppointmentForm({...appointmentForm, notes: e.target.value})}
                        />
                      </div>
                      <div className="modal-actions">
                        <button type="submit" className="btn btn-success">Update Appointment</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setEditingAppointment(null)}>Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DOCTORS TAB */}
          {activeTab === 'doctors' && (
            <div className="tab-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Manage Doctors</h2>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setEditingDoctor(null);
                    setDoctorForm({
                      name: '',
                      specialization: 'general',
                      description: '',
                      experience: '',
                      education: '',
                      available: true
                    });
                    setShowDoctorForm(true);
                  }}
                >
                  Add New Doctor
                </button>
              </div>

              {/* Doctors Grid */}
              {doctors.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <h3>No doctors found</h3>
                  <p>Add doctors to your team to get started.</p>
                </div>
              ) : (
                <div className="doctors-grid">
                  {doctors.map((doctor) => (
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
                          {doctor.available ? '✅ Available' : '❌ Not Available'}
                        </div>
                        <div className="doctor-actions" style={{ marginTop: '10px' }}>
                          <button 
                            className="btn btn-outline btn-sm"
                            onClick={() => editDoctor(doctor)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-warning btn-sm"
                            onClick={() => toggleDoctorAvailability(doctor._id, doctor.available)}
                            style={{ marginLeft: '5px' }}
                          >
                            {doctor.available ? 'Make Unavailable' : 'Make Available'}
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteDoctor(doctor._id)}
                            style={{ marginLeft: '5px' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Edit Doctor Modal */}
              {(showDoctorForm || editingDoctor) && (
                <div className="modal-overlay">
                  <div className="modal">
                    <h3>{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h3>
                    <form onSubmit={addDoctor}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="form-group">
                          <label>Doctor Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={doctorForm.name}
                            onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Specialization *</label>
                          <select
                            className="form-control"
                            value={doctorForm.specialization}
                            onChange={(e) => setDoctorForm({...doctorForm, specialization: e.target.value})}
                            required
                          >
                            <option value="general">General Practice</option>
                            <option value="surgery">Surgery</option>
                            <option value="dental">Dental Care</option>
                            <option value="dermatology">Dermatology</option>
                            <option value="emergency">Emergency Care</option>
                            <option value="internal_medicine">Internal Medicine</option>
                            <option value="vaccination">Vaccination Specialist</option>
                            <option value="grooming">Grooming Specialist</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Experience (Years) *</label>
                          <input
                            type="number"
                            className="form-control"
                            value={doctorForm.experience}
                            onChange={(e) => setDoctorForm({...doctorForm, experience: e.target.value})}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Education *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={doctorForm.education}
                            onChange={(e) => setDoctorForm({...doctorForm, education: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Description *</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={doctorForm.description}
                          onChange={(e) => setDoctorForm({...doctorForm, description: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={doctorForm.available}
                            onChange={(e) => setDoctorForm({...doctorForm, available: e.target.checked})}
                          />
                          Available for appointments
                        </label>
                      </div>
                      <div className="modal-actions">
                        <button type="submit" className="btn btn-success">
                          {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-secondary"
                          onClick={() => {
                            setShowDoctorForm(false);
                            setEditingDoctor(null);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="tab-content">
              <h2>Registered Users</h2>
              {users.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <h3>No users found</h3>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td>
                            <strong>{user.name}</strong>
                            {user._id === user.id && <span style={{marginLeft: '8px', color: '#007bff'}}>(You)</span>}
                          </td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>{user.phone}</td>
                          <td>
                            <span className={`role-badge ${user.role}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                onClick={() => editUser(user)}
                                className="btn btn-outline btn-sm"
                                style={{ marginBottom: '5px' }}
                              >
                                Edit
                              </button>
                              {user._id !== user.id && (
                                <button
                                  onClick={() => deleteUser(user._id)}
                                  className="btn btn-danger btn-sm"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Edit User Modal */}
              {editingUser && (
                <div className="modal-overlay">
                  <div className="modal">
                    <h3>Edit User</h3>
                    <form onSubmit={updateUser}>
                      <div className="form-group">
                        <label>Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={userForm.name}
                          onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Username</label>
                        <input
                          type="text"
                          className="form-control"
                          value={userForm.username}
                          onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={userForm.email}
                          onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Phone</label>
                        <input
                          type="text"
                          className="form-control"
                          value={userForm.phone}
                          onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Role</label>
                        <select
                          className="form-control"
                          value={userForm.role}
                          onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div className="modal-actions">
                        <button type="submit" className="btn btn-success">Update User</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setEditingUser(null)}>Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;