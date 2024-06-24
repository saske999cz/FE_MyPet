import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect, memo } from "react";
import { Image } from "expo-image";
import { FIREBASE_STORAGE } from "../firebaseConfig";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import { icons, blurhash } from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { router } from "expo-router";

const ReviewShop = ({ item, type }) => {
  const [imageUrl, setImageUrl] = useState(null);

  const MakeReview = () => {
    if (type === "unreviewed") {
      router.push({
        pathname: "../screens/MakeReview",
        params: {
          shopId: item.shop_id,
          name: item.shop_name,
          image: encodeURI(imageUrl),
        },
      });
    } else {
      router.push({
        pathname: "../screens/ReviewDetail",
        params: {
          shopId: item.shop_id,
          name: item.shop_name,
          image: encodeURI(imageUrl),
          type: type,
        },
      });
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      const imageFolderRef = ref(FIREBASE_STORAGE, item.shop_image);
      const res = await listAll(imageFolderRef);
      if (res.items.length > 0) {
        const url = await getDownloadURL(res.items[0]);
        setImageUrl(url);
      } else {
        console.log("No image found");
      }
    };
    fetchImage();
  }, []);

  return (
    <TouchableOpacity
      className="w-full h-24 flex-row items-center justify-start px-2 mb-2 mt-2 bg-white rounded-md"
      onPress={MakeReview}
      key={item.id}
    >
      <View className="w-20 h-16 flex-row items-center justify-center">
        <Image
          source={{ uri: imageUrl }}
          placeholder={{ blurhash }}
          transition={0}
          contentFit="cover"
          className="w-full h-full"
        />
      </View>
      <View className="w-64 h-16 flex-col items-start justify-start ml-3">
        <View className="w-full h-fit flex-row items-center justify-start">
          <FontAwesomeIcon
            icon={icons.faStore}
            size={13}
            style={{ color: "#14b8a6" }}
          />
          <Text
            className="text-[13px] ml-1 font-semibold"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.shop_name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ReviewShop);
