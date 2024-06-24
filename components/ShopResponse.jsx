import { View, Text } from "react-native";
import React, { useState, useEffect, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash } from "../constants";
import { Image } from "expo-image";
import { FIREBASE_STORAGE } from "../firebaseConfig";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import { ReviewLoader } from "./CustomLoader";

const ShopResponse = ({ username, review, rating, avatar }) => {
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
            </View>
          </View>
          <View className="w-full h-fit">
            <Text className="text-[13px]">{review}</Text>
          </View>
          <View className="w-full h-16 flex-row items-center justify-start px-2 mt-2 bg-gray-300">
            <Image
              source={{ uri: imageUrl }}
              className="w-12 h-full rounded-md"
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={0}
            />
            <Text className="text-[13px] ml-2">{item.name}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default memo(ShopResponse);
