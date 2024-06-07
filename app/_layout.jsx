import { StyleSheet, Text, View, LogBox } from "react-native";
import { Slot, Stack } from "expo-router";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { router } from "expo-router";
import GlobalContextProvider, {
  useGlobalContext,
} from "../state/GlobalContextProvider";

LogBox.ignoreLogs([
  "Warning: Day: Support for defaultProps will be removed from function components in a future major release.",
]);

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
    <GlobalContextProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="screens" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </GlobalContextProvider>
  );
};

export default RootLayout;
