import React from "react";
import { View, FlatList, Text, TouchableOpacity, Linking } from "react-native";
import TopBar from "../../components/TopBar";
import BottomTab from "../../components/BottomTab";

const sampleTrending = [
  { symbol: "TATAMOTORS", last: 648.85, chgPct: -2.57 },
  { symbol: "RELIANCE", last: 2880.5, chgPct: +0.25 },
  { symbol: "PNBHOUSING", last: 808.45, chgPct: -18.02 },
  { symbol: "TCS", last: 3500.0, chgPct: -1.11 },
  { symbol: "HDFCBANK", last: 1522.8, chgPct: 1.12 },
  { symbol: "INFY", last: 1478.0, chgPct: -1.78 },
];

const sampleNews = [
  {
    title: "RBI hints at no further rate hikes in FY25",
    url: "https://economictimes.indiatimes.com/markets",
  },
  {
    title: "FII outflows weigh on Nifty, Sensex",
    url: "https://economictimes.indiatimes.com/markets",
  },
  {
    title: "Nifty IT down 1.8%, dragged by TCS and Infosys",
    url: "https://economictimes.indiatimes.com/markets",
  },
];

export default function TrendingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <TopBar />
      <View style={{ padding: 16, flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
          Trending Stocks
        </Text>
        <FlatList
          data={sampleTrending}
          keyExtractor={(item) => item.symbol}
          style={{ marginBottom: 24 }}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 8,
              }}
            >
              <Text style={{ flex: 1 }}>{item.symbol}</Text>
              <Text style={{ flex: 1 }}>₹{item.last.toFixed(2)}</Text>
              <Text
                style={{
                  flex: 1,
                  color: item.chgPct >= 0 ? "green" : "red",
                  textAlign: "right",
                }}
              >
                {item.chgPct.toFixed(2)}%
              </Text>
            </View>
          )}
        />

        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
          Market Headlines (India)
        </Text>
        <FlatList
          data={sampleNews}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
              <Text style={{ color: "#0066cc", marginBottom: 12 }}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <BottomTab />
    </View>
  );
}
