// src/components/SafeScreen.js
import React from "react";
import { SafeAreaView } from "react-native";

export default function SafeScreen({ children }) {
  return <SafeAreaView className="flex-1 bg-white">{children}</SafeAreaView>;
}
