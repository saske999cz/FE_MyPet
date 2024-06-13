import { View, Text } from "react-native";
import React from "react";
import ApiManager from "./ApiManager";

export const update_profile = async (data) => {
  try {
    const response = await ApiManager.put("/user/update", data);
    return response;
  } catch (error) {
    return error;
  }
};

export const change_password = async (data) => {
  try {
    const response = await ApiManager.post("/user/change-password", data);
    return response;
  } catch (error) {
    return error;
  }
};
