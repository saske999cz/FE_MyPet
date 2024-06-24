import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash } from "../../constants";
import { router } from "expo-router";
import { Image } from "expo-image";
import FormField from "../../components/FormField";
import {
  create_product_review,
  create_doctor_review,
  create_medical_center_review,
  create_shop_review,
} from "../../api/RatingApi";
import RNPickerSelect from "react-native-picker-select";
import { useLocalSearchParams } from "expo-router";
import { useGlobalContext } from "../../state/GlobalContextProvider";
import LottieView from "lottie-react-native";

const MakeReview = () => {
  const { productId, doctorId, medicalCenterId, shopId, name, image } =
    useLocalSearchParams();
  const { setToast } = useGlobalContext();
  const [reviewData, setReviewData] = useState({
    description: "",
    rating: "",
  });
  const [error, setError] = useState({});
  const [currentProccessText, setCurrentProccessText] = useState(". . .");
  const [loadingText, setLoadingText] = useState("Creating review");
  const [isSending, setIsSending] = useState(false);
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

  const handleCreateReview = () => {
    let newErrors = {};

    if (!reviewData.rating) {
      newErrors.rating = "Rating is required";
    }

    if (!reviewData.description) {
      newErrors.description = "Review is required";
    }

    setError(newErrors);
    if (Object.keys(newErrors).length > 0) {
      alert("Please fill in all required fields");
      return;
    }
    setIsSending(true);
    startAnimation();
    if (productId) {
      create_product_review(productId, reviewData).then((res) => {
        if (res && res.status === 201) {
          stopAnimation();
          setCurrentProccessText("");
          setLoadingText("Review created successfully!");
          setTimeout(() => {
            setIsSending(false);
            setToast({
              type: "success",
              text1: "Success",
              text2: "Review created successfully!",
            });
            setLoadingText("Creating review");
            setCurrentProccessText(". . .");
            router.back();
          }, 500);
        }
      });
    } else if (doctorId) {
      create_doctor_review(doctorId, reviewData).then((res) => {
        if (res && res.status === 201) {
          stopAnimation();
          setCurrentProccessText("");
          setLoadingText("Review created successfully!");
          setTimeout(() => {
            setIsSending(false);
            setToast({
              type: "success",
              text1: "Success",
              text2: "Review created successfully!",
            });
            setLoadingText("Creating review");
            setCurrentProccessText(". . .");
            router.back();
          }, 500);
        }
      });
    } else if (shopId) {
      create_shop_review(shopId, reviewData).then((res) => {
        if (res && res.status === 201) {
          stopAnimation();
          setCurrentProccessText("");
          setLoadingText("Review created successfully!");
          setTimeout(() => {
            setIsSending(false);
            setToast({
              type: "success",
              text1: "Success",
              text2: "Review created successfully!",
            });
            setLoadingText("Creating review");
            setCurrentProccessText(". . .");
            router.back();
          }, 500);
        }
      });
    } else if (medicalCenterId) {
      create_medical_center_review(medicalCenterId, reviewData).then((res) => {
        if (res && res.status === 201) {
          stopAnimation();
          setCurrentProccessText("");
          setLoadingText("Review created successfully!");
          setTimeout(() => {
            setIsSending(false);
            setToast({
              type: "success",
              text1: "Success",
              text2: "Review created successfully!",
            });
            setLoadingText("Creating review");
            setCurrentProccessText(". . .");
            router.back();
          }, 500);
        }
      });
    } else {
      console.log("Error: No id found");
    }
  };

  return (
    <View className="h-full w-full">
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
      <View className="w-full h-12 flex-row items-center justify-center border-b-[0.5px] border-solid border-gray-300 mt-[55px]">
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
        <Text className="font-bold text-[16px]">Create Review</Text>
        <TouchableOpacity
          className="w-12 h-12 flex-row items-center justify-center absolute top-0 right-0 mr-3"
          onPress={handleCreateReview}
        >
          <Text className="text-[15px] text-amber-500 font-semibold">Post</Text>
        </TouchableOpacity>
      </View>
      <View className="w-full h-fit flex-col items-start justify-start mt-6 px-2">
        <View className="w-full h-fit flex-row items-center justify-start">
          <View className="w-20 h-20 rounded-md border-[1px] border-solid border-gray-300">
            <Image
              className="w-full h-full rounded-md"
              source={{ uri: image }}
              placeholder={{ blurhash }}
              transition={0}
            />
          </View>
          <View className="w-72 h-20 flex-col ml-2">
            <Text
              className="text-[14px]"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {doctorId ? "Dr. " + name : name}
            </Text>
            <View className="w-fit h-fit flex-row items-center justify-start mt-2">
              <RNPickerSelect
                value={reviewData.rating}
                onValueChange={(value) => {
                  setReviewData({ ...reviewData, rating: value });
                  setError({ ...error, rating: null });
                }}
                placeholder={{
                  label: "Rate",
                  value: null,
                }}
                style={{
                  placeholder: {
                    color: "#64748b",
                  },
                  inputIOS: {
                    // styles for iOS
                    width: 120,
                    height: 35,
                    borderColor: `${error.rating ? "red" : "#d1d5db"}`,
                    borderRadius: 6,
                    borderWidth: 2,
                    paddingHorizontal: 12,
                    fontSize: 13,
                  },
                  inputAndroid: {
                    width: 120,
                    height: 35,
                    borderColor: `${error.rating ? "red" : "#d1d5db"}`,
                    borderRadius: 6,
                    borderWidth: 2,
                    paddingHorizontal: 12,
                    fontSize: 13,
                  },
                }}
                items={[
                  { label: "1", value: 1 },
                  { label: "2", value: 2 },
                  { label: "3", value: 3 },
                  { label: "4", value: 4 },
                  { label: "5", value: 5 },
                ]}
              />
              <View
                className={`w-40 h-fit flex-row items-center px-2 ${
                  error.rating ? "justify-between" : "justify-start"
                }`}
              >
                <FontAwesomeIcon
                  icon={productId ? icons.faHeart : icons.faStar}
                  size={20}
                  style={{ color: productId ? "#f43f5e" : "#f59e0b" }}
                />
                {error.rating && (
                  <Text className="text-[12px] text-red-500">
                    {error.rating}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
        <View className="w-full h-fit flex-row items-start justify-start px-1">
          <FormField
            title="Review"
            placeholder="Enter your review here..."
            titleStyles="text-black font-[13px]"
            otherStyles="mt-5 w-full"
            height={40}
            error={error.description}
            handleChangeText={(e) => {
              setReviewData({ ...reviewData, description: e });
              setError({ ...error, description: null });
            }}
            value={reviewData.description}
            multiline={true}
            numberOfLines={10}
          />
        </View>
      </View>
    </View>
  );
};

export default MakeReview;
