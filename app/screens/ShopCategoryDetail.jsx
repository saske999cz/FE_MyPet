import {
  View,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useState, useRef, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { images } from "../../constants";
import { useLocalSearchParams } from "expo-router";
import { ItemDummy } from "../../dummy/FakeData";
import ItemCard from "../../components/ItemCard";

const ShopCategoryDetail = () => {
  const { id, category } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  const handleBack = () => {
    router.back();
  };

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
      <FlashList
        scrollEventThrottle={5}
        data={ItemDummy}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="w-[96%] h-fit ml-1">
            <ItemCard
              id={item.id}
              title={item.title}
              price={item.price}
              image={item.image}
              rating={item.rating}
              soldUnits={item.soldUnits}
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
      />
    </SafeAreaView>
  );
};

export default ShopCategoryDetail;
