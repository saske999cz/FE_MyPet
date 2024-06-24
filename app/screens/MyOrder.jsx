import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { router } from "expo-router";
import { get_orders } from "../../api/Order";
import LottieView from "lottie-react-native";
import { set } from "date-fns";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [tempOrders, setTempOrders] = useState([]);

  const handleBack = () => {
    router.back();
  };

  const handleOpenOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const getOrderStatus = (suborders) => {
    let status = "Done";
    suborders.forEach((suborder) => {
      if (suborder.status !== "Done") {
        status = "Processing";
      }
    });
    return status;
  };

  const handleOrderDetail = (orderId) => {
    router.push({
      pathname: "../screens/OrderDetail",
      params: {
        orderId: orderId,
      },
    });
  };

  useEffect(() => {
    setIsLoading(true);
    if (filter === "All") {
      setOrders(tempOrders);
      setIsLoading(false);
    } else if (filter === "Done") {
      const filteredOrders = orders.filter((order) => order.status === "Done");
      setOrders(filteredOrders);
      setIsLoading(false);
    } else if (filter === "Processing") {
      const filteredOrders = orders.filter(
        (order) => order.status === "Processing"
      );
      setOrders(filteredOrders);
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    try {
      get_orders().then((res) => {
        if (res && res.status === 200) {
          setOrders([...res.data.data]);
          setTempOrders([...res.data.data]);
          setIsLoading(false);
        } else {
          console.error("Error fetching orders:", res.data.message);
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, []);

  return (
    <SafeAreaView className="h-full w-full">
      <View className="w-full h-12 flex-row items-center justify-center mb-2 border-b-[0.5px] border-solid border-gray-300 z-[12]">
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
        <Text className="font-bold text-[16px]">My Orders</Text>
        <TouchableOpacity
          className="w-[25px] h-[25px] flex-row items-center justify-center absolute top-0 right-0 mr-5 mt-[12px] rounded-full"
          onPress={handleOpenOptions}
        >
          <FontAwesomeIcon
            icon={icons.faFilter}
            size={20}
            style={{ color: "#f59e0b" }}
          />
        </TouchableOpacity>
        {isOptionsOpen && (
          <View className="w-32 h-28 flex-col items-start justify-start bg-white rounded-md absolute right-0 top-0 mt-10 mr-2">
            <TouchableOpacity
              className="w-full h-6 flex-row items-center justify-start mt-2 px-6"
              onPress={() => {
                setFilter("All");
              }}
            >
              <Text className="text-[13px] font-semibold  mr-2">All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-full h-6 flex-row items-center justify-start mt-2 px-6"
              onPress={() => {
                setFilter("Done");
              }}
            >
              <Text className="text-[13px] font-semibold  mr-2">Done</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-full h-6 flex-row items-center justify-start mt-2 px-6"
              onPress={() => {
                setFilter("Processing");
              }}
            >
              <Text className="text-[13px] font-semibold mr-2">Processing</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {isLoading ? (
        <View className="w-full h-full flex-row items-start justify-center">
          <LottieView
            style={{ width: 130, height: 130, marginTop: 150 }}
            source={require("../../assets/lottie/loading.json")}
            autoPlay
            loop
            speed={2}
          />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="w-full h-12 flex-row items-center justify-start px-6 mt-4 mb-4"
              onPress={() => handleOrderDetail(item.id)}
              key={item.id}
            >
              <View className="w-[30%] h-12 flex-col">
                <View className="w-full flex-row items-center justify-start">
                  <FontAwesomeIcon
                    icon={icons.faTruckFast}
                    size={15}
                    style={{ color: "#f59e0b" }}
                  />
                  <Text className="text-[13px] font-semibold ml-1">
                    OrderID: {item.id}
                  </Text>
                </View>
                <View className="w-full flex-row items-center justify-start mt-2">
                  <Text className="text-[13px] ml-1">
                    {formatDate(item.created_at)}
                  </Text>
                </View>
              </View>
              <View className="w-[70%] h-12 flex-col px-2">
                <View className="w-full flex-row items-center justify-start">
                  <Text className="text-[13px] font-semibold">
                    {item.transaction_order_id}
                  </Text>
                </View>
                <View className="w-full flex-row items-center justify-start mt-2">
                  <Text className="text-[13px] mr-1">
                    {getOrderStatus(item.sub_orders)}
                  </Text>
                  <FontAwesomeIcon
                    icon={
                      getOrderStatus(item.sub_orders) === "Done"
                        ? icons.faCircleCheck
                        : icons.faClockRotateLeft
                    }
                    size={12}
                    style={{
                      color: `${
                        getOrderStatus(item.sub_orders) === "Done"
                          ? "#22c55e"
                          : "#06b6d4"
                      }`,
                      marginTop: 2,
                    }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </SafeAreaView>
  );
};

export default MyOrder;
