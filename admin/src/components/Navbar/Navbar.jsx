import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { LogOut, Home } from 'lucide-react'

const Navbar = ({ setToken }) => {
  const goHome = () => {
    const token = localStorage.getItem("adminToken") || "";
    const email = localStorage.getItem("adminEmail") || "";
    // Redirect to the Frontend application
    window.location.href = `http://localhost:5173/?adminToken=${token}&adminEmail=${email}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    setToken("");
  };

  return (
    <div className="admin-navbar">
      <div className="nav-left">
        <img className='admin-logo' src={assets.logo} alt="Food Masters Logo" />
        <span className="admin-badge">Admin Panel</span>
      </div>
      
      <div className="nav-right">
        <button className="nav-btn home" onClick={goHome}>
          <Home size={18} />
          <span>Home</span>
        </button>
        <button className="nav-btn logout" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
        <div className="admin-profile">
          <img src={assets.profile_image} alt="Admin" />
        </div>
      </div>
    </div>
  )
}

export default Navbar
