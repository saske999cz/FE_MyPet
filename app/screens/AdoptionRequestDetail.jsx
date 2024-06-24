import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash } from "../../constants";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import { get_adopt_request_detail } from "../../api/AdoptApi";
import { Image } from "expo-image";
import { FIREBASE_STORAGE } from "../../firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";

const AdoptionRequestDetail = () => {
  const { requestId } = useLocalSearchParams();
  const [request, setRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);
  const [flags, setFlags] = useState([]);

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        get_adopt_request_detail(requestId).then((res) => {
          if (res && res.status === 200) {
            setRequest(res.data.data);
            setFlags((prev) => [...prev, true]);
          }
        });
      } catch (error) {
        console.error("Error fetching appointment:", error);
      }
    };
    fetchRequest();
  }, []);

  useEffect(() => {
    const fetchImage = async () => {
      if (request) {
        const storage = ref(FIREBASE_STORAGE, request.pet.image);
        getDownloadURL(storage).then((url) => {
          setImageUrl(url);
          setFlags((prev) => [...prev, true]);
        });
      }
    };
    fetchImage();
  }, [request]);

  useEffect(() => {
    if (flags.length === 2 && flags.every((flag) => flag === true)) {
      setIsLoading(false);
    }
  }, [flags]);

  return (
    <SafeAreaView>
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
        <Text className="font-bold text-[16px]">Request Detail</Text>
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
        <ScrollView>
          <View className="w-full h-fit flex-col items-center justify-start mt-2">
            <View className="w-full h-fit flex-col items-center justify-start px-4">
              <View className="w-full h-5 flex-row items-center justify-start">
                <FontAwesomeIcon
                  icon={icons.faCalendarDays}
                  size={17}
                  style={{ color: "#f59e0b" }}
                />
                <Text className="text-[14px] font-semibold ml-3">
                  Request Information
                </Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start">
                <Text className="text-[13px] ml-7 font-medium">ID: </Text>
                <Text className="text-[13px] ml-2">{requestId}</Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start mt-1">
                <Text className="text-[13px] ml-7 font-medium">Time:</Text>
                <Text className="text-[13px] ml-2">{request.created_at}</Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start mt-1">
                <Text className="text-[13px] ml-7 font-medium">
                  Animal Shelter:
                </Text>
                <Text className="text-[13px] ml-2">
                  {request.aid_center.name}
                </Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start mt-1">
                <Text className="text-[13px] ml-7 font-medium">Address:</Text>
                <Text className="text-[13px] ml-2">
                  {request.aid_center.address}, Đà Nẵng
                </Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start mt-1">
                <Text className="text-[13px] ml-7 font-medium">Phone:</Text>
                <Text className="text-[13px] ml-2">
                  {request.aid_center.phone}
                </Text>
              </View>
            </View>
            <View className="w-full h-fit flex-col items-center justify-start px-4 mt-8">
              <View className="w-full h-5 flex-row items-center justify-start">
                <FontAwesomeIcon
                  icon={icons.faPaw}
                  size={17}
                  style={{ color: "#f59e0b" }}
                />
                <Text className="text-[14px] font-semibold ml-3">
                  Pet Information
                </Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start ">
                <Text className="text-[13px] ml-7 font-medium">Name: </Text>
                <Text className="text-[13px] ml-2">{request.pet.name}</Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start mt-1">
                <Text className="text-[13px] ml-7 font-medium">Gender:</Text>
                <Text className="text-[13px] ml-2 mr-1">
                  {request.pet.gender === "male" ? "Male" : "Female"}
                </Text>
                <FontAwesomeIcon
                  icon={
                    request.pet.gender === "male" ? icons.faMars : icons.faVenus
                  }
                  size={13}
                  style={{
                    color:
                      request.pet.gender === "male" ? "#3b82f6" : "#f43f5e",
                  }}
                />
              </View>
              <View className="w-full h-5 flex-row items-center justify-start mt-1">
                <Text className="text-[13px] ml-7 font-medium">Age:</Text>
                <Text className="text-[13px] ml-2">{request.pet.age}</Text>
              </View>
              {imageUrl && (
                <View className="w-full h-52 rounded-md mt-4">
                  <Image
                    className="w-full h-full rounded-md"
                    source={{ uri: imageUrl }}
                    placeholder={{ blurhash }}
                    transition={0}
                    contentFit="cover"
                  />
                </View>
              )}
            </View>
            <View className="w-full h-fit flex-col items-center justify-start px-4 mt-8">
              <View className="w-full h-5 flex-row items-center justify-start">
                <FontAwesomeIcon
                  icon={icons.faClipboard}
                  size={17}
                  style={{ color: "#f59e0b", marginTop: -3 }}
                />
                <Text className="text-[14px] font-semibold ml-3">Notes</Text>
              </View>
              <View className="w-full h-fit flex-row items-center justify-start mt-1">
                <Text className="text-[13px] ml-7">
                  {request.note ? request.note : "No message"}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default AdoptionRequestDetail;
