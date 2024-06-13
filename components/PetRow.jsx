import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash } from "../constants";
import { router } from "expo-router";
import { Image } from "expo-image";
import { FIREBASE_STORAGE } from "../firebaseConfig";
import { getDownloadURL, ref } from "firebase/storage";
import { PetLoader } from "./CustomLoader";

const PetRow = ({ item, handleDelete }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);

  const handleMyPetPress = (pet) => {
    router.push({
      pathname: "../screens/MyPetDetail",
      params: {
        id: pet.pet_id,
        name: pet.pet_name,
        age: pet.age,
        gender: pet.gender,
        image: imageUrl,
        breed: pet.breed.name,
      },
    });
  };

  const handleLongPress = () => {
    if (showOptions) {
      setShowOptions(false);

      return;
    }
    setShowOptions(true);
  };

  useEffect(() => {
    const fetchImageUri = async () => {
      try {
        const imageRef = ref(FIREBASE_STORAGE, item.image);
        const imageUrl = await getDownloadURL(imageRef);
        setImageUrl(imageUrl);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching pet image:", error);
        setIsLoading(false);
      }
    };
    fetchImageUri();
  }, []);

  return isLoading ? (
    <PetLoader />
  ) : (
    <TouchableOpacity
      className={`w-full h-12 relative flex-row items-center justify-start px-3 mt-3 z-9 ${
        showOptions ? "mb-3" : "mb-3"
      }`}
      onPress={() => handleMyPetPress(item)}
      onLongPress={handleLongPress}
    >
      <View className="w-12 h-12 rounded-full border-[0.5px] border-solid border-gray-400">
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-full rounded-full"
          transition={0}
          placeholder={{ blurhash }}
        />
      </View>
      <View className="w-[80%] h-fit flex-col items-start justify-start ml-2">
        <View className="w-full h-fit flex-row items-center justify-start">
          <Text className="text-[15px] font-semibold">{item.pet_name}</Text>
        </View>
        <View className="w-full h-fit flex-row items-center justify-start">
          <Text className="text-[13px] mr-1">{item.gender}</Text>
          {item.gender === "male" ? (
            <FontAwesomeIcon
              icon={icons.faMars}
              size={13}
              style={{ color: "#3b82f6" }}
            />
          ) : (
            <FontAwesomeIcon
              icon={icons.faVenus}
              size={13}
              style={{ color: "#f43f5e" }}
            />
          )}
        </View>
      </View>
      {showOptions && (
        <View className="absolute right-0 top-0 w-32 h-10 rounded-[10px] z-9">
          <TouchableOpacity
            className="w-full h-full flex-row items-center justify-center rounded-[10px]"
            onPress={handleDelete}
          >
            <FontAwesomeIcon
              icon={icons.faTrashCan}
              size={15}
              style={{ color: "#ef4444" }}
            />
            <Text className="text-[14px] font-semibold ml-2 text-red-500">
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default memo(PetRow);
