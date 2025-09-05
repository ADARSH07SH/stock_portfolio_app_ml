import { BASE_URL } from "../config";

export const getChartData = async (symbol, range = "1D") => {
  try {
    const response = await fetch(
      `${BASE_URL}/chartData/${symbol}?range=${range}`
    );
    const data = await response.json();

    if (!data || !data.candles || data.candles.length === 0) {
      console.log("No candles returned from API");
      return { success: false, candles: [] };
    }

    return { success: true, candles: data.candles };
  } catch (err) {
    console.error("Network error fetching chart data:", err.message);
    return { success: false, message: "Network error", candles: [] };
  }
};
