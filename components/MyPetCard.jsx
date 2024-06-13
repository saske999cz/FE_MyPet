import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash } from "../constants";
import { Image } from "expo-image";
import { FIREBASE_STORAGE } from "../firebaseConfig";
import { getDownloadURL, ref } from "firebase/storage";
import { router } from "expo-router";

const MyPetCard = ({ pet }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imagerRef = ref(FIREBASE_STORAGE, pet.image);
        const avatarUrl = await getDownloadURL(imagerRef);
        setImageUrl(avatarUrl);
      } catch (error) {
        console.error("Error fetching shop avatar:", error);
      }
    };
    fetchImage();
  }, []);

  const handleMyPetPress = () => {
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

  return (
    <TouchableOpacity
      className="w-28 h-36 m-2 bg-white rounded-lg"
      onPress={handleMyPetPress}
    >
      <View className="w-full h-full flex-col items-center justify-start rounded-lg">
        <View style={{ width: "100%" }} className="h-24">
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-full rounded-t-lg"
            contentFit="cover"
            placeholder={{ blurhash }}
            transition={0}
          />
        </View>
        <View className="w-full flex-col items-start justify-center mt-2 px-2">
          <Text className="text-[14px] font-semibold mb-2">{pet.pet_name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MyPetCard;
