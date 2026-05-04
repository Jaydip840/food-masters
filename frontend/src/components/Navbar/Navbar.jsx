import React, { useContext, useEffect, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail === "foodizo17@gmail.com") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setToken("");
    navigate("/");
    setIsAdmin(false);
  };

  return (
    <div className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to='/'><img src={assets.logo} alt="" className='logo' /></Link>
      
      <div className={`navbar-hamburger ${showMobileMenu ? 'active' : ''}`} onClick={() => setShowMobileMenu(!showMobileMenu)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={`navbar-menu ${showMobileMenu ? 'mobile-active' : ''}`}>
        <Link to='/' onClick={() => { setMenu("home"); setShowMobileMenu(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={menu === "home" ? "active" : ""}>Home</Link>
        <a href='#explore-menu' onClick={() => { setMenu("menu"); setShowMobileMenu(false); }} className={menu === "menu" ? "active" : ""}>Menu</a>
        <Link to='/restaurants' onClick={() => { setMenu("restaurants"); setShowMobileMenu(false); }} className={menu === "restaurants" ? "active" : ""}>Restaurants</Link>
        <Link to='/aboutus' onClick={() => { setMenu("aboutus"); setShowMobileMenu(false); }} className={menu === "aboutus" ? "active" : ""}>About Us</Link>
        <Link to='/policy' onClick={() => { setMenu("policy"); setShowMobileMenu(false); }} className={`mobile-only ${menu === "policy" ? "active" : ""}`}>Privacy Policy</Link>
        {!token && <button className='mobile-signin' onClick={() => { setShowLogin(true); setShowMobileMenu(false); }}>Sign In</button>}
      </ul>

      <div className='navbar-right'>
        <div className="navbar-search-icon">
          <Link to="/cart" className="navbar-cart-link">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="cart-svg">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </Link>
          {getTotalCartAmount() !== 0 && <div className="dot"></div>}
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="Profile" />
            <ul className='nav-profile-dropdown'>
              {isAdmin && (
                <>
                  <li onClick={() => { window.location.href = "http://localhost:5174"; }}>
                    <img src={assets.settings_icon} alt="" />
                    <p>Admin Panel</p>
                  </li>
                  <hr />
                </>
              )}
              <li onClick={() => navigate('/profile')}><img src={assets.profile_icon} alt="" /><p>Profile</p></li>
              <hr />
              <li onClick={() => navigate('/myorders')}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
              <hr />
              <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
