import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect, memo } from "react";
import { formatVND } from "../utils/currencyFormater";
import { Image } from "expo-image";
import { blurhash } from "../constants";
import { FIREBASE_STORAGE } from "../firebaseConfig";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import { PetLoader } from "./CustomLoader";
import { router } from "expo-router";

const SubOrderSectionItem = ({
  item,
  shopImage,
  shopAvatar,
  shopName,
  shopAddress,
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleNavigateProductDetail = () => {
    router.push({
      pathname: "../screens/ProductDetail",
      params: {
        id: item.product_id,
        shopImage: shopImage,
        shopAvatar: shopAvatar,
        shopAddress: shopAddress,
        shopName: shopName,
        rating: item.rating,
      },
    });
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imageFolderRef = ref(FIREBASE_STORAGE, item.product_image);
        const res = await listAll(imageFolderRef);
        if (res.items.length > 0) {
          const url = await getDownloadURL(res.items[0]);
          setImageUrl(url);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };
    fetchImage();
  }, []);

  return isLoading ? (
    <PetLoader />
  ) : (
    <TouchableOpacity
      className="w-full h-20 flex-row items-center justify-start mt-1 px-4"
      onPress={handleNavigateProductDetail}
    >
      <View className="w-20 h-16 flex-row items-center justify-center">
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-full"
          placeholder={{ blurhash }}
          transition={0}
        />
      </View>
      <View className="w-64 h-16 flex-col items-start justify-start ml-3">
        <Text className="text-[14px]" numberOfLines={1}>
          {item.name}
        </Text>
        <View className="w-full h-fit flex-row items-center justify-end mt-2">
          <Text className="text-[13px] text-black flex-row">
            x{item.quantity}
          </Text>
        </View>
        <View className="w-full h-fit flex-row items-center justify-end mt-1">
          <Text className="text-[13px] text-amber-500 flex-row">
            {formatVND(item.price)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(SubOrderSectionItem);
