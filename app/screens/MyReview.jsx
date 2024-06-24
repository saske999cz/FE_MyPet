import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { router } from "expo-router";

const MyReview = () => {
  const handleBack = () => {
    router.back();
  };

  const handleNavigateProductReviews = () => {
    router.push({
      pathname: "../screens/ProductReview",
    });
  };

  const handleNavigateShopReviews = () => {
    router.push({
      pathname: "../screens/ShopReview",
    });
  };

  const handleNavigateDoctorReviews = () => {
    router.push({
      pathname: "../screens/DoctorReview",
    });
  };

  const handleNavigateClinicReviews = () => {
    router.push({
      pathname: "../screens/MedicalCenterReview",
    });
  };

  return (
    <SafeAreaView className="h-full w-full">
      <View className="w-full h-12 flex-row items-center justify-center border-b-[0.5px] border-solid border-gray-300">
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
        <Text className="font-bold text-[16px]">My Reviews</Text>
      </View>
      <View className="w-full h-fit flex-col">
        <TouchableOpacity
          className="w-full h-12 flex-row items-center justify-between px-4 border-b-[0.5px] border-solid border-gray-300"
          onPress={handleNavigateProductReviews}
        >
          <Text className="text-[14px]">Product Review</Text>
          <FontAwesomeIcon icon={icons.faChevronRight} size={16} />
        </TouchableOpacity>
        <TouchableOpacity
          className="w-full h-12 flex-row items-center justify-between px-4 border-b-[0.5px] border-solid border-gray-300"
          onPress={handleNavigateShopReviews}
        >
          <Text className="text-[14px]">Shop Review</Text>
          <FontAwesomeIcon icon={icons.faChevronRight} size={16} />
        </TouchableOpacity>
        <TouchableOpacity
          className="w-full h-12 flex-row items-center justify-between px-4 border-b-[0.5px] border-solid border-gray-300"
          onPress={handleNavigateDoctorReviews}
        >
          <Text className="text-[14px]">Doctor Review</Text>
          <FontAwesomeIcon icon={icons.faChevronRight} size={16} />
        </TouchableOpacity>
        <TouchableOpacity
          className="w-full h-12 flex-row items-center justify-between px-4 border-b-[0.5px] border-solid border-gray-300"
          onPress={handleNavigateClinicReviews}
        >
          <Text className="text-[14px]">Medical Center Review</Text>
          <FontAwesomeIcon icon={icons.faChevronRight} size={16} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MyReview;
