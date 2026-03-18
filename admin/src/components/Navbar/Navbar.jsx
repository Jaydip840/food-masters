import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'

const Navbar = () => {
  const goHome = () => {
    // Attempt to grab token from localStorage if the admin saved it
    const token = localStorage.getItem("token") || "";
    // Admin email we know is hardcoded in the frontend logic
    const email = "foodizo17@gmail.com"; 
    
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
          <img className='profile' src={assets.profile_image} alt="Profile" />
        </div>
      </div>
    </div>
  )
}

export default Navbar
