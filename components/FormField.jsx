import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, {useState} from 'react'
import {icons} from '../constants'

const FormField = ({title, value, placeholder, handleChangeText, otherStyles, ...props}) => {
    const [showPassword, setShowPassword] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="font-semibold text-gray-50">{title}</Text>
      <View className="w-full h-16 px-4 bg-white border-2 border-gray-300 rounded-2xl focus:border-[#3D1E14] items-center flex-row">
        <TextInput value={value} onChangeText={handleChangeText} placeholder={placeholder} {...props} className="flex-1 text-black font-semibold" placeholderTextColor="#64748b" secureTextEntry={title === "Password" && !showPassword}/>
        {title === "Password" && (<TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="absolute right-4">
            <Image source={!showPassword ? icons.eye : icons.eyeOff} className="w-6 h-6" resizeMode='contain'/>
        </TouchableOpacity>)}
    </View>
    </View>
  )
}

export default FormField