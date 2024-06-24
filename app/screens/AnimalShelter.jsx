import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash } from "../../constants";
import { router } from "expo-router";
import AdoptPetCard from "../../components/AdoptPetCard";
import { useLocalSearchParams } from "expo-router";
import { get_unadopted_pets_by_aid_center } from "../../api/AdoptApi";
import { Image } from "expo-image";
import LottieView from "lottie-react-native";

const AnimalShelter = () => {
  const {
    aidCenterId,
    aidCenterName,
    aidCenterAddress,
    aidCenterAvatar,
    aidCenterWorkTime,
    aidCenterPhone,
    aidCenterWebsite,
    aidCenterDescription,
  } = useLocalSearchParams();
  const [pets, setPets] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("pets");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };
  const handleBack = () => {
    router.back();
  };

  const handleLoadMore = () => {
    if (page >= maxPage) return;
    setPage((prevPage) => prevPage + 1);
  };

  const handleOpenMap = () => {
    router.push({
      pathname: "../screens/CustomMap",
      params: {
        medicalCenterAddress: aidCenterAddress,
        medicalCenterName: aidCenterName,
        image: encodeURIComponent(aidCenterAvatar),
      },
    });
  };

  useEffect(() => {
    const fetchPets = async () => {
      try {
        get_unadopted_pets_by_aid_center(aidCenterId, page, 10)
          .then((res) => {
            if (res && res.status === 200) {
              const newPets = [...pets, ...res.data.data.pets];
              const uniquePets = newPets.reduce((unique, pet) => {
                if (!unique.find((item) => item.id === pet.id)) {
                  unique.push(pet);
                }
                return unique;
              }, []);
              setPets(uniquePets);
              setMaxPage(res.data.total_pages);
              setIsLoading(false);
            }
          })
          .catch((error) => console.error("Error fetching products:", error));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchPets();
  }, [page]);

  return isLoading ? (
    <View className="w-full h-full flex-row item-start justify-center">
      <LottieView
        source={require("../../assets/lottie/loading.json")}
        autoPlay
        loop
        style={{ width: 130, height: 130, marginTop: 300 }}
        speed={2}
      />
    </View>
  ) : (
    <View className="h-full w-full">
      <View className="w-full h-44">
        <TouchableOpacity
          className="w-12 h-12 flex-row items-center justify-center absolute top-10 left-0 z-20"
          onPress={handleBack}
        >
          <FontAwesomeIcon
            icon={icons.faArrowLeftLong}
            size={20}
            style={{ color: "#f59e0b" }}
          />
        </TouchableOpacity>
        {aidCenterAvatar && (
          <Image
            source={{ uri: aidCenterAvatar }}
            className="w-full h-full object-center"
            contentFit="cover"
          />
        )}
        <View className="w-full h-full opacity-[50] bg-zinc-900/40 absolute bottom-0 left-0 top-0 right-0"></View>
        <View className="w-full flex-row items-center justify-start absolute bottom-0 left-0 ml-3 mb-2">
          <View className="w-16 h-16 rounded-full border-2 border-solid border-[#F2F2F2] flex-row items-center justify-center">
            {aidCenterAvatar && (
              <Image
                source={{ uri: aidCenterAvatar }}
                className="w-full h-full rounded-full"
                placeholder={{ blurhash }}
                transition={0}
              />
            )}
          </View>
          <View className="w-[70%] h-full flex-col items-start justify-start px-4 mt-8">
            <Text className="text-[16px] font-bold text-white mb-1">
              {aidCenterName}
            </Text>
            <View className="flex-row items-center-justify-start ml-1">
              <FontAwesomeIcon
                icon={icons.faLocationDot}
                size={10}
                style={{ color: "#ef4444" }}
              />
              <Text className="ml-4 text-[10px] ml-1 text-white font-semibold">
                {aidCenterAddress}
              </Text>
              <TouchableOpacity
                className="w-[60px] h-fit flex-row items-center justify-center ml-3"
                onPress={handleOpenMap}
              >
                <Text className="text-[11px] text-amber-500 font-semibold">
                  Open map
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View className=" w-full h-full flex-col items-start justify-start">
        <View className="w-full h-10 flex-row items-center justify-between mb-2">
          <TouchableOpacity
            className={`w-1/2 h-full flex-row items-center justify-center ${
              activeTab === "center"
                ? "border-b-2 border-solid border-amber-500"
                : ""
            }`}
            onPress={() => setActiveTab("center")}
          >
            <Text
              className={`${
                activeTab === "center" ? "text-amber-500" : "text-black"
              } text-[14px] px-4`}
            >
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`w-1/2 h-full flex-row items-center justify-center ${
              activeTab === "pets"
                ? "border-b-2 border-solid border-amber-500"
                : ""
            }`}
            onPress={() => setActiveTab("pets")}
          >
            <Text
              className={`${
                activeTab === "pets" ? "text-amber-500" : "text-black"
              } text-[14px] px-4`}
            >
              Pets
            </Text>
          </TouchableOpacity>
        </View>
        <View className="w-full h-full flex-row items-start justify-start mt-2 pb-64">
          {activeTab === "pets" && pets && pets.length > 0 ? (
            <FlatList
              scrollEventThrottle={2}
              data={pets}
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
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              estimatedItemSize={500}
              showsVerticalScrollIndicator={false}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              viewabilityConfig={{
                itemVisiblePercentThreshold: 80,
                minimumViewTime: 300,
              }}
            />
          ) : activeTab === "center" ? (
            <ScrollView className="w-full h-fit px-4">
              <View className="w-full h-32 mt-4">
                <View className="w-full h-6 flex-row items-center justify-start">
                  <FontAwesomeIcon
                    icon={icons.faLocationDot}
                    size={13}
                    style={{ color: "#ef4444" }}
                  />
                  <Text className="text-[13px] font-semibold ml-3">
                    {aidCenterAddress}, Đà Nẵng
                  </Text>
                  <TouchableOpacity
                    className="w-[70px] h-fit flex-row items-center justify-center ml-8"
                    onPress={handleOpenMap}
                  >
                    <Text className="text-[13px] text-amber-500 font-semibold">
                      Open map
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="w-full h-6 flex-row items-center justify-start mt-2">
                  <FontAwesomeIcon
                    icon={icons.faClock}
                    size={13}
                    style={{ color: "#4b5563" }}
                  />
                  <Text className="text-[13px] font-semibold ml-3">
                    {aidCenterWorkTime}
                  </Text>
                </View>
                <View className="w-full h-6 flex-row items-center justify-start mt-2">
                  <FontAwesomeIcon
                    icon={icons.faPhone}
                    size={13}
                    style={{ color: "#3b82f6" }}
                  />
                  <Text className="text-[13px] font-semibold ml-3">
                    {aidCenterPhone}
                  </Text>
                </View>
                {aidCenterWebsite && (
                  <View className="w-full h-fit flex-row items-center justify-start mt-2">
                    <FontAwesomeIcon
                      icon={icons.faGlobe}
                      size={13}
                      style={{ color: "#06b6d4" }}
                    />
                    <Text className="text-[13px] font-semibold ml-3">
                      {aidCenterWebsite}
                    </Text>
                  </View>
                )}
              </View>
              <View className="w-full h-fit">
                <View className="w-full h-8 mt-4">
                  <Text className="text-[14px] font-semibold">Description</Text>
                </View>
                <View className="w-full h-fit">
                  <Text className="text-[13px]">
                    {aidCenterDescription
                      ? aidCenterDescription
                      : "No description"}
                  </Text>
                </View>
              </View>
            </ScrollView>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default AnimalShelter;
