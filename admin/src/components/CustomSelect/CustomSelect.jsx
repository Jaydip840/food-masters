import React, { useState, useRef, useEffect } from 'react';
import './CustomSelect.css';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ options, value, onChange, name }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleToggle = () => setIsOpen(!isOpen);

    const handleSelect = (option) => {
        onChange({ target: { name, value: option } });
        setIsOpen(false);
    };

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="custom-select-wrapper" ref={dropdownRef}>
            <div className={`select-trigger ${isOpen ? 'active' : ''}`} onClick={handleToggle}>
                <span>{value || "Select Category"}</span>
                <ChevronDown size={18} className={`arrow ${isOpen ? 'rotate' : ''}`} />
            </div>
            {isOpen && (
                <div className="select-options">
                    {options.map((option, index) => (
                        <div 
                            key={index} 
                            className={`select-option ${value === option ? 'selected' : ''}`}
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
