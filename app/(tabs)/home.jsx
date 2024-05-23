import {
  View,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useState, useRef, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { icons } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import MinimalPost from "../../components/MinimalPost";
import { ExperimentData } from "../../dummy/FakeData";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import FormField from "../../components/FormField";
import * as ImagePicker from "expo-image-picker";
import DynamicImageGrid from "../../components/DynamicImageGrid";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["90%"];
  const [postForm, setPostForm] = useState({
    username: "",
    title: "",
    description: "",
    postImages: [],
  });
  const [imageList, setImageList] = useState([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.cancelled) {
      setImageList(result.assets.map((asset) => asset.uri));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // fetch data
    setRefreshing(false);
  };
  const handleNavigateSearch = () => {
    router.push("../screens/Search");
  };

  const toggleSheet = () => {
    bottomSheetModalRef.current.present();
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
        <SafeAreaView className="h-full">
          <View className="w-full justify-between items-center flex-row px-4">
            <Image
              source={images.logoBlack}
              className="w-32 h-16 -ml-4 mt-1"
              resizeMode="contain"
            />
            <View className="flex-row items-center w-[25%] justify-around -mr-1">
              <TouchableOpacity
                className="w-10 h-10 bg-[#e5e7eb] rounded-full flex-row items-center justify-center"
                onPress={handleNavigateSearch}
              >
                <FontAwesomeIcon
                  icon={icons.faMagnifyingGlass}
                  size={20}
                  style={{ color: "#000000" }}
                />
              </TouchableOpacity>
              <Image source={images.avatar} className="w-9 h-9 rounded-full" />
            </View>
          </View>
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
            ListHeaderComponent={() => (
              <View className="px-3 space-y-5 pb-4 mt-2">
                <TouchableOpacity
                  className="w-full h-10 bg-[#e5e7eb] rounded-lg flex-row items-center justify-between px-3"
                  onPress={toggleSheet}
                >
                  <Text className="text-[15px] text-[#64676B]">
                    Want to share something?
                  </Text>
                  <FontAwesomeIcon
                    icon={icons.faPen}
                    size={16}
                    style={{ color: "#64676B" }}
                  />
                </TouchableOpacity>
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            estimatedItemSize={20}
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
              <View className="w-full h-12 flex-row items-center justify-center ">
                <Text className="font-semibold text-[15px]">Create post</Text>
                <TouchableOpacity className="w-12 h-12 absolute right-0 top-0 bottom-0 mt-4">
                  <Text className="font-semibold text-blue-500 text-[15px]">
                    Post
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                className="w-full"
                showsVerticalScrollIndicator={false}
              >
                <View className="w-full h-fit flex-col items-start justify-start px-6 bg-white border-solid border-[0.5px] border-gray-200 rounded-lg">
                  <View className="w-full h-12 flex-row items-center justify-start mt-2">
                    <View className="w-9 h-9 rounded-full border-[0.5px] border-solid border-gray-200">
                      <Image
                        source={images.avatar}
                        className="w-full h-full rounded-full"
                      />
                    </View>
                    <Text className="text-[14px] font-semibold ml-4">
                      Username
                    </Text>
                  </View>
                  <FormField
                    title="Title"
                    placeholder="Title"
                    titleStyles="text-black font-[13px]"
                    otherStyles="mt-5"
                  />
                  <FormField
                    title="Description"
                    placeholder="Enter description here..."
                    titleStyles="text-black font-[13px]"
                    otherStyles="mt-5"
                    multiline={true}
                    numberOfLines={5}
                    height={32}
                  />
                  <View className="w-full h-fit px-4 flex-col items-center justify-center mt-6">
                    <TouchableOpacity
                      className="w-32 h-10 rounded-lg flex-row items-center justify-center bg-blue-500 mb-4"
                      onPress={pickImage}
                    >
                      <FontAwesomeIcon
                        icon={icons.faArrowUpFromBracket}
                        size={17}
                        style={{ color: "#ffffff" }}
                      />
                      <Text className="text-[13px] text-white ml-2 font-semibold">
                        Upload image
                      </Text>
                    </TouchableOpacity>
                    {imageList && <DynamicImageGrid images={imageList} />}
                  </View>
                </View>
              </ScrollView>
            </View>
          </BottomSheetModal>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default Home;
