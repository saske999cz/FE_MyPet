import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash } from "../../constants";
import { router } from "expo-router";
import ItemCard from "../../components/ItemCard";
import { useLocalSearchParams } from "expo-router";
import {
  get_best_selling_products_by_shop,
  get_all_category_type_with_amount_of_products_by_shop,
} from "../../api/MarketApi";
import { Image } from "expo-image";
import LottieView from "lottie-react-native";
import { FIREBASE_STORAGE } from "../../firebaseConfig";
import { getDownloadURL, ref } from "firebase/storage";
import Review from "../../components/Review";
import { get_shop_reviews } from "../../api/RatingApi";

const Shop = () => {
  const {
    shopId,
    shopName,
    shopAddress,
    shopAvatar,
    shopRating,
    workTime,
    shopPhone,
    shopWebsite,
    shopDescription,
  } = useLocalSearchParams();
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const rating = 4.8;
  const [activeTab, setActiveTab] = useState("products");
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState(null);
  const [shopImage, setShopImage] = useState(null);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [flags, setFlags] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };
  const handleBack = () => {
    router.back();
  };

  const handleReviewPress = () => {
    router.push({
      pathname: "../screens/AllShopReviews",
      params: {
        shopId: shopId,
        totalReviews: totalReviews,
      },
    });
  };

  const handleLoadMore = () => {
    if (page >= maxPage) return;
    setPage((prevPage) => prevPage + 1);
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
    const fetchProducts = async () => {
      try {
        get_best_selling_products_by_shop(shopId, page, 10)
          .then((res) => {
            if (res && res.status === 200) {
              const newProducts = [...products, ...res.data.data];
              const uniqueProducts = newProducts.reduce((unique, product) => {
                if (!unique.find((item) => item.id === product.id)) {
                  unique.push(product);
                }
                return unique;
              }, []);
              setProducts(uniqueProducts);
              setMaxPage(res.data.total_pages);
              setFlags((prev) => [...prev, true]);
            }
          })
          .catch((error) => console.error("Error fetching products:", error));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [page]);

  useEffect(() => {
    const fetchShopAvatar = async () => {
      try {
        const shopAvatarRef = ref(FIREBASE_STORAGE, shopAvatar);
        const shopUrl = await getDownloadURL(shopAvatarRef);
        setShopImage(shopUrl);
        setFlags((prev) => [...prev, true]);
      } catch (error) {
        console.error("Error fetching shop avatar:", error);
      }
    };
    const fetchCategories = async () => {
      try {
        get_all_category_type_with_amount_of_products_by_shop(shopId)
          .then((res) => {
            setCategories(res.data.data.dog);
            setFlags((prev) => [...prev, true]);
          })
          .catch((error) => console.error("Error fetching categories:", error));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
    fetchShopAvatar();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        get_shop_reviews(shopId)
          .then((res) => {
            if (res && res.status === 200) {
              setReviews(res.data.data);
              setTotalReviews(res.data.total_ratings);
              setFlags((prev) => [...prev, true]);
            }
          })
          .catch((error) => console.error("Error fetching reviews:", error));
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    if (flags.length === 4 && flags.every((flag) => flag === true)) {
      setIsLoading(false);
    }
  }, [flags]);

  return isLoading ? (
    <View className="w-full h-full flex-row item-start justify-center">
      <LottieView
        source={require("../../assets/lottie/loading.json")}
        autoPlay
        loop
        style={{ width: 130, height: 130, marginTop: 300 }}
        speed={2}
      />
    </View>
  ) : (
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
          <Image
            source={{ uri: shopImage }}
            className="w-full h-full object-center"
            contentFit="cover"
          />
        )}
        <View className="w-full h-full opacity-[50] bg-zinc-900/40 absolute bottom-0 left-0 top-0 right-0"></View>
        <View className="w-full flex-row items-center justify-start absolute bottom-0 left-0 ml-3 mb-2">
          <View className="w-16 h-16 rounded-full border-2 border-solid border-[#F2F2F2] flex-row items-center justify-center">
            {shopImage && (
              <Image
                source={{ uri: shopImage }}
                className="w-full h-full rounded-full"
                placeholder={{ blurhash }}
                transition={0}
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
            <FlatList
              scrollEventThrottle={2}
              data={products}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className="w-[47%] h-fit">
                  <ItemCard
                    id={item.id}
                    title={item.name}
                    price={item.price}
                    image={item.image}
                    rating={item.rating}
                    soldUnits={item.sold_quantity}
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
              estimatedItemSize={500}
              showsVerticalScrollIndicator={false}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              viewabilityConfig={{
                itemVisiblePercentThreshold: 80,
                minimumViewTime: 300,
              }}
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
            <ScrollView className="w-full h-fit px-4">
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
                {shopWebsite && (
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
                )}
              </View>
              <View className="w-full h-fit">
                <View className="w-full h-8 mt-4">
                  <Text className="text-[14px] font-semibold">Description</Text>
                </View>
                <View className="w-full h-fit">
                  <Text className="text-[13px]">{shopDescription}</Text>
                </View>
                <View className="w-full h-[4px] bg-gray-300 mt-5"></View>
                {reviews && (
                  <View className="w-full h-fit">
                    <View className="w-full h-12 mt-2 flex-row items-center justify-between">
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
                          type="shop"
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
                        <Text className="text-[13px]">
                          No more reviews to show
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </ScrollView>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default Shop;
