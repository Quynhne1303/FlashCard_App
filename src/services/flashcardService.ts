import { getDatabase, ref, push, set, update, remove, get,child } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { Flashcard } from '../types/types';



  
export const createFlashcard = async (front: string, back: string) => {
    const db = getDatabase();
    const userId = getAuth().currentUser?.uid;
    if (!userId) throw new Error('Chưa đăng nhập');
  
    const newRef = push(ref(db, `flashcards/${userId}`));
  
    const newCard = {
      id: newRef.key!,
      front,
      back,
      createdAt: Date.now(),
      userId,
    };
  
    await set(newRef, newCard); // ✅ dùng `set()` từ firebase
  };
 

  export const updateFlashcard = async (cardId: string, updatedData: { front: string; back: string }) => {
    const db = getDatabase();
    const userId = getAuth().currentUser?.uid;
    if (!userId) throw new Error('Chưa đăng nhập');
  
    const cardRef = ref(db, `flashcards/${userId}/${cardId}`);
    await update(cardRef, updatedData); // Cập nhật front và back
  };
  
  export const deleteFlashcard = async (cardId: string) => {
    const db = getDatabase();
    const userId = getAuth().currentUser?.uid;
    if (!userId) throw new Error('Chưa đăng nhập');
  
    const cardRef = ref(db, `flashcards/${userId}/${cardId}`);
    await remove(cardRef);
  };

  export const getFlashcards = async (): Promise<Flashcard[]> => {
    const dbRef = ref(getDatabase());
    const userId = getAuth().currentUser?.uid;
    if (!userId) throw new Error('Chưa đăng nhập');
  
    const snapshot = await get(child(dbRef, `flashcards/${userId}`));
  
    if (!snapshot.exists()) return [];
  
    const data = snapshot.val();
    return Object.values(data) as Flashcard[];
  };