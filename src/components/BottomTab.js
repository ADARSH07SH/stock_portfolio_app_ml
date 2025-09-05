import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  FireIcon,
  SparklesIcon,
  EllipsisHorizontalCircleIcon,
  ChartBarIcon,
} from "react-native-heroicons/outline";

export default function BottomTab() {
  const navigation = useNavigation();
  const route = useRoute(); 
  const currentRoute = route.name;

  const isActive = (routeName) => currentRoute === routeName;
  const activeColor = "#2563eb";
  const inactiveColor = "#222";

  return (
    <View className="flex-row justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
      <TouchableOpacity
        className="items-center"
        onPress={() => navigation.navigate("Home")}
      >
        <HomeIcon
          size={26}
          color={isActive("Home") ? activeColor : inactiveColor}
        />
        <Text
          className={`text-xs mt-1 ${
            isActive("Home") ? "text-blue-700 font-semibold" : ""
          }`}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="items-center"
        onPress={() => navigation.navigate("Search")}
      >
        <MagnifyingGlassIcon
          size={26}
          color={isActive("Search") ? activeColor : inactiveColor}
        />
        <Text
          className={`text-xs mt-1 ${
            isActive("Search") ? "text-blue-700 font-semibold" : ""
          }`}
        >
          Search
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="items-center"
        onPress={() => navigation.navigate("MainPortfolio")}
      >
        <ChartBarIcon
          size={26}
          color={isActive("MainPortfolio") ? activeColor : inactiveColor}
        />
        <Text
          className={`text-xs mt-1 ${
            isActive("MainPortfolio") ? "text-blue-700 font-semibold" : ""
          }`}
        >
          Portfolio
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="items-center"
        onPress={() => navigation.navigate("ML")}
      >
        <SparklesIcon
          size={26}
          color={isActive("ML") ? activeColor : inactiveColor}
        />
        <Text
          className={`text-xs mt-1 ${
            isActive("ML") ? "text-blue-700 font-semibold" : ""
          }`}
        >
          ML
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="items-center"
        onPress={() => navigation.navigate("Trending")}
      >
        <FireIcon
          size={26}
          color={isActive("Trending") ? activeColor : inactiveColor}
        />
        <Text
          className={`text-xs mt-1 ${
            isActive("Trending") ? "text-blue-700 font-semibold" : ""
          }`}
        >
          Trending
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="items-center"
        onPress={() => navigation.navigate("More")}
      >
        <EllipsisHorizontalCircleIcon
          size={26}
          color={isActive("More") ? activeColor : inactiveColor}
        />
        <Text
          className={`text-xs mt-1 ${
            isActive("More") ? "text-blue-700 font-semibold" : ""
          }`}
        >
          More
        </Text>
      </TouchableOpacity>
    </View>
  );
}
