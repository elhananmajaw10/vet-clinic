import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import AdminDashboard from './components/AdminDashboard.jsx'
import Navbar from './components/Navbar'
import Home from './components/Home'
import About from './components/About'
import Services from './components/Services'
import Contact from './components/Contact'
import Footer from './components/Footer' // Import the Footer
import Doctors from './components/Doctors.jsx';

// Set base URL for axios
axios.defaults.baseURL = 'http://localhost:5000/api'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setUser(JSON.parse(userData))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    setLoading(false)
  }, [])

  const login = (userData, token) => {
    setUser(userData)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <Router>
      <div className="App">
        {/* Show navbar for ALL pages */}
        <Navbar user={user} onLogout={logout} />
        
        {/* Main content area */}
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/doctors" element={<Doctors />} />
            
            
            {/* Auth Routes - redirect if already logged in */}
            <Route 
              path="/login" 
              element={!user ? <Login onLogin={login} /> : <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} />} 
            />
            <Route 
              path="/register" 
              element={!user ? <Register onLogin={login} /> : <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} />} 
            />
            
            {/* Protected Routes - redirect to login if not authenticated */}
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin" 
              element={user && user.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/dashboard" />} 
            />
            
            {/* Catch all route - redirect based on auth status */}
            <Route 
              path="*" 
              element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/'} />} 
            />
          </Routes>
        </main>

        {/* Show footer for ALL pages */}
        <Footer />
      </div>
    </Router>
  )
}

export default App