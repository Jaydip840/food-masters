import React from "react";
import "./Loader.css";
import { assets } from "../../assets/assets";

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="logo-wrapper">
            <img src={assets.logo} alt="Food Masters" className="loader-logo" />
            <div className="pulse-ring"></div>
            <div className="pulse-ring delay-1"></div>
        </div>
        <div className="loader-info">
            <div className="brand-name">
                <span className="letter">F</span>
                <span className="letter">O</span>
                <span className="letter">O</span>
                <span className="letter">D</span>
                <span className="space"> </span>
                <span className="letter color">M</span>
                <span className="letter color">A</span>
                <span className="letter color">S</span>
                <span className="letter color">T</span>
                <span className="letter color">E</span>
                <span className="letter color">R</span>
                <span className="letter color">S</span>
            </div>
            <div className="progress-track">
                <div className="progress-fill"></div>
            </div>
            <p className="loader-status">Elevating your dining experience...</p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
