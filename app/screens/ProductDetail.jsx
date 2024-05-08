import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { router, useLocalSearchParams } from "expo-router";
import { ProductImages, ItemDummy } from "../../dummy/FakeData";
import ItemCard from "../../components/ItemCard";
import { setGlobalState } from "../../state/GlobalState";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProductDetail = () => {
  const { id, title, rating, price, soldUnits, shop, image } =
    useLocalSearchParams();
  const [mainImage, setMainImage] = useState(image);
  const [currentImageIndex, setCurrentImageIndex] = useState(1);
  const totalImages = ProductImages.length;
  const handleBack = () => {
    router.back();
  };
  const updateData = async (key) => {
    try {
      const existingData = await AsyncStorage.getItem(key);
      if (existingData !== null) {
        const parsedExistingData = JSON.parse(existingData);
        const updatedData = parsedExistingData + 1;
        await AsyncStorage.setItem(key, JSON.stringify(updatedData));
      } else {
        await AsyncStorage.setItem(key, JSON.stringify(1));
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  const addItemToCart = async (item) => {
    try {
      const existingData = await AsyncStorage.getItem("cartItems");
      if (existingData !== null) {
        const parsedExistingData = JSON.parse(existingData);
        const updatedData = [...parsedExistingData, item];
        await AsyncStorage.setItem("cartItems", JSON.stringify(updatedData));
      } else {
        await AsyncStorage.setItem("cartItems", JSON.stringify([item]));
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const handleProductImagePress = (image) => {
    setMainImage(image);
    setCurrentImageIndex(ProductImages.indexOf(image) + 1);
  };

  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      console.log("All data cleared successfully");
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  };

  const handleAddToCart = () => {
    setGlobalState("toastStatus", true);
    setGlobalState("addedCartItem", title);
    updateData("cartLength");
    addItemToCart({
      id: id,
      title: title,
      rating: rating,
      price: price,
      soldUnits: soldUnits,
      shop: shop,
      image: image,
    });
    router.back();
  };
  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="flex-col items-center justify-start">
          <View className="w-full h-12 flex-row items-center justify-center">
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
          </View>
          <Image
            source={mainImage}
            className="w-full h-60"
            resizeMode="contain"
            style={{ aspectRatio: 16 / 9 }}
          />
          <View className="w-10 h-5 flex-row items-center justify-center bg-white rounded-full border-[0.5px] border-solid border-gray-300 mt-3 mb-2">
            <Text className="text-[12px] text-gray-700">
              {currentImageIndex}/{totalImages}
            </Text>
          </View>
          <View className="w-full h-fit flex-row items-center justify-start px-3">
            <FlatList
              data={ProductImages}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="w-10 h-10 bg-white rounded-[3px] mx-1 mt-1 border-[0.5px] border-solid border-gray-300"
                  onPress={() => handleProductImagePress(item)}
                >
                  <Image
                    source={item}
                    className="w-full h-full rounded-[3px]"
                  />
                </TouchableOpacity>
              )}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ padding: 4 }}
            />
          </View>

          <View className="w-full h-32 flex-row items-center justify-center">
            <View className="w-[70%] flex-col items-center justify-center px-4">
              <View className="w-full flex-row items-center justify-start">
                <Text className="text-[18px] font-semibold mt-4">{title}</Text>
              </View>
              <View className="flex-row w-full items-center justify-start mt-4">
                <View className="rounded-[3px] bg-pink-100 flex-row items-center justiify-center px-[3px] py-[2px] border-[1px] border-solid border-pink-400">
                  <FontAwesomeIcon
                    icon={icons.faHeart}
                    size={10}
                    style={{ color: "#f43f5e" }}
                  />
                  <Text className="text-[10px] ml-1">{rating}</Text>
                </View>

                <View className="w-[1px] h-3 bg-gray-300 ml-1"></View>
                <Text className="text-[10px] ml-1">{soldUnits} sold</Text>
              </View>
              <View className="w-full flex-row items-center justify-start mb-4 mt-3">
                <FontAwesomeIcon
                  icon={icons.faDongSign}
                  size={16}
                  style={{ color: "#f59e0b" }}
                />
                <Text className="text-[21px] text-[#fb923c] font-semibold">
                  {parseInt(price).toLocaleString("en-US")}
                </Text>
              </View>
            </View>
            <View className="w-[30%] h-full flex-row items-center justify-end">
              <TouchableOpacity
                className="w-28 h-8 bg-[#f59e0b] rounded-md flex-row items-center justify-center mr-4"
                onPress={handleAddToCart}
              >
                <FontAwesomeIcon
                  icon={icons.faCartShopping}
                  size={13}
                  style={{ color: "white" }}
                />
                <Text className="text-white text-[12px] font-semibold ml-1">
                  Add to cart
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="w-full h-[1px] bg-gray-300"></View>
          <View className="w-full h-fit px-4 mt-4">
            <Text className="text-[14px] font-semibold mb-2">
              Product Details
            </Text>
            <Text className="text-[13px] text-gray-800">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              posuere erat a ante.
            </Text>
          </View>
          <View className="w-full h-[4px] bg-gray-300 mt-5"></View>
          <View className="w-full px-4 mt-4">
            <View className="w-full flex-row items-center justify-start">
              <View className="w-10 h-10 rounded-full border-[0.5px] border-solid border-gray-200">
                <Image
                  source={images.clinic1}
                  className="w-full h-full rounded-full"
                />
              </View>

              <View className="w-fit flex-col items-start justify-start ml-2">
                <View className="flex-row items-center justify-start">
                  <FontAwesomeIcon
                    icon={icons.faStore}
                    size={12}
                    style={{ color: "#14b8a6" }}
                  />
                  <Text className="ml-4 text-[14px] ml-1 mr-1">{shop}</Text>
                </View>
                <View className="flex-row items-center-justify-start mt-1">
                  <FontAwesomeIcon
                    icon={icons.faLocationDot}
                    size={10}
                    style={{ color: "#ef4444" }}
                  />
                  <Text className="ml-4 text-[10px] ml-1 mr-1">
                    Tokyo,Japan
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View className="w-full h-[4px] bg-gray-300 mt-5"></View>
          <View className="w-full px-4 h-fit">
            <View className="w-full flex-row items-center justify-between">
              <Text className="font-semibold text-[14px] mb-2 mt-4">
                Similar Products
              </Text>
              <TouchableOpacity className="flex-row items-center justify-center mt-1">
                <Text className="text-[14px] text-[#f59e0b]">(See more)</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={ItemDummy}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className="ml-2">
                  <ItemCard
                    title={item.title}
                    price={item.price}
                    image={item.image}
                    rating={item.rating}
                    soldUnits={item.soldUnits}
                    shop={item.shop}
                  />
                </View>
              )}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetail;
