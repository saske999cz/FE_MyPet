import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { images } from "../../constants";
import { router } from "expo-router";
import FormField from "../../components/FormField";
import PetDropDownBox from "../../components/PetDropDownBox";
import DoctorDropDownBox from "../../components/DoctorDropDownBox";
import CalendarPicker from "react-native-calendar-picker";
import {
  get_doctors_free_time,
  create_appointment,
  get_doctors_of_medical_center,
} from "../../api/AppointmentApi";
import { get_all_my_pets } from "../../api/PetApi";
import { useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalContext } from "../../state/GlobalContextProvider";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const formWidth = screenWidth * 0.95;

const StepperBar = ({ steps, currentStep }) => {
  return (
    <View
      className={`h-12 w-[${formWidth}] flex-row items-center justify-center px-8`}
    >
      {steps.map((step, index) => {
        return (
          <View
            className={`w-[${
              screenWidth / 4
            }] h-5 flex-row items-center justify-center`}
            key={index}
          >
            <View
              className={`h-6 w-6 flex-row items-center justify-center rounded-full  ${
                currentStep === step || currentStep > step
                  ? "bg-amber-400 border-[1px] border-solid border-orange-300"
                  : "bg-gray-50 border-[1px] border-solid border-gray-300"
              }`}
            >
              <Text
                className={`text-[12px] font-bold ${
                  currentStep === step || currentStep > step
                    ? "text-white"
                    : "text-black"
                }`}
              >
                {step}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View
                className={`w-20 h-[3px] ${
                  currentStep > step ? "bg-amber-400" : "bg-gray-300"
                }`}
              ></View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const BasicInfoScreen = ({
  appointmentData,
  setAppointmentData,
  selectedPet,
  setSelectedPet,
  selectedPetImage,
  setSelectedPetImage,
  error,
  setError,
}) => {
  const [pets, setPets] = useState([]);
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await get_all_my_pets(1, 10);
        if (res && res.status === 200) {
          setPets([
            ...res.data.data.customer_pets,
            ...res.data.data.adopted_pets,
          ]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPets();
  }, []);

  return (
    <View
      className={`h-fit w-[${formWidth}] flex-col items-center justify-start px-4 mt-4 z-[7]`}
    >
      <Text className="text-[17px] font-semibold mb-4">Pet Information</Text>
      <View className="w-full h-fit z-[9] mb-5">
        <PetDropDownBox
          data={pets}
          onSelect={(pet) => {
            setAppointmentData({ ...appointmentData, pet_id: pet.pet_id });
            setSelectedPet(pet);
            setError({ ...error, pet: null });
          }}
          placeHolderText="Select your pet"
          selectedPet={selectedPet}
          setSelectedPetImage={setSelectedPetImage}
          selectedPetImage={selectedPetImage}
          titleStyles="text-black font-[13px]"
          title="Pet"
          error={error.pet}
        />
      </View>
    </View>
  );
};

const AppointmentDateScreen = ({
  appointmentData,
  setAppointmentData,
  selectedTime,
  setSelectedTime,
  selectedDoctor,
  setSelectedDoctor,
  selectedDoctorImage,
  setSelectedDoctorImage,
  selectedDate,
  setSelectedDate,
  availableTime,
  setAvailableTime,
  error,
  setError,
}) => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const onDateChange = (date) => {
    setAvailableTime([]);
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth() + 1;
    const day = parsedDate.getDate();
    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
    setAppointmentData({ ...appointmentData, date: formattedDate });
    setSelectedDate(date);
    setIsLoading(true);
  };
  useEffect(() => {
    const fetchAvailableTime = async () => {
      try {
        if (selectedDate) {
          const res = await get_doctors_free_time(
            appointmentData.doctor_id,
            appointmentData.date
          );
          if (res && res.status === 200) {
            setAvailableTime(res.data.data);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAvailableTime();
  }, [selectedDate]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await get_doctors_of_medical_center(
          appointmentData.medical_center_id
        );
        if (res && res.status === 200) {
          setDoctors(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchDoctors();
  }, []);
  return (
    <View
      className={`h-fit w-[${formWidth}] flex-col items-center justify-start px-4 mt-4 relative z-[7]`}
    >
      <View className="w-full h-10 flex-row items-center justify-center">
        <Text className="text-[17px] font-semibold mb-4 mr-20">
          Select Date
        </Text>
      </View>
      <View className="w-full h-fit flex-col items-center justify-start mt-3">
        <View className="w-full h-fit z-[9] mb-5">
          <DoctorDropDownBox
            data={doctors}
            onSelect={(doctor) => {
              setAppointmentData({
                ...appointmentData,
                doctor_id: doctor.doctor_id,
              });
              setSelectedDoctor(doctor);
              setError({ ...error, doctor: null });
            }}
            placeHolderText="Select a doctor"
            selectedDoctor={selectedDoctor}
            setSelectedDoctorImage={setSelectedDoctorImage}
            selectedDoctorImage={selectedDoctorImage}
            titleStyles="text-black font-[13px]"
            title="Doctor"
            error={error.doctor}
          />
        </View>
        {selectedDoctor && (
          <View className="w-full h-fit mt-5 z-[5]">
            {error.date && (
              <View className="w-full h-4 flex-row items-center justify-center mb-2 pl-7">
                <Text className="text-red-500 text-[12px]">{error.date}</Text>
              </View>
            )}
            <CalendarPicker
              onDateChange={(date) => {
                onDateChange(date);
                setError({ ...error, date: null });
              }}
              width={formWidth * 1}
              minDate={new Date().getTime()}
              selectedDayColor="#fbbf24"
              height={300}
              selectedStartDate={selectedDate}
            />
          </View>
        )}
      </View>
      {isLoading && (
        <LottieView
          style={{ width: 100, height: 100 }}
          source={require("../../assets/lottie/loading.json")}
          autoPlay
          loop
          speed={1.5}
        />
      )}
      {selectedDate && availableTime.length > 0 && (
        <View className="w-full h-fit flex-col items-start justify-center mt-1 px-1">
          <View
            className={`w-full h-5 mb-3 mt-5 flex-row items-center ${
              error.time ? "justify-between" : " justify-start"
            }`}
          >
            <Text className="text-[14px] font-semibold text-gray-400 ">
              Slots Available
            </Text>
            {error.time && (
              <Text className="text-red-500 text-[12px]">{error.time}</Text>
            )}
          </View>
          <View className="flex flex-row flex-wrap mb-2 ml-6">
            {availableTime.map((time, index) => (
              <TouchableOpacity
                key={index}
                className={`w-1/5 h-8 flex items-center justify-center rounded-md border m-1 ${
                  selectedTime === time
                    ? "bg-amber-400 border-orange-300"
                    : "bg-white border-gray-200"
                }`}
                onPress={() => {
                  setAppointmentData({ ...appointmentData, start_time: time });
                  setSelectedTime(time);
                  setError({ ...error, time: null });
                }}
              >
                <Text
                  className={`text-[11px] font-semibold ${
                    selectedTime === time.id ? "text-white" : "text-gray-700"
                  }`}
                >
                  {(() => {
                    const date = new Date(time);
                    const hours = date.getHours().toString().padStart(2, "0");
                    const minutes = date
                      .getMinutes()
                      .toString()
                      .padStart(2, "0");
                    return `${hours}:${minutes}`;
                  })()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const NoteScreen = ({ appointmentData, setAppointmentData }) => {
  return (
    <View
      className={`h-88 w-[${formWidth}] flex-col items-center justify-start px-4 mt-4`}
    >
      <Text className="text-[17px] font-semibold">Notes</Text>

      <FormField
        title="Notes"
        placeholder="Enter notes (Optional)"
        titleStyles="text-black font-[13px]"
        otherStyles="mt-5"
        multiline={true}
        numberOfLines={5}
        height={32}
        value={appointmentData.message}
        onChangeText={(text) =>
          setAppointmentData({ ...appointmentData, message: text })
        }
      />
    </View>
  );
};

const ScreenControler = ({
  currentStep,
  appointmentData,
  setAppointmentData,
  selectedTime,
  setSelectedTime,
  selectedPet,
  setSelectedPet,
  selectedPetImage,
  setSelectedPetImage,
  selectedDoctor,
  setSelectedDoctor,
  selectedDoctorImage,
  setSelectedDoctorImage,
  selectedDate,
  setSelectedDate,
  availableTime,
  setAvailableTime,
  error,
  setError,
}) => {
  switch (currentStep) {
    case 1:
      return (
        <BasicInfoScreen
          appointmentData={appointmentData}
          setAppointmentData={setAppointmentData}
          selectedPet={selectedPet}
          setSelectedPet={setSelectedPet}
          selectedPetImage={selectedPetImage}
          setSelectedPetImage={setSelectedPetImage}
          error={error}
          setError={setError}
        />
      );
    case 2:
      return (
        <AppointmentDateScreen
          appointmentData={appointmentData}
          setAppointmentData={setAppointmentData}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          setSelectedDoctor={setSelectedDoctor}
          setSelectedDoctorImage={setSelectedDoctorImage}
          selectedDoctor={selectedDoctor}
          selectedDoctorImage={selectedDoctorImage}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          availableTime={availableTime}
          setAvailableTime={setAvailableTime}
          error={error}
          setError={setError}
        />
      );
    case 3:
      return (
        <NoteScreen
          appointmentData={appointmentData}
          setAppointmentData={setAppointmentData}
        />
      );
    default:
      return <BasicInfoScreen />;
  }
};

const CreateAppointment = () => {
  const { medicalCenterId } = useLocalSearchParams();
  const [appointmentData, setAppointmentData] = useState({
    start_time: "",
    date: "",
    doctor_id: "",
    pet_id: "",
    message: "",
    done: 0,
    customer_id: "",
    medical_center_id: medicalCenterId,
  });
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedPetImage, setSelectedPetImage] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDoctorImage, setSelectedDoctorImage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTime, setAvailableTime] = useState([]);
  const [error, setError] = useState({});
  const [isSending, setIsSending] = useState(false);
  const { setToast } = useGlobalContext();

  const [currentStep, setCurrentStep] = useState(1);
  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    let newErrors = {}; // Temporary object to accumulate errors

    if (currentStep === 1) {
      if (selectedPet === null) {
        newErrors.pet = "Please select a pet";
      }
    } else if (currentStep === 2) {
      if (selectedDoctor === null) {
        newErrors.doctor = "Please select a doctor";
      }
      if (selectedDate === null) {
        newErrors.date = "Please select a date";
      } else if (selectedTime === null) {
        newErrors.time = "Please select a time";
      }
    }
    setError(newErrors);
    if (Object.keys(newErrors).length === 0) {
      if (currentStep === 3) return;
      setCurrentStep(currentStep + 1);
    } else {
      alert("Please fill in all the required fields");
    }
  };

  const handlePrev = () => {
    if (currentStep === 1) return;
    setCurrentStep(currentStep - 1);
  };

  const handleCreateAppointment = () => {
    setIsSending(true);
  };

  useEffect(() => {
    const createAppointmentRequest = async () => {
      try {
        const res = await create_appointment(appointmentData);
        if (res && res.status === 201) {
          setTimeout(() => {
            setIsSending(false);
            router.replace("../(tabs)/appointment");
            setToast({
              type: "success",
              text1: "Success",
              text2: "New appointment created successfully!",
            });
          }, 800);
          return;
        } else {
          alert(`An error occured, please try again`);
          setIsSending(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (isSending) {
      createAppointmentRequest();
    }
  }, [isSending]);

  useEffect(() => {
    const fetchCustomerId = async () => {
      try {
        const customerId = await AsyncStorage.getItem("userId");
        setAppointmentData({ ...appointmentData, customer_id: customerId });
      } catch (error) {
        console.log(error);
      }
    };
    fetchCustomerId();
  }, []);

  return (
    <View className="flex-1 items-center">
      {isSending ? (
        <View className="w-full h-full bg-black opacity-90 flex-row items-start justify-center">
          <LottieView
            style={{ width: 240, height: 240, marginTop: 250 }}
            source={require("../../assets/lottie/sendingData.json")}
            autoPlay
            loop
            speed={1.5}
          />
        </View>
      ) : (
        <View className="w-full h-full">
          <View className="w-full h-12 flex-row items-center justify-center mt-12">
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
            <Text className="text-[16px] font-semibold">
              Create Appointment
            </Text>
          </View>
          <ScrollView className={`flex-1 w-full`}>
            <View
              className={`w-[${formWidth}] h-full items-center justify-center mb-8`}
            >
              <View className="w-[95%] h-16 bg-white rounded-lg">
                <View className="w-full h-[8%] bg-amber-400 rounded-t-lg"></View>
                <View className="w-full h-[92%] flex-row items-center justify-start px-4">
                  <Image
                    source={images.clinic1}
                    className="w-12 h-12 rounded-full"
                  />
                  <Text className="text-[15px] font-semibold text-black ml-2">
                    Pet Clinic
                  </Text>
                </View>
              </View>
              <View className="w-[95%] h-fit bg-white rounded-lg flex-col items-center mt-2 justify-start">
                <StepperBar steps={[1, 2, 3]} currentStep={currentStep} />
                <ScreenControler
                  currentStep={currentStep}
                  appointmentData={appointmentData}
                  setAppointmentData={setAppointmentData}
                  selectedTime={selectedTime}
                  setSelectedTime={setSelectedTime}
                  selectedPet={selectedPet}
                  setSelectedPet={setSelectedPet}
                  selectedPetImage={selectedPetImage}
                  setSelectedPetImage={setSelectedPetImage}
                  setSelectedDoctor={setSelectedDoctor}
                  setSelectedDoctorImage={setSelectedDoctorImage}
                  selectedDoctor={selectedDoctor}
                  selectedDoctorImage={selectedDoctorImage}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  availableTime={availableTime}
                  setAvailableTime={setAvailableTime}
                  error={error}
                  setError={setError}
                />
                <View
                  className={`w-full h-16 flex-row items-center justify-center px-4 mb-2 z-[6] ${
                    currentStep === 2 ? "mt-2" : "mt-2"
                  }`}
                >
                  {currentStep !== 1 && (
                    <TouchableOpacity
                      className="w-20 h-10 rounded-md border-[0.5px] border-solid border-gray-200 flex-row items-center justify-center mr-4"
                      disabled={currentStep === 1 ? true : false}
                      onPress={handlePrev}
                    >
                      <FontAwesomeIcon
                        icon={icons.faArrowLeftLong}
                        size={12}
                        style={{ color: "#f59e0b" }}
                      />
                      <Text className="text-[14px] font-semibold text-gray-500 ml-1">
                        Prev
                      </Text>
                    </TouchableOpacity>
                  )}
                  {currentStep !== 3 && (
                    <TouchableOpacity
                      className="w-20 h-10 rounded-md bg-amber-400 flex-row items-center justify-center ml-2"
                      onPress={handleNext}
                      disabled={currentStep === 3 ? true : false}
                    >
                      <Text className="text-[14px] font-semibold text-white mr-1">
                        Next
                      </Text>
                      <FontAwesomeIcon
                        icon={icons.faArrowRightLong}
                        size={12}
                        style={{ color: "#ffffff" }}
                      />
                    </TouchableOpacity>
                  )}
                  {currentStep === 3 && (
                    <TouchableOpacity
                      className="w-28 h-10 rounded-md bg-amber-400 flex-row items-center justify-center ml-4"
                      onPress={handleCreateAppointment}
                      disabled={currentStep !== 3 ? true : false}
                    >
                      <Text className="text-[14px] font-semibold text-white">
                        Create
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default CreateAppointment;
