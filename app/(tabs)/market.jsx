import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { images } from "../../constants";
import { icons } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { ItemDummy } from "../../dummy/FakeData";
import ItemCard from "../../components/ItemCard";
import SearchInput from "../../components/SearchInput";
import Toast from "react-native-toast-message";
import { setGlobalState, useGlobalState } from "../../state/GlobalState";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const market = () => {
  const [cartLength, setCartLength] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("none");
  const addedCartItem = useGlobalState("addedCartItem");
  const toastStatus = useGlobalState("toastStatus");
  const cartStatus = useGlobalState("cartStatus");

  useEffect(() => {
    const fetchData = async () => {
      const storedCartLength = await retrieveData("cartLength");
      setCartLength(storedCartLength);
    };
    fetchData();
  }, [toastStatus[0], cartStatus[0]]);

  const retrieveData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        const parsedValue = JSON.parse(value);
        return parsedValue;
      } else {
        return 0;
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  };

  useEffect(() => {
    if (toastStatus[0] === true && addedCartItem[0] !== "") {
      setTimeout(() => {
        Toast.show({
          type: "success",
          text1: "New cart item!",
          text2: addedCartItem[0] + " has been added to your cart",
          visibilityTime: 3000,
        });
      }, 100);
      const newCartLength = retrieveData("cartLength");
      setCartLength(newCartLength);
    }
    setTimeout(() => {
      setGlobalState("toastStatus", false);
      setGlobalState("addedCartItem", "");
    }, 2000);
  }, [toastStatus[0]]);

  const onRefresh = async () => {
    setRefreshing(true);
    // fetch data
    setRefreshing(false);
  };

  handlePressCategory = (category) => {
    setActiveCategory(category);
  };

  handleCartPress = () => {
    router.push("../screens/Cart");
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
          <View className="flex-row items-center w-[25%] justify-around -mr-1">
            <TouchableOpacity
              className="w-10 h-10 bg-[#e5e7eb] rounded-full flex-row items-center justify-center"
              onPress={handleCartPress}
            >
              {cartLength > 0 ? (
                <View className="w-4 h-4 rounded-full bg-red-500 absolute top-0 right-0 -mr-1 flex-row items-center justify-center ">
                  <Text className="text-[12px] font-semibold text-white">
                    {cartLength}
                  </Text>
                </View>
              ) : null}
              <FontAwesomeIcon
                icon={icons.faCartShopping}
                size={20}
                style={{ color: "#000000" }}
              />
            </TouchableOpacity>
            <Image source={images.avatar} className="w-9 h-9 rounded-full" />
          </View>
        </View>
        <View className="w-full flex-row items-center justify-center">
          <SearchInput
            title="Search"
            placeholder="Search for products"
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
      <View className="w-full flex-col items-start justify-center px-4 mb-3">
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
                resizeMode="contain"
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
                resizeMode="contain"
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
                resizeMode="contain"
              />
            </View>
            <Text className={`text-[13px] ml-2`}>Birds</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={ItemDummy}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemCard
            id={item.id}
            title={item.title}
            price={item.price}
            image={item.image}
            rating={item.rating}
            soldUnits={item.soldUnits}
            shop={item.shop}
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
      <View style={{ position: "absolute", top: 20, left: 20, right: 20 }}>
        <Toast />
      </View>
    </SafeAreaView>
  );
};

export default market;
