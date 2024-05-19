import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { images } from "../../constants";
import { router } from "expo-router";
import { PetDummy } from "../../dummy/FakeData";
import MyPetCard from "../../components/MyPetCard";
import { ExperimentData } from "../../dummy/FakeData";
import MinimalPost from "../../components/MinimalPost";
import { useLocalSearchParams } from "expo-router";
import { FlashList } from "@shopify/flash-list";

const ProfileDetail = () => {
  const { name, age, gender, username, email, avatar } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("posts");
  const onRefresh = async () => {
    setRefreshing(true);
    // fetch data
    setRefreshing(false);
  };
  const handleBack = () => {
    router.back();
  };
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
        <Text className="text-[16px] font-bold">{username}</Text>
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
            <Image source={avatar} className="w-full h-full rounded-full" />
          </View>
        </View>
        <View className="w-full h-16 flex-col items-start justify-start mt-10">
          <View className="w-full h-8 flex-row items-center justify-start px-4">
            <Text className="text-[20px] font-bold mr-1">{name}</Text>
          </View>
        </View>

        <View className="w-full h-[2px] bg-gray-300 mt-2"></View>
        <View className="flex-col items-center justify-start mt-4 px-4">
          <View className="w-full flex-row items-center justify-start">
            <TouchableOpacity
              className={`w-16 h-8 rounded-full flex-row items-center justify-center ${
                activeCategory === "posts" ? "bg-[#fed7aa]" : ""
              }`}
            >
              <Text
                className={`text-[12px] font-semibold ${
                  activeCategory === "posts" ? "text-orange-500" : "text-black"
                }`}
              >
                Posts
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`w-16 h-8 rounded-full flex-row items-center justify-center ${
                activeCategory === "photos" ? "bg-[#fed7aa]" : ""
              }`}
            >
              <Text
                className={`text-[12px] font-semibold ${
                  activeCategory === "photos" ? "text-orange-500" : "text-black"
                }`}
              >
                Photos
              </Text>
            </TouchableOpacity>
          </View>
          <View className="w-full h-[1px] bg-gray-300 mt-4"></View>
        </View>
        <View className="flex-col items-start justify-start mt-2 px-4">
          <Text className="font-semibold text-[16px]">Details</Text>
          <View className="flex-row items-center justify-center mt-3">
            <FontAwesomeIcon
              icon={icons.faVenusMars}
              size={16}
              style={{ color: "#000000" }}
            />
            <View className="flex-row items-center justify-center ml-1">
              <Text className="text-[15px]">{gender}</Text>
            </View>
          </View>
          <View className="flex-row items-center justify-center mt-2">
            <FontAwesomeIcon
              icon={icons.faHome}
              size={16}
              style={{ color: "#000000" }}
            />
            <View className="flex-row items-center justify-center ml-1">
              <Text>Lives in </Text>
              <Text className="font-semibold text-[15px]">
                Da Nang, Viet Nam
              </Text>
            </View>
          </View>
          <View className="w-full h-[1px] bg-gray-300 mt-4 px-4"></View>
        </View>
        <View className="flex-col items-start justify-start mt-2 px-4">
          <Text className="font-semibold text-[16px]">Pets</Text>
          <View className="w-full h-fit mt-3 flex-col items-center justify-start">
            <View className="w-full flex-row items-center justify-around">
              {PetDummy.slice(0, 3).map((pet, index) => (
                <MyPetCard key={index} name={pet.name} image={pet.image} />
              ))}
            </View>
            <View className="w-full flex-row items-center justify-around">
              {PetDummy.slice(3, 6).map((pet, index) => (
                <MyPetCard key={index} name={pet.name} image={pet.image} />
              ))}
            </View>
            <TouchableOpacity className="w-full h-9 flex-row items-center justify-center bg-gray-200 rounded-md mt-4">
              <Text className="font-semibold text-[14px]">See all pets</Text>
            </TouchableOpacity>
          </View>
          <View className="w-full h-[1px] bg-gray-300 mt-4 px-4"></View>
        </View>
        <View className="flex-col items-start justify-start mt-2">
          <Text className="font-semibold text-[16px] px-4">My Posts</Text>
          <View className="flex-row items-center justify-start mt-6">
            <FlashList
              data={ExperimentData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <MinimalPost
                  username={item.username}
                  title={item.title}
                  description={item.description}
                  avatar={item.avatar}
                  uploadedImage={item.uploadedImage}
                  likes={item.likes}
                  dislikes={item.dislikes}
                  comments={item.comments}
                />
              )}
              estimatedItemSize={20}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileDetail;
