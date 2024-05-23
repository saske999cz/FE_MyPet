import {
  View,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
  Animated,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { icons } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import MedicalCenterCard from "../../components/MedicalCenterCard";
import SearchInput from "../../components/SearchInput";
import { ClinicDummy } from "../../dummy/FakeData";
import { FlashList } from "@shopify/flash-list";

const Header_Max_Height = 144;
const Header_Min_Height = 70;
const Scroll_Distance = Header_Max_Height - Header_Min_Height;

const DynamicHeader = ({ value, isScrolled }) => {
  const animatedHeaderHeight = value.interpolate({
    inputRange: [0, Scroll_Distance],
    outputRange: [Header_Max_Height, Header_Min_Height],
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
          inputRange: [0, 60],
          outputRange: [0, -80],
          extrapolate: "clamp",
        }),
      },
      {
        scaleX: value.interpolate({
          inputRange: [0, Scroll_Distance - 40],
          outputRange: [1, 0.7],
          extrapolate: "clamp",
        }),
      },
      {
        translateY: value.interpolate({
          inputRange: [0, 50],
          outputRange: [4, -20],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: value.interpolate({
      inputRange: [0, 70],
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
          outputRange: [3, -31],
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
            otherStyles={"w-[88%]"}
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
    </Animated.View>
  );
};

const apointment = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("none");
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const onRefresh = async () => {
    setRefreshing(true);
    // fetch data
    setRefreshing(false);
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
      <SafeAreaView className="flex-row items-center w-[25%] justify-around absolute top-0 right-0 z-50 mr-10 mt-[14px]">
        <View className="w-28 h-10 flex-row items-center justify-center mr-12">
          <Text className="text-[12px] font-semibold mr-1 mt-1">
            Da Nang, VN
          </Text>
          <FontAwesomeIcon
            icon={icons.faLocationDot}
            size={20}
            style={{ color: "#ef4444" }}
          />
        </View>
        <Image source={images.avatar} className="w-9 h-9 rounded-full" />
      </SafeAreaView>
      <DynamicHeader value={scrollOffsetY} isScrolled={isScrolled} />
      <FlashList
        data={ClinicDummy}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MedicalCenterCard
            image={item.image}
            name={item.name}
            rating={item.rating}
            distance={item.distance}
            workingHours={item.workingHours}
            telephone={item.telephone}
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
    </SafeAreaView>
  );
};

export default apointment;
