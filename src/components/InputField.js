import React from "react";
import { TextInput } from "react-native";

export default function InputField({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  ...props
}) {
  return (
    <TextInput
      className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 text-base mb-3"
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize="none"
      {...props}
    />
  );
}
