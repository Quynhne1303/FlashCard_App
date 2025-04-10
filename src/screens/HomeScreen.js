import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert,
  Keyboard,
} from 'react-native';
import { getDecks, saveDeckTitle, deleteDeck } from '../services/deckService';
import Deck from '../components/Deck';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import { Menu, Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = () => {
  const [decks, setDecks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    loadDecks();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Icon
              name="dots-vertical"
              size={24}
              style={{ marginRight: 10 }}
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item onPress={() => {
            setMenuVisible(false);
            navigation.navigate("Stats");
          }} title="📈 Thống kê" />
          <Menu.Item onPress={handleLogout} title="🚪 Đăng xuất" />
        </Menu>
      ),
      headerShown: true,
      title: "Trang chủ"
    });
  }, [navigation, menuVisible]);

  const loadDecks = async () => {
    try {
      const data = await getDecks();
      setDecks(data);
    } catch (error) {
      Alert.alert('Lỗi khi tải bộ thẻ', error.message);
    }
  };

  const addDeck = async () => {
    if (!title.trim()) {
      Alert.alert('Vui lòng nhập tên bộ thẻ.');
      return;
    }

    setLoading(true);
    Keyboard.dismiss();

    try {
      await saveDeckTitle(title);
      setTitle('');
      await loadDecks();
      Alert.alert('Đã thêm bộ thẻ mới!');
    } catch (error) {
      Alert.alert('Lỗi khi thêm bộ thẻ', error.message);
    }

    setLoading(false);
  };

  const confirmDeleteDeck = (deck) => {
    Alert.alert(
      'Xác nhận xoá',
      `Bạn có chắc muốn xoá bộ thẻ "${deck.title}"?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDeck(deck.id);
              await loadDecks();
              Alert.alert('Đã xoá bộ thẻ!');
            } catch (error) {
              Alert.alert('Lỗi khi xoá bộ thẻ', error.message);
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    setMenuVisible(false);
    try {
      await signOut(getAuth());
    } catch (error) {
      Alert.alert('Lỗi khi đăng xuất', error.message);
    }
  };

  return (
    <Provider>
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 10 }}>
          Danh sách bộ thẻ
        </Text>

        <FlatList
          data={decks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Deck
              title={item.title}
              onPress={() => navigation.navigate('DeckDetail', { deck: item })}
              onLongPress={() => confirmDeleteDeck(item)}
            />
          )}
          ListEmptyComponent={<Text>Không có bộ thẻ nào.</Text>}
          contentContainerStyle={{ gap: 10 }}
        />

        <TextInput
          placeholder="Nhập tên bộ thẻ mới"
          value={title}
          onChangeText={setTitle}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            marginTop: 20,
            borderRadius: 8,
          }}
        />

        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 10 }} />
        ) : (
          <Text
            onPress={addDeck}
            style={{
              backgroundColor: '#2196F3',
              color: 'white',
              textAlign: 'center',
              padding: 12,
              borderRadius: 8,
              marginTop: 10,
              fontWeight: 'bold',
            }}
          >
            ➕ Thêm bộ thẻ
          </Text>
        )}
      </View>
    </Provider>
  );
};

export default HomeScreen;
