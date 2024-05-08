import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { images } from "../../constants";
import { icons } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import MinimalPost from "../../components/MinimalPost";
import { ExperimentData } from "../../dummy/FakeData";

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    // fetch data
    setRefreshing(false);
  };
  return (
    <SafeAreaView className="h-full">
      <FlatList
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
          <View className="px-4 space-y-5 pb-4">
            <View className="w-full justify-between items-center flex-row">
              <Image
                source={images.logoBlack}
                className="w-32 h-16 -ml-4"
                resizeMode="contain"
              />
              <View className="flex-row items-center w-[25%] justify-around -mr-1">
                <TouchableOpacity className="w-10 h-10 bg-[#e5e7eb] rounded-full flex-row items-center justify-center">
                  <FontAwesomeIcon
                    icon={icons.faMagnifyingGlass}
                    size={20}
                    style={{ color: "#000000" }}
                  />
                </TouchableOpacity>
                <Image
                  source={images.avatar}
                  className="w-9 h-9 rounded-full"
                />
              </View>
            </View>
            <TouchableOpacity className="w-full h-10 bg-[#e5e7eb] rounded-lg flex-row items-center justify-between px-3">
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
      />
    </SafeAreaView>
  );
};

export default Home;
