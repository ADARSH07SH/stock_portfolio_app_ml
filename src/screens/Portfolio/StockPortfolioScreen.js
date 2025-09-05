import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ArrowPathIcon } from "react-native-heroicons/outline";
import { getStockHoldings, extractStockDetails } from "../../api/StockData";
import { useNavigation } from "@react-navigation/native";

const StockPortfolioScreen = ({ username }) => {
  const navigation = useNavigation();
  const [stockHoldings, setStockHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc");

  const enrichHoldings = (holdings) => {
    return holdings.map((stock) => {
        const returnPct =
        ((stock.currentPrice - stock.avgBuyPrice) / stock.avgBuyPrice) * 100;
      return { ...stock, returnPct };
    });
  };

  const saveToCache = async (holdings) => {
    try {
      await AsyncStorage.setItem("stockHoldings", JSON.stringify(holdings));
      
    } catch (e) {
      console.warn("Failed to cache holdings:", e);
    }
  };

  const loadFromCache = async () => {
    try {
      const cached = await AsyncStorage.getItem("stockHoldings");
      
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStockHoldings(enrichHoldings(parsed));
          return true;
        }
      }
    } catch (e) {
      console.warn("Error reading cache:", e);
    }
    return false;
  };

  const fetchFromMongo = async () => {
    try {
      const holdings = await getStockHoldings(username);
      if (Array.isArray(holdings) && holdings.length > 0) {
        const enriched = enrichHoldings(holdings);
        setStockHoldings(enriched);
        await saveToCache(enriched);
        return true;
      }
    } catch (e) {
      console.error("Mongo fetch error:", e);
    }
    return false;
  };

  const handleInitialLoad = async () => {
    if (!username) return setLoading(false);

    const cacheLoaded = await loadFromCache();
    if (!cacheLoaded) {
      const mongoLoaded = await fetchFromMongo();
      if (!mongoLoaded) {
        Alert.alert(
          "No Portfolio Found",
          "Please upload your portfolio to get started."
        );
      }
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    if (!username) return;
    setLoading(true);
    const result = await extractStockDetails(username); // also updates prices
    if (result?.success) {
      await fetchFromMongo();
    }
    setLoading(false);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const getSortedHoldings = () => {
    const sorted = [...stockHoldings];
    return sorted.sort((a, b) => {
      return sortOrder === "asc"
        ? a.returnPct - b.returnPct
        : b.returnPct - a.returnPct;
    });
  };

  useEffect(() => {
    handleInitialLoad();
  }, [username]);

  const renderStockItem = ({ item }) => {
    const totalValue = item.currentPrice * item.quantity;
    const symbolWithSource = `${item.source}:${item.symbol}`; // Add exchange prefix

    return (
      <TouchableOpacity
        className="bg-white rounded-lg shadow-sm border border-gray-200 m-3 p-4"
        onPress={() =>
          navigation.navigate("IndividualStock", {
            stock: { ...item, symbol: symbolWithSource },
            username,
          })
        }
      >
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-base font-semibold text-black">
            {item.name}
          </Text>
          <Text className="text-sm text-gray-600">Qty: {item.quantity}</Text>
        </View>

        <Text className="text-xl font-bold text-black mt-1 mb-2">
          ₹{totalValue.toFixed(2)}
        </Text>

        <View className="flex-row justify-between">
          <Text className="text-sm text-gray-500">
            Invested: ₹{item.buyValue?.toFixed(2) || 0}
          </Text>
          <Text
            className={`text-sm font-semibold ${
              item.returnPct >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {item.returnPct?.toFixed(2)}%
          </Text>
        </View>
      </TouchableOpacity>
    );
  };


  return (
    <View className="flex-1 bg-white">
      <View className="flex-row justify-between items-center px-4 pt-2">
        <TouchableOpacity onPress={handleRefresh}>
          <Text className="text-blue-500">Upload Portfolio (.xlsx)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleRefresh}
          className="flex-row items-center"
        >
          <ArrowPathIcon size={20} color="black" />
          <Text className="ml-1 text-blue-500">Refresh</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-end px-4 mt-2">
        <TouchableOpacity onPress={toggleSortOrder}>
          <Text className="text-sm text-blue-600">
            Sort by Return: 
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading portfolio...</Text>
        </View>
      ) : (
        <FlatList
          data={getSortedHoldings()}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={renderStockItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="p-8">
              <Text className="text-center text-gray-500">
                No stock data found. Please upload your portfolio.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default StockPortfolioScreen;
