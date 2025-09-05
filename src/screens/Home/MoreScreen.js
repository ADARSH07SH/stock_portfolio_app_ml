import React from "react";
import { View, Text } from "react-native";
import TopBar from "../../components/TopBar";
import BottomTab from "../../components/BottomTab";

export default function MoreScreen() {
  return (
    <View style={{ flex: 1 }}>
      <TopBar />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16 }}>More Features Coming Soon</Text>
      </View>
      <BottomTab />
    </View>
  );
}
