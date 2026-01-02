import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// ⚠️ Replace with your Firebase config from Firebase Console
// Project Settings → General → Your apps → SDK setup and configuration
const firebaseConfig = {
    apiKey: "AIzaSyCEch70JHvMOgoqffyR817TPbRYlOLX0qY",
    authDomain: "testing-156f5.firebaseapp.com",
    databaseURL: "https://testing-156f5-default-rtdb.firebaseio.com",
    projectId: "testing-156f5",
    storageBucket: "testing-156f5.firebasestorage.app",
    messagingSenderId: "675074149800",
    appId: "1:675074149800:web:382be7694de5342867619d",
    measurementId: "G-L8L7Y3HLSW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const database = getDatabase(app);