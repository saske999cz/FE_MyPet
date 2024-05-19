import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../constants";
import { router } from "expo-router";

const DoctorCard = ({
  id,
  name,
  image,
  age,
  speciality,
  experience,
  gender,
  rating,
}) => {
  const handlePress = () => {
    router.push({
      pathname: "../screens/DoctorDetail",
      params: {
        doctorName: name,
        doctorAge: age,
        doctorImage: image,
        doctorGender: gender,
        doctorSpeciality: speciality,
        doctorExperience: experience,
        doctorRating: rating,
      },
    });
  };
  return (
    <TouchableOpacity
      className="w-44 h-56 flex-col items-center justify-start mb-3 mt-3 bg-white rounded-lg border-[0.5px] border-solid border-gray-200"
      onPress={handlePress}
    >
      <View className="w-full h-36 rounded-t-lg">
        <Image
          source={image}
          className="w-full h-full rounded-t-lg"
          resizeMode="cover"
        />
      </View>
      <View className="w-full flex-col items-start justify-start mt-3 px-2">
        <Text className="text-[13px] font-semibold mb-1">{name}</Text>
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
        <Text className="text-[12px] ">{experience}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default DoctorCard;
