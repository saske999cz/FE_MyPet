import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash, images } from "../../constants";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import Review from "../../components/Review";
import { get_doctor_reviews } from "../../api/RatingApi";

const DoctorDetail = () => {
  const {
    doctorId,
    doctorName,
    doctorRating,
    doctorImage,
    doctorGender,
    doctorEmail,
    doctorPhone,
  } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const handleLoadMore = () => {
    if (page < maxPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // fetch data
    setRefreshing(false);
  };
  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    const encodedDoctorAvatar = doctorImage.replace("/doctor/", "%2Fdoctor%2F");
    setImageUrl(encodedDoctorAvatar);
  }, []);

  useEffect(() => {
    const getReviews = async () => {
      try {
        get_doctor_reviews(doctorId, page, 10).then((res) => {
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
          } else {
            console.log("Error fetching doctor reviews");
          }
        });
      } catch (error) {
        console.error("Error fetching doctor reviews:", error);
      }
    };
    getReviews();
  }, [page]);

  return (
    <SafeAreaView className="h-full w-full">
      <View className="w-full h-12 flex-row items-center justify-center">
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
        <Text className="text-[16px] font-bold">{`Dr. ${doctorName}`}</Text>
      </View>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.rating_id.toString()}
        renderItem={({ item }) => (
          <Review
            avatar={item.customer_avatar}
            username={item.customer_username}
            rating={item.rating_score}
            review={item.description}
            type="doctor"
          />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        ListHeaderComponent={
          <View>
            <View className="w-full h-[1px] bg-gray-200"></View>
            <View className="w-full h-44">
              <ImageBackground
                source={images.simple_background}
                className="w-full h-full object-center"
                resizeMode="cover"
              />
              <View className="w-40 h-40 rounded-full border-4 border-solid border-[#F2F2F2] absolute bottom-0 left-0 ml-3 -mb-9 flex-1 items-center justify-center">
                <Image
                  source={{ uri: imageUrl }}
                  className="w-full h-full rounded-full"
                  placeholder={{ blurhash }}
                  transition={200}
                />
              </View>
            </View>
            <View className="w-full h-16 flex-col items-start justify-start mt-10">
              <View className="w-full h-8 flex-row items-center justify-start px-4">
                <Text className="text-[20px] font-bold mr-1">{`Dr. ${doctorName}`}</Text>
                <FontAwesomeIcon
                  icon={icons.faCircleCheck}
                  size={14}
                  style={{ color: "#3b82f6", marginTop: 1 }}
                />
              </View>
              <View className="w-full h-5 flex-row items-center justify-start px-4">
                <FontAwesomeIcon
                  icon={icons.faStar}
                  size={14}
                  style={{ color: "#f59e0b" }}
                />
                <Text className="text-[14px] font-semibold ml-1">
                  {parseFloat(doctorRating).toFixed(1)}
                </Text>
              </View>
            </View>

            <View className="w-full h-[2px] bg-gray-300 mt-2"></View>
            <View className="flex-col items-start justify-start mt-2 px-4">
              <Text className="font-semibold text-[15px]">Details</Text>
              <View className="flex-row items-center justify-center mt-3">
                <FontAwesomeIcon
                  icon={icons.faVenusMars}
                  size={16}
                  style={{ color: "#000000" }}
                />
                <View className="flex-row items-center justify-center ml-1">
                  <Text className="text-[14px]">{doctorGender}</Text>
                </View>
              </View>
              <View className="flex-row items-center justify-center mt-2">
                <FontAwesomeIcon
                  icon={icons.faEnvelope}
                  size={15}
                  style={{ color: "#000000" }}
                />
                <View className="flex-row items-center justify-center ml-1">
                  <Text className="text-[14px]">{doctorEmail}</Text>
                </View>
              </View>
              <View className="flex-row items-center justify-center mt-2">
                <FontAwesomeIcon
                  icon={icons.faPhone}
                  size={14}
                  style={{ color: "#000000" }}
                />
                <View className="flex-row items-center justify-center ml-1">
                  <Text className="text-[14px]">{doctorPhone}</Text>
                </View>
              </View>
              <View className="w-full h-[1px] bg-gray-300 mt-4 px-4"></View>
            </View>
            <View className="flex-col items-start justify-start mt-2">
              <Text className="font-semibold text-[15px] px-4">Reviews</Text>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default DoctorDetail;
