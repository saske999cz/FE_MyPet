import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images, blurhash } from "../../constants";
import SearchInput from "../../components/SearchInput";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { router } from "expo-router";
import UserSearchCard from "../../components/UserSearchCard";
import MinimalPost from "../../components/MinimalPost";
import {
  search_blog_by_title,
  search_profile_by_username,
} from "../../api/BlogApi";
import { Image } from "expo-image";
import LottieView from "lottie-react-native";

const Search = () => {
  const [query, setQuery] = useState("");
  const [postSearchResults, setPostSearchResults] = useState([]);
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [flags, setFlags] = useState([]);
  const [page, setPage] = useState(2);
  const [maxPage, setMaxPage] = useState(1);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const handleBack = () => {
    router.back();
  };

  const handleLoarMore = () => {
    if (page < maxPage) {
      search_blog_by_title(query, page, 10).then((res) => {
        if (res && res.status === 200) {
          const fetchedPosts = res.data.data;
          const newPosts = [...postSearchResults, ...fetchedPosts];
          const uniquePosts = newPosts.reduce((unique, post) => {
            if (!unique.find((item) => item.id === post.id)) {
              unique.push(post);
            }
            return unique;
          }, []);
          setPostSearchResults(uniquePosts);
          setPage((prevPage) => prevPage + 1);
        }
      });
    }
  };

  const handleSearch = () => {
    setIsLoading(true);
    search_blog_by_title(query, 1, 10).then((res) => {
      if (res && res.status === 200) {
        setPostSearchResults(res.data.data);
        setFlags((prev) => [...prev, true]);
        setMaxPage(res.data.total_pages);
      }
    });
    search_profile_by_username(query, 1, 10).then((res) => {
      if (res && res.status === 200) {
        setUserSearchResults(res.data.data);
        setFlags((prev) => [...prev, true]);
      }
    });
  };

  const handleNavigateUserSearchResutls = () => {
    router.push({
      pathname: "./UserSearchResult",
      params: {
        query: query,
      },
    });
  };

  useEffect(() => {
    if (flags.length === 2 && flags.every((flag) => flag === true)) {
      setIsLoading(false);
      setIsFirstLoad(false);
    }
  }, [flags]);

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
      {isLoading ? (
        <View className="w-full h-full flex-row items-start justify-center">
          <LottieView
            style={{ width: 120, height: 120, marginTop: 150 }}
            source={require("../../assets/lottie/loading.json")}
            autoPlay
            loop
            speed={2}
          />
        </View>
      ) : (
        <View className="w-full h-full pb-4 pt-4">
          {(postSearchResults || userSearchResults) &&
          (postSearchResults.length > 0 || userSearchResults.length > 0) ? (
            <FlatList
              data={postSearchResults}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <MinimalPost
                  id={item.id}
                  username={item.username}
                  title={item.title}
                  description={item.text}
                  avatar={item.avatar}
                  uploadedImage={item.image}
                  likes={item.likes_count}
                  dislikes={item.dislikes_count}
                  comments={item.comments_count}
                  interaction={item.interaction_type}
                  createdAt={item.created_at}
                />
              )}
              ListHeaderComponent={() => (
                <View className="w-full flex-col items-start justify-start mt-2 px-4">
                  <Text className="font-semibold text-[16px]">Users</Text>
                  <View className="w-full h-fit mt-3 flex-col items-center justify-start">
                    {userSearchResults.length > 0 ? (
                      <View className="w-full flex-col items-center justify-start">
                        {userSearchResults.slice(0, 3).map((user, index) => (
                          <UserSearchCard
                            key={index}
                            id={user.account_id}
                            username={user.username}
                            avatar={user.avatar}
                            email={user.email}
                          />
                        ))}
                      </View>
                    ) : (
                      <Text className="text-[14px]">No users found</Text>
                    )}
                    {userSearchResults.length > 3 && (
                      <TouchableOpacity
                        className="w-full h-9 flex-row items-center justify-center bg-gray-200 rounded-md mt-4"
                        onPress={handleNavigateUserSearchResutls}
                      >
                        <Text className="font-semibold text-[14px]">
                          See more
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View className="w-full h-[1px] bg-gray-300 mt-4 px-4"></View>
                  <View className="w-full h-16 flex-row items-center justify-start">
                    <Text className="font-semibold text-[16px]">Posts</Text>
                  </View>
                </View>
              )}
              initialNumToRender={10}
              onEndReached={handleLoarMore}
              onEndReachedThreshold={0.5}
              ListEmptyComponent={() => (
                <View className="w-full h-fit">
                  <Text className="text-[13px]">No posts found</Text>
                </View>
              )}
            />
          ) : isFirstLoad === false ? (
            <View className="w-full h-full felx-row items-center justify-center">
              <Image
                source={images.nodata}
                className="w-full h-52"
                contentFit="contain"
                transition={0}
                placeholder={{ blurhash }}
              />
            </View>
          ) : null}
        </View>
      )}
    </SafeAreaView>
  );
};

export default Search;
