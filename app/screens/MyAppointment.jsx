import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { FlashList } from "@shopify/flash-list";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { router } from "expo-router";
import { VetAppointmentsDummy } from "../../dummy/FakeData";

const MyAppointment = () => {
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
        <Text className="font-bold text-[16px]">My Appointments</Text>
      </View>
      <FlashList
        data={VetAppointmentsDummy}
        renderItem={({ item }) => (
          <TouchableOpacity className="w-full h-12 flex-row items-center justify-start px-6 mt-4 mb-4">
            <View className="w-[30%] h-12 flex-col">
              <View className="w-full flex-row items-center justify-start">
                <Text className="text-[13px] font-semibold">{item.date}</Text>
              </View>
              <View className="w-full flex-row items-center justify-start mt-2">
                <FontAwesomeIcon
                  icon={icons.faClock}
                  size={13}
                  style={{ color: "#94a3b8" }}
                />
                <Text className="text-[13px] ml-1">{item.time}</Text>
              </View>
            </View>
            <View className="w-[70%] h-12 flex-col">
              <View className="w-full flex-row items-center justify-start">
                <Text className="text-[13px] font-semibold">
                  {item.vetClinic}
                </Text>
              </View>
              <View className="w-full flex-row items-center justify-start mt-2">
                <Text className="text-[13px]">{item.vetAssigned}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.appointmentId}
        estimatedItemSize={30}
      />
    </SafeAreaView>
  );
};

export default MyAppointment;
