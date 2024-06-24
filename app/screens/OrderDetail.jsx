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
import { useLocalSearchParams } from "expo-router";
import SubOrderSection from "../../components/SubOrderSection";
import { formatVND } from "../../utils/currencyFormater";
import { get_order_detail } from "../../api/Order";
import LottieView from "lottie-react-native";

const OrderDetail = () => {
  const { orderId } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [shops, setShops] = useState([]);
  const [initialAmount, setInitialAmount] = useState(0);
  const [order, setOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {};

  const handleBack = () => {
    router.back();
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const getOrderStatus = (subOrders) => {
    let status = "Done";
    for (let i = 0; i < subOrders.length; i++) {
      if (subOrders[i].status !== "Done") {
        status = "Processing";
        break;
      }
    }
    return status;
  };

  useEffect(() => {
    try {
      get_order_detail(orderId).then((res) => {
        if (res && res.status === 200) {
          setShops([...res.data.data.shops]);
          setOrder(res.data.data);
          setOrderStatus(getOrderStatus(res.data.data.shops));
          setInitialAmount(res.data.data.total_prices);
          setIsLoading(false);
        } else {
          console.error("Error fetching order detail:", res.data.message);
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.error("Error fetching order detail:", error);
    }
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
        <View className="w-full h-fit pb-28">
          <FlatList
            scrollEventThrottle={16}
            data={shops}
            renderItem={({ item }) => (
              <View className="w-full h-fit px-2 mt-1 mb-2">
                <SubOrderSection
                  id={item.shop_id}
                  status={item.status}
                  subTotalAmount={item.sub_total_amount}
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
                />
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListHeaderComponent={() => (
              <View className="w-full h-fit flex-col">
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
                    <View className="w-full h-6 flex-row items-center justify-start">
                      <Text className="text-[13px] ml-7">
                        ID: {order.order_id}
                      </Text>
                    </View>
                    <View className="w-full h-6 flex-row items-center justify-start">
                      <Text className="text-[13px] ml-7">
                        {formatDate(order.created_at)}
                      </Text>
                    </View>
                    <View className="w-full h-6 flex-row items-center justify-start">
                      <Text
                        className={`text-[13px] ml-7 mr-1 ${
                          orderStatus === "Done"
                            ? "text-[#16a34a]"
                            : "text-black"
                        }`}
                      >
                        Status: {orderStatus}
                      </Text>
                      <FontAwesomeIcon
                        icon={
                          orderStatus === "Processing"
                            ? icons.faEllipsis
                            : icons.faCircleCheck
                        }
                        size={13}
                        style={{
                          color:
                            orderStatus === "Processing"
                              ? "#94a3b8"
                              : "#10b981",
                          marginTop: 1,
                        }}
                      />
                    </View>
                  </View>
                  <View className="w-full h-24 flex-col items-center justify-start px-4 mt-1">
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
                    <View className="w-full h-6 flex-row items-center justify-start mt-[1px]">
                      <Text className="text-[13px] ml-7">
                        {order.full_name}
                      </Text>
                    </View>
                    <View className="w-full h-6 flex-row items-center justify-start">
                      <Text className="text-[13px] ml-7">{order.email}</Text>
                    </View>
                    <View className="w-full h-6 flex-row items-center justify-start">
                      <Text className="text-[13px] ml-7">{order.address}</Text>
                    </View>
                  </View>
                </View>
                <View className="w-full h-2 bg-gray-200 mb-2"></View>
                <View className="w-full h-30 flex-col">
                  <View className="w-full h-6 flex-row items-center justify-start px-4">
                    <FontAwesomeIcon
                      icon={icons.faReceipt}
                      size={17}
                      style={{ color: "#f59e0b" }}
                    />
                    <Text className="text-[14px] font-semibold ml-3">
                      Receipt Information
                    </Text>
                  </View>
                  <View className="w-full h-6 flex-row items-center justify-between px-4">
                    <Text className="text-[13px] ml-7">Initial Amount</Text>
                    <Text className="text-[13px]">
                      {formatVND(initialAmount)}
                    </Text>
                  </View>
                  <View className="w-full h-6 flex-row items-center justify-between px-4">
                    <Text className="text-[13px] ml-7">Transaction Fee</Text>
                    <Text className="text-[13px]">
                      {formatVND(initialAmount * 0.04 + 0.5 * 25400)}
                    </Text>
                  </View>
                  <View className="w-full h-6 flex-row items-center justify-between px-4">
                    <Text className="text-[13px] ml-7">Shipping Fee</Text>
                    <Text className="text-[13px]">
                      {formatVND(30000 * shops.length)}
                    </Text>
                  </View>
                  <View className="w-full h-6 flex-row items-center justify-between px-4">
                    <Text className="text-[13px] font-semibold ml-7">
                      Total
                    </Text>
                    <Text className="text-[13px] font-semibold">
                      {formatVND(
                        initialAmount +
                          initialAmount * 0.04 +
                          0.5 * 25400 +
                          30000 * shops.length
                      )}
                    </Text>
                  </View>
                </View>
                <View className="w-full h-2 bg-gray-200 mt-1"></View>
                <View className="w-full h-20 flex-col items-center justify-center px-4">
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
                  <View className="w-full h-fit flex-col items-start justify-center ml-6 px-4 mt-[6px]">
                    <Text className="text-[13px]">{order.payment_method}</Text>
                    <Text className="text-[13px] mt-[6px]">
                      Transaction: {order.transaction_order_id}
                    </Text>
                  </View>
                </View>
                <View className="w-full h-2 bg-gray-200 mt-1 mb-2"></View>
                <View className="w-full h-6 flex-row items-center justify-start px-4 mb-2">
                  <FontAwesomeIcon
                    icon={icons.faBoxesStacked}
                    size={17}
                    style={{ color: "#f59e0b" }}
                  />
                  <Text className="text-[14px] font-semibold ml-3">
                    Sub-Orders
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default OrderDetail;
