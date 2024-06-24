import { View, Text } from "react-native";
import React, { useState, useEffect, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash } from "../constants";
import { Image } from "expo-image";
import { FIREBASE_STORAGE } from "../firebaseConfig";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import { ReviewLoader } from "./CustomLoader";

const Review = ({ username, review, rating, avatar, type }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imageRef = ref(FIREBASE_STORAGE, avatar);
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching image:", error);
        setIsLoading(false);
      }
    };
    fetchImage();
  }, []);

  return (
    <View className="w-full h-fit border-b-[1px] border-solid border-gray-300 py-4 px-4">
      {isLoading ? (
        <ReviewLoader />
      ) : (
        <View className="w-full h-fit">
          <View className="w-full h-10 flex-row items-center justify-start mb-2">
            <View className="w-8 h-8 rounded-full flex-row items-center justify-center border-[1px] border-solid border-gray-300">
              <Image
                source={{ uri: imageUrl }}
                className="w-full h-full rounded-full"
                placeholder={{ blurhash }}
                contentFit="cover"
                transition={0}
              />
            </View>
            <View className="w-40 h-10 flex-col items-start justify-center ml-2">
              <Text className="text-[13px] font-semibold">{username}</Text>
              <View className="w-10 h-fit flex-row items-center justify-start mt-1">
                <FontAwesomeIcon
                  icon={
                    type === "medical_center" ||
                    type === "doctor" ||
                    type === "shop"
                      ? icons.faStar
                      : icons.faHeart
                  }
                  size={10}
                  style={{
                    color:
                      type === "medical_center" ||
                      type === "doctor" ||
                      type === "shop"
                        ? "#fbbf24"
                        : "#f43f5e",
                  }}
                />
                <Text className="text-[12px] ml-1">
                  {parseFloat(rating).toFixed(1)}
                </Text>
              </View>
            </View>
          </View>
          <View className="w-full h-fit">
            <Text className="text-[13px]">{review}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default memo(Review);
