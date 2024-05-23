import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { router } from "expo-router";

const VaccinationDetail = () => {
  const handleBack = () => {
    router.back();
  };
  return (
    <SafeAreaView className="w-full h-full">
      <View className="w-full h-12 flex-row items-center justify-center">
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
        <Text className="text-[16px] font-semibold">Vaccination Detail</Text>
      </View>
      <View className="w-full h-[1px] bg-gray-300 px-4"></View>
      <ScrollView className="w-full h-full">
        <View className="w-full px-4 h-fit flex-col">
          <View className="w-full flex-row items-center justify-start mt-8 px-4">
            <View className="w-[20%] flex-row items-center justify-start">
              <Text className="text-[15px] font-semibold">Date: </Text>
            </View>
            <View className="w-[80%] flex-row items-center justify-start">
              <Text className="text-[14px] ml-1">12/12/2021</Text>
            </View>
          </View>
          <View className="w-full flex-row items-center justify-start mt-8 px-4 h-fit">
            <View className="w-[20%] flex-row items-center justify-start">
              <Text className="text-[15px] font-semibold">Vaccine: </Text>
            </View>
            <View className="w-[80%] flex-row items-center justify-start h-fit">
              <Text className="text-[14px] ml-1">DHPP</Text>
            </View>
          </View>
          <View className="w-full flex-row items-center justify-start mt-8 px-4 h-fit">
            <View className="w-[20%] flex-row items-center justify-start">
              <Text className="text-[15px] font-semibold">Notes: </Text>
            </View>
            <View className="w-[80%] flex-row items-center justify-start h-fit">
              <Text className="text-[14px] ml-1">First dose</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VaccinationDetail;
