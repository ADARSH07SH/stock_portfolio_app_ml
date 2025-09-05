import { BASE_URL } from "../config";

export const LoginUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch {
    return { success: false, message: "Network error" };
  }
};

export const SigninUser = async (email, password, fullName) => {
  try {
    const response = await fetch(`${BASE_URL}/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, fullName }),
    });
    return await response.json();
  } catch {
    return { success: false, message: "Network error" };
  }
};

export const SendOtp = async (email) => {
  try {
    const response = await fetch(`${BASE_URL}/changePassword/generate-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  } catch {
    return { success: false, message: "Network error" };
  }
};

export const VerifyOtp = async (email, otp) => {
  try {
    const response = await fetch(`${BASE_URL}/changePassword/check-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    return await response.json();
  } catch {
    return { success: false, message: "Network error" };
  }
};

export const ResetPassword = async (email, newPassword) => {
  try {
    const response = await fetch(`${BASE_URL}/changePassword/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });
    return await response.json();
  } catch {
    return { success: false, message: "Network error" };
  }
};
