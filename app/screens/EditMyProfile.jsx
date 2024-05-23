import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { router } from "expo-router";
import FormField from "../../components/FormField";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const EditMyProfile = () => {
  const [profileData, setProfileData] = useState({
    username: "",
    name: "",
    address: "",
    dateOfBirth: "",
  });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date) => {
    const formattedDate = date.toLocaleDateString("en-GB");
    setProfileData({ ...profileData, dateOfBirth: formattedDate });
    hideDatePicker();
  };

  const handleBack = () => {
    router.back();
  };

  const handleEditProfile = () => {
    router.back();
  };

  return (
    <SafeAreaView>
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
        <Text className="text-[16px] font-semibold">Edit info</Text>
        <TouchableOpacity
          className="w-12 h-12 flex-row items-center justify-center absolute top-0 right-0 mr-3"
          onPress={handleEditProfile}
        >
          <Text className="font-semibold text-[15px] text-amber-500">Done</Text>
        </TouchableOpacity>
      </View>
      <View className="w-full h-[1px] bg-gray-300 px-4"></View>
      <View className="w-full h-fit flex-col p-2">
        <FormField
          title="Name"
          titleStyles="text-black font-[13px]"
          otherStyles="mt-5"
          value={profileData.name}
          onChangeText={(text) => setProfileData({ ...postData, name: text })}
        />
        <FormField
          title="Username"
          titleStyles="text-black font-[13px]"
          otherStyles="mt-5"
          value={profileData.username}
          onChangeText={(text) =>
            setProfileData({ ...postData, username: text })
          }
        />
        <FormField
          title="Address"
          titleStyles="text-black font-[13px]"
          otherStyles="mt-5"
          value={profileData.address}
          onChangeText={(text) =>
            setProfileData({ ...postData, address: text })
          }
        />
        <View className="w-full h-16 flex-col items-center justify-start mt-5">
          <View className="w-full h-fit flex-row items-center justify-start">
            <Text className="text-black text-[13px] mb-2 font-semibold">
              Date of birth
            </Text>
          </View>

          <TouchableOpacity
            className="w-full h-12 flex-row items-center justify-start bg-gray-200 rounded-md px-4"
            onPress={showDatePicker}
          >
            <FontAwesomeIcon
              icon={icons.faCalendarDays}
              size={20}
              style={{ color: "#f59e0b" }}
            />
            <Text className="text-black font-[13px] ml-2">
              {profileData.dateOfBirth}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </SafeAreaView>
  );
};

export default EditMyProfile;
