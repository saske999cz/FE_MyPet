import { View, Text, TouchableOpacity } from "react-native";
import React, { memo, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash } from "../constants";
import { router } from "expo-router";
import { FIREBASE_STORAGE } from "../firebaseConfig";
import { getDownloadURL, ref } from "firebase/storage";
import { Image } from "expo-image";
import { CustomLoader } from "./CustomLoader";

const MedicalCenterCard = ({
  id,
  image,
  name,
  rating,
  distance,
  workingHours,
  telephone,
  description,
  isHorizontal,
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const handlePress = () => {
    router.push({
      pathname: "../screens/MedicalCenterDetail",
      params: {
        medicalCenterId: id,
        medicalCenterName: name,
        medicalCenterRating: rating,
        medicalCenterDistance: distance,
        medicalCenterWorkingHours: workingHours,
        medicalCenterTelephone: telephone,
        medicalCenterImage: imageUrl,
        medicalCenterDescription: description,
      },
    });
  };

  useEffect(() => {
    const fetchClinicAvatar = async () => {
      try {
        const clinicAvatarRef = ref(FIREBASE_STORAGE, image);
        const avatarUrl = await getDownloadURL(clinicAvatarRef);
        setImageUrl(avatarUrl);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching shop avatar:", error);
      }
    };
    fetchClinicAvatar();
  }, [image]);

  return (
    <TouchableOpacity
      className={`w-${
        isHorizontal ? "44" : "[47%]"
      } h-60 rounded-lg flex-col items-center justify-start mt-3 bg-white border-[0.5px] border-solid border-gray-200`}
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
          <View className="w-full flex-col items-start justify-center mt-2 px-2 py-2">
            <View className="flex-row items-center justify-start mb-2">
              <FontAwesomeIcon
                icon={icons.faHospital}
                size={12}
                style={{ color: "#3b82f6" }}
              />
              <Text
                className="text-[11px] font-semibold ml-1 w-36 h-4"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {name}
              </Text>
            </View>
            <View className="flex-row items-center justify-start mb-2">
              <FontAwesomeIcon
                icon={icons.faClock}
                size={11}
                style={{ color: "#4b5563" }}
              />
              <View className="flex-row items-center justify-start">
                <Text className="text-[10px] text-[#16a34a] font-semibold ml-1">
                  Open
                </Text>
                <Text className="text-[10px] ml-1">{workingHours}</Text>
              </View>
            </View>
            <View className="flex-row w-full items-center justify-start mb-2">
              <View className="rounded-[3px] bg-amber-100 flex-row items-center justiify-center px-[3px] py-[2px] border-[1px] border-solid border-amber-400">
                <FontAwesomeIcon
                  icon={icons.faStar}
                  size={10}
                  style={{ color: "#f59e0b" }}
                />
                <Text className="text-[10px] ml-1">
                  {parseFloat(rating).toFixed(1)}
                </Text>
              </View>

              <View className="w-[1px] h-3 bg-gray-300 ml-2"></View>
              <View className="w-full flex-row items-center justify-start ml-2">
                <FontAwesomeIcon
                  icon={icons.faLocationDot}
                  size={10}
                  style={{ color: "#ef4444" }}
                />
                <Text className="text-[10px] ml-[1px]">{distance}</Text>
              </View>
            </View>

            <View className="w-full flex-row items-center justify-start">
              <FontAwesomeIcon
                icon={icons.faPhone}
                size={10}
                style={{ color: "#3b82f6" }}
              />
              <Text className="ml-1 text-[10px]">Tel: {telephone}</Text>
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default memo(MedicalCenterCard);
