// screens/MainPortfolioScreen.js

import React, { useEffect, useState } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import TopBar from "../../components/TopBar";
import BottomTab from "../../components/BottomTab";
import StockPortfolioScreen from "./StockPortfolioScreen";
import MFPortfolioScreen from "./MFPortfolioScreen";
import OtherPortfolioScreen from "./OtherPortfolioScreen";

export default function MainPortfolioScreen() {
  const layout = useWindowDimensions();
  const [username, setUsername] = useState(null);
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: "stock", title: "Stock" },
    { key: "mf", title: "Mutual Funds" },
    { key: "other", title: "Other Assets" },
  ]);

  useEffect(() => {
    const loadUsername = async () => {
      const stored = await AsyncStorage.getItem("username");
      if (stored) setUsername(stored);
    };
    loadUsername();
  }, []);

  const renderScene = SceneMap({
    stock: () => <StockPortfolioScreen username={username} />,
    mf: () => <MFPortfolioScreen username={username} />,
    other: () => <OtherPortfolioScreen username={username} />,
  });

  return (
    <View className="flex-1 bg-white">
      <TopBar />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        lazy
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "#2563EB" }}
            style={{ backgroundColor: "white" }}
            labelStyle={{ color: "black", fontWeight: "bold" }}
            activeColor="#2563EB"
            inactiveColor="#6B7280" 
          />
        )}
      />

      <BottomTab />
    </View>
  );
}
