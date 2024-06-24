import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash } from "../../constants";
import { router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import * as Location from "expo-location";
import { useGlobalContext } from "../../state/GlobalContextProvider";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import LottieView from "lottie-react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const CustomMap = () => {
  const { medicalCenterAddress, medicalCenterName, image } =
    useLocalSearchParams();
  const { userLocationData } = useGlobalContext();
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [directionInfo, setDirectionInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["18%"];

  const toggleSheet = () => {
    bottomSheetModalRef.current.present();
  };

  const handleBack = () => {
    router.back();
  };

  const getAddressCoordinates = async (address) => {
    const geocodedAddress = await Location.geocodeAsync(address);
    if (geocodedAddress.length === 0) {
      return "Address not found";
    }
    const addressCoords = {
      latitude: geocodedAddress[0].latitude,
      longitude: geocodedAddress[0].longitude,
    };
    return addressCoords;
  };

  useEffect(() => {
    const getDirections = async () => {
      const userCoords = await getAddressCoordinates(userLocationData);
      const medicalCenterCoords = await getAddressCoordinates(
        medicalCenterAddress + " Việt Nam"
      );
      setOrigin(userCoords);
      setDestination(medicalCenterCoords);
      setIsLoading(false);
    };
    getDirections();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View className="w-full h-full">
          <View className="w-full h-10 flex-row items-center justify-center mb-2 mt-12 border-b-[0.5px] border-solid border-gray-200">
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
            <Text className="text-[16px] font-bold">Map</Text>
          </View>
          {isLoading ? (
            <View className="w-full h-full flex-row items-start justify-center">
              <LottieView
                style={{ width: 140, height: 140, marginTop: 150 }}
                source={require("../../assets/lottie/globe.json")}
                autoPlay
                loop
                speed={2}
              />
            </View>
          ) : (
            <MapView
              initialRegion={{
                latitude: (origin.latitude + destination.latitude) / 2,
                longitude: (origin.longitude + destination.longitude) / 2,
                latitudeDelta: 0.08,
                longitudeDelta: 0.08,
              }}
              className="w-full h-full"
              zoomEnabled={true}
              showsUserLocation={true}
            >
              {destination && (
                <Marker
                  coordinate={destination}
                  title={medicalCenterName}
                  description="Destination location"
                  onPress={toggleSheet}
                />
              )}
              <MapViewDirections
                origin={origin}
                destination={destination}
                apikey={apiKey}
                strokeWidth={3}
                strokeColor="#f59e0b"
                optimizeWaypoints={true}
                onStart={(params) => {
                  console.log(
                    `Started routing between "${params.origin}" and "${params.destination}"`
                  );
                }}
                onReady={(result) => {
                  console.log(`Distance: ${result.distance} km`);
                  console.log(`Duration: ${result.duration} min.`);
                  setDirectionInfo({
                    distance: `${result.distance.toFixed(2)} km`,
                    duration: `${result.duration.toFixed(2)} min`,
                  });
                }}
              />
            </MapView>
          )}
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backgroundStyle={{
              backgroundColor: "#F5F5F7",
            }}
          >
            <View className="w-full h-full bg-[#F5F5F7] flex-row items-start justify-start absolute bottom-0 px-8 py-3">
              <View className="w-16 h-16 rounded-md mr-2">
                <Image
                  source={{ uri: image }}
                  className="w-full h-full rounded-md"
                  placeholder={{ blurhash }}
                  transition={0}
                />
              </View>
              <View className="w-60 h-fit flex-col">
                <Text
                  className="text-[13px] font-bold mb-1"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {medicalCenterName}
                </Text>
                <View className="w-full h-fit flex-row items-center justify-start mb-1">
                  {directionInfo && (
                    <Text className="text-[13px] mr-1 ">
                      Distance: {directionInfo.distance}
                    </Text>
                  )}
                  <FontAwesomeIcon
                    icon={icons.faCarSide}
                    size={13}
                    style={{ color: "#3b82f6" }}
                  />
                </View>
                <View className="w-full h-fit flex-row items-center justify-start">
                  {directionInfo && (
                    <Text className="text-[13px] mr-1">
                      Duration: {directionInfo.duration}
                    </Text>
                  )}
                  <FontAwesomeIcon
                    icon={icons.faClock}
                    size={12}
                    style={{ color: "#3b82f6" }}
                  />
                </View>
              </View>
            </View>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default CustomMap;
