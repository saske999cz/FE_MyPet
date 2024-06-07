import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { Image } from "expo-image";
import { FIREBASE_STORAGE } from "../firebaseConfig";
import { getDownloadURL, ref } from "firebase/storage";
import LottieView from "lottie-react-native";
import { blurhash } from "../constants";

const PetDropDownBox = ({
  placeHolderText,
  data,
  onSelect,
  selectedPet,
  selectedPetImage,
  setSelectedPetImage,
  error,
  title,
  titleStyles,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        if (data) {
          const urls = await Promise.all(
            data.map(async (pet) => {
              const storageRef = ref(FIREBASE_STORAGE, pet.image);
              return await getDownloadURL(storageRef);
            })
          );

          setImageList(urls);
        } else {
          console.log("No data available.");
        }
      } catch (error) {
        console.log("Error fetching images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [data]);

  return (
    <View className="w-full h-20 flex-col z-[7]">
      <View
        className={`w-full h-8 flex-row items-center px-2 ${
          error ? "justify-between" : " justify-start"
        }`}
      >
        <Text className={`font-semibold text-gray-50 ${titleStyles}`}>
          {title}
        </Text>
        {error && <Text className="text-red-500 text-[12px]">{error}</Text>}
      </View>
      <TouchableOpacity
        className={`w-full h-12 flex-row items-center justify-center border-[2px] border-solid ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md relative`}
        onPress={() => setIsFocused(!isFocused)}
      >
        <View className="w-full h-12 flex-row items-center justify-start px-1">
          {selectedPet && selectedPetImage && (
            <View className="w-10 h-10 rounded-full border-[1px] border-solid border-gray-300">
              <Image
                source={{ uri: selectedPetImage }}
                className="w-full h-full rounded-full"
              />
            </View>
          )}
          <Text
            className={`ml-2 ${
              selectedPet
                ? "text-[13px] font-semibold text-black"
                : "text-[13px] text-gray-500"
            }`}
          >
            {selectedPet ? selectedPet.pet_name : placeHolderText}
          </Text>
        </View>
        {isFocused && (
          <View className="w-full h-40 absolute rounded-md top-0 left-0 right-0 mt-[14%] bg-orange-50 px-2">
            {isLoading ? (
              <LottieView
                style={{ width: 130, height: 130, marginTop: 20 }}
                source={require("../assets/lottie/loading.json")}
                autoPlay
                loop
                speed={1.5}
              />
            ) : (
              <ScrollView className="w-[99%] h-[99%] rounded-md">
                {data.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedPetImage(imageList[index]);
                      setIsFocused(false);
                      onSelect(item);
                    }}
                    className="w-full h-12 flex-row items-center justify-start mt-1 rounded-md"
                    key={item.pet_id}
                  >
                    {imageList && (
                      <View className="w-10 h-10 rounded-full border-[1px] border-solid border-gray-300">
                        <Image
                          source={{ uri: imageList[index] }}
                          className="w-full h-full rounded-full"
                          contentFit="cover"
                          placeholder={{ blurhash }}
                          transition={0}
                        />
                      </View>
                    )}

                    <Text className="text-[14px] font-semibold text-black ml-2">
                      {item.pet_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default PetDropDownBox;
