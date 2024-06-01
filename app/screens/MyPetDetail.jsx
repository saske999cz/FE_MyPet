import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  RefreshControl,
} from "react-native";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { images } from "../../constants";
import { router } from "expo-router";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import {
  PetVaccinationHistoryDummy,
  PetMedicalHistoryDummy,
} from "../../dummy/FakeData";
import { useLocalSearchParams } from "expo-router";

const MyPetDetail = () => {
  const { id, name, age, gender } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const bottomSheetModalRef = useRef(null);
  const [vaccinationHistory, setVaccinationHistory] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [showFullVaccinationHistory, setShowFullVaccinationHistory] =
    useState(false);
  const [showFullMedicalHistory, setShowFullMedicalHistory] = useState(false);

  useEffect(() => {
    setVaccinationHistory(PetVaccinationHistoryDummy.slice(0, 3));
    setMedicalHistory(PetMedicalHistoryDummy.slice(0, 3));
  }, []);
  const snapPoints = ["90%"];

  const onRefresh = async () => {
    setRefreshing(true);
    // fetch data
    setRefreshing(false);
  };
  const handleBack = () => {
    router.back();
  };

  const openBottomSheet = () => {
    bottomSheetModalRef.current.present();
  };

  const closeBottomSheet = () => {
    bottomSheetModalRef.current.dismiss();
  };

  const handleEditPetInfo = () => {
    closeBottomSheet();
  };

  const handleOpenEditSheet = () => {
    openBottomSheet();
  };
  const handleShowFullVaccinationHistory = () => {
    if (showFullVaccinationHistory) {
      setVaccinationHistory(PetVaccinationHistoryDummy.slice(0, 3));
      setShowFullVaccinationHistory(false);
    } else {
      setVaccinationHistory(PetVaccinationHistoryDummy);
      setShowFullVaccinationHistory(true);
    }
  };
  const handleShowFullMedicalHistory = () => {
    if (showFullMedicalHistory) {
      setMedicalHistory(PetMedicalHistoryDummy.slice(0, 3));
      setShowFullMedicalHistory(false);
    } else {
      setMedicalHistory(PetMedicalHistoryDummy);
      setShowFullMedicalHistory(true);
    }
  };

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

  const handleMedicalDetailNavigation = () => {
    router.push("../screens/MedicalDetail");
  };

  const handleVaccinationDetailNavigation = () => {
    router.push("../screens/VaccinationDetail");
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaView className="h-full w-full">
          <View className="w-full h-12 flex-row items-center justify-center">
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
            <Text className="text-[16px] font-bold">{name}</Text>
          </View>
          <ScrollView>
            <View className="w-full h-fit">
              <View className="w-full h-[1px] bg-gray-200"></View>
              <View className="w-full h-44">
                <ImageBackground
                  source={images.adopt2}
                  className="w-full h-full object-center"
                  resizeMode="cover"
                />
                <View className="w-8 h-8 rounded-full flex-1 items-center justify-center bg-gray-300 absolute bottom-0 right-0 mr-2 mb-2 border-[1px] border-solid border-[#F2F2F2]">
                  <FontAwesomeIcon
                    icon={icons.faCamera}
                    size={16}
                    style={{ color: "#000000" }}
                  />
                </View>
              </View>
              <View className="w-full h-12 flex-row items-center justify-start px-4 mt-3">
                <Text className="text-[20px] font-bold">{name}</Text>
              </View>
              <View className="w-full h-9 flex-row items-center justify-start">
                <TouchableOpacity
                  className="w-32 h-9 flex-row items-center justify-center bg-amber-500 rounded-md ml-4"
                  onPress={handleOpenEditSheet}
                >
                  <FontAwesomeIcon
                    icon={icons.faPen}
                    size={12}
                    style={{ color: "#ffffff" }}
                  />
                  <Text className="text-[15px] font-semibold ml-2 text-white">
                    Edit info
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="w-full h-[2px] bg-gray-300 mt-4"></View>
              <View className="flex-col items-start justify-start mt-2 px-4">
                <Text className="font-semibold text-[16px]">Details</Text>
                <View className="flex-row items-center justify-center mt-3">
                  <FontAwesomeIcon
                    icon={icons.faVenusMars}
                    size={16}
                    style={{ color: "#000000" }}
                  />
                  <View className="flex-row items-center justify-center ml-1">
                    <Text className="text-[15px]">{gender}</Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-center mt-2">
                  <FontAwesomeIcon
                    icon={icons.faPaw}
                    size={16}
                    style={{ color: "#000000" }}
                  />
                  <View className="flex-row items-center justify-center ml-1">
                    <Text>Type of breed </Text>
                    <Text className="font-semibold text-[15px]">Husky</Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-center mt-2">
                  <View className="flex-row items-center justify-center ml-1">
                    <Text>{age}</Text>
                  </View>
                </View>
                <View className="w-full h-[1px] bg-gray-300 mt-4 px-4"></View>
              </View>
              <View className="mt-2 px-4">
                <Text className="font-semibold text-[16px] mb-4">
                  Vaccination History
                </Text>
                <View className="border border-gray-300 rounded-lg">
                  <View className="flex flex-row bg-gray-200 p-2 rounded-t-lg">
                    <Text className="w-1/3 text-base font-semibold text-center text-[13px]">
                      Vaccine
                    </Text>
                    <Text className="w-1/3 text-base font-semibold text-center text-[13px]">
                      Date
                    </Text>
                    <Text className="w-1/3 text-base font-semibold text-center text-[13px]">
                      Notes
                    </Text>
                  </View>
                  {vaccinationHistory.map((item, index) => (
                    <TouchableOpacity
                      className={`flex flex-row border-b border-gray-300 p-2 ${
                        index === PetVaccinationHistoryDummy.length - 1
                          ? "rounded-b-lg"
                          : ""
                      }`}
                      key={index}
                      onPress={handleVaccinationDetailNavigation}
                    >
                      <Text className="w-1/3 text-base text-center text-[13px]">
                        {item.vaccine}
                      </Text>
                      <Text className="w-1/3 text-base text-center text-[13px]">
                        {item.date}
                      </Text>
                      <Text className="w-1/3 text-base text-center text-[13px]">
                        {item.notes}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View className="w-full h-fit mt-4 mb-1 flex-row items-center justify-center">
                  <TouchableOpacity
                    className="w-40 h-10 rounded-md bg-gray-300 flex-row items-center justify-center"
                    onPress={handleShowFullVaccinationHistory}
                  >
                    <Text className="font-semibold text-[13px]">
                      {showFullVaccinationHistory === false
                        ? "Show all"
                        : "Show less"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="w-full h-[1px] bg-gray-300 mt-4 px-4"></View>
              </View>
              <View className="flex-col items-start justify-start mt-2 px-4">
                <Text className="font-semibold text-[16px] mb-2">
                  Medical History
                </Text>
                <View className="w-full h-fit mt-3 flex-col items-center justify-start">
                  <View className="border border-gray-300 rounded-lg">
                    <View className="flex flex-row bg-gray-200 p-2 rounded-t-lg">
                      <Text className="w-1/4 text-base font-semibold text-center text-[13px]">
                        Date
                      </Text>
                      <Text className="w-1/4 text-base font-semibold text-center text-[13px]">
                        Reason
                      </Text>
                      <Text className="w-1/4 text-base font-semibold text-center text-[13px]">
                        Diagnosis
                      </Text>
                      <Text className="w-1/4 text-base font-semibold text-center text-[13px]">
                        Treatment
                      </Text>
                    </View>
                    {medicalHistory.map((item, index) => (
                      <TouchableOpacity
                        className={`flex flex-row border-b border-gray-300 p-2 ${
                          index === PetMedicalHistoryDummy.length - 1
                            ? "rounded-b-lg"
                            : ""
                        }`}
                        key={index}
                        onPress={handleMedicalDetailNavigation}
                      >
                        <Text className="w-1/4 text-base text-center text-[13px]">
                          {item.date}
                        </Text>
                        <Text className="w-1/4 text-base text-center text-[13px]">
                          {item.reason}
                        </Text>
                        <Text className="w-1/4 text-base text-center text-[13px]">
                          {item.diagnosis}
                        </Text>
                        <Text className="w-1/4 text-base text-center text-[13px]">
                          {item.treatment}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View className="w-full h-fit mt-4 mb-1 flex-row items-center justify-center">
                    <TouchableOpacity
                      className="w-40 h-10 rounded-md bg-gray-300 flex-row items-center justify-center"
                      onPress={handleShowFullMedicalHistory}
                    >
                      <Text className="font-semibold text-[13px]">
                        {showFullMedicalHistory === false
                          ? "Show all"
                          : "Show less"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View className="w-full h-[1px] bg-gray-300 mt-4 px-4"></View>
              </View>
            </View>
          </ScrollView>
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
              <View className="w-[90%] h-40 flex-col items-start justify-start px-6 bg-white border-solid border-[0.5px] border-gray-200 rounded-lg">
                <TouchableOpacity
                  className="w-full h-12 flex-row items-center justify-start mt-2"
                  onPress={handleEditPetInfo}
                >
                  <FontAwesomeIcon
                    icon={icons.faPen}
                    size={18}
                    style={{ color: "#000000" }}
                  />
                  <Text className="text-[14px] font-semibold ml-3">
                    Edit Pet Info
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="w-full h-12 flex-row items-center justify-start mt-2">
                  <FontAwesomeIcon
                    icon={icons.faTrashCan}
                    size={18}
                    style={{ color: "#000000" }}
                  />
                  <Text className="text-[14px] font-semibold ml-3">
                    Delete Post
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheetModal>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default MyPetDetail;
