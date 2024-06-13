import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { get_current_cart } from "../../api/CartApi";
import LottieView from "lottie-react-native";
import { useGlobalContext } from "../../state/GlobalContextProvider";
import CartSection from "../../components/CartSection";

const Cart = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { cartId, cartChanged, cartLength, setCheckOutItems, quantityChanged } =
    useGlobalContext();
  const [removedShopId, setRemovedShopId] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  const fetchCartItems = async () => {
    try {
      get_current_cart().then((res) => {
        if (res && res.status === 200) {
          setShops([...res.data.shops]);
          setTotalAmount(res.data.cart.total_prices);
          setIsLoading(false);
          setIsCalculating(false);
        } else {
          console.error("Error fetching cart items:", res.data.message);
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, [cartChanged, quantityChanged]);

  const handleBack = () => {
    router.back();
  };

  const handleCheckout = () => {
    const combinedCartItems = shops.reduce((acc, shop) => {
      return acc.concat(shop.cart_items);
    }, []);
    setCheckOutItems(combinedCartItems);
    router.push({
      pathname: "../screens/CheckOut",
      params: {
        totalAmount: totalAmount,
      },
    });
  };

  useEffect(() => {
    if (removedShopId !== null) {
      const newShops = shops.filter((shop) => shop.shop_id !== removedShopId);
      setShops(newShops);
    }
  }, [removedShopId]);

  return (
    <SafeAreaView className="h-full w-full">
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
        <Text className="text-[16px] font-bold">My Cart ({cartLength})</Text>
      </View>
      <View className="w-full h-[1px] bg-gray-200 mb-2"></View>
      {isLoading ? (
        <View className="w-full h-full flex-row items-start justify-center">
          <LottieView
            style={{ width: 130, height: 130, marginTop: 150 }}
            source={require("../../assets/lottie/loading.json")}
            autoPlay
            loop
            speed={1.5}
          />
        </View>
      ) : (
        <FlatList
          scrollEventThrottle={16}
          data={shops}
          renderItem={({ item }) => (
            <View className="w-full h-fit px-2 mt-1 mb-2">
              <CartSection
                id={item.shop_id}
                cartId={cartId}
                items={item.cart_items}
                shopAddress={item.shop_address}
                shopImage={item.shop_image}
                shopAvatar={item.shop_avatar}
                shopName={item.shop_name}
                shopPhone={item.shop_phone}
                shopDescription={item.shop_description}
                shopFanpage={item.shop_fanpage}
                shopWebsite={item.shop_website}
                shopEstablished={item.shop_established}
                workTime={item.shop_work_time}
                shopRating={item.rating}
                setRemovedShopId={setRemovedShopId}
                setIsCalculating={setIsCalculating}
              />
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      {isLoading ? null : (
        <View className="w-full h-12 flex-row items-center justify-between border-t-[1px] border-solid border-gray-300 mb-5">
          <Text className="text-[16px] font-semibold ml-2">Total</Text>
          <View className="w-[80%] h-full flex-row items-center justify-end">
            {isCalculating ? (
              <View className="w-[60%] h-full flex-row items-center justify-end px-4">
                <LottieView
                  style={{ width: 40, height: 40, marginTop: 3 }}
                  source={require("../../assets/lottie/cartLoading.json")}
                  autoPlay
                  loop
                  speed={1.5}
                />
              </View>
            ) : (
              <View className="w-[60%] h-full flex-row items-center justify-end px-4">
                <FontAwesomeIcon
                  icon={icons.faDongSign}
                  size={13}
                  style={{ color: "#f59e0b" }}
                />
                <Text className="text-[16px] font-bold text-[#f59e0b]">
                  {parseInt(totalAmount).toLocaleString("vi-VN")}
                </Text>
              </View>
            )}
            <TouchableOpacity
              className="w-[40%] h-full bg-[#f59e0b] flex-row items-center justify-center"
              onPress={handleCheckout}
            >
              <Text className="text-[15px] font-semibold text-white">
                Checkout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Cart;
