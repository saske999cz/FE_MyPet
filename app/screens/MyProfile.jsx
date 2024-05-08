import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  FlatList,
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
import MyMinimalPost from "../../components/MyMinimalPost";

const MyProfile = () => {
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
      <ScrollView>
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
          <Text className="text-[16px] font-bold">My Profile</Text>
        </View>
        <View className="w-full h-[1px] bg-gray-200"></View>
        <View className="w-full h-44">
          <ImageBackground
            source={images.adopt2}
            className="w-full h-full object-center"
            resizeMode="cover"
          />
          <View className="w-40 h-40 rounded-full border-4 border-solid border-[#F2F2F2] absolute bottom-0 left-0 ml-3 -mb-9 flex-1 items-center justify-center">
            <Image
              source={images.avatar}
              className="w-full h-full rounded-full"
            />
          </View>
          <View className="w-8 h-8 rounded-full flex-1 items-center justify-center bg-gray-300 absolute bottom-0 left-0 ml-32 -mb-9 border-[1px] border-solid border-[#F2F2F2]">
            <FontAwesomeIcon
              icon={icons.faCamera}
              size={16}
              style={{ color: "#000000" }}
            />
          </View>
          <View className="w-8 h-8 rounded-full flex-1 items-center justify-center bg-gray-300 absolute bottom-0 right-0 mr-2 mb-2 border-[1px] border-solid border-[#F2F2F2]">
            <FontAwesomeIcon
              icon={icons.faCamera}
              size={16}
              style={{ color: "#000000" }}
            />
          </View>
        </View>
        <View className="w-full h-12 flex-row items-center justify-start px-4 mt-8">
          <Text className="text-[20px] font-bold">John Doe</Text>
        </View>
        <View className="w-full h-9 flex-row items-center justify-start">
          <TouchableOpacity className="w-32 h-9 flex-row items-center justify-center bg-amber-500 rounded-md ml-4">
            <FontAwesomeIcon
              icon={icons.faPen}
              size={12}
              style={{ color: "#ffffff" }}
            />
            <Text className="text-[15px] font-semibold ml-2 text-white">
              Edit profile
            </Text>
          </TouchableOpacity>
        </View>
        <View className="w-full h-[2px] bg-gray-300 mt-4"></View>
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
              <Text className="text-[15px]">Male</Text>
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
          <Text className="font-semibold text-[16px]">My Pets</Text>
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
          <View className="flex-col items-center justify-start mt-6">
            {ExperimentData.map((post, index) => (
              <MyMinimalPost
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

export default MyProfile;
