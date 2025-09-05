import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { getChartData } from "../api/ChartData";

export default function NiftySensexDashboard() {
  const navigation = useNavigation();
  const [nifty, setNifty] = useState(null);
  const [sensex, setSensex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marketMood, setMarketMood] = useState({ label: "", color: "", time: "" });

  const fetchIndexes = async () => {
    setLoading(true);
    try {
      const niftyData = await getChartData("NSE:NIFTY50-INDEX", "1D");
      const sensexData = await getChartData("BSE:SENSEX-INDEX", "1D");

      const formatIndex = (name, symbol, candles) => {
        if (!candles || candles.length === 0) return null;
        const first = candles[0];
        const last = candles[candles.length - 1];
        const open = first[1];
        const close = last[4];
        const changePercent = ((close - open) / open) * 100;
        return { name, symbol, value: close, change: Number(changePercent.toFixed(2)) };
      };

      const niftyIndex = formatIndex("NIFTY 50", "NSE:NIFTY50-INDEX", niftyData.candles);
      const sensexIndex = formatIndex("SENSEX", "BSE:SENSEX-INDEX", sensexData.candles);

      setNifty(niftyIndex);
      setSensex(sensexIndex);

      const bothDown = niftyIndex?.change < 0 && sensexIndex?.change < 0;
      const bothUp = niftyIndex?.change > 0 && sensexIndex?.change > 0;
      const mood = bothDown
        ? { label: "Fear", color: "text-red-500" }
        : bothUp
        ? { label: "Greed", color: "text-green-500" }
        : { label: "Neutral", color: "text-yellow-500" };

      setMarketMood({ ...mood, time: new Date().toLocaleTimeString() });
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchIndexes();
  }, []);

  const StatCard = ({ stock }) => {
    if (!stock) return null;
    const UpDownIcon = stock.change >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
    const color = stock.change >= 0 ? "text-green-400" : "text-red-400";

    return (
      <TouchableOpacity
        className="flex-1 items-center mx-1 bg-gray-900 rounded-lg px-3 py-2"
        onPress={() => navigation.navigate("ChartDashboard", { symbol: stock.symbol })}
      >
        <Text className="text-xs text-white">{stock.name}</Text>
        <Text className="text-base font-semibold text-white">{stock.value.toLocaleString()}</Text>
        <View className="flex-row items-center">
          <UpDownIcon size={12} color={stock.change >= 0 ? "green" : "red"} />
          <Text className={`text-xs ml-1 ${color}`}>{stock.change}%</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="p-4 bg-gray-950 flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View className="bg-gray-950 p-4 rounded-lg mb-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-white font-semibold text-base">Market Overview</Text>
        <Text className="text-gray-400 text-xs">{marketMood.time}</Text>
      </View>

      <View className="flex-row justify-between mb-3">
        <StatCard stock={nifty} />
        <StatCard stock={sensex} />
        <View className="flex-1 items-center mx-1 bg-gray-900 rounded-lg px-3 py-2">
          <Text className="text-xs text-white">MARKET MOOD</Text>
          <Text className={`text-sm font-semibold ${marketMood.color}`}>{marketMood.label}</Text>
        </View>
      </View>
    </View>
  );
}
