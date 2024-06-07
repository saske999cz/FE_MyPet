import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash } from "../constants";
import { router } from "expo-router";
import { FIREBASE_STORAGE } from "../firebaseConfig";
import { getDownloadURL, ref } from "firebase/storage";
import { Image } from "expo-image";
import { CustomLoader } from "./CustomLoader";

const DoctorCard = ({ id, name, image, age, gender, rating, email, phone }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handlePress = () => {
    router.push({
      pathname: "../screens/DoctorDetail",
      params: {
        doctorId: id,
        doctorName: name,
        doctorAge: age,
        doctorImage: imageUrl,
        doctorGender: gender,
        doctorRating: rating,
        doctorEmail: email,
        doctorPhone: phone,
      },
    });
  };

  useEffect(() => {
    const fetchDoctorAvatar = async () => {
      try {
        const doctorAvatarRef = ref(FIREBASE_STORAGE, image);
        const avatarUrl = await getDownloadURL(doctorAvatarRef);
        setImageUrl(avatarUrl);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching shop avatar:", error);
      }
    };
    fetchDoctorAvatar();
  }, [image]);

  return (
    <TouchableOpacity
      className="w-44 h-52 flex-col items-center justify-start mb-3 mt-3 bg-white rounded-lg border-[0.5px] border-solid border-gray-200"
      onPress={handlePress}
    >
      {isLoading ? (
        <CustomLoader />
      ) : (
        <View className="w-full h-full flex-col items-center justify-start bg-white rounded-lg">
          <View className="w-full h-36 rounded-t-lg">
            {imageUrl && (
              <Image
                source={{ uri: imageUrl }}
                className="w-full h-full rounded-t-lg"
                placeholder={{ blurhash }}
                contentFit="cover"
                transition={200}
              />
            )}
          </View>
          <View className="w-full flex-col items-start justify-start mt-3 px-2">
            <Text className="text-[13px] font-semibold mb-1">{`Dr.${name}`}</Text>
            <View className="rounded-[3px] bg-amber-100 flex-row items-center justiify-center px-[3px] py-[2px] border-[1px] border-solid border-amber-400 mb-1">
              <FontAwesomeIcon
                icon={icons.faStar}
                size={10}
                style={{ color: "#f59e0b" }}
              />
              <Text className="text-[10px] ml-1">
                {parseFloat(rating).toFixed(1)}
              </Text>
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default DoctorCard;
