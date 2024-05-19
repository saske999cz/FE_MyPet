import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";

const UserSearchCard = ({ id, username, name, age, gender, email, avatar }) => {
  const handlePress = () => {
    router.push({
      pathname: "../screens/ProfileDetail",
      params: {
        id: id,
        username: username,
        age: age,
        gender: gender,
        email: email,
        avatar: avatar,
        name: name,
      },
    });
  };
  return (
    <TouchableOpacity
      className="w-full h-20 px-4 flex-row items-center justify-start"
      onPress={handlePress}
    >
      <View className="w-12 h-12 rounded-full border-[0.5px] border-solid border-gray-300">
        <Image
          source={avatar}
          className="w-full h-full rounded-full"
          resizeMode="contain"
        />
      </View>
      <View className="w-4/5 h-full flex-col items-start justify-center ml-2">
        <Text className="text-[14px] font-semibold">{username}</Text>
        <Text className="text-[13px] mt-2">{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default UserSearchCard;
