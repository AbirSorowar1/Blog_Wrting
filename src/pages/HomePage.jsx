import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const HomePage = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                    Welcome, {user?.displayName || 'Writer'}!
                </h1>
                <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                </p>

                <div className="flex justify-center gap-6 flex-wrap">
                    <Link
                        to="/write"
                        className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
                    >
                        ✍️ Write New Blog
                    </Link>
                    <Link
                        to="/my-blogs"
                        className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition shadow-lg"
                    >
                        📚 My Blogs
                    </Link>
                </div>

                <div className="mt-16 text-gray-500">
                    <p>Total blogs you have written will appear in "My Blogs"</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;