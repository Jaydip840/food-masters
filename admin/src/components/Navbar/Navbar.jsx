import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'

const Navbar = ({ setToken }) => {
  const goHome = () => {
    // Attempt to grab token from localStorage if the admin saved it
    const token = localStorage.getItem("adminToken") || "";
    // Admin email retrieved dynamically
    const email = localStorage.getItem("adminEmail") || ""; 
    
    // Pass them as URL parameters so the frontend can read them on mount
    window.location.href = `http://localhost:5173/?adminToken=${token}&adminEmail=${email}`;
  };
  
  return (
    <div>
      <div className="navbar">
        <img className='logo' src={assets.logo} alt="" />
        <div className="navbar-right">
          <button className="home-btn" onClick={goHome}>
            HOME
          </button>
          <button className="home-btn" onClick={() => { localStorage.removeItem('adminToken'); localStorage.removeItem('adminEmail'); setToken(""); }} style={{ marginLeft: '10px', background: '#ff4757', color: 'white', border: '1px solid #ff4757' }}>
            LOGOUT
          </button>
          <img className='profile' src={assets.profile_image} alt="Profile" style={{ marginLeft: '20px' }} />
        </div>
      </div>
    </div>
  )
}

export default Navbar
