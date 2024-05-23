import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { images } from "../../constants";
import { router } from "expo-router";
import { ItemDummy } from "../../dummy/FakeData";
import ItemCard from "../../components/ItemCard";
import { FlashList } from "@shopify/flash-list";
import { CategoryDummy } from "../../dummy/FakeData";

const Shop = () => {
  const [refreshing, setRefreshing] = useState(false);
  const rating = 4.8;
  const [activeTab, setActiveTab] = useState("products");

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };
  const handleBack = () => {
    router.back();
  };

  const handleCategoryPress = (category) => {
    router.push({
      pathname: "../screens/ShopCategoryDetail",
      params: {
        id: category.id,
        category: category.name,
      },
    });
  };

  return (
    <View className="h-full w-full">
      <View className="w-full h-44">
        <TouchableOpacity
          className="w-12 h-12 flex-row items-center justify-center absolute top-10 left-0 z-20"
          onPress={handleBack}
        >
          <FontAwesomeIcon
            icon={icons.faArrowLeftLong}
            size={20}
            style={{ color: "#f59e0b" }}
          />
        </TouchableOpacity>
        <ImageBackground
          source={images.clinic2}
          className="w-full h-full object-center"
          resizeMode="cover"
        />
        <View className="w-full h-full opacity-[50] bg-zinc-900/40 absolute bottom-0 left-0 top-0 right-0"></View>
        <View className="w-full flex-row items-center justify-start absolute bottom-0 left-0 ml-3 mb-2">
          <View className="w-16 h-16 rounded-full border-2 border-solid border-[#F2F2F2] flex-row items-center justify-center">
            <Image
              source={images.clinic1}
              className="w-full h-full rounded-full"
            />
          </View>
          <View className="w-[70%] h-full flex-col items-start justify-start px-4 mt-8">
            <Text className="text-[16px] font-bold text-white mb-1">
              Pet Shop
            </Text>
            <View className="w-16 rounded-full bg-zinc-900/40 opacity-[50] flex-row items-center justify-center px-[3px] py-[2px]">
              <FontAwesomeIcon
                icon={icons.faStar}
                size={10}
                style={{ color: "#f59e0b" }}
              />
              <Text className="text-[10px] ml-1 text-white font-semibold">
                {parseFloat(rating).toFixed(1)} / 5.0
              </Text>
            </View>
            <View className="flex-row items-center-justify-start mt-2 ml-1">
              <FontAwesomeIcon
                icon={icons.faLocationDot}
                size={10}
                style={{ color: "#ef4444" }}
              />
              <Text className="ml-4 text-[10px] ml-1 text-white font-semibold">
                Tokyo,Japan
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View className=" w-full h-full flex-col items-start justify-start">
        <View className="w-full h-10 flex-row items-center justify-between mb-2">
          <TouchableOpacity
            className={`w-1/2 h-full flex-row items-center justify-center ${
              activeTab === "products"
                ? "border-b-2 border-solid border-amber-500"
                : ""
            }`}
            onPress={() => setActiveTab("products")}
          >
            <Text
              className={`${
                activeTab === "products" ? "text-amber-500" : "text-black"
              } text-[14px] px-4`}
            >
              Products
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`w-1/2 h-full flex-row items-center justify-center ${
              activeTab === "category"
                ? "border-b-2 border-solid border-amber-500"
                : ""
            }`}
            onPress={() => setActiveTab("category")}
          >
            <Text
              className={`${
                activeTab === "category" ? "text-amber-500" : "text-black"
              } text-[14px] px-4`}
            >
              Category
            </Text>
          </TouchableOpacity>
        </View>
        <View className="w-full h-full flex-row items-center justify-start mt-2 pb-52">
          {activeTab === "products" ? (
            <FlashList
              scrollEventThrottle={5}
              data={ItemDummy}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className="w-[96%] h-fit ml-1">
                  <ItemCard
                    id={item.id}
                    title={item.title}
                    price={item.price}
                    image={item.image}
                    rating={item.rating}
                    soldUnits={item.soldUnits}
                    shop={item.shop}
                    isHorizontal={false}
                  />
                </View>
              )}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: "space-around",
              }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              estimatedItemSize={40}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <FlashList
              data={CategoryDummy}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="w-full h-16 flex-row items-center justify-between px-4"
                  onPress={() => handleCategoryPress(item)}
                >
                  <Text className="text-[14px]">{item.name}</Text>
                  <FontAwesomeIcon
                    icon={icons.faChevronRight}
                    size={15}
                    style={{ color: "#000000" }}
                  />
                </TouchableOpacity>
              )}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              estimatedItemSize={40}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default Shop;
