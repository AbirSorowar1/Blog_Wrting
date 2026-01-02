import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { addBlog } from '../store/blogSlice';

const WriteBlogPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { actionLoading } = useSelector((state) => state.blog);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!title.trim()) {
            newErrors.title = 'Title is required';
        } else if (title.trim().length < 5) {
            newErrors.title = 'Title must be at least 5 characters';
        }

        if (!content.trim()) {
            newErrors.content = 'Content is required';
        } else if (content.trim().length < 50) {
            newErrors.content = 'Content must be at least 50 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const blogData = {
            title: title.trim(),
            content: content.trim(),
            author: user?.displayName || 'Anonymous',
            authorId: user?.uid,
            authorEmail: user?.email || null,
            authorPhoto: user?.photoURL || null,
        };

        try {
            await dispatch(addBlog(blogData)).unwrap();

            alert('🎉 Blog published successfully!');

            setTitle('');
            setContent('');
            setErrors({});

            navigate('/my-blogs');
        } catch (error) {
            console.error('Failed to publish blog:', error);
            alert('❌ Failed to publish blog. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                        Write a New Blog
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Your thoughts and stories will be kept private — only you can see them
                    </p>
                </div>

                {/* Blog Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 md:p-8">
                    {/* Title Input */}
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-gray-700 font-semibold mb-2 text-lg">
                            Blog Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`w-full px-4 py-3 border ${errors.title ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg`}
                            placeholder="Enter an engaging title for your blog"
                        />
                        {errors.title && (
                            <p className="mt-2 text-red-500 text-sm">{errors.title}</p>
                        )}
                        <p className="mt-2 text-gray-500 text-sm">
                            {title.length} characters
                        </p>
                    </div>

                    {/* Content Textarea */}
                    <div className="mb-6">
                        <label htmlFor="content" className="block text-gray-700 font-semibold mb-2 text-lg">
                            Blog Content
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="12"
                            className={`w-full px-4 py-3 border ${errors.content ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg resize-none`}
                            placeholder="Write your thoughts, experiences, or stories here..."
                        />
                        {errors.content && (
                            <p className="mt-2 text-red-500 text-sm">{errors.content}</p>
                        )}
                        <p className="mt-2 text-gray-500 text-sm">
                            {content.length} characters {content.length >= 50 && '✓'}
                        </p>
                    </div>

                    {/* Preview Section */}
                    {(title || content) && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Preview:</h3>
                            {title && <h4 className="text-xl font-bold text-gray-800 mb-2">{title}</h4>}
                            {content && <p className="text-gray-600 whitespace-pre-wrap">{content.substring(0, 200)}...</p>}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={actionLoading}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {actionLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Publishing...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    <span>Publish Blog</span>
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/my-blogs')}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WriteBlogPage;