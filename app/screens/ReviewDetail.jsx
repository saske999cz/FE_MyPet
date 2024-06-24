import { View, Text, TouchableOpacity, Modal } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash } from "../../constants";
import { router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import {
  get_my_doctor_review_detail,
  get_my_product_review_detail,
  get_my_medical_center_review_detail,
  get_my_shop_review_detail,
  update_doctor_review,
  update_product_review,
  update_medical_center_review,
  update_shop_review,
  delete_doctor_review,
  delete_product_review,
  delete_medical_center_review,
  delete_shop_review,
} from "../../api/RatingApi";
import RNPickerSelect from "react-native-picker-select";
import { useGlobalContext } from "../../state/GlobalContextProvider";
import LottieView from "lottie-react-native";
import FormField from "../../components/FormField";

const ReviewDetail = () => {
  const { doctorId, productId, medicalCenterId, shopId, image, name, type } =
    useLocalSearchParams();
  const { setToast } = useGlobalContext();
  const [reviewData, setReviewData] = useState({
    description: "",
    rating: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState({});
  const [currentProccessText, setCurrentProccessText] = useState(". . .");
  const [loadingText, setLoadingText] = useState("Updating review");
  const [isSending, setIsSending] = useState(false);
  const intervalRef = useRef(null);
  const [ratingId, setRatingId] = useState(null);
  const [reply, setReply] = useState("");

  const handleBack = () => {
    router.back();
  };

  const handleOpenOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
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

  const handleEditReview = () => {
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
      update_product_review(ratingId, reviewData).then((res) => {
        if (res && res.status === 200) {
          stopAnimation();
          setCurrentProccessText("");
          setLoadingText("Review updated successfully!");
          setTimeout(() => {
            setIsSending(false);
            setToast({
              type: "success",
              text1: "Success",
              text2: "Review updated successfully!",
            });
            setLoadingText("Upadting review");
            setCurrentProccessText(". . .");
            router.back();
          }, 500);
        }
      });
    } else if (doctorId) {
      update_doctor_review(ratingId, reviewData).then((res) => {
        if (res && res.status === 200) {
          stopAnimation();
          setCurrentProccessText("");
          setLoadingText("Review updated successfully!");
          setTimeout(() => {
            setIsSending(false);
            setToast({
              type: "success",
              text1: "Success",
              text2: "Review updated successfully!",
            });
            setLoadingText("Creating review");
            setCurrentProccessText(". . .");
            router.back();
          }, 500);
        }
      });
    } else if (shopId) {
      update_shop_review(ratingId, reviewData).then((res) => {
        if (res && res.status === 200) {
          stopAnimation();
          setCurrentProccessText("");
          setLoadingText("Review updated successfully!");
          setTimeout(() => {
            setIsSending(false);
            setToast({
              type: "success",
              text1: "Success",
              text2: "Review updated successfully!",
            });
            setLoadingText("Creating review");
            setCurrentProccessText(". . .");
            router.back();
          }, 500);
        }
      });
    } else if (medicalCenterId) {
      update_medical_center_review(ratingId, reviewData).then((res) => {
        if (res && res.status === 200) {
          stopAnimation();
          setCurrentProccessText("");
          setLoadingText("Review updated successfully!");
          setTimeout(() => {
            setIsSending(false);
            setToast({
              type: "success",
              text1: "Success",
              text2: "Review updated successfully!",
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

  const handleDeleteReview = () => {
    if (productId) {
      delete_product_review(ratingId).then((res) => {
        if (res && res.status === 200) {
          setShowModal(false);
          setToast({
            type: "success",
            text1: "Success",
            text2: "Review deleted successfully!",
          });
          router.back();
        }
      });
    } else if (doctorId) {
      delete_doctor_review(ratingId).then((res) => {
        if (res && res.status === 200) {
          setShowModal(false);
          setToast({
            type: "success",
            text1: "Success",
            text2: "Review deleted successfully!",
          });
          router.back();
        }
      });
    } else if (shopId) {
      delete_shop_review(ratingId).then((res) => {
        if (res && res.status === 200) {
          setShowModal(false);
          setToast({
            type: "success",
            text1: "Success",
            text2: "Review deleted successfully!",
          });
          router.back();
        }
      });
    } else if (medicalCenterId) {
      delete_medical_center_review(ratingId).then((res) => {
        if (res && res.status === 200) {
          setShowModal(false);
          setToast({
            type: "success",
            text1: "Success",
            text2: "Review deleted successfully!",
          });
          router.back();
        }
      });
    } else {
      console.log("Error: No Id found");
    }
  };

  useEffect(() => {
    if (productId) {
      get_my_product_review_detail(productId).then((res) => {
        if (res && res.status === 200) {
          setReviewData({
            rating: res.data.data.rating,
            description: res.data.data.rating_description,
          });
          if (type) setReply(res.data.data.reply);
          setRatingId(res.data.data.rating_id);
          setIsLoading(false);
        }
      });
    }
    if (doctorId) {
      get_my_doctor_review_detail(doctorId).then((res) => {
        if (res && res.status === 200) {
          setReviewData({
            rating: res.data.data.rating,
            description: res.data.data.rating_description,
          });
          if (type) setReply(res.data.data.reply);
          setRatingId(res.data.data.rating_id);
          setIsLoading(false);
        }
      });
    }
    if (medicalCenterId) {
      get_my_medical_center_review_detail(medicalCenterId).then((res) => {
        if (res && res.status === 200) {
          setReviewData({
            rating: res.data.data.rating,
            description: res.data.data.rating_description,
          });
          if (type) setReply(res.data.data.reply);
          setRatingId(res.data.data.rating_id);
          setIsLoading(false);
        }
      });
    }
    if (shopId) {
      get_my_shop_review_detail(shopId).then((res) => {
        if (res && res.status === 200) {
          setReviewData({
            rating: res.data.data.rating,
            description: res.data.data.rating_description,
          });
          if (type) setReply(res.data.data.reply);
          setRatingId(res.data.data.rating_id);
          setIsLoading(false);
        }
      });
    }
  }, []);

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
        <Text className="font-bold text-[16px]">Review Detail</Text>
        <TouchableOpacity
          className="w-[25px] h-[25px] flex-row items-center justify-center absolute top-0 right-0 mr-5 mt-[12px] rounded-full"
          onPress={handleOpenOptions}
        >
          <FontAwesomeIcon
            icon={icons.faGear}
            size={20}
            style={{ color: "#f59e0b" }}
          />
        </TouchableOpacity>
        {isOptionsOpen && (
          <View className="w-28 h-20 flex-col items-start justify-start bg-white rounded-md absolute right-0 top-0 mt-8 mr-4">
            <TouchableOpacity
              className="w-full h-6 flex-row items-center justify-start mt-2 px-6"
              onPress={() => {
                setIsEditable(true);
                setIsOptionsOpen(false);
              }}
            >
              <Text className="text-[13px] font-semibold mr-2">Edit</Text>
              <FontAwesomeIcon
                icon={icons.faPen}
                size={14}
                style={{ color: "#000000" }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-full h-6 flex-row items-center justify-start mt-2 px-6"
              onPress={() => {
                setShowModal(true);
                setIsOptionsOpen(false);
              }}
            >
              <Text className="text-[13px] font-semibold text-red-500 mr-2">
                Delete
              </Text>
              <FontAwesomeIcon
                icon={icons.faTrashCan}
                size={14}
                style={{ color: "#ef4444" }}
              />
            </TouchableOpacity>
          </View>
        )}
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
      ) : isEditable === false ? (
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
              <Text className="text-[14px]">
                {doctorId ? "Dr. " + name : name}
              </Text>
              <View className="w-fit h-fit flex-row items-center justify-start mt-2">
                <Text className="text-[14px]">{reviewData.rating}</Text>
                <View
                  className={`w-32 h-fit flex-row items-center px-2 justify-start`}
                >
                  <FontAwesomeIcon
                    icon={productId ? icons.faHeart : icons.faStar}
                    size={16}
                    style={{ color: productId ? "#f43f5e" : "#f59e0b" }}
                  />
                </View>
              </View>
            </View>
          </View>
          <View className="w-full h-fit flex-col items-start justify-start px-1 mt-4">
            <Text className="text-[13px]">{reviewData.description}</Text>
            {reply && (
              <View className="w-full h-fit mt-8 flex-col items-start justify-start">
                <Text className="text-[13px] font-semibold mb-2">
                  Reply from{" "}
                  {productId || shopId
                    ? "shop:"
                    : doctorId
                    ? "doctor:"
                    : "medical center:"}
                </Text>
                <Text className="text-[13px]">{reply}</Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        <View className="w-full h-fit flex-col items-start justify-start mt-6 px-2 z-1">
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
          <View className="w-full h-fit flex-row items-center justify-center mt-12">
            <TouchableOpacity
              className="w-28 h-10 rounded-md bg-amber-500 flex-row items-center justify-center"
              onPress={handleEditReview}
            >
              <Text className="text-[13px] font-semibold text-white">
                Update
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <Modal visible={showModal} animationType="fade" transparent={true}>
        <View className="flex-1 bg-zinc-900/40 opacity-[50] h-full w-full flex-row items-center justify-center">
          <View className="w-56 flex-col h-24 items-center justify-center bg-white rounded-md">
            <View className="w-full h-[45%] flex-row items-center justify-center px-2">
              <Text className="text-[13px] text-gray-600 font-medium">
                Are you sure you want to delete this review?
              </Text>
            </View>
            <View className="w-full h-[45%] flex-row items-center justify-center mt-2 border-t-[1px] border-solid border-gray-300">
              <TouchableOpacity
                className="w-[50%] h-full bg-white flex-row items-center justify-center border-r-[1px] border-solid border-gray-300 rounded-bl-md"
                onPress={() => setShowModal(false)}
              >
                <Text className="text-black text-[13px] font-medium">No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="w-[50%] h-full bg-white flex-row items-center justify-center rounded-br-md"
                onPress={handleDeleteReview}
              >
                <Text className="text-[#f59e0b] text-[13px] font-medium">
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ReviewDetail;
