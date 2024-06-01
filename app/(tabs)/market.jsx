import {
  View,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
  Animated,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { icons } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { ItemDummy } from "../../dummy/FakeData";
import ItemCard from "../../components/ItemCard";
import SearchInput from "../../components/SearchInput";
import Toast from "react-native-toast-message";
import { setGlobalState, useGlobalState } from "../../state/GlobalState";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { get_best_selling_products } from "../../api/MarketApi";

const Header_Max_Height = 230;
const Header_Min_Height = 70;
const Scroll_Distance = Header_Max_Height - Header_Min_Height;

const DynamicHeader = ({
  value,
  activeCategory,
  handlePressCategory,
  cartLength,
  isScrolled,
}) => {
  const handleCartPress = () => {
    router.push("../screens/Cart");
  };
  const animatedHeaderHeight = value.interpolate({
    inputRange: [0, Scroll_Distance],
    outputRange: [Header_Max_Height, Header_Min_Height],
    extrapolate: "clamp",
  });

  const animatedOpacity = value.interpolate({
    inputRange: [0, Scroll_Distance],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const animatedLogo = {
    transform: [
      {
        scale: value.interpolate({
          inputRange: [0, Scroll_Distance],
          outputRange: [1, 0],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: value.interpolate({
      inputRange: [0, 60],
      outputRange: [1, 0],
      extrapolate: "clamp",
    }),
  };

  const animatedSearchBar = {
    transform: [
      {
        translateX: value.interpolate({
          inputRange: [0, Scroll_Distance],
          outputRange: [0, -63],
          extrapolate: "clamp",
        }),
      },
      {
        scaleX: value.interpolate({
          inputRange: [0, Scroll_Distance - 60],
          outputRange: [1, 0.8],
          extrapolate: "clamp",
        }),
      },
      {
        translateY: value.interpolate({
          inputRange: [0, 50],
          outputRange: [0, 11],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: value.interpolate({
      inputRange: [0, 100],
      outputRange: [1, 0],
      extrapolate: "clamp",
    }),
  };

  const animatedSmallSearchBar = {
    transform: [
      {
        translateX: value.interpolate({
          inputRange: [0, Scroll_Distance],
          outputRange: [4, 7],
          extrapolate: "clamp",
        }),
      },
      {
        translateY: value.interpolate({
          inputRange: [0, Scroll_Distance],
          outputRange: [4, 5],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: value.interpolate({
      inputRange: [0, Scroll_Distance],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
  };

  const animatedAvatar = {
    transform: [
      {
        translateY: value.interpolate({
          inputRange: [0, Scroll_Distance - 25],
          outputRange: [-4, 71],
          extrapolate: "clamp",
        }),
      },
    ],
  };

  return (
    <Animated.View
      style={{
        height: animatedHeaderHeight,
        justifyContent: "center",
        alignItems: "center",
        left: 0,
        right: 0,
      }}
    >
      <View className="w-full h-32 absolute top-0 left-0 right-0"></View>
      <View className="w-full flex-col items-center justify-between px-4 mb-4 z-3">
        <View className="w-full flex-row items-center justify-between mb-3">
          <Animated.Image
            source={images.logoBlack}
            className="w-32 h-16 -ml-4 -mt-1"
            resizeMode="contain"
            style={animatedLogo}
          />
          <Animated.View
            className="w-[20%] flex-row items-center justify-end"
            style={animatedAvatar}
          >
            <TouchableOpacity
              className="w-10 h-10 bg-[#e5e7eb] rounded-full flex-row items-center justify-center mr-2"
              onPress={handleCartPress}
            >
              {cartLength > 0 ? (
                <View className="w-4 h-4 rounded-full bg-red-500 absolute top-0 right-0 -mr-1 flex-row items-center justify-center ">
                  <Text className="text-[12px] font-semibold text-white">
                    {cartLength}
                  </Text>
                </View>
              ) : null}
              <FontAwesomeIcon
                icon={icons.faCartShopping}
                size={20}
                style={{ color: "#000000" }}
              />
            </TouchableOpacity>
            <Image source={images.avatar} className="w-9 h-9 rounded-full" />
          </Animated.View>
        </View>
        <Animated.View
          className="w-full flex-row items-center justify-center"
          style={animatedSearchBar}
        >
          <SearchInput
            title="Search"
            placeholder="Search"
            otherStyles={"w-[88%] z-10"}
            style={{ pointerEvents: "auto" }}
          />
          <Animated.View
            className="w-10 h-10 rounded-lg ml-2"
            style={animatedLogo}
          >
            <TouchableOpacity className="w-full h-full bg-[#e5e7eb] rounded-lg flex-row items-center justify-center">
              <FontAwesomeIcon
                icon={icons.faFilter}
                size={20}
                style={{ color: "#000000" }}
              />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
        {isScrolled && (
          <Animated.View
            className="w-full flex-row items-center justify-center"
            style={animatedSmallSearchBar}
          >
            <SearchInput
              title="Search"
              placeholder="Search"
              otherStyles={"w-[76%] absolute top-0 left-0 -ml-3 -mt-9 z-4"}
              style={{ pointerEvents: "auto" }}
            />
          </Animated.View>
        )}
      </View>
      <Animated.View
        className="w-full flex-col items-start justify-center px-4 mb-3"
        style={{ opacity: animatedOpacity }}
      >
        <Text className="text-[15px] font-semibold mb-4">Categories</Text>
        <View className="flex-row items-center justify-start w-full">
          <TouchableOpacity
            className={`w-24 h-10 rounded-full flex-row items-center justify-center ${
              activeCategory === "dogs" ? "bg-[#fed7aa]" : "bg-[#e5e7eb]"
            }`}
            onPress={() => handlePressCategory("dogs")}
          >
            <View
              className={`w-9 h-9 rounded-full flex-row items-center justify-center -ml-2 ${
                activeCategory === "dogs" ? "bg-[#fb923c]" : "bg-[#d1d5db]"
              }`}
            >
              <Image
                source={images.dog}
                className="w-5 h-5"
                resizeMode="contain"
              />
            </View>
            <Text className={`text-[13px] ml-2`}>Dogs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`w-24 h-10 rounded-full flex-row items-center justify-center ml-9 ${
              activeCategory === "cats" ? "bg-[#fed7aa]" : "bg-[#e5e7eb]"
            }`}
            onPress={() => handlePressCategory("cats")}
          >
            <View
              className={`w-9 h-9 rounded-full flex-row items-center justify-center -ml-2 ${
                activeCategory === "cats" ? "bg-[#fb923c]" : "bg-[#d1d5db]"
              }`}
            >
              <Image
                source={images.cat}
                className="w-5 h-5"
                resizeMode="contain"
              />
            </View>
            <Text className={`text-[13px] ml-2`}>Cats</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`w-24 h-10 rounded-full flex-row items-center justify-center ml-9 ${
              activeCategory === "birds" ? "bg-[#fed7aa]" : "bg-[#e5e7eb]"
            }`}
            onPress={() => handlePressCategory("birds")}
          >
            <View
              className={`w-9 h-9 rounded-full flex-row items-center justify-center -ml-2 ${
                activeCategory === "birds" ? "bg-[#fb923c]" : "bg-[#d1d5db]"
              }`}
            >
              <Image
                source={images.bird}
                className="w-5 h-5"
                resizeMode="contain"
              />
            </View>
            <Text className={`text-[13px] ml-2`}>Birds</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const market = () => {
  const [cartLength, setCartLength] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("none");
  const addedCartItem = useGlobalState("addedCartItem");
  const toastStatus = useGlobalState("toastStatus");
  const cartStatus = useGlobalState("cartStatus");
  const scrollOffsetY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      const storedCartLength = await retrieveData("cartLength");
      setCartLength(storedCartLength);
    };
    fetchData();
  }, [toastStatus[0], cartStatus[0]]);

  const retrieveData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        const parsedValue = JSON.parse(value);
        return parsedValue;
      } else {
        return 0;
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  };

  useEffect(() => {
    if (toastStatus[0] === true && addedCartItem[0] !== "") {
      setTimeout(() => {
        Toast.show({
          type: "success",
          text1: "New cart item!",
          text2: addedCartItem[0] + " has been added to your cart",
          visibilityTime: 3000,
        });
      }, 100);
      const newCartLength = retrieveData("cartLength");
      setCartLength(newCartLength);
    }
    setTimeout(() => {
      setGlobalState("toastStatus", false);
      setGlobalState("addedCartItem", "");
    }, 2000);
  }, [toastStatus[0]]);

  const handlePressCategory = (category) => {
    setActiveCategory(category);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // fetch data
    setRefreshing(false);
  };

  useEffect(() => {
    scrollOffsetY.addListener(({ value }) => {
      if (value > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    });
    return () => {
      scrollOffsetY.removeAllListeners();
    };
  }, [scrollOffsetY]);

  useEffect(() => {
    get_best_selling_products(1, 10)
      .then((res) => {
        if (res.status === 200) {
          setProducts(res.data.data);
        } else {
          alert(res.data.status);
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  }, []);

  return (
    <SafeAreaView className="w-full h-full flex-col">
      <DynamicHeader
        value={scrollOffsetY}
        activeCategory={activeCategory}
        handlePressCategory={handlePressCategory}
        cartLength={cartLength}
        isScrolled={isScrolled}
      />
      <FlashList
        scrollEventThrottle={5}
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="w-[96%] h-fit ml-1">
            <ItemCard
              id={item.id}
              title={item.name}
              price={item.price}
              image={item.image}
              rating={item.rating}
              soldUnits={item.sold_quantity}
              shop={item.shop}
              isHorizontal={false}
            />
          </View>
        )}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-around",
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        estimatedItemSize={50}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          {
            useNativeDriver: false,
          }
        )}
      />

      <View style={{ position: "absolute", top: 20, left: 20, right: 20 }}>
        <Toast />
      </View>
    </SafeAreaView>
  );
};

export default market;
