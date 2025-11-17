import React, { useState, useRef, useEffect } from 'react';
import Loginn from '../../pages/loginn.js';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navbar = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/' },
        { name: 'Contact', path: '/' },
        { name: 'About', path: '/' },
    ];

    const ref = useRef(null);
    const navigate = useNavigate();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // ⭐ NEW STATE (Check login status)
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("userLoggedIn") === "true"
    );

    const [showUserLogin, setShowUserLogin] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // ⭐ Call this after login success
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        localStorage.setItem("userLoggedIn", "true");
        setShowUserLogin(false);
    };

    // ⭐ Logout function
    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem("userLoggedIn");
        toast.success("Logged out successfully");
        navigate("/");
    };

    return (
        <div className="pb-10">

            <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 
                transition-all duration-500 z-50 
                bg-white shadow-md py-4 md:py-6`}>

                {/* Logo */}
                <a className="flex items-center gap-2">
                    <svg width="157" height="40" viewBox="0 0 157 40"
                        className={`h-9 ${isScrolled ? "" : ""}`}>
                    </svg>
                </a>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-4 lg:gap-8">
                    {navLinks.map((link, i) => (
                        <a key={i} href={link.path}
                            className="group flex flex-col gap-0.5 text-gray-700">
                            {link.name}
                            <div className="bg-gray-700 h-0.5 w-0 group-hover:w-full transition-all duration-300" />
                        </a>
                    ))}

                    <button className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer text-black">
                        New Launch
                    </button>
                </div>

                {/* Desktop Right */}
                <div className="hidden md:flex items-center gap-4">
                    <svg className="h-6 w-6 text-black" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>

                    {/* ⭐ LOGIN / LOGOUT BUTTON */}
                    {!isLoggedIn ? (
                        <button
                            className="px-8 py-2.5 rounded-full ml-4 bg-black text-white"
                            onClick={() => setShowUserLogin(true)}
                        >
                            Login
                        </button>
                    ) : (
                        <button
                            className="px-8 py-2.5 rounded-full ml-4 bg-red-600 text-white"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-3 md:hidden">
                    <svg onClick={() => setIsMenuOpen(!isMenuOpen)} className="h-6 w-6 cursor-pointer" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="4" y1="6" x2="20" y2="6" />
                        <line x1="4" y1="12" x2="20" y2="12" />
                        <line x1="4" y1="18" x2="20" y2="18" />
                    </svg>
                </div>
            </nav>

            {/* ⭐ LOGIN MODAL POPUP */}
            {showUserLogin && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
                    <div className="bg-white p-6 rounded-lg w-[90%] md:w-[30%] relative">

                        <button
                            className="absolute top-24 right-10 text-gray-600"
                            onClick={() => setShowUserLogin(false)}
                        >
                            ✕
                        </button>

                        {/* Pass login success callback */}
                        <Loginn onLoginSuccess={handleLoginSuccess} />
                    </div>
                </div>
            )}

        </div>
    );
};

export default Navbar;
