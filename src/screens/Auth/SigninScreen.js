import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SigninUser } from "../../api/auth";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SigninScreen() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleSignin = async () => {
    if (!email || !password || !fullName) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return;
    }

    const response = await SigninUser(email, password, fullName);

    if (response?.success && response?.user?.username) {
      Alert.alert("Success", "Account created successfully");
      await AsyncStorage.setItem("username", response.user.username);
      navigation.replace("Home");
    } else {
      Alert.alert("Signup Failed", response.message || "Try again later");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center items-center bg-white px-6"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text className="text-3xl font-extrabold text-blue-600 mb-10">
        Create an Account
      </Text>

      <TextInput
        placeholder="Full name"
        placeholderTextColor="#6B7280"
        className="w-full mb-4 bg-gray-100 px-4 py-3 rounded-lg border border-gray-300 text-black"
        value={fullName}
        onChangeText={setFullName}
      />

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
        onPress={handleSignin}
        className="bg-green-600 px-4 py-3 rounded-lg w-full mt-2"
      >
        <Text className="text-white text-center font-semibold text-base">
          Sign Up
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-5"
        onPress={() => navigation.replace("Login")}
      >
        <Text className="text-sm text-blue-500">
          Already have an account? Log in →
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
