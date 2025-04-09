// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBfeZbv0sWwRHdrVAbmEA4i6p-4D0hl03g",
  authDomain: "khang-a98ec.firebaseapp.com",
  projectId: "khang-a98ec",
  storageBucket: "khang-a98ec.appspot.com",
  messagingSenderId: "77513894336",
  appId: "1:77513894336:android:aa9146f84f72dcebf40025",
  databaseURL: "https://khang-a98ec-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Export các dịch vụ Firebase
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
