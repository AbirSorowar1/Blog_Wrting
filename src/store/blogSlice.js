import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ref, push, set, remove, update } from 'firebase/database';
import { database } from '../firebase/config';

// Helper to get user blogs path
const getUserBlogsRef = (uid) => ref(database, `blogs/${uid}`);

// Add new blog
export const addBlog = createAsyncThunk(
    'blog/addBlog',
    async (blogData, { getState, rejectWithValue }) => {
        const uid = getState().auth.user?.uid;
        if (!uid) return rejectWithValue('No user logged in');

        try {
            const userBlogsRef = getUserBlogsRef(uid);
            const newBlogRef = push(userBlogsRef);

            const newBlog = {
                title: blogData.title,
                content: blogData.content,
                author: blogData.author || 'Anonymous',
                authorEmail: blogData.authorEmail || null,
                authorPhoto: blogData.authorPhoto || null,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };

            await set(newBlogRef, newBlog);
            return { id: newBlogRef.key, ...newBlog };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Delete blog
export const deleteBlog = createAsyncThunk(
    'blog/deleteBlog',
    async (blogId, { getState, rejectWithValue }) => {
        const uid = getState().auth.user?.uid;
        if (!uid) return rejectWithValue('No user');

        try {
            const blogRef = ref(database, `blogs/${uid}/${blogId}`);
            await remove(blogRef);
            return blogId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Update blog
export const updateBlog = createAsyncThunk(
    'blog/updateBlog',
    async ({ blogId, blogData }, { getState, rejectWithValue }) => {
        const uid = getState().auth.user?.uid;
        if (!uid) return rejectWithValue('No user');

        try {
            const blogRef = ref(database, `blogs/${uid}/${blogId}`);
            const updatedData = {
                title: blogData.title,
                content: blogData.content,
                updatedAt: Date.now(),
            };
            await update(blogRef, updatedData);
            return { id: blogId, ...updatedData };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const blogSlice = createSlice({
    name: 'blog',
    initialState: {
        blogs: [],
        loading: false,
        error: null,
        actionLoading: false,
    },
    reducers: {
        clearError: (state) => { state.error = null; },
        setBlogs: (state, action) => {
            state.blogs = action.payload;
            state.loading = false;
        },
        setLoading: (state) => { state.loading = true; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addBlog.pending, (state) => { state.actionLoading = true; })
            .addCase(addBlog.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.blogs.unshift(action.payload);
            })
            .addCase(addBlog.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteBlog.fulfilled, (state, action) => {
                state.blogs = state.blogs.filter(b => b.id !== action.payload);
            })
            .addCase(updateBlog.fulfilled, (state, action) => {
                const index = state.blogs.findIndex(b => b.id === action.payload.id);
                if (index !== -1) {
                    state.blogs[index] = { ...state.blogs[index], ...action.payload };
                }
            });
    },
});

export const { clearError, setBlogs, setLoading } = blogSlice.actions;
export default blogSlice.reducer;