import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useMemo, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash } from "../constants";
import { router } from "expo-router";
import { FIREBASE_STORAGE } from "../firebaseConfig";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import { CustomLoader } from "./CustomLoader";
import { Image } from "expo-image";

const ItemCard = ({
  id,
  image,
  title,
  rating,
  price,
  soldUnits,
  shop,
  isHorizontal,
  description,
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imageFolderRef = ref(FIREBASE_STORAGE, image);
        const res = await listAll(imageFolderRef);
        if (res.items.length > 0) {
          const url = await getDownloadURL(res.items[0]);
          setImageUrl(url);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching image:", error);

        setIsLoading(false);
      }
    };
    fetchImage();
  }, []);

  const handlePress = () => {
    router.push({
      pathname: "../screens/ProductDetail",
      params: {
        id: id,
        shopName: shop.name,
        shopAddress: shop.address,
        shopAvatar: shop.avatar,
        shopImage: shop.image,
        rating: rating,
      },
    });
  };

  return (
    <TouchableOpacity
      className={`w-${
        isHorizontal ? "44" : "full"
      } h-60 flex-col items-center justify-start mt-3 bg-white rounded-lg border-[0.5px] border-solid border-gray-200`}
      onPress={handlePress}
    >
      {isLoading ? (
        <CustomLoader />
      ) : (
        <View className="w-full h-full flex-col items-center justify-start bg-white rounded-lg">
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-32 rounded-t-lg"
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={0}
            />
          )}
          <View className="w-full flex-col items-start justify-center mt-2 px-2 max-h-20">
            <View className="w-full h-9 mb-1 flex-row items-center justify-start mt-2 ">
              <Text
                className="text-[13px]"
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {title}
              </Text>
            </View>
            <View className="flex-row items-center justify-start mb-1">
              <FontAwesomeIcon
                icon={icons.faDongSign}
                size={13}
                style={{ color: "#f59e0b" }}
              />
              <Text className="text-[15px] text-[#fb923c] font-semibold">
                {parseInt(price).toLocaleString("vi-VN")}
              </Text>
            </View>
            <View className="flex-row w-full items-center justify-start mb-2">
              <View className="rounded-[3px] bg-pink-100 flex-row items-center justiify-center px-[3px] py-[2px] border-[1px] border-solid border-pink-400">
                <FontAwesomeIcon
                  icon={icons.faHeart}
                  size={10}
                  style={{ color: "#f43f5e" }}
                />
                <Text className="text-[10px] ml-1">
                  {parseFloat(rating).toFixed(1)}
                </Text>
              </View>

              <View className="w-[1px] h-3 bg-gray-300 ml-1"></View>
              <Text className="text-[10px] ml-1">{soldUnits} sold</Text>
            </View>
            <View className="w-full flex-row items-center justify-start">
              <FontAwesomeIcon
                icon={icons.faStore}
                size={10}
                style={{ color: "#14b8a6" }}
              />
              <Text className="ml-1 text-[10px]">{shop.name}</Text>
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default memo(ItemCard);
