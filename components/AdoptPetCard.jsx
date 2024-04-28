import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { icons } from '../constants'

const AdoptPetCard = (pet) => {
  return (
    <TouchableOpacity className="w-[45%] flex-col items-center justify-start mb-3 mt-3 bg-white rounded-lg">
  <View style={{ width: '100%', aspectRatio: 1 }}>
    <Image source={pet.image} className="w-full h-full rounded-t-lg" resizeMode='cover'/>
  </View>
  <View className="w-full flex-col items-start justify-center mt-2 px-2">
    <Text className="text-[15px] font-semibold mb-2">{pet.name}</Text>
    <View className="flex-row w-full items-center justify-start mb-2">
      <Text className="text-[12px] mr-1">{pet.gender}</Text>
      {pet.gender === "Male" ? <FontAwesomeIcon icon={icons.faMars} size={13} style={{color: "#3b82f6"}}/> : <FontAwesomeIcon icon={icons.faVenus} size={13} style={{color: "#f43f5e"}}/>}
    </View>
    <Text className="text-[12px] mb-2">{pet.age}</Text>
  </View>
</TouchableOpacity>
  )
}

export default AdoptPetCard