import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { router } from "expo-router";
import { get_adopt_request } from "../../api/AdoptApi";
import LottieView from "lottie-react-native";

const MyAdoptionRequest = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [filter, setFilter] = useState("All");

  const handleBack = () => {
    router.back();
  };

  const handleOpenOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  const handleRequestPress = (requestId) => {
    router.push({
      pathname: "../screens/AdoptionRequestDetail",
      params: {
        requestId: requestId,
      },
    });
  };

  const handleLoadMore = () => {
    if (page <= maxPage) setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    if (filter === "All") {
      setIsLoading(true);
      setRequests([]);
      if (page !== 1) setPage(1);
      get_adopt_request(page, 15).then((res) => {
        if (res && res.status === 200) {
          const fetchedRequests = res.data.data;
          const newRequests = [...requests, ...fetchedRequests];
          const uniqueRequests = newRequests.reduce((unique, request) => {
            if (!unique.find((item) => item.id === request.id)) {
              unique.push(request);
            }
            return unique;
          }, []);
          setMaxPage(res.data.total_pages);
          setRequests(uniqueRequests);
          setIsLoading(false);
        }
      });
    } else if (filter === "Done") {
      setIsLoading(true);
      setRequests([]);
      if (page !== 1) setPage(1);
      get_adopt_request(page, 30).then((res) => {
        if (res && res.status === 200) {
          const fetchedRequests = res.data.data;
          const newRequests = [...requests, ...fetchedRequests];
          const uniqueRequests = newRequests.reduce((unique, request) => {
            if (!unique.find((item) => item.id === request.id)) {
              unique.push(request);
            }
            return unique;
          }, []);
          setMaxPage(res.data.total_pages);
          setRequests(
            uniqueRequests.filter((request) => request.status === "Done")
          );
          if (
            uniqueRequests.filter((request) => request.status === "Done")
              .length === 0
          ) {
            handleLoadMore();
          } else {
            setIsLoading(false);
          }
          if (page >= maxPage) setIsLoading(false);
        }
      });
    } else if (filter === "Pending") {
      setIsLoading(true);
      setRequests([]);
      if (page !== 1) setPage(1);
      get_adopt_request(page, 30).then((res) => {
        if (res && res.status === 200) {
          const fetchedRequests = res.data.data;
          const newRequests = [...requests, ...fetchedRequests];
          const uniqueRequests = newRequests.reduce((unique, request) => {
            if (!unique.find((item) => item.id === request.id)) {
              unique.push(request);
            }
            return unique;
          }, []);
          setMaxPage(res.data.total_pages);
          setRequests(
            uniqueRequests.filter((request) => request.status === "Pending")
          );
          if (
            uniqueRequests.filter((request) => request.status === "Pending")
              .length === 0
          ) {
            handleLoadMore();
          } else {
            setIsLoading(false);
          }
          if (page >= maxPage) setIsLoading(false);
        }
      });
    } else if (filter === "Approved") {
      setIsLoading(true);
      setRequests([]);
      if (page !== 1) setPage(1);
      get_adopt_request(page, 30).then((res) => {
        if (res && res.status === 200) {
          const fetchedRequests = res.data.data;
          const newRequests = [...requests, ...fetchedRequests];
          const uniqueRequests = newRequests.reduce((unique, request) => {
            if (!unique.find((item) => item.id === request.id)) {
              unique.push(request);
            }
            return unique;
          }, []);
          setMaxPage(res.data.total_pages);
          setRequests(
            uniqueRequests.filter((request) => request.status === "Approved")
          );
          if (
            uniqueRequests.filter((request) => request.status === "Approved")
              .length === 0
          ) {
            handleLoadMore();
          } else {
            setIsLoading(false);
          }
          if (page >= maxPage) setIsLoading(false);
        }
      });
    }
  }, [filter]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        get_adopt_request(page, 30).then((res) => {
          if (res && res.status === 200) {
            const fetchedRequests = res.data.data;
            const newRequests = [...requests, ...fetchedRequests];
            const uniqueRequests = newRequests.reduce((unique, request) => {
              if (!unique.find((item) => item.id === request.id)) {
                unique.push(request);
              }
              return unique;
            }, []);

            setMaxPage(res.data.total_pages);
            if (filter === "All") {
              setRequests(uniqueRequests);
            } else if (filter === "Done") {
              setRequests(
                uniqueRequests.filter((request) => request.status === "Done")
              );
            } else if (filter === "Pending") {
              setRequests(
                uniqueRequests.filter((request) => request.status === "Pending")
              );
            } else if (filter === "Approved") {
              setRequests(
                uniqueRequests.filter(
                  (request) => request.status === "Approved"
                )
              );
            }
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchRequests();
  }, [page]);

  return (
    <SafeAreaView className="h-full w-full">
      <View className="w-full h-12 flex-row items-center justify-center border-b-[0.5px] border-solid border-gray-300 z-[12]">
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
        <Text className="font-bold text-[16px]">My Requests</Text>
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
          <View className="w-32 h-36 flex-col items-start justify-start bg-white rounded-md absolute right-0 top-0 mt-10 mr-2">
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
                setFilter("Approved");
              }}
            >
              <Text className="text-[13px] font-semibold mr-2">Approved</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-full h-6 flex-row items-center justify-start mt-2 px-6"
              onPress={() => {
                setFilter("Pending");
              }}
            >
              <Text className="text-[13px] font-semibold mr-2">Pending</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {isLoading ? (
        <View className="w-full h-full flex-row items-start justify-center">
          <LottieView
            style={{ width: 120, height: 120, marginTop: 150 }}
            source={require("../../assets/lottie/loading.json")}
            autoPlay
            loop
            speed={2}
          />
        </View>
      ) : (
        requests &&
        requests.length > 0 && (
          <FlatList
            data={requests}
            renderItem={({ item }) => {
              const date = new Date(item.created_at);
              const time = `${date
                .getHours()
                .toString()
                .padStart(2, "0")}:${date
                .getMinutes()
                .toString()
                .padStart(2, "0")}`;
              return (
                <TouchableOpacity
                  className="w-full h-12 flex-row items-center justify-start px-6 mt-4 mb-4"
                  onPress={() => handleRequestPress(item.id)}
                >
                  <View className="w-[30%] h-12 flex-col">
                    <View className="w-full flex-row items-center justify-start">
                      <Text className="text-[13px] font-semibold">
                        {new Date(item.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Text>
                    </View>
                    <View className="w-full flex-row items-center justify-start mt-2">
                      <FontAwesomeIcon
                        icon={
                          item.status === "Pending"
                            ? icons.faClock
                            : item.status === "Approved"
                            ? icons.faFlag
                            : icons.faCircleCheck
                        }
                        size={13}
                        style={{
                          color: `${
                            item.status === "Done"
                              ? "#22c55e"
                              : item.status === "Approved"
                              ? "#3b82f6"
                              : "#94a3b8"
                          }`,
                        }}
                      />
                      <Text
                        className={`text-[13px] ml-1 ${
                          item.status === "Done"
                            ? "text-green-500 font-semibold"
                            : item.status === "Approved"
                            ? "text-blue-500 font-semibold"
                            : "text-black"
                        }`}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </View>
                  <View className="w-[70%] h-12 flex-col">
                    <View className="w-full flex-row items-center justify-start">
                      <Text className="text-[13px] font-semibold">
                        {item.aid_center_name}
                      </Text>
                    </View>
                    <View className="w-full flex-row items-center justify-start mt-2">
                      <Text className="text-[13px]">{item.pet_name}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.id}
            estimatedItemSize={30}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
          />
        )
      )}
    </SafeAreaView>
  );
};

export default MyAdoptionRequest;
