import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/SIdebar'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContactMessages from "./pages/Contact/ContactMessages";


const App = () => {
  // const url = "https://foodmasters-backend.onrender.com"
  const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className='app-content'>
        <Sidebar />
        <Routes>
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/list" element={<List url={url} />} />
          <Route path="/orders" element={<Orders url={url} />} />
          <Route path="/contact-messages" element={<ContactMessages url={url} />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
