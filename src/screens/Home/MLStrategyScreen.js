/* screens/MLStrategyScreen.js */
import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, ScrollView } from "react-native";
import TopBar from "../../components/TopBar";
import BottomTab from "../../components/BottomTab";

export default function MLStrategyScreen() {
  const [symbol, setSymbol] = useState("RELIANCE");
  const [analysis, setAnalysis] = useState("");

  const dummyAnalysisData = {
    RELIANCE: {
      crossover: "Bullish crossover detected: 9-day EMA > 21-day EMA",
      rsi: "RSI is at 48 – neutral zone",
    },
    TCS: {
      crossover: "Bearish crossover detected: 9-day EMA < 21-day EMA",
      rsi: "RSI is at 32 – approaching oversold region",
    },
    INFY: {
      crossover: "Bullish crossover forming: 9-day EMA nearing 21-day EMA",
      rsi: "RSI is at 55 – slight upward momentum",
    },
    HDFCBANK: {
      crossover: "No crossover detected – EMAs aligned",
      rsi: "RSI is at 65 – slightly overbought",
    },
  };

  const checkStrategy = () => {
    const upperSymbol = symbol.toUpperCase();
    const result = dummyAnalysisData[upperSymbol];

    if (result) {
      setAnalysis(
        `Stock: ${upperSymbol}\n\n${result.crossover}\n${result.rsi}`
      );
    } else {
      setAnalysis(
        `No data available for "${upperSymbol}". Try RELIANCE or TCS.`
      );
    }
  };

  useEffect(() => {
    checkStrategy(); // auto-load default symbol
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <TopBar />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
          ML Strategy Insights (Dummy)
        </Text>

        <TextInput
          placeholder="Symbol (e.g. RELIANCE, TCS)"
          value={symbol}
          onChangeText={setSymbol}
          autoCapitalize="characters"
          style={{
            borderColor: "#ddd",
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            marginBottom: 16,
          }}
        />

        <Button title="Run Strategy" onPress={checkStrategy} />

        {analysis !== "" && (
          <Text
            style={{
              marginTop: 20,
              fontSize: 16,
              fontWeight: "600",
              lineHeight: 24,
              color: "#333",
              whiteSpace: "pre-line",
            }}
          >
            {analysis}
          </Text>
        )}
      </ScrollView>

      <BottomTab />
    </View>
  );
}
