// src/screens/StudyScreen.js
import React, { useEffect, useState } from 'react';
import { View, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashCard from '../components/FlashCard';

const StudyScreen = ({ route }) => {
  const { deckTitle } = route.params;
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchDeck = async () => {
      const stored = await AsyncStorage.getItem('decks');
      const decks = JSON.parse(stored);
      const deck = decks.find((d) => d.title === deckTitle);
      setCards(deck.cards);
    };
    fetchDeck();
  }, []);

  if (cards.length === 0) return <Text style={{ padding: 20 }}>Không có thẻ nào.</Text>;

  const card = cards[index];

  return (
    <View style={{ flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
      <FlashCard question={card.question} answer={card.answer} />
      {index < cards.length - 1 && (
        <Button title="Tiếp theo" onPress={() => setIndex(index + 1)} />
      )}
    </View>
  );
};

export default StudyScreen;
