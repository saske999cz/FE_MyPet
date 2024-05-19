import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../constants";
import { router } from "expo-router";

const ItemCard = ({
  id,
  image,
  title,
  rating,
  price,
  soldUnits,
  shop,
  isHorizontal,
}) => {
  const handlePress = () => {
    router.push({
      pathname: "../screens/ProductDetail",
      params: {
        id: id,
        title: title,
        rating: rating,
        price: price,
        soldUnits: soldUnits,
        shop: shop,
        image: image,
      },
    });
  };
  return (
    <TouchableOpacity
      className={`w-${
        isHorizontal ? "44" : "full"
      } h-56 flex-col items-center justify-start mt-3 bg-white rounded-lg border-[0.5px] border-solid border-gray-200`}
      onPress={handlePress}
    >
      <Image source={image} className="w-full h-32 rounded-t-lg" />
      <View className="w-full flex-col items-start justify-center mt-2 px-2">
        <Text className="text-[13px] mb-1">{title}</Text>
        <View className="flex-row items-center justify-start mb-1">
          <FontAwesomeIcon
            icon={icons.faDongSign}
            size={13}
            style={{ color: "#f59e0b" }}
          />
          <Text className="text-[15px] text-[#fb923c] font-semibold">
            {parseInt(price).toLocaleString("en-US")}
          </Text>
        </View>
        <View className="flex-row w-full items-center justify-start mb-2">
          <View className="rounded-[3px] bg-pink-100 flex-row items-center justiify-center px-[3px] py-[2px] border-[1px] border-solid border-pink-400">
            <FontAwesomeIcon
              icon={icons.faHeart}
              size={10}
              style={{ color: "#f43f5e" }}
            />
            <Text className="text-[10px] ml-1">
              {parseFloat(rating).toFixed(1)}
            </Text>
          </View>

          <View className="w-[1px] h-3 bg-gray-300 ml-1"></View>
          <Text className="text-[10px] ml-1">{soldUnits} sold</Text>
        </View>
        <View className="w-full flex-row items-center justify-start">
          <FontAwesomeIcon
            icon={icons.faStore}
            size={10}
            style={{ color: "#14b8a6" }}
          />
          <Text className="ml-1 text-[10px]">{shop}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ItemCard;
