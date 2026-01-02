import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/home" className="flex items-center gap-2">
                            <div className="text-3xl">📝</div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                BlogApp
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            to="/home"
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to="/write"
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors"
                        >
                            Write Blog
                        </Link>
                        <Link
                            to="/my-blogs"
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors"
                        >
                            My Blogs
                        </Link>
                    </div>

                    {/* User Profile & Logout */}
                    <div className="flex items-center gap-4">
                        {user && (
                            <>
                                <div className="hidden sm:flex items-center gap-3">
                                    <img
                                        src={user.photoURL || 'https://via.placeholder.com/40'}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full border-2 border-blue-500"
                                    />
                                    <div className="hidden lg:block">
                                        <p className="text-sm font-semibold text-gray-800">{user.displayName}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden text-gray-700 hover:text-blue-600 p-2"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden pb-4">
                        <div className="flex flex-col gap-2">
                            <Link
                                to="/home"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-gray-700 hover:bg-blue-50 px-3 py-2 rounded-md font-medium"
                            >
                                Home
                            </Link>
                            <Link
                                to="/write"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-gray-700 hover:bg-blue-50 px-3 py-2 rounded-md font-medium"
                            >
                                Write Blog
                            </Link>
                            <Link
                                to="/my-blogs"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-gray-700 hover:bg-blue-50 px-3 py-2 rounded-md font-medium"
                            >
                                My Blogs
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;