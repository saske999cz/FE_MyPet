import { View, Text, TouchableOpacity } from "react-native";
import React, { Component, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash } from "../constants";
import { router } from "expo-router";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Image } from "expo-image";
import { FIREBASE_STORAGE } from "../firebaseConfig";
import { getDownloadURL, ref } from "firebase/storage";
import { PetLoader } from "./CustomLoader";

export class SwipeablePetRow extends Component {
  state = {
    imageUrl: null,
    isImageLoading: true, // Add a new state variable to track whether the image URL is loading
  };

  handleMyPetPress = (pet) => {
    router.push({
      pathname: "../screens/MyPetDetail",
      params: {
        id: pet.pet_id,
        name: pet.pet_name,
        age: pet.age,
        gender: pet.gender,
        image: this.state.imageUrl,
        breed: pet.breed.name,
      },
    });
  };

  componentDidMount() {
    this.fetchImageUri();
  }

  fetchImageUri = async () => {
    const { item } = this.props;
    try {
      const imageRef = ref(FIREBASE_STORAGE, item.image);
      const imageUrl = await getDownloadURL(imageRef);
      this.setState({ imageUrl, isImageLoading: false });
    } catch (error) {
      console.error("Error fetching pet image:", error);
      this.setState({ isImageLoading: false }); // Set isImageLoading to false even if an error occurs;
    }
  };

  renderRightActions = () => {
    const { onDelete } = this.props;
    return (
      <TouchableOpacity
        className="w-20 h-12 flex-row items-center justify-center bg-red-500 "
        onPress={onDelete}
      >
        <FontAwesomeIcon
          icon={icons.faTrashCan}
          size={18}
          style={{ color: "#ffffff" }}
        />
      </TouchableOpacity>
    );
  };
  render() {
    const { item } = this.props;
    const { imageUrl, isImageLoading } = this.state;
    if (isImageLoading) {
      return <PetLoader />;
    }

    return (
      <Swipeable
        renderRightActions={this.renderRightActions}
        overswipeRightThreshold={100}
      >
        <TouchableOpacity
          className="w-full h-12 flex-row items-center justify-start px-3 mt-3 mb-3"
          onPress={() => this.handleMyPetPress(item)}
        >
          <View className="w-12 h-12 rounded-full border-[0.5px] border-solid border-gray-400">
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-full rounded-full"
              transition={200}
              placeholder={{ blurhash }}
            />
          </View>
          <View className="w-[80%] h-fit flex-col items-start justify-start ml-2">
            <View className="w-full h-fit flex-row items-center justify-start">
              <Text className="text-[15px] font-semibold">{item.pet_name}</Text>
            </View>
            <View className="w-full h-fit flex-row items-center justify-start">
              <Text className="text-[13px] mr-1">{item.gender}</Text>
              {item.gender === "male" ? (
                <FontAwesomeIcon
                  icon={icons.faMars}
                  size={13}
                  style={{ color: "#3b82f6" }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={icons.faVenus}
                  size={13}
                  style={{ color: "#f43f5e" }}
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  }
}
