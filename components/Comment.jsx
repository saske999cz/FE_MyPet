import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../constants";
import SubComment from "./SubComment";

const Comment = ({ username, avatar, comment, subcomment }) => {
  const [subComments, setSubComments] = useState([]);
  function getTimeAgo(timestamp) {
    const now = new Date();
    const commentDate = new Date(timestamp); // Assuming timestamp is in a format Date can understand
    const timeDiff = now - commentDate;
    const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (daysAgo === 0) return "Today";
    if (daysAgo === 1) return "Yesterday";
    return `${daysAgo} days ago`;
  }
  const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 9); // 9 characters
  };
  const handleShowAllSubComments = () => {
    if (subComments.length === 0) {
      setSubComments(subcomment);
      return;
    } else {
      setSubComments([]);
    }
  };
  return (
    <View className="w-full h-fit flex-col items-start justify-center mb-2 mt-1">
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
          <Text className="text-[12px] font-semibold text-gray-500 ml-[2px]">
            Like
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-fit h-5 flex-row items-center justify-center ml-4 ">
          <Text className="text-[12px] font-semibold text-gray-500 ml-[2px]">
            Dislike
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-10 h-5 flex-row items-center justify-center ml-4">
          <Text className="font-semibold text-gray-500 text-[12px]">Reply</Text>
        </TouchableOpacity>
      </View>
      {subcomment && subcomment.length > 0 && (
        <View className="w-[94%] h-fit flex-col items-start justify-end ml-5 mt-4 pt-4">
          <View className="w-12 h-full absolute top-0 -mt-10 pb-7">
            <View
              className={`w-full ${
                subComments.length > 0 ? "h-[60px]" : "h-[40px]"
              } border-l-[2px] border-solid border-gray-300`}
            ></View>
          </View>
          {subComments.length === 0 && (
            <View className="w-6 h-full absolute top-0 -mt-4 pb-7">
              <View
                className={`w-full h-6 border-l-[2px] border-b-[2px] border-solid border-gray-300 rounded-bl-[10px]`}
              ></View>
            </View>
          )}
          {subComments.map((item, index) => (
            <View
              key={item.id}
              className={`${
                index !== subComments.length - 1
                  ? "w-full h-fit pl-5 pr-2 border-l-[2px] border-solid border-gray-300"
                  : "w-full pl-5 pr-2"
              }`}
            >
              <View
                className={`w-12 h-6 rounded-b-[10px] border-l-[2px]  border-b-[2px] border-gray-300 absolute left-0  -mt-2 ${
                  index !== subComments.length - 1 ? "-ml-[2px]" : ""
                }`}
              ></View>
              <SubComment
                key={item.id}
                username={item.userName}
                avatar={item.userAvatar}
                comment={item.comment}
              />
            </View>
          ))}
          <TouchableOpacity
            className={`w-56 h-8 flex-row items-center justify-start px-3 mb-1 ml-5 pt-[1px] ${
              subComments.length > 0 ? "-mt-3" : "-mt-6"
            }`}
            onPress={handleShowAllSubComments}
          >
            <FontAwesomeIcon
              icon={icons.faArrowTurnUp}
              size={12}
              style={{
                color: "#9ca3af",
                transform: [{ rotate: "90deg" }],
              }}
            />
            <Text className="text-[13px] font-semibold text-gray-500 ml-1">
              {subComments.length === 0
                ? `View all ${subcomment.length} replies`
                : "Hide replies"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Comment;
