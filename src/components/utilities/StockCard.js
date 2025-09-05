// src/components/StockCard.js
import React from "react";
import { View, Text } from "react-native";

export default function StockCard({ symbol, name, price, change }) {
  return (
    <View className="p-4 bg-white rounded-lg shadow-sm mb-3 flex-row items-center justify-between">
      <View>
        <Text className="font-bold text-lg">{symbol}</Text>
        <Text className="text-gray-500">{name}</Text>
      </View>
      <View className="items-end">
        <Text className="font-semibold text-base">${price}</Text>
        <Text
          className={`text-sm ${
            change >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {change >= 0 ? "+" : ""}
          {change}%
        </Text>
      </View>
    </View>
  );
}
