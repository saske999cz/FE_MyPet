import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { get_appointment_detail_by_id } from "../../api/AppointmentApi";
import LottieView from "lottie-react-native";

const AppointmentDetail = () => {
  const { appointmentId } = useLocalSearchParams();
  const [appointment, setAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        get_appointment_detail_by_id(appointmentId).then((res) => {
          if (res && res.status === 200) {
            setAppointment(res.data.data);
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error("Error fetching appointment:", error);
      }
    };
    fetchAppointment();
  }, []);

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
        <Text className="font-bold text-[16px]">Appointment Detail</Text>
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
                  Appointment Information
                </Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start">
                <Text className="text-[13px] ml-7 font-medium">ID: </Text>
                <Text className="text-[13px] ml-2">{appointmentId}</Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start mt-1">
                <Text className="text-[13px] ml-7 font-medium">Time:</Text>
                <Text className="text-[13px] ml-2">
                  {appointment.start_time}
                </Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start mt-1">
                <Text className="text-[13px] ml-7 font-medium">Doctor:</Text>
                <Text className="text-[13px] ml-2">
                  {appointment.doctor.full_name}
                </Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start mt-1">
                <Text className="text-[13px] ml-7 font-medium">Clinic:</Text>
                <Text className="text-[13px] ml-2">
                  {appointment.medical_center.name}
                </Text>
              </View>
            </View>
            <View className="w-full h-fit flex-col items-center justify-start px-4 mt-8">
              <View className="w-full h-5 flex-row items-center justify-start">
                <FontAwesomeIcon
                  icon={icons.faHospitalUser}
                  size={17}
                  style={{ color: "#f59e0b" }}
                />
                <Text className="text-[14px] font-semibold ml-3">
                  Owner Information
                </Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start mt-1">
                <Text className="text-[13px] ml-7 font-medium">Name:</Text>
                <Text className="text-[13px] ml-2">
                  {appointment.customer.name}
                </Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start mt-1">
                <Text className="text-[13px] ml-7 font-medium">Phone:</Text>
                <Text className="text-[13px] ml-2">
                  {appointment.customer.phone}
                </Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start mt-1">
                <Text className="text-[13px] ml-7 font-medium">Email:</Text>
                <Text className="text-[13px] ml-2">
                  {appointment.customer.email}
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
                <Text className="text-[13px] ml-2">{appointment.pet.name}</Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start mt-1">
                <Text className="text-[13px] ml-7 font-medium">Gender:</Text>
                <Text className="text-[13px] ml-2">
                  {appointment.pet.gender === "male" ? "Male" : "Female"}
                </Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start mt-1">
                <Text className="text-[13px] ml-7 font-medium">Age:</Text>
                <Text className="text-[13px] ml-2">{appointment.pet.age}</Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start mt-1">
                <Text className="text-[13px] ml-7 font-medium">Breed:</Text>
                <Text className="text-[13px] ml-2">
                  {appointment.pet.breed.name}
                </Text>
              </View>
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
                  {appointment.message ? appointment.message : "No message"}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default AppointmentDetail;
