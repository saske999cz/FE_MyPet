import { View, Text, TouchableOpacity, Modal } from "react-native";
import React, { useState, useEffect, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../constants";
import { router } from "expo-router";
import CartSectionItem from "./CartSectionItem";
import { useGlobalContext } from "../state/GlobalContextProvider";
import { remove_item_from_cart } from "../api/CartApi";

const CartSection = ({
  id,
  cartId,
  shopImage,
  shopAvatar,
  shopAddress,
  shopName,
  shopPhone,
  shopWebsite,
  shopFanpage,
  shopEstablished,
  shopDescription,
  workTime,
  shopRating,
  items,
  setRemovedShopId,
  setIsCalculating,
}) => {
  const [cartItems, setCartItems] = useState(items);
  const [removedItemId, setRemovedItemId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [removedItemName, setRemovedItemName] = useState(null);
  const [currentItemId, setCurrentItemId] = useState(null);
  const { setCartLength, setCartChanged, setCurrentCartItems } =
    useGlobalContext();

  const handleShopPress = () => {
    router.push({
      pathname: "../screens/Shop",
      params: {
        shopId: id,
        shopName: shopName,
        shopAddress: shopAddress,
        shopAvatar: shopAvatar,
        shopImage: shopImage,
        shopPhone: shopPhone,
        shopWebsite: shopWebsite,
        shopFanpage: shopFanpage,
        shopEstablished: shopEstablished,
        shopDescription: shopDescription,
        workTime: workTime,
        shopRating: shopRating,
      },
    });
  };

  const handleRemoveItem = () => {
    setRemovedItemId(currentItemId);
    setCartLength((prev) => prev - 1);
    setShowModal(false);
  };

  useEffect(() => {
    if (removedItemId !== null) {
      const newCartItems = cartItems.filter(
        (item) => item.id !== removedItemId
      );
      setCartItems(newCartItems);
      setCurrentCartItems(newCartItems.map((item) => item.product_id));
      if (newCartItems.length === 0) {
        setRemovedShopId(id);
      }
      try {
        setIsCalculating(true);
        remove_item_from_cart(removedItemId).then((res) => {
          if (res && res.status === 200) {
            console.log("Item removed from cart:", res.data.message);
            setCartChanged((prev) => !prev);
          } else {
            console.error("Error removing item from cart:", res.data.message);
          }
        });
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    }
  }, [removedItemId]);

  useEffect(() => {
    setCartItems(items);
  }, [items]);

  return (
    <View className="w-full h-fit rounded-md bg-white border-[0.5px] border-solid border-slate-200">
      <TouchableOpacity
        className="w-fit h-8 flex-row items-center justify-start px-2"
        onPress={handleShopPress}
      >
        <FontAwesomeIcon
          icon={icons.faStore}
          size={13}
          style={{ color: "#14b8a6" }}
        />
        <Text className="text-[13px] font-semibold text-black ml-1">
          {shopName}
        </Text>
      </TouchableOpacity>
      <View className="w-full h-fit flex-col py-2">
        {cartItems.map((item) => (
          <View className="w-full h-fit" key={item.id}>
            <CartSectionItem
              id={item.id}
              cartId={cartId}
              setCurrentItemId={setCurrentItemId}
              item={item}
              shopImage={shopImage}
              shopAddress={shopAddress}
              shopAvatar={shopAvatar}
              shopName={shopName}
              setRemovedItemName={setRemovedItemName}
              setShowModal={setShowModal}
              setIsCalculating={setIsCalculating}
            />
          </View>
        ))}
      </View>
      <Modal visible={showModal} animationType="fade" transparent={true}>
        <View className="flex-1 bg-zinc-900/40 opacity-[50] h-full w-full flex-row items-center justify-center">
          <View className="w-56 flex-col h-24 items-center justify-center bg-white rounded-md">
            <View className="w-full h-[45%] flex-row items-center justify-center px-2">
              <Text className="text-[13px] text-gray-600 font-medium">
                Remove "{removedItemName}" from cart?
              </Text>
            </View>
            <View className="w-full h-[45%] flex-row items-center justify-center mt-2 border-t-[1px] border-solid border-gray-300">
              <TouchableOpacity
                className="w-[50%] h-full bg-white flex-row items-center justify-center border-r-[1px] border-solid border-gray-300 rounded-bl-md"
                onPress={() => setShowModal(false)}
              >
                <Text className="text-black text-[13px] font-medium">No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="w-[50%] h-full bg-white flex-row items-center justify-center rounded-br-md"
                onPress={handleRemoveItem}
              >
                <Text className="text-[#f59e0b] text-[13px] font-medium">
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default memo(CartSection);
