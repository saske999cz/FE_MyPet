import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { formatVND } from "../utils/currencyFormater";

const OrderItemCard = ({ image, name, price, quantity }) => {
  return (
    <TouchableOpacity className="w-full h-20 flex-row items-center justify-start border-y-[0.5px] border-solid border-gray-200 mt-1 px-4">
      <View className="w-20 h-16 flex-row items-center justify-center">
        <Image source={image} className="w-full h-full" />
      </View>
      <View className="w-64 h-16 flex-col items-start justify-start ml-3">
        <Text className="text-[14px]" numberOfLines={1}>
          {name}
        </Text>
        <View className="w-full h-fit flex-row items-center justify-end mt-2">
          <Text className="text-[13px] text-black flex-row">x{quantity}</Text>
        </View>
        <View className="w-full h-fit flex-row items-center justify-end mt-1">
          <Text className="text-[13px] text-amber-500 flex-row">
            {formatVND(price)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderItemCard;
