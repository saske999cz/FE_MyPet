import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { Redirect, router } from "expo-router";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function App() {
  const [hasLaunched, setHasLaunched] = useState(true);
  const isFirstLaunch = async () => {
    const hasLaunched = await AsyncStorage.getItem("hasLaunched");
    if (hasLaunched === null) {
      await AsyncStorage.setItem("hasLaunched", "true");
      setHasLaunched(false);
    }
  };
  useEffect(() => {
    isFirstLaunch();
  });
  return (
    <SafeAreaView className="bg-[#E58E37] h-full">
      {hasLaunched ? (
        <View className="w-full h-full flex-row items-center justify-center -ml-6">
          <Image
            source={images.logoWhite}
            className="w-[300px] h-[150px]"
            resizeMode="contain"
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View className="w-full justify-start items-center min-h-[85vh] px-4">
            <Image
              source={images.logoWhite}
              className="w-[300px] h-[50px] -ml-[235px] "
              resizeMode="contain"
            />
            <Image
              source={images.splashPet}
              className="max-w-[380px] w-full h-[270px] mt-8"
              resizeMode="contain"
            />
            <View className="relative mt-12">
              <Text className="text-center text-3xl font-bold text-white">
                Welcome to <Text className="text-[#3D1E14]">MyPet🐶</Text>
              </Text>
            </View>
            <Text className="text-sm text-gray-50 mt-7 text-center">
              Your furry friend's perfect companion awaits. MyPet is your
              one-stop destination for all things pet-related, designed to make
              life with your beloved companion easier, happier, and more
              fulfilling.
            </Text>
            <CustomButton
              title="Get Started"
              handlePress={() => router.push("/sign-in")}
              containerStyles="w-full mt-8"
              textStyles="text-[#3D1E14]"
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
