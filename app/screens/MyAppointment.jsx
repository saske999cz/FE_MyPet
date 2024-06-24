import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { router } from "expo-router";
import { get_appointments } from "../../api/AppointmentApi";
import LottieView from "lottie-react-native";

const MyAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("All");
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [maxPage, setMaxPage] = useState(1);

  const handleBack = () => {
    router.back();
  };
  const handleAppointmentPress = (appointmentId) => {
    router.push({
      pathname: "../screens/AppointmentDetail",
      params: {
        appointmentId: appointmentId,
      },
    });
  };

  const handleOpenOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  useEffect(() => {
    if (filter === "All") {
      setIsLoading(true);
      setAppointments([]);
      if (page !== 1) setPage(1);
      get_appointments(page, 15).then((res) => {
        if (res && res.status === 200) {
          const fetchedAppointments = res.data.data;
          const newAppointments = [...appointments, ...fetchedAppointments];
          const uniqueAppointments = newAppointments.reduce(
            (unique, appointment) => {
              if (
                !unique.find(
                  (item) => item.appointment_id === appointment.appointment_id
                )
              ) {
                unique.push(appointment);
              }
              return unique;
            },
            []
          );
          setMaxPage(res.data.total_pages);
          setAppointments(uniqueAppointments);
          setIsLoading(false);
        }
      });
    } else if (filter === "Done") {
      setIsLoading(true);
      setAppointments([]);
      if (page !== 1) setPage(1);
      get_appointments(page, 30).then((res) => {
        if (res && res.status === 200) {
          const fetchedAppointments = res.data.data;
          const newAppointments = [...appointments, ...fetchedAppointments];
          const uniqueAppointments = newAppointments.reduce(
            (unique, appointment) => {
              if (
                !unique.find(
                  (item) => item.appointment_id === appointment.appointment_id
                )
              ) {
                unique.push(appointment);
              }
              return unique;
            },
            []
          );
          setMaxPage(res.data.total_pages);
          setAppointments(
            uniqueAppointments.filter((appointment) => appointment.done === 1)
          );
          if (
            uniqueAppointments.filter((appointment) => appointment.done === 1)
              .length === 0
          ) {
            handleLoadMore();
          } else {
            setIsLoading(false);
          }
          if (page >= maxPage) setIsLoading(false);
        }
      });
    } else if (filter === "Waiting") {
      setIsLoading(true);
      setAppointments([]);
      if (page !== 1) setPage(1);
      get_appointments(page, 30).then((res) => {
        if (res && res.status === 200) {
          const fetchedAppointments = res.data.data;
          const newAppointments = [...appointments, ...fetchedAppointments];
          const uniqueAppointments = newAppointments.reduce(
            (unique, appointment) => {
              if (
                !unique.find(
                  (item) => item.appointment_id === appointment.appointment_id
                )
              ) {
                unique.push(appointment);
              }
              return unique;
            },
            []
          );
          setMaxPage(res.data.total_pages);
          setAppointments(
            uniqueAppointments.filter((appointment) => appointment.done === 0)
          );
          if (
            uniqueAppointments.filter((appointment) => appointment.done === 0)
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

  const handleLoadMore = () => {
    if (page < maxPage) setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        get_appointments(page, 30).then((res) => {
          if (res && res.status === 200) {
            const fetchedAppointments = res.data.data;
            const newAppointments = [...appointments, ...fetchedAppointments];
            const uniqueAppointments = newAppointments.reduce(
              (unique, appointment) => {
                if (
                  !unique.find(
                    (item) => item.appointment_id === appointment.appointment_id
                  )
                ) {
                  unique.push(appointment);
                }
                return unique;
              },
              []
            );
            setMaxPage(res.data.total_pages);
            if (filter === "All") {
              setAppointments(uniqueAppointments);
            } else if (filter === "Done") {
              setAppointments(
                uniqueAppointments.filter(
                  (appointment) => appointment.done === 1
                )
              );
            } else if (filter === "Waiting") {
              setAppointments(
                uniqueAppointments.filter(
                  (appointment) => appointment.done === 0
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
    fetchAppointments();
  }, [page]);

  return (
    <SafeAreaView className="h-full w-full">
      <View className="w-full h-12 flex-row items-center justify-center border-b-[0.5px] border-solid border-gray-300 z-[15]">
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
        <Text className="font-bold text-[16px]">My Appointments</Text>
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
          <View className="w-28 h-28 flex-col items-start justify-start bg-white rounded-md absolute right-0 top-0 mt-10 mr-2">
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
                setFilter("Waiting");
              }}
            >
              <Text className="text-[13px] font-semibold mr-2">Waiting</Text>
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
        appointments &&
        appointments.length > 0 && (
          <FlatList
            data={appointments}
            renderItem={({ item }) => {
              const date = new Date(item.start_time);
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
                  onPress={() => handleAppointmentPress(item.appointment_id)}
                >
                  <View className="w-[30%] h-12 flex-col">
                    <View className="w-full flex-row items-center justify-start">
                      <Text className="text-[13px] font-semibold">
                        {new Date(item.start_time).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Text>
                    </View>
                    <View className="w-full flex-row items-center justify-start mt-2">
                      <FontAwesomeIcon
                        icon={icons.faClock}
                        size={13}
                        style={{
                          color: `${item.done === 1 ? "#22c55e" : "#94a3b8"}`,
                        }}
                      />
                      <Text
                        className={`text-[13px] ml-1 ${
                          item.done === 1
                            ? "text-green-500 font-semibold"
                            : "text-black"
                        }`}
                      >
                        {item.done === 1 ? "Done" : time}
                      </Text>
                    </View>
                  </View>
                  <View className="w-[70%] h-12 flex-col">
                    <View className="w-full flex-row items-center justify-start">
                      <Text className="text-[13px] font-semibold">
                        {item.medical_center.name}
                      </Text>
                    </View>
                    <View className="w-full flex-row items-center justify-start mt-2">
                      <Text className="text-[13px]">
                        {item.doctor.full_name}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.appointment_id}
            estimatedItemSize={30}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
          />
        )
      )}
    </SafeAreaView>
  );
};

export default MyAppointment;
