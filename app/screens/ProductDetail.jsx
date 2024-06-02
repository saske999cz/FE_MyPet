import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { router, useLocalSearchParams } from "expo-router";
import {
  ProductImages,
  ItemDummy,
  ProductReviewDummy,
} from "../../dummy/FakeData";
import ItemCard from "../../components/ItemCard";
import { setGlobalState } from "../../state/GlobalState";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import {
  get_product_detail_by_id,
  get_best_selling_products_by_category,
  get_product_reviews,
} from "../../api/MarketApi";
import { FIREBASE_STORAGE } from "../../firebaseConfig";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import { ProductDetailLoader } from "../../components/CustomLoader";
import Review from "../../components/Review";

const ProductDetail = () => {
  const { id, shopName, shopAddress, rating, shopAvatar, shopImage } =
    useLocalSearchParams();
  const [mainImage, setMainImage] = useState(null);
  const [imageUrls, setImageUrls] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(1);
  const [productDetail, setProductDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [folderUrl, setFolderUrl] = useState(null);
  const [similarProducts, setSimilarProducts] = useState(null);
  const [productCategory, setProductCategory] = useState(null);
  const [shopImageUrl, setShopImageUrl] = useState(null);
  const [flags, setFlags] = useState([]);
  const [reviews, setReviews] = useState(ProductReviewDummy);
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
    setCurrentImageIndex(imageUrls.indexOf(image) + 1);
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

  const handleShopPress = () => {
    router.push({
      pathname: "../screens/Shop",
      params: {
        shopId: productDetail.shop_id,
        shopName: shopName,
        shopAddress: shopAddress,
        shopAvatar: shopImageUrl,
        shopImage: shopImage,
        workTime: productDetail.shop.work_time,
        shopPhone: productDetail.shop.phone,
        shopWebsite: productDetail.shop.website,
        shopFanpage: productDetail.shop.fanpage,
        shopEstablished: productDetail.shop.established_year,
        shopDescription: productDetail.shop.description,
      },
    });
  };

  const handleReviewPress = () => {
    router.push("../screens/AllReviews");
  };

  useEffect(() => {
    const fetchProductDetail = async (id) => {
      try {
        get_product_detail_by_id(id)
          .then((res) => {
            if (res && res.status === 200) {
              setProductDetail(res.data.data);
              setFolderUrl(res.data.data.image);
              setProductCategory(res.data.data.product_category_id);
              setFlags((prev) => [...prev, true]);
            } else if (res) {
              alert(res.data.status);
            } else {
              console.error("Error: Response is undefined");
            }
          })
          .catch((error) => {
            console.error("Error fetching product detail:", error);
          });
      } catch (error) {
        console.error("Error fetching product detail:", error);
      }
    };

    const fetchShopAvatar = async () => {
      try {
        const shopAvatarRef = ref(FIREBASE_STORAGE, shopAvatar);
        const shopUrl = await getDownloadURL(shopAvatarRef);
        setShopImageUrl(shopUrl);
        setFlags((prev) => [...prev, true]);
      } catch (error) {
        console.error("Error fetching shop avatar:", error);
      }
    };
    fetchProductDetail(id);
    fetchShopAvatar();
  }, []);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imageFolderRef = ref(FIREBASE_STORAGE, folderUrl);
        const res = await listAll(imageFolderRef);
        if (res.items.length > 0) {
          const url = await getDownloadURL(res.items[0]);
          setMainImage(url);
          Promise.all(res.items.map((item) => getDownloadURL(item)))
            .then((urls) => {
              setImageUrls(urls);
              setFlags((prev) => [...prev, true]);
            })
            .catch((error) => console.error(error));
        }
      } catch (error) {
        console.log("Error fetching product detail image:", error);
      }
    };

    fetchImage();
  }, [folderUrl]);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        get_best_selling_products_by_category(productCategory, 1, 10).then(
          (res) => {
            if (res && res.status === 200) {
              setSimilarProducts(res.data.data);
              setFlags((prev) => [...prev, true]);
            }
          }
        );
      } catch (error) {
        console.error("Error fetching similar products:", error);
      }
    };
    fetchSimilarProducts();
  }, [productCategory]);

  // useEffect(() => {
  //   const fetchReviews = async () => {
  //     try {
  //       get_product_reviews(productDetail.id, productDetail.shop_id, 1, 5).then(
  //         (res) => {
  //           if (res && res.status === 200) {
  //             setReviews(res.data.data);
  //             setFlags((prev) => [...prev, true]);
  //           }
  //         }
  //       );
  //     } catch (error) {
  //       console.error("Error fetching similar products:", error);
  //     }
  //   };
  //   fetchSimilarProducts();
  // }, [productCategory]);

  useEffect(() => {
    if (flags.length === 4 && flags.every((flag) => flag === true)) {
      setTimeout(() => {
        setIsLoading(false);
      }, 400);
    }
  }, [flags]);

  return (
    <View className="h-full">
      <View className="w-full h-10 flex-row items-center justify-center mb-2 mt-10 border-b-[0.5px] border-solid border-gray-200">
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
      ) : imageUrls &&
        imageUrls.length > 0 &&
        shopImageUrl &&
        shopImageUrl.length > 0 ? (
        <ScrollView>
          <View className="flex-col items-center justify-start pb-8">
            <Image
              source={{ uri: mainImage }}
              className="w-full h-60"
              resizeMode="contain"
              style={{ aspectRatio: 16 / 9 }}
            />
            <View className="w-10 h-5 flex-row items-center justify-center bg-white rounded-full border-[0.5px] border-solid border-gray-300 mt-3 mb-2">
              <Text className="text-[12px] text-gray-700">
                {currentImageIndex}/{imageUrls.length}
              </Text>
            </View>
            <View className="w-full h-fit flex-row items-center justify-start px-3">
              {imageUrls && (
                <FlashList
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

            <View className="w-full h-fit flex-row items-center justify-center">
              <View className="w-full flex-col items-center justify-center px-4">
                <View className="w-full flex-row items-center justify-start">
                  <Text className="text-[17px] font-semibold mt-4">
                    {productDetail.name}
                  </Text>
                </View>
                <View className="flex-row w-full items-center justify-start mt-4">
                  <View className="rounded-[3px] bg-pink-100 flex-row items-center justiify-center px-[3px] py-[2px] border-[1px] border-solid border-pink-400">
                    <FontAwesomeIcon
                      icon={icons.faHeart}
                      size={11}
                      style={{ color: "#f43f5e" }}
                    />
                    <Text className="text-[11px] ml-1">
                      {parseFloat(rating).toFixed(1)}
                    </Text>
                  </View>

                  <View className="w-[1px] h-3 bg-gray-300 ml-1"></View>
                  <Text className="text-[11px] ml-1">
                    {productDetail.sold_quantity} sold
                  </Text>
                </View>
                <View className="w-full flex-row items-center justify-start mb-4 mt-3">
                  <FontAwesomeIcon
                    icon={icons.faDongSign}
                    size={16}
                    style={{ color: "#f59e0b" }}
                  />
                  <Text className="text-[19px] text-[#fb923c] font-semibold">
                    {parseInt(productDetail.price).toLocaleString("en-US")}
                  </Text>
                </View>
              </View>
            </View>
            <View className="w-full h-[1px] bg-gray-300"></View>
            <View className="w-full h-fit px-4 mt-4">
              <Text className="text-[14px] font-semibold mb-2">
                Product Details
              </Text>
              <Text className="text-[13px]">{productDetail.description}</Text>
            </View>
            <View className="w-full h-[4px] bg-gray-300 mt-5"></View>
            <View className="w-full px-4 mt-4">
              <TouchableOpacity
                className="w-full flex-row items-center justify-start"
                onPress={handleShopPress}
              >
                <View className="w-10 h-10 rounded-full border-[0.5px] border-solid border-gray-200">
                  <Image
                    source={{ uri: shopImageUrl }}
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
                    <Text className="ml-4 text-[14px] ml-1 mr-1">
                      {shopName}
                    </Text>
                  </View>
                  <View className="flex-row items-center-justify-start mt-1">
                    <FontAwesomeIcon
                      icon={icons.faLocationDot}
                      size={10}
                      style={{ color: "#ef4444" }}
                    />
                    <Text className="ml-4 text-[10px] ml-1 mr-1">
                      {shopAddress}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View className="w-full h-[4px] bg-gray-300 mt-5"></View>
            <View className="w-full h-fit">
              <View className="w-full h-12 mt-2 border-b-[1px] border-solid border-gray-300 flex-row items-center justify-between px-4">
                <Text className="font-semibold text-[14px]">{`Reviews (${reviews.length})`}</Text>
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
              </View>
              <View className="w-full h-fit">
                {reviews.slice(0, 2).map((review) => (
                  <Review
                    key={review.id}
                    avatar={review.userAvatar}
                    review={review.review}
                    rating={review.rating}
                    username={review.userName}
                  />
                ))}
              </View>
              <TouchableOpacity
                className="w-full h-10 flex-row items-center justify-center mt-1"
                onPress={handleReviewPress}
              >
                <Text className="text-[14px] text-[#f59e0b] mr-1">See all</Text>
                <FontAwesomeIcon
                  icon={icons.faChevronRight}
                  size={12}
                  style={{ color: "#f59e0b" }}
                />
              </TouchableOpacity>
            </View>
            <View className="w-full h-[4px] bg-gray-300 mt-2"></View>
            <View className="w-full px-4 h-fit">
              <View className="w-full flex-row items-center justify-between">
                <Text className="font-semibold text-[14px] mb-2 mt-4">
                  Similar Products
                </Text>
                <TouchableOpacity className="flex-row items-center justify-center mt-1">
                  <Text className="text-[14px] text-[#f59e0b]">(See more)</Text>
                </TouchableOpacity>
              </View>

              <FlashList
                data={similarProducts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View className="ml-1">
                    <ItemCard
                      id={item.id}
                      title={item.name}
                      price={item.price}
                      image={item.image}
                      rating={item.rating}
                      soldUnits={item.sold_quantity}
                      shop={item.shop}
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
            onPress={handleAddToCart}
          >
            <FontAwesomeIcon
              icon={icons.faCartShopping}
              size={14}
              style={{ color: "white" }}
            />
            <Text className="text-white text-[13px] font-semibold ml-1">
              Add to cart
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default ProductDetail;
