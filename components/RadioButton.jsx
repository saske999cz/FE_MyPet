import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";

const RadioButton = ({
  active,
  title,
  titleStyle,
  handleSelect,
  description,
  descriptionStyle,
  image,
}) => {
  return (
    <TouchableOpacity
      className="w-full h-20 flex-row items-center justify-start px-6"
      onPress={handleSelect}
    >
      <View
        className={`w-6 h-6 rounded-full border-[2px] border-solid bg-white flex-row items-center justify-center p-1 ${
          active ? "border-amber-500" : "border-gray-600"
        }`}
      >
        <View
          className={`w-full h-full rounded-full ${
            active ? "bg-amber-500" : "bg-white"
          }`}
        ></View>
      </View>
      {image && (
        <Image source={image} className="w-12 h-12 ml-2" resizeMode="contain" />
      )}
      <View className="w-4/5 h-full flex-col items-center justify-center ml-2">
        <Text className={`w-full ${titleStyle}`}>{title}</Text>
        <Text className={`w-full ${descriptionStyle}`}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default RadioButton;
