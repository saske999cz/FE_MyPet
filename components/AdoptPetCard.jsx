import { View, Text, TouchableOpacity } from "react-native";
import React, { memo, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash } from "../constants";
import { router } from "expo-router";
import { FIREBASE_STORAGE } from "../firebaseConfig";
import { getDownloadURL, ref } from "firebase/storage";
import { CustomLoader } from "./CustomLoader";
import { Image } from "expo-image";

const AdoptPetCard = ({ id, image, name, gender, age, isHorizontal }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);

  const handlePress = () => {
    router.push({
      pathname: "../screens/AdoptPetDetail",
      params: {
        petId: id,
        petName: name,
        petAge: age,
        petImage: encodeURI(imageUrl),
        petGender: gender,
      },
    });
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imageRef = ref(FIREBASE_STORAGE, image);
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
    <TouchableOpacity
      className={`w-${
        isHorizontal ? "44" : "[47%]"
      } flex-col items-center justify-start mt-3 bg-white rounded-lg border-[0.5px] border-solid border-gray-200`}
      onPress={handlePress}
    >
      {isLoading ? (
        <CustomLoader />
      ) : (
        <View className="w-full h-fit flex-col">
          <View className="w-full h-36 rounded-t-lg">
            {imageUrl && (
              <Image
                source={{ uri: imageUrl }}
                className="w-full h-full rounded-t-lg"
                contentFit="cover"
                placeholder={{ blurhash }}
                transition={0}
              />
            )}
          </View>
          <View className="w-full flex-col items-start justify-center mt-2 px-2">
            <Text className="text-[15px] font-semibold mb-2">{name}</Text>
            <View className="flex-row w-full items-center justify-start mb-2">
              <Text className="text-[12px] mr-1">
                {gender === "male" ? "Male" : "Female"}
              </Text>
              {gender === "male" ? (
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
            <Text className="text-[12px] mb-2">{age} years old</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default memo(AdoptPetCard);
