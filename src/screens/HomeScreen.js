import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity } from 'react-native';
import { db, auth } from '../firebase/firebaseConfig'; // Đảm bảo đã import db và auth từ firebaseConfig
import { collection, query, where, getDocs } from 'firebase/firestore';

const HomeScreen = ({ navigation }) => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDecks = async () => {
      // Kiểm tra xem người dùng đã đăng nhập chưa
      if (!auth.currentUser) {
        navigation.navigate('Login'); // Điều hướng về màn hình login nếu người dùng chưa đăng nhập
        return;
      }

      // Truy vấn Firestore để lấy bộ thẻ của người dùng hiện tại
      const q = query(collection(db, 'decks'), where('userId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);

      // Chuyển đổi dữ liệu từ Firestore thành mảng các bộ thẻ
      const loadedDecks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setDecks(loadedDecks);
      setLoading(false); // Đánh dấu hoàn tất tải dữ liệu
    };

    fetchDecks();
  }, [navigation]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Đang tải bộ thẻ...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Thêm bộ thẻ" onPress={() => navigation.navigate('AddDeck')} />
      {decks.length === 0 ? (
        <Text style={{ fontSize: 18, paddingVertical: 10 }}>Chưa có bộ thẻ nào. Hãy tạo mới một bộ thẻ!</Text>
      ) : (
        <FlatList
          data={decks}
          keyExtractor={(item) => item.id} // Sử dụng `id` làm key
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('DeckDetail', { deck: item })}>
              <Text style={{ fontSize: 18, paddingVertical: 10 }}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default HomeScreen;
