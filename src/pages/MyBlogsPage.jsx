import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase/config';
import { setBlogs, setLoading } from '../store/blogSlice';
import { deleteBlog, updateBlog } from '../store/blogSlice';

const MyBlogsPage = () => {
    const dispatch = useDispatch();
    const { blogs, loading } = useSelector((state) => state.blog);
    const { user } = useSelector((state) => state.auth);

    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');

    useEffect(() => {
        if (!user?.uid) {
            dispatch(setBlogs([]));
            return;
        }

        dispatch(setLoading());

        // এখানে চেঞ্জ: শুধু নিজের uid-এর folder থেকে blog লোড করবে
        const myBlogsRef = ref(database, `blogs/${user.uid}`);

        const unsubscribe = onValue(
            myBlogsRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const blogsArray = Object.keys(data)
                        .map(key => ({
                            id: key,
                            ...data[key]
                        }))
                        .sort((a, b) => b.createdAt - a.createdAt);

                    dispatch(setBlogs(blogsArray));
                    console.log("✅ Blogs loaded:", blogsArray.length);
                } else {
                    dispatch(setBlogs([]));
                    console.log("📭 No blogs yet");
                }
            },
            (error) => {
                console.error("Error:", error);
                alert("Failed to load blogs");
                dispatch(setBlogs([]));
            }
        );

        return () => unsubscribe();
    }, [dispatch, user?.uid]);

    // বাকি কোড একই (formatDate, handleDelete, handleEdit ইত্যাদি)
    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDelete = async (blogId) => {
        if (window.confirm('Are you sure? This cannot be undone.')) {
            try {
                await dispatch(deleteBlog(blogId)).unwrap();
                alert('Blog deleted!');
            } catch (err) {
                alert('Failed to delete');
            }
        }
    };

    const handleEdit = (blog) => {
        setEditingId(blog.id);
        setEditTitle(blog.title);
        setEditContent(blog.content);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditTitle('');
        setEditContent('');
    };

    const handleUpdate = async (blogId) => {
        if (!editTitle.trim() || !editContent.trim()) {
            alert('Title and content required');
            return;
        }

        try {
            await dispatch(updateBlog({
                blogId,
                blogData: { title: editTitle.trim(), content: editContent.trim() }
            })).unwrap();
            alert('Blog updated!');
            setEditingId(null);
        } catch (err) {
            alert('Failed to update');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
                    My Blogs ({blogs.length})
                </h1>

                {loading && (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">Loading your blogs...</p>
                    </div>
                )}

                {!loading && blogs.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-lg shadow">
                        <div className="text-8xl mb-6">📝</div>
                        <h2 className="text-3xl font-bold mb-4">No blogs yet</h2>
                        <p className="text-gray-600 mb-8 text-lg">Start writing your private thoughts!</p>
                        <Link to="/write" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-blue-700">
                            Write Your First Blog
                        </Link>
                    </div>
                )}

                {!loading && blogs.length > 0 && (
                    <div className="space-y-8">
                        {blogs.map(blog => (
                            <div key={blog.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-8">
                                {editingId === blog.id ? (
                                    <div>
                                        <input
                                            value={editTitle}
                                            onChange={e => setEditTitle(e.target.value)}
                                            className="w-full text-3xl font-bold mb-4 px-4 py-2 border-2 border-blue-300 rounded-lg"
                                        />
                                        <textarea
                                            value={editContent}
                                            onChange={e => setEditContent(e.target.value)}
                                            rows="10"
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4"
                                        />
                                        <div className="flex gap-4">
                                            <button onClick={() => handleUpdate(blog.id)} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
                                                Save Changes
                                            </button>
                                            <button onClick={handleCancelEdit} className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <h2 className="text-3xl font-bold text-gray-800">{blog.title}</h2>
                                            <div className="flex gap-3">
                                                <button onClick={() => handleEdit(blog)} className="text-blue-600 hover:bg-blue-100 p-3 rounded-lg text-xl">✏️</button>
                                                <button onClick={() => handleDelete(blog.id)} className="text-red-600 hover:bg-red-100 p-3 rounded-lg text-xl">🗑️</button>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap mb-6">{blog.content}</p>
                                        <div className="text-sm text-gray-500 border-t pt-4">
                                            Created: {formatDate(blog.createdAt)}
                                            {blog.updatedAt && blog.updatedAt > blog.createdAt && <span> | Updated: {formatDate(blog.updatedAt)}</span>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBlogsPage;