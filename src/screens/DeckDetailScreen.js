// src/screens/DeckDetailScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DeckDetailScreen = ({ route, navigation }) => {
  const { deck } = route.params;
  const [cards, setCards] = useState(deck.cards);

  useEffect(() => {
    const fetchDecks = async () => {
      const storedDecks = await AsyncStorage.getItem('decks');
      if (storedDecks) {
        const decks = JSON.parse(storedDecks);
        const updatedDeck = decks.find((d) => d.title === deck.title);
        setCards(updatedDeck.cards);
      }
    };
    const unsubscribe = navigation.addListener('focus', fetchDecks);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>{deck.title}</Text>
      <FlatList
        data={cards}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <Text style={{ paddingVertical: 5 }}>• {item.question}</Text>}
      />
      <Button title="Thêm thẻ" onPress={() => navigation.navigate('AddCard', { deckTitle: deck.title })} />
      <Button title="Bắt đầu học" onPress={() => navigation.navigate('Study', { deckTitle: deck.title })} />
    </View>
  );
};

export default DeckDetailScreen;