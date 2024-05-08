import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const PostInput = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  return (
    <View className="w-full h-12 px-4 bg-white border-2 border-gray-300 rounded-2xl focus:border-[#3D1E14] items-center flex-row space-x-4">
      <TextInput
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        {...props}
        className="flex-1 text-black font-semibold"
        placeholderTextColor="#64748b"
        secureTextEntry={title === "Password" && !showPassword}
      />
      <FontAwesomeIcon
        icon={icons.faPen}
        size={20}
        style={{ color: "#64748b" }}
      />
    </View>
  );
};

export default PostInput;
