import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { router } from "expo-router";
import { get_appointments } from "../../api/AppointmentApi";
import LottieView from "lottie-react-native";

const Notifications = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  const handleBack = () => {
    router.back();
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {}, [page]);

  return (
    <SafeAreaView className="h-full w-full">
      <View className="w-full h-12 flex-row items-center justify-center border-b-[0.5px] border-solid border-gray-300">
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
        <Text className="font-bold text-[16px]">Notifications</Text>
      </View>
      {isLoading ? (
        <View className="w-full h-full flex-row items-start justify-center">
          <LottieView
            style={{ width: 120, height: 120, marginTop: 150 }}
            source={require("../../assets/lottie/loading.json")}
            autoPlay
            loop
            speed={1.5}
          />
        </View>
      ) : (
        appointments &&
        appointments.length > 0 && (
          <FlatList
            data={appointments}
            renderItem={({ item }) => {
              const date = new Date(item.start_time);
              const time = `${date
                .getHours()
                .toString()
                .padStart(2, "0")}:${date
                .getMinutes()
                .toString()
                .padStart(2, "0")}`;
              return (
                <TouchableOpacity
                  className="w-full h-12 flex-row items-center justify-start px-6 mt-4 mb-4"
                  onPress={() => handleAppointmentPress(item.appointment_id)}
                >
                  <View className="w-[30%] h-12 flex-col">
                    <View className="w-full flex-row items-center justify-start">
                      <Text className="text-[13px] font-semibold">
                        {new Date(item.start_time).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Text>
                    </View>
                    <View className="w-full flex-row items-center justify-start mt-2">
                      <FontAwesomeIcon
                        icon={icons.faClock}
                        size={13}
                        style={{
                          color: `${item.done === 1 ? "#22c55e" : "#94a3b8"}`,
                        }}
                      />
                      <Text
                        className={`text-[13px] ml-1 ${
                          item.done === 1
                            ? "text-green-500 font-semibold"
                            : "text-black"
                        }`}
                      >
                        {item.done === 1 ? "Done" : time}
                      </Text>
                    </View>
                  </View>
                  <View className="w-[70%] h-12 flex-col">
                    <View className="w-full flex-row items-center justify-start">
                      <Text className="text-[13px] font-semibold">
                        {item.medical_center.name}
                      </Text>
                    </View>
                    <View className="w-full flex-row items-center justify-start mt-2">
                      <Text className="text-[13px]">
                        {item.doctor.full_name}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.appointment_id}
            estimatedItemSize={30}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
          />
        )
      )}
    </SafeAreaView>
  );
};

export default Notifications;
