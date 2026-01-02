import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import blogReducer from './blogSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        blog: blogReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['auth/loginWithGoogle/fulfilled'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload.user'],
                // Ignore these paths in the state
                ignoredPaths: ['auth.user'],
            },
        }),
});