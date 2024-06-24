import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { images } from "../../constants";
import { router } from "expo-router";
import FormField from "../../components/FormField";
import RadioButton from "../../components/RadioButton";
import WebView from "react-native-webview";
import queryString from "query-string";
import PaypalApi from "../../api/payment/PaypalApi";
import { create_order } from "../../api/Order";
import { useGlobalContext } from "../../state/GlobalContextProvider";
import { useLocalSearchParams } from "expo-router";
import { formatVND } from "../../utils/currencyFormater";
import LottieView from "lottie-react-native";
import { create_cart } from "../../api/CartApi";
import GooglePlacesInput from "../../components/GooglePlacesInput";

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

const ShippingInfoScreen = ({
  error,
  setShippingData,
  shippingData,
  setError,
}) => {
  return (
    <View
      className={`h-fit w-[${formWidth}] flex-col items-center justify-start px-4 mt-4`}
      style={{ zIndex: 0 }}
    >
      <Text className="text-[17px] font-semibold mb-4">
        Shipping Information
      </Text>
      {/* <View
        className="w-full h-48 flex-row items-start justify-start"
        style={{ zIndex: 1 }}
      >
        <GooglePlacesInput />
      </View> */}
      <FormField
        title="Shipping Address"
        placeholder="Enter address"
        titleStyles="text-black font-[13px]"
        otherStyles="mt-5 mb-4"
        error={error.address}
        handleChangeText={(e) => {
          setShippingData({ ...shippingData, address: e });
          setError({ ...error, address: null });
        }}
        value={shippingData.address}
      />
    </View>
  );
};

const PaymentScreen = ({
  paymentMethod,
  activePaymentMethod,
  totalAmount,
  setShippingData,
  shippingData,
  numberOfSubOrders,
}) => {
  const [transactionFee, setTransactionFee] = useState(0);

  return (
    <View
      className={`h-fit w-[${formWidth}] flex-col items-center justify-start px-4 mt-4`}
    >
      <Text className="text-[17px] font-semibold mb-4">Payment Method</Text>
      <View className="w-full h-7 flex-row items-center justify-between px-2 mt-4">
        <Text className="text-[14px]">Initial amount:</Text>
        <Text className="text-[14px]">{formatVND(totalAmount)}</Text>
      </View>
      <View className="w-full h-7 flex-row items-center justify-between px-2">
        <Text className="text-[14px]">Shipping fee:</Text>
        <Text className="text-[14px]">
          {formatVND(30000 * numberOfSubOrders)}
        </Text>
      </View>
      <View className="w-full h-7 flex-row items-center justify-between px-2">
        <Text className="text-[14px]">Transaction fee:</Text>
        <Text className="text-[14px]">{formatVND(transactionFee)}</Text>
      </View>
      <View className="w-full h-fit flex-row items-center justify-between px-2 border-b-[1px] border-solid border-gray-300 pb-4 pt-2">
        <Text className="text-[14px] font-semibold">Total amount:</Text>
        <Text className="text-[14px] font-semibold">
          {formatVND(
            parseFloat(totalAmount) + transactionFee + 30000 * numberOfSubOrders
          )}
        </Text>
      </View>
      <View className="w-full h-fit flex-col items-center justify-start mt-2">
        <RadioButton
          active={paymentMethod === "MoMo" ? true : false}
          title="MoMo"
          titleStyle="text-[14px] font-semibold"
          description="Fast and simple payment"
          descriptionStyle="text-[12px] font-normal text-gray-500"
          handleSelect={() => {
            activePaymentMethod("MoMo");
            setShippingData({ ...shippingData, payment_method: "MoMo" });
            setTransactionFee(0);
          }}
          image={images.momo}
        />
        <RadioButton
          active={paymentMethod === "PayPal" ? true : false}
          title="PayPal"
          titleStyle="text-[14px] font-semibold"
          description="International payment method"
          descriptionStyle="text-[12px] font-normal text-gray-500"
          handleSelect={() => {
            activePaymentMethod("PayPal");
            setShippingData({ ...shippingData, payment_method: "PayPal" });
            setTransactionFee(totalAmount * 0.04 + 0.5 * 25400);
          }}
          image={images.paypal}
        />
        <RadioButton
          active={paymentMethod === "COD" ? true : false}
          title="COD"
          titleStyle="text-[14px] font-semibold"
          description="Pay when you receive the product"
          descriptionStyle="text-[12px] font-normal text-gray-500"
          handleSelect={() => {
            activePaymentMethod("COD");
            setShippingData({ ...shippingData, payment_method: "COD" });
            setTransactionFee(0);
          }}
          image={images.cod}
        />
      </View>
    </View>
  );
};

const ThankYouScreen = ({ userFullName }) => {
  return (
    <View
      className={`h-88 w-[${formWidth}] flex-col items-center justify-start px-4 mt-4`}
    >
      <Text className="text-[17px] font-semibold">Thank you</Text>
      <View className="w-full h-fit flex-col mt-6">
        <Text className="text-[13px]">{`Dear ${userFullName},`}</Text>
        <Text className="text-[13px] mt-1">
          Thank you for your purchase. We appreciate your business and are
          confident that you will be satisfied with your purchase. If you have
          any concerns or feedback, please do not hesitate to contact us.
        </Text>
        <Text className="text-[13px] mt-1">Sincerely, MyPet</Text>
      </View>
    </View>
  );
};

const ScreenControler = ({
  currentStep,
  activePaymentMethod,
  paymentMethod,
  error,
  setShippingData,
  shippingData,
  totalAmount,
  setError,
  userFullName,
  numberOfSubOrders,
}) => {
  switch (currentStep) {
    case 1:
      return (
        <ShippingInfoScreen
          error={error}
          setShippingData={setShippingData}
          shippingData={shippingData}
          setError={setError}
        />
      );
    case 2:
      return (
        <PaymentScreen
          paymentMethod={paymentMethod}
          activePaymentMethod={activePaymentMethod}
          totalAmount={totalAmount}
          setShippingData={setShippingData}
          shippingData={shippingData}
          numberOfSubOrders={numberOfSubOrders}
        />
      );
    case 3:
      return <ThankYouScreen userFullName={userFullName} />;
    default:
      return <BasicInfoScreen />;
  }
};

const CheckOut = () => {
  const {
    cartId,
    checkOutItems,
    userFullName,
    setCartId,
    setCartLength,
    setCurrentCartItems,
    numberOfSubOrders,
  } = useGlobalContext();
  const { totalAmount } = useLocalSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [shippingData, setShippingData] = useState({
    address: "",
    payment_method: "",
    cart_id: cartId,
    transaction_order_id: "",
  });
  const [isLoading, setLoading] = useState(false);
  const [paypalUrl, setPaypalUrl] = useState(null);
  const [paypalAccessToken, setPaypalAccessToken] = useState(null);
  const [error, setError] = useState({});
  const [isFinished, setFinished] = useState(false);
  const [paymentCaptured, setPaymentCaptured] = useState(false);

  const activePaymentMethod = (method) => {
    setPaymentMethod(method);
  };
  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    let newErrors = {};
    if (currentStep === 1) {
      if (shippingData.address.length < 4)
        newErrors = { address: "Address is required" };
    }
    if (currentStep === 2) {
      if (paymentMethod === null) alert("Please select a payment method");
    }
    if (currentStep === 2 && paymentMethod === "PayPal") {
      payWithPaypal();
      return;
    }
    setError(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setCurrentStep(currentStep + 1);
    } else {
      alert("Please fill in all the required fields");
    }
  };

  const handlePrev = () => {
    if (currentStep === 1) return;
    setCurrentStep(currentStep - 1);
  };

  const payWithPaypal = async () => {
    setLoading(true);
    try {
      const token = await PaypalApi.generateToken();
      const orderDetail = PaypalApi.createOrderDetail(
        checkOutItems,
        numberOfSubOrders
      );
      const res = await PaypalApi.createOrder(token, orderDetail);
      setPaypalAccessToken(token);
      setLoading(false);
      if (!!res?.links) {
        const findUrl = res.links.find((data) => data?.rel === "approve");
        setPaypalUrl(findUrl.href);
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  const onUrlChange = async (webviewState) => {
    if (webviewState.url.includes("https://example.com/cancel")) {
      clearPaypalState();
      return;
    }
    if (webviewState.url.includes("https://example.com/return")) {
      if (paymentCaptured) {
        return;
      }
      setPaymentCaptured(true);
      const urlValues = queryString.parseUrl(webviewState.url);
      const { token } = urlValues.query;
      if (!!token) {
        await paymentSucess(token).then((res) => {
          if (res) {
            setFinished(true);
            setCurrentStep(3);
            setTimeout(() => {
              setFinished(false);
            }, 2000);
          }
        });
        return;
      }
    }
  };

  const paymentSucess = async (id) => {
    try {
      await PaypalApi.capturePayment(id, paypalAccessToken).then((res) => {
        clearPaypalState();
        create_order({
          ...shippingData,
          transaction_order_id: res.purchase_units[0].payments.captures[0].id,
        }).then((res) => {
          if (res.status === 201)
            create_cart().then((res) => {
              if (res && res.status === 200) {
                setCartLength(
                  res.data.shops.reduce(
                    (total, shop) => total + shop.cart_items.length,
                    0
                  )
                );
                setCartId(res.data.cart.id);
                const combinedItemIds = res.data.shops.reduce((ids, shop) => {
                  const shopItemIds = shop.cart_items.map(
                    (item) => item.product_id
                  );
                  return ids.concat(shopItemIds);
                }, []);
                setCurrentCartItems(combinedItemIds);
              } else {
                setCartLength(0);
                setCartId(res.data.cart.id);
                setCurrentCartItems([]);
              }
            });
        });
      });
      return true;
    } catch (error) {
      console.log("error raised in payment capture", error);
      return false;
    }
  };

  const clearPaypalState = () => {
    setPaypalUrl(null);
    setPaypalAccessToken(null);
  };

  const handleGoHome = () => {
    router.navigate("../(tabs)/home");
  };

  return (
    <View className="w-full h-full">
      <View className="w-full h-full">
        <View className="w-full h-12 flex-row items-center justify-center mt-[55px]">
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
        <View className={`w-full h-full`}>
          <View
            className={`w-[${formWidth}] h-full items-center justify-start mb-8`}
          >
            <View className="w-[95%] h-fit bg-white rounded-lg mt-2 flex-col items-center justify-start">
              <StepperBar steps={[1, 2, 3]} currentStep={currentStep} />
              <ScreenControler
                currentStep={currentStep}
                activePaymentMethod={activePaymentMethod}
                paymentMethod={paymentMethod}
                error={error}
                setShippingData={setShippingData}
                shippingData={shippingData}
                totalAmount={totalAmount}
                setError={setError}
                userFullName={userFullName}
                numberOfSubOrders={numberOfSubOrders}
              />
              <View
                className={`w-full h-16 flex-row items-center justify-center px-4 mb-2 ${
                  currentStep === 2 ? "mt-8" : "mt-2"
                }`}
              >
                {currentStep !== 1 && currentStep !== 3 && (
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
                    className="w-28 h-10 rounded-md bg-amber-400 flex-row items-center justify-center mt-2"
                    onPress={handleGoHome}
                    disabled={currentStep !== 3 ? true : false}
                  >
                    <Text className="text-[14px] font-semibold text-white">
                      Go Home
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
        <Modal visible={!!paypalUrl}>
          <TouchableOpacity
            onPress={clearPaypalState}
            className="w-12 h-5 flex-row items-center justify-center mt-12 mb-4 ml-2"
          >
            <FontAwesomeIcon
              icon={icons.faCaretLeft}
              size={15}
              style={{ color: "#000000" }}
            />
            <Text className="text-[13px] ml-1">Back</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <WebView
              source={{ uri: paypalUrl }}
              onNavigationStateChange={onUrlChange}
            />
          </View>
        </Modal>
      </View>
      {isLoading && (
        <View className="absolute w-full h-full top-0 right-0 left-0 bottom-0 flex-row items-start justify-center">
          <View className="w-full h-full bg-black opacity-80 absolute top-0"></View>
          <LottieView
            style={{ width: 350, height: 300, marginTop: 240 }}
            source={require("../../assets/lottie/bankTransfer.json")}
            autoPlay
            loop
            speed={1.5}
          />
        </View>
      )}
      {isFinished && (
        <View className="absolute w-full h-full top-0 right-0 left-0 bottom-0 flex-row items-start justify-center">
          <View className="w-full h-full bg-black opacity-0 absolute top-0"></View>
          <LottieView
            style={{ width: 600, height: 850 }}
            source={require("../../assets/lottie/party.json")}
            autoPlay
            speed={1.5}
          />
        </View>
      )}
    </View>
  );
};

export default CheckOut;
