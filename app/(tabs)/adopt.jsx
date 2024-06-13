import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  Animated,
  FlatList,
  Modal,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, blurhash, images } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AdoptPetCard from "../../components/AdoptPetCard";
import SearchInput from "../../components/SearchInput";
import { PetDummy } from "../../dummy/FakeData";
import { Image } from "expo-image";
import { useGlobalContext } from "../../state/GlobalContextProvider";
import LottieView from "lottie-react-native";

const Header_Max_Height = 230;
const Header_Min_Height = 70;
const Scroll_Distance = Header_Max_Height - Header_Min_Height;

const DynamicHeader = ({
  value,
  activeCategory,
  handlePressCategory,
  isScrolled,
}) => {
  const animatedHeaderHeight = value.interpolate({
    inputRange: [0, Scroll_Distance],
    outputRange: [Header_Max_Height, Header_Min_Height],
    extrapolate: "clamp",
  });

  const animatedOpacity = value.interpolate({
    inputRange: [0, Scroll_Distance],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const animatedLogo = {
    transform: [
      {
        scale: value.interpolate({
          inputRange: [0, Scroll_Distance],
          outputRange: [1, 0],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: value.interpolate({
      inputRange: [0, 60],
      outputRange: [1, 0],
      extrapolate: "clamp",
    }),
  };

  const animatedSearchBar = {
    transform: [
      {
        translateX: value.interpolate({
          inputRange: [0, Scroll_Distance],
          outputRange: [0, -100],
          extrapolate: "clamp",
        }),
      },
      {
        scaleX: value.interpolate({
          inputRange: [0, Scroll_Distance - 60],
          outputRange: [1, 0.6],
          extrapolate: "clamp",
        }),
      },
      {
        translateY: value.interpolate({
          inputRange: [0, 50],
          outputRange: [4, 11],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: value.interpolate({
      inputRange: [0, 100],
      outputRange: [1, 0],
      extrapolate: "clamp",
    }),
  };
  const animatedSmallSearchBar = {
    transform: [
      {
        translateX: value.interpolate({
          inputRange: [0, Scroll_Distance],
          outputRange: [4, 7],
          extrapolate: "clamp",
        }),
      },
      {
        translateY: value.interpolate({
          inputRange: [0, Scroll_Distance],
          outputRange: [3, 8],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: value.interpolate({
      inputRange: [0, Scroll_Distance],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
  };

  return (
    <Animated.View
      style={{
        height: animatedHeaderHeight,
        justifyContent: "center",
        alignItems: "center",
        left: 0,
        right: 0,
      }}
    >
      <View className="w-full h-32 absolute top-0 left-0 right-0"></View>
      <View className="w-full flex-col items-center justify-between px-4 mb-4">
        <View className="w-full flex-row items-center justify-start mb-3">
          <Animated.Image
            source={images.logoBlack}
            className="w-32 h-16 -ml-4 -mt-1"
            resizeMode="contain"
            style={animatedLogo}
          />
        </View>
        <Animated.View
          className="w-full flex-row items-center justify-center -mt-1 mb-1"
          style={animatedSearchBar}
        >
          <SearchInput
            title="Search"
            placeholder="Search"
            otherStyles={"w-[88%] z-10"}
          />
          <Animated.View
            className="w-10 h-10 rounded-lg ml-2"
            style={animatedLogo}
          >
            <TouchableOpacity className="w-full h-full bg-[#e5e7eb] rounded-lg flex-row items-center justify-center ">
              <FontAwesomeIcon
                icon={icons.faFilter}
                size={20}
                style={{ color: "#000000" }}
              />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
        {isScrolled && (
          <Animated.View
            className="w-full flex-row items-center justify-center"
            style={animatedSmallSearchBar}
          >
            <SearchInput
              title="Search"
              placeholder="Search"
              otherStyles={"w-[62%] absolute top-0 left-0 -ml-4 -mt-9"}
            />
          </Animated.View>
        )}
      </View>
      <Animated.View
        className="w-full flex-col items-start justify-center px-4 mb-3"
        style={{ opacity: animatedOpacity }}
      >
        <Text className="text-[15px] font-semibold mb-4">Categories</Text>
        <View className="flex-row items-center justify-start w-full">
          <TouchableOpacity
            className={`w-24 h-10 rounded-full flex-row items-center justify-center ${
              activeCategory === "dogs" ? "bg-[#fed7aa]" : "bg-[#e5e7eb]"
            }`}
            onPress={() => handlePressCategory("dogs")}
          >
            <View
              className={`w-9 h-9 rounded-full flex-row items-center justify-center -ml-2 ${
                activeCategory === "dogs" ? "bg-[#fb923c]" : "bg-[#d1d5db]"
              }`}
            >
              <Image
                source={images.dog}
                className="w-5 h-5"
                contentFit="contain"
              />
            </View>
            <Text className={`text-[13px] ml-2`}>Dogs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`w-24 h-10 rounded-full flex-row items-center justify-center ml-9 ${
              activeCategory === "cats" ? "bg-[#fed7aa]" : "bg-[#e5e7eb]"
            }`}
            onPress={() => handlePressCategory("cats")}
          >
            <View
              className={`w-9 h-9 rounded-full flex-row items-center justify-center -ml-2 ${
                activeCategory === "cats" ? "bg-[#fb923c]" : "bg-[#d1d5db]"
              }`}
            >
              <Image
                source={images.cat}
                className="w-5 h-5"
                contentFit="contain"
              />
            </View>
            <Text className={`text-[13px] ml-2`}>Cats</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`w-24 h-10 rounded-full flex-row items-center justify-center ml-9 ${
              activeCategory === "birds" ? "bg-[#fed7aa]" : "bg-[#e5e7eb]"
            }`}
            onPress={() => handlePressCategory("birds")}
          >
            <View
              className={`w-9 h-9 rounded-full flex-row items-center justify-center -ml-2 ${
                activeCategory === "birds" ? "bg-[#fb923c]" : "bg-[#d1d5db]"
              }`}
            >
              <Image
                source={images.bird}
                className="w-5 h-5"
                contentFit="contain"
              />
            </View>
            <Text className={`text-[13px] ml-2`}>Birds</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const adopt = () => {
  const { userAvatar, userLocation, userLocationData } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("none");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const onRefresh = async () => {
    setRefreshing(true);
    // fetch data
    setRefreshing(false);
  };
  const handlePressCategory = (category) => {
    setActiveCategory(category);
  };

  useEffect(() => {
    scrollOffsetY.addListener(({ value }) => {
      if (value > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    });
    return () => {
      scrollOffsetY.removeAllListeners();
    };
  }, []);

  return (
    <SafeAreaView className="h-full flex-col">
      <SafeAreaView className="flex-row items-center w-[30%] justify-end absolute top-0 right-0 z-50 mr-4 mt-[16px]">
        {userLocation ? (
          <TouchableOpacity
            className="w-24 h-8 flex-row items-center justify-center mr-[7px]"
            onPress={() => setShowModal(true)}
          >
            <Text
              className="text-[12px] font-semibold mt-1"
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {userLocation.length > 13
                ? userLocation.substring(0, 13)
                : userLocation}
            </Text>
            <FontAwesomeIcon
              icon={icons.faLocationDot}
              size={20}
              style={{ color: "#ef4444" }}
            />
          </TouchableOpacity>
        ) : (
          <View className="w-28 h-10 flex-row items-center justify-center">
            <LottieView
              style={{ width: 55, height: 55 }}
              source={require("../../assets/lottie/globe.json")}
              autoPlay
              loop
              speed={1.5}
            />
          </View>
        )}
        {userAvatar && (
          <Image
            source={{ uri: userAvatar }}
            className="w-9 h-9 rounded-full"
            transition={0}
            placeholder={{ blurhash }}
          />
        )}
      </SafeAreaView>
      <DynamicHeader
        value={scrollOffsetY}
        activeCategory={activeCategory}
        handlePressCategory={handlePressCategory}
        isScrolled={isScrolled}
      />
      <FlatList
        data={PetDummy}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AdoptPetCard
            id={item.id}
            image={item.image}
            name={item.name}
            gender={item.gender}
            age={item.age}
            isHorizontal={false}
          />
        )}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-around",
        }}
        estimatedItemSize={20}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          {
            useNativeDriver: false,
          }
        )}
        showsVerticalScrollIndicator={false}
      />
      <Modal visible={showModal} animationType="fade" transparent={true}>
        <TouchableOpacity
          className="flex-1 bg-zinc-900/40 opacity-100 h-full w-full flex-row items-center justify-center"
          onPress={() => setShowModal(false)}
        >
          <View className="w-80 flex-col h-24 items-center justify-center bg-white rounded-md">
            <View className="w-full h-[45%] flex-row items-center justify-center mt-2">
              <FontAwesomeIcon
                icon={icons.faLocationDot}
                size={20}
                style={{ color: "#ef4444" }}
              />
              <Text className="text-[13px] text-gray-600 font-medium ml-1">
                Current location:
              </Text>
            </View>
            <View className="w-full h-[45%] flex-row items-center justify-center">
              <Text className="text-[13px] text-gray-600 font-medium">
                {userLocationData}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default adopt;
