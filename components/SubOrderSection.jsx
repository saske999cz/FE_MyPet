import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../constants";
import { router } from "expo-router";
import SubOrderSectionItem from "./SubOrderSectionItem";
import { formatVND } from "../utils/currencyFormater";

const SubOrderSection = ({
  id,
  status,
  subTotalAmount,
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
}) => {
  const [currentItems, setCurrentItems] = useState(items.slice(0, 3));
  const [isShowingAll, setIsShowingAll] = useState(false);

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

  const handleShowAll = () => {
    if (isShowingAll) {
      setCurrentItems(items);
    } else {
      setCurrentItems(items.slice(0, 3));
    }
    setIsShowingAll((prev) => !prev);
  };

  return (
    <View className="w-full h-fit rounded-md bg-white border-[0.5px] border-solid border-slate-200">
      <View className="w-full h-8 flex-row items-center justify-between">
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
        <View className="w-24 h-8 flex-row items-center justify-end mr-2">
          <Text
            className={`text-[13px] mr-1 font-semibold ${
              status === "Done" ? "text-green-700" : "text-black"
            }`}
          >
            {status}
          </Text>
          <FontAwesomeIcon
            icon={
              status === "Done"
                ? icons.faCircleCheck
                : status === "Delivering"
                ? icons.faTruckFast
                : status === "Paid"
                ? icons.faMoneyCheckDollar
                : icons.faHammer
            }
            size={13}
            style={{
              color: `${
                status === "Done"
                  ? "#22c55e"
                  : status === "Delivering"
                  ? "#f59e0b"
                  : "#06b6d4"
              }`,
            }}
          />
        </View>
      </View>
      <View className="w-full h-fit flex-col py-2">
        {currentItems.map((item) => (
          <View className="w-full h-fit" key={item.id}>
            <SubOrderSectionItem
              item={item}
              shopImage={shopImage}
              shopAddress={shopAddress}
              shopAvatar={shopAvatar}
              shopName={shopName}
            />
          </View>
        ))}
        {items.length > 3 && (
          <View className="w-full h-12 flex-row items-center justify-center mt-2">
            <TouchableOpacity
              className="w-full h-full flex-row items-center justify-center"
              onPress={handleShowAll}
            >
              <Text className="text-[13px] text-amber-500">
                {isShowingAll ? "Show less" : "Show all"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View className="w-full h-12 border-t-[0.5px] border-solid border-gray-300 flex-row items-center justify-between px-[11px]">
        <Text className="text-[13px] font-semibold">SubTotal:</Text>
        <Text className="text-[13px] font-semibold">
          {formatVND(subTotalAmount)}
        </Text>
      </View>
    </View>
  );
};

export default memo(SubOrderSection);
