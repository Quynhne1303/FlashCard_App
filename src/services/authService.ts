import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

// Đăng ký và gửi email xác minh
export const signUp = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(userCredential.user);
  return userCredential;
};

// Đăng nhập (kèm kiểm tra email đã xác minh)
export const signIn = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);

  // Nếu bạn muốn ngăn user chưa xác minh đăng nhập vào app:
  if (!userCredential.user.emailVerified) {
    throw new Error('Email chưa được xác minh. Vui lòng kiểm tra hộp thư.');
  }

  return userCredential;
};

// Gửi lại email xác minh
export const resendVerification = async () => {
  if (auth.currentUser && !auth.currentUser.emailVerified) {
    await sendEmailVerification(auth.currentUser);
  }
};

// Gửi email đặt lại mật khẩu
export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

// Đăng xuất
export const logout = async () => {
  await signOut(auth);
};
