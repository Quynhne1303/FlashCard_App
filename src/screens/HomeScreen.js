import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import { IconButton } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import { logout } from "../services/authService";
import { getFlashcards } from "../services/flashcardService";

// 👉 Thêm import này để tránh lỗi ReferenceError
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function HomeScreen({ navigation }) {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="logout"
          size={24}
          onPress={async () => {
            try {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            } catch (error) {
              Alert.alert("Lỗi đăng xuất", error.message);
            }
          }}
        />
      ),
    });
  }, [navigation]);

  // 👉 Xoá useEffect nếu không cần kiểm tra user nữa (vì đã làm ở App.js)
  /*
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || !user.emailVerified) {
        navigation.replace("Login");
      }
    });

    return () => unsubscribe();
  }, []);
  */

  useEffect(() => {
    if (isFocused) {
      fetchFlashcards();
    }
  }, [isFocused]);

  const fetchFlashcards = async () => {
    try {
      const cards = await getFlashcards();
      setFlashcards(cards);
    } catch (error) {
      Alert.alert("Lỗi tải dữ liệu", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Đang tải bộ thẻ...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button
        title="Thêm bộ thẻ"
        onPress={() => navigation.navigate("AddDeck")}
      />
      {flashcards.length === 0 ? (
        <Text style={{ fontSize: 18, paddingVertical: 10 }}>
          Chưa có bộ thẻ nào. Hãy tạo mới một bộ thẻ!
        </Text>
      ) : (
        <FlatList
          data={flashcards}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("DeckDetail", { deck: item })
              }
            >
              <Text style={{ fontSize: 18, paddingVertical: 10 }}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
