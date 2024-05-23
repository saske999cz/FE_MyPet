import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState, useRef, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { images } from "../../constants";
import { useLocalSearchParams } from "expo-router";
import { UserDummy } from "../../dummy/FakeData";

const MyPhotos = () => {
  const { query } = useLocalSearchParams();
  const users = UserDummy.filter((user) =>
    user.username.toLowerCase().includes(query.toLowerCase())
  );
  const listSize = users.length;

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="h-full w-full">
      <View className="w-full h-12 flex-row items-center justify-center mb-2 border-b-[0.5px] border-solid border-gray-300">
        <TouchableOpacity
          className="w-12 h-12 flex-row items-center justify-center absolute top-0 left-0"
          onPress={handleBack}
        >
          <FontAwesomeIcon
            icon={icons.faArrowLeftLong}
            size={20}
            style={{ color: "#f59e0b" }}
          />
        </TouchableOpacity>
        <Text className="font-bold text-[16px]">My Photos</Text>
      </View>
      <FlashList
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity className="w-full h-12 flex-row items-center justify-start px-3 mt-4 mb-4">
            <View className="w-12 h-12 rounded-full border-[0.5px] border-solid border-gray-200">
              <Image
                source={item.avatar}
                className="w-full h-full rounded-full"
              />
            </View>
            <View className="w-[80%] h-fit flex-col items-start justify-start ml-2">
              <View className="w-full h-fit flex-row items-center justify-start">
                <Text className="text-[15px] font-semibold">
                  {item.username}
                </Text>
              </View>
              <View className="w-full h-fit flex-row items-center justify-start">
                <Text className="text-[13px]">{item.name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        estimatedItemSize={listSize}
      />
    </SafeAreaView>
  );
};

export default MyPhotos;
