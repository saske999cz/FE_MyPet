import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images, icons, blurhash } from "../../constants";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useGlobalContext } from "../../state/GlobalContextProvider";

const menu = () => {
  const { userAvatar } = useGlobalContext();
  const handlePressMyProfile = () => {
    router.push("../screens/MyProfile");
  };
  const handleLogOut = () => {
    AsyncStorage.clear();
    router.replace("/sign-in");
  };

  const handlePressMyPet = () => {
    router.push("../screens/MyPet");
  };

  const handlePressMyAppointment = () => {
    router.push("../screens/MyAppointment");
  };
  const handlePressMyOrder = () => {
    router.push("../screens/MyOrder");
  };

  const handlePressMyReview = () => {
    router.push("../screens/MyReview");
  };

  const handleNavigateSecurity = () => {
    router.push("../screens/Security");
  };

  const handleNavigateMyRequest = () => {
    router.push("../screens/MyAdoptionRequest");
  };

  return (
    <SafeAreaView className="h-full flex-col items-center justify-start">
      <View className="flex-row w-full items-center justify-between px-4">
        <Image
          source={images.logoBlack}
          className="w-32 h-16 -ml-4"
          contentFit="contain"
          placeholder={{ blurhash }}
          transition={0}
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
            {userAvatar && (
              <Image
                source={{ uri: userAvatar }}
                className="w-9 h-9 rounded-full"
                transition={0}
                placeholder={{ blurhash }}
              />
            )}
          </View>
          <Text className="text-[14px] font-semibold">My Profile</Text>
        </TouchableOpacity>
        <View className="w-full h-[1px] bg-gray-200"></View>
        <TouchableOpacity
          className="w-full h-16 flex-row items-center justify-start px-4 py-2"
          onPress={handlePressMyPet}
        >
          <View className="w-16 h-16 flex-row items-center justify-center">
            <Image
              source={images.peticon}
              className="w-7 h-7"
              placeholder={{ blurhash }}
              transition={0}
            />
          </View>
          <Text className="text-[14px] font-semibold">My Pets</Text>
        </TouchableOpacity>
        <View className="w-full h-[1px] bg-gray-200"></View>
        <TouchableOpacity
          className="w-full h-16 flex-row items-center justify-start px-4 py-2"
          onPress={handlePressMyAppointment}
        >
          <View className="w-16 h-16 flex-row items-center justify-center">
            <Image
              source={images.appointment}
              className="w-7 h-7"
              placeholder={{ blurhash }}
              transition={0}
            />
          </View>
          <Text className="text-[14px] font-semibold">My Appointments</Text>
        </TouchableOpacity>
        <View className="w-full h-[1px] bg-gray-200"></View>
        <TouchableOpacity
          className="w-full h-16 flex-row items-center justify-start px-4 py-2"
          onPress={handleNavigateMyRequest}
        >
          <View className="w-16 h-16 flex-row items-center justify-center">
            <Image
              source={images.request}
              className="w-7 h-7"
              placeholder={{ blurhash }}
              transition={0}
            />
          </View>
          <Text className="text-[14px] font-semibold">My Requests</Text>
        </TouchableOpacity>
        <View className="w-full h-[1px] bg-gray-200"></View>
        <TouchableOpacity
          className="w-full h-16 flex-row items-center justify-start px-4 py-2"
          onPress={handlePressMyOrder}
        >
          <View className="w-16 h-16 flex-row items-center justify-center">
            <Image
              source={images.checklist}
              className="w-7 h-7"
              placeholder={{ blurhash }}
              transition={0}
            />
          </View>
          <Text className="text-[14px] font-semibold">My Orders</Text>
        </TouchableOpacity>
        <View className="w-full h-[1px] bg-gray-200"></View>
        <TouchableOpacity
          className="w-full h-16 flex-row items-center justify-start px-4 py-2"
          onPress={handlePressMyReview}
        >
          <View className="w-16 h-16 flex-row items-center justify-center">
            <Image
              source={images.myreview}
              className="w-7 h-7"
              placeholder={{ blurhash }}
              transition={0}
            />
          </View>
          <Text className="text-[14px] font-semibold">My Reviews</Text>
        </TouchableOpacity>
        <View className="w-full h-[1px] bg-gray-200"></View>
        <TouchableOpacity
          className="w-full h-16 flex-row items-center justify-start px-4 py-2"
          onPress={handleNavigateSecurity}
        >
          <View className="w-16 h-16 flex-row items-center justify-center">
            <Image
              source={images.lock}
              className="w-7 h-7"
              placeholder={{ blurhash }}
              transition={0}
            />
          </View>
          <Text className="text-[14px] font-semibold">Security</Text>
        </TouchableOpacity>
        <View className="w-full h-[1px] bg-gray-200"></View>
        <TouchableOpacity
          className="w-full h-16 flex-row items-center justify-start px-4 py-2"
          onPress={handleLogOut}
        >
          <View className="w-16 h-16 flex-row items-center justify-center">
            <Image
              source={images.logout}
              className="w-7 h-7"
              placeholder={{ blurhash }}
              transition={0}
            />
          </View>
          <Text className="text-[14px] font-semibold">Log out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default menu;
