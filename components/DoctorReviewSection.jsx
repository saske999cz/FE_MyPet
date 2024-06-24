import { View, Text } from "react-native";
import React, { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../constants";
import ReviewItem from "./ReviewItem";

const DoctorReviewSection = ({ item, type }) => {
  return (
    <View
      className="w-full h-fit rounded-md bg-white border-[0.5px] border-solid border-slate-200 mb-2 mt-2 px-2"
      key={item.appointment_id}
    >
      <View className="w-full h-5 flex-row items-center justify-start mb-2 mt-2">
        <FontAwesomeIcon
          icon={icons.faHospital}
          size={13}
          style={{ color: "#14b8a6" }}
        />
        <Text className="text-[13px] font-semibold text-black ml-1">
          {item.medical_center.name}
        </Text>
      </View>
      <View className="w-full h-fit mt-1">
        <ReviewItem item={item.doctor} shop={false} type={type} />
      </View>
    </View>
  );
};

export default memo(DoctorReviewSection);
