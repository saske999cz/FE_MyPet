import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash } from "../constants";
import DynamicImageGrid from "./DynamicImageGrid";
import { router } from "expo-router";
import { Image } from "expo-image";
import { PostLoader } from "./CustomLoader";
import { FIREBASE_STORAGE } from "../firebaseConfig";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import { interact_blog } from "../api/BlogApi";
import * as timeago from "timeago.js";

const MyMinimalPost = ({
  id,
  avatar,
  username,
  title,
  description,
  uploadedImage,
  likes,
  dislikes,
  comments,
  interaction,
  createdAt,
  setIsBottomSheetVisible,
  setCurrentImageUrls,
  setCurrentTitle,
  setCurrentText,
  setCurrentBlogId,
  setCurrentFolderRef,
}) => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [imageUrls, setImageUrls] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [flags, setFlags] = useState([]);
  const [newInteraction, setNewInteraction] = useState(interaction);
  const [newLikeCount, setNewLikeCount] = useState(likes);
  const [newDislikeCount, setNewDislikeCount] = useState(dislikes);

  const handlePostPress = () => {
    router.push({
      pathname: "../screens/PostDetail",
      params: {
        id: id,
        interaction: interaction,
      },
    });
  };

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
    interact_blog(id, "like");
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
    interact_blog(id, "dislike");
  };

  const getTimeAgo = (createdTimeString) => {
    const createdTime = new Date(createdTimeString);
    const now = new Date();
    const relativeTimeString = timeago.format(createdTime, "en_US"); // Format using English locale
    return relativeTimeString;
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const avatarRef = ref(FIREBASE_STORAGE, avatar);
        const url = await getDownloadURL(avatarRef);
        setAvatarUrl(url);
        setFlags((prev) => [...prev, true]);
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };
    const fetchImages = async () => {
      try {
        const imageRefs = ref(FIREBASE_STORAGE, uploadedImage);
        const res = await listAll(imageRefs);
        if (res.items.length > 0) {
          Promise.all(res.items.map((item) => getDownloadURL(item)))
            .then((urls) => {
              setImageUrls(urls);
              setFlags((prev) => [...prev, true]);
            })
            .catch((error) => console.error(error));
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        setIsLoading(false);
      }
    };
    fetchAvatar();
    fetchImages();
  }, []);

  useEffect(() => {
    if (flags.length === 2 && flags.every((flag) => flag === true)) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [flags]);

  return isLoading ? (
    <PostLoader />
  ) : (
    <TouchableOpacity className="w-full h-fit" onPress={handlePostPress}>
      <View className="w-full h-fit flex-col items-center jusify-start border-b-4 border-gray-300 pb-2">
        <View className="flex-row justify-between items-center w-full h-10 mt-2 px-3">
          <View className="w-[90%] flex-row items-center justify-start">
            <Image
              source={{ uri: avatarUrl }}
              className="w-9 h-9 rounded-full"
              placeholder={{ blurhash }}
              transition={0}
            />
            <View className="w-fit h-fit ml-4 flex-col">
              <Text className="text-[14px] font-semibold">{username}</Text>
              <View className="w-fit h-fit flex-row items-center justify-start">
                <Text className="text-[12px] text-gray-500 mr-1">
                  {getTimeAgo(createdAt)}
                </Text>
                <FontAwesomeIcon
                  icon={icons.faEarthAmericas}
                  size={12}
                  style={{ color: "#9ca3af" }}
                />
              </View>
            </View>
          </View>
          <TouchableOpacity
            className="w-8 h-8 rounded-full flex-row items-center justify-center"
            onPress={() => {
              setCurrentImageUrls(imageUrls);
              setCurrentTitle(title);
              setCurrentText(description);
              setCurrentBlogId(id);
              setCurrentFolderRef(uploadedImage);
              setIsBottomSheetVisible();
            }}
          >
            <FontAwesomeIcon
              icon={icons.faEllipsis}
              size={20}
              style={{ color: "#000000" }}
            />
          </TouchableOpacity>
        </View>
        <View className="w-full h-fit flex-row justify-start items-center px-3 mt-2">
          <View className="flex-1">
            <Text className="text-[15px] font-semibold text-red-900">
              {title}
            </Text>
          </View>
        </View>
        <View className="w-full h-fit max-h-28 px-3 mt-2">
          <Text className="text-[14px]" numberOfLines={5} ellipsizeMode="tail">
            {description}
          </Text>
        </View>
        <View className="w-full h-fit mt-3">
          {imageUrls && imageUrls.length > 0 && (
            <DynamicImageGrid images={imageUrls} />
          )}
        </View>
        <View
          className={`w-full h-10 flex-row items-center ${
            newLikeCount > 0 || newDislikeCount > 0
              ? "justify-between"
              : "justify-end"
          }`}
        >
          <View className="w-fit px-2 h-fit flex-row items-center">
            {newLikeCount > 0 && (
              <View className="w-fit h-7 flex-row items-center justify-center px-1">
                <View className="w-fit p-1 h-fit rounded-full bg-blue-500">
                  <FontAwesomeIcon
                    icon={icons.faThumbsUp}
                    size={12}
                    style={{ color: "#ffffff" }}
                  />
                </View>
                <Text className="text-[13px] ml-[3px]">{newLikeCount}</Text>
              </View>
            )}
            {newDislikeCount > 0 && (
              <View className="w-fit h-5 flex-row items-center justify-center px-1">
                <View className="w-fit p-1 h-fit rounded-full bg-red-500">
                  <FontAwesomeIcon
                    icon={icons.faThumbsDown}
                    size={12}
                    style={{ color: "#ffffff" }}
                  />
                </View>
                <Text className="text-[13px] ml-[3px]">{newDislikeCount}</Text>
              </View>
            )}
          </View>

          <View
            className="w-fit h-7 flex-row items-center justify-center px-[14px]"
            onPress={handlePostPress}
          >
            <Text className="text-[13px] mr-[3px]">{comments}</Text>
            <Text className="text-[13px]">
              {comments > 1 ? "comments" : "comment"}
            </Text>
          </View>
        </View>
        <View className="w-full h-12 flex-row justify-between items-center px-4 border-t-[1px] border-solid border-gray-300 pt-2">
          <View className="flex-row justify-start items-center w-fit">
            <TouchableOpacity
              className="min-w-fit h-10 flex-row items-center justify-center"
              onPress={handleLike}
            >
              <FontAwesomeIcon
                icon={icons.faThumbsUp}
                size={15}
                style={{
                  color: newInteraction === "like" ? "#3b82f6" : "#9ca3af",
                }}
              />
              <Text className="text-[14px] font-semibold text-gray-600 ml-[5px]">
                {newInteraction === "like" ? "Liked" : "Like"}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center items-center w-fit">
            <TouchableOpacity
              className="min-w-fit h-10 flex-row items-center justify-center"
              onPress={handleDislike}
            >
              <FontAwesomeIcon
                icon={icons.faThumbsDown}
                size={16}
                style={{
                  color: newInteraction === "dislike" ? "#3b82f6" : "#9ca3af",
                }}
              />
              <Text className="text-[14px] font-semibold text-gray-600 ml-[5px]">
                {newInteraction === "dislike" ? "Disliked" : "Dislike"}
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-end items-center w-fit">
            <TouchableOpacity
              className="min-w-fit h-10 flex-row items-center justify-center"
              onPress={handlePostPress}
            >
              <FontAwesomeIcon
                icon={icons.faComment}
                size={15}
                style={{ color: "#9ca3af" }}
              />
              <Text className="text-[14px] font-semibold text-gray-600 ml-[5px]">
                Comment
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(MyMinimalPost);
