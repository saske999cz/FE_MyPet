import { View, Text, Image } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../constants";

const Review = ({ username, review, rating, avatar }) => {
  return (
    <View className="w-full h-fit border-b-[1px] border-solid border-gray-300 py-4 px-4">
      <View className="w-full h-10 flex-row items-center justify-start mb-2">
        <View className="w-8 h-8 rounded-full flex-row items-center justify-center border-[1px] border-solid border-gray-300">
          <Image source={avatar} className="w-full h-full rounded-full" />
        </View>
        <View className="w-40 h-10 flex-col items-start justify-center ml-2">
          <Text className="text-[13px] font-semibold">{username}</Text>
          <View className="w-10 h-fit flex-row items-center justify-start mt-1">
            <FontAwesomeIcon
              icon={icons.faHeart}
              size={10}
              style={{ color: "#f43f5e" }}
            />
            <Text className="text-[12px] ml-1">
              {parseFloat(rating).toFixed(1)}
            </Text>
          </View>
        </View>
      </View>
      <View className="w-full h-fit">
        <Text className="text-[13px]">{review}</Text>
      </View>
    </View>
  );
};

export default Review;
