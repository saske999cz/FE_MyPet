import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { router } from "expo-router";

const menu = () => {
  const handlePressMyProfile = () => {
    router.push("../screens/MyProfile");
  };
  return (
    <SafeAreaView className="h-full flex-col items-center justify-start">
      <View className="flex-row w-full items-center justify-between px-4">
        <Image
          source={images.logoBlack}
          className="w-32 h-16 -ml-4"
          resizeMode="contain"
        />
        <View className="flex-row items-center w-[45%] justify-end">
          <Text className="text-[17px] font-semibold mr-1 mt-1">Menu</Text>
        </View>
      </View>
      <View className="w-[82%] flex-col h-fit items-center justify-start bg-white rounded-md mt-6">
        <TouchableOpacity
          className="w-full h-16 flex-row items-center justify-start px-4 py-2"
          onPress={handlePressMyProfile}
        >
          <View className="w-16 h-16 flex-row items-center justify-center">
            <Image source={images.avatar} className="w-9 h-9 rounded-full" />
          </View>
          <Text className="text-[14px] font-semibold">My Profile</Text>
        </TouchableOpacity>
        <View className="w-full h-[1px] bg-gray-200"></View>
        <TouchableOpacity className="w-full h-16 flex-row items-center justify-start px-4 py-2">
          <View className="w-16 h-16 flex-row items-center justify-center">
            <Image source={images.peticon} className="w-7 h-7" />
          </View>
          <Text className="text-[14px] font-semibold">My Pet</Text>
        </TouchableOpacity>
        <View className="w-full h-[1px] bg-gray-200"></View>
        <TouchableOpacity className="w-full h-16 flex-row items-center justify-start px-4 py-2">
          <View className="w-16 h-16 flex-row items-center justify-center">
            <Image source={images.appointment} className="w-7 h-7" />
          </View>
          <Text className="text-[14px] font-semibold">My Appointments</Text>
        </TouchableOpacity>
        <View className="w-full h-[1px] bg-gray-200"></View>
        <TouchableOpacity className="w-full h-16 flex-row items-center justify-start px-4 py-2">
          <View className="w-16 h-16 flex-row items-center justify-center">
            <Image source={images.lock} className="w-7 h-7" />
          </View>
          <Text className="text-[14px] font-semibold">Security</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default menu;
