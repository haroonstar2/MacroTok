import { useEffect, useState, useRef } from "react";
import DropDownButton from "./dropDownBtn";
import DropDownContent from "./dropDownContent";
import "./dropDown.css"

const DropDown = ({ buttonText, content }) => {
    const [open, setOpen] = useState(false);
    const [dropdownTop, setDropdownTop] = useState(0);

    const dropdownRef = useRef();
    const buttonRef = useRef();
    const contentRef = useRef();

    const toggleDropdown = () => {
        if (!open) {
            const spaceRemaining = 
                window.innerHeight - buttonRef.current.getBoundingClientRect().bottom;
            const contentHeight = contentRef.current.clientHeight;

            const topPosition = 
                spaceRemaining > contentHeight
                ? null
                : -(contentHeight - spaceRemaining); //to move the height blocked by the window
            setDropdownTop(topPosition);
        }

        setOpen((open) => !open);
    };

    useEffect(() => {
        const handler = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("click", handler);

        return () => {
            document.removeEventListener("click", handler);
        };
    }, [dropdownRef]);

    return (
        <div ref={dropdownRef} className="dropdown">
            <DropDownButton ref={buttonRef} toggle={toggleDropdown} open={open}>
                {buttonText}
            </DropDownButton>
            {
                <DropDownContent top={dropdownTop} ref={contentRef} open={open}>
                    {content}
                </DropDownContent>
            }
        </div>
    );
};

export default DropDown;