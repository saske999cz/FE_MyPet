import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, images } from "../../constants";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import ReviewMedicalCenter from "../../components/ReviewMedicalCenter";
import { get_done_appointments } from "../../api/RatingApi";
import { Image } from "expo-image";

const MedicalCenterReview = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("unreviewed");
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const handleLoadMore = () => {
    if (page <= maxPage) setPage((prevPage) => prevPage + 1);
  };
  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    if (activeTab === "reviewed") {
      get_done_appointments(page, 40).then((res) => {
        if (res && res.status === 200) {
          const newData = [...appointments, ...res.data.data];
          const uniqueData = newData.reduce((unique, product) => {
            if (
              !unique.find(
                (item) => item.medical_center.id === product.medical_center.id
              )
            ) {
              unique.push(product);
            }
            return unique;
          }, []);
          const reviewed = uniqueData.filter(
            (item) => item.medical_center.is_reviewed === true
          );
          setAppointments(reviewed);
          setMaxPage(res.data.total_pages);
          if (reviewed.length === 0) {
            handleLoadMore();
          } else {
            setIsLoading(false);
          }
          if (page >= maxPage) setIsLoading(false);
        }
      });
    } else if (activeTab === "unreviewed") {
      get_done_appointments(page, 40).then((res) => {
        if (res && res.status === 200) {
          const newData = [...appointments, ...res.data.data];
          const uniqueData = newData.reduce((unique, product) => {
            if (
              !unique.find(
                (item) => item.medical_center.id === product.medical_center.id
              )
            ) {
              unique.push(product);
            }
            return unique;
          }, []);
          const unreviewed = uniqueData.filter(
            (item) => item.medical_center.is_reviewed === false
          );
          setAppointments(unreviewed);
          setMaxPage(res.data.total_pages);
          if (unreviewed.length === 0) {
            handleLoadMore();
          } else {
            setIsLoading(false);
          }
          if (page >= maxPage) setIsLoading(false);
        }
      });
    } else if (activeTab === "response") {
      get_done_appointments(page, 60).then((res) => {
        if (res && res.status === 200) {
          const newData = [...appointments, ...res.data.data];
          const uniqueData = newData.reduce((unique, product) => {
            if (
              !unique.find(
                (item) => item.medical_center.id === product.medical_center.id
              )
            ) {
              unique.push(product);
            }
            return unique;
          }, []);
          const responsed = uniqueData.filter(
            (item) => item.medical_center.medical_center_responsed === true
          );
          setAppointments(responsed);
          setMaxPage(res.data.total_pages);
          if (responsed.length === 0) {
            handleLoadMore();
          } else {
            setIsLoading(false);
          }
          if (page >= maxPage) setIsLoading(false);
        }
      });
    }
  }, [page, activeTab]);

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
        <Text className="font-bold text-[16px]">Medical Center Reviews</Text>
      </View>
      <View className="w-full h-10 flex-row items-center justify-between mb-2">
        <TouchableOpacity
          className={`w-1/3 h-full flex-row items-center justify-center ${
            activeTab === "unreviewed"
              ? "border-b-2 border-solid border-amber-500"
              : ""
          }`}
          onPress={() => {
            setActiveTab("unreviewed");
            setIsLoading(true);
            setAppointments([]);
            setPage(1);
          }}
        >
          <Text
            className={`${
              activeTab === "unreviewed" ? "text-amber-500" : "text-black"
            } text-[13px] px-3`}
          >
            Unreviewed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`w-1/3 h-full flex-row items-center justify-center ${
            activeTab === "reviewed"
              ? "border-b-2 border-solid border-amber-500"
              : ""
          }`}
          onPress={() => {
            setActiveTab("reviewed");
            setIsLoading(true);
            setAppointments([]);
            setPage(1);
          }}
        >
          <Text
            className={`${
              activeTab === "reviewed" ? "text-amber-500" : "text-black"
            } text-[13px] px-3`}
          >
            Reviewed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`w-1/3 h-full flex-row items-center justify-center ${
            activeTab === "response"
              ? "border-b-2 border-solid border-amber-500"
              : ""
          }`}
          onPress={() => {
            setActiveTab("response");
            setIsLoading(true);
            setAppointments([]);
            setPage(1);
          }}
        >
          <Text
            className={`${
              activeTab === "response" ? "text-amber-500" : "text-black"
            } text-[13px] px-3`}
          >
            Clinic Responses
          </Text>
        </TouchableOpacity>
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
      ) : activeTab === "unreviewed" && appointments.length > 0 ? (
        <FlatList
          data={appointments}
          renderItem={({ item }) => (
            <View className="w-full h-fit px-2">
              <ReviewMedicalCenter
                item={item.medical_center}
                type="unreviewed"
              />
            </View>
          )}
          keyExtractor={(item) => item.appointment_id}
          estimatedItemSize={30}
        />
      ) : activeTab === "reviewed" && appointments.length > 0 ? (
        <FlatList
          data={appointments}
          renderItem={({ item }) => (
            <View className="w-full h-fit px-2">
              <ReviewMedicalCenter item={item.medical_center} type="reviewed" />
            </View>
          )}
          keyExtractor={(item) => item.appointment_id}
          estimatedItemSize={30}
        />
      ) : activeTab === "response" && appointments.length > 0 ? (
        <FlatList
          data={appointments}
          renderItem={({ item }) => (
            <View className="w-full h-fit px-2">
              <ReviewMedicalCenter item={item.medical_center} type="response" />
            </View>
          )}
          keyExtractor={(item) => item.appointment_id}
          estimatedItemSize={30}
        />
      ) : (
        <View className="w-full h-full flex-row items-start justify-center bg-[#f9f9f9]">
          <Image
            source={images.nodata}
            className="w-full h-[400px]"
            contentFit="contain"
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default MedicalCenterReview;
