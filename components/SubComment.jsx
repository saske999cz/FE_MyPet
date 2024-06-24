import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { blurhash, icons } from "../constants";
import { Image } from "expo-image";
import { FIREBASE_STORAGE } from "../firebaseConfig";
import { getDownloadURL, ref } from "firebase/storage";
import { PetLoader } from "./CustomLoader";
import { interact_comment } from "../api/BlogApi";
import * as timeago from "timeago.js";

const SubComment = ({
  id,
  username,
  avatar,
  comment,
  setParentCommentId,
  parentId,
  setParentUsername,
  interaction,
  likes,
  dislikes,
  currentUserId,
  accountId,
  setMyComment,
  createdAt,
  setEditCommentId,
  setDeleteCommentId,
  setShowModal,
}) => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newInteraction, setNewInteraction] = useState(interaction);
  const [newLikeCount, setNewLikeCount] = useState(likes);
  const [newDislikeCount, setNewDislikeCount] = useState(dislikes);

  const getTimeAgo = (createdTimeString) => {
    const createdTime = new Date(createdTimeString);
    const now = new Date();
    let relativeTimeString = timeago.format(createdTime, "en_US");
    return relativeTimeString;
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const avatarRef = ref(FIREBASE_STORAGE, avatar);
        const url = await getDownloadURL(avatarRef);
        setAvatarUrl(url);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching avatar:", error);
        setIsLoading(false);
      }
    };
    fetchAvatar();
  }, []);

  const handleLike = () => {
    if (newInteraction === "like") {
      setNewInteraction(null);
      setNewLikeCount(newLikeCount - 1);
    } else {
      if (newInteraction === "dislike") {
        setNewDislikeCount(newDislikeCount - 1);
      }
      setNewInteraction("like");
      setNewLikeCount(newLikeCount + 1);
    }
    interact_comment(id, "like");
  };

  const handleDislike = () => {
    if (newInteraction === "dislike") {
      setNewInteraction(null);
      setNewDislikeCount(newDislikeCount - 1);
    } else {
      if (newInteraction === "like") {
        setNewLikeCount(newLikeCount - 1);
      }
      setNewInteraction("dislike");
      setNewDislikeCount(newDislikeCount + 1);
    }
    interact_comment(id, "dislike");
  };

  return isLoading ? (
    <PetLoader />
  ) : (
    <View className="w-full h-fit flex-col items-start justify-center mb-4">
      <View className="w-full h-fit flex-row items-start justify-start">
        <View className="w-8 h-8 rounded-full border-[0.5px] border-solid border-gray-300">
          <Image
            source={{ uri: avatarUrl }}
            className="w-full h-full rounded-full"
            contentFit="cover"
            placeholder={{ blurhash }}
            transition={0}
          />
        </View>
        <View className="w-fit max-w-[80%] h-fit flex-col items-start justify-start bg-gray-200 rounded-lg px-2 ml-2">
          <View className="w-full flex-row items-start justify-between">
            <Text
              className="text-[13px] font-semibold text-black mt-2 mr-2"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {username}
            </Text>
            {currentUserId == accountId && (
              <TouchableOpacity
                className={`w-6 h-5 flex-row items-center justify-center mt-1 ${
                  newLikeCount > 0 || newDislikeCount > 0 ? "mr-[10px]" : ""
                }`}
                onPress={() => {
                  setMyComment(comment);
                  setEditCommentId(id);
                }}
              >
                <Text className="text-[12px] font-medium text-blue-500">
                  Edit
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Text className="text-[13px] text-gray-700 py-2 -mt-1">
            {comment}
          </Text>
        </View>
        {newLikeCount > 0 || newDislikeCount > 0 ? (
          <View
            className={`w-fit h-5 rounded-full flex-row items-center absolute right-0 bg-white ${
              newLikeCount > 0 && newDislikeCount > 0
                ? "-mr-[-8px]"
                : "-mr-[-5px]"
            }`}
          >
            {newLikeCount > 0 && (
              <View className="w-fit h-5 flex-row items-center justify-center px-1">
                <View className="w-fit p-[3px] h-fit rounded-full bg-blue-500">
                  <FontAwesomeIcon
                    icon={icons.faThumbsUp}
                    size={10}
                    style={{ color: "#ffffff" }}
                  />
                </View>
                <Text className="text-[12px] ml-[3px]">{newLikeCount}</Text>
              </View>
            )}
            {newDislikeCount > 0 && (
              <View className="w-fit h-5 flex-row items-center justify-center px-1">
                <View className="w-fit p-[3px] h-fit rounded-full bg-red-500">
                  <FontAwesomeIcon
                    icon={icons.faThumbsDown}
                    size={10}
                    style={{ color: "#ffffff" }}
                  />
                </View>
                <Text className="text-[12px] ml-[3px]">{newDislikeCount}</Text>
              </View>
            )}
          </View>
        ) : null}
      </View>
      <View className="w-full h-5 px-12 flex-row items-center justify-start mt-1">
        <View className="w-fit h-5 flex-row items-center justify-center">
          <Text className="text-[12px] text-gray-500">
            {getTimeAgo(createdAt)}
          </Text>
          <TouchableOpacity
            className="w-fit h-5 flex-row items-center justify-center ml-2"
            onPress={handleLike}
          >
            <Text
              className={`text-[12px] font-semibold text-gray-500 ml-[2px] ${
                newInteraction === "like" ? "text-blue-500" : ""
              }`}
            >
              {newInteraction === "like" ? "Liked" : "Like"}
            </Text>
          </TouchableOpacity>
        </View>
        <View className="w-fit h-5 ml-2 flex-row items-center justify-center">
          <TouchableOpacity
            className="w-fit h-5 flex-row items-center justify-center"
            onPress={handleDislike}
          >
            <Text
              className={`text-[12px] font-semibold text-gray-500 ml-[2px] ${
                newInteraction === "dislike" ? "text-blue-500" : ""
              }`}
            >
              {newInteraction === "dislike" ? "Disliked" : "Dislike"}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className="w-10 h-5 flex-row items-center justify-center ml-2"
          onPress={() => {
            setParentCommentId(parentId);
            setParentUsername(username);
          }}
        >
          <Text className="font-semibold text-gray-500 text-[12px]">Reply</Text>
        </TouchableOpacity>
        {currentUserId == accountId && (
          <TouchableOpacity
            className="w-10 h-5 flex-row items-center justify-center ml-2"
            onPress={() => {
              setDeleteCommentId(id);
              setShowModal(true);
            }}
          >
            <Text className="font-semibold text-red-500 text-[12px]">
              Delete
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default memo(SubComment);
