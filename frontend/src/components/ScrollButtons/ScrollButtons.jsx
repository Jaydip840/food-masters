import React, { useState, useEffect } from 'react';
import './ScrollButtons.css';

const ScrollButtons = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show buttons when page is scrolled
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    };

    return (
        <div className={`scroll-buttons-container ${isVisible ? 'visible' : ''}`}>
            <button 
                onClick={scrollToTop} 
                className="scroll-nav-btn up" 
                title="Go to Top"
            >
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
            </button>
            <div className="scroll-nav-divider"></div>
            <button 
                onClick={scrollToBottom} 
                className="scroll-nav-btn down" 
                title="Go to Bottom"
            >
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
        </div>
    );
};

export default ScrollButtons;
