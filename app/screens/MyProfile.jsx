import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  RefreshControl,
} from "react-native";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { images } from "../../constants";
import { router } from "expo-router";
import { PetDummy } from "../../dummy/FakeData";
import MyPetCard from "../../components/MyPetCard";
import { ExperimentData } from "../../dummy/FakeData";
import MyMinimalPost from "../../components/MyMinimalPost";
import { FlashList } from "@shopify/flash-list";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const MyProfile = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("posts");
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["30%", "50%"];
  const [focusedPost, setFocusedPost] = useState(null);

  const onRefresh = async () => {
    setRefreshing(true);
    // fetch data
    setRefreshing(false);
  };
  const handleBack = () => {
    router.back();
  };

  const toggleSheet = () => {
    bottomSheetModalRef.current.present();
  };

  const closeBottomSheet = () => {
    bottomSheetModalRef.current.dismiss();
  };

  const handleOpenPostSettings = (post) => {
    setFocusedPost(post);
    toggleSheet();
  };

  const handleEditPost = () => {
    closeBottomSheet();
    router.push({
      pathname: "../screens/EditPost",
      params: {
        avatar: focusedPost.avatar,
        username: focusedPost.username,
        title: focusedPost.title,
        description: focusedPost.description,
        uploadedImage: focusedPost.uploadedImage,
        likes: focusedPost.likes,
        dislikes: focusedPost.dislikes,
        comments: focusedPost.comments,
      },
    });
  };

  const handleNavigateMyPet = () => {
    router.push("../screens/MyPet");
  };

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
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
            <Text className="text-[16px] font-bold">My Profile</Text>
          </View>
          <FlashList
            data={ExperimentData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MyMinimalPost
                username={item.username}
                title={item.title}
                description={item.description}
                avatar={item.avatar}
                uploadedImage={item.uploadedImage}
                likes={item.likes}
                dislikes={item.dislikes}
                comments={item.comments}
                handleOpenPostSettings={() => handleOpenPostSettings(item)}
              />
            )}
            estimatedItemSize={20}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <View className="w-full h-fit">
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
                          activeCategory === "posts"
                            ? "text-orange-500"
                            : "text-black"
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
                          activeCategory === "photos"
                            ? "text-orange-500"
                            : "text-black"
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
                        <MyPetCard
                          key={index}
                          name={pet.name}
                          image={pet.image}
                        />
                      ))}
                    </View>
                    <View className="w-full flex-row items-center justify-around">
                      {PetDummy.slice(3, 6).map((pet, index) => (
                        <MyPetCard
                          key={index}
                          name={pet.name}
                          image={pet.image}
                        />
                      ))}
                    </View>
                    <TouchableOpacity
                      className="w-full h-9 flex-row items-center justify-center bg-gray-200 rounded-md mt-4"
                      onPress={handleNavigateMyPet}
                    >
                      <Text className="font-semibold text-[14px]">
                        See all pets
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View className="w-full h-[1px] bg-gray-300 mt-4 px-4"></View>
                </View>
                <View className="w-full h-fit flex-col items-start justify-start mt-2 mb-3">
                  <Text className="font-semibold text-[16px] px-4">
                    My Posts
                  </Text>
                </View>
              </View>
            )}
          />
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            enablePanDownToClose={true}
            backgroundStyle={{
              backgroundColor: "#F5F5F7",
            }}
          >
            <View className="w-full h-full bg-[#F5F5F7] flex-col items-center justify-start">
              <View className="w-[90%] h-40 flex-col items-start justify-start px-6 bg-white border-solid border-[0.5px] border-gray-200 rounded-lg">
                <TouchableOpacity
                  className="w-full h-12 flex-row items-center justify-start mt-2"
                  onPress={handleEditPost}
                >
                  <FontAwesomeIcon
                    icon={icons.faPen}
                    size={18}
                    style={{ color: "#000000" }}
                  />
                  <Text className="text-[14px] font-semibold ml-3">
                    Edit Post
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="w-full h-12 flex-row items-center justify-start mt-2">
                  <FontAwesomeIcon
                    icon={icons.faTrashCan}
                    size={18}
                    style={{ color: "#000000" }}
                  />
                  <Text className="text-[14px] font-semibold ml-3">
                    Delete Post
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheetModal>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default MyProfile;
