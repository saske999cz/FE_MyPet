import {
  View,
  Text,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import FormField from "../../components/FormField";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { useLocalSearchParams } from "expo-router";
import { nanoid } from "nanoid";
import "react-native-get-random-values";
import images from "../../constants";
import { ExperimentData } from "../../dummy/FakeData";

const EditPost = () => {
  const { username, avatar, title, description, likes, dislikes, comments } =
    useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [postData, setPostData] = useState({
    title: title,
    description: description,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // fetch data
    setRefreshing(false);
  };

  const handleBack = () => {
    router.back();
  };

  const handleEditPost = () => {};
  return (
    <SafeAreaView className="w-full h-full">
      <View className="w-full h-12 flex-row items-center justify-center mb-4">
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
        <View className="w-[80%] h-12 flex-row items-center justify-center">
          <View className="w-9 h-9 rounded-full border-solid border-[0.5px] border-gray-200">
            <Image source={avatar} className="w-full h-full rounded-full" />
          </View>
          <Text className="ml-2 text-[15px] font-semibold">{username}</Text>
        </View>
        <TouchableOpacity
          className="w-12 h-12 flex-row items-center justify-center absolute top-0 right-0 mr-3"
          onPress={handleEditPost}
        >
          <Text className="font-semibold text-[15px] text-amber-500">Done</Text>
        </TouchableOpacity>
      </View>
      <FlashList
        data={ExperimentData[0].uploadedImage}
        renderItem={({ item }) => (
          <View className="w-full h-36 mt-4">
            <TouchableOpacity className="w-6 h-6 rounded-full bg-gray-700 flex-row items-center justify-center absolute left-0 top-0 -mr-1 -mt-1 z-10">
              <FontAwesomeIcon
                icon={icons.faXmark}
                size={12}
                style={{ color: "#ffffff" }}
              />
            </TouchableOpacity>
            <Image source={item} className="w-full h-full" />
          </View>
        )}
        keyExtractor={() => nanoid()}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={() => (
          <View className="w-full h-fit flex-col px-4">
            <FormField
              title="Title"
              titleStyles="text-black font-[13px]"
              otherStyles="mt-5"
              value={postData.title}
              onChangeText={(text) => setPostData({ ...postData, title: text })}
            />
            <FormField
              title="Description"
              titleStyles="text-black font-[13px]"
              otherStyles="mt-5"
              multiline={true}
              numberOfLines={5}
              height={32}
              value={postData.description}
              onChangeText={(text) =>
                setPostData({ ...postData, description: text })
              }
            />
            <View className="w-full h-16 flex-row items-center justify-center mt-3">
              <TouchableOpacity className="w-32 h-10 rounded-lg flex-row items-center justify-center bg-amber-500">
                <FontAwesomeIcon
                  icon={icons.faArrowUpFromBracket}
                  size={17}
                  style={{ color: "#ffffff" }}
                />
                <Text className="text-[13px] text-white ml-2 font-semibold">
                  Upload image
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        estimatedItemSize={20}
      />
    </SafeAreaView>
  );
};

export default EditPost;
