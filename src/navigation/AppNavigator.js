import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/Home/HomeScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import SigninScreen from "../screens/Auth/SigninScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";

import MainPortfolioScreen from "../screens/Portfolio/MainPortfolioScreen";
import StockPortfolioScreen from "../screens/Portfolio/StockPortfolioScreen";
import MFPortfolioScreen from "../screens/Portfolio/MFPortfolioScreen";
import OtherPortfolioScreen from "../screens/Portfolio/OtherPortfolioScreen";
import IndividualStockScreen from "../screens/Portfolio/IndividualStockScreen";

// NEW Screens
import SearchScreen from "../screens/Home/SearchScreen";
import MLStrategyScreen from "../screens/Home/MLStrategyScreen";
import TrendingScreen from "../screens/Home/TrendingScreen";
import MoreScreen from "../screens/Home/MoreScreen";
import ChangePassword from "../screens/Auth/ChangePassword";

import ChartDashboard from "../screens/Home/ChartDashboard";
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="Signin" component={SigninScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />

        {/* Portfolio Screens */}
        <Stack.Screen name="MainPortfolio" component={MainPortfolioScreen} />
        <Stack.Screen name="ChartDashboard" component={ChartDashboard} />
        <Stack.Screen name="StockPortfolio" component={StockPortfolioScreen} />
        <Stack.Screen name="MFPortfolio" component={MFPortfolioScreen} />
        <Stack.Screen name="OtherPortfolio" component={OtherPortfolioScreen} />
        <Stack.Screen
          name="IndividualStock"
          component={IndividualStockScreen}
        />

        {/* New Navigation Targets */}
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="ML" component={MLStrategyScreen} />
        <Stack.Screen name="Trending" component={TrendingScreen} />
        <Stack.Screen name="More" component={MoreScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
