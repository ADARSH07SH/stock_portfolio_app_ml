import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { getChartData } from "../../api/ChartData";
import BottomTab from "../../components/BottomTab";
import TopBar from "../../components/TopBar";

const resolutions = ["1D", "1W", "1M", "6M", "1Y", "5Y"];

export default function ChartDashboard({ route }) {
  const symbol = route?.params?.symbol || "NSE:NIFTY50-INDEX";
  const [range, setRange] = useState("1D");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const screenWidth = Dimensions.get("window").width - 32;

  const fetchData = async () => {
    setLoading(true);
    
    const data = await getChartData(symbol, range);
    
    if (data.success) {
      
      setChartData(data.candles);
    } else {
      console.log("No data received or market closed");
      setChartData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [range, symbol]);

  const formatLabels = () => {
    if (!chartData || chartData.length === 0) return [];
    return chartData.map((c) => {
      const date = new Date(c[0] * 1000);
      if (range === "1D")
        return `${date.getHours()}:${String(date.getMinutes()).padStart(
          2,
          "0"
        )}`;
      if (["1W", "1M", "6M"].includes(range))
        return `${date.getDate()}/${date.getMonth() + 1}`;
      if (["1Y", "5Y"].includes(range))
        return `${date.getMonth() + 1}/${date.getFullYear()}`;
      return "";
    });
  };

  const formattedData = {
    labels: formatLabels(),
    datasets: [
      { data: chartData.map((c) => c[4] || 0), color: () => "#4CAF50" },
    ],
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <TopBar />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
          {symbol} Chart
        </Text>

        <View
          style={{ borderRadius: 12, backgroundColor: "#f5f5f5", padding: 12 }}
        >
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#4CAF50"
              style={{ height: 280 }}
            />
          ) : chartData.length === 0 ? (
            <View
              style={{
                height: 280,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#e0e0e0",
                borderRadius: 12,
              }}
            >
              <Text style={{ color: "#9e9e9e", textAlign: "center" }}>
                Market closed or data unavailable for selected range
              </Text>
            </View>
          ) : (
            <LineChart
              data={formattedData}
              width={screenWidth}
              height={280}
              yAxisLabel=""
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(76, 175, 50, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                propsForDots: { r: "3", strokeWidth: "1", stroke: "#4CAF50" },
              }}
              bezier
              style={{ borderRadius: 12 }}
            />
          )}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 16,
              flexWrap: "wrap",
            }}
          >
            {resolutions.map((r) => (
              <TouchableOpacity
                key={r}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  margin: 4,
                  borderRadius: 20,
                  backgroundColor: range === r ? "#4CAF50" : "#e0e0e0",
                }}
                onPress={() => setRange(r)}
              >
                <Text
                  style={{
                    color: range === r ? "#fff" : "#000",
                    fontWeight: "600",
                  }}
                >
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <BottomTab />
    </View>
  );
}
