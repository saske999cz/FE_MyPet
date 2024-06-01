import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { images } from "../../constants";
import { router } from "expo-router";
import { ItemDummy } from "../../dummy/FakeData";
import ItemCard from "../../components/ItemCard";
import { FlashList } from "@shopify/flash-list";
import { CategoryDummy } from "../../dummy/FakeData";
import { useLocalSearchParams } from "expo-router";
import {
  get_best_selling_products_by_shop,
  get_all_category_type_with_amount_of_products_by_shop,
} from "../../api/MarketApi";
import { set } from "date-fns";

const Shop = () => {
  const {
    shopId,
    shopName,
    shopAddress,
    shopAvatar,
    shopPhone,
    shopEstablished,
    workTime,
    shopWebsite,
    shopFanpage,
    shopDescription,
  } = useLocalSearchParams();
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const rating = 4.8;
  const [activeTab, setActiveTab] = useState("products");
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState(null);
  const [shopImage, setShopImage] = useState(null);

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };
  const handleBack = () => {
    router.back();
  };

  const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 9); // 9 characters
  };

  const handleCategoryPress = (category) => {
    router.push({
      pathname: "../screens/ShopCategoryDetail",
      params: {
        category: category.type,
        shopId: shopId,
      },
    });
  };

  useEffect(() => {
    const encodedShopAvatar = shopAvatar.replace("/shop/", "%2Fshop%2F");
    setShopImage(encodedShopAvatar);
    const fetchProducts = async () => {
      try {
        get_best_selling_products_by_shop(shopId)
          .then((res) => setProducts(res.data.data))
          .catch((error) => console.error("Error fetching products:", error));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        get_all_category_type_with_amount_of_products_by_shop(shopId)
          .then((res) => setCategories(res.data.data.dog))
          .catch((error) => console.error("Error fetching categories:", error));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
    fetchProducts();
  }, []);

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
        {shopImage && (
          <ImageBackground
            source={{ uri: shopImage }}
            className="w-full h-full object-center"
            resizeMode="cover"
          />
        )}
        <View className="w-full h-full opacity-[50] bg-zinc-900/40 absolute bottom-0 left-0 top-0 right-0"></View>
        <View className="w-full flex-row items-center justify-start absolute bottom-0 left-0 ml-3 mb-2">
          <View className="w-16 h-16 rounded-full border-2 border-solid border-[#F2F2F2] flex-row items-center justify-center">
            {shopImage && (
              <Image
                source={{ uri: shopImage }}
                className="w-full h-full rounded-full"
              />
            )}
          </View>
          <View className="w-[70%] h-full flex-col items-start justify-start px-4 mt-8">
            <Text className="text-[16px] font-bold text-white mb-1">
              {shopName}
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
                {shopAddress}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View className=" w-full h-full flex-col items-start justify-start">
        <View className="w-full h-10 flex-row items-center justify-between mb-2">
          <TouchableOpacity
            className={`w-1/3 h-full flex-row items-center justify-center ${
              activeTab === "shop"
                ? "border-b-2 border-solid border-amber-500"
                : ""
            }`}
            onPress={() => setActiveTab("shop")}
          >
            <Text
              className={`${
                activeTab === "shop" ? "text-amber-500" : "text-black"
              } text-[14px] px-4`}
            >
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`w-1/3 h-full flex-row items-center justify-center ${
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
            className={`w-1/3 h-full flex-row items-center justify-center ${
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
        <View className="w-full h-full flex-row items-start justify-start mt-2 pb-64">
          {activeTab === "products" && products && products.length > 0 ? (
            <FlashList
              scrollEventThrottle={5}
              data={products}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className="w-[96%] h-fit ml-1">
                  <ItemCard
                    id={item.id}
                    title={item.name}
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
          ) : activeTab === "category" ? (
            <View className="w-full h-fit">
              {categories.map((category) => (
                <TouchableOpacity
                  className="w-full h-16 flex-row items-center justify-between px-4"
                  onPress={() => handleCategoryPress(category)}
                  key={generateRandomId()}
                >
                  <Text className="text-[14px]">
                    {category.type} ({category.product_count})
                  </Text>
                  <FontAwesomeIcon
                    icon={icons.faChevronRight}
                    size={15}
                    style={{ color: "#000000" }}
                  />
                </TouchableOpacity>
              ))}
            </View>
          ) : activeTab === "shop" ? (
            <View className="w-full h-fit px-4">
              <View className="w-full h-28 mt-4">
                <View className="w-full h-6 flex-row items-center justify-start">
                  <FontAwesomeIcon
                    icon={icons.faClock}
                    size={13}
                    style={{ color: "#4b5563" }}
                  />
                  <Text className="text-[13px] font-semibold ml-3">
                    {workTime}
                  </Text>
                </View>
                <View className="w-full h-6 flex-row items-center justify-start mt-2">
                  <FontAwesomeIcon
                    icon={icons.faPhone}
                    size={13}
                    style={{ color: "#3b82f6" }}
                  />
                  <Text className="text-[13px] font-semibold ml-3">
                    {shopPhone}
                  </Text>
                </View>
                <View className="w-full h-fit flex-row items-center justify-start mt-2">
                  <FontAwesomeIcon
                    icon={icons.faGlobe}
                    size={13}
                    style={{ color: "#06b6d4" }}
                  />
                  <Text className="text-[13px] font-semibold ml-3">
                    {shopWebsite}
                  </Text>
                </View>
              </View>
              <View className="w-full h-fit">
                <View className="w-full h-8 mt-1">
                  <Text className="text-[13px] font-semibold">Description</Text>
                </View>
                <View className="w-full h-fit mt-2">
                  <Text className="text-[13px]">{shopDescription}</Text>
                </View>
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default Shop;
