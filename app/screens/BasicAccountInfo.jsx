import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images, icons } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiManager from "../../api/ApiManager";
import { Image } from "expo-image";
import RNPickerSelect from "react-native-picker-select";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const BasicAccountInfo = () => {
  const [form, setForm] = useState({
    full_name: "",
    gender: null,
    birthdate: null,
    CMND: "",
    address: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [error, setError] = useState({});

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date) => {
    setError({ ...error, birthdate: null });
    const formattedDate = date.toLocaleDateString("en-GB");
    setForm({ ...form, birthdate: formattedDate });
    hideDatePicker();
  };

  const submit = () => {
    let newErrors = {};
    if (form.full_name.length < 4) {
      newErrors.full_name = "Full name is required";
    }
    if (form.birthdate === null) {
      newErrors.birthdate = "Birthdate is required";
    }
    if (form.address.length < 4) {
      newErrors.address = "Address is required";
    }
    if (form.phone.length < 10) {
      newErrors.phone = "Phone is required";
    }
    if (form.gender === null) {
      newErrors.gender = "Gender is required";
    }
    setError(newErrors);
    if (Object.keys(newErrors).length != 0) {
      alert("Please fill in all required fields");
    } else {
      setIsSubmitting(true);
    }
  };

  return (
    <View className="w-full h-full">
      <SafeAreaView className="w-full bg-[#E58E37] h-full">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View className="w-full h-full justify-start px-4">
            <Text className="font-semibold text-2xl text-black mt-10 w-[full] text-center">
              User Info
            </Text>
            <FormField
              title="Full Name"
              value={form.email}
              handleChangeText={(e) => {
                setForm({ ...form, full_name: e });
                setError({ ...error, full_name: null });
              }}
              otherStyles="mt-7"
              error={error.full_name}
              titleStyles={"text-black font-[13px]"}
              errorTextStyles={"text-red-600 text-[12px] ml-4"}
            />
            <View className="w-full h-16 flex-col items-center justify-start mt-7">
              <View
                className={`w-full h-fit flex-row items-center mb-2 ${
                  error.birthdate ? "justify-between" : "justify-start"
                }`}
              >
                <Text className="text-black text-[13px] font-semibold">
                  Date of birth
                </Text>
                {error.birthdate && (
                  <Text className="text-[12px] text-red-600">
                    {error.birthdate}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                className={`w-full h-12 flex-row items-center justify-start bg-white rounded-md px-4 border-2 border-solid ${
                  error.birthdate ? "border-red-500" : "border-gray-300"
                }`}
                onPress={showDatePicker}
              >
                <FontAwesomeIcon
                  icon={icons.faCalendarDays}
                  size={20}
                  style={{ color: "#f59e0b" }}
                />
                <Text className="text-black font-[13px] ml-2">
                  {form.birthdate || "Select date of birth"}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="w-full h-20 flex-col mt-7">
              <View
                className={`w-full h-fit flex-row items-center mb-2 ${
                  error.gender ? "justify-between" : "justify-start"
                }`}
              >
                <Text className="font-semibold text-black text-[13px]">
                  Gender
                </Text>
                {error.gender && (
                  <Text className="text-[12px] text-red-600">
                    {error.gender}
                  </Text>
                )}
              </View>
              <RNPickerSelect
                value={form.gender}
                onValueChange={(value) => {
                  setForm({ ...form, gender: value });
                  setError({ ...error, gender: null });
                }}
                placeholder={{
                  label: "Select a type...",
                  value: null,
                }}
                style={{
                  placeholder: {
                    color: "#64748b",
                  },
                  inputIOS: {
                    // styles for iOS
                    width: "100%",
                    height: 48,
                    borderColor: `${error.gender ? "red" : "#d1d5db"}`,
                    borderRadius: 6,
                    borderWidth: 2,
                    paddingHorizontal: 12,
                    fontSize: 13,
                    backgroundColor: "white",
                  },
                  inputAndroid: {
                    width: "100%",
                    height: 48,
                    borderColor: `${error.gender ? "red" : "#d1d5db"}`,
                    borderRadius: 6,
                    borderWidth: 2,
                    paddingHorizontal: 12,
                    fontSize: 13,
                    backgroundColor: "white",
                  },
                }}
                items={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                ]}
              />
            </View>
            <FormField
              title="Address"
              value={form.address}
              handleChangeText={(e) => {
                setForm({ ...form, address: e });
                setError({ ...error, address: null });
              }}
              otherStyles="mt-7"
              error={error.address}
              titleStyles={"text-black font-[13px]"}
              errorTextStyles={"text-red-600 text-[12px] ml-4"}
            />
            <FormField
              title="Phone"
              value={form.phone}
              handleChangeText={(e) => {
                setForm({ ...form, phone: e });
                setError({ ...error, phone: null });
              }}
              otherStyles="mt-7"
              numericKeyboard={true}
              error={error.phone}
              titleStyles={"text-black font-[13px]"}
              errorTextStyles={"text-red-600 text-[12px] ml-4"}
            />
            <CustomButton
              title="Finish"
              handlePress={submit}
              containerStyles="mt-8 bg-[#3D1E14]"
              textStyles="text-gray-50"
              isLoading={isSubmitting}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
      {isSubmitting && (
        <View className="absolute w-full h-full top-0 right-0 left-0 bottom-0 flex-row items-center justify-center">
          <View className="w-full h-full bg-black opacity-50 absolute top-0"></View>
          <ActivityIndicator size="large" color="#ffffff" className="z-3" />
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

export default BasicAccountInfo;
