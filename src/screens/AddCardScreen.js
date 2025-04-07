// src/screens/AddCardScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddCardScreen = ({ route, navigation }) => {
  const { deckTitle } = route.params;
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const saveCard = async () => {
    const storedDecks = await AsyncStorage.getItem('decks');
    if (storedDecks) {
      const decks = JSON.parse(storedDecks);
      const deckIndex = decks.findIndex((d) => d.title === deckTitle);
      if (deckIndex !== -1) {
        decks[deckIndex].cards.push({ question, answer });
        await AsyncStorage.setItem('decks', JSON.stringify(decks));
        navigation.goBack();
      }
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
