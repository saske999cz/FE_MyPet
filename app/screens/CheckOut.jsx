import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { images } from "../../constants";
import { router } from "expo-router";
import FormField from "../../components/FormField";
import DropDownBox from "../../components/DropDownBox";
import RadioButton from "../../components/RadioButton";

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

const ShippingInfoScreen = () => {
  return (
    <View
      className={`h-fit w-[${formWidth}] flex-col items-center justify-start px-4 mt-4`}
    >
      <Text className="text-[17px] font-semibold mb-4">
        Shipping Information
      </Text>
      <FormField
        title="Full Name"
        placeholder="Enter full name"
        titleStyles="text-black font-[13px]"
        otherStyles="mt-5"
      />
      <FormField
        title="Shipping Address"
        placeholder="Enter address"
        titleStyles="text-black font-[13px]"
        otherStyles="mt-5"
      />
      <FormField
        title="Phone Number"
        placeholder="Enter phone number"
        titleStyles="text-black font-[13px]"
        otherStyles="mt-5"
      />
      <FormField
        title="Email"
        placeholder="Enter email"
        titleStyles="text-black font-[13px]"
        otherStyles="mt-5 mb-4"
      />
    </View>
  );
};

const PaymentScreen = ({ paymentMethod, activePaymentMethod }) => {
  return (
    <View
      className={`h-fit w-[${formWidth}] flex-col items-center justify-start px-4 mt-4`}
    >
      <Text className="text-[17px] font-semibold mb-4">Payment Method</Text>
      <View className="w-full h-16 flex-row items-center justify-between px-2 mt-4 border-b-[1px] border-solid border-gray-300">
        <Text className="text-[14px] font-semibold">Total amount:</Text>
        <Text className="text-[14px] font-semibold">200000</Text>
      </View>
      <View className="w-full h-fit flex-col items-center justify-start mt-2">
        <RadioButton
          active={paymentMethod === "MoMo" ? true : false}
          title="MoMo"
          titleStyle="text-[14px] font-semibold"
          description="Fast and simple payment"
          descriptionStyle="text-[12px] font-normal text-gray-500"
          handleSelect={() => activePaymentMethod("MoMo")}
          image={images.momo}
        />
        <RadioButton
          active={paymentMethod === "VNPay" ? true : false}
          title="VNPay"
          titleStyle="text-[14px] font-semibold"
          description="Secure payment method"
          descriptionStyle="text-[12px] font-normal text-gray-500"
          handleSelect={() => activePaymentMethod("VNPay")}
          image={images.vnpay}
        />
        <RadioButton
          active={paymentMethod === "PayPal" ? true : false}
          title="PayPal"
          titleStyle="text-[14px] font-semibold"
          description="International payment method"
          descriptionStyle="text-[12px] font-normal text-gray-500"
          handleSelect={() => activePaymentMethod("PayPal")}
          image={images.paypal}
        />
      </View>
    </View>
  );
};

const ConfirmScreen = () => {
  const optional = " (Optional)";
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
      />
    </View>
  );
};

const ScreenControler = ({
  currentStep,
  activePaymentMethod,
  paymentMethod,
}) => {
  switch (currentStep) {
    case 1:
      return <ShippingInfoScreen />;
    case 2:
      return (
        <PaymentScreen
          paymentMethod={paymentMethod}
          activePaymentMethod={activePaymentMethod}
        />
      );
    case 3:
      return <ConfirmScreen />;
    default:
      return <BasicInfoScreen />;
  }
};

const CheckOut = () => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [shippingData, setShippingData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const activePaymentMethod = (method) => {
    setPaymentMethod(method);
  };
  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    if (currentStep === 3) return;
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep === 1) return;
    setCurrentStep(currentStep - 1);
  };

  const handleCreateAppointment = () => {};

  return (
    <SafeAreaView className="flex-1 items-center">
      <View className="w-full h-12 flex-row items-center justify-center">
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
        <Text className="text-[16px] font-semibold">Check Out</Text>
      </View>
      <ScrollView className={`flex-1 w-full`}>
        <View
          className={`w-[${formWidth}] h-full items-center justify-center mb-8`}
        >
          <View className="w-[95%] h-fit bg-white rounded-lg mt-2 flex-col items-center justify-start">
            <StepperBar steps={[1, 2, 3]} currentStep={currentStep} />
            <ScreenControler
              currentStep={currentStep}
              activePaymentMethod={activePaymentMethod}
              paymentMethod={paymentMethod}
            />
            <View
              className={`w-full h-16 flex-row items-center justify-center px-4 mb-2 ${
                currentStep === 2 ? "mt-8" : "mt-2"
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
                  className="w-20 h-10 rounded-md bg-amber-400 flex-row items-center justify-center ml-4"
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
                    Proceed
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckOut;
