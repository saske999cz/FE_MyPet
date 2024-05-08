import { StyleSheet, Text, View } from "react-native";
import { Slot, Stack } from "expo-router";
import Toast from "react-native-toast-message";

const RootLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="search/[query]" options={{ headerShown: false }} />
        <Stack.Screen name="screens" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </>
  );
};

export default RootLayout;
