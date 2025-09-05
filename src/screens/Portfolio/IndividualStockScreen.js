import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import TopBar from "../../components/TopBar";
import BottomTab from "../../components/BottomTab";
import { getStockData, updateHolding } from "../../api/StockData";
import StockChart from "../../components/StockChart";

const IndividualStockScreen = ({ route }) => {
  const { stock, username } = route.params;
  const [fyersData, setFyersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch FYERS data and update holding
  const fetchAndUpdate = async () => {
    try {
      if (!refreshing) setLoading(true);

      // Update user holding prices
      await updateHolding(stock.isin, username);

      // Fetch stock data from backend
      const liveData = await getStockData(stock.isin);
      console.log("Live stock data:", liveData);

      setFyersData(liveData);
    } catch (err) {
      console.error("Error fetching stock data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAndUpdate();
    const interval = setInterval(fetchAndUpdate, 180000); // 3 minutes refresh
    return () => clearInterval(interval);
  }, []);

  const calculateReturn = () => {
    if (
      !fyersData ||
      fyersData.currentPrice == null ||
      stock?.quantity == null ||
      stock?.avgBuyPrice == null
    )
      return null;

    const cp = Number(fyersData.currentPrice);
    const avg = Number(stock.avgBuyPrice);
    const qty = Number(stock.quantity);

    if (
      !isFinite(cp) ||
      !isFinite(avg) ||
      !isFinite(qty) ||
      qty <= 0 ||
      avg === 0
    )
      return null;

    const absolute = (cp - avg) * qty;
    const percent = ((cp * qty - avg * qty) / (avg * qty)) * 100;

    const absFormatted = Math.abs(absolute).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const percentFormatted = Math.abs(percent).toFixed(2);

    return {
      absolute,
      percent,
      formattedAbsolute: `${absolute >= 0 ? "+" : "-"}₹${absFormatted}`,
      formattedPercent: `${percent >= 0 ? "+" : "-"}${percentFormatted}%`,
    };
  };

  const returns = calculateReturn();

  const min = Number(fyersData?.low ?? 0);
  const max = Number(fyersData?.high ?? 1);
  const current = Number(fyersData?.currentPrice ?? 0);

  const sliderPercent = (() => {
    if (!isFinite(min) || !isFinite(max) || max === min) return 50;
    const p = ((current - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, p));
  })();

  const chartSymbol = fyersData?.fyersSymbol || stock?.symbol || stock?.isin;

  return (
    <View className="flex-1 bg-white">
      <TopBar />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchAndUpdate();
            }}
          />
        }
      >
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 50,
            }}
          >
            <ActivityIndicator size="large" />
          </View>
        ) : fyersData ? (
          <>
            {/* Stock Header */}
            <View className="mb-4">
              <View className="flex-row items-center space-x-2 mb-1">
                <View className="w-8 h-8 bg-orange-500 rounded-full" />
                <Text className="text-xl font-semibold">{fyersData.name}</Text>
              </View>
              <Text className="text-2xl font-bold">
                ₹
                {Number(fyersData.currentPrice).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
              <Text
                className={`text-sm ${
                  Number(fyersData.change) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                ₹{Number(fyersData.change).toFixed(2)} (
                {Number(fyersData.changePercent).toFixed(2)}%)
              </Text>
            </View>

            {/* Chart */}
            <StockChart symbol={chartSymbol} initialRange="1D" />

            {/* Shares / P&L Card */}
            {Number(stock.quantity) > 0 && (
              <View className="bg-gray-100 rounded-lg p-4 mb-4">
                <Text className="text-base font-medium mb-2">
                  {Number(stock.quantity).toLocaleString("en-IN")} Shares
                </Text>

                <View className="flex-row justify-between mb-2">
                  <Text className="text-sm text-gray-600">Avg. Price</Text>
                  <Text className="text-sm font-semibold">
                    ₹
                    {Number(stock.avgBuyPrice).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>

                <View className="flex-row justify-between mb-2">
                  <Text className="text-sm text-gray-600">Buy Value</Text>
                  <Text className="text-sm font-semibold">
                    ₹
                    {Number(
                      stock.buyValue ?? stock.avgBuyPrice * stock.quantity
                    ).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>

                {returns && (
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-600">
                      Unrealised P&L
                    </Text>
                    <Text
                      className={`text-sm font-semibold ${
                        returns.percent >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {returns.formattedAbsolute} ({returns.formattedPercent})
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Performance Card */}
            <View className="bg-gray-100 rounded-lg p-4">
              <Text className="text-lg font-semibold mb-2">Performance</Text>

              <View className="mb-2">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-500">
                    ₹
                    {min.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    ₹
                    {max.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>
                <View className="w-full h-2 bg-gray-300 rounded mt-1 mb-2">
                  <View
                    style={{ width: `${sliderPercent}%` }}
                    className="h-2 bg-green-500 rounded"
                  />
                </View>
                <Text className="text-center text-sm">
                  Current: ₹
                  {Number(fyersData.currentPrice).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>

              <View className="flex-row justify-between mb-2">
                <Text className="text-sm text-gray-600">Open</Text>
                <Text className="text-sm font-semibold">
                  ₹
                  {Number(fyersData.open).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>

              <View className="flex-row justify-between mb-2">
                <Text className="text-sm text-gray-600">Prev Close</Text>
                <Text className="text-sm font-semibold">
                  ₹
                  {Number(fyersData.prevClose).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">Volume</Text>
                <Text className="text-sm font-semibold">
                  {Number(fyersData.volume ?? 0).toLocaleString("en-IN")}
                </Text>
              </View>
            </View>
          </>
        ) : (
          <Text className="text-center text-red-500">Error loading data</Text>
        )}
      </ScrollView>
      <BottomTab />
    </View>
  );
};

export default IndividualStockScreen;
