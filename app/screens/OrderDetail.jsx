import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { FlashList } from "@shopify/flash-list";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { router } from "expo-router";
import { OrdersDummy, ItemDummy } from "../../dummy/FakeData";
import { useLocalSearchParams } from "expo-router";
import OrderItemCard from "../../components/OrderItemCard";
import { formatVND } from "../../utils/currencyFormater";

const OrderDetail = () => {
  const { orderId } = useLocalSearchParams();
  const handleBack = () => {
    router.back();
  };
  const [order, setOrder] = useState(null);
  useEffect(() => {
    const order = OrdersDummy.find((order) => order.orderId === orderId);
    setOrder(order);
  }, []);
  return (
    <SafeAreaView>
      <View className="w-full h-12 flex-row items-center justify-center mb-2 border-b-[0.5px] border-solid border-gray-300">
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
        <Text className="font-bold text-[16px]">Order Detail</Text>
      </View>
      {order && (
        <ScrollView>
          <View className="w-full h-52 flex-col items-center justify-start mt-2">
            <View className="w-full h-24 flex-col items-center justify-start px-4">
              <View className="w-full h-5 flex-row items-center justify-start">
                <FontAwesomeIcon
                  icon={icons.faTruckFast}
                  size={17}
                  style={{ color: "#f59e0b" }}
                />
                <Text className="text-[14px] font-semibold ml-3">
                  Order Information
                </Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start">
                <Text className="text-[13px] ml-7">{order.orderId}</Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start">
                <Text className="text-[13px] ml-7">{order.orderDate}</Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start">
                <Text
                  className={`text-[13px] ml-7 mr-1 ${
                    order.status === "Delivered"
                      ? "text-[#16a34a]"
                      : "text-black"
                  }`}
                >
                  {order.status}
                </Text>
                <FontAwesomeIcon
                  icon={
                    order.status === "Processing"
                      ? icons.faEllipsis
                      : icons.faCircleCheck
                  }
                  size={13}
                  style={{
                    color:
                      order.status === "Processing" ? "#94a3b8" : "#10b981",
                    marginTop: 1,
                  }}
                />
              </View>
            </View>
            <View className="w-full h-24 flex-col items-center justify-start px-4">
              <View className="w-full h-5 flex-row items-center justify-start">
                <FontAwesomeIcon
                  icon={icons.faLocationDot}
                  size={17}
                  style={{ color: "#f59e0b" }}
                />
                <Text className="text-[14px] font-semibold ml-3">
                  Shipping Detail
                </Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start">
                <Text className="text-[13px] ml-7">{order.customer.name}</Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start">
                <Text className="text-[13px] ml-7">{order.customer.phone}</Text>
              </View>
              <View className="w-full h-5 flex-row items-center justify-start">
                <Text className="text-[13px] ml-7">
                  {order.customer.address}
                </Text>
              </View>
            </View>
            <View className="w-full h-2 bg-gray-200"></View>
          </View>
          <View className="w-full h-fit mt-1">
            <View className="w-full h-4 flex-row items-center justify-start px-4 mb-3">
              <FontAwesomeIcon
                icon={icons.faBox}
                size={17}
                style={{ color: "#f59e0b" }}
              />
              <Text className="text-[14px] font-semibold ml-3">
                Order Items
              </Text>
            </View>
            {order.items.map((item) => (
              <OrderItemCard
                key={item.id}
                name={item.name}
                image={item.image}
                price={item.price}
                quantity={item.quantity}
              />
            ))}
          </View>
          <View className="w-full h-20 flex-col mt-4">
            <View className="w-full h-6 flex-row items-center justify-between px-4">
              <Text className="text-[13px]">SubTotal</Text>
              <Text className="text-[13px]">{formatVND(order.subtotal)}</Text>
            </View>
            <View className="w-full h-6 flex-row items-center justify-between px-4">
              <Text className="text-[13px]">Shipping Fee</Text>
              <Text className="text-[13px]">
                {formatVND(order.shippingFee)}
              </Text>
            </View>
            <View className="w-full h-6 flex-row items-center justify-between px-4">
              <Text className="text-[13px] font-semibold">Total</Text>
              <Text className="text-[13px] font-semibold">
                {formatVND(order.total)}
              </Text>
            </View>
          </View>
          <View className="w-full h-2 bg-gray-200 mt-1"></View>
          <View className="w-full h-16 flex-col items-center justify-center px-4">
            <View className="w-full h-fit flex-row items-center justify-start">
              <FontAwesomeIcon
                icon={icons.faCreditCard}
                size={17}
                style={{ color: "#f59e0b" }}
              />
              <Text className="text-[14px] font-semibold ml-3">
                Payment Method
              </Text>
            </View>
            <View className="w-full h-fit flex-row items-center justify-start ml-6 px-4 mt-1">
              <Text className="text-[13px]">{order.paymentMethod}</Text>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default OrderDetail;
