import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash, images } from "../../constants";
import { router } from "expo-router";
import MinimalPost from "../../components/MinimalPost";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { get_blog_by_user } from "../../api/BlogApi";
import LottieView from "lottie-react-native";

const ProfileDetail = () => {
  const { id, name, gender, username, avatar } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");

  const handleLoadMore = () => {
    if (page < maxPage) setPage((prevPage) => prevPage + 1);
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
    const fetchPosts = async () => {
      get_blog_by_user(id, page, 20).then((res) => {
        if (res && res.status === 200) {
          const newPosts = [...posts, ...res.data.data.blogs];
          const uniquePosts = newPosts.reduce((unique, post) => {
            if (!unique.find((item) => item.id === post.id)) {
              unique.push(post);
            }
            return unique;
          }, []);
          setPosts(uniquePosts);
          setEmail(res.data.data.email);
          setMaxPage(res.data.total_pages);
          setIsLoading(false);
        }
      });
    };
    fetchPosts();
  }, [page]);

  return (
    <View className="h-full w-full pb-4">
      <View className="w-full h-12 flex-row items-center justify-center mt-[55px]">
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
      {isLoading ? (
        <View className="w-full h-full flex-row items-start justify-center">
          <LottieView
            style={{ width: 130, height: 130, marginTop: 150 }}
            source={require("../../assets/lottie/loading.json")}
            autoPlay
            loop
            speed={2}
          />
        </View>
      ) : (
        <FlatList
          data={posts}
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
          estimatedItemSize={20}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListHeaderComponent={() => (
            <View className="w-full h-fit">
              <View className="w-full h-[1px] bg-gray-200"></View>
              <View className="w-full h-44">
                <ImageBackground
                  source={images.simple_background}
                  className="w-full h-full object-center"
                  resizeMode="cover"
                />
                <View className="w-40 h-40 rounded-full border-4 border-solid border-[#F2F2F2] absolute bottom-0 left-0 ml-3 -mb-9 flex-1 items-center justify-center">
                  <Image
                    source={{ uri: avatar }}
                    className="w-full h-full rounded-full"
                    placeholder={{ blurhash }}
                    transition={0}
                  />
                </View>
              </View>
              <View className="w-full h-16 flex-col items-start justify-start mt-12">
                <View className="w-full h-8 flex-row items-center justify-start px-4">
                  <Text className="text-[20px] font-bold mr-1">{username}</Text>
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
                        activeCategory === "posts"
                          ? "text-orange-500"
                          : "text-black"
                      }`}
                    >
                      Posts
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="w-full h-[1px] bg-gray-300 mt-4"></View>
              </View>
              <View className="flex-col items-start justify-start mt-2 px-4">
                <Text className="font-semibold text-[16px]">Details</Text>
                <View className="flex-row items-center justify-center mt-2">
                  <FontAwesomeIcon
                    icon={icons.faEnvelope}
                    size={15}
                    style={{ color: "#000000" }}
                  />
                  <View className="flex-row items-center justify-center ml-1">
                    <Text className="text-[14px]">Email: </Text>
                    <Text className="text-[14px]">{email}</Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-center mt-2">
                  <FontAwesomeIcon
                    icon={icons.faHome}
                    size={15}
                    style={{ color: "#000000" }}
                  />
                  <View className="flex-row items-center justify-center ml-1">
                    <Text className="text-[14px]">Lives in </Text>
                    <Text className="font-semibold text-[14px]">
                      Da Nang, Viet Nam
                    </Text>
                  </View>
                </View>
                <View className="w-full h-[1px] bg-gray-300 mt-4 px-4"></View>
              </View>
              <View className="flex-col items-start justify-start mt-2">
                <Text className="font-semibold text-[16px] px-4">Posts</Text>
                <View className="flex-row items-center justify-start mt-6"></View>
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <View className="w-full h-fit flex-row items-center justify-center mt-2">
              <Text className="text-[14px]">The user didn't post yet!</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default ProfileDetail;
