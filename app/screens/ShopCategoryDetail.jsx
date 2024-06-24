import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { useLocalSearchParams } from "expo-router";
import ItemCard from "../../components/ItemCard";
import { get_best_selling_products_by_shop_and_category_type } from "../../api/MarketApi";
import LottieView from "lottie-react-native";

const ShopCategoryDetail = () => {
  const { shopId, category } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [maxPage, setMaxPage] = useState(1);

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  const handleBack = () => {
    router.back();
  };

  const handleLoadMore = () => {
    if (page >= maxPage) return;
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        get_best_selling_products_by_shop_and_category_type(
          shopId,
          category,
          page,
          10
        ).then((res) => {
          if (res && res.status === 200) {
            const newProducts = [...products, ...res.data.data];
            const uniqueProducts = newProducts.reduce((unique, product) => {
              if (!unique.find((item) => item.id === product.id)) {
                unique.push(product);
              }
              return unique;
            }, []);
            setProducts(uniqueProducts);
            setMaxPage(res.data.total_pages);
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error("Error fetching similar products:", error);
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [page]);

  return (
    <SafeAreaView className="h-full w-full">
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
        <Text className="font-bold text-[16px]">{category}</Text>
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
          scrollEventThrottle={2}
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
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 80,
            minimumViewTime: 300,
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default ShopCategoryDetail;
