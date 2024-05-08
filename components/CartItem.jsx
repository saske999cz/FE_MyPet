import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../constants";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { setGlobalState } from "../state/GlobalState";

const CartItem = ({ id, image, title, rating, price, soldUnits, shop }) => {
  const [showModal, setShowModal] = useState(false);
  const handlePress = () => {
    router.push({
      pathname: "../screens/ProductDetail",
      params: {
        id: id,
        title: title,
        rating: rating,
        price: price,
        soldUnits: soldUnits,
        shop: shop,
        image: image,
      },
    });
  };
  const updateData = async (key) => {
    try {
      const existingData = await AsyncStorage.getItem(key);
      if (existingData !== null) {
        const parsedExistingData = JSON.parse(existingData);
        const updatedData = parsedExistingData - 1;
        await AsyncStorage.setItem(key, JSON.stringify(updatedData));
      } else {
        await AsyncStorage.setItem(key, JSON.stringify(0));
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      const existingData = await AsyncStorage.getItem("cartItems");
      if (existingData !== null) {
        const parsedExistingData = JSON.parse(existingData);
        const updatedData = parsedExistingData.filter(
          (cartItem) => parseInt(cartItem.id) !== id
        );
        await AsyncStorage.setItem("cartItems", JSON.stringify(updatedData));
        setGlobalState("cartStatus", true);
        setGlobalState("toastStatus", true);
        setGlobalState("removedCartItem", title);
        setShowModal(false);
        updateData("cartLength");
      } else {
        await AsyncStorage.setItem("cartItems", JSON.stringify([]));
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };
  const [itemCount, setItemCount] = useState(1);
  const handleIncrease = () => {
    setItemCount(itemCount + 1);
  };
  const handleDecrease = () => {
    if (itemCount === 1) setShowModal(true);
    else setItemCount(itemCount - 1);
  };

  return (
    <TouchableOpacity
      className="w-full h-24 flex-row items-center justify-start mb-1 mt-1 bg-white border-[0.5px] border-solid border-gray-200"
      onPress={handlePress}
    >
      <View className="w-[25%] h-full">
        <Image source={image} className="w-full h-full" />
      </View>
      <View className="w-[75%] h-full flex-row px-4 py-2">
        <View className="w-[80%] h-full flex-col items-start justify-between">
          <Text className="text-[13px] mb-1 mt-2">{title}</Text>
          <View className="w-full flex-col items-start justify-center">
            <View className="flex-row items-center justify-start mb-2">
              <FontAwesomeIcon
                icon={icons.faDongSign}
                size={13}
                style={{ color: "#f59e0b" }}
              />
              <Text className="text-[15px] text-[#fb923c] font-bold">
                {parseInt(price).toLocaleString("en-US")}
              </Text>
            </View>
            <View className="w-20 h-5 flex-row items-center justify-around border-[0.5px] border-solid border-gray-300">
              <TouchableOpacity
                className="w-5 h-full flex-row items-center bg-white justify-center border-r-[0.5px] border-solid border-gray-300"
                onPress={handleDecrease}
              >
                <FontAwesomeIcon
                  icon={icons.faMinus}
                  size={12}
                  style={{ color: "#6b7280" }}
                />
              </TouchableOpacity>
              <View className="flex-1 bg-white items-center justify-center">
                <Text>{itemCount}</Text>
              </View>
              <TouchableOpacity
                className="w-5 h-full flex-row items-center justify-center bg-white border-l-[0.5px] border-solid border-gray-300"
                onPress={handleIncrease}
              >
                <FontAwesomeIcon
                  icon={icons.faPlus}
                  size={12}
                  style={{ color: "#6b7280" }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="w-[20%] h-full flex-row items-center justify-center">
          <TouchableOpacity
            className="w-full h-20 flex-row items-center justify-center"
            onPress={() => setShowModal(true)}
          >
            <FontAwesomeIcon
              icon={icons.faTrashCan}
              size={18}
              style={{ color: "#ef4444" }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Modal visible={showModal} animationType="fade" transparent={true}>
        <TouchableOpacity
          className="flex-1 bg-zinc-900/40 opacity-[50] h-full w-full flex-row items-center justify-center"
          onPress={() => setShowModal(false)}
        >
          <View className="w-56 flex-col h-24 items-center justify-center bg-white rounded-md">
            <View className="w-full h-[45%] flex-row items-center justify-center">
              <Text className="text-[13px] text-gray-600">
                Remove "{title}" from cart?
              </Text>
            </View>
            <View className="w-full h-[45%] flex-row items-center justify-center mt-2 border-t-[1px] border-solid border-gray-300">
              <TouchableOpacity
                className="w-[50%] h-full bg-white flex-row items-center justify-center border-r-[1px] border-solid border-gray-300 rounded-bl-md"
                onPress={() => setShowModal(false)}
              >
                <Text className="text-black text-[13px]">No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="w-[50%] h-full bg-white flex-row items-center justify-center rounded-br-md"
                onPress={() => handleRemoveItem(id)}
              >
                <Text className="text-[#f59e0b] text-[13px]">Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
  );
};

export default CartItem;
