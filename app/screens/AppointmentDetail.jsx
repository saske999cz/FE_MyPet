import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { FlashList } from "@shopify/flash-list";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { router } from "expo-router";
import { VetAppointmentsDummy, ItemDummy } from "../../dummy/FakeData";
import { useLocalSearchParams } from "expo-router";

const AppointmentDetail = () => {
  const { appointmentId } = useLocalSearchParams();
  const [appointment, setAppointment] = useState(null);
  const handleBack = () => {
    router.back();
  };
  useEffect(() => {
    const res = VetAppointmentsDummy.find(
      (appointment) => appointment.appointmentId === appointmentId
    );
    setAppointment(res);
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
      {appointment && (
        <ScrollView>
          <View className="w-full h-84 flex-col items-center justify-start mt-2">
            <View className="w-full h-40 flex-col items-center justify-start px-4">
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
                <Text className="text-[13px] ml-7">{appointmentId}</Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start">
                <Text className="text-[13px] ml-7">{appointment.date}</Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start">
                <Text className="text-[13px] ml-7">
                  {appointment.vetAssigned}
                </Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start">
                <Text className="text-[13px] ml-7">
                  {appointment.vetClinic}
                </Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start">
                <Text className="text-[13px] ml-7">
                  Reason: {appointment.reasonForVisit}
                </Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start">
                <Text className="text-[13px] ml-7">
                  Notes: {appointment.notes}
                </Text>
              </View>
            </View>
            <View className="w-full h-24 flex-col items-center justify-start px-4">
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
              <View className="w-full h-5 flex-row items-center justify-start">
                <Text className="text-[13px] ml-7">
                  {appointment.ownerName}
                </Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start">
                <Text className="text-[13px] ml-7">
                  {appointment.telephone}
                </Text>
              </View>
            </View>
            <View className="w-full h-24 flex-col items-center justify-start px-4">
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
              <View className="w-full h-5 flex-row items-center justify-start">
                <Text className="text-[13px] ml-7">{appointment.petName}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default AppointmentDetail;
