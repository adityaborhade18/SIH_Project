import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Menu, X, User, LogOut, Home, FileText, Search, Info, Mail } from 'lucide-react';

const Navbar = () => {
    const navLinks = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Report Issue', path: '/report-issue', icon: FileText },
        { name: 'Track Issue', path: '/track-issue', icon: Search },
        { name: 'About', path: '/about', icon: Info },
        { name: 'Contact', path: '/contact', icon: Mail },
    ];

    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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

        const handleStorageChange = (e) => {
            if (e.key === 'token') {
                checkAuth();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e, link) => {
        const protectedRoutes = ['/report-issue', '/track-issue'];

        if (protectedRoutes.includes(link.path)) {
            if (!isLoggedIn) {
                e.preventDefault();
                const isReportIssue = link.path.includes('report');
                const message = isReportIssue
                    ? 'Please login to report an issue'
                    : 'Please login to track your issues';

                toast.error(message, {
                    duration: 3000,
                    position: 'top-center',
                });

                navigate('/loginn', {
                    state: { from: link.path }
                });
            }
        }
        setIsMenuOpen(false);
    };

    const handleLoginClick = (e) => {
        e.preventDefault();
        if (window.location.pathname !== '/loginn') {
            navigate('/loginn', {
                state: { from: window.location.pathname },
                replace: true
            });
        }
        setIsMenuOpen(false);
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
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            setUser(null);
            toast.success('Logged out successfully');
            navigate('/', { replace: true });
        }
        setIsMenuOpen(false);
    };

    const isActivePath = (path) => location.pathname === path;

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-lg py-3'
                    : 'bg-white/80 backdrop-blur-sm py-4'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2 group">
                            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-lg transform group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                CivicConnect
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={(e) => handleNavClick(e, link)}
                                        className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActivePath(link.path)
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{link.name}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* User Actions - Desktop */}
                        <div className="hidden md:flex items-center space-x-3">
                            {isLoading ? (
                                <div className="flex items-center space-x-2 text-gray-500">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                                </div>
                            ) : !isLoggedIn ? (
                                <button
                                    onClick={handleLoginClick}
                                    className="btn-primary flex items-center space-x-2"
                                >
                                    <User className="w-4 h-4" />
                                    <span>Login</span>
                                </button>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            {user?.name || 'User'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="btn-danger flex items-center space-x-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6 text-gray-700" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                    <div className="px-4 py-4 space-y-2 bg-white border-t border-gray-100">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={(e) => handleNavClick(e, link)}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActivePath(link.path)
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{link.name}</span>
                                </Link>
                            );
                        })}

                        <div className="pt-4 border-t border-gray-100">
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2 py-3 text-gray-500">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                                </div>
                            ) : !isLoggedIn ? (
                                <button
                                    onClick={handleLoginClick}
                                    className="w-full btn-primary flex items-center justify-center space-x-2"
                                >
                                    <User className="w-4 h-4" />
                                    <span>Login</span>
                                </button>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-semibold">
                                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full btn-danger flex items-center justify-center space-x-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            {/* Spacer to prevent content from going under navbar */}
            <div className="h-20"></div>
        </>
    );
};

export default Navbar;
