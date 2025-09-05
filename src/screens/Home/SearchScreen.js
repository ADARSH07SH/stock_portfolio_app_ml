import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TopBar from "../../components/TopBar";
import BottomTab from "../../components/BottomTab";
import { useNavigation } from "@react-navigation/native";
import { searchTickers, getHoldingByISIN } from "../../api/StockData";

export default function SearchScreen() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      setUsername(storedUsername || "");
    };
    fetchUsername();
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchText.length >= 1) {
        fetchTickerMatches(searchText);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchText]);

  const fetchTickerMatches = async (text) => {
    try {
      setLoading(true);
      const data = await searchTickers(text);

      if (Array.isArray(data)) {
        const unique = data.filter(
          (v, i, a) => a.findIndex((t) => t.isin === v.isin) === i
        );
        setResults(unique);
      }
    } catch (e) {
      console.error("Search error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (ticker) => {
    const { isin, symbol, name } = ticker;
    try {
      const holding = await getHoldingByISIN(isin, username);

      const stock =
        holding && holding.isin
          ? holding
          : {
              name,
              isin,
              symbol,
              quantity: 0,
              avgBuyPrice: 0,
              buyValue: 0,
            };

      navigation.navigate("IndividualStock", { stock, username });
    } catch (e) {
      console.error("Selection error:", e);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <TopBar />

      <View style={{ padding: 16, flex: 1 }}>
        <TextInput
          placeholder="Search company or symbol..."
          value={searchText}
          onChangeText={setSearchText}
          style={{
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            marginBottom: 12,
          }}
        />

        {loading && <ActivityIndicator size="small" />}

        <FlatList
          data={results}
          keyExtractor={(item, index) => `${item.isin}_${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                padding: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
              }}
              onPress={() => handleSelect(item)}
            >
              <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
              <Text style={{ color: "gray" }}>{item.symbol}</Text>
            </TouchableOpacity>
          )}
          initialNumToRender={10}
          maxToRenderPerBatch={20}
          windowSize={10}
        />
      </View>

      <BottomTab />
    </View>
  );
}
