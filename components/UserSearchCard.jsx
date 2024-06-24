import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect, memo } from "react";
import { router } from "expo-router";
import { Image } from "expo-image";
import { blurhash } from "../constants";
import { FIREBASE_STORAGE } from "../firebaseConfig";
import { getDownloadURL, ref } from "firebase/storage";
import { PetLoader } from "./CustomLoader";

const UserSearchCard = ({ id, username, email, avatar }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handlePress = () => {
    router.push({
      pathname: "../screens/ProfileDetail",
      params: {
        id: id.toString(),
        username: username,
        avatar: encodeURI(avatarUrl),
        email: email,
      },
    });
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
      }
    };
    fetchAvatar();
  }, []);

  return isLoading ? (
    <PetLoader />
  ) : (
    <TouchableOpacity
      className="w-full h-20 px-4 flex-row items-center justify-start"
      onPress={handlePress}
    >
      <View className="w-12 h-12 rounded-full border-[0.5px] border-solid border-gray-300">
        <Image
          source={{ uri: avatarUrl }}
          className="w-full h-full rounded-full"
          placeholder={{ blurhash }}
          transition={0}
        />
      </View>
      <View className="w-4/5 h-full flex-col items-start justify-center ml-2">
        <Text className="text-[14px] font-semibold">{username}</Text>
        <Text className="text-[13px] mt-2">{email}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default memo(UserSearchCard);
