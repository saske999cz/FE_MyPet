import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const ScreensLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="AdoptPetDetail"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CreateAppointment"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MedicalCenterDetail"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MyPet"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MyProfile"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="PostDetail"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ProductDetail"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ProfileDetail"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Cart"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
};

export default ScreensLayout;

const styles = StyleSheet.create({});
