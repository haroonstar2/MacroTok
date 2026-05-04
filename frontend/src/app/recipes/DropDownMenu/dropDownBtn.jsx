import React, { useState, useRef, useEffect } from "react";
import { forwardRef } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./dropDown.css";

const DropDownButton = forwardRef((props, ref) => {
    const { children, toggle, open } = props;
    
    return (
        <div
        onClick={toggle}
        className={`dropdown-btn ${open ? "button-open" : null}`}
        ref={ref}
        >
            {children}
            <span className="toggle-icon">
                {open ? <FaChevronUp /> : <FaChevronDown />}
            </span>
        </div>
    );
});

export default DropDownButton;