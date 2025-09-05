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
import { SendOtp, VerifyOtp, ResetPassword } from "../../api/auth";
import { useNavigation } from "@react-navigation/native";

export default function ChangePasswordScreen() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigation = useNavigation();

  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert("Validation Error", "Please enter your email");
      return;
    }
    const response = await SendOtp(email);
    if (response.success) {
      Alert.alert("Success", "OTP sent to your email");
      setStep(2);
    } else {
      Alert.alert("Error", response.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert("Validation Error", "Please enter OTP");
      return;
    }
    const response = await VerifyOtp(email, otp);
    if (response.success) {
      Alert.alert("Success", "OTP verified");
      setStep(3);
    } else {
      Alert.alert("Error", response.message || "Invalid OTP");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      Alert.alert("Validation Error", "Please enter new password");
      return;
    }
    const response = await ResetPassword(email, newPassword);
    if (response.success) {
      Alert.alert("Success", "Password reset successfully");
      navigation.replace("Login");
    } else {
      Alert.alert("Error", response.message || "Failed to reset password");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center items-center bg-white px-6"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text className="text-2xl font-bold text-blue-600 mb-6">
        Reset Password
      </Text>

      {step === 1 && (
        <>
          <TextInput
            placeholder="Enter your email"
            className="w-full mb-4 bg-gray-100 px-4 py-3 rounded-lg border border-gray-300"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity
            onPress={handleSendOtp}
            className="bg-blue-600 px-4 py-3 rounded-lg w-full"
          >
            <Text className="text-white text-center font-semibold">
              Send OTP
            </Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <TextInput
            placeholder="Enter OTP"
            className="w-full mb-4 bg-gray-100 px-4 py-3 rounded-lg border border-gray-300"
            keyboardType="numeric"
            value={otp}
            onChangeText={setOtp}
          />
          <TouchableOpacity
            onPress={handleVerifyOtp}
            className="bg-blue-600 px-4 py-3 rounded-lg w-full"
          >
            <Text className="text-white text-center font-semibold">
              Verify OTP
            </Text>
          </TouchableOpacity>
        </>
      )}

      {step === 3 && (
        <>
          <TextInput
            placeholder="Enter new password"
            className="w-full mb-4 bg-gray-100 px-4 py-3 rounded-lg border border-gray-300"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity
            onPress={handleResetPassword}
            className="bg-blue-600 px-4 py-3 rounded-lg w-full"
          >
            <Text className="text-white text-center font-semibold">
              Reset Password
            </Text>
          </TouchableOpacity>
        </>
      )}
    </KeyboardAvoidingView>
  );
}
