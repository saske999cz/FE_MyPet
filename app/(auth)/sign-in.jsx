import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, Redirect, router } from "expo-router";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submit = () => {
    router.replace("/home");
  };
  return (
    <SafeAreaView className="bg-[#E58E37] h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full h-full justify-start px-4">
          <Image
            source={images.logoWhite}
            className="w-full h-[80px] -ml-3"
            resizeMode="contain"
          />
          <Text className="font-semibold text-2xl text-white mt-16 w-[full] text-center">
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
  );
};

export default SignIn;
