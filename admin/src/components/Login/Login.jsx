import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = ({ setToken, url }) => {
  const [data, setData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(url + "/api/user/login", data);
      if (response.data.success) {
        if (response.data.role !== "admin") {
          toast.error("Unauthorized. Only administrators can access this panel.", { theme: 'colored' });
        } else {
          setToken(response.data.token);
          localStorage.setItem("adminToken", response.data.token);
          localStorage.setItem("adminEmail", data.email);
        }
      } else {
        toast.error(response.data.message, { theme: 'colored' });
      }
    } catch (error) {
      toast.error("Error logging in.");
    }
    setLoading(false);
  };

  return (
    <div className='admin-login'>
      <div className="login-container">
        <div className="login-header">
          <h2>Admin Access</h2>
          <p>Please log in with your administrator credentials.</p>
        </div>
        <form onSubmit={onLogin} className="login-form">
          <div className="input-group">
            <label>Email Address</label>
            <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder="admin@example.com" required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder="••••••••" required />
          </div>
          <button type='submit' className='login-btn' disabled={loading}>
            {loading ? "Verifying..." : "Secure Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
