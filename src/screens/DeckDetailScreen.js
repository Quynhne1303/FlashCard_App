// src/screens/DeckDetailScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getFlashcardsByDeck, deleteFlashcard } from '../services/flashcardService';

const DeckDetailScreen = ({ route, navigation }) => {
  const { deck } = route.params;
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const flashcards = await getFlashcardsByDeck(deck.id);
        setCards(flashcards);
      } catch (error) {
        Alert.alert("Lỗi tải thẻ", error.message);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchCards);
    return unsubscribe;
  }, [navigation, deck.id]);

  const handleLongPress = (card) => {
    Alert.alert(
      'Tùy chọn thẻ',
      `Bạn muốn làm gì với thẻ "${card.front}"?`,
      [
        {
          text: '📝 Chỉnh sửa',
          onPress: () => navigation.navigate('EditCard', { card }),
        },
        {
          text: '🗑️ Xoá',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFlashcard(card.id);
              setCards((prev) => prev.filter((c) => c.id !== card.id));
              Alert.alert('Đã xoá thẻ.');
            } catch (err) {
              Alert.alert('Lỗi xoá thẻ', err.message);
            }
          },
        },
        { text: 'Huỷ', style: 'cancel' },
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{deck.title}</Text>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => handleLongPress(item)}>
            <Text style={{ paddingVertical: 5 }}>• {item.front}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>Chưa có thẻ nào trong bộ này.</Text>}
      />

      <Button title="➕ Thêm thẻ" onPress={() => navigation.navigate('AddCard', { deckId: deck.id })} />
      <View style={{ height: 10 }} />
      <Button title="📚 Bắt đầu học" onPress={() => navigation.navigate('Study', { deckId: deck.id })} />
      <View style={{ height: 10 }} />
      <Button title="📝 Bắt đầu kiểm tra" onPress={() => navigation.navigate("Quiz", { deckId: deck.id })} />
    </View>
  );
};

export default DeckDetailScreen;

