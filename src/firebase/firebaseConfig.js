// src/firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'; // Đảm bảo đã cài đặt package này

const firebaseConfig = {
  apiKey: "AIzaSyCUwcA_LhDhhqo53wbBU5oy3WZGEB3fFI4",
  authDomain: "flashcard-50925.firebaseapp.com",
  projectId: "flashcard-50925",
  storageBucket: "flashcard-50925.firebasestorage.app",
  messagingSenderId: "42413832918",
  appId: "1:42413832918:web:721fb1511d155a5615a777",
  measurementId: "G-70DCBLCZ41"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Cấu hình Auth với AsyncStorage để lưu trạng thái đăng nhập
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage), // Thiết lập lưu trữ trạng thái đăng nhập
});

export { db, auth };
