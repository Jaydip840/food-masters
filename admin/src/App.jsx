import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes, Navigate } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContactMessages from "./pages/Contact/ContactMessages";
import Login from "./components/Login/Login";


const App = () => {
  const url = import.meta.env.VITE_BACKEND_URL || "https://backend-c6ta.onrender.com"
  // const url = "http://localhost:4000"

  const [token, setToken] = React.useState(localStorage.getItem('adminToken') || "");

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const adminToken = urlParams.get('adminToken');
    const adminEmail = urlParams.get('adminEmail');
    if (adminToken) {
      setToken(adminToken);
      localStorage.setItem('adminToken', adminToken);
      if (adminEmail) localStorage.setItem('adminEmail', adminEmail);
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  if (!token) {
    return (
      <>
        <ToastContainer />
        <Login url={url} setToken={setToken} />
      </>
    )
  }

  return (
    <div>
      <ToastContainer />
      <Navbar setToken={setToken} />
      <hr />
      <div className='app-content'>
        <Sidebar />
        <div className="admin-main-view">
          <Routes>
            <Route path="/" element={<Navigate to="/add" />} />
            <Route path="/add" element={<Add url={url} />} />
            <Route path="/list" element={<List url={url} />} />
            <Route path="/orders" element={<Orders url={url} />} />
            <Route path="/contact-messages" element={<ContactMessages url={url} />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
