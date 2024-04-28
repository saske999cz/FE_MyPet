import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { icons } from '../constants'

const ItemCard = (item) => {
  return (
    <TouchableOpacity className="w-[45%] h-56 rounded-lg flex-col items-center justify-start mb-3 mt-3 bg-white">
      <Image source={item.image} className="w-full h-32 rounded-t-lg"/>
      <View className="w-full flex-col items-start justify-center mt-2 px-2">
        <Text className="text-[13px] mb-6">{item.title}</Text>
        <View className="flex-row w-full items-center justify-start mb-1">
        <FontAwesomeIcon icon={icons.faHeart} size={12} style={{color: "#f43f5e"}}/>
        <Text className="text-[12px] ml-1">{parseFloat(item.rating).toFixed(1)}</Text>
        </View>
        <Text className="text-[15px] text-[#fb923c] font-semibold">{parseInt(item.price).toLocaleString('en-US')}đ</Text>
        
      </View>
    </TouchableOpacity>
  )
}

export default ItemCard