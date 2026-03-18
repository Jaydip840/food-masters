import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';


const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    try {
      setLoading(true);
      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", data.email);
        toast.success(response.data.message);
        if (response.data.role === "admin") {
          // window.location.href = "https://foodizo-on-admin.netlify.app";
          window.location.href = "http://localhost:5174";
        } else {
          // window.location.href = "https://foodizo-on.netlify.app";
          window.location.href = "http://localhost:5173";

        }

        // reset state & close popup

        setData({ name: "", email: "", password: "" });
        setShowLogin(false);
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" title="Close" />
        </div>

        <div className="login-popup-inputs">
          {currState === "Login" ? null : (
            <input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder="Your Name" required />
          )}
          <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Your Email" required />
          <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder="Password" required />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? (
            <div className="load-row">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            currState === "Sign Up" ? "Create Account" : "Login"
          )}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>
            By continuing, I agree to the <span><Link to="/policy">Terms of Use</Link></span> &{" "}
            <span><Link to="/legal">Privacy Policy</Link></span>.
          </p>
        </div>

        <p className="login-popup-toggle">
          {currState === "Login" ? (
            <>
              Create a new account?{" "}
              <span onClick={() => setCurrState("Sign Up")}>Click here</span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => setCurrState("Login")}>Login here</span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default LoginPopup;
