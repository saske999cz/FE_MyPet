import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState, useRef, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { PetDummy } from "../../dummy/FakeData";
import { router } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { images } from "../../constants";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import FormField from "../../components/FormField";
import * as ImagePicker from "expo-image-picker";
import DynamicImageGrid from "../../components/DynamicImageGrid";

const MyPet = () => {
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["90%"];
  const [imageList, setImageList] = useState([]);
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  const handleBack = () => {
    router.back();
  };

  const openBottomSheet = () => {
    bottomSheetModalRef.current.present();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 1,
    });

    if (!result.cancelled) {
      setImageList(result.assets.map((asset) => asset.uri));
    }
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaView className="h-full w-full">
          <View className="w-full h-12 flex-row items-center justify-center mb-2 border-b-[0.5px] border-solid border-gray-300">
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
            <Text className="font-bold text-[16px]">My Pet</Text>
            <TouchableOpacity
              className="w-12 h-12 flex-row items-center justify-center absolute top-0 right-0 mr-3"
              onPress={openBottomSheet}
            >
              <FontAwesomeIcon
                icon={icons.faPlus}
                size={16}
                style={{ color: "#f59e0b" }}
              />
            </TouchableOpacity>
          </View>
          <FlashList
            data={PetDummy}
            renderItem={({ item }) => (
              <TouchableOpacity className="w-full h-12 flex-row items-center justify-start px-3 mt-3 mb-3">
                <View className="w-12 h-12 rounded-full border-[0.5px] border-solid border-gray-400">
                  <Image
                    source={item.image}
                    className="w-full h-full rounded-full"
                  />
                </View>
                <View className="w-[80%] h-fit flex-col items-start justify-start ml-2">
                  <View className="w-full h-fit flex-row items-center justify-start">
                    <Text className="text-[15px] font-semibold">
                      {item.name}
                    </Text>
                  </View>
                  <View className="w-full h-fit flex-row items-center justify-start">
                    <Text className="text-[13px] mr-1">{item.gender}</Text>
                    {item.gender === "Male" ? (
                      <FontAwesomeIcon
                        icon={icons.faMars}
                        size={13}
                        style={{ color: "#3b82f6" }}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={icons.faVenus}
                        size={13}
                        style={{ color: "#f43f5e" }}
                      />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            estimatedItemSize={20}
          />
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            enablePanDownToClose={true}
            backgroundStyle={{
              backgroundColor: "#F5F5F7",
            }}
          >
            <View className="w-full h-full bg-[#F5F5F7] flex-col items-center justify-start">
              <View className="w-full h-12 flex-row items-center justify-center ">
                <Text className="font-semibold text-[15px]">My New Pet</Text>
                <TouchableOpacity className="w-12 h-12 absolute right-0 top-0 bottom-0 mt-4">
                  <Text className="font-semibold text-blue-500 text-[15px]">
                    Add
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                className="w-full"
                showsVerticalScrollIndicator={false}
              >
                <View className="w-full h-fit flex-col items-start justify-start px-6 bg-white border-solid border-[0.5px] border-gray-200 rounded-lg">
                  <FormField
                    title="Name"
                    placeholder="Enter your pet name"
                    titleStyles="text-black font-[13px]"
                    otherStyles="mt-5"
                  />
                  <FormField
                    title="Breed"
                    placeholder="Enter your pet breed"
                    titleStyles="text-black font-[13px]"
                    otherStyles="mt-5"
                  />
                  <FormField
                    title="Age"
                    placeholder="Enter your pet age"
                    titleStyles="text-black font-[13px]"
                    otherStyles="mt-5"
                  />
                  <FormField
                    title="Gender"
                    placeholder="Enter your pet gender"
                    titleStyles="text-black font-[13px]"
                    otherStyles="mt-5"
                  />
                  <View className="w-full h-fit px-4 flex-col items-center justify-center mt-6">
                    <TouchableOpacity
                      className="w-32 h-10 rounded-lg flex-row items-center justify-center bg-blue-500 mb-4"
                      onPress={pickImage}
                    >
                      <FontAwesomeIcon
                        icon={icons.faArrowUpFromBracket}
                        size={17}
                        style={{ color: "#ffffff" }}
                      />
                      <Text className="text-[13px] text-white ml-2 font-semibold">
                        Upload image
                      </Text>
                    </TouchableOpacity>
                    {imageList && <DynamicImageGrid images={imageList} />}
                  </View>
                </View>
              </ScrollView>
            </View>
          </BottomSheetModal>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default MyPet;
