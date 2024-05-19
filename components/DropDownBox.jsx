import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";

const DropDownBox = ({ placeHolderText, data, onSelect }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TouchableOpacity
      className="w-full h-12 flex-row items-center justify-center border-[2px] border-solid border-gray-300 rounded-md relative z-[7]"
      onPress={() => setIsFocused(!isFocused)}
    >
      <View className="w-full h-12 flex-row items-center justify-start px-1">
        {selectedItem && (
          <Image
            source={selectedItem.image}
            className="w-10 h-10 rounded-full"
          />
        )}
        <Text
          className={`ml-2 ${
            selectedItem
              ? "text-[14px] font-semibold text-black"
              : "text-[14px] text-gray-500"
          }`}
        >
          {selectedItem ? selectedItem.name : placeHolderText}
        </Text>
      </View>
      {isFocused && (
        <View className="w-full h-40 absolute rounded-md top-0 left-0 right-0 mt-[14%] bg-orange-50 px-2">
          <ScrollView className="w-[99%] h-[99%] rounded-md">
            {data.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedItem(item);
                  setIsFocused(false);
                  onSelect(item);
                }}
                className="w-full h-12 flex-row items-center justify-start mt-1 rounded-md"
                key={index}
              >
                <Image
                  source={item.image}
                  className="w-10 h-10 rounded-full"
                  resizeMode="cover"
                />
                <Text className="text-[14px] font-semibold text-black ml-2">
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default DropDownBox;
