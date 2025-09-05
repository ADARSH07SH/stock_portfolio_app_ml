// screens/OtherPortfolioScreen.js

import React from "react";
import { View, Text } from "react-native";
import TopBar from "../../components/TopBar";
import BottomTab from "../../components/BottomTab";

const OtherPortfolioScreen = () => {
  return (
    <View className="flex-1 bg-white">
      
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg font-bold">Other Assets</Text>
        <Text className="text-gray-600">
          Crypto, Real Estate, Gold etc. Coming Soon
        </Text>
      </View>
      
    </View>
  );
};

export default OtherPortfolioScreen;
