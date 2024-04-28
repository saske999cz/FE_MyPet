import { View, Text, Image, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { icons } from '../constants'

const MinimalPost = ({id, avatar, username, title, description, uploadedImage, likes, dislikes, comments}) => {
  return (
    <TouchableOpacity>
    <View className="flex-col items-center w-full border-t-4 border-gray-300 pb-4 px-3">
    <View className="flex-row justify-start items-center w-full h-10 mt-2">
        <Image source={avatar} className="w-9 h-9 rounded-full"/>
        <Text className="ml-4 text-[16px] font-semibold">{username}</Text>
      </View>
      <View className="w-full h-10 flex-row justify-start flex-row items-center">
        <View className="bg-[#fed7aa] rounded-xl w-16 h-5 items-center justify-center">
        <Text className="text-[15px] font-semibold text-orange-400">#Title:</Text>
        </View>
        <Text className="ml-4 text-[15px] font-semibold text-gray-600">{title}</Text>
      </View>
      <View className="w-full h-28 ">
        <Text className="text-[15px]">{description}</Text>
      </View>
      <View className="w-full h-32 mt-2">
        <Image source={uploadedImage} className="w-full h-[100%]" resizeMode='contain'/>
      </View>
      <View className="w-full h-12 flex-row justify-center items-center mt-8 px-4 border-t-[1px] border-solid border-gray-300 pt-4">
      <View className="flex-row justify-center items-center w-[30%]">
      <Text className="text-[15px] font-semibold text-gray-600 border-solid">{likes}</Text>
      <TouchableOpacity className="min-w-fit h-10 flex-row items-center justify-center ml-2 -mt-[2px]">
            <FontAwesomeIcon icon={icons.faThumbsUp} size={15} style={{color: "#9ca3af"}}/>
            <Text className="text-[14px] font-semibold text-gray-600 ml-[2px]">Like</Text>
        </TouchableOpacity>
      </View>
        
      <View className="flex-row justify-center items-center w-[30%] ml-3">
      <Text className="text-[15px] font-semibold text-gray-600">{dislikes}</Text>
      <TouchableOpacity className="min-w-fit h-10 flex-row items-center justify-center ml-2">
            <FontAwesomeIcon icon={icons.faThumbsDown} size={16} style={{color: "#9ca3af"}}/>
            <Text className="text-[14px] font-semibold text-gray-600 ml-[2px]">Dislike</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-center items-center w-[40%] ml-3">
      <Text className="text-[15px] font-semibold text-gray-600">{comments}</Text>
      <TouchableOpacity className="min-w-fit h-10 flex-row items-center justify-center ml-2">
            <FontAwesomeIcon icon={icons.faComment} size={15} style={{color: "#9ca3af"}}/>
            <Text className="text-[14px] font-semibold text-gray-600 ml-[2px]">Comments</Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
    </TouchableOpacity>
  )
}

export default MinimalPost