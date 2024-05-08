import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  Animated,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { images } from "../../constants";
import { icons } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import MedicalCenterCard from "../../components/MedicalCenterCard";
import SearchInput from "../../components/SearchInput";
import { ClinicDummy } from "../../dummy/FakeData";
const apointment = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("none");
  const onRefresh = async () => {
    setRefreshing(true);
    // fetch data
    setRefreshing(false);
  };
  handlePressCategory = (category) => {
    setActiveCategory(category);
  };
  return (
    <SafeAreaView className="h-full flex-col">
      <View className="flex-col items-center justify-between px-4 mb-4">
        <View className="flex-row w-full items-center justify-between mb-3">
          <Image
            source={images.logoBlack}
            className="w-32 h-16 -ml-4"
            resizeMode="contain"
          />
          <View className="flex-row items-center w-[45%] justify-end">
            <View className="w-[60%] flex-row items-center justify-center mr-1">
              <Text className="text-[12px] font-semibold mr-1 mt-1">
                Da Nang, VN
              </Text>
              <FontAwesomeIcon
                icon={icons.faLocationDot}
                size={18}
                style={{ color: "#ef4444" }}
              />
            </View>
            <Image source={images.avatar} className="w-9 h-9 rounded-full" />
          </View>
        </View>
        <View className="w-full flex-row items-center justify-center">
          <SearchInput
            title="Search"
            placeholder="Search for medical centers"
            otherStyles={"w-[88%]"}
          />
          <TouchableOpacity className="w-10 h-10 bg-[#e5e7eb] rounded-lg flex-row items-center justify-center ml-2">
            <FontAwesomeIcon
              icon={icons.faFilter}
              size={20}
              style={{ color: "#000000" }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
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
          />
        )}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-around",
        }}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default apointment;
