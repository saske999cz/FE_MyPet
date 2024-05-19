import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { images } from "../../constants";
import { router } from "expo-router";
import CartItem from "../../components/CartItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalState, setGlobalState } from "../../state/GlobalState";
import Toast from "react-native-toast-message";

const Cart = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("posts");
  const [cartItems, setCartItems] = useState([]);
  const cartStatus = useGlobalState("cartStatus");
  const toastStatus = useGlobalState("toastStatus");
  const removedCartItem = useGlobalState("removedCartItem");

  const onRefresh = async () => {
    setRefreshing(true);
    // fetch data
    setRefreshing(false);
  };

  const fetchCartItems = async () => {
    try {
      const cartItems = await AsyncStorage.getItem("cartItems");
      if (cartItems !== null) {
        setCartItems(JSON.parse(cartItems));
      }
      setGlobalState("cartStatus", false);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [cartStatus[0]]);

  useEffect(() => {
    if (toastStatus[0] === true) {
      setTimeout(() => {
        Toast.show({
          type: "success",
          text1: "Cart item removed!",
          text2: removedCartItem[0] + " has been removed from your cart",
          visibilityTime: 3000,
        });
      }, 100);
    }
    setTimeout(() => {
      setGlobalState("toastStatus", false);
    }, 2000);
  }, [toastStatus[0]]);

  const handleBack = () => {
    router.back();
  };

  const handleCheckout = () => {
    router.push("../screens/CheckOut");
  };
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
        <Text className="text-[16px] font-bold">
          My Cart ({cartItems.length})
        </Text>
      </View>
      <View className="w-full h-[1px] bg-gray-200 mb-2"></View>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItem
            id={parseInt(item.id)}
            image={item.image}
            title={item.title}
            rating={item.rating}
            price={item.price}
            soldUnits={item.soldUnits}
            shop={item.shop}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <View className="w-full h-12 flex-row items-center justify-between border-t-[1px] border-solid border-gray-300 mb-5">
        <Text className="text-[16px] font-semibold ml-2">Total</Text>
        <View className="w-[80%] h-full flex-row items-center justify-end">
          <View className="w-[60%] h-full flex-row items-center justify-end px-4">
            <FontAwesomeIcon
              icon={icons.faDongSign}
              size={13}
              style={{ color: "#f59e0b" }}
            />
            <Text className="text-[16px] font-bold text-[#f59e0b]">
              {cartItems.reduce((acc, item) => {
                return acc + parseInt(item.price);
              }, 0)}
            </Text>
          </View>
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
      <View style={{ position: "absolute", top: 20, left: 20, right: 20 }}>
        <Toast />
      </View>
    </SafeAreaView>
  );
};

export default Cart;
