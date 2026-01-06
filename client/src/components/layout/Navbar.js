import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const Navbar = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Report Issue', path: 'report-issue' },
        { name: 'Track Issue', path: 'track-issue' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },

    ];

    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication status on component mount and on route changes
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const { data } = await axios.get('/api/user/me', {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true
                    });
                    if (data?.success && data.user) {
                        setIsLoggedIn(true);
                        setUser(data.user);
                        return;
                    }
                }
                // If we get here, not properly authenticated
                setIsLoggedIn(false);
                setUser(null);
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('token');
                setIsLoggedIn(false);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();

        // Listen for storage events to handle login/logout from other tabs
        const handleStorageChange = (e) => {
            if (e.key === 'token') {
                checkAuth();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [navigate]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e, link) => {
        // Check if the route requires authentication
        const protectedRoutes = ['report-issue', '/report-issue'];

        if (protectedRoutes.includes(link.path)) {
            // If user is not logged in, prevent navigation and show toast
            if (!isLoggedIn) {
                e.preventDefault();
                toast.error('Please login to report an issue', {
                    duration: 3000,
                    position: 'top-center',
                });
                // Redirect to login page
                navigate('/loginn', {
                    state: { from: link.path }
                });
            }
        }
    };

    const handleLoginClick = (e) => {
        e.preventDefault();
        // Only navigate if we're not already on the login page
        if (window.location.pathname !== '/loginn') {
            navigate('/loginn', {
                state: { from: window.location.pathname },
                replace: true
            });
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('/api/user/logout', {}, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear all auth related data
            localStorage.removeItem('token');

            // Update state
            setIsLoggedIn(false);
            setUser(null);

            // Show success message
            toast.success('Logged out successfully');

            // Redirect to home and force a full page reload to reset all states
            window.location.href = '/';
        }
    };

    return (
        <div className="pb-10">

            <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 
                transition-all duration-500 z-[100] 
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
                        <Link
                            key={i}
                            to={link.path}
                            onClick={(e) => handleNavClick(e, link)}
                            className="group flex flex-col gap-0.5 text-gray-700">
                            {link.name}
                            <div className="bg-gray-700 h-0.5 w-0 group-hover:w-full transition-all duration-300" />
                        </Link>
                    ))}
                </div>

                {/* Desktop Right */}
                <div className="hidden md:flex items-center gap-4">
                    <svg className="h-6 w-6 text-black" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>

                    {/* Login / Logout Button */}
                    {isLoading ? (
                        <div className="px-8 py-2.5">Loading...</div>
                    ) : !isLoggedIn ? (
                        <button
                            onClick={handleLoginClick}
                            className="px-8 py-2.5 rounded-full ml-4 bg-black text-white hover:bg-gray-800 transition-colors"
                        >
                            Login
                        </button>
                    ) : (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">
                                Hello, {user?.name || 'User'}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
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

        </div>
    );
};

export default Navbar;
