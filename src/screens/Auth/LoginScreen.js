import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { LoginUser } from "../../api/auth";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return;
    }

    const response = await LoginUser(email, password);

    if (response.success) {
      await AsyncStorage.setItem("username", response.user.username);
      navigation.replace("Home");
    } else {
      Alert.alert(
        "Login Failed",
        response.message || "Invalid credentials"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center items-center bg-white px-6"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text className="text-3xl font-extrabold text-blue-600 mb-10">
        Sign In to ASH
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#6B7280"
        className="w-full mb-4 bg-gray-100 px-4 py-3 rounded-lg border border-gray-300 text-black"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#6B7280"
        className="w-full mb-4 bg-gray-100 px-4 py-3 rounded-lg border border-gray-300 text-black"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        onPress={handleLogin}
        className="bg-blue-600 px-4 py-3 rounded-lg w-full mt-2"
      >
        <Text className="text-white text-center font-semibold text-base">
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-5"
        onPress={() => navigation.replace("Signin")}
      >
        <Text className="text-sm text-blue-500">
          Don't have an account? Sign up →
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-5"
        onPress={() => navigation.replace("ChangePassword")}
      >
        <Text className="text-sm text-blue-500">Forgot Password</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
