import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
    const footerLinks = {
        quickLinks: [
            { name: 'Home', path: '/' },
            { name: 'Report Issue', path: '/report-issue' },
            { name: 'Track Issue', path: '/track-issue' },
            { name: 'About Us', path: '/about' },
        ],
        support: [
            { name: 'Contact Us', path: '/contact' },
            { name: 'FAQs', path: '/faq' },
            { name: 'Privacy Policy', path: '/privacy' },
            { name: 'Terms of Service', path: '/terms' },
        ],
    };

    const socialLinks = [
        { Icon: Facebook, href: '#', label: 'Facebook' },
        { Icon: Twitter, href: '#', label: 'Twitter' },
        { Icon: Instagram, href: '#', label: 'Instagram' },
        { Icon: Linkedin, href: '#', label: 'LinkedIn' },
    ];

    return (
        <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold text-white">CivicConnect</span>
                        </div>
                        <p className="text-gray-400 mb-6 max-w-md">
                            Empowering citizens to report issues, track progress, and collaborate with local authorities to build cleaner, safer, and more efficient communities. Together, we create impactful change—one report at a time.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3 text-sm">
                                <Mail className="w-4 h-4 text-blue-400" />
                                <a href="mailto:support@civicconnect.com" className="hover:text-blue-400 transition-colors">
                                    support@civicconnect.com
                                </a>
                            </div>
                            <div className="flex items-center space-x-3 text-sm">
                                <Phone className="w-4 h-4 text-blue-400" />
                                <span>+91 98765 43210</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm">
                                <MapPin className="w-4 h-4 text-blue-400" />
                                <span>Municipal Office, India</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {footerLinks.quickLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Social Links & Copyright */}
                <div className="pt-8 border-t border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-4">
                            {socialLinks.map(({ Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                        <p className="text-sm text-gray-400">
                            Copyright © {new Date().getFullYear()} <span className="text-white font-medium">CivicConnect</span>. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;