import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { router } from "expo-router";
import { ProductReviewDummy } from "../../dummy/FakeData";
import Review from "../../components/Review";

const AllReviews = () => {
  const [reviews, setReviews] = useState(ProductReviewDummy);
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="h-full w-full">
      <View className="w-full h-12 flex-row items-center justify-center mb-2 border-b-[0.5px] border-solid border-gray-300">
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
        <Text className="font-bold text-[16px]">{`Reviews(${reviews.length})`}</Text>
      </View>
      <FlashList
        data={ProductReviewDummy}
        renderItem={({ item }) => (
          <Review
            avatar={item.userAvatar}
            username={item.userName}
            rating={item.rating}
            review={item.review}
          />
        )}
        keyExtractor={(item) => item.id}
        estimatedItemSize={30}
      />
    </SafeAreaView>
  );
};

export default AllReviews;
