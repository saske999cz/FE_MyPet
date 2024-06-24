import { StyleSheet } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const ScreensLayout = () => {
  const screens = () => {
    const screenList = [
      "AdoptPetDetail",
      "CreateAppointment",
      "MedicalCenterDetail",
      "MyPet",
      "MyProfile",
      "PostDetail",
      "ProductDetail",
      "ProfileDetail",
      "Cart",
      "Shop",
      "DoctorDetail",
      "CheckOut",
      "Search",
      "EditPost",
      "MyPetDetail",
      "UserSearchResult",
      "CreateAdoptionRequest",
      "EditMyProfile",
      "VaccinationDetail",
      "MedicalDetail",
      "Security",
      "AnimalShelter",
      "MyAppointment",
      "ShopCategoryDetail",
      "MyOrder",
      "OrderDetail",
      "AppointmentDetail",
      "AllReviews",
      "SimilarProducts",
      "SimilarClinics",
      "BasicAccountInfo",
      "EditPetInfo",
      "MakeReview",
      "MyReview",
      "Notifications",
      "DoctorReview",
      "ProductReview",
      "ReviewDetail",
      "CustomMap",
      "ShopReview",
      "MedicalCenterReview",
      "AllMedicalCenterReviews",
      "AllShopReviews",
      "SimilarPets",
      "PostPhotos",
      "MyAdoptionRequest",
      "AdoptionRequestDetail",
    ];

    return screenList.map((screen) => {
      return (
        <Stack.Screen
          key={screen}
          name={screen}
          options={{
            headerShown: false,
          }}
        />
      );
    });
  };
  return (
    <>
      <Stack>{screens()}</Stack>
    </>
  );
};

export default ScreensLayout;

const styles = StyleSheet.create({});
