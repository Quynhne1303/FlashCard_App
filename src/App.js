import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/firebase/firebaseConfig'; // Đảm bảo import đúng firebaseConfig

import HomeScreen from './src/screens/HomeScreen';
import AddDeckScreen from './src/screens/AddDeckScreen';
import DeckDetailScreen from './src/screens/DeckDetailScreen';
import AddCardScreen from './src/screens/AddCardScreen';
import StudyScreen from './src/screens/StudyScreen';
import LoginScreen from './src/screens/LoginScreen'; // Thêm màn hình đăng nhập

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null); // Lưu trạng thái người dùng

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập người dùng
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Cập nhật user khi trạng thái thay đổi
    });

    return () => unsubscribe(); // Dọn dẹp khi component unmount
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Home' : 'Login'}>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AddDeck" component={AddDeckScreen} />
            <Stack.Screen name="DeckDetail" component={DeckDetailScreen} />
            <Stack.Screen name="AddCard" component={AddCardScreen} />
            <Stack.Screen name="Study" component={StudyScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
