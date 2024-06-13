import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  Animated,
  FlatList,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images, blurhash } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import ItemCard from "../../components/ItemCard";
import SearchInput from "../../components/SearchInput";
import Toast from "react-native-toast-message";
import { setGlobalState, useGlobalState } from "../../state/GlobalState";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { get_best_selling_products, search_product } from "../../api/MarketApi";
import { Image } from "expo-image";
import LottieView from "lottie-react-native";
import { useGlobalContext } from "../../state/GlobalContextProvider";

const Header_Max_Height = 230;
const Header_Min_Height = 70;
const Scroll_Distance = Header_Max_Height - Header_Min_Height;

const DynamicHeader = ({
  value,
  activeCategory,
  handlePressCategory,
  cartLength,
  isScrolled,
  query,
  setQuery,
  handleSearch,
}) => {
  const { userAvatar } = useGlobalContext();

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
            {userAvatar && (
              <Image
                source={{ uri: userAvatar }}
                className="w-9 h-9 rounded-full"
                transition={0}
                placeholder={{ blurhash }}
              />
            )}
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
            value={query}
            onChangeText={(text) => setQuery(text)}
            handleSearch={handleSearch}
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
              value={query}
              onChangeText={(text) => setQuery(text)}
              handleSearch={handleSearch}
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
              activeCategory === "dog" ? "bg-[#fed7aa]" : "bg-[#e5e7eb]"
            }`}
            onPress={() => handlePressCategory("dog")}
          >
            <View
              className={`w-9 h-9 rounded-full flex-row items-center justify-center -ml-2 ${
                activeCategory === "dog" ? "bg-[#fb923c]" : "bg-[#d1d5db]"
              }`}
            >
              <Image
                source={images.dog}
                className="w-5 h-5"
                contentFit="contain"
              />
            </View>
            <Text className={`text-[13px] ml-2`}>Dogs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`w-24 h-10 rounded-full flex-row items-center justify-center ml-9 ${
              activeCategory === "cat" ? "bg-[#fed7aa]" : "bg-[#e5e7eb]"
            }`}
            onPress={() => handlePressCategory("cat")}
          >
            <View
              className={`w-9 h-9 rounded-full flex-row items-center justify-center -ml-2 ${
                activeCategory === "cat" ? "bg-[#fb923c]" : "bg-[#d1d5db]"
              }`}
            >
              <Image
                source={images.cat}
                className="w-5 h-5"
                contentFit="contain"
              />
            </View>
            <Text className={`text-[13px] ml-2`}>Cats</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`w-24 h-10 rounded-full flex-row items-center justify-center ml-9 ${
              activeCategory === "bird" ? "bg-[#fed7aa]" : "bg-[#e5e7eb]"
            }`}
            onPress={() => handlePressCategory("bird")}
          >
            <View
              className={`w-9 h-9 rounded-full flex-row items-center justify-center -ml-2 ${
                activeCategory === "bird" ? "bg-[#fb923c]" : "bg-[#d1d5db]"
              }`}
            >
              <Image
                source={images.bird}
                className="w-5 h-5"
                contentFit="contain"
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
  const { cartLength } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("");
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [maxPage, setMaxPage] = useState(1);

  const handleLoadMore = () => {
    if (page >= maxPage) {
      return;
    }
    setPage((prevPage) => prevPage + 1);
  };

  const handlePressCategory = (category) => {
    if (category === activeCategory) {
      setActiveCategory("");
      return;
    }
    setQuery("");
    setSearching(false);
    setActiveCategory(category);
  };

  const handleSearch = () => {
    if (query === "") {
      setProducts([]);
      setIsLoading(true);
      setSearching(false);
      setPage(1);
      return;
    }
    setProducts([]);
    setIsLoading(true);
    setSearching(true);
    setPage(1);
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
    if (searching) {
      search_product(query, page, 12)
        .then((res) => {
          if (res && res.status === 200 && res.data.data.length > 0) {
            const newProducts = [...products, ...res.data.data];
            const uniqueProducts = newProducts.reduce((unique, product) => {
              if (!unique.find((item) => item.id === product.id)) {
                unique.push(product);
              }
              return unique;
            }, []);
            setProducts(uniqueProducts);
            if (page === 1) {
              setMaxPage(res.data.total_pages);
            }
            setIsLoading(false);
          } else {
            setProducts([]);
            setIsLoading(false);
            console.log("No data found.");
          }
        })
        .catch((err) => {
          alert(err.message);
        });
    } else
      get_best_selling_products(page, 12, activeCategory)
        .then((res) => {
          if (res && res.status === 200 && res.data.data.length > 0) {
            const newProducts = [...products, ...res.data.data];
            const uniqueProducts = newProducts.reduce((unique, product) => {
              if (!unique.find((item) => item.id === product.id)) {
                unique.push(product);
              }
              return unique;
            }, []);
            setProducts(uniqueProducts);
            if (page === 1) {
              setMaxPage(res.data.total_pages);
            }
            setIsLoading(false);
          } else {
            setProducts([]);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          alert(err.message);
        });
  }, [page, activeCategory, searching]);

  useEffect(() => {
    setIsLoading(true);
    setProducts([]);
    setPage(1);
  }, [activeCategory]);

  return (
    <SafeAreaView className="w-full h-full flex-col">
      <DynamicHeader
        value={scrollOffsetY}
        activeCategory={activeCategory}
        handlePressCategory={handlePressCategory}
        cartLength={cartLength}
        isScrolled={isScrolled}
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
      />
      {isLoading ? (
        <View className="w-full h-full flex-row items-start justify-center">
          <LottieView
            style={{ width: 130, height: 130, marginTop: 60 }}
            source={require("../../assets/lottie/loading.json")}
            autoPlay
            loop
            speed={1.5}
          />
        </View>
      ) : products && products.length > 0 ? (
        <FlatList
          scrollEventThrottle={8}
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="w-[47%] h-fit">
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
          estimatedItemSize={500}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
            {
              useNativeDriver: false,
            }
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 20,
            minimumViewTime: 250,
          }}
        />
      ) : (
        <View className="w-full h-full flex-row items-start justify-center bg-[#f9f9f9]">
          <Image
            source={images.nodata}
            className="w-full h-[400px]"
            contentFit="contain"
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default market;
