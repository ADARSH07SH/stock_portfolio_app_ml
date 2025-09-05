import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getStockHoldings } from "../../api/StockData";
import { useNavigation } from "@react-navigation/native";

export default function Dashboard({ username }) {
  const [showBalance, setShowBalance] = useState(true);
  const [stockValue, setStockValue] = useState(0);
  const [growthPercent, setGrowthPercent] = useState(0);
  const [loading, setLoading] = useState(true);

  const mfPercent = 0;
  const othersPercent = 0;

  const navigation = useNavigation();

  useEffect(() => {
    if (!username) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const holdings = await getStockHoldings(username);

        if (!Array.isArray(holdings) || holdings.length === 0) {
          console.warn("No stock holdings found.");
          setStockValue(0);
          setGrowthPercent(0);
          return;
        }

        let total = 0;
        let invested = 0;

        holdings.forEach((item) => {
          total += item.quantity * item.currentPrice;
          invested += item.quantity * item.avgBuyPrice;
        });

        const growth = invested > 0 ? ((total - invested) / invested) * 100 : 0;

        setStockValue(total);
        setGrowthPercent(growth.toFixed(2));
      } catch (err) {
        console.warn("Error loading stock data:", err);
        setStockValue(0);
        setGrowthPercent(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  const totalBalance = stockValue; // Since MF & Others = 0
  const stockPercent = totalBalance > 0 ? 100 : 0;

  return (
    <View className="bg-white rounded-xl p-4 shadow-md space-y-4">
      {/* Header */}
      <View className="flex-row justify-between items-center">
        <Text className="text-xl font-bold text-gray-800">Your Portfolio</Text>
        <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
          <Ionicons
            name={showBalance ? "eye" : "eye-off"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      {/* Balance Row */}
      {loading ? (
        <View className="flex-row justify-center items-center py-4">
          <ActivityIndicator size="small" color="#0000ff" />
          <Text className="ml-2 text-gray-500">Fetching portfolio...</Text>
        </View>
      ) : (
        <View className="flex-row justify-between items-end">
          <View>
            <Text className="text-2xl font-extrabold text-black">
              ₹ {showBalance ? totalBalance.toLocaleString() : "*****"}
            </Text>
          </View>
          <View>
            <Text
              className={`font-semibold ${
                parseFloat(growthPercent) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {growthPercent}% {parseFloat(growthPercent) >= 0 ? "▲" : "▼"}
            </Text>
          </View>
        </View>
      )}

      {/* Bar Graph */}
      <View className="flex-row h-3 rounded-full overflow-hidden bg-gray-200">
        <View className="bg-blue-500" style={{ width: `${stockPercent}%` }} />
      </View>

      {/* Breakdown */}
      <View className="space-y-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-700">Stocks</Text>
          <Text className="text-gray-700">
            ₹ {totalBalance.toFixed(0)} ({stockPercent}%)
          </Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-gray-700">Mutual Funds</Text>
          <Text className="text-gray-700">₹ 0 (0%)</Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-gray-700">Others</Text>
          <Text className="text-gray-700">₹ 0 (0%)</Text>
        </View>
      </View>

      {/* Button */}
      <TouchableOpacity
        className="mt-3 bg-blue-600 rounded-full py-3 items-center"
        onPress={() => navigation.navigate("MainPortfolio", { username })}
      >
        <Text className="text-white font-semibold text-base">
          See Portfolio
        </Text>
      </TouchableOpacity>
    </View>
  );
}
