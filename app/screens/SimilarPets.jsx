import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { useLocalSearchParams } from "expo-router";
import AdoptPetCard from "../../components/AdoptPetCard";
import { get_unadopted_pets } from "../../api/AdoptApi";
import LottieView from "lottie-react-native";

const SimilarPets = () => {
  const { petId } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [similarPets, setSimilarPets] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  const handleBack = () => {
    router.back();
  };

  const handleLoadMore = () => {
    if (page < maxPage) setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    const fetchSimilarPets = async () => {
      try {
        get_unadopted_pets(page, 10).then((res) => {
          if (res && res.status === 200) {
            const fetchedPets = res.data.data;
            const filteredPets = fetchedPets.filter((pet) => pet.id != petId);
            const newPets = [...similarPets, ...filteredPets];
            const uniquePets = newPets.reduce((unique, pet) => {
              if (!unique.find((item) => item.id === pet.id)) {
                unique.push(pet);
              }
              return unique;
            }, []);
            setSimilarPets(uniquePets);
            setMaxPage(res.data.total_pages);
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error("Error fetching similar clinics:", error);
        setIsLoading(false);
      }
    };

    fetchSimilarPets();
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
        <Text className="font-bold text-[16px]">Other pets</Text>
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
          data={similarPets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AdoptPetCard
              id={item.id}
              image={item.image}
              name={item.name}
              gender={item.gender}
              age={item.age}
              isHorizontal={false}
            />
          )}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-around",
          }}
          estimatedItemSize={20}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 20,
            minimumViewTime: 250,
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default SimilarPets;
