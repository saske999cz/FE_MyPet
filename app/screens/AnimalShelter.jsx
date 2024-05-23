import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { images } from "../../constants";
import { router } from "expo-router";
import { PetDummy } from "../../dummy/FakeData";
import AdoptPetCard from "../../components/AdoptPetCard";
import { FlashList } from "@shopify/flash-list";

const AnimalShelter = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  const handleBack = () => {
    router.back();
  };

  return (
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
        <ImageBackground
          source={images.clinic2}
          className="w-full h-full object-center"
          resizeMode="cover"
        />
        <View className="w-full h-full opacity-[50] bg-zinc-900/40 absolute bottom-0 left-0 top-0 right-0"></View>
        <View className="w-full flex-row items-center justify-start absolute bottom-0 left-0 ml-3 mb-2">
          <View className="w-16 h-16 rounded-full border-2 border-solid border-[#F2F2F2] flex-row items-center justify-center">
            <Image
              source={images.clinic1}
              className="w-full h-full rounded-full"
            />
          </View>
          <View className="w-[70%] h-full flex-col items-start justify-start px-4 mt-8">
            <Text className="text-[16px] font-bold text-white mb-1">
              Animal Shelter
            </Text>
            <View className="flex-row items-center-justify-start mt-2 ml-1">
              <FontAwesomeIcon
                icon={icons.faLocationDot}
                size={10}
                style={{ color: "#ef4444" }}
              />
              <Text className="ml-4 text-[10px] ml-1 text-white font-semibold">
                Tokyo,Japan
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View className=" w-full h-full flex-col items-start justify-start mt-4">
        <Text className="font-semibold text-[16px] px-4">Pets</Text>
        <View className="w-full h-full flex-row items-center justify-start mt-2 pb-52">
          <FlashList
            scrollEventThrottle={5}
            data={PetDummy}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="w-[96%] h-fit ml-1">
                <AdoptPetCard
                  id={item.id}
                  image={item.image}
                  name={item.name}
                  gender={item.gender}
                  age={item.age}
                  isHorizontal={false}
                />
              </View>
            )}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-around",
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            estimatedItemSize={40}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </View>
  );
};

export default AnimalShelter;
