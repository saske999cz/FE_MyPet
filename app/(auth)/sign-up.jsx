import { View, Text, ScrollView, Image, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link } from "expo-router";
import { router } from "expo-router";
import { user_register } from "../../api/AuthApi";

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const submit = () => {
    let newErrors = {};
    if (form.username.length < 4) {
      newErrors.username = "Username is required";
    }
    if (form.email.length == 0) {
      newErrors.email = "Email is required";
    }
    if (!validateEmail(form.email)) {
      newErrors.email = "Email is invalid";
    }
    if (form.password !== form.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    if (form.password.length == 0) {
      newErrors.password = "Password is required";
    }
    if (form.confirm_password.length == 0) {
      newErrors.confirm_password = "Confirm password is required";
    }
    setError(newErrors);
    if (Object.keys(newErrors).length > 0) {
      alert("Please fill in all required fields");
    } else {
      setIsSubmitting(true);
      router.replace("../screens/BasicAccountInfo");
      user_register({
        username: form.username,
        email: form.email,
        password: form.password,
        confirm_password: form.confirm_password,
      })
        .then((res) => {
          if (res.status === 201) {
            setIsSubmitting(false);
            router.replace("../screens/BasicAccountInfo");
          }
        })
        .catch((err) => {
          alert("Error: " + err.message);
        });
    }
  };

  return (
    <View className="w-full h-full">
      <SafeAreaView className="w-full bg-[#E58E37] h-full">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View className="w-full h-full justify-start px-4">
            <Text className="font-semibold text-2xl text-black mt-8 w-[full] text-center">
              Sign up
            </Text>
            <FormField
              title="Username"
              value={form.username}
              handleChangeText={(e) => {
                setForm({ ...form, username: e });
                setError({ ...error, username: null });
              }}
              otherStyles="mt-7"
              titleStyles={"text-black font-[13px]"}
              error={error.username}
            />
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
              error={error.email}
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
              error={error.password}
            />
            <FormField
              title="Confirm Password"
              value={form.confirm_password}
              handleChangeText={(e) => {
                setForm({ ...form, confirm_password: e });
                setError({ ...error, confirm_password: null });
              }}
              otherStyles="mt-7"
              secureText={true}
              titleStyles={"text-black font-[13px]"}
              error={error.confirm_password}
            />
            <CustomButton
              title="Sign Up"
              handlePress={submit}
              containerStyles="mt-10 bg-[#3D1E14]"
              textStyles="text-gray-50"
              isLoading={isSubmitting}
            />
            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-50">
                Have an account already?
              </Text>
              <Link
                href="/sign-in"
                className="text-lg text-[#3D1E14] font-semibold"
              >
                Sign In
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

export default SignUp;
