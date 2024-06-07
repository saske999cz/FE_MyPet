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
import MedicalCenterCard from "../../components/MedicalCenterCard";
import { get_highest_rating_medical_centers } from "../../api/MedicalCenterApi";

const SimilarClinics = () => {
  const { medicalCenterId } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [similarClinics, setSimilarClinics] = useState([]);
  const [page, setPage] = useState(1);

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  const handleBack = () => {
    router.back();
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    const fetchSimilarClinics = async () => {
      try {
        get_highest_rating_medical_centers(page, 10).then((res) => {
          if (res && res.status === 200) {
            const fetchedClinics = res.data.data;
            const filteredClinics = fetchedClinics.filter(
              (clinic) => clinic.medical_center_id != medicalCenterId
            );
            const newClinics = [...similarClinics, ...filteredClinics];
            const uniqueClinics = newClinics.reduce((unique, clinic) => {
              if (
                !unique.find(
                  (item) => item.medical_center_id === clinic.medical_center_id
                )
              ) {
                unique.push(clinic);
              }
              return unique;
            }, []);
            setSimilarClinics(uniqueClinics);
          }
        });
      } catch (error) {
        console.error("Error fetching similar clinics:", error);
      }
    };

    fetchSimilarClinics();
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
        <Text className="font-bold text-[16px]">Other Medical Centers</Text>
      </View>
      <FlatList
        data={similarClinics}
        keyExtractor={(item) => item.medical_center_id}
        renderItem={({ item }) => (
          <MedicalCenterCard
            id={item.medical_center_id}
            image={item.avatar}
            name={item.name}
            rating={item.rating}
            distance={5}
            workingHours={item.work_time}
            telephone={item.phone}
            description={item.description}
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
          itemVisiblePercentThreshold: 80,
          minimumViewTime: 300,
        }}
      />
    </SafeAreaView>
  );
};

export default SimilarClinics;
