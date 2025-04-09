import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { signIn, resendVerification } from "../services/authService";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      const userCredential = await signIn(email, password);
      const signedInUser = userCredential.user;

      if (signedInUser.emailVerified) {
        Alert.alert("✅ Đăng nhập thành công!");
        // KHÔNG cần navigation ở đây nữa
      } else {
        setUser(signedInUser);
        Alert.alert(
          "⚠️ Email chưa xác minh",
          "Vui lòng kiểm tra hộp thư của bạn."
        );
      }
    } catch (error) {
      Alert.alert("❌ Lỗi", error.message);
    }
  };

  const handleResendVerification = async () => {
    try {
      await resendVerification();
      Alert.alert("📧 Đã gửi lại email xác minh!");
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text variant="headlineMedium" style={styles.title}>
          🔐 Đăng nhập
        </Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          contentStyle={{ paddingVertical: 6 }}
        >
          Đăng nhập
        </Button>

        <Button
          onPress={() => navigation.navigate("Signup")}
          style={styles.link}
        >
          Chưa có tài khoản? Đăng ký
        </Button>

        <Button
          onPress={() => navigation.navigate("ForgotPassword")}
          style={styles.link}
        >
          Quên mật khẩu?
        </Button>

        {user && !user.emailVerified && (
          <Button
            mode="outlined"
            onPress={handleResendVerification}
            style={styles.resendBtn}
            contentStyle={{ paddingVertical: 4 }}
          >
            Gửi lại email xác minh
          </Button>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f6ff",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  title: { textAlign: "center", marginBottom: 24 },
  input: { marginBottom: 16 },
  button: { marginTop: 8, borderRadius: 8 },
  link: { marginTop: 8 },
  resendBtn: { marginTop: 12, borderRadius: 8 },
});
