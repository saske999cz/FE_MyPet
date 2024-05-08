import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../constants";

const MyPetCard = ({ image, name }) => {
  return (
    <TouchableOpacity className="w-24 h-32 flex-col items-center justify-start mb-2 mt-2 bg-white rounded-lg">
      <View style={{ width: "100%", aspectRatio: 1 }}>
        <Image
          source={image}
          className="w-full h-full rounded-t-lg"
          resizeMode="cover"
        />
      </View>
      <View className="w-full flex-col items-start justify-center mt-2 px-2">
        <Text className="text-[15px] font-semibold mb-2">{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default MyPetCard;
