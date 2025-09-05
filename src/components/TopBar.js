import { useNavigation ,useRoute} from "@react-navigation/native";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  BellIcon,
  BookmarkIcon,
  UserCircleIcon,
  ChartBarIcon,
} from "react-native-heroicons/outline";

export default function TopBar() {
  const navigation = useNavigation();
  const route = useRoute();

  const isProfile=route.name === "Profile";

  return (
    <View className="flex-row items-center justify-between px-4 pt-10 pb-3 bg-white">
      {/* App Name */}
      <Text className="text-2xl font-bold text-yellow-900">ASH</Text>

      {/* Top-right Icons */}
      <View className="flex-row items-center space-x-4">
        <TouchableOpacity>
          <BellIcon size={26} color="#222" />
        </TouchableOpacity>

        <TouchableOpacity>
          <BookmarkIcon size={26} color="#222" />
        </TouchableOpacity>

        <TouchableOpacity>
          <ChartBarIcon size={26} color="#222" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          navigation.navigate("Profile")
        }}>
          <UserCircleIcon size={28} color="#222" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
