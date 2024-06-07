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
        <Stack.Screen
          name="Shop"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="DoctorDetail"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CheckOut"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Search"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EditPost"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MyPetDetail"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="UserSearchResult"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CreateAdoptionRequest"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EditMyProfile"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="VaccinationDetail"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MedicalDetail"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Security"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AnimalShelter"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MyAppointment"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ShopCategoryDetail"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MyOrder"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="OrderDetail"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AppointmentDetail"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AllReviews"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SimilarProducts"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SimilarClinics"
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
