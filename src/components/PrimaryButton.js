
import React from "react";
import { TouchableOpacity, Text } from "react-native";

export default function PrimaryButton({ onPress, title, disabled = false }) {
  return (
    <TouchableOpacity
      className={`w-full py-3 rounded-lg ${
        disabled ? "bg-blue-300" : "bg-blue-600"
      }`}
      onPress={onPress}
      disabled={disabled}
    >
      <Text className="text-white text-center font-semibold text-base">
        {title}
      </Text>
    </TouchableOpacity>
  );
}
