import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash, images } from "../../constants";
import { router } from "expo-router";
import { ExperimentData } from "../../dummy/FakeData";
import MinimalPost from "../../components/MinimalPost";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";

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
  const [activeCategory, setActiveCategory] = useState("posts");
  const [imageUrl, setImageUrl] = useState(null);
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
      <ScrollView>
        <View className="w-full h-[1px] bg-gray-200"></View>
        <View className="w-full h-44">
          <ImageBackground
            source={images.clinic1}
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
          <View className="flex-col items-center justify-start mt-6">
            {ExperimentData.map((post, index) => (
              <MinimalPost
                key={index}
                username={post.username}
                title={post.title}
                description={post.description}
                avatar={post.avatar}
                uploadedImage={post.uploadedImage}
                likes={post.likes}
                dislikes={post.dislikes}
                comments={post.comments}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DoctorDetail;
