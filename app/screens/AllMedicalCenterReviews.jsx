import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { router } from "expo-router";
import Review from "../../components/Review";
import { useLocalSearchParams } from "expo-router";
import { get_medical_center_reviews } from "../../api/RatingApi";

const AllMedicalCenterReviews = () => {
  const { medicalCenterId, totalReviews } = useLocalSearchParams();
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const handleBack = () => {
    router.back();
  };

  const handleLoadMore = () => {
    if (page < maxPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const getReviews = async () => {
      try {
        get_medical_center_reviews(medicalCenterId, page, 10).then((res) => {
          if (res && res.status === 200) {
            const newReviews = [...reviews, ...res.data.data];
            const uniqueReviews = newReviews.reduce((unique, review) => {
              if (!unique.find((item) => item.rating_id === review.rating_id)) {
                unique.push(review);
              }
              return unique;
            }, []);
            setReviews(uniqueReviews);
            setMaxPage(res.data.total_pages);
          }
        });
      } catch (error) {
        console.error("Error fetching similar products:", error);
      }
    };
    getReviews();
  }, [page]);

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
        {reviews && (
          <Text className="font-bold text-[16px]">{`Reviews(${totalReviews})`}</Text>
        )}
      </View>
      {reviews && (
        <FlatList
          data={reviews}
          renderItem={({ item }) => (
            <Review
              avatar={item.customer_avatar}
              username={item.customer_username}
              rating={item.rating_score}
              review={item.description}
              type="medical_center"
            />
          )}
          keyExtractor={(item) => item.rating_id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          scrollEventThrottle={16}
        />
      )}
    </SafeAreaView>
  );
};

export default AllMedicalCenterReviews;
