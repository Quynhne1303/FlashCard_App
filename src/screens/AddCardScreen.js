// AddCardScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { createFlashcard } from '../services/flashcardService'; // Thêm dòng này

const AddCardScreen = ({ route, navigation }) => {
  const { deckId } = route.params;
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const saveCard = async () => {
    if (!question.trim() || !answer.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ câu hỏi và câu trả lời.");
      return;
    }

    try {
      await createFlashcard(deckId, question, answer); // Dùng hàm từ flashCardService
      navigation.goBack();
    } catch (error) {
      Alert.alert("Lỗi khi lưu thẻ", error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Câu hỏi" value={question} onChangeText={setQuestion} style={{ borderWidth: 1, marginBottom: 10 }} />
      <TextInput placeholder="Câu trả lời" value={answer} onChangeText={setAnswer} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Button title="Lưu thẻ" onPress={saveCard} />
    </View>
  );
};

export default AddCardScreen;
