// services/deckService.js
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { getAuth } from "firebase/auth";

// Hàm lấy danh sách các bộ thẻ
export const getDecks = async () => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error("Chưa đăng nhập");

  const q = query(collection(db, "decks"), where("userId", "==", userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// ✅ Thêm bộ thẻ mới
export const saveDeckTitle = async (title) => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error("Chưa đăng nhập");

  const newDeck = {
    title,
    userId,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "decks"), newDeck);
  return docRef.id;
};

// ✅ Xoá bộ thẻ
export const deleteDeck = async (deckId) => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error("Chưa đăng nhập");

  const deckRef = doc(db, "decks", deckId);
  await deleteDoc(deckRef);
};
