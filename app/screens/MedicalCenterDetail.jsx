import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash } from "../../constants";
import { router, useLocalSearchParams } from "expo-router";
import MedicalCenterCard from "../../components/MedicalCenterCard";
import DoctorCard from "../../components/DoctorCard";
import { FIREBASE_STORAGE } from "../../firebaseConfig";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import { ProductDetailLoader } from "../../components/CustomLoader";
import { Image } from "expo-image";
import {
  get_medical_center_detail_by_id,
  get_highest_rating_medical_centers,
} from "../../api/MedicalCenterApi";
import { get_medical_center_reviews } from "../../api/RatingApi";
import Review from "../../components/Review";

function calculateAge(birthday) {
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

const MedicalCenterDetail = () => {
  const {
    medicalCenterId,
    medicalCenterName,
    medicalCenterRating,
    medicalCenterDistance,
    medicalCenterWorkingHours,
    medicalCenterTelephone,
    medicalCenterImage,
    medicalCenterDescription,
    medicalCenterAddress,
  } = useLocalSearchParams();
  const [mainImage, setMainImage] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(1);
  const [clinicDetail, setClinicDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [folderUrl, setFolderUrl] = useState(null);
  const [similarClinics, setSimilarClinics] = useState(null);
  const [flags, setFlags] = useState([]);
  const [doctors, setDoctors] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);

  const handleBack = () => {
    router.back();
  };

  const handleReviewPress = () => {
    router.push({
      pathname: "../screens/AllMedicalCenterReviews",
      params: {
        medicalCenterId: medicalCenterId,
        totalReviews: totalReviews,
      },
    });
  };

  const handleProductImagePress = (image) => {
    setMainImage(image);
    setCurrentImageIndex(imageUrls.indexOf(image) + 1);
  };

  const handleCreateAppointment = () => {
    router.push({
      pathname: "../screens/CreateAppointment",
      params: {
        medicalCenterId: medicalCenterId,
        medicalCenterName: medicalCenterName,
        medicalCenterTelephone: medicalCenterTelephone,
        medicalCenterWorkingHours: medicalCenterWorkingHours,
        medicalCenterImage: imageUrls[0],
      },
    });
  };

  const handleSimilarClinicsPress = () => {
    router.push({
      pathname: "../screens/SimilarClinics",
      params: {
        medicalCenterId: medicalCenterId,
      },
    });
  };

  const handleOpenMap = () => {
    router.push({
      pathname: "../screens/CustomMap",
      params: {
        medicalCenterAddress: medicalCenterAddress,
        medicalCenterName: medicalCenterName,
        image: encodeURIComponent(mainImage),
      },
    });
  };

  useEffect(() => {
    const encodedClinicAvatar = medicalCenterImage.replace(
      "/medical_center/",
      "%2Fmedical_center%2F"
    );
    setMainImage(encodedClinicAvatar);
    setImageUrls([encodedClinicAvatar]);
    const fetchMedicalCenterDetail = async () => {
      try {
        get_medical_center_detail_by_id(medicalCenterId).then((res) => {
          if (res && res.status === 200) {
            setClinicDetail(res.data.data);
            setFolderUrl(res.data.data.image);
            setDoctors(res.data.data.doctors);
            setFlags((prev) => [...prev, true]);
          }
        });
      } catch (error) {
        console.error("Error fetching clinic detail:", error);
      }
    };

    const fetchSimilarClinics = async () => {
      try {
        get_highest_rating_medical_centers(1, 10).then((res) => {
          if (res && res.status === 200) {
            const fetchedClinics = res.data.data;
            const uniqueClinics = fetchedClinics.filter(
              (clinic) => clinic.medical_center_id != medicalCenterId
            );
            setSimilarClinics(uniqueClinics);
            setFlags((prev) => [...prev, true]);
          }
        });
      } catch (error) {
        console.error("Error fetching similar clinics:", error);
      }
    };

    fetchMedicalCenterDetail();
    fetchSimilarClinics();
  }, []);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        if (folderUrl) {
          const imageFolderRef = ref(FIREBASE_STORAGE, folderUrl);
          const res = await listAll(imageFolderRef);
          if (res.items.length > 0) {
            Promise.all(res.items.map((item) => getDownloadURL(item)))
              .then((urls) => {
                const combinedUrls = [...imageUrls, ...urls];
                const uniqueUrls = [...new Set(combinedUrls)];
                setImageUrls(uniqueUrls);
                setFlags((prev) => [...prev, true]);
              })
              .catch((error) => console.error(error));
          }
        }
      } catch (error) {
        console.error("Error fetching product detail image:", error);
      }
    };

    fetchImage();
  }, [folderUrl]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        get_medical_center_reviews(medicalCenterId, 1, 5).then((res) => {
          if (res && res.status === 200) {
            setReviews(res.data.data);
            setTotalReviews(res.data.total_ratings);
            setFlags((prev) => [...prev, true]);
          }
        });
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    if (flags.length === 4 && flags.every((flag) => flag === true)) {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, [flags]);

  return (
    <View className="h-full">
      <View className="w-full h-10 flex-row items-center justify-center mb-2 mt-[55px] border-b-[0.5px] border-solid border-gray-200">
        <TouchableOpacity
          className="w-12 h-10 flex-row items-center justify-center absolute top-0 left-0"
          onPress={handleBack}
        >
          <FontAwesomeIcon
            icon={icons.faArrowLeftLong}
            size={20}
            style={{ color: "#f59e0b" }}
          />
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <ProductDetailLoader />
      ) : imageUrls && imageUrls.length > 0 && mainImage ? (
        <ScrollView>
          <View className="flex-col items-center justify-start">
            <Image
              source={{ uri: mainImage }}
              className="w-full h-60"
              contentFit="contain"
              style={{ aspectRatio: 16 / 9 }}
              placeholder={{ blurhash }}
              transition={0}
            />
            <View className="w-10 h-5 flex-row items-center justify-center bg-white rounded-full border-[0.5px] border-solid border-gray-300 mt-3 mb-2">
              <Text className="text-[12px] text-gray-700">
                {currentImageIndex}/{imageUrls.length}
              </Text>
            </View>
            <View className="w-full h-fit flex-row items-center justify-start px-3">
              {imageUrls && (
                <FlatList
                  data={imageUrls}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className="w-10 h-10 bg-white rounded-[3px] mx-1 mt-1 border-[0.5px] border-solid border-gray-300"
                      onPress={() => handleProductImagePress(item)}
                    >
                      <Image
                        source={{ uri: item }}
                        className="w-full h-full rounded-[3px]"
                        placeholder={{ blurhash }}
                        transition={0}
                      />
                    </TouchableOpacity>
                  )}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ padding: 4 }}
                  estimatedItemSize={20}
                />
              )}
            </View>
            <View className="w-full h-32 flex-row items-center justify-between mb-2">
              <View className="w-full h-full flex-col items-center justify-center px-4">
                <View className="w-full flex-row items-center justify-start">
                  <Text className="text-[18px] font-semibold mt-4">
                    {medicalCenterName}
                  </Text>
                </View>
                <View className="w-full flex-row items-center justify-start mb-2 mt-2">
                  <FontAwesomeIcon
                    icon={icons.faClock}
                    size={11}
                    style={{ color: "#4b5563" }}
                  />
                  <View className="flex-row items-center justify-start">
                    <Text className="text-[10px] text-[#16a34a] font-semibold ml-1">
                      Open
                    </Text>
                    <Text className="text-[10px] ml-1">
                      {medicalCenterWorkingHours}
                    </Text>
                  </View>
                </View>
                <View className="flex-row w-full items-center justify-start mb-2">
                  <View className="rounded-[3px] bg-amber-100 flex-row items-center justiify-center px-[3px] py-[2px] border-[1px] border-solid border-amber-400">
                    <FontAwesomeIcon
                      icon={icons.faStar}
                      size={10}
                      style={{ color: "#f59e0b" }}
                    />
                    <Text className="text-[10px] ml-1">
                      {parseFloat(medicalCenterRating).toFixed(1)}
                    </Text>
                  </View>

                  <View className="w-[1px] h-3 bg-gray-300 ml-2"></View>
                  <View className="w-fit flex-row items-center justify-start ml-2">
                    <FontAwesomeIcon
                      icon={icons.faLocationDot}
                      size={10}
                      style={{ color: "#ef4444" }}
                    />
                    <Text
                      className="text-[10px] ml-[1px]"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {medicalCenterAddress}
                    </Text>
                  </View>
                  <TouchableOpacity
                    className="w-[60px] h-fit flex-row items-center justify-center ml-3"
                    onPress={handleOpenMap}
                  >
                    <Text className="text-[11px] text-blue-500 font-semibold">
                      Open map
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="w-full flex-row items-center justify-start">
                  <FontAwesomeIcon
                    icon={icons.faPhone}
                    size={10}
                    style={{ color: "#3b82f6" }}
                  />
                  <Text className="ml-1 text-[10px]">
                    Tel: {medicalCenterTelephone}
                  </Text>
                </View>
              </View>
            </View>

            <View className="w-full h-[1px] bg-gray-300"></View>
            <View className="w-full h-fit px-4 mt-4">
              <Text className="text-[14px] font-semibold mb-2">
                Description
              </Text>
              <Text className="text-[13px] text-gray-800">
                {medicalCenterDescription}
              </Text>
            </View>
            <View className="w-full h-[4px] bg-gray-300 mt-5"></View>
            {reviews && (
              <View className="w-full h-fit">
                <View className="w-full h-12 mt-2 flex-row items-center justify-between px-4">
                  <Text className="font-semibold text-[14px]">{`Reviews (${totalReviews})`}</Text>
                  {reviews.length >= 3 && (
                    <TouchableOpacity
                      className="w-16 h-10 flex-row items-center justify-center"
                      onPress={handleReviewPress}
                    >
                      <Text className="text-[14px] text-[#f59e0b] mr-1">
                        See all
                      </Text>
                      <FontAwesomeIcon
                        icon={icons.faChevronRight}
                        size={12}
                        style={{ color: "#f59e0b" }}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                <View className="w-full h-fit">
                  {reviews.slice(0, 2).map((review) => (
                    <Review
                      key={review.rating_id}
                      avatar={review.customer_avatar}
                      username={review.customer_username}
                      rating={review.rating_score}
                      review={review.description}
                      type="medical_center"
                    />
                  ))}
                </View>
                {reviews.length >= 3 ? (
                  <TouchableOpacity
                    className="w-full h-10 flex-row items-center justify-center mt-1"
                    onPress={handleReviewPress}
                  >
                    <Text className="text-[14px] text-[#f59e0b] mr-1">
                      See all
                    </Text>
                    <FontAwesomeIcon
                      icon={icons.faChevronRight}
                      size={12}
                      style={{ color: "#f59e0b" }}
                    />
                  </TouchableOpacity>
                ) : (
                  <View className="w-full h-6 flex-row items-center justify-center mt-4">
                    <Text className="text-[13px]">No more reviews to show</Text>
                  </View>
                )}
              </View>
            )}
            <View className="w-full h-[4px] bg-gray-300 mt-5"></View>
            <View className="w-full px-4 mt-4">
              <View className="w-full flex-col items-start justify-start">
                <Text className="text-[14px] font-semibold">Doctors</Text>
                <View className="w-full flex-row items-start justify-start">
                  <FlatList
                    data={doctors}
                    keyExtractor={(item) => item.doctor_id}
                    renderItem={({ item }) => (
                      <View className="ml-2">
                        <DoctorCard
                          id={item.doctor_id}
                          name={item.full_name}
                          image={item.avatar}
                          gender={item.gender}
                          age={calculateAge(item.birthdate)}
                          rating={item.rating}
                          email={item.email}
                          phone={item.phone}
                        />
                      </View>
                    )}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    estimatedItemSize={20}
                  />
                </View>
              </View>
            </View>
            <View className="w-full h-[4px] bg-gray-300 mt-5"></View>
            <View className="w-full px-4 h-fit pb-5">
              <View className="w-full flex-row items-center justify-between">
                <Text className="font-semibold text-[14px] mb-2 mt-4">
                  Other Medical Centers
                </Text>
                <TouchableOpacity
                  className="flex-row items-center justify-center mt-1"
                  onPress={handleSimilarClinicsPress}
                >
                  <Text className="text-[14px] text-[#f59e0b]">(See more)</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={similarClinics}
                keyExtractor={(item) => item.medical_center_id}
                renderItem={({ item }) => (
                  <View className="ml-1">
                    <MedicalCenterCard
                      id={item.medical_center_id}
                      image={item.avatar}
                      name={item.name}
                      rating={item.rating}
                      distance={5}
                      workingHours={item.work_time}
                      telephone={item.phone}
                      description={item.description}
                      isHorizontal={true}
                    />
                  </View>
                )}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                estimatedItemSize={20}
              />
            </View>
          </View>
        </ScrollView>
      ) : null}
      {imageUrls && imageUrls.length > 0 ? (
        <View className="w-full h-16 flex-row items-start justify-end border-t-[0.5px] border-solid border-gray-200 bg-white">
          <TouchableOpacity
            className="w-48 h-10 bg-[#f59e0b]  flex-row items-center justify-center"
            onPress={handleCreateAppointment}
          >
            <FontAwesomeIcon
              icon={icons.faCalendarPlus}
              size={13}
              style={{ color: "white" }}
            />
            <Text className="text-white text-[12px] font-semibold ml-1">
              Make appointment
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default MedicalCenterDetail;
