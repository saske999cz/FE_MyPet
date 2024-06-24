import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash } from "../../constants";
import { router, useLocalSearchParams } from "expo-router";
import AdoptPetCard from "../../components/AdoptPetCard";
import { Image } from "expo-image";
import {
  get_unadopted_pets,
  get_unadopted_pet_detail,
} from "../../api/AdoptApi";
import { FIREBASE_STORAGE } from "../../firebaseConfig";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import { ProductDetailLoader } from "../../components/CustomLoader";

const AdoptPetDetail = () => {
  const { petId, petName, petAge, petImage, petGender } =
    useLocalSearchParams();
  const [aidCenterAvatarRef, setAidCenterAvatarRef] = useState(null);
  const [aidCenterAvatar, setAidCenterAvatar] = useState(null);
  const [petDetail, setPetDetail] = useState(null);
  const [flags, setFlags] = useState([]);
  const [similarPets, setSimilarPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleBack = () => {
    router.back();
  };

  const handleSimilarPets = () => {
    router.push({
      pathname: "../screens/SimilarPets",
      params: {
        petId: petId,
      },
    });
  };

  const handleCreateAdoptionRequest = () => {
    router.push({
      pathname: "../screens/CreateAdoptionRequest",
      params: {
        petId: petId,
        petName: petName,
        petAge: petAge,
        petImage: encodeURI(petImage),
        petGender: petGender,
      },
    });
  };

  const handleAnimalShelterPress = () => {
    router.push({
      pathname: "../screens/AnimalShelter",
      params: {
        aidCenterId: petDetail.aid_center_id,
        aidCenterAvatar: encodeURI(aidCenterAvatar),
        aidCenterName: petDetail.aid_center_name,
        aidCenterAddress: petDetail.aid_center_address,
        aidCenterWorkTime: petDetail.aid_center_work_time,
        aidCenterPhone: petDetail.aid_center_phone,
        aidCenterWebsite: petDetail.aid_center_website,
        aidCenterFanpage: petDetail.aid_center_fanpage,
      },
    });
  };

  useEffect(() => {
    const fetchPetDetail = async () => {
      const res = await get_unadopted_pet_detail(petId);
      if (res && res.status == 200) {
        setPetDetail({
          description: res.data.data.description,
          breed_name: res.data.data.breed_name,
          breed_origin: res.data.data.breed_origin,
          aid_center_name: res.data.data.aid_center.name,
          aid_center_address: res.data.data.aid_center.address,
          aid_center_id: res.data.data.aid_center.id,
          aid_center_work_time: res.data.data.aid_center.work_time,
          aid_center_phone: res.data.data.aid_center.phone,
          aid_center_website: res.data.data.aid_center.website,
          aid_center_fanpage: res.data.data.aid_center.fanpage,
          aid_center_description: res.data.data.aid_center.description,
        });
        setAidCenterAvatarRef(res.data.data.aid_center.image);
        setFlags((prev) => [...prev, true]);
      }
    };

    fetchPetDetail();
  }, []);

  useEffect(() => {
    const fetchAidCenterAvatar = async () => {
      if (aidCenterAvatarRef) {
        const imageFolderRef = ref(FIREBASE_STORAGE, aidCenterAvatarRef);
        const res = await listAll(imageFolderRef);
        if (res.items.length > 0) {
          const url = await getDownloadURL(res.items[0]);
          setAidCenterAvatar(url);
          setFlags((prev) => [...prev, true]);
        }
      }
    };
    fetchAidCenterAvatar();
  }, [aidCenterAvatarRef]);

  useEffect(() => {
    const fetchSimilarPets = async () => {
      const res = await get_unadopted_pets(1, 10);
      if (res && res.status == 200) {
        const newPets = [...similarPets, ...res.data.data];
        const uniquePets = newPets.reduce((unique, pet) => {
          if (!unique.find((item) => item.id === pet.id)) {
            unique.push(pet);
          }
          return unique;
        }, []);
        setSimilarPets(uniquePets.filter((pet) => pet.id != petId));
        setFlags((prev) => [...prev, true]);
      }
    };
    fetchSimilarPets();
  }, [petDetail]);

  useEffect(() => {
    if (flags.length === 3 && flags.every((flag) => flag === true)) {
      setIsLoading(false);
    }
  }, [flags]);

  return (
    <View className="h-full w-full">
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
      </View>
      {isLoading ? (
        <ProductDetailLoader />
      ) : similarPets && similarPets.length > 0 && petDetail ? (
        <ScrollView>
          <View className="flex-col items-center justify-start pb-8">
            <Image
              source={{ uri: petImage }}
              className="w-full h-60"
              contentFit="cover"
              style={{ aspectRatio: 16 / 9 }}
              placeholder={{ blurhash }}
              transition={0}
            />
            <View className="w-full h-36 flex-row items-center justify-between">
              <View className="w-[70%] h-full flex-col items-center justify-center px-4">
                <View className="w-full flex-row items-center justify-start">
                  <Text className="text-[18px] font-semibold mt-4">
                    {petName}
                  </Text>
                </View>
                <View className="flex-row w-full items-center justify-start mb-2 mt-2">
                  <Text className="text-[12px] font-semibold mr-1">
                    Gender:
                  </Text>
                  <Text className="text-[12px] mr-1">
                    {petGender === "male" ? "Male" : "Female"}
                  </Text>
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
                <View className="w-full h-fit flex-row items-center justify-start mb-2">
                  <Text className="text-[12px] font-semibold mr-1">Age:</Text>
                  <Text className="text-[12px]">{petAge} years old</Text>
                </View>
                <View className="w-full h-fit flex-row items-center justify-start mb-2">
                  <Text className="text-[12px] font-semibold mr-1">Breed:</Text>
                  <Text className="text-[12px]">{petDetail.breed_name}</Text>
                </View>
                <View className="w-full h-fit flex-row items-center justify-start mb-2">
                  <Text className="text-[12px] font-semibold mr-1">
                    Origin:
                  </Text>
                  <Text className="text-[12px]">{petDetail.breed_origin}</Text>
                </View>
              </View>
            </View>
            <View className="w-full h-[1px] bg-gray-300"></View>
            <View className="w-full h-fit px-4 mt-4">
              <Text className="text-[14px] font-semibold mb-2">Notes</Text>
              <Text className="text-[13px] text-gray-800">
                {petDetail.description}
              </Text>
            </View>
            <View className="w-full h-[4px] bg-gray-300 mt-5"></View>
            <View className="w-full px-4 mt-4">
              <TouchableOpacity
                className="w-full flex-row items-center justify-start"
                onPress={handleAnimalShelterPress}
              >
                <View className="w-10 h-10 rounded-full border-[0.5px] border-solid border-gray-200">
                  {aidCenterAvatar && (
                    <Image
                      source={{ uri: aidCenterAvatar }}
                      className="w-full h-full rounded-full"
                      placeholder={{ blurhash }}
                      transition={0}
                    />
                  )}
                </View>
                <View className="w-fit flex-col items-start justify-start ml-2">
                  <View className="flex-row items-center justify-start">
                    <FontAwesomeIcon
                      icon={icons.faHospital}
                      size={12}
                      style={{ color: "#0ea5e9" }}
                    />
                    <Text className="ml-4 text-[14px] ml-1 mr-1">
                      {petDetail.aid_center_name}
                    </Text>
                  </View>
                  <View className="flex-row items-center-justify-start mt-1">
                    <FontAwesomeIcon
                      icon={icons.faLocationDot}
                      size={10}
                      style={{ color: "#ef4444" }}
                    />
                    <Text className="ml-4 text-[10px] ml-1 mr-1">
                      {petDetail.aid_center_address}
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
                <TouchableOpacity
                  className="flex-row items-center justify-center mt-1"
                  onPress={handleSimilarPets}
                >
                  <Text className="text-[14px] text-[#f59e0b]">(See more)</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={similarPets}
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
      ) : null}
      {similarPets && similarPets.length > 0 ? (
        <View className="w-full h-16 flex-row items-start justify-end border-t-[0.5px] border-solid border-gray-200 bg-white">
          <TouchableOpacity
            className="w-48 h-10 bg-[#f59e0b]  flex-row items-center justify-center"
            onPress={handleCreateAdoptionRequest}
          >
            <FontAwesomeIcon
              icon={icons.faHeart}
              size={14}
              style={{ color: "white" }}
            />
            <Text className="text-white text-[13px] font-semibold ml-1">
              Adopt
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default AdoptPetDetail;
