import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect, memo } from "react";
import { Image } from "expo-image";
import { FIREBASE_STORAGE } from "../firebaseConfig";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import { icons, blurhash } from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { router } from "expo-router";

const ReviewItem = ({ item, shop, type }) => {
  const [imageUrl, setImageUrl] = useState(null);

  const MakeReview = () => {
    if (type === "unreviewed") {
      if (shop)
        router.push({
          pathname: "../screens/MakeReview",
          params: {
            productId: item.product_id,
            name: item.name,
            image: encodeURI(imageUrl),
          },
        });
      else
        router.push({
          pathname: "../screens/MakeReview",
          params: {
            doctorId: item.id,
            name: item.full_name,
            image: encodeURI(imageUrl),
          },
        });
    } else {
      if (shop)
        router.push({
          pathname: "../screens/ReviewDetail",
          params: {
            productId: item.product_id,
            name: item.name,
            image: encodeURI(imageUrl),
            type: type,
          },
        });
      else
        router.push({
          pathname: "../screens/ReviewDetail",
          params: {
            doctorId: item.id,
            name: item.full_name,
            image: encodeURI(imageUrl),
            type: type,
          },
        });
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      const imageFolderRef = ref(FIREBASE_STORAGE, item.image);
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
      className="w-full h-24 flex-row items-center justify-start px-2 mb-1"
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
        <Text className="text-[14px]" numberOfLines={3} ellipsizeMode="tail">
          {shop ? item.name : item.full_name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ReviewItem);
