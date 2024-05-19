import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../constants";

const Comment = ({ username, avatar, comment }) => {
  return (
    <View className="w-full h-fit flex-col items-start justify-center mb-4">
      <View className="w-full h-fit flex-row items-start justify-start">
        <View className="w-10 h-10 rounded-full border-[0.5px] border-solid border-gray-300">
          <Image
            source={avatar}
            className="w-full h-full rounded-full"
            resizeMode="cover"
          />
        </View>
        <View className="w-fit max-w-[80%] h-fit flex-col items-start justify-start bg-gray-200 rounded-lg px-2 ml-2">
          <Text className="text-[13px] font-semibold text-black mt-2">
            {username}
          </Text>
          <Text className="text-[13px] text-gray-700 py-2 -mt-1">
            {comment}
          </Text>
        </View>
      </View>
      <View className="w-full h-5 px-12 flex-row items-center justify-start mt-1">
        <TouchableOpacity className="w-10 h-5 flex-row items-center justify-center ml-4 -mt-[2px]">
          <FontAwesomeIcon
            icon={icons.faThumbsUp}
            size={13}
            style={{ color: "#9ca3af" }}
          />
          <Text className="text-[12px] font-semibold text-gray-500 ml-[2px]">
            Like
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-fit h-5 flex-row items-center justify-center ml-4 ">
          <FontAwesomeIcon
            icon={icons.faThumbsDown}
            size={13}
            style={{ color: "#9ca3af", marginTop: 1 }}
          />
          <Text className="text-[12px] font-semibold text-gray-500 ml-[2px]">
            Dislike
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-10 h-5 flex-row items-center justify-center ml-4">
          <Text className="font-semibold text-gray-500 text-[12px]">Reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Comment;
