import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../constants";
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { ExperimentData, UserDummy } from "../../dummy/FakeData";
import UserSearchCard from "../../components/UserSearchCard";
import MinimalPost from "../../components/MinimalPost";
const Search = () => {
  const [query, setQuery] = useState("");
  const [postSearchResults, setPostSearchResults] = useState(null);
  const [userSearchResults, setUserSearchResults] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const handleBack = () => {
    router.back();
  };
  const handleSearch = () => {
    setIsFirstLoad(false);
    const postResults = ExperimentData.filter((post) => {
      return (
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.description.toLowerCase().includes(query.toLowerCase()) ||
        post.username.toLowerCase().includes(query.toLowerCase())
      );
    });
    const userResults = UserDummy.filter((user) =>
      user.username.toLowerCase().includes(query.toLowerCase())
    );
    setPostSearchResults(postResults);
    setUserSearchResults(userResults);
  };

  const handleNavigateUserSearchResutls = () => {
    router.push({
      pathname: "./UserSearchResult",
      params: {
        query: query,
      },
    });
  };

  return (
    <SafeAreaView className="w-full h-full">
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
        <SearchInput
          title="Search"
          placeholder="Search"
          handleChangeText={(e) => setQuery(e)}
          otherStyles="w-3/4"
          handleSearch={handleSearch}
        />
      </View>
      <View className="w-full h-full pb-4 pt-4">
        {(postSearchResults || userSearchResults) &&
        (postSearchResults.length > 0 || userSearchResults.length > 0) ? (
          <FlashList
            data={postSearchResults}
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
              <View className="w-full flex-col items-start justify-start mt-2 px-4">
                <Text className="font-semibold text-[16px]">Users</Text>
                <View className="w-full h-fit mt-3 flex-col items-center justify-start">
                  <View className="w-full flex-col items-center justify-start">
                    {userSearchResults.slice(0, 3).map((user, index) => (
                      <UserSearchCard
                        key={index}
                        name={user.name}
                        avatar={user.avatar}
                        age={user.age}
                        gender={user.gender}
                        username={user.username}
                        email={user.email}
                      />
                    ))}
                  </View>
                  <TouchableOpacity
                    className="w-full h-9 flex-row items-center justify-center bg-gray-200 rounded-md mt-4"
                    onPress={handleNavigateUserSearchResutls}
                  >
                    <Text className="font-semibold text-[14px]">See more</Text>
                  </TouchableOpacity>
                </View>
                <View className="w-full h-[1px] bg-gray-300 mt-4 px-4"></View>
                <View className="w-full h-16 flex-row items-center justify-start">
                  <Text className="font-semibold text-[16px]">Posts</Text>
                </View>
              </View>
            )}
            estimatedItemSize={20}
          />
        ) : isFirstLoad ? null : (
          <Image
            source={images.nodata}
            className="w-full h-full"
            resizeMode="contain"
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Search;
