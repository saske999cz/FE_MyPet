import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState, useCallback } from "react";
import { icons } from "../constants";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  titleStyles,
  multiline,
  numberOfLines,
  height,
  secureText,
  error,
  numericKeyboard,
  errorTextStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const defaultHeight = 12;
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <View className="w-full h-fit flex-row items-center justify-between">
        <Text className={`font-semibold text-gray-50 ${titleStyles}`}>
          {title}
        </Text>
        {error && (
          <Text
            className={`${
              errorTextStyles
                ? errorTextStyles
                : "text-red-500 text-[12px] ml-4"
            }`}
          >
            {error}
          </Text>
        )}
      </View>
      <View
        className={`w-full h-${
          height ? height : defaultHeight
        } px-4 bg-white border-2 ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md focus:border-[#3D1E14] items-center flex-row`}
      >
        <TextInput
          defaultValue={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          {...props}
          className="flex-1 text-black text-[13px]"
          placeholderTextColor="#64748b"
          secureTextEntry={secureText === true && !showPassword}
          multiline={multiline || false}
          numberOfLines={numberOfLines || 1}
          autoCapitalize="none"
          keyboardType={numericKeyboard ? "numeric" : "default"}
        />
        {secureText === true && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-4"
          >
            <Image
              source={!showPassword ? icons.eye : icons.eyeOff}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
