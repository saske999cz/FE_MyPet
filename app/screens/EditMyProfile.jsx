import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { router } from "expo-router";
import FormField from "../../components/FormField";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useGlobalContext } from "../../state/GlobalContextProvider";
import { update_profile, get_my_profile } from "../../api/UserApi";
import LottieView from "lottie-react-native";
import RNPickerSelect from "react-native-picker-select";

const EditMyProfile = () => {
  const { setUserName, setUserFullName, setUserEmail } = useGlobalContext();
  const [profileData, setProfileData] = useState({
    username: null,
    phone: null,
    address: null,
    full_name: null,
    gender: null,
    birthdate: null,
    email: null,
  });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentProccessText, setCurrentProccessText] = useState(". . .");
  const [loadingText, setLoadingText] = useState("Updating post");

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = date.toLocaleDateString("en-GB");
    const today = new Date();
    const hundredYearsAgo = new Date(
      today.getFullYear() - 100,
      today.getMonth(),
      today.getDate()
    );
    if (date > today) {
      alert("Invalid date: Future dates are not allowed.");
      return;
    } else if (date < hundredYearsAgo) {
      alert("Invalid date: Date is more than 100 years old.");
      return;
    }
    setProfileData({ ...profileData, birthdate: formattedDate });
    hideDatePicker();
  };

  const handleBack = () => {
    router.back();
  };

  const handleEditProfile = async () => {
    let newErrors = {}; // Temporary object to accumulate errors

    if (!postData.username) {
      newErrors = { ...newErrors, username: "Please enter title" };
    }
    if (!postData.phone) {
      newErrors = { ...newErrors, phone: "Please enter description" };
    }
    if (!postData.address) {
      newErrors = { ...newErrors, address: "Please enter address" };
    }
    if (!postData.full_name) {
      newErrors = { ...newErrors, full_name: "Please enter full name" };
    }
    if (!postData.gender) {
      newErrors = { ...newErrors, gender: "Please select a gender" };
    }

    setError(newErrors);
    if (Object.keys(newErrors).length > 0) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSending(true);
    try {
      const res = await update_profile(profileData);
      if (res && res.status === 200) {
        setLoadingText("Profile updated successfully");
        setUserName(profileData.username);
        setUserFullName(profileData.full_name);
        setUserEmail(profileData.email);
        setIsSending(false);
        router.back();
      } else {
        console.log("Error updating profile:", res.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    const getProfile = async () => {
      try {
        get_my_profile().then((res) => {
          if (res && res.status === 200) {
            setProfileData({
              username: res.data.data.account.username,
              phone: res.data.data.phone,
              address: res.data.data.address,
              full_name: res.data.data.full_name,
              email: res.data.data.account.email,
              birthdate: res.data.data.birthdate,
              gender: res.data.data.gender,
            });
            setIsLoading(false);
          } else {
            console.error("Error fetching profile:", res.data.message);
          }
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    getProfile();
  }, []);

  return (
    <View>
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
        <Text className="text-[16px] font-semibold">Edit info</Text>
        <TouchableOpacity
          className="w-12 h-12 flex-row items-center justify-center absolute top-0 right-0 mr-3"
          onPress={handleEditProfile}
        >
          <Text className="font-semibold text-[15px] text-amber-500">Done</Text>
        </TouchableOpacity>
      </View>
      {isSending && (
        <View className="w-full h-full flex-row items-start justify-center absolute top-0 bottom-0 z-[12]">
          <View className="w-full h-full bg-zinc-900/40 opacity-100 absolute top-0 bottom-0"></View>
          <LottieView
            style={{ width: 240, height: 240, marginTop: 250 }}
            source={require("../../assets/lottie/sendingData.json")}
            autoPlay
            loop
            speed={1.5}
          />
          <View className="w-full h-fit absolute top-[440px] flex-row items-center justify-center">
            <View className="w-fit h-fit flex-row items-center justify-end">
              <Text className="text-white text-[14px] font-semibold">
                {loadingText}
              </Text>
            </View>
            {currentProccessText !== "" && (
              <View className="w-7 h-fit flex-row items-center justify-start ml-1">
                <Text className="text-white text-[14px] font-semibold ">
                  {currentProccessText}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
      <View className="w-full h-[1px] bg-gray-300 px-4"></View>
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
        <View className="w-full h-fit flex-col p-2">
          <FormField
            title="Username"
            titleStyles="text-black font-[13px]"
            otherStyles="mt-5"
            value={profileData.username}
            onChangeText={(text) => {
              setProfileData({ ...profileData, username: text });
              setError({ ...error, username: null });
            }}
            error={error.username}
          />
          <FormField
            title="Full Name"
            titleStyles="text-black font-[13px]"
            otherStyles="mt-5"
            value={profileData.full_name}
            onChangeText={(text) => {
              setProfileData({ ...profileData, full_name: text });
              setError({ ...error, username: null });
            }}
            error={error.username}
          />
          <FormField
            title="Phone"
            titleStyles="text-black font-[13px]"
            otherStyles="mt-5"
            value={profileData.phone}
            onChangeText={(text) => {
              setProfileData({ ...profileData, phone: text });
              setError({ ...error, phone: null });
            }}
            error={error.phone}
          />
          <FormField
            title="Address"
            titleStyles="text-black font-[13px]"
            otherStyles="mt-5"
            value={profileData.address}
            onChangeText={(text) => {
              setProfileData({ ...profileData, address: text });
              setError({ ...error, address: null });
            }}
            error={error.address}
          />
          <View className="w-full h-20 flex-col mt-4">
            <View
              className={`w-full h-fit flex-row items-center px-2 ${
                error.gender ? "justify-between" : "justify-start"
              }`}
            >
              <Text className="font-semibold text-black text-[13px] mt-2 mb-2">
                Type
              </Text>
              {error.gender && (
                <Text className="text-[12px] text-red-500">{error.gender}</Text>
              )}
            </View>
            <RNPickerSelect
              value={profileData.gender}
              onValueChange={(value) => {
                setProfileData({ ...profileData, gender: value });
                setError({ ...error, gender: null });
              }}
              placeholder={{
                label: "Select a Gender",
                value: null,
              }}
              style={{
                placeholder: {
                  color: "#64748b",
                },
                inputIOS: {
                  // styles for iOS
                  width: "100%",
                  height: 45,
                  borderColor: `${error.gender ? "red" : "#d1d5db"}`,
                  borderRadius: 6,
                  borderWidth: 2,
                  paddingHorizontal: 12,
                  fontSize: 13,
                },
                inputAndroid: {
                  width: "100%",
                  height: 45,
                  borderColor: `${error.gender ? "red" : "#d1d5db"}`,
                  borderRadius: 6,
                  borderWidth: 2,
                  paddingHorizontal: 12,
                  fontSize: 13,
                },
              }}
              items={[
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
              ]}
            />
          </View>
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
                {profileData.birthdate}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

export default EditMyProfile;
