import { BASE_URL } from "../config";

export const UserData = async (username) => {
  try {
    console.log("called get user data");
    const response = await fetch(`${BASE_URL}/userData?username=${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch");

    const data = await response.json();

    return data;
  } catch (err) {
    console.log("Fetch error:", err.message);
    return null;
  }
};

export const editUserData = async (username, field, value) => {
  try {
    console.log("called edit user");
    const response = await fetch(
      `${BASE_URL}/userData?username=${username}&field=${field}&value=${value}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};
