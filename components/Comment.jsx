import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash } from "../constants";
import SubComment from "./SubComment";
import { Image } from "expo-image";
import { FIREBASE_STORAGE } from "../firebaseConfig";
import { getDownloadURL, ref } from "firebase/storage";
import { PetLoader } from "./CustomLoader";
import { interact_comment } from "../api/BlogApi";
import * as timeago from "timeago.js";
import { useGlobalContext } from "../state/GlobalContextProvider";

const Comment = ({
  id,
  username,
  avatar,
  comment,
  subcomment,
  interaction,
  likes,
  dislikes,
  setParentCommentId,
  setParentUsername,
  accountId,
  currentUserId,
  setMyComment,
  setEditCommentId,
  setDeleteCommentId,
  createdAt,
  setShowModal,
}) => {
  const { blogChanged } = useGlobalContext();
  const [subComments, setSubComments] = useState([]);
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

  const handleShowAllSubComments = () => {
    if (subComments.length === 0) {
      setSubComments(subcomment);
      return;
    } else {
      setSubComments([]);
    }
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

  useEffect(() => {
    setSubComments([]);
  }, [blogChanged]);

  return isLoading ? (
    <PetLoader />
  ) : (
    <View className="w-full h-fit flex-col items-start justify-center mb-2 mt-1">
      <View className="w-full h-fit flex-row items-start justify-start">
        <View className="w-10 h-10 rounded-full border-[0.5px] border-solid border-gray-300">
          {avatarUrl && (
            <Image
              source={{ uri: avatarUrl }}
              className="w-full h-full rounded-full"
              placeholder={{ blurhash }}
              transition={0}
            />
          )}
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
                  newLikeCount > 0 && newDislikeCount > 0
                    ? "mr-[33px]"
                    : newLikeCount > 0 || newDislikeCount > 0
                    ? "mr-[10px]"
                    : ""
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
          {newLikeCount > 0 || newDislikeCount > 0 ? (
            <View
              className={`w-fit h-5 rounded-full flex-row items-center absolute right-0 bg-white ${
                newLikeCount > 0 && newDislikeCount > 0
                  ? "-mr-[28px]"
                  : "-mr-[20px]"
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
                  <Text className="text-[12px] ml-[3px]">
                    {newDislikeCount}
                  </Text>
                </View>
              )}
            </View>
          ) : null}
        </View>
      </View>
      <View className="w-full h-5 px-12 flex-row items-center justify-start mt-1">
        <View className="w-fit h-5 flex-row items-center justify-center ml-2">
          <Text className="text-[12px] text-gray-500">
            {getTimeAgo(createdAt)}
          </Text>
          <TouchableOpacity
            className="w-fit h-5 flex-row items-center justify-center ml-4"
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
        <View className="w-fit h-5 ml-4 flex-row items-center justify-center">
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
          className="w-10 h-5 flex-row items-center justify-center ml-4"
          onPress={() => {
            setParentCommentId(id);
            setParentUsername(username);
          }}
        >
          <Text className="font-semibold text-gray-500 text-[12px]">Reply</Text>
        </TouchableOpacity>
        {currentUserId == accountId && (
          <TouchableOpacity
            className="w-10 h-5 flex-row items-center justify-center ml-4"
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
                username={item.username}
                avatar={item.avatar}
                comment={item.text}
                setParentCommentId={setParentCommentId}
                setParentUsername={setParentUsername}
                parentId={id}
                id={item.id}
                interaction={item.interaction_type}
                likes={item.likes_count}
                dislikes={item.dislikes_count}
                currentUserId={currentUserId}
                accountId={item.account_id}
                setMyComment={setMyComment}
                setEditCommentId={setEditCommentId}
                setDeleteCommentId={setDeleteCommentId}
                createdAt={item.created_at}
                setShowModal={setShowModal}
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

export default memo(Comment);
