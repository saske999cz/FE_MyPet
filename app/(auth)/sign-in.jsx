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

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const submit = () => {
    if (form.email.length == 0) {
      alert("Email is required");
      return;
    }
    if (!validateEmail(form.email)) {
      alert("Email is invalid");
      return;
    }
    if (form.password.length == 0) {
      alert("Password is required");
      return;
    }
    setIsSubmitting(true);
    user_login({ email: form.email, password: form.password })
      .then((res) => {
        if (res && res.status === 200) {
          AsyncStorage.setItem("token", res.data.access_token);
          AsyncStorage.setItem("userName", res.data.user.username);
          AsyncStorage.setItem("userAvatar", res.data.user.avatar);
          AsyncStorage.setItem("userId", res.data.user.id.toString());
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
  };
  return (
    <View className="w-full h-full">
      <SafeAreaView className="w-full bg-[#E58E37] h-full">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View className="w-full h-full justify-start px-4">
            <Text className="font-semibold text-2xl text-white  mt-32 w-[full] text-center">
              Sign in
            </Text>
            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-7"
              keyBoardType="email-address"
            />
            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7"
              secureText={true}
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
