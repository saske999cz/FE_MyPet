import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash } from "../constants";
import { router } from "expo-router";
import { FIREBASE_STORAGE } from "../firebaseConfig";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import { CustomLoader } from "./CustomLoader";
import { Image } from "expo-image";
import LottieView from "lottie-react-native";

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
  quantity,
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
            <View className="flex-row items-center justify-between mb-1">
              <View className="w-[53%] h-full flex-row items-center justify-start -ml-[2px]">
                <FontAwesomeIcon
                  icon={icons.faDongSign}
                  size={13}
                  style={{ color: "#f59e0b" }}
                />
                <Text className="text-[15px] text-[#fb923c] font-semibold mr-3">
                  {parseInt(price).toLocaleString("vi-VN")}
                </Text>
              </View>
              {rating > 4 && soldUnits > 48 && (
                <View className="w-fit h-4 flex-row items-center justify-start bg-orange-500 rounded-[3px] pl-2 pr-1">
                  <Text className="text-[10px] text-white font-semibold mr-1">
                    Top seller
                  </Text>
                  <View className="w-4 h-4 rounded-full bg-white flex-row items-center justify-center">
                    <LottieView
                      style={{ width: 22, height: 22, marginTop: -10 }}
                      source={require("../assets/lottie/fire.json")}
                      autoPlay
                      speed={1.5}
                    />
                  </View>
                </View>
              )}
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
              {quantity === 0 && (
                <View
                  className={`w-fit flex-row items-center justify-center bg-red-500 ml-2 px-1 rounded-[3px] h-4`}
                >
                  <Text className={`text-white font-semibold text-[10px]`}>
                    Out of stock
                  </Text>
                </View>
              )}
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
