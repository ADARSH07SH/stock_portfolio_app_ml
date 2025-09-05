import React, { useEffect, useState } from "react";
import { View, ScrollView, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TopBar from "../../components/TopBar";
import BottomTab from "../../components/BottomTab";
import Dashboard from "./Dashboard";
import NiftySensexDashboard from '../../components/NiftySensexDashboard';
export default function HomeScreen() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const loadUsername = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };
    loadUsername();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <TopBar />
      <ScrollView
        className="flex-1 px-5 py-4"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <Text className="text-lg font-semibold text-gray-700">
          Welcome{username ? `, ${username}` : ""}!
        </Text>
        <NiftySensexDashboard />
        {username ? <Dashboard username={username} /> : null}
      </ScrollView>
      <BottomTab />
    </View>
  );
}
