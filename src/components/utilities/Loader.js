// src/components/Loader.js
import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function Loader({ size = "large" }) {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size={size} color="#2563eb" />
    </View>
  );
}
