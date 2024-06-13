import { View, Text, ScrollView, Image, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import { user_login } from "../../api/AuthApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiManager from "../../api/ApiManager";
import { useGlobalContext } from "../../state/GlobalContextProvider";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});
  const {
    setUserName,
    setUserAvatar,
    setUserId,
    setUserEmail,
    setUserFullName,
  } = useGlobalContext();

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const submit = () => {
    let newErrors = {};
    if (form.email.length == 0) {
      newErrors.email = "Email is required";
    }
    if (!validateEmail(form.email)) {
      newErrors.email = "Email is invalid";
    }
    if (form.email.length == 0) {
      newErrors.email = "Email is required";
    }
    if (form.password.length == 0) {
      newErrors.password = "Password is required";
    }
    setError(newErrors);
    if (Object.keys(newErrors).length > 0) {
      alert("Please fill in all required fields");
    } else {
      setIsSubmitting(true);
      user_login({ email: form.email, password: form.password })
        .then((res) => {
          if (res && res.status === 200) {
            AsyncStorage.setItem("token", res.data.access_token);
            setUserName(res.data.user.username);
            setUserAvatar(res.data.user.avatar);
            setUserId(res.data.user.id);
            setUserEmail(res.data.user.email);
            setUserFullName(res.data.user.full_name);
            console.log("Full name", res.data.user.full_name);
            ApiManager.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${res.data.access_token}`;
            setIsSubmitting(false);
            router.replace("../(tabs)/home");
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          alert("An error occurred, please try again", err);
          setIsSubmitting(false);
        });
    }
  };
  return (
    <View className="w-full h-full">
      <SafeAreaView className="w-full bg-[#E58E37] h-full">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View className="w-full h-full justify-start px-4">
            <Text className="font-semibold text-2xl text-black  mt-32 w-[full] text-center">
              Sign in
            </Text>
            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => {
                setForm({ ...form, email: e });
                setError({ ...error, email: null });
              }}
              otherStyles="mt-7"
              keyBoardType="email-address"
              titleStyles={"text-black font-[13px]"}
            />
            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => {
                setForm({ ...form, password: e });
                setError({ ...error, password: null });
              }}
              otherStyles="mt-7"
              secureText={true}
              titleStyles={"text-black font-[13px]"}
            />
            <CustomButton
              title="Sign In"
              handlePress={submit}
              containerStyles="mt-8 bg-[#3D1E14]"
              textStyles="text-gray-50"
              isLoading={isSubmitting}
            />
            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-50">Don't have account?</Text>
              <Link
                href="/sign-up"
                className="text-lg text-[#3D1E14] font-semibold"
              >
                Sign Up
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      {isSubmitting && (
        <View className="absolute w-full h-full top-0 right-0 left-0 bottom-0 flex-row items-center justify-center">
          <View className="w-full h-full bg-black opacity-50 absolute top-0"></View>
          <ActivityIndicator size="large" color="#ffffff" className="z-3" />
        </View>
      )}
    </View>
  );
};

export default SignIn;
