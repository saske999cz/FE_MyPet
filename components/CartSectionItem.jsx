import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect, memo } from "react";
import { Image } from "expo-image";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash } from "../constants";
import { FIREBASE_STORAGE } from "../firebaseConfig";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import { increase_item_quantity, decrease_item_quantity } from "../api/CartApi";
import { PetLoader } from "./CustomLoader";
import { router } from "expo-router";
import { useGlobalContext } from "../state/GlobalContextProvider";

const CartSectionItem = ({
  item,
  shopAvatar,
  shopAddress,
  shopImage,
  shopName,
  cartId,
  setCurrentItemId,
  setRemovedItemName,
  setShowModal,
  setIsCalculating,
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setQuantityChanged } = useGlobalContext();
  const [quantity, setQuantity] = useState(item.quantity);

  const handlePress = () => {
    router.push({
      pathname: "../screens/ProductDetail",
      params: {
        id: item.product_id,
        shopImage: shopImage,
        shopAvatar: shopAvatar,
        shopAddress: shopAddress,
        shopName: shopName,
        rating: item.rating,
      },
    });
  };

  const handleIncrease = async () => {
    setQuantity((prev) => prev + 1);
    setIsCalculating(true);
    increase_item_quantity(cartId, item.product_id)
      .then((res) => {
        if (res && res.status === 200) {
          setQuantityChanged((prev) => !prev);
        } else if (res && res.message === "Insufficient product quantity") {
          setQuantity((prev) => prev - 1);
          alert("Can't add more than available quantity");
        } else {
          console.error("Error increasing item quantity:", res.message);
        }
      })
      .catch((error) => {
        console.error("Error increasing item quantity:", error);
      });
  };

  const handleDecrease = () => {
    if (item.quantity === 1) {
      setCurrentItemId(item.id);
      setRemovedItemName(item.name);
      setShowModal(true);
    } else {
      setQuantity((prev) => prev - 1);
      setIsCalculating(true);
      decrease_item_quantity(cartId, item.product_id).then((res) => {
        if (res && res.status === 200) {
          setQuantityChanged((prev) => !prev);
        } else {
          console.error("Error decreasing item quantity:", res.data.message);
        }
      });
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imageFolderRef = ref(FIREBASE_STORAGE, item.product_image);
        const res = await listAll(imageFolderRef);
        if (res.items.length > 0) {
          const url = await getDownloadURL(res.items[0]);
          setImageUrl(url);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
        setIsLoading(false);
      }
    };
    fetchImage();
  }, []);

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  return isLoading ? (
    <PetLoader />
  ) : (
    <TouchableOpacity
      className="w-full h-[90px] flex-row items-center justify-start mb-3"
      onPress={handlePress}
      onLongPress={() => setShowOptions(true)}
      key={item.id}
    >
      <View className="w-[25%] h-full border-[0.5px] border-solid border-gray-300 rounded-md ml-1">
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-full rounded-md"
          placeholder={{ blurhash }}
          transition={0}
        />
      </View>
      <View className="w-[75%] h-full flex-row px-4 py-1">
        <View
          className={` w-[80%] h-full flex-col items-start justify-between`}
        >
          <Text className="text-[13px]" numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
          <View className="w-full flex-col items-start justify-center">
            <View className="flex-row items-center justify-start mb-2">
              <FontAwesomeIcon
                icon={icons.faDongSign}
                size={13}
                style={{ color: "#f59e0b" }}
              />
              <Text className="text-[15px] text-[#fb923c] font-bold">
                {parseInt(item.price).toLocaleString("vi-VN")}
              </Text>
            </View>
            <View className="w-20 h-5 flex-row items-center justify-around border-[0.5px] border-solid border-gray-300">
              <TouchableOpacity
                className="w-5 h-full flex-row items-center bg-white justify-center border-r-[0.5px] border-solid border-gray-300"
                onPress={handleDecrease}
              >
                <FontAwesomeIcon
                  icon={icons.faMinus}
                  size={12}
                  style={{ color: "#6b7280" }}
                />
              </TouchableOpacity>
              <View className="flex-1 bg-white items-center justify-center">
                <Text>{quantity}</Text>
              </View>
              <TouchableOpacity
                className="w-5 h-full flex-row items-center justify-center bg-white border-l-[0.5px] border-solid border-gray-300"
                onPress={handleIncrease}
              >
                <FontAwesomeIcon
                  icon={icons.faPlus}
                  size={12}
                  style={{ color: "#6b7280" }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="w-20 h-full flex-row items-center justify-center">
          <TouchableOpacity
            className="w-full h-20 flex-row items-center justify-center"
            onPress={() => {
              setCurrentItemId(item.id);
              setRemovedItemName(item.name);
              setShowModal(true);
            }}
          >
            <FontAwesomeIcon
              icon={icons.faTrashCan}
              size={18}
              style={{ color: "#ef4444" }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(CartSectionItem);
