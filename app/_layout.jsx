import { StyleSheet, Text, View } from "react-native";
import { Slot, Stack } from "expo-router";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { router } from "expo-router";
const RootLayout = () => {
  const isLogedIn = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      router.replace("/home");
    } else {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");
      if (hasLaunched === null) {
        AsyncStorage.setItem("hasLaunched", "true");
        return;
      } else {
        router.replace("/sign-in");
      }
    }
  };

  useEffect(() => {
    isLogedIn();
  }, []);
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="screens" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </>
  );
};

export default RootLayout;
