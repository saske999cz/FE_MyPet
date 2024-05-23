import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { router, useLocalSearchParams } from "expo-router";
import { PetImages, PetDummy } from "../../dummy/FakeData";
import AdoptPetCard from "../../components/AdoptPetCard";
import { FlashList } from "@shopify/flash-list";

const AdoptPetDetail = () => {
  const { petId, petName, petAge, petImage, petGender } =
    useLocalSearchParams();

  const [mainImage, setMainImage] = useState(PetImages[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(1);
  const totalImages = PetImages.length;
  const handleBack = () => {
    router.back();
  };
  const handleProductImagePress = (image) => {
    setMainImage(image);
    setCurrentImageIndex(PetImages.indexOf(image) + 1);
  };

  const handleCreateAdoptionRequest = () => {
    router.push({
      pathname: "../screens/CreateAdoptionRequest",
      params: {
        petId: petId,
        petName: petName,
        petAge: petAge,
        petImage: petImage,
        petGender: petGender,
      },
    });
  };

  const handleAnimalShelterPress = () => {
    router.push({
      pathname: "../screens/AnimalShelter",
      params: {
        petId: petId,
        petName: petName,
        petAge: petAge,
        petImage: petImage,
        petGender: petGender,
      },
    });
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="flex-col items-center justify-start">
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
          </View>
          <Image
            source={mainImage}
            className="w-full h-60"
            resizeMode="contain"
            style={{ aspectRatio: 16 / 9 }}
          />
          <View className="w-10 h-5 flex-row items-center justify-center bg-white rounded-full border-[0.5px] border-solid border-gray-300 mt-3 mb-2">
            <Text className="text-[12px] text-gray-700">
              {currentImageIndex}/{totalImages}
            </Text>
          </View>
          <View className="w-full h-fit flex-row items-center justify-start px-3">
            <FlashList
              data={PetImages}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="w-10 h-10 bg-white rounded-[3px] mx-1 mt-1 border-[0.5px] border-solid border-gray-300"
                  onPress={() => handleProductImagePress(item)}
                >
                  <Image
                    source={item}
                    className="w-full h-full rounded-[3px]"
                  />
                </TouchableOpacity>
              )}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ padding: 4 }}
              estimatedItemSize={20}
            />
          </View>
          <View className="w-full h-32 flex-row items-center justify-between">
            <View className="w-[70%] h-full flex-col items-center justify-center px-4">
              <View className="w-full flex-row items-center justify-start">
                <Text className="text-[18px] font-semibold mt-4">
                  {petName}
                </Text>
              </View>
              <View className="flex-row w-full items-center justify-start mb-2 mt-2">
                <Text className="text-[12px] mr-1">{petGender}</Text>
                {petGender === "Male" ? (
                  <FontAwesomeIcon
                    icon={icons.faMars}
                    size={13}
                    style={{ color: "#3b82f6" }}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={icons.faVenus}
                    size={13}
                    style={{ color: "#f43f5e" }}
                  />
                )}
              </View>
              <View className="w-full">
                <Text className="text-[12px] mb-2">{petAge}</Text>
              </View>
            </View>
            <View className="w-[30%] h-full flex-row items-center justify-end">
              <TouchableOpacity
                className="w-20 h-8 bg-[#f59e0b] rounded-md flex-row items-center justify-center mr-4"
                onPress={handleCreateAdoptionRequest}
              >
                <FontAwesomeIcon
                  icon={icons.faHeart}
                  size={13}
                  style={{ color: "white" }}
                />
                <Text className="text-white text-[12px] font-semibold ml-1">
                  Adopt
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="w-full h-[1px] bg-gray-300"></View>
          <View className="w-full h-fit px-4 mt-4">
            <Text className="text-[14px] font-semibold mb-2">Notes</Text>
            <Text className="text-[13px] text-gray-800">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              posuere erat a ante.
            </Text>
          </View>
          <View className="w-full h-[4px] bg-gray-300 mt-5"></View>
          <View className="w-full px-4 mt-4">
            <TouchableOpacity
              className="w-full flex-row items-center justify-start"
              onPress={handleAnimalShelterPress}
            >
              <View className="w-10 h-10 rounded-full border-[0.5px] border-solid border-gray-200">
                <Image
                  source={images.clinic1}
                  className="w-full h-full rounded-full"
                />
              </View>

              <View className="w-fit flex-col items-start justify-start ml-2">
                <View className="flex-row items-center justify-start">
                  <FontAwesomeIcon
                    icon={icons.faHospital}
                    size={12}
                    style={{ color: "#0ea5e9" }}
                  />
                  <Text className="ml-4 text-[14px] ml-1 mr-1">
                    Puppy Shelter
                  </Text>
                </View>
                <View className="flex-row items-center-justify-start mt-1">
                  <FontAwesomeIcon
                    icon={icons.faLocationDot}
                    size={10}
                    style={{ color: "#ef4444" }}
                  />
                  <Text className="ml-4 text-[10px] ml-1 mr-1">
                    Tokyo,Japan
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View className="w-full h-[4px] bg-gray-300 mt-5"></View>
          <View className="w-full px-4 h-fit">
            <View className="w-full flex-row items-center justify-between">
              <Text className="font-semibold text-[14px] mb-2 mt-4">
                Other Pets
              </Text>
              <TouchableOpacity className="flex-row items-center justify-center mt-1">
                <Text className="text-[14px] text-[#f59e0b]">(See more)</Text>
              </TouchableOpacity>
            </View>

            <FlashList
              data={PetDummy}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className="ml-2">
                  <AdoptPetCard
                    name={item.name}
                    image={item.image}
                    age={item.age}
                    gender={item.gender}
                    isHorizontal={true}
                  />
                </View>
              )}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              estimatedItemSize={20}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdoptPetDetail;
