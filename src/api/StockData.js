import { BASE_URL } from "../config";

import * as DocumentPicker from "expo-document-picker";

export const getStockHoldings = async (username) => {
  try {
    const response = await fetch(`${BASE_URL}/holdings/user/${username}`);
    if (!response.ok) return [];
    const data = await response.json();

    return Array.isArray(data.stocks) ? data.stocks : [];
  } catch (error) {
    return [];
  }
};

export const extractStockDetails = async (username) => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ],
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled) return null;

    const file = result.assets?.[0];
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: file.name,
      type:
        file.mimeType ||
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const response = await fetch(
      `${BASE_URL}/holdings/upload?username=${username}`,
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};

export const getStockData = async (isin) => {
  try {
    const response = await fetch(`${BASE_URL}/stockData/${isin}`);
    if (!response.ok) return null;
    const data = await response.json();

    return data;
  } catch (error) {
    return null;
  }
};

export const updateHolding = async (isin, username) => {
  try {
    const response = await fetch(
      `${BASE_URL}/holdings/updateHolding/${isin}/${username}`,
      {
        method: "PUT",
      }
    );
    if (!response.ok) return null;
    const result = await response.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const searchTickers = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/stockData/search/${query}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
};

export const getHoldingByISIN = async (isin, username) => {
  try {
    const response = await fetch(
      `${BASE_URL}/stockData/holding/${username}/${isin}`
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};
