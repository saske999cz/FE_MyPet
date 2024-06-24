import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash } from "../../constants";
import { router, useLocalSearchParams } from "expo-router";
import FormField from "../../components/FormField";
import { create_adoption_request } from "../../api/AdoptApi";
import { Image } from "expo-image";
import LottieView from "lottie-react-native";

const screenWidth = Dimensions.get("window").width;
const formWidth = screenWidth * 0.95;

const NoteScreen = ({ data, setData }) => {
  return (
    <View
      className={`h-88 w-[${formWidth}] flex-col items-center justify-start px-4 mt-4`}
    >
      <Text className="text-[17px] font-semibold">Notes</Text>

      <FormField
        title="Notes"
        placeholder="Enter notes (Optional)"
        titleStyles="text-black font-[13px]"
        otherStyles="mt-5"
        multiline={true}
        numberOfLines={5}
        height={32}
        value={data.notes}
        onChangeText={(value) => setData(value)}
      />
    </View>
  );
};

const CreateAdoptionRequest = () => {
  const { petId, petName, petImage } = useLocalSearchParams();
  const [data, setData] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loadingText, setLoadingText] = useState("Creating request");
  const [currentProccessText, setCurrentProccessText] = useState(". . .");
  const intervalRef = useRef(null);

  const handleBack = () => {
    router.back();
  };

  const startAnimation = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setCurrentProccessText((prevText) => {
          if (prevText === ". . .") return ".";
          return prevText + " .";
        });
      }, 200);
    }
  };

  const stopAnimation = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const handleCreateAppointment = () => {
    setIsSending(true);
    startAnimation();
    create_adoption_request(petId, data).then((res) => {
      if (res.status === 200) {
        stopAnimation();
        setLoadingText("Request created successfully");
        setTimeout(() => {
          setIsSending(false);
          router.replace("../(tabs)/adopt");
        }, 600);
      }
    });
  };

  return (
    <View className="flex-1 items-center">
      <View className="w-full h-12 flex-row items-center justify-center mt-[55px]">
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
        <Text className="text-[16px] font-semibold">
          Create Adoption Request
        </Text>
      </View>
      {isSending && (
        <View className="w-full h-full flex-row items-start justify-center absolute top-0 bottom-0 z-[12]">
          <View className="w-full h-full bg-zinc-900/40 opacity-100 absolute top-0 bottom-0"></View>
          <LottieView
            style={{ width: 240, height: 240, marginTop: 250 }}
            source={require("../../assets/lottie/sendingData.json")}
            autoPlay
            loop
            speed={1.5}
          />
          <View className="w-full h-fit absolute top-[440px] flex-row items-center justify-center">
            <View className="w-fit h-fit flex-row items-center justify-end">
              <Text className="text-white text-[14px] font-semibold">
                {loadingText}
              </Text>
            </View>
            {currentProccessText !== "" && (
              <View className="w-7 h-fit flex-row items-center justify-start ml-1">
                <Text className="text-white text-[14px] font-semibold ">
                  {currentProccessText}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
      <ScrollView className={`flex-1 w-full`}>
        <View
          className={`w-[${formWidth}] h-full items-center justify-center pt-5 mb-8`}
        >
          <View className="w-[95%] h-16 bg-white rounded-lg">
            <View className="w-full h-[8%] bg-amber-400 rounded-t-lg"></View>
            <View className="w-full h-[92%] flex-row items-center justify-start px-4">
              <Image
                source={{ uri: petImage }}
                className="w-12 h-12 rounded-full"
                placeholder={{ blurhash }}
                transition={0}
              />
              <Text className="text-[15px] font-semibold text-black ml-2">
                {petName}
              </Text>
            </View>
          </View>
          <View className="w-[95%] h-fit bg-white rounded-lg mt-2 flex-col items-center justify-start">
            <NoteScreen data={data} setData={setData} />
            <View
              className={`w-full h-16 flex-row items-center justify-center px-4 mb-2 mt-6`}
            >
              <TouchableOpacity
                className="w-28 h-10 rounded-md bg-amber-400 flex-row items-center justify-center ml-4"
                onPress={handleCreateAppointment}
              >
                <Text className="text-[14px] font-semibold text-white">
                  Create
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateAdoptionRequest;
