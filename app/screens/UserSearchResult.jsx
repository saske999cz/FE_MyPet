import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { useLocalSearchParams } from "expo-router";
import { search_profile_by_username } from "../../api/BlogApi";
import UserSearchCard from "../../components/UserSearchCard";
import LottieView from "lottie-react-native";

const UserSearchResult = () => {
  const { query } = useLocalSearchParams();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const handleBack = () => {
    router.back();
  };

  const handleLoadMore = () => {
    if (page < maxPage) setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      search_profile_by_username(query, page, 20).then((res) => {
        if (res && res.status === 200) {
          const newUsers = [...users, ...res.data.data];
          const uniqueUsers = newUsers.reduce((unique, user) => {
            if (!unique.find((item) => item.account_id === user.account_id)) {
              unique.push(user);
            }
            return unique;
          }, []);
          setUsers(uniqueUsers);
          setMaxPage(res.data.total_pages);
          setIsLoading(false);
        }
      });
    };
    fetchUsers();
  }, [page]);

  return (
    <SafeAreaView className="h-full w-full">
      <View className="w-full h-12 flex-row items-center justify-center mb-2 border-b-[0.5px] border-solid border-gray-300">
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
        <Text className="font-bold text-[16px]">Search Results</Text>
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
        <FlatList
          data={users}
          renderItem={({ item }) => (
            <UserSearchCard
              id={item.account_id}
              username={item.username}
              avatar={item.avatar}
              email={item.email}
            />
          )}
          keyExtractor={(item) => item.id}
          initialNumToRender={20}
          onEndReached={handleLoadMore}
        />
      )}
    </SafeAreaView>
  );
};

export default UserSearchResult;
