import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash, images } from "../../constants";
import { router } from "expo-router";
import {
  PetVaccinationHistoryDummy,
  PetMedicalHistoryDummy,
} from "../../dummy/FakeData";
import { useLocalSearchParams } from "expo-router";
import { get_pet_detail_by_id } from "../../api/PetApi";
import { Image } from "expo-image";
import LottieView from "lottie-react-native";

const MyPetDetail = () => {
  const { id, name, age, gender, breed, image } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [vaccinationHistory, setVaccinationHistory] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [fullVaccinationHistory, setFullVaccinationHistory] = useState([]);
  const [fullMedicalHistory, setFullMedicalHistory] = useState([]);
  const [showFullVaccinationHistory, setShowFullVaccinationHistory] =
    useState(false);
  const [showFullMedicalHistory, setShowFullMedicalHistory] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setImageUrl(image.replace("/pets/", "/pets%2F"));
    const fetchPetDetail = async () => {
      try {
        get_pet_detail_by_id(id).then((res) => {
          if (res && res.status === 200) {
            setFullVaccinationHistory(res.data.data.vaccine_history);
            setFullMedicalHistory(res.data.data.diagnosis_history);
            setVaccinationHistory(res.data.data.vaccine_history.slice(0, 3));
            setMedicalHistory(res.data.data.diagnosis_history.slice(0, 3));
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error("Error fetching pet detail:", error);
        setIsLoading(false);
      }
    };
    fetchPetDetail();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // fetch data
    setRefreshing(false);
  };
  const handleBack = () => {
    router.back();
  };

  const handleEditPetInfo = () => {
    closeBottomSheet();
  };

  const handleShowFullVaccinationHistory = () => {
    if (showFullVaccinationHistory) {
      setVaccinationHistory(fullVaccinationHistory.slice(0, 3));
      setShowFullVaccinationHistory(false);
    } else {
      setVaccinationHistory(fullVaccinationHistory);
      setShowFullVaccinationHistory(true);
    }
  };
  const handleShowFullMedicalHistory = () => {
    if (showFullMedicalHistory) {
      setMedicalHistory(fullMedicalHistory.slice(0, 3));
      setShowFullMedicalHistory(false);
    } else {
      setMedicalHistory(fullMedicalHistory);
      setShowFullMedicalHistory(true);
    }
  };

  const handleMedicalDetailNavigation = (item) => {
    router.push({
      pathname: "../screens/MedicalDetail",
      params: {
        date: item.created_at,
        reason: item.reason,
        diagnosis: item.diagnosis,
        treatment: item.treatment,
        notes: item.note,
      },
    });
  };

  const handleVaccinationDetailNavigation = (item) => {
    router.push({
      pathname: "../screens/VaccinationDetail",
      params: {
        date: item.created_at,
        vaccine: item.vaccine,
        note: item.note,
      },
    });
  };

  const formatDate = useMemo(
    () => (dateString) => {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    },
    []
  );

  return (
    <View className="h-full w-full">
      <View className="w-full h-12 flex-row items-center justify-center mt-12">
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
      {isLoading ? (
        <View className="w-full h-full flex-row items-start justify-center">
          <LottieView
            style={{ width: 130, height: 130, marginTop: 150 }}
            source={require("../../assets/lottie/loading.json")}
            autoPlay
            loop
            speed={2}
          />
        </View>
      ) : (
        <ScrollView>
          <View className="w-full h-fit">
            <View className="w-full h-[1px] bg-gray-200"></View>
            <View className="w-full h-44">
              <ImageBackground
                source={images.simple_background}
                className="w-full h-full object-center"
                resizeMode="cover"
              />
              <View className="w-40 h-40 rounded-full border-4 border-solid border-[#F2F2F2] absolute bottom-0 left-0 ml-3 -mb-9 flex-1 items-center justify-center">
                <Image
                  source={{ uri: imageUrl }}
                  className="w-full h-full rounded-full"
                  placeholder={{ blurhash }}
                  transition={0}
                />
              </View>
            </View>
            <View className="w-full h-12 flex-row items-center justify-start px-4 mt-9">
              <Text className="text-[20px] font-bold">{name}</Text>
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
                  <Text className="text-[15px]">
                    {gender === "male" ? "Male" : "Female"}
                  </Text>
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
                  <Text className="font-semibold text-[15px]">{breed}</Text>
                </View>
              </View>
              <View className="flex-row items-center justify-center mt-2">
                <FontAwesomeIcon
                  icon={icons.faCakeCandles}
                  size={15}
                  style={{ color: "#000000" }}
                />
                <View className="flex-row items-center justify-center ml-1">
                  <Text>Age </Text>
                  <Text>{age}</Text>
                </View>
              </View>
              <View className="w-full h-[1px] bg-gray-300 mt-4 px-4"></View>
            </View>
            <View className="mt-2 px-4">
              <Text className="font-semibold text-[16px] mb-4">
                Vaccination History
              </Text>
              {vaccinationHistory.length > 0 ? (
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
                      key={item.vaccine_history_id}
                      onPress={() => handleVaccinationDetailNavigation(item)}
                    >
                      <Text className="w-1/3 text-base text-center text-[13px]">
                        {item.vaccine}
                      </Text>
                      <Text className="w-1/3 text-base text-center text-[13px]">
                        {item.created_at}
                      </Text>
                      <Text
                        className="w-1/3 text-base text-center text-[13px]"
                        numberOfLines={3}
                        ellipsizeMode="tail"
                      >
                        {item.note}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View className="w-full h-fit flex-row items-center justify-center">
                  <Text className="text-[14px] ">
                    No vaccination history records
                  </Text>
                </View>
              )}
              {vaccinationHistory.length > 1 && (
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
              )}
              <View className="w-full h-[1px] bg-gray-300 mt-4 px-4"></View>
            </View>
            <View className="flex-col items-start justify-start mt-2 px-4">
              <Text className="font-semibold text-[16px] mb-2">
                Medical History
              </Text>
              {medicalHistory.length > 0 ? (
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
                        key={item.id}
                        onPress={() => handleMedicalDetailNavigation(item)}
                      >
                        <Text
                          className="w-1/4 text-base text-center text-[13px]"
                          numberOfLines={3}
                          ellipsizeMode="tail"
                        >
                          {formatDate(item.created_at)}
                        </Text>
                        <Text
                          className="w-1/4 text-base text-center text-[13px]"
                          numberOfLines={3}
                          ellipsizeMode="tail"
                        >
                          {item.reason}
                        </Text>
                        <Text
                          className="w-1/4 text-base text-center text-[13px]"
                          numberOfLines={3}
                          ellipsizeMode="tail"
                        >
                          {item.diagnosis}
                        </Text>
                        <Text
                          className="w-1/4 text-base text-center text-[13px]"
                          numberOfLines={3}
                          ellipsizeMode="tail"
                        >
                          {item.treatment}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {medicalHistory.length > 1 && (
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
                  )}
                </View>
              ) : (
                <View className="w-full h-fit flex-row items-center justify-center">
                  <Text className="text-[14px] font-semibold">
                    No medical history records
                  </Text>
                </View>
              )}
              <View className="w-full h-[1px] bg-gray-300 mt-4 px-4"></View>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default MyPetDetail;
