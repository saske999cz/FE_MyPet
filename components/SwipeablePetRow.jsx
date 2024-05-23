import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../constants";
import { router } from "expo-router";
import Swipeable from "react-native-gesture-handler/Swipeable";

export class SwipeablePetRow extends Component {
  handleMyPetPress = (pet) => {
    router.push({
      pathname: "../screens/MyPetDetail",
      params: {
        id: pet.id,
        name: pet.name,
        age: pet.age,
        gender: pet.gender,
      },
    });
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
            <Image source={item.image} className="w-full h-full rounded-full" />
          </View>
          <View className="w-[80%] h-fit flex-col items-start justify-start ml-2">
            <View className="w-full h-fit flex-row items-center justify-start">
              <Text className="text-[15px] font-semibold">{item.name}</Text>
            </View>
            <View className="w-full h-fit flex-row items-center justify-start">
              <Text className="text-[13px] mr-1">{item.gender}</Text>
              {item.gender === "Male" ? (
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
