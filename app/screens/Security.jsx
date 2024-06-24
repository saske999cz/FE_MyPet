import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { router } from "expo-router";
import FormField from "../../components/FormField";
import { change_password } from "../../api/UserApi";
import LottieView from "lottie-react-native";
import { set } from "date-fns";

const Security = () => {
  const [profileData, setProfileData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [error, setError] = useState({});

  const handleBack = () => {
    router.back();
  };

  const handleChangePassword = async () => {
    let newErrors = {};
    if (profileData.current_password.length == 0) {
      newErrors.current_password = "Current password is required";
    }
    if (profileData.new_password.length == 0) {
      newErrors.new_password = "New password is required";
    }
    if (profileData.confirm_password.length == 0) {
      newErrors.confirm_password = "Confirm password is required";
    }
    if (profileData.new_password !== profileData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }
    setError(newErrors);
    if (Object.keys(newErrors).length > 0) {
      alert("Please fill in all required fields");
    } else {
      setIsLoading(true);
      await change_password(profileData);
      setIsFinished(true);
      setIsLoading(false);
      setTimeout(() => {
        setIsFinished(false);
      }, 1500);
      setProfileData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    }
  };

  return (
    <View className="w-full h-full">
      <View className="w-full h-12 flex-row items-center justify-center mt-12">
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
        <Text className="text-[16px] font-semibold">Security</Text>
      </View>
      <View className="w-full h-[1px] bg-gray-300 px-4"></View>
      <View className="w-full h-fit flex-col px-8 mt-10">
        <FormField
          title="Current Password"
          titleStyles="text-black font-[13px]"
          otherStyles="mt-5"
          value={profileData.current_password}
          onChangeText={(text) => {
            setProfileData({ ...profileData, current_password: text });
            setError({ ...error, current_password: null });
          }}
          error={error.current_password}
          secureText={true}
        />
        <FormField
          title="New Password"
          titleStyles="text-black font-[13px]"
          otherStyles="mt-5"
          value={profileData.new_password}
          onChangeText={(text) => {
            setProfileData({ ...profileData, new_password: text });
            setError({ ...error, new_password: null });
          }}
          error={error.new_password}
          secureText={true}
        />
        <FormField
          title="Confirm Password"
          titleStyles="text-black font-[13px]"
          otherStyles="mt-5"
          value={profileData.confirm_password}
          onChangeText={(text) => {
            setProfileData({ ...profileData, confirm_password: text });
            setError({ ...error, confirm_password: null });
          }}
          error={error.confirm_password}
          secureText={true}
        />
        <View className="w-full h-fit flex-row items-center justify-center mt-7">
          <TouchableOpacity
            className="w-32 h-12 bg-amber-500 flex-row items-center justify-center rounded-md "
            onPress={handleChangePassword}
          >
            <Text className="text-[13px] font-semibold text-white">
              Change Password
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {isLoading && (
        <View className="w-full h-full absolute top-0 bottom-0 flex-col items-center justify-start">
          <View className="w-full h-full absolute top-0 bg-zinc-900/40 opacity-100"></View>
          <LottieView
            style={{ width: 240, height: 240, marginTop: 250 }}
            source={require("../../assets/lottie/sendingData.json")}
            autoPlay
            loop
            speed={1.5}
          />
          <View className="w-full h-fit absolute flex-row items-center justify-center top-[430px]">
            <Text className="text-white text-[14px] font-semibold">
              Changing password...
            </Text>
          </View>
        </View>
      )}
      {isFinished && (
        <View className="w-full h-full absolute top-0 bottom-0 flex-row items-start justify-center">
          <View className="w-full h-full absolute top-0 bg-zinc-900/40 opacity-100"></View>
          <LottieView
            style={{ width: 130, height: 130, marginTop: 280 }}
            source={require("../../assets/lottie/check.json")}
            autoPlay
            loop={false}
            speed={1}
          />
          <View className="w-full h-fit absolute flex-row items-center justify-center top-[430px]">
            <Text className="text-white text-[14px] font-semibold">
              Password changed successfully!
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default Security;
