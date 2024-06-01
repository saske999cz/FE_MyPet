import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { FlashList } from "@shopify/flash-list";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { router } from "expo-router";
import { OrdersDummy } from "../../dummy/FakeData";

const MyOrder = () => {
  const handleBack = () => {
    router.back();
  };

  const handleOrderDetail = (orderId) => {
    router.push({
      pathname: "../screens/OrderDetail",
      params: {
        orderId: orderId,
      },
    });
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
        <Text className="font-bold text-[16px]">My Orders</Text>
      </View>
      <FlashList
        data={OrdersDummy}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="w-full h-12 flex-row items-center justify-start px-6 mt-4 mb-4"
            onPress={() => handleOrderDetail(item.orderId)}
          >
            <View className="w-[30%] h-12 flex-col">
              <View className="w-full flex-row items-center justify-start">
                <FontAwesomeIcon
                  icon={icons.faTruckFast}
                  size={15}
                  style={{ color: "#f59e0b" }}
                />
                <Text className="text-[13px] font-semibold ml-1">
                  Order Date
                </Text>
              </View>
              <View className="w-full flex-row items-center justify-start mt-2">
                <Text className="text-[13px] ml-1">{item.orderDate}</Text>
              </View>
            </View>
            <View className="w-[70%] h-12 flex-col px-2">
              <View className="w-full flex-row items-center justify-start">
                <Text className="text-[13px] font-semibold">
                  {item.orderId}
                </Text>
              </View>
              <View className="w-full flex-row items-center justify-start mt-2">
                <Text className="text-[13px]">{item.status}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.orderId}
        estimatedItemSize={30}
      />
    </SafeAreaView>
  );
};

export default MyOrder;
