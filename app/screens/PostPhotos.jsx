import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { Image } from "expo-image";
import { icons, blurhash } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { router, useLocalSearchParams } from "expo-router";
import ImageView from "react-native-image-viewing";

const PostPhotos = () => {
  const { images } = useLocalSearchParams();
  const [imagesUrls, setImagesUrls] = useState(images.split(","));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [visible, setIsVisible] = useState(false);
  const [imageList, setImageList] = useState([]);

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    const imageSources = imagesUrls.map((url) => ({ uri: url }));
    setImageList(imageSources);
  }, [imagesUrls]);

  return (
    <View className="w-full h-full">
      <View className="w-full h-12 flex-row items-center justify-center mt-12">
        <TouchableOpacity
          className="w-12 h-12 flex-row items-center justify-center absolute top-0 left-0"
          onPress={handleBack}
        >
          <FontAwesomeIcon
            icon={icons.faArrowLeftLong}
            size={20}
            style={{ color: "#f59e0b" }}
          />
        </TouchableOpacity>
        <Text className="font-bold text-[16px]">Post Images</Text>
      </View>
      <ScrollView>
        {imagesUrls && (
          <View className="w-full h-fit flex-col">
            {imagesUrls.map((image, index) => (
              <TouchableOpacity
                className={`w-full h-80 mb-4 ${
                  index === imagesUrls.length - 1
                    ? ""
                    : "border-b-[2px] border-solid border-gray-300"
                }`}
                key={index}
                onPress={() => {
                  setCurrentImageIndex(index);
                  setIsVisible(true);
                }}
              >
                <Image
                  source={{ uri: image }}
                  className="w-full h-full"
                  placeholder={{ blurhash }}
                  transition={0}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
      {imageList && imageList.length > 0 && (
        <ImageView
          images={imageList}
          imageIndex={currentImageIndex}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
      )}
    </View>
  );
};

export default PostPhotos;
