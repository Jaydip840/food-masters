import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const [currentSlogan, setCurrentSlogan] = useState(0);
  const [displayText, setDisplayText] = useState("");

  const slogans = [
    "Indulge in Extraordinary Culinary Journeys",
    "The Ultimate Destination for Food Lovers",
    "Elevate Your Palate with Masterpiece Dishes"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % slogans.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let charIndex = 0;
    const fullText = slogans[currentSlogan];
    setDisplayText("");
    
    const typingInterval = setInterval(() => {
      if (charIndex <= fullText.length) {
        setDisplayText(fullText.substring(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [currentSlogan]);

  return (
    <div 
      className='header' 
      style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url('/header_img.png')` }}
    >
      <div className="header-contents">
        <h2 className="dynamic-text">
          {displayText}<span className="cursor">|</span>
        </h2>
        <p className="header-description">
          Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.
        </p>
      </div>
    </div>
  );
};

export default Header
