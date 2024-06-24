import { View, Text } from "react-native";
import React, { useEffect, useState, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../constants";
import ReviewItem from "./ReviewItem";

const ProductReviewSection = ({ item, type }) => {
  const [displayItems, setDisplayItems] = useState([]);
  useEffect(() => {
    let filteredItems = [];
    const cartItems = item.cart_items;
    if (type === "reviewed") {
      filteredItems = cartItems.filter(
        (cart_item) => cart_item.is_reviewed === true
      );
    } else if (type === "unreviewed") {
      filteredItems = cartItems.filter(
        (cart_item) => cart_item.is_reviewed === false
      );
    } else {
      filteredItems = cartItems.filter(
        (cart_item) => cart_item.shop_responsed === true
      );
    }
    setDisplayItems(filteredItems);
  }, []);

  return (
    <View
      className="w-full h-fit rounded-md bg-white border-[0.5px] border-solid border-slate-200 mb-2 mt-2 px-2"
      key={item.sub_order_id}
    >
      <View className="w-full h-5 flex-row items-center justify-start mb-2 mt-2">
        <FontAwesomeIcon
          icon={icons.faStore}
          size={13}
          style={{ color: "#14b8a6" }}
        />
        <Text className="text-[13px] font-semibold text-black ml-1">
          {item.shop_name}
        </Text>
      </View>
      <View className="w-full h-fit mt-1">
        {displayItems.map((cart_item) => (
          <ReviewItem
            item={cart_item}
            shop={true}
            type={type}
            key={cart_item.id}
          />
        ))}
      </View>
    </View>
  );
};

export default memo(ProductReviewSection);
