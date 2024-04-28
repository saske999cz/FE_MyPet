import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, {useState} from 'react'
import {icons} from '../constants'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

const SearchInput = ({title, value, placeholder, handleChangeText, otherStyles, ...props}) => {
  return (
      <View className={`h-10 px-4 bg-white border-2 border-gray-300 rounded-lg focus:border-[#3D1E14] items-center flex-row space-x-4 + ${otherStyles}`}>
        <TextInput value={value} onChangeText={handleChangeText} placeholder={placeholder} {...props} className="flex-1 text-black" placeholderTextColor="#64748b" secureTextEntry={title === "Password" && !showPassword}/>
        <TouchableOpacity className="w-12 h-10 rounded-lg flex-row items-center justify-center -mr-4">
        <FontAwesomeIcon icon={icons.faMagnifyingGlass} size={20} style={{color: "#64748b"}}/>
        </TouchableOpacity>
        
    </View>
  )
}

export default SearchInput