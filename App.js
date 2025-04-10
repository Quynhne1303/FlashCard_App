import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./src/firebase/firebaseConfig";
import { Provider as PaperProvider, Menu } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View } from "react-native";

// Screens
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AddDeckScreen from "./src/screens/AddDeckScreen";
import DeckDetailScreen from "./src/screens/DeckDetailScreen";
import AddCardScreen from "./src/screens/AddCardScreen";
import StudyScreen from "./src/screens/StudyScreen";
import QuizScreen from "./src/screens/QuizScreen";
import EditCardScreen from "./src/screens/EditCardScreen";
import StatsScreen from "./src/screens/StatsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const MenuButton = ({ navigation }) => (
  <View style={{ alignItems: "flex-end", paddingRight: 5 }}>
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchor={
        <Icon
          name="dots-vertical"
          size={24}
          color="black"
          onPress={() => setMenuVisible(true)}
        />
      }
    >
      <Menu.Item
        onPress={() => {
          setMenuVisible(false);
          navigation.navigate("Stats");
        }}
        title="📈 Thống kê"
      />
      <Menu.Item
        onPress={() => {
          setMenuVisible(false);
          auth.signOut();
        }}
        title="🚪 Đăng xuất"
      />
    </Menu>
  </View>
);


  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={({ navigation }) => ({
            headerShown: true,
            headerBackTitleVisible: false,
            headerTintColor: "black",
            headerBackImage: () => (
              <Icon name="arrow-left" size={24} color="black" style={{ marginLeft: 10 }} />
            ),
            headerRight: () => <MenuButton navigation={navigation} />,
          })}
        >
          {user ? (
            <>
              <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Trang chủ" }} />
              <Stack.Screen name="AddDeck" component={AddDeckScreen} options={{ title: "Thêm bộ thẻ" }} />
              <Stack.Screen name="DeckDetail" component={DeckDetailScreen} options={{ title: "Chi tiết bộ thẻ" }} />
              <Stack.Screen name="AddCard" component={AddCardScreen} options={{ title: "Thêm thẻ mới" }} />
              <Stack.Screen name="Study" component={StudyScreen} options={{ title: "Học" }} />
              <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: "Kiểm tra" }} />
              <Stack.Screen name="EditCard" component={EditCardScreen} options={{ title: "Chỉnh sửa thẻ" }} />
              <Stack.Screen name="Stats" component={StatsScreen} options={{ title: "Thống kê" }} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
